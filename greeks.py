import math

def normal_cdf(x: float) -> float:
    """Cumulative Distribution Function of standard normal distribution."""
    return (1.0 + math.erf(x / math.sqrt(2.0))) / 2.0

def normal_pdf(x: float) -> float:
    """Probability Density Function of standard normal distribution."""
    return math.exp(-0.5 * x * x) / math.sqrt(2.0 * math.pi)

def bs_price(option_type: str, S: float, K: float, T: float, r: float, sigma: float) -> float:
    """Calculate Black-Scholes theoretical option price."""
    if S <= 0 or K <= 0 or T <= 0 or sigma <= 0:
        # Intrinsic value at expiry
        if option_type.upper() == "CE":
            return max(0.0, S - K)
        else:
            return max(0.0, K - S)
            
    d1 = (math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    
    if option_type.upper() == "CE":
        return S * normal_cdf(d1) - K * math.exp(-r * T) * normal_cdf(d2)
    else:
        return K * math.exp(-r * T) * normal_cdf(-d2) - S * normal_cdf(-d1)


def black76_price(option_type: str, F: float, K: float, T: float, r: float, sigma: float) -> float:
    """Calculate Black-76 theoretical option price for futures and synthetic forwards."""
    if F <= 0 or K <= 0 or T <= 0 or sigma <= 0:
        df = math.exp(-r * max(0.0, T))
        if option_type.upper() == "CE":
            return max(0.0, F - K) * df
        else:
            return max(0.0, K - F) * df

    d1 = (math.log(F / K) + 0.5 * sigma * sigma * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    df = math.exp(-r * T)

    if option_type.upper() == "CE":
        return df * (F * normal_cdf(d1) - K * normal_cdf(d2))
    else:
        return df * (K * normal_cdf(-d2) - F * normal_cdf(-d1))


def implied_volatility(option_type: str, market_price: float, S: float, K: float, T: float, r: float) -> float:
    """Calculate Implied Volatility (IV) using standard bisection method."""
    if T <= 0 or market_price <= 0 or S <= 0 or K <= 0:
        return 0.0
        
    intrinsic = max(0.0, S - K) if option_type.upper() == "CE" else max(0.0, K - S)
    if market_price <= intrinsic:
        return 0.0001 # Minimal IV floor for ITM options showing very low vol

    # Bisection search
    low_sigma = 0.0001
    high_sigma = 5.0  # 500% cap
    precision = 1e-4
    
    for _ in range(30):
        mid_sigma = (low_sigma + high_sigma) / 2.0
        price = bs_price(option_type, S, K, T, r, mid_sigma)
        
        if abs(price - market_price) < precision:
            return mid_sigma
            
        if price < market_price:
            low_sigma = mid_sigma
        else:
            high_sigma = mid_sigma
            
    return (low_sigma + high_sigma) / 2.0

def bs_greeks(option_type: str, S: float, K: float, T: float, r: float, sigma: float) -> dict:
    """Calculate Option Greeks: Delta, Gamma, Vega, Theta."""
    # Handle edge cases where time to expiry is zero or volatility is negligible
    if T <= 0 or sigma <= 0 or S <= 0 or K <= 0:
        is_ce = option_type.upper() == "CE"
        if is_ce:
            delta = 1.0 if S > K else (0.5 if S == K else 0.0)
        else:
            delta = -1.0 if S < K else (-0.5 if S == K else 0.0)
        return {
            "delta": delta,
            "gamma": 0.0,
            "vega": 0.0,
            "theta": 0.0
        }
        
    d1 = (math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    
    pdf_d1 = normal_pdf(d1)
    cdf_d1 = normal_cdf(d1)
    
    is_ce = option_type.upper() == "CE"
    
    # Calculate Delta
    delta = cdf_d1 if is_ce else (cdf_d1 - 1.0)
    
    # Calculate Gamma
    gamma = pdf_d1 / (S * sigma * math.sqrt(T))
    
    # Calculate Vega (represented as change per 1% absolute volatility change)
    vega = S * math.sqrt(T) * pdf_d1 * 0.01
    
    # Calculate Theta (represented as decay per day, i.e., / 365)
    term1 = -(S * pdf_d1 * sigma) / (2.0 * math.sqrt(T))
    if is_ce:
        term2 = r * K * math.exp(-r * T) * normal_cdf(d2)
        theta = (term1 - term2) / 365.0
    else:
        term2 = r * K * math.exp(-r * T) * normal_cdf(-d2)
        theta = (term1 + term2) / 365.0
        
    return {
        "delta": round(delta, 4),
        "gamma": round(gamma, 6),
        "vega": round(vega, 4),
        "theta": round(theta, 4)
    }
