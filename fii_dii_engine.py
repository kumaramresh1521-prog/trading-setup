from __future__ import annotations

import json
import logging
import threading
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Dict, Optional

logger = logging.getLogger("fii_dii_engine")

ROOT_DIR = Path(__file__).resolve().parent
HISTORY_FILE = ROOT_DIR / "data" / "fii_dii_cash_history.json"
IST = timezone(timedelta(hours=5, minutes=30))

_FII_DII_IN_MEMORY_CACHE: Dict[str, Any] = {
    "data": None,
    "timestamp": 0.0,
}
_LAST_AUTO_SYNC_DATE = ""


def now_ist() -> datetime:
    return datetime.now(IST)


def fetch_live_fii_dii_from_nse() -> Optional[Dict[str, Any]]:
    """
    Safely fetches today's provisional FII and DII cash market trading activity from NSE India API.
    Uses browser-emulated cookies and headers to prevent 403 blocks.
    """
    try:
        from nselib.libutil import nse_urlfetch

        url = "https://www.nseindia.com/api/fiidiiTradeReact"
        res = nse_urlfetch(url)
        if res.status_code != 200:
            logger.warning(f"NSE FII/DII API returned HTTP {res.status_code}")
            return None

        raw_list = res.json()
        if not isinstance(raw_list, list) or len(raw_list) == 0:
            return None

        fii_data = {}
        dii_data = {}
        common_date = ""

        for item in raw_list:
            cat = str(item.get("category", "")).upper()
            d_str = str(item.get("date", "")).strip()
            if d_str:
                common_date = d_str

            def _flt(v: Any) -> float:
                try:
                    return round(float(str(v).replace(",", "")), 2)
                except Exception:
                    return 0.0

            if "FII" in cat or "FPI" in cat:
                fii_data = {
                    "buy": _flt(item.get("buyValue")),
                    "sell": _flt(item.get("sellValue")),
                    "net": _flt(item.get("netValue")),
                }
            elif "DII" in cat:
                dii_data = {
                    "buy": _flt(item.get("buyValue")),
                    "sell": _flt(item.get("sellValue")),
                    "net": _flt(item.get("netValue")),
                }

        if not fii_data and not dii_data:
            return None

        fii_net = fii_data.get("net", 0.0)
        dii_net = dii_data.get("net", 0.0)
        total_net = round(fii_net + dii_net, 2)

        return {
            "date": common_date,
            "fiiBuy": fii_data.get("buy", 0.0),
            "fiiSell": fii_data.get("sell", 0.0),
            "fiiNet": fii_net,
            "diiBuy": dii_data.get("buy", 0.0),
            "diiSell": dii_data.get("sell", 0.0),
            "diiNet": dii_net,
            "totalNet": total_net,
        }
    except Exception as exc:
        logger.error(f"Error fetching FII/DII from NSE: {exc}")
        return None


def load_fii_dii_history() -> Dict[str, Any]:
    """Loads historical FII/DII cash records from JSON file."""
    if not HISTORY_FILE.exists():
        return {"yearly": [], "monthly": [], "daily": [], "lastUpdated": ""}
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"yearly": [], "monthly": [], "daily": [], "lastUpdated": ""}


def save_fii_dii_history(data: Dict[str, Any]) -> None:
    """Saves updated FII/DII cash records safely."""
    try:
        HISTORY_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception as exc:
        logger.error(f"Failed to save FII/DII history file: {exc}")


def sync_fii_dii_history(
    force: bool = False,
    nifty_close: Optional[float] = None,
    nifty_change: Optional[float] = None,
    nifty_pct: Optional[float] = None,
) -> Dict[str, Any]:
    """
    Checks if today's/latest FII/DII record is already in history.
    If missing or forced, fetches from NSE and merges smoothly into daily, monthly, and yearly structures.
    """
    global _FII_DII_IN_MEMORY_CACHE, _LAST_AUTO_SYNC_DATE

    now = now_ist()
    history = load_fii_dii_history()
    daily_list = history.get("daily", [])

    # Check if latest record matches today
    today_str = now.strftime("%d-%b-%Y")
    has_today = any(d.get("date") == today_str or d.get("period") == today_str for d in daily_list[:3])

    if has_today and not force:
        # Already up to date
        history["ok"] = True
        return history

    # Fetch live provisional EOD figures from NSE
    live_rec = fetch_live_fii_dii_from_nse()
    if not live_rec:
        history["ok"] = True
        return history

    rec_date = live_rec.get("date") or today_str

    # Nifty 50 Benchmark Close values
    if nifty_close is None or nifty_close <= 0:
        # Default to latest known close if not passed
        prev_entry = daily_list[0] if daily_list else {}
        nifty_close = prev_entry.get("niftyClose", 23414.3)
        nifty_change = prev_entry.get("niftyChange", 67.9)
        nifty_pct = prev_entry.get("niftyPct", 0.29)

    new_daily_entry = {
        "period": rec_date,
        "date": rec_date,
        "niftyClose": round(float(nifty_close), 2),
        "niftyChange": round(float(nifty_change or 0.0), 2),
        "niftyPct": round(float(nifty_pct or 0.0), 2),
        "totalNet": live_rec["totalNet"],
        "fiiNet": live_rec["fiiNet"],
        "diiNet": live_rec["diiNet"],
        "fiiBuy": live_rec["fiiBuy"],
        "fiiSell": live_rec["fiiSell"],
        "diiBuy": live_rec["diiBuy"],
        "diiSell": live_rec["diiSell"],
    }

    # Update or prepend into daily list
    existing_idx = next((i for i, d in enumerate(daily_list) if d.get("date") == rec_date or d.get("period") == rec_date), None)
    if existing_idx is not None:
        daily_list[existing_idx] = new_daily_entry
    else:
        daily_list.insert(0, new_daily_entry)

    # Recalculate monthly totals for this month
    try:
        dt = datetime.strptime(rec_date, "%d-%b-%Y")
        month_label = dt.strftime("%b %Y")
        month_days = [d for d in daily_list if dt.strftime("%b-%Y") in str(d.get("date", "")) or month_label in str(d.get("period", ""))]
        if month_days:
            m_fii_net = round(sum(float(d.get("fiiNet", 0.0)) for d in month_days), 2)
            m_dii_net = round(sum(float(d.get("diiNet", 0.0)) for d in month_days), 2)
            m_total_net = round(m_fii_net + m_dii_net, 2)
            monthly_list = history.get("monthly", [])
            m_idx = next((i for i, m in enumerate(monthly_list) if m.get("period") == month_label), None)
            m_entry = {
                "period": month_label,
                "fiiNet": m_fii_net,
                "diiNet": m_dii_net,
                "totalNet": m_total_net,
            }
            if m_idx is not None:
                monthly_list[m_idx] = m_entry
            else:
                monthly_list.insert(0, m_entry)
            history["monthly"] = monthly_list
    except Exception:
        pass

    history["daily"] = daily_list
    history["lastUpdated"] = now.strftime("%d-%b-%Y %H:%M IST")
    save_fii_dii_history(history)

    _LAST_AUTO_SYNC_DATE = rec_date
    _FII_DII_IN_MEMORY_CACHE["data"] = history
    _FII_DII_IN_MEMORY_CACHE["timestamp"] = time.time()

    history["ok"] = True
    return history


def get_fii_dii_data(force_refresh: bool = False, nifty_close: Optional[float] = None) -> Dict[str, Any]:
    """Returns cached FII/DII data or triggers refresh if requested."""
    global _FII_DII_IN_MEMORY_CACHE
    now_ts = time.time()
    if not force_refresh:
        cached = _FII_DII_IN_MEMORY_CACHE.get("data")
        if cached and (now_ts - _FII_DII_IN_MEMORY_CACHE.get("timestamp", 0.0)) < 60.0:
            return cached

    # Check if we should sync
    data = sync_fii_dii_history(force=force_refresh, nifty_close=nifty_close)
    _FII_DII_IN_MEMORY_CACHE["data"] = data
    _FII_DII_IN_MEMORY_CACHE["timestamp"] = now_ts
    return data


def _background_fii_dii_loop():
    """Lightweight background loop that auto-syncs FII/DII data around 18:00-19:30 IST on trading days."""
    time.sleep(10)  # Wait 10 seconds after server startup
    while True:
        try:
            now = now_ist()
            # On weekdays (Monday=0 to Friday=4), after 18:00 IST and before 23:00 IST
            if now.weekday() < 5 and (now.hour >= 18 or (now.hour == 17 and now.minute >= 45)):
                today_str = now.strftime("%d-%b-%Y")
                global _LAST_AUTO_SYNC_DATE
                if _LAST_AUTO_SYNC_DATE != today_str:
                    logger.info("Executing scheduled EOD FII/DII cash flow sync...")
                    res = sync_fii_dii_history(force=False)
                    if res and res.get("daily") and res["daily"][0].get("date") == today_str:
                        _LAST_AUTO_SYNC_DATE = today_str
                        logger.info(f"FII/DII EOD successfully synced for {today_str}")
        except Exception as exc:
            logger.error(f"FII/DII background loop error: {exc}")

        # Sleep for 15 minutes between checks
        time.sleep(900)


def start_fii_dii_background_worker():
    """Starts the background worker thread."""
    t = threading.Thread(target=_background_fii_dii_loop, daemon=True, name="FiiDiiSyncWorker")
    t.start()
