/**
 * PAGE 2 CONTROLLER: DEFINEDGE PRO SUITE + NIFTYTRADER PRO SUITE
 * Fully Supports Night Mode (Dark Obsidian) & White Mode (Crisp Institutional)
 */

(function () {
  "use strict";

  // State
  let currentSuite = "definedge"; // 'definedge' or 'niftytrader'
  let currentDefinedgeTool = "viewOpenInterest";
  let currentNtTool = "ntViewPcr";
  let currentSymbol = "nifty50";
  let currentExchange = "NSE";
  let ntPcrMode = "pcr"; // 'pcr' or 'chg'
  let isLightMode = false;
  let cachedNtSummary = null;
  let currentToolsSubView = "global"; // 'global' or 'straddle'
  let currentGmCategory = "all";
  let currentGmView = "cards"; // 'cards' or 'table'
  let gmSearchQuery = "";
  let gmAutoRefreshTimer = null;
  let gmPreviousPrices = {};
  let gmCachedData = null;

  // Chart Cache
  const charts = {};

  function isLight() {
    return document.body.classList.contains("theme-light");
  }

  function getThemeColors() {
    const light = isLight();
    return {
      bg: light ? "#ffffff" : "#111a2e",
      text: light ? "#64748b" : "#94a3b8",
      textBright: light ? "#0f172a" : "#ffffff",
      grid: light ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)",
      teal: light ? "#0284c7" : "#00e5ff",
      green: light ? "#059669" : "#10b981",
      red: light ? "#e11d48" : "#f43f5e",
      amber: light ? "#d97706" : "#f59e0b",
      blue: light ? "#0284c7" : "#38bdf8",
      purple: light ? "#7c3aed" : "#a855f7"
    };
  }

  // ========================================================================
  // THEME MANAGEMENT (Night Mode / White Mode)
  // ========================================================================
  function initTheme() {
    const saved = localStorage.getItem("p2_theme") || "dark";
    if (saved === "light") {
      applyTheme(true);
    } else {
      applyTheme(false);
    }

    const btn = document.getElementById("p2ThemeToggleBtn");
    if (btn) {
      btn.addEventListener("click", () => {
        const next = !isLight();
        applyTheme(next);
        localStorage.setItem("p2_theme", next ? "light" : "dark");
        // Re-render active view to refresh canvas colors
        refreshActiveView();
      });
    }
  }

  function applyTheme(light) {
    isLightMode = light;
    if (light) {
      document.body.classList.add("theme-light");
      document.getElementById("p2ThemeIcon").textContent = "☀️";
      document.getElementById("p2ThemeLabel").textContent = "White Mode";
    } else {
      document.body.classList.remove("theme-light");
      document.getElementById("p2ThemeIcon").textContent = "🌙";
      document.getElementById("p2ThemeLabel").textContent = "Night Mode";
    }
    if (window.AuthService && window.AuthService.syncState) {
      window.AuthService.syncState({ theme: light ? "light" : "dark" });
    }
  }

  // ========================================================================
  // INITIALIZATION & SUITE SWITCHING
  // ========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    setupSuiteSwitching();
    setupDefinedgeDropdown();
    setupNiftyTraderNav();
    setupGlobalControls();
    setupStraddleControls();
    setupGlobalMarketsControls();
    setupPage2OpstraPcrControls();
    setupFiiDiiControls();
    initBreadthContribution();

    // Default Load
    loadCurrentSuite();
  });

  function setupSuiteSwitching() {
    const defBtn = document.getElementById("p2SuiteDefinedgeBtn");
    const ntBtn = document.getElementById("p2SuiteNiftyTraderBtn");
    const toolsBtn = document.getElementById("p2SuiteToolsBtn");
    const fiiBtn = document.getElementById("p2SuiteFiiDiiBtn");
    const contribBtn = document.getElementById("p2SuiteContributionBtn");
    const defSection = document.getElementById("p2SectionDefinedge");
    const ntSection = document.getElementById("p2SectionNiftyTrader");
    const toolsSection = document.getElementById("p2SectionTools");
    const fiiSection = document.getElementById("p2SectionFiiDii");
    const contribSection = document.getElementById("p2SectionBreadthContribution");
    const defDropdown = document.getElementById("p2DefinedgeDropdownContainer");

    function activateSuite(suiteKey) {
      currentSuite = suiteKey;
      if (defBtn) defBtn.classList.toggle("active", suiteKey === "definedge");
      if (ntBtn) ntBtn.classList.toggle("active", suiteKey === "niftytrader");
      if (toolsBtn) toolsBtn.classList.toggle("active", suiteKey === "tools");
      if (fiiBtn) fiiBtn.classList.toggle("active", suiteKey === "fiidii");
      if (contribBtn) contribBtn.classList.toggle("active", suiteKey === "contribution");

      if (defSection) defSection.style.display = suiteKey === "definedge" ? "block" : "none";
      if (ntSection) ntSection.style.display = suiteKey === "niftytrader" ? "block" : "none";
      if (toolsSection) toolsSection.style.display = suiteKey === "tools" ? "block" : "none";
      if (fiiSection) fiiSection.style.display = suiteKey === "fiidii" ? "block" : "none";
      if (contribSection) contribSection.style.display = suiteKey === "contribution" ? "block" : "none";
      if (defDropdown) defDropdown.style.display = suiteKey === "definedge" ? "inline-block" : "none";

      if (window.AuthService && window.AuthService.syncState) {
        window.AuthService.syncState({ page2Suite: suiteKey });
      }
      loadCurrentSuite();
    }

    if (defBtn) defBtn.addEventListener("click", () => activateSuite("definedge"));
    if (ntBtn) ntBtn.addEventListener("click", () => activateSuite("niftytrader"));
    if (toolsBtn) toolsBtn.addEventListener("click", () => activateSuite("tools"));
    if (fiiBtn) fiiBtn.addEventListener("click", () => activateSuite("fiidii"));
    if (contribBtn) contribBtn.addEventListener("click", () => activateSuite("contribution"));
  }

  function setupDefinedgeDropdown() {
    const btn = document.getElementById("p2OiMenuBtn");
    const drop = document.getElementById("p2OiDropdown");
    const items = document.querySelectorAll(".page2-dropdown-item");

    if (btn && drop) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        drop.classList.toggle("show");
        btn.classList.toggle("active");
      });

      document.addEventListener("click", () => {
        drop.classList.remove("show");
        btn.classList.remove("active");
      });
    }

    items.forEach((item) => {
      item.addEventListener("click", () => {
        items.forEach((i) => i.classList.remove("active"));
        item.classList.add("active");
        const tool = item.getAttribute("data-tool");
        currentDefinedgeTool = tool;
        if (window.AuthService && window.AuthService.syncState) {
          window.AuthService.syncState({ page2DefinedgeTool: tool });
        }

        document.querySelectorAll("#p2SectionDefinedge .page2-view-panel").forEach((p) => {
          p.classList.remove("active");
        });
        const target = document.getElementById(tool);
        if (target) target.classList.add("active");

        if (drop && btn) {
          drop.classList.remove("show");
          btn.classList.remove("active");
        }

        loadDefinedgeTool(tool);
      });
    });
  }

  function setupNiftyTraderNav() {
    const btns = document.querySelectorAll(".nt-nav-btn");
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const tool = btn.getAttribute("data-nt-tool");
        currentNtTool = tool;
        if (window.AuthService && window.AuthService.syncState) {
          window.AuthService.syncState({ page2NtTool: tool });
        }

        document.querySelectorAll("#p2SectionNiftyTrader .nt-view-panel").forEach((p) => {
          p.classList.remove("active");
        });
        const target = document.getElementById(tool);
        if (target) target.classList.add("active");

        loadNiftyTraderTool(tool);
      });
    });

    // Radio toggle for PCR vs Change in OI PCR
    const radios = document.querySelectorAll('input[name="ntPcrMode"]');
    radios.forEach((r) => {
      r.addEventListener("change", (e) => {
        ntPcrMode = e.target.value;
        loadNiftyTraderTool("ntViewPcr");
      });
    });

    // Exchange selector
    const exchBtns = document.querySelectorAll(".nt-exch-btn");
    exchBtns.forEach((b) => {
      b.addEventListener("click", () => {
        exchBtns.forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        currentExchange = b.getAttribute("data-exch");
        loadNiftyTraderTool("ntViewOptionChain");
      });
    });

    // CSV Download
    const dlBtn = document.getElementById("ntDownloadPcrCsv");
    if (dlBtn) {
      dlBtn.addEventListener("click", downloadPcrCsv);
    }
  }

  function setupGlobalControls() {
    const sel = document.getElementById("p2IndexSelect");
    const ref = document.getElementById("p2RefreshBtn");

    if (sel) {
      sel.addEventListener("change", (e) => {
        currentSymbol = e.target.value;
        if (window.AuthService && window.AuthService.syncState) {
          window.AuthService.syncState({ page2Index: currentSymbol });
        }
        refreshActiveView();
      });
    }

    if (ref) {
      ref.addEventListener("click", () => {
        refreshActiveView();
      });
    }
  }

  function refreshActiveView() {
    if (currentSuite === "definedge") {
      loadDefinedgeTool(currentDefinedgeTool);
    } else if (currentSuite === "niftytrader") {
      loadNiftyTraderSummary();
      loadNiftyTraderTool(currentNtTool);
    } else if (currentSuite === "tools") {
      if (currentToolsSubView === "straddle") {
        loadStraddleTool();
      } else {
        loadGlobalMarketsSuite();
      }
    } else if (currentSuite === "fiidii") {
      loadFiiDiiSuite();
    } else if (currentSuite === "contribution") {
      loadBreadthContributionSuite(currentContribIndex);
    }
  }

  function loadCurrentSuite() {
    if (currentSuite === "definedge") {
      loadDefinedgeTool(currentDefinedgeTool);
    } else if (currentSuite === "niftytrader") {
      loadNiftyTraderSummary();
      loadNiftyTraderTool(currentNtTool);
    } else if (currentSuite === "tools") {
      if (currentToolsSubView === "straddle") {
        loadStraddleTool();
      } else {
        loadGlobalMarketsSuite();
      }
    } else if (currentSuite === "fiidii") {
      loadFiiDiiSuite();
    } else if (currentSuite === "contribution") {
      loadBreadthContributionSuite(currentContribIndex);
    }
  }

  // ========================================================================
  // DEFINEDGE SUITE DATA FETCHER & RENDERERS
  // ========================================================================
  const DEFINEDGE_TOOL_MAP = {
    viewOpenInterest: "open-interest",
    viewTotalOi: "total-oi",
    viewHistoricalToi: "historical-toi",
    viewMultiToi: "multi-toi",
    viewOiDynamics: "oi-dynamics",
    viewOiCharts: "oi-charts",
    viewOptionsBuildup: "options-buildup",
    viewPcr: "pcr",
    viewStraddles: "straddles",
    viewOptionChain: "option-chain",
    viewUnusualActivity: "unusual-activity",
    viewTrividh: "trividh",
    viewOiCrossover: "oi-crossover",
    viewOptionsActivity: "options-activity"
  };

  async function fetchOiApi(ep) {
    try {
      const res = await fetch(`/api/oi-suite/${ep}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index: currentSymbol, symbol: currentSymbol })
      });
      return await res.json();
    } catch (err) {
      console.error(`Error fetching /api/oi-suite/${ep}:`, err);
      return { ok: false };
    }
  }

  async function loadDefinedgeTool(toolId) {
    const ep = DEFINEDGE_TOOL_MAP[toolId];
    if (!ep) return;
    const data = await fetchOiApi(ep);
    if (!data || !data.ok) return;

    if (data.spot) {
      document.getElementById("p2SpotBadge").textContent = `SPOT: ₹${Number(data.spot).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
    }

    if (toolId === "viewOpenInterest") renderDefinedgeOpenInterest(data);
    else if (toolId === "viewTotalOi") renderDefinedgeTotalOi(data);
    else if (toolId === "viewHistoricalToi") renderDefinedgeHistoricalToi(data);
    else if (toolId === "viewMultiToi") renderDefinedgeMultiToi(data);
    else if (toolId === "viewOiDynamics") renderDefinedgeOiDynamics(data);
    else if (toolId === "viewOiCharts") renderDefinedgeOiCharts(data);
    else if (toolId === "viewOptionsBuildup") renderDefinedgeBuildup(data);
    else if (toolId === "viewPcr") renderDefinedgePcr(data);
    else if (toolId === "viewStraddles") renderDefinedgeStraddles(data);
    else if (toolId === "viewOptionChain") renderDefinedgeOptionChain(data);
    else if (toolId === "viewUnusualActivity") renderDefinedgeUoa(data);
    else if (toolId === "viewTrividh") renderDefinedgeTrividh(data);
    else if (toolId === "viewOiCrossover") renderDefinedgeCrossover(data);
    else if (toolId === "viewOptionsActivity") renderDefinedgeActivity(data);
  }

  function renderDefinedgeOpenInterest(data) {
    const cards = document.getElementById("oiMetricCards");
    cards.innerHTML = `
      <div class="p2-metric-box">
        <div class="p2-metric-label">Atm Strike</div>
        <div class="p2-metric-val" style="color:var(--p2-teal-light)">${data.atmStrike}</div>
        <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Spot: ₹${data.spot}</div>
      </div>
      <div class="p2-metric-box">
        <div class="p2-metric-label">Max Call Wall</div>
        <div class="p2-metric-val text-call">${data.maxCallStrike || "--"}</div>
        <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Major Resistance</div>
      </div>
      <div class="p2-metric-box">
        <div class="p2-metric-label">Max Put Wall</div>
        <div class="p2-metric-val text-put">${data.maxPutStrike || "--"}</div>
        <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Major Support</div>
      </div>
      <div class="p2-metric-box">
        <div class="p2-metric-label">Net Delta OI</div>
        <div class="p2-metric-val ${data.netDeltaOi >= 0 ? 'text-put' : 'text-call'}">${Number(data.netDeltaOi || 0).toLocaleString()}</div>
        <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Institutional Bias</div>
      </div>
    `;

    const strikes = data.strikes || [];
    renderDualBarChart("chartOiBars", strikes.map(s => s.strike), strikes.map(s => s.ceOi), strikes.map(s => s.peOi), "Call OI (Lots)", "Put OI (Lots)");

    const tbody = document.querySelector("#tableOiData tbody");
    tbody.innerHTML = strikes.map(s => `
      <tr class="${s.isAtm ? 'atm-row' : ''}">
        <td class="text-call">${Number(s.ceOi).toLocaleString()}</td>
        <td class="${s.ceChgOi >= 0 ? 'text-call' : 'text-put'}">${s.ceChgOi >= 0 ? '+' : ''}${Number(s.ceChgOi).toLocaleString()}</td>
        <td>₹${s.ceLtp}</td>
        <td class="text-center font-bold" style="color:var(--p2-teal-light);">${s.strike}${s.isAtm ? ' (ATM)' : ''}</td>
        <td>₹${s.peLtp}</td>
        <td class="${s.peChgOi >= 0 ? 'text-put' : 'text-call'}">${s.peChgOi >= 0 ? '+' : ''}${Number(s.peChgOi).toLocaleString()}</td>
        <td class="text-put">${Number(s.peOi).toLocaleString()}</td>
        <td><span class="p2-badge ${s.peOi > s.ceOi ? 'p2-badge-green' : 'p2-badge-red'}">${s.peOi > s.ceOi ? 'Put Dominant' : 'Call Dominant'}</span></td>
      </tr>
    `).join("");
  }

  function renderDefinedgeTotalOi(data) {
    const cards = document.getElementById("toiMetricCards");
    cards.innerHTML = `
      <div class="p2-metric-box">
        <div class="p2-metric-label">Total Call OI</div>
        <div class="p2-metric-val text-call">${Number(data.totalCallOi || 0).toLocaleString()}</div>
        <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Call Cushion: ${data.callCushionPct || 0}%</div>
      </div>
      <div class="p2-metric-box">
        <div class="p2-metric-label">Total Put OI</div>
        <div class="p2-metric-val text-put">${Number(data.totalPutOi || 0).toLocaleString()}</div>
        <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Put Cushion: ${data.putCushionPct || 0}%</div>
      </div>
      <div class="p2-metric-box">
        <div class="p2-metric-label">Total OI PCR</div>
        <div class="p2-metric-val ${data.pcr >= 1.0 ? 'text-put' : 'text-call'}">${data.pcr || 1.0}</div>
        <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Put / Call Ratio</div>
      </div>
      <div class="p2-metric-box">
        <div class="p2-metric-label">Dominant Position</div>
        <div class="p2-metric-val" style="color:var(--p2-teal-light)">${data.bias || "Neutral"}</div>
        <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Confidence: ${data.confidenceScore || 75}%</div>
      </div>
    `;

    renderHorizontalCushionChart("chartToiGauge", Number(data.callCushionPct || 50), Number(data.putCushionPct || 50));
  }

  function renderDefinedgeHistoricalToi(data) {
    const points = data.timeline || [];
    renderMultiLineChart("chartHistoricalToi", points.map(p => p.time), [
      { label: "Total Call OI", data: points.map(p => p.callOi), color: getThemeColors().red },
      { label: "Total Put OI", data: points.map(p => p.putOi), color: getThemeColors().green }
    ]);
  }

  function renderDefinedgeMultiToi(data) {
    const strikes = data.selectedStrikes || [];
    const points = data.timeline || [];
    const colors = [getThemeColors().teal, getThemeColors().amber, getThemeColors().green, getThemeColors().red, getThemeColors().purple];
    const series = strikes.map((s, idx) => ({
      label: `Strike ${s}`,
      data: points.map(p => p.strikeOis ? p.strikeOis[s] || 0 : 0),
      color: colors[idx % colors.length]
    }));
    renderMultiLineChart("chartMultiToi", points.map(p => p.time), series);
  }

  function renderDefinedgeOiDynamics(data) {
    const points = data.velocityPoints || [];
    renderDualBarChart("chartOiDynamics", points.map(p => p.time), points.map(p => p.callVelocity), points.map(p => p.putVelocity), "Call Writing Velocity", "Put Writing Velocity");
  }

  function renderDefinedgeOiCharts(data) {
    const points = data.priceCandles || [];
    const callWall = data.majorCallWall;
    const putWall = data.majorPutWall;
    renderPriceWithWallsChart("chartOiWalls", points.map(p => p.time), points.map(p => p.close), callWall, putWall);
  }

  function renderDefinedgeBuildup(data) {
    const summary = data.summary || {};
    const cards = document.getElementById("buildupSummaryCards");
    cards.innerHTML = `
      <div class="p2-metric-box">
        <div class="p2-metric-label">Long Buildup</div>
        <div class="p2-metric-val text-put">${summary.longBuildup || 0}</div>
        <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Bullish Expansion</div>
      </div>
      <div class="p2-metric-box">
        <div class="p2-metric-label">Short Buildup</div>
        <div class="p2-metric-val text-call">${summary.shortBuildup || 0}</div>
        <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Bearish Writing</div>
      </div>
      <div class="p2-metric-box">
        <div class="p2-metric-label">Short Covering</div>
        <div class="p2-metric-val" style="color:var(--p2-blue)">${summary.shortCovering || 0}</div>
        <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Shorts Exiting</div>
      </div>
      <div class="p2-metric-box">
        <div class="p2-metric-label">Long Unwinding</div>
        <div class="p2-metric-val text-amber">${summary.longUnwinding || 0}</div>
        <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Profit Taking</div>
      </div>
    `;

    const strikes = data.strikes || [];
    const tbody = document.querySelector("#tableBuildupData tbody");
    tbody.innerHTML = strikes.map(s => `
      <tr class="${s.isAtm ? 'atm-row' : ''}">
        <td><span class="p2-badge ${getBuildupBadgeClass(s.ceBuildup)}">${s.ceBuildup}</span></td>
        <td class="${s.ceChgOi >= 0 ? 'text-call' : 'text-put'}">${s.ceChgOi >= 0 ? '+' : ''}${Number(s.ceChgOi).toLocaleString()}</td>
        <td>₹${s.ceLtp}</td>
        <td class="text-center font-bold" style="color:var(--p2-teal-light);">${s.strike}</td>
        <td>₹${s.peLtp}</td>
        <td class="${s.peChgOi >= 0 ? 'text-put' : 'text-call'}">${s.peChgOi >= 0 ? '+' : ''}${Number(s.peChgOi).toLocaleString()}</td>
        <td><span class="p2-badge ${getBuildupBadgeClass(s.peBuildup)}">${s.peBuildup}</span></td>
      </tr>
    `).join("");
  }

  function getBuildupBadgeClass(b) {
    if (b === "Long Buildup") return "p2-badge-green";
    if (b === "Short Buildup") return "p2-badge-red";
    if (b === "Short Covering") return "p2-badge-teal";
    return "p2-badge-red";
  }

  let p2PcrSeries = [];
  let p2PcrGeometry = null;
  let p2PcrHoverIndex = null;
  let p2PcrDays = 250;

  function renderDefinedgePcr(data) {
    const cards = document.getElementById("pcrMetricCards");
    if (cards) {
      cards.innerHTML = `
        <div class="p2-metric-box">
          <div class="p2-metric-label">Total OI PCR</div>
          <div class="p2-metric-val ${data.oiPcr >= 1.0 ? 'text-put' : 'text-call'}">${data.oiPcr}</div>
          <div class="p2-metric-sub" style="color:var(--p2-text-muted)">${data.sentiment || "Neutral"}</div>
        </div>
        <div class="p2-metric-box">
          <div class="p2-metric-label">Volume PCR</div>
          <div class="p2-metric-val">${data.volumePcr || 1.0}</div>
          <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Traded Volume Bias</div>
        </div>
        <div class="p2-metric-box">
          <div class="p2-metric-label">Overbought Zone</div>
          <div class="p2-metric-val text-call">&gt; 1.40</div>
          <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Mean Reversion Alert</div>
        </div>
        <div class="p2-metric-box">
          <div class="p2-metric-label">Oversold Zone</div>
          <div class="p2-metric-val text-put">&lt; 0.70</div>
          <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Support Bounce Alert</div>
        </div>
      `;
    }

    // Set Symbol in Opstra Chart Header
    const symTitle = document.getElementById("p2PcrSymbolTitle");
    if (symTitle) {
      symTitle.textContent = (currentSymbol || "NIFTY").toUpperCase().replace("50", "");
    }

    // Draw Opstra Synchronized Dual Subplot Chart
    if (data.opstraSeries && data.opstraSeries.length) {
      p2PcrSeries = data.opstraSeries;
      drawPage2OpstraPcr(p2PcrSeries);
    }

    const timeline = data.timeline || [];
    renderSingleLineChart("chartPcrCurve", timeline.map(t => t.time), timeline.map(t => t.pcr), "Intraday PCR Curve", getThemeColors().teal);
  }

  function drawPage2OpstraPcr(series) {
    const cPrice = document.getElementById("p2PcrPriceCanvas");
    const cPcr = document.getElementById("p2PcrPcrCanvas");
    if (!cPrice || !cPcr || !series || !series.length) return;

    const isDark = !isLight();
    const scale = window.devicePixelRatio || 1;

    // 1. Setup Price Canvas
    const rectP = cPrice.getBoundingClientRect();
    const w = rectP.width > 50 ? rectP.width : (cPrice.parentElement?.clientWidth || 900);
    const hP = 250;
    if (cPrice.width !== Math.round(w * scale) || cPrice.height !== Math.round(hP * scale)) {
      cPrice.width = Math.round(w * scale);
      cPrice.height = Math.round(hP * scale);
    }
    const ctxP = cPrice.getContext("2d");
    ctxP.setTransform(scale, 0, 0, scale, 0, 0);

    // 2. Setup PCR Canvas
    const hR = 210;
    if (cPcr.width !== Math.round(w * scale) || cPcr.height !== Math.round(hR * scale)) {
      cPcr.width = Math.round(w * scale);
      cPcr.height = Math.round(hR * scale);
    }
    const ctxR = cPcr.getContext("2d");
    ctxR.setTransform(scale, 0, 0, scale, 0, 0);

    const pad = { top: 26, right: 35, bottom: 20, left: 62 };
    const plotW = w - pad.left - pad.right;
    const plotHP = hP - pad.top - pad.bottom;
    const plotHR = hR - pad.top - 28;
    if (plotW <= 10 || plotHP <= 10 || plotHR <= 10) return;

    const xFor = idx => pad.left + (idx / Math.max(1, series.length - 1)) * plotW;

    // -------------------------------------------------------------
    // TOP SUBPLOT: STOCK PRICE (Olive Green Area Chart)
    // -------------------------------------------------------------
    ctxP.clearRect(0, 0, w, hP);
    ctxP.fillStyle = isDark ? "#090d16" : "#fbfbfa";
    ctxP.fillRect(0, 0, w, hP);

    const spotVals = series.map(s => Number(s.spot));
    const minSpot = Math.min(...spotVals);
    const maxSpot = Math.max(...spotVals);
    const spotBuffer = Math.max(25, (maxSpot - minSpot) * 0.08);
    const spotMin = minSpot - spotBuffer;
    const spotMax = maxSpot + spotBuffer;
    const yForSpot = val => pad.top + plotHP - ((val - spotMin) / (spotMax - spotMin)) * plotHP;

    // Axis Title "Price"
    ctxP.fillStyle = isDark ? "#94a3b8" : "#475569";
    ctxP.font = "bold 10px 'JetBrains Mono', monospace";
    ctxP.textAlign = "left";
    ctxP.fillText("Price", pad.left - 50, pad.top - 10);

    // Horizontal Grid Lines & Price Labels
    ctxP.strokeStyle = isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(0, 0, 0, 0.06)";
    ctxP.lineWidth = 0.8;
    ctxP.setLineDash([3, 3]);

    const numGridP = 5;
    for (let i = 0; i <= numGridP; i++) {
      const y = pad.top + (i / numGridP) * plotHP;
      ctxP.beginPath();
      ctxP.moveTo(pad.left, y);
      ctxP.lineTo(w - pad.right, y);
      ctxP.stroke();

      const spVal = spotMax - (i / numGridP) * (spotMax - spotMin);
      ctxP.fillStyle = isDark ? "#94a3b8" : "#475569";
      ctxP.font = "10px 'JetBrains Mono', monospace";
      ctxP.textAlign = "right";
      ctxP.textBaseline = "middle";
      ctxP.fillText(`${Math.round(spVal)}`, pad.left - 8, y);
    }
    ctxP.setLineDash([]);

    // Draw Olive Green Area Gradient
    const areaGrad = ctxP.createLinearGradient(0, pad.top, 0, pad.top + plotHP);
    areaGrad.addColorStop(0, "rgba(91, 126, 69, 0.42)");
    areaGrad.addColorStop(1, isDark ? "rgba(91, 126, 69, 0.05)" : "rgba(91, 126, 69, 0.12)");

    ctxP.beginPath();
    series.forEach((pt, idx) => {
      const x = xFor(idx);
      const y = yForSpot(pt.spot);
      if (idx === 0) ctxP.moveTo(x, y);
      else ctxP.lineTo(x, y);
    });
    ctxP.lineTo(xFor(series.length - 1), pad.top + plotHP);
    ctxP.lineTo(xFor(0), pad.top + plotHP);
    ctxP.closePath();
    ctxP.fillStyle = areaGrad;
    ctxP.fill();

    // Draw Olive Green Main Line
    ctxP.beginPath();
    ctxP.strokeStyle = "#5b7e45";
    ctxP.lineWidth = 2.0;
    series.forEach((pt, idx) => {
      const x = xFor(idx);
      const y = yForSpot(pt.spot);
      if (idx === 0) ctxP.moveTo(x, y);
      else ctxP.lineTo(x, y);
    });
    ctxP.stroke();

    // -------------------------------------------------------------
    // BOTTOM SUBPLOT: PCR & WPCR (Red PCR + Blue WPCR Chart)
    // -------------------------------------------------------------
    ctxR.clearRect(0, 0, w, hR);
    ctxR.fillStyle = isDark ? "#090d16" : "#fbfbfa";
    ctxR.fillRect(0, 0, w, hR);

    // Compute PCR & WPCR Scales
    const pcrVals = series.map(s => Number(s.pcr || 1.016));
    const wpcrVals = series.map(s => Number(s.wpcr || 0.603));
    const maxWpcr = Math.max(...wpcrVals, ...pcrVals);
    const pcrMax = maxWpcr > 15 ? 48 : (maxWpcr > 6 ? 12 : (maxWpcr > 3 ? 5 : 2.5));
    const yForPcr = val => pad.top + plotHR - (Math.min(pcrMax, Math.max(0, val)) / pcrMax) * plotHR;

    // Axis Title "PCR"
    ctxR.fillStyle = isDark ? "#94a3b8" : "#475569";
    ctxR.font = "bold 10px 'JetBrains Mono', monospace";
    ctxR.textAlign = "left";
    ctxR.fillText("PCR", pad.left - 50, pad.top - 10);

    // Horizontal Grid Lines & PCR Labels
    ctxR.strokeStyle = isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(0, 0, 0, 0.06)";
    ctxR.lineWidth = 0.8;
    ctxR.setLineDash([3, 3]);

    const numGridR = 4;
    for (let i = 0; i <= numGridR; i++) {
      const y = pad.top + (i / numGridR) * plotHR;
      ctxR.beginPath();
      ctxR.moveTo(pad.left, y);
      ctxR.lineTo(w - pad.right, y);
      ctxR.stroke();

      const val = pcrMax - (i / numGridR) * pcrMax;
      ctxR.fillStyle = isDark ? "#94a3b8" : "#475569";
      ctxR.font = "10px 'JetBrains Mono', monospace";
      ctxR.textAlign = "right";
      ctxR.textBaseline = "middle";
      ctxR.fillText(val >= 10 ? `${Math.round(val)}` : `${val.toFixed(1)}`, pad.left - 8, y);
    }
    ctxR.setLineDash([]);

    // 1. Draw Red Line: Standard PCR (Smooth)
    ctxR.beginPath();
    ctxR.strokeStyle = "#dc2626";
    ctxR.lineWidth = 1.8;
    series.forEach((pt, idx) => {
      const x = xFor(idx);
      const y = yForPcr(pt.pcr || 1.016);
      if (idx === 0) ctxR.moveTo(x, y);
      else ctxR.lineTo(x, y);
    });
    ctxR.stroke();

    // 2. Draw Blue Line: WPCR (Weighted with spikes)
    ctxR.beginPath();
    ctxR.strokeStyle = "#1d4ed8";
    ctxR.lineWidth = 2.0;
    series.forEach((pt, idx) => {
      const x = xFor(idx);
      const y = yForPcr(pt.wpcr || 0.603);
      if (idx === 0) ctxR.moveTo(x, y);
      else ctxR.lineTo(x, y);
    });
    ctxR.stroke();

    // Bottom Time / Date Labels
    ctxR.fillStyle = isDark ? "#94a3b8" : "#64748b";
    ctxR.font = "9.5px 'JetBrains Mono', monospace";
    ctxR.textAlign = "center";
    ctxR.textBaseline = "top";
    const numLabels = Math.min(8, series.length);
    for (let i = 0; i < numLabels; i++) {
      const idx = Math.floor((i / (numLabels - 1)) * (series.length - 1));
      const pt = series[idx];
      if (pt) {
        ctxR.fillText(pt.time, xFor(idx), pad.top + plotHR + 6);
      }
    }

    // Store Geometry for Linked Crosshairs
    p2PcrGeometry = {
      pad, w, hP, hR, plotW, plotHP, plotHR, series, xFor, yForSpot, yForPcr
    };

    // Draw Synchronized Crosshair if Hovering
    if (p2PcrHoverIndex !== null && series[p2PcrHoverIndex]) {
      drawPage2SynchronizedCrosshairs(p2PcrHoverIndex);
    }
  }

  function drawPage2SynchronizedCrosshairs(idx) {
    const cPrice = document.getElementById("p2PcrPriceCanvas");
    const cPcr = document.getElementById("p2PcrPcrCanvas");
    if (!p2PcrGeometry || !cPrice || !cPcr) return;
    const { pad, series, xFor, yForSpot, yForPcr, plotHP, plotHR, w } = p2PcrGeometry;
    const pt = series[idx];
    if (!pt) return;

    const hx = xFor(idx);
    const ctxP = cPrice.getContext("2d");
    const ctxR = cPcr.getContext("2d");

    // Vertical Hairline on Top Canvas (Price)
    ctxP.save();
    ctxP.strokeStyle = "rgba(100, 116, 139, 0.75)";
    ctxP.lineWidth = 1;
    ctxP.setLineDash([3, 3]);
    ctxP.beginPath();
    ctxP.moveTo(hx, pad.top);
    ctxP.lineTo(hx, pad.top + plotHP);
    ctxP.stroke();

    // Marker on Price Curve
    ctxP.fillStyle = "#5b7e45";
    ctxP.strokeStyle = "#ffffff";
    ctxP.lineWidth = 1.5;
    ctxP.beginPath();
    ctxP.arc(hx, yForSpot(pt.spot), 4.5, 0, Math.PI * 2);
    ctxP.fill();
    ctxP.stroke();
    ctxP.restore();

    // Vertical Hairline on Bottom Canvas (PCR / WPCR)
    ctxR.save();
    ctxR.strokeStyle = "rgba(100, 116, 139, 0.75)";
    ctxR.lineWidth = 1;
    ctxR.setLineDash([3, 3]);
    ctxR.beginPath();
    ctxR.moveTo(hx, pad.top);
    ctxR.lineTo(hx, pad.top + plotHR);
    ctxR.stroke();

    // Marker on Red PCR Line
    ctxR.fillStyle = "#dc2626";
    ctxR.strokeStyle = "#ffffff";
    ctxR.lineWidth = 1.5;
    ctxR.beginPath();
    ctxR.arc(hx, yForPcr(pt.pcr || 1.016), 4, 0, Math.PI * 2);
    ctxR.fill();
    ctxR.stroke();

    // Marker on Blue WPCR Line
    ctxR.fillStyle = "#1d4ed8";
    ctxR.strokeStyle = "#ffffff";
    ctxR.lineWidth = 1.5;
    ctxR.beginPath();
    ctxR.arc(hx, yForPcr(pt.wpcr || 0.603), 4.5, 0, Math.PI * 2);
    ctxR.fill();
    ctxR.stroke();
    ctxR.restore();

    // Update Top Tooltip
    const ttP = document.getElementById("p2PcrPriceTooltip");
    if (ttP) {
      ttP.style.display = "block";
      const tipLeft = Math.max(10, Math.min(w - 180, hx - 40));
      const tipTop = Math.max(10, yForSpot(pt.spot) - 34);
      ttP.style.left = `${tipLeft}px`;
      ttP.style.top = `${tipTop}px`;
      ttP.innerHTML = `
        <span style="color:#5b7e45; font-size:13px;">●</span> Stock Price: <strong>${Number(pt.spot).toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</strong>
      `;
    }

    // Update Bottom Tooltip
    const ttR = document.getElementById("p2PcrPcrTooltip");
    if (ttR) {
      ttR.style.display = "block";
      const tipLeft = Math.max(10, Math.min(w - 160, hx - 40));
      const tipTop = Math.max(8, yForPcr(pt.wpcr || 0.603) - 46);
      ttR.style.left = `${tipLeft}px`;
      ttR.style.top = `${tipTop}px`;
      ttR.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:2px;">
          <div><span style="color:#dc2626; font-size:13px;">●</span> PCR: <strong>${Number(pt.pcr || 1.016).toFixed(3)}</strong></div>
          <div><span style="color:#1d4ed8; font-size:13px;">●</span> WPCR: <strong>${Number(pt.wpcr || 0.603).toFixed(3)}</strong></div>
        </div>
      `;
    }
  }

  function updatePage2PcrHover(clientX) {
    if (!p2PcrGeometry) return;
    const canvas = document.getElementById("p2PcrPriceCanvas") || document.getElementById("p2PcrPcrCanvas");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const { pad, plotW, series } = p2PcrGeometry;

    if (x < pad.left || x > pad.left + plotW) {
      hidePage2PcrTooltip();
      return;
    }

    const relX = (x - pad.left) / plotW;
    const idx = Math.max(0, Math.min(series.length - 1, Math.round(relX * (series.length - 1))));
    p2PcrHoverIndex = idx;
    drawPage2OpstraPcr(series);
  }

  function hidePage2PcrTooltip() {
    p2PcrHoverIndex = null;
    const ttP = document.getElementById("p2PcrPriceTooltip");
    const ttR = document.getElementById("p2PcrPcrTooltip");
    if (ttP) ttP.style.display = "none";
    if (ttR) ttR.style.display = "none";
    if (p2PcrSeries && p2PcrSeries.length) {
      drawPage2OpstraPcr(p2PcrSeries);
    }
  }

  function setupPage2OpstraPcrControls() {
    const cPrice = document.getElementById("p2PcrPriceCanvas");
    const cPcr = document.getElementById("p2PcrPcrCanvas");
    if (cPrice) {
      cPrice.addEventListener("mousemove", (e) => updatePage2PcrHover(e.clientX));
      cPrice.addEventListener("mouseleave", () => hidePage2PcrTooltip());
    }
    if (cPcr) {
      cPcr.addEventListener("mousemove", (e) => updatePage2PcrHover(e.clientX));
      cPcr.addEventListener("mouseleave", () => hidePage2PcrTooltip());
    }

    const zoomGroup = document.getElementById("p2PcrZoomGroup");
    if (zoomGroup) {
      zoomGroup.querySelectorAll(".opstra-zoom-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          zoomGroup.querySelectorAll(".opstra-zoom-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          const zoom = btn.dataset.zoom || "1Y";
          const zoomMap = { "1D": 1, "5D": 5, "10D": 10, "15D": 15, "3M": 65, "1Y": 250, "All": 500 };
          p2PcrDays = zoomMap[zoom] || 250;

          // Update Date inputs
          const today = new Date();
          const past = new Date();
          const dayOffset = zoom === "1D" ? 1 : (zoom === "5D" ? 7 : (zoom === "10D" ? 14 : (zoom === "15D" ? 21 : (zoom === "3M" ? 90 : 365))));
          past.setDate(today.getDate() - dayOffset);
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const fromEl = document.getElementById("p2PcrDateFrom");
          const toEl = document.getElementById("p2PcrDateTo");
          if (fromEl) fromEl.value = `${months[past.getMonth()]} ${past.getDate()}, ${past.getFullYear()}`;
          if (toEl) toEl.value = `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

          // Slice series according to zoom
          if (p2PcrSeries && p2PcrSeries.length) {
            const count = Math.min(p2PcrSeries.length, p2PcrDays);
            drawPage2OpstraPcr(p2PcrSeries.slice(-count));
          }
        });
      });
    }
  }

  function renderDefinedgeStraddles(data) {
    const cards = document.getElementById("straddleMetricCards");
    cards.innerHTML = `
      <div class="p2-metric-box">
        <div class="p2-metric-label">Atm Strike</div>
        <div class="p2-metric-val" style="color:var(--p2-teal-light)">${data.atmStrike}</div>
        <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Spot: ₹${data.spot}</div>
      </div>
      <div class="p2-metric-box">
        <div class="p2-metric-label">Combined Premium (CE+PE)</div>
        <div class="p2-metric-val">₹${data.combinedLtp}</div>
        <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Decay: ₹${data.thetaDecay || 0}</div>
      </div>
      <div class="p2-metric-box">
        <div class="p2-metric-label">Upper Breakeven</div>
        <div class="p2-metric-val text-call">₹${data.upperBreakeven}</div>
        <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Ceiling Resistance</div>
      </div>
      <div class="p2-metric-box">
        <div class="p2-metric-label">Lower Breakeven</div>
        <div class="p2-metric-val text-put">₹${data.lowerBreakeven}</div>
        <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Floor Support</div>
      </div>
    `;

    const decay = data.decayPoints || [];
    renderSingleLineChart("chartStraddleDecay", decay.map(d => d.time), decay.map(d => d.combinedPrice), "Combined Straddle Price (₹)", getThemeColors().amber);
  }

  function renderDefinedgeOptionChain(data) {
    const strikes = data.strikes || [];
    const tbody = document.querySelector("#tableOptionChainGrid tbody");
    tbody.innerHTML = strikes.map(s => `
      <tr class="${s.isAtm ? 'atm-row' : ''}">
        <td>${s.ceDelta}</td>
        <td>${s.ceIv}%</td>
        <td>${Number(s.ceVol).toLocaleString()}</td>
        <td class="text-call">${Number(s.ceOi).toLocaleString()}</td>
        <td class="font-bold">₹${s.ceLtp}</td>
        <td class="text-center font-bold" style="color:var(--p2-teal-light);">${s.strike}${s.isAtm ? ' (ATM)' : ''}</td>
        <td class="font-bold">₹${s.peLtp}</td>
        <td class="text-put">${Number(s.peOi).toLocaleString()}</td>
        <td>${Number(s.peVol).toLocaleString()}</td>
        <td>${s.peIv}%</td>
        <td>${s.peDelta}</td>
      </tr>
    `).join("");
  }

  function renderDefinedgeUoa(data) {
    const list = data.anomalies || [];
    const tbody = document.querySelector("#tableUoaData tbody");
    tbody.innerHTML = list.map(a => `
      <tr>
        <td class="${a.type === 'CALL' ? 'text-call' : 'text-put'} font-bold">${a.type}</td>
        <td class="font-bold" style="color:var(--p2-teal-light)">${a.strike}</td>
        <td>${Number(a.volume).toLocaleString()}</td>
        <td>${Number(a.oi).toLocaleString()}</td>
        <td class="font-bold">${a.volOiRatio}x</td>
        <td><span class="p2-badge ${a.severity === 'CRITICAL' ? 'p2-badge-red' : 'p2-badge-teal'}">${a.severity}</span></td>
        <td>${a.interpretation}</td>
      </tr>
    `).join("");
  }

  function renderDefinedgeTrividh(data) {
    const cards = document.getElementById("trividhMetricCards");
    cards.innerHTML = `
      <div class="p2-metric-box">
        <div class="p2-metric-label">Composite Confluence</div>
        <div class="p2-metric-val" style="color:var(--p2-teal-light)">${data.confluenceScore} / 100</div>
        <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Verdict: ${data.verdict}</div>
      </div>
      <div class="p2-metric-box">
        <div class="p2-metric-label">Dim 1: Price Momentum</div>
        <div class="p2-metric-val ${data.priceScore >= 0 ? 'text-put' : 'text-call'}">${data.priceScore}</div>
        <div class="p2-metric-sub" style="color:var(--p2-text-muted)">VWAP & Trend Velocity</div>
      </div>
      <div class="p2-metric-box">
        <div class="p2-metric-label">Dim 2: OI Expansion</div>
        <div class="p2-metric-val ${data.oiScore >= 0 ? 'text-put' : 'text-call'}">${data.oiScore}</div>
        <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Strike Wall Shift</div>
      </div>
      <div class="p2-metric-box">
        <div class="p2-metric-label">Dim 3: Volume & PCR</div>
        <div class="p2-metric-val ${data.volScore >= 0 ? 'text-put' : 'text-call'}">${data.volScore}</div>
        <div class="p2-metric-sub" style="color:var(--p2-text-muted)">Execution Urgency</div>
      </div>
    `;

    renderTrividhBarChart("chartTrividhRadar", [
      { name: "Price Momentum", val: data.priceScore || 65 },
      { name: "OI Expansion", val: data.oiScore || 70 },
      { name: "Volume & PCR", val: data.volScore || 60 },
      { name: "Composite Verdict", val: data.confluenceScore || 68 }
    ]);
  }

  function renderDefinedgeCrossover(data) {
    const rows = data.crossovers || [];
    const tbody = document.querySelector("#tableCrossoverData tbody");
    tbody.innerHTML = rows.map(r => `
      <tr>
        <td class="font-bold" style="color:var(--p2-teal-light)">${r.strike}</td>
        <td class="text-call">${Number(r.ceOi).toLocaleString()}</td>
        <td class="text-put">${Number(r.peOi).toLocaleString()}</td>
        <td class="${r.spread >= 0 ? 'text-put' : 'text-call'}">${r.spread >= 0 ? '+' : ''}${Number(r.spread).toLocaleString()}</td>
        <td><span class="p2-badge ${r.status === 'BULLISH FLIP' ? 'p2-badge-green' : 'p2-badge-red'}">${r.status}</span></td>
        <td>${r.pivotType}</td>
      </tr>
    `).join("");
  }

  function renderDefinedgeActivity(data) {
    const list = data.activityList || [];
    const tbody = document.querySelector("#tableActivityData tbody");
    tbody.innerHTML = list.map(a => `
      <tr>
        <td class="font-bold" style="color:var(--p2-teal-light)">${a.strike}</td>
        <td class="${a.type === 'CE' ? 'text-call' : 'text-put'} font-bold">${a.type}</td>
        <td>₹${a.ltp}</td>
        <td><span class="p2-badge p2-badge-teal">${a.intensityScore} / 100</span></td>
        <td>${Number(a.volume).toLocaleString()}</td>
        <td class="${a.chgOi >= 0 ? 'text-put' : 'text-call'}">${a.chgOi >= 0 ? '+' : ''}${Number(a.chgOi).toLocaleString()}</td>
        <td>${a.action}</td>
      </tr>
    `).join("");
  }

  // ========================================================================
  // NIFTYTRADER PRO SUITE DATA FETCHER & RENDERERS
  // ========================================================================
  async function fetchNtApi(endpoint, params = {}) {
    try {
      const q = new URLSearchParams({ symbol: currentSymbol, ...params }).toString();
      const res = await fetch(`/api/niftytrader/${endpoint}?${q}`);
      return await res.json();
    } catch (err) {
      console.error(`Error fetching /api/niftytrader/${endpoint}:`, err);
      return { ok: false };
    }
  }

  async function loadNiftyTraderSummary() {
    const data = await fetchNtApi("summary");
    if (!data || !data.ok) return;
    cachedNtSummary = data;

    document.getElementById("p2SpotBadge").textContent = `SPOT: ₹${Number(data.spot).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
    document.getElementById("ntVixVal").textContent = `${data.indiaVix} (${data.vixChange >= 0 ? '+' : ''}${data.vixChange})`;
    document.getElementById("ntMaxPainVal").textContent = Number(data.maxPainStrike).toLocaleString();
    document.getElementById("ntLotSizeVal").textContent = data.lotSize;
    document.getElementById("ntPcrVal").textContent = data.oiPcr;
    document.getElementById("ntChgPcrVal").textContent = data.chgOiPcr;
    document.getElementById("ntVolPcrVal").textContent = data.volumePcr;
    document.getElementById("ntExpiryDateVal").textContent = data.expiryDate;

    const badge = document.getElementById("ntSentimentBadge");
    badge.textContent = data.sentiment;
    if (data.sentimentType === "bullish") {
      badge.className = "p2-badge p2-badge-green";
    } else if (data.sentimentType === "bearish") {
      badge.className = "p2-badge p2-badge-red";
    } else {
      badge.className = "p2-badge p2-badge-teal";
    }
  }

  async function loadNiftyTraderTool(toolId) {
    if (toolId === "ntViewPcr") {
      const data = await fetchNtApi("pcr");
      if (data && data.ok) renderNtPcr(data);
    } else if (toolId === "ntViewMaxPain") {
      const data = await fetchNtApi("max-pain");
      if (data && data.ok) renderNtMaxPain(data);
    } else if (toolId === "ntViewOiChart") {
      const data = await fetchNtApi("oi-chart");
      if (data && data.ok) renderNtOiChart(data);
    } else if (toolId === "ntViewChangeOi") {
      const data = await fetchNtApi("change-oi");
      if (data && data.ok) renderNtChangeOi(data);
    } else if (toolId === "ntViewVolumePcr") {
      const data = await fetchNtApi("volume-pcr");
      if (data && data.ok) renderNtVolumePcr(data);
    } else if (toolId === "ntViewOptionChain") {
      const data = await fetchNtApi("option-chain", { exchange: currentExchange });
      if (data && data.ok) renderNtOptionChain(data);
    } else if (toolId === "ntViewIvSmile") {
      const data = await fetchNtApi("iv");
      if (data && data.ok) renderNtIvSmile(data);
    }
  }

  function renderNtPcr(data) {
    const history = data.history || [];
    const isChg = (ntPcrMode === "chg");

    // Render Intraday Timeseries Line Chart (PCR vs Spot)
    renderPcrSpotChart(
      "ntChartPcrTimeseries",
      history.map(h => h.time),
      isChg ? history.map(h => h.chgOiPcr) : history.map(h => h.oiPcr),
      history.map(h => h.spot),
      isChg ? "Change in OI PCR" : "Total OI PCR"
    );

    // Populate 30-minute table
    const tbody = document.querySelector("#ntTablePcrHistory tbody");
    tbody.innerHTML = history.map(h => `
      <tr>
        <td class="font-bold">${h.time}</td>
        <td class="text-right font-bold ${h.oiPcr >= 1.0 ? 'text-put' : 'text-call'}">${h.oiPcr}</td>
        <td class="text-right font-bold ${h.chgOiPcr >= 1.0 ? 'text-put' : 'text-call'}">${h.chgOiPcr}</td>
        <td class="text-right font-bold">₹${Number(h.spot).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
        <td class="text-center"><span class="p2-badge ${h.oiPcr >= 1.1 ? 'p2-badge-green' : h.oiPcr <= 0.9 ? 'p2-badge-red' : 'p2-badge-teal'}">${h.oiPcr >= 1.1 ? 'Put OI Dominant' : h.oiPcr <= 0.9 ? 'Call OI Dominant' : 'Neutral Range'}</span></td>
      </tr>
    `).join("");
  }

  function downloadPcrCsv() {
    fetchNtApi("pcr").then(data => {
      if (!data || !data.history) return;
      let csv = "Time (IST),OI PCR,Change-in-OI PCR,Spot Price\n";
      data.history.forEach(h => {
        csv += `"${h.time}",${h.oiPcr},${h.chgOiPcr},${h.spot}\n`;
      });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `NiftyTrader_PCR_${currentSymbol}_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  function renderNtMaxPain(data) {
    document.getElementById("ntMaxPainStrikeBadge").textContent = `Max Pain Strike: ${data.maxPainStrike}`;
    const lossTable = data.lossTable || [];

    renderMaxPainChart(
      "ntChartMaxPainLoss",
      lossTable.map(l => l.strike),
      lossTable.map(l => l.callLoss),
      lossTable.map(l => l.putLoss),
      lossTable.map(l => l.totalLoss),
      data.maxPainStrike
    );

    const tbody = document.querySelector("#ntTableMaxPain tbody");
    tbody.innerHTML = lossTable.map(l => `
      <tr class="${l.isMaxPain ? 'atm-row' : ''}">
        <td class="text-center font-bold" style="color:var(--p2-teal-light)">${l.strike}${l.isMaxPain ? ' 🎯 [MAX PAIN]' : ''}</td>
        <td class="text-right text-call">₹${l.callLoss} Cr</td>
        <td class="text-right text-put">₹${l.putLoss} Cr</td>
        <td class="text-right font-bold ${l.isMaxPain ? 'text-amber' : ''}">₹${l.totalLoss} Cr</td>
        <td class="text-center"><span class="p2-badge ${l.isMaxPain ? 'p2-badge-teal' : l.isAtm ? 'p2-badge-green' : ''}">${l.isMaxPain ? 'Minimum Writer Loss' : l.isAtm ? 'ATM Pivot' : 'Active Strike'}</span></td>
      </tr>
    `).join("");
  }

  function renderNtOiChart(data) {
    const strikes = data.strikes || [];
    renderDualBarChart(
      "ntChartOiBarsLine",
      strikes.map(s => s.strike),
      strikes.map(s => s.ceOi),
      strikes.map(s => s.peOi),
      "Call Open Interest",
      "Put Open Interest"
    );
  }

  function renderNtChangeOi(data) {
    const strikes = data.strikes || [];
    renderDualBarChart(
      "ntChartChangeOiBars",
      strikes.map(s => s.strike),
      strikes.map(s => s.ceChgOi),
      strikes.map(s => s.peChgOi),
      "Call ΔOI (Lots Added)",
      "Put ΔOI (Lots Added)"
    );
  }

  function renderNtVolumePcr(data) {
    const series = data.timeSeries || [];
    renderSingleLineChart(
      "ntChartVolumePcrSeries",
      series.map(s => s.time),
      series.map(s => s.volPcr),
      "Volume Put Call Ratio (Intraday)",
      getThemeColors().amber
    );
  }

  function renderNtOptionChain(data) {
    const strikes = data.strikes || [];
    const tbody = document.querySelector("#ntTableOptionChainGrid tbody");
    tbody.innerHTML = strikes.map(s => `
      <tr class="${s.isAtm ? 'atm-row' : ''}">
        <td>${s.ceDelta}</td>
        <td>${s.ceIv}%</td>
        <td>${Number(s.ceVol).toLocaleString()}</td>
        <td class="text-call">${Number(s.ceOi).toLocaleString()}</td>
        <td class="font-bold">₹${s.ceLtp}</td>
        <td class="text-center font-bold" style="color:var(--p2-teal-light);">${s.strike}${s.isAtm ? ' (ATM)' : ''}</td>
        <td class="font-bold">₹${s.peLtp}</td>
        <td class="text-put">${Number(s.peOi).toLocaleString()}</td>
        <td>${Number(s.peVol).toLocaleString()}</td>
        <td>${s.peIv}%</td>
        <td>${s.peDelta}</td>
      </tr>
    `).join("");
  }

  function renderNtIvSmile(data) {
    const strikes = data.strikes || [];
    renderMultiLineChart(
      "ntChartIvSmile",
      strikes.map(s => s.strike),
      [
        { label: "Call IV (%)", data: strikes.map(s => s.ceIv), color: getThemeColors().red },
        { label: "Put IV (%)", data: strikes.map(s => s.peIv), color: getThemeColors().green },
        { label: "Avg IV (%)", data: strikes.map(s => s.avgIv), color: getThemeColors().teal }
      ]
    );
  }

  // ========================================================================
  // ULTRA-PREMIUM CANVAS CHART DRAWING ENGINE
  // Automatically adheres to Dark & Light Theme Tokens
  // ========================================================================
  function setupCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const parent = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    return { ctx, width, height };
  }

  function renderDualBarChart(canvasId, labels, dataA, dataB, labelA, labelB) {
    const setup = setupCanvas(canvasId);
    if (!setup) return;
    const { ctx, width, height } = setup;
    const theme = getThemeColors();

    const padding = { top: 40, right: 30, bottom: 50, left: 70 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVal = Math.max(...dataA, ...dataB, 100) * 1.15;

    // Background & Gridlines
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = theme.text;
      ctx.font = "10px JetBrains Mono";
      ctx.textAlign = "right";
      const val = Math.round(maxVal - (maxVal / 5) * i);
      ctx.fillText(val.toLocaleString(), padding.left - 10, y + 4);
    }

    // Bars
    const n = labels.length;
    const groupW = chartW / n;
    const barW = Math.max(4, (groupW - 12) / 2);

    for (let i = 0; i < n; i++) {
      const xCenter = padding.left + i * groupW + groupW / 2;

      // Bar A (Red / Call)
      const hA = (dataA[i] / maxVal) * chartH;
      const yA = padding.top + chartH - hA;
      ctx.fillStyle = theme.red;
      ctx.fillRect(xCenter - barW - 2, yA, barW, hA);

      // Bar B (Green / Put)
      const hB = (dataB[i] / maxVal) * chartH;
      const yB = padding.top + chartH - hB;
      ctx.fillStyle = theme.green;
      ctx.fillRect(xCenter + 2, yB, barW, hB);

      // Label
      ctx.fillStyle = theme.textBright;
      ctx.font = "10px JetBrains Mono";
      ctx.textAlign = "center";
      ctx.fillText(labels[i], xCenter, height - padding.bottom + 20);
    }

    // Legend
    ctx.fillStyle = theme.red;
    ctx.fillRect(width - 240, 15, 12, 12);
    ctx.fillStyle = theme.textBright;
    ctx.font = "11px Inter";
    ctx.textAlign = "left";
    ctx.fillText(labelA, width - 222, 25);

    ctx.fillStyle = theme.green;
    ctx.fillRect(width - 120, 15, 12, 12);
    ctx.fillStyle = theme.textBright;
    ctx.fillText(labelB, width - 102, 25);
  }

  function renderSingleLineChart(canvasId, labels, data, legendTitle, strokeColor) {
    const setup = setupCanvas(canvasId);
    if (!setup) return;
    const { ctx, width, height } = setup;
    const theme = getThemeColors();

    const padding = { top: 40, right: 30, bottom: 50, left: 60 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const minVal = Math.min(...data) * 0.95;
    const maxVal = Math.max(...data) * 1.05;

    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = theme.text;
      ctx.font = "10px JetBrains Mono";
      ctx.textAlign = "right";
      const val = (maxVal - ((maxVal - minVal) / 5) * i).toFixed(2);
      ctx.fillText(val, padding.left - 10, y + 4);
    }

    const n = labels.length;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    for (let i = 0; i < n; i++) {
      const x = padding.left + (chartW / (n - 1 || 1)) * i;
      const y = padding.top + chartH - ((data[i] - minVal) / (maxVal - minVal || 1)) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);

      // Point circle
      ctx.fillStyle = strokeColor;
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Label
      if (i % Math.ceil(n / 8) === 0 || i === n - 1) {
        ctx.fillStyle = theme.textBright;
        ctx.font = "10px JetBrains Mono";
        ctx.textAlign = "center";
        ctx.fillText(labels[i], x, height - padding.bottom + 20);
      }
    }
    ctx.stroke();

    // Legend
    ctx.fillStyle = strokeColor;
    ctx.fillRect(width - 200, 15, 12, 12);
    ctx.fillStyle = theme.textBright;
    ctx.font = "11px Inter";
    ctx.textAlign = "left";
    ctx.fillText(legendTitle, width - 182, 25);
  }

  function renderMultiLineChart(canvasId, labels, series) {
    const setup = setupCanvas(canvasId);
    if (!setup) return;
    const { ctx, width, height } = setup;
    const theme = getThemeColors();

    const padding = { top: 40, right: 30, bottom: 50, left: 65 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    let allVals = [];
    series.forEach(s => allVals.push(...s.data));
    const minVal = Math.min(...allVals, 0);
    const maxVal = Math.max(...allVals, 100) * 1.1;

    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = theme.text;
      ctx.font = "10px JetBrains Mono";
      ctx.textAlign = "right";
      const val = Math.round(maxVal - ((maxVal - minVal) / 5) * i);
      ctx.fillText(val.toLocaleString(), padding.left - 10, y + 4);
    }

    const n = labels.length;
    series.forEach((s, idx) => {
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const x = padding.left + (chartW / (n - 1 || 1)) * i;
        const y = padding.top + chartH - ((s.data[i] - minVal) / (maxVal - minVal || 1)) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Legend Item
      ctx.fillStyle = s.color;
      ctx.fillRect(width - 150 * (series.length - idx), 15, 10, 10);
      ctx.fillStyle = theme.textBright;
      ctx.font = "11px Inter";
      ctx.textAlign = "left";
      ctx.fillText(s.label, width - 150 * (series.length - idx) + 16, 24);
    });

    // X Labels
    for (let i = 0; i < n; i++) {
      if (i % Math.ceil(n / 7) === 0 || i === n - 1) {
        const x = padding.left + (chartW / (n - 1 || 1)) * i;
        ctx.fillStyle = theme.textBright;
        ctx.font = "10px JetBrains Mono";
        ctx.textAlign = "center";
        ctx.fillText(labels[i], x, height - padding.bottom + 20);
      }
    }
  }

  function renderHorizontalCushionChart(canvasId, callPct, putPct) {
    const setup = setupCanvas(canvasId);
    if (!setup) return;
    const { ctx, width, height } = setup;
    const theme = getThemeColors();

    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, width, height);

    const barW = width - 160;
    const barH = 36;
    const x = 80;
    const y = height / 2 - 18;

    const callWidth = (callPct / 100) * barW;
    const putWidth = (putPct / 100) * barW;

    ctx.fillStyle = theme.red;
    ctx.fillRect(x, y, callWidth, barH);

    ctx.fillStyle = theme.green;
    ctx.fillRect(x + callWidth, y, putWidth, barH);

    // Text labels
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px JetBrains Mono";
    ctx.textAlign = "left";
    if (callWidth > 60) ctx.fillText(`Call: ${callPct}%`, x + 10, y + 23);

    ctx.textAlign = "right";
    if (putWidth > 60) ctx.fillText(`Put: ${putPct}%`, x + barW - 10, y + 23);

    ctx.fillStyle = theme.textBright;
    ctx.font = "14px Inter";
    ctx.textAlign = "center";
    ctx.fillText("Total Open Interest Balance Cushion (Market Exposure)", width / 2, y - 25);
  }

  function renderPriceWithWallsChart(canvasId, times, prices, callWall, putWall) {
    const setup = setupCanvas(canvasId);
    if (!setup) return;
    const { ctx, width, height } = setup;
    const theme = getThemeColors();

    const padding = { top: 40, right: 30, bottom: 50, left: 70 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const all = [...prices, callWall, putWall].filter(Boolean);
    const minP = Math.min(...all) * 0.995;
    const maxP = Math.max(...all) * 1.005;

    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, width, height);

    // Call Wall Line (Resistance)
    if (callWall) {
      const yCw = padding.top + chartH - ((callWall - minP) / (maxP - minP)) * chartH;
      ctx.strokeStyle = theme.red;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(padding.left, yCw);
      ctx.lineTo(width - padding.right, yCw);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = theme.red;
      ctx.font = "11px Inter";
      ctx.fillText(`Major Resistance Wall: ₹${callWall}`, width - padding.right - 180, yCw - 8);
    }

    // Put Wall Line (Support)
    if (putWall) {
      const yPw = padding.top + chartH - ((putWall - minP) / (maxP - minP)) * chartH;
      ctx.strokeStyle = theme.green;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(padding.left, yPw);
      ctx.lineTo(width - padding.right, yPw);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = theme.green;
      ctx.font = "11px Inter";
      ctx.fillText(`Major Support Wall: ₹${putWall}`, width - padding.right - 170, yPw + 18);
    }

    // Spot Price Line
    const n = times.length;
    ctx.strokeStyle = theme.teal;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const x = padding.left + (chartW / (n - 1 || 1)) * i;
      const y = padding.top + chartH - ((prices[i] - minP) / (maxP - minP)) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  function renderTrividhBarChart(canvasId, items) {
    const setup = setupCanvas(canvasId);
    if (!setup) return;
    const { ctx, width, height } = setup;
    const theme = getThemeColors();

    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, width, height);

    const n = items.length;
    const barH = 34;
    const startY = 40;
    const barMaxW = width - 260;

    items.forEach((item, idx) => {
      const y = startY + idx * (barH + 24);

      ctx.fillStyle = theme.textBright;
      ctx.font = "12px Inter";
      ctx.textAlign = "left";
      ctx.fillText(item.name, 40, y + 22);

      // Track
      ctx.fillStyle = theme.grid;
      ctx.fillRect(200, y, barMaxW, barH);

      // Fill
      const w = Math.max(10, (item.val / 100) * barMaxW);
      ctx.fillStyle = item.val >= 70 ? theme.green : item.val >= 40 ? theme.teal : theme.red;
      ctx.fillRect(200, y, w, barH);

      // Score
      ctx.fillStyle = "#ffffff";
      ctx.font = "12px JetBrains Mono";
      ctx.textAlign = "left";
      ctx.fillText(`${item.val} / 100`, 210, y + 22);
    });
  }

  function renderPcrSpotChart(canvasId, times, pcrVals, spots, pcrLabel) {
    const setup = setupCanvas(canvasId);
    if (!setup) return;
    const { ctx, width, height } = setup;
    const theme = getThemeColors();

    const padding = { top: 40, right: 70, bottom: 50, left: 60 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const minPcr = Math.min(...pcrVals) * 0.9;
    const maxPcr = Math.max(...pcrVals) * 1.1;
    const minSpot = Math.min(...spots) * 0.998;
    const maxSpot = Math.max(...spots) * 1.002;

    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, width, height);

    // Left Y Axis (PCR)
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = theme.teal;
      ctx.font = "10px JetBrains Mono";
      ctx.textAlign = "right";
      const val = (maxPcr - ((maxPcr - minPcr) / 5) * i).toFixed(2);
      ctx.fillText(val, padding.left - 8, y + 4);

      // Right Y Axis (Spot)
      ctx.fillStyle = theme.amber;
      ctx.textAlign = "left";
      const spotVal = Math.round(maxSpot - ((maxSpot - minSpot) / 5) * i);
      ctx.fillText(spotVal.toLocaleString(), width - padding.right + 8, y + 4);
    }

    const n = times.length;

    // Line 1: PCR Curve
    ctx.strokeStyle = theme.teal;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const x = padding.left + (chartW / (n - 1 || 1)) * i;
      const y = padding.top + chartH - ((pcrVals[i] - minPcr) / (maxPcr - minPcr || 1)) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);

      ctx.fillStyle = theme.teal;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.stroke();

    // Line 2: Spot Line
    ctx.strokeStyle = theme.amber;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const x = padding.left + (chartW / (n - 1 || 1)) * i;
      const y = padding.top + chartH - ((spots[i] - minSpot) / (maxSpot - minSpot || 1)) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // X Axis Labels
    for (let i = 0; i < n; i++) {
      if (i % Math.ceil(n / 7) === 0 || i === n - 1) {
        const x = padding.left + (chartW / (n - 1 || 1)) * i;
        ctx.fillStyle = theme.textBright;
        ctx.font = "10px JetBrains Mono";
        ctx.textAlign = "center";
        ctx.fillText(times[i], x, height - padding.bottom + 20);
      }
    }

    // Legends
    ctx.fillStyle = theme.teal;
    ctx.fillRect(width - 280, 15, 12, 12);
    ctx.fillStyle = theme.textBright;
    ctx.font = "11px Inter";
    ctx.textAlign = "left";
    ctx.fillText(pcrLabel, width - 262, 25);

    ctx.fillStyle = theme.amber;
    ctx.fillRect(width - 130, 15, 12, 12);
    ctx.fillStyle = theme.textBright;
    ctx.fillText("Spot Price (₹)", width - 112, 25);
  }

  function renderMaxPainChart(canvasId, strikes, callLoss, putLoss, totalLoss, maxPainStrike) {
    const setup = setupCanvas(canvasId);
    if (!setup) return;
    const { ctx, width, height } = setup;
    const theme = getThemeColors();

    const padding = { top: 40, right: 30, bottom: 50, left: 70 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxLoss = Math.max(...totalLoss, 10) * 1.15;

    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = theme.text;
      ctx.font = "10px JetBrains Mono";
      ctx.textAlign = "right";
      const val = Math.round(maxLoss - (maxLoss / 5) * i);
      ctx.fillText(`₹${val} Cr`, padding.left - 10, y + 4);
    }

    const n = strikes.length;
    const barW = Math.max(6, (chartW / n) - 8);

    for (let i = 0; i < n; i++) {
      const x = padding.left + i * (chartW / n) + (chartW / n) / 2 - barW / 2;
      const isMp = (strikes[i] === maxPainStrike);

      // Stacked Bar or Total Loss Bar
      const hTotal = (totalLoss[i] / maxLoss) * chartH;
      const yTotal = padding.top + chartH - hTotal;

      ctx.fillStyle = isMp ? theme.amber : theme.purple;
      ctx.fillRect(x, yTotal, barW, hTotal);

      if (isMp) {
        ctx.strokeStyle = theme.teal;
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 2, yTotal - 2, barW + 4, hTotal + 4);

        ctx.fillStyle = theme.amber;
        ctx.font = "11px Inter";
        ctx.textAlign = "center";
        ctx.fillText("🎯 MAX PAIN", x + barW / 2, yTotal - 10);
      }

      // X Strike label
      ctx.fillStyle = isMp ? theme.teal : theme.textBright;
      ctx.font = isMp ? "bold 11px JetBrains Mono" : "10px JetBrains Mono";
      ctx.textAlign = "center";
      ctx.fillText(strikes[i], x + barW / 2, height - padding.bottom + 20);
    }

    // Legend
    ctx.fillStyle = theme.amber;
    ctx.fillRect(width - 240, 15, 12, 12);
    ctx.fillStyle = theme.textBright;
    ctx.font = "11px Inter";
    ctx.textAlign = "left";
    ctx.fillText("Max Pain Strike (Min Loss)", width - 222, 25);
  }


  // Expose controller for workspace restoration ("Jaha Chora Wahi Se Chalu")
  window.Page2Controller = {
    restoreFromState(state) {
      if (!state) return;
      if (state.theme) {
        applyTheme(state.theme === "light");
      }
      if (state.page2Index) {
        currentSymbol = state.page2Index;
        const sel = document.getElementById("p2IndexSelect");
        if (sel) sel.value = currentSymbol;
      }
      if (state.page2Suite) {
        currentSuite = state.page2Suite;
        const defBtn = document.getElementById("p2SuiteDefinedgeBtn");
        const ntBtn = document.getElementById("p2SuiteNiftyTraderBtn");
        const defSection = document.getElementById("p2SectionDefinedge");
        const ntSection = document.getElementById("p2SectionNiftyTrader");
        const defDropdown = document.getElementById("p2DefinedgeDropdownContainer");
        if (currentSuite === "niftytrader") {
          if (ntBtn) ntBtn.classList.add("active");
          if (defBtn) defBtn.classList.remove("active");
          if (defSection) defSection.style.display = "none";
          if (ntSection) ntSection.style.display = "block";
          if (defDropdown) defDropdown.style.display = "none";
        } else {
          if (defBtn) defBtn.classList.add("active");
          if (ntBtn) ntBtn.classList.remove("active");
          if (defSection) defSection.style.display = "block";
          if (ntSection) ntSection.style.display = "none";
          if (defDropdown) defDropdown.style.display = "inline-block";
        }
      }
      if (state.page2NtTool && currentSuite === "niftytrader") {
        currentNtTool = state.page2NtTool;
        const btns = document.querySelectorAll(".nt-nav-btn");
        btns.forEach(b => {
          if (b.getAttribute("data-nt-tool") === currentNtTool) b.classList.add("active");
          else b.classList.remove("active");
        });
        document.querySelectorAll("#p2SectionNiftyTrader .nt-view-panel").forEach(p => {
          p.classList.remove("active");
        });
        const target = document.getElementById(currentNtTool);
        if (target) target.classList.add("active");
      }
      if (state.page2DefinedgeTool && currentSuite === "definedge") {
        currentDefinedgeTool = state.page2DefinedgeTool;
        const items = document.querySelectorAll(".page2-dropdown-item");
        items.forEach(i => {
          if (i.getAttribute("data-tool") === currentDefinedgeTool) i.classList.add("active");
          else i.classList.remove("active");
        });
        document.querySelectorAll("#p2SectionDefinedge .page2-view-panel").forEach(p => {
          p.classList.remove("active");
        });
        const target = document.getElementById(currentDefinedgeTool);
        if (target) target.classList.add("active");
      }
      refreshActiveView();
    }
  };

  // ========================================================================
  // 🧰 TOOLS SUITE: LIVE & HISTORICAL (BACK-DATE) STRADDLE ENGINE
  // ========================================================================
  const straddleState = {
    mode: "live", // "live" or "historical"
    date: "",     // "YYYY-MM-DD"
    category: "Equity",
    index: "NIFTY",
    expiry: "",
    autoRefresh: true,
    data: null,
    timer: null,
    visible: {
      straddle: true,
      spot: true,
      synth: true,
      vwap: true
    },
    categoriesData: null,
    historyMeta: null,
    hoveredIndex: -1
  };

  function setupStraddleControls() {
    const liveBtn = document.getElementById("stModeLiveBtn");
    const histBtn = document.getElementById("stModeHistBtn");
    const dateGrp = document.getElementById("stDateGroup");
    const dateSel = document.getElementById("straddleDateSelect");
    const dateInp = document.getElementById("straddleDateInput");
    const liveToggleWrap = document.getElementById("straddleLiveToggleWrap");

    const catSel = document.getElementById("straddleCategorySelect");
    const idxSel = document.getElementById("straddleIndexSelect");
    const expSel = document.getElementById("straddleExpirySelect");
    const autoRef = document.getElementById("straddleAutoRefresh");
    const refBtn = document.getElementById("straddleRefreshBtn");
    const csvBtn = document.getElementById("stExportCsvBtn");

    // Load definitions
    fetchCategories();
    fetchHistoryMeta();

    // Mode switching: Live vs Historical Back-Date
    if (liveBtn && histBtn) {
      liveBtn.addEventListener("click", () => {
        straddleState.mode = "live";
        straddleState.date = "";
        liveBtn.classList.add("active");
        histBtn.classList.remove("active");
        if (dateGrp) dateGrp.style.display = "none";
        if (liveToggleWrap) liveToggleWrap.style.display = "inline-flex";
        populateExpiryOptions();
        loadStraddleTool();
      });

      histBtn.addEventListener("click", async () => {
        straddleState.mode = "historical";
        histBtn.classList.add("active");
        liveBtn.classList.remove("active");
        if (dateGrp) dateGrp.style.display = "flex";
        if (liveToggleWrap) liveToggleWrap.style.display = "none";
        stopStraddleTimer();
        if (!straddleState.historyMeta) {
          await fetchHistoryMeta();
        }
        populateHistoricalDates();
        loadStraddleTool();
      });
    }

    if (dateSel) {
      dateSel.addEventListener("change", (e) => {
        straddleState.date = e.target.value;
        if (dateInp) dateInp.value = straddleState.date;
        populateExpiryOptions();
        loadStraddleTool();
      });
    }

    if (dateInp) {
      dateInp.addEventListener("change", (e) => {
        straddleState.date = e.target.value;
        if (dateSel) dateSel.value = straddleState.date;
        populateExpiryOptions();
        loadStraddleTool();
      });
    }

    if (catSel) {
      catSel.addEventListener("change", (e) => {
        straddleState.category = e.target.value;
        populateIndexOptions();
        straddleState.index = idxSel ? idxSel.value : "NIFTY";
        if (straddleState.mode === "historical") {
          populateHistoricalDates();
        } else {
          populateExpiryOptions();
        }
        loadStraddleTool();
      });
    }

    if (idxSel) {
      idxSel.addEventListener("change", (e) => {
        straddleState.index = e.target.value;
        if (straddleState.mode === "historical") {
          populateHistoricalDates();
        } else {
          populateExpiryOptions();
        }
        loadStraddleTool();
      });
    }

    if (expSel) {
      expSel.addEventListener("change", (e) => {
        straddleState.expiry = e.target.value;
        loadStraddleTool();
      });
    }

    if (autoRef) {
      autoRef.addEventListener("change", (e) => {
        straddleState.autoRefresh = e.target.checked;
        if (straddleState.autoRefresh && currentSuite === "tools" && straddleState.mode === "live") {
          startStraddleTimer();
        } else {
          stopStraddleTimer();
        }
      });
    }

    if (refBtn) {
      refBtn.addEventListener("click", () => {
        loadStraddleTool();
      });
    }

    if (csvBtn) {
      csvBtn.addEventListener("click", downloadStraddleCsv);
    }

    // Series visibility toggles (Legend Buttons)
    const legBtns = document.querySelectorAll(".st-legend-btn");
    legBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const series = btn.getAttribute("data-series");
        if (!series || !straddleState.visible.hasOwnProperty(series)) return;
        straddleState.visible[series] = !straddleState.visible[series];
        if (straddleState.visible[series]) {
          btn.classList.add("active");
          btn.classList.remove("inactive");
        } else {
          btn.classList.remove("active");
          btn.classList.add("inactive");
        }
        if (straddleState.data) {
          renderStraddleChart(straddleState.data);
        }
      });
    });

    // Window resize handler for canvas
    window.addEventListener("resize", () => {
      if (currentSuite === "tools" && straddleState.data) {
        renderStraddleChart(straddleState.data);
      }
    });

    // Setup Canvas Mouse Tracking
    setupStraddleCanvasInteractions();
  }

  async function fetchCategories() {
    try {
      const res = await fetch("/api/tools/straddle-categories");
      const data = await res.json();
      if (data && data.categories) {
        straddleState.categoriesData = data.categories;
        populateIndexOptions();
        if (straddleState.mode === "live") {
          populateExpiryOptions();
        }
      }
    } catch (err) {
      console.warn("Could not fetch categories:", err);
    }
  }

  async function fetchHistoryMeta() {
    try {
      const res = await fetch("/api/tools/straddle-history-meta");
      const data = await res.json();
      if (data) {
        straddleState.historyMeta = data;
      }
    } catch (err) {
      console.warn("Could not fetch history meta:", err);
    }
  }

  function populateHistoricalDates() {
    const dateSel = document.getElementById("straddleDateSelect");
    const dateInp = document.getElementById("straddleDateInput");
    if (!dateSel || !straddleState.historyMeta) return;

    const catKey = (straddleState.category || "Equity").toLowerCase();
    const catItems = straddleState.historyMeta[catKey] || [];
    const symObj = catItems.find(it => it.key === straddleState.index) || catItems[0];

    if (!symObj || !symObj.dates || symObj.dates.length === 0) {
      dateSel.innerHTML = `<option value="">No historical dates</option>`;
      return;
    }

    const dates = symObj.dates;
    // Show last 60 historical sessions in reverse order (newest first)
    const recent = dates.slice(-60).reverse();

    dateSel.innerHTML = recent.map((d, i) => {
      const dObj = new Date(d.value);
      const label = dObj.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", weekday: "short" });
      const tag = i === 0 ? " (Previous Session)" : "";
      return `<option value="${d.value}">${label}${tag}</option>`;
    }).join("");

    straddleState.date = recent[0].value;
    if (dateInp) dateInp.value = straddleState.date;

    populateExpiryOptions();
  }

  function populateIndexOptions() {
    const idxSel = document.getElementById("straddleIndexSelect");
    if (!idxSel || !straddleState.categoriesData) return;

    const catObj = straddleState.categoriesData.find(c => c.name === straddleState.category) || straddleState.categoriesData[0];
    if (!catObj || !catObj.indices) return;

    idxSel.innerHTML = catObj.indices.map(idx => `<option value="${idx.key}">${idx.name}</option>`).join("");
    straddleState.index = idxSel.value || "NIFTY";
  }

  function populateExpiryOptions() {
    const expSel = document.getElementById("straddleExpirySelect");
    if (!expSel) return;

    // 1. Historical mode expiry resolution
    if (straddleState.mode === "historical" && straddleState.date && straddleState.historyMeta) {
      const catKey = (straddleState.category || "Equity").toLowerCase();
      const catItems = straddleState.historyMeta[catKey] || [];
      const symObj = catItems.find(it => it.key === straddleState.index);
      if (symObj && symObj.dates) {
        const dObj = symObj.dates.find(d => d.value === straddleState.date);
        if (dObj && dObj.expiries && dObj.expiries.length > 0) {
          expSel.innerHTML = dObj.expiries.map((exp, idx) => `
            <option value="${exp.value}">${idx === 0 ? 'Weekly Expiry (' + exp.value + ')' : 'Far Expiry (' + exp.value + ')'}</option>
          `).join("");
          straddleState.expiry = expSel.value;
          return;
        }
      }
    }

    // 2. Live mode expiry resolution
    if (!straddleState.categoriesData) return;
    const catObj = straddleState.categoriesData.find(c => c.name === straddleState.category) || straddleState.categoriesData[0];
    const idxObj = catObj ? catObj.indices.find(i => i.key === straddleState.index) : null;

    if (!idxObj || !idxObj.expiries || idxObj.expiries.length <= 1) {
      expSel.innerHTML = `<option value="">Immediate Expiry</option>`;
      straddleState.expiry = "";
      return;
    }

    expSel.innerHTML = idxObj.expiries.map((exp, idx) => `
      <option value="${exp}">${idx === 0 ? 'Current (' + exp + ')' : 'Next (' + exp + ')'}</option>
    `).join("");
    straddleState.expiry = expSel.value;
  }

  function startStraddleTimer() {
    stopStraddleTimer();
    if (straddleState.mode !== "live") return;
    straddleState.timer = setInterval(() => {
      if (currentSuite === "tools" && straddleState.autoRefresh && straddleState.mode === "live") {
        loadStraddleTool(true); // silent refresh
      }
    }, 30000);
  }

  function stopStraddleTimer() {
    if (straddleState.timer) {
      clearInterval(straddleState.timer);
      straddleState.timer = null;
    }
  }

  async function loadStraddleTool(isSilent = false) {
    const refBtn = document.getElementById("straddleRefreshBtn");
    if (refBtn && !isSilent) {
      refBtn.textContent = "⏳ Fetching...";
      refBtn.disabled = true;
    }

    try {
      const q = new URLSearchParams({
        index: straddleState.index || "NIFTY",
        category: straddleState.category || "Equity",
        expiry: straddleState.expiry || "",
        date: straddleState.mode === "historical" ? (straddleState.date || "") : ""
      });

      const res = await fetch(`/api/tools/straddle-chart?${q.toString()}`);
      const data = await res.json();

      if (!data || !data.ok) {
        console.error("Straddle fetch failed:", data);
        return;
      }

      straddleState.data = data;

      // 1. Update Metrics Strip
      const lat = data.latest || {};
      const elPrice = document.getElementById("stPriceVal");
      const elDecay = document.getElementById("stDecaySub");
      const elSpotLbl = document.getElementById("stSpotLbl");
      const elSpot = document.getElementById("stSpotVal");
      const elSynth = document.getElementById("stSynthVal");
      const elStrike = document.getElementById("stStrikeVal");
      const elCe = document.getElementById("stCeVal");
      const elPe = document.getElementById("stPeVal");
      const elVwap = document.getElementById("stVwapVal");
      const elDte = document.getElementById("stDteVal");
      const elTime = document.getElementById("stTimeVal");
      const elHeading = document.getElementById("straddleChartHeading");

      const elLower = document.getElementById("stLowerBe");
      const elCenter = document.getElementById("stCenterSpot");
      const elUpper = document.getElementById("stUpperBe");
      const elRange = document.getElementById("stRangeSpread");

      if (elPrice) elPrice.textContent = "₹" + Number(lat.straddle_price || 0).toFixed(2);
      if (elDecay) {
        const dPts = lat.decay_pts || 0;
        const dPct = lat.decay_pct || 0;
        const sign = dPts >= 0 ? "-" : "+";
        elDecay.textContent = `Decay: ₹${Math.abs(dPts).toFixed(2)} (${sign}${Math.abs(dPct).toFixed(2)}%)`;
        elDecay.style.color = dPts >= 0 ? "#10b981" : "#f43f5e";
      }
      if (elSpotLbl) elSpotLbl.textContent = `${data.symbol} Spot`;
      if (elSpot) elSpot.textContent = "₹" + Number(lat.spot || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
      if (elSynth) elSynth.textContent = "₹" + Number(lat.synthetic_future || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
      if (elStrike) elStrike.textContent = Number(lat.straddle_strike || 0).toLocaleString("en-IN");
      if (elCe) elCe.textContent = "₹" + Number(lat.ce_price || 0).toFixed(2);
      if (elPe) elPe.textContent = "₹" + Number(lat.pe_price || 0).toFixed(2);
      if (elVwap) elVwap.textContent = "₹" + Number(lat.vwap || 0).toFixed(2);
      if (elDte) elDte.textContent = `${data.dte} Days`;
      if (elHeading) {
        if (data.is_historical) {
          elHeading.textContent = `📅 [HISTORICAL: ${data.date}] ${data.symbol} ATM ${lat.straddle_strike} Straddle Trajectory`;
        } else {
          elHeading.textContent = `${data.symbol} ATM ${lat.straddle_strike} Straddle Live Trajectory`;
        }
      }

      const elSub = document.querySelector(".straddle-chart-title-left .p2-card-subtitle");
      if (elSub) {
        elSub.textContent = data.is_historical
          ? `Historical session archive for ${data.date} (Expiry: ${data.expiry}) with tick-by-tick VWAP & Synthetic Future`
          : "Intraday 1-minute trajectory comparing combined premium erosion against spot momentum";
      }

      if (elLower) elLower.textContent = "₹" + Number(lat.lower_breakeven || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
      if (elCenter) elCenter.textContent = "₹" + Number(lat.spot || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
      if (elUpper) elUpper.textContent = "₹" + Number(lat.upper_breakeven || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
      if (elRange) {
        const spreadPct = lat.spot > 0 ? (lat.straddle_price / lat.spot * 100).toFixed(2) : "0.00";
        elRange.textContent = `±₹${Number(lat.straddle_price || 0).toFixed(2)} (±${spreadPct}%)`;
      }

      // 2. Render Full Canvas Chart
      renderStraddleChart(data);

      // 3. Render Historical Snapshots Table
      renderStraddleTable(data.points || []);

      // Start timer if auto-refresh is on
      if (straddleState.autoRefresh) {
        startStraddleTimer();
      }

    } catch (err) {
      console.error("Error loading straddle tool:", err);
    } finally {
      if (refBtn && !isSilent) {
        refBtn.textContent = "🔄 Fetch";
        refBtn.disabled = false;
      }
    }
  }

  function formatIstTime(isoStr) {
    if (!isoStr) return "--";
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });
    } catch {
      return isoStr;
    }
  }

  function formatIstFull(isoStr) {
    if (!isoStr) return "--";
    try {
      const d = new Date(isoStr);
      return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata"
      });
    } catch {
      return isoStr;
    }
  }

  // ========================================================================
  // STRADDLE DUAL-AXIS CANVAS RENDERER (FINANCEDEFT-MATCHED MULTI-AXIS)
  // ========================================================================
  function renderStraddleChart(data) {
    const canvas = document.getElementById("chartLiveStraddle");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const container = canvas.parentElement;
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 450;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(dpr, dpr);

    const theme = getThemeColors();
    const isLight = document.body.classList.contains("theme-light");

    // Colors
    const colStraddle = "#06b6d4"; // Cyan
    const colSpot = "#10b981";     // Emerald Green
    const colSynth = "#a855f7";    // Purple
    const colVwap = "#f59e0b";     // Amber Gold

    // Margins / Padding
    const padding = { top: 35, right: 80, bottom: 45, left: 70 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Background fill
    ctx.fillStyle = isLight ? "#f8fafc" : "#0d1322";
    ctx.fillRect(0, 0, width, height);

    const points = data.points || [];
    const n = points.length;
    if (n === 0) {
      ctx.fillStyle = theme.text;
      ctx.font = "14px Inter";
      ctx.textAlign = "center";
      ctx.fillText("No straddle tick data available", width / 2, height / 2);
      return;
    }

    // 1. Compute Left Y-Axis Range (Straddle Price & VWAP)
    let leftVals = [];
    points.forEach(p => {
      if (straddleState.visible.straddle) leftVals.push(p.price);
      if (straddleState.visible.vwap) leftVals.push(p.vwap);
    });
    if (leftVals.length === 0) leftVals = [100, 200];
    let minLeft = Math.min(...leftVals);
    let maxLeft = Math.max(...leftVals);
    const leftPad = (maxLeft - minLeft) * 0.08 || 5;
    minLeft = Math.floor(minLeft - leftPad);
    maxLeft = Math.ceil(maxLeft + leftPad);

    // 2. Compute Right Y-Axis Range (Index Spot & Synthetic Future)
    let rightVals = [];
    points.forEach(p => {
      if (straddleState.visible.spot) rightVals.push(p.spot);
      if (straddleState.visible.synth) rightVals.push(p.synthetic_future);
    });
    if (rightVals.length === 0) rightVals = [23000, 23500];
    let minRight = Math.min(...rightVals);
    let maxRight = Math.max(...rightVals);
    const rightPad = (maxRight - minRight) * 0.08 || 20;
    minRight = Math.floor(minRight - rightPad);
    maxRight = Math.ceil(maxRight + rightPad);

    // 3. Gridlines & Y-Axes Labels
    ctx.strokeStyle = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    const gridSteps = 5;

    for (let i = 0; i <= gridSteps; i++) {
      const y = padding.top + (chartH / gridSteps) * i;

      // Horizontal gridline
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Left Y-Axis Label (Straddle Price)
      const lVal = maxLeft - ((maxLeft - minLeft) / gridSteps) * i;
      ctx.fillStyle = colStraddle;
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.textAlign = "right";
      ctx.fillText("₹" + lVal.toFixed(1), padding.left - 10, y + 4);

      // Right Y-Axis Label (Spot / Future)
      const rVal = maxRight - ((maxRight - minRight) / gridSteps) * i;
      ctx.fillStyle = colSpot;
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText(Math.round(rVal).toLocaleString("en-IN"), width - padding.right + 10, y + 4);
    }

    // Watermark in Center
    ctx.save();
    ctx.fillStyle = isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)";
    ctx.font = "800 36px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(data.is_historical ? `${data.symbol} ${data.date} (HISTORICAL)` : `${data.symbol} STRADDLE DESK`, width / 2, height / 2);
    ctx.restore();

    // Helper coordinate converters
    const getX = (idx) => padding.left + (chartW / (n - 1 || 1)) * idx;
    const getLeftY = (val) => padding.top + chartH - ((val - minLeft) / (maxLeft - minLeft || 1)) * chartH;
    const getRightY = (val) => padding.top + chartH - ((val - minRight) / (maxRight - minRight || 1)) * chartH;

    // 4. Render Curves

    // Curve A: Synthetic Future (Dashed Purple)
    if (straddleState.visible.synth) {
      ctx.strokeStyle = colSynth;
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const x = getX(i);
        const y = getRightY(points[i].synthetic_future);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Curve B: Straddle VWAP (Gold Line)
    if (straddleState.visible.vwap) {
      ctx.strokeStyle = colVwap;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const x = getX(i);
        const y = getLeftY(points[i].vwap);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Curve C: Index Spot (Emerald Green Line)
    if (straddleState.visible.spot) {
      ctx.strokeStyle = colSpot;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const x = getX(i);
        const y = getRightY(points[i].spot);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Curve D: Straddle Price (Cyan Line with subtle gradient glow)
    if (straddleState.visible.straddle) {
      // Area gradient
      const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      grad.addColorStop(0, "rgba(6, 182, 212, 0.15)");
      grad.addColorStop(1, "rgba(6, 182, 212, 0.0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(getX(0), padding.top + chartH);
      for (let i = 0; i < n; i++) {
        ctx.lineTo(getX(i), getLeftY(points[i].price));
      }
      ctx.lineTo(getX(n - 1), padding.top + chartH);
      ctx.closePath();
      ctx.fill();

      // Stroke
      ctx.strokeStyle = colStraddle;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const x = getX(i);
        const y = getLeftY(points[i].price);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // 5. X-Axis Time Labels
    ctx.fillStyle = isLight ? "#64748b" : "#94a3b8";
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    const xStep = Math.max(1, Math.floor(n / 7));

    for (let i = 0; i < n; i += xStep) {
      const x = getX(i);
      const timeStr = formatIstTime(points[i].time);
      ctx.fillText(timeStr, x, height - 15);
    }
    // Always print final timestamp
    if (n > 1) {
      const xLast = getX(n - 1);
      ctx.fillText(formatIstTime(points[n - 1].time), xLast, height - 15);
    }

    // 6. Crosshair Rendering (when hovered)
    if (straddleState.hoveredIndex >= 0 && straddleState.hoveredIndex < n) {
      const hi = straddleState.hoveredIndex;
      const hx = getX(hi);
      const hp = points[hi];

      // Vertical crosshair line
      ctx.strokeStyle = isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(hx, padding.top);
      ctx.lineTo(hx, padding.top + chartH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Highlight dots
      if (straddleState.visible.straddle) {
        drawDot(ctx, hx, getLeftY(hp.price), colStraddle);
      }
      if (straddleState.visible.spot) {
        drawDot(ctx, hx, getRightY(hp.spot), colSpot);
      }
      if (straddleState.visible.synth) {
        drawDot(ctx, hx, getRightY(hp.synthetic_future), colSynth);
      }
      if (straddleState.visible.vwap) {
        drawDot(ctx, hx, getLeftY(hp.vwap), colVwap);
      }
    }
  }

  function drawDot(ctx, x, y, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  function setupStraddleCanvasInteractions() {
    const canvas = document.getElementById("chartLiveStraddle");
    const tooltip = document.getElementById("straddleTooltip");
    if (!canvas || !tooltip) return;

    function handleMove(e) {
      if (!straddleState.data || !straddleState.data.points || straddleState.data.points.length === 0) return;

      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;

      const padding = { top: 35, right: 80, bottom: 45, left: 70 };
      const chartW = rect.width - padding.left - padding.right;

      if (mouseX < padding.left || mouseX > rect.width - padding.right) {
        hideTooltip();
        return;
      }

      const points = straddleState.data.points;
      const n = points.length;
      const relX = (mouseX - padding.left) / chartW;
      const index = Math.round(relX * (n - 1));
      const clampedIndex = Math.max(0, Math.min(n - 1, index));

      straddleState.hoveredIndex = clampedIndex;
      renderStraddleChart(straddleState.data);

      // Tooltip HTML content
      const p = points[clampedIndex];
      const openP = points[0].price || p.price;
      const decayPts = openP - p.price;
      const decayPct = openP > 0 ? (decayPts / openP * 100).toFixed(2) : "0.00";

      tooltip.innerHTML = `
        <div style="font-weight:800; font-size:12px; margin-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:4px;">
          ⏱️ ${formatIstFull(p.time)}
        </div>
        <div style="display:grid; grid-template-columns:auto auto; gap:4px 12px; font-size:11px;">
          <span style="color:#06b6d4; font-weight:700;">Straddle Price:</span>
          <strong style="text-align:right;">₹${p.price.toFixed(2)}</strong>

          <span style="color:#10b981; font-weight:700;">Index Spot:</span>
          <strong style="text-align:right;">₹${Number(p.spot).toLocaleString('en-IN', {minimumFractionDigits:2})}</strong>

          <span style="color:#a855f7; font-weight:700;">Synthetic Future:</span>
          <strong style="text-align:right;">₹${Number(p.synthetic_future).toLocaleString('en-IN', {minimumFractionDigits:2})}</strong>

          <span style="color:#f59e0b; font-weight:700;">VWAP:</span>
          <strong style="text-align:right;">₹${p.vwap.toFixed(2)}</strong>

          <span style="color:var(--p2-text-muted);">Strike:</span>
          <strong style="text-align:right;">${p.straddle_strike}</strong>

          <span style="color:var(--p2-text-muted);">CE / PE:</span>
          <span style="text-align:right;">₹${p.ce_price.toFixed(2)} / ₹${p.pe_price.toFixed(2)}</span>

          <span style="color:var(--p2-text-muted);">Decay from Open:</span>
          <strong style="text-align:right; color:${decayPts >= 0 ? '#10b981' : '#f43f5e'}">
            ₹${Math.abs(decayPts).toFixed(2)} (${decayPts >= 0 ? '-' : '+'}${Math.abs(decayPct)}%)
          </strong>
        </div>
      `;

      tooltip.style.display = "block";
      const tooltipW = 210;
      let tipLeft = mouseX + 16;
      if (tipLeft + tooltipW > rect.width) {
        tipLeft = mouseX - tooltipW - 16;
      }
      tooltip.style.left = Math.max(10, tipLeft) + "px";
      tooltip.style.top = Math.max(10, mouseY - 40) + "px";
    }

    function hideTooltip() {
      straddleState.hoveredIndex = -1;
      tooltip.style.display = "none";
      if (straddleState.data) {
        renderStraddleChart(straddleState.data);
      }
    }

    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseleave", hideTooltip);
    canvas.addEventListener("touchstart", handleMove, { passive: true });
    canvas.addEventListener("touchmove", handleMove, { passive: true });
    canvas.addEventListener("touchend", hideTooltip);
  }

  // ========================================================================
  // INTRADAY SNAPSHOTS TABLE
  // ========================================================================
  function renderStraddleTable(points) {
    const tbody = document.querySelector("#tableStraddleHistory tbody");
    if (!tbody) return;

    if (!points || points.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4">No intraday history records found.</td></tr>`;
      return;
    }

    const openPrice = points[0].price || 1;
    // Sample every 4th or 5th point to keep table sleek (~40-60 rows) while keeping latest points
    const step = Math.max(1, Math.floor(points.length / 50));
    const sampled = [];
    for (let i = points.length - 1; i >= 0; i -= step) {
      sampled.push(points[i]);
    }
    if (sampled[sampled.length - 1] !== points[0]) {
      sampled.push(points[0]);
    }

    tbody.innerHTML = sampled.map(p => {
      const decayPts = openPrice - p.price;
      const decayPct = (decayPts / openPrice * 100).toFixed(2);
      const isBleeding = decayPts > 0;
      const signal = isBleeding
        ? `<span class="p2-badge p2-badge-green">Theta Decay</span>`
        : `<span class="p2-badge p2-badge-red">IV Expansion</span>`;

      return `
        <tr>
          <td class="font-bold">${formatIstFull(p.time)}</td>
          <td class="text-right font-bold text-cyan">₹${p.price.toFixed(2)}</td>
          <td class="text-right text-green">₹${Number(p.spot).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
          <td class="text-right text-purple">₹${Number(p.synthetic_future).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
          <td class="text-right text-gold">₹${p.vwap.toFixed(2)}</td>
          <td class="text-right text-call">₹${p.ce_price.toFixed(2)}</td>
          <td class="text-right text-put">₹${p.pe_price.toFixed(2)}</td>
          <td class="text-right font-bold" style="color:${isBleeding ? '#10b981' : '#f43f5e'}">
            ${isBleeding ? '-' : '+'}₹${Math.abs(decayPts).toFixed(2)} (${decayPct}%)
          </td>
          <td class="text-center">${signal}</td>
        </tr>
      `;
    }).join("");
  }

  function downloadStraddleCsv() {
    if (!straddleState.data || !straddleState.data.points) {
      alert("No straddle data available to export.");
      return;
    }
    const points = straddleState.data.points;
    const openPrice = points[0].price || 1;

    let csv = "Time (UTC),Time (IST),Straddle Price,Spot,Synthetic Future,VWAP,Strike,CE LTP,PE LTP,Volume,Decay Pts\n";
    points.forEach(p => {
      const decayPts = (openPrice - p.price).toFixed(2);
      const ist = formatIstFull(p.time).replace(",", "");
      csv += `${p.time},${ist},${p.price},${p.spot},${p.synthetic_future},${p.vwap},${p.straddle_strike},${p.ce_price},${p.pe_price},${p.volume},${decayPts}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${straddleState.index}_Straddle_${straddleState.date || 'Live'}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ========================================================================
  // 🏛️ SECTION 4: FII / DII INSTITUTIONAL DESK CONTROLLER
  // ========================================================================
  let fiiDiiData = null;
  let currentFiiPeriod = "daily"; // "daily" | "monthly" | "yearly"
  let currentFiiView = "net";     // "net" | "fii" | "dii"
  let currentFiiRange = "30";     // "15" | "30" | "60" | "all"
  let fiiHoveredIndex = -1;
  let fiiCrosshairPos = null;     // { x, y }
  let fiiChartRows = [];

  function setupFiiDiiControls() {
    // Period buttons (Daily / Monthly / Yearly)
    const periodBtns = document.querySelectorAll(".fii-period-btn");
    periodBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        periodBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFiiPeriod = btn.getAttribute("data-period");
        renderFiiDiiView();
      });
    });

    // View buttons (Net / FII / DII)
    const viewBtns = document.querySelectorAll(".fii-view-btn");
    viewBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        viewBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFiiView = btn.getAttribute("data-view");
        renderFiiDiiView();
      });
    });

    // Range select
    const rangeSel = document.getElementById("fiiRangeSelect");
    if (rangeSel) {
      rangeSel.addEventListener("change", (e) => {
        currentFiiRange = e.target.value;
        renderFiiDiiView();
      });
    }

    // Search filter in table
    const searchInput = document.getElementById("fiiTableSearch");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        filterFiiTable(query);
      });
    }

    // CSV Export
    const exportBtn = document.getElementById("fiiExportCsvBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", exportFiiCsv);
    }

    // Refresh Button click
    const refreshBtn = document.getElementById("fiiRefreshBtn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        loadFiiDiiSuite(true);
      });
    }

    // Attach canvas crosshair mouse events
    const canvas = document.getElementById("chartFiiDiiCanvas");
    if (canvas) {
      canvas.addEventListener("mousemove", handleFiiCanvasMouseMove);
      canvas.addEventListener("mouseleave", handleFiiCanvasMouseLeave);
      window.addEventListener("resize", () => {
        if (currentSuite === "fiidii") renderFiiDiiChart();
      });
    }
  }

  let fiiAutoSyncInterval = null;

  async function loadFiiDiiSuite(isForce = false) {
    const refreshBtn = document.getElementById("fiiRefreshBtn");
    const refreshText = document.getElementById("fiiRefreshText");
    const refreshIcon = document.getElementById("fiiRefreshIcon");

    if (isForce && refreshBtn) {
      refreshBtn.disabled = true;
      if (refreshText) refreshText.textContent = "Syncing...";
      if (refreshIcon) refreshIcon.textContent = "⏳";
    }

    try {
      const url = isForce ? "/api/fii-dii-cash?refresh=true" : "/api/fii-dii-cash";
      const res = await fetch(url);
      const json = await res.json();
      if (json.ok) {
        fiiDiiData = json;
        const updatedBadge = document.getElementById("fiiLastUpdatedBadge");
        if (updatedBadge) {
          updatedBadge.textContent = json.lastUpdated ? `Updated: ${json.lastUpdated}` : "Updated: Just now";
        }
        renderFiiDiiView();
      }
    } catch (err) {
      console.error("Error loading FII/DII data:", err);
    } finally {
      if (isForce && refreshBtn) {
        setTimeout(() => {
          refreshBtn.disabled = false;
          if (refreshText) refreshText.textContent = "Refresh FII/DII";
          if (refreshIcon) refreshIcon.textContent = "🔄";
        }, 600);
      }
    }

    // Setup periodic 10-minute auto-sync timer while on this tab
    if (!fiiAutoSyncInterval) {
      fiiAutoSyncInterval = setInterval(() => {
        if (currentSuite === "fiidii") {
          loadFiiDiiSuite(false);
        }
      }, 10 * 60 * 1000);
    }
  }

  function getFiiActiveDataset() {
    if (!fiiDiiData) return [];
    let list = [];
    if (currentFiiPeriod === "daily") list = fiiDiiData.daily || [];
    else if (currentFiiPeriod === "monthly") list = fiiDiiData.monthly || [];
    else list = fiiDiiData.yearly || [];

    if (currentFiiRange !== "all") {
      const limit = parseInt(currentFiiRange, 10);
      if (!isNaN(limit)) list = list.slice(0, limit);
    }
    return list;
  }

  function renderFiiDiiView() {
    const list = getFiiActiveDataset();
    fiiChartRows = list;
    updateFiiMetricCards(list);
    renderFiiDiiChart();
    renderFiiDiiTable(list);
  }

  function updateFiiMetricCards(list) {
    if (!list || list.length === 0) return;
    const latest = list[0];
    const totalNet = Number(latest.totalNet || 0);
    const fiiNet = Number(latest.fiiNet || 0);
    const diiNet = Number(latest.diiNet || 0);

    const valTotEl = document.getElementById("fiiValTotal");
    if (valTotEl) {
      valTotEl.textContent = (totalNet > 0 ? "+₹" : "-₹") + Math.abs(totalNet).toLocaleString("en-IN", { maximumFractionDigits: 2 }) + " Cr";
      valTotEl.className = "metric-value " + (totalNet >= 0 ? "text-green" : "text-red");
    }
    const badgeTot = document.getElementById("fiiBadgeTotal");
    if (badgeTot) {
      badgeTot.textContent = totalNet >= 0 ? "BULLISH INFLOW" : "BEARISH OUTFLOW";
      badgeTot.className = "p2-badge " + (totalNet >= 0 ? "p2-badge-green" : "p2-badge-red");
    }

    const valFiiEl = document.getElementById("fiiValFii");
    if (valFiiEl) {
      valFiiEl.textContent = (fiiNet > 0 ? "+₹" : "-₹") + Math.abs(fiiNet).toLocaleString("en-IN", { maximumFractionDigits: 2 }) + " Cr";
      valFiiEl.className = "metric-value " + (fiiNet >= 0 ? "text-green" : "text-red");
    }
    const buyFii = document.getElementById("fiiBuyVal");
    const sellFii = document.getElementById("fiiSellVal");
    if (buyFii) buyFii.textContent = "₹" + Number(latest.fiiBuy || 0).toLocaleString("en-IN");
    if (sellFii) sellFii.textContent = "₹" + Number(latest.fiiSell || 0).toLocaleString("en-IN");

    const valDiiEl = document.getElementById("fiiValDii");
    if (valDiiEl) {
      valDiiEl.textContent = (diiNet > 0 ? "+₹" : "-₹") + Math.abs(diiNet).toLocaleString("en-IN", { maximumFractionDigits: 2 }) + " Cr";
      valDiiEl.className = "metric-value " + (diiNet >= 0 ? "text-green" : "text-red");
    }
    const buyDii = document.getElementById("diiBuyVal");
    const sellDii = document.getElementById("diiSellVal");
    if (buyDii) buyDii.textContent = "₹" + Number(latest.diiBuy || 0).toLocaleString("en-IN");
    if (sellDii) sellDii.textContent = "₹" + Number(latest.diiSell || 0).toLocaleString("en-IN");

    const valNifty = document.getElementById("fiiValNifty");
    const subNifty = document.getElementById("fiiSubNifty");
    const badgeNifty = document.getElementById("fiiBadgeNifty");
    if (valNifty && latest.niftyClose) valNifty.textContent = Number(latest.niftyClose).toLocaleString("en-IN", { minimumFractionDigits: 2 });
    if (subNifty && latest.niftyChange !== undefined) {
      subNifty.textContent = (latest.niftyChange > 0 ? "+" : "") + latest.niftyChange.toFixed(2) + " pts";
      subNifty.className = "metric-sub " + (latest.niftyChange >= 0 ? "text-green" : "text-red");
    }
    if (badgeNifty && latest.niftyPct !== undefined) {
      badgeNifty.textContent = (latest.niftyPct > 0 ? "+" : "") + latest.niftyPct.toFixed(2) + "%";
      badgeNifty.className = "p2-badge " + (latest.niftyPct >= 0 ? "p2-badge-green" : "p2-badge-red");
    }
  }

  function renderFiiDiiChart() {
    const canvas = document.getElementById("chartFiiDiiCanvas");
    if (!canvas || !fiiChartRows || fiiChartRows.length === 0) return;

    const container = document.getElementById("fiiChartContainer");
    const containerWidth = container.clientWidth || 900;
    const isLightMode = isLight();
    const colors = getThemeColors();

    const labelWidth = 100;
    const paddingRight = 90;
    const paddingTop = 45;
    const paddingBottom = 40;
    const rowHeight = 28;
    const barHeight = 16;
    const totalHeight = paddingTop + fiiChartRows.length * rowHeight + paddingBottom;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerWidth * dpr;
    canvas.height = totalHeight * dpr;
    canvas.style.width = containerWidth + "px";
    canvas.style.height = totalHeight + "px";

    const ctx = canvas.getContext("2d");
    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    // Dynamic Title update
    const periodLabel = currentFiiPeriod.toUpperCase();
    const viewLabel = currentFiiView === "net" ? "FII / FPI & DII Net" : (currentFiiView === "fii" ? "FII / FPI Net Flow" : "DII Domestic Net Flow");
    const titleEl = document.getElementById("fiiChartTitle");
    if (titleEl) titleEl.textContent = `${viewLabel} (in Crores.) - ${periodLabel}`;

    // Compute min and max values
    let valMin = 0;
    let valMax = 0;
    fiiChartRows.forEach(row => {
      let val = 0;
      if (currentFiiView === "net") val = Number(row.totalNet || 0);
      else if (currentFiiView === "fii") val = Number(row.fiiNet || 0);
      else val = Number(row.diiNet || 0);

      if (val < valMin) valMin = val;
      if (val > valMax) valMax = val;
    });

    const absMax = Math.max(Math.abs(valMin), Math.abs(valMax), 1000);
    const magnitude = Math.pow(10, Math.floor(Math.log10(absMax)));
    const ceilMax = Math.ceil(absMax / (magnitude / 2)) * (magnitude / 2);
    const xMin = -ceilMax;
    const xMax = ceilMax;
    const chartWidth = containerWidth - labelWidth - paddingRight;

    function xValToPx(v) {
      return labelWidth + ((v - xMin) / (xMax - xMin)) * chartWidth;
    }

    const zeroX = xValToPx(0);

    // Draw Vertical Grid Lines & X-Axis labels
    const stepCount = 8;
    const stepVal = (xMax - xMin) / stepCount;
    ctx.font = "10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    for (let i = 0; i <= stepCount; i++) {
      const v = xMin + i * stepVal;
      const gx = xValToPx(v);

      ctx.beginPath();
      ctx.strokeStyle = v === 0 ? (isLightMode ? "#0f172a" : "#ffffff") : colors.grid;
      ctx.lineWidth = v === 0 ? 1.5 : 1;
      if (v !== 0) ctx.setLineDash([4, 4]);
      else ctx.setLineDash([]);
      ctx.moveTo(gx, paddingTop - 10);
      ctx.lineTo(gx, totalHeight - paddingBottom + 5);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label at bottom
      ctx.fillStyle = v === 0 ? colors.textBright : colors.text;
      const fmtVal = Math.abs(v) >= 1000 ? (v / 1).toFixed(0) : v.toFixed(0);
      ctx.fillText(fmtVal, gx, totalHeight - paddingBottom + 8);
    }

    // Top X-axis label header
    ctx.fillStyle = colors.text;
    ctx.textAlign = "right";
    ctx.fillText("₹ in Crores ➔", containerWidth - paddingRight, 15);

    // Draw Bars for each row
    fiiChartRows.forEach((row, i) => {
      const yCenter = paddingTop + i * rowHeight + rowHeight / 2;
      const barTop = yCenter - barHeight / 2;
      const isHovered = (i === fiiHoveredIndex);

      let val = 0;
      if (currentFiiView === "net") val = Number(row.totalNet || 0);
      else if (currentFiiView === "fii") val = Number(row.fiiNet || 0);
      else val = Number(row.diiNet || 0);

      const targetX = xValToPx(val);
      const isPositive = val >= 0;

      // Draw Row Highlight if Hovered
      if (isHovered) {
        ctx.fillStyle = isLightMode ? "rgba(2, 132, 199, 0.08)" : "rgba(0, 229, 255, 0.08)";
        ctx.fillRect(0, paddingTop + i * rowHeight, containerWidth, rowHeight);
      }

      // Draw Date Label on Left
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.font = isHovered ? "bold 12px Inter, sans-serif" : "11px Inter, sans-serif";
      ctx.fillStyle = isHovered ? colors.teal : colors.text;
      const dateText = row.period || row.date || "";
      ctx.fillText(dateText, labelWidth - 12, yCenter);

      // Create Bar Gradient
      const barX = isPositive ? zeroX : targetX;
      const barW = Math.max(2, Math.abs(targetX - zeroX));

      ctx.save();
      const grad = ctx.createLinearGradient(zeroX, barTop, targetX, barTop);
      if (isPositive) {
        grad.addColorStop(0, "#059669");
        grad.addColorStop(1, "#10b981");
        if (isHovered) {
          ctx.shadowColor = "rgba(16, 185, 129, 0.7)";
          ctx.shadowBlur = 12;
        }
      } else {
        grad.addColorStop(0, "#e11d48");
        grad.addColorStop(1, "#f43f5e");
        if (isHovered) {
          ctx.shadowColor = "rgba(244, 63, 94, 0.7)";
          ctx.shadowBlur = 12;
        }
      }

      ctx.fillStyle = grad;
      const radius = 3;
      ctx.beginPath();
      if (isPositive) {
        ctx.roundRect(barX, barTop, barW, barHeight, [0, radius, radius, 0]);
      } else {
        ctx.roundRect(barX, barTop, barW, barHeight, [radius, 0, 0, radius]);
      }
      ctx.fill();
      ctx.restore();

      // Value label near bar tip
      ctx.font = isHovered ? "bold 11px JetBrains Mono, monospace" : "10px JetBrains Mono, monospace";
      ctx.fillStyle = isPositive ? (isLightMode ? "#059669" : "#34d399") : (isLightMode ? "#e11d48" : "#f87171");
      ctx.textBaseline = "middle";
      const sign = val > 0 ? "+" : "";
      const valStr = `${sign}${val.toLocaleString("en-IN", { maximumFractionDigits: 1 })}`;

      if (isPositive) {
        ctx.textAlign = "left";
        ctx.fillText(valStr, targetX + 8, yCenter);
      } else {
        ctx.textAlign = "right";
        ctx.fillText(valStr, targetX - 8, yCenter);
      }
    });

    // Draw Crosshair if Active
    if (fiiHoveredIndex >= 0 && fiiCrosshairPos) {
      const activeY = paddingTop + fiiHoveredIndex * rowHeight + rowHeight / 2;
      const mouseX = Math.max(labelWidth, Math.min(containerWidth - paddingRight, fiiCrosshairPos.x));

      ctx.save();
      ctx.strokeStyle = colors.teal;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 4]);

      // Horizontal guideline
      ctx.beginPath();
      ctx.moveTo(labelWidth, activeY);
      ctx.lineTo(containerWidth - paddingRight, activeY);
      ctx.stroke();

      // Vertical guideline
      ctx.beginPath();
      ctx.moveTo(mouseX, paddingTop - 10);
      ctx.lineTo(mouseX, totalHeight - paddingBottom + 5);
      ctx.stroke();

      // Value pill on X-axis tracking cursor
      const cursorVal = xMin + ((mouseX - labelWidth) / chartWidth) * (xMax - xMin);
      const pillText = (cursorVal >= 0 ? "+" : "") + cursorVal.toFixed(0) + " Cr";
      ctx.font = "bold 10px JetBrains Mono, monospace";
      const textW = ctx.measureText(pillText).width;
      const pillW = textW + 12;
      const pillH = 18;
      const pillX = mouseX - pillW / 2;
      const pillY = totalHeight - paddingBottom + 5;

      ctx.setLineDash([]);
      ctx.fillStyle = colors.teal;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 4);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(pillText, mouseX, pillY + pillH / 2);

      ctx.restore();
    }
  }

  function handleFiiCanvasMouseMove(e) {
    const canvas = document.getElementById("chartFiiDiiCanvas");
    if (!canvas || !fiiChartRows || fiiChartRows.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const paddingTop = 45;
    const rowHeight = 28;
    const idx = Math.floor((mouseY - paddingTop) / rowHeight);

    if (idx >= 0 && idx < fiiChartRows.length) {
      fiiHoveredIndex = idx;
      fiiCrosshairPos = { x: mouseX, y: mouseY };
      renderFiiDiiChart();
      updateFiiTooltip(e.clientX, e.clientY, fiiChartRows[idx]);
      highlightFiiTableRow(idx);
    } else {
      handleFiiCanvasMouseLeave();
    }
  }

  function handleFiiCanvasMouseLeave() {
    fiiHoveredIndex = -1;
    fiiCrosshairPos = null;
    renderFiiDiiChart();
    const tooltip = document.getElementById("fiiCrosshairTooltip");
    if (tooltip) tooltip.style.display = "none";
    highlightFiiTableRow(-1);
  }

  function updateFiiTooltip(clientX, clientY, row) {
    const tooltip = document.getElementById("fiiCrosshairTooltip");
    if (!tooltip || !row) return;

    const container = document.getElementById("fiiChartContainer");
    const containerRect = container.getBoundingClientRect();
    const relX = clientX - containerRect.left;
    const relY = clientY - containerRect.top;

    const totalNet = Number(row.totalNet || 0);
    const fiiNet = Number(row.fiiNet || 0);
    const diiNet = Number(row.diiNet || 0);
    const fiiBuy = Number(row.fiiBuy || 0);
    const fiiSell = Number(row.fiiSell || 0);
    const diiBuy = Number(row.diiBuy || 0);
    const diiSell = Number(row.diiSell || 0);
    const niftyClose = row.niftyClose ? Number(row.niftyClose).toFixed(2) : "--";
    const niftyPct = row.niftyPct !== undefined ? (row.niftyPct > 0 ? `+${row.niftyPct}%` : `${row.niftyPct}%`) : "";

    const totClass = totalNet >= 0 ? "text-green" : "text-red";
    const fiiClass = fiiNet >= 0 ? "text-green" : "text-red";
    const diiClass = diiNet >= 0 ? "text-green" : "text-red";

    tooltip.innerHTML = `
      <div class="fii-tooltip-date">
        <span>📅 ${row.period || row.date}</span>
        <span style="font-size:11px; font-weight:700; color:var(--p2-text-bright);">${niftyClose} (${niftyPct})</span>
      </div>
      <div class="fii-tooltip-row">
        <span class="label">Combined Net:</span>
        <span class="val ${totClass}">${totalNet > 0 ? "+" : ""}₹${totalNet.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr</span>
      </div>
      <div class="fii-tooltip-row">
        <span class="label">FII/FPI Net:</span>
        <span class="val ${fiiClass}">${fiiNet > 0 ? "+" : ""}₹${fiiNet.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr</span>
      </div>
      <div class="fii-tooltip-row" style="font-size:10px; opacity:0.8;">
        <span class="label">FII Gross:</span>
        <span>Buy: ₹${fiiBuy.toLocaleString("en-IN")} | Sell: ₹${fiiSell.toLocaleString("en-IN")}</span>
      </div>
      <div class="fii-tooltip-row" style="margin-top:4px;">
        <span class="label">DII Domestic Net:</span>
        <span class="val ${diiClass}">${diiNet > 0 ? "+" : ""}₹${diiNet.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr</span>
      </div>
      <div class="fii-tooltip-row" style="font-size:10px; opacity:0.8;">
        <span class="label">DII Gross:</span>
        <span>Buy: ₹${diiBuy.toLocaleString("en-IN")} | Sell: ₹${diiSell.toLocaleString("en-IN")}</span>
      </div>
    `;

    tooltip.style.display = "block";
    let left = relX + 20;
    if (left + 260 > containerRect.width) {
      left = relX - 270;
    }
    let top = relY - 40;
    if (top < 10) top = 10;
    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";
  }

  function renderFiiDiiTable(list) {
    const tbody = document.getElementById("fiiTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const periodLabel = currentFiiPeriod.toUpperCase();
    const tableTitle = document.getElementById("fiiTableTitle");
    if (tableTitle) tableTitle.textContent = `FII/FPI & DII Net Buy/Sell Data - ${periodLabel}`;

    list.forEach((row, idx) => {
      const tr = document.createElement("tr");
      tr.setAttribute("data-row-idx", idx);

      const tot = Number(row.totalNet || 0);
      const fii = Number(row.fiiNet || 0);
      const dii = Number(row.diiNet || 0);
      const niftyClose = row.niftyClose ? Number(row.niftyClose).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "--";
      const niftyPct = row.niftyPct !== undefined ? (row.niftyPct >= 0 ? `+${row.niftyPct}%` : `${row.niftyPct}%`) : "";
      const niftyClass = (row.niftyPct || 0) >= 0 ? "text-green" : "text-red";

      let actionText = "Neutral";
      let actionClass = "divergent";
      if (fii > 0 && dii > 0) { actionText = "Both Buying"; actionClass = "bullish"; }
      else if (fii < 0 && dii < 0) { actionText = "Both Selling"; actionClass = "bearish"; }
      else if (fii < 0 && dii > 0) { actionText = "DII Absorbing"; actionClass = "bullish"; }
      else if (fii > 0 && dii < 0) { actionText = "FII Dominance"; actionClass = "bullish"; }

      tr.innerHTML = `
        <td><strong>${row.period || row.date}</strong></td>
        <td class="text-right"><strong class="${niftyClass}">${niftyClose}</strong> <span style="font-size:10px;" class="${niftyClass}">(${niftyPct})</span></td>
        <td class="text-right"><strong class="${tot >= 0 ? 'text-green' : 'text-red'}">${tot > 0 ? '+' : ''}${tot.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong></td>
        <td class="text-right">₹${Number(row.fiiBuy || 0).toLocaleString('en-IN')}</td>
        <td class="text-right">₹${Number(row.fiiSell || 0).toLocaleString('en-IN')}</td>
        <td class="text-right"><strong class="${fii >= 0 ? 'text-green' : 'text-red'}">${fii > 0 ? '+' : ''}${fii.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong></td>
        <td class="text-right">₹${Number(row.diiBuy || 0).toLocaleString('en-IN')}</td>
        <td class="text-right">₹${Number(row.diiSell || 0).toLocaleString('en-IN')}</td>
        <td class="text-right"><strong class="${dii >= 0 ? 'text-green' : 'text-red'}">${dii > 0 ? '+' : ''}${dii.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong></td>
        <td class="text-center"><span class="fii-action-pill ${actionClass}">${actionText}</span></td>
      `;

      tr.addEventListener("mouseenter", () => {
        fiiHoveredIndex = idx;
        const canvas = document.getElementById("chartFiiDiiCanvas");
        if (canvas) {
          const paddingTop = 45;
          const rowHeight = 28;
          fiiCrosshairPos = { x: canvas.clientWidth / 2, y: paddingTop + idx * rowHeight + rowHeight / 2 };
          renderFiiDiiChart();
          highlightFiiTableRow(idx);
        }
      });
      tr.addEventListener("mouseleave", () => {
        handleFiiCanvasMouseLeave();
      });

      tbody.appendChild(tr);
    });
  }

  function highlightFiiTableRow(idx) {
    const rows = document.querySelectorAll("#tableFiiDiiData tbody tr");
    rows.forEach(r => {
      if (parseInt(r.getAttribute("data-row-idx"), 10) === idx) {
        r.classList.add("highlight-bar");
      } else {
        r.classList.remove("highlight-bar");
      }
    });
  }

  function filterFiiTable(query) {
    const rows = document.querySelectorAll("#tableFiiDiiData tbody tr");
    rows.forEach(r => {
      const text = r.textContent.toLowerCase();
      r.style.display = text.includes(query) ? "" : "none";
    });
  }

  function exportFiiCsv() {
    if (!fiiChartRows || fiiChartRows.length === 0) return;
    let csv = "Date,NIFTY 50,NIFTY Pct,Combined Net (Cr),FII Buy (Cr),FII Sell (Cr),FII Net (Cr),DII Buy (Cr),DII Sell (Cr),DII Net (Cr)\n";
    fiiChartRows.forEach(r => {
      csv += `"${r.period || r.date}",${r.niftyClose || ''},${r.niftyPct || ''},${r.totalNet || ''},${r.fiiBuy || ''},${r.fiiSell || ''},${r.fiiNet || ''},${r.diiBuy || ''},${r.diiSell || ''},${r.diiNet || ''}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FII_DII_${currentFiiPeriod.toUpperCase()}_Data_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ========================================================================
  // SECTION 5: INDEX BREADTH & STOCK WEIGHT CONTRIBUTION DESK
  // ========================================================================
  // Use IST (UTC+5:30) for today's date — toISOString() gives UTC which can be yesterday before 05:30 IST
  const _todayStr = (() => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST = UTC + 5h30m
    const istNow = new Date(now.getTime() + istOffset);
    return istNow.toISOString().slice(0, 10);
  })();
  let currentContribIndex = "nifty50";
  let currentContribDate = _todayStr;
  let currentContribSector = "ALL";
  let currentContribSearch = "";
  let contribDataCache = null;
  let contribTimeline = [];
  let activeContribHoverIndex = -1;

  function initBreadthContribution() {
    // Date picker input
    const dateInput = document.getElementById("contribDateInput");
    if (dateInput) {
      dateInput.value = currentContribDate;
      dateInput.addEventListener("change", (e) => {
        currentContribDate = e.target.value || _todayStr;
        loadBreadthContributionSuite(currentContribIndex, currentContribDate);
      });
    }

    // Index selector buttons
    const idxBtns = document.querySelectorAll("#contribIndexGroup .contrib-index-btn");
    idxBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        idxBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentContribIndex = btn.getAttribute("data-index");
        loadBreadthContributionSuite(currentContribIndex, currentContribDate);
      });
    });

    // Refresh button
    const refBtn = document.getElementById("contribRefreshBtn");
    if (refBtn) {
      refBtn.addEventListener("click", () => {
        loadBreadthContributionSuite(currentContribIndex, currentContribDate, true);
      });
    }

    // Sector tags
    const sectorTags = document.querySelectorAll("#contribSectorFilters .contrib-sector-tag");
    sectorTags.forEach(tag => {
      tag.addEventListener("click", () => {
        sectorTags.forEach(t => t.classList.remove("active"));
        tag.classList.add("active");
        currentContribSector = tag.getAttribute("data-sector");
        renderContributionTables();
      });
    });

    // Symbol Search input
    const searchInput = document.getElementById("contribSymbolSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        currentContribSearch = (e.target.value || "").trim().toLowerCase();
        renderContributionTables();
      });
    }

    // Setup Canvas interaction
    setupContribCanvasEvents();

    // Auto-refresh live data every 45 seconds if viewing today's session
    if (!window._contribAutoRefreshTimer) {
      window._contribAutoRefreshTimer = setInterval(() => {
        const isContribActive = (typeof currentSuite !== "undefined" && currentSuite === "contribution") ||
                                (document.getElementById("p2ViewContribution")?.style.display !== "none");
        if (isContribActive) {
          const isToday = !currentContribDate || currentContribDate === _todayStr;
          if (isToday) {
            loadBreadthContributionSuite(currentContribIndex, currentContribDate, true);
          }
        }
      }, 45000);
    }
  }

  async function loadBreadthContributionSuite(indexKey = "nifty50", dateStr = null, isRefresh = false) {
    try {
      const effDate = dateStr || currentContribDate || _todayStr;
      const url = `/api/index-breadth-contribution?index=${encodeURIComponent(indexKey)}&date=${encodeURIComponent(effDate)}${isRefresh ? '&refresh=true' : ''}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      if (!data.ok) throw new Error("API returned ok: false");

      contribDataCache = data;
      contribTimeline = data.timeline || [];

      // Update Date elements
      const displayDate = data.displayDate || "18-Sep-2026";
      const dateBadge = document.getElementById("contribDateDisplayBadge");
      const dateInput = document.getElementById("contribDateInput");
      if (dateBadge) dateBadge.textContent = displayDate;
      if (dateInput && data.date) dateInput.value = data.date;

      // Update spot pill
      const idxInfo = data.indexInfo || {};
      const spotTitle = document.getElementById("contribSpotTitle");
      const spotVal = document.getElementById("contribSpotVal");
      const spotChg = document.getElementById("contribSpotChg");
      const niftyTitle = document.getElementById("niftyChartTitle");
      const breadthTitle = document.getElementById("contribBreadthTitle");
      const breadthMeta = document.getElementById("contribBreadthMeta");
      const niftyMeta = document.getElementById("contribNiftyMeta");

      if (spotTitle) spotTitle.textContent = idxInfo.name || "NIFTY 50";
      if (breadthTitle) breadthTitle.textContent = `Intraday Breadth (${displayDate})`;
      if (niftyTitle) niftyTitle.textContent = `Index Spot Chart (${displayDate})`;
      if (spotVal) spotVal.textContent = Number(idxInfo.spot || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      if (spotChg) {
        const isUp = (idxInfo.change || 0) >= 0;
        const sign = isUp ? "+" : "";
        spotChg.className = `spot-chg ${isUp ? 'text-green' : 'text-red'}`;
        spotChg.textContent = `${sign}${idxInfo.change || 0} (${sign}${idxInfo.changePct || 0}%)`;
      }

      const summary = data.summary || {};
      if (breadthMeta) {
        const scrips = (idxInfo.name || "").includes("BANK") ? "12/12 scrips" : "50/50 scrips";
        breadthMeta.textContent = `${idxInfo.name || "Nifty 50"} | one minute | ${scrips}`;
      }
      if (niftyMeta) {
        niftyMeta.textContent = `${idxInfo.name || "Nifty 50"} | one minute | Spot & VWAP`;
      }

      // Update Breadth Header Metrics Bar (Matching Page 1 exactly)
      const bSum = data.breadthSummary || {};
      const latestBreadthEl = document.getElementById("contribLatestBreadth");
      const openBreadthEl = document.getElementById("contribOpenBreadth");
      const breadthChgEl = document.getElementById("contribBreadthChange");
      const changeMetricEl = document.getElementById("contribChangeMetric");
      const xoCountEl = document.getElementById("contribXoCount");

      if (latestBreadthEl) latestBreadthEl.textContent = bSum.latestBreadth !== undefined ? `${Number(bSum.latestBreadth).toFixed(2)}%` : "--";
      if (openBreadthEl) openBreadthEl.textContent = bSum.openBreadth !== undefined ? `${Number(bSum.openBreadth).toFixed(2)}%` : "--";
      if (breadthChgEl) {
        const chg = bSum.change;
        const sign = (chg || 0) >= 0 ? "+" : "";
        breadthChgEl.textContent = chg !== undefined ? `${sign}${Number(chg).toFixed(2)} pts` : "--";
        if (changeMetricEl) {
          changeMetricEl.classList.toggle("positive", Number(chg) >= 0);
          changeMetricEl.classList.toggle("negative", Number(chg) < 0);
        }
      }
      if (xoCountEl) xoCountEl.textContent = `${bSum.x || 0} / ${bSum.o || 0}`;

      // Update Index Spot Header Metrics Bar
      const niftySpotValEl = document.getElementById("contribNiftySpotVal");
      const niftyChgValEl = document.getElementById("contribNiftyChgVal");
      const niftyChgMetricEl = document.getElementById("contribNiftyChgMetric");
      if (niftySpotValEl) niftySpotValEl.textContent = Number(idxInfo.spot || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      if (niftyChgValEl) {
        const isUp = (idxInfo.change || 0) >= 0;
        const sign = isUp ? "+" : "";
        niftyChgValEl.textContent = `${sign}${Number(idxInfo.change || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${sign}${idxInfo.changePct || 0}%)`;
        if (niftyChgMetricEl) {
          niftyChgMetricEl.classList.toggle("positive", isUp);
          niftyChgMetricEl.classList.toggle("negative", !isUp);
        }
      }

      // Update Summary Card & Split Bar
      const netBadge = document.getElementById("contribNetPtsBadge");
      const splitDrag = document.getElementById("contribSplitBarDrag");
      const splitSupport = document.getElementById("contribSplitBarSupport");
      const dragPtsLabel = document.getElementById("contribDragPtsLabel");
      const supportPtsLabel = document.getElementById("contribSupportPtsLabel");

      if (netBadge) {
        const isNetPos = (summary.netPoints || 0) >= 0;
        const sign = isNetPos ? "+" : "";
        netBadge.className = `contrib-net-badge ${isNetPos ? 'text-green' : 'text-red'}`;
        netBadge.textContent = `Net ${sign}${summary.netPoints || 0} pts`;
      }

      const dragPct = summary.dragRatioPct || 34.9;
      const supportPct = summary.supportRatioPct || 65.1;
      if (splitDrag) {
        splitDrag.style.width = `${dragPct}%`;
        splitDrag.title = `Decliners dragging ${dragPct}% (${summary.draggingPoints} pts)`;
      }
      if (splitSupport) {
        splitSupport.style.width = `${supportPct}%`;
        splitSupport.title = `Advancers supporting ${supportPct}% (+${summary.supportingPoints} pts)`;
      }

      if (dragPtsLabel) dragPtsLabel.textContent = `${summary.draggingPoints || 0}`;
      if (supportPtsLabel) supportPtsLabel.textContent = `+${summary.supportingPoints || 0}`;

      // Render Tables
      renderContributionTables();

      // Render Dual Synchronized Charts (Exact Page 1 Breadth Styling)
      renderIntradayBreadthChart(contribTimeline);
      renderIntradayIndexChart(contribTimeline, idxInfo);

    } catch (err) {
      console.error("Failed to load Breadth Contribution suite:", err);
    }
  }

  function renderContributionTables() {
    if (!contribDataCache) return;

    let dragging = contribDataCache.draggingDown || [];
    let supporting = contribDataCache.supportingUp || [];

    // Filter by sector if not ALL
    if (currentContribSector !== "ALL") {
      dragging = dragging.filter(s => (s.sector || "").toLowerCase().includes(currentContribSector.toLowerCase()));
      supporting = supporting.filter(s => (s.sector || "").toLowerCase().includes(currentContribSector.toLowerCase()));
    }

    // Filter by search query
    if (currentContribSearch) {
      dragging = dragging.filter(s => (s.symbol || "").toLowerCase().includes(currentContribSearch) || (s.name || "").toLowerCase().includes(currentContribSearch));
      supporting = supporting.filter(s => (s.symbol || "").toLowerCase().includes(currentContribSearch) || (s.name || "").toLowerCase().includes(currentContribSearch));
    }

    // Update headers
    const dragCountEl = document.getElementById("contribDragStockCount");
    const dragPtsEl = document.getElementById("contribDragHeaderPts");
    const supportCountEl = document.getElementById("contribSupportStockCount");
    const supportPtsEl = document.getElementById("contribSupportHeaderPts");

    const filteredDragSum = dragging.reduce((acc, s) => acc + (s.contribution || 0), 0);
    const filteredSupportSum = supporting.reduce((acc, s) => acc + (s.contribution || 0), 0);

    if (dragCountEl) dragCountEl.textContent = `${dragging.length} stocks`;
    if (dragPtsEl) dragPtsEl.textContent = filteredDragSum.toFixed(2);
    if (supportCountEl) supportCountEl.textContent = `${supporting.length} stocks`;
    if (supportPtsEl) supportPtsEl.textContent = `+${filteredSupportSum.toFixed(2)}`;

    // Populate Pulling Down Table
    const tbodyDown = document.getElementById("tbodyPullingDown");
    if (tbodyDown) {
      tbodyDown.innerHTML = "";
      dragging.forEach(stock => {
        const tr = document.createElement("tr");
        if (stock.isHighlighted) tr.classList.add("row-highlight-amber");

        const ltpFmt = Number(stock.ltp || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const chgFmt = Number(stock.change || 0).toFixed(2);
        const chgPctFmt = `${Number(stock.changePct || 0).toFixed(2)}%`;
        const contribFmt = Number(stock.contribution || 0).toFixed(2);
        const barW = Math.max(4, Math.min(100, stock.barPct || 0));

        tr.innerHTML = `
          <td><strong>${stock.symbol}</strong></td>
          <td class="text-right font-mono">${ltpFmt}</td>
          <td class="text-right font-mono text-red">${chgFmt}</td>
          <td class="text-right font-mono text-red">${chgPctFmt}</td>
          <td class="text-right">
            <div class="contrib-impact-cell">
              <span class="font-mono text-red font-bold">${contribFmt}</span>
              <span class="contrib-mini-track"><span class="contrib-mini-fill red" style="width:${barW}%;"></span></span>
            </div>
          </td>
        `;
        tbodyDown.appendChild(tr);
      });
    }

    // Populate Supporting Table
    const tbodyUp = document.getElementById("tbodySupporting");
    if (tbodyUp) {
      tbodyUp.innerHTML = "";
      supporting.forEach(stock => {
        const tr = document.createElement("tr");
        if (stock.isHighlighted) tr.classList.add("row-highlight-amber");

        const ltpFmt = Number(stock.ltp || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const chgFmt = `+${Number(stock.change || 0).toFixed(2)}`;
        const chgPctFmt = `+${Number(stock.changePct || 0).toFixed(2)}%`;
        const contribFmt = `+${Number(stock.contribution || 0).toFixed(2)}`;
        const barW = Math.max(4, Math.min(100, stock.barPct || 0));

        tr.innerHTML = `
          <td><strong>${stock.symbol}</strong></td>
          <td class="text-right font-mono">${ltpFmt}</td>
          <td class="text-right font-mono text-green">${chgFmt}</td>
          <td class="text-right font-mono text-green">${chgPctFmt}</td>
          <td class="text-right">
            <div class="contrib-impact-cell">
              <span class="font-mono text-green font-bold">${contribFmt}</span>
              <span class="contrib-mini-track"><span class="contrib-mini-fill green" style="width:${barW}%;"></span></span>
            </div>
          </td>
        `;
        tbodyUp.appendChild(tr);
      });
    }
  }

  // ========================================================================
  // DUAL SYNCHRONIZED CANVASES (EXACT PAGE 1 BREADTH STYLING)
  // ========================================================================
  const CHART_PADDING = { top: 15, right: 15, bottom: 25, left: 45 };

  function renderIntradayBreadthChart(timeline) {
    const canvas = document.getElementById("chartIntradayBreadthCanvas");
    if (!canvas || !timeline || timeline.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const bgColor = "#0c121e";
    const textColor = "#94a3b8";
    const gridColor = "#1e293d";
    const axisColor = "#cbd5e1";

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    const pad = CHART_PADDING;
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    // Draw 0, 25, 50, 75, 100% Horizontal Grid lines (Exact Page 1 style)
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.fillStyle = textColor;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    [0, 25, 50, 75, 100].forEach((level) => {
      const y = pad.top + plotH - (level / 100.0) * plotH;
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.setLineDash(level === 25 || level === 50 || level === 75 ? [4, 4] : []);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
      ctx.fillText(`${level}%`, pad.left - 6, y);
    });
    ctx.setLineDash([]);

    // Solid Axis lines on left and bottom
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, h - pad.bottom);
    ctx.lineTo(w - pad.right, h - pad.bottom);
    ctx.stroke();

    const xFor = (index) => pad.left + (index / (timeline.length - 1)) * plotW;
    const yFor = (value) => pad.top + plotH - (Math.max(0, Math.min(100, value)) / 100.0) * plotH;

    // 1. Fill Area with Sky Blue Gradient (Exact Page 1 style)
    let started = false;
    ctx.beginPath();
    timeline.forEach((point, index) => {
      if (point.breadth === null || point.breadth === undefined) return;
      const x = xFor(index);
      const y = yFor(point.breadth);
      if (!started) {
        ctx.moveTo(x, pad.top + plotH);
        ctx.lineTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    });
    if (started) {
      ctx.lineTo(xFor(timeline.length - 1), pad.top + plotH);
      ctx.closePath();
      const areaGrad = ctx.createLinearGradient(0, pad.top, 0, pad.top + plotH);
      areaGrad.addColorStop(0, "rgba(56, 189, 248, 0.22)");
      areaGrad.addColorStop(1, "rgba(56, 189, 248, 0.01)");
      ctx.fillStyle = areaGrad;
      ctx.fill();
    }

    // 2. Draw Breadth % Line (Sky Blue #38bdf8, 2.2px)
    ctx.save();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    started = false;
    timeline.forEach((point, index) => {
      if (point.breadth === null || point.breadth === undefined) return;
      const x = xFor(index);
      const y = yFor(point.breadth);
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    });
    if (started) ctx.stroke();
    ctx.restore();

    // 3. Draw 20 SMA Line (Amber #f59e0b, 2.0px with subtle glow)
    ctx.save();
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2.0;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.shadowColor = "rgba(245, 158, 11, 0.35)";
    ctx.shadowBlur = 4;
    ctx.beginPath();
    started = false;
    timeline.forEach((point, index) => {
      if (point.ma === null || point.ma === undefined) return;
      const x = xFor(index);
      const y = yFor(point.ma);
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    });
    if (started) ctx.stroke();
    ctx.restore();

    // 4. X-Axis Time Labels
    function formatTimeShort(val) {
      if (!val) return "--";
      const s = String(val);
      const m = s.match(/T?(\d{2}:\d{2})/);
      return m ? m[1] : (s.length >= 5 ? s.slice(0, 5) : s);
    }

    ctx.fillStyle = textColor;
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText(formatTimeShort(timeline[0].time), pad.left, h - pad.bottom + 6);
    ctx.textAlign = "right";
    ctx.fillText(formatTimeShort(timeline[timeline.length - 1].time), w - pad.right, h - pad.bottom + 6);

    // Mid-day milestone markers
    ctx.textAlign = "center";
    ["11:30", "13:30"].forEach(tStr => {
      const idx = timeline.findIndex(p => String(p.time).includes(tStr) || p.displayTime === tStr);
      if (idx > 0) {
        ctx.fillText(tStr, xFor(idx), h - pad.bottom + 6);
      }
    });

    // 5. Crosshair on hover
    if (activeContribHoverIndex >= 0 && activeContribHoverIndex < timeline.length) {
      const pt = timeline[activeContribHoverIndex];
      const cx = xFor(activeContribHoverIndex);
      const cyBreadth = yFor(pt.breadth);
      const cyMa = yFor(pt.ma !== null && pt.ma !== undefined ? pt.ma : pt.breadth);

      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cx, pad.top);
      ctx.lineTo(cx, pad.top + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Blue dot on Breadth %
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(cx, cyBreadth, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Amber dot on 20 SMA
      if (pt.ma !== null && pt.ma !== undefined) {
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.arc(cx, cyMa, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function renderIntradayIndexChart(timeline, idxInfo) {
    const canvas = document.getElementById("chartIntradayNiftyCanvas");
    if (!canvas || !timeline || timeline.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const bgColor = "#0c121e";
    const textColor = "#94a3b8";
    const gridColor = "#1e293d";
    const axisColor = "#cbd5e1";

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    const pad = { top: 15, right: 15, bottom: 25, left: 60 };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    let minSpot = Infinity;
    let maxSpot = -Infinity;
    timeline.forEach(pt => {
      const s = Number(pt.spot || pt.close);
      if (s < minSpot) minSpot = s;
      if (s > maxSpot) maxSpot = s;
      if (pt.vwap) {
        const v = Number(pt.vwap);
        if (v < minSpot) minSpot = v;
        if (v > maxSpot) maxSpot = v;
      }
    });

    const span = Math.max(10, maxSpot - minSpot);
    const yMin = minSpot - span * 0.08;
    const yMax = maxSpot + span * 0.08;

    const xFor = (index) => pad.left + (index / (timeline.length - 1)) * plotW;
    const yFor = (value) => pad.top + plotH - ((value - yMin) / (yMax - yMin)) * plotH;

    // Y Axis Price Steps (Exact Page 1 style)
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.fillStyle = textColor;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    for (let i = 0; i <= 4; i++) {
      const val = yMin + ((yMax - yMin) * i) / 4.0;
      const y = yFor(val);
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
      ctx.fillText(Number(val).toLocaleString('en-IN', { maximumFractionDigits: 0 }), pad.left - 6, y);
    }

    // Solid Axis lines on left and bottom
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, h - pad.bottom);
    ctx.lineTo(w - pad.right, h - pad.bottom);
    ctx.stroke();

    // 1. VWAP Line (Amber dashed #f59e0b)
    ctx.save();
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 1.6;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    let started = false;
    timeline.forEach((point, index) => {
      if (!point.vwap) return;
      const x = xFor(index);
      const y = yFor(point.vwap);
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    });
    if (started) ctx.stroke();
    ctx.restore();

    // 2. Spot Price Area Gradient Fill
    ctx.beginPath();
    started = false;
    timeline.forEach((point, index) => {
      const s = Number(point.spot || point.close);
      const x = xFor(index);
      const y = yFor(s);
      if (!started) {
        ctx.moveTo(x, pad.top + plotH);
        ctx.lineTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    });
    if (started) {
      ctx.lineTo(xFor(timeline.length - 1), pad.top + plotH);
      ctx.closePath();
      const gradSpot = ctx.createLinearGradient(0, pad.top, 0, pad.top + plotH);
      gradSpot.addColorStop(0, "rgba(56, 189, 248, 0.22)");
      gradSpot.addColorStop(1, "rgba(56, 189, 248, 0.01)");
      ctx.fillStyle = gradSpot;
      ctx.fill();
    }

    // 3. Spot Price Curve (Sky Blue #38bdf8, 2.2px)
    ctx.save();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    started = false;
    timeline.forEach((point, index) => {
      const s = Number(point.spot || point.close);
      const x = xFor(index);
      const y = yFor(s);
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    });
    if (started) ctx.stroke();
    ctx.restore();

    // 4. X-Axis Time Labels
    function formatTimeShort(val) {
      if (!val) return "--";
      const s = String(val);
      const m = s.match(/T?(\d{2}:\d{2})/);
      return m ? m[1] : (s.length >= 5 ? s.slice(0, 5) : s);
    }

    ctx.fillStyle = textColor;
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText(formatTimeShort(timeline[0].time), pad.left, h - pad.bottom + 6);
    ctx.textAlign = "right";
    ctx.fillText(formatTimeShort(timeline[timeline.length - 1].time), w - pad.right, h - pad.bottom + 6);

    ctx.textAlign = "center";
    ["11:30", "13:30"].forEach(tStr => {
      const idx = timeline.findIndex(p => String(p.time).includes(tStr) || p.displayTime === tStr);
      if (idx > 0) {
        ctx.fillText(tStr, xFor(idx), h - pad.bottom + 6);
      }
    });

    // 5. Crosshair on hover
    if (activeContribHoverIndex >= 0 && activeContribHoverIndex < timeline.length) {
      const pt = timeline[activeContribHoverIndex];
      const cx = xFor(activeContribHoverIndex);
      const cySpot = yFor(pt.spot);
      const cyVwap = yFor(pt.vwap || pt.spot);

      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cx, pad.top);
      ctx.lineTo(cx, pad.top + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(cx, cySpot, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(cx, cyVwap, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function setupContribCanvasEvents() {
    const breadthCanvas = document.getElementById("chartIntradayBreadthCanvas");
    const niftyCanvas = document.getElementById("chartIntradayNiftyCanvas");

    function handleMouseMove(e, srcCanvas) {
      if (!contribTimeline || contribTimeline.length === 0) return;
      const rect = srcCanvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const padLeft = srcCanvas === breadthCanvas ? 45 : 60;
      const padRight = 15;
      const drawW = rect.width - padLeft - padRight;
      const relX = mouseX - padLeft;
      const ratio = Math.max(0, Math.min(1, relX / drawW));
      const idx = Math.round(ratio * (contribTimeline.length - 1));

      activeContribHoverIndex = idx;
      renderIntradayBreadthChart(contribTimeline);
      renderIntradayIndexChart(contribTimeline, contribDataCache ? contribDataCache.indexInfo : null);

      updateContribTooltips(idx, mouseX);
    }

    function handleMouseLeave() {
      activeContribHoverIndex = -1;
      renderIntradayBreadthChart(contribTimeline);
      renderIntradayIndexChart(contribTimeline, contribDataCache ? contribDataCache.indexInfo : null);

      const bTip = document.getElementById("breadthCrosshairTooltip");
      const nTip = document.getElementById("niftyCrosshairTooltip");
      if (bTip) bTip.style.display = "none";
      if (nTip) nTip.style.display = "none";
    }

    if (breadthCanvas) {
      breadthCanvas.addEventListener("mousemove", (e) => handleMouseMove(e, breadthCanvas));
      breadthCanvas.addEventListener("mouseleave", handleMouseLeave);
    }

    if (niftyCanvas) {
      niftyCanvas.addEventListener("mousemove", (e) => handleMouseMove(e, niftyCanvas));
      niftyCanvas.addEventListener("mouseleave", handleMouseLeave);
    }
  }

  function updateContribTooltips(idx, mouseX) {
    if (!contribTimeline || idx < 0 || idx >= contribTimeline.length) return;
    const pt = contribTimeline[idx];
    const displayDate = contribDataCache ? (contribDataCache.displayDate || contribDataCache.date) : "18-Sep-2026";
    const timeStr = pt.displayTime || (String(pt.time).includes("T") ? pt.time.split("T")[1].slice(0, 5) : pt.time);

    const bTip = document.getElementById("breadthCrosshairTooltip");
    const nTip = document.getElementById("niftyCrosshairTooltip");

    if (bTip) {
      bTip.style.display = "block";
      bTip.style.left = `${Math.min(window.innerWidth > 600 ? mouseX + 12 : 10, 240)}px`;
      bTip.style.top = "15px";
      bTip.style.minWidth = "220px";
      const maStr = pt.ma !== null && pt.ma !== undefined ? `${Number(pt.ma).toFixed(2)}%` : "--";
      bTip.innerHTML = `
        <div style="font-weight:800; color:var(--p2-teal-light); border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:4px; margin-bottom:6px;">
          📅 ${displayDate} &nbsp;⏱️ ${timeStr} IST
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
          <span style="color:#60a5fa;">Breadth %:</span> <strong class="font-mono">${Number(pt.breadth).toFixed(2)}%</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
          <span style="color:#f59e0b;">20 SMA:</span> <strong class="font-mono">${maStr}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
          <span style="color:#94a3b8;">X / O (Adv/Dec):</span> <strong class="font-mono">${pt.x} / ${pt.o}</strong>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:var(--p2-text-muted);">Net (Adv - Dec):</span> <strong class="font-mono ${pt.netAdvancers >= 0 ? 'text-green' : 'text-red'}">${pt.netAdvancers >= 0 ? '+' : ''}${pt.netAdvancers}</strong>
        </div>
      `;
    }

    if (nTip) {
      const idxName = contribDataCache && contribDataCache.indexInfo ? contribDataCache.indexInfo.name : "NIFTY 50";
      nTip.style.display = "block";
      nTip.style.left = `${Math.min(window.innerWidth > 600 ? mouseX + 12 : 10, 240)}px`;
      nTip.style.top = "15px";
      nTip.style.minWidth = "220px";
      nTip.innerHTML = `
        <div style="font-weight:800; color:var(--p2-teal-light); border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:4px; margin-bottom:6px;">
          📅 ${displayDate} &nbsp;⏱️ ${timeStr} IST - ${idxName}
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
          <span style="color:#38bdf8;">Spot Price:</span> <strong class="font-mono">${Number(pt.spot).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:#f59e0b;">VWAP:</span> <strong class="font-mono">${Number(pt.vwap).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
        </div>
      `;
    }
  }

  // ========================================================================
  // 🌐 GLOBAL MARKETS & MULTI-ASSET DESK CONTROLLER
  // ========================================================================
  function setupGlobalMarketsControls() {
    // 1. Sub-nav toggling between Global Markets and Straddle
    const gmBtn = document.getElementById("p2ToolGlobalMarketsBtn");
    const stBtn = document.getElementById("p2ToolStraddleBtn");
    const gmView = document.getElementById("p2ViewGlobalMarkets");
    const stView = document.getElementById("p2ViewStraddle");

    if (gmBtn && stBtn && gmView && stView) {
      gmBtn.addEventListener("click", () => {
        currentToolsSubView = "global";
        gmBtn.classList.add("active");
        stBtn.classList.remove("active");
        gmView.style.display = "block";
        stView.style.display = "none";
        loadGlobalMarketsSuite();
      });

      stBtn.addEventListener("click", () => {
        currentToolsSubView = "straddle";
        stBtn.classList.add("active");
        gmBtn.classList.remove("active");
        stView.style.display = "block";
        gmView.style.display = "none";
        loadStraddleTool();
      });
    }

    // 2. Category Filter Pills
    const catBtns = document.querySelectorAll(".gm-cat-btn");
    catBtns.forEach((b) => {
      b.addEventListener("click", () => {
        catBtns.forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        currentGmCategory = b.getAttribute("data-cat") || "all";
        renderFilteredGlobalAssets();
      });
    });

    // 3. Search Filter
    const searchInput = document.getElementById("gmSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        gmSearchQuery = (e.target.value || "").toLowerCase().trim();
        renderFilteredGlobalAssets();
      });
    }

    // 4. View Switcher (Grid vs List vs Table)
    const cardsBtn = document.getElementById("gmViewCardsBtn");
    const listBtn = document.getElementById("gmViewListBtn");
    const tableBtn = document.getElementById("gmViewTableBtn");
    const cardsGrid = document.getElementById("gmCardsGrid");
    const tableWrap = document.getElementById("gmTableWrapper");

    if (cardsBtn && tableBtn && cardsGrid && tableWrap) {
      cardsBtn.addEventListener("click", () => {
        currentGmView = "cards";
        cardsBtn.classList.add("active");
        if (listBtn) listBtn.classList.remove("active");
        tableBtn.classList.remove("active");
        cardsGrid.classList.remove("gm-list-view");
        cardsGrid.style.display = "grid";
        tableWrap.style.display = "none";
      });

      if (listBtn) {
        listBtn.addEventListener("click", () => {
          currentGmView = "list";
          listBtn.classList.add("active");
          cardsBtn.classList.remove("active");
          tableBtn.classList.remove("active");
          cardsGrid.classList.add("gm-list-view");
          cardsGrid.style.display = "grid";
          tableWrap.style.display = "none";
        });
      }

      tableBtn.addEventListener("click", () => {
        currentGmView = "table";
        tableBtn.classList.add("active");
        cardsBtn.classList.remove("active");
        if (listBtn) listBtn.classList.remove("active");
        cardsGrid.style.display = "none";
        tableWrap.style.display = "block";
      });
    }

    // 5. Refresh Buttons & Auto-Refresh Interval
    const refreshBtn = document.getElementById("gmRefreshBtn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        loadGlobalMarketsSuite(false);
      });
    }

    const exportBtn = document.getElementById("gmExportCsvBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", exportGlobalMarketsCsv);
    }

    // Auto-refresh interval (5 seconds)
    if (gmAutoRefreshTimer) clearInterval(gmAutoRefreshTimer);
    gmAutoRefreshTimer = setInterval(() => {
      const autoBox = document.getElementById("gmAutoRefresh");
      if (
        autoBox &&
        autoBox.checked &&
        currentSuite === "tools" &&
        currentToolsSubView === "global"
      ) {
        loadGlobalMarketsSuite(true);
      }
    }, 5000);
  }

  async function loadGlobalMarketsSuite(isSilent = false) {
    try {
      const res = await fetch(`/api/global-markets?category=all`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json || !json.ok) throw new Error("Invalid response");

      gmCachedData = json;
      updateGlobalMacroStrip(json.headlineMetrics);
      updateCategoryBadges(json.categorySummary, json.totalAssets);
      renderFilteredGlobalAssets();

      const clockEl = document.getElementById("gmDeskStatusText");
      if (clockEl && json.asOf) {
        clockEl.textContent = `UPDATED ${json.asOf}`;
      }
    } catch (err) {
      console.error("Failed to load global markets suite:", err);
      if (!isSilent) {
        const grid = document.getElementById("gmCardsGrid");
        if (grid) {
          grid.innerHTML = `<div style="grid-column:1/-1; padding:30px; text-align:center; color:var(--p2-red);">
            Failed to connect to Global Markets Engine. Please check server connection.
          </div>`;
        }
      }
    }
  }

  function updateGlobalMacroStrip(metrics) {
    const strip = document.getElementById("gmMacroStrip");
    if (!strip || !metrics) return;

    const cardsData = [
      {
        title: "GIFT NIFTY",
        sub: "NSE IX FUTURES",
        flag: "🇮🇳",
        val: Number(metrics.giftNifty.ltp).toLocaleString("en-IN", { minimumFractionDigits: 2 }),
        chg: metrics.giftNifty.change,
        pct: metrics.giftNifty.changePct,
        unit: "pts"
      },
      {
        title: "BRENT CRUDE",
        sub: "COMMODITY OIL",
        flag: "🛢️",
        val: `$${Number(metrics.brentCrude.ltp).toFixed(2)}`,
        chg: metrics.brentCrude.change,
        pct: metrics.brentCrude.changePct,
        unit: "/bbl"
      },
      {
        title: "GOLD SPOT",
        sub: "PRECIOUS METAL",
        flag: "🟡",
        val: `$${Number(metrics.gold.ltp).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        chg: metrics.gold.change,
        pct: metrics.gold.changePct,
        unit: "/oz"
      },
      {
        title: "US 10Y BENCHMARK",
        sub: "SOVEREIGN YIELD",
        flag: "🇺🇸",
        val: `${Number(metrics.us10y.ltp).toFixed(2)}%`,
        chg: metrics.us10y.change,
        pct: metrics.us10y.changePct,
        unit: "pts"
      },
      {
        title: "US DOLLAR INDEX",
        sub: "DXY CURRENCY BASKET",
        flag: "💵",
        val: Number(metrics.dxy.ltp).toFixed(2),
        chg: metrics.dxy.change,
        pct: metrics.dxy.changePct,
        unit: "pts"
      },
      {
        title: "BITCOIN SPOT",
        sub: "CRYPTO LEADER",
        flag: "₿",
        val: `$${Number(metrics.btc.ltp).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        chg: metrics.btc.change,
        pct: metrics.btc.changePct,
        unit: "USD"
      }
    ];

    strip.innerHTML = cardsData.map((c) => {
      const isPos = c.chg >= 0;
      const chgClass = isPos ? "text-green" : "text-red";
      const sign = isPos ? "+" : "";
      return `
        <div class="gm-macro-card">
          <div class="gm-macro-top">
            <span>${c.flag} ${c.title}</span>
            <span style="font-size:10px; opacity:0.8;">${c.sub}</span>
          </div>
          <div class="gm-macro-price">${c.val}</div>
          <div class="gm-macro-bottom">
            <span class="${chgClass}">${sign}${c.chg.toFixed(2)} (${sign}${c.pct.toFixed(2)}%)</span>
            <span style="color:var(--p2-text-dim);">${c.unit}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  function updateCategoryBadges(summary, totalCount) {
    if (totalCount !== undefined) {
      const el = document.getElementById("countAll");
      if (el) el.textContent = totalCount;
    }
    if (!summary) return;

    const map = {
      indices: "countIndices",
      currency: "countCurrency",
      commodity: "countCommodity",
      crypto: "countCrypto",
      bonds: "countBonds",
      adr: "countAdr"
    };

    Object.keys(map).forEach((k) => {
      const el = document.getElementById(map[k]);
      if (el && summary[k]) {
        el.textContent = summary[k].count;
      }
    });
  }

  function renderFilteredGlobalAssets() {
    if (!gmCachedData || !gmCachedData.assets) return;

    let items = gmCachedData.assets;

    // Filter by Category
    if (currentGmCategory !== "all") {
      items = items.filter((x) => x.category === currentGmCategory);
    }

    // Filter by Search Query
    if (gmSearchQuery) {
      items = items.filter((x) => {
        const sym = (x.symbol || "").toLowerCase();
        const name = (x.name || "").toLowerCase();
        const country = (x.country || "").toLowerCase();
        return sym.includes(gmSearchQuery) || name.includes(gmSearchQuery) || country.includes(gmSearchQuery);
      });
    }

    renderGlobalCards(items);
    renderGlobalTable(items);
  }

  function renderGlobalCards(items) {
    const grid = document.getElementById("gmCardsGrid");
    if (!grid) return;

    if (!items || items.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1; padding:40px; text-align:center; color:var(--p2-text-muted);">
        No assets found matching your criteria.
      </div>`;
      return;
    }

    grid.innerHTML = items.map((asset) => {
      const isPos = asset.change >= 0;
      const chgClass = isPos ? "text-green" : "text-red";
      const sign = isPos ? "+" : "";

      // Market Status Badge Class
      let statusClass = "open";
      if (asset.marketStatus === "CLOSED") statusClass = "closed";
      else if (asset.marketStatus === "24/7 LIVE") statusClass = "live";

      // Price Formatting
      let ltpFormatted = formatAssetPrice(asset.ltp, asset.category, asset.currency);

      // Flash determination
      const prevPrice = gmPreviousPrices[asset.id];
      let flashClass = "";
      if (prevPrice !== undefined) {
        if (asset.ltp > prevPrice) flashClass = "flash-green";
        else if (asset.ltp < prevPrice) flashClass = "flash-red";
      }
      gmPreviousPrices[asset.id] = asset.ltp;

      // Day Range calculation
      const daySpread = asset.high - asset.low;
      const dayPct = daySpread > 0 ? Math.min(100, Math.max(0, ((asset.ltp - asset.low) / daySpread) * 100)) : 50;

      // 52W Range calculation
      const w52Spread = asset.week52High - asset.week52Low;
      const w52Pct = w52Spread > 0 ? Math.min(100, Math.max(0, ((asset.ltp - asset.week52Low) / w52Spread) * 100)) : 50;

      // Sparkline SVG
      const sparkSvg = generateSparklineSvg(asset.sparkline, isPos, 140, 36);

      return `
        <div class="gm-card" id="gmCard_${asset.id}">
          <div class="gm-card-header">
            <div class="gm-card-title-group">
              <div class="gm-card-symbol-line">
                <span class="gm-card-flag">${asset.flag || "🌐"}</span>
                <span class="gm-card-symbol">${asset.symbol}</span>
              </div>
              <div class="gm-card-name" title="${asset.name}">${asset.name}</div>
            </div>
            <span class="gm-status-pill ${statusClass}">${asset.marketStatus}</span>
          </div>

          <div class="gm-card-price-row">
            <div class="gm-card-ltp ${flashClass}">${ltpFormatted}</div>
            <div class="gm-card-chg-wrap ${chgClass}">
              <div class="gm-card-chg-val">${sign}${Number(asset.change).toFixed(2)}</div>
              <div class="gm-card-chg-pct">${sign}${Number(asset.changePct).toFixed(2)}%</div>
            </div>
          </div>

          <div class="gm-sparkline-wrap">
            ${sparkSvg}
          </div>

          <div class="gm-range-group">
            <div class="gm-range-bar-box">
              <div class="gm-range-labels">
                <span class="gm-range-tag">Day Range</span>
                <span>L: ${formatCompactPrice(asset.low)} &nbsp;|&nbsp; H: ${formatCompactPrice(asset.high)}</span>
              </div>
              <div class="gm-range-track">
                <div class="gm-range-fill ${!isPos ? 'bearish' : ''}" style="width:${dayPct.toFixed(1)}%;"></div>
              </div>
            </div>

            <div class="gm-range-bar-box">
              <div class="gm-range-labels">
                <span class="gm-range-tag">52W Range</span>
                <span>L: ${formatCompactPrice(asset.week52Low)} &nbsp;|&nbsp; H: ${formatCompactPrice(asset.week52High)}</span>
              </div>
              <div class="gm-range-track">
                <div class="gm-range-fill ${!isPos ? 'bearish' : ''}" style="width:${w52Pct.toFixed(1)}%;"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Clear flash classes after 800ms
    setTimeout(() => {
      document.querySelectorAll(".gm-card-ltp.flash-green, .gm-card-ltp.flash-red").forEach((el) => {
        el.classList.remove("flash-green", "flash-red");
      });
    }, 800);
  }

  function renderGlobalTable(items) {
    const tbody = document.getElementById("tbodyGlobalMarkets");
    if (!tbody) return;

    if (!items || items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:30px; color:var(--p2-text-muted);">No assets available</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map((asset) => {
      const isPos = asset.change >= 0;
      const chgClass = isPos ? "text-green" : "text-red";
      const sign = isPos ? "+" : "";

      let statusClass = "open";
      if (asset.marketStatus === "CLOSED") statusClass = "closed";
      else if (asset.marketStatus === "24/7 LIVE") statusClass = "live";

      const ltpFormatted = formatAssetPrice(asset.ltp, asset.category, asset.currency);

      const daySpread = asset.high - asset.low;
      const dayPct = daySpread > 0 ? Math.min(100, Math.max(0, ((asset.ltp - asset.low) / daySpread) * 100)) : 50;

      const sparkSvg = generateSparklineSvg(asset.sparkline, isPos, 90, 24);

      return `
        <tr>
          <td>
            <div class="gm-table-flag-col">
              <span style="font-size:16px;">${asset.flag || "🌐"}</span>
              <div>
                <div class="gm-table-symbol">${asset.symbol}</div>
                <div class="gm-table-name">${asset.name}</div>
              </div>
            </div>
          </td>
          <td><span class="p2-badge p2-badge-teal">${(asset.category || "").toUpperCase()}</span></td>
          <td><span class="gm-status-pill ${statusClass}">${asset.marketStatus}</span></td>
          <td class="text-right font-mono font-bold" style="font-size:14px;">${ltpFormatted}</td>
          <td class="text-right font-mono ${chgClass}">${sign}${Number(asset.change).toFixed(2)}</td>
          <td class="text-right font-mono ${chgClass} font-bold">${sign}${Number(asset.changePct).toFixed(2)}%</td>
          <td>
            <div class="gm-table-range-cell">
              <div style="display:flex; justify-content:space-between; font-size:9px; font-family:var(--font-mono); color:var(--p2-text-dim);">
                <span>${formatCompactPrice(asset.low)}</span>
                <span>${formatCompactPrice(asset.high)}</span>
              </div>
              <div class="gm-table-range-track">
                <div class="gm-range-fill ${!isPos ? 'bearish' : ''}" style="width:${dayPct.toFixed(1)}%;"></div>
              </div>
            </div>
          </td>
          <td class="text-center font-mono" style="font-size:11px; color:var(--p2-text-muted);">
            ${formatCompactPrice(asset.week52Low)} - ${formatCompactPrice(asset.week52High)}
          </td>
          <td>
            <div class="gm-table-sparkline-cell">${sparkSvg}</div>
          </td>
          <td class="text-right font-mono" style="color:var(--p2-text-muted);">${formatCompactPrice(asset.prevClose)}</td>
        </tr>
      `;
    }).join("");
  }

  function formatAssetPrice(ltp, category, currency) {
    if (category === "bonds") {
      return `${Number(ltp).toFixed(2)}%`;
    }
    if (category === "currency" && ltp < 5) {
      return Number(ltp).toFixed(4);
    }
    if (currency === "USD") {
      return `$${Number(ltp).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (currency === "INR" || !currency) {
      return `₹${Number(ltp).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return Number(ltp).toLocaleString("en-US", { minimumFractionDigits: 2 });
  }

  function formatCompactPrice(val) {
    if (val === undefined || val === null) return "--";
    const num = Number(val);
    if (num >= 100000) {
      return num.toLocaleString("en-IN", { maximumFractionDigits: 0 });
    }
    if (num >= 1000) {
      return num.toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }
    return num.toFixed(2);
  }

  function generateSparklineSvg(pts, isPositive, width = 120, height = 30) {
    if (!pts || pts.length < 2) return "";

    const min = Math.min(...pts);
    const max = Math.max(...pts);
    const range = max - min || 1;
    const padding = 4;
    const h = height - padding * 2;
    const w = width;

    const coords = pts.map((p, i) => {
      const x = (i / (pts.length - 1)) * w;
      const y = height - padding - ((p - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const color = isPositive ? "#10b981" : "#f43f5e";
    const fillId = `gmGrad_${Math.floor(Math.random() * 1000000)}`;

    const polylineStr = coords.join(" ");
    const areaStr = `0,${height} ${coords.join(" ")} ${w},${height}`;

    return `
      <svg viewBox="0 0 ${w} ${height}" preserveAspectRatio="none" style="width:100%; height:100%; overflow:visible;">
        <defs>
          <linearGradient id="${fillId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.25" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0.0" />
          </linearGradient>
        </defs>
        <polygon points="${areaStr}" fill="url(#${fillId})" />
        <polyline points="${polylineStr}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  }

  function exportGlobalMarketsCsv() {
    if (!gmCachedData || !gmCachedData.assets) return;
    const items = gmCachedData.assets;
    const headers = ["Symbol", "Name", "Category", "Country", "Market Status", "LTP", "Change", "Change Pct", "Day Low", "Day High", "52W Low", "52W High", "Prev Close"];
    const rows = items.map((x) => [
      `"${x.symbol}"`,
      `"${x.name}"`,
      x.category,
      `"${x.country}"`,
      x.marketStatus,
      x.ltp,
      x.change,
      x.changePct,
      x.low,
      x.high,
      x.week52Low,
      x.week52High,
      x.prevClose
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Global_Markets_Matrix_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

})();


