"""
Official NSE F&O Bhavcopy Auto-Updater & Daily Rollover Engine
Downloads official daily Derivatives Bhavcopy directly from NSE Archives:
https://nsearchives.nseindia.com/content/fo/BhavCopy_NSE_FO_0_0_0_<YYYYMMDD>_F_0000.csv.zip

Calculates:
1. Daily EOD Contract Rollover % for all F&O stocks & indices
2. Monthly Expiry Locking: Automatically appends new month records to cache/futures_rollover_official.json
"""

import os
import csv
import io
import json
import logging
import zipfile
import urllib.request
from datetime import datetime, date, timedelta, timezone
from pathlib import Path

logger = logging.getLogger("FOBhavcopyEngine")
logger.setLevel(logging.INFO)

ROOT = Path(__file__).resolve().parent
CACHE_DIR = ROOT / "cache"
FO_BHAV_DIR = CACHE_DIR / "fo_bhav"
FO_BHAV_DIR.mkdir(parents=True, exist_ok=True)

LATEST_ROLLOVER_FILE = CACHE_DIR / "latest_fo_bhav_rollover.json"
OFFICIAL_ROLLOVER_FILE = CACHE_DIR / "futures_rollover_official.json"

INDIA_TZ = timezone(timedelta(hours=5, minutes=30))


def now_ist() -> datetime:
    return datetime.now(INDIA_TZ)


def download_fo_bhavcopy_for_date(target_dt: date) -> Path | None:
    """
    Downloads official NSE F&O Bhavcopy for the specified date if not already cached.
    """
    dt_str = target_dt.strftime("%Y%m%d")
    out_csv = FO_BHAV_DIR / f"BhavCopy_NSE_FO_{dt_str}.csv"
    if out_csv.exists() and out_csv.stat().st_size > 100000:
        return out_csv

    url = f"https://nsearchives.nseindia.com/content/fo/BhavCopy_NSE_FO_0_0_0_{dt_str}_F_0000.csv.zip"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Referer": "https://www.nseindia.com/",
    }

    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as resp:
            if resp.status == 200:
                raw_bytes = resp.read()
                if len(raw_bytes) > 5000:
                    with zipfile.ZipFile(io.BytesIO(raw_bytes)) as z:
                        csv_names = [n for n in z.namelist() if n.endswith(".csv")]
                        if csv_names:
                            content = z.read(csv_names[0])
                            out_csv.write_bytes(content)
                            logger.info(f"Downloaded official NSE FO Bhavcopy for {dt_str} ({len(content)} bytes)")
                            return out_csv
    except urllib.error.HTTPError as e:
        if e.code != 404:
            logger.debug(f"HTTP {e.code} downloading FO bhavcopy for {dt_str}: {e.reason}")
    except Exception as e:
        logger.debug(f"Error downloading FO bhavcopy for {dt_str}: {e}")

    return None


def parse_fo_bhavcopy(csv_path: Path) -> tuple[dict[str, dict], bool, str]:
    """
    Parses F&O bhavcopy CSV and computes exact rollover % for every symbol.
    Returns: (symbol_map, is_expiry_day, expiry_month_label)
    """
    by_sym: dict[str, list[tuple[str, float]]] = {}
    with open(csv_path, mode="r", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        for row in reader:
            tp = row.get("FinInstrmTp", "")
            if tp in ("STF", "IDF"):
                sym = row.get("TckrSymb", "").strip().upper()
                xpry = row.get("XpryDt", "").strip()
                try:
                    oi = float(row.get("OpnIntrst", 0) or 0)
                    by_sym.setdefault(sym, []).append((xpry, oi))
                except Exception:
                    pass

    # Extract date from filename
    date_str = csv_path.stem.replace("BhavCopy_NSE_FO_", "")

    results: dict[str, dict] = {}
    is_expiry_day = False
    expiry_month_label = ""

    for sym, contracts in by_sym.items():
        sorted_c = sorted(contracts, key=lambda x: x[0])
        if len(sorted_c) >= 2:
            near_exp = sorted_c[0][0]
            # Check if today is the near expiry date
            if near_exp.replace("-", "") == date_str:
                is_expiry_day = True
                try:
                    exp_dt = datetime.strptime(near_exp, "%Y-%m-%d")
                    expiry_month_label = exp_dt.strftime("%b %Y").upper()
                except Exception:
                    pass

            total_oi = sum(c[1] for c in sorted_c)
            roll_oi = sum(c[1] for c in sorted_c[1:])
            pct = round((roll_oi / total_oi * 100.0), 4) if total_oi > 0 else 0.0

            results[sym] = {
                "symbol": sym,
                "rolloverPct": pct,
                "totalOi": total_oi,
                "rollOi": roll_oi,
                "nearOi": sorted_c[0][1],
                "contracts": [{"expiry": c[0], "oi": c[1]} for c in sorted_c],
                "date": date_str,
            }

    return results, is_expiry_day, expiry_month_label


def sync_latest_fo_bhavcopy(days_back: int = 7) -> dict:
    """
    Fetches the most recent official NSE F&O Bhavcopy and updates latest rollover cache.
    Also handles monthly expiry freezing automatically.
    """
    today = now_ist().date()
    # If before 16:30 IST today, today's Bhavcopy might not be out yet, start from yesterday
    start_dt = today if now_ist().hour >= 17 else today - timedelta(days=1)

    latest_csv = None
    bhav_date = None

    for i in range(days_back):
        chk_dt = start_dt - timedelta(days=i)
        # Skip weekends
        if chk_dt.weekday() >= 5:
            continue
        csv_file = download_fo_bhavcopy_for_date(chk_dt)
        if csv_file:
            latest_csv = csv_file
            bhav_date = chk_dt
            break

    if not latest_csv:
        logger.warning("Could not download any recent official NSE FO Bhavcopy.")
        if LATEST_ROLLOVER_FILE.exists():
            try:
                with open(LATEST_ROLLOVER_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return {"ok": False, "message": "No Bhavcopy available"}

    results, is_expiry, exp_month = parse_fo_bhavcopy(latest_csv)
    dt_display = bhav_date.strftime("%d-%b-%Y") if bhav_date else ""

    payload = {
        "ok": True,
        "date": bhav_date.strftime("%Y-%m-%d") if bhav_date else "",
        "dateDisplay": dt_display,
        "totalSymbols": len(results),
        "source": f"NSE Official Bhavcopy ({latest_csv.name})",
        "isExpiryDay": is_expiry,
        "expiryMonth": exp_month,
        "updatedAt": now_ist().strftime("%Y-%m-%d %H:%M:%S IST"),
        "records": results,
    }

    try:
        with open(LATEST_ROLLOVER_FILE, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2)
    except Exception as e:
        logger.error(f"Error saving latest rollover cache: {e}")

    # If this Bhavcopy was on monthly expiry day, append new month to official historical archive
    if is_expiry and exp_month:
        _auto_freeze_monthly_expiry(results, exp_month)

    logger.info(f"Official NSE FO Bhavcopy synced successfully for {dt_display}: {len(results)} symbols.")
    return payload


def _auto_freeze_monthly_expiry(results: dict[str, dict], month_label: str) -> None:
    """
    Appends newly completed monthly expiry rollover to cache/futures_rollover_official.json
    """
    if not OFFICIAL_ROLLOVER_FILE.exists():
        return

    try:
        with open(OFFICIAL_ROLLOVER_FILE, "r", encoding="utf-8") as f:
            db = json.load(f)

        months = db.get("months", [])
        if month_label in months:
            logger.info(f"Month {month_label} already frozen in official archive.")
            return

        # Prepend new month as latest
        months.insert(0, month_label)
        db["months"] = months

        records = db.get("records", {})
        for sym, r in results.items():
            if sym not in records:
                records[sym] = {}
            records[sym][month_label] = r["rolloverPct"]

        # Ensure any missing stocks have '-'
        for sym in records.keys():
            if month_label not in records[sym]:
                records[sym][month_label] = "-"

        db["records"] = records
        with open(OFFICIAL_ROLLOVER_FILE, "w", encoding="utf-8") as f:
            json.dump(db, f, indent=2)

        logger.info(f"[SUCCESS] Auto-frozen monthly expiry rollover for {month_label} in official archive!")
    except Exception as e:
        logger.error(f"Error auto-freezing monthly rollover: {e}")


def get_latest_fo_bhav_rollover_map() -> dict[str, float]:
    """
    Returns symbol -> rolloverPct map from latest official Bhavcopy cache.
    """
    if LATEST_ROLLOVER_FILE.exists():
        try:
            with open(LATEST_ROLLOVER_FILE, "r", encoding="utf-8") as f:
                d = json.load(f)
                recs = d.get("records", {})
                return {sym: r.get("rolloverPct", 0.0) for sym, r in recs.items()}
        except Exception:
            pass
    return {}


def start_fo_bhavcopy_background_worker() -> None:
    """
    Starts daemon background worker to check and download official NSE FO Bhavcopy automatically every 30 minutes.
    """
    import threading
    import time

    def _worker():
        try:
            sync_latest_fo_bhavcopy(days_back=7)
        except Exception as e:
            logger.debug(f"Initial FO bhavcopy sync error: {e}")

        while True:
            try:
                time.sleep(1800)
                sync_latest_fo_bhavcopy(days_back=3)
            except Exception as e:
                logger.debug(f"FO bhavcopy periodic sync error: {e}")

    threading.Thread(target=_worker, daemon=True, name="FOBhavcopyWorker").start()
    logger.info("Official NSE FO Bhavcopy Background Auto-Update Worker started.")

