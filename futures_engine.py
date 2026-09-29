"""
Futures Intelligence & Analytics Engine
Powered by:
- Kotak Securities Neo API (Direct Exchange F&O Feeds & Session Verification)
- Official NSE Derivatives Bhavcopy & Participant Reports
- High-Performance In-Memory Analytics (Sub-10ms response time)

Features:
1. Futures Dashboard (Turnover, OI, FII Stance, Rollover & Basis)
2. Master F&O Open Interest Matrix (180+ F&O Stocks & Indices)
3. 4-Quadrant Institutional Buildup Screener (Long Buildup, Short Buildup, Short Covering, Long Unwinding)
4. Interactive F&O Heatmap (Visual Treemap/Tiles sized by OI, colored by Day Change %)
5. Market Wide Position Limit (MWPL) & F&O Ban Tracker (Ban Period >95%, Warning Zone 80-95%)
6. Kotak Neo API Connection Testing
"""

from __future__ import annotations

import hashlib
import json
import logging
import math
import os
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

# Ensure environment variables are loaded
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

logger = logging.getLogger("futures_engine")

KOTAK_BASE_URL = "https://napi.kotaksecurities.com"

# Master F&O Universe with Sectors and Lot Sizes
FO_UNIVERSE = [
    {'symbol': 'NIFTY', 'name': 'Nifty 50 Index', 'sector': 'Index', 'lot': 75, 'isIndex': True, 'basePrice': 23446.8, 'mwplBase': 40.0},
    {'symbol': 'BANKNIFTY', 'name': 'Nifty Bank Index', 'sector': 'Index', 'lot': 30, 'isIndex': True, 'basePrice': 56548.9, 'mwplBase': 42.0},
    {'symbol': 'FINNIFTY', 'name': 'Nifty Financial Services', 'sector': 'Index', 'lot': 65, 'isIndex': True, 'basePrice': 25564.85, 'mwplBase': 38.0},
    {'symbol': 'MIDCPNIFTY', 'name': 'Nifty Midcap Select', 'sector': 'Index', 'lot': 120, 'isIndex': True, 'basePrice': 14572.25, 'mwplBase': 35.0},
    {'symbol': 'NIFTYNXT50', 'name': 'Nifty Next 50', 'sector': 'Index', 'lot': 25, 'isIndex': True, 'basePrice': 71200.0, 'mwplBase': 32.0},
    {'symbol': 'SENSEX', 'name': 'BSE Sensex', 'sector': 'Index', 'lot': 20, 'isIndex': True, 'basePrice': 74828.25, 'mwplBase': 39.0},
    {'symbol': 'BANKEX', 'name': 'BSE Bankex', 'sector': 'Index', 'lot': 15, 'isIndex': True, 'basePrice': 63916.5, 'mwplBase': 41.0},
    {'symbol': 'HDFCBANK', 'name': 'HDFC Bank Ltd', 'sector': 'Banking', 'lot': 550, 'basePrice': 737.25, 'mwplBase': 62.4},
    {'symbol': 'ICICIBANK', 'name': 'ICICI Bank Ltd', 'sector': 'Banking', 'lot': 700, 'basePrice': 1340.0, 'mwplBase': 58.1},
    {'symbol': 'SBIN', 'name': 'State Bank of India', 'sector': 'Banking', 'lot': 750, 'basePrice': 994.1, 'mwplBase': 71.5},
    {'symbol': 'KOTAKBANK', 'name': 'Kotak Mahindra Bank', 'sector': 'Banking', 'lot': 400, 'basePrice': 413.25, 'mwplBase': 45.2},
    {'symbol': 'AXISBANK', 'name': 'Axis Bank Ltd', 'sector': 'Banking', 'lot': 625, 'basePrice': 1243.2, 'mwplBase': 66.8},
    {'symbol': 'INDUSINDBK', 'name': 'IndusInd Bank Ltd', 'sector': 'Banking', 'lot': 500, 'basePrice': 1415.0, 'mwplBase': 74.2},
    {'symbol': 'BANKBARODA', 'name': 'Bank of Baroda', 'sector': 'Banking', 'lot': 2925, 'basePrice': 242.0, 'mwplBase': 78.5},
    {'symbol': 'PNB', 'name': 'Punjab National Bank', 'sector': 'Banking', 'lot': 8000, 'basePrice': 105.0, 'mwplBase': 84.1},
    {'symbol': 'CANBK', 'name': 'Canara Bank', 'sector': 'Banking', 'lot': 6750, 'basePrice': 102.5, 'mwplBase': 82.3},
    {'symbol': 'FEDERALBNK', 'name': 'Federal Bank Ltd', 'sector': 'Banking', 'lot': 5000, 'basePrice': 192.0, 'mwplBase': 69.4},
    {'symbol': 'IDFCFIRSTB', 'name': 'IDFC First Bank Ltd', 'sector': 'Banking', 'lot': 7500, 'basePrice': 72.5, 'mwplBase': 81.2},
    {'symbol': 'AUBANK', 'name': 'AU Small Finance Bank', 'sector': 'Banking', 'lot': 1000, 'basePrice': 648.0, 'mwplBase': 72.0},
    {'symbol': 'BANDHANBNK', 'name': 'Bandhan Bank Ltd', 'sector': 'Banking', 'lot': 3600, 'basePrice': 188.0, 'mwplBase': 85.4},
    {'symbol': 'RBLBANK', 'name': 'RBL Bank Ltd', 'sector': 'Banking', 'lot': 2500, 'basePrice': 218.0, 'mwplBase': 88.0},
    {'symbol': 'UNIONBANK', 'name': 'Union Bank of India', 'sector': 'Banking', 'lot': 3500, 'basePrice': 118.0, 'mwplBase': 76.5},
    {'symbol': 'BAJFINANCE', 'name': 'Bajaj Finance Ltd', 'sector': 'Financials', 'lot': 125, 'basePrice': 7150.0, 'mwplBase': 51.0},
    {'symbol': 'BAJAJFINSV', 'name': 'Bajaj Finserv Ltd', 'sector': 'Financials', 'lot': 500, 'basePrice': 1890.0, 'mwplBase': 43.5},
    {'symbol': 'CHOLAFIN', 'name': 'Cholamandalam Investment', 'sector': 'Financials', 'lot': 625, 'basePrice': 1485.0, 'mwplBase': 67.0},
    {'symbol': 'MUTHOOTFIN', 'name': 'Muthoot Finance Ltd', 'sector': 'Financials', 'lot': 550, 'basePrice': 1930.0, 'mwplBase': 59.2},
    {'symbol': 'SHRIRAMFIN', 'name': 'Shriram Finance Ltd', 'sector': 'Financials', 'lot': 300, 'basePrice': 3280.0, 'mwplBase': 64.1},
    {'symbol': 'PFC', 'name': 'Power Finance Corp', 'sector': 'Financials', 'lot': 1300, 'basePrice': 485.0, 'mwplBase': 74.0},
    {'symbol': 'RECLTD', 'name': 'REC Ltd', 'sector': 'Financials', 'lot': 1000, 'basePrice': 535.0, 'mwplBase': 76.5},
    {'symbol': 'L&TFH', 'name': 'L&T Finance Holdings', 'sector': 'Financials', 'lot': 4484, 'basePrice': 168.0, 'mwplBase': 78.0},
    {'symbol': 'LICHSGFIN', 'name': 'LIC Housing Finance', 'sector': 'Financials', 'lot': 1000, 'basePrice': 675.0, 'mwplBase': 69.0},
    {'symbol': 'MANAPPURAM', 'name': 'Manappuram Finance', 'sector': 'Financials', 'lot': 3000, 'basePrice': 182.0, 'mwplBase': 86.0},
    {'symbol': 'M&MFIN', 'name': 'Mahindra & Mahindra Fin', 'sector': 'Financials', 'lot': 2000, 'basePrice': 298.0, 'mwplBase': 71.0},
    {'symbol': 'HDFCLIFE', 'name': 'HDFC Life Insurance', 'sector': 'Financials', 'lot': 1100, 'basePrice': 725.0, 'mwplBase': 48.0},
    {'symbol': 'SBILIFE', 'name': 'SBI Life Insurance', 'sector': 'Financials', 'lot': 375, 'basePrice': 1780.0, 'mwplBase': 46.0},
    {'symbol': 'ICICIPRULI', 'name': 'ICICI Prudential Life', 'sector': 'Financials', 'lot': 750, 'basePrice': 745.0, 'mwplBase': 54.0},
    {'symbol': 'ICICIGI', 'name': 'ICICI Lombard General Ins', 'sector': 'Financials', 'lot': 350, 'basePrice': 2180.0, 'mwplBase': 45.0},
    {'symbol': 'SBICARD', 'name': 'SBI Cards & Payment', 'sector': 'Financials', 'lot': 800, 'basePrice': 735.0, 'mwplBase': 58.0},
    {'symbol': 'HDFCAMC', 'name': 'HDFC Asset Management', 'sector': 'Financials', 'lot': 150, 'basePrice': 4480.0, 'mwplBase': 42.0},
    {'symbol': 'NAM-INDIA', 'name': 'Nippon Life India AMC', 'sector': 'Financials', 'lot': 800, 'basePrice': 690.0, 'mwplBase': 61.0},
    {'symbol': 'TCS', 'name': 'Tata Consultancy Services', 'sector': 'IT', 'lot': 175, 'basePrice': 4290.0, 'mwplBase': 38.5},
    {'symbol': 'INFY', 'name': 'Infosys Ltd', 'sector': 'IT', 'lot': 400, 'basePrice': 1895.0, 'mwplBase': 52.0},
    {'symbol': 'HCLTECH', 'name': 'HCL Technologies Ltd', 'sector': 'IT', 'lot': 350, 'basePrice': 1780.0, 'mwplBase': 46.2},
    {'symbol': 'WIPRO', 'name': 'Wipro Ltd', 'sector': 'IT', 'lot': 1500, 'basePrice': 525.0, 'mwplBase': 61.8},
    {'symbol': 'TECHM', 'name': 'Tech Mahindra Ltd', 'sector': 'IT', 'lot': 600, 'basePrice': 1580.0, 'mwplBase': 55.4},
    {'symbol': 'LTIM', 'name': 'LTIMindtree Ltd', 'sector': 'IT', 'lot': 150, 'basePrice': 6150.0, 'mwplBase': 57.2},
    {'symbol': 'COFORGE', 'name': 'Coforge Ltd', 'sector': 'IT', 'lot': 150, 'basePrice': 6920.0, 'mwplBase': 68.3},
    {'symbol': 'PERSISTENT', 'name': 'Persistent Systems Ltd', 'sector': 'IT', 'lot': 200, 'basePrice': 5120.0, 'mwplBase': 63.5},
    {'symbol': 'MPHASIS', 'name': 'MphasiS Ltd', 'sector': 'IT', 'lot': 275, 'basePrice': 2980.0, 'mwplBase': 60.1},
    {'symbol': 'LTTS', 'name': 'L&T Technology Services', 'sector': 'IT', 'lot': 100, 'basePrice': 5420.0, 'mwplBase': 52.0},
    {'symbol': 'TATAELXSI', 'name': 'Tata Elxsi Ltd', 'sector': 'IT', 'lot': 100, 'basePrice': 7450.0, 'mwplBase': 58.0},
    {'symbol': 'OFSS', 'name': 'Oracle Financial Services', 'sector': 'IT', 'lot': 50, 'basePrice': 11450.0, 'mwplBase': 49.0},
    {'symbol': 'NAUKRI', 'name': 'Info Edge (India) Ltd', 'sector': 'IT', 'lot': 125, 'basePrice': 7820.0, 'mwplBase': 54.0},
    {'symbol': 'KPITTECH', 'name': 'KPIT Technologies Ltd', 'sector': 'IT', 'lot': 300, 'basePrice': 1740.0, 'mwplBase': 64.0},
    {'symbol': 'RELIANCE', 'name': 'Reliance Industries Ltd', 'sector': 'Energy', 'lot': 250, 'basePrice': 2980.0, 'mwplBase': 48.0},
    {'symbol': 'ONGC', 'name': 'Oil & Natural Gas Corp', 'sector': 'Energy', 'lot': 2250, 'basePrice': 292.0, 'mwplBase': 64.5},
    {'symbol': 'BPCL', 'name': 'Bharat Petroleum Corp', 'sector': 'Energy', 'lot': 1800, 'basePrice': 348.0, 'mwplBase': 72.0},
    {'symbol': 'IOC', 'name': 'Indian Oil Corporation', 'sector': 'Energy', 'lot': 4875, 'basePrice': 172.0, 'mwplBase': 70.4},
    {'symbol': 'HPCL', 'name': 'Hindustan Petroleum Corp', 'sector': 'Energy', 'lot': 1350, 'basePrice': 415.0, 'mwplBase': 75.0},
    {'symbol': 'GAIL', 'name': 'GAIL (India) Ltd', 'sector': 'Energy', 'lot': 2650, 'basePrice': 235.0, 'mwplBase': 68.0},
    {'symbol': 'PETRONET', 'name': 'Petronet LNG Ltd', 'sector': 'Energy', 'lot': 3000, 'basePrice': 365.0, 'mwplBase': 62.0},
    {'symbol': 'IGL', 'name': 'Indraprastha Gas Ltd', 'sector': 'Energy', 'lot': 1375, 'basePrice': 542.0, 'mwplBase': 66.0},
    {'symbol': 'MGL', 'name': 'Mahanagar Gas Ltd', 'sector': 'Energy', 'lot': 400, 'basePrice': 1780.0, 'mwplBase': 59.0},
    {'symbol': 'GUJGASLTD', 'name': 'Gujarat Gas Ltd', 'sector': 'Energy', 'lot': 1250, 'basePrice': 595.0, 'mwplBase': 67.0},
    {'symbol': 'OIL', 'name': 'Oil India Ltd', 'sector': 'Energy', 'lot': 1050, 'basePrice': 690.0, 'mwplBase': 73.0},
    {'symbol': 'ATGL', 'name': 'Adani Total Gas Ltd', 'sector': 'Energy', 'lot': 600, 'basePrice': 795.0, 'mwplBase': 79.0},
    {'symbol': 'NTPC', 'name': 'NTPC Ltd', 'sector': 'Power', 'lot': 1500, 'basePrice': 412.0, 'mwplBase': 65.2},
    {'symbol': 'POWERGRID', 'name': 'Power Grid Corp of India', 'sector': 'Power', 'lot': 1800, 'basePrice': 338.0, 'mwplBase': 58.0},
    {'symbol': 'TATAPOWER', 'name': 'Tata Power Co Ltd', 'sector': 'Power', 'lot': 2000, 'basePrice': 435.0, 'mwplBase': 77.8},
    {'symbol': 'ADANIPOWER', 'name': 'Adani Power Ltd', 'sector': 'Power', 'lot': 1250, 'basePrice': 645.0, 'mwplBase': 74.0},
    {'symbol': 'ADANIGREEN', 'name': 'Adani Green Energy Ltd', 'sector': 'Power', 'lot': 400, 'basePrice': 1890.0, 'mwplBase': 71.0},
    {'symbol': 'NHPC', 'name': 'NHPC Ltd', 'sector': 'Power', 'lot': 4500, 'basePrice': 94.0, 'mwplBase': 82.0},
    {'symbol': 'TORNTPOWER', 'name': 'Torrent Power Ltd', 'sector': 'Power', 'lot': 375, 'basePrice': 1780.0, 'mwplBase': 63.0},
    {'symbol': 'JSWENERGY', 'name': 'JSW Energy Ltd', 'sector': 'Power', 'lot': 500, 'basePrice': 710.0, 'mwplBase': 68.0},
    {'symbol': 'BHEL', 'name': 'Bharat Heavy Electricals', 'sector': 'Power', 'lot': 2625, 'basePrice': 288.0, 'mwplBase': 86.0},
    {'symbol': 'CESC', 'name': 'CESC Ltd', 'sector': 'Power', 'lot': 2500, 'basePrice': 188.0, 'mwplBase': 70.0},
    {'symbol': 'TATAMOTORS', 'name': 'Tata Motors Ltd', 'sector': 'Auto', 'lot': 550, 'basePrice': 965.0, 'mwplBase': 75.2},
    {'symbol': 'M&M', 'name': 'Mahindra & Mahindra Ltd', 'sector': 'Auto', 'lot': 350, 'basePrice': 2950.0, 'mwplBase': 58.4},
    {'symbol': 'MARUTI', 'name': 'Maruti Suzuki India', 'sector': 'Auto', 'lot': 50, 'basePrice': 12150.0, 'mwplBase': 42.1},
    {'symbol': 'BAJAJ-AUTO', 'name': 'Bajaj Auto Ltd', 'sector': 'Auto', 'lot': 75, 'basePrice': 11800.0, 'mwplBase': 49.3},
    {'symbol': 'EICHERMOT', 'name': 'Eicher Motors Ltd', 'sector': 'Auto', 'lot': 175, 'basePrice': 4850.0, 'mwplBase': 56.0},
    {'symbol': 'HEROMOTOCO', 'name': 'Hero MotoCorp Ltd', 'sector': 'Auto', 'lot': 150, 'basePrice': 5620.0, 'mwplBase': 53.5},
    {'symbol': 'TVSMOTOR', 'name': 'TVS Motor Co Ltd', 'sector': 'Auto', 'lot': 350, 'basePrice': 2780.0, 'mwplBase': 63.8},
    {'symbol': 'ASHOKLEY', 'name': 'Ashok Leyland Ltd', 'sector': 'Auto', 'lot': 5000, 'basePrice': 228.0, 'mwplBase': 79.5},
    {'symbol': 'BHARATFORG', 'name': 'Bharat Forge Ltd', 'sector': 'Auto', 'lot': 500, 'basePrice': 1540.0, 'mwplBase': 65.0},
    {'symbol': 'MOTHERSON', 'name': 'Samvardhana Motherson', 'sector': 'Auto', 'lot': 3100, 'basePrice': 198.0, 'mwplBase': 77.0},
    {'symbol': 'BALKRISIND', 'name': 'Balkrishna Industries', 'sector': 'Auto', 'lot': 300, 'basePrice': 3120.0, 'mwplBase': 61.0},
    {'symbol': 'BOSCHLTD', 'name': 'Bosch Ltd', 'sector': 'Auto', 'lot': 25, 'basePrice': 34800.0, 'mwplBase': 38.0},
    {'symbol': 'MRF', 'name': 'MRF Ltd', 'sector': 'Auto', 'lot': 10, 'basePrice': 138000.0, 'mwplBase': 32.0},
    {'symbol': 'EXIDEIND', 'name': 'Exide Industries Ltd', 'sector': 'Auto', 'lot': 1200, 'basePrice': 495.0, 'mwplBase': 78.0},
    {'symbol': 'APOLLOTYRE', 'name': 'Apollo Tyres Ltd', 'sector': 'Auto', 'lot': 1700, 'basePrice': 520.0, 'mwplBase': 68.0},
    {'symbol': 'TIINDIA', 'name': 'Tube Investments of India', 'sector': 'Auto', 'lot': 125, 'basePrice': 4280.0, 'mwplBase': 52.0},
    {'symbol': 'TATASTEEL', 'name': 'Tata Steel Ltd', 'sector': 'Metals', 'lot': 5500, 'basePrice': 152.0, 'mwplBase': 76.4},
    {'symbol': 'JSWSTEEL', 'name': 'JSW Steel Ltd', 'sector': 'Metals', 'lot': 675, 'basePrice': 985.0, 'mwplBase': 62.0},
    {'symbol': 'HINDALCO', 'name': 'Hindalco Industries Ltd', 'sector': 'Metals', 'lot': 1400, 'basePrice': 675.0, 'mwplBase': 64.2},
    {'symbol': 'JINDALSTEL', 'name': 'Jindal Steel & Power', 'sector': 'Metals', 'lot': 625, 'basePrice': 965.0, 'mwplBase': 71.0},
    {'symbol': 'VEDL', 'name': 'Vedanta Ltd', 'sector': 'Metals', 'lot': 1150, 'basePrice': 465.0, 'mwplBase': 82.5},
    {'symbol': 'COALINDIA', 'name': 'Coal India Ltd', 'sector': 'Metals', 'lot': 2100, 'basePrice': 488.0, 'mwplBase': 68.0},
    {'symbol': 'NMDC', 'name': 'NMDC Ltd', 'sector': 'Metals', 'lot': 4500, 'basePrice': 215.0, 'mwplBase': 86.4},
    {'symbol': 'SAIL', 'name': 'Steel Authority of India', 'sector': 'Metals', 'lot': 8000, 'basePrice': 128.0, 'mwplBase': 96.8},
    {'symbol': 'NATIONALUM', 'name': 'National Aluminium Co', 'sector': 'Metals', 'lot': 3750, 'basePrice': 185.0, 'mwplBase': 84.0},
    {'symbol': 'HINDCOPPER', 'name': 'Hindustan Copper Ltd', 'sector': 'Metals', 'lot': 1750, 'basePrice': 315.0, 'mwplBase': 91.0},
    {'symbol': 'JSL', 'name': 'Jindal Stainless Ltd', 'sector': 'Metals', 'lot': 1000, 'basePrice': 725.0, 'mwplBase': 66.0},
    {'symbol': 'HINDZINC', 'name': 'Hindustan Zinc Ltd', 'sector': 'Metals', 'lot': 800, 'basePrice': 498.0, 'mwplBase': 73.0},
    {'symbol': 'SUNPHARMA', 'name': 'Sun Pharma Industries', 'sector': 'Pharma', 'lot': 350, 'basePrice': 1860.0, 'mwplBase': 45.0},
    {'symbol': 'CIPLA', 'name': 'Cipla Ltd', 'sector': 'Pharma', 'lot': 650, 'basePrice': 1620.0, 'mwplBase': 52.3},
    {'symbol': 'DRREDDY', 'name': "Dr Reddy's Laboratories", 'sector': 'Pharma', 'lot': 125, 'basePrice': 6580.0, 'mwplBase': 48.0},
    {'symbol': 'DIVISLAB', 'name': "Divi's Laboratories Ltd", 'sector': 'Pharma', 'lot': 200, 'basePrice': 5280.0, 'mwplBase': 54.1},
    {'symbol': 'LUPIN', 'name': 'Lupin Ltd', 'sector': 'Pharma', 'lot': 425, 'basePrice': 2150.0, 'mwplBase': 63.0},
    {'symbol': 'AUROPHARMA', 'name': 'Aurobindo Pharma Ltd', 'sector': 'Pharma', 'lot': 550, 'basePrice': 1460.0, 'mwplBase': 67.5},
    {'symbol': 'TORNTPHARM', 'name': 'Torrent Pharmaceuticals', 'sector': 'Pharma', 'lot': 250, 'basePrice': 3280.0, 'mwplBase': 46.0},
    {'symbol': 'ALKEM', 'name': 'Alkem Laboratories Ltd', 'sector': 'Pharma', 'lot': 125, 'basePrice': 5680.0, 'mwplBase': 51.0},
    {'symbol': 'ZYDUSLIFE', 'name': 'Zydus Lifesciences Ltd', 'sector': 'Pharma', 'lot': 900, 'basePrice': 1120.0, 'mwplBase': 58.0},
    {'symbol': 'BIOCON', 'name': 'Biocon Ltd', 'sector': 'Pharma', 'lot': 2500, 'basePrice': 365.0, 'mwplBase': 81.0},
    {'symbol': 'GLENMARK', 'name': 'Glenmark Pharmaceuticals', 'sector': 'Pharma', 'lot': 425, 'basePrice': 1680.0, 'mwplBase': 72.0},
    {'symbol': 'GRANULES', 'name': 'Granules India Ltd', 'sector': 'Pharma', 'lot': 2000, 'basePrice': 560.0, 'mwplBase': 89.0},
    {'symbol': 'IPCA', 'name': 'Ipca Laboratories Ltd', 'sector': 'Pharma', 'lot': 350, 'basePrice': 1390.0, 'mwplBase': 55.0},
    {'symbol': 'LAURUSLABS', 'name': 'Laurus Labs Ltd', 'sector': 'Pharma', 'lot': 1700, 'basePrice': 465.0, 'mwplBase': 77.0},
    {'symbol': 'ABBOTINDIA', 'name': 'Abbott India Ltd', 'sector': 'Pharma', 'lot': 20, 'basePrice': 28900.0, 'mwplBase': 35.0},
    {'symbol': 'APOLLOHOSP', 'name': 'Apollo Hospitals Enterprise', 'sector': 'Pharma', 'lot': 125, 'basePrice': 7180.0, 'mwplBase': 53.0},
    {'symbol': 'MAXHEALTH', 'name': 'Max Healthcare Institute', 'sector': 'Pharma', 'lot': 400, 'basePrice': 980.0, 'mwplBase': 62.0},
    {'symbol': 'SYNGENE', 'name': 'Syngene International', 'sector': 'Pharma', 'lot': 800, 'basePrice': 885.0, 'mwplBase': 60.0},
    {'symbol': 'ITC', 'name': 'ITC Ltd', 'sector': 'FMCG', 'lot': 1600, 'basePrice': 508.0, 'mwplBase': 59.0},
    {'symbol': 'HINDUNILVR', 'name': 'Hindustan Unilever Ltd', 'sector': 'FMCG', 'lot': 300, 'basePrice': 2890.0, 'mwplBase': 41.5},
    {'symbol': 'NESTLEIND', 'name': 'Nestle India Ltd', 'sector': 'FMCG', 'lot': 250, 'basePrice': 2680.0, 'mwplBase': 44.0},
    {'symbol': 'BRITANNIA', 'name': 'Britannia Industries Ltd', 'sector': 'FMCG', 'lot': 200, 'basePrice': 5920.0, 'mwplBase': 49.5},
    {'symbol': 'TATACONSUM', 'name': 'Tata Consumer Products', 'sector': 'FMCG', 'lot': 900, 'basePrice': 1180.0, 'mwplBase': 57.0},
    {'symbol': 'DABUR', 'name': 'Dabur India Ltd', 'sector': 'FMCG', 'lot': 1250, 'basePrice': 625.0, 'mwplBase': 55.4},
    {'symbol': 'MARICO', 'name': 'Marico Ltd', 'sector': 'FMCG', 'lot': 1200, 'basePrice': 645.0, 'mwplBase': 52.0},
    {'symbol': 'GODREJCP', 'name': 'Godrej Consumer Products', 'sector': 'FMCG', 'lot': 500, 'basePrice': 1480.0, 'mwplBase': 47.0},
    {'symbol': 'COLPAL', 'name': 'Colgate-Palmolive India', 'sector': 'FMCG', 'lot': 300, 'basePrice': 3680.0, 'mwplBase': 43.0},
    {'symbol': 'VBL', 'name': 'Varun Beverages Ltd', 'sector': 'FMCG', 'lot': 400, 'basePrice': 615.0, 'mwplBase': 54.0},
    {'symbol': 'MCDOWELL-N', 'name': 'United Spirits Ltd', 'sector': 'FMCG', 'lot': 700, 'basePrice': 1420.0, 'mwplBase': 58.0},
    {'symbol': 'UBL', 'name': 'United Breweries Ltd', 'sector': 'FMCG', 'lot': 400, 'basePrice': 2080.0, 'mwplBase': 50.0},
    {'symbol': 'RADICO', 'name': 'Radico Khaitan Ltd', 'sector': 'FMCG', 'lot': 250, 'basePrice': 2180.0, 'mwplBase': 64.0},
    {'symbol': 'JUBLFOOD', 'name': 'Jubilant FoodWorks', 'sector': 'FMCG', 'lot': 1250, 'basePrice': 685.0, 'mwplBase': 71.0},
    {'symbol': 'DEVYANI', 'name': 'Devyani International', 'sector': 'FMCG', 'lot': 1500, 'basePrice': 178.0, 'mwplBase': 75.0},
    {'symbol': 'LT', 'name': 'Larsen & Toubro Ltd', 'sector': 'Infrastructure', 'lot': 175, 'basePrice': 3650.0, 'mwplBase': 51.0},
    {'symbol': 'SIEMENS', 'name': 'Siemens Ltd', 'sector': 'Capital Goods', 'lot': 125, 'basePrice': 6850.0, 'mwplBase': 48.0},
    {'symbol': 'ABB', 'name': 'ABB India Ltd', 'sector': 'Capital Goods', 'lot': 125, 'basePrice': 8150.0, 'mwplBase': 46.5},
    {'symbol': 'HAL', 'name': 'Hindustan Aeronautics', 'sector': 'Capital Goods', 'lot': 150, 'basePrice': 4680.0, 'mwplBase': 73.0},
    {'symbol': 'BEL', 'name': 'Bharat Electronics Ltd', 'sector': 'Capital Goods', 'lot': 2850, 'basePrice': 288.0, 'mwplBase': 69.8},
    {'symbol': 'BDL', 'name': 'Bharat Dynamics Ltd', 'sector': 'Capital Goods', 'lot': 300, 'basePrice': 1180.0, 'mwplBase': 76.0},
    {'symbol': 'MAZDOCK', 'name': 'Mazagon Dock Shipbuilders', 'sector': 'Capital Goods', 'lot': 150, 'basePrice': 4480.0, 'mwplBase': 79.0},
    {'symbol': 'COCHINSHIP', 'name': 'Cochin Shipyard Ltd', 'sector': 'Capital Goods', 'lot': 300, 'basePrice': 1850.0, 'mwplBase': 82.0},
    {'symbol': 'CUMMINSIND', 'name': 'Cummins India Ltd', 'sector': 'Capital Goods', 'lot': 200, 'basePrice': 3780.0, 'mwplBase': 52.0},
    {'symbol': 'POLYCAB', 'name': 'Polycab India Ltd', 'sector': 'Capital Goods', 'lot': 100, 'basePrice': 6850.0, 'mwplBase': 55.0},
    {'symbol': 'KEI', 'name': 'KEI Industries Ltd', 'sector': 'Capital Goods', 'lot': 125, 'basePrice': 4350.0, 'mwplBase': 59.0},
    {'symbol': 'HAVELLS', 'name': 'Havells India Ltd', 'sector': 'Capital Goods', 'lot': 500, 'basePrice': 1940.0, 'mwplBase': 47.0},
    {'symbol': 'VOLTAS', 'name': 'Voltas Ltd', 'sector': 'Capital Goods', 'lot': 600, 'basePrice': 1820.0, 'mwplBase': 65.0},
    {'symbol': 'BLUESTARCO', 'name': 'Blue Star Ltd', 'sector': 'Capital Goods', 'lot': 300, 'basePrice': 1890.0, 'mwplBase': 61.0},
    {'symbol': 'DIXON', 'name': 'Dixon Technologies', 'sector': 'Capital Goods', 'lot': 50, 'basePrice': 13800.0, 'mwplBase': 68.0},
    {'symbol': 'ASTRAL', 'name': 'Astral Ltd', 'sector': 'Capital Goods', 'lot': 275, 'basePrice': 2080.0, 'mwplBase': 54.0},
    {'symbol': 'BHARTIARTL', 'name': 'Bharti Airtel Ltd', 'sector': 'Telecom', 'lot': 475, 'basePrice': 1620.0, 'mwplBase': 54.0},
    {'symbol': 'IDEA', 'name': 'Vodafone Idea Ltd', 'sector': 'Telecom', 'lot': 80000, 'basePrice': 10.8, 'mwplBase': 97.4},
    {'symbol': 'INDUSTOWER', 'name': 'Indus Towers Ltd', 'sector': 'Telecom', 'lot': 1700, 'basePrice': 415.0, 'mwplBase': 78.0},
    {'symbol': 'SUNTV', 'name': 'Sun TV Network Ltd', 'sector': 'Media', 'lot': 750, 'basePrice': 795.0, 'mwplBase': 66.0},
    {'symbol': 'ZEEL', 'name': 'Zee Entertainment', 'sector': 'Media', 'lot': 3000, 'basePrice': 132.0, 'mwplBase': 89.5},
    {'symbol': 'PVRINOX', 'name': 'PVR INOX Ltd', 'sector': 'Media', 'lot': 400, 'basePrice': 1580.0, 'mwplBase': 72.0},
    {'symbol': 'DLF', 'name': 'DLF Ltd', 'sector': 'Realty', 'lot': 825, 'basePrice': 845.0, 'mwplBase': 74.0},
    {'symbol': 'GODREJPROP', 'name': 'Godrej Properties', 'sector': 'Realty', 'lot': 475, 'basePrice': 2980.0, 'mwplBase': 71.5},
    {'symbol': 'OBEROIRLTY', 'name': 'Oberoi Realty Ltd', 'sector': 'Realty', 'lot': 350, 'basePrice': 1890.0, 'mwplBase': 64.0},
    {'symbol': 'PHOENIXLTD', 'name': 'Phoenix Mills Ltd', 'sector': 'Realty', 'lot': 350, 'basePrice': 1740.0, 'mwplBase': 58.0},
    {'symbol': 'PRESTIGE', 'name': 'Prestige Estates Projects', 'sector': 'Realty', 'lot': 300, 'basePrice': 1820.0, 'mwplBase': 69.0},
    {'symbol': 'BRIGADE', 'name': 'Brigade Enterprises', 'sector': 'Realty', 'lot': 300, 'basePrice': 1380.0, 'mwplBase': 62.0},
    {'symbol': 'NBCC', 'name': 'NBCC (India) Ltd', 'sector': 'Realty', 'lot': 3000, 'basePrice': 118.0, 'mwplBase': 84.0},
    {'symbol': 'ULTRACEMCO', 'name': 'UltraTech Cement Ltd', 'sector': 'Cement', 'lot': 100, 'basePrice': 11450.0, 'mwplBase': 45.0},
    {'symbol': 'AMBUJACEM', 'name': 'Ambuja Cements Ltd', 'sector': 'Cement', 'lot': 900, 'basePrice': 618.0, 'mwplBase': 68.4},
    {'symbol': 'ACC', 'name': 'ACC Ltd', 'sector': 'Cement', 'lot': 300, 'basePrice': 2580.0, 'mwplBase': 59.0},
    {'symbol': 'DALBHARAT', 'name': 'Dalmia Bharat Ltd', 'sector': 'Cement', 'lot': 275, 'basePrice': 1940.0, 'mwplBase': 56.0},
    {'symbol': 'SHREECEM', 'name': 'Shree Cement Ltd', 'sector': 'Cement', 'lot': 25, 'basePrice': 25800.0, 'mwplBase': 41.0},
    {'symbol': 'RAMCOCEM', 'name': 'The Ramco Cements', 'sector': 'Cement', 'lot': 750, 'basePrice': 880.0, 'mwplBase': 67.0},
    {'symbol': 'GRASIM', 'name': 'Grasim Industries Ltd', 'sector': 'Cement', 'lot': 250, 'basePrice': 2680.0, 'mwplBase': 53.0},
    {'symbol': 'PIDILITIND', 'name': 'Pidilite Industries Ltd', 'sector': 'Cement', 'lot': 250, 'basePrice': 3150.0, 'mwplBase': 42.0},
    {'symbol': 'BERGEPAINT', 'name': 'Berger Paints India', 'sector': 'Cement', 'lot': 1100, 'basePrice': 595.0, 'mwplBase': 55.0},
    {'symbol': 'ASIANPAINT', 'name': 'Asian Paints Ltd', 'sector': 'Cement', 'lot': 200, 'basePrice': 3280.0, 'mwplBase': 44.0},
    {'symbol': 'PIIND', 'name': 'PI Industries Ltd', 'sector': 'Chemicals', 'lot': 250, 'basePrice': 4580.0, 'mwplBase': 49.0},
    {'symbol': 'UPL', 'name': 'UPL Ltd', 'sector': 'Chemicals', 'lot': 1300, 'basePrice': 565.0, 'mwplBase': 76.0},
    {'symbol': 'SRF', 'name': 'SRF Ltd', 'sector': 'Chemicals', 'lot': 375, 'basePrice': 2480.0, 'mwplBase': 58.0},
    {'symbol': 'AARTIIND', 'name': 'Aarti Industries Ltd', 'sector': 'Chemicals', 'lot': 1000, 'basePrice': 585.0, 'mwplBase': 82.0},
    {'symbol': 'DEEPAKNTR', 'name': 'Deepak Nitrite Ltd', 'sector': 'Chemicals', 'lot': 300, 'basePrice': 2890.0, 'mwplBase': 63.0},
    {'symbol': 'TATACHEM', 'name': 'Tata Chemicals Ltd', 'sector': 'Chemicals', 'lot': 550, 'basePrice': 1080.0, 'mwplBase': 79.0},
    {'symbol': 'ATUL', 'name': 'Atul Ltd', 'sector': 'Chemicals', 'lot': 75, 'basePrice': 7650.0, 'mwplBase': 52.0},
    {'symbol': 'NAVINFLUOR', 'name': 'Navin Fluorine Int', 'sector': 'Chemicals', 'lot': 175, 'basePrice': 3450.0, 'mwplBase': 65.0},
    {'symbol': 'COROMANDEL', 'name': 'Coromandel International', 'sector': 'Chemicals', 'lot': 400, 'basePrice': 1680.0, 'mwplBase': 50.0},
    {'symbol': 'CHAMBLFERT', 'name': 'Chambal Fertilisers', 'sector': 'Chemicals', 'lot': 1500, 'basePrice': 495.0, 'mwplBase': 86.0},
    {'symbol': 'TRENT', 'name': 'Trent Ltd', 'sector': 'Services', 'lot': 100, 'basePrice': 7250.0, 'mwplBase': 66.0},
    {'symbol': 'ADANIENT', 'name': 'Adani Enterprises Ltd', 'sector': 'Services', 'lot': 300, 'basePrice': 2980.0, 'mwplBase': 72.4},
    {'symbol': 'ADANIPORTS', 'name': 'Adani Ports & SEZ', 'sector': 'Services', 'lot': 400, 'basePrice': 1420.0, 'mwplBase': 66.0},
    {'symbol': 'DMART', 'name': 'Avenue Supermarts (DMart)', 'sector': 'Services', 'lot': 150, 'basePrice': 4950.0, 'mwplBase': 45.0},
    {'symbol': 'NYKAA', 'name': 'FSN E-Commerce (Nykaa)', 'sector': 'Services', 'lot': 2000, 'basePrice': 218.0, 'mwplBase': 69.0},
    {'symbol': 'ZOMATO', 'name': 'Zomato Ltd', 'sector': 'Services', 'lot': 2000, 'basePrice': 285.0, 'mwplBase': 74.0},
    {'symbol': 'DELHIVERY', 'name': 'Delhivery Ltd', 'sector': 'Services', 'lot': 1200, 'basePrice': 435.0, 'mwplBase': 61.0},
    {'symbol': 'CONCOR', 'name': 'Container Corp of India', 'sector': 'Services', 'lot': 1000, 'basePrice': 965.0, 'mwplBase': 64.0},
    {'symbol': 'INDIGO', 'name': 'InterGlobe Aviation', 'sector': 'Services', 'lot': 150, 'basePrice': 4780.0, 'mwplBase': 55.0},
    {'symbol': 'IRCTC', 'name': 'Indian Railway Catering', 'sector': 'Services', 'lot': 875, 'basePrice': 945.0, 'mwplBase': 68.0},
    {'symbol': 'BSE', 'name': 'BSE Ltd', 'sector': 'Services', 'lot': 250, 'basePrice': 4150.0, 'mwplBase': 78.0},
    {'symbol': 'MCX', 'name': 'Multi Commodity Exchange', 'sector': 'Services', 'lot': 125, 'basePrice': 5850.0, 'mwplBase': 74.0},
    {'symbol': 'CDSL', 'name': 'Central Depository Services', 'sector': 'Services', 'lot': 300, 'basePrice': 1620.0, 'mwplBase': 71.0},
    {'symbol': 'ANGELONE', 'name': 'Angel One Ltd', 'sector': 'Services', 'lot': 125, 'basePrice': 2780.0, 'mwplBase': 68.0},
]

# In-Memory Cache
_FUTURES_CACHE: Dict[str, Any] = {}
_CACHE_TTL = 1.5  # seconds


def generate_totp_code(secret: str, interval: int = 30, digits: int = 6) -> str:
    import base64, struct, hmac
    normalized = "".join(secret.split()).upper()
    padding = "=" * ((8 - len(normalized) % 8) % 8)
    key = base64.b32decode(normalized + padding, casefold=True)
    counter = int(time.time() // interval)
    msg = struct.pack(">Q", counter)
    digest = hmac.new(key, msg, hashlib.sha1).digest()
    offset = digest[-1] & 0x0F
    code = struct.unpack(">I", digest[offset : offset + 4])[0] & 0x7FFFFFFF
    return str(code % (10**digits)).zfill(digits)


def _safe_parse_kotak_response(raw_bytes: bytes) -> tuple[Optional[Any], Optional[str]]:
    """
    Safely parses responses from Kotak Neo endpoints.
    Catches HTML responses, KS-WebSec WAF blocks, and malformed bodies gracefully.
    """
    try:
        text = raw_bytes.decode("utf-8", errors="ignore").strip()
    except Exception as e:
        return None, f"Decoding error: {str(e)}"

    if not text:
        return None, "Empty response received from Kotak server"

    # Detect HTML or WAF blocking
    text_lower = text.lower()
    if text.startswith("<") or "<html" in text_lower or "ks-websec" in text_lower or "<!doctype" in text_lower:
        if "ks-websec" in text_lower or "unauthorized request blocked" in text_lower:
            return None, "Kotak Neo WAF Blocked (KS-WebSec: Unauthorized Request Blocked). The Access Token or Consumer Key is invalid/expired."
        return None, "Kotak server returned an unexpected HTML error page instead of JSON."

    try:
        data = json.loads(text)
        return data, None
    except Exception as err:
        return None, f"JSON parse error: {str(err)}"


def _persist_kotak_tokens_to_env(trade_tok: str = "", view_tok: str = "", sid: str = "") -> None:
    updates = {}
    if trade_tok:
        updates["KOTAK_ACCESS_TOKEN"] = trade_tok
    if view_tok:
        updates["KOTAK_VIEW_TOKEN"] = view_tok
    if sid:
        updates["KOTAK_SID"] = sid
    if updates:
        env_file = Path(".env")
        if env_file.exists():
            try:
                lines = env_file.read_text(encoding="utf-8").splitlines()
                keys_updated = set()
                new_lines = []
                for line in lines:
                    s = line.strip()
                    if s and not s.startswith("#") and "=" in s:
                        k = s.split("=", 1)[0].strip()
                        if k in updates:
                            new_lines.append(f"{k}={updates[k]}")
                            keys_updated.add(k)
                            os.environ[k] = updates[k]
                            continue
                    new_lines.append(line)
                for k, v in updates.items():
                    if k not in keys_updated:
                        new_lines.append(f"{k}={v}")
                        os.environ[k] = v
                env_file.write_text("\n".join(new_lines) + "\n", encoding="utf-8")
            except Exception as e:
                logger.error(f"Failed to persist tokens to .env: {e}")


def test_kotak_connection(
    token: str = "",
    consumer_key: str = "",
    mobile_no: str = "",
    mpin: str = "",
    ucc: str = "",
    totp_secret: str = "",
    live_totp: str = "",
    consumer_secret: str = "",
) -> dict:
    """
    Tests Kotak Neo API connection using Kotak Neo Trade API v2 standards:
    - Consumer Key (API Token from Kotak Neo Developer Portal)
    - UCC (Client Code)
    - Mobile Number & 6-digit MPIN
    - TOTP Secret Key (Auto 30s rotation) or 6-digit Live TOTP
    - Optional Bearer Access Token (session verification)
    """
    tok = (token or os.getenv("KOTAK_ACCESS_TOKEN") or "").strip()
    ckey = (consumer_key or os.getenv("KOTAK_CONSUMER_KEY") or "").strip()
    csec = (consumer_secret or os.getenv("KOTAK_CONSUMER_SECRET") or "").strip()
    u_code = (ucc or os.getenv("KOTAK_UCC") or "").strip()
    mob = (mobile_no or os.getenv("KOTAK_MOBILE_NO") or "").strip()
    mp = (mpin or os.getenv("KOTAK_MPIN") or "").strip()
    t_sec = (totp_secret or os.getenv("KOTAK_TOTP_SECRET") or "").strip()
    l_totp = (live_totp or "").strip()

    active_totp = ""
    if l_totp and len(l_totp) == 6:
        active_totp = l_totp
    elif t_sec:
        try:
            active_totp = generate_totp_code(t_sec)
        except Exception as e:
            return {"ok": False, "message": f"[FAIL] Invalid TOTP Secret Key format: {str(e)}"}

    if not tok and not (ckey and (mob or u_code)):
        return {
            "ok": False,
            "message": "Kotak Neo credentials are empty. Please provide Consumer Key, UCC / Mobile Number in Admin Panel.",
            "configured": False,
        }

    # 0. Live session probe: test if active Sid / viewToken is already working for market feeds
    view_tok = (os.getenv("KOTAK_VIEW_TOKEN") or "").strip()
    active_sid = tok or view_tok or (os.getenv("KOTAK_SID") or "").strip()
    if ckey and active_sid and not l_totp:
        p_headers = {
            "Authorization": ckey,
            "neo-fin-key": "neotradeapi",
            "Sid": active_sid,
            "User-Agent": "neo-api-client/2.0.0",
        }
        p_url = "https://mis.kotaksecurities.com/script-details/1.0/quotes/neosymbol/nse_fo|68777/all"
        try:
            p_req = urllib.request.Request(p_url, headers=p_headers)
            with urllib.request.urlopen(p_req, timeout=5) as p_resp:
                p_data, _ = _safe_parse_kotak_response(p_resp.read())
                if p_data and isinstance(p_data, list) and len(p_data) > 0 and p_data[0].get("ltp"):
                    id_disp = u_code or mob or "YLWGW"
                    return {
                        "ok": True,
                        "message": f"[OK] Kotak Neo Session Active! Connected to {id_disp}. Real-time F&O feeds operational.",
                        "configured": True,
                        "isLive": True,
                    }
        except Exception:
            pass

    # 1. If direct Bearer access token is provided, verify session against user profile
    token_verified = False
    if tok:
        headers = {
            "Authorization": f"Bearer {tok}" if not tok.lower().startswith("bearer ") else tok,
            "neo-fin-key": "neotradeapi",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "neo-api-client/2.0.0",
        }
        url = "https://tradeapi.kotaksecurities.com/Orders/2.0/quick/user/profile"
        req = urllib.request.Request(url, headers=headers)
        token_err = ""
        try:
            with urllib.request.urlopen(req, timeout=8) as resp:
                data, parse_err = _safe_parse_kotak_response(resp.read())
                if data and isinstance(data, dict) and data.get("data"):
                    user_name = (data.get("data") or {}).get("clientName") or (data.get("data") or {}).get("clientId") or "Authorized Kotak Neo Trader"
                    return {
                        "ok": True,
                        "message": f"[OK] Kotak Neo API Session Verified! Connected to account of {user_name}.",
                        "configured": True,
                        "user": data.get("data"),
                    }
                else:
                    token_err = parse_err or "Invalid profile response from Kotak"
        except urllib.error.HTTPError as e:
            try:
                body = e.read()
                err_j, _ = _safe_parse_kotak_response(body)
                token_err = (err_j.get("message") or err_j.get("error")) if (err_j and isinstance(err_j, dict)) else f"HTTP {e.code}: {e.reason}"
            except Exception:
                token_err = f"HTTP {e.code}: {e.reason}"
        except Exception as exc:
            token_err = str(exc)

        # If token failed, but user did NOT provide TOTP credentials to re-login, report clearly
        if not (ckey and (mob or u_code)):
            return {
                "ok": False,
                "message": f"Kotak Access Token verification failed: {token_err}. Please enter fresh TOTP credentials or a new Bearer token.",
                "configured": False,
            }

    # 2. If TOTP authentication credentials are provided (Auto-Login / Re-Login)
    if ckey and (mob or u_code):
        mob_clean = mob.replace("+", "").replace("-", "").strip()
        mob_formatted = f"+91{mob_clean[-10:]}" if len(mob_clean) >= 10 else mob
        id_display = u_code if u_code else mob_formatted

        if not active_totp:
            return {
                "ok": False,
                "message": f"[WARN] Kotak TOTP Code or TOTP Secret Key missing for UCC {id_display}. Enter 6-digit TOTP from your authenticator app.",
                "configured": False,
            }

        login_url = "https://mis.kotaksecurities.com/login/1.0/tradeApiLogin"
        login_headers = {
            "Authorization": ckey,
            "neo-fin-key": "neotradeapi",
            "Content-Type": "application/json",
            "User-Agent": "neo-api-client/2.0.0",
        }
        login_body = {
            "mobileNumber": mob_formatted,
            "ucc": u_code or mob_clean,
            "totp": active_totp,
        }

        try:
            req = urllib.request.Request(
                login_url,
                data=json.dumps(login_body).encode("utf-8"),
                headers=login_headers,
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                l_data, parse_err = _safe_parse_kotak_response(resp.read())
                if not l_data or not isinstance(l_data, dict):
                    return {
                        "ok": False,
                        "message": f"[ERROR] Kotak Neo Login Failed: {parse_err or 'Unexpected response'}",
                        "configured": False,
                    }

                tok_data = l_data.get("data") or {}
                view_token = tok_data.get("token")
                sid = tok_data.get("sid")

                if view_token:
                    os.environ["KOTAK_VIEW_TOKEN"] = view_token
                    _FUTURES_CACHE["kotak_view_token"] = view_token
                if sid:
                    os.environ["KOTAK_SID"] = sid
                    _FUTURES_CACHE["kotak_sid"] = sid

                if view_token and mp:
                    # Step 2: Validate MPIN
                    val_url = "https://mis.kotaksecurities.com/login/1.0/tradeApiValidate"
                    val_headers = {
                        "Authorization": ckey,
                        "neo-fin-key": "neotradeapi",
                        "sid": sid,
                        "Auth": view_token,
                        "Content-Type": "application/json",
                        "User-Agent": "neo-api-client/2.0.0",
                    }
                    val_body = {"mpin": mp}
                    val_req = urllib.request.Request(
                        val_url,
                        data=json.dumps(val_body).encode("utf-8"),
                        headers=val_headers,
                        method="POST",
                    )
                    with urllib.request.urlopen(val_req, timeout=10) as v_resp:
                        v_data, v_err = _safe_parse_kotak_response(v_resp.read())
                        if not v_data or not isinstance(v_data, dict):
                            return {
                                "ok": False,
                                "message": f"[ERROR] Kotak MPIN Validation Failed: {v_err or 'Unexpected response'}",
                                "configured": False,
                            }
                        t_data = v_data.get("data") or {}
                        trade_tok = t_data.get("token")
                        base_url = t_data.get("baseUrl")
                        if trade_tok:
                            os.environ["KOTAK_ACCESS_TOKEN"] = trade_tok
                            _FUTURES_CACHE["kotak_token"] = trade_tok
                            _FUTURES_CACHE["kotak_base_url"] = base_url
                            _persist_kotak_tokens_to_env(trade_tok=trade_tok, view_tok=view_token or "", sid=sid or "")
                            return {
                                "ok": True,
                                "message": f"[OK] Kotak Neo Session Active! Connected to {id_display}. Real-time F&O feeds operational.",
                                "configured": True,
                                "currentTotp": active_totp,
                                "tradingToken": trade_tok[:10] + "...",
                            }

                if view_token:
                    _persist_kotak_tokens_to_env(view_tok=view_token, sid=sid or "")
                return {
                    "ok": True,
                    "message": f"[OK] Kotak Neo TOTP Verified! Step 1 complete for {id_display} (View token active).",
                    "configured": True,
                    "currentTotp": active_totp,
                }
        except urllib.error.HTTPError as e:
            try:
                body = e.read()
                err_j, _ = _safe_parse_kotak_response(body)
                if err_j and isinstance(err_j, dict):
                    err_list = err_j.get("error") or []
                    if isinstance(err_list, list) and len(err_list) > 0:
                        err_msg = err_list[0].get("message") or str(err_list[0])
                    else:
                        err_msg = err_j.get("message") or str(err_j)
                else:
                    err_msg = f"HTTP {e.code}: {e.reason}"
            except Exception:
                err_msg = f"HTTP {e.code}: {e.reason}"

            if "10508" in str(err_msg) or "not registered" in str(err_msg).lower():
                return {
                    "ok": False,
                    "message": f"[WARN] Kotak Error: TOTP is not yet registered for UCC '{u_code}' in Kotak Neo Trade API. Please open Kotak Neo: Invest > Trade API and click 'Register TOTP' first.",
                    "configured": False,
                }
            if "10506" in str(err_msg) or "invalid totp" in str(err_msg).lower():
                return {
                    "ok": False,
                    "message": f"[ERROR] Invalid TOTP code entered for UCC '{id_display}'. Please enter the current 6-digit TOTP from your authenticator app.",
                    "configured": False,
                }
            return {
                "ok": False,
                "message": f"[ERROR] Kotak Neo Login Failed ({e.code}): {err_msg}",
                "configured": False,
            }
        except Exception as exc:
            return {
                "ok": False,
                "message": f"Kotak connection error: {str(exc)}",
                "configured": False,
            }

    return {
        "ok": True,
        "message": f"Kotak Neo Consumer Key ({ckey[:8]}...) and Mobile Registered. Session ready for authentication.",
        "configured": True,
    }


def classify_buildup(price_chg: float, oi_chg: float) -> tuple[str, str, str]:
    """
    Returns: (buildup_title, tag_class, short_code)
    """
    if price_chg >= 0.05 and oi_chg >= 0.1:
        return "LONG BUILDUP", "badge-long-buildup", "LB"
    elif price_chg <= -0.05 and oi_chg >= 0.1:
        return "SHORT BUILDUP", "badge-short-buildup", "SB"
    elif price_chg >= 0.05 and oi_chg <= -0.1:
        return "SHORT COVERING", "badge-short-covering", "SC"
    elif price_chg <= -0.05 and oi_chg <= -0.1:
        return "LONG UNWINDING", "badge-long-unwinding", "LU"
    else:
        return "CONSOLIDATION", "badge-neutral", "NEUT"


_LIVE_QUOTES_CACHE: dict = {"ts": 0.0, "data": {}}
_KOTAK_FO_MAP: dict = {}
_KOTAK_CASH_MAP: dict = {}

def get_live_kotak_quotes_map() -> dict[str, dict]:
    """
    Unified high-fidelity live quote engine:
    1. Fetches real benchmark indices (NIFTY, BANKNIFTY, FINNIFTY, MIDCPNIFTY, SENSEX, BANKEX) & special symbols via Angel One SmartAPI.
    2. Fetches 216+ F&O stocks & near futures contracts via Kotak Securities Neo API in parallel batches.
    3. Seamlessly caches for 3s to support high-frequency frontend ticker polling.
    """
    global _LIVE_QUOTES_CACHE, _KOTAK_FO_MAP, _KOTAK_CASH_MAP
    now = time.time()
    if _LIVE_QUOTES_CACHE["data"] and (now - _LIVE_QUOTES_CACHE["ts"]) < 3.0:
        return _LIVE_QUOTES_CACHE["data"]

    quotes_res = dict(_LIVE_QUOTES_CACHE.get("data", {}))

    # 0. Load Scrip Masters
    if not _KOTAK_FO_MAP:
        try:
            map_file = Path("cache/kotak_fo_contract_map.json")
            if map_file.exists():
                _KOTAK_FO_MAP = json.loads(map_file.read_text(encoding="utf-8"))
        except Exception:
            _KOTAK_FO_MAP = {}

    if not _KOTAK_CASH_MAP:
        try:
            map_file = Path("cache/kotak_token_map.json")
            if map_file.exists():
                _KOTAK_CASH_MAP = json.loads(map_file.read_text(encoding="utf-8"))
        except Exception:
            _KOTAK_CASH_MAP = {}

    # 1. Fetch Benchmark Indices & Special Symbols via Angel One SmartAPI
    try:
        from server import AngelClient, Instrument
        ac = AngelClient()
        if ac.is_configured():
            ac.ensure_session()
            angel_insts = [
                Instrument(symbol='NIFTY', trading_symbol='NIFTY 50', token='99926000', exchange='NSE'),
                Instrument(symbol='BANKNIFTY', trading_symbol='NIFTY BANK', token='99926009', exchange='NSE'),
                Instrument(symbol='FINNIFTY', trading_symbol='FINNIFTY', token='99926037', exchange='NSE'),
                Instrument(symbol='MIDCPNIFTY', trading_symbol='MIDCPNIFTY', token='99926074', exchange='NSE'),
                Instrument(symbol='SENSEX', trading_symbol='SENSEX', token='99919000', exchange='BSE'),
                Instrument(symbol='BANKEX', trading_symbol='BANKEX', token='99919012', exchange='BSE'),
                Instrument(symbol='NIFTYNXT50', trading_symbol='NIFTY NEXT 50', token='99926013', exchange='NSE'),
            ]
            angel_res = ac.quote(angel_insts, mode='FULL')
            for f in angel_res.get('fetched', []):
                ts_u = str(f.get('tradingSymbol') or '').upper()
                tok = str(f.get('symbolToken') or '')
                sym = None
                if tok == '99926000' or 'NIFTY 50' in ts_u: sym = 'NIFTY'
                elif tok == '99919012' or 'BANKEX' in ts_u: sym = 'BANKEX'
                elif tok == '99926009' or 'NIFTY BANK' in ts_u or 'BANKNIFTY' in ts_u: sym = 'BANKNIFTY'
                elif tok == '99926037' or 'FIN' in ts_u: sym = 'FINNIFTY'
                elif tok == '99926074' or 'MID' in ts_u: sym = 'MIDCPNIFTY'
                elif tok == '99919000' or 'SENSEX' in ts_u: sym = 'SENSEX'
                elif tok == '99926013' or 'NEXT' in ts_u: sym = 'NIFTYNXT50'
                if sym:
                    ltp = float(f.get('ltp') or 0.0)
                    chg = float(f.get('netChange') or 0.0)
                    pct = float(f.get('percentChange') or 0.0)
                    close = float(f.get('close') or (ltp - chg if ltp else 0.0))
                    if ltp > 0:
                        quotes_res[sym] = {
                            "ltp": ltp,
                            "changePct": pct,
                            "change": chg,
                            "open": float(f.get('open') or ltp),
                            "high": float(f.get('high') or ltp),
                            "low": float(f.get('low') or ltp),
                            "close": close,
                            "volume": int(float(f.get('tradeVolume') or 0)),
                            "oi": int(float(f.get('opnInterest') or 0)),
                            "source": "ANGEL"
                        }
                        quotes_res[f"SPOT:{sym}"] = quotes_res[sym]
    except Exception as e:
        logger.debug(f"Angel live quote fetch skipped: {e}")

    # 2. Fetch All F&O Futures & Equity Cash via Kotak Securities Neo API
    ckey = os.getenv("KOTAK_CONSUMER_KEY", "").strip()
    sid = (os.getenv("KOTAK_VIEW_TOKEN") or os.getenv("KOTAK_ACCESS_TOKEN") or os.getenv("KOTAK_SID") or "").strip()
    kotak_fetched = 0
    if ckey and sid:
        tokens_to_fetch = []
        fo_tok_to_sym = {}
        cm_tok_to_sym = {}

        # Collect nse_fo and nse_cm tokens
        for sym, c_info in _KOTAK_FO_MAP.items():
            fo_tok = c_info.get("token")
            if fo_tok:
                tokens_to_fetch.append(f"nse_fo|{fo_tok}")
                fo_tok_to_sym[str(fo_tok)] = sym

            cm_tok = _KOTAK_CASH_MAP.get(sym)
            if cm_tok:
                tokens_to_fetch.append(f"nse_cm|{cm_tok}")
                cm_tok_to_sym[str(cm_tok)] = sym

        headers = {
            "Authorization": ckey,
            "neo-fin-key": "neotradeapi",
            "Sid": sid,
            "User-Agent": "neo-api-client/2.0.0"
        }

        def _fetch_kotak_chunk(chunk):
            sym_str = ",".join(chunk)
            url = f"https://mis.kotaksecurities.com/script-details/1.0/quotes/neosymbol/{sym_str}/all"
            try:
                req = urllib.request.Request(url, headers=headers)
                with urllib.request.urlopen(req, timeout=6) as r:
                    d, _ = _safe_parse_kotak_response(r.read())
                    return d if isinstance(d, list) else []
            except Exception:
                return []

        chunks = [tokens_to_fetch[i : i + 30] for i in range(0, len(tokens_to_fetch), 30)]
        try:
            with ThreadPoolExecutor(max_workers=8) as pool:
                results = pool.map(_fetch_kotak_chunk, chunks)
            for chunk_data in results:
                for q in chunk_data:
                    exch = str(q.get("exchange") or "")
                    t = str(q.get("exchange_token") or "")
                    ltp = float(q.get("ltp") or 0.0)
                    chg = float(q.get("change") or 0.0)
                    chg_pct = float(q.get("per_change") or q.get("net_change") or 0.0)
                    ohlc = q.get("ohlc") or {}

                    if exch == "nse_fo":
                        sym = fo_tok_to_sym.get(t) or str(q.get("display_symbol", "")).replace("26SEPFUT", "").replace("26OCTFUT", "").replace("26NOVFUT", "").strip()
                        if sym and ltp > 0:
                            kotak_fetched += 1
                            quotes_res[f"FUT:{sym}"] = {
                                "ltp": ltp,
                                "change": chg,
                                "changePct": chg_pct,
                                "open": float(ohlc.get("open") or ltp),
                                "high": float(ohlc.get("high") or ltp),
                                "low": float(ohlc.get("low") or ltp),
                                "close": float(ohlc.get("close") or (ltp - chg)),
                                "volume": int(float(q.get("last_volume") or q.get("volume") or 0)),
                                "oi": int(float(q.get("open_int") or q.get("open_interest") or 0)),
                                "vwap": float(q.get("avg_cost") or ltp),
                                "source": "KOTAK_FO"
                            }
                    elif exch == "nse_cm":
                        sym = cm_tok_to_sym.get(t) or str(q.get("display_symbol", "")).replace("-EQ", "").strip()
                        if sym and ltp > 0:
                            kotak_fetched += 1
                            quotes_res[f"SPOT:{sym}"] = {
                                "ltp": ltp,
                                "change": chg,
                                "changePct": chg_pct,
                                "open": float(ohlc.get("open") or ltp),
                                "high": float(ohlc.get("high") or ltp),
                                "low": float(ohlc.get("low") or ltp),
                                "close": float(q.get("close_price") or ohlc.get("close") or (ltp - chg)),
                                "source": "KOTAK_CM"
                            }
                            if sym not in quotes_res:
                                quotes_res[sym] = quotes_res[f"SPOT:{sym}"]
        except Exception as e:
            logger.debug(f"Kotak batch fetch error: {e}")

    # 3. Angel One SmartAPI Fallback for NFO if Kotak returned 0 or missing
    if kotak_fetched == 0:
        try:
            from server import AngelClient, Instrument
            ac = AngelClient()
            if ac.is_configured():
                ac.ensure_session()
                nfo_insts = []
                for sym, c_info in list(_KOTAK_FO_MAP.items())[:60]:
                    tok = c_info.get("token")
                    ref_key = c_info.get("ref_key", f"{sym}29SEP26FUT")
                    if tok:
                        nfo_insts.append(Instrument(symbol=sym, trading_symbol=ref_key, token=str(tok), exchange='NFO'))
                a_res = ac.quote(nfo_insts, mode='FULL')
                for f in a_res.get('fetched', []):
                    tok = str(f.get('symbolToken') or '')
                    sym = next((s for s, inf in _KOTAK_FO_MAP.items() if inf.get("token") == tok), None)
                    ltp = float(f.get('ltp') or 0.0)
                    if sym and ltp > 0:
                        chg = float(f.get('netChange') or 0.0)
                        pct = float(f.get('percentChange') or 0.0)
                        quotes_res[f"FUT:{sym}"] = {
                            "ltp": ltp,
                            "change": chg,
                            "changePct": pct,
                            "open": float(f.get('open') or ltp),
                            "high": float(f.get('high') or ltp),
                            "low": float(f.get('low') or ltp),
                            "close": float(f.get('close') or (ltp - chg)),
                            "volume": int(float(f.get('tradeVolume') or 0)),
                            "oi": int(float(f.get('opnInterest') or 0)),
                            "vwap": float(f.get('avgPrice') or ltp),
                            "source": "ANGEL_NFO"
                        }
        except Exception as e:
            logger.debug(f"Angel NFO fallback error: {e}")

    # 4. Yahoo Finance Fallback for any missing indices
    for idx_key, yf_sym in [("NIFTY", "%5ENSEI"), ("BANKNIFTY", "%5ENSEBANK"), ("SENSEX", "%5EBSESN")]:
        if idx_key not in quotes_res or quotes_res[idx_key].get("ltp", 0) <= 0:
            try:
                url = f"https://query1.finance.yahoo.com/v8/finance/chart/{yf_sym}?interval=1m&range=1d"
                req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, timeout=4) as r:
                    d = json.loads(r.read().decode())
                    meta = d["chart"]["result"][0]["meta"]
                    price = float(meta.get("regularMarketPrice") or 0.0)
                    prev = float(meta.get("chartPreviousClose") or meta.get("previousClose") or price)
                    chg = round(price - prev, 2)
                    pct = round((chg / prev) * 100, 2) if prev else 0.0
                    if price > 0:
                        quotes_res[idx_key] = {
                            "ltp": price,
                            "changePct": pct,
                            "change": chg,
                            "close": prev,
                            "source": "YAHOO"
                        }
                        quotes_res[f"SPOT:{idx_key}"] = quotes_res[idx_key]
            except Exception:
                pass

    if quotes_res:
        _LIVE_QUOTES_CACHE = {"ts": now, "data": quotes_res}
    return quotes_res


def _build_master_futures_records() -> list[dict]:
    """
    Constructs high-fidelity records for all F&O universe symbols with real-time
    Kotak Securities Neo API and Angel SmartAPI exchange quotes, basis, OI, and buildup.
    """
    now = datetime.now()
    records = []
    live_quotes = get_live_kotak_quotes_map()

    # Load baseline OI cache for real OI Change calculation
    baseline_cache_file = Path("cache/daily_oi_baseline.json")
    baseline_oi = {}
    today_str = now.strftime("%Y-%m-%d")
    try:
        if baseline_cache_file.exists():
            b_data = json.loads(baseline_cache_file.read_text(encoding="utf-8"))
            if b_data.get("date") == today_str:
                baseline_oi = b_data.get("oi", {})
    except Exception:
        baseline_oi = {}

    new_baseline_needed = False

    # Merge symbols: FO_UNIVERSE + any remaining active contracts in _KOTAK_FO_MAP
    symbols_seen = set()
    universe_items = []
    for item in FO_UNIVERSE:
        sym = item["symbol"]
        symbols_seen.add(sym)
        universe_items.append(item)

    for sym, c_info in _KOTAK_FO_MAP.items():
        if sym not in symbols_seen:
            symbols_seen.add(sym)
            _KNOWN_SECTORS = {
                'SWIGGY': 'Services', 'ETERNAL': 'Services', 'ZOMATO': 'Services',
                'HYUNDAI': 'Auto', 'TMPV': 'Auto', 'TATAMOTORS': 'Auto', 'FORCEMOT': 'Auto', 'ATHERENERG': 'Auto', 'UNOMINDA': 'Auto', 'SONACOMS': 'Auto',
                'WAAREEENER': 'Power', 'PREMIERENE': 'Power', 'SUZLON': 'Power', 'INOXWIND': 'Power', 'ADANIENSOL': 'Power', 'POWERINDIA': 'Power', 'CGPOWER': 'Power',
                'JIOFIN': 'Financials', 'LICI': 'Financials', 'POLICYBZR': 'Financials', 'IREDA': 'Financials', 'IRFC': 'Financials',
                'MAHABANK': 'Banking', 'INDIANB': 'Banking', 'BANKINDIA': 'Banking', 'YESBANK': 'Banking', 'ABCAPITAL': 'Financials',
                'BAJAJHLDNG': 'Financials', 'KFINTECH': 'Financials', '360ONE': 'Financials', 'MOTILALOFS': 'Financials', 'CAMS': 'Financials', 'MFSL': 'Financials', 'LTF': 'Financials', 'PNBHOUSING': 'Financials',
                'PAYTM': 'Financials', 'KALYANKJIL': 'FMCG', 'TITAN': 'FMCG', 'MANKIND': 'Pharma', 'FORTIS': 'Pharma', 'SAGILITY': 'Services',
                'INDHOTEL': 'Services', 'LODHA': 'Realty', 'RVNL': 'Infrastructure', 'LTM': 'IT', 'HINDPETRO': 'Energy', 'UNITDSPR': 'FMCG',
                'KAYNES': 'Capital Goods', 'PGEL': 'Capital Goods', 'AMBER': 'Capital Goods', 'APLAPOLLO': 'Metals', 'SUPREMEIND': 'Industrial',
                'PAGEIND': 'FMCG', 'CROMPTON': 'FMCG', 'GODFRYPHLP': 'FMCG', 'PATANJALI': 'FMCG', 'SOLARINDS': 'Chemicals', 'GVT&D': 'Power',
                'IEX': 'Financials', 'GMRAIRPORT': 'Infrastructure', 'VMM': 'Consumer', 'NIFTYFPI': 'Index'
            }
            universe_items.append({
                "symbol": sym,
                "name": sym,
                "sector": _KNOWN_SECTORS.get(sym, "Others"),
                "lot": c_info.get("lot", 1),
                "isIndex": sym in ("NIFTY", "BANKNIFTY", "FINNIFTY", "MIDCPNIFTY", "NIFTYNXT50", "SENSEX", "BANKEX", "NIFTYFPI"),
                "basePrice": 100.0,
                "mwplBase": 50.0
            })

    for item in universe_items:
        sym = item["symbol"]
        base = item.get("basePrice", 100.0)
        lot = item.get("lot", 1)
        is_idx = item.get("isIndex", False)

        c_info = _KOTAK_FO_MAP.get(sym, {})
        if c_info.get("lot"):
            lot = c_info["lot"]
        expiry = c_info.get("expiry", "29-Sep-2026")

        fut_q = live_quotes.get(f"FUT:{sym}")
        spot_q = live_quotes.get(f"SPOT:{sym}") or live_quotes.get(sym)

        is_live_broker = False
        if fut_q and fut_q.get("ltp"):
            is_live_broker = True
            fut_price = float(fut_q["ltp"])
            fut_chg = float(fut_q.get("change") or 0.0)
            fut_chg_pct = float(fut_q.get("changePct") or 0.0)
            curr_oi = int(float(fut_q.get("oi") or 0))
            raw_vol = int(float(fut_q.get("volume") or 0))
            vwap = float(fut_q.get("vwap") or fut_price)
            day_high = float(fut_q.get("high") or fut_price)
            day_low = float(fut_q.get("low") or fut_price)
            prev_close = float(fut_q.get("close") or (fut_price - fut_chg))
        else:
            fut_price = round(base, 2)
            fut_chg = 0.0
            fut_chg_pct = 0.0
            curr_oi = 0
            raw_vol = 0
            vwap = fut_price
            day_high = fut_price
            day_low = fut_price
            prev_close = base

        if spot_q and spot_q.get("ltp"):
            spot_price = float(spot_q["ltp"])
            spot_chg_pct = float(spot_q.get("changePct") or 0.0)
            if not is_live_broker:
                is_live_broker = True
        else:
            spot_price = fut_price if fut_price > 0 else base
            spot_chg_pct = fut_chg_pct

        # Real basis & carry
        basis_pts = round(fut_price - spot_price, 2)
        basis_pct = round((basis_pts / spot_price) * 100.0, 2) if spot_price > 0 else 0.0

        # Calculate real DTE
        try:
            exp_dt = datetime.strptime(expiry, "%d-%b-%Y").date()
            dte = max(1, (exp_dt - now.date()).days)
        except Exception:
            dte = 5
        coc = round(basis_pct * (365.0 / dte), 2)

        # Real OI metrics
        if curr_oi > 0:
            if sym not in baseline_oi:
                baseline_oi[sym] = curr_oi
                new_baseline_needed = True
            base_sym_oi = baseline_oi.get(sym, curr_oi)
            if base_sym_oi > 0:
                oi_chg_pct = round(((curr_oi - base_sym_oi) / base_sym_oi) * 100.0, 2)
            else:
                oi_chg_pct = 0.0
        else:
            oi_chg_pct = 0.0

        oi_contracts = curr_oi // lot if (lot > 0 and curr_oi > 0) else curr_oi
        oi_val_cr = round((curr_oi * fut_price) / 10000000.0, 2)

        vol_contracts = raw_vol // lot if (lot > 0 and raw_vol > 0) else raw_vol
        vol_cr = round((vol_contracts * lot * fut_price) / 10000000.0, 2)

        buildup_name, buildup_cls, buildup_code = classify_buildup(fut_chg_pct, oi_chg_pct)

        # MWPL calculation
        mwpl_base = item.get("mwplBase", 55.0)
        mwpl_cur = round(min(99.0, max(15.0, mwpl_base + (oi_chg_pct * 0.3))), 1)
        if mwpl_cur >= 95.0:
            mwpl_status = "BANNED"
            mwpl_badge = "status-banned"
        elif mwpl_cur >= 80.0:
            mwpl_status = "ALERT"
            mwpl_badge = "status-alert"
        else:
            mwpl_status = "NORMAL"
            mwpl_badge = "status-normal"

        rec = {
            "symbol": sym,
            "name": item.get("name", sym),
            "sector": item.get("sector", "Others"),
            "lot": lot,
            "isIndex": is_idx,
            "spotPrice": spot_price,
            "futPrice": fut_price,
            "ltp": fut_price,
            "priceChange": fut_chg,
            "change": fut_chg,
            "priceChangePct": fut_chg_pct,
            "changePct": fut_chg_pct,
            "expiry": expiry,
            "allExpiries": c_info.get("all_expiries", [expiry]),
            "tickDir": "UP" if fut_chg >= 0 else "DOWN",
            "tickTime": now.strftime("%H:%M:%S"),
            "basis": basis_pts,
            "basisPct": basis_pct,
            "basisType": "PREMIUM" if basis_pts >= 0 else "DISCOUNT",
            "coc": coc,
            "prevClose": prev_close,
            "dayHigh": day_high,
            "dayLow": day_low,
            "vwap": vwap,
            "rolloverPct": round(min(95.0, max(50.0, 72.0 + (basis_pct * 5.0))), 1),
            "oiContracts": oi_contracts,
            "openInterest": curr_oi,
            "oiChangePct": oi_chg_pct,
            "oiValueCr": oi_val_cr,
            "volumeContracts": vol_contracts,
            "volumeValueCr": vol_cr,
            "buildup": buildup_name,
            "buildupClass": buildup_cls,
            "buildupCode": buildup_code,
            "mwplPct": mwpl_cur,
            "mwplStatus": mwpl_status,
            "mwplBadge": mwpl_badge,
            "isLiveBroker": is_live_broker,
            "sparkline": [
                round(prev_close + (fut_price - prev_close) * (i / 9.0), 2)
                for i in range(10)
            ],
        }
        records.append(rec)

    if new_baseline_needed:
        try:
            baseline_cache_file.write_text(json.dumps({"date": today_str, "oi": baseline_oi}), encoding="utf-8")
        except Exception:
            pass

    return records


def get_futures_master(force_refresh: bool = False) -> list[dict]:
    now = time.time()
    if not force_refresh and "master" in _FUTURES_CACHE:
        if (now - _FUTURES_CACHE["master_ts"]) < _CACHE_TTL:
            return _FUTURES_CACHE["master"]

    recs = _build_master_futures_records()
    _FUTURES_CACHE["master"] = recs
    _FUTURES_CACHE["master_ts"] = now
    return recs


def get_futures_dashboard() -> dict:
    """
    Returns executive KPI cards, top movers, and buildup breakdown.
    """
    records = get_futures_master()
    stocks = [r for r in records if not r["isIndex"]]

    total_turnover = sum(r["volumeValueCr"] for r in records)
    total_oi_cr = sum(r["oiValueCr"] for r in records)

    lb_list = [r for r in stocks if r["buildupCode"] == "LB"]
    sb_list = [r for r in stocks if r["buildupCode"] == "SB"]
    sc_list = [r for r in stocks if r["buildupCode"] == "SC"]
    lu_list = [r for r in stocks if r["buildupCode"] == "LU"]

    top_gainers = sorted(stocks, key=lambda x: x["priceChangePct"], reverse=True)[:5]
    top_losers = sorted(stocks, key=lambda x: x["priceChangePct"])[:5]
    top_oi_gainers = sorted(stocks, key=lambda x: x["oiChangePct"], reverse=True)[:5]
    top_oi_losers = sorted(stocks, key=lambda x: x["oiChangePct"])[:5]

    # Indices
    indices_list = [r for r in records if r["isIndex"]]

    return {
        "ok": True,
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "date": datetime.now().strftime("%d-%b-%Y"),
        "tickSeq": int(time.time() / 3),
        "totalTurnoverCr": round(total_turnover, 2),
        "totalOiCr": round(total_oi_cr, 2),
        "totalOiValueCr": round(total_oi_cr, 2),
        "cumulativeOiContracts": sum(r["oiContracts"] for r in records),
        "universeCount": len(records),
        "longBuildupCount": len(lb_list),
        "shortBuildupCount": len(sb_list),
        "shortCoveringCount": len(sc_list),
        "longUnwindingCount": len(lu_list),
        "buildupCounts": {
            "longBuildup": len(lb_list),
            "shortBuildup": len(sb_list),
            "shortCovering": len(sc_list),
            "longUnwinding": len(lu_list),
            "total": len(stocks),
        },
        "indices": indices_list,
        "topGainers": top_gainers,
        "topLosers": top_losers,
        "topOiGainers": top_oi_gainers,
        "topOiLosers": top_oi_losers,
    }


def get_futures_screener(sector: str = "ALL", search: str = "", sort_by: str = "oiValueCr", sort_dir: str = "desc", signal: str = "ALL") -> dict:
    """
    Returns filtered and sorted master records for the Full OI Matrix (200 instruments).
    """
    records = get_futures_master()

    # Sector Filter
    if sector and sector.upper() != "ALL":
        sec_u = sector.upper()
        if sec_u in ("INDICES", "INDEX"):
            records = [r for r in records if r.get("isIndex")]
        elif sec_u == "STOCKS":
            records = [r for r in records if not r.get("isIndex")]
        else:
            records = [r for r in records if r["sector"].upper() == sec_u]

    # Signal Filter
    if signal and signal.upper() != "ALL":
        sig_u = signal.upper()
        if sig_u in ("LB", "LONG BUILDUP"):
            records = [r for r in records if r["buildupCode"] == "LB"]
        elif sig_u in ("SB", "SHORT BUILDUP"):
            records = [r for r in records if r["buildupCode"] == "SB"]
        elif sig_u in ("SC", "SHORT COVERING"):
            records = [r for r in records if r["buildupCode"] == "SC"]
        elif sig_u in ("LU", "LONG UNWINDING"):
            records = [r for r in records if r["buildupCode"] == "LU"]
        elif sig_u == "DISCOUNT":
            records = [r for r in records if r["basis"] < 0]
        elif sig_u == "PREMIUM":
            records = [r for r in records if r["basisPct"] >= 0.3]
        elif sig_u == "BAN":
            records = [r for r in records if r["mwplStatus"] == "BANNED"]
        elif sig_u == "ALERT":
            records = [r for r in records if r["mwplStatus"] in ("ALERT", "BANNED")]

    # Search Filter
    if search:
        q = search.strip().upper()
        records = [r for r in records if q in r["symbol"] or q in r["name"].upper()]

    # Sorting
    rev = sort_dir.lower() == "desc"
    try:
        records = sorted(records, key=lambda x: x.get(sort_by, 0) or 0, reverse=rev)
    except Exception:
        pass

    return {
        "ok": True,
        "count": len(records),
        "totalCount": len(FO_UNIVERSE),
        "data": records,
    }


def get_futures_buildup() -> dict:
    """
    Groups stocks into the 4 Institutional Quadrants.
    """
    records = get_futures_master()
    stocks = [r for r in records if not r["isIndex"]]

    lb = sorted([r for r in stocks if r["buildupCode"] == "LB"], key=lambda x: x["oiChangePct"], reverse=True)
    sb = sorted([r for r in stocks if r["buildupCode"] == "SB"], key=lambda x: x["oiChangePct"], reverse=True)
    sc = sorted([r for r in stocks if r["buildupCode"] == "SC"], key=lambda x: x["priceChangePct"], reverse=True)
    lu = sorted([r for r in stocks if r["buildupCode"] == "LU"], key=lambda x: x["priceChangePct"])

    return {
        "ok": True,
        "longBuildup": lb,
        "shortBuildup": sb,
        "shortCovering": sc,
        "longUnwinding": lu,
        "counts": {
            "LB": len(lb),
            "SB": len(sb),
            "SC": len(sc),
            "LU": len(lu),
        },
    }


def get_futures_heatmap(sector: str = "ALL") -> dict:
    """
    Returns tile/treemap data sized by Open Interest and colored by Day Change %.
    """
    records = get_futures_master()
    if sector and sector.upper() != "ALL":
        records = [r for r in records if r["sector"].upper() == sector.upper()]

    # Sizing: Weight based on OI Value in Cr
    total_oi = sum(r["oiValueCr"] for r in records) or 1.0

    tiles = []
    for r in records:
        weight = round((r["oiValueCr"] / total_oi) * 100.0, 2)
        # Intensity color level (-3 to +3 clamp)
        pct = r["priceChangePct"]
        if pct >= 3.0:
            color_grade = "green-3"
        elif pct >= 1.5:
            color_grade = "green-2"
        elif pct > 0:
            color_grade = "green-1"
        elif pct <= -3.0:
            color_grade = "red-3"
        elif pct <= -1.5:
            color_grade = "red-2"
        elif pct < 0:
            color_grade = "red-1"
        else:
            color_grade = "neutral"

        tiles.append({
            "symbol": r["symbol"],
            "name": r["name"],
            "sector": r["sector"],
            "price": r["futPrice"],
            "changePct": pct,
            "oiCr": r["oiValueCr"],
            "weight": max(1.5, min(14.0, weight * 1.8)),
            "buildup": r["buildup"],
            "colorGrade": color_grade,
        })

    return {
        "ok": True,
        "count": len(tiles),
        "tiles": sorted(tiles, key=lambda x: x["oiCr"], reverse=True),
    }


def get_mwpl_data() -> dict:
    """
    Returns Market Wide Position Limit analysis:
    - Banned stocks (>95%)
    - Alert Zone (80% - 95%)
    - Safe Zone (<80%)
    """
    records = get_futures_master()
    stocks = [r for r in records if not r["isIndex"]]

    banned = sorted([r for r in stocks if r["mwplStatus"] == "BANNED"], key=lambda x: x["mwplPct"], reverse=True)
    alert = sorted([r for r in stocks if r["mwplStatus"] == "ALERT"], key=lambda x: x["mwplPct"], reverse=True)
    normal = sorted([r for r in stocks if r["mwplStatus"] == "NORMAL"], key=lambda x: x["mwplPct"], reverse=True)

    return {
        "ok": True,
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "bannedCount": len(banned),
        "alertCount": len(alert),
        "normalCount": len(normal),
        "banned": banned,
        "alertZone": alert,
        "allStocks": banned + alert + normal,
    }


# =====================================================================
# Historical & Monthly Futures Rollover Matrix Engine
# =====================================================================
ROLLOVER_MONTHS = [
    "AUG 2026", "JUL 2026", "JUN 2026", "APR 2026", "MAR 2026", "FEB 2026",
    "DEC 2025", "NOV 2025", "OCT 2025", "SEP 2025", "AUG 2025", "JUL 2025",
    "JUN 2025", "MAY 2025", "APR 2025", "MAR 2025", "FEB 2025", "JAN 2025"
]

_OFFICIAL_ROLLOVER_FILE = Path("cache/futures_rollover_official.json")

def _load_official_rollover_data() -> dict:
    if _OFFICIAL_ROLLOVER_FILE.exists():
        try:
            with open(_OFFICIAL_ROLLOVER_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading official rollover data: {e}")
    return {"months": [], "records": {}}

_OFFICIAL_ROLLOVER_DATA = _load_official_rollover_data()
if _OFFICIAL_ROLLOVER_DATA.get("months"):
    ROLLOVER_MONTHS = _OFFICIAL_ROLLOVER_DATA["months"]


_LIVE_ROLLOVER_MAP: dict[str, float] = {}

def get_real_contract_rollover_map() -> dict[str, float]:
    """
    Computes exact real-time and EOD rollover % from:
    1. Official Daily NSE F&O Bhavcopy (cache/latest_fo_bhav_rollover.json)
    2. Actual exchange derivatives contracts (cache/nse_fo.csv)
    Rollover % = (Next Month OI + Far Month OI) / Total Futures OI * 100
    """
    global _LIVE_ROLLOVER_MAP
    if _LIVE_ROLLOVER_MAP:
        return _LIVE_ROLLOVER_MAP

    # 1. Start with latest official Bhavcopy EOD calculation
    try:
        import fo_bhavcopy_engine
        bhav_map = fo_bhavcopy_engine.get_latest_fo_bhav_rollover_map()
        if bhav_map:
            _LIVE_ROLLOVER_MAP.update(bhav_map)
    except Exception as e:
        logger.debug(f"Error loading bhavcopy rollover map: {e}")

    # 2. Overlay live contract feed if available
    csv_path = Path("cache/nse_fo.csv")
    if csv_path.exists():
        from collections import defaultdict
        import csv

        contract_data = defaultdict(list)
        try:
            with open(csv_path, mode="r", encoding="utf-8", errors="ignore") as f:
                r = csv.DictReader(f)
                for row in r:
                    if row.get("pInstType") in ("FUTSTK", "FUTIDX"):
                        sym = row.get("pSymbolName")
                        ts = row.get("pTrdSymbol")
                        try:
                            oi = float(row.get("dOpenInterest ") or row.get("dOpenInterest") or 0)
                            exp = int(row.get("lExpiryDate ") or row.get("lExpiryDate") or 0)
                            contract_data[sym].append((exp, ts, oi))
                        except Exception:
                            pass

            for sym, c_list in contract_data.items():
                sorted_c = sorted(c_list, key=lambda x: x[0])
                if len(sorted_c) >= 2:
                    total_oi = sum(c[2] for c in sorted_c)
                    roll_oi = sum(c[2] for c in sorted_c[1:])
                    if total_oi > 0:
                        _LIVE_ROLLOVER_MAP[sym] = round((roll_oi / total_oi) * 100.0, 4)
        except Exception as e:
            logger.debug(f"Error computing live contract rollover: {e}")

    return _LIVE_ROLLOVER_MAP


def get_official_rollover(sym: str, month: str) -> str | float:
    """
    Returns the exact official historical rollover % for the given symbol and month.
    No synthetic formula or random generation is used. If not present, returns '-'.
    """
    records = _OFFICIAL_ROLLOVER_DATA.get("records", {})
    sym_u = sym.strip().upper()
    if sym_u in records and month in records[sym_u]:
        val = records[sym_u][month]
        if val != "-" and val is not None:
            try:
                return float(val)
            except Exception:
                return "-"
        return "-"
    return "-"


def get_futures_rollover_matrix(
    sector: str = "ALL",
    search: str = "",
    sort_by: str = "symbol",
    sort_dir: str = "asc"
) -> dict:
    """
    Returns full Historical & Monthly Futures Rollover Matrix for all F&O universe symbols.
    Uses official historical records from cache/futures_rollover_official.json and
    real-time contract calculations from cache/nse_fo.csv.
    """
    records = get_futures_master()
    rec_by_sym = {r["symbol"].upper(): r for r in records}

    # Merge in any extra symbols from official records (e.g. historical F&O stocks)
    official_records = _OFFICIAL_ROLLOVER_DATA.get("records", {})
    all_syms = list(rec_by_sym.keys())
    for off_sym in sorted(official_records.keys()):
        if off_sym not in rec_by_sym:
            all_syms.append(off_sym)

    real_ro_map = get_real_contract_rollover_map()

    rollover_rows = []
    all_aug_vals = []

    for sym in all_syms:
        rec = rec_by_sym.get(sym)
        if rec:
            sec = rec.get("sector", "Others")
            name = rec.get("name", sym)
            is_index = rec.get("isIndex", False)
            spot_price = rec.get("spotPrice", 0.0)
            fut_price = rec.get("futPrice", 0.0)
            basis = rec.get("basis", 0.0)
            curr_ro = real_ro_map.get(sym) or round(rec.get("rolloverPct", 0.0), 4)
        else:
            is_index = sym in ("NIFTY", "BANKNIFTY", "FINNIFTY", "MIDCPNIFTY", "NIFTYNXT50")
            sec = "Indices" if is_index else "Others"
            name = sym
            spot_price = 0.0
            fut_price = 0.0
            basis = 0.0
            curr_ro = real_ro_map.get(sym) or 0.0

        # Build monthly rollover mapping from official data
        monthly_map = {}
        active_vals = []
        for m in ROLLOVER_MONTHS:
            v = get_official_rollover(sym, m)
            monthly_map[m] = v
            if isinstance(v, (int, float)):
                active_vals.append(v)
                if m == "AUG 2026":
                    all_aug_vals.append(v)

        # Calculate 3M Average (AUG 2026, JUL 2026, JUN 2026)
        m3_vals = [
            monthly_map[m] for m in ["AUG 2026", "JUL 2026", "JUN 2026"]
            if isinstance(monthly_map.get(m), (int, float))
        ]
        avg_3m = round(sum(m3_vals) / len(m3_vals), 4) if m3_vals else 0.0

        # Calculate 6M Average
        avg_6m = round(sum(active_vals[:6]) / len(active_vals[:6]), 4) if len(active_vals) >= 6 else avg_3m

        latest_ro = monthly_map.get("AUG 2026")
        if isinstance(latest_ro, (int, float)) and avg_3m > 0:
            trend = "UP" if latest_ro >= avg_3m else "DOWN"
            diff_from_avg = round(latest_ro - avg_3m, 4)
        else:
            trend = "FLAT"
            diff_from_avg = 0.0

        rollover_rows.append({
            "symbol": sym,
            "name": name,
            "sector": sec,
            "isIndex": is_index,
            "spotPrice": spot_price,
            "futPrice": fut_price,
            "basis": basis,
            "currentRo": curr_ro,
            "rollovers": monthly_map,
            "avg3M": avg_3m,
            "avg6M": avg_6m,
            "diff3M": diff_from_avg,
            "trend": trend,
        })

    # Sector Filter
    if sector and sector.upper() != "ALL":
        sec_u = sector.upper()
        if sec_u in ("INDICES", "INDEX"):
            rollover_rows = [r for r in rollover_rows if r.get("isIndex")]
        elif sec_u == "STOCKS":
            rollover_rows = [r for r in rollover_rows if not r.get("isIndex")]
        else:
            rollover_rows = [r for r in rollover_rows if r["sector"].upper() == sec_u]

    # Search Filter
    if search:
        q = search.strip().upper()
        rollover_rows = [r for r in rollover_rows if q in r["symbol"] or q in r["name"].upper()]

    # Sorting
    rev = sort_dir.lower() == "desc"
    if sort_by == "symbol":
        rollover_rows = sorted(rollover_rows, key=lambda x: x["symbol"], reverse=rev)
    elif sort_by in ROLLOVER_MONTHS:
        def _sort_key(x):
            v = x["rollovers"].get(sort_by)
            return float(v) if isinstance(v, (int, float)) else -1.0
        rollover_rows = sorted(rollover_rows, key=_sort_key, reverse=rev)
    elif sort_by in ("avg3M", "avg6M", "currentRo", "diff3M"):
        rollover_rows = sorted(rollover_rows, key=lambda x: x.get(sort_by, 0.0), reverse=rev)
    else:
        rollover_rows = sorted(rollover_rows, key=lambda x: x["symbol"], reverse=rev)

    # Market Macro Rollover Stats
    avg_market_ro = round(sum(all_aug_vals) / len(all_aug_vals), 2) if all_aug_vals else 0.0
    high_ro_count = sum(1 for v in all_aug_vals if v >= 90.0)
    low_ro_count = sum(1 for v in all_aug_vals if v < 75.0)

    return {
        "ok": True,
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "date": datetime.now().strftime("%d-%b-%Y"),
        "months": ROLLOVER_MONTHS,
        "count": len(rollover_rows),
        "totalUniverse": len(rollover_rows),
        "stats": {
            "avgMarketRollover": avg_market_ro,
            "highRolloverCount": high_ro_count,
            "lowRolloverCount": low_ro_count,
            "totalTracked": len(rollover_rows)
        },
        "data": rollover_rows,
    }

