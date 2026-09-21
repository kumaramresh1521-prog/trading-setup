"""
straddle_engine.py - Institutional Intraday Straddle & Options Tools Engine
Fetches live & historical (back-dated) ATM/OTM Straddle, Synthetic Future, and VWAP series.
Provides seamless fallback simulation if external CDN is slow or offline.
"""

import json
import time
import urllib.request
from datetime import datetime, timezone, timedelta

INDIA_TZ = timezone(timedelta(hours=5, minutes=30))

# In-memory TTL caches
_CACHE = {}
_CATEGORIES_CACHE = {"data": None, "ts": 0}
_HISTORY_META_CACHE = {"data": None, "ts": 0}

DEFAULT_CATEGORIES = {
    "categories": [
        {
            "name": "Equity",
            "indices": [
                {"key": "NIFTY", "name": "NIFTY 50", "immediate_expiry": "2026-09-22", "dte": 3, "expiries": ["2026-09-22", "2026-09-29"]},
                {"key": "BANKNIFTY", "name": "BANK NIFTY", "immediate_expiry": "2026-09-29", "dte": 10, "expiries": ["2026-09-29", "2026-10-27"]},
                {"key": "FINNIFTY", "name": "FIN NIFTY", "immediate_expiry": "2026-09-29", "dte": 10, "expiries": ["2026-09-29"]},
                {"key": "MIDCPNIFTY", "name": "MIDCAP NIFTY", "immediate_expiry": "2026-09-29", "dte": 10, "expiries": ["2026-09-29"]},
                {"key": "SENSEX", "name": "BSE SENSEX", "immediate_expiry": "2026-09-24", "dte": 5, "expiries": ["2026-09-24", "2026-10-01"]},
                {"key": "BANKEX", "name": "BSE BANKEX", "immediate_expiry": "2026-09-24", "dte": 5, "expiries": ["2026-09-24"]},
            ],
        },
        {
            "name": "MCX",
            "indices": [
                {"key": "CRUDEOIL", "name": "CRUDE OIL", "immediate_expiry": "2026-10-15", "dte": 26, "expiries": ["2026-10-15"]},
                {"key": "NATURALGAS", "name": "NATURAL GAS", "immediate_expiry": "2026-09-23", "dte": 4, "expiries": ["2026-09-23"]},
                {"key": "GOLD", "name": "GOLD", "immediate_expiry": "2026-09-25", "dte": 6, "expiries": ["2026-09-25"]},
                {"key": "SILVER", "name": "SILVER", "immediate_expiry": "2026-09-24", "dte": 5, "expiries": ["2026-09-24"]},
            ],
        },
        {
            "name": "Crypto",
            "indices": [
                {"key": "BTCUSD", "name": "BTC / USD", "immediate_expiry": "2026-09-20", "dte": 1, "expiries": ["2026-09-20", "2026-09-21"]},
                {"key": "ETHUSD", "name": "ETH / USD", "immediate_expiry": "2026-09-20", "dte": 1, "expiries": ["2026-09-20", "2026-09-21"]},
            ],
        },
    ]
}


import threading

def _bg_update_categories():
    try:
        url = "https://straddle-chart.financedeft.com/categories.json"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        with urllib.request.urlopen(req, timeout=2) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if data and "categories" in data:
                _CATEGORIES_CACHE["data"] = data
                _CATEGORIES_CACHE["ts"] = time.time()
    except Exception:
        pass

def get_categories():
    """Fetch or return cached straddle categories instantly without blocking."""
    now = time.time()
    if _CATEGORIES_CACHE["data"]:
        if now - _CATEGORIES_CACHE["ts"] > 1800:
            _CATEGORIES_CACHE["ts"] = now
            threading.Thread(target=_bg_update_categories, daemon=True).start()
        return _CATEGORIES_CACHE["data"]

    _CATEGORIES_CACHE["data"] = DEFAULT_CATEGORIES
    _CATEGORIES_CACHE["ts"] = now
    threading.Thread(target=_bg_update_categories, daemon=True).start()
    return DEFAULT_CATEGORIES


def _bg_update_history_meta():
    try:
        url = "https://straddle-chart.financedeft.com/history/history_meta.json"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        with urllib.request.urlopen(req, timeout=2) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if data and data.get("success"):
                _HISTORY_META_CACHE["data"] = data.get("data") or {}
                _HISTORY_META_CACHE["ts"] = time.time()
    except Exception:
        pass

def get_history_meta():
    """Fetch or return cached historical dates and expiries instantly."""
    now = time.time()
    if _HISTORY_META_CACHE["data"]:
        if now - _HISTORY_META_CACHE["ts"] > 3600:
            _HISTORY_META_CACHE["ts"] = now
            threading.Thread(target=_bg_update_history_meta, daemon=True).start()
        return _HISTORY_META_CACHE["data"]

    # Pre-seed initial meta so it returns in 0ms
    _HISTORY_META_CACHE["data"] = {
        "equity": [
            {
                "key": "NIFTY",
                "name": "NIFTY 50",
                "dates": [
                    {"value": "2026-09-21", "label": "21 Sep 2026", "expiries": [{"value": "2026-09-22", "label": "22-Sep-2026"}]},
                    {"value": "2026-09-18", "label": "18 Sep 2026", "expiries": [{"value": "2026-09-22", "label": "22-Sep-2026"}]},
                    {"value": "2026-09-17", "label": "17 Sep 2026", "expiries": [{"value": "2026-09-22", "label": "22-Sep-2026"}]},
                    {"value": "2026-09-16", "label": "16 Sep 2026", "expiries": [{"value": "2026-09-22", "label": "22-Sep-2026"}]},
                    {"value": "2026-09-15", "label": "15 Sep 2026", "expiries": [{"value": "2026-09-22", "label": "22-Sep-2026"}]},
                ]
            }
        ]
    }
    _HISTORY_META_CACHE["ts"] = now
    threading.Thread(target=_bg_update_history_meta, daemon=True).start()
    return _HISTORY_META_CACHE["data"]


def fetch_remote_straddle_data(symbol: str, expiry: str = None, date: str = None, category: str = "Equity") -> tuple[list, str, str]:
    """
    Fetch 1-minute straddle datapoints from live CDN or historical archive.
    Returns (price_list, resolved_date, resolved_expiry).
    """
    sym = (symbol or "NIFTY").upper().strip()
    cat = (category or "Equity").lower().strip()
    now = time.time()

    # Historical Session Fetch
    if date and date.strip():
        req_date = date.strip()
        hist_meta = get_history_meta()
        cat_items = hist_meta.get(cat, [])
        sym_item = next((item for item in cat_items if item.get("key") == sym), None)

        resolved_exp = expiry
        if sym_item:
            dates = sym_item.get("dates", [])
            matched_d = next((d for d in dates if d.get("value") == req_date), None)
            if not matched_d and dates:
                # Find closest earlier date or take last available
                matched_d = next((d for d in reversed(dates) if d.get("value") <= req_date), dates[-1])
                req_date = matched_d.get("value")
            if matched_d:
                expiries = [e.get("value") for e in matched_d.get("expiries", [])]
                if not resolved_exp or resolved_exp not in expiries:
                    resolved_exp = expiries[0] if expiries else None

        cache_key = f"hist_{cat}_{sym}_{req_date}_{resolved_exp}"
        if cache_key in _CACHE:
            return _CACHE[cache_key]["data"], req_date, resolved_exp

        if resolved_exp:
            hist_url = f"https://straddle-chart.financedeft.com/history/{cat}/{sym}/{req_date}/{resolved_exp}.json"
            try:
                req = urllib.request.Request(hist_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
                with urllib.request.urlopen(req, timeout=1.5) as resp:
                    data = json.loads(resp.read().decode("utf-8"))
                    price_list = data.get("price_list") or []
                    if price_list:
                        _CACHE[cache_key] = {"data": price_list, "ts": now}
                        return price_list, req_date, resolved_exp
            except Exception:
                pass

    # Live / Latest Session Fetch
    cache_key = f"live_{sym}_{expiry}" if expiry else f"live_{sym}"
    if cache_key in _CACHE:
        cached = _CACHE[cache_key]
        if now - cached["ts"] < 30.0:
            latest_d = cached["data"][-1].get("date", "") if cached["data"] else ""
            latest_e = cached["data"][-1].get("expiry", "") if cached["data"] else expiry
            return cached["data"], latest_d, latest_e

    urls_to_try = []
    if expiry:
        urls_to_try.append(f"https://straddle-chart.financedeft.com/{sym}_{expiry}.json")
    urls_to_try.append(f"https://straddle-chart.financedeft.com/{sym}.json")

    for url in urls_to_try:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            with urllib.request.urlopen(req, timeout=1.5) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                price_list = data.get("price_list") or []
                if price_list and len(price_list) > 0:
                    _CACHE[cache_key] = {"data": price_list, "ts": now}
                    res_d = price_list[-1].get("date", "")
                    res_e = price_list[-1].get("expiry", "")
                    return price_list, res_d, res_e
        except Exception:
            continue

    if cache_key in _CACHE:
        cached_pts = _CACHE[cache_key]["data"]
        res_d = cached_pts[-1].get("date", "") if cached_pts else ""
        res_e = cached_pts[-1].get("expiry", "") if cached_pts else expiry
        return cached_pts, res_d, res_e

    return [], date or "", expiry or ""


def generate_fallback_straddle_data(symbol: str, target_date: str = None) -> list:
    """Generate high-fidelity intraday straddle curve if remote is unreachable."""
    sym = (symbol or "NIFTY").upper()
    spot_base = 23350.0 if sym == "NIFTY" else 50800.0 if sym == "BANKNIFTY" else 76500.0 if sym == "SENSEX" else 23350.0
    strike = round(spot_base / 50.0) * 50 if sym == "NIFTY" else round(spot_base / 100.0) * 100
    base_straddle = round(spot_base * 0.009, 1)

    t_date_str = target_date or datetime.now(INDIA_TZ).strftime("%Y-%m-%d")
    points = []
    cum_vol = 50000
    decay_curve = [
        (1.00, 0.0), (0.98, 5.0), (0.96, -8.0), (0.95, -3.0), (0.93, 12.0),
        (0.91, 18.0), (0.89, 7.0), (0.88, -2.0), (0.86, 14.0), (0.85, 20.0),
        (0.83, 15.0), (0.81, 10.0), (0.80, 5.0), (0.78, -5.0), (0.76, 2.0),
        (0.74, 8.0), (0.72, 12.0), (0.70, 6.0), (0.68, 0.0), (0.66, -4.0)
    ]

    base_time = datetime.now(timezone.utc).replace(hour=3, minute=45, second=0, microsecond=0)
    for i, (factor, spot_delta) in enumerate(decay_curve * 19):  # ~380 points
        t = base_time + timedelta(minutes=i)
        curr_spot = round(spot_base + spot_delta + (i * 0.08), 2)
        curr_price = round(base_straddle * factor + ((i % 5) * 0.4), 2)
        half_price = round(curr_price / 2.0, 2)
        ce_price = round(half_price + (curr_spot - strike) * 0.3, 2)
        pe_price = round(curr_price - ce_price, 2)
        cum_vol += 2500 + (i * 120)

        points.append({
            "key": sym,
            "spot": curr_spot,
            "price": curr_price,
            "ce_price": ce_price,
            "pe_price": pe_price,
            "straddle_strike": strike,
            "volume": cum_vol,
            "time": t.isoformat(),
            "expiry": "2026-09-22",
            "date": t_date_str,
        })

    return points


def compute_straddle_analytics(symbol: str, expiry: str = None, date: str = None, category: str = "Equity"):
    """
    Computes complete straddle metrics, series, VWAP, Synthetic Future, and breakevens for live or back date.
    """
    raw_points, resolved_date, resolved_expiry = fetch_remote_straddle_data(symbol, expiry, date, category)
    if not raw_points:
        raw_points = generate_fallback_straddle_data(symbol, date)
        resolved_date = date or datetime.now(INDIA_TZ).strftime("%Y-%m-%d")
        resolved_expiry = expiry or "2026-09-22"

    if not raw_points:
        return {"ok": False, "message": "No straddle data available"}

    processed_points = []
    cum_vol = 0.0
    cum_pv = 0.0

    all_prices = []
    all_spots = []

    for pt in raw_points:
        p = float(pt.get("price") or 0.0)
        s = float(pt.get("spot") or 0.0)
        ce = float(pt.get("ce_price") or 0.0)
        pe = float(pt.get("pe_price") or 0.0)
        k = float(pt.get("straddle_strike") or s)
        vol = float(pt.get("volume") or 0.0)

        # Synthetic future = Strike + CE - PE
        synth_fut = round(k + ce - pe, 2)

        # Volume Weighted Average Price (VWAP)
        step_vol = max(100.0, vol)
        cum_vol += step_vol
        cum_pv += (p * step_vol)
        vwap = round(cum_pv / cum_vol, 2) if cum_vol > 0 else p

        all_prices.append(p)
        all_spots.append(s)

        processed_points.append({
            "time": pt.get("time"),
            "spot": s,
            "price": p,
            "ce_price": ce,
            "pe_price": pe,
            "straddle_strike": int(k),
            "synthetic_future": synth_fut,
            "vwap": vwap,
            "volume": int(vol),
        })

    first_pt = processed_points[0]
    latest_pt = processed_points[-1]

    open_price = first_pt["price"]
    current_price = latest_pt["price"]
    decay_pts = round(open_price - current_price, 2)
    decay_pct = round((decay_pts / open_price * 100.0) if open_price > 0 else 0.0, 2)

    high_straddle = max(all_prices) if all_prices else current_price
    low_straddle = min(all_prices) if all_prices else current_price

    spot_val = latest_pt["spot"]
    upper_breakeven = round(spot_val + current_price, 2)
    lower_breakeven = round(spot_val - current_price, 2)

    # Days to expiry calculation
    exp_str = resolved_expiry or raw_points[-1].get("expiry", "")
    session_date_str = resolved_date or raw_points[-1].get("date", "")
    dte = 3
    if exp_str:
        try:
            exp_date = datetime.strptime(exp_str, "%Y-%m-%d").date()
            ref_date = datetime.strptime(session_date_str, "%Y-%m-%d").date() if session_date_str else datetime.now(INDIA_TZ).date()
            diff = (exp_date - ref_date).days
            dte = max(0, diff)
        except Exception:
            pass

    return {
        "ok": True,
        "symbol": symbol.upper(),
        "category": category,
        "date": session_date_str,
        "expiry": exp_str,
        "is_historical": bool(date and date.strip()),
        "dte": dte,
        "latest": {
            "straddle_price": current_price,
            "spot": spot_val,
            "synthetic_future": latest_pt["synthetic_future"],
            "vwap": latest_pt["vwap"],
            "straddle_strike": latest_pt["straddle_strike"],
            "ce_price": latest_pt["ce_price"],
            "pe_price": latest_pt["pe_price"],
            "open_straddle": open_price,
            "high_straddle": high_straddle,
            "low_straddle": low_straddle,
            "decay_pts": decay_pts,
            "decay_pct": decay_pct,
            "upper_breakeven": upper_breakeven,
            "lower_breakeven": lower_breakeven,
            "time": latest_pt["time"],
        },
        "points_count": len(processed_points),
        "points": processed_points,
    }
