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

    # Do not block during morning/intraday trading hours before 17:30 IST (provisional EOD is only published post-market)
    if not force:
        if now.weekday() >= 5 or now.hour < 17 or (now.hour == 17 and now.minute < 30):
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


# ==============================================================================
# ⚡ Official FII Derivatives Statistics & Participant Volume Parsers
# ==============================================================================
DERIVATIVES_FLOW_CACHE_FILE = ROOT_DIR / "data" / "fii_dii_derivatives_flow.json"


def fetch_live_fii_derivatives_stats(dt: Optional[datetime] = None) -> Optional[Dict[str, Any]]:
    """
    Fetches official EOD FII Derivatives Statistics from NSE archives:
    https://archives.nseindia.com/content/fo/fii_stats_DD-Mon-YYYY.xls
    Returns parsed ₹ Crores turnover and contracts for Futures & Options.
    """
    try:
        import io
        import pandas as pd
        import urllib.request

        target_dt = dt or now_ist()
        date_str = target_dt.strftime("%d-%b-%Y")
        url = f"https://archives.nseindia.com/content/fo/fii_stats_{date_str}.xls"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "*/*",
            "Referer": "https://www.nseindia.com/"
        }
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=3.5) as resp:
            content = resp.read()

        df = pd.read_excel(io.BytesIO(content), header=None)

        import math

        def _clean_num(val: Any) -> float:
            try:
                if pd.isna(val):
                    return 0.0
                s = str(val).replace(",", "").strip()
                if not s or s.lower() in ("nan", "none", "null", "-", "--"):
                    return 0.0
                v = float(s)
                if math.isnan(v) or math.isinf(v):
                    return 0.0
                return round(v, 2)
            except Exception:
                return 0.0

        def _clean_int(val: Any) -> int:
            try:
                if pd.isna(val):
                    return 0
                s = str(val).replace(",", "").strip()
                if not s or s.lower() in ("nan", "none", "null", "-", "--"):
                    return 0
                v = float(s)
                if math.isnan(v) or math.isinf(v):
                    return 0
                return int(v)
            except Exception:
                return 0

        parsed: Dict[str, Any] = {
            "date": date_str,
            "raw": {},
            "indices": [],
        }

        index_names = {
            "NIFTY": "NIFTY 50",
            "BANKNIFTY": "BANK NIFTY",
            "MIDCPNIFTY": "MIDCAP NIFTY",
            "FINNIFTY": "FIN NIFTY",
            "NIFTYNXT50": "NIFTY NEXT 50",
        }

        rows_map = {}
        for _, r in df.iterrows():
            lbl = str(r[0]).strip()
            if not lbl or lbl == "nan":
                continue
            rows_map[lbl] = {
                "buyContracts": _clean_int(r[1]),
                "buyCr": _clean_num(r[2]),
                "sellContracts": _clean_int(r[3]),
                "sellCr": _clean_num(r[4]),
                "oiContracts": _clean_int(r[5]) if len(r) > 5 else 0,
                "oiCr": _clean_num(r[6]) if len(r) > 6 else 0.0,
            }
            rows_map[lbl]["netContracts"] = rows_map[lbl]["buyContracts"] - rows_map[lbl]["sellContracts"]
            rows_map[lbl]["netCr"] = round(rows_map[lbl]["buyCr"] - rows_map[lbl]["sellCr"], 2)

        parsed["raw"] = rows_map
        parsed["indexFutures"] = rows_map.get("INDEX FUTURES", {})
        parsed["stockFutures"] = rows_map.get("STOCK FUTURES", {})
        parsed["indexOptions"] = rows_map.get("INDEX OPTIONS", {})
        parsed["stockOptions"] = rows_map.get("STOCK OPTIONS", {})

        idx_f = parsed["indexFutures"]
        stk_f = parsed["stockFutures"]
        parsed["totalFutures"] = {
            "buyCr": round(idx_f.get("buyCr", 0) + stk_f.get("buyCr", 0), 2),
            "sellCr": round(idx_f.get("sellCr", 0) + stk_f.get("sellCr", 0), 2),
            "netCr": round(idx_f.get("netCr", 0) + stk_f.get("netCr", 0), 2),
            "buyContracts": idx_f.get("buyContracts", 0) + stk_f.get("buyContracts", 0),
            "sellContracts": idx_f.get("sellContracts", 0) + stk_f.get("sellContracts", 0),
            "netContracts": idx_f.get("netContracts", 0) + stk_f.get("netContracts", 0),
        }

        idx_o = parsed["indexOptions"]
        stk_o = parsed["stockOptions"]
        parsed["totalOptions"] = {
            "buyCr": round(idx_o.get("buyCr", 0) + stk_o.get("buyCr", 0), 2),
            "sellCr": round(idx_o.get("sellCr", 0) + stk_o.get("sellCr", 0), 2),
            "netCr": round(idx_o.get("netCr", 0) + stk_o.get("netCr", 0), 2),
            "buyContracts": idx_o.get("buyContracts", 0) + stk_o.get("buyContracts", 0),
            "sellContracts": idx_o.get("sellContracts", 0) + stk_o.get("sellContracts", 0),
            "netContracts": idx_o.get("netContracts", 0) + stk_o.get("netContracts", 0),
        }

        for k, displayName in index_names.items():
            fut_k = f"{k} FUTURES"
            opt_k = f"{k} OPTIONS"
            f_row = rows_map.get(fut_k, {})
            o_row = rows_map.get(opt_k, {})
            if f_row or o_row:
                f_net = f_row.get("netCr", 0.0)
                o_net = o_row.get("netCr", 0.0)
                tot_net = round(f_net + o_net, 2)
                parsed["indices"].append({
                    "symbol": k,
                    "name": displayName,
                    "futBuyCr": f_row.get("buyCr", 0.0),
                    "futSellCr": f_row.get("sellCr", 0.0),
                    "futNetCr": f_net,
                    "futBuyContracts": f_row.get("buyContracts", 0),
                    "futSellContracts": f_row.get("sellContracts", 0),
                    "futNetContracts": f_row.get("netContracts", 0),
                    "optBuyCr": o_row.get("buyCr", 0.0),
                    "optSellCr": o_row.get("sellCr", 0.0),
                    "optNetCr": o_net,
                    "optBuyContracts": o_row.get("buyContracts", 0),
                    "optSellContracts": o_row.get("sellContracts", 0),
                    "optNetContracts": o_row.get("netContracts", 0),
                    "totalNetCr": tot_net,
                })

        return parsed
    except Exception as exc:
        logger.error(f"Error fetching/parsing fii_stats: {exc}")
        return None


def fetch_live_participant_vol(dt: Optional[datetime] = None) -> Optional[List[Dict[str, Any]]]:
    """
    Fetches participant wise trading volume from NSE:
    https://archives.nseindia.com/content/nsccl/fao_participant_vol_DDMMYYYY.csv
    Returns list of records for FII, DII, Client, Pro.
    """
    try:
        import urllib.request

        target_dt = dt or now_ist()
        d_str = target_dt.strftime("%d%m%Y")
        url = f"https://archives.nseindia.com/content/nsccl/fao_participant_vol_{d_str}.csv"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "*/*",
            "Referer": "https://www.nseindia.com/"
        }
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=3.5) as resp:
            content = resp.read()

        lines = content.decode("utf-8", errors="ignore").strip().splitlines()
        data_lines = [l for l in lines if l.strip() and not l.startswith('""') and not l.startswith('"Participant')]
        if len(data_lines) < 2:
            return None

        headers = [h.strip() for h in data_lines[0].split(',')]
        rows = []

        def _to_int(v: Any) -> int:
            try:
                return int(float(str(v).replace(",", "").strip()))
            except Exception:
                return 0

        for l in data_lines[1:]:
            cols = [c.strip() for c in l.split(',')]
            if len(cols) < len(headers):
                continue
            r_dict = dict(zip(headers, cols))
            c_type = str(r_dict.get("Client Type", "")).strip()
            if not c_type:
                continue

            ce_buy = _to_int(r_dict.get("Option Index Call Long"))
            ce_sell = _to_int(r_dict.get("Option Index Call Short"))
            pe_buy = _to_int(r_dict.get("Option Index Put Long"))
            pe_sell = _to_int(r_dict.get("Option Index Put Short"))
            fut_idx_buy = _to_int(r_dict.get("Future Index Long"))
            fut_idx_sell = _to_int(r_dict.get("Future Index Short"))
            fut_stk_buy = _to_int(r_dict.get("Future Stock Long"))
            fut_stk_sell = _to_int(r_dict.get("Future Stock Short"))

            # Derive action summary
            ce_net = ce_buy - ce_sell
            pe_net = pe_buy - pe_sell
            action_tag = "NEUTRAL"
            if ce_net > 5000 and pe_net < -5000:
                action_tag = "BULLISH_BIAS"
            elif pe_net > 5000 and ce_net < -5000:
                action_tag = "BEARISH_HEDGE"
            elif ce_net > 5000 and pe_net > 5000:
                action_tag = "VOLATILITY_BUY"
            elif ce_net < -5000 and pe_net < -5000:
                action_tag = "PREMIUM_SELLER"

            rows.append({
                "type": c_type.upper(),
                "label": "CLIENT (Retail)" if c_type.upper() == "CLIENT" else ("PRO (Prop Desks)" if c_type.upper() == "PRO" else c_type.upper()),
                "callBuy": ce_buy,
                "callSell": ce_sell,
                "callNet": ce_net,
                "putBuy": pe_buy,
                "putSell": pe_sell,
                "putNet": pe_net,
                "futIdxBuy": fut_idx_buy,
                "futIdxSell": fut_idx_sell,
                "futIdxNet": fut_idx_buy - fut_idx_sell,
                "futStkBuy": fut_stk_buy,
                "futStkSell": fut_stk_sell,
                "futStkNet": fut_stk_buy - fut_stk_sell,
                "actionTag": action_tag,
            })

        return rows
    except Exception as exc:
        logger.error(f"Error fetching fao_participant_vol: {exc}")
        return None


def get_fii_derivatives_flow(target_date: Optional[datetime] = None) -> Dict[str, Any]:
    """
    Returns complete F&O flow data (FII statistics + Participant volumes).
    Uses local cache if fresh. Never blocks request if remote fetch times out.
    """
    now = target_date or now_ist()
    date_key = now.strftime("%Y-%m-%d")

    cache_dir = ROOT_DIR / "data" / "derivatives_flow"
    date_file = cache_dir / f"derivatives_flow_{date_key}.json"
    if date_file.exists():
        try:
            with open(date_file, "r", encoding="utf-8") as f:
                cached = json.load(f)
                if cached.get("ok"):
                    return cached
        except Exception:
            pass

    # Check legacy cache file
    if DERIVATIVES_FLOW_CACHE_FILE.exists():
        try:
            with open(DERIVATIVES_FLOW_CACHE_FILE, "r", encoding="utf-8") as f:
                cached = json.load(f)
                if cached.get("dateKey") == date_key and cached.get("ok"):
                    return cached
        except Exception:
            pass

    # Attempt fetch safely
    fii_stats = None
    part_vol = None
    try:
        fii_stats = fetch_live_fii_derivatives_stats(now)
    except Exception:
        pass
    try:
        part_vol = fetch_live_participant_vol(now)
    except Exception:
        pass

    if fii_stats or part_vol:
        result = {
            "ok": True,
            "date": now.strftime("%d %b %Y"),
            "dateKey": date_key,
            "fiiStats": fii_stats or {},
            "participantVol": part_vol or [],
            "indices": (fii_stats.get("indices", []) if fii_stats else []),
            "lastUpdated": now.strftime("%d-%b-%Y %H:%M IST"),
        }
        try:
            cache_dir.mkdir(parents=True, exist_ok=True)
            with open(date_file, "w", encoding="utf-8") as f:
                json.dump(result, f, indent=2)
            with open(DERIVATIVES_FLOW_CACHE_FILE, "w", encoding="utf-8") as f:
                json.dump(result, f, indent=2)
        except Exception:
            pass
        return result

    # Fallback to last known cache so request never fails or hangs
    if DERIVATIVES_FLOW_CACHE_FILE.exists():
        try:
            with open(DERIVATIVES_FLOW_CACHE_FILE, "r", encoding="utf-8") as f:
                cached = json.load(f)
                if cached.get("ok"):
                    # Cache under requested date so we don't retry remote fetch again
                    try:
                        cache_dir.mkdir(parents=True, exist_ok=True)
                        with open(date_file, "w", encoding="utf-8") as df_out:
                            json.dump(cached, df_out, indent=2)
                    except Exception:
                        pass
                    return cached
        except Exception:
            pass

    fallback_obj = {
        "ok": False,
        "date": now.strftime("%d %b %Y"),
        "dateKey": date_key,
        "fiiStats": {},
        "participantVol": [],
        "indices": [],
        "lastUpdated": now.strftime("%d-%b-%Y %H:%M IST"),
    }
    try:
        cache_dir.mkdir(parents=True, exist_ok=True)
        with open(date_file, "w", encoding="utf-8") as df_out:
            json.dump(fallback_obj, df_out, indent=2)
    except Exception:
        pass
    return fallback_obj


