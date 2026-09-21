"""
Breadth Contribution Engine
Computes real-time and intraday Index Breadth Dynamics and Stock-by-Stock Point Contribution.
Formula:
  Point Contribution = Index Spot * (Stock Weight% / 100) * (Stock % Change / 100)
All contributions are recomputed dynamically using current spot price.
"""
from __future__ import annotations
import math
import datetime
from typing import Dict, Any, List, Optional


# ---------------------------------------------------------------------------
# NIFTY 50 Constituents — Correct symbols + realistic weights (as of Sep 2026)
# LTP and changePct are REFERENCE only; actual contribution is recalculated
# dynamically using live spot + weight + changePct at runtime.
# ---------------------------------------------------------------------------
NIFTY50_CONSTITUENTS = [
    # symbol, name, sector, approx_ltp, approx_changePct, weight
    {"symbol": "HDFCBANK",   "name": "HDFC Bank Ltd.",              "sector": "Banking",             "ltp": 1716.50, "changePct":  1.82, "weight": 12.40},
    {"symbol": "RELIANCE",   "name": "Reliance Industries Ltd.",    "sector": "Energy & Retail",     "ltp": 2965.20, "changePct":  0.48, "weight":  9.10},
    {"symbol": "ICICIBANK",  "name": "ICICI Bank Ltd.",             "sector": "Banking",             "ltp": 1349.60, "changePct": -0.46, "weight":  7.80},
    {"symbol": "INFY",       "name": "Infosys Ltd.",                "sector": "IT",                  "ltp": 1748.40, "changePct": -1.78, "weight":  5.50},
    {"symbol": "ITC",        "name": "ITC Ltd.",                    "sector": "FMCG",                "ltp":  488.20, "changePct": -0.65, "weight":  4.00},
    {"symbol": "TCS",        "name": "Tata Consultancy Services",   "sector": "IT",                  "ltp": 3842.30, "changePct": -3.89, "weight":  3.90},
    {"symbol": "LT",         "name": "Larsen & Toubro Ltd.",        "sector": "Capital Goods",       "ltp": 3896.50, "changePct":  1.57, "weight":  3.80},
    {"symbol": "BHARTIARTL", "name": "Bharti Airtel Ltd.",          "sector": "Telecom",             "ltp": 1620.00, "changePct":  0.78, "weight":  3.80},
    {"symbol": "KOTAKBANK",  "name": "Kotak Mahindra Bank Ltd.",    "sector": "Banking",             "ltp": 1748.60, "changePct": -0.68, "weight":  2.90},
    {"symbol": "SBIN",       "name": "State Bank of India",         "sector": "Banking",             "ltp":  824.70, "changePct":  0.95, "weight":  2.90},
    {"symbol": "BAJFINANCE", "name": "Bajaj Finance Ltd.",          "sector": "Financials",          "ltp": 7238.40, "changePct":  1.96, "weight":  2.40},
    {"symbol": "HINDUNILVR", "name": "Hindustan Unilever Ltd.",     "sector": "FMCG",                "ltp": 2620.00, "changePct": -0.68, "weight":  2.20},
    {"symbol": "M&M",        "name": "Mahindra & Mahindra Ltd.",    "sector": "Automobile",          "ltp": 3015.80, "changePct":  1.12, "weight":  2.20},
    {"symbol": "TATAMOTORS", "name": "Tata Motors Ltd.",            "sector": "Automobile",          "ltp":  954.20, "changePct": -3.40, "weight":  1.80},
    {"symbol": "MARUTI",     "name": "Maruti Suzuki India Ltd.",    "sector": "Automobile",          "ltp": 12171.00,"changePct": -1.35, "weight":  1.80},
    {"symbol": "SUNPHARMA",  "name": "Sun Pharma Industries",       "sector": "Pharma",              "ltp": 1820.00, "changePct": -0.60, "weight":  1.70},
    {"symbol": "AXISBANK",   "name": "Axis Bank Ltd.",              "sector": "Banking",             "ltp": 1185.40, "changePct":  0.72, "weight":  1.60},
    {"symbol": "ULTRACEMCO", "name": "UltraTech Cement Ltd.",       "sector": "Materials",           "ltp": 10984.00,"changePct":  2.04, "weight":  1.40},
    {"symbol": "TITAN",      "name": "Titan Company Ltd.",          "sector": "Consumer",            "ltp": 3450.00, "changePct":  0.73, "weight":  1.40},
    {"symbol": "WIPRO",      "name": "Wipro Ltd.",                  "sector": "IT",                  "ltp":  528.90, "changePct": -1.40, "weight":  1.30},
    {"symbol": "NTPC",       "name": "NTPC Ltd.",                   "sector": "Power",               "ltp":  385.00, "changePct":  0.73, "weight":  1.30},
    {"symbol": "POWERGRID",  "name": "Power Grid Corporation",      "sector": "Power",               "ltp":  312.00, "changePct":  0.68, "weight":  1.30},
    {"symbol": "HCLTECH",    "name": "HCL Technologies Ltd.",       "sector": "IT",                  "ltp": 1562.80, "changePct": -1.41, "weight":  1.20},
    {"symbol": "ADANIPORTS", "name": "Adani Ports & SEZ Ltd.",      "sector": "Services",            "ltp": 1768.00, "changePct":  1.71, "weight":  1.20},
    {"symbol": "TATASTEEL",  "name": "Tata Steel Ltd.",             "sector": "Metals",              "ltp":  156.40, "changePct":  0.77, "weight":  1.10},
    {"symbol": "ADANIENT",   "name": "Adani Enterprises Ltd.",      "sector": "Metals & Mining",     "ltp": 2890.00, "changePct":  0.63, "weight":  1.10},
    {"symbol": "COALINDIA",  "name": "Coal India Ltd.",             "sector": "Mining",              "ltp":  490.00, "changePct":  0.66, "weight":  1.00},
    {"symbol": "ONGC",       "name": "Oil & Natural Gas Corp.",     "sector": "Energy",              "ltp":  288.00, "changePct":  0.56, "weight":  0.90},
    {"symbol": "JSWSTEEL",   "name": "JSW Steel Ltd.",              "sector": "Metals",              "ltp":  940.00, "changePct":  0.48, "weight":  0.90},
    {"symbol": "BAJAJFINSV", "name": "Bajaj Finserv Ltd.",          "sector": "Financials",          "ltp": 1780.00, "changePct":  0.45, "weight":  0.90},
    {"symbol": "TECHM",      "name": "Tech Mahindra Ltd.",          "sector": "IT",                  "ltp": 1510.00, "changePct": -1.60, "weight":  0.90},
    {"symbol": "ASIANPAINT", "name": "Asian Paints Ltd.",           "sector": "Consumer Durables",   "ltp": 2840.00, "changePct": -0.49, "weight":  0.90},
    {"symbol": "GRASIM",     "name": "Grasim Industries Ltd.",      "sector": "Materials",           "ltp": 2540.00, "changePct":  0.40, "weight":  0.70},
    {"symbol": "CIPLA",      "name": "Cipla Ltd.",                  "sector": "Pharma",              "ltp": 1580.00, "changePct":  0.32, "weight":  0.70},
    {"symbol": "DRREDDY",    "name": "Dr. Reddy's Laboratories",    "sector": "Pharma",              "ltp": 6480.00, "changePct":  0.28, "weight":  0.60},
    {"symbol": "TRENT",      "name": "Trent Ltd.",                  "sector": "Retail",              "ltp": 6850.00, "changePct":  0.44, "weight":  0.60},
    {"symbol": "BEL",        "name": "Bharat Electronics Ltd.",     "sector": "Aerospace & Defence", "ltp":  295.00, "changePct":  0.41, "weight":  0.60},
    {"symbol": "NESTLEIND",  "name": "Nestle India Ltd.",           "sector": "FMCG",                "ltp": 2380.00, "changePct": -0.63, "weight":  0.60},
    {"symbol": "HINDALCO",   "name": "Hindalco Industries Ltd.",    "sector": "Metals",              "ltp":  665.00, "changePct":  0.18, "weight":  0.60},
    {"symbol": "HEROMOTOCO", "name": "Hero MotoCorp Ltd.",          "sector": "Automobile",          "ltp": 5420.00, "changePct":  0.22, "weight":  0.50},
    {"symbol": "BPCL",       "name": "Bharat Petroleum Corp.",      "sector": "Energy",              "ltp":  348.00, "changePct": -0.40, "weight":  0.50},
    {"symbol": "LTIM",       "name": "LTIMindtree Ltd.",            "sector": "IT",                  "ltp": 5890.00, "changePct": -0.30, "weight":  0.50},
    {"symbol": "DIVISLAB",   "name": "Divi's Laboratories Ltd.",    "sector": "Pharma",              "ltp": 4920.00, "changePct": -0.08, "weight":  0.50},
    {"symbol": "TATACONSUM", "name": "Tata Consumer Products",      "sector": "FMCG",                "ltp": 1120.00, "changePct": -0.40, "weight":  0.60},
    {"symbol": "SBILIFE",    "name": "SBI Life Insurance Co.",      "sector": "Insurance",           "ltp": 1780.00, "changePct": -0.22, "weight":  0.60},
    {"symbol": "HDFCLIFE",   "name": "HDFC Life Insurance Co.",     "sector": "Insurance",           "ltp":  720.00, "changePct": -0.21, "weight":  0.60},
    {"symbol": "BAJAJ-AUTO", "name": "Bajaj Auto Ltd.",             "sector": "Automobile",          "ltp": 9890.00, "changePct": -0.15, "weight":  0.60},
    {"symbol": "APOLLOHOSP", "name": "Apollo Hospitals",            "sector": "Healthcare",          "ltp": 6865.00, "changePct": -0.22, "weight":  0.60},
    {"symbol": "BRITANNIA",  "name": "Britannia Industries Ltd.",   "sector": "FMCG",                "ltp": 5780.00, "changePct": -0.43, "weight":  0.60},
    {"symbol": "EICHERMOT",  "name": "Eicher Motors Ltd.",          "sector": "Automobile",          "ltp": 4868.00, "changePct":  0.82, "weight":  0.60},
]

BANKNIFTY_CONSTITUENTS = [
    {"symbol": "HDFCBANK",  "name": "HDFC Bank Ltd.",           "sector": "Private Bank", "ltp": 1716.50, "changePct":  1.82, "weight": 28.50},
    {"symbol": "ICICIBANK", "name": "ICICI Bank Ltd.",          "sector": "Private Bank", "ltp": 1349.60, "changePct": -0.46, "weight": 22.80},
    {"symbol": "KOTAKBANK", "name": "Kotak Mahindra Bank",      "sector": "Private Bank", "ltp": 1748.60, "changePct": -0.68, "weight":  9.20},
    {"symbol": "AXISBANK",  "name": "Axis Bank Ltd.",           "sector": "Private Bank", "ltp": 1185.40, "changePct":  0.72, "weight":  9.80},
    {"symbol": "SBIN",      "name": "State Bank of India",      "sector": "PSU Bank",     "ltp":  824.70, "changePct":  0.95, "weight": 10.40},
    {"symbol": "BANKBARODA","name": "Bank of Baroda",           "sector": "PSU Bank",     "ltp":  252.00, "changePct":  1.25, "weight":  3.00},
    {"symbol": "PNB",       "name": "Punjab National Bank",     "sector": "PSU Bank",     "ltp":  112.50, "changePct":  1.08, "weight":  2.40},
    {"symbol": "FEDERALBNK","name": "Federal Bank Ltd.",        "sector": "Private Bank", "ltp":  194.00, "changePct":  0.78, "weight":  2.20},
    {"symbol": "IDFCFIRSTB","name": "IDFC First Bank Ltd.",     "sector": "Private Bank", "ltp":   72.80, "changePct":  0.69, "weight":  1.80},
    {"symbol": "INDUSINDBK","name": "IndusInd Bank Ltd.",       "sector": "Private Bank", "ltp": 1058.40, "changePct": -1.15, "weight":  3.40},
    {"symbol": "BANDHANBNK","name": "Bandhan Bank Ltd.",        "sector": "Private Bank", "ltp":  185.60, "changePct": -0.88, "weight":  1.60},
    {"symbol": "AUBANK",    "name": "AU Small Finance Bank",    "sector": "Small Finance", "ltp":  578.20, "changePct":  0.45, "weight":  1.20},
]


def format_indian_date(date_str: str) -> str:
    """Convert 2026-09-21 -> 21-Sep-2026"""
    try:
        d = datetime.datetime.strptime(date_str, "%Y-%m-%d")
        return d.strftime("%d-%b-%Y")
    except Exception:
        return date_str


def _recalculate_contributions(raw_stocks: List[Dict], spot: float, live_quotes: Optional[Dict[str, Dict]] = None) -> List[Dict]:
    """
    Recalculate contribution for each stock using real-time quotes if available:
      Point Contribution = Index_Spot * (Stock_Weight% / 100) * (Stock_%_Change / 100)
    """
    result = []
    for s in raw_stocks:
        s2 = dict(s)
        sym = s2.get("symbol", "")
        if live_quotes and sym in live_quotes:
            q = live_quotes[sym]
            if q and q.get("ltp") is not None:
                s2["ltp"] = round(float(q["ltp"]), 2)
                s2["change"] = round(float(q.get("change") or 0.0), 2)
                s2["changePct"] = round(float(q.get("changePct") or 0.0), 2)

        if "change" not in s2:
            s2["change"] = round(float(s2.get("ltp", 0.0)) * (float(s2.get("changePct", 0.0)) / 100.0), 2)

        weight = float(s2.get("weight", 0.0))
        chg_pct = float(s2.get("changePct", 0.0))
        # Real-time point contribution
        contrib = round(spot * (weight / 100.0) * (chg_pct / 100.0), 2)
        s2["contribution"] = contrib
        s2["isHighlighted"] = abs(chg_pct) >= 1.5
        result.append(s2)
    return result


def generate_intraday_timeline(
    index_key: str = "nifty50",
    date_str: str = "2026-09-21",
    spot_hint: float = None,
    change_hint: float = None
) -> List[Dict[str, Any]]:
    """Generates 1-minute intraday snapshots (09:15 to 15:30) with synchronized Breadth, 20 SMA, and Spot."""
    timeline = []
    effective_date = date_str or "2026-09-21"

    # 375 minutes from 09:15 to 15:30
    total_minutes = 375

    if index_key == "banknifty":
        base_spot = 56350.00
        target_spot = 56608.00
        total_stocks = 12
        base_adv = 7
        base_dec = 5
    else:  # nifty50
        base_spot = 23340.00
        target_spot = 23452.00
        total_stocks = 50
        base_adv = 28
        base_dec = 22

    if spot_hint and spot_hint > 0:
        target_spot = round(float(spot_hint), 2)
        chg = float(change_hint) if change_hint is not None else 0.0
        base_spot = round(target_spot - chg, 2)

    vwap_sum_pv = 0.0
    vwap_sum_v = 0.0

    raw_points = []
    for i in range(total_minutes):
        minute_num = i
        hour = 9 + (15 + minute_num) // 60
        minute = (15 + minute_num) % 60
        time_str = f"{hour:02d}:{minute:02d}"
        iso_time = f"{effective_date}T{time_str}:00+05:30"

        progress = minute_num / float(total_minutes - 1)

        if minute_num < 30:
            spot_delta = -15.0 * math.sin((minute_num / 30.0) * math.pi)
            adv = max(18, int(base_adv - 6 * (minute_num / 30.0)))
        elif minute_num < 225:
            p = (minute_num - 30) / 195.0
            spot_delta = -5.0 + 40.0 * p + 5.0 * math.sin(p * 4 * math.pi)
            adv = int(24 + 4 * p)
        elif minute_num < 300:
            p = (minute_num - 225) / 75.0
            spot_delta = 35.0 + 45.0 * p + 3.0 * math.sin(p * 2 * math.pi)
            adv = int(28 + 3 * p)
        else:
            p = (minute_num - 300) / 75.0
            spot_delta = 80.0 - 4.2 * p
            adv = int(31 - 3 * p)

        current_spot = round(base_spot + (target_spot - base_spot) * (progress * 0.4) + spot_delta, 2)
        if i == total_minutes - 1:
            current_spot = target_spot

        dec = total_stocks - adv
        breadth_ratio = round((adv / float(total_stocks)) * 100.0, 2)
        net_adv = adv - dec

        vol = 5000 + int(3000 * math.sin(progress * math.pi))
        vwap_sum_pv += current_spot * vol
        vwap_sum_v += vol
        vwap = round(vwap_sum_pv / vwap_sum_v, 2)

        raw_points.append({
            "time": iso_time,
            "displayTime": time_str,
            "date": effective_date,
            "breadth": breadth_ratio,
            "breadthRatio": breadth_ratio,
            "advancers": adv,
            "decliners": dec,
            "x": adv,
            "o": dec,
            "netAdvancers": net_adv,
            "spot": current_spot,
            "close": current_spot,
            "high": round(current_spot + abs(spot_delta) * 0.1, 2),
            "low": round(current_spot - abs(spot_delta) * 0.1, 2),
            "vwap": vwap,
            "volume": vol,
        })

    # Calculate 20 SMA on breadth ratio
    for idx, pt in enumerate(raw_points):
        start_idx = max(0, idx - 19)
        pts_window = raw_points[start_idx: idx + 1]
        pt["ma"] = round(sum(p["breadth"] for p in pts_window) / float(len(pts_window)), 2)
        timeline.append(pt)

    return timeline


def compute_breadth_contribution(
    index_key: str = "nifty50",
    date_str: str = "2026-09-21",
    real_breadth_timeline: Optional[List[Dict[str, Any]]] = None,
    real_nifty_points: Optional[List[Dict[str, Any]]] = None,
    breadth_summary: Optional[Dict[str, Any]] = None,
    real_index_quote: Optional[Dict[str, Any]] = None,
    live_stock_quotes: Optional[Dict[str, Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    """
    Returns full payload for Index Breadth Dynamics and Stock Weight Contribution.
    Contributions are recalculated dynamically using real spot + weight + real-time stock quotes.
    """
    norm_key = (index_key or "nifty50").lower().replace(" ", "").replace("-", "")
    effective_date = date_str or "2026-09-21"
    display_date = format_indian_date(effective_date)

    if norm_key in ("banknifty", "niftybank"):
        index_name = "BANK NIFTY"
        spot = 56608.35
        change = 249.65
        change_pct = 0.44
        open_val = 56450.00
        high_val = 56720.00
        low_val = 56340.00
        prev_close = 56358.70
        raw_stocks_ref = list(BANKNIFTY_CONSTITUENTS)
    else:
        norm_key = "nifty50"
        index_name = "NIFTY 50"
        spot = 23452.20
        change = 105.80
        change_pct = 0.45
        open_val = 23380.00
        high_val = 23495.00
        low_val = 23350.00
        prev_close = 23346.40
        raw_stocks_ref = list(NIFTY50_CONSTITUENTS)

    # Override with live index quote if available
    if real_index_quote and real_index_quote.get("spot"):
        spot = round(float(real_index_quote["spot"]), 2)
        change = round(float(real_index_quote.get("change") or 0.0), 2)
        change_pct = round(float(real_index_quote.get("percentChange") or 0.0), 2)
        prev_close = round(spot - change, 2)
        open_val = round(float(real_index_quote.get("open") or (spot - change * 0.4)), 2)
        high_val = round(float(real_index_quote.get("high") or max(open_val, spot)), 2)
        low_val = round(float(real_index_quote.get("low") or min(open_val, spot)), 2)

    # --- REAL-TIME CONTRIBUTION CALCULATION ---
    # Use live spot + live constituent quotes to recalculate every stock's contribution
    raw_stocks = _recalculate_contributions(raw_stocks_ref, spot, live_stock_quotes)

    # Separate into Advancers and Decliners based on recalculated contribution
    supporting = [s for s in raw_stocks if s["contribution"] >= 0]
    dragging = [s for s in raw_stocks if s["contribution"] < 0]

    # Sort
    supporting.sort(key=lambda x: x["contribution"], reverse=True)
    dragging.sort(key=lambda x: x["contribution"])

    # Sum contributions
    total_support = round(sum(s["contribution"] for s in supporting), 2)
    total_drag = round(sum(s["contribution"] for s in dragging), 2)
    net_pts = round(total_support + total_drag, 2)

    # Visual bar percentages
    max_support = max((s["contribution"] for s in supporting), default=1.0)
    max_drag = abs(min((s["contribution"] for s in dragging), default=-1.0))

    for s in supporting:
        s["barPct"] = round(min(100.0, (s["contribution"] / max_support) * 100.0), 1)
        s["type"] = "advancer"

    for s in dragging:
        s["barPct"] = round(min(100.0, (abs(s["contribution"]) / max_drag) * 100.0), 1)
        s["type"] = "decliner"

    total_magnitude = abs(total_drag) + abs(total_support)
    drag_ratio_pct = round((abs(total_drag) / total_magnitude) * 100.0, 1) if total_magnitude else 50.0
    support_ratio_pct = round(100.0 - drag_ratio_pct, 1)

    # --- TIMELINE ---
    timeline = []
    if (real_breadth_timeline and len(real_breadth_timeline) > 0) or (real_nifty_points and len(real_nifty_points) > 0):
        # 1. Build Breadth map by HH:MM
        b_map = {}
        for p in (real_breadth_timeline or []):
            t_raw = str(p.get("time", ""))
            t_str = t_raw[11:16] if len(t_raw) >= 16 else t_raw
            if effective_date in t_raw and "09:15" <= t_str <= "15:30":
                b_map[t_str] = p

        # 2. Build Nifty Spot & VWAP map by HH:MM
        n_map = {}
        cum_pv = 0.0
        cum_v = 0.0
        n_pts = real_nifty_points or []
        for pt in n_pts:
            t_raw = str(pt.get("time", ""))
            t_str = t_raw[11:16] if len(t_raw) >= 16 else t_raw
            if effective_date in t_raw and "09:15" <= t_str <= "15:30":
                v = float(pt.get("volume") or 1000) or 1000.0
                c = float(pt.get("close") or spot)
                h = float(pt.get("high") or c)
                l = float(pt.get("low") or c)
                typ = (h + l + c) / 3.0
                cum_pv += typ * v
                cum_v += v
                pt["vwap"] = round(cum_pv / cum_v, 2)
                n_map[t_str] = pt

        if n_pts and not (real_index_quote and real_index_quote.get("spot")):
            latest_n = n_pts[-1]
            first_n = n_pts[0]
            spot = round(float(latest_n.get("close") or spot), 2)
            open_val = round(float(first_n.get("open") or spot), 2)
            high_val = round(max(float(p.get("high") or p.get("close", spot)) for p in n_pts), 2)
            low_val = round(min(float(p.get("low") or p.get("close", spot)) for p in n_pts), 2)
            prev_close = open_val
            change = round(spot - prev_close, 2)
            change_pct = round((change / prev_close) * 100.0, 2) if prev_close else 0.0

        # 3. Merge every minute from 09:15 to 15:30 with forward fill
        all_minutes = sorted(set(list(b_map.keys()) + list(n_map.keys())))
        last_b = None
        last_n = None

        for t_str in all_minutes:
            if t_str in b_map:
                last_b = b_map[t_str]
            if t_str in n_map:
                last_n = n_map[t_str]

            b_obj = last_b or {}
            n_obj = last_n or {}

            pt_spot = float(n_obj.get("close", spot))
            pt_vwap = float(n_obj.get("vwap", pt_spot))
            pt_high = float(n_obj.get("high", pt_spot))
            pt_low = float(n_obj.get("low", pt_spot))

            timeline.append({
                "time": f"{effective_date}T{t_str}:00+05:30",
                "displayTime": t_str,
                "date": effective_date,
                "breadth": b_obj.get("breadth", 50.0),
                "breadthRatio": b_obj.get("breadth", 50.0),
                "ma": b_obj.get("ma"),
                "x": b_obj.get("x", 25),
                "o": b_obj.get("o", 25),
                "advancers": b_obj.get("x", 25),
                "decliners": b_obj.get("o", 25),
                "netAdvancers": (b_obj.get("x", 25) or 25) - (b_obj.get("o", 25) or 25),
                "spot": pt_spot,
                "close": pt_spot,
                "high": pt_high,
                "low": pt_low,
                "vwap": pt_vwap,
            })
    else:
        timeline = generate_intraday_timeline(norm_key, effective_date, spot_hint=spot, change_hint=change)

    b_summary = breadth_summary or {}
    if not b_summary and real_breadth_timeline:
        last_b = real_breadth_timeline[-1]
        first_b = real_breadth_timeline[0]
        b_summary = {
            "latestBreadth": last_b.get("breadth"),
            "openBreadth": first_b.get("breadth"),
            "change": round((last_b.get("breadth", 0) - first_b.get("breadth", 0)), 2),
            "latestTime": last_b.get("time"),
            "x": last_b.get("x"),
            "o": last_b.get("o"),
            "total": (last_b.get("x") or 0) + (last_b.get("o") or 0),
        }

    return {
        "ok": True,
        "indexKey": norm_key,
        "date": effective_date,
        "displayDate": display_date,
        "indexInfo": {
            "name": index_name,
            "spot": spot,
            "change": change,
            "changePct": change_pct,
            "open": open_val,
            "high": high_val,
            "low": low_val,
            "prevClose": prev_close,
        },
        "breadthSummary": b_summary,
        "summary": {
            "netPoints": net_pts,
            "draggingPoints": total_drag,
            "supportingPoints": total_support,
            "draggingCount": len(dragging),
            "supportingCount": len(supporting),
            "totalStocks": len(raw_stocks),
            "dragRatioPct": drag_ratio_pct,
            "supportRatioPct": support_ratio_pct,
        },
        "draggingDown": dragging,
        "supportingUp": supporting,
        "timeline": timeline,
    }
