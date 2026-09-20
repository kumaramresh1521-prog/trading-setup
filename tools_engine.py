"""
tools_engine.py - Institutional Quantitative Analytics Engine
Implements:
1. Delivery Absorption & Institutional Accumulation Scanner (Raw NSE Bhavcopy)
2. India VIX vs Weekly ATM IV Volatility Spread & Arbitrage Engine
3. Spot Velocity vs OI Expansion Divergence (Trap Wall Detector)
4. Multi-Anchor Auto-AVWAP with Standard Deviation Volatility Bands
"""

from __future__ import annotations

import csv
import io
import math
import pathlib
import time
from datetime import date, datetime, timedelta, timezone

INDIA_TZ = timezone(timedelta(hours=5, minutes=30))


# ==============================================================================
# 1. 🧱 Delivery Absorption & Institutional Accumulation Scanner
# ==============================================================================
def calculate_delivery_absorption(
    delivery_cache_dir: pathlib.Path,
    target_date_str: str = "",
    min_delivery_pct: float = 50.0,
    max_range_pct: float = 2.5,
    top_n: int = 30,
) -> dict:
    """
    Parses historical NSE sec_bhavdata_full files to identify quiet institutional
    TWAP accumulation (High Delivery + Tight Price Range Contraction + Volume Spike).
    """
    files = sorted(delivery_cache_dir.glob("sec_bhavdata_full_*.csv"))
    if not files:
        return {"ok": False, "message": "No delivery bhavcopy files found in cache", "records": []}

    latest_file = files[-1]
    if target_date_str:
        clean_target = target_date_str.replace("-", "")
        for f in reversed(files):
            if clean_target in f.name:
                latest_file = f
                break

    # 1. Load historical delivery volumes for 20-day baseline
    hist_delivery_map: dict[str, list[float]] = {}
    baseline_files = [f for f in files if f != latest_file][-20:]
    for bf in baseline_files:
        try:
            with open(bf, "r", encoding="utf-8", errors="ignore") as fp:
                reader = csv.DictReader(fp)
                for raw_row in reader:
                    row = {k.strip(): v.strip() for k, v in raw_row.items() if k}
                    if row.get("SERIES") != "EQ":
                        continue
                    sym = row.get("SYMBOL", "").upper()
                    try:
                        deliv_qty = float(row.get("DELIV_QTY") or row.get("DELIVERY_QTY") or 0)
                        hist_delivery_map.setdefault(sym, []).append(deliv_qty)
                    except Exception:
                        pass
        except Exception:
            continue

    # 2. Parse target file
    records = []
    file_date = latest_file.name.replace("sec_bhavdata_full_", "").replace(".csv", "")
    try:
        with open(latest_file, "r", encoding="utf-8", errors="ignore") as fp:
            reader = csv.DictReader(fp)
            for raw_row in reader:
                row = {k.strip(): v.strip() for k, v in raw_row.items() if k}
                if row.get("SERIES") != "EQ":
                    continue
                sym = row.get("SYMBOL", "").upper()
                try:
                    close_p = float(row.get("CLOSE_PRICE") or row.get("CLOSE") or 0)
                    high_p = float(row.get("HIGH_PRICE") or row.get("HIGH") or 0)
                    low_p = float(row.get("LOW_PRICE") or row.get("LOW") or 0)
                    traded_qty = float(row.get("TTL_TRD_QNTY") or row.get("TRADED_QTY") or 0)
                    deliv_qty = float(row.get("DELIV_QTY") or row.get("DELIVERY_QTY") or 0)
                    deliv_pct = float(row.get("DELIV_PER") or row.get("DELIVERY_PER") or 0)
                except Exception:
                    continue

                if close_p <= 0 or traded_qty < 30000:
                    continue

                # Range Contraction
                range_pts = max(0.0, high_p - low_p)
                range_pct = (range_pts / close_p) * 100.0 if close_p > 0 else 5.0

                # 20-Day Average Delivery
                past_delivs = hist_delivery_map.get(sym, [])
                avg_20_deliv = (sum(past_delivs) / len(past_delivs)) if past_delivs else deliv_qty
                spike_factor = (deliv_qty / avg_20_deliv) if avg_20_deliv > 0 else 1.0

                # Institutional Absorption Score (IAS)
                effective_range = max(range_pct, 0.25)
                ias_score = round((deliv_pct * spike_factor) / effective_range, 1)

                if deliv_pct >= min_delivery_pct and range_pct <= max_range_pct:
                    conviction = "VERY HIGH" if ias_score > 250 else ("HIGH" if ias_score > 150 else "MODERATE")
                    records.append({
                        "symbol": sym,
                        "close": close_p,
                        "deliveryQty": int(deliv_qty),
                        "tradedQty": int(traded_qty),
                        "deliveryPct": round(deliv_pct, 2),
                        "rangePct": round(range_pct, 2),
                        "spikeFactor": round(spike_factor, 2),
                        "absorptionScore": ias_score,
                        "conviction": conviction,
                        "signal": "🔥 Institutional Accumulation",
                    })
    except Exception as exc:
        return {"ok": False, "message": str(exc), "records": []}

    records.sort(key=lambda x: x["absorptionScore"], reverse=True)
    return {
        "ok": True,
        "date": file_date,
        "totalScanned": len(records),
        "records": records[:top_n],
    }


# ==============================================================================
# 2. ⚡ India VIX vs Weekly ATM IV Volatility Spread & Arbitrage Engine
# ==============================================================================
def compute_vix_iv_spread(
    atm_iv: float,
    india_vix: float = 12.8,
    spot: float = 24800.0,
    days_to_expiry: float = 4.0,
) -> dict:
    """
    Computes Volatility Spread = ATM IV - India VIX and classifies market regime.
    """
    if india_vix <= 0:
        india_vix = 12.8
    if atm_iv <= 0:
        atm_iv = 14.5

    vol_spread = round(atm_iv - india_vix, 2)
    spread_ratio = round(atm_iv / india_vix, 2) if india_vix > 0 else 1.0

    z_score = round((vol_spread - 1.2) / 1.5, 2)

    if vol_spread >= 4.0 or z_score >= 1.8:
        regime = "BLOATED_OVERPRICED"
        regime_label = "Options Overpriced (Sell Zone)"
        color = "#ef4444"
        edge = "HIGH_EDGE_SHORT_STRADDLE"
        recommendations = [
            {"strategy": "Short Straddle / Strangle", "edge": "90% IV Crush Probability", "bias": "Neutral Theta Decay"},
            {"strategy": "Iron Condor", "edge": "High Premium Collection with Defined Risk", "bias": "Range-bound"},
            {"strategy": "Bear Call / Bull Put Spread", "edge": "Credit Spreads benefit from Vol Deflation", "bias": "Directional Credit"},
        ]
        rationale = f"Weekly ATM IV ({atm_iv}%) is bloated by +{vol_spread}% over India VIX ({india_vix}%). High implied volatility premium gives option sellers an immediate statistical advantage via IV crush."
    elif vol_spread <= -1.5 or z_score <= -1.5:
        regime = "UNDERPRICED_CHEAP"
        regime_label = "Options Underpriced (Buy Zone)"
        color = "#10b981"
        edge = "HIGH_EDGE_LONG_VOL"
        recommendations = [
            {"strategy": "Long Strangle / Straddle", "edge": "Cheap Gamma expansion setup", "bias": "Explosive Breakout"},
            {"strategy": "Bull Call / Bear Put Debit", "edge": "Low Premium outlay with high risk:reward", "bias": "Directional Momentum"},
            {"strategy": "Calendar Spreads", "edge": "Buy long-dated cheap vol vs short near-term", "bias": "Term Structure Arb"},
        ]
        rationale = f"Weekly ATM IV ({atm_iv}%) is unusually low compared to India VIX ({india_vix}%). Options are underpricing potential range expansion, giving option buyers cheap asymmetric payoffs."
    else:
        regime = "FAIR_VALUE"
        regime_label = "Fair Value (Balanced)"
        color = "#3b82f6"
        edge = "BALANCED_SPREADS"
        recommendations = [
            {"strategy": "Vertical Spreads", "edge": "Hedged Delta / Gamma profile", "bias": "Directional"},
            {"strategy": "Ratio Spreads", "edge": "Exploit skew slope", "bias": "Controlled Direction"},
        ]
        rationale = f"Weekly ATM IV ({atm_iv}%) is trading in historical sync with India VIX ({india_vix}%). Market pricing is efficient."

    daily_expected_move_pts = round(spot * (atm_iv / 100.0) / math.sqrt(365.0), 1)

    return {
        "ok": True,
        "atmIv": round(atm_iv, 2),
        "indiaVix": round(india_vix, 2),
        "volSpread": vol_spread,
        "spreadRatio": spread_ratio,
        "zScore": z_score,
        "regime": regime,
        "regimeLabel": regime_label,
        "color": color,
        "edge": edge,
        "dailyExpectedMovePts": daily_expected_move_pts,
        "upperBreakeven": round(spot + daily_expected_move_pts, 1),
        "lowerBreakeven": round(spot - daily_expected_move_pts, 1),
        "recommendations": recommendations,
        "rationale": rationale,
    }


# ==============================================================================
# 3. 🧲 Spot Velocity vs OI Expansion Divergence (Trap Wall Detector)
# ==============================================================================
def compute_spot_oi_divergence(
    candles: list[list],
    option_chain: list[dict],
    spot: float,
    lookback_candles: int = 15,
) -> dict:
    """
    Compares 15-minute rolling price velocity against Call and Put OI velocity.
    Detects when aggressive institutional walls absorb rallies (Bull Trap)
    or dips (Bear Trap).
    """
    if not candles:
        return {"ok": False, "message": "No candle data available"}

    recent_candles = candles[-max(lookback_candles + 1, 5):]
    p_start = float(recent_candles[0][4] or recent_candles[0][1])
    p_end = float(recent_candles[-1][4])
    price_change_pts = round(p_end - p_start, 2)
    price_velocity_pct = round((price_change_pts / p_start) * 100.0, 3) if p_start > 0 else 0.0

    total_call_oi = 0
    total_put_oi = 0
    total_call_oi_chg = 0
    total_put_oi_chg = 0
    call_walls = []
    put_walls = []

    for row in option_chain:
        strike = float(row.get("strike", 0))
        c = row.get("call") or {}
        p = row.get("put") or {}

        c_oi = int(c.get("oi") or 0)
        p_oi = int(p.get("oi") or 0)
        c_chg = int(c.get("oiChange") or 0)
        p_chg = int(p.get("oiChange") or 0)

        total_call_oi += c_oi
        total_put_oi += p_oi
        total_call_oi_chg += c_chg
        total_put_oi_chg += p_chg

        call_walls.append({"strike": strike, "oi": c_oi, "oiChange": c_chg, "symbol": c.get("symbol", "")})
        put_walls.append({"strike": strike, "oi": p_oi, "oiChange": p_chg, "symbol": p.get("symbol", "")})

    call_walls.sort(key=lambda x: x["oi"], reverse=True)
    put_walls.sort(key=lambda x: x["oi"], reverse=True)

    major_call_wall = call_walls[0] if call_walls else {"strike": spot + 100, "oi": 0}
    major_put_wall = put_walls[0] if put_walls else {"strike": spot - 100, "oi": 0}

    bull_trap_score = 0
    bear_trap_score = 0

    if price_velocity_pct > 0.08 and total_call_oi_chg > 25000:
        bull_trap_score = min(95, int((price_velocity_pct * 150) + (total_call_oi_chg / 15000)))
    elif price_velocity_pct < -0.08 and total_put_oi_chg > 25000:
        bear_trap_score = min(95, int((abs(price_velocity_pct) * 150) + (total_put_oi_chg / 15000)))

    if bull_trap_score >= 60:
        trap_status = "ACTIVE BULL TRAP"
        trap_color = "#ef4444"
        trap_desc = f"Price rallied +{price_change_pts} pts, but institutional Call Writing surged (+{total_call_oi_chg:,} OI). Resistance wall at {major_call_wall['strike']} is absorbing demand."
        action_signal = "SELL_ON_RISE / REVERSAL_DOWN"
    elif bear_trap_score >= 60:
        trap_status = "ACTIVE BEAR TRAP"
        trap_color = "#10b981"
        trap_desc = f"Price dropped {price_change_pts} pts, but institutional Put Writing surged (+{total_put_oi_chg:,} OI). Support floor at {major_put_wall['strike']} is absorbing supply."
        action_signal = "BUY_ON_DIP / REVERSAL_UP"
    else:
        trap_status = "STABLE FLOW"
        trap_color = "#3b82f6"
        trap_desc = f"Order flow is in equilibrium. Call Wall at {major_call_wall['strike']}, Put Wall at {major_put_wall['strike']}."
        action_signal = "RANGE_BOUND"

    return {
        "ok": True,
        "spot": spot,
        "priceChangePts": price_change_pts,
        "priceVelocityPct": price_velocity_pct,
        "totalCallOiChange": total_call_oi_chg,
        "totalPutOiChange": total_put_oi_chg,
        "majorCallWall": major_call_wall,
        "majorPutWall": major_put_wall,
        "bullTrapScore": bull_trap_score,
        "bearTrapScore": bear_trap_score,
        "trapStatus": trap_status,
        "trapColor": trap_color,
        "trapDesc": trap_desc,
        "actionSignal": action_signal,
    }


# ==============================================================================
# 4. 🎯 Auto-Anchored VWAP (AVWAP) Engine with StdDev Bands
# ==============================================================================
def compute_anchored_vwap(candles: list[list], spot: float = 0.0) -> dict:
    """
    Automatically detects structural anchors:
    1. Swing High Anchor (Peak of recent move)
    2. Swing Low Anchor (Valley of recent move)
    3. Session Open Anchor (First candle of current day 09:15)
    4. Computes +/-1 and +/-2 Standard Deviation Volatility Bands around AVWAP.
    5. Detects "AVWAP Pinch / Squeeze" when High AVWAP and Low AVWAP converge.
    """
    if not candles or len(candles) < 5:
        return {"ok": False, "message": "Insufficient candles for AVWAP computation"}

    parsed_candles = []
    for c in candles:
        try:
            t = str(c[0])
            o = float(c[1])
            h = float(c[2])
            l = float(c[3])
            cl = float(c[4])
            v = float(c[5]) if len(c) > 5 and c[5] is not None else 1000.0
            tp = (h + l + cl) / 3.0  # Typical Price
            parsed_candles.append({"time": t, "open": o, "high": h, "low": l, "close": cl, "vol": v, "tp": tp})
        except Exception:
            continue

    if len(parsed_candles) < 5:
        return {"ok": False, "message": "Could not parse enough valid candles"}

    current_close = parsed_candles[-1]["close"]
    n = len(parsed_candles)

    high_idx = max(range(max(0, n - 80), n), key=lambda i: parsed_candles[i]["high"])
    low_idx = min(range(max(0, n - 80), n), key=lambda i: parsed_candles[i]["low"])
    today_str = parsed_candles[-1]["time"][:10]
    session_idx = 0
    for i, c in enumerate(parsed_candles):
        if c["time"][:10] == today_str:
            session_idx = i
            break

    def calc_avwap_series(start_idx: int):
        series = []
        cum_pv = 0.0
        cum_v = 0.0
        pts = []
        for i in range(start_idx, n):
            c = parsed_candles[i]
            cum_pv += c["tp"] * c["vol"]
            cum_v += c["vol"]
            avwap = cum_pv / cum_v if cum_v > 0 else c["tp"]

            pts.append((c["tp"], c["vol"]))
            weighted_var = sum(v * ((p - avwap) ** 2) for p, v in pts) / cum_v
            std_dev = math.sqrt(max(0.0, weighted_var))

            series.append({
                "time": c["time"],
                "avwap": round(avwap, 2),
                "upper1": round(avwap + std_dev, 2),
                "lower1": round(avwap - std_dev, 2),
                "upper2": round(avwap + 2.0 * std_dev, 2),
                "lower2": round(avwap - 2.0 * std_dev, 2),
            })
        return series

    high_series = calc_avwap_series(high_idx)
    low_series = calc_avwap_series(low_idx)
    session_series = calc_avwap_series(session_idx)

    current_high_avwap = high_series[-1]["avwap"] if high_series else current_close
    current_low_avwap = low_series[-1]["avwap"] if low_series else current_close
    current_session_avwap = session_series[-1]["avwap"] if session_series else current_close

    spread_pts = abs(current_high_avwap - current_low_avwap)
    spread_pct = round((spread_pts / current_close) * 100.0, 2)
    is_pinch = spread_pct <= 0.35

    pinch_status = "PINCH SQUEEZE ACTIVE" if is_pinch else "EXPANSION / TRENDING"
    pinch_desc = (
        f"High AVWAP ({current_high_avwap}) and Low AVWAP ({current_low_avwap}) have converged to within {spread_pts:.1f} pts ({spread_pct}%). Volatility is tightly compressed. Breakout imminent."
        if is_pinch
        else f"High AVWAP: {current_high_avwap} | Low AVWAP: {current_low_avwap} (Spread: {spread_pts:.1f} pts)."
    )

    buyer_status = "PROFIT (Bullish Confidence)" if current_close >= current_low_avwap else "TRAPPED (Bearish Pressure)"
    seller_status = "PROFIT (Bearish Defense)" if current_close <= current_high_avwap else "SHORT SQUEEZED"

    return {
        "ok": True,
        "currentPrice": current_close,
        "highAnchor": {
            "time": parsed_candles[high_idx]["time"],
            "high": parsed_candles[high_idx]["high"],
            "currentAvwap": current_high_avwap,
            "bands": high_series[-1] if high_series else {},
        },
        "lowAnchor": {
            "time": parsed_candles[low_idx]["time"],
            "low": parsed_candles[low_idx]["low"],
            "currentAvwap": current_low_avwap,
            "bands": low_series[-1] if low_series else {},
        },
        "sessionAnchor": {
            "time": parsed_candles[session_idx]["time"],
            "currentAvwap": current_session_avwap,
            "bands": session_series[-1] if session_series else {},
        },
        "spreadPts": round(spread_pts, 2),
        "spreadPct": spread_pct,
        "isPinch": is_pinch,
        "pinchStatus": pinch_status,
        "pinchDesc": pinch_desc,
        "buyerStatus": buyer_status,
        "sellerStatus": seller_status,
        "timeline": session_series,
    }
