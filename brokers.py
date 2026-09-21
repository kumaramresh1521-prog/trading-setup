from __future__ import annotations

import hashlib
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Callable

IST = timezone(timedelta(hours=5, minutes=30))


def now_ist() -> datetime:
    return datetime.now(IST)


def read_json_safe(path: Path, default=None):
    if not path.exists():
        return default if default is not None else {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default if default is not None else {}


def write_json_safe(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2), encoding="utf-8")


def http_json(
    url: str,
    *,
    method: str = "GET",
    body=None,
    headers: dict[str, str] | None = None,
    timeout: int = 20,
) -> dict:
    payload = None
    request_headers = {
        "Accept": "application/json",
        "User-Agent": "breadth-lab/1.0",
    }
    if body is not None:
        payload = json.dumps(body).encode("utf-8")
        request_headers["Content-Type"] = "application/json"
    if headers:
        request_headers.update(headers)
    req = urllib.request.Request(url, data=payload, headers=request_headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            raw = response.read()
            text = raw.decode("utf-8", errors="replace")
            return json.loads(text)
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        try:
            detail = json.loads(raw)
        except Exception:
            detail = raw[:500]
        raise RuntimeError(f"HTTP {exc.code} from {url}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Network error from {url}: {exc.reason}") from exc


class BaseBrokerClient:
    """Standard interface for all broker adapters in Breadth Lab."""

    @property
    def broker_name(self) -> str:
        return "GENERIC"

    def is_configured(self) -> bool:
        return False

    def load_session(self) -> bool:
        return False

    def ensure_session(self) -> None:
        pass

    def fetch_candle_data(
        self,
        instrument: Any,
        *,
        interval: str,
        from_date: str,
        to_date: str,
        cache_path: Path,
    ) -> list[list]:
        """Returns standard OHLCV candle list: [[timestamp_iso, open, high, low, close, volume], ...]"""
        raise NotImplementedError

    def candle_data(
        self,
        instrument: Any,
        *,
        interval: str,
        from_date: str,
        to_date: str,
        allow_stale: bool = False,
        background_refresh: bool = False,
    ) -> list[list]:
        raise NotImplementedError

    def quote(self, instruments: list[Any], mode: str = "FULL") -> dict:
        """Returns standard quote map: {'fetched': [{'symbolToken': ..., 'ltp': ..., 'open': ..., 'high': ..., 'low': ..., 'close': ..., 'volume': ..., 'opnInterest': ...}], 'unfetched': []}"""
        raise NotImplementedError


# Comprehensive index instrument mappings for brokers
UPSTOX_INDEX_MAP: dict[str, str] = {
    "NIFTY": "NSE_INDEX|Nifty 50",
    "NIFTY50": "NSE_INDEX|Nifty 50",
    "BANKNIFTY": "NSE_INDEX|Nifty Bank",
    "NIFTYBANK": "NSE_INDEX|Nifty Bank",
    "FINNIFTY": "NSE_INDEX|Nifty Fin Service",
    "NIFTYFINSERVICE": "NSE_INDEX|Nifty Fin Service",
    "MIDCPNIFTY": "NSE_INDEX|NIFTY MID SELECT",
    "MIDCAPSELECT": "NSE_INDEX|NIFTY MID SELECT",
    "NIFTYMIDSELECT": "NSE_INDEX|NIFTY MID SELECT",
    "NIFTYNXT50": "NSE_INDEX|Nifty Next 50",
    "NIFTYNEXT50": "NSE_INDEX|Nifty Next 50",
    "NIFTY500": "NSE_INDEX|Nifty 500",
    "NIFTYIT": "NSE_INDEX|Nifty IT",
    "NIFTYAUTO": "NSE_INDEX|Nifty Auto",
    "NIFTYPHARMA": "NSE_INDEX|Nifty Pharma",
    "NIFTYMETAL": "NSE_INDEX|Nifty Metal",
    "NIFTYFMCG": "NSE_INDEX|Nifty FMCG",
    "NIFTYENERGY": "NSE_INDEX|Nifty Energy",
    "NIFTYMIDCAP100": "NSE_INDEX|Nifty Midcap 100",
    "SENSEX": "BSE_INDEX|SENSEX",
    "BSESENSEX": "BSE_INDEX|SENSEX",
}

FYERS_INDEX_MAP: dict[str, str] = {
    "NIFTY": "NSE:NIFTY50-INDEX",
    "NIFTY50": "NSE:NIFTY50-INDEX",
    "BANKNIFTY": "NSE:NIFTYBANK-INDEX",
    "NIFTYBANK": "NSE:NIFTYBANK-INDEX",
    "FINNIFTY": "NSE:FINNIFTY-INDEX",
    "NIFTYFINSERVICE": "NSE:FINNIFTY-INDEX",
    "MIDCPNIFTY": "NSE:MIDCPNIFTY-INDEX",
    "MIDCAPSELECT": "NSE:MIDCPNIFTY-INDEX",
    "NIFTYMIDSELECT": "NSE:MIDCPNIFTY-INDEX",
    "NIFTYNXT50": "NSE:NIFTYNXT50-INDEX",
    "NIFTYNEXT50": "NSE:NIFTYNXT50-INDEX",
    "NIFTY500": "NSE:NIFTY500-INDEX",
    "NIFTYIT": "NSE:NIFTYIT-INDEX",
    "NIFTYAUTO": "NSE:NIFTYAUTO-INDEX",
    "NIFTYPHARMA": "NSE:NIFTYPHARMA-INDEX",
    "NIFTYMETAL": "NSE:NIFTYMETAL-INDEX",
    "NIFTYFMCG": "NSE:NIFTYFMCG-INDEX",
    "NIFTYENERGY": "NSE:NIFTYENERGY-INDEX",
    "NIFTYMIDCAP100": "NSE:NIFTYMIDCAP100-INDEX",
    "SENSEX": "BSE:SENSEX-INDEX",
    "BSESENSEX": "BSE:SENSEX-INDEX",
}


# ==============================================================================
# 1. 📈 Upstox Client (Upstox API v2)
# ==============================================================================
class UpstoxClient(BaseBrokerClient):
    """
    Upstox API v2 Client.
    Docs: https://upstox.com/developer/api-documentation/
    Requires: UPSTOX_ACCESS_TOKEN in .env (or generated via OAuth).
    """

    BASE_URL = "https://api.upstox.com/v2"

    def __init__(self, cache_dir: Path | None = None, env_func: Callable[[str, str], str] | None = None):
        self._env = env_func or os.getenv
        self.cache_dir = cache_dir or Path(".cache")
        self.access_token = self._env("UPSTOX_ACCESS_TOKEN", "").strip()
        self.api_key = self._env("UPSTOX_API_KEY", "").strip()
        self.api_secret = self._env("UPSTOX_API_SECRET", "").strip()
        self.manual_totp = ""
        self.jwt_token = self.access_token
        self.feed_token = ""

    @property
    def broker_name(self) -> str:
        return "UPSTOX"

    def is_configured(self) -> bool:
        tok = (self.access_token or "").strip()
        return bool(tok and len(tok) > 40 and not tok.isdigit())

    def load_session(self) -> bool:
        return self.is_configured()

    def ensure_session(self) -> None:
        if not self.is_configured():
            raise RuntimeError("Upstox is not configured with a valid OAuth access token. Generate in Settings.")

    def headers(self) -> dict[str, str]:
        token = self.access_token
        if not token.lower().startswith("bearer "):
            token = f"Bearer {token}"
        return {
            "Authorization": token,
            "Accept": "application/json",
            "User-Agent": "breadth-lab/1.0",
        }

    def _load_isin_map(self) -> dict[str, str]:
        if not hasattr(self, "_isin_cache"):
            p = self.cache_dir / "symbol_to_isin.json"
            if not p.exists():
                p = Path(__file__).resolve().parent / ".cache" / "symbol_to_isin.json"
            self._isin_cache = read_json_safe(p, {})
        return self._isin_cache

    def _resolve_instrument_key(self, instrument: Any) -> str:
        sym = getattr(instrument, "symbol", "") or ""
        tsym = getattr(instrument, "trading_symbol", "") or ""
        name = getattr(instrument, "name", "") or ""
        exch = getattr(instrument, "exchange", "NSE") or "NSE"

        is_derivative = (
            exch == "NFO"
            or any(tsym.endswith(t) for t in ("CE", "PE", "FUT"))
            or any(f"-{t}" in tsym or f" {t}" in tsym for t in ("CE", "PE", "FUT"))
        )
        if is_derivative and tsym:
            return f"NSE_FO|{tsym}"

        # Check index mapping first across all possible candidate labels/names/symbols
        candidates = [sym, tsym, name]
        for cand in candidates:
            if not cand:
                continue
            clean = str(cand).upper().replace(" ", "").replace("_", "").replace("-", "")
            if clean in UPSTOX_INDEX_MAP:
                return UPSTOX_INDEX_MAP[clean]

        sym_upper = sym.upper().strip()
        if len(sym_upper) == 12 and (sym_upper.startswith("INE") or sym_upper.startswith("INF")):
            return f"{exch}_EQ|{sym_upper}"

        sym_clean = sym_upper.replace("-EQ", "").strip()
        isin_map = self._load_isin_map()
        isin = (
            isin_map.get(sym_clean)
            or isin_map.get(sym_upper)
            or isin_map.get(tsym.replace("-EQ", "").upper().strip())
        )
        if isin:
            return f"{exch}_EQ|{isin}"

        return f"{exch}_EQ|{sym}"

    def _map_interval(self, interval: str) -> str:
        norm = interval.upper()
        if "DAY" in norm or norm == "ONE_DAY":
            return "day"
        elif "30" in norm:
            return "30minute"
        elif "5" in norm or "FIVE" in norm:
            return "1minute"
        elif "1" in norm or "ONE" in norm:
            return "1minute"
        return "day"

    def fetch_candle_data(
        self,
        instrument: Any,
        *,
        interval: str,
        from_date: str,
        to_date: str,
        cache_path: Path,
    ) -> list[list]:
        self.ensure_session()
        key = self._resolve_instrument_key(instrument)
        upstox_interval = self._map_interval(interval)

        f_date = from_date[:10] if len(from_date) >= 10 else from_date
        t_date = to_date[:10] if len(to_date) >= 10 else to_date
        today_str = now_ist().date().isoformat()

        raw_candles = []
        if t_date >= today_str:
            # 1. Fetch today's live intraday candles
            url_intra = f"{self.BASE_URL}/historical-candle/intraday/{urllib.parse.quote(key)}/{upstox_interval}"
            try:
                res_intra = http_json(url_intra, headers=self.headers(), timeout=20)
                today_candles = (res_intra.get("data") or {}).get("candles") or []
                raw_candles.extend(today_candles)
            except Exception:
                pass

            # 2. If warmup from prior days is requested, fetch historical up to yesterday
            if f_date < today_str:
                try:
                    t_dt = datetime.strptime(today_str, "%Y-%m-%d").date()
                    prev_day = (t_dt - timedelta(days=1)).isoformat()
                    url_hist = f"{self.BASE_URL}/historical-candle/{urllib.parse.quote(key)}/{upstox_interval}/{prev_day}/{f_date}"
                    res_hist = http_json(url_hist, headers=self.headers(), timeout=20)
                    hist_candles = (res_hist.get("data") or {}).get("candles") or []
                    raw_candles.extend(hist_candles)
                except Exception:
                    pass
        else:
            # Pure historical date query
            url = f"{self.BASE_URL}/historical-candle/{urllib.parse.quote(key)}/{upstox_interval}/{t_date}/{f_date}"
            res = http_json(url, headers=self.headers(), timeout=25)
            raw_candles = (res.get("data") or {}).get("candles") or []

        # Deduplicate and sort ascending by timestamp
        seen_times = set()
        candles = []
        for c in sorted(raw_candles, key=lambda x: x[0]):
            ts = c[0]
            if ts not in seen_times:
                seen_times.add(ts)
                candles.append([
                    ts,
                    float(c[1]),
                    float(c[2]),
                    float(c[3]),
                    float(c[4]),
                    int(c[5]) if len(c) > 5 and c[5] is not None else 0,
                ])

        if candles and cache_path:
            write_json_safe(cache_path, {"cached_at": time.time(), "data": candles})
        return candles

    def candle_data(
        self,
        instrument: Any,
        *,
        interval: str,
        from_date: str,
        to_date: str,
        allow_stale: bool = False,
        background_refresh: bool = False,
    ) -> list[list]:
        candle_cache = self.cache_dir / "candles"
        token = getattr(instrument, "token", "") or getattr(instrument, "symbol", "")
        exch = getattr(instrument, "exchange", "NSE")
        cache_hash = hashlib.sha256(f"upstox|{exch}|{token}|{interval}|{from_date}|{to_date}".encode()).hexdigest()
        cache_path = candle_cache / f"{cache_hash}.json"

        cached = read_json_safe(cache_path, {})
        if cached.get("data"):
            cache_age = time.time() - cached.get("cached_at", 0)
            if cache_age < 60 or allow_stale:
                return cached["data"]

        return self.fetch_candle_data(
            instrument,
            interval=interval,
            from_date=from_date,
            to_date=to_date,
            cache_path=cache_path,
        )

    def quote(self, instruments: list[Any], mode: str = "FULL") -> dict:
        self.ensure_session()
        if not instruments:
            return {"fetched": [], "unfetched": []}

        fetched = []
        unfetched = []
        chunk_size = 50

        for i in range(0, len(instruments), chunk_size):
            chunk = instruments[i : i + chunk_size]
            keys = [self._resolve_instrument_key(inst) for inst in chunk]
            keys_str = ",".join(keys)

            url = f"{self.BASE_URL}/market-quote/quotes?instrument_key={urllib.parse.quote(keys_str)}"
            try:
                res = http_json(url, headers=self.headers(), timeout=10)
                data = res.get("data") or {}
                for inst, key in zip(chunk, keys):
                    q = data.get(key) or data.get(key.replace("|", ":"))
                    if q:
                        ohlc = q.get("ohlc") or {}
                        fetched.append({
                            "symbolToken": getattr(inst, "token", ""),
                            "tradingSymbol": getattr(inst, "trading_symbol", ""),
                            "ltp": float(q.get("last_price") or 0.0),
                            "open": float(ohlc.get("open") or 0.0),
                            "high": float(ohlc.get("high") or 0.0),
                            "low": float(ohlc.get("low") or 0.0),
                            "close": float(ohlc.get("close") or 0.0),
                            "volume": int(q.get("volume") or 0),
                            "opnInterest": int(q.get("oi") or 0),
                        })
                    else:
                        unfetched.append({"symbolToken": getattr(inst, "token", "")})
            except Exception:
                unfetched.extend([{"symbolToken": getattr(inst, "token", "")} for inst in chunk])

        return {"fetched": fetched, "unfetched": unfetched}


# ==============================================================================
# 2. ⚡ Kotak Neo Client (Kotak Securities Neo API)
# ==============================================================================
class KotakNeoClient(BaseBrokerClient):
    """
    Kotak Securities Neo API Client.
    Docs: https://neo.kotaksecurities.com/
    Requires: KOTAK_ACCESS_TOKEN (Session Token) or KOTAK_CONSUMER_KEY + KOTAK_MOBILE_NO.
    """
    BASE_URL = "https://napi.kotaksecurities.com"

    def __init__(self, cache_dir: Path | None = None, env_func: Callable[[str, str], str] | None = None):
        self._env = env_func or os.getenv
        self.cache_dir = cache_dir or Path(".cache")
        self.access_token = self._env("KOTAK_ACCESS_TOKEN", "").strip()
        self.consumer_key = self._env("KOTAK_CONSUMER_KEY", "").strip()
        self.consumer_secret = self._env("KOTAK_CONSUMER_SECRET", "").strip()
        self.view_token = self._env("KOTAK_VIEW_TOKEN", "").strip()
        self.mobile_no = self._env("KOTAK_MOBILE_NO", "").strip()
        self.mpin = self._env("KOTAK_MPIN", "").strip()
        self.manual_totp = ""
        self.jwt_token = self.access_token
        self.feed_token = ""

    @property
    def broker_name(self) -> str:
        return "KOTAK"

    def is_configured(self) -> bool:
        return bool(self.access_token or (self.consumer_key and self.mobile_no))

    def load_session(self) -> bool:
        return bool(self.access_token)

    def ensure_session(self) -> None:
        if not self.is_configured():
            raise RuntimeError("Kotak Neo is not configured. Set KOTAK_ACCESS_TOKEN in .env")

    def headers(self) -> dict[str, str]:
        token = self.access_token
        if not token.lower().startswith("bearer "):
            token = f"Bearer {token}"
        headers = {
            "Authorization": token,
            "neo-fin-key": "neotradeapi",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        if self.view_token:
            headers["Sid"] = self.view_token
        return headers

    def fetch_candle_data(
        self,
        instrument: Any,
        *,
        interval: str,
        from_date: str,
        to_date: str,
        cache_path: Path,
    ) -> list[list]:
        self.ensure_session()
        token = getattr(instrument, "token", "")
        exch = getattr(instrument, "exchange", "nse_cm").lower()
        if "nse" in exch:
            segment = "nse_cm"
        elif "bse" in exch:
            segment = "bse_cm"
        else:
            segment = "nse_fo"

        url = f"{self.BASE_URL}/Orders/2.0/quick/user/chart/historic"
        body = {
            "symbol": token,
            "exchange": segment,
            "interval": "D" if "DAY" in interval.upper() else "5",
            "fromDate": from_date[:10],
            "toDate": to_date[:10],
        }
        res = http_json(url, method="POST", body=body, headers=self.headers(), timeout=25)
        raw = res.get("data") or res.get("result") or []
        candles = []
        for c in raw:
            candles.append([
                c.get("time", c.get("date", "")),
                float(c.get("open", 0.0)),
                float(c.get("high", 0.0)),
                float(c.get("low", 0.0)),
                float(c.get("close", 0.0)),
                int(c.get("volume", 0)),
            ])
        if candles and cache_path:
            write_json_safe(cache_path, {"cached_at": time.time(), "data": candles})
        return candles

    def candle_data(
        self,
        instrument: Any,
        *,
        interval: str,
        from_date: str,
        to_date: str,
        allow_stale: bool = False,
        background_refresh: bool = False,
    ) -> list[list]:
        candle_cache = self.cache_dir / "candles"
        token = getattr(instrument, "token", "") or getattr(instrument, "symbol", "")
        exch = getattr(instrument, "exchange", "NSE")
        cache_hash = hashlib.sha256(f"kotak|{exch}|{token}|{interval}|{from_date}|{to_date}".encode()).hexdigest()
        cache_path = candle_cache / f"{cache_hash}.json"

        cached = read_json_safe(cache_path, {})
        if cached.get("data"):
            cache_age = time.time() - cached.get("cached_at", 0)
            if cache_age < 60 or allow_stale:
                return cached["data"]

        return self.fetch_candle_data(
            instrument,
            interval=interval,
            from_date=from_date,
            to_date=to_date,
            cache_path=cache_path,
        )

    def quote(self, instruments: list[Any], mode: str = "FULL") -> dict:
        self.ensure_session()
        if not instruments:
            return {"fetched": [], "unfetched": []}

        fetched = []
        unfetched = []
        tokens = [getattr(inst, "token", "") for inst in instruments if getattr(inst, "token", "")]
        url = f"{self.BASE_URL}/Orders/2.0/quick/user/quotes"
        try:
            res = http_json(url, method="POST", body={"tokens": tokens}, headers=self.headers(), timeout=10)
            data = res.get("data") or []
            lookup = {str(item.get("token")): item for item in data}
            for inst in instruments:
                q = lookup.get(str(getattr(inst, "token", "")))
                if q:
                    fetched.append({
                        "symbolToken": getattr(inst, "token", ""),
                        "tradingSymbol": getattr(inst, "trading_symbol", ""),
                        "ltp": float(q.get("lastPrice") or q.get("ltp") or 0.0),
                        "open": float(q.get("open") or 0.0),
                        "high": float(q.get("high") or 0.0),
                        "low": float(q.get("low") or 0.0),
                        "close": float(q.get("close") or 0.0),
                        "volume": int(q.get("volume") or 0),
                        "opnInterest": int(q.get("oi") or 0),
                    })
                else:
                    unfetched.append({"symbolToken": getattr(inst, "token", "")})
        except Exception:
            unfetched.extend([{"symbolToken": getattr(inst, "token", "")} for inst in instruments])

        return {"fetched": fetched, "unfetched": unfetched}


# ==============================================================================
# 3. 🎯 Fyers Client (Fyers API v3)
# ==============================================================================
class FyersClient(BaseBrokerClient):
    """
    Fyers API v3 Client.
    Docs: https://myapi.fyers.in/docsv3
    Requires: FYERS_APP_ID and FYERS_ACCESS_TOKEN in .env.
    """

    BASE_URL = "https://api-t1.fyers.in"

    def __init__(self, cache_dir: Path | None = None, env_func: Callable[[str, str], str] | None = None):
        self._env = env_func or os.getenv
        self.cache_dir = cache_dir or Path(".cache")
        self.app_id = self._env("FYERS_APP_ID", "").strip()
        self.access_token = self._env("FYERS_ACCESS_TOKEN", "").strip()
        self.manual_totp = ""
        self.jwt_token = self.access_token
        self.feed_token = ""

    @property
    def broker_name(self) -> str:
        return "FYERS"

    def is_configured(self) -> bool:
        return bool(self.app_id and self.access_token)

    def load_session(self) -> bool:
        return bool(self.access_token)

    def ensure_session(self) -> None:
        if not self.is_configured():
            raise RuntimeError("Fyers is not configured. Set FYERS_APP_ID and FYERS_ACCESS_TOKEN in .env")

    def headers(self) -> dict[str, str]:
        auth = f"{self.app_id}:{self.access_token}"
        return {
            "Authorization": auth,
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    def _resolve_fyers_symbol(self, instrument: Any) -> str:
        sym = getattr(instrument, "symbol", "") or ""
        tsym = getattr(instrument, "trading_symbol", "") or ""
        name = getattr(instrument, "name", "") or ""
        exch = getattr(instrument, "exchange", "NSE") or "NSE"

        is_derivative = (
            exch == "NFO"
            or any(tsym.endswith(t) for t in ("CE", "PE", "FUT"))
            or any(f"-{t}" in tsym or f" {t}" in tsym for t in ("CE", "PE", "FUT"))
        )
        if is_derivative and tsym:
            return f"NSE:{tsym}"

        # Check index mapping first across all possible candidate labels/names/symbols
        candidates = [sym, tsym, name]
        for cand in candidates:
            if not cand:
                continue
            clean = str(cand).upper().replace(" ", "").replace("_", "").replace("-", "")
            if clean in FYERS_INDEX_MAP:
                return FYERS_INDEX_MAP[clean]

        return f"{exch}:{sym}-EQ"

    def _map_resolution(self, interval: str) -> str:
        norm = interval.upper()
        if "DAY" in norm or norm == "ONE_DAY":
            return "D"
        elif "30" in norm:
            return "30"
        elif "5" in norm or "FIVE" in norm:
            return "5"
        elif "1" in norm or "ONE" in norm:
            return "1"
        return "D"

    def fetch_candle_data(
        self,
        instrument: Any,
        *,
        interval: str,
        from_date: str,
        to_date: str,
        cache_path: Path,
    ) -> list[list]:
        self.ensure_session()
        fyers_sym = self._resolve_fyers_symbol(instrument)
        res_code = self._map_resolution(interval)

        f_date = from_date[:10]
        t_date = to_date[:10]

        url = (
            f"{self.BASE_URL}/data/history?"
            f"symbol={urllib.parse.quote(fyers_sym)}&"
            f"resolution={res_code}&"
            f"date_format=1&"
            f"range_from={f_date}&"
            f"range_to={t_date}&"
            f"cont_flag=1"
        )
        res = http_json(url, headers=self.headers(), timeout=25)
        raw_candles = res.get("candles") or []

        candles = []
        for c in raw_candles:
            epoch = c[0]
            dt = datetime.fromtimestamp(epoch, tz=IST)
            candles.append([
                dt.isoformat(),
                float(c[1]),
                float(c[2]),
                float(c[3]),
                float(c[4]),
                int(c[5]) if len(c) > 5 else 0,
            ])

        if candles and cache_path:
            write_json_safe(cache_path, {"cached_at": time.time(), "data": candles})
        return candles

    def candle_data(
        self,
        instrument: Any,
        *,
        interval: str,
        from_date: str,
        to_date: str,
        allow_stale: bool = False,
        background_refresh: bool = False,
    ) -> list[list]:
        candle_cache = self.cache_dir / "candles"
        token = getattr(instrument, "token", "") or getattr(instrument, "symbol", "")
        exch = getattr(instrument, "exchange", "NSE")
        cache_hash = hashlib.sha256(f"fyers|{exch}|{token}|{interval}|{from_date}|{to_date}".encode()).hexdigest()
        cache_path = candle_cache / f"{cache_hash}.json"

        cached = read_json_safe(cache_path, {})
        if cached.get("data"):
            cache_age = time.time() - cached.get("cached_at", 0)
            if cache_age < 60 or allow_stale:
                return cached["data"]

        return self.fetch_candle_data(
            instrument,
            interval=interval,
            from_date=from_date,
            to_date=to_date,
            cache_path=cache_path,
        )

    def quote(self, instruments: list[Any], mode: str = "FULL") -> dict:
        self.ensure_session()
        if not instruments:
            return {"fetched": [], "unfetched": []}

        fetched = []
        unfetched = []
        chunk_size = 50

        for i in range(0, len(instruments), chunk_size):
            chunk = instruments[i : i + chunk_size]
            sym_map = {self._resolve_fyers_symbol(inst): inst for inst in chunk}
            symbols_str = ",".join(sym_map.keys())

            url = f"{self.BASE_URL}/data/quotes?symbols={urllib.parse.quote(symbols_str)}"
            try:
                res = http_json(url, headers=self.headers(), timeout=10)
                d_list = res.get("d") or []
                returned_names = set()
                for item in d_list:
                    name = item.get("n", "")
                    returned_names.add(name)
                    inst = sym_map.get(name)
                    v = item.get("v") or {}
                    if inst and v:
                        fetched.append({
                            "symbolToken": getattr(inst, "token", ""),
                            "tradingSymbol": getattr(inst, "trading_symbol", ""),
                            "ltp": float(v.get("lp") or 0.0),
                            "open": float(v.get("open_price") or 0.0),
                            "high": float(v.get("high_price") or 0.0),
                            "low": float(v.get("low_price") or 0.0),
                            "close": float(v.get("prev_close_price") or 0.0),
                            "volume": int(v.get("volume") or 0),
                            "opnInterest": int(v.get("open_interest") or 0),
                        })
                for sym, inst in sym_map.items():
                    if sym not in returned_names:
                        unfetched.append({"symbolToken": getattr(inst, "token", "")})
            except Exception:
                unfetched.extend([{"symbolToken": getattr(inst, "token", "")} for inst in chunk])

        return {"fetched": fetched, "unfetched": unfetched}


# ==============================================================================
# 🏭 Broker Factory & Helpers
# ==============================================================================
def get_active_broker_name(env_func: Callable[[str, str], str] | None = None) -> str:
    _env = env_func or os.getenv
    return (_env("DATA_BROKER", "ANGEL") or "ANGEL").strip().upper()


def get_broker_client(
    angel_client_factory: Callable[[], BaseBrokerClient],
    cache_dir: Path | None = None,
    env_func: Callable[[str, str], str] | None = None,
) -> BaseBrokerClient:
    """
    Returns the appropriate broker client instance based on DATA_BROKER env variable.
    Defaults to AngelClient if not specified or unrecognized.
    """
    broker = get_active_broker_name(env_func)
    if broker == "UPSTOX":
        return UpstoxClient(cache_dir=cache_dir, env_func=env_func)
    elif broker in ("KOTAK", "KOTAK_NEO"):
        return KotakNeoClient(cache_dir=cache_dir, env_func=env_func)
    elif broker == "FYERS":
        return FyersClient(cache_dir=cache_dir, env_func=env_func)
    return angel_client_factory()
