import os
import glob
import math
import openpyxl
from datetime import datetime
from typing import Dict, List, Any, Optional

try:
    import greeks
except ImportError:
    import sys
    sys.path.append(os.path.dirname(__file__))
    import greeks

BACKUP_DIR = r"F:\BACKUP\OCT"
DEFAULT_FILE = "Backup 09-10-2024.xlsx"

def list_backup_files(backup_dir: str = BACKUP_DIR) -> List[Dict[str, Any]]:
    """List all available backup Excel files in the target directory."""
    if not os.path.exists(backup_dir):
        return []
    
    files = []
    for f in os.listdir(backup_dir):
        if f.endswith(".xlsx") and not f.startswith("~$"):
            full_path = os.path.join(backup_dir, f)
            size = os.path.getsize(full_path)
            mtime = datetime.fromtimestamp(os.path.getmtime(full_path)).strftime("%Y-%m-%d %H:%M:%S")
            files.append({
                "filename": f,
                "path": full_path,
                "size_kb": round(size / 1024, 1),
                "modified": mtime,
                "is_default": f == DEFAULT_FILE
            })
    files.sort(key=lambda x: x["filename"], reverse=True)
    return files

def clean_val(v):
    """Clean Excel cell values, eliminating #N/A, #DIV/0!, and #VALUE! artifacts."""
    if v is None:
        return None
    if isinstance(v, str):
        v_str = v.strip()
        if v_str.startswith("#") or v_str == "":
            return None
        try:
            return float(v_str)
        except ValueError:
            return v_str
    if isinstance(v, (int, float)):
        if math.isnan(v) or math.isinf(v):
            return None
        return round(float(v), 4)
    return str(v)

def parse_excel_backup(file_path: str) -> Dict[str, Any]:
    """Parse all sheets in an Excel spread backup file."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Backup file not found: {file_path}")

    wb = openpyxl.load_workbook(file_path, data_only=True)
    sheets_data = []

    for sname in wb.sheetnames:
        ws = wb[sname]
        parsed_sheet = parse_sheet_data(ws, sname)
        sheets_data.append(parsed_sheet)

    return {
        "file": os.path.basename(file_path),
        "sheets_count": len(sheets_data),
        "sheets": sheets_data
    }

def parse_sheet_data(ws, sheet_name: str) -> Dict[str, Any]:
    """Parse a single sheet containing options calendar and diagonal spreads."""
    exp1_d = str(ws.cell(2, 2).value or "").strip()
    exp2_d = str(ws.cell(2, 3).value or "").strip()
    exp1_y = str(ws.cell(3, 2).value or "24").strip()
    exp2_y = str(ws.cell(3, 3).value or "24").strip()
    exp1_m = str(ws.cell(4, 2).value or "OCT").strip()
    exp2_m = str(ws.cell(4, 3).value or "OCT").strip()
    
    dte1 = clean_val(ws.cell(4, 4).value)
    dte2 = clean_val(ws.cell(4, 5).value)
    if dte1 is None:
        dte1 = clean_val(ws.cell(4, 5).value)
        dte2 = clean_val(ws.cell(4, 6).value)

    asset = ws.cell(5, 2).value or ("BANKNIFTY" if "BANK" in sheet_name.upper() else "NIFTY")
    asset = str(asset).strip().upper()

    spot1 = clean_val(ws.cell(5, 4).value or ws.cell(5, 5).value or ws.cell(2, 7).value)
    spot2 = clean_val(ws.cell(5, 5).value or ws.cell(5, 6).value)
    if spot1 is None and spot2 is not None:
        spot1 = spot2

    col_map = {}
    header_row_idx = 9
    for r in range(7, 15):
        row_vals = [str(ws.cell(r, c).value or "").upper().strip() for c in range(1, 25)]
        if "BID" in row_vals and ("ASK" in row_vals or "DELTA" in row_vals or "LTP" in row_vals):
            header_row_idx = r
            for c in range(1, 25):
                val = str(ws.cell(r, c).value or "").strip().upper()
                if val and not val.startswith("#"):
                    col_map[val] = c
            break

    def get_c(row_idx, col_name, fallback_col):
        c_idx = col_map.get(col_name, fallback_col)
        return clean_val(ws.cell(row_idx, c_idx).value)

    is_banknifty = asset == "BANKNIFTY"
    fallback_offset = 1 if is_banknifty else 0
    lot_size = 15 if is_banknifty else 25

    records = []
    current_sec = "CALENDAR"

    atm_strike = None
    if spot1:
        step = 100 if is_banknifty else 50
        atm_strike = round(spot1 / step) * step

    for r in range(7, ws.max_row + 1):
        c1 = ws.cell(r, 1).value
        c1_str = str(c1 or "").strip()

        if c1_str and ("-D" in c1_str or "-R" in c1_str or "Rev" in c1_str or (c1_str.endswith("D") and not c1_str.startswith("B"))):
            current_sec = c1_str
            continue

        if r == header_row_idx or c1_str in ["BID", "ASK", "DELTA", "LTP"]:
            continue

        opt_type = ws.cell(r, 1).value
        if not opt_type or str(opt_type).strip() not in ["CE", "PE"]:
            continue
        opt_type = str(opt_type).strip()

        strike1 = clean_val(ws.cell(r, 2).value)
        strike2 = clean_val(ws.cell(r, 3).value)
        if strike1 is None:
            continue
        if strike2 is None:
            strike2 = strike1

        strike_diff = abs(strike1 - strike2)
        if strike_diff == 0:
            spread_category = "Calendar"
            spread_name = f"{opt_type} {int(strike1)} Calendar"
        elif "-R" in current_sec or "Rev" in current_sec:
            spread_category = "Reverse"
            spread_name = f"{opt_type} {int(strike1)}/{int(strike2)} Reverse ({current_sec})"
        else:
            spread_category = "Diagonal"
            spread_name = f"{opt_type} {int(strike1)}/{int(strike2)} Diagonal ({current_sec})"

        bid = get_c(r, "BID", 4 + fallback_offset)
        ask = get_c(r, "ASK", 5 + fallback_offset)
        ltp = get_c(r, "LTP", 6 + fallback_offset)
        vol_or_oi1 = get_c(r, "VOLUME 1ST", 7 + fallback_offset)
        net_delta = get_c(r, "DELTA", 8 + fallback_offset)
        
        vol1 = None
        vol2 = None
        for k in col_map:
            if "VOL" in k and "DIFF" not in k and "16" not in k and "17" not in k and "24" not in k and "07" not in k and ("OCT" in k or "NOV" in k):
                if vol1 is None:
                    vol1 = clean_val(ws.cell(r, col_map[k]).value)
            elif "VOL" in k and ("16" in k or "17" in k or "24" in k or "07" in k):
                vol2 = clean_val(ws.cell(r, col_map[k]).value)

        if vol1 is None:
            vol1 = get_c(r, "31 OCT VOL", 9 + fallback_offset) or get_c(r, "23 OCT VOL", 10) or get_c(r, "28 NOV VOL", 9)
        if vol2 is None:
            vol2 = get_c(r, "24 OCT VOL", 10 + fallback_offset) or get_c(r, "16 OCT VOL", 11) or get_c(r, "17 OCT VOL", 10) or get_c(r, "07 NOV VOL", 10)

        vol_diff = get_c(r, "VOL DIFF", 11 + fallback_offset)
        if vol_diff is None and vol1 is not None and vol2 is not None:
            vol_diff = round(vol1 - vol2, 4)

        delta1 = get_c(r, "DELTA 1ST", 12 + fallback_offset)
        delta2 = get_c(r, "DELTA 2ND", 13 + fallback_offset)
        ratio = get_c(r, "RATIO", 14 + fallback_offset)

        vol_or_oi2 = clean_val(ws.cell(r, 15 + fallback_offset).value)
        vega1 = get_c(r, "1ST VEGA", 16 + fallback_offset)
        vega2 = get_c(r, "2ND VEGA", 17 + fallback_offset)
        gamma1 = get_c(r, "GAMMA1", 18 + fallback_offset)
        gamma2 = get_c(r, "GAMMA2", 19 + fallback_offset)

        leg1_price = get_c(r, "1ST LEG", 20 + fallback_offset)
        leg2_price = get_c(r, "2ND LEG", 21 + fallback_offset)
        
        # Net Spread Debit in points
        net_debit = ltp
        if net_debit is None and leg1_price is not None and leg2_price is not None:
            net_debit = round(leg1_price - leg2_price, 2)
        elif net_debit is not None:
            net_debit = round(net_debit, 2)

        cost_col = get_c(r, "COST", 22 + fallback_offset)
        price_ratio = clean_val(ws.cell(r, 23 + fallback_offset).value)

        is_atm = atm_strike is not None and abs(strike1 - atm_strike) < (26 if not is_banknifty else 51)
        moneyness = "ATM" if is_atm else ("ITM" if (opt_type == "CE" and strike1 < spot1) or (opt_type == "PE" and strike1 > spot1) else "OTM")

        records.append({
            "id": f"{sheet_name}_{r}",
            "row": r,
            "section": current_sec,
            "category": spread_category,
            "type": opt_type,
            "strike1": strike1,
            "strike2": strike2,
            "strike_diff": strike_diff,
            "name": spread_name,
            "moneyness": moneyness,
            "is_atm": is_atm,
            "bid": bid,
            "ask": ask,
            "ltp": ltp,
            "net_debit": net_debit,
            "net_debit_inr": round(net_debit * lot_size, 2) if net_debit is not None else None,
            "net_delta": net_delta,
            "delta1": delta1,
            "delta2": delta2,
            "ratio": ratio,
            "vol1": vol1,
            "vol2": vol2,
            "vol_diff": vol_diff,
            "oi1": vol_or_oi1,
            "oi2": vol_or_oi2,
            "vega1": vega1,
            "vega2": vega2,
            "gamma1": gamma1,
            "gamma2": gamma2,
            "leg1_price": leg1_price,
            "leg2_price": leg2_price,
            "cost_metric": cost_col,
            "price_ratio": price_ratio
        })

    calendars = [x for x in records if x["category"] == "Calendar"]
    diagonals = [x for x in records if x["category"] == "Diagonal"]
    reverses = [x for x in records if x["category"] == "Reverse"]

    valid_vol_diffs = [x["vol_diff"] for x in records if x["vol_diff"] is not None]
    avg_vol_diff = round(sum(valid_vol_diffs) / len(valid_vol_diffs), 4) if valid_vol_diffs else 0.0

    neutral_candidates = sorted([x for x in records if x["net_delta"] is not None], key=lambda x: abs(x["net_delta"]))[:5]
    atm_calendars = [x for x in calendars if x["is_atm"]]

    # Section counts
    section_breakdown = {}
    for r_item in records:
        sec = r_item["section"]
        section_breakdown[sec] = section_breakdown.get(sec, 0) + 1

    return {
        "sheet_id": sheet_name,
        "asset": asset,
        "exp1": f"{exp1_d} {exp1_m} 20{exp1_y}".strip(),
        "exp2": f"{exp2_d} {exp2_m} 20{exp2_y}".strip(),
        "dte1": dte1,
        "dte2": dte2,
        "spot1": spot1,
        "spot2": spot2,
        "lot_size": lot_size,
        "atm_strike": atm_strike,
        "total_records": len(records),
        "calendar_count": len(calendars),
        "diagonal_count": len(diagonals),
        "reverse_count": len(reverses),
        "avg_vol_diff": avg_vol_diff,
        "sections": sorted(list(set(x["section"] for x in records))),
        "section_counts": section_breakdown,
        "atm_spread": atm_calendars[0] if atm_calendars else (calendars[0] if calendars else None),
        "neutral_candidates": neutral_candidates,
        "records": records
    }

def simulate_spread_payoff(spread: Dict[str, Any], spot_price: float, dte1: float = 23, dte2: float = 16, lot_size: int = 25) -> Dict[str, Any]:
    """
    Simulate Black-Scholes payoff profile of the Calendar/Diagonal spread at Near Expiry (T2 = 0).
    """
    k1 = float(spread.get("strike1") or spot_price)
    k2 = float(spread.get("strike2") or spot_price)
    opt_type = spread.get("type", "CE")
    is_ce = opt_type == "CE"
    
    net_debit = spread.get("net_debit")
    if net_debit is None:
        net_debit = float(spread.get("ltp") or 50.0)
    net_debit = float(net_debit)

    # Remaining DTE of Far option when Near option expires
    t_rem = max(1.0, (dte1 - dte2)) / 365.0
    r = 0.07 # Risk-free rate
    sigma = float(spread.get("vol1") or 0.13)
    if sigma <= 0.01:
        sigma = 0.13

    # Scan spot range +/- 5%
    pct_range = 0.05 if lot_size <= 25 else 0.07
    price_min = round((spot_price * (1.0 - pct_range)) / 50) * 50
    price_max = round((spot_price * (1.0 + pct_range)) / 50) * 50
    step = 25 if spot_price < 35000 else 50

    curve = []
    max_profit = -9999999.0
    max_loss = 9999999.0
    breakevens = []
    prev_pnl = None

    for p in range(int(price_min), int(price_max) + step, step):
        # Far option price using Black-Scholes at T2 expiry
        far_price = greeks.bs_price(opt_type, float(p), k1, t_rem, r, sigma)
        
        # Near option intrinsic at T2 expiry (as short leg expires)
        near_intrinsic = max(0.0, float(p) - k2) if is_ce else max(0.0, k2 - float(p))
        
        # Net Spread value at T2 = Far Price - Near Price
        spread_val_at_t2 = far_price - near_intrinsic
        
        # P&L in points & currency
        pnl_pts = spread_val_at_t2 - net_debit
        pnl_inr = round(pnl_pts * lot_size, 1)

        max_profit = max(max_profit, pnl_inr)
        max_loss = min(max_loss, pnl_inr)

        if prev_pnl is not None and ((prev_pnl < 0 and pnl_inr >= 0) or (prev_pnl >= 0 and pnl_inr < 0)):
            breakevens.append(p)
        prev_pnl = pnl_inr

        curve.append({
            "spot": p,
            "pnl": pnl_inr,
            "pnl_pts": round(pnl_pts, 2),
            "far_val": round(far_price, 2),
            "near_val": round(near_intrinsic, 2)
        })

    return {
        "spread_name": spread.get("name"),
        "type": opt_type,
        "strike1": k1,
        "strike2": k2,
        "net_debit_pts": round(net_debit, 2),
        "lot_size": lot_size,
        "net_debit_inr": round(net_debit * lot_size, 2),
        "max_profit_inr": round(max_profit, 2),
        "max_loss_inr": round(max_loss, 2),
        "breakevens": breakevens,
        "curve": curve
    }


LIVE_MATRIX_CACHE: Dict[str, Any] = {}

def build_live_diagonal_matrix(symbol: str = "NIFTY") -> Dict[str, Any]:
    """Generate real-time live dual-expiry diagonal & calendar matrix."""
    global LIVE_MATRIX_CACHE
    import time
    now_ts = time.time()
    if symbol in LIVE_MATRIX_CACHE:
        entry = LIVE_MATRIX_CACHE[symbol]
        if now_ts - entry["time"] < 3.5:
            return entry["data"]

    try:
        import server
        res = server.build_calendar_spread({"symbol": symbol, "strikeRange": 22})
        if not res.get("ok"):
            return None
        
        spot = float(res.get("spot") or 25000.0)
        lot_size = int(res.get("lotSize") or (15 if "BANK" in symbol else 25))
        near_exp = str(res.get("nearExpiry") or "NEAR")
        far_exp = str(res.get("farExpiry") or "FAR")
        meta = res.get("meta") or {}
        dte1 = meta.get("days1", 15)
        dte2 = meta.get("days2", 8)
        
        chain = {}
        for r in res.get("rows", []):
            st = float(r["strike"])
            chain[st] = r
            
        strikes = sorted(chain.keys())
        is_bank = "BANK" in symbol
        step = 100 if is_bank else 50
        
        records = []
        row_num = 1
        
        # 1. Equal-Strike Calendars
        for st in strikes:
            r = chain[st]
            for opt_type in ["CE", "PE"]:
                leg_data = r.get(opt_type.lower()) or {}
                records.append({
                    "row": row_num,
                    "section": "CALENDAR",
                    "category": "Calendar",
                    "type": opt_type,
                    "strike1": st,
                    "strike2": st,
                    "strike_diff": 0,
                    "name": f"{opt_type} {int(st)} Calendar",
                    "is_atm": bool(r.get("isAtm", False)),
                    "bid": leg_data.get("bid_spread"),
                    "ask": leg_data.get("ask_spread"),
                    "ltp": leg_data.get("ltp_spread"),
                    "oi1": leg_data.get("oi1"),
                    "oi2": leg_data.get("oi2"),
                    "net_delta": leg_data.get("net_delta"),
                    "vol1": round(leg_data.get("vol1", 0)/100.0, 4) if leg_data.get("vol1") else None,
                    "vol2": round(leg_data.get("vol2", 0)/100.0, 4) if leg_data.get("vol2") else None,
                    "vol_diff": round(leg_data.get("vol_diff", 0)/100.0, 4) if leg_data.get("vol_diff") else None,
                    "delta1": leg_data.get("delta1"),
                    "delta2": leg_data.get("delta2"),
                    "ratio": leg_data.get("ratio"),
                    "vega1": leg_data.get("vega1"),
                    "vega2": leg_data.get("vega2"),
                    "gamma1": leg_data.get("gamma1"),
                    "gamma2": leg_data.get("gamma2"),
                    "leg1_price": leg_data.get("leg1_ltp"),
                    "leg2_price": leg_data.get("leg2_ltp"),
                    "cost_metric": round(leg_data.get("cost", 0) / (lot_size * 100), 2) if leg_data.get("cost") else None
                })
                row_num += 1
                
        # 2. Diagonals
        offsets = [50, 100, 150, 200, 300, 400, 500] if not is_bank else [100, 200, 300, 400, 500, 600, 700]
        for offset in offsets:
            sec_name = f"{offset}-D"
            for st1 in strikes:
                st2 = st1 - offset
                if st2 in chain:
                    r1 = chain[st1]
                    r2 = chain[st2]
                    for opt_type in ["CE", "PE"]:
                        leg1 = r1.get(opt_type.lower()) or {}
                        leg2 = r2.get(opt_type.lower()) or {}
                        p1 = float(leg1.get("leg1_ltp") or 0)
                        p2 = float(leg2.get("leg2_ltp") or 0)
                        spread_ltp = round(p1 - p2, 2)
                        d1 = float(leg1.get("delta1") or 0)
                        d2 = float(leg2.get("delta2") or 0)
                        net_d = round(d1 - d2, 4)
                        records.append({
                            "row": row_num,
                            "section": sec_name,
                            "category": "Diagonal",
                            "type": opt_type,
                            "strike1": st1,
                            "strike2": st2,
                            "strike_diff": offset,
                            "name": f"{opt_type} {int(st1)}/{int(st2)} Diagonal ({sec_name})",
                            "is_atm": False,
                            "bid": round(float(leg1.get("bid_spread") or 0) - float(leg2.get("ask_spread") or 0), 2),
                            "ask": round(float(leg1.get("ask_spread") or 0) - float(leg2.get("bid_spread") or 0), 2),
                            "ltp": spread_ltp,
                            "oi1": leg1.get("oi1"),
                            "oi2": leg2.get("oi2"),
                            "net_delta": net_d,
                            "vol1": round(float(leg1.get("vol1", 0))/100.0, 4) if leg1.get("vol1") else None,
                            "vol2": round(float(leg2.get("vol2", 0))/100.0, 4) if leg2.get("vol2") else None,
                            "vol_diff": round((float(leg1.get("vol1", 0)) - float(leg2.get("vol2", 0)))/100.0, 4),
                            "delta1": d1,
                            "delta2": d2,
                            "ratio": round(d1 / d2, 2) if d2 != 0 else None,
                            "vega1": leg1.get("vega1"),
                            "vega2": leg2.get("vega2"),
                            "gamma1": leg1.get("gamma1"),
                            "gamma2": leg2.get("gamma2"),
                            "leg1_price": p1,
                            "leg2_price": p2,
                            "cost_metric": round(spread_ltp, 2)
                        })
                        row_num += 1

        now_str = datetime.now().strftime("%H:%M:%S")
        valid_skews = [r["vol_diff"] for r in records if r["vol_diff"] is not None]
        avg_skew = round(sum(valid_skews) / len(valid_skews), 4) if valid_skews else 0.0

        result = {
            "is_live": True,
            "timestamp": now_str,
            "asset": symbol,
            "exp1": far_exp,
            "exp2": near_exp,
            "dte1": dte1,
            "dte2": dte2,
            "spot1": spot,
            "lot_size": lot_size,
            "total_records": len(records),
            "avg_vol_diff": avg_skew,
            "sections": sorted(list(set(r["section"] for r in records))),
            "records": records
        }
        LIVE_MATRIX_CACHE[symbol] = {"time": now_ts, "data": result}
        return result
    except Exception as ex:
        print(f"Error in build_live_diagonal_matrix: {ex}")
        return None
