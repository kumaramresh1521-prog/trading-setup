"""
options_math.py
Standard Black-Scholes-Merton Pricing and Greeks Calculation Engine
Calibrated to Indian Option Markets (NSE, Sensibull, Upstox conventions).
"""

import math
from datetime import datetime, time as dtime, timezone, timedelta
from typing import Dict, Any, Optional, Tuple

IST = timezone(timedelta(hours=5, minutes=30))

# Standard risk-free rate used by Sensibull & NSE for Indian derivatives: 10.0%
DEFAULT_RISK_FREE_RATE = 0.10


def normal_cdf(x: float) -> float:
    """Cumulative distribution function for standard normal distribution."""
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))


def normal_pdf(x: float) -> float:
    """Probability density function for standard normal distribution."""
    return (1.0 / math.sqrt(2.0 * math.pi)) * math.exp(-0.5 * x * x)


def time_to_expiry_years(expiry_date_str: str, now_dt: Optional[datetime] = None) -> float:
    """
    Computes time to expiry in annual fraction (T) based on 15:30 IST market close.
    Supports formats like '2026-09-24', '24-Sep-2026', '24-SEP-2026', '2026-09-24 (Weekly)'
    """
    if now_dt is None:
        now_dt = datetime.now(IST)

    # Clean expiry string
    cleaned = expiry_date_str.split("(")[0].strip()
    
    expiry_dt = None
    formats = [
        "%Y-%m-%d",
        "%d-%b-%Y",
        "%d-%B-%Y",
        "%d/%m/%Y",
        "%Y/%m/%d",
    ]
    for fmt in formats:
        try:
            parsed = datetime.strptime(cleaned, fmt)
            expiry_dt = parsed.replace(hour=15, minute=30, second=0, tzinfo=IST)
            break
        except ValueError:
            continue

    if expiry_dt is None:
        # Default fallback: 3 days ahead if unparseable
        return max(0.0001, 3.0 / 365.25)

    diff_seconds = (expiry_dt - now_dt).total_seconds()
    if diff_seconds <= 0:
        # If expiry is today during/after market close or past
        return 0.00001

    # Annual fraction based on 365.25 days
    return diff_seconds / (365.25 * 86400.0)


def black_scholes_price(
    spot: float,
    strike: float,
    t_years: float,
    r: float = DEFAULT_RISK_FREE_RATE,
    sigma: float = 0.15,
    option_type: str = "CE",
) -> float:
    """
    Calculates theoretical European option price using Black-Scholes formula.
    """
    if t_years <= 0.00001 or sigma <= 0.0001:
        # Intrinsic value at expiration
        if option_type.upper() == "CE":
            return max(0.0, spot - strike)
        else:
            return max(0.0, strike - spot)

    d1 = (math.log(spot / strike) + (r + 0.5 * sigma * sigma) * t_years) / (sigma * math.sqrt(t_years))
    d2 = d1 - sigma * math.sqrt(t_years)

    if option_type.upper() == "CE":
        price = spot * normal_cdf(d1) - strike * math.exp(-r * t_years) * normal_cdf(d2)
    else:
        price = strike * math.exp(-r * t_years) * normal_cdf(-d2) - spot * normal_cdf(-d1)

    return max(0.0, price)


def black_scholes_greeks(
    spot: float,
    strike: float,
    t_years: float,
    r: float = DEFAULT_RISK_FREE_RATE,
    sigma: float = 0.15,
    option_type: str = "CE",
) -> Dict[str, float]:
    """
    Calculates exact Black-Scholes Greeks:
    - Delta: Price sensitivity (0 to 1 for Call, -1 to 0 for Put)
    - Gamma: Delta sensitivity per 1 point spot move
    - Theta: 1-day time decay in currency points (₹)
    - Vega: Price change per 1 percentage point change in IV (₹)
    - Rho: Sensitivity to interest rate
    """
    is_call = option_type.upper() == "CE"

    if t_years <= 0.00001 or sigma <= 0.0001:
        delta = 1.0 if (is_call and spot > strike) else (-1.0 if (not is_call and spot < strike) else 0.0)
        return {
            "delta": round(delta, 3),
            "gamma": 0.0,
            "theta": 0.0,
            "vega": 0.0,
            "rho": 0.0,
            "iv": round(sigma * 100.0, 2),
        }

    sqrt_t = math.sqrt(t_years)
    d1 = (math.log(spot / strike) + (r + 0.5 * sigma * sigma) * t_years) / (sigma * sqrt_t)
    d2 = d1 - sigma * sqrt_t

    pdf_d1 = normal_pdf(d1)

    # 1. Delta
    if is_call:
        delta = normal_cdf(d1)
    else:
        delta = normal_cdf(d1) - 1.0

    # 2. Gamma
    gamma = pdf_d1 / (spot * sigma * sqrt_t)

    # 3. Vega: standard Indian broker format is per 1% change in IV (i.e. divided by 100)
    vega = (spot * sqrt_t * pdf_d1) / 100.0

    # 4. Theta: per 1 calendar day decay
    term1 = -(spot * pdf_d1 * sigma) / (2.0 * sqrt_t)
    if is_call:
        term2 = -r * strike * math.exp(-r * t_years) * normal_cdf(d2)
        theta_annual = term1 + term2
    else:
        term2 = r * strike * math.exp(-r * t_years) * normal_cdf(-d2)
        theta_annual = term1 + term2
    theta_daily = theta_annual / 365.25

    # 5. Rho
    if is_call:
        rho = (strike * t_years * math.exp(-r * t_years) * normal_cdf(d2)) / 100.0
    else:
        rho = (-strike * t_years * math.exp(-r * t_years) * normal_cdf(-d2)) / 100.0

    return {
        "delta": round(delta, 3),
        "gamma": round(gamma, 5),
        "theta": round(theta_daily, 2),
        "vega": round(vega, 2),
        "rho": round(rho, 3),
        "iv": round(sigma * 100.0, 2),
    }


def implied_volatility(
    market_price: float,
    spot: float,
    strike: float,
    t_years: float,
    r: float = DEFAULT_RISK_FREE_RATE,
    option_type: str = "CE",
    initial_guess: float = 0.15,
) -> float:
    """
    Computes Implied Volatility (IV) using Newton-Raphson with bisection fallback.
    Returns IV as a decimal fraction (e.g. 0.142 for 14.2%).
    """
    is_call = option_type.upper() == "CE"
    intrinsic = max(0.0, spot - strike if is_call else strike - spot)

    if market_price <= intrinsic:
        return 0.05  # Lower bound

    if t_years <= 0.0001:
        return 0.15

    # Newton-Raphson iteration
    sigma = initial_guess
    for _ in range(30):
        price = black_scholes_price(spot, strike, t_years, r, sigma, option_type)
        diff = price - market_price

        if abs(diff) < 0.01:
            return max(0.01, min(3.0, sigma))

        # Vega calculation
        sqrt_t = math.sqrt(t_years)
        d1 = (math.log(spot / strike) + (r + 0.5 * sigma * sigma) * t_years) / (sigma * sqrt_t)
        vega_derivative = spot * sqrt_t * normal_pdf(d1)

        if vega_derivative < 1e-6:
            break

        sigma = sigma - diff / vega_derivative
        if sigma <= 0.001 or sigma > 5.0:
            break

    # Bisection fallback if Newton-Raphson diverges
    low = 0.01
    high = 3.0
    for _ in range(25):
        mid = (low + high) * 0.5
        p = black_scholes_price(spot, strike, t_years, r, mid, option_type)
        if abs(p - market_price) < 0.05:
            return mid
        if p < market_price:
            low = mid
        else:
            high = mid

    return max(0.01, min(3.0, (low + high) * 0.5))
