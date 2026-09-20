"""
NiftyTrader Analytics Engine
Implements quantitative calculations and data models for:
1. NiftyTrader Summary (India VIX, Max Pain strike, Lot Size, OI PCR, Chg in OI PCR, Volume PCR, Spot overlay)
2. Live Max Pain Engine (Strike loss minimization algorithm: CE Loss + PE Loss)
3. Intraday PCR & Change-in-OI PCR 30-Minute Interval Time Series & History
4. Volume PCR (Volume-weighted Put Call Ratio & intraday series)
5. OI Chart (Line & Bar strike distribution)
6. Change in OI (Delta OI distribution across strikes)
7. Option Chain with Greeks (Delta, IV, LTP, OI) and Multi-Exchange support (NSE, BSE, MCX)
8. Implied Volatility (IV Smile & Skew curve)
"""

import math
import random
from datetime import datetime, time, timedelta

# Standard F&O Lot Sizes
LOT_SIZES = {
    "nifty50": 65,
    "banknifty": 15,
    "finnifty": 40,
    "sensex": 10,
    "crudeoil": 100,
    "reliance": 250,
    "hdfcbank": 550,
    "infy": 400
}

# Base Spot Prices & Step Sizes
SPOT_BASES = {
    "nifty50": {"spot": 23346.40, "step": 50, "name": "NIFTY 50", "exchange": "NSE"},
    "banknifty": {"spot": 50125.80, "step": 100, "name": "BANK NIFTY", "exchange": "NSE"},
    "finnifty": {"spot": 23480.20, "step": 50, "name": "FIN NIFTY", "exchange": "NSE"},
    "sensex": {"spot": 76820.50, "step": 100, "name": "BSE SENSEX", "exchange": "BSE"},
    "crudeoil": {"spot": 6120.00, "step": 50, "name": "CRUDE OIL", "exchange": "MCX"},
    "reliance": {"spot": 2980.50, "step": 20, "name": "RELIANCE", "exchange": "NSE"},
    "hdfcbank": {"spot": 1640.20, "step": 10, "name": "HDFC BANK", "exchange": "NSE"},
    "infy": {"spot": 1520.40, "step": 20, "name": "INFOSYS", "exchange": "NSE"}
}

def get_base_meta(symbol):
    sym = (symbol or "nifty50").lower().replace(" ", "").replace("-", "")
    return SPOT_BASES.get(sym, SPOT_BASES["nifty50"])

def get_lot_size(symbol):
    sym = (symbol or "nifty50").lower().replace(" ", "").replace("-", "")
    return LOT_SIZES.get(sym, 65)

def get_atm_strike(spot, step):
    return round(spot / step) * step

def generate_strikes_data(symbol):
    """Generate realistic strike-level option data with mathematical coherence."""
    meta = get_base_meta(symbol)
    spot = meta["spot"]
    step = meta["step"]
    atm = get_atm_strike(spot, step)
    
    strikes = []
    # 15 strikes below ATM, ATM, 15 strikes above ATM = 31 strikes
    for i in range(-15, 16):
        strike = atm + (i * step)
        dist = (strike - spot) / spot
        
        # Call OI peaks around OTM strikes (higher resistance)
        # Put OI peaks around OTM strikes (lower support)
        # Base realistic OI in lots
        if i >= 0:
            ce_oi = int(max(15000, 145000 * math.exp(-0.5 * ((i - 4) / 3.5)**2) + random.randint(1200, 8500)))
            pe_oi = int(max(8000, 95000 * math.exp(-0.5 * ((i + 2) / 3.2)**2) + random.randint(800, 4500)))
        else:
            ce_oi = int(max(8000, 92000 * math.exp(-0.5 * ((i - 2) / 3.2)**2) + random.randint(900, 5200)))
            pe_oi = int(max(18000, 165000 * math.exp(-0.5 * ((i + 4) / 3.6)**2) + random.randint(1500, 9500)))
            
        # Delta OI
        ce_chg_oi = int(ce_oi * (0.05 + 0.12 * math.sin(i * 0.7)) + random.randint(-2500, 6000))
        pe_chg_oi = int(pe_oi * (0.06 + 0.14 * math.cos(i * 0.6)) + random.randint(-2000, 7500))
        
        # Volumes
        ce_vol = int(abs(ce_chg_oi) * 2.8 + random.randint(8000, 45000))
        pe_vol = int(abs(pe_chg_oi) * 2.9 + random.randint(9000, 48000))
        
        # Greeks & Prices (Approximate Black-Scholes)
        moneyness = spot / strike
        time_to_exp = 4 / 365.0 # 4 days
        sigma = 0.135 + 0.04 * (abs(dist) ** 1.2) # IV Smile
        d1 = (math.log(spot / strike) + (0.065 + 0.5 * sigma**2) * time_to_exp) / (sigma * math.sqrt(time_to_exp))
        d2 = d1 - sigma * math.sqrt(time_to_exp)
        
        nd1 = 0.5 * (1.0 + math.erf(d1 / math.sqrt(2.0)))
        nd2 = 0.5 * (1.0 + math.erf(d2 / math.sqrt(2.0)))
        n_minus_d1 = 0.5 * (1.0 + math.erf(-d1 / math.sqrt(2.0)))
        n_minus_d2 = 0.5 * (1.0 + math.erf(-d2 / math.sqrt(2.0)))
        
        ce_ltp = round(max(0.5, spot * nd1 - strike * math.exp(-0.065 * time_to_exp) * nd2), 2)
        pe_ltp = round(max(0.5, strike * math.exp(-0.065 * time_to_exp) * n_minus_d2 - spot * n_minus_d1), 2)
        
        ce_delta = round(nd1, 3)
        pe_delta = round(nd1 - 1.0, 3)
        ce_iv = round(sigma * 100, 2)
        pe_iv = round((sigma + 0.008 * (1 if i < 0 else -0.5)) * 100, 2)
        
        strikes.append({
            "strike": strike,
            "isAtm": (strike == atm),
            "ceOi": ce_oi,
            "peOi": pe_oi,
            "ceChgOi": ce_chg_oi,
            "peChgOi": pe_chg_oi,
            "ceVol": ce_vol,
            "peVol": pe_vol,
            "ceLtp": ce_ltp,
            "peLtp": pe_ltp,
            "ceDelta": ce_delta,
            "peDelta": pe_delta,
            "ceIv": ce_iv,
            "peIv": pe_iv
        })
    
    return {
        "symbol": symbol,
        "name": meta["name"],
        "exchange": meta["exchange"],
        "spot": spot,
        "atmStrike": atm,
        "step": step,
        "lotSize": get_lot_size(symbol),
        "strikes": strikes
    }

def calculate_max_pain(strikes_data):
    """
    Standard Quantitative Max Pain Calculation:
    For each candidate settlement strike S, calculate total loss for option sellers:
    Loss = sum(max(0, S - k) * CE_OI(k)) + sum(max(0, k - S) * PE_OI(k))
    The strike S where Loss is lowest is the Max Pain strike.
    """
    strikes = strikes_data["strikes"]
    loss_table = []
    min_loss = float('inf')
    max_pain_strike = strikes_data["atmStrike"]
    
    for s_entry in strikes:
        s = s_entry["strike"]
        total_call_loss = 0.0
        total_put_loss = 0.0
        
        for k_entry in strikes:
            k = k_entry["strike"]
            # Call option buyer payout if expiry settles at s
            if s > k:
                total_call_loss += (s - k) * k_entry["ceOi"]
            # Put option buyer payout if expiry settles at s
            if s < k:
                total_put_loss += (k - s) * k_entry["peOi"]
                
        total_loss = total_call_loss + total_put_loss
        
        if total_loss < min_loss:
            min_loss = total_loss
            max_pain_strike = s
            
        loss_table.append({
            "strike": s,
            "callLoss": round(total_call_loss / 1e7, 2), # in Crores / Mega units
            "putLoss": round(total_put_loss / 1e7, 2),
            "totalLoss": round(total_loss / 1e7, 2),
            "isAtm": s_entry["isAtm"]
        })
        
    for item in loss_table:
        item["isMaxPain"] = (item["strike"] == max_pain_strike)
        
    return {
        "maxPainStrike": max_pain_strike,
        "minLossCr": round(min_loss / 1e7, 2),
        "lossTable": loss_table
    }

def get_niftytrader_summary(symbol="nifty50"):
    data = generate_strikes_data(symbol)
    max_pain = calculate_max_pain(data)
    
    total_ce_oi = sum(s["ceOi"] for s in data["strikes"])
    total_pe_oi = sum(s["peOi"] for s in data["strikes"])
    total_ce_chg = sum(s["ceChgOi"] for s in data["strikes"])
    total_pe_chg = sum(s["peChgOi"] for s in data["strikes"])
    total_ce_vol = sum(s["ceVol"] for s in data["strikes"])
    total_pe_vol = sum(s["peVol"] for s in data["strikes"])
    
    oi_pcr = round(total_pe_oi / max(1, total_ce_oi), 4)
    chg_pcr = round(abs(total_pe_chg) / max(1, abs(total_ce_chg)), 4) if total_ce_chg != 0 else 1.0
    vol_pcr = round(total_pe_vol / max(1, total_ce_vol), 4)
    
    # Sentiment status matching NiftyTrader
    if oi_pcr > 1.25:
        sentiment = "Bullish (Put OI Higher)"
        sentiment_type = "bullish"
    elif oi_pcr > 1.05:
        sentiment = "Mildly Bullish (Put OI Higher)"
        sentiment_type = "bullish"
    elif oi_pcr >= 0.90:
        sentiment = "Neutral / Rangebound"
        sentiment_type = "neutral"
    elif oi_pcr >= 0.75:
        sentiment = "Mildly Bearish (Call OI Higher)"
        sentiment_type = "bearish"
    else:
        sentiment = "Bearish (Call OI Higher)"
        sentiment_type = "bearish"
        
    india_vix = 11.39
    vix_change = -0.90
    
    return {
        "ok": True,
        "symbol": symbol,
        "name": data["name"],
        "exchange": data["exchange"],
        "spot": data["spot"],
        "spotChange": 75.80,
        "spotChangePct": 0.33,
        "lotSize": data["lotSize"],
        "atmStrike": data["atmStrike"],
        "indiaVix": india_vix,
        "vixChange": vix_change,
        "maxPainStrike": max_pain["maxPainStrike"],
        "oiPcr": oi_pcr,
        "chgOiPcr": chg_pcr,
        "volumePcr": vol_pcr,
        "sentiment": sentiment,
        "sentimentType": sentiment_type,
        "totalCallOi": total_ce_oi,
        "totalPutOi": total_pe_oi,
        "totalCallVol": total_ce_vol,
        "totalPutVol": total_pe_vol,
        "expiryDate": "2026-09-22"
    }

def get_niftytrader_pcr_intraday(symbol="nifty50"):
    """
    Generate 30-minute interval series from 09:10 AM to 03:30 PM
    matching exact table and chart from https://www.niftytrader.in/nifty-put-call-ratio
    """
    summary = get_niftytrader_summary(symbol)
    spot_base = summary["spot"]
    current_pcr = summary["oiPcr"]
    
    # Time slots exactly like NiftyTrader table
    time_slots = [
        ("09:10 AM", 0.995, 1.062, spot_base - 11.7),
        ("09:30 AM", 0.922, 0.675, spot_base - 43.1),
        ("10:00 AM", 0.905, 0.708, spot_base - 19.1),
        ("10:30 AM", 0.935, 0.808, spot_base - 31.1),
        ("11:00 AM", 0.888, 0.692, spot_base - 36.5),
        ("11:30 AM", 0.862, 0.639, spot_base - 43.8),
        ("12:00 PM", 0.878, 0.675, spot_base - 29.7),
        ("12:30 PM", 0.900, 0.731, spot_base - 22.7),
        ("01:00 PM", 0.935, 0.825, spot_base - 14.5),
        ("01:30 PM", 0.969, 0.919, spot_base - 22.7),
        ("02:00 PM", 0.957, 0.880, spot_base - 17.2),
        ("02:30 PM", 1.080, 1.954, spot_base + 35.4),
        ("03:00 PM", 1.115, 2.340, spot_base + 58.2),
        ("03:30 PM", current_pcr, summary["chgOiPcr"], spot_base)
    ]
    
    rows = []
    for t_str, oi_r, chg_r, sp in time_slots:
        rows.append({
            "time": t_str,
            "oiPcr": round(oi_r, 3),
            "chgOiPcr": round(chg_r, 3),
            "spot": round(sp, 2)
        })
        
    return {
        "ok": True,
        "symbol": symbol,
        "name": summary["name"],
        "spot": summary["spot"],
        "currentOiPcr": current_pcr,
        "currentChgOiPcr": summary["chgOiPcr"],
        "sentiment": summary["sentiment"],
        "sentimentType": summary["sentimentType"],
        "expiryDate": summary["expiryDate"],
        "history": rows
    }

def get_niftytrader_max_pain_desk(symbol="nifty50"):
    data = generate_strikes_data(symbol)
    max_pain = calculate_max_pain(data)
    
    # Filter 15 strikes centered on ATM for clean visualization
    atm = data["atmStrike"]
    filtered_loss = [
        item for item in max_pain["lossTable"]
        if abs(item["strike"] - atm) <= 7 * data["step"]
    ]
    
    return {
        "ok": True,
        "symbol": symbol,
        "name": data["name"],
        "spot": data["spot"],
        "atmStrike": atm,
        "maxPainStrike": max_pain["maxPainStrike"],
        "minLossCr": max_pain["minLossCr"],
        "lossTable": filtered_loss
    }

def get_niftytrader_oi_chart(symbol="nifty50"):
    data = generate_strikes_data(symbol)
    atm = data["atmStrike"]
    step = data["step"]
    
    # Filter 15 strikes centered on ATM
    strikes = [s for s in data["strikes"] if abs(s["strike"] - atm) <= 7 * step]
    
    return {
        "ok": True,
        "symbol": symbol,
        "name": data["name"],
        "spot": data["spot"],
        "atmStrike": atm,
        "strikes": strikes
    }

def get_niftytrader_change_oi(symbol="nifty50"):
    data = generate_strikes_data(symbol)
    atm = data["atmStrike"]
    step = data["step"]
    
    strikes = [s for s in data["strikes"] if abs(s["strike"] - atm) <= 7 * step]
    
    return {
        "ok": True,
        "symbol": symbol,
        "name": data["name"],
        "spot": data["spot"],
        "atmStrike": atm,
        "strikes": strikes
    }

def get_niftytrader_volume_pcr(symbol="nifty50"):
    data = generate_strikes_data(symbol)
    summary = get_niftytrader_summary(symbol)
    
    # Intraday volume PCR snapshots
    time_series = [
        {"time": "09:30 AM", "volPcr": 0.88, "putVol": 1820000, "callVol": 2068000},
        {"time": "10:30 AM", "volPcr": 0.91, "putVol": 3450000, "callVol": 3791000},
        {"time": "11:30 AM", "volPcr": 0.89, "putVol": 5120000, "callVol": 5752000},
        {"time": "12:30 PM", "volPcr": 0.94, "putVol": 6940000, "callVol": 7382000},
        {"time": "01:30 PM", "volPcr": 0.98, "putVol": 8790000, "callVol": 8969000},
        {"time": "02:30 PM", "volPcr": 1.05, "putVol": 11420000, "callVol": 10876000},
        {"time": "03:30 PM", "volPcr": summary["volumePcr"], "putVol": summary["totalPutVol"], "callVol": summary["totalCallVol"]}
    ]
    
    return {
        "ok": True,
        "symbol": symbol,
        "name": data["name"],
        "spot": data["spot"],
        "currentVolumePcr": summary["volumePcr"],
        "totalPutVol": summary["totalPutVol"],
        "totalCallVol": summary["totalCallVol"],
        "timeSeries": time_series
    }

def get_niftytrader_iv(symbol="nifty50"):
    data = generate_strikes_data(symbol)
    atm = data["atmStrike"]
    step = data["step"]
    
    strikes = [
        {
            "strike": s["strike"],
            "isAtm": s["isAtm"],
            "ceIv": s["ceIv"],
            "peIv": s["peIv"],
            "avgIv": round((s["ceIv"] + s["peIv"]) / 2, 2)
        }
        for s in data["strikes"] if abs(s["strike"] - atm) <= 8 * step
    ]
    
    return {
        "ok": True,
        "symbol": symbol,
        "name": data["name"],
        "spot": data["spot"],
        "atmStrike": atm,
        "strikes": strikes
    }

def get_niftytrader_option_chain(symbol="nifty50", exchange="NSE"):
    data = generate_strikes_data(symbol)
    atm = data["atmStrike"]
    step = data["step"]
    
    # 21 strikes for option chain
    strikes = [s for s in data["strikes"] if abs(s["strike"] - atm) <= 10 * step]
    
    return {
        "ok": True,
        "symbol": symbol,
        "name": data["name"],
        "exchange": exchange.upper(),
        "spot": data["spot"],
        "atmStrike": atm,
        "expiryDate": "2026-09-22",
        "lotSize": data["lotSize"],
        "strikes": strikes
    }
