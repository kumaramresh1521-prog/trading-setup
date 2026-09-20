"""
seo_engine.py
Dynamic SEO & Google Search Console Management Engine for Breadth Lab.
Persists SEO configuration, Google verification tokens, GA4/GTM IDs, and
handles sitemap / robots.txt status.
"""

from __future__ import annotations
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SEO_CONFIG_FILE = ROOT / "seo_config.json"

DEFAULT_SEO_CONFIG = {
    "site_title": "Breadth Lab | Market Breadth, Options Greeks & Institutional Research Desk",
    "meta_description": "Institutional-grade Indian equity Market Breadth, sub-second Options Greeks (Delta, Gamma, Theta, Vega), Max Pain, Smart Money FII/DII positioning & verified broker research price targets with audit proof.",
    "keywords": "market breadth, nifty 50, options desk, options greeks, black scholes greeks, max pain, pcr ratio, fii dii data, smart money tracker, broker price targets, jefferies target, morgan stanley, sebi disclaimer",
    "canonical_url": "https://breadthlab.com/",
    "google_site_verification": "",
    "google_analytics_id": "",
    "og_title": "Breadth Lab | Institutional Market Breadth & Options Analytics",
    "og_description": "Real-time Indian equity Market Breadth, Black-Scholes Greeks, Smart Money EOD Tracker, and verified broker research targets.",
    "author": "Breadth Lab Quantitative Analytics",
    "sitemap_url": "https://breadthlab.com/sitemap.xml",
    "robots_indexing": True
}

def load_seo_config() -> dict:
    if SEO_CONFIG_FILE.exists():
        try:
            data = json.loads(SEO_CONFIG_FILE.read_text(encoding="utf-8"))
            merged = DEFAULT_SEO_CONFIG.copy()
            merged.update(data)
            return merged
        except Exception:
            pass
    return DEFAULT_SEO_CONFIG.copy()

def save_seo_config(updates: dict) -> bool:
    try:
        current = load_seo_config()
        current.update(updates)
        SEO_CONFIG_FILE.write_text(json.dumps(current, indent=2), encoding="utf-8")
        apply_seo_to_index_html(current)
        return True
    except Exception as e:
        print(f"[SEO Engine] Error saving config: {e}")
        return False

def apply_seo_to_index_html(config: dict) -> bool:
    index_file = ROOT / "public" / "index.html"
    if not index_file.exists():
        return False
    try:
        content = index_file.read_text(encoding="utf-8")
        
        # Update <title>
        if "<title>" in content and "</title>" in content:
            pre = content.split("<title>")[0]
            post = content.split("</title>")[1]
            content = f"{pre}<title>{config['site_title']}</title>{post}"
            
        index_file.write_text(content, encoding="utf-8")
        return True
    except Exception as e:
        print(f"[SEO Engine] Error updating index.html: {e}")
        return False
