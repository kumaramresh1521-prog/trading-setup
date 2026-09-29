/**
 * Upstox Option Chain Pro - Modern Institutional Derivatives Matrix
 * Powered exclusively by Upstox API v2
 * Zero dependencies on Angel One
 */

(function () {
  const state = {
    instrumentKey: 'NSE_INDEX|Nifty 50',
    expiryDate: '',
    strikeRange: 10, // ±10 strikes around ATM by default
    viewMode: 'buildup', // 'buildup' (OI mode) | 'greeks'
    activeTab: 'chain', // 'chain' | 'force' | 'maxpain' | 'oidist' | 'greeks'
    visualizerMetric: 'turnover', // Active purple pill by default (matching Image 15!)
    visHoverIndex: -1,
    visChartBounds: [],
    searchQuery: '',
    autoRefreshSec: 5,
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
    if (q === null || q === undefined || isNaN(q)) return '--';
    const num = Number(q);
    const abs = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    if (abs >= 10000000) return sign + (abs / 10000000).toFixed(2) + ' Cr';
    if (abs >= 100000) return sign + (abs / 100000).toFixed(2) + ' L';
    if (abs >= 1000) return sign + (abs / 1000).toFixed(1) + ' k';
    return num.toLocaleString('en-IN');
  }

  function getBuildup(chgPrice, chgOi) {
    const cp = Number(chgPrice || 0);
    const co = Number(chgOi || 0);
    if (co === 0 && cp === 0) return { code: '--', cls: 'buildup-none', title: 'Neutral' };
    if (cp >= 0 && co >= 0) return { code: 'LB', cls: 'buildup-lb', title: 'Long Buildup (Bullish - Buyers Adding)' };
    if (cp < 0 && co >= 0) return { code: 'SB', cls: 'buildup-sb', title: 'Short Buildup (Bearish - Writers Adding)' };
    if (cp >= 0 && co < 0) return { code: 'SC', cls: 'buildup-sc', title: 'Short Covering (Bullish - Writers Covering)' };
    return { code: 'LU', cls: 'buildup-lu', title: 'Long Unwinding (Bearish - Bulls Exiting)' };
  }

  async function fetchChain(force = false) {
    if (state.isLoading) return;

    // Guard: Do not poll when the Upstox panel is hidden or inactive, unless user explicitly clicked refresh
    const panel = document.getElementById('panelUpstoxChain');
    if (!force && (!panel || panel.style.display === 'none' || panel.offsetParent === null)) {
      return;
    }

    state.isLoading = true;

    const iconRef = document.getElementById('upstoxRefreshIcon');
    if (force && iconRef) iconRef.classList.add('spin');

    const statusEl = document.getElementById('upstoxLiveStatus');
    if (statusEl) statusEl.textContent = '⏳ Fetching Upstox...';

    try {
      const isDirectHttp = window.location.protocol.startsWith('http') && (window.location.port === '8000' || window.location.port === '');
      const baseUrl = isDirectHttp ? '' : 'http://127.0.0.1:8000';
      const endpoint = `${baseUrl}/api/upstox/option-chain`;

      const res = await fetch(endpoint, {
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

      // Render 14-Metric Multi-Strike Visualizer Chart (Image 15 Style)
      renderVisualizerChart(data);

      // Render active quant analytics pane
      renderActivePane(data);

      // Update status tag
      if (statusEl) {
        if (data.isLive) {
          statusEl.className = 'upstox-badge-live is-live';
          statusEl.innerHTML = '🟢 <span>Upstox Live Stream</span>';
        } else {
          statusEl.className = 'upstox-badge-live is-demo';
          statusEl.innerHTML = '🟡 <span>Upstox Demo Stream</span> <a href="/admin.html" target="_blank" style="color:#60a5fa; text-decoration:none; margin-left:6px; font-weight:700;">Connect Token ↗</a>';
        }
      }

      const updEl = document.getElementById('upstoxLastUpdated');
      if (updEl) updEl.textContent = data.lastUpdated || new Date().toLocaleTimeString();
    } catch (e) {
      console.error('Failed to load Upstox option chain:', e);
      if (statusEl) {
        statusEl.className = 'upstox-badge-live is-error';
        statusEl.innerHTML = `🔴 <span>Connecting to Backend Server...</span> <button id="upstoxRetryBtn" style="background:#2563eb; color:#fff; border:none; padding:2px 8px; border-radius:4px; margin-left:6px; cursor:pointer; font-size:10px; font-weight:700;">Retry</button>`;
        const rBtn = document.getElementById('upstoxRetryBtn');
        if (rBtn) rBtn.onclick = () => fetchChain(true);
      }
      // Auto-retry once after 2.5s if offline during server reload
      setTimeout(() => {
        if (!state.chainData && !state.isLoading) fetchChain(false);
      }, 2500);
    } finally {
      state.isLoading = false;
      if (iconRef) iconRef.classList.remove('spin');
    }
  }

  function updateExpiriesDropdown(expiries, currentExpiry) {
    const sel = document.getElementById('upstoxExpirySelect');
    if (!sel) return;

    const currentOpts = Array.from(sel.options).map(o => o.value);
    const same = currentOpts.length === expiries.length && expiries.every((e, i) => e === currentOpts[i]);

    if (!same) {
      sel.innerHTML = '';
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      expiries.forEach((exp, idx) => {
        const opt = document.createElement('option');
        opt.value = exp;
        try {
          const d = new Date(exp);
          d.setHours(0, 0, 0, 0);
          const diffDays = Math.round((d - today) / (1000 * 60 * 60 * 24));
          const dteLabel = diffDays === 0 ? '0 DTE (Today)' : diffDays === 1 ? '1 DTE' : `${diffDays} DTE`;
          const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
          opt.textContent = `${dateStr} • ${dteLabel}${idx === 0 ? ' ⚡' : ''}`;
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
    const dayChg = Number(data.dayChange || 0);
    const dayChgPct = Number(data.dayChangePct || 0);

    const elSpot = document.getElementById('upstoxSpotVal');
    if (elSpot) elSpot.textContent = '₹' + fmtNum(spot, 2);

    const elSpotChg = document.getElementById('upstoxSpotChg');
    if (elSpotChg) {
      const isPos = dayChg >= 0;
      elSpotChg.textContent = `${isPos ? '+' : ''}${fmtNum(dayChg, 2)} (${isPos ? '+' : ''}${fmtNum(dayChgPct, 2)}%)`;
      elSpotChg.style.background = isPos ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
      elSpotChg.style.color = isPos ? '#34d399' : '#f87171';
    }

    const elPcr = document.getElementById('upstoxPcrVal');
    const elPcrTag = document.getElementById('upstoxPcrTag');
    if (elPcr) {
      elPcr.textContent = pcr.toFixed(2);
      if (elPcrTag) {
        if (pcr >= 1.25) {
          elPcrTag.textContent = '🟢 STRONG BULLISH';
          elPcrTag.style.background = 'rgba(16, 185, 129, 0.2)';
          elPcrTag.style.color = '#34d399';
        } else if (pcr >= 1.0) {
          elPcrTag.textContent = '🟢 MILD BULLISH';
          elPcrTag.style.background = 'rgba(16, 185, 129, 0.15)';
          elPcrTag.style.color = '#34d399';
        } else if (pcr <= 0.75) {
          elPcrTag.textContent = '🔴 STRONG BEARISH';
          elPcrTag.style.background = 'rgba(239, 68, 68, 0.2)';
          elPcrTag.style.color = '#f87171';
        } else if (pcr <= 0.9) {
          elPcrTag.textContent = '🔴 MILD BEARISH';
          elPcrTag.style.background = 'rgba(239, 68, 68, 0.15)';
          elPcrTag.style.color = '#f87171';
        } else {
          elPcrTag.textContent = '🟡 BALANCED';
          elPcrTag.style.background = 'rgba(245, 158, 11, 0.15)';
          elPcrTag.style.color = '#fbbf24';
        }
      }
    }

    const elPcrMeter = document.getElementById('upstoxPcrMeter');
    if (elPcrMeter) {
      const pcrPct = Math.min(100, Math.max(5, ((pcr - 0.4) / 1.4) * 100));
      elPcrMeter.style.width = `${pcrPct}%`;
      elPcrMeter.style.background = pcr >= 1.0 ? '#10b981' : pcr <= 0.8 ? '#ef4444' : '#fbbf24';
    }

    const elPain = document.getElementById('upstoxMaxPainVal');
    if (elPain) elPain.textContent = maxPain ? '₹' + fmtNum(maxPain, 0) : '--';

    const elPainDelta = document.getElementById('upstoxMaxPainDelta');
    if (elPainDelta && maxPain) {
      const mpDiff = spot - maxPain;
      elPainDelta.style.display = '';
      const isAbove = mpDiff >= 0;
      elPainDelta.textContent = `${isAbove ? '+' : ''}${fmtNum(mpDiff, 0)} pts`;
      elPainDelta.style.background = isAbove ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
      elPainDelta.style.color = isAbove ? '#34d399' : '#f87171';
    }

    const elAtm = document.getElementById('upstoxAtmStrikeVal');
    if (elAtm) elAtm.textContent = '₹' + fmtNum(data.atmStrike || spot, 0);

    const elStraddle = document.getElementById('upstoxStraddleVal');
    if (elStraddle) elStraddle.textContent = atmStraddle ? '₹' + fmtNum(atmStraddle, 2) : '--';

    // India VIX (Next to Expected Move)
    const vix = Number(data.indiaVix || 13.25);
    const vixChg = Number(data.vixChange || -0.42);
    const elVix = document.getElementById('upstoxVixVal');
    const elVixTag = document.getElementById('upstoxVixTag');
    if (elVix) elVix.textContent = vix.toFixed(2);
    if (elVixTag) {
      elVixTag.textContent = `${vixChg >= 0 ? '+' : ''}${vixChg.toFixed(2)}%`;
      elVixTag.style.background = vixChg >= 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)';
      elVixTag.style.color = vixChg >= 0 ? '#f87171' : '#34d399';
    }

    // Expected Move (Fixed to calculate accurately and never show blank)
    let expMove = Number(data.expectedMove || 0);
    if (!expMove || expMove <= 0) {
      expMove = atmStraddle > 0 ? (atmStraddle * 0.85) : (spot * (vix / 100.0) * Math.sqrt(1 / 365.0));
    }
    const elExpMove = document.getElementById('upstoxExpectedMoveVal');
    const elExpRange = document.getElementById('upstoxExpectedRangeSub');
    if (elExpMove) elExpMove.textContent = '±' + fmtNum(expMove, 1) + ' pts';
    if (elExpRange) {
      const lower = spot - expMove;
      const upper = spot + expMove;
      elExpRange.textContent = `[${fmtNum(lower, 0)} - ${fmtNum(upper, 0)}]`;
    }

    const elCeOi = document.getElementById('upstoxTotalCeOi');
    if (elCeOi) elCeOi.textContent = fmtQty(data.totalCeOi);

    const elPeOi = document.getElementById('upstoxTotalPeOi');
    if (elPeOi) elPeOi.textContent = fmtQty(data.totalPeOi);

    // Update OI Concentration Split Bar
    const totCe = Number(data.totalCeOi || 0);
    const totPe = Number(data.totalPeOi || 0);
    const totAll = Math.max(1, totCe + totPe);
    const cePct = Math.round((totCe / totAll) * 100);
    const pePct = 100 - cePct;

    const rCe = document.getElementById('upstoxOiRatioCe');
    const rPe = document.getElementById('upstoxOiRatioPe');
    if (rCe) {
      rCe.style.width = cePct + '%';
      rCe.title = `Call Writers (Resistance): ${cePct}% (${fmtQty(totCe)})`;
    }
    if (rPe) {
      rPe.style.width = pePct + '%';
      rPe.title = `Put Writers (Support): ${pePct}% (${fmtQty(totPe)})`;
    }

    // Extract ATM row and quant metrics for Range BE & Force Ribbon Badges
    const rows = data.data || [];
    let atmRow = null;
    let minAtmDiff = Infinity;
    rows.forEach(r => {
      const diff = Math.abs(Number(r.strike_price || 0) - spot);
      if (diff < minAtmDiff) {
        minAtmDiff = diff;
        atmRow = r;
      }
    });

    const qm = atmRow ? (atmRow.quant_metrics || {}) : {};

    // 1. RANGE (BE)
    const elBe = document.getElementById('upstoxBeVal');
    if (elBe) {
      if (qm.lower_be && qm.upper_be) {
        elBe.textContent = `[${fmtNum(qm.lower_be, 0)} - ${fmtNum(qm.upper_be, 0)}]`;
      } else if (atmStraddle > 0) {
        elBe.textContent = `[${fmtNum(spot - atmStraddle, 0)} - ${fmtNum(spot + atmStraddle, 0)}]`;
      } else {
        elBe.textContent = '--';
      }
    }

    // 2. DIRECTIONAL FORCE
    const forceScore = Number(qm.force_score !== undefined ? qm.force_score : (pcr >= 1.0 ? (pcr - 1.0) * 80 : (pcr - 1.0) * 100));
    const elForceVal = document.getElementById('upstoxForceVal');
    const elForceTag = document.getElementById('upstoxForceTag');
    const elForceTabBadge = document.getElementById('upstoxForceTabBadge');

    if (elForceVal) {
      elForceVal.textContent = `${forceScore >= 0 ? '+' : ''}${forceScore.toFixed(1)}`;
      elForceVal.style.color = forceScore >= 12 ? '#10b981' : forceScore <= -12 ? '#ef4444' : '#fbbf24';
    }
    if (elForceTag) {
      if (forceScore >= 25) {
        elForceTag.textContent = '🟢 STRONG BULL';
        elForceTag.style.background = 'rgba(16, 185, 129, 0.2)';
        elForceTag.style.color = '#34d399';
      } else if (forceScore >= 8) {
        elForceTag.textContent = '🟢 MILD BULL';
        elForceTag.style.background = 'rgba(16, 185, 129, 0.15)';
        elForceTag.style.color = '#34d399';
      } else if (forceScore <= -25) {
        elForceTag.textContent = '🔴 STRONG BEAR';
        elForceTag.style.background = 'rgba(239, 68, 68, 0.2)';
        elForceTag.style.color = '#f87171';
      } else if (forceScore <= -8) {
        elForceTag.textContent = '🔴 MILD BEAR';
        elForceTag.style.background = 'rgba(239, 68, 68, 0.15)';
        elForceTag.style.color = '#f87171';
      } else {
        elForceTag.textContent = '🟡 BALANCED';
        elForceTag.style.background = 'rgba(245, 158, 11, 0.15)';
        elForceTag.style.color = '#fbbf24';
      }
    }
    if (elForceTabBadge) {
      elForceTabBadge.textContent = `${forceScore >= 0 ? '+' : ''}${forceScore.toFixed(0)}`;
      elForceTabBadge.style.color = forceScore >= 8 ? '#34d399' : forceScore <= -8 ? '#f87171' : '#38bdf8';
    }
  }



  // ==========================================================================
  // 📋 CLEAN & PROFESSIONAL OPTION CHAIN TABLE
  // ==========================================================================
  function renderTable(data) {
    const table = document.getElementById('upstoxChainTable');
    const tbody = document.getElementById('upstoxChainTableBody');
    if (!table || !tbody) return;

    const rows = data.data || [];
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="11" style="text-align:center; padding:48px; color:var(--text-muted);">No option strikes available for selected expiry.</td></tr>`;
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

    // Find Key Institutional Walls across entire dataset
    let maxCeOi = 1, maxPeOi = 1;
    let maxCeOiStrike = 0, maxPeOiStrike = 0;

    rows.forEach(r => {
      const sp = Number(r.strike_price || 0);
      const ceOi = Number(r.call_options?.market_data?.oi || 0);
      const peOi = Number(r.put_options?.market_data?.oi || 0);

      if (ceOi > maxCeOi) { maxCeOi = ceOi; maxCeOiStrike = sp; }
      if (peOi > maxPeOi) { maxPeOi = peOi; maxPeOiStrike = sp; }
    });

    // Filter strikes by range
    let filteredRows = rows;
    if (state.strikeRange > 0) {
      const start = Math.max(0, atmIdx - state.strikeRange);
      const end = Math.min(rows.length, atmIdx + state.strikeRange + 1);
      filteredRows = rows.slice(start, end);
    }

    // Filter by search query if any
    const query = state.searchQuery.trim();
    if (query) {
      filteredRows = filteredRows.filter(r => String(r.strike_price).includes(query));
    }

    // Clean View toggles
    const isOiOnly = state.viewMode === 'oi';

    document.querySelectorAll('.upstox-greek-col').forEach(el => {
      el.style.display = isOiOnly ? 'none' : '';
    });

    const callColspan = isOiOnly ? 6 : 8;
    const thCalls = document.querySelector('.th-calls');
    const thPuts = document.querySelector('.th-puts');
    if (thCalls) thCalls.setAttribute('colspan', callColspan);
    if (thPuts) thPuts.setAttribute('colspan', callColspan);

    tbody.innerHTML = '';
    let spotLineInserted = false;

    // Running totals for footer
    let sumCeOi = 0, sumCeOiChg = 0;
    let sumPeOi = 0, sumPeOiChg = 0;

    const showOiBar = true;

    filteredRows.forEach((r) => {
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

      const ceOiChg = Number(ceMd.oi_change !== undefined ? ceMd.oi_change : (ceOi - Number(ceMd.prev_oi || ceOi)));
      const peOiChg = Number(peMd.oi_change !== undefined ? peMd.oi_change : (peOi - Number(peMd.prev_oi || peOi)));

      const ceVol = Number(ceMd.volume || 0);
      const peVol = Number(peMd.volume || 0);

      const ceLtp = Number(ceMd.ltp || 0);
      const peLtp = Number(peMd.ltp || 0);

      const ceChg = Number(ceMd.net_change || 0);
      const peChg = Number(peMd.net_change || 0);

      const ceBuildup = getBuildup(ceChg, ceOiChg);
      const peBuildup = getBuildup(peChg, peOiChg);

      sumCeOi += ceOi;
      sumCeOiChg += ceOiChg;
      sumPeOi += peOi;
      sumPeOiChg += peOiChg;

      const ceOiBarWidth = Math.min(100, Math.round((ceOi / maxCeOi) * 100));
      const peOiBarWidth = Math.min(100, Math.round((peOi / maxPeOi) * 100));

      const strikePcr = ceOi > 0 ? (peOi / ceOi) : 1.0;

      // Dynamic Spot Divider Line
      if (!spotLineInserted && strike >= spot) {
        spotLineInserted = true;
        const dayChg = Number(data.dayChange || 0);
        const dayChgPct = Number(data.dayChangePct || 0);
        const isPos = dayChg >= 0;
        const spotRow = document.createElement('tr');
        spotRow.className = 'upstox-spot-line-row';
        spotRow.innerHTML = `
          <td colspan="17">
            <div class="upstox-spot-line">
              <span class="spot-pill">
                <span class="pulse-dot"></span>
                <span>SPOT: ₹${fmtNum(spot, 2)} (${isPos ? '+' : ''}${fmtNum(dayChg, 2)} / ${isPos ? '+' : ''}${fmtNum(dayChgPct, 2)}%)</span>
                <span style="opacity:0.6;">•</span>
                <span>ATM: ${Number(data.atmStrike || spot).toLocaleString('en-IN')}</span>
                ${data.atmStraddle ? `<span style="opacity:0.6;">•</span><span>Straddle: ₹${fmtNum(data.atmStraddle, 2)}</span>` : ''}
              </span>
            </div>
          </td>
        `;
        tbody.appendChild(spotRow);
      }

      const isMaxCe = strike === maxCeOiStrike;
      const isMaxPe = strike === maxPeOiStrike;

      const tr = document.createElement('tr');
      tr.className = `upstox-chain-row ${isAtm ? 'is-atm' : ''} ${isCallItm ? 'call-itm' : 'call-otm'} ${isPutItm ? 'put-itm' : 'put-otm'} ${isMaxCe ? 'is-max-ce-oi' : ''} ${isMaxPe ? 'is-max-pe-oi' : ''}`;
      tr.dataset.strike = strike;
      tr.style.cursor = 'pointer';
      tr.title = `Click to view institutional order-flow on ${strike} Strike`;
      tr.addEventListener('click', () => openStrikeModal(r, spot, isAtm));

      tr.innerHTML = `
        <!-- CALL SIDE (8 Columns) -->
        <td class="td-ce col-oi-bar" style="position:relative;">
          ${showOiBar ? `<div class="oi-bar oi-bar-call" style="width:${ceOiBarWidth}%;"></div>` : ''}
          <span class="oi-text">${fmtQty(ceOi)}</span>
          ${isMaxCe ? '<span class="wall-badge wall-res" title="Major Resistance - Highest Call OI">🛑 RES</span>' : ''}
        </td>
        <td class="td-ce col-oi-chg ${ceOiChg >= 0 ? 'text-green' : 'text-red'}">
          ${ceOiChg >= 0 ? '+' : ''}${fmtQty(ceOiChg)}
        </td>
        <td class="td-ce col-buildup" style="text-align:center;">
          <span class="buildup-tag ${ceBuildup.cls}" title="${ceBuildup.title}">${ceBuildup.code}</span>
        </td>
        <td class="td-ce col-vol">${fmtQty(ceVol)}</td>
        <td class="td-ce col-iv upstox-greek-col" style="${isOiOnly ? 'display:none;' : ''}">${ceGr.iv ? fmtNum(ceGr.iv, 1) + '%' : '--'}</td>
        <td class="td-ce col-delta upstox-greek-col" style="${isOiOnly ? 'display:none;' : ''}">${ceGr.delta !== undefined ? fmtNum(ceGr.delta, 2) : '--'}</td>
        <td class="td-ce col-ltp ${ceLtp > (ceMd.close_price || 0) ? 'up-tick' : 'down-tick'}">
          <strong>${fmtNum(ceLtp, 2)}</strong>
        </td>
        <td class="td-ce col-chg ${ceChg >= 0 ? 'text-green' : 'text-red'}">
          ${ceChg >= 0 ? '+' : ''}${fmtNum(ceChg, 1)}
        </td>

        <!-- CENTER STRIKE (1 Column) -->
        <td class="col-strike ${isAtm ? 'atm-strike-badge' : ''}">
          <div class="strike-wrap">
            <span class="strike-num">${strike.toLocaleString('en-IN')}</span>
            ${isAtm ? '<span class="atm-tag">ATM</span>' : ''}
            <span class="strike-pcr-pill ${strikePcr >= 1.0 ? 'bull' : 'bear'}" title="Strike PCR (PE/CE): ${strikePcr.toFixed(2)}">${strikePcr.toFixed(1)}</span>
            <span class="strike-click-hint" title="View details">🔍</span>
          </div>
        </td>

        <!-- PUT SIDE (8 Columns) -->
        <td class="td-pe col-chg ${peChg >= 0 ? 'text-green' : 'text-red'}">
          ${peChg >= 0 ? '+' : ''}${fmtNum(peChg, 1)}
        </td>
        <td class="td-pe col-ltp ${peLtp > (peMd.close_price || 0) ? 'up-tick' : 'down-tick'}">
          <strong>${fmtNum(peLtp, 2)}</strong>
        </td>
        <td class="td-pe col-delta upstox-greek-col" style="${isOiOnly ? 'display:none;' : ''}">${peGr.delta !== undefined ? fmtNum(peGr.delta, 2) : '--'}</td>
        <td class="td-pe col-iv upstox-greek-col" style="${isOiOnly ? 'display:none;' : ''}">${peGr.iv ? fmtNum(peGr.iv, 1) + '%' : '--'}</td>
        <td class="td-pe col-vol">${fmtQty(peVol)}</td>
        <td class="td-pe col-buildup" style="text-align:center;">
          <span class="buildup-tag ${peBuildup.cls}" title="${peBuildup.title}">${peBuildup.code}</span>
        </td>
        <td class="td-pe col-oi-chg ${peOiChg >= 0 ? 'text-green' : 'text-red'}">
          ${peOiChg >= 0 ? '+' : ''}${fmtQty(peOiChg)}
        </td>
        <td class="td-pe col-oi-bar" style="position:relative;">
          ${showOiBar ? `<div class="oi-bar oi-bar-put" style="width:${peOiBarWidth}%;"></div>` : ''}
          <span class="oi-text">${fmtQty(peOi)}</span>
          ${isMaxPe ? '<span class="wall-badge wall-sup" title="Major Support - Highest Put OI">🛡️ SUP</span>' : ''}
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Update Totals Footer
    const tfoot = document.getElementById('upstoxChainTableFoot');
    if (tfoot) {
      tfoot.style.display = '';
      const elCeOi = document.getElementById('footCeOi');
      if (elCeOi) elCeOi.textContent = fmtQty(sumCeOi);
      const elCeOiChg = document.getElementById('footCeOiChg');
      if (elCeOiChg) {
        elCeOiChg.textContent = (sumCeOiChg >= 0 ? '+' : '') + fmtQty(sumCeOiChg);
        elCeOiChg.className = sumCeOiChg >= 0 ? 'text-green' : 'text-red';
      }

      const elPeOiChg = document.getElementById('footPeOiChg');
      if (elPeOiChg) {
        elPeOiChg.textContent = (sumPeOiChg >= 0 ? '+' : '') + fmtQty(sumPeOiChg);
        elPeOiChg.className = sumPeOiChg >= 0 ? 'text-green' : 'text-red';
      }
      const elPeOi = document.getElementById('footPeOi');
      if (elPeOi) elPeOi.textContent = fmtQty(sumPeOi);
    }
  }

  // Open Strike Intelligence Deep-Dive Modal
  function openStrikeModal(row, spot, isAtm) {
    const modal = document.getElementById('upstoxStrikeModal');
    if (!modal) return;

    const sp = Number(row.strike_price || 0);
    const ce = row.call_options || {};
    const pe = row.put_options || {};
    const ceMd = ce.market_data || {};
    const peMd = pe.market_data || {};
    const ceGr = ce.option_greeks || {};
    const peGr = pe.option_greeks || {};
    const qm = row.quant_metrics || {};

    const diff = sp - spot;
    const isCallItm = sp < spot;

    // Title & Badges
    const elTitle = document.getElementById('modalStrikeTitle');
    if (elTitle) elTitle.textContent = `${sp.toLocaleString('en-IN')} STRIKE RADAR`;

    const elMoneyness = document.getElementById('modalMoneynessTag');
    if (elMoneyness) {
      if (isAtm) {
        elMoneyness.className = 'modal-badge atm';
        elMoneyness.textContent = 'ATM (AT-THE-MONEY)';
      } else if (isCallItm) {
        elMoneyness.className = 'modal-badge itm-ce';
        elMoneyness.textContent = 'CALL ITM / PUT OTM';
      } else {
        elMoneyness.className = 'modal-badge itm-pe';
        elMoneyness.textContent = 'PUT ITM / CALL OTM';
      }
    }

    const elDist = document.getElementById('modalDistanceTag');
    if (elDist) {
      const sign = diff >= 0 ? '+' : '';
      elDist.textContent = `Spot Distance: ${sign}${fmtNum(diff, 1)} pts`;
    }

    const elUnderlying = document.getElementById('modalUnderlyingSubtitle');
    if (elUnderlying) {
      const undName = (state.chainData?.underlying || 'NIFTY').toUpperCase();
      const expDate = state.chainData?.expiry || state.expiryDate || '';
      elUnderlying.textContent = `${undName} • Expiry: ${expDate} • Spot: ₹${fmtNum(spot, 2)}`;
    }

    // 1. Prem & Straddle Breakevens
    const ceLtp = Number(ceMd.ltp || 0);
    const peLtp = Number(peMd.ltp || 0);
    const straddle = qm.straddle_prem || Number((ceLtp + peLtp).toFixed(2));
    const lowerBe = qm.lower_be || Number((sp - straddle).toFixed(1));
    const upperBe = qm.upper_be || Number((sp + straddle).toFixed(1));

    const elPrem = document.getElementById('modalStraddlePrem');
    if (elPrem) elPrem.textContent = `₹${fmtNum(straddle, 2)}`;

    const elPremSkew = document.getElementById('modalPremSkew');
    if (elPremSkew) {
      const pSkew = qm.prem_skew_pct !== undefined ? qm.prem_skew_pct : Number((((ceLtp - peLtp) / Math.max(0.1, ceLtp + peLtp)) * 100).toFixed(1));
      const isCallRich = pSkew >= 0;
      elPremSkew.textContent = `Prem Skew: ${isCallRich ? '+' : ''}${pSkew}% (${isCallRich ? 'Call Richer' : 'Put Richer'})`;
      elPremSkew.style.color = isCallRich ? '#34d399' : '#f87171';
    }

    const elLowerBe = document.getElementById('modalLowerBe');
    if (elLowerBe) elLowerBe.textContent = `₹${fmtNum(lowerBe, 1)}`;

    const elUpperBe = document.getElementById('modalUpperBe');
    if (elUpperBe) elUpperBe.textContent = `₹${fmtNum(upperBe, 1)}`;

    // Directional Force
    const fScore = qm.force_score !== undefined ? qm.force_score : 0;
    const elForceVal = document.getElementById('modalForceVal');
    const elForceSig = document.getElementById('modalForceSignal');
    if (elForceVal) {
      elForceVal.textContent = (fScore >= 0 ? '+' : '') + fScore;
      elForceVal.style.color = fScore > 20 ? '#34d399' : fScore < -20 ? '#f87171' : '#38bdf8';
    }
    if (elForceSig) {
      const bForce = qm.bullish_force !== undefined ? qm.bullish_force : 50;
      const beForce = qm.bearish_force !== undefined ? qm.bearish_force : 50;
      let label = 'NEUTRAL CONSOLIDATION';
      if (fScore >= 40) label = 'STRONG BULLISH FLOW';
      else if (fScore >= 15) label = 'MODERATE BULLISH';
      else if (fScore <= -40) label = 'STRONG BEARISH WALL';
      else if (fScore <= -15) label = 'MODERATE BEARISH';
      elForceSig.textContent = `${label} (Bull: ${bForce} | Bear: ${beForce})`;
    }

    // 2. OI & Day OI
    const ceOi = Number(ceMd.oi || 0);
    const peOi = Number(peMd.oi || 0);
    const ceDayOiPct = qm.ce_day_oi_pct !== undefined ? qm.ce_day_oi_pct : 0;
    const peDayOiPct = qm.pe_day_oi_pct !== undefined ? qm.pe_day_oi_pct : 0;

    const elCeOi = document.getElementById('modalCeOi');
    if (elCeOi) elCeOi.textContent = fmtQty(ceOi);
    const elCeDayOi = document.getElementById('modalCeDayOi');
    if (elCeDayOi) {
      elCeDayOi.textContent = (ceDayOiPct >= 0 ? '+' : '') + ceDayOiPct + '% Day';
      elCeDayOi.className = ceDayOiPct >= 0 ? 'm-pill green' : 'm-pill red';
    }

    const elPeOi = document.getElementById('modalPeOi');
    if (elPeOi) elPeOi.textContent = fmtQty(peOi);
    const elPeDayOi = document.getElementById('modalPeDayOi');
    if (elPeDayOi) {
      elPeDayOi.textContent = (peDayOiPct >= 0 ? '+' : '') + peDayOiPct + '% Day';
      elPeDayOi.className = peDayOiPct >= 0 ? 'm-pill green' : 'm-pill red';
    }

    // 3. OI Percentile
    const elCePctile = document.getElementById('modalCePctile');
    const elPePctile = document.getElementById('modalPePctile');
    if (elCePctile) elCePctile.textContent = `${qm.ce_oi_pctile || 0}%ile`;
    if (elPePctile) elPePctile.textContent = `${qm.pe_oi_pctile || 0}%ile`;

    const elPctileDesc = document.getElementById('modalPctileDesc');
    if (elPctileDesc) {
      const topWall = Math.max(qm.ce_oi_pctile || 0, qm.pe_oi_pctile || 0);
      if (topWall >= 90) elPctileDesc.textContent = '🔥 Heavy Institutional Concentration Wall (>90%ile)';
      else if (topWall >= 75) elPctileDesc.textContent = '⚡ Significant Liquidity Zone (75-90%ile)';
      else elPctileDesc.textContent = 'Normal liquidity strike (<75%ile)';
    }

    // 4. Writer Skew & Dominance
    const wSkew = qm.write_skew !== undefined ? qm.write_skew : 0;
    const elWriteSkew = document.getElementById('modalWriteSkew');
    const elWriterDom = document.getElementById('modalWriterDominance');
    if (elWriteSkew) {
      elWriteSkew.textContent = (wSkew >= 0 ? '+' : '') + wSkew + '%';
      elWriteSkew.style.color = wSkew > 15 ? '#34d399' : wSkew < -15 ? '#f87171' : '#fbbf24';
    }
    if (elWriterDom) {
      if (wSkew >= 25) elWriterDom.textContent = '🟢 Heavy Put Writing (Strong Floor / Bullish Support)';
      else if (wSkew <= -25) elWriterDom.textContent = '🔴 Heavy Call Writing (Strong Ceiling / Bearish Resistance)';
      else elWriterDom.textContent = '🟡 Balanced Writing Pressure';
    }

    // 5. Prem Flow
    const elCeFlow = document.getElementById('modalCeFlow');
    const elPeFlow = document.getElementById('modalPeFlow');
    const elNetFlow = document.getElementById('modalNetFlow');
    if (elCeFlow) elCeFlow.textContent = `₹${qm.ce_prem_flow_cr || 0} Cr`;
    if (elPeFlow) elPeFlow.textContent = `₹${qm.pe_prem_flow_cr || 0} Cr`;
    if (elNetFlow) {
      const nFlow = qm.net_prem_flow_cr || 0;
      elNetFlow.textContent = `${nFlow >= 0 ? '+' : ''}₹${nFlow} Cr`;
      elNetFlow.style.color = nFlow >= 0 ? '#34d399' : '#f87171';
    }

    // 6. Turnover & Volume
    const elCeVol = document.getElementById('modalCeVol');
    const elPeVol = document.getElementById('modalPeVol');
    const elTurnover = document.getElementById('modalTurnover');
    if (elCeVol) elCeVol.textContent = fmtQty(ceMd.volume);
    if (elPeVol) elPeVol.textContent = fmtQty(peMd.volume);
    if (elTurnover) elTurnover.textContent = `₹${qm.total_turnover_cr || 0} Cr`;

    // 7. Call:Put & IV Skew
    const elCp = document.getElementById('modalCpRatio');
    const elIvSkew = document.getElementById('modalIvSkew');
    const elMaxPainDist = document.getElementById('modalMaxPainDist');
    if (elCp) elCp.textContent = qm.call_put_ratio !== undefined ? `${qm.call_put_ratio}:1` : '--';
    if (elIvSkew) {
      const ivs = qm.iv_skew || 0;
      elIvSkew.textContent = `${ivs >= 0 ? '+' : ''}${ivs}%`;
      elIvSkew.style.color = ivs > 0 ? '#34d399' : '#f87171';
    }
    if (elMaxPainDist) {
      const mp = qm.max_pain_strike || (state.chainData?.maxPain || 0);
      const mpDiff = sp - mp;
      elMaxPainDist.textContent = `${mpDiff === 0 ? 'AT MAX PAIN' : (mpDiff > 0 ? `+${mpDiff} pts above` : `${mpDiff} pts below`)} (₹${fmtNum(mp, 0)})`;
    }

    // 8. Greeks Table
    const elCeD = document.getElementById('mCeDelta');
    const elPeD = document.getElementById('mPeDelta');
    if (elCeD) elCeD.textContent = ceGr.delta !== undefined ? fmtNum(ceGr.delta, 3) : '--';
    if (elPeD) elPeD.textContent = peGr.delta !== undefined ? fmtNum(peGr.delta, 3) : '--';

    const elCeT = document.getElementById('mCeTheta');
    const elPeT = document.getElementById('mPeTheta');
    if (elCeT) elCeT.textContent = ceGr.theta !== undefined ? `₹${fmtNum(ceGr.theta, 2)}/day` : '--';
    if (elPeT) elPeT.textContent = peGr.theta !== undefined ? `₹${fmtNum(peGr.theta, 2)}/day` : '--';

    const elCeV = document.getElementById('mCeVega');
    const elPeV = document.getElementById('mPeVega');
    if (elCeV) elCeV.textContent = ceGr.vega !== undefined ? `₹${fmtNum(ceGr.vega, 2)}` : '--';
    if (elPeV) elPeV.textContent = peGr.vega !== undefined ? `₹${fmtNum(peGr.vega, 2)}` : '--';

    const elCeG = document.getElementById('mCeGamma');
    const elPeG = document.getElementById('mPeGamma');
    if (elCeG) elCeG.textContent = ceGr.gamma !== undefined ? fmtNum(ceGr.gamma, 4) : '--';
    if (elPeG) elPeG.textContent = peGr.gamma !== undefined ? fmtNum(peGr.gamma, 4) : '--';

    const elCeIv = document.getElementById('mCeIv');
    const elPeIv = document.getElementById('mPeIv');
    if (elCeIv) elCeIv.textContent = ceGr.iv ? `${fmtNum(ceGr.iv, 2)}%` : '--';
    if (elPeIv) elPeIv.textContent = peGr.iv ? `${fmtNum(peGr.iv, 2)}%` : '--';

    // Hook up modal action buttons
    const btnDesk = document.getElementById('btnModalStraddleDesk');
    if (btnDesk) {
      btnDesk.onclick = () => {
        closeModal();
        if (typeof window.instNav === 'function') {
          window.instNav('straddles');
        } else if (typeof window.switchTab === 'function') {
          window.switchTab('straddle');
        }
      };
    }

    const btnCopy = document.getElementById('btnModalCopyStrike');
    if (btnCopy) {
      btnCopy.onclick = () => {
        const text = `Strike: ${sp} | Spot: ${spot} | CE LTP: ₹${ceLtp} | PE LTP: ₹${peLtp} | Straddle: ₹${straddle} | Range: [${lowerBe} - ${upperBe}] | PCR: ${qm.call_put_ratio || '--'}`;
        navigator.clipboard?.writeText(text).then(() => {
          btnCopy.textContent = '✅ Copied!';
          setTimeout(() => { btnCopy.textContent = '📋 Copy Strike Data'; }, 2000);
        });
      };
    }

    modal.style.display = 'flex';
  }

  function closeModal() {
    const modal = document.getElementById('upstoxStrikeModal');
    if (modal) modal.style.display = 'none';
  }

  function centerToAtm() {
    const atmRow = document.querySelector('.upstox-chain-row.is-atm') || document.querySelector('.upstox-spot-line-row');
    const container = document.getElementById('upstoxTableScrollContainer');
    if (atmRow && container) {
      const rowTop = atmRow.offsetTop;
      const containerHeight = container.clientHeight;
      container.scrollTo({
        top: Math.max(0, rowTop - containerHeight / 2 + 30),
        behavior: 'smooth'
      });
    }
  }

  // ==========================================================================
  // ⚡ SUB-TAB SWITCHING & ACTIVE PANE DISPATCHER
  // ==========================================================================
  function switchUpstoxTab(tabName) {
    state.activeTab = tabName;
    const btns = document.querySelectorAll('#upstoxSubnavBar .go-subtab-btn');
    btns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-upstox-tab') === tabName);
    });

    const panes = {
      chain: document.getElementById('upstoxPaneChain'),
      force: document.getElementById('upstoxPaneForce'),
      maxpain: document.getElementById('upstoxPaneMaxPain'),
      oidist: document.getElementById('upstoxPaneOiDist'),
      greeks: document.getElementById('upstoxPaneGreeks'),
    };

    Object.keys(panes).forEach(k => {
      if (panes[k]) {
        if (k === tabName) {
          panes[k].style.display = 'block';
          panes[k].classList.add('active');
        } else {
          panes[k].style.display = 'none';
          panes[k].classList.remove('active');
        }
      }
    });

    if (state.chainData) {
      renderActivePane(state.chainData);
    }
  }

  function renderActivePane(data) {
    if (!data) return;
    if (state.activeTab === 'force') {
      renderForcePane(data);
    } else if (state.activeTab === 'maxpain') {
      renderMaxPainPane(data);
    } else if (state.activeTab === 'oidist') {
      renderOiDistPane(data);
    } else if (state.activeTab === 'greeks') {
      renderGreeksPane(data);
    }
  }

  // ==========================================================================
  // ⚡ 14-METRIC OPTION VISUALIZER TOOL (IMAGE 15 STYLE)
  // ==========================================================================
  const VIS_METRICS_CONFIG = {
    turnover: {
      title: 'Turnover (₹ Cr)',
      sub: 'Strike-wise institutional derivative turnover • Click any bar for deep radar',
      callLabel: 'Call Turnover',
      putLabel: 'Put Turnover',
      format: 'cr',
      getVals: (r) => {
        const m = r.quant_metrics || {};
        return {
          call: Number(m.ce_turnover_cr || 0),
          put: Number(m.pe_turnover_cr || 0)
        };
      }
    },
    oi: {
      title: 'Open Interest (Contracts)',
      sub: 'Open Interest depth distribution across strikes',
      callLabel: 'Call OI',
      putLabel: 'Put OI',
      format: 'qty',
      getVals: (r) => ({
        call: Number(r.call_options?.market_data?.oi || 0),
        put: Number(r.put_options?.market_data?.oi || 0)
      })
    },
    oichg: {
      title: 'Change in Open Interest (Contracts)',
      sub: 'Net intraday position buildup (fresh writes vs unwinding)',
      callLabel: 'Call OI Chg',
      putLabel: 'Put OI Chg',
      format: 'qty',
      getVals: (r) => ({
        call: Number(r.call_options?.market_data?.oi_change || 0),
        put: Number(r.put_options?.market_data?.oi_change || 0)
      })
    },
    prem: {
      title: 'Option Premium / LTP (₹)',
      sub: 'Call vs Put market price per strike',
      callLabel: 'Call LTP',
      putLabel: 'Put LTP',
      format: 'price',
      getVals: (r) => ({
        call: Number(r.call_options?.market_data?.ltp || 0),
        put: Number(r.put_options?.market_data?.ltp || 0)
      })
    },
    premskew: {
      title: 'Premium Skew (Call LTP vs Put LTP)',
      sub: 'Pricing imbalance between Call and Put options',
      callLabel: 'Call LTP',
      putLabel: 'Put LTP',
      format: 'price',
      getVals: (r) => ({
        call: Number(r.call_options?.market_data?.ltp || 0),
        put: Number(r.put_options?.market_data?.ltp || 0)
      })
    },
    maxpain: {
      title: 'Max Pain Strike Valuation (₹ Cr Loss)',
      sub: 'Cumulative option writer theoretical loss by strike',
      callLabel: 'Call Loss',
      putLabel: 'Put Loss',
      format: 'cr',
      getVals: (r, allRows) => {
        const sp = Number(r.strike_price || 0);
        let callLoss = 0, putLoss = 0;
        allRows.forEach(row => {
          const s = Number(row.strike_price || 0);
          const cOi = Number(row.call_options?.market_data?.oi || 0);
          const pOi = Number(row.put_options?.market_data?.oi || 0);
          if (sp > s) callLoss += (sp - s) * cOi * 65 / 10000000;
          if (sp < s) putLoss += (s - sp) * pOi * 65 / 10000000;
        });
        return { call: callLoss, put: putLoss };
      }
    },
    oipctile: {
      title: 'Open Interest Percentile Rank (%)',
      sub: 'Chain-wide liquidity concentration wall percentile',
      callLabel: 'Call %ile',
      putLabel: 'Put %ile',
      format: 'pct',
      getVals: (r) => {
        const m = r.quant_metrics || {};
        return {
          call: Number(m.ce_oi_pctile || 0),
          put: Number(m.pe_oi_pctile || 0)
        };
      }
    },
    writeskew: {
      title: 'Writer Dominance Skew (%)',
      sub: 'Institutional writer skew: Positive = Put writing (Support), Negative = Call writing (Resistance)',
      callLabel: 'Call Writing Bias',
      putLabel: 'Put Writing Bias',
      format: 'pct',
      getVals: (r) => {
        const ws = Number(r.quant_metrics?.write_skew || 0);
        return {
          call: ws < 0 ? Math.abs(ws) : 0,
          put: ws > 0 ? ws : 0
        };
      }
    },
    premflow: {
      title: 'Premium Flow (₹ Cr)',
      sub: 'Total premium traded (Volume × Price) across strikes',
      callLabel: 'Call Prem Flow',
      putLabel: 'Put Prem Flow',
      format: 'cr',
      getVals: (r) => {
        const m = r.quant_metrics || {};
        return {
          call: Number(m.ce_prem_flow_cr || 0),
          put: Number(m.pe_prem_flow_cr || 0)
        };
      }
    },
    volume: {
      title: 'Volume (Contracts)',
      sub: 'Intraday contract trading activity by strike',
      callLabel: 'Call Volume',
      putLabel: 'Put Volume',
      format: 'qty',
      getVals: (r) => ({
        call: Number(r.call_options?.market_data?.volume || 0),
        put: Number(r.put_options?.market_data?.volume || 0)
      })
    },
    callput: {
      title: 'Call to Put Ratio (%)',
      sub: 'Relative volume share of Call vs Put per strike',
      callLabel: 'Call % Share',
      putLabel: 'Put % Share',
      format: 'pct',
      getVals: (r) => {
        const cVol = Number(r.call_options?.market_data?.volume || 0);
        const pVol = Number(r.put_options?.market_data?.volume || 0);
        const tot = Math.max(1, cVol + pVol);
        return {
          call: (cVol / tot) * 100,
          put: (pVol / tot) * 100
        };
      }
    },
    force: {
      title: 'Institutional Directional Force Score',
      sub: 'Aggressive buying/selling pressure (Bull Force vs Bear Force)',
      callLabel: 'Bullish Force',
      putLabel: 'Bearish Force',
      format: 'pct',
      getVals: (r) => {
        const m = r.quant_metrics || {};
        return {
          call: Number(m.bullish_force !== undefined ? m.bullish_force : 50),
          put: Number(m.bearish_force !== undefined ? m.bearish_force : 50)
        };
      }
    },
    ivskew: {
      title: 'Implied Volatility (IV %)',
      sub: 'Implied Volatility surface comparison Call vs Put',
      callLabel: 'Call IV',
      putLabel: 'Put IV',
      format: 'pct',
      getVals: (r) => ({
        call: Number(r.call_options?.option_greeks?.iv || 0),
        put: Number(r.put_options?.option_greeks?.iv || 0)
      })
    },
    dayoi: {
      title: 'Day Open Interest % Change',
      sub: 'Net percentage growth or contraction in open positions today',
      callLabel: 'Call Day OI %',
      putLabel: 'Put Day OI %',
      format: 'pct',
      getVals: (r) => {
        const m = r.quant_metrics || {};
        return {
          call: Math.abs(Number(m.ce_day_oi_pct || 0)),
          put: Math.abs(Number(m.pe_day_oi_pct || 0))
        };
      }
    }
  };

  function formatValByMetric(val, fmt) {
    if (val === null || val === undefined || isNaN(val)) return '--';
    if (fmt === 'cr') return `${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr`;
    if (fmt === 'qty') return fmtQty(val);
    if (fmt === 'price') return `₹${Number(val).toFixed(2)}`;
    if (fmt === 'pct') return `${Number(val).toFixed(1)}%`;
    return Number(val).toLocaleString('en-IN');
  }

  function renderVisualizerChart(data) {
    const canvas = document.getElementById('optVisCanvas');
    if (!canvas || !data || !data.data || data.data.length === 0) return;

    // Visibility Guard: Don't render canvas when panel is hidden or unattached
    const panel = document.getElementById('panelUpstoxChain');
    if (!panel || panel.style.display === 'none' || panel.offsetParent === null) return;

    const wrap = document.getElementById('optVisCanvasWrap');
    if (!wrap || wrap.offsetParent === null) return;

    const rect = wrap.getBoundingClientRect();
    const w = Math.floor(rect.width);
    if (w < 100) return; // Guard against 0 or negative width during DOM reflows

    const metricKey = state.visualizerMetric || 'turnover';
    const cfg = VIS_METRICS_CONFIG[metricKey] || VIS_METRICS_CONFIG.turnover;

    // Update title & sub
    const elTitle = document.getElementById('optVisChartTitle');
    if (elTitle) elTitle.textContent = cfg.title;
    const elSub = document.getElementById('optVisChartSub');
    if (elSub) elSub.textContent = cfg.sub;

    const spot = Number(data.spotPrice || 0);
    const atmStrike = Number(data.atmStrike || spot);
    const elAtm = document.getElementById('optVisAtmBadge');
    if (elAtm) elAtm.textContent = `ATM: ${atmStrike.toLocaleString('en-IN')}`;

    // Filter strikes matching strikeRange
    let allRows = [...data.data].sort((a, b) => Number(a.strike_price) - Number(b.strike_price));
    let rows = allRows;
    if (state.strikeRange > 0) {
      let atmIdx = 0;
      let minD = Infinity;
      allRows.forEach((r, i) => {
        const d = Math.abs(Number(r.strike_price) - spot);
        if (d < minD) { minD = d; atmIdx = i; }
      });
      const start = Math.max(0, atmIdx - state.strikeRange);
      const end = Math.min(allRows.length, atmIdx + state.strikeRange + 1);
      rows = allRows.slice(start, end);
    }

    // Compute metric values & totals
    let sumCall = 0, sumPut = 0, maxVal = 0;
    const chartItems = rows.map(r => {
      const sp = Number(r.strike_price || 0);
      const vals = cfg.getVals(r, allRows, spot);
      const call = Math.max(0, Number(vals.call || 0));
      const put = Math.max(0, Number(vals.put || 0));
      sumCall += call;
      sumPut += put;
      if (call > maxVal) maxVal = call;
      if (put > maxVal) maxVal = put;
      return { strike: sp, call, put, row: r, isAtm: Math.abs(sp - atmStrike) < 1 };
    });

    if (maxVal === 0) maxVal = 100;

    // Update legend totals
    const elPutLeg = document.getElementById('optVisPutLegend');
    const elCallLeg = document.getElementById('optVisCallLegend');
    if (elPutLeg) elPutLeg.textContent = `${cfg.putLabel} (${formatValByMetric(sumPut, cfg.format)})`;
    if (elCallLeg) elCallLeg.textContent = `${cfg.callLabel} (${formatValByMetric(sumCall, cfg.format)})`;

    // HiDPI Canvas Rendering - Dirty-check to avoid infinite ResizeObserver loops
    const dpr = window.devicePixelRatio || 1;
    const h = 320;
    const targetW = Math.round(w * dpr);
    const targetH = Math.round(h * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.resetTransform?.();
    ctx.scale(dpr, dpr);

    // Margins
    const padL = 60, padR = 20, padT = 20, padB = 40;
    const plotW = Math.max(20, w - padL - padR);
    const plotH = Math.max(20, h - padT - padB);

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Grid lines & Y-axis labels
    const isLight = document.documentElement.getAttribute('data-theme') !== 'dark' && document.body.getAttribute('data-theme') !== 'dark';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.05)';
    const textColor = isLight ? '#475569' : '#94a3b8';
    const yTicks = 4;

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = '10px "JetBrains Mono", monospace';

    for (let i = 0; i <= yTicks; i++) {
      const yFrac = i / yTicks;
      const yVal = maxVal * (1 - yFrac);
      const yPos = padT + yFrac * plotH;

      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padL, yPos);
      ctx.lineTo(padL + plotW, yPos);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = textColor;
      let tickText = yVal >= 1000 ? (yVal >= 1000000 ? (yVal / 1000000).toFixed(1) + 'M' : (yVal / 1000).toFixed(1) + 'k') : yVal.toFixed(yVal < 10 ? 1 : 0);
      if (cfg.format === 'cr') tickText = yVal.toFixed(0);
      ctx.fillText(tickText, padL - 8, yPos);
    }

    // Baseline
    ctx.strokeStyle = isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    // Bars
    const n = chartItems.length;
    if (n === 0) return;
    const colW = plotW / n;
    const barGap = 1.5;
    const subBarW = Math.max(3, (colW - 8) / 2 - barGap);

    state.visChartBounds = [];

    chartItems.forEach((item, idx) => {
      const colX = padL + idx * colW;
      const colCenterX = colX + colW / 2;

      // Store bounds for mouse hit testing
      state.visChartBounds.push({
        x1: colX,
        x2: colX + colW,
        centerX: colCenterX,
        item: item
      });

      // Hover Column Highlight
      if (state.visHoverIndex === idx) {
        ctx.fillStyle = isLight ? 'rgba(37, 99, 235, 0.06)' : 'rgba(56, 189, 248, 0.08)';
        ctx.fillRect(colX + 1, padT, colW - 2, plotH);
      }

      // ATM Marker
      if (item.isAtm) {
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(colCenterX, padT);
        ctx.lineTo(colCenterX, padT + plotH);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Put Bar (Cyan - Left)
      const putH = Math.max(1, (item.put / maxVal) * plotH);
      const putX = colCenterX - barGap / 2 - subBarW;
      const putY = padT + plotH - putH;

      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(putX, putY, subBarW, putH);
      // Top cap highlight
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(putX, putY, subBarW, Math.min(2.5, putH));

      // Call Bar (Amber/Yellow - Right)
      const callH = Math.max(1, (item.call / maxVal) * plotH);
      const callX = colCenterX + barGap / 2;
      const callY = padT + plotH - callH;

      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(callX, callY, subBarW, callH);
      // Top cap highlight
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(callX, callY, subBarW, Math.min(2.5, callH));

      // Crosshair for Hovered Bar
      if (state.visHoverIndex === idx) {
        ctx.save();
        ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.40)' : 'rgba(255, 255, 255, 0.55)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);

        // Vertical crosshair
        ctx.beginPath();
        ctx.moveTo(colCenterX, padT);
        ctx.lineTo(colCenterX, padT + plotH);
        ctx.stroke();

        // Horizontal crosshair at peak bar height
        const barTopY = Math.min(putY, callY);
        ctx.beginPath();
        ctx.moveTo(padL, barTopY);
        ctx.lineTo(padL + plotW, barTopY);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.restore();
      }

      // X-Axis Strike Label
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.font = item.isAtm ? 'bold 10.5px "JetBrains Mono", monospace' : '9.5px "JetBrains Mono", monospace';
      ctx.fillStyle = item.isAtm ? '#fbbf24' : (state.visHoverIndex === idx ? '#38bdf8' : textColor);

      // Show alternate labels if too crowded
      const skipLabels = n > 25 ? 3 : n > 15 ? 2 : 1;
      if (idx % skipLabels === 0 || item.isAtm || state.visHoverIndex === idx) {
        ctx.fillText(item.strike, colCenterX, padT + plotH + 8);
      }
    });
  }

  function initVisualizerEvents() {
    const wrap = document.getElementById('optVisCanvasWrap');
    const canvas = document.getElementById('optVisCanvas');
    const tooltip = document.getElementById('optVisTooltip');
    if (!wrap || !canvas || !tooltip) return;

    // Toggle Collapse / Expand Visualizer
    const toggleBtn = document.getElementById('upstoxVisToggleBtn');
    const visPanel = document.getElementById('upstoxVisPanel');
    const toggleIcon = document.getElementById('upstoxVisToggleIcon');
    const toggleText = document.getElementById('upstoxVisToggleText');
    if (toggleBtn && visPanel) {
      toggleBtn.addEventListener('click', () => {
        const isHidden = visPanel.style.display === 'none';
        if (isHidden) {
          visPanel.style.display = 'flex';
          if (toggleIcon) toggleIcon.textContent = '▲';
          if (toggleText) toggleText.textContent = 'Collapse Visualizer';
          if (state.chainData) {
            requestAnimationFrame(() => renderVisualizerChart(state.chainData));
          }
        } else {
          visPanel.style.display = 'none';
          if (toggleIcon) toggleIcon.textContent = '▼';
          if (toggleText) toggleText.textContent = 'Expand Visualizer';
        }
      });
    }

    // Pills Click Listeners
    const pills = document.querySelectorAll('.opt-vis-pill');
    pills.forEach(p => {
      p.addEventListener('click', (e) => {
        pills.forEach(x => x.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state.visualizerMetric = e.currentTarget.getAttribute('data-metric');
        if (state.chainData) renderVisualizerChart(state.chainData);
      });
    });

    // Mouse Move on Canvas - Throttled with requestAnimationFrame
    let mouseAnimFrame = null;
    canvas.addEventListener('mousemove', (e) => {
      if (!state.visChartBounds || state.visChartBounds.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let foundIdx = -1;
      for (let i = 0; i < state.visChartBounds.length; i++) {
        const b = state.visChartBounds[i];
        if (mouseX >= b.x1 && mouseX <= b.x2) {
          foundIdx = i;
          break;
        }
      }

      if (foundIdx !== state.visHoverIndex) {
        state.visHoverIndex = foundIdx;
        if (mouseAnimFrame) cancelAnimationFrame(mouseAnimFrame);
        mouseAnimFrame = requestAnimationFrame(() => {
          if (state.chainData) renderVisualizerChart(state.chainData);
        });
      }

      if (foundIdx >= 0) {
        const bound = state.visChartBounds[foundIdx];
        const item = bound.item;
        const cfg = VIS_METRICS_CONFIG[state.visualizerMetric || 'turnover'] || VIS_METRICS_CONFIG.turnover;

        tooltip.innerHTML = `
          <div style="font-weight:800; color:#38bdf8; font-size:12px; margin-bottom:4px;">
            STRIKE ${item.strike.toLocaleString('en-IN')} ${item.isAtm ? '<span style="color:#fbbf24; font-size:10px;">[ATM]</span>' : ''}
          </div>
          <div style="display:flex; justify-content:space-between; gap:16px; color:#22d3ee;">
            <span>${cfg.putLabel}:</span> <strong>${formatValByMetric(item.put, cfg.format)}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; gap:16px; color:#fbbf24;">
            <span>${cfg.callLabel}:</span> <strong>${formatValByMetric(item.call, cfg.format)}</strong>
          </div>
          <div style="margin-top:5px; padding-top:4px; border-top:1px solid rgba(255,255,255,0.1); font-size:9.5px; color:#94a3b8;">
            Click bar for Strike Intelligence Radar ↗
          </div>
        `;
        tooltip.style.left = `${bound.centerX}px`;
        tooltip.style.top = `${Math.max(40, mouseY)}px`;
        tooltip.style.display = 'block';
      } else {
        tooltip.style.display = 'none';
      }
    });

    canvas.addEventListener('mouseleave', () => {
      state.visHoverIndex = -1;
      tooltip.style.display = 'none';
      if (mouseAnimFrame) cancelAnimationFrame(mouseAnimFrame);
      mouseAnimFrame = requestAnimationFrame(() => {
        if (state.chainData) renderVisualizerChart(state.chainData);
      });
    });

    // Click on Canvas Bar -> Open Strike Radar Modal!
    canvas.addEventListener('click', (e) => {
      if (!state.visChartBounds || state.visChartBounds.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;

      for (let i = 0; i < state.visChartBounds.length; i++) {
        const b = state.visChartBounds[i];
        if (mouseX >= b.x1 && mouseX <= b.x2) {
          const item = b.item;
          const spot = Number(state.chainData?.spotPrice || 0);
          openStrikeModal(item.row, spot, item.isAtm);
          break;
        }
      }
    });

    // Debounced and safe ResizeObserver
    let resizeTimer = null;
    let lastWrapW = 0;
    if (window.ResizeObserver) {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const crW = Math.round(entry.contentRect.width);
          if (crW > 0 && Math.abs(crW - lastWrapW) >= 4) {
            lastWrapW = crW;
            if (resizeTimer) cancelAnimationFrame(resizeTimer);
            resizeTimer = requestAnimationFrame(() => {
              const panel = document.getElementById('panelUpstoxChain');
              if (panel && panel.style.display !== 'none' && panel.offsetParent !== null) {
                if (state.chainData) renderVisualizerChart(state.chainData);
              }
            });
          }
        }
      });
      ro.observe(wrap);
    }
  }

  function setupHiDpiCanvas(canvas) {
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width || canvas.clientWidth || 600;
    const h = rect.height || canvas.clientHeight || 280;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.resetTransform?.();
    ctx.scale(dpr, dpr);
    return { ctx, width: w, height: h };
  }

  // ==========================================================================
  // ⚡ 1. DIRECTIONAL FORCE & ORDER FLOW PANE
  // ==========================================================================
  function renderForcePane(data) {
    if (!data) return;
    const spot = Number(data.spotPrice || 0);
    const rows = data.data || [];
    let atmRow = null;
    let minAtmDiff = Infinity;
    rows.forEach(r => {
      const diff = Math.abs(Number(r.strike_price || 0) - spot);
      if (diff < minAtmDiff) {
        minAtmDiff = diff;
        atmRow = r;
      }
    });

    const qm = atmRow ? (atmRow.quant_metrics || {}) : {};
    const score = Number(qm.force_score !== undefined ? qm.force_score : 0);
    const bullForce = Number(qm.bullish_force !== undefined ? qm.bullish_force : 50);
    const bearForce = Number(qm.bearish_force !== undefined ? qm.bearish_force : 50);

    const elScore = document.getElementById('forcePaneScore');
    const elSignal = document.getElementById('forcePaneSignal');
    if (elScore) {
      elScore.textContent = `${score >= 0 ? '+' : ''}${score.toFixed(1)}`;
      elScore.style.color = score >= 12 ? '#10b981' : score <= -12 ? '#ef4444' : '#fbbf24';
    }
    if (elSignal) {
      if (score >= 25) {
        elSignal.textContent = '🟢 STRONG BULLISH AGGRESSION';
        elSignal.style.background = 'rgba(16, 185, 129, 0.2)';
        elSignal.style.color = '#34d399';
      } else if (score >= 8) {
        elSignal.textContent = '🟢 MILD BULLISH FLOW';
        elSignal.style.background = 'rgba(16, 185, 129, 0.15)';
        elSignal.style.color = '#34d399';
      } else if (score <= -25) {
        elSignal.textContent = '🔴 STRONG BEARISH PRESSURE';
        elSignal.style.background = 'rgba(239, 68, 68, 0.2)';
        elSignal.style.color = '#f87171';
      } else if (score <= -8) {
        elSignal.textContent = '🔴 MILD BEARISH PRESSURE';
        elSignal.style.background = 'rgba(239, 68, 68, 0.15)';
        elSignal.style.color = '#f87171';
      } else {
        elSignal.textContent = '🟡 BALANCED ORDER FLOW';
        elSignal.style.background = 'rgba(245, 158, 11, 0.15)';
        elSignal.style.color = '#fbbf24';
      }
    }

    const elBullVal = document.getElementById('forceBullVal');
    const elBearVal = document.getElementById('forceBearVal');
    const elBullBar = document.getElementById('forceBullBar');
    const elBearBar = document.getElementById('forceBearBar');
    if (elBullVal) elBullVal.textContent = `${bullForce.toFixed(1)}%`;
    if (elBearVal) elBearVal.textContent = `${bearForce.toFixed(1)}%`;
    const totForce = Math.max(1, bullForce + bearForce);
    const bullPct = Math.round((bullForce / totForce) * 100);
    if (elBullBar) elBullBar.style.width = `${bullPct}%`;
    if (elBearBar) elBearBar.style.width = `${100 - bullPct}%`;

    // Aggregate capital & turnover across active strikes
    let sumCeFlow = 0, sumPeFlow = 0, sumNetFlow = 0;
    let sumCeTo = 0, sumPeTo = 0;
    rows.forEach(r => {
      const m = r.quant_metrics || {};
      sumCeFlow += Number(m.ce_prem_flow_cr || 0);
      sumPeFlow += Number(m.pe_prem_flow_cr || 0);
      sumNetFlow += Number(m.net_prem_flow_cr || 0);
      sumCeTo += Number(m.ce_turnover_cr || 0);
      sumPeTo += Number(m.pe_turnover_cr || 0);
    });

    const elNetFlow = document.getElementById('forceNetFlowCr');
    const elNetTag = document.getElementById('forceNetFlowTag');
    if (elNetFlow) {
      const isPos = sumNetFlow >= 0;
      elNetFlow.textContent = `${isPos ? '+' : ''}${fmtNum(sumNetFlow, 2)} Cr`;
      elNetFlow.style.color = isPos ? '#34d399' : '#f87171';
    }
    if (elNetTag) {
      elNetTag.textContent = sumNetFlow >= 0 ? '🟢 NET INFLOW (BULLISH)' : '🔴 NET OUTFLOW (BEARISH)';
      elNetTag.style.background = sumNetFlow >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
      elNetTag.style.color = sumNetFlow >= 0 ? '#34d399' : '#f87171';
    }

    const elCeFlow = document.getElementById('forceCeFlowCr');
    const elPeFlow = document.getElementById('forcePeFlowCr');
    const elCeTo = document.getElementById('forceCeToCr');
    const elPeTo = document.getElementById('forcePeToCr');
    if (elCeFlow) elCeFlow.textContent = `₹${fmtNum(sumCeFlow, 2)} Cr`;
    if (elPeFlow) elPeFlow.textContent = `₹${fmtNum(sumPeFlow, 2)} Cr`;
    if (elCeTo) elCeTo.textContent = `₹${fmtNum(sumCeTo, 2)} Cr`;
    if (elPeTo) elPeTo.textContent = `₹${fmtNum(sumPeTo, 2)} Cr`;

    // Writer Skew
    const writeSkew = Number(qm.write_skew !== undefined ? qm.write_skew : 0);
    const elWriterSkew = document.getElementById('forceWriterSkew');
    const elWriterTag = document.getElementById('forceWriterTag');
    if (elWriterSkew) {
      elWriterSkew.textContent = `${writeSkew >= 0 ? '+' : ''}${writeSkew.toFixed(1)}`;
      elWriterSkew.style.color = writeSkew >= 10 ? '#10b981' : writeSkew <= -10 ? '#ef4444' : '#fbbf24';
    }
    if (elWriterTag) {
      elWriterTag.textContent = writeSkew >= 15 ? 'PUT WRITING BIAS (SUPPORT)' : writeSkew <= -15 ? 'CALL WRITING BIAS (RESISTANCE)' : 'BALANCED SKEW';
      elWriterTag.style.color = writeSkew >= 15 ? '#34d399' : writeSkew <= -15 ? '#f87171' : '#fbbf24';
    }

    const elCp = document.getElementById('forceCpRatio');
    const elPc = document.getElementById('forcePcRatio');
    const elBias = document.getElementById('forceSmartBias');
    if (elCp) elCp.textContent = qm.call_put_ratio ? Number(qm.call_put_ratio).toFixed(2) : '--';
    if (elPc) elPc.textContent = data.pcr ? Number(data.pcr).toFixed(2) : '--';
    if (elBias) {
      const pcrVal = Number(data.pcr || 1.0);
      elBias.textContent = pcrVal >= 1.15 ? 'Institutional Long Accumulation' : pcrVal <= 0.85 ? 'Institutional Short Pressure' : 'Neutral Rangebound';
      elBias.style.color = pcrVal >= 1.15 ? '#34d399' : pcrVal <= 0.85 ? '#f87171' : '#fbbf24';
    }

    // Strike Leaderboard Table (Top 10 by total turnover)
    const tbody = document.getElementById('upstoxForceTableBody');
    if (tbody) {
      const sorted = [...rows].sort((a, b) => {
        const toA = Number(a.quant_metrics?.total_turnover_cr || 0);
        const toB = Number(b.quant_metrics?.total_turnover_cr || 0);
        return toB - toA;
      }).slice(0, 10);

      let html = '';
      sorted.forEach(r => {
        const sp = Number(r.strike_price || 0);
        const ce = r.call_options?.market_data || {};
        const pe = r.put_options?.market_data || {};
        const m = r.quant_metrics || {};
        const fScore = Number(m.force_score || 0);
        const isAtm = Math.abs(sp - spot) < 25;
        const moneyness = isAtm ? '<span style="color:#fbbf24; font-weight:800;">ATM</span>' : sp > spot ? '<span style="color:#ef4444;">OTM CE / ITM PE</span>' : '<span style="color:#10b981;">ITM CE / OTM PE</span>';

        html += `
          <tr style="border-bottom:1px solid #162035; height:34px;">
            <td style="font-weight:800; color:#38bdf8; font-family:'JetBrains Mono',monospace;">₹${fmtNum(sp, 0)}</td>
            <td style="text-align:center; font-size:10.5px;">${moneyness}</td>
            <td style="text-align:right; font-family:'JetBrains Mono',monospace; color:#cbd5e1;">₹${fmtNum(ce.ltp, 2)}</td>
            <td style="text-align:right; font-family:'JetBrains Mono',monospace; color:#cbd5e1;">₹${fmtNum(pe.ltp, 2)}</td>
            <td style="text-align:center; font-weight:800; font-family:'JetBrains Mono',monospace; color:${fScore >= 10 ? '#34d399' : fScore <= -10 ? '#f87171' : '#fbbf24'};">${fScore >= 0 ? '+' : ''}${fScore.toFixed(1)}</td>
            <td style="text-align:center;">
              <span class="ribbon-badge" style="font-size:9.5px; background:${fScore >= 15 ? 'rgba(16,185,129,0.15)' : fScore <= -15 ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'}; color:${fScore >= 15 ? '#34d399' : fScore <= -15 ? '#f87171' : '#fbbf24'};">
                ${fScore >= 15 ? 'BULL FORCE' : fScore <= -15 ? 'BEAR FORCE' : 'BALANCED'}
              </span>
            </td>
            <td style="text-align:right; font-family:'JetBrains Mono',monospace; color:${Number(m.net_prem_flow_cr || 0) >= 0 ? '#34d399' : '#f87171'}; font-weight:700;">
              ${Number(m.net_prem_flow_cr || 0) >= 0 ? '+' : ''}${fmtNum(m.net_prem_flow_cr, 2)} Cr
            </td>
            <td style="text-align:right; font-family:'JetBrains Mono',monospace; color:#94a3b8;">₹${fmtNum(m.total_turnover_cr, 2)} Cr</td>
          </tr>
        `;
      });
      tbody.innerHTML = html;
    }
  }

  // ==========================================================================
  // 🎯 2. MAX PAIN & STRADDLE DESK PANE
  // ==========================================================================
  function renderMaxPainPane(data) {
    if (!data) return;
    const spot = Number(data.spotPrice || 0);
    const maxPain = Number(data.maxPain || 0);
    const atmStraddle = Number(data.atmStraddle || 0);
    const rows = data.data || [];
    let atmRow = null;
    let minAtmDiff = Infinity;
    rows.forEach(r => {
      const diff = Math.abs(Number(r.strike_price || 0) - spot);
      if (diff < minAtmDiff) {
        minAtmDiff = diff;
        atmRow = r;
      }
    });
    const qm = atmRow ? (atmRow.quant_metrics || {}) : {};

    const elMpStrike = document.getElementById('mpPaneStrike');
    const elMpDiff = document.getElementById('mpPaneDiff');
    const elMpDist = document.getElementById('mpPaneDistText');
    const elMpRegime = document.getElementById('mpPaneRegime');
    if (elMpStrike) elMpStrike.textContent = maxPain ? `₹${fmtNum(maxPain, 0)}` : '--';
    if (elMpDiff && maxPain) {
      const diff = spot - maxPain;
      const isAbove = diff >= 0;
      elMpDiff.textContent = `${isAbove ? '+' : ''}${fmtNum(diff, 0)} pts (${isAbove ? 'Above' : 'Below'})`;
      elMpDiff.style.background = isAbove ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
      elMpDiff.style.color = isAbove ? '#34d399' : '#f87171';
    }
    if (elMpDist && maxPain) {
      const diff = spot - maxPain;
      elMpDist.textContent = `${Math.abs(diff).toFixed(0)} pts to Max Pain (${diff > 0 ? 'Downside Pull' : 'Upside Pull'})`;
    }
    if (elMpRegime && maxPain) {
      const diff = spot - maxPain;
      if (Math.abs(diff) < 25) {
        elMpRegime.textContent = 'Pinned at Max Pain';
        elMpRegime.style.color = '#34d399';
      } else if (diff > 0) {
        elMpRegime.textContent = 'Gravitating Lower towards Pain Strike';
        elMpRegime.style.color = '#f87171';
      } else {
        elMpRegime.textContent = 'Gravitating Higher towards Pain Strike';
        elMpRegime.style.color = '#38bdf8';
      }
    }

    const elAtmStrike = document.getElementById('mpPaneAtmStrike');
    const elStrdVal = document.getElementById('mpPaneStraddleVal');
    const elPremPct = document.getElementById('mpPanePremPct');
    const elLowerBe = document.getElementById('mpPaneLowerBe');
    const elUpperBe = document.getElementById('mpPaneUpperBe');

    const atmSp = Number(data.atmStrike || spot);
    if (elAtmStrike) elAtmStrike.textContent = `₹${fmtNum(atmSp, 0)}`;
    if (elStrdVal) elStrdVal.textContent = atmStraddle ? `₹${fmtNum(atmStraddle, 2)}` : '--';
    if (elPremPct && spot > 0 && atmStraddle > 0) {
      elPremPct.textContent = `${((atmStraddle / spot) * 100).toFixed(2)}% of Spot`;
    }
    const lowerBe = qm.lower_be || (atmSp - atmStraddle);
    const upperBe = qm.upper_be || (atmSp + atmStraddle);
    if (elLowerBe) elLowerBe.textContent = `₹${fmtNum(lowerBe, 2)}`;
    if (elUpperBe) elUpperBe.textContent = `₹${fmtNum(upperBe, 2)}`;

    // Expected move
    let expMove = Number(data.expectedMove || 0);
    if (!expMove || expMove <= 0) {
      expMove = atmStraddle > 0 ? (atmStraddle * 0.85) : 150;
    }
    const elExp = document.getElementById('mpPaneExpMove');
    const elVix = document.getElementById('mpPaneVixVal');
    const elCone = document.getElementById('mpPaneConeRange');
    const elImpPct = document.getElementById('mpPaneImpliedPct');
    if (elExp) elExp.textContent = `±${fmtNum(expMove, 1)} pts`;
    if (elVix) elVix.textContent = `India VIX: ${Number(data.indiaVix || 13.5).toFixed(2)}`;
    if (elCone) elCone.textContent = `[₹${fmtNum(spot - expMove, 0)} - ₹${fmtNum(spot + expMove, 0)}]`;
    if (elImpPct && spot > 0) elImpPct.textContent = `${((expMove / spot) * 100).toFixed(2)}%`;

    // Render Max Pain Canvas Chart
    drawMaxPainChart(rows, spot, maxPain);
  }

  function drawMaxPainChart(rows, spot, maxPain) {
    const canvas = document.getElementById('upstoxCanvasMaxPain');
    const dpi = setupHiDpiCanvas(canvas);
    if (!dpi || !rows.length) return;
    const { ctx, width, height } = dpi;

    ctx.clearRect(0, 0, width, height);

    const pad = { top: 20, right: 30, bottom: 35, left: 65 };
    const pw = width - pad.left - pad.right;
    const ph = height - pad.top - pad.bottom;

    const strikes = rows.map(r => Number(r.strike_price || 0)).filter(s => s > 0);
    if (strikes.length < 3) return;

    // Calculate option buyer payout for each strike
    const points = strikes.map(k => {
      let totalPayout = 0;
      rows.forEach(r => {
        const s = Number(r.strike_price || 0);
        const ceOi = Number(r.call_options?.market_data?.oi || 0);
        const peOi = Number(r.put_options?.market_data?.oi || 0);
        if (k > s) totalPayout += (k - s) * ceOi;
        if (s > k) totalPayout += (s - k) * peOi;
      });
      return { strike: k, payout: totalPayout };
    });

    const maxPayout = Math.max(...points.map(p => p.payout), 1);
    const minPayout = Math.min(...points.map(p => p.payout), 0);
    const minStrike = Math.min(...strikes);
    const maxStrike = Math.max(...strikes);

    const getX = s => pad.left + ((s - minStrike) / Math.max(1, maxStrike - minStrike)) * pw;
    const getY = p => pad.top + ph - ((p - minPayout) / Math.max(1, maxPayout - minPayout)) * ph;

    // Draw background grid lines
    ctx.strokeStyle = '#162035';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 4; i++) {
      const yVal = minPayout + (maxPayout - minPayout) * (i / 4);
      const y = pad.top + ph - (i / 4) * ph;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
      ctx.fillText(fmtQty(yVal), pad.left - 8, y + 3);
    }

    // Draw area under curve
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ph);
    grad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
    grad.addColorStop(1, 'rgba(56, 189, 248, 0.01)');

    ctx.beginPath();
    points.forEach((p, idx) => {
      const x = getX(p.strike);
      const y = getY(p.payout);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(getX(points[points.length - 1].strike), pad.top + ph);
    ctx.lineTo(getX(points[0].strike), pad.top + ph);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Draw curve line
    ctx.beginPath();
    points.forEach((p, idx) => {
      const x = getX(p.strike);
      const y = getY(p.payout);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Mark Max Pain Strike
    if (maxPain) {
      const mpX = getX(maxPain);
      const mpPoint = points.find(p => Math.abs(p.strike - maxPain) < 1) || points[0];
      const mpY = getY(mpPoint.payout);

      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(mpX, pad.top);
      ctx.lineTo(mpX, pad.top + ph);
      ctx.stroke();
      ctx.restore();

      // Circle at min point
      ctx.beginPath();
      ctx.arc(mpX, mpY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#c084fc';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Max Pain: ₹${fmtNum(maxPain, 0)}`, mpX, pad.top + 14);
    }

    // Mark Spot Line
    if (spot) {
      const spX = getX(spot);
      ctx.save();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(spX, pad.top);
      ctx.lineTo(spX, pad.top + ph);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Spot: ₹${fmtNum(spot, 0)}`, spX, pad.top + 28);
    }

    // X Axis Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    points.forEach((p, idx) => {
      if (idx % Math.ceil(points.length / 8) === 0 || idx === points.length - 1) {
        ctx.fillText(fmtNum(p.strike, 0), getX(p.strike), pad.top + ph + 16);
      }
    });
  }

  // ==========================================================================
  // 📈 3. OPEN INTEREST DISTRIBUTION & BUILDUP PANE
  // ==========================================================================
  function renderOiDistPane(data) {
    if (!data) return;
    const spot = Number(data.spotPrice || 0);
    const rows = data.data || [];
    if (!rows.length) return;

    // Charts
    drawOiBarChart(rows, spot);
    drawOiChgBarChart(rows, spot);

    // 4-Quadrant Strike Buildup Classification
    const lb = [], sb = [], sc = [], lu = [];

    rows.forEach(r => {
      const sp = Number(r.strike_price || 0);
      const ceMd = r.call_options?.market_data || {};
      const peMd = r.put_options?.market_data || {};

      const ceB = getBuildup(ceMd.day_change, ceMd.oi_day_change);
      const peB = getBuildup(peMd.day_change, peMd.oi_day_change);

      const addChip = (list, strike, side, chgPct) => {
        list.push(`
          <div style="display:flex; justify-content:space-between; align-items:center; background:#0f172a; padding:4px 8px; border-radius:4px; margin-bottom:4px; font-family:'JetBrains Mono',monospace; font-size:11px; border:1px solid #1e293b;">
            <span style="font-weight:700; color:#f8fafc;">₹${fmtNum(strike, 0)} ${side}</span>
            <span style="color:${chgPct >= 0 ? '#34d399' : '#f87171'}; font-weight:600;">${chgPct >= 0 ? '+' : ''}${fmtNum(chgPct, 1)}%</span>
          </div>
        `);
      };

      if (ceB.code === 'LB') addChip(lb, sp, 'CE', ceMd.day_change_percentage);
      if (peB.code === 'LB') addChip(lb, sp, 'PE', peMd.day_change_percentage);

      if (ceB.code === 'SB') addChip(sb, sp, 'CE', ceMd.day_change_percentage);
      if (peB.code === 'SB') addChip(sb, sp, 'PE', peMd.day_change_percentage);

      if (ceB.code === 'SC') addChip(sc, sp, 'CE', ceMd.day_change_percentage);
      if (peB.code === 'SC') addChip(sc, sp, 'PE', peMd.day_change_percentage);

      if (ceB.code === 'LU') addChip(lu, sp, 'CE', ceMd.day_change_percentage);
      if (peB.code === 'LU') addChip(lu, sp, 'PE', peMd.day_change_percentage);
    });

    const setList = (idList, idCount, items) => {
      const elList = document.getElementById(idList);
      const elCount = document.getElementById(idCount);
      if (elCount) elCount.textContent = items.length;
      if (elList) {
        elList.innerHTML = items.length ? items.join('') : '<div style="color:#64748b; font-size:11px; padding:8px; text-align:center;">No strikes in this quadrant</div>';
      }
    };

    setList('upstoxListLb', 'upstoxCountLb', lb);
    setList('upstoxListSb', 'upstoxCountSb', sb);
    setList('upstoxListSc', 'upstoxCountSc', sc);
    setList('upstoxListLu', 'upstoxCountLu', lu);
  }

  function drawOiBarChart(rows, spot) {
    const canvas = document.getElementById('upstoxCanvasOi');
    const dpi = setupHiDpiCanvas(canvas);
    if (!dpi || !rows.length) return;
    const { ctx, width, height } = dpi;

    ctx.clearRect(0, 0, width, height);

    const pad = { top: 20, right: 20, bottom: 35, left: 60 };
    const pw = width - pad.left - pad.right;
    const ph = height - pad.top - pad.bottom;

    const maxCeOi = Math.max(...rows.map(r => Number(r.call_options?.market_data?.oi || 0)), 1000);
    const maxPeOi = Math.max(...rows.map(r => Number(r.put_options?.market_data?.oi || 0)), 1000);
    const maxOi = Math.max(maxCeOi, maxPeOi);

    // Draw horizontal grid lines
    ctx.strokeStyle = '#162035';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 4; i++) {
      const val = (maxOi * i) / 4;
      const y = pad.top + ph - (i / 4) * ph;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
      ctx.fillText(fmtQty(val), pad.left - 6, y + 3);
    }

    const count = rows.length;
    const colW = pw / count;
    const barW = Math.max(2, (colW - 4) / 2);

    rows.forEach((r, idx) => {
      const x = pad.left + idx * colW + 2;
      const ceOi = Number(r.call_options?.market_data?.oi || 0);
      const peOi = Number(r.put_options?.market_data?.oi || 0);

      const ceH = (ceOi / maxOi) * ph;
      const peH = (peOi / maxOi) * ph;

      // CE Bar (Green/Emerald)
      ctx.fillStyle = '#10b981';
      ctx.fillRect(x, pad.top + ph - ceH, barW, ceH);

      // PE Bar (Red/Crimson)
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x + barW + 1, pad.top + ph - peH, barW, peH);

      // Strike label
      if (idx % Math.ceil(count / 7) === 0 || idx === count - 1) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9.5px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(fmtNum(r.strike_price, 0), x + barW, pad.top + ph + 16);
      }
    });

    // Mark Spot Line
    if (spot) {
      const minS = Number(rows[0]?.strike_price || 0);
      const maxS = Number(rows[rows.length - 1]?.strike_price || 1);
      if (spot >= minS && spot <= maxS) {
        const spotX = pad.left + ((spot - minS) / (maxS - minS)) * pw;
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(spotX, pad.top);
        ctx.lineTo(spotX, pad.top + ph);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 9.5px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`Spot: ₹${fmtNum(spot, 0)}`, spotX, pad.top + 10);
      }
    }
  }

  function drawOiChgBarChart(rows, spot) {
    const canvas = document.getElementById('upstoxCanvasOiChg');
    const dpi = setupHiDpiCanvas(canvas);
    if (!dpi || !rows.length) return;
    const { ctx, width, height } = dpi;

    ctx.clearRect(0, 0, width, height);

    const pad = { top: 20, right: 20, bottom: 35, left: 60 };
    const pw = width - pad.left - pad.right;
    const ph = height - pad.top - pad.bottom;

    const ceChgs = rows.map(r => Number(r.call_options?.market_data?.oi_day_change || 0));
    const peChgs = rows.map(r => Number(r.put_options?.market_data?.oi_day_change || 0));
    const allChgs = [...ceChgs, ...peChgs];
    const maxChg = Math.max(...allChgs.map(Math.abs), 500);

    const zeroY = pad.top + ph / 2;

    // Grid
    ctx.strokeStyle = '#162035';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';

    ctx.beginPath();
    ctx.moveTo(pad.left, zeroY);
    ctx.lineTo(width - pad.right, zeroY);
    ctx.stroke();
    ctx.fillText('0', pad.left - 6, zeroY + 3);

    // +Max & -Max lines
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(width - pad.right, pad.top);
    ctx.stroke();
    ctx.fillText(`+${fmtQty(maxChg)}`, pad.left - 6, pad.top + 3);

    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top + ph);
    ctx.lineTo(width - pad.right, pad.top + ph);
    ctx.stroke();
    ctx.fillText(`-${fmtQty(maxChg)}`, pad.left - 6, pad.top + ph + 3);

    const count = rows.length;
    const colW = pw / count;
    const barW = Math.max(2, (colW - 4) / 2);

    rows.forEach((r, idx) => {
      const x = pad.left + idx * colW + 2;
      const ceChg = Number(r.call_options?.market_data?.oi_day_change || 0);
      const peChg = Number(r.put_options?.market_data?.oi_day_change || 0);

      const ceH = (ceChg / maxChg) * (ph / 2);
      const peH = (peChg / maxChg) * (ph / 2);

      // Call Chg Bar
      ctx.fillStyle = ceChg >= 0 ? '#10b981' : '#059669';
      if (ceH >= 0) {
        ctx.fillRect(x, zeroY - ceH, barW, ceH);
      } else {
        ctx.fillRect(x, zeroY, barW, -ceH);
      }

      // Put Chg Bar
      ctx.fillStyle = peChg >= 0 ? '#ef4444' : '#b91c1c';
      if (peH >= 0) {
        ctx.fillRect(x + barW + 1, zeroY - peH, barW, peH);
      } else {
        ctx.fillRect(x + barW + 1, zeroY, barW, -peH);
      }

      // Strike label
      if (idx % Math.ceil(count / 7) === 0 || idx === count - 1) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9.5px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(fmtNum(r.strike_price, 0), x + barW, pad.top + ph + 16);
      }
    });
  }

  // ==========================================================================
  // 📐 4. GREEKS & VOLATILITY SKEW PANE
  // ==========================================================================
  function renderGreeksPane(data) {
    if (!data) return;
    const spot = Number(data.spotPrice || 0);
    const rows = data.data || [];
    if (!rows.length) return;

    let atmRow = null;
    let minAtmDiff = Infinity;
    rows.forEach(r => {
      const diff = Math.abs(Number(r.strike_price || 0) - spot);
      if (diff < minAtmDiff) {
        minAtmDiff = diff;
        atmRow = r;
      }
    });

    const ceGr = atmRow?.call_options?.option_greeks || {};
    const peGr = atmRow?.put_options?.option_greeks || {};
    const qm = atmRow?.quant_metrics || {};

    const elDelta = document.getElementById('upstoxGreekDelta');
    const elGamma = document.getElementById('upstoxGreekGamma');
    const elTheta = document.getElementById('upstoxGreekTheta');
    const elVega = document.getElementById('upstoxGreekVega');
    const elIv = document.getElementById('upstoxGreekIv');
    const elIvSkew = document.getElementById('upstoxGreekIvSkew');

    if (elDelta) elDelta.textContent = `CE: ${fmtNum(ceGr.delta, 2)} | PE: ${fmtNum(peGr.delta, 2)}`;
    if (elGamma) elGamma.textContent = fmtNum(ceGr.gamma || peGr.gamma, 4);
    if (elTheta) elTheta.textContent = `₹${fmtNum(ceGr.theta, 1)} / ₹${fmtNum(peGr.theta, 1)}`;
    if (elVega) elVega.textContent = `₹${fmtNum(ceGr.vega || peGr.vega, 2)}`;
    if (elIv) elIv.textContent = `${fmtNum(ceGr.iv || 13.5, 2)}%`;
    if (elIvSkew) {
      const skew = Number(qm.iv_skew || 0);
      elIvSkew.textContent = `Skew: ${skew >= 0 ? '+' : ''}${skew.toFixed(2)}% (${skew >= 0 ? 'CE Rich' : 'PE Rich'})`;
      elIvSkew.style.color = skew >= 0 ? '#34d399' : '#f87171';
    }

    drawIvSmileChart(rows, data.atmStrike || spot);
  }

  function drawIvSmileChart(rows, atmStrike) {
    const canvas = document.getElementById('upstoxCanvasIvSmile');
    const dpi = setupHiDpiCanvas(canvas);
    if (!dpi || !rows.length) return;
    const { ctx, width, height } = dpi;

    ctx.clearRect(0, 0, width, height);

    const pad = { top: 25, right: 30, bottom: 35, left: 55 };
    const pw = width - pad.left - pad.right;
    const ph = height - pad.top - pad.bottom;

    const strikes = rows.map(r => Number(r.strike_price || 0));
    const ceIvs = rows.map(r => Number(r.call_options?.option_greeks?.iv || 0));
    const peIvs = rows.map(r => Number(r.put_options?.option_greeks?.iv || 0));

    const validIvs = [...ceIvs, ...peIvs].filter(v => v > 0);
    const minIv = validIvs.length ? Math.max(5, Math.min(...validIvs) - 2) : 10;
    const maxIv = validIvs.length ? Math.max(...validIvs) + 2 : 25;

    const minS = Math.min(...strikes);
    const maxS = Math.max(...strikes);

    const getX = s => pad.left + ((s - minS) / Math.max(1, maxS - minS)) * pw;
    const getY = iv => pad.top + ph - ((iv - minIv) / Math.max(1, maxIv - minIv)) * ph;

    // Grid lines
    ctx.strokeStyle = '#162035';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 4; i++) {
      const val = minIv + (maxIv - minIv) * (i / 4);
      const y = pad.top + ph - (i / 4) * ph;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
      ctx.fillText(`${val.toFixed(1)}%`, pad.left - 6, y + 3);
    }

    // Call IV Line
    ctx.beginPath();
    rows.forEach((r, idx) => {
      const x = getX(Number(r.strike_price || 0));
      const iv = Number(r.call_options?.option_greeks?.iv || 0);
      const y = getY(iv > 0 ? iv : minIv);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Put IV Line
    ctx.beginPath();
    rows.forEach((r, idx) => {
      const x = getX(Number(r.strike_price || 0));
      const iv = Number(r.put_options?.option_greeks?.iv || 0);
      const y = getY(iv > 0 ? iv : minIv);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // ATM Vertical Line
    if (atmStrike) {
      const atmX = getX(atmStrike);
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(atmX, pad.top);
      ctx.lineTo(atmX, pad.top + ph);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`ATM: ₹${fmtNum(atmStrike, 0)}`, atmX, pad.top + 12);
    }

    // X Axis
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    rows.forEach((r, idx) => {
      if (idx % Math.ceil(rows.length / 8) === 0 || idx === rows.length - 1) {
        ctx.fillText(fmtNum(r.strike_price, 0), getX(Number(r.strike_price || 0)), pad.top + ph + 16);
      }
    });
  }

  // Event Handlers Setup
  function initListeners() {
    // 0. Subnav Tab Switcher
    const subnavBtns = document.querySelectorAll('#upstoxSubnavBar .go-subtab-btn');
    subnavBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        const tab = e.currentTarget.getAttribute('data-upstox-tab');
        if (tab) switchUpstoxTab(tab);
      });
    });
    // 1. Asset Pill Switcher
    const pills = document.querySelectorAll('#upstoxAssetPills .upstox-pill-btn');
    pills.forEach(btn => {
      btn.addEventListener('click', e => {
        pills.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state.instrumentKey = e.currentTarget.getAttribute('data-key');
        state.expiryDate = ''; // Reset expiry to auto-select nearest
        fetchChain(true);
      });
    });

    // 2. Expiry Select
    const selExp = document.getElementById('upstoxExpirySelect');
    if (selExp) {
      selExp.addEventListener('change', e => {
        state.expiryDate = e.target.value;
        fetchChain(true);
      });
    }

    // 3. View Mode Toggle
    const viewBtns = document.querySelectorAll('.upstox-view-toggle .upstox-view-btn');
    viewBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        viewBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state.viewMode = e.currentTarget.getAttribute('data-view');
        if (state.chainData) renderTable(state.chainData);
      });
    });

    // 4c. Strike Range Filter Pills
    const rangeBtns = document.querySelectorAll('#upstoxRangePills .upstox-range-btn');
    rangeBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        rangeBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state.strikeRange = parseInt(e.currentTarget.getAttribute('data-range'), 10);
        if (state.chainData) renderTable(state.chainData);
      });
    });

    // 5. Strike Search Filter
    const searchInput = document.getElementById('upstoxStrikeSearch');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        state.searchQuery = e.target.value;
        if (state.chainData) renderTable(state.chainData);
      });
    }

    // 6. Center to ATM Button
    const btnAtm = document.getElementById('upstoxBtnCenterAtm');
    if (btnAtm) {
      btnAtm.addEventListener('click', centerToAtm);
    }

    // 7. Auto Refresh Selector
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
      // Start default interval (5s)
      state.timerId = setInterval(() => fetchChain(false), 5000);
    }

    // 8. Manual Refresh Button
    const btnRef = document.getElementById('upstoxBtnRefresh');
    if (btnRef) {
      btnRef.addEventListener('click', () => fetchChain(true));
    }

    // 9. Escape key to close modal
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });

    // 10. Init 14-Metric Visualizer Pills & Chart Events (Image 15 Style)
    initVisualizerEvents();
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
    centerAtm: function () {
      centerToAtm();
    },
    openModal: function (strike) {
      if (!state.chainData || !state.chainData.data) return;
      const r = state.chainData.data.find(x => Math.abs(x.strike_price - strike) < 0.1);
      if (r) openStrikeModal(r, state.chainData.spotPrice, false);
    },
    closeModal: function () {
      closeModal();
    },
    switchTab: function (tabName) {
      switchUpstoxTab(tabName);
    },
    renderVisualizer: function () {
      if (state.chainData) renderVisualizerChart(state.chainData);
    },
    setInstrument: function (key) {
      state.instrumentKey = key;
      const pills = document.querySelectorAll('#upstoxAssetPills .upstox-pill-btn');
      pills.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-key') === key);
      });
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
