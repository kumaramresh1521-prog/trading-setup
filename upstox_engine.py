"""
Upstox Option Chain Pro Engine
Powered exclusively by Upstox API v2:
- https://api.upstox.com/v2/option/chain
- https://api.upstox.com/v2/option/contract
- https://api.upstox.com/v2/user/profile

Zero dependencies on other brokers. Features:
- Direct Bearer Token auth with Cloudflare-friendly browser headers
- RAM caching (TTL 3-5 seconds) for sub-50ms repeat requests
- Dynamic expiry discovery
- Native Upstox Greeks extraction (Delta, Gamma, Theta, Vega, IV)
- Max Pain & ATM Straddle computation
- Graceful realistic fallback simulation when token is not configured or during off-market hours
"""

from __future__ import annotations

import json
import logging
import math
import os
import time
import urllib.parse
import urllib.request
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

logger = logging.getLogger("upstox_engine")

UPSTOX_BASE_URL = "https://api.upstox.com/v2"

# Instrument Key Normalization
INDEX_MAP = {
    "NIFTY": "NSE_INDEX|Nifty 50",
    "NIFTY50": "NSE_INDEX|Nifty 50",
    "NIFTY 50": "NSE_INDEX|Nifty 50",
    "NSE_INDEX|NIFTY 50": "NSE_INDEX|Nifty 50",
    "BANKNIFTY": "NSE_INDEX|Nifty Bank",
    "NIFTYBANK": "NSE_INDEX|Nifty Bank",
    "NIFTY BANK": "NSE_INDEX|Nifty Bank",
    "NSE_INDEX|NIFTY BANK": "NSE_INDEX|Nifty Bank",
    "FINNIFTY": "NSE_INDEX|Nifty Fin Service",
    "NIFTYFIN": "NSE_INDEX|Nifty Fin Service",
    "NIFTY FIN SERVICE": "NSE_INDEX|Nifty Fin Service",
    "NSE_INDEX|NIFTY FIN SERVICE": "NSE_INDEX|Nifty Fin Service",
    "MIDCPNIFTY": "NSE_INDEX|NIFTY MID SELECT",
    "MIDCAPSELECT": "NSE_INDEX|NIFTY MID SELECT",
    "NIFTY MID SELECT": "NSE_INDEX|NIFTY MID SELECT",
    "NSE_INDEX|NIFTY MID SELECT": "NSE_INDEX|NIFTY MID SELECT",
    "SENSEX": "BSE_INDEX|SENSEX",
    "BSESENSEX": "BSE_INDEX|SENSEX",
    "BSE_INDEX|SENSEX": "BSE_INDEX|SENSEX",
}

INDEX_STEP = {
    "NSE_INDEX|Nifty 50": 50,
    "NSE_INDEX|Nifty Bank": 100,
    "NSE_INDEX|Nifty Fin Service": 50,
    "NSE_INDEX|NIFTY MID SELECT": 25,
    "BSE_INDEX|SENSEX": 100,
}

INDEX_BASE_PRICE = {
    "NSE_INDEX|Nifty 50": 24800.0,
    "NSE_INDEX|Nifty Bank": 53200.0,
    "NSE_INDEX|Nifty Fin Service": 24350.0,
    "NSE_INDEX|NIFTY MID SELECT": 12900.0,
    "BSE_INDEX|SENSEX": 81500.0,
}

# In-Memory Cache
_CHAIN_CACHE: Dict[str, Dict[str, Any]] = {}
_EXPIRIES_CACHE: Dict[str, Dict[str, Any]] = {}


def _get_headers(token: str) -> dict:
    tok = token.strip()
    if not tok.lower().startswith("bearer "):
        tok = f"Bearer {tok}"
    return {
        "Accept": "application/json",
        "Authorization": tok,
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        ),
    }


def resolve_instrument_key(raw: str) -> str:
    cleaned = (raw or "NIFTY50").strip().upper().replace(" ", "").replace("_", "").replace("-", "")
    for k, v in INDEX_MAP.items():
        if k.replace(" ", "").replace("_", "").replace("-", "").upper() == cleaned:
            return v
    if "|" in raw:
        return raw
    return "NSE_INDEX|Nifty 50"


def test_connection(token: str, api_key: str = "", api_secret: str = "") -> dict:
    """
    Validates Upstox Bearer token by calling the User Profile or Contract endpoint.
    """
    tok = (token or os.getenv("UPSTOX_ACCESS_TOKEN") or "").strip()
    if not tok:
        return {
            "ok": False,
            "message": "Upstox Access Token is empty. Please enter your access token in Admin Panel.",
            "configured": False,
        }

    url = f"{UPSTOX_BASE_URL}/user/profile"
    req = urllib.request.Request(url, headers=_get_headers(tok))
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            user_data = data.get("data") or {}
            user_name = user_data.get("user_name") or user_data.get("userId") or "Authorized User"
            broker_name = user_data.get("broker") or "UPSTOX"
            return {
                "ok": True,
                "message": f"Successfully connected to Upstox API! Welcome, {user_name} ({broker_name}). Live Option Chain is active.",
                "user": user_data,
                "configured": True,
            }
    except urllib.error.HTTPError as e:
        body = ""
        try:
            body = e.read().decode("utf-8")
            err_json = json.loads(body)
            msg = err_json.get("errors", [{}])[0].get("message") or err_json.get("message") or str(e)
        except Exception:
            msg = f"HTTP {e.code}: {e.reason}"
        return {
            "ok": False,
            "message": f"Upstox Authorization Failed ({e.code}): {msg}",
            "configured": False,
            "raw": body[:200],
        }
    except Exception as exc:
        return {
            "ok": False,
            "message": f"Connection error: {str(exc)}",
            "configured": False,
        }


def get_available_expiries(instrument_key: str, token: str = "") -> list[str]:
    """
    Fetches list of active expiry dates for the selected instrument from Upstox.
    """
    ikey = resolve_instrument_key(instrument_key)
    tok = (token or os.getenv("UPSTOX_ACCESS_TOKEN") or "").strip()

    cache_key = f"{ikey}|{tok[:10]}"
    cached = _EXPIRIES_CACHE.get(cache_key)
    if cached and (time.time() - cached["ts"]) < 300:
        return cached["expiries"]

    if tok:
        enc_key = urllib.parse.quote(ikey)
        url = f"{UPSTOX_BASE_URL}/option/contract?instrument_key={enc_key}"
        req = urllib.request.Request(url, headers=_get_headers(tok))
        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                contracts = data.get("data") or []
                exp_set = {c.get("expiry") for c in contracts if c.get("expiry")}
                sorted_exp = sorted(list(exp_set))
                if sorted_exp:
                    _EXPIRIES_CACHE[cache_key] = {"ts": time.time(), "expiries": sorted_exp}
                    return sorted_exp
        except Exception as exc:
            logger.warning("Failed to fetch Upstox contracts for %s: %s", ikey, exc)

    # Fallback dynamic expiries (Thursday/Tuesday expirations for next 6 weeks)
    now = datetime.now()
    expiries = []
    # Thursday target for Nifty/BankNifty/FinNifty/Sensex
    weekday_target = 3  # Thursday (0=Monday)
    if "FIN" in ikey:
        weekday_target = 1  # Tuesday
    elif "MID" in ikey:
        weekday_target = 0  # Monday
    elif "SENSEX" in ikey:
        weekday_target = 4  # Friday

    for w in range(6):
        d = now + timedelta(days=((weekday_target - now.weekday() + 7) % 7) + (w * 7))
        expiries.append(d.strftime("%Y-%m-%d"))

    return expiries


def compute_max_pain(strikes_data: list[dict]) -> float:
    """
    Computes Max Pain strike where option writers have minimal loss at expiry.
    """
    if not strikes_data:
        return 0.0

    strikes = [r["strike_price"] for r in strikes_data]
    min_loss = float("inf")
    max_pain_strike = strikes[0]

    for test_strike in strikes:
        total_loss = 0.0
        for r in strikes_data:
            k = r["strike_price"]
            ce_oi = (r.get("call_options", {}).get("market_data", {}) or {}).get("oi", 0) or 0
            pe_oi = (r.get("put_options", {}).get("market_data", {}) or {}).get("oi", 0) or 0

            # CE writer loss if test_strike > k
            if test_strike > k:
                total_loss += (test_strike - k) * ce_oi
            # PE writer loss if test_strike < k
            if test_strike < k:
                total_loss += (k - test_strike) * pe_oi

        if total_loss < min_loss:
            min_loss = total_loss
            max_pain_strike = test_strike

    return float(max_pain_strike)


def generate_fallback_option_chain(instrument_key: str, expiry_date: str = "") -> dict:
    """
    Generates a realistic Upstox-compatible Option Chain schema with Greeks,
    accurate Black-Scholes approx, and OI walls when token is absent or invalid.
    """
    ikey = resolve_instrument_key(instrument_key)
    expiries = get_available_expiries(ikey)
    target_expiry = expiry_date if expiry_date in expiries else (expiries[0] if expiries else datetime.now().strftime("%Y-%m-%d"))

    base_spot = INDEX_BASE_PRICE.get(ikey, 24800.0)
    step = INDEX_STEP.get(ikey, 50)
    atm_strike = round(base_spot / step) * step

    # Days to expiry
    try:
        exp_dt = datetime.strptime(target_expiry, "%Y-%m-%d")
        dte = max(1, (exp_dt - datetime.now()).days)
    except Exception:
        dte = 4

    t_annual = dte / 365.0
    strikes_data = []

    total_ce_oi = 0
    total_pe_oi = 0
    total_ce_vol = 0
    total_pe_vol = 0

    # Generate ±20 strikes
    for offset in range(-20, 21):
        strike = atm_strike + (offset * step)
        moneyness = (base_spot - strike) / base_spot
        iv = max(10.0, 14.5 + abs(moneyness) * 25.0 + (0.5 if offset < 0 else -0.3))
        sigma = iv / 100.0

        # BS approx Delta
        d1 = (math.log(base_spot / strike) + (0.07 + 0.5 * sigma * sigma) * t_annual) / (sigma * math.sqrt(t_annual))
        call_delta = round(0.5 * (1.0 + math.erf(d1 / math.sqrt(2.0))), 3)
        put_delta = round(call_delta - 1.0, 3)

        gamma = round(math.exp(-0.5 * d1 * d1) / (base_spot * sigma * math.sqrt(2.0 * math.pi * t_annual)), 4)
        vega = round(base_spot * math.sqrt(t_annual) * math.exp(-0.5 * d1 * d1) / (math.sqrt(2.0 * math.pi) * 100.0), 2)
        theta_ce = round(-((base_spot * sigma * math.exp(-0.5 * d1 * d1)) / (2.0 * math.sqrt(2.0 * math.pi * t_annual)) + 0.07 * strike * math.exp(-0.07 * t_annual) * call_delta) / 365.0, 2)
        theta_pe = round(-((base_spot * sigma * math.exp(-0.5 * d1 * d1)) / (2.0 * math.sqrt(2.0 * math.pi * t_annual)) - 0.07 * strike * math.exp(-0.07 * t_annual) * (1.0 - call_delta)) / 365.0, 2)

        # Approximate Call & Put LTP
        intrinsic_ce = max(0.0, base_spot - strike)
        intrinsic_pe = max(0.0, strike - base_spot)
        time_val = round(base_spot * 0.4 * sigma * math.sqrt(t_annual) * math.exp(-2.5 * abs(moneyness)), 1)

        ce_ltp = max(0.5, round(intrinsic_ce + time_val, 2))
        pe_ltp = max(0.5, round(intrinsic_pe + time_val, 2))

        # Realistic OI & Volumes (heavy walls at round numbers)
        round_factor = 2.5 if (strike % (step * 5) == 0) else 1.0
        dist_factor = math.exp(-0.15 * abs(offset))
        ce_oi = int((45000 + 120000 * dist_factor) * round_factor * (1.2 if offset > 0 else 0.7))
        pe_oi = int((42000 + 115000 * dist_factor) * round_factor * (1.3 if offset < 0 else 0.7))

        ce_vol = int(ce_oi * 1.8)
        pe_vol = int(pe_oi * 1.7)

        total_ce_oi += ce_oi
        total_pe_oi += pe_oi
        total_ce_vol += ce_vol
        total_pe_vol += pe_vol

        row = {
            "expiry": target_expiry,
            "pcr": round(pe_oi / max(1, ce_oi), 2),
            "strike_price": float(strike),
            "underlying_key": ikey,
            "underlying_spot_price": base_spot,
            "call_options": {
                "instrument_key": f"{ikey}_OPT_{strike}_CE",
                "market_data": {
                    "ltp": ce_ltp,
                    "volume": ce_vol,
                    "oi": ce_oi,
                    "close_price": round(ce_ltp * 0.98, 2),
                    "bid_price": round(ce_ltp - 0.25, 2),
                    "bid_qty": 75,
                    "ask_price": round(ce_ltp + 0.25, 2),
                    "ask_qty": 75,
                    "prev_oi": int(ce_oi * 0.94),
                    "net_change": round(ce_ltp * 0.02, 2),
                },
                "option_greeks": {
                    "delta": call_delta,
                    "gamma": gamma,
                    "theta": theta_ce,
                    "vega": vega,
                    "iv": round(iv, 2),
                },
            },
            "put_options": {
                "instrument_key": f"{ikey}_OPT_{strike}_PE",
                "market_data": {
                    "ltp": pe_ltp,
                    "volume": pe_vol,
                    "oi": pe_oi,
                    "close_price": round(pe_ltp * 0.98, 2),
                    "bid_price": round(pe_ltp - 0.25, 2),
                    "bid_qty": 75,
                    "ask_price": round(pe_ltp + 0.25, 2),
                    "ask_qty": 75,
                    "prev_oi": int(pe_oi * 0.93),
                    "net_change": round(pe_ltp * 0.02, 2),
                },
                "option_greeks": {
                    "delta": put_delta,
                    "gamma": gamma,
                    "theta": theta_pe,
                    "vega": vega,
                    "iv": round(iv, 2),
                },
            },
        }
        strikes_data.append(row)

    pcr_overall = round(total_pe_oi / max(1, total_ce_oi), 3)
    max_pain = compute_max_pain(strikes_data)

    # ATM Straddle
    atm_row = min(strikes_data, key=lambda x: abs(x["strike_price"] - base_spot))
    atm_call_ltp = atm_row["call_options"]["market_data"]["ltp"]
    atm_put_ltp = atm_row["put_options"]["market_data"]["ltp"]
    straddle_price = round(atm_call_ltp + atm_put_ltp, 2)

    return {
        "ok": True,
        "isLive": False,
        "source": "UPSTOX_SIMULATION",
        "message": "Sample simulation active. Enter your Upstox Access Token in Admin Panel for live streaming exchange feed.",
        "instrumentKey": ikey,
        "underlying": ikey.split("|")[-1],
        "spotPrice": base_spot,
        "dayChange": 85.40,
        "dayChangePct": 0.35,
        "expiry": target_expiry,
        "availableExpiries": expiries,
        "pcr": pcr_overall,
        "maxPain": max_pain,
        "atmStrike": atm_strike,
        "atmStraddle": straddle_price,
        "totalCeOi": total_ce_oi,
        "totalPeOi": total_pe_oi,
        "totalCeVol": total_ce_vol,
        "totalPeVol": total_pe_vol,
        "expectedMove": round(base_spot * (14.5 / 100.0) * math.sqrt(dte / 365.0), 2),
        "data": strikes_data,
        "lastUpdated": datetime.now().strftime("%H:%M:%S"),
    }


def get_option_chain(
    instrument_key: str = "NSE_INDEX|Nifty 50",
    expiry_date: str = "",
    token: str = "",
    force_refresh: bool = False,
) -> dict:
    """
    Fetches option chain directly from Upstox API v2.
    If token is absent, expired, or invalid, gracefully falls back to synthetic schema.
    """
    ikey = resolve_instrument_key(instrument_key)
    tok = (token or os.getenv("UPSTOX_ACCESS_TOKEN") or "").strip()

    # Determine target expiry date
    expiries = get_available_expiries(ikey, token=tok)
    target_expiry = expiry_date if (expiry_date and expiry_date in expiries) else (expiries[0] if expiries else "")

    cache_key = f"{ikey}|{target_expiry}|{tok[:10]}"
    if not force_refresh:
        cached = _CHAIN_CACHE.get(cache_key)
        if cached and (time.time() - cached["ts"]) < 3.0:
            return cached["payload"]

    # Try live Upstox v2 API call if token is present
    if tok:
        enc_ikey = urllib.parse.quote(ikey)
        url = f"{UPSTOX_BASE_URL}/option/chain?instrument_key={enc_ikey}"
        if target_expiry:
            url += f"&expiry_date={target_expiry}"

        req = urllib.request.Request(url, headers=_get_headers(tok))
        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                raw_json = json.loads(resp.read().decode("utf-8"))
                chain_rows = raw_json.get("data") or []
                if chain_rows:
                    spot_val = float(chain_rows[0].get("underlying_spot_price") or INDEX_BASE_PRICE.get(ikey, 24800.0))
                    total_ce_oi = 0
                    total_pe_oi = 0
                    total_ce_vol = 0
                    total_pe_vol = 0

                    formatted_data = []
                    for r in chain_rows:
                        sp = float(r.get("strike_price") or 0.0)
                        ce = r.get("call_options") or {}
                        pe = r.get("put_options") or {}

                        ce_md = ce.get("market_data") or {}
                        pe_md = pe.get("market_data") or {}

                        ce_oi = int(ce_md.get("oi") or 0)
                        pe_oi = int(pe_md.get("oi") or 0)
                        ce_vol = int(ce_md.get("volume") or 0)
                        pe_vol = int(pe_md.get("volume") or 0)

                        total_ce_oi += ce_oi
                        total_pe_oi += pe_oi
                        total_ce_vol += ce_vol
                        total_pe_vol += pe_vol

                        formatted_data.append(r)

                    step = INDEX_STEP.get(ikey, 50)
                    atm_strike = round(spot_val / step) * step
                    pcr_val = round(total_pe_oi / max(1, total_ce_oi), 3)
                    max_pain = compute_max_pain(formatted_data)

                    # Straddle
                    atm_r = min(formatted_data, key=lambda x: abs(float(x.get("strike_price") or 0.0) - spot_val))
                    c_ltp = float((atm_r.get("call_options", {}).get("market_data", {}) or {}).get("ltp") or 0.0)
                    p_ltp = float((atm_r.get("put_options", {}).get("market_data", {}) or {}).get("ltp") or 0.0)
                    straddle_val = round(c_ltp + p_ltp, 2)

                    payload = {
                        "ok": True,
                        "isLive": True,
                        "source": "UPSTOX_LIVE_API",
                        "message": "Connected to Upstox Live Exchange Feed",
                        "instrumentKey": ikey,
                        "underlying": ikey.split("|")[-1],
                        "spotPrice": spot_val,
                        "expiry": target_expiry,
                        "availableExpiries": expiries,
                        "pcr": pcr_val,
                        "maxPain": max_pain,
                        "atmStrike": atm_strike,
                        "atmStraddle": straddle_val,
                        "totalCeOi": total_ce_oi,
                        "totalPeOi": total_pe_oi,
                        "totalCeVol": total_ce_vol,
                        "totalPeVol": total_pe_vol,
                        "data": formatted_data,
                        "lastUpdated": datetime.now().strftime("%H:%M:%S"),
                    }
                    _CHAIN_CACHE[cache_key] = {"ts": time.time(), "payload": payload}
                    return payload
        except Exception as exc:
            logger.warning("Upstox live chain fetch error: %s. Falling back to simulation.", exc)

    # Fallback simulation
    fallback = generate_fallback_option_chain(ikey, target_expiry)
    _CHAIN_CACHE[cache_key] = {"ts": time.time(), "payload": fallback}
    return fallback
