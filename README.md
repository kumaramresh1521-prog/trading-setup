# Intraday X% Breadth Web App

Local dashboard for market breadth using Angel One SmartAPI historical candles.

## What It Calculates

For each NSE symbol, the app builds a percentage Point and Figure style state from intraday closes:

```text
X% Breadth = symbols currently in X column / valid symbols * 100
```

The dashboard plots this value through the trading session and adds 25, 50, and 75 breadth levels.

## Run

```powershell
python server.py
```

Open:

```text
http://127.0.0.1:8000
```

The app runs in sample mode without credentials.

## Angel One Setup

Copy `.env.example` to `.env` and fill:

```text
ANGEL_API_KEY=
ANGEL_CLIENT_CODE=
ANGEL_PIN=
ANGEL_TOTP_SECRET=
```

Then restart `python server.py` and choose `Angel SmartAPI` in the dashboard.

## Notes

- The backend keeps credentials server-side.
- Nifty 50 and Nifty 500 constituents are pulled from NSE Indices CSV when available.
- Angel instrument tokens are resolved through the public OpenAPI scrip master.
- A 500-symbol historical breadth scan means hundreds of candle requests. Start with 50 to 100 symbols, then increase after confirming API limits.
- Use `Run Breadth` for a full scan. After the first scan, use `Refresh` or `Auto refresh`; cached candles are shown immediately while stale live candles update in the background.
- `Carry previous` starts the plotted series from the previous trading day's last available candle, then continues into the selected date.
- For Opstra comparison, use the same universe toggle, full symbol count, 0.15 box, 3 reversal, High/Low basis, 1-minute candles, and a warmup of 5 to 20 sessions.
- The dashboard shows the breadth chart and a selectable index intraday chart side by side. Supported chart indices include Nifty 50, Bank Nifty, FinNifty, Midcap Select, Nifty IT, Auto, Pharma, Metal, FMCG, Energy, Midcap 100, Next 50, and Nifty 500.

## Data Sources

- Angel One official JavaScript SDK README: https://github.com/angel-one/smartapi-javascript
- Angel One official Python SDK route list: https://github.com/angel-one/smartapi-python/blob/main/SmartApi/smartConnect.py
- NSE Nifty 50 index page and constituent CSV: https://www.niftyindices.com/IndexConstituent/ind_nifty50list.csv
- NSE Nifty 500 index page and constituent CSV: https://www.niftyindices.com/IndexConstituent/ind_nifty500list.csv
