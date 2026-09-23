/**
 * Institutional Futures Intelligence Desk
 * Powered by Kotak Neo Derivatives Engine
 * Comprehensive real-time Stock & Index Futures analytics (200 instruments):
 * - Live All F&O Market Watch Matrix (193 Stocks + 7 Indices)
 * - Benchmark Index Futures Ribbon (Nifty, BankNifty, FinNifty, MidcpNifty, Sensex)
 * - 4-Quadrant Institutional Buildup (LB, SB, SC, LU) & Flow Heatmap
 * - Index Term Structure & Basis Spread Hub
 * - MWPL & F&O Ban Radar
 */

(function () {
  const state = {
    activeSubTab: 'matrix',
    sector: 'ALL',
    signal: 'ALL',
    search: '',
    sortBy: 'oiValueCr',
    sortDir: 'desc',
    autoRefreshSec: 5,
    countdownSec: 5,
    timerId: null,
    countdownTimer: null,
    isLoading: false,
    dashboardData: null,
    screenerData: null,
    buildupData: null,
    heatmapData: null,
    mwplData: null,
    lastPrices: {},
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

  function getSignalBadge(code, name) {
    const c = (code || '').toUpperCase();
    if (c === 'LB' || c.includes('LONG BUILD')) {
      return `<span class="fut-badge fut-badge-lb">🟢 LONG BUILDUP</span>`;
    } else if (c === 'SB' || c.includes('SHORT BUILD')) {
      return `<span class="fut-badge fut-badge-sb">🔴 SHORT BUILDUP</span>`;
    } else if (c === 'SC' || c.includes('SHORT COVER')) {
      return `<span class="fut-badge fut-badge-sc">🔵 SHORT COVERING</span>`;
    } else if (c === 'LU' || c.includes('LONG UNWIND')) {
      return `<span class="fut-badge fut-badge-lu">🟡 LONG UNWINDING</span>`;
    }
    return `<span class="fut-badge fut-badge-neutral">⚪ NEUTRAL</span>`;
  }

  // --- Sub-Tab Switching ---
  function switchSubTab(tabName) {
    // Aliases for compatibility
    if (tabName === 'dashboard' || tabName === 'screener') tabName = 'matrix';
    if (tabName === 'heatmap') tabName = 'buildup';

    state.activeSubTab = tabName;
    document.querySelectorAll('.fut-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    const views = ['matrix', 'buildup', 'indices', 'mwpl'];
    views.forEach(v => {
      const el = document.getElementById(`futView_${v}`);
      if (el) {
        el.style.display = (v === tabName) ? 'block' : 'none';
      }
    });

    refreshCurrentSubTab();
  }

  function refreshCurrentSubTab() {
    loadBenchmarkRibbon();
    if (state.activeSubTab === 'matrix') loadMatrix();
    else if (state.activeSubTab === 'buildup') loadBuildupView();
    else if (state.activeSubTab === 'indices') loadIndicesDetailView();
    else if (state.activeSubTab === 'mwpl') loadMwpl();
  }

  // --- Benchmark Index Ribbon ---
  async function loadBenchmarkRibbon() {
    try {
      const res = await fetch('/api/futures/dashboard');
      if (!res.ok) return;
      const data = await res.json();
      state.dashboardData = data;

      // Update Macro Turnover & OI
      const turnoverEl = document.getElementById('futKpiTurnover');
      if (turnoverEl && data.totalTurnoverCr) {
        turnoverEl.textContent = `₹${fmtNum(data.totalTurnoverCr, 1)} Cr`;
      }
      const oiEl = document.getElementById('futKpiOi');
      if (oiEl && data.totalOiCr) {
        oiEl.textContent = `₹${fmtNum(data.totalOiCr, 1)} Cr (${fmtQty(data.cumulativeOiContracts)})`;
      }

      // Sentiment Ratio Bar
      const counts = data.buildupCounts || {};
      const lb = counts.longBuildup || 0;
      const sb = counts.shortBuildup || 0;
      const sc = counts.shortCovering || 0;
      const lu = counts.longUnwinding || 0;
      const tot = (lb + sb + sc + lu) || 1;

      const rBar = document.getElementById('futBuildupRatioBar');
      if (rBar) {
        rBar.innerHTML = `
          <div style="width:${(lb/tot)*100}%; background:#10b981;" title="Longs: ${lb}"></div>
          <div style="width:${(sb/tot)*100}%; background:#ef4444;" title="Shorts: ${sb}"></div>
          <div style="width:${(sc/tot)*100}%; background:#3b82f6;" title="Short Covering: ${sc}"></div>
          <div style="width:${(lu/tot)*100}%; background:#f59e0b;" title="Long Unwinding: ${lu}"></div>
        `;
      }
      const cText = document.getElementById('futBuildupCountText');
      if (cText) {
        cText.innerHTML = `
          <span style="color:#10b981; font-weight:700;">🟢 ${lb}L</span> &bull; 
          <span style="color:#ef4444; font-weight:700;">🔴 ${sb}S</span> &bull; 
          <span style="color:#3b82f6; font-weight:700;">🔵 ${sc}SC</span> &bull; 
          <span style="color:#f59e0b; font-weight:700;">🟡 ${lu}LU</span>
        `;
      }

      // Signal Pill Counts
      const elLb = document.getElementById('countLb'); if (elLb) elLb.textContent = lb;
      const elSb = document.getElementById('countSb'); if (elSb) elSb.textContent = sb;
      const elSc = document.getElementById('countSc'); if (elSc) elSc.textContent = sc;
      const elLu = document.getElementById('countLu'); if (elLu) elLu.textContent = lu;

      // Render Ribbon Cards (7 Major Indices)
      const grid = document.getElementById('futIndexCardsGrid');
      if (grid && data.indices) {
        grid.innerHTML = data.indices.map(idx => {
          const isPos = (idx.priceChangePct ?? idx.changePct ?? 0) >= 0;
          const color = isPos ? '#10b981' : '#ef4444';
          const sign = isPos ? '+' : '';
          const basisVal = idx.basis ?? 0;
          const basisSign = basisVal >= 0 ? '+' : '';
          const basisColor = basisVal >= 0 ? '#10b981' : '#ef4444';
          const basisType = basisVal >= 0 ? 'PREMIUM' : 'DISCOUNT';
          const prevLtp = state.lastPrices[idx.symbol];
          const changed = prevLtp !== undefined && prevLtp !== idx.futPrice;
          const flashCls = changed ? (idx.futPrice >= prevLtp ? 'tick-flash-up' : 'tick-flash-down') : '';
          state.lastPrices[idx.symbol] = idx.futPrice;

          return `
            <div class="fut-index-card ${flashCls}" onclick="window.futuresDesk.filterBySymbol('${idx.symbol}')" title="Click to filter matrix">
              <div class="fut-ic-top">
                <div>
                  <span class="fut-ic-sym">${idx.symbol} FUT</span>
                  <span class="fut-ic-exp">${idx.expiry || '26-Mar'}</span>
                </div>
                <span class="fut-badge ${isPos ? 'fut-badge-lb' : 'fut-badge-sb'}">${idx.buildupCode || (isPos ? 'LB' : 'SB')}</span>
              </div>
              <div class="fut-ic-ltp-row">
                <span class="fut-ic-ltp" style="color:${color}">₹${fmtNum(idx.futPrice || idx.ltp)}</span>
                <span class="fut-ic-chg" style="color:${color}">${sign}${fmtNum(idx.priceChange || idx.change)} (${sign}${fmtNum(idx.priceChangePct || idx.changePct)}%)</span>
              </div>
              <div class="fut-ic-stats">
                <div class="fut-ic-stat-item">
                  <span>Spot:</span>
                  <span class="fut-ic-stat-val">₹${fmtNum(idx.spotPrice)}</span>
                </div>
                <div class="fut-ic-stat-item">
                  <span>Spread:</span>
                  <span class="fut-ic-stat-val" style="color:${basisColor}">${basisSign}${fmtNum(basisVal, 1)} pts</span>
                </div>
                <div class="fut-ic-stat-item">
                  <span>Carry (CoC):</span>
                  <span class="fut-ic-stat-val" style="color:${basisColor}">${basisSign}${fmtNum(idx.coc || 7.2, 1)}%</span>
                </div>
                <div class="fut-ic-stat-item">
                  <span>Open Int:</span>
                  <span class="fut-ic-stat-val">${fmtQty(idx.oiContracts || idx.openInterest)}</span>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }

    } catch (err) {
      console.warn('Futures ribbon load error:', err);
    }
  }

  // --- Sub-Tab 1: All F&O Market Watch Matrix ---
  async function loadMatrix() {
    try {
      const q = new URLSearchParams({
        sector: state.sector,
        signal: state.signal,
        search: state.search,
        sortBy: state.sortBy,
        sortDir: state.sortDir
      });

      const res = await fetch(`/api/futures/screener?${q.toString()}`);
      if (!res.ok) return;
      const json = await res.json();
      state.screenerData = json;

      const tb = document.getElementById('futMatrixTableBody');
      const countBadge = document.getElementById('tabCountMatrix');
      if (countBadge) countBadge.textContent = json.count || (json.data ? json.data.length : 0);

      if (!tb || !json.data) return;

      if (!json.data.length) {
        tb.innerHTML = `<tr><td colspan="14" style="text-align:center; padding:32px; color:#64748b; font-size:13px;">No F&O contracts matching filter criteria.</td></tr>`;
        return;
      }

      tb.innerHTML = json.data.map((r, i) => {
        const isPos = (r.priceChangePct ?? 0) >= 0;
        const color = isPos ? '#10b981' : '#ef4444';
        const sign = isPos ? '+' : '';

        const oiChg = r.oiChangePct ?? 0;
        const oiIsPos = oiChg >= 0;
        const oiColor = oiIsPos ? '#38bdf8' : '#f59e0b';
        const oiSign = oiIsPos ? '+' : '';

        const basisVal = r.basis ?? 0;
        const basisSign = basisVal >= 0 ? '+' : '';
        const basisColor = basisVal >= 0 ? '#10b981' : '#ef4444';

        const cocVal = r.coc ?? (r.basisPct ? r.basisPct * 24.3 : 0);
        const cocSign = cocVal >= 0 ? '+' : '';

        const prevPrice = state.lastPrices[r.symbol];
        const changed = prevPrice !== undefined && prevPrice !== r.futPrice;
        const flashCls = changed ? (r.futPrice >= prevPrice ? 'tick-flash-up' : 'tick-flash-down') : '';
        state.lastPrices[r.symbol] = r.futPrice;

        const tickArrow = r.tickDir === 'UP' ? '▲' : '▼';
        const tickColor = r.tickDir === 'UP' ? '#10b981' : '#ef4444';

        // Day range marker %
        const dLow = r.dayLow || (r.futPrice * 0.985);
        const dHigh = r.dayHigh || (r.futPrice * 1.015);
        const rangeSpan = Math.max(1, dHigh - dLow);
        const posPct = Math.min(100, Math.max(0, ((r.futPrice - dLow) / rangeSpan) * 100));

        // MWPL Bar
        const mwpl = r.mwplPct ?? 45.0;
        const mwplColor = mwpl >= 95 ? '#ef4444' : (mwpl >= 80 ? '#f59e0b' : '#10b981');

        return `
          <tr class="${flashCls}" onclick="window.futuresDesk.inspectContract('${r.symbol}')">
            <td style="color:#64748b; font-size:11px;">${i + 1}</td>
            <td>
              <div style="display:flex; align-items:center; gap:6px;">
                <strong style="color:#f8fafc; font-size:12.5px;">${r.symbol}</strong>
                ${r.isIndex ? '<span style="font-size:9px; background:rgba(239,68,68,0.2); color:#f87171; border:1px solid rgba(239,68,68,0.4); padding:1px 4px; border-radius:3px; font-weight:800;">INDEX</span>' : ''}
                <span style="font-size:10px; color:#64748b;">${r.expiry || '26-Mar'}</span>
              </div>
              <div style="font-size:10px; color:#94a3b8; font-family:-apple-system,BlinkMacSystemFont,sans-serif;">${r.name || r.symbol}</div>
            </td>
            <td><span style="font-size:11px; color:#94a3b8; background:#0c1424; padding:2px 6px; border-radius:3px;">${r.sector}</span></td>
            <td style="text-align:right; color:#94a3b8;">₹${fmtNum(r.spotPrice)}</td>
            <td style="text-align:right;">
              <span style="color:${color}; font-weight:800;">₹${fmtNum(r.futPrice)}</span>
              <span style="color:${tickColor}; font-size:9px; margin-left:2px;">${tickArrow}</span>
            </td>
            <td style="text-align:right; color:${color}; font-weight:700;">
              ${sign}${fmtNum(r.priceChangePct)}%
            </td>
            <td style="text-align:right; color:${basisColor}; font-weight:700;">
              ${basisSign}${fmtNum(basisVal, 1)} <span style="font-size:10px; opacity:0.8;">(${basisSign}${fmtNum(r.basisPct, 2)}%)</span>
            </td>
            <td style="text-align:right; color:${basisColor}; font-weight:700;">
              ${cocSign}${fmtNum(cocVal, 1)}%
            </td>
            <td style="text-align:right;">
              <span style="color:#f8fafc; font-weight:700;">${fmtQty(r.oiContracts)}</span>
              <span style="font-size:10px; color:#64748b; display:block;">${fmtNum(r.oiContracts)} lots</span>
            </td>
            <td style="text-align:right; color:${oiColor}; font-weight:700;">
              ${oiSign}${fmtNum(oiChg)}%
            </td>
            <td style="text-align:right; color:#cbd5e1; font-weight:700;">
              ₹${fmtNum(r.oiValueCr, 1)} Cr
            </td>
            <td style="text-align:center;">
              <div class="fut-day-range" style="margin:0 auto;">
                <span>${fmtNum(dLow, 0)}</span>
                <div class="fut-dr-bar-wrap">
                  <div class="fut-dr-marker" style="left:${posPct}%;"></div>
                </div>
                <span>${fmtNum(dHigh, 0)}</span>
              </div>
            </td>
            <td style="text-align:center;">
              ${getSignalBadge(r.buildupCode, r.buildup)}
            </td>
            <td style="text-align:right;">
              <div style="display:flex; align-items:center; justify-content:flex-end; gap:6px;">
                <span style="color:${mwplColor}; font-weight:700;">${fmtNum(mwpl, 1)}%</span>
                <div class="fut-mwpl-pbar" style="width:45px;">
                  <div class="fut-mwpl-pfill" style="width:${Math.min(100, mwpl)}%; background:${mwplColor};"></div>
                </div>
              </div>
            </td>
          </tr>
        `;
      }).join('');

    } catch (err) {
      console.warn('Matrix load error:', err);
    }
  }

  // --- Sub-Tab 2: Buildup Quadrants & Heatmap ---
  async function loadBuildupView() {
    try {
      const [resB, resH] = await Promise.all([
        fetch('/api/futures/buildup'),
        fetch(`/api/futures/heatmap?sector=${state.sector}`)
      ]);

      if (resB.ok) {
        const dataB = await resB.json();
        renderQuadrants(dataB);
      }
      if (resH.ok) {
        const dataH = await resH.json();
        renderHeatmap(dataH);
      }
    } catch (err) {
      console.warn('Buildup view load error:', err);
    }
  }

  function renderQuadrants(data) {
    if (!data) return;

    const renderList = (elId, list, badgeCls) => {
      const el = document.getElementById(elId);
      if (!el) return;
      if (!list || !list.length) {
        el.innerHTML = '<div style="padding:14px; text-align:center; color:#64748b; font-size:11px;">No stocks in this quadrant</div>';
        return;
      }
      el.innerHTML = list.slice(0, 15).map(s => {
        const isPos = s.priceChangePct >= 0;
        const sign = isPos ? '+' : '';
        const color = isPos ? '#10b981' : '#ef4444';
        return `
          <div class="fut-quad-item" onclick="window.futuresDesk.inspectContract('${s.symbol}')">
            <div style="display:flex; align-items:center; gap:6px;">
              <strong style="color:#f8fafc; font-size:12px;">${s.symbol}</strong>
              <span style="font-size:9.5px; color:#64748b;">${s.sector}</span>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="color:${color}; font-weight:700;">₹${fmtNum(s.futPrice)} (${sign}${fmtNum(s.priceChangePct)}%)</span>
              <span style="font-size:10.5px; color:#38bdf8; font-weight:700;">OI: +${fmtNum(s.oiChangePct)}%</span>
            </div>
          </div>
        `;
      }).join('');
    };

    renderList('futQuadLbList', data.longBuildup, 'fut-badge-lb');
    renderList('futQuadSbList', data.shortBuildup, 'fut-badge-sb');
    renderList('futQuadScList', data.shortCovering, 'fut-badge-sc');
    renderList('futQuadLuList', data.longUnwinding, 'fut-badge-lu');

    const cLb = document.getElementById('futQuadLbCount'); if (cLb) cLb.textContent = (data.longBuildup || []).length;
    const cSb = document.getElementById('futQuadSbCount'); if (cSb) cSb.textContent = (data.shortBuildup || []).length;
    const cSc = document.getElementById('futQuadScCount'); if (cSc) cSc.textContent = (data.shortCovering || []).length;
    const cLu = document.getElementById('futQuadLuCount'); if (cLu) cLu.textContent = (data.longUnwinding || []).length;
  }

  function renderHeatmap(data) {
    const grid = document.getElementById('futHeatmapGrid');
    if (!grid || !data || !data.tiles) return;

    grid.innerHTML = data.tiles.map(tile => {
      const isPos = tile.changePct >= 0;
      const absChg = Math.abs(tile.changePct);
      let bg = '#1e293b';
      let border = '#334155';
      if (tile.changePct >= 1.5) { bg = 'rgba(16, 185, 129, 0.4)'; border = '#10b981'; }
      else if (tile.changePct > 0.2) { bg = 'rgba(16, 185, 129, 0.2)'; border = '#059669'; }
      else if (tile.changePct <= -1.5) { bg = 'rgba(239, 68, 68, 0.4)'; border = '#ef4444'; }
      else if (tile.changePct < -0.2) { bg = 'rgba(239, 68, 68, 0.2)'; border = '#dc2626'; }

      return `
        <div class="fut-heatmap-tile" style="background:${bg}; border:1px solid ${border};" onclick="window.futuresDesk.inspectContract('${tile.symbol}')">
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <strong style="font-size:11.5px; color:#ffffff;">${tile.symbol}</strong>
            <span style="font-size:10px; color:${isPos ? '#34d399' : '#f87171'}; font-weight:800;">${isPos ? '+' : ''}${tile.changePct.toFixed(1)}%</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:baseline; font-size:10px; color:#cbd5e1; margin-top:4px;">
            <span>₹${fmtNum(tile.price, 0)}</span>
            <span style="color:#94a3b8;">OI: ${fmtQty(tile.oi)}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- Sub-Tab 3: Index Term Structure & Basis ---
  async function loadIndicesDetailView() {
    try {
      const res = await fetch('/api/futures/screener?sector=INDICES');
      if (!res.ok) return;
      const json = await res.json();
      const container = document.getElementById('futIndicesDetailGrid');
      if (!container || !json.data) return;

      container.innerHTML = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:14px;">
          ${json.data.map(idx => {
            const isPos = idx.priceChangePct >= 0;
            const sign = isPos ? '+' : '';
            const color = isPos ? '#10b981' : '#ef4444';
            const basisSign = idx.basis >= 0 ? '+' : '';
            const basisColor = idx.basis >= 0 ? '#10b981' : '#ef4444';

            return `
              <div class="fut-index-card" style="padding:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                  <div>
                    <h3 style="margin:0; font-size:16px; font-weight:800; color:#f8fafc;">${idx.symbol} FUTURES</h3>
                    <span style="font-size:11px; color:#94a3b8;">${idx.name} &bull; Lot: ${idx.lot}</span>
                  </div>
                  <span class="fut-badge ${isPos ? 'fut-badge-lb' : 'fut-badge-sb'}" style="font-size:11px;">${idx.buildup}</span>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:14px; background:#080c14; padding:10px 14px; border-radius:6px; border:1px solid #1a2538;">
                  <div>
                    <span style="font-size:10px; color:#64748b; display:block; text-transform:uppercase;">Futures LTP</span>
                    <strong style="font-size:20px; color:${color}; font-family:'JetBrains Mono',monospace;">₹${fmtNum(idx.futPrice)}</strong>
                  </div>
                  <div style="text-align:right;">
                    <span style="font-size:10px; color:#64748b; display:block; text-transform:uppercase;">Spot Price</span>
                    <strong style="font-size:16px; color:#cbd5e1; font-family:'JetBrains Mono',monospace;">₹${fmtNum(idx.spotPrice)}</strong>
                  </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:11.5px; border-top:1px solid #1a2538; padding-top:12px;">
                  <div style="display:flex; justify-content:space-between;">
                    <span style="color:#94a3b8;">Cash-Fut Basis:</span>
                    <strong style="color:${basisColor}; font-family:'JetBrains Mono',monospace;">${basisSign}${fmtNum(idx.basis, 1)} pts (${basisSign}${fmtNum(idx.basisPct, 2)}%)</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between;">
                    <span style="color:#94a3b8;">Cost of Carry:</span>
                    <strong style="color:${basisColor}; font-family:'JetBrains Mono',monospace;">${basisSign}${fmtNum(idx.coc, 1)}% p.a.</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between;">
                    <span style="color:#94a3b8;">Open Interest:</span>
                    <strong style="color:#f8fafc; font-family:'JetBrains Mono',monospace;">${fmtQty(idx.oiContracts)} (${fmtNum(idx.oiContracts)} lots)</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between;">
                    <span style="color:#94a3b8;">OI Change:</span>
                    <strong style="color:${idx.oiChangePct >= 0 ? '#38bdf8' : '#f59e0b'}; font-family:'JetBrains Mono',monospace;">${idx.oiChangePct >= 0 ? '+' : ''}${fmtNum(idx.oiChangePct)}%</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between;">
                    <span style="color:#94a3b8;">Rollover %:</span>
                    <strong style="color:#a855f7; font-family:'JetBrains Mono',monospace;">${fmtNum(idx.rolloverPct, 1)}%</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between;">
                    <span style="color:#94a3b8;">VWAP:</span>
                    <strong style="color:#cbd5e1; font-family:'JetBrains Mono',monospace;">₹${fmtNum(idx.vwap)}</strong>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } catch (err) {
      console.warn('Indices detail load error:', err);
    }
  }

  // --- Sub-Tab 4: MWPL & Ban Radar ---
  async function loadMwpl() {
    try {
      const res = await fetch('/api/futures/mwpl');
      if (!res.ok) return;
      const data = await res.json();
      state.mwplData = data;

      // Ban Banner
      const banBox = document.getElementById('futMwplBanBanner');
      if (banBox) {
        if (data.bannedCount > 0) {
          banBox.innerHTML = `
            <div style="background:rgba(239,68,68,0.15); border:1px solid #ef4444; border-radius:8px; padding:12px 16px;">
              <strong style="color:#ef4444; font-size:13px;">🚫 ${data.bannedCount} Securities in Official F&O Ban Period (&gt;95% Limit)</strong>
              <p style="margin:4px 0 8px 0; font-size:11.5px; color:#fca5a5;">Exchange prohibited fresh position creation. Intraday squaring-off permitted only.</p>
              <div style="display:flex; gap:8px; flex-wrap:wrap;">
                ${data.bannedStocks.map(s => `
                  <span class="fut-badge fut-badge-sb" style="font-size:11px; padding:4px 9px;">${s.symbol}: ${s.mwplPct}% MWPL</span>
                `).join('')}
              </div>
            </div>
          `;
        } else {
          banBox.innerHTML = `
            <div style="background:rgba(16,185,129,0.1); border:1px solid #10b981; border-radius:8px; padding:10px 14px; font-size:12px; color:#34d399;">
              ✅ Zero Securities currently in F&O Ban. All 200 contracts open for fresh trading.
            </div>
          `;
        }
      }

      // Warning Alert List
      const alertBox = document.getElementById('futMwplAlertList');
      if (alertBox && data.alertStocks) {
        alertBox.innerHTML = data.alertStocks.map(s => `
          <div style="background:#0c1322; border:1px solid #f59e0b; border-radius:6px; padding:10px 12px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <strong style="color:#f8fafc; font-size:13px;">${s.symbol}</strong>
              <span style="color:#f59e0b; font-weight:800; font-family:'JetBrains Mono',monospace;">${s.mwplPct}%</span>
            </div>
            <div style="font-size:10.5px; color:#94a3b8; margin:4px 0;">Lot: ${s.lot} &bull; Headroom: ~${Math.max(50, Math.round((95 - s.mwplPct) * 120))} lots</div>
            <div class="fut-mwpl-pbar" style="margin-top:6px;">
              <div class="fut-mwpl-pfill" style="width:${s.mwplPct}%; background:#f59e0b;"></div>
            </div>
          </div>
        `).join('');
      }

      // Full MWPL Table
      const tb = document.getElementById('futMwplTableBody');
      if (tb && data.allStocks) {
        tb.innerHTML = data.allStocks.map((s, i) => {
          const col = s.mwplPct >= 95 ? '#ef4444' : (s.mwplPct >= 80 ? '#f59e0b' : '#10b981');
          return `
            <tr>
              <td style="color:#64748b;">${i + 1}</td>
              <td><strong style="color:#f8fafc;">${s.symbol}</strong></td>
              <td><span style="color:#94a3b8; font-size:11px;">${s.sector}</span></td>
              <td style="text-align:right;">₹${fmtNum(s.price)}</td>
              <td style="text-align:right;">${fmtQty(s.currentOi)}</td>
              <td style="text-align:right; color:#94a3b8;">${fmtQty(s.limitOi)}</td>
              <td style="text-align:right; color:${col}; font-weight:800;">${fmtNum(s.mwplPct, 1)}%</td>
              <td>
                <div class="fut-mwpl-pbar">
                  <div class="fut-mwpl-pfill" style="width:${Math.min(100, s.mwplPct)}%; background:${col};"></div>
                </div>
              </td>
              <td style="text-align:center;">
                <span class="fut-badge ${s.status === 'BANNED' ? 'fut-badge-sb' : (s.status === 'ALERT' ? 'fut-badge-lu' : 'fut-badge-lb')}">${s.status}</span>
              </td>
            </tr>
          `;
        }).join('');
      }

    } catch (err) {
      console.warn('MWPL load error:', err);
    }
  }

  // --- Auto-Refresh Engine ---
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

  function filterBySymbol(sym) {
    const sInput = document.getElementById('futSearchInput');
    if (sInput) {
      sInput.value = sym;
      state.search = sym.toUpperCase();
      switchSubTab('matrix');
    }
  }

  function inspectContract(sym) {
    // Quick search focus or popup
    filterBySymbol(sym);
  }

  // --- Initialization ---
  function init() {
    if (state.initialized) {
      refreshCurrentSubTab();
      return;
    }
    state.initialized = true;

    // Subtab Button Listeners
    document.querySelectorAll('.fut-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab) switchSubTab(tab);
      });
    });

    // Sector Filter Pills
    document.querySelectorAll('.fut-sec-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.fut-sec-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.sector = pill.dataset.sector || 'ALL';
        refreshCurrentSubTab();
      });
    });

    // Signal Filter Pills
    document.querySelectorAll('.fut-sig-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.fut-sig-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.signal = pill.dataset.signal || 'ALL';
        refreshCurrentSubTab();
      });
    });

    // Search Input Listener
    const searchInput = document.getElementById('futSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.search = e.target.value.trim().toUpperCase();
        if (state.activeSubTab === 'matrix') {
          loadMatrix();
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

    // Sorting in Matrix Table
    document.querySelectorAll('#futMatrixTable th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.dataset.sort;
        if (state.sortBy === col) {
          state.sortDir = state.sortDir === 'desc' ? 'asc' : 'desc';
        } else {
          state.sortBy = col;
          state.sortDir = 'desc';
        }
        loadMatrix();
      });
    });

    // Start 5s Live Auto-Refresh Immediately
    setAutoRefresh(5);

    // Initial View
    switchSubTab(state.activeSubTab);
  }

  // Export to global scope
  window.futuresDesk = {
    init,
    switchSubTab,
    refreshCurrentSubTab,
    filterBySymbol,
    inspectContract,
    loadBenchmarkRibbon,
    loadMatrix,
    loadBuildupView,
    loadIndicesDetailView,
    loadMwpl
  };

  // Auto-init on load if panel is active
  document.addEventListener('DOMContentLoaded', () => {
    const p = document.getElementById('panelFutures');
    if (p && (p.classList.contains('active') || p.style.display !== 'none')) {
      init();
    }
  });
})();
