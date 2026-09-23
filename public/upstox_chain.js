/**
 * Upstox Option Chain Pro - Interactive Frontend Engine
 * Powered exclusively by Upstox API v2
 * Zero dependencies on Angel One
 */

(function () {
  const state = {
    instrumentKey: 'NSE_INDEX|Nifty 50',
    expiryDate: '',
    strikeRange: 10, // ±10 strikes around ATM
    viewMode: 'greeks', // 'greeks' | 'standard'
    autoRefreshSec: 0,
    timerId: null,
    chainData: null,
    isLoading: false,
  };

  function fmtNum(n, decimals = 2) {
    if (n === null || n === undefined || isNaN(n)) return '--';
    return Number(n).toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  function fmtQty(q) {
    if (!q || isNaN(q)) return '--';
    const num = Number(q);
    if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr';
    if (num >= 100000) return (num / 100000).toFixed(2) + ' L';
    if (num >= 1000) return (num / 1000).toFixed(1) + ' k';
    return num.toLocaleString('en-IN');
  }

  async function fetchChain(force = false) {
    if (state.isLoading) return;
    state.isLoading = true;

    const btnRef = document.getElementById('upstoxBtnRefresh');
    if (btnRef) btnRef.classList.add('loading-spin');

    const statusEl = document.getElementById('upstoxLiveStatus');
    if (statusEl) statusEl.textContent = '⏳ Fetching Upstox API...';

    try {
      const res = await fetch('/api/upstox/option-chain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instrument_key: state.instrumentKey,
          expiry_date: state.expiryDate,
          forceRefresh: force,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      state.chainData = data;

      // Update available expiries dropdown
      updateExpiriesDropdown(data.availableExpiries || [], data.expiry);

      // Render summary ribbon
      renderSummary(data);

      // Render strikes table
      renderTable(data);

      // Update status tag
      if (statusEl) {
        if (data.isLive) {
          statusEl.innerHTML = '🟢 <span style="color:#34d399;">Upstox Live Exchange Feed</span>';
        } else {
          statusEl.innerHTML = '🟡 <span style="color:#fbbf24;">Upstox Demo Stream</span> <a href="/admin.html" target="_blank" style="color:#60a5fa; text-decoration:underline; margin-left:6px; font-size:11px;">Connect Live Token in Admin ↗</a>';
        }
      }

      const updEl = document.getElementById('upstoxLastUpdated');
      if (updEl) updEl.textContent = data.lastUpdated || new Date().toLocaleTimeString();
    } catch (e) {
      console.error('Failed to load Upstox option chain:', e);
      if (statusEl) {
        statusEl.innerHTML = `🔴 <span style="color:#f87171;">Fetch error: ${e.message}</span>`;
      }
    } finally {
      state.isLoading = false;
      if (btnRef) btnRef.classList.remove('loading-spin');
    }
  }

  function updateExpiriesDropdown(expiries, currentExpiry) {
    const sel = document.getElementById('upstoxExpirySelect');
    if (!sel) return;

    // Check if options changed
    const currentOpts = Array.from(sel.options).map(o => o.value);
    const same = currentOpts.length === expiries.length && expiries.every((e, i) => e === currentOpts[i]);

    if (!same) {
      sel.innerHTML = '';
      expiries.forEach((exp, idx) => {
        const opt = document.createElement('option');
        opt.value = exp;
        try {
          const d = new Date(exp);
          opt.textContent = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + (idx === 0 ? ' (Current)' : '');
        } catch (_) {
          opt.textContent = exp;
        }
        sel.appendChild(opt);
      });
    }

    if (currentExpiry) {
      sel.value = currentExpiry;
      state.expiryDate = currentExpiry;
    }
  }

  function renderSummary(data) {
    const spot = Number(data.spotPrice || 0);
    const pcr = Number(data.pcr || 1.0);
    const maxPain = Number(data.maxPain || 0);
    const atmStraddle = Number(data.atmStraddle || 0);
    const expMove = Number(data.expectedMove || 0);

    const elSpot = document.getElementById('upstoxSpotVal');
    if (elSpot) elSpot.textContent = '₹' + fmtNum(spot, 2);

    const elPcr = document.getElementById('upstoxPcrVal');
    const elPcrTag = document.getElementById('upstoxPcrTag');
    if (elPcr) {
      elPcr.textContent = pcr.toFixed(2);
      if (elPcrTag) {
        if (pcr > 1.2) {
          elPcrTag.textContent = 'BULLISH (PE HEAVY)';
          elPcrTag.style.color = '#34d399';
        } else if (pcr < 0.8) {
          elPcrTag.textContent = 'BEARISH (CE HEAVY)';
          elPcrTag.style.color = '#f87171';
        } else {
          elPcrTag.textContent = 'NEUTRAL / BALANCED';
          elPcrTag.style.color = '#fbbf24';
        }
      }
    }

    const elPain = document.getElementById('upstoxMaxPainVal');
    if (elPain) elPain.textContent = maxPain ? '₹' + fmtNum(maxPain, 0) : '--';

    const elAtm = document.getElementById('upstoxAtmStrikeVal');
    if (elAtm) elAtm.textContent = '₹' + fmtNum(data.atmStrike || spot, 0);

    const elStraddle = document.getElementById('upstoxStraddleVal');
    if (elStraddle) elStraddle.textContent = atmStraddle ? '₹' + fmtNum(atmStraddle, 2) : '--';

    const elExpMove = document.getElementById('upstoxExpectedMoveVal');
    if (elExpMove) elExpMove.textContent = expMove ? '±' + fmtNum(expMove, 1) + ' pts' : '--';

    const elCeOi = document.getElementById('upstoxTotalCeOi');
    if (elCeOi) elCeOi.textContent = fmtQty(data.totalCeOi);

    const elPeOi = document.getElementById('upstoxTotalPeOi');
    if (elPeOi) elPeOi.textContent = fmtQty(data.totalPeOi);
  }

  function renderTable(data) {
    const tbody = document.getElementById('upstoxChainTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const rows = data.data || [];
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="23" style="text-align:center; padding:30px; color:var(--text-muted);">No option strikes available for selected expiry.</td></tr>`;
      return;
    }

    const spot = Number(data.spotPrice || 0);

    // Find ATM index
    let atmIdx = 0;
    let minDiff = Infinity;
    rows.forEach((r, idx) => {
      const diff = Math.abs(Number(r.strike_price || 0) - spot);
      if (diff < minDiff) {
        minDiff = diff;
        atmIdx = idx;
      }
    });

    // Filter strikes by range
    let filteredRows = rows;
    if (state.strikeRange > 0) {
      const start = Math.max(0, atmIdx - state.strikeRange);
      const end = Math.min(rows.length, atmIdx + state.strikeRange + 1);
      filteredRows = rows.slice(start, end);
    }

    // Find max OI for visual depth bars
    let maxCeOi = 1;
    let maxPeOi = 1;
    filteredRows.forEach(r => {
      const ceOi = Number(r.call_options?.market_data?.oi || 0);
      const peOi = Number(r.put_options?.market_data?.oi || 0);
      if (ceOi > maxCeOi) maxCeOi = ceOi;
      if (peOi > maxPeOi) maxPeOi = peOi;
    });

    const isGreeks = state.viewMode === 'greeks';

    // Show/hide Greek headers
    document.querySelectorAll('.upstox-greek-col').forEach(el => {
      el.style.display = isGreeks ? '' : 'none';
    });

    filteredRows.forEach((r, idx) => {
      const strike = Number(r.strike_price || 0);
      const isAtm = Math.abs(strike - spot) === minDiff;
      const isCallItm = strike < spot;
      const isPutItm = strike > spot;

      const ce = r.call_options || {};
      const pe = r.put_options || {};

      const ceMd = ce.market_data || {};
      const peMd = pe.market_data || {};

      const ceGr = ce.option_greeks || {};
      const peGr = pe.option_greeks || {};

      const ceOi = Number(ceMd.oi || 0);
      const peOi = Number(peMd.oi || 0);

      const ceOiBarWidth = Math.min(100, Math.round((ceOi / maxCeOi) * 100));
      const peOiBarWidth = Math.min(100, Math.round((peOi / maxPeOi) * 100));

      const ceLtp = Number(ceMd.ltp || 0);
      const peLtp = Number(peMd.ltp || 0);

      const tr = document.createElement('tr');
      tr.className = `upstox-chain-row ${isAtm ? 'is-atm' : ''}`;

      // Call ITM / OTM class
      const callBgClass = isCallItm ? 'itm-call' : 'otm-call';
      const putBgClass = isPutItm ? 'itm-put' : 'otm-put';

      tr.innerHTML = `
        <!-- CALL SIDE -->
        <td class="${callBgClass} col-oi-bar" style="position:relative; width:65px;">
          <div class="oi-bar oi-bar-call" style="width:${ceOiBarWidth}%;"></div>
          <span style="position:relative; z-index:1;">${fmtQty(ceOi)}</span>
        </td>
        <td class="${callBgClass} col-vol">${fmtQty(ceMd.volume)}</td>
        <td class="${callBgClass} col-iv upstox-greek-col">${ceGr.iv ? fmtNum(ceGr.iv, 1) + '%' : '--'}</td>
        <td class="${callBgClass} col-delta upstox-greek-col">${ceGr.delta !== undefined ? fmtNum(ceGr.delta, 2) : '--'}</td>
        <td class="${callBgClass} col-theta upstox-greek-col">${ceGr.theta !== undefined ? fmtNum(ceGr.theta, 1) : '--'}</td>
        <td class="${callBgClass} col-vega upstox-greek-col">${ceGr.vega !== undefined ? fmtNum(ceGr.vega, 1) : '--'}</td>
        <td class="${callBgClass} col-gamma upstox-greek-col">${ceGr.gamma !== undefined ? fmtNum(ceGr.gamma, 3) : '--'}</td>
        <td class="${callBgClass} col-ltp ${ceLtp > (ceMd.close_price || 0) ? 'up-tick' : 'down-tick'}">
          <strong>${fmtNum(ceLtp, 2)}</strong>
        </td>
        <td class="${callBgClass} col-chg ${Number(ceMd.net_change || 0) >= 0 ? 'text-green' : 'text-red'}">
          ${ceMd.net_change ? (Number(ceMd.net_change) >= 0 ? '+' : '') + fmtNum(ceMd.net_change, 1) : '--'}
        </td>

        <!-- STRIKE CENTER -->
        <td class="col-strike ${isAtm ? 'atm-strike-badge' : ''}">
          <div class="strike-wrap">
            <span>${strike.toLocaleString('en-IN')}</span>
            ${isAtm ? '<span class="atm-tag">ATM</span>' : ''}
          </div>
        </td>

        <!-- PUT SIDE -->
        <td class="${putBgClass} col-chg ${Number(peMd.net_change || 0) >= 0 ? 'text-green' : 'text-red'}">
          ${peMd.net_change ? (Number(peMd.net_change) >= 0 ? '+' : '') + fmtNum(peMd.net_change, 1) : '--'}
        </td>
        <td class="${putBgClass} col-ltp ${peLtp > (peMd.close_price || 0) ? 'up-tick' : 'down-tick'}">
          <strong>${fmtNum(peLtp, 2)}</strong>
        </td>
        <td class="${putBgClass} col-delta upstox-greek-col">${peGr.delta !== undefined ? fmtNum(peGr.delta, 2) : '--'}</td>
        <td class="${putBgClass} col-theta upstox-greek-col">${peGr.theta !== undefined ? fmtNum(peGr.theta, 1) : '--'}</td>
        <td class="${putBgClass} col-vega upstox-greek-col">${peGr.vega !== undefined ? fmtNum(peGr.vega, 1) : '--'}</td>
        <td class="${putBgClass} col-gamma upstox-greek-col">${peGr.gamma !== undefined ? fmtNum(peGr.gamma, 3) : '--'}</td>
        <td class="${putBgClass} col-iv upstox-greek-col">${peGr.iv ? fmtNum(peGr.iv, 1) + '%' : '--'}</td>
        <td class="${putBgClass} col-vol">${fmtQty(peMd.volume)}</td>
        <td class="${putBgClass} col-oi-bar" style="position:relative; width:65px;">
          <div class="oi-bar oi-bar-put" style="width:${peOiBarWidth}%;"></div>
          <span style="position:relative; z-index:1;">${fmtQty(peOi)}</span>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Re-apply Greeks column visibility on dynamic rows
    if (!isGreeks) {
      document.querySelectorAll('#upstoxChainTableBody .upstox-greek-col').forEach(el => {
        el.style.display = 'none';
      });
    }
  }

  // Event Handlers Setup
  function initListeners() {
    const selInst = document.getElementById('upstoxIndexSelect');
    if (selInst) {
      selInst.addEventListener('change', e => {
        state.instrumentKey = e.target.value;
        state.expiryDate = ''; // Reset expiry to auto-select nearest
        fetchChain(true);
      });
    }

    const selExp = document.getElementById('upstoxExpirySelect');
    if (selExp) {
      selExp.addEventListener('change', e => {
        state.expiryDate = e.target.value;
        fetchChain(true);
      });
    }

    const selRange = document.getElementById('upstoxStrikeRangeSelect');
    if (selRange) {
      selRange.addEventListener('change', e => {
        state.strikeRange = parseInt(e.target.value, 10);
        if (state.chainData) renderTable(state.chainData);
      });
    }

    const selView = document.getElementById('upstoxViewModeSelect');
    if (selView) {
      selView.addEventListener('change', e => {
        state.viewMode = e.target.value;
        if (state.chainData) renderTable(state.chainData);
      });
    }

    const selAuto = document.getElementById('upstoxAutoRefreshSelect');
    if (selAuto) {
      selAuto.addEventListener('change', e => {
        const sec = parseInt(e.target.value, 10);
        state.autoRefreshSec = sec;
        if (state.timerId) clearInterval(state.timerId);
        if (sec > 0) {
          state.timerId = setInterval(() => fetchChain(false), sec * 1000);
        }
      });
    }

    const btnRef = document.getElementById('upstoxBtnRefresh');
    if (btnRef) {
      btnRef.addEventListener('click', () => fetchChain(true));
    }
  }

  // Public Interface attached to window
  window.upstoxOptionChain = {
    init: function () {
      initListeners();
      fetchChain(false);
    },
    refresh: function () {
      fetchChain(true);
    },
    setInstrument: function (key) {
      state.instrumentKey = key;
      const el = document.getElementById('upstoxIndexSelect');
      if (el) el.value = key;
      fetchChain(true);
    },
  };

  // Run init on DOMContentLoaded or immediate if document already ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.upstoxOptionChain.init());
  } else {
    window.upstoxOptionChain.init();
  }
})();
