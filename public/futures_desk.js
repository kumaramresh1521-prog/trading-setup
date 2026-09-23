/**
 * Institutional Futures Intelligence Desk
 * Powered by Kotak Neo Derivatives Engine
 * Comprehensive real-time Stock & Index Futures analytics:
 * - Futures Dashboard (Turnover, OI, Gainers/Losers, Index Basis)
 * - Future Open Interest Screener (Search, filter, sortable F&O matrix)
 * - Future Buildup Quadrants (Long Buildup, Short Buildup, Short Covering, Long Unwinding)
 * - F&O Heatmap (OI-weighted market treemap)
 * - MWPL & Ban Tracker (Ban list, Alert Zone 80-95%, % progress bars)
 */

(function () {
  const state = {
    activeSubTab: 'dashboard',
    sector: 'ALL',
    search: '',
    sortBy: 'oiValueCr',
    sortDir: 'desc',
    autoRefreshSec: 5,
    countdownSec: 5,
    countdownTimer: null,
    lastRenderedPrices: {},
    timerId: null,
    isLoading: false,
    dashboardData: null,
    screenerData: null,
    buildupData: null,
    heatmapData: null,
    mwplData: null,
    initialized: false
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

  function getSignalBadge(sig) {
    const s = (sig || '').toUpperCase();
    if (s === 'LONG BUILDUP') {
      return `<span class="fut-badge fut-badge-lb">🟢 LONG BUILDUP</span>`;
    } else if (s === 'SHORT BUILDUP') {
      return `<span class="fut-badge fut-badge-sb">🔴 SHORT BUILDUP</span>`;
    } else if (s === 'SHORT COVERING') {
      return `<span class="fut-badge fut-badge-sc">🔵 SHORT COVERING</span>`;
    } else if (s === 'LONG UNWINDING') {
      return `<span class="fut-badge fut-badge-lu">🟡 LONG UNWINDING</span>`;
    }
    return `<span class="fut-badge fut-badge-neutral">⚪ NEUTRAL</span>`;
  }

  // --- Sub-Tab Switching ---
  function switchSubTab(tabName) {
    state.activeSubTab = tabName;
    document.querySelectorAll('.fut-subtab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    const views = ['dashboard', 'screener', 'buildup', 'heatmap', 'mwpl'];
    views.forEach(v => {
      const el = document.getElementById(`futView_${v}`);
      if (el) {
        el.style.display = (v === tabName) ? 'block' : 'none';
      }
    });

    refreshCurrentSubTab();
  }

  function refreshCurrentSubTab() {
    if (state.activeSubTab === 'dashboard') loadDashboard();
    else if (state.activeSubTab === 'screener') loadScreener();
    else if (state.activeSubTab === 'buildup') loadBuildup();
    else if (state.activeSubTab === 'heatmap') loadHeatmap();
    else if (state.activeSubTab === 'mwpl') loadMwpl();
  }

  // --- 1. Dashboard View ---
  async function loadDashboard() {
    try {
      const res = await fetch('/api/futures/dashboard');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      state.dashboardData = data;
      renderDashboard(data);
    } catch (err) {
      console.error('Error loading futures dashboard:', err);
    }
  }

  function renderDashboard(data) {
    if (!data) return;

    // Macro KPIs
    const turnoverEl = document.getElementById('futKpiTurnover');
    if (turnoverEl) turnoverEl.textContent = `₹${fmtNum(data.totalTurnoverCr, 2)} Cr`;

    const oiEl = document.getElementById('futKpiOi');
    if (oiEl) oiEl.textContent = `${fmtQty(data.cumulativeOiContracts)} (${fmtNum(data.totalOiValueCr, 1)} Cr)`;

    const countEl = document.getElementById('futKpiUniverse');
    if (countEl) countEl.textContent = `${data.universeCount || 80} Contracts`;

    // Buildup Ratio
    const lbCount = data.longBuildupCount || 0;
    const sbCount = data.shortBuildupCount || 0;
    const scCount = data.shortCoveringCount || 0;
    const luCount = data.longUnwindingCount || 0;
    const totB = (lbCount + sbCount + scCount + luCount) || 1;

    const lbPct = Math.round((lbCount / totB) * 100);
    const sbPct = Math.round((sbCount / totB) * 100);
    const scPct = Math.round((scCount / totB) * 100);
    const luPct = 100 - (lbPct + sbPct + scPct);

    const bRatioEl = document.getElementById('futBuildupRatioBar');
    if (bRatioEl) {
      bRatioEl.innerHTML = `
        <div style="width:${lbPct}%; background:#10b981;" title="Long Buildup: ${lbCount}"></div>
        <div style="width:${sbPct}%; background:#ef4444;" title="Short Buildup: ${sbCount}"></div>
        <div style="width:${scPct}%; background:#3b82f6;" title="Short Covering: ${scCount}"></div>
        <div style="width:${luPct}%; background:#f59e0b;" title="Long Unwinding: ${luCount}"></div>
      `;
    }

    const bCountText = document.getElementById('futBuildupCountText');
    if (bCountText) {
      bCountText.innerHTML = `
        <span style="color:#10b981; font-weight:700;">🟢 ${lbCount} Longs</span> &bull; 
        <span style="color:#ef4444; font-weight:700;">🔴 ${sbCount} Shorts</span> &bull; 
        <span style="color:#3b82f6; font-weight:700;">🔵 ${scCount} Covering</span> &bull; 
        <span style="color:#f59e0b; font-weight:700;">🟡 ${luCount} Unwinding</span>
      `;
    }

    // Render Index Futures Cards
    const idxGrid = document.getElementById('futIndexCardsGrid');
    if (idxGrid && data.indices) {
      idxGrid.innerHTML = data.indices.map(idx => {
        const isPos = idx.changePct >= 0;
        const color = isPos ? '#10b981' : '#ef4444';
        const sign = isPos ? '+' : '';
        const basisSign = idx.basis >= 0 ? '+' : '';
        return `
          <div class="fut-index-card">
            <div class="fut-index-header">
              <div>
                <span class="fut-index-sym">${idx.symbol} FUT</span>
                <span class="fut-index-exp">${idx.expiry}</span>
              </div>
              <span class="fut-badge ${isPos ? 'fut-badge-lb' : 'fut-badge-sb'}">${idx.buildup}</span>
            </div>
            <div class="fut-index-price-row">
              <span class="fut-index-ltp" style="color:${color}">₹${fmtNum(idx.ltp)}</span>
              <span class="fut-index-chg" style="color:${color}">${sign}${fmtNum(idx.change)} (${sign}${fmtNum(idx.changePct)}%)</span>
            </div>
            <div class="fut-index-metrics">
              <div class="fut-im-item">
                <span class="fim-label">Spot Price</span>
                <span class="fim-val">₹${fmtNum(idx.spotPrice)}</span>
              </div>
              <div class="fut-im-item">
                <span class="fim-label">Basis (Spread)</span>
                <span class="fim-val" style="color:${idx.basis >= 0 ? '#10b981' : '#ef4444'}">${basisSign}${fmtNum(idx.basis, 1)} pts</span>
              </div>
              <div class="fut-im-item">
                <span class="fim-label">Open Interest</span>
                <span class="fim-val">${fmtQty(idx.openInterest)}</span>
              </div>
              <div class="fut-im-item">
                <span class="fim-label">OI Chg</span>
                <span class="fim-val" style="color:${idx.oiChangePct >= 0 ? '#10b981' : '#ef4444'}">${idx.oiChangePct >= 0 ? '+' : ''}${fmtNum(idx.oiChangePct)}%</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Top Gainers / Losers
    renderMiniList('futTopGainersList', data.topGainers || [], 'gain');
    renderMiniList('futTopLosersList', data.topLosers || [], 'loss');
    renderMiniList('futTopOiAddList', data.topOiAdditions || [], 'oiAdd');
    renderMiniList('futTopOiShedList', data.topOiShedding || [], 'oiShed');

    // As of badge
    const asOf = document.getElementById('futAsOfBadge');
    if (asOf && data.asOf) asOf.textContent = `As of ${data.asOf}`;
  }

  function renderMiniList(containerId, list, type) {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (!list || !list.length) {
      el.innerHTML = `<div style="padding:12px; color:var(--text-muted); font-size:12px;">No contracts found</div>`;
      return;
    }
    el.innerHTML = list.map(item => {
      const isPos = item.changePct >= 0;
      const color = isPos ? '#10b981' : '#ef4444';
      const sign = isPos ? '+' : '';
      let secondaryText = '';

      if (type === 'oiAdd' || type === 'oiShed') {
        const oiPos = item.oiChangePct >= 0;
        secondaryText = `<span style="color:${oiPos ? '#10b981' : '#ef4444'}; font-weight:700;">OI: ${oiPos ? '+' : ''}${fmtNum(item.oiChangePct)}%</span>`;
      } else {
        secondaryText = `<span style="color:var(--text-muted); font-size:11px;">OI: ${fmtNum(item.oiValueCr, 1)} Cr</span>`;
      }

      return `
        <div class="fut-mini-row" onclick="window.futuresDesk.inspectContract('${item.symbol}')">
          <div class="fm-sym-col">
            <span class="fm-sym">${item.symbol}</span>
            <span class="fm-sec">${item.sector || 'F&O'}</span>
          </div>
          <div class="fm-price-col">
            <span class="fm-ltp">₹${fmtNum(item.ltp)}</span>
            <span class="fm-chg" style="color:${color}">${sign}${fmtNum(item.changePct)}%</span>
          </div>
          <div class="fm-sec-col">
            ${secondaryText}
          </div>
        </div>
      `;
    }).join('');
  }

  // --- 2. Screener View ---
  async function loadScreener() {
    try {
      const url = `/api/futures/screener?sector=${encodeURIComponent(state.sector)}&search=${encodeURIComponent(state.search)}&sortBy=${state.sortBy}&sortDir=${state.sortDir}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      state.screenerData = data;
      renderScreener(data);
    } catch (err) {
      console.error('Error loading futures screener:', err);
    }
  }

  function renderScreener(data) {
    if (!data) return;
    const countBadge = document.getElementById('futScreenerCountBadge');
    if (countBadge) countBadge.textContent = `${data.count || 0} Contracts`;

    const tbody = document.getElementById('futScreenerTableBody');
    if (!tbody) return;

    const list = data.results || [];
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding:24px; color:var(--text-muted);">No matching futures contracts found.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map((item, idx) => {
      const isPos = item.changePct >= 0;
      const color = isPos ? '#10b981' : '#ef4444';
      const sign = isPos ? '+' : '';
      const oiPos = item.oiChangePct >= 0;
      const oiColor = oiPos ? '#10b981' : '#ef4444';
      const basisColor = item.basis >= 0 ? '#10b981' : '#ef4444';
      const basisSign = item.basis >= 0 ? '+' : '';

      return `
        <tr class="fut-row" onclick="window.futuresDesk.inspectContract('${item.symbol}')">
          <td style="font-weight:700; color:var(--text-muted); font-size:11px;">#${idx + 1}</td>
          <td>
            <div style="display:flex; align-items:center; gap:6px;">
              <strong style="color:#60a5fa; font-size:13px;">${item.symbol}</strong>
              <span class="badge" style="font-size:10px; background:#1e293b; color:#94a3b8; padding:2px 5px; border-radius:3px;">${item.type}</span>
            </div>
          </td>
          <td><span style="font-size:11.5px; color:var(--text-muted);">${item.sector || 'F&O'}</span></td>
          <td style="font-size:11.5px; font-family:'JetBrains Mono',monospace;">${item.expiry}</td>
          <td style="text-align:right; font-weight:700; font-family:'JetBrains Mono',monospace;">₹${fmtNum(item.ltp)}</td>
          <td style="text-align:right; font-weight:700; color:${color}; font-family:'JetBrains Mono',monospace;">${sign}${fmtNum(item.changePct)}%</td>
          <td style="text-align:right; font-family:'JetBrains Mono',monospace;">${fmtQty(item.openInterest)}</td>
          <td style="text-align:right; font-family:'JetBrains Mono',monospace; color:${oiColor}; font-weight:700;">${oiPos ? '+' : ''}${fmtNum(item.oiChangePct)}%</td>
          <td style="text-align:right; font-family:'JetBrains Mono',monospace;">₹${fmtNum(item.oiValueCr, 1)}</td>
          <td style="text-align:right; font-family:'JetBrains Mono',monospace; color:${basisColor};">${basisSign}${fmtNum(item.basis, 1)}</td>
          <td style="text-align:right; font-family:'JetBrains Mono',monospace; color:var(--text-muted);">₹${fmtNum(item.turnoverCr, 1)}</td>
          <td style="text-align:center;">${getSignalBadge(item.buildup)}</td>
        </tr>
      `;
    }).join('');
  }

  // --- 3. Buildup Quadrant View ---
  async function loadBuildup() {
    try {
      const res = await fetch('/api/futures/buildup');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      state.buildupData = data;
      renderBuildup(data);
    } catch (err) {
      console.error('Error loading buildup quadrants:', err);
    }
  }

  function renderBuildup(data) {
    if (!data) return;

    renderQuadrantBox('futQuadLbList', 'futQuadLbCount', 'futQuadLbOi', data.longBuildup || [], '#10b981');
    renderQuadrantBox('futQuadSbList', 'futQuadSbCount', 'futQuadSbOi', data.shortBuildup || [], '#ef4444');
    renderQuadrantBox('futQuadScList', 'futQuadScCount', 'futQuadScOi', data.shortCovering || [], '#3b82f6');
    renderQuadrantBox('futQuadLuList', 'futQuadLuCount', 'futQuadLuOi', data.longUnwinding || [], '#f59e0b');
  }

  function renderQuadrantBox(listId, countId, oiId, items, accentColor) {
    const countEl = document.getElementById(countId);
    if (countEl) countEl.textContent = `${items.length} Stocks`;

    const totalOiCr = items.reduce((acc, curr) => acc + (curr.oiValueCr || 0), 0);
    const oiEl = document.getElementById(oiId);
    if (oiEl) oiEl.textContent = `₹${fmtNum(totalOiCr, 1)} Cr`;

    const listEl = document.getElementById(listId);
    if (!listEl) return;

    if (!items.length) {
      listEl.innerHTML = `<div style="padding:16px; text-align:center; color:var(--text-muted); font-size:12px;">No contracts in this quadrant today.</div>`;
      return;
    }

    listEl.innerHTML = items.map(item => {
      const isPos = item.changePct >= 0;
      const sign = isPos ? '+' : '';
      const oiPos = item.oiChangePct >= 0;

      return `
        <div class="fut-quad-item" onclick="window.futuresDesk.inspectContract('${item.symbol}')">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:6px;">
              <strong style="color:#f8fafc; font-size:13px;">${item.symbol}</strong>
              <small style="color:var(--text-muted); font-size:10px;">${item.sector || ''}</small>
            </div>
            <span style="font-weight:700; color:${item.changePct >= 0 ? '#10b981' : '#ef4444'}; font-family:'JetBrains Mono',monospace;">${sign}${fmtNum(item.changePct)}%</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px; font-size:11px; color:var(--text-muted); font-family:'JetBrains Mono',monospace;">
            <span>LTP: ₹${fmtNum(item.ltp)}</span>
            <span style="color:${accentColor}; font-weight:700;">OI: ${oiPos ? '+' : ''}${fmtNum(item.oiChangePct)}% (₹${fmtNum(item.oiValueCr, 1)} Cr)</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- 4. F&O Heatmap View ---
  async function loadHeatmap() {
    try {
      const res = await fetch(`/api/futures/heatmap?sector=${encodeURIComponent(state.sector)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      state.heatmapData = data;
      renderHeatmap(data);
    } catch (err) {
      console.error('Error loading futures heatmap:', err);
    }
  }

  function getHeatmapBg(pct) {
    if (pct >= 3.0) return 'linear-gradient(135deg, rgba(16, 185, 129, 0.85), rgba(5, 150, 105, 0.95))';
    if (pct >= 1.5) return 'linear-gradient(135deg, rgba(16, 185, 129, 0.65), rgba(5, 150, 105, 0.75))';
    if (pct >= 0.5) return 'linear-gradient(135deg, rgba(16, 185, 129, 0.40), rgba(5, 150, 105, 0.50))';
    if (pct > -0.5) return 'linear-gradient(135deg, rgba(51, 65, 85, 0.50), rgba(30, 41, 59, 0.60))';
    if (pct > -1.5) return 'linear-gradient(135deg, rgba(239, 68, 68, 0.40), rgba(220, 38, 38, 0.50))';
    if (pct > -3.0) return 'linear-gradient(135deg, rgba(239, 68, 68, 0.65), rgba(220, 38, 38, 0.75))';
    return 'linear-gradient(135deg, rgba(239, 68, 68, 0.85), rgba(220, 38, 38, 0.95))';
  }

  function renderHeatmap(data) {
    if (!data) return;
    const grid = document.getElementById('futHeatmapGrid');
    if (!grid) return;

    const tiles = data.tiles || [];
    if (!tiles.length) {
      grid.innerHTML = `<div style="grid-column: 1 / -1; padding:32px; text-align:center; color:var(--text-muted);">No heatmap data available for this sector filter.</div>`;
      return;
    }

    grid.innerHTML = tiles.map(tile => {
      const bg = getHeatmapBg(tile.changePct);
      const isPos = tile.changePct >= 0;
      const sign = isPos ? '+' : '';
      const sizeClass = tile.sizeTier || 'tile-medium'; // 'tile-large', 'tile-medium', 'tile-small'

      return `
        <div class="fut-heatmap-tile ${sizeClass}" style="background:${bg};" onclick="window.futuresDesk.inspectContract('${tile.symbol}')">
          <div class="fht-top">
            <span class="fht-symbol">${tile.symbol}</span>
            <span class="fht-chg">${sign}${fmtNum(tile.changePct)}%</span>
          </div>
          <div class="fht-bottom">
            <span class="fht-ltp">₹${fmtNum(tile.ltp)}</span>
            <span class="fht-oi">OI: ₹${fmtNum(tile.oiValueCr, 1)} Cr</span>
          </div>
          <div class="fht-tooltip">
            <strong>${tile.symbol}</strong> • ${tile.sector || ''}<br/>
            LTP: ₹${fmtNum(tile.ltp)} (${sign}${fmtNum(tile.changePct)}%)<br/>
            Total OI: ${fmtQty(tile.openInterest)} (₹${fmtNum(tile.oiValueCr, 1)} Cr)<br/>
            OI Change: ${tile.oiChangePct >= 0 ? '+' : ''}${fmtNum(tile.oiChangePct)}%<br/>
            Buildup: ${tile.buildup}
          </div>
        </div>
      `;
    }).join('');
  }

  // --- 5. MWPL & Ban Tracker View ---
  async function loadMwpl() {
    try {
      const res = await fetch('/api/futures/mwpl');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      state.mwplData = data;
      renderMwpl(data);
    } catch (err) {
      console.error('Error loading MWPL data:', err);
    }
  }

  function renderMwpl(data) {
    if (!data) return;

    // Banned Stocks Banner
    const banBanner = document.getElementById('futMwplBanBanner');
    const banList = data.bannedStocks || [];
    if (banBanner) {
      if (banList.length > 0) {
        banBanner.style.display = 'block';
        banBanner.innerHTML = `
          <div class="fut-ban-alert-inner">
            <span style="font-size:22px;">🚫</span>
            <div style="flex:1;">
              <h4 style="margin:0; color:#f87171; font-size:14px; font-weight:800;">CURRENT F&O BAN PERIOD (${banList.length} STOCKS &gt; 95% MWPL)</h4>
              <p style="margin:4px 0 0 0; color:#fca5a5; font-size:12px;">Fresh positions strictly prohibited by exchange. Only squaring off permitted.</p>
              <div class="fut-ban-chips-wrap" style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
                ${banList.map(s => `
                  <div class="fut-ban-chip">
                    <strong>${s.symbol}</strong>
                    <span>${fmtNum(s.mwplPct, 1)}% MWPL</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
      } else {
        banBanner.style.display = 'block';
        banBanner.innerHTML = `
          <div class="fut-ban-alert-inner" style="background:rgba(16, 185, 129, 0.12); border:1px solid rgba(16, 185, 129, 0.3);">
            <span style="font-size:22px;">✅</span>
            <div>
              <h4 style="margin:0; color:#34d399; font-size:14px; font-weight:700;">NO SECURITIES IN F&O BAN TODAY</h4>
              <p style="margin:2px 0 0 0; color:#a7f3d0; font-size:12px;">All derivative securities are currently trading below the 95% threshold.</p>
            </div>
          </div>
        `;
      }
    }

    // Alert Zone (80% - 95%)
    const alertBox = document.getElementById('futMwplAlertList');
    const alertList = data.alertStocks || [];
    if (alertBox) {
      if (alertList.length > 0) {
        alertBox.innerHTML = alertList.map(s => `
          <div class="fut-mwpl-alert-card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <strong style="color:#fbbf24; font-size:13px;">${s.symbol}</strong>
              <span class="fut-badge fut-badge-sb" style="background:rgba(245, 158, 11, 0.2); color:#fbbf24; border-color:rgba(245, 158, 11, 0.4);">
                ${fmtNum(s.mwplPct, 1)}%
              </span>
            </div>
            <div class="fut-mwpl-pbar" style="margin-top:6px;">
              <div class="fut-mwpl-pfill" style="width:${Math.min(100, s.mwplPct)}%; background:#f59e0b;"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); margin-top:4px;">
              <span>Distance to Ban: <strong>${fmtNum(95 - s.mwplPct, 1)}%</strong></span>
              <span>OI: ${fmtQty(s.openInterest)}</span>
            </div>
          </div>
        `).join('');
      } else {
        alertBox.innerHTML = `<div style="grid-column: 1 / -1; padding:16px; color:var(--text-muted); font-size:12px;">No stocks currently in the 80%-95% warning zone.</div>`;
      }
    }

    // MWPL Full Matrix Table
    const tbody = document.getElementById('futMwplTableBody');
    if (!tbody) return;

    const allStocks = data.allStocks || [];
    tbody.innerHTML = allStocks.map((s, idx) => {
      let statusBadge = '';
      let barColor = '#10b981';

      if (s.mwplPct >= 95) {
        statusBadge = `<span class="fut-badge fut-badge-sb">🚫 BANNED</span>`;
        barColor = '#ef4444';
      } else if (s.mwplPct >= 80) {
        statusBadge = `<span class="fut-badge" style="background:rgba(245, 158, 11, 0.2); color:#fbbf24; border:1px solid rgba(245, 158, 11, 0.4);">⚠️ ALERT</span>`;
        barColor = '#f59e0b';
      } else {
        statusBadge = `<span class="fut-badge fut-badge-lb">NORMAL</span>`;
        barColor = '#10b981';
      }

      return `
        <tr class="fut-row" onclick="window.futuresDesk.inspectContract('${s.symbol}')">
          <td style="color:var(--text-muted); font-size:11px;">#${idx + 1}</td>
          <td><strong style="color:#60a5fa;">${s.symbol}</strong></td>
          <td><span style="font-size:11.5px; color:var(--text-muted);">${s.sector || 'F&O'}</span></td>
          <td style="text-align:right; font-family:'JetBrains Mono',monospace;">₹${fmtNum(s.ltp)}</td>
          <td style="text-align:right; font-family:'JetBrains Mono',monospace;">${fmtQty(s.openInterest)}</td>
          <td style="text-align:right; font-family:'JetBrains Mono',monospace; color:var(--text-muted);">${fmtQty(s.mwplLimit)}</td>
          <td style="text-align:right; font-weight:700; font-family:'JetBrains Mono',monospace; color:${barColor};">
            ${fmtNum(s.mwplPct, 1)}%
          </td>
          <td style="min-width:140px;">
            <div class="fut-mwpl-pbar">
              <div class="fut-mwpl-pfill" style="width:${Math.min(100, s.mwplPct)}%; background:${barColor};"></div>
            </div>
          </td>
          <td style="text-align:center;">${statusBadge}</td>
        </tr>
      `;
    }).join('');
  }

  // --- Contract Inspection / Jump ---
  function inspectContract(symbol) {
    if (!symbol) return;
    // Highlight in screener or jump to options chain if requested
    state.search = symbol;
    const searchInput = document.getElementById('futSearchInput');
    if (searchInput) searchInput.value = symbol;
    switchSubTab('screener');
  }

  // --- Auto-Refresh Timer ---
  function setAutoRefresh(seconds) {
    state.autoRefreshSec = seconds;
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
    if (state.countdownTimer) {
      clearInterval(state.countdownTimer);
      state.countdownTimer = null;
    }

    const badge = document.getElementById('futAutoRefreshBadge');
    const cdText = document.getElementById('futCountdownText');

    if (seconds <= 0) {
      if (badge) {
        badge.style.opacity = '0.5';
        badge.style.borderColor = 'rgba(255,255,255,0.1)';
        badge.style.color = '#94a3b8';
      }
      if (cdText) cdText.textContent = 'OFF';
      return;
    }

    if (badge) {
      badge.style.opacity = '1';
      badge.style.borderColor = 'rgba(16,185,129,0.3)';
      badge.style.color = '#10b981';
    }

    state.countdownSec = seconds;
    if (cdText) cdText.textContent = state.countdownSec + 's';

    state.countdownTimer = setInterval(() => {
      state.countdownSec -= 1;
      if (state.countdownSec <= 0) {
        state.countdownSec = seconds;
        refreshCurrentSubTab();
        if (badge) {
          badge.classList.remove('tick-flash-up');
          void badge.offsetWidth;
          badge.classList.add('tick-flash-up');
          setTimeout(() => badge.classList.remove('tick-flash-up'), 800);
        }
      }
      if (cdText) cdText.textContent = state.countdownSec + 's';
    }, 1000);
  }

  // --- Initialization ---
  function init() {
    if (state.initialized) {
      refreshCurrentSubTab();
      return;
    }
    state.initialized = true;

    // Attach Subtab Click Listeners
    document.querySelectorAll('.fut-subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab) switchSubTab(tab);
      });
    });

    // Sector Filter Listener
    const secSelect = document.getElementById('futSectorFilter');
    if (secSelect) {
      secSelect.addEventListener('change', (e) => {
        state.sector = e.target.value;
        refreshCurrentSubTab();
      });
    }

    // Search Input Listener
    const searchInput = document.getElementById('futSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.search = e.target.value.trim().toUpperCase();
        if (state.activeSubTab === 'screener') {
          loadScreener();
        }
      });
    }

    // Refresh Button
    const refBtn = document.getElementById('futBtnRefresh');
    if (refBtn) {
      refBtn.addEventListener('click', () => {
        refreshCurrentSubTab();
      });
    }

    // Auto-Refresh Select
    const autoRefSelect = document.getElementById('futAutoRefreshSelect');
    if (autoRefSelect) {
      autoRefSelect.value = "5";
      autoRefSelect.addEventListener('change', (e) => {
        setAutoRefresh(Number(e.target.value) || 0);
      });
    }

    // Start auto-refresh immediately (5 seconds default)
    setAutoRefresh(5);

    // Load initial subtab
    switchSubTab(state.activeSubTab);
  }

  // Export to global scope
  window.futuresDesk = {
    init,
    switchSubTab,
    refreshCurrentSubTab,
    inspectContract,
    loadDashboard,
    loadScreener,
    loadBuildup,
    loadHeatmap,
    loadMwpl
  };

  // Auto-init if panel is visible
  document.addEventListener('DOMContentLoaded', () => {
    const p = document.getElementById('panelFutures');
    if (p && p.classList.contains('active')) {
      init();
    }
  });
})();
