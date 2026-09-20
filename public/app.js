const els = {
  apiStatus: document.getElementById("apiStatus"),
  dateInput: document.getElementById("dateInput"),
  dataSource: document.getElementById("dataSource"),
  universeSelect: document.getElementById("universeSelect"),
  intervalInput: document.getElementById("intervalInput"),
  chartMode: document.getElementById("chartMode"),
  warmupSessions: document.getElementById("warmupSessions"),
  pnfBasis: document.getElementById("pnfBasis"),
  boxPercent: document.getElementById("boxPercent"),
  reversalBoxes: document.getElementById("reversalBoxes"),
  maxSymbols: document.getElementById("maxSymbols"),
  indexSelect: document.getElementById("indexSelect"),
  symbolsInput: document.getElementById("symbolsInput"),
  runButton: document.getElementById("runButton"),
  refreshButton: document.getElementById("refreshButton"),
  autoRefresh: document.getElementById("autoRefresh"),
  refreshInterval: document.getElementById("refreshInterval"),
  refreshState: document.getElementById("refreshState"),
  chartTitle: document.getElementById("chartTitle"),
  chartMeta: document.getElementById("chartMeta"),
  canvas: document.getElementById("breadthCanvas"),
  chartTooltip: document.getElementById("chartTooltip"),
  latestBreadth: document.getElementById("latestBreadth"),
  openBreadth: document.getElementById("openBreadth"),
  breadthChange: document.getElementById("breadthChange"),
  xoCount: document.getElementById("xoCount"),
  loadedCount: document.getElementById("loadedCount"),
  messagePanel: document.getElementById("messagePanel"),
  niftyChartTitle: document.getElementById("niftyChartTitle"),
  niftyChartMeta: document.getElementById("niftyChartMeta"),
  niftyCanvas: document.getElementById("niftyCanvas"),
  niftyTooltip: document.getElementById("niftyTooltip"),

  // Nifty 50 Advance / Decline Tracker
  niftyAdCanvas: document.getElementById("niftyAdCanvas"),
  niftyAdTooltip: document.getElementById("niftyAdTooltip"),
  niftyAdChartTitle: document.getElementById("niftyAdChartTitle"),
  niftyAdChartMeta: document.getElementById("niftyAdChartMeta"),

  niftySpot: document.getElementById("niftySpot"),
  niftyChange: document.getElementById("niftyChange"),

  // Tab Navigation Elements
  tabBreadth: document.getElementById("tabBreadth"),
  tabOptions: document.getElementById("tabOptions"),
  tabSmartMoney: document.getElementById("tabSmartMoney"),
  tabDelivery: document.getElementById("tabDelivery"),
  tabMtf: document.getElementById("tabMtf"),
  tabTools: document.getElementById("tabTools"),
  tabSettings: document.getElementById("tabSettings"),
  panelBreadth: document.getElementById("panelBreadth"),
  panelOptions: document.getElementById("panelOptions"),
  panelSmartMoney: document.getElementById("panelSmartMoney"),
  panelDelivery: document.getElementById("panelDelivery"),
  panelMtf: document.getElementById("panelMtf"),
  panelTools: document.getElementById("panelTools"),
  panelSettings: document.getElementById("panelSettings"),
  panelDashboard: document.getElementById("panelDashboard"),

  // Institutional Nav Buttons
  navDashboard: document.getElementById("navDashboard"),
  navFutures: document.getElementById("navFutures"),
  navOptions: document.getElementById("navOptions"),
  navAnalytics: document.getElementById("navAnalytics"),
  navFiiDii: document.getElementById("navFiiDii"),
  navMtf: document.getElementById("navMtf"),
  navDelivery: document.getElementById("navDelivery"),
  navResources: document.getElementById("navResources"),

  // MTF Desk Elements

  mtfSessionSelect: document.getElementById("mtfSessionSelect"),
  mtfRefreshBtn: document.getElementById("mtfRefreshBtn"),
  mtfAsOfBadge: document.getElementById("mtfAsOfBadge"),
  mtfSourceBadge: document.getElementById("mtfSourceBadge"),
  mtfCombinedBadge: document.getElementById("mtfCombinedBadge"),
  mtfCombinedVal: document.getElementById("mtfCombinedVal"),
  mtfCombinedSub: document.getElementById("mtfCombinedSub"),
  mtfNseVal: document.getElementById("mtfNseVal"),
  mtfNseSub: document.getElementById("mtfNseSub"),
  mtfBseVal: document.getElementById("mtfBseVal"),
  mtfBseSub: document.getElementById("mtfBseSub"),
  mtfBrokerShareBadge: document.getElementById("mtfBrokerShareBadge"),
  mtfDisclosedVal: document.getElementById("mtfDisclosedVal"),
  mtfDisclosedSub: document.getElementById("mtfDisclosedSub"),
  mtfBrokersTableBody: document.getElementById("mtfBrokersTableBody"),
  mtfBrokerBars: document.getElementById("mtfBrokerBars"),
  mtfGlobalTableBody: document.getElementById("mtfGlobalTableBody"),
  mtfStockSearch: document.getElementById("mtfStockSearch"),
  mtfStockFilter: document.getElementById("mtfStockFilter"),
  mtfStockSort: document.getElementById("mtfStockSort"),
  mtfScreenerMeta: document.getElementById("mtfScreenerMeta"),
  mtfStockTableBody: document.getElementById("mtfStockTableBody"),

  // Options Desk controls
  optIndexSelect: document.getElementById("optIndexSelect"),
  optExpirySelect: document.getElementById("optExpirySelect"),
  optStrikeRange: document.getElementById("optStrikeRange"),
  optShowGreeks: document.getElementById("optShowGreeks"),
  optCompact: document.getElementById("optCompact"),
  optRefreshButton: document.getElementById("optRefreshButton"),

  // Options Desk metrics
  optSpot: document.getElementById("optSpot"),
  optChange: document.getElementById("optChange"),
  optAtmStraddle: document.getElementById("optAtmStraddle"),
  optPcr: document.getElementById("optPcr"),
  optPcrVol: document.getElementById("optPcrVol"),
  optMaxPain: document.getElementById("optMaxPain"),
  optAtmIv: document.getElementById("optAtmIv"),
  optSupport: document.getElementById("optSupport"),
  optResistance: document.getElementById("optResistance"),
  topCallOiStrikes: document.getElementById("topCallOiStrikes"),
  topPutOiStrikes: document.getElementById("topPutOiStrikes"),

  // Option Chain table
  optionChainTable: document.getElementById("optionChainTable"),
  optionChainBody: document.getElementById("optionChainBody"),
  callsHeaderCell: document.getElementById("callsHeaderCell"),
  putsHeaderCell: document.getElementById("putsHeaderCell"),
  optShowModelFair: document.getElementById("optShowModelFair"),
  modelPricingRibbon: document.getElementById("modelPricingRibbon"),
  modelSkewSummary: document.getElementById("modelSkewSummary"),
  edgeFilterGroup: document.getElementById("edgeFilterGroup"),

  // Options Desk canvases
  optOiCanvas: document.getElementById("optOiCanvas"),
  optIvCanvas: document.getElementById("optIvCanvas"),

  // Quant Straddle Desk
  quantStraddleSection: document.getElementById("quantStraddleSection"),
  straddleChartTitle: document.getElementById("straddleChartTitle"),
  strdStrikeVal: document.getElementById("strdStrikeVal"),
  strdOpenVal: document.getElementById("strdOpenVal"),
  strdCurrVal: document.getElementById("strdCurrVal"),
  strdDecayVal: document.getElementById("strdDecayVal"),
  strdBeRange: document.getElementById("strdBeRange"),
  strdDiffVal: document.getElementById("strdDiffVal"),
  strdRegimeBadge: document.getElementById("strdRegimeBadge"),
  straddleStrikeChips: document.getElementById("straddleStrikeChips"),
  toggleStraddleLine: document.getElementById("toggleStraddleLine"),
  toggleCallLine: document.getElementById("toggleCallLine"),
  togglePutLine: document.getElementById("togglePutLine"),
  toggleDiffLine: document.getElementById("toggleDiffLine"),
  toggleVwapLine: document.getElementById("toggleVwapLine"),
  straddleCanvas: document.getElementById("straddleCanvas"),
  straddleTooltip: document.getElementById("straddleTooltip"),
  qDeltaVal: document.getElementById("qDeltaVal"),
  qDeltaSub: document.getElementById("qDeltaSub"),
  qGammaVal: document.getElementById("qGammaVal"),
  qGammaSub: document.getElementById("qGammaSub"),
  qThetaVal: document.getElementById("qThetaVal"),
  qThetaSub: document.getElementById("qThetaSub"),
  qVegaVal: document.getElementById("qVegaVal"),
  qVegaSub: document.getElementById("qVegaSub"),
  qExpectedMoveVal: document.getElementById("qExpectedMoveVal"),
  qExpectedMoveSub: document.getElementById("qExpectedMoveSub"),

  // Live Auto-Refresh Toolbar
  optLiveRefreshBar: document.getElementById("optLiveRefreshBar"),
  optLivePulseBadge: document.getElementById("optLivePulseBadge"),
  optLiveStatusText: document.getElementById("optLiveStatusText"),
  optAutoRefreshToggle: document.getElementById("optAutoRefreshToggle"),
  optRefreshInterval: document.getElementById("optRefreshInterval"),
  optCountdownBadge: document.getElementById("optCountdownBadge"),
  optCountdownFill: document.getElementById("optCountdownFill"),
  optLastUpdatedTime: document.getElementById("optLastUpdatedTime"),

  // Options Subtabs & Views
  subtabIndexOverview: document.getElementById("subtabIndexOverview"),
  subtabChain: document.getElementById("subtabChain"),
  subtabStats: document.getElementById("subtabStats"),
  subtabWpcrPce: document.getElementById("subtabWpcrPce"),
  subtabVolatility: document.getElementById("subtabVolatility"),
  optIndexOverviewWrap: document.getElementById("optIndexOverviewWrap"),
  optChainViewWrap: document.getElementById("optChainViewWrap"),
  optStatsViewWrap: document.getElementById("optStatsViewWrap"),
  optWpcrPceViewWrap: document.getElementById("optWpcrPceViewWrap"),
  optVolatilityViewWrap: document.getElementById("optVolatilityViewWrap"),

  // Index Overview Master Terminal Elements
  idxTotVol: document.getElementById("idxTotVol"),
  idxTotTurnover: document.getElementById("idxTotTurnover"),
  idxTotOi: document.getElementById("idxTotOi"),
  idxTotOiChg: document.getElementById("idxTotOiChg"),
  idxMarketPcr: document.getElementById("idxMarketPcr"),
  idxMarketPcrSub: document.getElementById("idxMarketPcrSub"),
  idxDominant: document.getElementById("idxDominant"),
  idxDominantSub: document.getElementById("idxDominantSub"),
  idxOverviewAsOf: document.getElementById("idxOverviewAsOf"),
  btnRefreshIndicesOverview: document.getElementById("btnRefreshIndicesOverview"),
  idxVolumeTableBody: document.getElementById("idxVolumeTableBody"),
  idxOiTableBody: document.getElementById("idxOiTableBody"),
  idxVisualCardsGrid: document.getElementById("idxVisualCardsGrid"),
  smJumpToIndicesBtn: document.getElementById("smJumpToIndicesBtn"),

  // Volatility Terminal Elements
  volVixVal: document.getElementById("volVixVal"),
  volVixSub: document.getElementById("volVixSub"),
  volAtmIvVal: document.getElementById("volAtmIvVal"),
  volAtmIvSub: document.getElementById("volAtmIvSub"),
  volIvRankVal: document.getElementById("volIvRankVal"),
  volIvRankFill: document.getElementById("volIvRankFill"),
  volIvPctVal: document.getElementById("volIvPctVal"),
  volIvPctFill: document.getElementById("volIvPctFill"),
  volIvMinusHvVal: document.getElementById("volIvMinusHvVal"),
  volExpectedMoveVal: document.getElementById("volExpectedMoveVal"),
  volExpectedMoveSub: document.getElementById("volExpectedMoveSub"),
  volRegimeBadge: document.getElementById("volRegimeBadge"),
  volRegimeVixText: document.getElementById("volRegimeVixText"),
  volGaugeFill: document.getElementById("volGaugeFill"),
  volRegimeDesc: document.getElementById("volRegimeDesc"),
  volBuyerBadge: document.getElementById("volBuyerBadge"),
  volBuyerDesc: document.getElementById("volBuyerDesc"),
  volSellerBadge: document.getElementById("volSellerBadge"),
  volSellerDesc: document.getElementById("volSellerDesc"),
  volSpreadBadge: document.getElementById("volSpreadBadge"),
  volSpreadDesc: document.getElementById("volSpreadDesc"),
  volExp1Sig: document.getElementById("volExp1Sig"),
  volExp2Sig: document.getElementById("volExp2Sig"),
  volStraddleBreakeven: document.getElementById("volStraddleBreakeven"),
  volExpectedPct: document.getElementById("volExpectedPct"),
  volStockTableBody: document.getElementById("volStockTableBody"),

  // GoCharting Statistics Elements
  statPcrOi: document.getElementById("statPcrOi"),
  statNetBiasBadge: document.getElementById("statNetBiasBadge"),
  statPcrVol: document.getElementById("statPcrVol"),
  statPcrOiChg: document.getElementById("statPcrOiChg"),
  statSentimentSub: document.getElementById("statSentimentSub"),
  statMaxPain: document.getElementById("statMaxPain"),
  statMaxPainDiff: document.getElementById("statMaxPainDiff"),
  statMaxPainNote: document.getElementById("statMaxPainNote"),
  statAtmIv: document.getElementById("statAtmIv"),
  statIvSkewBadge: document.getElementById("statIvSkewBadge"),
  statCallIv: document.getElementById("statCallIv"),
  statPutIv: document.getElementById("statPutIv"),
  statSkewRegime: document.getElementById("statSkewRegime"),
  statNetGex: document.getElementById("statNetGex"),
  statGammaRegime: document.getElementById("statGammaRegime"),
  statGammaFlip: document.getElementById("statGammaFlip"),
  statGexNote: document.getElementById("statGexNote"),
  statExpectedMove: document.getElementById("statExpectedMove"),
  statAtmStraddle: document.getElementById("statAtmStraddle"),
  statExpectedCone: document.getElementById("statExpectedCone"),
  statAtmStrangle: document.getElementById("statAtmStrangle"),
  statThetaBurn: document.getElementById("statThetaBurn"),
  statIvRankBadge: document.getElementById("statIvRankBadge"),
  statIvPercentile: document.getElementById("statIvPercentile"),
  statTotalCallOi: document.getElementById("statTotalCallOi"),
  statTotalPutOi: document.getElementById("statTotalPutOi"),
  statCallOiBar: document.getElementById("statCallOiBar"),
  statCallOiPct: document.getElementById("statCallOiPct"),
  statPutOiBar: document.getElementById("statPutOiBar"),
  statPutOiPct: document.getElementById("statPutOiPct"),
  statTotalCallVol: document.getElementById("statTotalCallVol"),
  statTotalPutVol: document.getElementById("statTotalPutVol"),
  statCallVolBar: document.getElementById("statCallVolBar"),
  statCallVolPct: document.getElementById("statCallVolPct"),
  statPutVolBar: document.getElementById("statPutVolBar"),
  statPutVolPct: document.getElementById("statPutVolPct"),
  countLongBuildup: document.getElementById("countLongBuildup"),
  listLongBuildup: document.getElementById("listLongBuildup"),
  countShortBuildup: document.getElementById("countShortBuildup"),
  listShortBuildup: document.getElementById("listShortBuildup"),
  countShortCovering: document.getElementById("countShortCovering"),
  listShortCovering: document.getElementById("listShortCovering"),
  countLongUnwinding: document.getElementById("countLongUnwinding"),
  listLongUnwinding: document.getElementById("listLongUnwinding"),
  resistanceWallsList: document.getElementById("resistanceWallsList"),
  supportWallsList: document.getElementById("supportWallsList"),

  // wPCR & PCE Quant Terminal Elements
  subtabWpcrPce: document.getElementById("subtabWpcrPce"),
  optWpcrPceViewWrap: document.getElementById("optWpcrPceViewWrap"),
  wpcrHeroVal: document.getElementById("wpcrHeroVal"),
  wpcrHeroBadge: document.getElementById("wpcrHeroBadge"),
  wpcrCallRatioBar: document.getElementById("wpcrCallRatioBar"),
  wpcrPutRatioBar: document.getElementById("wpcrPutRatioBar"),
  wpcrCapRatioSub: document.getElementById("wpcrCapRatioSub"),
  dpcrVal: document.getElementById("dpcrVal"),
  vwpcrVal: document.getElementById("vwpcrVal"),
  wpcrStandardPcr: document.getElementById("wpcrStandardPcr"),
  dpcrSubText: document.getElementById("dpcrSubText"),
  pceNetVal: document.getElementById("pceNetVal"),
  pceParityBadge: document.getElementById("pceParityBadge"),
  pceTotalCap: document.getElementById("pceTotalCap"),
  pceForwardSpread: document.getElementById("pceForwardSpread"),
  pceParityDesc: document.getElementById("pceParityDesc"),
  wpcrTrapCard: document.getElementById("wpcrTrapCard"),
  wpcrTrapBadge: document.getElementById("wpcrTrapBadge"),
  wpcrDivergenceVal: document.getElementById("wpcrDivergenceVal"),
  wpcrTrapDesc: document.getElementById("wpcrTrapDesc"),
  wpcrTfGroup: document.getElementById("wpcrTfGroup"),
  wpcrModeGroup: document.getElementById("wpcrModeGroup"),
  wpcrChartTitle: document.getElementById("wpcrChartTitle"),
  wpcrChartSubtitle: document.getElementById("wpcrChartSubtitle"),
  wpcrTsWrap: document.getElementById("wpcrTsWrap"),
  wpcrTsCanvas: document.getElementById("wpcrTsCanvas"),
  wpcrTsTooltip: document.getElementById("wpcrTsTooltip"),
  wpcrPriceCanvas: document.getElementById("wpcrPriceCanvas"),
  wpcrPcrCanvas: document.getElementById("wpcrPcrCanvas"),
  wpcrPriceTooltip: document.getElementById("wpcrPriceTooltip"),
  wpcrPcrTooltip: document.getElementById("wpcrPcrTooltip"),
  wpcrSymbolHeader: document.getElementById("wpcrSymbolHeader"),
  wpcrZoomGroup: document.getElementById("wpcrZoomGroup"),
  wpcrDualChartContainer: document.getElementById("wpcrDualChartContainer"),
  wpcrCapitalWrap: document.getElementById("wpcrCapitalWrap"),
  wpcrCapitalCanvas: document.getElementById("wpcrCapitalCanvas"),
  wpcrCanvasTooltip: document.getElementById("wpcrCanvasTooltip"),
  wpcrStrikeTableBody: document.getElementById("wpcrStrikeTableBody"),
  macroPceYoy: document.getElementById("macroPceYoy"),
  macroPceTrend: document.getElementById("macroPceTrend"),
  macroFedOutlook: document.getElementById("macroFedOutlook"),
  macroGlobalStatus: document.getElementById("macroGlobalStatus"),
  macroUs10y: document.getElementById("macroUs10y"),
  macroDxy: document.getElementById("macroDxy"),
  macroIndiaVix: document.getElementById("macroIndiaVix"),
  macroCboeVix: document.getElementById("macroCboeVix"),
  macroExpectedIv: document.getElementById("macroExpectedIv"),
  macroExpectedPts: document.getElementById("macroExpectedPts"),
  macroBreakevenRange: document.getElementById("macroBreakevenRange"),
  macroFiiBias: document.getElementById("macroFiiBias"),
  macroHedgingProtocol: document.getElementById("macroHedgingProtocol"),
  wpcrTopCallsList: document.getElementById("wpcrTopCallsList"),
  wpcrTopPutsList: document.getElementById("wpcrTopPutsList"),

  // Smart Money EOD Tracker Elements
  smDateInput: document.getElementById("smDateInput"),
  smQuickDates: document.getElementById("smQuickDates"),
  smStatusBadge: document.getElementById("smStatusBadge"),
  smRefreshBtn: document.getElementById("smRefreshBtn"),
  smFiiZoneBadge: document.getElementById("smFiiZoneBadge"),
  smFiiLongPct: document.getElementById("smFiiLongPct"),
  smFiiShortPct: document.getElementById("smFiiShortPct"),
  smFiiBarLong: document.getElementById("smFiiBarLong"),
  smFiiBarShort: document.getElementById("smFiiBarShort"),
  smFiiNetFut: document.getElementById("smFiiNetFut"),
  smFiiNetValCr: document.getElementById("smFiiNetValCr"),
  smFiiZoneDesc: document.getElementById("smFiiZoneDesc"),
  smTrapBadge: document.getElementById("smTrapBadge"),
  smTrapTitle: document.getElementById("smTrapTitle"),
  smTrapDesc: document.getElementById("smTrapDesc"),
  smClientCalls: document.getElementById("smClientCalls"),
  smSmartCalls: document.getElementById("smSmartCalls"),
  smClientPuts: document.getElementById("smClientPuts"),
  smSmartPuts: document.getElementById("smSmartPuts"),
  smGameplanBias: document.getElementById("smGameplanBias"),
  smGameplanSummary: document.getElementById("smGameplanSummary"),
  smParticipantTableBody: document.getElementById("smParticipantTableBody"),
  smSessionSelect: document.getElementById("smSessionSelect"),
  smIndicesDeliveryTableBody: document.getElementById("smIndicesDeliveryTableBody"),
  smHistoryCanvas: document.getElementById("smHistoryCanvas"),
  smHistoryTooltip: document.getElementById("smHistoryTooltip"),

  // Delivery Desk Elements
  delivSessionSelect: document.getElementById("delivSessionSelect"),
  delivDateInput: document.getElementById("delivDateInput"),
  delivQuickDates: document.getElementById("delivQuickDates"),
  delivIndicesGrid: document.getElementById("delivIndicesGrid"),
  delivUniverseSelect: document.getElementById("delivUniverseSelect"),
  delivStatusBadge: document.getElementById("delivStatusBadge"),
  delivRefreshBtn: document.getElementById("delivRefreshBtn"),
  delivFilterGroup: document.getElementById("delivFilterGroup"),
  delivSearchInput: document.getElementById("delivSearchInput"),
  kpiDelivAvgPct: document.getElementById("kpiDelivAvgPct"),
  kpiDelivValCr: document.getElementById("kpiDelivValCr"),
  kpiDelivSummaryDesc: document.getElementById("kpiDelivSummaryDesc"),
  kpiAccCount: document.getElementById("kpiAccCount"),
  kpiDistCount: document.getElementById("kpiDistCount"),
  kpiAccBar: document.getElementById("kpiAccBar"),
  kpiDistBar: document.getElementById("kpiDistBar"),
  kpiShockCount: document.getElementById("kpiShockCount"),
  kpiTopDelivList: document.getElementById("kpiTopDelivList"),
  delivStockCountBadge: document.getElementById("delivStockCountBadge"),
  delivTableBody: document.getElementById("delivTableBody"),
  delivDrilldownModal: document.getElementById("delivDrilldownModal"),
  drilldownTitle: document.getElementById("drilldownTitle"),
  drilldownSubtitle: document.getElementById("drilldownSubtitle"),
  drilldownCloseBtn: document.getElementById("drilldownCloseBtn"),
  drilldownTableBody: document.getElementById("drilldownTableBody"),

  // Stock Inspector elements
  delivInspectBtn: document.getElementById("delivInspectBtn"),
  stockInspectorCard: document.getElementById("stockInspectorCard"),
  inspectSymbol: document.getElementById("inspectSymbol"),
  inspectSignalBadge: document.getElementById("inspectSignalBadge"),
  inspectSubtitle: document.getElementById("inspectSubtitle"),
  closeInspectorBtn: document.getElementById("closeInspectorBtn"),
  inspectClose: document.getElementById("inspectClose"),
  inspectChange: document.getElementById("inspectChange"),
  inspectTradedQty: document.getElementById("inspectTradedQty"),
  inspectTrades: document.getElementById("inspectTrades"),
  inspectDelivQty: document.getElementById("inspectDelivQty"),
  inspectDelivPer: document.getElementById("inspectDelivPer"),
  inspectAvg5dPer: document.getElementById("inspectAvg5dPer"),
  inspectDelivVal: document.getElementById("inspectDelivVal"),
  inspectShock: document.getElementById("inspectShock"),
  inspectViewHistoryBtn: document.getElementById("inspectViewHistoryBtn"),

  // Date range
  endDateLabel: document.getElementById("endDateLabel"),
  endDateInput: document.getElementById("endDateInput"),
  dateRangeToggle: document.getElementById("dateRangeToggle"),

  // Angel TOTP
  totpLabel: document.getElementById("totpLabel"),
  totpInput: document.getElementById("totpInput"),
  totpTimer: document.getElementById("totpTimer"),

  // Market Advance Decline charts
  adCanvas: document.getElementById("adCanvas"),
  adTooltip: document.getElementById("adTooltip"),
  adChartTitle: document.getElementById("adChartTitle"),
  adChartMeta: document.getElementById("adChartMeta"),

  // Sector Heatmap & Matrix
  sectorHeatmap: document.getElementById("sectorHeatmap"),
  heatmapMeta: document.getElementById("heatmapMeta"),
  sectorHeatmapSection: document.getElementById("sectorHeatmapSection"),
  secSortBullish: document.getElementById("secSortBullish"),
  secSortBearish: document.getElementById("secSortBearish"),
  secSortAlpha: document.getElementById("secSortAlpha"),
  secSortStocks: document.getElementById("secSortStocks"),
  secFilterSelect: document.getElementById("secFilterSelect"),

  // Analysis Desk Elements: Delivery
  delivSymbolSelect: document.getElementById("delivSymbolSelect"),
  deliveryTimeframePills: document.getElementById("deliveryTimeframePills"),
  delivAvg5D: document.getElementById("delivAvg5D"),
  delivAvg1M: document.getElementById("delivAvg1M"),
  delivHighestDay: document.getElementById("delivHighestDay"),
  delivTrendBadge: document.getElementById("delivTrendBadge"),
  deliveryTableBody: document.getElementById("deliveryTableBody"),

  // Analysis Desk Elements: Participant OI
  participantOiDate: document.getElementById("participantOiDate"),
  participantOiRefreshBtn: document.getElementById("participantOiRefreshBtn"),
  fiiLongRatioBadge: document.getElementById("fiiLongRatioBadge"),
  fiiNetContracts: document.getElementById("fiiNetContracts"),
  fiiDayChange: document.getElementById("fiiDayChange"),
  smartMoneyBias: document.getElementById("smartMoneyBias"),
  divergenceNote: document.getElementById("divergenceNote"),
  participantOiTableBody: document.getElementById("participantOiTableBody"),
  participantHistoryTableBody: document.getElementById("participantHistoryTableBody"),

  // Analysis Desk Elements: Secret Institutional Terminal
  secretRefreshBtn: document.getElementById("secretRefreshBtn"),
  trapProbabilityBadge: document.getElementById("trapProbabilityBadge"),
  trapAlertHeader: document.getElementById("trapAlertHeader"),
  trapAlertDesc: document.getElementById("trapAlertDesc"),
  trapTradeBias: document.getElementById("trapTradeBias"),
  gammaFlipLine: document.getElementById("gammaFlipLine"),
  gammaRegimeVal: document.getElementById("gammaRegimeVal"),
  gammaRegimeSub: document.getElementById("gammaRegimeSub"),
  expiryPinVal: document.getElementById("expiryPinVal"),
  cocVal: document.getElementById("cocVal"),
  cocSentimentVal: document.getElementById("cocSentimentVal"),
  stealthAccumTableBody: document.getElementById("stealthAccumTableBody"),

  // Positional Option Selling Strategy Engine
  posStratBadge: document.getElementById("posStratBadge"),
  posStratRefreshBtn: document.getElementById("posStratRefreshBtn"),
  posStratTitle: document.getElementById("posStratTitle"),
  posStratRationale: document.getElementById("posStratRationale"),
  posWinRate: document.getElementById("posWinRate"),
  posNetCredit: document.getElementById("posNetCredit"),
  posMargin: document.getElementById("posMargin"),
  posHorizon: document.getElementById("posHorizon"),
  posLegsList: document.getElementById("posLegsList"),
  posSlRule: document.getElementById("posSlRule"),
  posConditionPills: document.getElementById("posConditionPills"),

  // Nifty 500 Stealth Accumulation Scanner Controls
  scannerCountTag: document.getElementById("scannerCountTag"),
  scannerUniverseSelect: document.getElementById("scannerUniverseSelect"),
  scannerFilterPills: document.getElementById("scannerFilterPills"),
  accumCountBadge: document.getElementById("accumCountBadge"),
  distCountBadge: document.getElementById("distCountBadge"),
  scannerSearchInput: document.getElementById("scannerSearchInput"),

  // Morning Market Radar Elements
  radarDateBadge: document.getElementById("radarDateBadge"),
  radarRefreshBtn: document.getElementById("radarRefreshBtn"),
  sectorTilesGrid: document.getElementById("sectorTilesGrid"),
  hlGainersList: document.getElementById("hlGainersList"),
  hlLosersList: document.getElementById("hlLosersList"),
  hlVolShockersList: document.getElementById("hlVolShockersList"),
  hlDelSpurtsList: document.getElementById("hlDelSpurtsList"),
  radarTableCountBadge: document.getElementById("radarTableCountBadge"),
  radarSectorSelect: document.getElementById("radarSectorSelect"),
  radarUniverseSelect: document.getElementById("radarUniverseSelect"),
  radarSignalPills: document.getElementById("radarSignalPills"),
  radarSearchInput: document.getElementById("radarSearchInput"),
  masterRadarTableBody: document.getElementById("masterRadarTableBody"),
};

let allScannerStocks = [];
let currentScannerFilter = "all";
let currentScannerUniverse = "all";
let scannerSearchQuery = "";

let allRadarStocks = [];
let currentRadarSector = "all";
let currentRadarUniverse = "all";
let currentRadarSignal = "all";
let radarSearchQuery = "";

let latestData = null;
let hoverIndex = null;
let chartGeometry = null;
let niftyData = null;
let niftyHoverIndex = null;
let niftyChartGeometry = null;
let niftyAdGeometry = null;
let niftyAdHoverIndex = null;
let autoRefreshTimer = null;
let isLoading = false;
let isNiftyLoading = false;
let pendingNiftyLoad = null;
let breadthMessageHtml = "";
let niftyMessageHtml = "";
let adHoverIndex = null;
let adChartGeometry = null;
let currentDeliveryTf = "daily";

const INDEX_LABELS = {
  nifty50: "Nifty 50",
  sensex: "BSE Sensex",
  banknifty: "Bank Nifty",
  finnifty: "FinNifty",
  midcpnifty: "Midcap Select",
  niftyit: "Nifty IT",
  niftyauto: "Nifty Auto",
  niftypharma: "Nifty Pharma",
  niftymetal: "Nifty Metal",
  niftyfmcg: "Nifty FMCG",
  niftyenergy: "Nifty Energy",
  niftymidcap100: "Nifty Midcap 100",
  niftynext50: "Nifty Next 50",
  nifty500: "Nifty 500",
};

const INDEX_SYMBOL_LIMITS = {
  nifty50: 50,
  sensex: 30,
  banknifty: 14,
  finnifty: 20,
  midcpnifty: 25,
  niftyit: 10,
  niftyauto: 15,
  niftypharma: 20,
  niftymetal: 15,
  niftyfmcg: 15,
  niftyenergy: 40,
  niftymidcap100: 100,
  niftynext50: 50,
  nifty500: 500,
};

function indianDate(dateValue) {
  if (!dateValue) return "--";
  const parts = String(dateValue).split("-");
  if (parts.length < 3) return dateValue;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

function formatTime(value) {
  if (!value) return "--";
  const match = String(value).match(/T?(\d{2}:\d{2})/);
  return match ? match[1] : String(value).slice(11, 16);
}

function percent(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  return `${Number(value).toFixed(2)}%`;
}

function number(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  return Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function formatInt(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  return Math.round(Number(value)).toLocaleString("en-IN");
}

function compactNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  return Math.round(Number(value)).toLocaleString("en-IN");
}

function signedNumber(value, suffix = "") {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  const numeric = Number(value);
  return `${numeric >= 0 ? "+" : ""}${numeric.toFixed(2)}${suffix}`;
}

function signedContracts(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  const numeric = Number(value);
  return `${numeric >= 0 ? "+" : ""}${numeric.toLocaleString("en-IN")}`;
}

function universeLabel(value) {
  if (value === "custom") return "Custom";
  return INDEX_LABELS[value] || "Nifty 50";
}

function selectedIndexLabel() {
  return els.indexSelect.options[els.indexSelect.selectedIndex]?.textContent || "Nifty 50";
}

function renderMessages() {
  const clean = [breadthMessageHtml, niftyMessageHtml].filter(Boolean);
  els.messagePanel.classList.toggle("visible", clean.length > 0);
  els.messagePanel.innerHTML = clean.join("<br>");
}

function setMessage(parts) {
  breadthMessageHtml = parts.filter(Boolean).join("<br>");
  if (!breadthMessageHtml) niftyMessageHtml = "";
  renderMessages();
}

function setNiftyMessage(parts) {
  niftyMessageHtml = parts.filter(Boolean).join("<br>");
  renderMessages();
}

function setBusy(isBusy, mode = "run") {
  isLoading = isBusy;
  els.runButton.disabled = isBusy;
  els.refreshButton.disabled = isBusy;
  els.runButton.textContent = isBusy && mode === "run" ? "Running..." : "⚡ Run Breadth";
  els.refreshButton.textContent = isBusy && mode === "refresh" ? "..." : "🔄";
}

function setNiftyBusy(isBusy) {
  isNiftyLoading = isBusy;
}

function setRefreshState(text) {
  els.refreshState.textContent = text;
}

function updateSummary(data) {
  const summary = data.summary || {};
  els.latestBreadth.textContent = percent(summary.latestBreadth);
  els.openBreadth.textContent = percent(summary.openBreadth);
  els.breadthChange.textContent =
    summary.change === null || summary.change === undefined ? "--" : `${summary.change >= 0 ? "+" : ""}${summary.change.toFixed(2)} pts`;
  els.xoCount.textContent = `${summary.x || 0} / ${summary.o || 0}`;
  els.loadedCount.textContent = `${data.symbolsLoaded || 0}/${data.symbolsRequested || 0}`;

  const changeMetric = els.breadthChange.closest(".metric");
  if (changeMetric) {
    changeMetric.classList.toggle("positive", Number(summary.change) > 0);
    changeMetric.classList.toggle("negative", Number(summary.change) < 0);
  }

  els.chartTitle.textContent = `Intraday Breadth (${indianDate(data.date)})`;
  const interval = data.interval.replaceAll("_", " ").toLowerCase();
  const universe = data.universeLabel || universeLabel(data.universe);
  els.chartMeta.textContent = `${universe} | ${interval} | ${data.symbolsLoaded}/${data.symbolsRequested} scrips`;

  // Update Dashboard KPI & Indices Pulse
  const dashBreadth = document.getElementById("dashKpiBreadth");
  if (dashBreadth) dashBreadth.textContent = percent(summary.latestBreadth);
  const dashSensexBr = document.getElementById("dashSensexBreadth");
  if (dashSensexBr) dashSensexBr.textContent = percent(summary.latestBreadth);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function resizeCanvas() {
  const rect = els.canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  els.canvas.width = Math.max(320, Math.round(rect.width * scale));
  els.canvas.height = Math.max(220, Math.round(rect.height * scale));
  const ctx = els.canvas.getContext("2d");
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  if (latestData) drawChart(latestData.timeline);
}

function drawChart(timeline) {
  const canvas = els.canvas;
  const ctx = canvas.getContext("2d");
  const scale = window.devicePixelRatio || 1;
  const width = canvas.width / scale;
  const height = canvas.height / scale;
  chartGeometry = null;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0c121e";
  ctx.fillRect(0, 0, width, height);

  const pad = { left: 45, right: 15, top: 15, bottom: 25 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  ctx.strokeStyle = "#1e293d";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px 'JetBrains Mono', monospace";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  [0, 25, 50, 75, 100].forEach((level) => {
    const y = pad.top + plotH - (level / 100) * plotH;
    ctx.setLineDash(level === 25 || level === 50 || level === 75 ? [4, 4] : []);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillText(`${level}%`, pad.left - 5, y);
  });
  ctx.setLineDash([]);

  ctx.strokeStyle = "#cbd5e1";
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(pad.left, height - pad.bottom);
  ctx.lineTo(width - pad.right, height - pad.bottom);
  ctx.stroke();

  if (!timeline || timeline.length < 2) {
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";
    ctx.fillText("No breadth data", width / 2, height / 2);
    hideTooltip();
    return;
  }

  const xFor = (index) => pad.left + (index / (timeline.length - 1)) * plotW;
  const yFor = (value) => pad.top + plotH - (Math.max(0, Math.min(100, value)) / 100) * plotH;
  chartGeometry = { pad, plotW, plotH, width, height, xFor, yFor, timeline };

  // Fill area with premium gradient
  let started = false;
  ctx.beginPath();
  timeline.forEach((point, index) => {
    if (point.breadth === null || point.breadth === undefined) return;
    const x = xFor(index);
    const y = yFor(point.breadth);
    if (!started) { ctx.moveTo(x, pad.top + plotH); ctx.lineTo(x, y); started = true; }
    else ctx.lineTo(x, y);
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

  // Draw breadth line with smooth anti-aliased rounded joints
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
    if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
  });
  if (started) ctx.stroke();
  ctx.restore();

  // Draw 20 SMA line (smooth amber trendline with subtle glow)
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
    if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
  });
  if (started) ctx.stroke();
  ctx.restore();

  // Time labels
  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px 'JetBrains Mono', monospace";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(formatTime(timeline[0].time), pad.left, height - pad.bottom + 6);
  ctx.textAlign = "right";
  ctx.fillText(formatTime(timeline[timeline.length - 1].time), width - pad.right, height - pad.bottom + 6);

  if (hoverIndex !== null) drawHover(ctx, hoverIndex);
}

function drawHover(ctx, index) {
  if (!chartGeometry || !latestData) return;
  const { timeline, xFor, yFor, pad, plotH } = chartGeometry;
  if (index < 0 || index >= timeline.length) return;
  const point = timeline[index];
  const x = xFor(index);
  const y = yFor(point.breadth);

  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(x, pad.top);
  ctx.lineTo(x, pad.top + plotH);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#3b82f6";
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (els.chartTooltip) {
    const ma = point.ma === null || point.ma === undefined ? "--" : `${point.ma.toFixed(2)}%`;
    const date = String(point.time).slice(0, 10);
    els.chartTooltip.innerHTML = `
      <strong>${indianDate(date)} ${formatTime(point.time)}</strong>
      <span style="color:#60a5fa;">Breadth: <b>${point.breadth.toFixed(2)}%</b></span>
      <span style="color:#f59e0b;">20 SMA: <b>${ma}</b></span>
      <span style="color:#94a3b8;">X/O: <b>${point.x}/${point.o}</b></span>
    `;
    const chartRect = els.canvas.getBoundingClientRect();
    const tooltipRect = els.chartTooltip.getBoundingClientRect();
    const left = Math.min(Math.max(x + 14, 10), chartRect.width - tooltipRect.width - 10);
    const top = Math.min(Math.max(y - 50, 10), chartRect.height - tooltipRect.height - 10);
    els.chartTooltip.style.left = `${left}px`;
    els.chartTooltip.style.top = `${top}px`;
    els.chartTooltip.classList.add("visible");
  }
}

function hideTooltip() {
  hoverIndex = null;
  if (els.chartTooltip) els.chartTooltip.classList.remove("visible");
}

function updateHoverFromClientX(clientX) {
  if (!chartGeometry) return;
  const rect = els.canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const { pad, plotW, timeline } = chartGeometry;
  const clamped = Math.max(pad.left, Math.min(pad.left + plotW, x));
  hoverIndex = Math.round(((clamped - pad.left) / plotW) * (timeline.length - 1));
  drawChart(timeline);
}

function resizeNiftyCanvas() {
  const rect = els.niftyCanvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  els.niftyCanvas.width = Math.max(320, Math.round(rect.width * scale));
  els.niftyCanvas.height = Math.max(220, Math.round(rect.height * scale));
  const ctx = els.niftyCanvas.getContext("2d");
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  if (niftyData) drawNiftyChart(niftyData.points || []);
}

function drawNiftyChart(points) {
  const canvas = els.niftyCanvas;
  const ctx = canvas.getContext("2d");
  const scale = window.devicePixelRatio || 1;
  const width = canvas.width / scale;
  const height = canvas.height / scale;
  niftyChartGeometry = null;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0c121e";
  ctx.fillRect(0, 0, width, height);

  const pad = { left: 60, right: 15, top: 15, bottom: 25 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  if (!points || points.length < 2) {
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillText("No Index data", width / 2, height / 2);
    hideNiftyTooltip();
    return;
  }

  const lows = points.map(p => Number(p.low)).filter(Number.isFinite);
  const highs = points.map(p => Number(p.high)).filter(Number.isFinite);
  const minValue = Math.min(...lows);
  const maxValue = Math.max(...highs);
  const span = Math.max(10, maxValue - minValue);
  const yMin = minValue - span * 0.08;
  const yMax = maxValue + span * 0.08;
  const xFor = (index) => pad.left + (index / (points.length - 1)) * plotW;
  const yFor = (value) => pad.top + plotH - ((value - yMin) / (yMax - yMin)) * plotH;
  niftyChartGeometry = { pad, plotW, plotH, width, height, xFor, yFor, points };

  ctx.strokeStyle = "#1e293d";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px 'JetBrains Mono', monospace";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let i = 0; i <= 4; i++) {
    const value = yMin + ((yMax - yMin) * i) / 4;
    const y = yFor(value);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillText(number(value, 0), pad.left - 5, y);
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(pad.left, height - pad.bottom);
  ctx.lineTo(width - pad.right, height - pad.bottom);
  ctx.stroke();

  ctx.beginPath();
  points.forEach((point, index) => {
    const x = xFor(index);
    const y = yFor(point.close);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2.2;
  ctx.stroke();

  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px 'JetBrains Mono', monospace";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(formatTime(points[0].time), pad.left, height - pad.bottom + 6);
  ctx.textAlign = "right";
  ctx.fillText(formatTime(points[points.length - 1].time), width - pad.right, height - pad.bottom + 6);

  if (niftyHoverIndex !== null) drawNiftyHover(niftyHoverIndex);
}

function drawNiftyHover(index) {
  if (!niftyChartGeometry) return;
  const { points, xFor, yFor, pad, plotH } = niftyChartGeometry;
  const point = points[index];
  if (!point) return;
  const ctx = els.niftyCanvas.getContext("2d");
  const x = xFor(index);
  const y = yFor(point.close);

  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(x, pad.top);
  ctx.lineTo(x, pad.top + plotH);
  ctx.stroke();
  ctx.restore();

  els.niftyTooltip.innerHTML = `
    <strong>${formatTime(point.time)}</strong>
    <span style="color:#38bdf8;">Close: <b>${number(point.close, 2)}</b></span>
  `;
  const chartRect = els.niftyCanvas.getBoundingClientRect();
  const tooltipRect = els.niftyTooltip.getBoundingClientRect();
  const left = Math.min(Math.max(x + 14, 10), chartRect.width - tooltipRect.width - 10);
  const top = Math.min(Math.max(y - 50, 10), chartRect.height - tooltipRect.height - 10);
  els.niftyTooltip.style.left = `${left}px`;
  els.niftyTooltip.style.top = `${top}px`;
  els.niftyTooltip.classList.add("visible");
}

function hideNiftyTooltip() {
  niftyHoverIndex = null;
  if (els.niftyTooltip) els.niftyTooltip.classList.remove("visible");
}

function updateNiftyHoverFromClientX(clientX) {
  if (!niftyChartGeometry) return;
  const rect = els.niftyCanvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const { pad, plotW, points } = niftyChartGeometry;
  const clamped = Math.max(pad.left, Math.min(pad.left + plotW, x));
  niftyHoverIndex = Math.round(((clamped - pad.left) / plotW) * (points.length - 1));
  drawNiftyChart(points);
}

/* ==========================================================================
   NIFTY 50 ADVANCE / DECLINE TRACKER CHART
   ========================================================================== */
function resizeNiftyAdCanvas() {
  if (!els.niftyAdCanvas) return;
  const scale = window.devicePixelRatio || 1;
  const rect = els.niftyAdCanvas.getBoundingClientRect();
  els.niftyAdCanvas.width = Math.max(320, Math.round(rect.width * scale));
  els.niftyAdCanvas.height = Math.max(220, Math.round(rect.height * scale));
  const ctx = els.niftyAdCanvas.getContext("2d");
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  if (latestData) drawNiftyAdChart(latestData.timeline || []);
}

function drawNiftyAdChart(timeline) {
  const canvas = els.niftyAdCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const scale = window.devicePixelRatio || 1;
  const width = canvas.width / scale;
  const height = canvas.height / scale;
  niftyAdGeometry = null;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0c121e";
  ctx.fillRect(0, 0, width, height);

  if (!timeline || !timeline.length) {
    if (els.niftyAdChartMeta) els.niftyAdChartMeta.textContent = "No A/D data";
    return;
  }

  const pad = { top: 18, right: 18, bottom: 25, left: 45 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const points = timeline.filter(p => p.x !== undefined && p.o !== undefined);
  if (!points.length) return;

  // Symmetrical scale for Net Spread (-maxNet to +maxNet), bounded between 10 and 50
  const maxNetVal = Math.max(...points.map(p => Math.abs((p.x || 0) - (p.o || 0))), 10);
  const maxNet = Math.min(50, Math.max(10, Math.ceil(maxNetVal / 5) * 5));

  const xFor = (i) => pad.left + (i / Math.max(1, points.length - 1)) * plotW;
  const yForNet = (v) => pad.top + plotH / 2 - (v / maxNet) * (plotH / 2);
  niftyAdGeometry = { pad, plotW, plotH, width, height, xFor, yForNet, points, maxNet };

  const yZero = yForNet(0);

  // Background Grid Lines & Y-axis labels
  const step = Math.max(5, Math.round(maxNet / 2));
  const gridLevels = [maxNet, step, 0, -step, -maxNet];

  ctx.font = "9px 'JetBrains Mono', monospace";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  gridLevels.forEach(lvl => {
    const y = yForNet(lvl);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);

    if (lvl === 0) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("0", pad.left - 6, y);
    } else {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 0.5;
      ctx.setLineDash([]);
      ctx.stroke();
      ctx.fillStyle = lvl > 0 ? "rgba(16, 185, 129, 0.85)" : "rgba(244, 63, 94, 0.85)";
      ctx.fillText((lvl > 0 ? `+${lvl}` : `${lvl}`), pad.left - 6, y);
    }
  });

  // Soft gradient area fill toward zero baseline
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(xFor(0), yZero);
  points.forEach((p, i) => {
    const net = (p.x || 0) - (p.o || 0);
    ctx.lineTo(xFor(i), yForNet(net));
  });
  ctx.lineTo(xFor(points.length - 1), yZero);
  ctx.closePath();

  const areaGrad = ctx.createLinearGradient(0, pad.top, 0, pad.top + plotH);
  areaGrad.addColorStop(0, "rgba(16, 185, 129, 0.25)");
  areaGrad.addColorStop(0.48, "rgba(16, 185, 129, 0.02)");
  areaGrad.addColorStop(0.52, "rgba(244, 63, 94, 0.02)");
  areaGrad.addColorStop(1, "rgba(244, 63, 94, 0.25)");
  ctx.fillStyle = areaGrad;
  ctx.fill();
  ctx.restore();

  // Draw ONLY Net Spread Curve (solid cyan line with rounded joints)
  ctx.save();
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2.2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  let started = false;
  points.forEach((p, i) => {
    const net = (p.x || 0) - (p.o || 0);
    const x = xFor(i);
    const y = yForNet(net);
    if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.restore();

  // Highlight current / latest point with circular badge
  const last = points[points.length - 1];
  const netLast = (last.x || 0) - (last.o || 0);
  const lastX = xFor(points.length - 1);
  const lastY = yForNet(netLast);

  ctx.save();
  ctx.fillStyle = netLast >= 0 ? "#10b981" : "#f43f5e";
  ctx.beginPath();
  ctx.arc(lastX, lastY, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // Time labels on X-axis
  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px 'JetBrains Mono', monospace";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(formatTime(points[0].time), pad.left, height - pad.bottom + 6);
  ctx.textAlign = "right";
  ctx.fillText(formatTime(points[points.length - 1].time), width - pad.right, height - pad.bottom + 6);

  // Title and Meta Header
  if (els.niftyAdChartTitle) {
    const uLabel = universeLabel(els.universeSelect ? els.universeSelect.value : "nifty50");
    els.niftyAdChartTitle.textContent = `${uLabel} Advance / Decline Tracker`;
  }
  if (els.niftyAdChartMeta) {
    const sign = netLast > 0 ? "+" : "";
    els.niftyAdChartMeta.textContent = `Net Spread: ${sign}${netLast}`;
  }

  if (niftyAdHoverIndex !== null) drawNiftyAdHover(niftyAdHoverIndex);
}

function updateNiftyAdHoverFromClientX(clientX) {
  if (!niftyAdGeometry) return;
  const rect = els.niftyAdCanvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const { pad, plotW, points } = niftyAdGeometry;
  const clamped = Math.max(pad.left, Math.min(pad.left + plotW, x));
  niftyAdHoverIndex = Math.round(((clamped - pad.left) / plotW) * (points.length - 1));
  drawNiftyAdChart(niftyAdGeometry.points);
}

function drawNiftyAdHover(index) {
  if (!niftyAdGeometry) return;
  const { points, xFor, yForNet, pad, plotH } = niftyAdGeometry;
  if (index < 0 || index >= points.length) return;
  const p = points[index];
  const x = xFor(index);
  const net = (p.x || 0) - (p.o || 0);
  const y = yForNet(net);

  const ctx = els.niftyAdCanvas.getContext("2d");
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(x, pad.top);
  ctx.lineTo(x, pad.top + plotH);
  ctx.stroke();
  ctx.restore();

  // Hover dot on Net Spread curve
  ctx.save();
  ctx.fillStyle = net >= 0 ? "#10b981" : "#f43f5e";
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  if (els.niftyAdTooltip) {
    const time = p.time ? String(p.time).split(" ").pop().slice(0, 8) : "";
    const sign = net > 0 ? "+" : "";
    const netColor = net > 0 ? "#10b981" : (net < 0 ? "#f43f5e" : "#94a3b8");
    els.niftyAdTooltip.innerHTML = `
      <div style="font-weight:700; margin-bottom:4px; color:#f8fafc;">${time}</div>
      <div style="color:${netColor}; font-size:13px; font-weight:800;">Net Spread: ${sign}${net}</div>
      <div style="color:#94a3b8; font-size:10px; margin-top:2px;">Advances: ${p.x || 0} | Declines: ${p.o || 0}</div>
    `;
    const canvasRect = els.niftyAdCanvas.getBoundingClientRect();
    const tipRect = els.niftyAdTooltip.getBoundingClientRect();
    const left = Math.min(Math.max(x + 14, 10), canvasRect.width - (tipRect.width || 120) - 10);
    const top = Math.min(Math.max(y - 45, 10), canvasRect.height - (tipRect.height || 50) - 10);
    els.niftyAdTooltip.style.left = `${left}px`;
    els.niftyAdTooltip.style.top = `${top}px`;
    els.niftyAdTooltip.classList.add("visible");
  }
}

function hideNiftyAdTooltip() {
  niftyAdHoverIndex = null;
  if (els.niftyAdTooltip) els.niftyAdTooltip.classList.remove("visible");
}

function resizeAdCanvases() {
  const scale = window.devicePixelRatio || 1;
  [els.adCanvas].forEach(canvas => {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(320, Math.round(rect.width * scale));
    canvas.height = Math.max(220, Math.round(rect.height * scale));
    const ctx = canvas.getContext("2d");
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
  });
}

function drawAdChart(timeline) {
  const canvas = els.adCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const scale = window.devicePixelRatio || 1;
  const width = canvas.width / scale;
  const height = canvas.height / scale;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0c121e";
  ctx.fillRect(0, 0, width, height);

  if (!timeline || !timeline.length) {
    els.adChartMeta.textContent = "No A/D data";
    return;
  }
  const pad = { top: 15, right: 15, bottom: 25, left: 40 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const points = timeline.filter(p => p.x !== undefined && p.o !== undefined);
  if (!points.length) return;

  const maxVal = Math.max(...points.map(p => Math.max(p.x || 0, p.o || 0)), 1);
  const yScale = plotH / maxVal;
  const xStep = plotW / Math.max(1, points.length - 1);
  const yFor = (v) => pad.top + plotH - v * yScale;
  const xFor = (i) => pad.left + i * xStep;
  adChartGeometry = { pad, plotW, plotH, width, height, xFor, yFor, points };

  function linePath(values, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    let started = false;
    values.forEach((v, i) => {
      const x = xFor(i);
      const y = yFor(v);
      if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  linePath(points.map(p => p.x || 0), "#10b981");
  linePath(points.map(p => p.o || 0), "#f43f5e");

  ctx.fillStyle = "#94a3b8";
  ctx.font = "9px 'JetBrains Mono', monospace";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let i = 0; i <= 4; i++) {
    const val = Math.round((maxVal / 4) * i);
    const y = yFor(val);
    ctx.fillText(val, pad.left - 5, y);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
  }

  const last = points[points.length - 1];
  els.adChartMeta.textContent = `Adv: ${last.x || 0} | Dec: ${last.o || 0}`;

  if (adHoverIndex !== null) drawAdHover(adHoverIndex);
}

function updateAdHoverFromClientX(clientX) {
  if (!adChartGeometry) return;
  const rect = els.adCanvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const { pad, plotW, points } = adChartGeometry;
  const clamped = Math.max(pad.left, Math.min(pad.left + plotW, x));
  adHoverIndex = Math.round(((clamped - pad.left) / plotW) * (points.length - 1));
  drawAdChart(adChartGeometry.points);
}

function drawAdHover(index) {
  if (!adChartGeometry) return;
  const { points, xFor, yFor, pad, plotH } = adChartGeometry;
  if (index < 0 || index >= points.length) return;
  const p = points[index];
  const x = xFor(index);

  const ctx = els.adCanvas.getContext("2d");
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(x, pad.top);
  ctx.lineTo(x, pad.top + plotH);
  ctx.stroke();
  ctx.restore();

  if (els.adTooltip) {
    const time = p.time ? String(p.time).split(" ").pop().slice(0, 8) : "";
    els.adTooltip.innerHTML = `
      <strong>${time}</strong>
      <span style="color:#10b981">Advances: <b>${p.x || 0}</b></span>
      <span style="color:#f43f5e">Declines: <b>${p.o || 0}</b></span>
    `;
    const canvasRect = els.adCanvas.getBoundingClientRect();
    const tipRect = els.adTooltip.getBoundingClientRect();
    const left = Math.min(Math.max(x + 14, 10), canvasRect.width - tipRect.width - 10);
    const top = Math.min(Math.max(yFor(p.x || 0) - 50, 10), canvasRect.height - tipRect.height - 10);
    els.adTooltip.style.left = `${left}px`;
    els.adTooltip.style.top = `${top}px`;
    els.adTooltip.classList.add("visible");
  }
}

function hideAdTooltip() {
  adHoverIndex = null;
  if (els.adTooltip) els.adTooltip.classList.remove("visible");
}

let currentSectorData = [];
let sectorSortMode = "bullish";
let sectorFilterMode = "all";

function renderSectorHeatmap(sectors) {
  if (sectors && Array.isArray(sectors)) {
    currentSectorData = sectors;
  }
  const container = els.sectorHeatmap;
  if (!container) return;

  if (!currentSectorData || !currentSectorData.length) {
    container.innerHTML = '<div class="sector-empty-state">No sector breadth data available for this session</div>';
    if (els.heatmapMeta) els.heatmapMeta.innerHTML = "";
    return;
  }

  // Aggregate stats across all sectors
  const totalSectors = currentSectorData.length;
  const avgPct = currentSectorData.reduce((s, sec) => s + (sec.advancePct || 0), 0) / totalSectors;
  const bullCount = currentSectorData.filter(s => (s.advancePct || 0) >= 50).length;
  const bearCount = currentSectorData.filter(s => (s.advancePct || 0) < 50).length;

  if (els.heatmapMeta) {
    els.heatmapMeta.innerHTML = `
      <span class="sec-pill avg" title="Average Advance Breadth across all sectors">Avg: ${avgPct.toFixed(1)}%</span>
      <span class="sec-pill bull" title="Sectors with >=50% Advance">▲ ${bullCount} Bullish</span>
      <span class="sec-pill bear" title="Sectors with <50% Advance">▼ ${bearCount} Bearish</span>
    `;
  }

  // Filter sectors
  let list = [...currentSectorData];
  if (sectorFilterMode === "bullish") {
    list = list.filter(s => (s.advancePct || 0) >= 50);
  } else if (sectorFilterMode === "bearish") {
    list = list.filter(s => (s.advancePct || 0) < 50);
  }

  // Sort sectors
  if (sectorSortMode === "bullish") {
    list.sort((a, b) => (b.advancePct || 0) - (a.advancePct || 0));
  } else if (sectorSortMode === "bearish") {
    list.sort((a, b) => (a.advancePct || 0) - (b.advancePct || 0));
  } else if (sectorSortMode === "alpha") {
    list.sort((a, b) => (a.sector || "").localeCompare(b.sector || ""));
  } else if (sectorSortMode === "stocks") {
    list.sort((a, b) => (b.stocks || 0) - (a.stocks || 0));
  }

  if (!list.length) {
    container.innerHTML = `<div class="sector-empty-state">No sectors matching filter "${escapeHtml(sectorFilterMode)}"</div>`;
    return;
  }

  let html = "";
  list.forEach(sec => {
    const pct = Number(sec.advancePct || 0);
    const isBull = pct >= 50;
    const total = (sec.x || 0) + (sec.o || 0) + (sec.neutral || 0) || sec.stocks || 1;
    const advWidth = Math.round(((sec.x || 0) / total) * 100);
    const decWidth = Math.round(((sec.o || 0) / total) * 100);
    const neuWidth = Math.max(0, 100 - advWidth - decWidth);
    const net = (sec.x || 0) - (sec.o || 0);
    const netClass = net > 0 ? "pos" : (net < 0 ? "neg" : "zero");
    const netText = net > 0 ? `+${net}` : `${net}`;
    const statusClass = pct >= 60 ? "bullish" : (pct < 40 ? "bearish" : "neutral");
    const pctClass = isBull ? "bull" : "bear";
    const arrow = isBull ? "▲" : "▼";

    html += `
      <div class="sector-card ${statusClass}">
        <div class="sector-card-top">
          <span class="sector-card-name" title="${escapeHtml(sec.sector)}">${escapeHtml(sec.sector)}</span>
          <span class="sector-card-pct ${pctClass}">${arrow} ${pct.toFixed(0)}%</span>
        </div>
        <div class="sector-card-bar-wrap" title="Advances: ${sec.x || 0} (${advWidth}%) | Declines: ${sec.o || 0} (${decWidth}%)">
          <div class="sector-bar-adv" style="width: ${advWidth}%;"></div>
          <div class="sector-bar-neu" style="width: ${neuWidth}%;"></div>
          <div class="sector-bar-dec" style="width: ${decWidth}%;"></div>
        </div>
        <div class="sector-card-stats">
          <span><span class="sec-count-adv">▲ ${sec.x || 0}</span> / <span class="sec-count-dec">▼ ${sec.o || 0}</span></span>
          <span class="sec-count-net ${netClass}">${netText} Net</span>
          <span>${sec.stocks || total} scrips</span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function updateTotpTimer() {
  if (!els.totpTimer || !els.totpLabel || els.totpLabel.style.display === "none") return;
  const now = Math.floor(Date.now() / 1000);
  const remaining = 30 - (now % 30);
  els.totpTimer.textContent = `(${remaining}s)`;
  els.totpTimer.style.color = remaining <= 5 ? "#f43f5e" : "var(--primary)";
}
setInterval(updateTotpTimer, 1000);

async function runBreadth(options = {}) {
  if (isLoading) return;
  const fastRefresh = Boolean(options.fastRefresh);
  setBusy(true, fastRefresh ? "refresh" : "run");
  setRefreshState(fastRefresh ? "Refreshing..." : "Running...");
  setMessage([]);
  hideTooltip();
  try {
    const payload = payloadFromForm();
    payload.fastRefresh = fastRefresh;
    const res = await fetch("/api/breadth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.message || "Breadth request failed");
    }
    latestData = data;
    updateSummary(data);
    drawChart(data.timeline || []);
    if (data.sectorBreadth && data.sectorBreadth.length) {
      renderSectorHeatmap(data.sectorBreadth);
    }
    if (els.adCanvas) {
      resizeAdCanvases();
      drawAdChart(data.timeline || []);
    }
    if (els.niftyAdCanvas) {
      resizeNiftyAdCanvas();
      drawNiftyAdChart(data.timeline || []);
    }
    setRefreshState(`Updated ${formatTime(data.summary.latestTime)}`);
    loadNifty({ fastRefresh: true });
  } catch (error) {
    latestData = null;
    drawChart([]);
    renderSectorHeatmap([]);
    setMessage([`<strong>Error:</strong> ${escapeHtml(error.message)}`]);
    setRefreshState("Failed");
  } finally {
    setBusy(false);
  }
}

function payloadFromForm() {
  const payload = {
    date: els.dateInput.value,
    endDate: els.dateRangeToggle.checked ? els.endDateInput.value : els.dateInput.value,
    dataSource: els.dataSource.value,
    universe: els.universeSelect.value,
    interval: els.intervalInput.value,
    chartMode: els.chartMode.value,
    warmupSessions: Number(els.warmupSessions.value),
    pnfBasis: els.pnfBasis.value,
    boxPercent: Number(els.boxPercent.value),
    reversalBoxes: Number(els.reversalBoxes.value),
    maxSymbols: Number(els.maxSymbols.value),
    maWindow: 20,
    fastRefresh: false,
    symbols: els.symbolsInput.value,
    startTime: "09:15",
    endTime: "15:30",
  };
  if ((els.dataSource.value === "angel" || els.dataSource.value === "broker") && els.totpInput && els.totpInput.value.trim()) {
    payload.manualTotp = els.totpInput.value.trim();
  }
  return payload;
}

function niftyPayloadFromForm() {
  const payload = {
    date: els.dateInput.value,
    dataSource: els.dataSource.value,
    index: els.indexSelect.value,
    interval: els.intervalInput.value,
    includeOptionChain: true,
    fastRefresh: false,
    startTime: "09:15",
    endTime: "15:30",
  };
  if ((els.dataSource.value === "angel" || els.dataSource.value === "broker") && els.totpInput && els.totpInput.value.trim()) {
    payload.manualTotp = els.totpInput.value.trim();
  }
  return payload;
}

function updateNiftySummary(data) {
  const chart = data.chartSummary || {};
  const index = data.index || {};
  const change = chart.change ?? index.change;
  const changePct = chart.percentChange ?? index.percentChange;
  els.niftySpot.textContent = number(index.spot ?? chart.close, 2);
  els.niftyChange.textContent =
    change === null || change === undefined ? "--" : `${signedNumber(change)} (${signedNumber(changePct, "%")})`;

  els.niftyChange.classList.toggle("positive-text", Number(change) > 0);
  els.niftyChange.classList.toggle("negative-text", Number(change) < 0);

  const indexName = data.index?.name || selectedIndexLabel();
  let statusBadge = "";
  if (data.isSimulated || data.dataSource === "sample") {
    const broker = data.brokerName || "Broker";
    const err = String(data.brokerError || "").toLowerCase();
    if (err.includes("401") || err.includes("invalid token") || err.includes("token expired") || err.includes("udapi100050")) {
      statusBadge = ` [⚠️ ${broker} Token Expired]`;
    } else if (data.brokerError) {
      statusBadge = ` [⚠️ ${broker} Offline]`;
    } else {
      statusBadge = ` [Simulated]`;
    }
  }
  els.niftyChartTitle.textContent = `${indexName} Spot${statusBadge}`;
  const interval = data.interval.replaceAll("_", " ").toLowerCase();
  els.niftyChartMeta.textContent = `${interval} | ${data.points.length} candles`;

  // Update Live Pulse Strip & Dashboard Indices Row
  const spotVal = index.spot ?? chart.close;
  const pulseNifty = document.getElementById("pulseNiftyVal");
  if (pulseNifty && spotVal) {
    pulseNifty.textContent = `${number(spotVal, 2)} (${change !== null && change !== undefined ? signedNumber(change) : '--'})`;
    pulseNifty.style.color = Number(change) >= 0 ? "#10b981" : "#ef4444";
  }
  const dashNifty = document.getElementById("dashNiftySpot");
  if (dashNifty && spotVal) dashNifty.textContent = number(spotVal, 2);
  const dashNiftyC = document.getElementById("dashNiftyChg");
  if (dashNiftyC && change !== null && change !== undefined) {
    dashNiftyC.textContent = `${signedNumber(change)} (${signedNumber(changePct, "%")})`;
    dashNiftyC.className = "idx-chg " + (Number(change) >= 0 ? "positive" : "negative");
  }

  // Sensex approximation from Nifty
  if (spotVal) {
    const sensexSpot = spotVal * 3.2801;
    const sensexChg = (change || 0) * 3.2801;
    const pulseSensex = document.getElementById("pulseSensexVal");
    if (pulseSensex) {
      pulseSensex.textContent = `${number(sensexSpot, 2)} (${signedNumber(sensexChg)})`;
      pulseSensex.style.color = Number(change) >= 0 ? "#10b981" : "#ef4444";
    }
    const dashSensex = document.getElementById("dashSensexSpot");
    if (dashSensex) dashSensex.textContent = number(sensexSpot, 2);
    const dashSensexC = document.getElementById("dashSensexChg");
    if (dashSensexC) {
      dashSensexC.textContent = `${signedNumber(sensexChg)} (${signedNumber(changePct, "%")})`;
      dashSensexC.className = "idx-chg " + (Number(change) >= 0 ? "positive" : "negative");
    }
  }
}

async function loadNifty(options = {}) {
  if (isNiftyLoading) {
    pendingNiftyLoad = { ...options };
    return;
  }
  const fastRefresh = Boolean(options.fastRefresh);
  setNiftyBusy(true);
  hideNiftyTooltip();
  try {
    const payload = niftyPayloadFromForm();
    payload.fastRefresh = fastRefresh;
    const res = await fetch("/api/nifty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.message || "Nifty request failed");
    }
    niftyData = data;
    updateNiftySummary(data);
    drawNiftyChart(data.points || []);
  } catch (error) {
    niftyData = null;
    drawNiftyChart([]);
  } finally {
    setNiftyBusy(false);
    if (pendingNiftyLoad) {
      const nextLoad = pendingNiftyLoad;
      pendingNiftyLoad = null;
      loadNifty(nextLoad);
    }
  }
}

function scheduleAutoRefresh() {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer);
    autoRefreshTimer = null;
  }
  if (!els.autoRefresh.checked) {
    setRefreshState(latestData ? `Updated ${formatTime(latestData.summary.latestTime)}` : "Manual mode");
    return;
  }
  const seconds = Number(els.refreshInterval.value) || 60;
  setRefreshState(`Auto ${seconds}s`);
  autoRefreshTimer = setInterval(() => {
    if (!isLoading) runBreadth({ fastRefresh: true });
  }, seconds * 1000);
}

/* ==========================================================================
   Options Desk Logic, Real-Time Auto-Refresh & GoCharting Statistics
   ========================================================================== */
let optChainDataGlobal = null;
let isOptLoading = false;
let isOptionsTabActive = false;
let autoRefreshTotalSeconds = 5;
let autoRefreshCountdown = 5;
let isAutoRefreshActive = true;
let lastLtpCache = {};

function initOptionsAutoRefresh() {
  if (els.optAutoRefreshToggle) {
    els.optAutoRefreshToggle.addEventListener("change", (e) => {
      isAutoRefreshActive = e.target.checked;
      updateAutoRefreshStatusUI();
      if (isAutoRefreshActive) resetAutoRefreshTimer();
    });
  }
  if (els.optRefreshInterval) {
    els.optRefreshInterval.addEventListener("change", (e) => {
      autoRefreshTotalSeconds = Math.max(2, Math.round(Number(e.target.value) / 1000));
      resetAutoRefreshTimer();
    });
  }
  setInterval(tickAutoRefresh, 1000);
}

function updateAutoRefreshStatusUI() {
  if (els.optLivePulseBadge) {
    els.optLivePulseBadge.classList.toggle("paused", !isAutoRefreshActive);
  }
  if (els.optLiveStatusText) {
    els.optLiveStatusText.textContent = isAutoRefreshActive ? "LIVE STREAM" : "PAUSED";
  }
}

function resetAutoRefreshTimer() {
  autoRefreshCountdown = autoRefreshTotalSeconds;
  updateCountdownUI();
}

function updateCountdownUI() {
  if (els.optCountdownBadge) {
    els.optCountdownBadge.textContent = isAutoRefreshActive ? `${autoRefreshCountdown}s` : "PAUSED";
  }
  if (els.optCountdownFill) {
    const pct = isAutoRefreshActive ? Math.max(0, (autoRefreshCountdown / autoRefreshTotalSeconds) * 100) : 0;
    els.optCountdownFill.style.width = `${pct}%`;
  }
}

function tickAutoRefresh() {
  if (!isAutoRefreshActive || !isOptionsTabActive || isOptLoading) return;
  autoRefreshCountdown--;
  if (autoRefreshCountdown <= 0) {
    autoRefreshCountdown = autoRefreshTotalSeconds;
    loadOptionChain({ isBackground: true });
  }
  updateCountdownUI();
}

function switchOptionsSubtab(target = "chainView") {
  [els.subtabChain, els.subtabStats, els.subtabWpcrPce, els.subtabVolatility].forEach(btn => {
    if (btn) btn.classList.toggle("active", btn.dataset.target === target);
  });
  if (els.optChainViewWrap) els.optChainViewWrap.style.display = target === "chainView" ? "block" : "none";
  if (els.optStatsViewWrap) els.optStatsViewWrap.style.display = target === "statsView" ? "flex" : "none";
  if (els.optWpcrPceViewWrap) els.optWpcrPceViewWrap.style.display = target === "wpcrPceView" ? "block" : "none";
  if (els.optVolatilityViewWrap) els.optVolatilityViewWrap.style.display = target === "volatilityView" ? "block" : "none";

  if (target === "chainView") {
    resizeOptCanvases();
  } else if (target === "wpcrPceView") {
    requestAnimationFrame(() => {
      if (wpcrChartMode === "strike_bars") {
        drawWpcrCapitalChart();
      } else {
        drawWpcrTimeSeriesChart();
      }
    });
  }
}

// ==============================================================================
// 🏛️ Index-Wise Activity & Position Master Terminal (Kaam & Setup Deep Dive)
// ==============================================================================
let indicesOverviewDataGlobal = null;
let isLoadingIndicesOverview = false;

async function loadIndicesOverview(force = false) {
  if (isLoadingIndicesOverview) return;
  isLoadingIndicesOverview = true;
  if (els.btnRefreshIndicesOverview) {
    els.btnRefreshIndicesOverview.disabled = true;
    els.btnRefreshIndicesOverview.textContent = "Loading...";
  }

  try {
    const dateVal = (els.dateInput && els.dateInput.value) || "";
    const res = await fetch(`/api/indices-overview?date=${encodeURIComponent(dateVal)}&fastRefresh=${force ? "false" : "true"}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && data.ok) {
      indicesOverviewDataGlobal = data;
      renderIndicesOverview(data);
    }
  } catch (err) {
    console.error("Failed to load indices overview:", err);
  } finally {
    isLoadingIndicesOverview = false;
    if (els.btnRefreshIndicesOverview) {
      els.btnRefreshIndicesOverview.disabled = false;
      els.btnRefreshIndicesOverview.textContent = "🔄 Refresh Activity";
    }
  }
}

function renderIndicesOverview(data) {
  if (!data || !data.indices) return;
  const totals = data.marketTotals || {};
  const items = data.indices || [];

  // 1. KPI Strip
  if (els.idxTotVol) els.idxTotVol.textContent = totals.totalVolume ? Number(totals.totalVolume).toLocaleString("en-IN") : "--";
  if (els.idxTotTurnover) els.idxTotTurnover.textContent = totals.totalTurnoverCr ? `Est. Turnover: ₹${Number(totals.totalTurnoverCr).toLocaleString("en-IN")} Cr` : "Est. Turnover: ₹-- Cr";
  if (els.idxTotOi) els.idxTotOi.textContent = totals.totalOi ? Number(totals.totalOi).toLocaleString("en-IN") : "--";
  if (els.idxTotOiChg) {
    const chg = totals.netOiChange || 0;
    const sign = chg >= 0 ? "+" : "";
    els.idxTotOiChg.textContent = `Net Flow: ${sign}${Number(chg).toLocaleString("en-IN")}`;
    els.idxTotOiChg.style.color = chg >= 0 ? "#16a34a" : "#dc2626";
  }
  if (els.idxMarketPcr) els.idxMarketPcr.textContent = totals.marketPcr ? totals.marketPcr.toFixed(2) : "--";
  if (els.idxMarketPcrSub) els.idxMarketPcrSub.textContent = `Cross-Index Average: ${totals.marketPcr ? totals.marketPcr.toFixed(2) : "--"}`;
  if (els.idxDominant) els.idxDominant.textContent = totals.dominantIndex || "--";
  if (els.idxDominantSub) els.idxDominantSub.textContent = "Highest Derivatives Flow";
  if (els.idxOverviewAsOf) els.idxOverviewAsOf.textContent = `As of: ${data.asOf || "--"}`;

  // 2. Section 1: "Kisme Kitna Kaam Hua" (Volume & Turnover Table)
  if (els.idxVolumeTableBody) {
    els.idxVolumeTableBody.innerHTML = items.map(idx => {
      const chg = idx.change || 0;
      const chgPct = idx.percentChange || 0;
      const chgClass = chg >= 0 ? "stat-positive" : "stat-negative";
      const chgSign = chg >= 0 ? "+" : "";
      
      const volPcr = idx.volumePcr || 0;
      let pcrClass = "neutral";
      let pcrLabel = "Neutral";
      if (volPcr >= 1.1) { pcrClass = "bullish"; pcrLabel = "Put Heavy (Bullish)"; }
      else if (volPcr <= 0.85) { pcrClass = "bearish"; pcrLabel = "Call Heavy (Bearish)"; }

      const sharePct = idx.volumeSharePct || 0;
      const callVol = idx.callVolume || 0;
      const putVol = idx.putVolume || 0;
      const callVolPct = idx.callVolPct || 50;
      const putVolPct = idx.putVolPct || 50;

      return `
        <tr>
          <td>
            <div class="idx-name-cell">
              <span class="idx-name-text">${idx.label}</span>
              <span class="idx-spot-text">₹${Number(idx.spot).toLocaleString("en-IN", {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
            </div>
          </td>
          <td>
            <span class="${chgClass}" style="font-weight:700; font-family:'JetBrains Mono',monospace;">
              ${chgSign}${chg.toFixed(2)} (${chgSign}${chgPct.toFixed(2)}%)
            </span>
          </td>
          <td>
            <strong style="font-family:'JetBrains Mono',monospace; font-size:13px;">${Number(idx.totalVolume).toLocaleString("en-IN")}</strong>
          </td>
          <td>
            <div class="idx-share-bar-wrap">
              <div class="idx-share-track">
                <div class="idx-share-fill" style="width: ${sharePct}%;"></div>
              </div>
              <span style="font-size:11px; font-weight:700; font-family:'JetBrains Mono',monospace;">${sharePct}%</span>
            </div>
          </td>
          <td>
            <div class="idx-split-bar-wrap">
              <div class="idx-split-bar">
                <div class="idx-split-ce" style="width: ${callVolPct}%;" title="Calls: ${callVol.toLocaleString('en-IN')} (${callVolPct}%)"></div>
                <div class="idx-split-pe" style="width: ${putVolPct}%;" title="Puts: ${putVol.toLocaleString('en-IN')} (${putVolPct}%)"></div>
              </div>
              <div class="idx-split-labels">
                <span style="color:#16a34a;">CE: ${Number(callVol).toLocaleString("en-IN")}</span>
                <span style="color:#dc2626;">PE: ${Number(putVol).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </td>
          <td>
            <span class="idx-pcr-badge ${pcrClass}" title="${pcrLabel}">
              ${volPcr.toFixed(2)}
            </span>
          </td>
          <td>
            <strong style="color:#2563eb; font-family:'JetBrains Mono',monospace;">₹${Number(idx.turnoverCr).toLocaleString("en-IN")} Cr</strong>
          </td>
          <td>
            <span style="background:#f1f5f9; padding:3px 8px; border-radius:4px; font-weight:700; font-size:11px; color:#334155; font-family:'JetBrains Mono',monospace;">
              ${idx.mostActiveStrike || "--"}
            </span>
          </td>
          <td>
            <button type="button" class="idx-jump-btn" data-jump-index="${idx.key}" data-jump-tab="chainView">
              Chain ➜
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  // 3. Section 2: "Kisme Kitna Position Bana Hua Hai" (Open Interest & Buildup Table)
  if (els.idxOiTableBody) {
    els.idxOiTableBody.innerHTML = items.map(idx => {
      const netOiChg = idx.netOiChange || 0;
      const netSign = netOiChg >= 0 ? "+" : "";
      const netColor = netOiChg >= 0 ? "#16a34a" : "#dc2626";

      const callOi = idx.callOi || 0;
      const putOi = idx.putOi || 0;
      const callOiPct = idx.callOiPct || 50;
      const putOiPct = idx.putOiPct || 50;

      const pcrOi = idx.pcrOi || 0;
      let pcrClass = "neutral";
      if (pcrOi >= 1.2) pcrClass = "bullish";
      else if (pcrOi <= 0.8) pcrClass = "bearish";

      const wpcr = idx.wpcr ? idx.wpcr.toFixed(3) : "--";

      const maxPain = idx.maxPain || "--";
      const maxPainDist = idx.maxPainDist != null ? (idx.maxPainDist > 0 ? `+${idx.maxPainDist}` : `${idx.maxPainDist}`) : "";

      const supportStr = idx.support ? `${idx.support} (${Number(idx.supportOi || 0).toLocaleString("en-IN")})` : "--";
      const resistStr = idx.resistance ? `${idx.resistance} (${Number(idx.resistanceOi || 0).toLocaleString("en-IN")})` : "--";

      return `
        <tr>
          <td>
            <div class="idx-name-cell">
              <span class="idx-name-text">${idx.label}</span>
              <span style="font-size:10.5px; color:var(--text-muted); font-family:'JetBrains Mono',monospace;">${idx.selectedExpiry || ""}</span>
            </div>
          </td>
          <td>
            <strong style="font-family:'JetBrains Mono',monospace; font-size:13px;">${Number(idx.totalOi).toLocaleString("en-IN")}</strong>
          </td>
          <td>
            <span style="font-family:'JetBrains Mono',monospace; font-weight:700; color:${netColor};">
              ${netSign}${Number(netOiChg).toLocaleString("en-IN")}
            </span>
          </td>
          <td>
            <div class="idx-split-bar-wrap">
              <div class="idx-split-bar">
                <div class="idx-split-ce" style="width: ${callOiPct}%;" title="Calls OI: ${callOi.toLocaleString('en-IN')} (${callOiPct}%)"></div>
                <div class="idx-split-pe" style="width: ${putOiPct}%;" title="Puts OI: ${putOi.toLocaleString('en-IN')} (${putOiPct}%)"></div>
              </div>
              <div class="idx-split-labels">
                <span style="color:#16a34a;">CE: ${callOiPct}%</span>
                <span style="color:#dc2626;">PE: ${putOiPct}%</span>
              </div>
            </div>
          </td>
          <td>
            <span class="idx-pcr-badge ${pcrClass}">
              ${pcrOi.toFixed(2)}
            </span>
          </td>
          <td>
            <strong style="font-family:'JetBrains Mono',monospace; color:#7c3aed;">${wpcr}</strong>
          </td>
          <td>
            <span style="font-weight:700; font-family:'JetBrains Mono',monospace;">
              ${maxPain} <span style="font-size:10.5px; color:var(--text-muted);">(${maxPainDist})</span>
            </span>
          </td>
          <td>
            <span style="color:#16a34a; font-weight:700; font-family:'JetBrains Mono',monospace; font-size:11px;">
              ${supportStr}
            </span>
          </td>
          <td>
            <span style="color:#dc2626; font-weight:700; font-family:'JetBrains Mono',monospace; font-size:11px;">
              ${resistStr}
            </span>
          </td>
          <td>
            <span class="idx-buildup-badge ${idx.buildupClass || 'neutral'}" title="${idx.stance || ''}">
              ${idx.buildup || 'NEUTRAL'}
            </span>
          </td>
          <td>
            <button type="button" class="idx-jump-btn" data-jump-index="${idx.key}" data-jump-tab="statsView">
              Stats ➜
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  // 4. Section 3: Visual Multi-Index Snapshot Cards
  if (els.idxVisualCardsGrid) {
    els.idxVisualCardsGrid.innerHTML = items.map(idx => {
      const chg = idx.change || 0;
      const chgPct = idx.percentChange || 0;
      const chgClass = chg >= 0 ? "stat-positive" : "stat-negative";
      const chgSign = chg >= 0 ? "+" : "";

      return `
        <div class="idx-mini-card">
          <div class="idx-mini-header">
            <div>
              <div class="idx-mini-title">${idx.label}</div>
              <div class="idx-mini-spot">₹${Number(idx.spot).toLocaleString("en-IN", {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
            </div>
            <div style="text-align:right;">
              <div class="${chgClass}" style="font-weight:700; font-family:'JetBrains Mono',monospace; font-size:12px;">
                ${chgSign}${chg.toFixed(2)} (${chgSign}${chgPct.toFixed(2)}%)
              </div>
              <span class="idx-buildup-badge ${idx.buildupClass || 'neutral'}" style="margin-top:4px;">
                ${idx.buildup || 'CONSOLIDATION'}
              </span>
            </div>
          </div>

          <div class="idx-mini-row">
            <span>Derivatives Vol (Kaam):</span>
            <strong>${Number(idx.totalVolume).toLocaleString("en-IN")}</strong>
          </div>
          <div class="idx-mini-row">
            <span>Traded Turnover:</span>
            <strong style="color:#2563eb;">₹${Number(idx.turnoverCr).toLocaleString("en-IN")} Cr</strong>
          </div>
          <div class="idx-mini-row">
            <span>Open Interest (Position):</span>
            <strong>${Number(idx.totalOi).toLocaleString("en-IN")}</strong>
          </div>
          <div class="idx-mini-row">
            <span>PCR (OI) / Opstra wPCR:</span>
            <span><strong>${idx.pcrOi ? idx.pcrOi.toFixed(2) : '--'}</strong> / <strong style="color:#7c3aed;">${idx.wpcr ? idx.wpcr.toFixed(2) : '--'}</strong></span>
          </div>
          <div class="idx-mini-row">
            <span>Max Pain Strike:</span>
            <strong>${idx.maxPain || '--'}</strong>
          </div>
          <div class="idx-mini-row">
            <span>Support / Resistance:</span>
            <span><strong style="color:#16a34a;">${idx.support || '--'}</strong> / <strong style="color:#dc2626;">${idx.resistance || '--'}</strong></span>
          </div>

          <div class="idx-mini-footer">
            <button type="button" class="idx-jump-btn" data-jump-index="${idx.key}" data-jump-tab="chainView">Option Chain ➜</button>
            <button type="button" class="idx-jump-btn" data-jump-index="${idx.key}" data-jump-tab="statsView">Greeks &amp; Stats ➜</button>
          </div>
        </div>
      `;
    }).join("");
  }

  // 5. Wire up all Jump buttons
  document.querySelectorAll("[data-jump-index]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const targetIndex = btn.getAttribute("data-jump-index");
      const targetTab = btn.getAttribute("data-jump-tab") || "chainView";
      if (els.optIndexSelect) {
        els.optIndexSelect.value = targetIndex;
      }
      switchOptionsSubtab(targetTab);
      loadOptionChain();
    });
  });
}

let volScreenerFilterMode = "all";

function renderVolatilityDashboard(volData) {
  if (!volData) return;

  // 1. Headline 6 Volatility Cards
  if (els.volVixVal) els.volVixVal.textContent = volData.vix ? volData.vix.toFixed(2) : "--";
  if (els.volVixSub) els.volVixSub.textContent = `52W Percentile: ${volData.ivPercentile || 0}%`;

  if (els.volAtmIvVal) els.volAtmIvVal.textContent = volData.atmIv ? `${volData.atmIv.toFixed(1)}%` : "--%";

  if (els.volIvRankVal) els.volIvRankVal.textContent = volData.ivRank != null ? volData.ivRank.toFixed(1) : "--";
  if (els.volIvRankFill) els.volIvRankFill.style.width = `${Math.min(100, Math.max(0, volData.ivRank || 0))}%`;

  if (els.volIvPctVal) els.volIvPctVal.textContent = volData.ivPercentile != null ? `${volData.ivPercentile.toFixed(1)}%` : "--%";
  if (els.volIvPctFill) els.volIvPctFill.style.width = `${Math.min(100, Math.max(0, volData.ivPercentile || 0))}%`;

  if (els.volIvMinusHvVal) els.volIvMinusHvVal.textContent = `${volData.ivMinusHv > 0 ? '+' : ''}${volData.ivMinusHv || 0} pts`;
  if (els.volExpectedMoveVal) els.volExpectedMoveVal.textContent = `±${volData.expectedMove ? volData.expectedMove.pts : 0} pts`;
  if (els.volExpectedMoveSub) els.volExpectedMoveSub.textContent = `ATM Straddle: ₹${volData.straddlePrice || 0}`;

  // 2. Regime Gauge
  const reg = volData.regime || {};
  if (els.volRegimeBadge) els.volRegimeBadge.textContent = reg.badge || "NORMAL";
  if (els.volRegimeVixText) els.volRegimeVixText.textContent = `India VIX ${volData.vix || 0}`;
  if (els.volGaugeFill) els.volGaugeFill.style.width = `${reg.vixPosPct || 30}%`;
  if (els.volRegimeDesc) els.volRegimeDesc.textContent = reg.desc || "";

  // 3. Today's Vol Playbook
  const pb = volData.playbook || {};
  if (pb.buyer) {
    if (els.volBuyerBadge) els.volBuyerBadge.textContent = pb.buyer.badge || "--";
    if (els.volBuyerDesc) els.volBuyerDesc.textContent = pb.buyer.desc || "";
  }
  if (pb.seller) {
    if (els.volSellerBadge) els.volSellerBadge.textContent = pb.seller.badge || "--";
    if (els.volSellerDesc) els.volSellerDesc.textContent = pb.seller.desc || "";
  }
  if (pb.spread) {
    if (els.volSpreadBadge) els.volSpreadBadge.textContent = pb.spread.badge || "--";
    if (els.volSpreadDesc) els.volSpreadDesc.textContent = pb.spread.desc || "";
  }

  // 4. Expected Move Bands
  const em = volData.expectedMove || {};
  if (els.volExp1Sig) els.volExp1Sig.textContent = `${em.lower1Sig ? '₹' + em.lower1Sig.toLocaleString('en-IN') : '--'} - ${em.upper1Sig ? '₹' + em.upper1Sig.toLocaleString('en-IN') : '--'}`;
  if (els.volExp2Sig) els.volExp2Sig.textContent = `${em.lower2Sig ? '₹' + em.lower2Sig.toLocaleString('en-IN') : '--'} - ${em.upper2Sig ? '₹' + em.upper2Sig.toLocaleString('en-IN') : '--'}`;
  if (els.volStraddleBreakeven) els.volStraddleBreakeven.textContent = `${em.breakevenLower ? '₹' + em.breakevenLower.toLocaleString('en-IN') : '--'} - ${em.breakevenUpper ? '₹' + em.breakevenUpper.toLocaleString('en-IN') : '--'}`;
  if (els.volExpectedPct) els.volExpectedPct.textContent = `±${em.pct || 0}%`;

  // 5. Stock Screener Table
  renderVolStockTable(volData.stockScreener || []);
}

function renderVolStockTable(stocks) {
  if (!els.volStockTableBody) return;
  if (!stocks || stocks.length === 0) {
    els.volStockTableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:16px; color:#64748b;">No stock volatility data available</td></tr>`;
    return;
  }

  let list = stocks;
  if (volScreenerFilterMode === "high_iv") {
    list = stocks.filter(s => s.ivRank >= 60 || s.signal === "HIGH_IV_SELL");
  } else if (volScreenerFilterMode === "low_iv") {
    list = stocks.filter(s => s.ivRank < 40 || s.signal === "LOW_IV_BUY");
  }

  els.volStockTableBody.innerHTML = list.map(s => {
    const isSell = s.signal === "HIGH_IV_SELL" || s.ivRank >= 60;
    const isBuy = s.signal === "LOW_IV_BUY" || s.ivRank < 30;
    const badgeClass = isSell ? "danger-pill" : (isBuy ? "success-pill" : "info-pill");
    const badgeText = isSell ? "SELL PREMIUM" : (isBuy ? "BUY VOL" : "NEUTRAL");

    return `
      <tr style="cursor:pointer;" onclick="inspectStock('${s.symbol}')">
        <td><strong style="color:#2563eb;">${s.symbol}</strong></td>
        <td style="text-align:right; font-family:monospace;">₹${s.spot ? s.spot.toLocaleString('en-IN') : '--'}</td>
        <td style="text-align:right; font-weight:700;">${s.atmIv ? s.atmIv.toFixed(1) + '%' : '--'}</td>
        <td style="text-align:right;">
          <span class="pill ${badgeClass}" style="font-weight:700;">${s.ivRank ? s.ivRank.toFixed(1) : '--'}</span>
        </td>
        <td style="text-align:right; font-family:monospace;">${s.ivPct ? s.ivPct.toFixed(1) + '%' : '--'}</td>
        <td style="text-align:right; font-weight:700; color:${s.ivMinusHv > 0 ? '#059669' : '#dc2626'};">${s.ivMinusHv > 0 ? '+' : ''}${s.ivMinusHv || 0}</td>
        <td style="text-align:right; font-family:monospace; color:#64748b;">${s.skew25d || '--'}</td>
        <td style="text-align:right; font-family:monospace; color:#64748b;">${s.hv20 ? s.hv20.toFixed(1) + '%' : '--'}</td>
        <td style="text-align:center;"><span class="pill ${badgeClass}" style="font-size:10px;">${badgeText}</span></td>
      </tr>
    `;
  }).join('');
}

function renderOptionsStatistics(stats, spot) {
  if (!stats) return;

  // 1. PCR Card
  if (els.statPcrOi) els.statPcrOi.textContent = number(stats.pcrOi, 2);
  if (els.statNetBiasBadge) {
    const bias = stats.netOiBias || "Neutral";
    els.statNetBiasBadge.textContent = bias.toUpperCase();
    els.statNetBiasBadge.className = `stats-badge ${bias.toLowerCase()}`;
  }
  if (els.statPcrVol) els.statPcrVol.textContent = number(stats.pcrVol, 2);
  if (els.statPcrOiChg) els.statPcrOiChg.textContent = number(stats.pcrOiChg, 2);
  if (els.statSentimentSub) els.statSentimentSub.textContent = stats.sentimentSub || "--";

  // 2. Max Pain Card
  if (els.statMaxPain) els.statMaxPain.textContent = stats.maxPain || "--";
  if (els.statMaxPainDiff) {
    const diff = stats.maxPainDiff || 0;
    const diffPct = stats.maxPainDiffPct || 0;
    els.statMaxPainDiff.textContent = `${diff >= 0 ? "+" : ""}${diff} (${diffPct}%)`;
    els.statMaxPainDiff.className = `stats-badge ${diff > 0 ? "bullish" : (diff < 0 ? "bearish" : "")}`;
  }

  // 3. Volatility Card
  if (els.statAtmIv) els.statAtmIv.textContent = `${number(stats.atmIv, 1)}%`;
  if (els.statIvSkewBadge) {
    const skew = stats.ivSkew || 0;
    els.statIvSkewBadge.textContent = `Skew: ${skew >= 0 ? "+" : ""}${number(skew, 2)}%`;
    els.statIvSkewBadge.className = `stats-badge ${skew > 1.5 ? "bearish" : (skew < -1.0 ? "bullish" : "")}`;
  }
  if (els.statCallIv) els.statCallIv.textContent = `${number(stats.callIvAvg, 1)}%`;
  if (els.statPutIv) els.statPutIv.textContent = `${number(stats.putIvAvg, 1)}%`;
  if (els.statSkewRegime) els.statSkewRegime.textContent = stats.skewRegime || "--";

  // 4. Gamma Card
  if (els.statNetGex) els.statNetGex.textContent = `${number(stats.netGexCr, 1)} Cr`;
  if (els.statGammaRegime) {
    const gex = stats.netGexCr || 0;
    els.statGammaRegime.textContent = gex >= 0 ? "LONG GAMMA" : "SHORT GAMMA";
    els.statGammaRegime.className = `stats-badge ${gex >= 0 ? "bullish" : "bearish"}`;
  }
  if (els.statGammaFlip) els.statGammaFlip.textContent = stats.gammaFlipStrike || "--";

  // 5. Expected Move Card
  if (els.statExpectedMove) els.statExpectedMove.textContent = `± ${number(stats.expectedMove, 1)}`;
  if (els.statAtmStraddle) els.statAtmStraddle.textContent = `Straddle: ₹${number(stats.atmStraddle, 2)}`;
  if (els.statExpectedCone) els.statExpectedCone.textContent = `[${stats.coneLower} – ${stats.coneUpper}]`;
  if (els.statAtmStrangle) els.statAtmStrangle.textContent = `₹${number(stats.atmStrangle, 2)}`;

  // 6. Theta Burn Card
  if (els.statThetaBurn) els.statThetaBurn.textContent = `₹${number(stats.totalThetaBurnCr, 2)} Cr`;
  if (els.statIvRankBadge) els.statIvRankBadge.textContent = `IVR: ${stats.ivRank}%`;
  if (els.statIvPercentile) els.statIvPercentile.textContent = `${stats.ivPercentile}%`;

  // 7. OI Distribution Bar
  const totalCallOi = stats.totalCallOi || 0;
  const totalPutOi = stats.totalPutOi || 0;
  const totalOiSum = totalCallOi + totalPutOi;
  if (els.statTotalCallOi) els.statTotalCallOi.textContent = compactNumber(totalCallOi);
  if (els.statTotalPutOi) els.statTotalPutOi.textContent = compactNumber(totalPutOi);
  if (totalOiSum > 0) {
    const callPct = Math.round((totalCallOi / totalOiSum) * 100);
    const putPct = 100 - callPct;
    if (els.statCallOiBar) els.statCallOiBar.style.width = `${callPct}%`;
    if (els.statCallOiPct) els.statCallOiPct.textContent = `${callPct}%`;
    if (els.statPutOiBar) els.statPutOiBar.style.width = `${putPct}%`;
    if (els.statPutOiPct) els.statPutOiPct.textContent = `${putPct}%`;
  }

  // 8. Volume Distribution Bar
  const totalCallVol = stats.totalCallVol || 0;
  const totalPutVol = stats.totalPutVol || 0;
  const totalVolSum = totalCallVol + totalPutVol;
  if (els.statTotalCallVol) els.statTotalCallVol.textContent = compactNumber(totalCallVol);
  if (els.statTotalPutVol) els.statTotalPutVol.textContent = compactNumber(totalPutVol);
  if (totalVolSum > 0) {
    const callVolPct = Math.round((totalCallVol / totalVolSum) * 100);
    const putVolPct = 100 - callVolPct;
    if (els.statCallVolBar) els.statCallVolBar.style.width = `${callVolPct}%`;
    if (els.statCallVolPct) els.statCallVolPct.textContent = `${callVolPct}%`;
    if (els.statPutVolBar) els.statPutVolBar.style.width = `${putVolPct}%`;
    if (els.statPutVolPct) els.statPutVolPct.textContent = `${putVolPct}%`;
  }

  // 9. Buildup Flow Matrix Columns
  const buildup = stats.buildupSummary || {};
  const counts = buildup.counts || {};
  if (els.countLongBuildup) els.countLongBuildup.textContent = counts.longBuildup || 0;
  if (els.countShortBuildup) els.countShortBuildup.textContent = counts.shortBuildup || 0;
  if (els.countShortCovering) els.countShortCovering.textContent = counts.shortCovering || 0;
  if (els.countLongUnwinding) els.countLongUnwinding.textContent = counts.longUnwinding || 0;

  function renderBuildupList(container, items) {
    if (!container) return;
    if (!items || !items.length) {
      container.innerHTML = '<span style="font-size:10px; color:var(--text-muted); padding:4px;">No active strikes</span>';
      return;
    }
    container.innerHTML = items.slice(0, 6).map(it => `
      <div class="buildup-item-row">
        <span class="stk">${it.strike} ${it.side}</span>
        <span class="val" style="color:${it.oichg > 0 ? 'var(--green)' : 'var(--red)'};">${signedNumber(it.oichg, "%")}</span>
        <span class="val">₹${number(it.ltp, 1)}</span>
      </div>
    `).join("");
  }

  renderBuildupList(els.listLongBuildup, buildup.longBuildup);
  renderBuildupList(els.listShortBuildup, buildup.shortBuildup);
  renderBuildupList(els.listShortCovering, buildup.shortCovering);
  renderBuildupList(els.listLongUnwinding, buildup.longUnwinding);

  // 10. Resistance & Support Walls
  if (els.resistanceWallsList) {
    const rWalls = stats.resistanceWalls || [];
    els.resistanceWallsList.innerHTML = rWalls.map(w => `
      <div class="wall-strike-row">
        <span><strong>${w.strike} CE</strong> (₹${number(w.ltp, 1)})</span>
        <span style="color:#b91c1c; font-weight:800;">${compactNumber(w.oi)} OI</span>
      </div>
    `).join("") || '<span style="font-size:10px; color:var(--text-muted);">None</span>';
  }

  if (els.supportWallsList) {
    const sWalls = stats.supportWalls || [];
    els.supportWallsList.innerHTML = sWalls.map(w => `
      <div class="wall-strike-row">
        <span><strong>${w.strike} PE</strong> (₹${number(w.ltp, 1)})</span>
        <span style="color:#15803d; font-weight:800;">${compactNumber(w.oi)} OI</span>
      </div>
    `).join("") || '<span style="font-size:10px; color:var(--text-muted);">None</span>';
  }
}

/* ==========================================================================
   ⚖️ wPCR & PCE Quant Terminal Implementation
   ========================================================================== */
let wpcrDataGlobal = null;
let wpcrChartGeometry = null;
let wpcrHoverIndex = null;

function renderWpcrPceTerminal(data) {
  if (!data) return;
  wpcrDataGlobal = data;

  // 1. wPCR Hero Card
  if (els.wpcrHeroVal) els.wpcrHeroVal.textContent = number(data.wpcr, 3);
  if (els.wpcrHeroBadge) {
    const b = data.bias || "NEUTRAL";
    els.wpcrHeroBadge.textContent = b.replace("_", " ");
    els.wpcrHeroBadge.className = `stats-badge ${b.includes("BULLISH") ? "bullish" : (b.includes("BEARISH") ? "bearish" : "")}`;
  }
  const pce = data.pce || {};
  if (els.wpcrCallRatioBar && els.wpcrPutRatioBar) {
    const cPct = pce.callSharePct || 50;
    const pPct = pce.putSharePct || 50;
    els.wpcrCallRatioBar.style.width = `${cPct}%`;
    els.wpcrCallRatioBar.textContent = `CE ${cPct}%`;
    els.wpcrPutRatioBar.style.width = `${pPct}%`;
    els.wpcrPutRatioBar.textContent = `PE ${pPct}%`;
  }
  if (els.wpcrCapRatioSub) {
    els.wpcrCapRatioSub.textContent = `Put: ₹${number(pce.putCapitalCr, 1)} Cr | Call: ₹${number(pce.callCapitalCr, 1)} Cr`;
  }

  // 2. Flow Dynamics Card (dPCR & vPCR & Opstra WPCR)
  if (els.dpcrVal) els.dpcrVal.textContent = number(data.dpcr, 2);
  if (els.vwpcrVal) {
    const op = data.opstra || {};
    els.vwpcrVal.textContent = op.vwpcr ? `${number(op.vwpcr, 2)}` : number(data.vwpcr, 2);
    const dashWpcr = document.getElementById("dashKpiWpcr");
    if (dashWpcr) dashWpcr.textContent = els.vwpcrVal.textContent;
    const dashNiftyW = document.getElementById("dashNiftyWpcr");
    if (dashNiftyW) dashNiftyW.textContent = els.vwpcrVal.textContent;
  }
  if (els.wpcrStandardPcr) {
    els.wpcrStandardPcr.textContent = number(data.standardPcr, 2);
    const dashPcr = document.getElementById("dashNiftyPcr");
    if (dashPcr) dashPcr.textContent = number(data.standardPcr, 2);
  }

  // 3. PCE Card
  if (els.pceNetVal) {
    const net = pce.netExposureCr || 0;
    els.pceNetVal.textContent = `${net >= 0 ? "+" : ""}₹${number(net, 1)} Cr`;
    els.pceNetVal.className = `stats-hero-val ${net > 0 ? "change-pos" : (net < 0 ? "change-neg" : "")}`;
  }
  if (els.pceParityBadge) {
    els.pceParityBadge.textContent = pce.parityStatus || "PARITY FAIR";
    els.pceParityBadge.className = `stats-badge ${pce.forwardSpread > 2 ? "bullish" : (pce.forwardSpread < -2 ? "bearish" : "")}`;
  }
  if (els.pceTotalCap) els.pceTotalCap.textContent = `₹${number(pce.totalCapitalCr, 1)} Cr`;
  if (els.pceForwardSpread) {
    const sp = pce.forwardSpread || 0;
    els.pceForwardSpread.textContent = `${sp >= 0 ? "+" : ""}${sp} pts`;
  }

  // 4. Trap Detector Card
  const trap = data.trap || {};
  if (els.wpcrTrapBadge) {
    els.wpcrTrapBadge.textContent = trap.badge || "ANALYZING FLOW...";
    els.wpcrTrapBadge.className = `trap-banner-badge ${trap.type === "BULL_TRAP" || trap.type === "CONFLUENCE" ? "bullish-trap" : (trap.type === "NEUTRAL" ? "neutral-trap" : "")}`;
  }
  if (els.wpcrDivergenceVal) {
    const div = data.divergence || 0;
    els.wpcrDivergenceVal.textContent = `${div >= 0 ? "+" : ""}${div} (wPCR vs OI PCR)`;
    els.wpcrDivergenceVal.className = div > 0 ? "change-pos" : (div < 0 ? "change-neg" : "");
  }
  if (els.wpcrTrapDesc) {
    els.wpcrTrapDesc.textContent = trap.desc || "";
  }

  // 5. Strike Table Breakdown
  if (els.wpcrStrikeTableBody) {
    const strikes = data.strikeCapitalBreakdown || [];
    els.wpcrStrikeTableBody.innerHTML = strikes.map(s => {
      const isAtm = s.isAtm;
      const domClass = s.dominantSide === "PUTS" ? "put" : (s.dominantSide === "CALLS" ? "call" : "balanced");
      return `
        <tr class="${isAtm ? "atm-row" : ""}">
          <td><strong>${s.strike}</strong> ${isAtm ? '<span class="atm-tag">ATM</span>' : ""}</td>
          <td style="color:#ef4444;">₹${number(s.callLtp, 1)}</td>
          <td style="color:#ef4444; font-weight:700;">₹${number(s.callCapitalCr, 1)} Cr</td>
          <td style="color:#10b981;">₹${number(s.putLtp, 1)}</td>
          <td style="color:#10b981; font-weight:700;">₹${number(s.putCapitalCr, 1)} Cr</td>
          <td class="${s.netCapitalCr > 0 ? "change-pos" : (s.netCapitalCr < 0 ? "change-neg" : "")}">
            ${s.netCapitalCr >= 0 ? "+" : ""}₹${number(s.netCapitalCr, 1)} Cr
          </td>
          <td><span class="dom-pill ${domClass}">${s.dominantSide}</span></td>
        </tr>
      `;
    }).join("");
  }

  // 6. Fortress Lists
  if (els.wpcrTopCallsList) {
    const calls = data.topCallFortresses || [];
    els.wpcrTopCallsList.innerHTML = calls.map(c => `
      <div class="fortress-item-row">
        <span><strong>${c.strike} CE</strong> (₹${number(c.callLtp, 1)})</span>
        <span style="color:#dc2626; font-weight:800;">₹${number(c.callCapitalCr, 1)} Cr</span>
      </div>
    `).join("") || '<span style="font-size:10px; color:var(--text-muted);">None</span>';
  }

  if (els.wpcrTopPutsList) {
    const puts = data.topPutFortresses || [];
    els.wpcrTopPutsList.innerHTML = puts.map(p => `
      <div class="fortress-item-row">
        <span><strong>${p.strike} PE</strong> (₹${number(p.putLtp, 1)})</span>
        <span style="color:#16a34a; font-weight:800;">₹${number(p.putCapitalCr, 1)} Cr</span>
      </div>
    `).join("") || '<span style="font-size:10px; color:var(--text-muted);">None</span>';
  }

  // 7. Live Dynamic Macro Risk & Event Barometer
  const mRisk = data.macroRisk || {};
  if (els.macroUs10y) els.macroUs10y.textContent = mRisk.us10yYield || "--";
  if (els.macroDxy) els.macroDxy.textContent = mRisk.dxyIndex || "--";
  if (els.macroIndiaVix) els.macroIndiaVix.textContent = mRisk.indiaVix || "--";
  if (els.macroCboeVix) els.macroCboeVix.textContent = mRisk.cboeVix || "--";
  if (els.macroPceYoy) els.macroPceYoy.textContent = mRisk.usCorePceYoy || "2.6%";
  if (els.macroPceTrend) els.macroPceTrend.textContent = mRisk.usPceTrend || "--";
  if (els.macroFedOutlook) els.macroFedOutlook.textContent = mRisk.fedRateOutlook || "--";
  if (els.macroGlobalStatus) els.macroGlobalStatus.textContent = mRisk.globalRiskStatus || "NORMAL";
  if (els.macroExpectedIv) els.macroExpectedIv.textContent = mRisk.expectedIvSwing || "--";
  if (els.macroExpectedPts) els.macroExpectedPts.textContent = mRisk.expectedIndexPoints ? `± ${mRisk.expectedIndexPoints} pts` : "--";
  if (els.macroBreakevenRange) els.macroBreakevenRange.textContent = mRisk.breakevenRange || "--";
  if (els.macroFiiBias) {
    els.macroFiiBias.textContent = mRisk.fiiFlowBias || "--";
    const fb = mRisk.fiiFlowBias || "";
    els.macroFiiBias.className = fb.includes("Bullish") ? "change-pos" : (fb.includes("Bearish") ? "change-neg" : "");
  }
  if (els.macroHedgingProtocol) els.macroHedgingProtocol.textContent = mRisk.institutionalHedgingProtocol || "--";

  // 8. Draw Active Visualizer Canvas
  if (wpcrChartMode === "strike_bars") {
    drawWpcrCapitalChart();
  } else {
    drawWpcrTimeSeriesChart();
  }
}

let wpcrDays = 250;
let wpcrChartMode = "wpcr_spot";
let wpcrTsGeometry = null;
let wpcrTsHoverIndex = null;

function drawWpcrTimeSeriesChart() {
  if (!wpcrDataGlobal) return;
  const series = wpcrDataGlobal.timeSeries || [];
  if (!series.length) return;

  // Update Symbol in Header
  if (els.wpcrSymbolHeader) {
    const sym = (typeof currentOptionIndex !== "undefined" && currentOptionIndex)
      ? currentOptionIndex.toUpperCase()
      : ((typeof state !== "undefined" && state.selectedOptionIndex) ? state.selectedOptionIndex.toUpperCase() : "NIFTY");
    els.wpcrSymbolHeader.textContent = sym;
  }

  // Check if Opstra Dual Subplot Canvas elements exist
  if (els.wpcrPriceCanvas && els.wpcrPcrCanvas) {
    drawWpcrDualSubplotCharts(series);
    return;
  }

  const canvas = els.wpcrTsCanvas;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const scale = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const w = rect.width > 50 ? rect.width : (canvas.parentElement?.clientWidth || 800);
  const h = rect.height > 50 ? rect.height : 300;
  if (canvas.width !== Math.round(w * scale) || canvas.height !== Math.round(h * scale)) {
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
  }
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const width = canvas.width / scale;
  const height = canvas.height / scale;
  ctx.clearRect(0, 0, width, height);
}

function drawWpcrDualSubplotCharts(series) {
  const cPrice = els.wpcrPriceCanvas;
  const cPcr = els.wpcrPcrCanvas;
  if (!cPrice || !cPcr || !series.length) return;

  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const scale = window.devicePixelRatio || 1;

  // 1. Setup Price Canvas
  const rectP = cPrice.getBoundingClientRect();
  const w = rectP.width > 50 ? rectP.width : (cPrice.parentElement?.clientWidth || 900);
  const hP = 260;
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

  // Equal left & right padding for synchronized vertical crosshair
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
  wpcrTsGeometry = {
    pad, w, hP, hR, plotW, plotHP, plotHR, series, xFor, yForSpot, yForPcr
  };

  // Draw Synchronized Crosshair if Hovering
  if (wpcrTsHoverIndex !== null && series[wpcrTsHoverIndex]) {
    drawSynchronizedCrosshairs(wpcrTsHoverIndex);
  }
}

function drawSynchronizedCrosshairs(idx) {
  if (!wpcrTsGeometry || !els.wpcrPriceCanvas || !els.wpcrPcrCanvas) return;
  const { pad, series, xFor, yForSpot, yForPcr, plotHP, plotHR, w } = wpcrTsGeometry;
  const pt = series[idx];
  if (!pt) return;

  const hx = xFor(idx);
  const ctxP = els.wpcrPriceCanvas.getContext("2d");
  const ctxR = els.wpcrPcrCanvas.getContext("2d");

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

  // Vertical Hairline on Bottom Canvas (PCR & WPCR)
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
  if (els.wpcrPriceTooltip) {
    const ttP = els.wpcrPriceTooltip;
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
  if (els.wpcrPcrTooltip) {
    const ttR = els.wpcrPcrTooltip;
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

function updateWpcrTsHover(clientX) {
  if (!wpcrTsGeometry) return;
  const canvas = els.wpcrPriceCanvas || els.wpcrPcrCanvas || els.wpcrTsCanvas;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const { pad, plotW, series } = wpcrTsGeometry;

  if (x < pad.left || x > pad.left + plotW) {
    hideWpcrTsTooltip();
    return;
  }

  const relX = (x - pad.left) / plotW;
  const idx = Math.max(0, Math.min(series.length - 1, Math.round(relX * (series.length - 1))));
  wpcrTsHoverIndex = idx;
  drawWpcrTimeSeriesChart();
}

function hideWpcrTsTooltip() {
  wpcrTsHoverIndex = null;
  if (els.wpcrPriceTooltip) els.wpcrPriceTooltip.style.display = "none";
  if (els.wpcrPcrTooltip) els.wpcrPcrTooltip.style.display = "none";
  if (els.wpcrTsTooltip) els.wpcrTsTooltip.classList.remove("visible");
  if (wpcrDataGlobal && wpcrDataGlobal.timeSeries) {
    drawWpcrTimeSeriesChart();
  }
}

function drawWpcrCapitalChart() {
  const canvas = els.wpcrCapitalCanvas;
  if (!canvas || !wpcrDataGlobal) return;
  const ctx = canvas.getContext("2d");
  const scale = window.devicePixelRatio || 1;

  const rect = canvas.getBoundingClientRect();
  const w = rect.width > 50 ? rect.width : (canvas.parentElement?.clientWidth || 800);
  const h = rect.height > 50 ? rect.height : 280;
  if (canvas.width !== Math.round(w * scale) || canvas.height !== Math.round(h * scale)) {
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
  }
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const width = canvas.width / scale;
  const height = canvas.height / scale;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0c121e";
  ctx.fillRect(0, 0, width, height);

  const items = wpcrDataGlobal.strikeCapitalBreakdown || [];
  if (!items.length) {
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillText("No Strike Capital Breakdown Data", width / 2, height / 2);
    return;
  }

  const pad = { left: 55, right: 20, top: 20, bottom: 35 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  let maxCap = Math.max(...items.map(s => Math.max(s.callCapitalCr, s.putCapitalCr)), 10);
  maxCap *= 1.15;

  const barSlotW = plotW / items.length;
  const barW = Math.max(4, Math.min(18, (barSlotW - 6) / 2));

  wpcrChartGeometry = { pad, plotW, plotH, width, height, items, maxCap, barSlotW, barW };

  // Gridlines
  ctx.strokeStyle = "#1e293d";
  ctx.lineWidth = 0.8;
  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px 'JetBrains Mono', monospace";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  const numGrid = 4;
  for (let i = 0; i <= numGrid; i++) {
    const val = (i / numGrid) * maxCap;
    const y = pad.top + plotH - (i / numGrid) * plotH;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillText(`₹${number(val, 0)}Cr`, pad.left - 6, y);
  }
  ctx.setLineDash([]);

  // Draw Bars
  items.forEach((s, idx) => {
    const slotCenterX = pad.left + (idx + 0.5) * barSlotW;
    const callBarH = (s.callCapitalCr / maxCap) * plotH;
    const putBarH = (s.putCapitalCr / maxCap) * plotH;

    // Call bar (Red)
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(slotCenterX - barW - 1, pad.top + plotH - callBarH, barW, callBarH);

    // Put bar (Green)
    ctx.fillStyle = "#10b981";
    ctx.fillRect(slotCenterX + 1, pad.top + plotH - putBarH, barW, putBarH);

    // Strike label
    ctx.fillStyle = s.isAtm ? "#2563eb" : "#64748b";
    ctx.font = s.isAtm ? "bold 10px 'JetBrains Mono', monospace" : "9.5px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(String(s.strike), slotCenterX, height - pad.bottom + 6);

    if (s.isAtm) {
      ctx.fillStyle = "#2563eb";
      ctx.font = "bold 8.5px sans-serif";
      ctx.fillText("ATM", slotCenterX, height - pad.bottom + 19);
    }
  });

  if (wpcrHoverIndex !== null) drawWpcrHover(wpcrHoverIndex);
}

function updateWpcrHoverFromClientX(clientX) {
  if (!wpcrChartGeometry || !els.wpcrCapitalCanvas) return;
  const rect = els.wpcrCapitalCanvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const { pad, plotW, items } = wpcrChartGeometry;
  const clamped = Math.max(pad.left, Math.min(pad.left + plotW - 1, x));
  wpcrHoverIndex = Math.floor(((clamped - pad.left) / plotW) * items.length);
  drawWpcrCapitalChart();
}

function drawWpcrHover(index) {
  if (!wpcrChartGeometry || !els.wpcrCapitalCanvas) return;
  const { pad, plotH, items, barSlotW } = wpcrChartGeometry;
  if (index < 0 || index >= items.length) return;
  const s = items[index];
  const slotCenterX = pad.left + (index + 0.5) * barSlotW;
  const ctx = els.wpcrCapitalCanvas.getContext("2d");

  ctx.save();
  ctx.strokeStyle = "rgba(37, 99, 235, 0.4)";
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(slotCenterX, pad.top);
  ctx.lineTo(slotCenterX, pad.top + plotH);
  ctx.stroke();
  ctx.restore();

  if (els.wpcrCanvasTooltip) {
    els.wpcrCanvasTooltip.innerHTML = `
      <div style="font-weight:800; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:3px; margin-bottom:3px;">🎯 Strike: ${s.strike} ${s.isAtm ? "(ATM)" : ""}</div>
      <span style="color:#f87171;">Call Capital: <b>₹${number(s.callCapitalCr, 2)} Cr</b> (LTP ₹${number(s.callLtp, 1)})</span>
      <span style="color:#34d399;">Put Capital: <b>₹${number(s.putCapitalCr, 2)} Cr</b> (LTP ₹${number(s.putLtp, 1)})</span>
      <span style="color:#38bdf8;">Net Capital Bias: <b>${s.netCapitalCr >= 0 ? "+" : ""}₹${number(s.netCapitalCr, 2)} Cr</b> (${s.dominantSide})</span>
    `;
    const canvasRect = els.wpcrCapitalCanvas.getBoundingClientRect();
    const tipRect = els.wpcrCanvasTooltip.getBoundingClientRect();
    const left = Math.min(Math.max(slotCenterX + 14, 10), canvasRect.width - tipRect.width - 10);
    const top = Math.min(Math.max(pad.top + 10, 10), canvasRect.height - tipRect.height - 10);
    els.wpcrCanvasTooltip.style.left = `${left}px`;
    els.wpcrCanvasTooltip.style.top = `${top}px`;
    els.wpcrCanvasTooltip.classList.add("visible");
  }
}

function hideWpcrTooltip() {
  wpcrHoverIndex = null;
  if (els.wpcrCanvasTooltip) els.wpcrCanvasTooltip.classList.remove("visible");
}

/* ==========================================================================
   🏛️ Smart Money EOD Tracker Implementation
   ========================================================================== */
let smartMoneyDataGlobal = null;
let smHistoryGeometry = null;
let smHistoryHoverIdx = null;

async function loadSmartMoneyData(requestedDate = "") {
  if (els.smRefreshBtn) {
    els.smRefreshBtn.disabled = true;
    els.smRefreshBtn.textContent = "Fetching...";
  }
  try {
    const payload = {};
    if (requestedDate) {
      payload.date = requestedDate;
    }
    const res = await fetch("/api/smart-money", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.message || "Failed to load Smart Money data");
    smartMoneyDataGlobal = data;
    renderSmartMoneyDashboard(data);
  } catch (err) {
    console.error("Smart money load error:", err);
  } finally {
    if (els.smRefreshBtn) {
      els.smRefreshBtn.disabled = false;
      els.smRefreshBtn.textContent = "🔄 Fetch EOD Data";
    }
  }
}

function renderSmartMoneyDashboard(data) {
  if (!data) return;

  if (els.smDateInput && data.dateIso) {
    els.smDateInput.value = data.dateIso;
  }
  if (els.smStatusBadge) {
    els.smStatusBadge.textContent = `🟢 NSE Official Participant File Verified (${data.date})`;
  }

  // 1. FII Metrics
  const fii = data.fiiMetrics || {};
  if (els.smFiiLongPct) els.smFiiLongPct.textContent = `${fii.longPct}%`;
  if (els.smFiiShortPct) els.smFiiShortPct.textContent = `${fii.shortPct}%`;
  if (els.smFiiBarLong) els.smFiiBarLong.style.width = `${fii.longPct}%`;
  if (els.smFiiBarShort) els.smFiiBarShort.style.width = `${fii.shortPct}%`;
  if (els.smFiiNetFut) {
    const nf = fii.netFutures || 0;
    els.smFiiNetFut.textContent = `${nf > 0 ? "+" : ""}${nf.toLocaleString("en-IN")} contracts`;
    els.smFiiNetFut.style.color = nf > 0 ? "#10b981" : "#ef4444";
  }
  if (els.smFiiNetValCr) {
    const vc = fii.netFuturesValueCr || 0;
    els.smFiiNetValCr.textContent = `₹${vc > 0 ? "+" : ""}${vc.toLocaleString("en-IN")} Cr`;
    const dashFii = document.getElementById("dashKpiFii");
    if (dashFii) {
      dashFii.textContent = `₹${vc > 0 ? "+" : ""}${vc.toLocaleString("en-IN")} Cr`;
      dashFii.style.color = vc >= 0 ? "#10b981" : "#ef4444";
    }
  }
  if (els.smFiiZoneBadge) {
    els.smFiiZoneBadge.textContent = fii.zoneBadge || "BALANCED";
    els.smFiiZoneBadge.className = `stats-badge ${fii.zone === "OVERSOLD_SPRINGBOARD" ? "bullish" : (fii.zone === "OVERBOUGHT_EXHAUSTION" ? "bearish" : "")}`;
  }
  if (els.smFiiZoneDesc) els.smFiiZoneDesc.textContent = fii.zoneDesc || "";

  // 2. Trap Radar
  const trap = data.trapRadar || {};
  if (els.smTrapBadge) {
    els.smTrapBadge.textContent = trap.badge || "BALANCED";
    els.smTrapBadge.className = `stats-badge ${trap.level.includes("BULL") ? "bearish" : (trap.level.includes("BEAR") ? "bullish" : "")}`;
  }
  if (els.smTrapTitle) els.smTrapTitle.textContent = trap.title || "Institutional Stance";
  if (els.smTrapDesc) els.smTrapDesc.textContent = trap.desc || "";

  if (els.smClientCalls) {
    const cc = trap.clientNetCalls || 0;
    els.smClientCalls.textContent = `${cc > 0 ? "+" : ""}${cc.toLocaleString("en-IN")}`;
    els.smClientCalls.style.color = cc > 0 ? "#10b981" : "#ef4444";
  }
  if (els.smSmartCalls) {
    const sc = trap.smartMoneyNetCalls || 0;
    els.smSmartCalls.textContent = `${sc > 0 ? "+" : ""}${sc.toLocaleString("en-IN")}`;
    els.smSmartCalls.style.color = sc > 0 ? "#10b981" : "#ef4444";
  }
  if (els.smClientPuts) {
    const cp = trap.clientNetPuts || 0;
    els.smClientPuts.textContent = `${cp > 0 ? "+" : ""}${cp.toLocaleString("en-IN")}`;
    els.smClientPuts.style.color = cp > 0 ? "#10b981" : "#ef4444";
  }
  if (els.smSmartPuts) {
    const sp = trap.smartMoneyNetPuts || 0;
    els.smSmartPuts.textContent = `${sp > 0 ? "+" : ""}${sp.toLocaleString("en-IN")}`;
    els.smSmartPuts.style.color = sp > 0 ? "#10b981" : "#ef4444";
  }

  // 3. Gameplan
  const gp = data.gameplan || {};
  if (els.smGameplanBias) {
    els.smGameplanBias.textContent = (gp.bias || "BALANCED").replace("_", " ");
    els.smGameplanBias.className = `stats-badge ${gp.bias === "BULLISH_BIAS" ? "bullish" : (gp.bias === "BEARISH_BIAS" ? "bearish" : "")}`;
  }
  if (els.smGameplanSummary) els.smGameplanSummary.textContent = gp.summary || "";

  // 4. Participant Matrix Table
  renderParticipantTable(data.participants || []);

  // 5. Populate Intraday Trade Action Summary Cards
  const participants = data.participants || [];
  const getP = type => participants.find(p => p.type === type) || {};

  const fmtSign = n => (n > 0 ? `+${n.toLocaleString("en-IN")}` : (n < 0 ? n.toLocaleString("en-IN") : "0"));
  const applyVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = fmtSign(val);
      el.style.color = val > 0 ? "#10b981" : (val < 0 ? "#ef4444" : "#94a3b8");
    }
  };

  ["FII", "PRO", "CLIENT", "DII"].forEach(type => {
    const p = getP(type);
    const keyPrefix = "sm" + type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    
    applyVal(keyPrefix + "FutShift", p.futIdxDayChg || p.futIdxDayChange || 0);
    applyVal(keyPrefix + "CallShift", p.optCallDayChg || p.optCallDayChange || 0);
    applyVal(keyPrefix + "PutShift", p.optPutDayChg || p.optPutDayChange || 0);
    applyVal(keyPrefix + "StkShift", p.futStkDayChg || p.futStkDayChange || 0);

    const sumEl = document.getElementById(keyPrefix + "ActionSummary");
    if (sumEl) sumEl.textContent = p.intradayActionLabel || "Minor Position Adjustments";
  });


  // 5. Dynamic Real Session Buttons
  if (els.smQuickDates && data.availableSessions && data.availableSessions.length) {
    const currentIso = (data.dateIso || "").slice(0, 10);

    // Session Dropdown
    if (els.smSessionSelect) {
      els.smSessionSelect.innerHTML = data.availableSessions.map((s, idx) => {
        const iso = s.dateIso.slice(0, 10);
        const selected = iso === currentIso ? "selected" : "";
        const label = idx === 0 ? `${s.date} (Latest Session)` : s.date;
        return `<option value="${iso}" ${selected}>${label}</option>`;
      }).join("");
    }

    // Dynamic Quick Buttons
    els.smQuickDates.innerHTML = data.availableSessions.slice(0, 6).map((s, idx) => {
      const iso = s.dateIso.slice(0, 10);
      const isActive = iso === currentIso ? "active" : "";
      const label = idx === 0 ? `${s.shortLabel} (Latest)` : s.shortLabel;
      return `<button type="button" class="ctrl-btn sm-quick-btn ${isActive}" data-date="${iso}">${label}</button>`;
    }).join("");

    els.smQuickDates.querySelectorAll(".sm-quick-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const d = btn.dataset.date;
        if (els.smDateInput) els.smDateInput.value = d;
        if (els.smSessionSelect) els.smSessionSelect.value = d;
        loadSmartMoneyData(d);
      });
    });
  }

  // 6. Major Indices Delivery Absorption Benchmark Table (EOD)
  if (els.smIndicesDeliveryTableBody) {
    const indices = data.majorIndicesDelivery || [];
    if (!indices.length) {
      els.smIndicesDeliveryTableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:18px; color:var(--text-muted);">No Major Indices Cash Delivery data available for this session.</td></tr>`;
    } else {
      els.smIndicesDeliveryTableBody.innerHTML = indices.map(idx => {
        const fillClass = idx.avgDeliveryPct >= 60 ? "high" : (idx.avgDeliveryPct >= 40 ? "med" : "low");
        const sigClass = idx.stance === "STRONG_ACCUMULATION" ? "acc" : (idx.stance === "HEAVY_DISTRIBUTION" ? "dist" : "neutral");
        return `
          <tr>
            <td><strong style="color:#0f172a; font-weight:800;">${idx.label}</strong></td>
            <td><span class="badge-tag">${idx.stockCount} Stocks</span></td>
            <td>
              <div class="deliv-progress-wrap" style="min-width:130px;">
                <span style="font-weight:800; width:45px;">${idx.avgDeliveryPct}%</span>
                <div class="deliv-progress-bar">
                  <div class="deliv-progress-fill ${fillClass}" style="width:${Math.min(100, idx.avgDeliveryPct)}%;"></div>
                </div>
              </div>
            </td>
            <td style="color:#64748b; font-weight:600;">${idx.avg5dPct}%</td>
            <td><span class="deliv-shock-badge ${idx.shockRatio >= 1.2 ? 'surge' : 'normal'}">${idx.shockRatio}x</span></td>
            <td style="color:#16a34a; font-weight:800;">₹${Number(idx.delivTurnoverCr).toLocaleString("en-IN")} Cr</td>
            <td style="color:#64748b;">₹${Number(idx.tradedTurnoverCr).toLocaleString("en-IN")} Cr</td>
            <td><span style="color:#16a34a; font-weight:700;">${idx.accumulationCount} 🟢</span> / <span style="color:#dc2626; font-weight:700;">${idx.distributionCount} 🔴</span></td>
            <td><span class="deliv-sig-pill ${sigClass}">${idx.stanceBadge}</span></td>
          </tr>
        `;
      }).join("");
    }
  }
}

function renderParticipantTable(participants) {
  const tbody = els.smParticipantTableBody;
  if (!tbody) return;
  if (!participants.length) {
    tbody.innerHTML = `<tr><td colspan="17" style="text-align:center; color:var(--text-muted);">No Participant Data Available</td></tr>`;
    return;
  }

  tbody.innerHTML = participants.map(p => {
    const isTotal = p.type === "TOTAL";
    const tagClass = p.type.toLowerCase();
    const tagLabel = p.type === "CLIENT" ? "CLIENT (Retail)" : (p.type === "PRO" ? "PRO (Prop Desks)" : p.type);

    const netFut = p.futIdxNet || 0;
    const netCalls = p.optCallNet || 0;
    const netPuts = p.optPutNet || 0;
    const netStk = p.futStkNet || 0;
    const stance = p.stance || "NEUTRAL";

    const futChg = p.futIdxDayChg || p.futIdxDayChange || 0;
    const callChg = p.optCallDayChg || p.optCallDayChange || 0;
    const putChg = p.optPutDayChg || p.optPutDayChange || 0;
    const stkChg = p.futStkDayChg || p.futStkDayChange || 0;

    const actionText = p.intradayActionLabel || "Minor Adjustments";

    const fmt = n => (n !== undefined && n !== null ? Number(n).toLocaleString("en-IN") : "--");
    const fmtSign = n => `${n > 0 ? "+" : ""}${fmt(n)}`;
    const signColor = n => n > 0 ? "#10b981" : (n < 0 ? "#ef4444" : "#94a3b8");

    return `
      <tr style="${isTotal ? "font-weight:800; background:#1e293d;" : ""}">
        <td><span class="participant-tag ${tagClass}">${tagLabel}</span></td>
        <!-- Index Futures -->
        <td>${fmt(p.futIdxLong)}</td>
        <td>${fmt(p.futIdxShort)}</td>
        <td style="font-weight:700; color:${signColor(netFut)};">${fmtSign(netFut)}</td>
        <td style="font-weight:800; font-family:'JetBrains Mono', monospace; color:${signColor(futChg)};">${fmtSign(futChg)}</td>
        <!-- Index Calls -->
        <td style="color:#10b981;">${fmt(p.optCallLong)}</td>
        <td style="color:#ef4444;">${fmt(p.optCallShort)}</td>
        <td style="font-weight:700; color:${signColor(netCalls)};">${fmtSign(netCalls)}</td>
        <td style="font-weight:800; font-family:'JetBrains Mono', monospace; color:${signColor(callChg)};">${fmtSign(callChg)}</td>
        <!-- Index Puts -->
        <td style="color:#10b981;">${fmt(p.optPutLong)}</td>
        <td style="color:#ef4444;">${fmt(p.optPutShort)}</td>
        <td style="font-weight:700; color:${signColor(netPuts)};">${fmtSign(netPuts)}</td>
        <td style="font-weight:800; font-family:'JetBrains Mono', monospace; color:${signColor(putChg)};">${fmtSign(putChg)}</td>
        <!-- Stock Futures -->
        <td>${fmt(p.futStkLong)}</td>
        <td>${fmt(p.futStkShort)}</td>
        <td style="font-weight:800; font-family:'JetBrains Mono', monospace; color:${signColor(stkChg)};">${fmtSign(stkChg)}</td>
        <!-- Intraday Action -->
        <td style="font-size:11px; font-weight:600; color:#cbd5e1; max-width:220px; line-height:1.3;">${actionText}</td>
        <!-- Desk Stance -->
        <td>
          <span class="stance-pill ${stance.toLowerCase().replace("heavy_", "").replace("mild_", "")}">
            ${stance.replace("_", " ")}
          </span>
        </td>
      </tr>
    `;
  }).join("");
}

function drawSmartMoneyHistoryChart(history) {
  const canvas = els.smHistoryCanvas;
  if (!canvas || !history || !history.length) return;
  const ctx = canvas.getContext("2d");
  const scale = window.devicePixelRatio || 1;

  const rect = canvas.getBoundingClientRect();
  const parentWidth = canvas.parentElement ? canvas.parentElement.getBoundingClientRect().width : 0;
  const w = Math.max(rect.width, parentWidth, 750);
  const h = 280;

  if (canvas.width !== Math.round(w * scale) || canvas.height !== Math.round(h * scale)) {
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
  }
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const width = canvas.width / scale;
  const height = canvas.height / scale;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0c121e";
  ctx.fillRect(0, 0, width, height);

  const pad = { top: 26, right: 45, bottom: 32, left: 55 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  if (plotW <= 10 || plotH <= 10) return;

  const yForPct = pct => pad.top + plotH - ((pct - 0) / 100) * plotH;
  const xFor = idx => pad.left + (idx / Math.max(1, history.length - 1)) * plotW;

  smHistoryGeometry = { pad, plotW, plotH, history, xFor, yForPct };

  // Green zone: 0 to 20% (Oversold Springboard)
  const y20 = yForPct(20);
  const y0 = yForPct(0);
  ctx.fillStyle = "rgba(22, 163, 74, 0.08)";
  ctx.fillRect(pad.left, y20, plotW, y0 - y20);

  // Red zone: 75% to 100% (Overbought Ceiling)
  const y75 = yForPct(75);
  const y100 = yForPct(100);
  ctx.fillStyle = "rgba(220, 38, 38, 0.08)";
  ctx.fillRect(pad.left, y100, plotW, y75 - y100);

  // Grid lines
  ctx.strokeStyle = "#1e293d";
  ctx.lineWidth = 0.8;
  ctx.setLineDash([3, 3]);
  [0, 20, 40, 50, 60, 75, 100].forEach(p => {
    const y = yForPct(p);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();

    ctx.fillStyle = p === 20 ? "#10b981" : (p === 75 ? "#ef4444" : "#94a3b8");
    ctx.font = (p === 20 || p === 75) ? "bold 9px 'JetBrains Mono', monospace" : "9px 'JetBrains Mono', monospace";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(`${p}%`, pad.left - 6, y);
  });
  ctx.setLineDash([]);

  // Horizontal threshold reference lines
  ctx.save();
  ctx.strokeStyle = "rgba(22, 163, 74, 0.75)";
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 2]);
  ctx.beginPath();
  ctx.moveTo(pad.left, y20);
  ctx.lineTo(width - pad.right, y20);
  ctx.stroke();

  ctx.strokeStyle = "rgba(220, 38, 38, 0.75)";
  ctx.beginPath();
  ctx.moveTo(pad.left, y75);
  ctx.lineTo(width - pad.right, y75);
  ctx.stroke();
  ctx.restore();

  // Gradient fill under the FII curve
  const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + plotH);
  grad.addColorStop(0, "rgba(37, 99, 235, 0.20)");
  grad.addColorStop(1, "rgba(37, 99, 235, 0.01)");
  ctx.beginPath();
  history.forEach((pt, idx) => {
    const x = xFor(idx);
    const y = yForPct(pt.fiiLongPct);
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(xFor(history.length - 1), pad.top + plotH);
  ctx.lineTo(xFor(0), pad.top + plotH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // FII Long % line
  ctx.beginPath();
  ctx.strokeStyle = "#2563eb";
  ctx.lineWidth = 2.4;
  history.forEach((pt, idx) => {
    const x = xFor(idx);
    const y = yForPct(pt.fiiLongPct);
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Markers
  history.forEach((pt, idx) => {
    const x = xFor(idx);
    const y = yForPct(pt.fiiLongPct);
    const isLatest = idx === history.length - 1;
    ctx.fillStyle = isLatest ? "#2563eb" : "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, isLatest ? 5 : 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2;
    ctx.stroke();

    if (isLatest) {
      ctx.fillStyle = "#1e40af";
      ctx.font = "bold 10.5px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${pt.fiiLongPct}%`, x, y - 9);
    }
  });

  // Date labels
  ctx.fillStyle = "#94a3b8";
  ctx.font = "9px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  history.forEach((pt, idx) => {
    if (idx % 2 === 0 || idx === history.length - 1) {
      ctx.fillText(pt.date, xFor(idx), pad.top + plotH + 6);
    }
  });
}

function updateSmHistoryHover(clientX) {
  const canvas = els.smHistoryCanvas;
  if (!canvas || !smHistoryGeometry) return;
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const { pad, plotW, history, xFor, yForPct } = smHistoryGeometry;

  if (x < pad.left || x > pad.left + plotW) {
    hideSmHistoryTooltip();
    return;
  }

  const relX = (x - pad.left) / plotW;
  const idx = Math.max(0, Math.min(history.length - 1, Math.round(relX * (history.length - 1))));
  smHistoryHoverIdx = idx;
  drawSmartMoneyHistoryChart(history);

  const ctx = canvas.getContext("2d");
  const pt = history[idx];
  const hx = xFor(idx);
  const hy = yForPct(pt.fiiLongPct);

  ctx.save();
  ctx.strokeStyle = "rgba(100, 116, 139, 0.6)";
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(hx, pad.top);
  ctx.lineTo(hx, pad.top + smHistoryGeometry.plotH);
  ctx.stroke();

  ctx.fillStyle = "#2563eb";
  ctx.beginPath();
  ctx.arc(hx, hy, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (els.smHistoryTooltip) {
    const tt = els.smHistoryTooltip;
    tt.classList.add("visible");
    tt.style.left = `${Math.min(rect.width - 190, Math.max(10, hx - 80))}px`;
    tt.style.top = `${10}px`;

    tt.innerHTML = `
      <div style="font-weight:800; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:3px; margin-bottom:3px;">
        📅 Session: ${pt.date}
      </div>
      <div>FII Long: <strong style="color:#10b981;">${pt.fiiLongPct}%</strong></div>
      <div>FII Short: <strong style="color:#ef4444;">${pt.fiiShortPct}%</strong></div>
      <div>Net Futures: <strong style="color:#60a5fa;">${pt.fiiNetFutures > 0 ? "+" : ""}${pt.fiiNetFutures.toLocaleString("en-IN")}</strong></div>
    `;
  }
}

function hideSmHistoryTooltip() {
  if (els.smHistoryTooltip) els.smHistoryTooltip.classList.remove("visible");
}

/* ==========================================================================
   📦 Delivery Desk (StockEdge + Moneycontrol Advanced Edition)
   ========================================================================== */
let delivDataGlobal = null;
let delivActiveFilter = "all";
let delivSearchQuery = "";

async function loadDeliveryAnalytics(dateStr) {
  try {
    if (els.delivStatusBadge) {
      els.delivStatusBadge.textContent = "⏳ Fetching NSE Delivery Data...";
      els.delivStatusBadge.style.background = "#eff6ff";
      els.delivStatusBadge.style.color = "#1d4ed8";
    }

    const payload = {
      universe: (els.delivUniverseSelect && els.delivUniverseSelect.value) || "nifty50",
      filter: delivActiveFilter || "all",
      date: dateStr || ""
    };

    const res = await fetch("/api/delivery-analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.ok) throw new Error(data.message || "Failed to load delivery data");

    delivDataGlobal = data;
    if (els.delivDateInput && data.dateIso) {
      els.delivDateInput.value = data.dateIso.slice(0, 10);
    }
    if (els.delivStatusBadge) {
      if (data.isNearestSession) {
        els.delivStatusBadge.textContent = `🟢 Showing Nearest Session: ${data.date} (NSE Cash Deliveries Verified)`;
      } else {
        els.delivStatusBadge.textContent = `🟢 Session: ${data.date} (NSE Cash Deliveries Verified)`;
      }
      els.delivStatusBadge.style.background = "#dcfce7";
      els.delivStatusBadge.style.color = "#15803d";
    }

    renderDeliveryDashboard(data);
  } catch (err) {
    console.error("Delivery Desk Error:", err);
    if (els.delivStatusBadge) {
      els.delivStatusBadge.textContent = `⚠️ Delivery Load Failed: ${err.message}`;
      els.delivStatusBadge.style.background = "#fee2e2";
      els.delivStatusBadge.style.color = "#b91c1c";
    }
  }
}

function renderDeliveryDashboard(data) {
  const sum = data.summary || {};
  if (els.kpiDelivAvgPct) {
    els.kpiDelivAvgPct.textContent = `${sum.avgDeliveryPct || 0}%`;
    const dashDeliv = document.getElementById("dashKpiDeliv");
    if (dashDeliv) dashDeliv.textContent = `${sum.avgDeliveryPct || 0}%`;
  }
  if (els.kpiDelivValCr) els.kpiDelivValCr.textContent = `₹${(sum.totalDelivTurnoverCr || 0).toLocaleString("en-IN")} Cr`;
  if (els.kpiAccCount) els.kpiAccCount.textContent = sum.accumulationCount || 0;
  if (els.kpiDistCount) els.kpiDistCount.textContent = sum.distributionCount || 0;
  if (els.kpiShockCount) els.kpiShockCount.textContent = `${sum.shockCount || 0} stocks`;

  const totalAction = (sum.accumulationCount || 0) + (sum.distributionCount || 0);
  if (totalAction > 0) {
    const accPct = Math.round(((sum.accumulationCount || 0) / totalAction) * 100);
    if (els.kpiAccBar) els.kpiAccBar.style.width = `${accPct}%`;
    if (els.kpiDistBar) els.kpiDistBar.style.width = `${100 - accPct}%`;
  }

  // Session Dropdown
  if (els.delivSessionSelect && data.availableSessions && data.availableSessions.length) {
    const currentIso = (data.dateIso || "").slice(0, 10);
    els.delivSessionSelect.innerHTML = data.availableSessions.map((s, idx) => {
      const iso = s.dateIso.slice(0, 10);
      const selected = iso === currentIso ? "selected" : "";
      const label = idx === 0 ? `${s.date} (Latest Session)` : s.date;
      return `<option value="${iso}" ${selected}>${label}</option>`;
    }).join("");
  }

  // Major Indices Delivery Absorption Benchmark Grid Strip
  if (els.delivIndicesGrid && data.majorIndicesDelivery && data.majorIndicesDelivery.length) {
    const currentUniv = (els.delivUniverseSelect && els.delivUniverseSelect.value) || "nifty50";
    els.delivIndicesGrid.innerHTML = data.majorIndicesDelivery.map(idx => {
      const isSelected = currentUniv === idx.key;
      const borderStyle = isSelected ? "border:2px solid #2563eb; background:#eff6ff;" : "border:1px solid #e2e8f0; background:#f8fafc;";
      const sigColor = idx.stance === "STRONG_ACCUMULATION" ? "#10b981" : (idx.stance === "HEAVY_DISTRIBUTION" ? "#ef4444" : "#64748b");
      return `
        <div class="deliv-idx-mini-card" onclick="selectDeliveryUniverse('${idx.key}')" style="${borderStyle} border-radius:6px; padding:8px 10px; cursor:pointer; transition:all 0.15s ease;" title="Click to filter matrix by ${idx.label}">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="font-size:12px; color:#0f172a;">${idx.label}</strong>
            <span style="font-size:10px; color:${sigColor}; font-weight:700;">${idx.stance === 'STRONG_ACCUMULATION' ? '🟢 Acc' : (idx.stance === 'HEAVY_DISTRIBUTION' ? '🔴 Dist' : '⚪ Bal')}</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:baseline; margin-top:4px;">
            <span style="font-size:14px; font-weight:900; color:#2563eb;">${idx.avgDeliveryPct}%</span>
            <span style="font-size:10.5px; color:#16a34a; font-weight:700;">₹${Math.round(idx.delivTurnoverCr).toLocaleString("en-IN")} Cr</span>
          </div>
          <div style="font-size:9.5px; color:#64748b; margin-top:2px;">5D Avg: ${idx.avg5dPct}% • ${idx.shockRatio}x</div>
        </div>
      `;
    }).join("");
  }

  // Dynamic quick date pills from real available sessions
  if (els.delivQuickDates && data.availableSessions && data.availableSessions.length) {
    const currentIso = (data.dateIso || "").slice(0, 10);
    els.delivQuickDates.innerHTML = data.availableSessions.slice(0, 6).map((s, idx) => {
      const iso = s.dateIso.slice(0, 10);
      const isActive = iso === currentIso ? "active" : "";
      const label = idx === 0 ? `${s.shortLabel} (Latest)` : s.shortLabel;
      return `<button type="button" class="ctrl-btn sm-quick-btn ${isActive}" data-date="${iso}">${label}</button>`;
    }).join("");

    els.delivQuickDates.querySelectorAll(".sm-quick-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const d = btn.dataset.date;
        if (els.delivDateInput) els.delivDateInput.value = d;
        if (els.delivSessionSelect) els.delivSessionSelect.value = d;
        loadDeliveryAnalytics(d);
      });
    });
  }

  // Top delivery turnover anchors
  if (els.kpiTopDelivList) {
    const topStocks = (data.stocks || []).slice(0, 3);
    els.kpiTopDelivList.innerHTML = topStocks.map(s => `
      <div class="deliv-mini-row">
        <div>
          <strong style="color:#0f172a;">${s.symbol}</strong>
          <span style="color:var(--text-muted); font-size:11px; margin-left:4px;">₹${s.close}</span>
        </div>
        <div style="text-align:right;">
          <span style="color:#2563eb; font-weight:700;">${s.delivPer}% Deliv</span>
          <span style="color:#16a34a; font-weight:700; margin-left:6px;">₹${s.delivTurnoverCr.toLocaleString("en-IN")} Cr</span>
        </div>
      </div>
    `).join("");
  }

  applyDeliveryFilterAndRender();
}

function selectDeliveryUniverse(key) {
  if (els.delivUniverseSelect) {
    els.delivUniverseSelect.value = key;
    loadDeliveryAnalytics();
  }
}

function applyDeliveryFilterAndRender() {
  if (!delivDataGlobal) return;
  let list = delivDataGlobal.stocks || [];

  if (delivSearchQuery) {
    const q = delivSearchQuery.toLowerCase().trim();
    list = list.filter(s => s.symbol.toLowerCase().includes(q));
  }

  if (els.delivStockCountBadge) {
    const totalInUniverse = (delivDataGlobal.summary && delivDataGlobal.summary.universeCount) || (delivDataGlobal.universe === "nifty50" ? 50 : list.length);
    let filterText = "";
    if (delivActiveFilter === "shocks") filterText = " • Filter: Delivery Volume Shocks (>1.3x)";
    else if (delivActiveFilter === "accumulation") filterText = " • Filter: Strong Accumulation";
    else if (delivActiveFilter === "distribution") filterText = " • Filter: Heavy Distribution";
    else if (delivActiveFilter === "high_deliv") filterText = " • Filter: Ultra-High Delivery (>60%)";

    if (delivActiveFilter !== "all" && list.length < totalInUniverse) {
      els.delivStockCountBadge.textContent = `Showing ${list.length} of ${totalInUniverse} Stocks${filterText}`;
    } else {
      els.delivStockCountBadge.textContent = `${list.length} Stocks${filterText}`;
    }
  }

  renderSecurityDeliveryTable(list);
}

function renderSecurityDeliveryTable(stocks) {
  const tbody = els.delivTableBody;
  if (!tbody) return;

  if (!stocks.length) {
    tbody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding:24px; color:var(--text-muted);">No stocks found matching the criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = stocks.map(s => {
    const chgColor = s.changePct > 0 ? "#10b981" : (s.changePct < 0 ? "#ef4444" : "var(--text-muted)");
    const chgPrefix = s.changePct > 0 ? "+" : "";

    // Delivery % Progress Bar
    const delivFillClass = s.delivPer >= 60 ? "high" : (s.delivPer >= 40 ? "med" : "low");

    // Shock Badge
    let shockHtml = `<span style="color:var(--text-muted); font-family:monospace;">${s.shockRatio}x</span>`;
    if (s.shockRatio >= 2.0) {
      shockHtml = `<span class="shock-badge extreme">⚡ ${s.shockRatio}x</span>`;
    } else if (s.shockRatio >= 1.3) {
      shockHtml = `<span class="shock-badge surge">⚡ ${s.shockRatio}x</span>`;
    }

    // Institutional Signal Badge
    let sigHtml = `<span class="deliv-sig-pill unwind">Neutral</span>`;
    if (s.signal === "STRONG_ACCUMULATION") {
      sigHtml = `<span class="deliv-sig-pill acc">🟢 Accumulation</span>`;
    } else if (s.signal === "HEAVY_DISTRIBUTION") {
      sigHtml = `<span class="deliv-sig-pill dist">🔴 Distribution</span>`;
    } else if (s.signal === "SHORT_COVERING") {
      sigHtml = `<span class="deliv-sig-pill short-cover">🟡 Short Covering</span>`;
    } else if (s.signal === "LONG_UNWINDING") {
      sigHtml = `<span class="deliv-sig-pill unwind">⚪ Unwinding</span>`;
    } else if (s.signal === "HIGH_DELIVERY") {
      sigHtml = `<span class="deliv-sig-pill high-deliv">💎 High Deliv</span>`;
    }

    return `
      <tr onclick="inspectStock('${s.symbol}')" style="cursor:pointer;" title="Click to inspect ${s.symbol} delivery details">
        <td><strong style="color:#0f172a; font-weight:800;">${s.symbol}</strong></td>
        <td><strong>₹${s.close.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></td>
        <td style="color:${chgColor}; font-weight:700;">${chgPrefix}${s.changePct}%</td>
        <td>${s.tradedQty.toLocaleString("en-IN")}</td>
        <td><strong>${s.delivQty.toLocaleString("en-IN")}</strong></td>
        <td>
          <div class="deliv-progress-wrap">
            <span style="font-weight:800; width:45px;">${s.delivPer}%</span>
            <div class="deliv-progress-bar">
              <div class="deliv-progress-fill ${delivFillClass}" style="width: ${Math.min(100, s.delivPer)}%;"></div>
            </div>
          </div>
        </td>
        <td style="color:var(--text-muted);">${s.avgDelivPer5D}%</td>
        <td>${shockHtml}</td>
        <td>₹${s.turnoverCr.toLocaleString("en-IN")} Cr</td>
        <td style="color:#16a34a; font-weight:800;">₹${s.delivTurnoverCr.toLocaleString("en-IN")} Cr</td>
        <td>${sigHtml}</td>
        <td>
          <button type="button" class="drilldown-btn" onclick="event.stopPropagation(); openDeliveryDrilldown('${s.symbol}')">📅 History</button>
        </td>
      </tr>
    `;
  }).join("");
}

async function inspectStock(symbol) {
  if (!symbol) return;
  const sym = symbol.trim().toUpperCase();
  try {
    if (els.delivStatusBadge) {
      els.delivStatusBadge.textContent = `🔍 Fetching ${sym} NSE Security Delivery Data...`;
      els.delivStatusBadge.style.background = "#eff6ff";
      els.delivStatusBadge.style.color = "#1d4ed8";
    }

    const res = await fetch("/api/delivery-analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol: sym })
    });
    const data = await res.json();
    if (!data.ok || !data.current) {
      alert(`No delivery bhavcopy data found for symbol "${sym}". Please ensure it is a valid NSE listed stock symbol.`);
      return;
    }

    const cur = data.current;
    if (els.stockInspectorCard) {
      els.stockInspectorCard.style.display = "block";
      els.stockInspectorCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    if (els.inspectSymbol) els.inspectSymbol.textContent = data.symbol;
    if (els.inspectSubtitle) els.inspectSubtitle.textContent = `Official NSE Security-Wise Delivery Position as of ${cur.date || "Latest Session"}`;
    if (els.inspectClose) els.inspectClose.textContent = `₹${Number(cur.close || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
    if (els.inspectChange) {
      const chg = cur.changePct || 0;
      const pts = cur.change || 0;
      els.inspectChange.textContent = `${chg > 0 ? "+" : ""}${chg}% (${pts > 0 ? "+" : ""}₹${pts})`;
      els.inspectChange.style.color = chg > 0 ? "#10b981" : (chg < 0 ? "#ef4444" : "#64748b");
    }
    if (els.inspectTradedQty) els.inspectTradedQty.textContent = Number(cur.tradedQty || 0).toLocaleString("en-IN");
    if (els.inspectTrades) els.inspectTrades.textContent = `${Number(cur.trades || 0).toLocaleString("en-IN")} Trades`;
    if (els.inspectDelivQty) els.inspectDelivQty.textContent = Number(cur.delivQty || 0).toLocaleString("en-IN");
    if (els.inspectDelivPer) els.inspectDelivPer.textContent = `${cur.delivPer}%`;
    if (els.inspectAvg5dPer) els.inspectAvg5dPer.textContent = `5D Avg: ${data.avg5dPer}%`;
    if (els.inspectDelivVal) els.inspectDelivVal.textContent = `₹${Number(cur.delivTurnoverCr || 0).toLocaleString("en-IN")} Cr`;
    if (els.inspectShock) els.inspectShock.textContent = `Volume Shock: ${data.shockRatio}x`;

    if (els.inspectSignalBadge) {
      let sig = "NORMAL";
      if (cur.changePct > 0.3 && cur.delivPer >= 50 && data.shockRatio >= 1.2) sig = "STRONG_ACCUMULATION";
      else if (cur.changePct < -0.3 && cur.delivPer >= 50 && data.shockRatio >= 1.2) sig = "HEAVY_DISTRIBUTION";
      else if (cur.delivPer >= 60) sig = "HIGH_DELIVERY";

      els.inspectSignalBadge.textContent = sig.replace("_", " ");
      els.inspectSignalBadge.className = `deliv-sig-pill ${sig === "STRONG_ACCUMULATION" ? "acc" : (sig === "HEAVY_DISTRIBUTION" ? "dist" : "high-deliv")}`;
    }

    if (els.inspectViewHistoryBtn) {
      els.inspectViewHistoryBtn.onclick = () => openDeliveryDrilldown(data.symbol);
    }

    if (els.delivStatusBadge) {
      els.delivStatusBadge.textContent = `🟢 Inspected ${sym}: ${cur.delivPer}% Deliveries Verified`;
      els.delivStatusBadge.style.background = "#dcfce7";
      els.delivStatusBadge.style.color = "#15803d";
    }
  } catch (err) {
    console.error("inspectStock error:", err);
  }
}

async function openDeliveryDrilldown(symbol) {
  if (!els.delivDrilldownModal) return;
  els.delivDrilldownModal.style.display = "flex";
  if (els.drilldownTitle) els.drilldownTitle.textContent = `${symbol} - Date-Wise Deliveries`;
  if (els.drilldownSubtitle) els.drilldownSubtitle.textContent = `Fetching historical sessions for ${symbol}...`;
  if (els.drilldownTableBody) {
    els.drilldownTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:24px;">⏳ Loading official NSE date-wise sessions...</td></tr>`;
  }

  try {
    const res = await fetch("/api/delivery-analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol })
    });
    const data = await res.json();
    if (!data.ok || !data.history) throw new Error("No historical delivery data found");

    if (els.drilldownSubtitle) {
      els.drilldownSubtitle.textContent = `Historical multi-session delivery position & Demat absorption across ${data.history.length} trading sessions`;
    }

    if (els.drilldownTableBody) {
      els.drilldownTableBody.innerHTML = data.history.map(h => {
        const chgColor = h.changePct > 0 ? "#10b981" : (h.changePct < 0 ? "#ef4444" : "var(--text-muted)");
        const chgPrefix = h.changePct > 0 ? "+" : "";
        const fillClass = h.delivPer >= 60 ? "high" : (h.delivPer >= 40 ? "med" : "low");

        return `
          <tr>
            <td><strong>${h.date}</strong></td>
            <td>₹${h.close.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
            <td style="color:${chgColor}; font-weight:700;">${chgPrefix}${h.changePct}%</td>
            <td>${h.tradedQty.toLocaleString("en-IN")}</td>
            <td><strong>${h.delivQty.toLocaleString("en-IN")}</strong></td>
            <td>
              <div class="deliv-progress-wrap">
                <span style="font-weight:800; width:45px;">${h.delivPer}%</span>
                <div class="deliv-progress-bar">
                  <div class="deliv-progress-fill ${fillClass}" style="width: ${Math.min(100, h.delivPer)}%;"></div>
                </div>
              </div>
            </td>
            <td style="color:#16a34a; font-weight:700;">₹${h.delivTurnoverCr.toLocaleString("en-IN")} Cr</td>
            <td>${h.trades.toLocaleString("en-IN")}</td>
          </tr>
        `;
      }).join("");
    }
  } catch (err) {
    if (els.drilldownTableBody) {
      els.drilldownTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#dc2626; padding:20px;">Failed to load history: ${err.message}</td></tr>`;
    }
  }
}

function closeDeliveryDrilldown() {
  if (els.delivDrilldownModal) {
    els.delivDrilldownModal.style.display = "none";
  }
}

// =============================================================================
// 📊 MTA — MTF Analytics Module  (replaces old MTF functions)
// All vars prefixed mta_ or MTA to avoid conflicts
// Backward-compat: mtfDataGlobal alias + loadMtfData + renderMtfDashboard + renderMtfStockTable
// =============================================================================

let mtaData        = null; // primary data store
let mtaDailyTotals = null; // from https://mtf.trading/mtf_daily_totals.json
let mtaActiveSubTab = 'overview';
let mtaTimeframe    = '6M';
let mtaStockFilter  = 'all';
let mtaStockSort    = 'book';
let mtaStockSearch  = '';

// Backward-compat alias
Object.defineProperty(window, 'mtfDataGlobal', {
  get() { return mtaData; },
  set(v) { mtaData = v; },
  configurable: true
});

// ── Sub-tab switcher ─────────────────────────────────────────────────────────
function mtaSwitchTab(name) {
  mtaActiveSubTab = name;
  document.querySelectorAll('.mta-inner-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.subtab === name);
  });
  document.querySelectorAll('.mta-inner-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `mtaPanel-${name}`);
  });
  // Lazy-render expensive tabs
  if (name === 'trend' && mtaDailyTotals) mtaRenderTrendChart();
  if (name === 'retail' && mtaData) mtaRenderRetailTab(mtaData);
  if (name === 'movers' && mtaData) mtaRenderMoversTab(mtaData);
  if (name === 'sectors' && mtaData) mtaRenderSectorsTab(mtaData);
  if (name === 'broker' && mtaData) mtaRenderBrokerDesk(mtaData);
  if (name === 'global' && mtaData) mtaRenderGlobalLens(mtaData);
  if (name === 'calculator') mtaInitCalculator();
  if (name === 'compare') mtaInitCompareDesk();
  if (name === 'fragility' && mtaData) mtaRenderFragilityRadar(mtaData);
}

// ── Timeframe selector ───────────────────────────────────────────────────────
function mtaSetTimeframe(tf) {
  mtaTimeframe = tf;
  document.querySelectorAll('.mta-tf-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tf === tf);
  });
  if (mtaDailyTotals) mtaRenderTrendChart();
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function mtaCr(val) {
  if (val == null || isNaN(val)) return '—';
  return '₹' + Number(val).toLocaleString('en-IN', { maximumFractionDigits: 0 }) + ' Cr';
}
function mtaNum(val, d = 2) { return number(val, d); }
function mtaFmt(str) { return formatMtfDate(str); }

// ── Main data loader ─────────────────────────────────────────────────────────
async function loadMtfData(options = {}) {
  const forceRefresh  = Boolean(options.forceRefresh);
  const selectedDate  = options.date || (els.mtfSessionSelect ? els.mtfSessionSelect.value : '');
  const statusEl      = document.getElementById('mtaAsOfStatus');

  try {
    if (statusEl) statusEl.textContent = forceRefresh ? 'Syncing latest NSE file…' : 'Loading MTF data…';
    if (els.mtfRefreshBtn) {
      els.mtfRefreshBtn.disabled   = true;
      els.mtfRefreshBtn.textContent = forceRefresh ? 'Syncing…' : 'Loading…';
    }

    const payload = { forceRefresh };
    if (selectedDate && selectedDate !== 'auto') payload.dateCode = selectedDate;

    const resp = await fetch('/api/mtf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await resp.json();

    if (data && data.ok) {
      mtaData = data;
      renderMtfDashboard(data); // keep this name for switchTab compat
    } else {
      if (statusEl) statusEl.textContent = 'MTF Data Unavailable';
    }
  } catch (err) {
    console.error('Failed to load MTF data:', err);
    if (statusEl) statusEl.textContent = 'Fetch Error';
  } finally {
    if (els.mtfRefreshBtn) {
      els.mtfRefreshBtn.disabled    = false;
      els.mtfRefreshBtn.textContent = '🔄 Sync Latest NSE MTF File';
    }
  }

  // Also fetch daily totals from mtf.trading (non-blocking)
  mtaFetchDailyTotals();
}

// ── Process mtf.trading daily totals into date-grouped series (Crores) ────────
function mtaProcessDailyTotals(raw) {
  if (!Array.isArray(raw)) return [];
  const byDate = {};
  raw.forEach(r => {
    const d = r.date || r.dt;
    if (!d) return;
    if (!byDate[d]) {
      byDate[d] = { date: d, nse: 0, bse: 0, combined: 0, fresh: 0, liquid: 0, securities: 0 };
    }
    const endCr = (Number(r.end_outstanding) || 0) / 100.0;
    const freshCr = (Number(r.fresh_exposure || r.exposure_taken) || 0) / 100.0;
    const liquidCr = (Number(r.exposure_liquidated) || 0) / 100.0;
    if (r.exchange === 'NSE') {
      byDate[d].nse = endCr;
      byDate[d].fresh = freshCr;
      byDate[d].liquid = liquidCr;
      byDate[d].securities = Number(r.securities_count) || 0;
    } else if (r.exchange === 'BSE') {
      byDate[d].bse = endCr;
      if (!byDate[d].fresh && freshCr > 0) byDate[d].fresh = freshCr;
      if (!byDate[d].liquid && liquidCr > 0) byDate[d].liquid = liquidCr;
    }
  });
  const sortedDates = Object.keys(byDate).sort();
  return sortedDates.map(d => {
    const item = byDate[d];
    item.combined = item.nse + item.bse;
    return item;
  });
}

// ── Fetch mtf.trading daily totals ──────────────────────────────────────────
async function mtaFetchDailyTotals() {
  try {
    const resp = await fetch('https://mtf.trading/mtf_daily_totals.json');
    if (!resp.ok) return;
    const json = await resp.json();
    const raw = Array.isArray(json) ? json : (json.data || json.records || []);
    mtaDailyTotals = mtaProcessDailyTotals(raw);

    // Update Overview and Hero with latest daily totals if available
    if (mtaDailyTotals && mtaDailyTotals.length) {
      const latest = mtaDailyTotals[mtaDailyTotals.length - 1];
      const freshEl = document.getElementById('mtaFreshExposure');
      if (freshEl && latest.fresh > 0) freshEl.textContent = mtaCr(latest.fresh);

      const fEl = document.getElementById('mtaDtFresh');
      const lEl = document.getElementById('mtaDtLiquidated');
      const nEl = document.getElementById('mtaDtNet');
      const sEl = document.getElementById('mtaDtSecurities');
      if (fEl && latest.fresh > 0) fEl.textContent = mtaCr(latest.fresh);
      if (lEl && latest.liquid > 0) lEl.textContent = mtaCr(latest.liquid);
      if (nEl) {
        const net = latest.fresh - latest.liquid;
        nEl.textContent = (net >= 0 ? '+' : '') + mtaCr(net);
        nEl.className = 'mta-session-val ' + (net >= 0 ? 'text-green' : 'text-red');
      }
      if (sEl && latest.securities > 0) sEl.textContent = Number(latest.securities).toLocaleString('en-IN');
    }

    // Render sparkline and trend stats
    mtaRenderSparkline();
    if (mtaActiveSubTab === 'trend') mtaRenderTrendChart();
  } catch (e) {
    console.warn('mtf.trading daily totals fetch note:', e.message);
  }
}

// ── Date utility ─────────────────────────────────────────────────────────────
function formatMtfDate(str) {
  if (!str) return '--';
  if (typeof str === 'string' && str.includes('-')) {
    const parts = str.slice(0, 10).split('-');
    if (parts.length === 3) {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const mIdx = parseInt(parts[1], 10) - 1;
      return `${parts[2]} ${months[mIdx] || parts[1]} ${parts[0]}`;
    }
  }
  return str;
}

// ── Main render dispatcher ────────────────────────────────────────────────────
function renderMtfDashboard(data) {
  if (!data) return;

  const summary        = data.summary        || {};
  const brokers        = data.brokers        || {};
  const screenerSummary= data.screenerSummary|| {};

  // ── Hero KPI Strip ────────────────────────────────────────────────────────
  if (summary.display) {
    if (els.mtfNseVal)      els.mtfNseVal.textContent      = summary.display.nse      || mtaCr(summary.bookCrore?.nse);
    if (els.mtfBseVal)      els.mtfBseVal.textContent      = summary.display.bse      || mtaCr(summary.bookCrore?.bse);
    if (els.mtfCombinedVal) {
      els.mtfCombinedVal.textContent = summary.display.combined || mtaCr(summary.bookCrore?.combined);
      const dashMtf = document.getElementById("dashKpiMtf");
      if (dashMtf) dashMtf.textContent = els.mtfCombinedVal.textContent;
    }
  }
  const activeSecEl = document.getElementById('mtaActiveSecurities');
  if (activeSecEl && screenerSummary.stockCount) {
    activeSecEl.textContent = Number(screenerSummary.stockCount).toLocaleString('en-IN');
  }

  // ── Session Select ────────────────────────────────────────────────────────
  if (els.mtfSessionSelect && data.availableSessions && data.availableSessions.length) {
    const currentIso = (data.stockScreenerAsOf || data.asOf || '').slice(0, 10);
    els.mtfSessionSelect.innerHTML = data.availableSessions.map((s, idx) => {
      const iso      = s.dateIso ? s.dateIso.slice(0, 10) : s.dateCode;
      const selected = (iso === currentIso || s.dateCode === currentIso) ? 'selected' : '';
      const label    = idx === 0 ? `${s.date} (Latest)` : s.date;
      return `<option value="${s.dateCode}" ${selected}>${label}</option>`;
    }).join('');
  }

  // ── Screener meta ─────────────────────────────────────────────────────────
  if (els.mtfScreenerMeta) {
    const top = screenerSummary.topStock;
    const parts = [
      `${Number(screenerSummary.stockCount || 0).toLocaleString('en-IN')} stocks`,
      `₹${Number(screenerSummary.stockBookCrore || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr stockwise book`,
      `Top-10 concentration: ${mtaNum(screenerSummary.top10SharePct, 1)}%`,
      top ? `Largest: ${top.symbol} (${mtaNum(top.sharePct, 2)}%)` : ''
    ].filter(Boolean);
    els.mtfScreenerMeta.textContent = parts.join(' • ');
  }

  const statusEl = document.getElementById('mtaAsOfStatus');
  if (statusEl) statusEl.textContent = `Session: ${formatMtfDate(data.stockScreenerAsOf || data.asOf || 'Latest')}`;

  // Auto-sync latest date across desks
  const latestDateIso = (data.stockScreenerAsOf || data.asOf || '').slice(0, 10);
  if (latestDateIso) mtaAutoSyncDates(latestDateIso);

  // ── Render each sub-panel ─────────────────────────────────────────────────
  mtaRenderOverview(data);
  mtaRenderStockTable(data.stockScreener || []);
  // Render active sub-tab specifics
  if (mtaActiveSubTab === 'broker')  mtaRenderBrokerDesk(data);
  if (mtaActiveSubTab === 'global')  mtaRenderGlobalLens(data);
  if (mtaActiveSubTab === 'retail')  mtaRenderRetailTab(data);
  if (mtaActiveSubTab === 'movers')  mtaRenderMoversTab(data);
  if (mtaActiveSubTab === 'sectors') mtaRenderSectorsTab(data);
  if (mtaActiveSubTab === 'calculator') mtaInitCalculator();
  if (mtaActiveSubTab === 'compare') mtaInitCompareDesk();
  if (mtaActiveSubTab === 'fragility') mtaRenderFragilityRadar(data);
}

// ── Overview Tab ─────────────────────────────────────────────────────────────
function mtaRenderOverview(data) {
  const daily = data.dailyTotals || data.todayStats || {};

  // Fresh exposure hero
  const freshEl = document.getElementById('mtaFreshExposure');
  if (freshEl) {
    const fresh = daily.fresh_exposure || daily.freshExposure || daily.freshCrore;
    freshEl.textContent = fresh != null ? mtaCr(fresh) : '—';
  }

  // Session date badge
  const dateBadge = document.getElementById('mtaSessionDateBadge');
  if (dateBadge) dateBadge.textContent = formatMtfDate(data.stockScreenerAsOf || data.asOf || '—');

  // Session activity cards
  const fEl   = document.getElementById('mtaDtFresh');
  const lEl   = document.getElementById('mtaDtLiquidated');
  const nEl   = document.getElementById('mtaDtNet');
  const sEl   = document.getElementById('mtaDtSecurities');

  if (fEl) fEl.textContent = daily.fresh_exposure   != null ? mtaCr(daily.fresh_exposure)   : (daily.freshCrore  != null ? mtaCr(daily.freshCrore)  : '—');
  if (lEl) lEl.textContent = daily.exposure_squared != null ? mtaCr(daily.exposure_squared) : (daily.liquidCrore != null ? mtaCr(daily.liquidCrore) : '—');
  if (nEl) {
    const net = (daily.fresh_exposure || daily.freshCrore || 0) - (daily.exposure_squared || daily.liquidCrore || 0);
    nEl.textContent  = net !== 0 ? (net > 0 ? '+' : '') + mtaCr(net) : '—';
    nEl.className    = 'mta-session-val ' + (net > 0 ? 'text-green' : net < 0 ? 'text-red' : '');
  }
  if (sEl) sEl.textContent = daily.securities_count || daily.stockCount || (data.screenerSummary?.stockCount) || '—';

  // Top 10 table
  mtaRenderTop10(data.stockScreener || []);
}

// ── Top 10 ────────────────────────────────────────────────────────────────────
function mtaRenderTop10(stocks) {
  const tbody = document.getElementById('mtaTop10Body');
  if (!tbody) return;
  const top10 = [...stocks].sort((a, b) => (b.amtFinancedCrore || 0) - (a.amtFinancedCrore || 0)).slice(0, 10);
  if (!top10.length) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#94a3b8;padding:20px;">No data available</td></tr>'; return; }
  tbody.innerHTML = top10.map((s, i) => {
    const seg  = s.isFnO ? '<span class="mta-badge mta-badge-fno">F&O</span>' : '<span class="mta-badge mta-badge-cash">Cash</span>';
    const rowCls = s.amtFinancedCrore >= 500 ? 'mta-row-heavy' : s.amtFinancedCrore >= 50 ? 'mta-row-sig' : '';
    return `<tr class="${rowCls}" style="cursor:pointer;" onclick="inspectStock('${s.symbol}')">
      <td><strong>#${i+1}</strong></td>
      <td><strong class="mta-sym">${s.symbol}</strong></td>
      <td class="mta-name">${s.name}</td>
      <td>${seg}</td>
      <td style="text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;">₹${Number(s.amtFinancedCrore).toLocaleString('en-IN',{maximumFractionDigits:0})}</td>
      <td style="text-align:right;font-weight:700;color:${s.sharePct >= 1 ? '#b45309' : '#475569'};">${mtaNum(s.sharePct, 2)}%</td>
      <td style="text-align:right;font-family:'JetBrains Mono',monospace;">${Number(s.qtyFinanced).toLocaleString('en-IN')}</td>
    </tr>`;
  }).join('');
}

// ── Sparkline (30-day NSE) ────────────────────────────────────────────────────
function mtaRenderSparkline() {
  const container = document.getElementById('mtaPulseSparkline');
  if (!container || !mtaDailyTotals || !mtaDailyTotals.length) return;

  const last30 = mtaDailyTotals.slice(-30);
  const vals   = last30.map(d => Number(d.nse || d.nse_outstanding || d.outstanding || 0));
  const bseVals= last30.map(d => Number(d.bse || d.bse_outstanding || 0));
  const dates  = last30.map(d => d.date || d.dt || '');

  if (!vals.some(v => v > 0)) return;

  const W = container.clientWidth || 400;
  const H = 120;
  const pad = { t: 10, r: 10, b: 24, l: 48 };
  const minV = Math.min(...vals.filter(v=>v>0)) * 0.95;
  const maxV = Math.max(...vals) * 1.02;
  const bseMin = Math.min(...bseVals.filter(v=>v>0)) * 0.95 || 0;
  const bseMax = Math.max(...bseVals) * 1.02 || 1;

  const xScale = i => pad.l + (i / (vals.length - 1)) * (W - pad.l - pad.r);
  const yScale = v => pad.t + (1 - (v - minV) / (maxV - minV)) * (H - pad.t - pad.b);
  const yBse   = v => pad.t + (1 - (v - bseMin) / (bseMax - bseMin)) * (H - pad.t - pad.b);

  const nsePath  = vals.map((v, i) => `${i===0?'M':'L'}${xScale(i)},${yScale(v)}`).join(' ');
  const bsePath  = bseVals.map((v, i) => `${i===0?'M':'L'}${xScale(i)},${yBse(v)}`).join(' ');
  const areaPath = vals.map((v, i) => `${i===0?'M':'L'}${xScale(i)},${yScale(v)}`).join(' ')
    + ` L${xScale(vals.length-1)},${H-pad.b} L${pad.l},${H-pad.b} Z`;

  // Date labels (first and last)
  const d0  = dates[0]  || '';
  const dN  = dates[dates.length-1] || '';

  container.innerHTML = `<svg width="${W}" height="${H}" style="display:block;">
    <defs>
      <linearGradient id="nseGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2563eb" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#2563eb" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="${areaPath}" fill="url(#nseGrad)"/>
    <path d="${bsePath}" stroke="#16a34a" stroke-width="1.5" fill="none" stroke-dasharray="3,3" opacity="0.7"/>
    <path d="${nsePath}" stroke="#2563eb" stroke-width="2" fill="none"/>
    <circle cx="${xScale(vals.length-1)}" cy="${yScale(vals[vals.length-1])}" r="3" fill="#2563eb"/>
    <text x="${pad.l}" y="${H-6}" font-size="9" fill="#94a3b8">${d0}</text>
    <text x="${xScale(vals.length-1)}" y="${H-6}" font-size="9" fill="#94a3b8" text-anchor="end">${dN}</text>
    <text x="${pad.l - 4}" y="${yScale(vals[vals.length-1])}" font-size="9" fill="#2563eb" text-anchor="end">${Math.round(vals[vals.length-1]).toLocaleString('en-IN')}</text>
  </svg>`;
}

// ── Stock Table (Top Stocks tab + backward compat renderMtfStockTable) ────────
function mtaRenderStockTable(stocks, forceFilter) {
  const tbody     = document.getElementById('mtfStockTableBody');
  if (!tbody) return;
  const filterMode= forceFilter || (els.mtfStockFilter ? els.mtfStockFilter.value : 'all');
  const searchQ   = (els.mtfStockSearch ? els.mtfStockSearch.value : '').trim().toUpperCase();
  const sortMode  = els.mtfStockSort   ? els.mtfStockSort.value   : 'book';

  let list = [...(stocks || mtaData?.stockScreener || [])];

  if (filterMode === 'fno')   list = list.filter(s => s.isFnO);
  else if (filterMode === 'top50') list = list.slice(0, 50);

  if (searchQ) list = list.filter(s => (s.symbol||'').toUpperCase().includes(searchQ) || (s.name||'').toUpperCase().includes(searchQ));

  if (sortMode === 'quantity') list.sort((a, b) => (b.qtyFinanced||0) - (a.qtyFinanced||0));
  else if (sortMode === 'symbol') list.sort((a, b) => String(a.symbol||'').localeCompare(String(b.symbol||'')));
  else if (sortMode === 'share') list.sort((a, b) => (b.sharePct||0) - (a.sharePct||0));
  else list.sort((a, b) => (b.amtFinancedCrore||0) - (a.amtFinancedCrore||0));

  const badge = document.getElementById('mtfStockCountBadge');
  if (badge) badge.textContent = `${list.length} Stocks`;

  const totalBook = list.reduce((s, x) => s + (x.amtFinancedCrore||0), 0);

  tbody.innerHTML = list.slice(0, 500).map((s, i) => {
    const isHeavy  = s.amtFinancedCrore >= 500;
    const isSig    = s.amtFinancedCrore >= 50;
    const rowCls   = isHeavy ? 'mta-row-heavy' : isSig ? 'mta-row-sig' : '';
    const riskBadge= isHeavy
      ? '<span class="mta-badge" style="background:#fee2e2;color:#991b1b;border:1px solid #fca5a5;font-size:10px;">⚠ HEAVY</span>'
      : isSig
        ? '<span class="mta-badge" style="background:#fef3c7;color:#92400e;border:1px solid #fde68a;font-size:10px;">MED</span>'
        : '<span class="mta-badge" style="background:#f0fdf4;color:#166534;border:1px solid #bbf7d0;font-size:10px;">LOW</span>';
    const seg = s.isFnO
      ? '<span class="mta-badge mta-badge-fno">F&O</span>'
      : '<span class="mta-badge mta-badge-cash">Cash</span>';
    const exchBadge = '<span class="mta-badge mta-badge-nse">NSE</span>';
    const bookShare = totalBook > 0 ? (s.amtFinancedCrore / totalBook * 100) : (s.sharePct || 0);

    return `<tr class="${rowCls}" style="cursor:pointer;" onclick="inspectStock('${s.symbol}')">
      <td style="color:#64748b;font-weight:600;">#${i+1}</td>
      <td><strong class="mta-sym">${s.symbol}</strong></td>
      <td class="mta-name">${s.name}</td>
      <td style="text-align:center;">${exchBadge}</td>
      <td style="text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;color:${isHeavy?'#dc2626':isSig?'#d97706':'#0f172a'};">₹${Number(s.amtFinancedCrore).toLocaleString('en-IN',{maximumFractionDigits:0})}</td>
      <td style="text-align:right;font-family:'JetBrains Mono',monospace;">${Number(s.qtyFinanced||0).toLocaleString('en-IN')}</td>
      <td style="text-align:right;font-weight:700;color:${bookShare >= 1 ? '#b45309' : '#475569'};">${mtaNum(bookShare, 2)}%</td>
      <td style="text-align:center;">${seg}</td>
      <td style="text-align:center;">${riskBadge}</td>
    </tr>`;
  }).join('');
}

// Backward-compat alias expected by external callers
function renderMtfStockTable() {
  if (!mtaData || !mtaData.stockScreener || !els.mtfStockTableBody) return;
  mtaRenderStockTable(mtaData.stockScreener);
}

// ── Retail vs Institutional Tab (Quantitative Model) ─────────────────────────
const MTA_NIFTY50 = new Set([
  'ADANIENT', 'ADANIPORTS', 'APOLLOHOSP', 'ASIANPAINT', 'AXISBANK', 'BAJAJ-AUTO',
  'BAJFINANCE', 'BAJAJFINSV', 'BEL', 'BPCL', 'BHARTIARTL', 'BRITANNIA', 'CIPLA',
  'COALINDIA', 'DRREDDY', 'EICHERMOT', 'GRASIM', 'HCLTECH', 'HDFCBANK', 'HDFCLIFE',
  'HEROMOTOCO', 'HINDALCO', 'HINDUNILVR', 'ICICIBANK', 'ITC', 'INDUSINDBK',
  'INFY', 'JSWSTEEL', 'KOTAKBANK', 'LT', 'M&M', 'MARUTI', 'NTPC', 'NESTLEIND',
  'ONGC', 'POWERGRID', 'RELIANCE', 'SBILIFE', 'SHRIRAMFIN', 'SBIN', 'SUNPHARMA',
  'TCS', 'TATACONSUM', 'TATAMOTORS', 'TATASTEEL', 'TECHM', 'TITAN', 'TRENT',
  'ULTRACEMCO', 'WIPRO'
]);

let mtaClassifiedStocks = [];
let mtaActiveRetailFilter = 'ALL';

function mtaClassifyStock(s) {
  const sym = s.symbol;
  const amt = s.amtFinancedCrore || 0;
  const qty = s.qtyFinanced || 0;
  const debtPerShare = qty > 0 ? (amt * 1e7) / qty : 0;
  const dPct = s.deltaPct || 0;
  const isFnO = Boolean(s.isFnO);
  const share = s.sharePct || 0;

  // 1. SPECULATIVE: Low price / penny stocks where retail crowds in (<₹25 debt/share or massive qty low price)
  if ((debtPerShare > 0 && debtPerShare < 25) || (qty > 15000000 && debtPerShare < 50 && !MTA_NIFTY50.has(sym))) {
    return 'SPECULATIVE';
  }

  // 2. INSTITUTIONAL BUILD:
  // - Nifty 50 constituent with significant book (>₹150 Cr)
  // - Or high-value non-F&O delivery accumulation (>₹100 Cr)
  // - Or high ticket size (>₹200/share debt) and massive book (>₹300 Cr)
  if (MTA_NIFTY50.has(sym) && amt >= 150) {
    return 'INSTITUTIONAL BUILD';
  }
  if (!isFnO && amt >= 100) {
    return 'INSTITUTIONAL BUILD';
  }
  if (amt >= 300 && debtPerShare >= 200) {
    return 'INSTITUTIONAL BUILD';
  }

  // 3. MOMENTUM PLAY:
  // - Sharp session surge (>+15%) with significant book (>₹25 Cr)
  if (dPct >= 15 && amt >= 25) {
    return 'MOMENTUM PLAY';
  }

  // 4. RETAIL HEAVY:
  // - F&O trending midcap/high-beta scrips where retail leverage dominates
  if (isFnO && amt >= 60) {
    return 'RETAIL HEAVY';
  }
  if (share >= 0.25) {
    return 'RETAIL HEAVY';
  }
  if (isFnO) {
    return 'MOMENTUM PLAY';
  }

  return 'RETAIL HEAVY';
}

function mtaClassBadge(cls) {
  const map = {
    'RETAIL HEAVY':        'mta-badge-retail',
    'INSTITUTIONAL BUILD': 'mta-badge-inst',
    'MOMENTUM PLAY':       'mta-badge-momentum',
    'SPECULATIVE':         'mta-badge-spec'
  };
  const labelMap = {
    'RETAIL HEAVY':        '🔴 RETAIL HEAVY',
    'INSTITUTIONAL BUILD': '🏛️ INSTITUTIONAL',
    'MOMENTUM PLAY':       '⚡ MOMENTUM',
    'SPECULATIVE':         '⚠️ SPECULATIVE'
  };
  return `<span class="mta-badge ${map[cls]||''}">${labelMap[cls] || cls}</span>`;
}

function mtaInsight(s, cls) {
  const amt = s.amtFinancedCrore || 0;
  const qty = s.qtyFinanced || 0;
  const debt = qty > 0 ? (amt * 1e7) / qty : 0;
  if (cls === 'SPECULATIVE') {
    return `Penny speculation: ₹${debt.toFixed(1)}/sh debt across ${formatInt(qty)} shares — High liquidation risk`;
  }
  if (cls === 'INSTITUTIONAL BUILD') {
    return `${MTA_NIFTY50.has(s.symbol) ? 'Nifty 50 Bluechip' : 'High-ticket'} delivery anchor holding ₹${Math.round(amt).toLocaleString('en-IN')} Cr debt (${mtaNum(s.sharePct,2)}% book)`;
  }
  if (cls === 'MOMENTUM PLAY') {
    return `Rapid leverage expansion: +${s.deltaPct > 0 ? '+' : ''}${mtaNum(s.deltaPct,1)}% in last session (₹${Math.round(amt)} Cr)`;
  }
  return `Trending F&O scrip with active retail crowd participation: ₹${Math.round(amt).toLocaleString('en-IN')} Cr`;
}

function mtaRenderRetailTab(data) {
  const stocks = [...(data.stockScreener || [])].sort((a,b) => (b.amtFinancedCrore||0) - (a.amtFinancedCrore||0));
  const classified = stocks.map(s => ({
    ...s,
    _cls: mtaClassifyStock(s),
    _debtPerShare: (s.qtyFinanced && s.amtFinancedCrore) ? (s.amtFinancedCrore * 1e7) / s.qtyFinanced : 0
  }));
  mtaClassifiedStocks = classified;

  // Book Sums
  const retailStocks = classified.filter(s => s._cls === 'RETAIL HEAVY');
  const instStocks   = classified.filter(s => s._cls === 'INSTITUTIONAL BUILD');
  const specStocks   = classified.filter(s => s._cls === 'SPECULATIVE');
  const momStocks    = classified.filter(s => s._cls === 'MOMENTUM PLAY');

  const retailBook = retailStocks.reduce((sum, x) => sum + (x.amtFinancedCrore || 0), 0);
  const instBook   = instStocks.reduce((sum, x) => sum + (x.amtFinancedCrore || 0), 0);
  const specBook   = specStocks.reduce((sum, x) => sum + (x.amtFinancedCrore || 0), 0);
  const momBook    = momStocks.reduce((sum, x) => sum + (x.amtFinancedCrore || 0), 0);
  const totalBook  = retailBook + instBook + specBook + momBook;

  // Update Hero KPI Cards
  const srb = document.getElementById('mtaSumRetailBook');
  const sib = document.getElementById('mtaSumInstBook');
  const ssb = document.getElementById('mtaSumSpecBook');
  const rat = document.getElementById('mtaSumRatio');
  const srd = document.getElementById('mtaSigRetailDesc');
  const sid = document.getElementById('mtaSigInstDesc');
  const regDesc = document.getElementById('mtaRegimeDesc');

  if (srb) srb.textContent = mtaCr(retailBook);
  if (sib) sib.textContent = mtaCr(instBook);
  if (ssb) ssb.textContent = mtaCr(specBook);

  const retSharePct = totalBook > 0 ? (retailBook / totalBook * 100) : 0;
  const instSharePct = totalBook > 0 ? (instBook / totalBook * 100) : 0;
  if (srd) srd.textContent = `${retSharePct.toFixed(1)}% of total MTF book (${retailStocks.length} scrips)`;
  if (sid) sid.textContent = `${instSharePct.toFixed(1)}% of total MTF book (${instStocks.length} bluechips)`;

  if (rat) {
    const ratio = instBook > 0 ? (retailBook / instBook) : 0;
    rat.textContent = `${ratio.toFixed(2)}x`;
    if (regDesc) {
      regDesc.textContent = ratio > 2.5 ? '⚠️ Heavy Retail Leveraged Dominance' : ratio > 1.5 ? '⚖️ Moderate Retail Bias' : '🟢 Well-Balanced Institutional Base';
    }
  }

  // Update Pill Counts
  const pAll = document.getElementById('mtaPillAllCount');
  const pInst = document.getElementById('mtaPillInstCount');
  const pRet = document.getElementById('mtaPillRetailCount');
  const pSpec = document.getElementById('mtaPillSpecCount');
  const pMom = document.getElementById('mtaPillMomCount');
  if (pAll) pAll.textContent = classified.length;
  if (pInst) pInst.textContent = instStocks.length;
  if (pRet) pRet.textContent = retailStocks.length;
  if (pSpec) pSpec.textContent = specStocks.length;
  if (pMom) pMom.textContent = momStocks.length;

  // Render Dual Top 5 Leaderboards
  const topRetailEl = document.getElementById('mtaTopRetailList');
  if (topRetailEl) {
    const top5Ret = retailStocks.slice(0, 5);
    topRetailEl.innerHTML = top5Ret.map(s => {
      const seg = s.isFnO ? '<span class="mta-badge mta-badge-fno">F&O</span>' : '<span class="mta-badge mta-badge-cash">Cash</span>';
      return `<tr style="cursor:pointer;" onclick="inspectStock('${s.symbol}')">
        <td><strong class="mta-sym" style="color:#d97706;">${s.symbol}</strong><div style="font-size:10px;color:#64748b;">${s.name}</div></td>
        <td style="text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;">₹${Number(s.amtFinancedCrore).toLocaleString('en-IN',{maximumFractionDigits:0})}</td>
        <td style="text-align:right;font-family:'JetBrains Mono',monospace;font-size:10.5px;">₹${s._debtPerShare.toFixed(1)}</td>
        <td style="text-align:center;">${seg}</td>
      </tr>`;
    }).join('');
  }

  const topInstEl = document.getElementById('mtaTopInstList');
  if (topInstEl) {
    const top5Inst = instStocks.slice(0, 5);
    topInstEl.innerHTML = top5Inst.map(s => {
      const seg = s.isFnO ? '<span class="mta-badge mta-badge-fno">F&O</span>' : '<span class="mta-badge mta-badge-cash">Cash</span>';
      return `<tr style="cursor:pointer;" onclick="inspectStock('${s.symbol}')">
        <td><strong class="mta-sym" style="color:#16a34a;">${s.symbol}</strong><div style="font-size:10px;color:#64748b;">${s.name}</div></td>
        <td style="text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;color:#16a34a;">₹${Number(s.amtFinancedCrore).toLocaleString('en-IN',{maximumFractionDigits:0})}</td>
        <td style="text-align:right;font-family:'JetBrains Mono',monospace;font-size:10.5px;">₹${s._debtPerShare.toFixed(1)}</td>
        <td style="text-align:center;">${seg}</td>
      </tr>`;
    }).join('');
  }

  // Filter Table
  mtaFilterRetailTable();
}

function mtaSetRetailFilter(f) {
  mtaActiveRetailFilter = f;
  const pills = document.querySelectorAll('#mtaRetailPills .mta-pill');
  pills.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === f);
  });
  mtaFilterRetailTable();
}

function mtaFilterRetailTable() {
  const tbody = document.getElementById('mtaRetailTableBody');
  if (!tbody || !mtaClassifiedStocks.length) return;

  const f = mtaActiveRetailFilter || 'ALL';
  const q = (document.getElementById('mtaRetailSearchInput')?.value || '').trim().toUpperCase();

  let filtered = mtaClassifiedStocks;
  if (f && f !== 'ALL') {
    filtered = filtered.filter(s => s._cls === f);
  }
  if (q) {
    filtered = filtered.filter(s => (s.symbol || '').toUpperCase().includes(q) || (s.name || '').toUpperCase().includes(q));
  }

  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#94a3b8;padding:24px;">No stocks matching filter and search criteria</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.slice(0, 200).map((s, i) => {
    const seg = s.isFnO ? '<span class="mta-badge mta-badge-fno">F&O</span>' : '<span class="mta-badge mta-badge-cash">Cash</span>';
    const debtStr = s._debtPerShare > 0 ? `₹${Number(s._debtPerShare.toFixed(1)).toLocaleString('en-IN')}` : '—';
    return `<tr style="cursor:pointer;" onclick="inspectStock('${s.symbol}')">
      <td style="color:#64748b;font-weight:600;">#${i+1}</td>
      <td><strong class="mta-sym">${s.symbol}</strong></td>
      <td class="mta-name">${s.name}</td>
      <td style="text-align:center;">${seg}</td>
      <td style="text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;color:#0f172a;">₹${Number(s.amtFinancedCrore).toLocaleString('en-IN',{maximumFractionDigits:0})}</td>
      <td style="text-align:right;font-family:'JetBrains Mono',monospace;">${debtStr}</td>
      <td style="text-align:center;">${mtaClassBadge(s._cls)}</td>
      <td class="mta-insight-text" style="font-size:11px;color:#475569;">${mtaInsight(s, s._cls)}</td>
    </tr>`;
  }).join('');
}

function mtaExportRetailCsv() {
  if (!mtaClassifiedStocks.length) return;
  const f = mtaActiveRetailFilter || 'ALL';
  const q = (document.getElementById('mtaRetailSearchInput')?.value || '').trim().toUpperCase();

  let filtered = mtaClassifiedStocks;
  if (f && f !== 'ALL') filtered = filtered.filter(s => s._cls === f);
  if (q) filtered = filtered.filter(s => (s.symbol || '').toUpperCase().includes(q) || (s.name || '').toUpperCase().includes(q));

  const headers = ['Symbol', 'Company Name', 'Segment', 'Classification', 'MTF Book (Cr)', 'Margin Debt Per Share (₹)', 'Financed Qty', 'Insight'];
  const rows = filtered.map(s => [
    `"${(s.symbol || '').replace(/"/g, '""')}"`,
    `"${(s.name || '').replace(/"/g, '""')}"`,
    s.isFnO ? 'F&O' : 'Cash',
    `"${s._cls}"`,
    s.amtFinancedCrore != null ? s.amtFinancedCrore.toFixed(2) : '0',
    s._debtPerShare ? s._debtPerShare.toFixed(2) : '0',
    s.qtyFinanced || 0,
    `"${mtaInsight(s, s._cls).replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `MTF_Retail_vs_Institutional_${f.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ── CSS Donut chart ───────────────────────────────────────────────────────────
function mtaRenderDonut(segments, total) {
  const donutEl  = document.getElementById('mtaDonut');
  const legendEl = document.getElementById('mtaDonutLegend');
  const centerEl = document.getElementById('mtaDonutCenter');
  if (!donutEl) return;

  const validSegs = segments.filter(s => s.val > 0 && total > 0);
  let cumulative  = 0;
  const size      = 140;
  const r         = 52;
  const cx = cy   = size / 2;
  const strokeW   = 22;

  // Build SVG arcs
  let svgArcs = '';
  validSegs.forEach(seg => {
    const pct  = seg.val / total;
    const circ = 2 * Math.PI * r;
    const dash = pct * circ;
    const offset = circ - cumulative * circ;
    svgArcs += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
      stroke="${seg.color}" stroke-width="${strokeW}"
      stroke-dasharray="${dash} ${circ - dash}"
      stroke-dashoffset="${offset}"
      style="transition:stroke-dasharray 0.4s ease;">
      <title>${seg.label}: ₹${Math.round(seg.val).toLocaleString('en-IN')} Cr (${(pct*100).toFixed(1)}%)</title>
    </circle>`;
    cumulative += pct;
  });

  donutEl.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(-90deg);">${svgArcs}</svg>
    <span class="mta-donut-center-label">₹${Math.round(total).toLocaleString('en-IN')}<br><small>Cr Total</small></span>`;

  if (legendEl) {
    legendEl.innerHTML = validSegs.map(s =>
      `<div class="mta-donut-leg-item">
        <span style="width:10px;height:10px;border-radius:50%;background:${s.color};display:inline-block;margin-right:6px;"></span>
        <span>${s.label}</span>
        <span style="margin-left:auto;font-family:'JetBrains Mono',monospace;font-weight:700;">${(s.val/total*100).toFixed(1)}%</span>
      </div>`
    ).join('');
  }
}

// ── Heatmap ────────────────────────────────────────────────────────────────────
function mtaRenderHeatmap(stocks) {
  const container = document.getElementById('mtaHeatmap');
  if (!container) return;
  const maxBook = Math.max(...stocks.map(s => s.amtFinancedCrore||0), 1);
  const colorMap = {
    'RETAIL HEAVY':        '#d97706',
    'INSTITUTIONAL BUILD': '#16a34a',
    'MOMENTUM PLAY':       '#2563eb',
    'SPECULATIVE':         '#dc2626'
  };
  container.innerHTML = stocks.map(s => {
    const pct  = Math.max(0.1, (s.amtFinancedCrore||0) / maxBook);
    const size = Math.max(40, Math.round(pct * 110));
    const col  = colorMap[s._cls] || '#94a3b8';
    const alpha= Math.max(0.3, pct * 0.9);
    return `<div class="mta-heatmap-cell"
      style="width:${size}px;height:${size}px;background:${col};opacity:${alpha.toFixed(2)};font-size:${Math.max(8,size/8)}px;"
      title="${s.symbol}: ₹${Number(s.amtFinancedCrore).toLocaleString('en-IN')} Cr — ${s._cls}">
      ${size >= 48 ? `<span>${s.symbol}</span>` : ''}
    </div>`;
  }).join('');
}

// ── Historical Trend Chart (SVG) ──────────────────────────────────────────────
let mtaCurrentChartData = null;

function mtaFmtAxisVal(val) {
  if (val >= 100000) return '₹' + (val / 100000).toFixed(2) + 'L Cr';
  if (val >= 10000)  return '₹' + Math.round(val / 1000) + 'k Cr';
  if (val >= 1000)   return '₹' + Math.round(val).toLocaleString('en-IN') + ' Cr';
  return '₹' + Math.round(val) + ' Cr';
}

// ── Historical Trend Chart with Precision Crosshair ───────────────────────────
function mtaRenderTrendChart() {
  const container = document.getElementById('mtaTrendChartContainer');
  const loadingEl = document.getElementById('mtaChartLoading');
  const svg       = document.getElementById('mtaTrendSvg');
  if (!svg) return;

  if (!mtaDailyTotals || !mtaDailyTotals.length) {
    if (loadingEl) loadingEl.style.display = 'flex';
    return;
  }
  if (loadingEl) loadingEl.style.display = 'none';

  // Filter by timeframe - slice from the newest records
  const nTotal = mtaDailyTotals.length;
  let count = nTotal;
  if (mtaTimeframe === '1M') count = 22;
  else if (mtaTimeframe === '3M') count = 66;
  else if (mtaTimeframe === '6M') count = 132;
  else if (mtaTimeframe === '1Y') count = 252;
  else if (mtaTimeframe === '3Y') count = 756;
  else count = nTotal;

  const filtered = mtaDailyTotals.slice(-count);
  if (!filtered.length) return;

  const showFreshLiq = Boolean(document.getElementById('mtaShowFreshLiq')?.checked);

  const nseVals  = filtered.map(d => Number(d.nse || 0));
  const bseVals  = filtered.map(d => Number(d.bse || 0));
  const freshV   = filtered.map(d => Number(d.fresh || 0));
  const liquV    = filtered.map(d => Number(d.liquid || 0));
  const dates    = filtered.map(d => d.date || '');

  // Trend stats (52W based on last 252 available sessions)
  const peakNse  = Math.max(...mtaDailyTotals.map(d => Number(d.nse || 0)));
  const currNse  = nseVals[nseVals.length - 1] || 0;
  const yr252    = mtaDailyTotals.slice(-252);
  const hi52     = Math.max(...yr252.map(d => Number(d.nse || 0)));
  const lo52     = Math.min(...yr252.filter(d => Number(d.nse || 0) > 0).map(d => Number(d.nse || 0)));

  const tsPeak  = document.getElementById('mtaTsPeak');
  const tsVsP   = document.getElementById('mtaTsVsPeak');
  const ts52H   = document.getElementById('mtaTs52High');
  const ts52L   = document.getElementById('mtaTs52Low');
  const tsDpts  = document.getElementById('mtaTsDataPts');
  if (tsPeak) tsPeak.textContent = mtaFmtAxisVal(peakNse);
  if (tsVsP)  {
    const pct = peakNse > 0 ? ((currNse - peakNse) / peakNse * 100).toFixed(1) : 0;
    tsVsP.textContent = `${pct >= 0 ? '+' : ''}${pct}%`;
    tsVsP.className = 'mta-tstat-val ' + (pct >= 0 ? 'text-green' : 'text-red');
  }
  if (ts52H)  ts52H.textContent = mtaFmtAxisVal(hi52);
  if (ts52L)  ts52L.textContent = mtaFmtAxisVal(lo52);
  if (tsDpts) tsDpts.textContent = `${filtered.length} sessions`;

  // Dimensions
  const W   = container?.clientWidth || 800;
  const H   = 340;
  const pad = { t: 25, r: 65, b: 42, l: 82 };
  const iW  = W - pad.l - pad.r;
  const iH  = H - pad.t - pad.b;

  const usePrimary = showFreshLiq ? freshV : nseVals;
  const useSecond  = showFreshLiq ? liquV  : bseVals;
  const primColor  = showFreshLiq ? '#2563eb' : '#2563eb';
  const secColor   = showFreshLiq ? '#dc2626' : '#16a34a';

  let minP, maxP, minS, maxS;
  if (showFreshLiq) {
    // Both on same scale for accurate direct comparison
    const combinedFlows = [...freshV, ...liquV].filter(v => v > 0);
    minP = minS = Math.min(...combinedFlows, 0) * 0.95;
    maxP = maxS = Math.max(...combinedFlows, 1) * 1.05;
  } else {
    minP = Math.min(...usePrimary.filter(v => v > 0)) * 0.98;
    maxP = Math.max(...usePrimary) * 1.02;
    minS = Math.min(...useSecond.filter(v => v > 0)) * 0.98 || 0;
    maxS = Math.max(...useSecond) * 1.02 || 1;
  }

  const n  = usePrimary.length;
  const xS = i => pad.l + (i / Math.max(n - 1, 1)) * iW;
  const yP = v => pad.t + (1 - (v - minP) / Math.max(0.001, maxP - minP)) * iH;
  const yS = v => pad.t + (1 - (v - minS) / Math.max(0.001, maxS - minS)) * iH;

  // Store for crosshair interaction
  mtaCurrentChartData = {
    pad, iW, iH, W, H, n, filtered, dates, usePrimary, useSecond, yP, yS, minP, maxP, minS, maxS, showFreshLiq
  };

  // SVG Paths
  const primPath = usePrimary.map((v, i) => `${i === 0 ? 'M' : 'L'}${xS(i).toFixed(1)},${yP(v).toFixed(1)}`).join(' ');
  const secPath  = useSecond.map((v, i) => `${i === 0 ? 'M' : 'L'}${xS(i).toFixed(1)},${yS(v).toFixed(1)}`).join(' ');
  const areaPath = usePrimary.map((v, i) => `${i === 0 ? 'M' : 'L'}${xS(i).toFixed(1)},${yP(v).toFixed(1)}`).join(' ')
    + ` L${xS(n - 1).toFixed(1)},${pad.t + iH} L${pad.l},${pad.t + iH} Z`;

  // Y-axis grid lines (5 ticks)
  let gridLines = '', yLabels = '', yLabelsR = '';
  for (let t = 0; t <= 4; t++) {
    const yPos = pad.t + (t / 4) * iH;
    const vP   = maxP - (t / 4) * (maxP - minP);
    const vS   = maxS - (t / 4) * (maxS - minS);
    gridLines += `<line x1="${pad.l}" y1="${yPos.toFixed(1)}" x2="${W - pad.r}" y2="${yPos.toFixed(1)}" stroke="#e2e8f0" stroke-width="1"/>`;
    yLabels   += `<text x="${pad.l - 8}" y="${(yPos + 4).toFixed(1)}" font-size="10" font-weight="700" fill="#2563eb" text-anchor="end" font-family="'JetBrains Mono',monospace">${mtaFmtAxisVal(vP)}</text>`;
    if (!showFreshLiq) {
      yLabelsR += `<text x="${W - pad.r + 8}" y="${(yPos + 4).toFixed(1)}" font-size="10" font-weight="700" fill="#16a34a" text-anchor="start" font-family="'JetBrains Mono',monospace">${mtaFmtAxisVal(vS)}</text>`;
    }
  }

  // X-axis date labels (8 labels spaced evenly)
  let xLabels = '';
  const step = Math.max(1, Math.floor((n - 1) / 7));
  for (let i = 0; i < n; i += step) {
    const d = dates[i] || '';
    const lbl = formatMtfDate(d).replace(/ \d{4}$/, ''); // short format e.g. "11 Sep"
    xLabels += `<text x="${xS(i).toFixed(1)}" y="${H - 12}" font-size="9.5" font-weight="600" fill="#64748b" text-anchor="middle" font-family="'JetBrains Mono',monospace">${lbl}</text>`;
  }
  // Ensure the very last date is always visible
  const lastD = dates[n - 1] || '';
  const lastLbl = formatMtfDate(lastD).replace(/ \d{4}$/, '');
  xLabels += `<text x="${xS(n - 1).toFixed(1)}" y="${H - 12}" font-size="9.5" font-weight="700" fill="#0f172a" text-anchor="middle" font-family="'JetBrains Mono',monospace">${lastLbl}</text>`;

  svg.setAttribute('width', W);
  svg.innerHTML = `
    <defs>
      <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${primColor}" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="${primColor}" stop-opacity="0.01"/>
      </linearGradient>
      <clipPath id="chartClip">
        <rect x="${pad.l}" y="${pad.t}" width="${iW}" height="${iH}"/>
      </clipPath>
    </defs>

    <!-- Background -->
    <rect x="${pad.l}" y="${pad.t}" width="${iW}" height="${iH}" fill="#ffffff" rx="6" stroke="#e2e8f0"/>
    
    <!-- Grid -->
    ${gridLines}

    <!-- Series Paths -->
    <path d="${areaPath}" fill="url(#trendGrad)" clip-path="url(#chartClip)"/>
    <path d="${secPath}" stroke="${secColor}" stroke-width="1.8" fill="none" stroke-dasharray="${showFreshLiq ? 'none' : '4,3'}" opacity="0.85" clip-path="url(#chartClip)"/>
    <path d="${primPath}" stroke="${primColor}" stroke-width="2.5" fill="none" clip-path="url(#chartClip)"/>

    <!-- Axis Labels -->
    ${yLabels}${yLabelsR}${xLabels}

    <!-- Crosshair Lines & Dots (Initially hidden) -->
    <g id="mtaCrosshairGroup" style="pointer-events:none;">
      <line id="mtaCrosshairX" x1="0" y1="${pad.t}" x2="0" y2="${pad.t + iH}" stroke="#64748b" stroke-width="1.2" stroke-dasharray="3,3" opacity="0.8" style="display:none;"/>
      <line id="mtaCrosshairY" x1="${pad.l}" y1="0" x2="${W - pad.r}" y2="0" stroke="#64748b" stroke-width="1.2" stroke-dasharray="3,3" opacity="0.8" style="display:none;"/>
      <circle id="mtaCrossDotP" r="5" fill="${primColor}" stroke="#ffffff" stroke-width="2" style="display:none;"/>
      <circle id="mtaCrossDotS" r="4.5" fill="${secColor}" stroke="#ffffff" stroke-width="2" style="display:none;"/>
      
      <!-- Axis Floating Badges -->
      <g id="mtaCrossXBadge" style="display:none;">
        <rect id="mtaCrossXRect" y="${pad.t + iH + 1}" height="18" fill="#0f172a" rx="4"/>
        <text id="mtaCrossXText" y="${pad.t + iH + 13}" fill="#ffffff" font-size="10" font-weight="700" text-anchor="middle" font-family="'JetBrains Mono',monospace"></text>
      </g>
      <g id="mtaCrossYBadge" style="display:none;">
        <rect id="mtaCrossYRect" x="${pad.l - 76}" width="72" height="18" fill="#2563eb" rx="4"/>
        <text id="mtaCrossYText" x="${pad.l - 6}" fill="#ffffff" font-size="9.5" font-weight="700" text-anchor="end" font-family="'JetBrains Mono',monospace"></text>
      </g>
    </g>

    <!-- Transparent Interactive Mouse Overlay -->
    <rect class="mta-chart-hover-overlay" x="${pad.l}" y="${pad.t}" width="${iW}" height="${iH}" fill="transparent" id="mtaChartOverlay" style="cursor:crosshair;"/>
  `;

  // Attach mouse events directly via JS (avoids any HTML attribute stringify bugs)
  const overlay = document.getElementById('mtaChartOverlay');
  if (overlay) {
    overlay.onmousemove = mtaHandleChartMouseMove;
    overlay.onmouseleave = mtaHandleChartMouseLeave;
  }
}

// ── Interactive Crosshair & Tooltip Engine ─────────────────────────────────────
function mtaHandleChartMouseMove(e) {
  if (!mtaCurrentChartData) return;
  const d = mtaCurrentChartData;
  const rect = e.currentTarget.getBoundingClientRect();
  const mx   = e.clientX - rect.left;
  const my   = e.clientY - rect.top;

  const curXInPlot = mx - d.pad.l;
  if (curXInPlot < 0 || curXInPlot > d.iW) {
    mtaHandleChartMouseLeave();
    return;
  }

  const frac = Math.max(0, Math.min(1, curXInPlot / d.iW));
  const idx  = Math.round(frac * (d.n - 1));
  const item = d.filtered[idx];
  if (!item) return;

  const curX   = d.pad.l + (idx / Math.max(d.n - 1, 1)) * d.iW;
  const curY_P = d.yP(d.usePrimary[idx]);
  const curY_S = d.yS(d.useSecond[idx]);

  // Update Crosshair X & Y
  const lineX = document.getElementById('mtaCrosshairX');
  const lineY = document.getElementById('mtaCrosshairY');
  if (lineX) { lineX.setAttribute('x1', curX); lineX.setAttribute('x2', curX); lineX.style.display = 'block'; }
  if (lineY) { lineY.setAttribute('y1', my); lineY.setAttribute('y2', my); lineY.style.display = 'block'; }

  // Update Halo Dots
  const dotP = document.getElementById('mtaCrossDotP');
  const dotS = document.getElementById('mtaCrossDotS');
  if (dotP) { dotP.setAttribute('cx', curX); dotP.setAttribute('cy', curY_P); dotP.style.display = 'block'; }
  if (dotS) { dotS.setAttribute('cx', curX); dotS.setAttribute('cy', curY_S); dotS.style.display = 'block'; }

  // Update X Axis Floating Badge
  const badgeX = document.getElementById('mtaCrossXBadge');
  const textX  = document.getElementById('mtaCrossXText');
  const rectX  = document.getElementById('mtaCrossXRect');
  if (badgeX && textX && rectX) {
    textX.textContent = formatMtfDate(item.date);
    const tw = 76;
    rectX.setAttribute('x', Math.max(d.pad.l, Math.min(curX - tw / 2, d.W - d.pad.r - tw)));
    rectX.setAttribute('width', tw);
    textX.setAttribute('x', Math.max(d.pad.l + tw / 2, Math.min(curX, d.W - d.pad.r - tw / 2)));
    badgeX.style.display = 'block';
  }

  // Update Y Axis Floating Badge
  const badgeY = document.getElementById('mtaCrossYBadge');
  const textY  = document.getElementById('mtaCrossYText');
  const rectY  = document.getElementById('mtaCrossYRect');
  if (badgeY && textY && rectY) {
    textY.textContent = mtaFmtAxisVal(d.usePrimary[idx]);
    rectY.setAttribute('y', curY_P - 9);
    textY.setAttribute('y', curY_P + 4);
    badgeY.style.display = 'block';
  }

  // Update Floating Tooltip Box
  const tip = document.getElementById('mtaChartTooltip');
  if (tip) {
    tip.style.display = 'block';
    const tipW = 240;
    const leftPos = (mx + 20 + tipW > d.W) ? (mx - tipW - 16) : (mx + 20);
    tip.style.left = `${Math.max(12, leftPos)}px`;
    tip.style.top  = `${Math.max(10, Math.min(my - 30, d.H - 180))}px`;

    const netChange = (item.fresh || 0) - (item.liquid || 0);
    const isPos     = netChange >= 0;

    tip.innerHTML = `
      <div class="mta-tt-date">📅 ${formatMtfDate(item.date)}</div>
      <div class="mta-tt-row" style="color:#60a5fa;">
        <span>● NSE Book:</span>
        <strong>₹${Number(Math.round(item.nse)).toLocaleString('en-IN')} Cr</strong>
      </div>
      <div class="mta-tt-row" style="color:#34d399;">
        <span>● BSE Book:</span>
        <strong>₹${Number(Math.round(item.bse)).toLocaleString('en-IN')} Cr</strong>
      </div>
      <div class="mta-tt-row" style="color:#c084fc;">
        <span>● Combined:</span>
        <strong>₹${Number(Math.round(item.combined)).toLocaleString('en-IN')} Cr</strong>
      </div>
      <div class="mta-tt-divider"></div>
      <div class="mta-tt-row" style="color:#94a3b8;">
        <span>Fresh Exposure:</span>
        <strong style="color:#60a5fa;">₹${Number(Math.round(item.fresh || 0)).toLocaleString('en-IN')} Cr</strong>
      </div>
      <div class="mta-tt-row" style="color:#94a3b8;">
        <span>Liquidated:</span>
        <strong style="color:#f87171;">₹${Number(Math.round(item.liquid || 0)).toLocaleString('en-IN')} Cr</strong>
      </div>
      <div class="mta-tt-row" style="margin-top:4px;">
        <span style="color:#e2e8f0;font-weight:700;">Net Flow:</span>
        <strong style="color:${isPos ? '#34d399' : '#f87171'};">${isPos ? '+' : ''}₹${Number(Math.round(netChange)).toLocaleString('en-IN')} Cr</strong>
      </div>
    `;
  }
}

function mtaHandleChartMouseLeave() {
  const ids = ['mtaCrosshairX', 'mtaCrosshairY', 'mtaCrossDotP', 'mtaCrossDotS', 'mtaCrossXBadge', 'mtaCrossYBadge', 'mtaChartTooltip'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

// ── Broker Desk Tab ───────────────────────────────────────────────────────────
function mtaRenderBrokerDesk(data) {
  const brokers = (data.brokers || {}).brokers || [];
  if (!brokers.length) return;

  const totalBook = brokers.reduce((s, b) => s + (b.book_crore || b.book_lakhs/100 || 0), 0);

  // Top 3 broker cards
  const top3El = document.getElementById('mtaBrokerTop3');
  if (top3El) {
    const top3 = brokers.slice(0, 3);
    const medals = ['🥇','🥈','🥉'];
    top3El.innerHTML = top3.map((b, i) => {
      const bookCr = b.book_crore || (b.book_lakhs/100);
      const share  = totalBook > 0 ? (bookCr / totalBook * 100) : b.share_pct;
      return `<div class="mta-broker-card mta-broker-rank-${i+1}">
        <div class="mta-broker-medal">${medals[i]}</div>
        <div class="mta-broker-name">${b.name}</div>
        <div class="mta-broker-book">₹${Number(bookCr).toLocaleString('en-IN',{maximumFractionDigits:0})} Cr</div>
        <div class="mta-broker-share">${Number(share).toFixed(2)}% of disclosed book</div>
        <div class="mta-broker-bar-wrap"><div class="mta-broker-bar" style="width:${Math.min(100,share)}%;"></div></div>
      </div>`;
    }).join('');
  }

  // HHI calculation
  const sharesPct = brokers.map(b => {
    const bookCr = b.book_crore || (b.book_lakhs/100)||0;
    return totalBook > 0 ? (bookCr/totalBook)*100 : (b.share_pct||0);
  });
  const hhi = sharesPct.reduce((s, p) => s + p*p, 0);
  const top3Share = sharesPct.slice(0,3).reduce((s,p) => s+p, 0);

  const hhiEl = document.getElementById('mtaHhiScore');
  const t3El  = document.getElementById('mtaTop3Share');
  const bcEl  = document.getElementById('mtaBrokerCount');
  const hhiBadge = document.getElementById('mtaHhiBadge');

  if (hhiEl) hhiEl.textContent = Math.round(hhi);
  if (t3El)  t3El.textContent  = `${top3Share.toFixed(1)}%`;
  if (bcEl)  bcEl.textContent  = brokers.length;
  if (hhiBadge) {
    hhiBadge.textContent = hhi > 1800 ? '🔴 HIGH Concentration' : hhi > 1000 ? '🟡 MODERATE' : '🟢 LOW Concentration';
  }

  // Broker table with animated progress bars
  const tbody = document.getElementById('mtfBrokersTableBody');
  if (tbody) {
    tbody.innerHTML = brokers.map((b, idx) => {
      const bookCr = b.book_crore || (b.book_lakhs/100);
      const share  = totalBook > 0 ? (bookCr/totalBook*100) : (b.share_pct||0);
      const barW   = Math.min(100, share * 3.5);
      return `<tr>
        <td><strong style="color:${idx<3?'#d97706':'#64748b'};">#${idx+1}</strong></td>
        <td><strong style="color:#0f172a;">${b.name}</strong></td>
        <td style="text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;color:#2563eb;">₹${Number(bookCr).toLocaleString('en-IN',{maximumFractionDigits:0})}</td>
        <td>
          <div style="background:#e2e8f0;border-radius:4px;height:8px;overflow:hidden;min-width:100px;">
            <div style="width:${barW}%;background:${idx===0?'#d97706':idx===1?'#2563eb':'#16a34a'};height:100%;border-radius:4px;transition:width 0.6s ease;"></div>
          </div>
        </td>
        <td style="text-align:right;"><span class="mta-badge" style="background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;">${Number(share).toFixed(2)}%</span></td>
        <td style="text-align:center;font-size:11px;color:#64748b;font-weight:600;">${formatMtfDate(b.as_of || data.asOf)}</td>
      </tr>`;
    }).join('');
  }

  // Populate legacy broker bars (hidden) for any compat
  if (els.mtfBrokerBars) {
    els.mtfBrokerBars.innerHTML = brokers.map(b => {
      const bookCr = b.book_crore || (b.book_lakhs/100);
      return `<div>${b.name}: ₹${bookCr} Cr (${b.share_pct}%)</div>`;
    }).join('');
  }
}

// ── Global Lens Tab ────────────────────────────────────────────────────────────
function mtaRenderGlobalLens(data) {
  const globalDebt = data.globalDebt || {};
  const markets    = globalDebt.markets || [];
  if (!markets.length) return;

  // Bar chart
  const barChartEl = document.getElementById('mtaGlobalBarChart');
  if (barChartEl) {
    const maxUSD = Math.max(...markets.map(m => m.usd_bn || 0), 1);
    barChartEl.innerHTML = markets.map(m => {
      const isIndia = m.country === 'India';
      const pct     = ((m.usd_bn || 0) / maxUSD * 100).toFixed(1);
      return `<div class="mta-global-bar-row">
        <div class="mta-global-bar-label">${isIndia ? '🇮🇳 ' : ''}${m.country}</div>
        <div class="mta-global-bar-track">
          <div class="mta-global-bar-fill" style="width:${pct}%;background:${isIndia ? '#2563eb' : '#94a3b8'};"></div>
        </div>
        <div class="mta-global-bar-val" style="color:${isIndia?'#2563eb':'#475569'};">$${(m.usd_bn||0).toFixed(1)}Bn</div>
      </div>`;
    }).join('');
  }

  // Table
  const tbody = document.getElementById('mtfGlobalTableBody');
  if (tbody) {
    tbody.innerHTML = markets.map(m => {
      const isIndia = m.country === 'India';
      return `<tr style="${isIndia ? 'background:#eff6ff;font-weight:700;' : ''}">
        <td><strong>${isIndia ? '🇮🇳 ' : ''}${m.country}</strong></td>
        <td style="font-size:11.5px;color:#475569;">${m.metric||'Margin Debt'} (${m.source||''})</td>
        <td style="text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;">₹${m.inr_lakh_crore ? m.inr_lakh_crore.toFixed(2) : '—'} Lk Cr</td>
        <td style="text-align:right;font-family:'JetBrains Mono',monospace;">$${m.usd_bn ? m.usd_bn.toFixed(1) : '—'} Bn</td>
        <td style="text-align:right;">
          <span class="mta-badge" style="background:${m.debt_pct_mcap > 1.5 ? '#fef3c7' : '#f0fdf4'};color:${m.debt_pct_mcap > 1.5 ? '#92400e' : '#166534'};border:1px solid ${m.debt_pct_mcap > 1.5 ? '#fde68a' : '#bbf7d0'};">
            ${m.debt_pct_mcap ? m.debt_pct_mcap.toFixed(2) + '%' : '—'}
          </span>
        </td>
        <td style="text-align:center;font-size:11px;color:#64748b;font-weight:600;">${formatMtfDate(m.as_of || '—')}</td>
      </tr>`;
    }).join('');
  }
}

// ── Movers & Squeeze Radar Tab ───────────────────────────────────────────────
function mtaRenderMoversTab(data) {
  const movers = data.movers || {};
  const accum = movers.topAccumulationCr || [];
  const unwind = movers.topUnwindingCr || [];
  const gainers = movers.topGainersPct || [];
  const radar = movers.squeezeRadar || [];

  // 1. Top Fresh Accumulation
  const accumBody = document.getElementById('mtaMoversAccumBody');
  if (accumBody) {
    if (!accum.length) {
      accumBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:16px;">No delta data available</td></tr>';
    } else {
      accumBody.innerHTML = accum.map(s => {
        const dCr = s.deltaAmtCrore || 0;
        const dPct = s.deltaPct || 0;
        return `<tr style="cursor:pointer;" onclick="inspectStock('${s.symbol}')">
          <td><strong class="mta-sym">${s.symbol}</strong><div style="font-size:10.5px;color:#64748b;">${s.name}</div></td>
          <td style="text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;">₹${Number(s.amtFinancedCrore).toLocaleString('en-IN',{maximumFractionDigits:0})}</td>
          <td style="text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;color:#16a34a;">+₹${dCr.toFixed(1)} Cr</td>
          <td style="text-align:right;"><span class="mta-badge" style="background:#dcfce7;color:#15803d;border:1px solid #86efac;">+${dPct.toFixed(1)}%</span></td>
        </tr>`;
      }).join('');
    }
  }

  // 2. Top Margin Unwinding
  const unwindBody = document.getElementById('mtaMoversUnwindBody');
  if (unwindBody) {
    if (!unwind.length) {
      unwindBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:16px;">No deleveraging detected</td></tr>';
    } else {
      unwindBody.innerHTML = unwind.map(s => {
        const dCr = s.deltaAmtCrore || 0;
        const dPct = s.deltaPct || 0;
        return `<tr style="cursor:pointer;" onclick="inspectStock('${s.symbol}')">
          <td><strong class="mta-sym">${s.symbol}</strong><div style="font-size:10.5px;color:#64748b;">${s.name}</div></td>
          <td style="text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;">₹${Number(s.amtFinancedCrore).toLocaleString('en-IN',{maximumFractionDigits:0})}</td>
          <td style="text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;color:#dc2626;">${dCr.toFixed(1)} Cr</td>
          <td style="text-align:right;"><span class="mta-badge" style="background:#fee2e2;color:#b91c1c;border:1px solid #fca5a5;">${dPct.toFixed(1)}%</span></td>
        </tr>`;
      }).join('');
    }
  }

  // 3. Top % MTF Gainers
  const gainersBody = document.getElementById('mtaMoversGainersBody');
  if (gainersBody) {
    if (!gainers.length) {
      gainersBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:16px;">No gainers data available</td></tr>';
    } else {
      gainersBody.innerHTML = gainers.map(s => {
        const prev = s.prevAmtFinancedCrore || 0;
        const dPct = s.deltaPct || 0;
        return `<tr style="cursor:pointer;" onclick="inspectStock('${s.symbol}')">
          <td><strong class="mta-sym">${s.symbol}</strong><div style="font-size:10.5px;color:#64748b;">${s.name}</div></td>
          <td style="text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;color:#2563eb;">₹${Number(s.amtFinancedCrore).toLocaleString('en-IN',{maximumFractionDigits:0})}</td>
          <td style="text-align:right;font-family:'JetBrains Mono',monospace;color:#64748b;">₹${prev.toFixed(0)} Cr</td>
          <td style="text-align:right;"><span class="mta-badge" style="background:#eff6ff;color:#1d4ed8;border:1px solid #93c5fd;font-weight:700;">+${dPct.toFixed(1)}%</span></td>
        </tr>`;
      }).join('');
    }
  }

  // 4. Squeeze Radar
  const radarBody = document.getElementById('mtaMoversRadarBody');
  if (radarBody) {
    if (!radar.length) {
      radarBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:16px;">No squeeze alerts active</td></tr>';
    } else {
      radarBody.innerHTML = radar.map(r => {
        const badgeStyle = r.riskLevel === 'HIGH'
          ? 'background:#fee2e2;color:#b91c1c;border:1px solid #fca5a5;'
          : r.riskLevel === 'BULLISH'
            ? 'background:#dcfce7;color:#15803d;border:1px solid #86efac;'
            : 'background:#fef3c7;color:#92400e;border:1px solid #fde68a;';
        return `<tr style="cursor:pointer;" onclick="inspectStock('${r.symbol}')">
          <td><strong class="mta-sym">${r.symbol}</strong></td>
          <td><span class="mta-badge" style="${badgeStyle}">${r.riskType}</span></td>
          <td style="text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;">₹${Number(r.amtFinancedCrore).toLocaleString('en-IN',{maximumFractionDigits:0})}</td>
          <td style="font-size:11.5px;color:#475569;">${r.desc}</td>
        </tr>`;
      }).join('');
    }
  }
}

// ── Sector Breakdown Tab ─────────────────────────────────────────────────────
function mtaRenderSectorsTab(data) {
  const sectors = data.sectors || [];
  const tbody = document.getElementById('mtaSectorTableBody');
  if (!tbody) return;

  if (!sectors.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#94a3b8;padding:20px;">No sector classification available</td></tr>';
    return;
  }

  tbody.innerHTML = sectors.map((sec, idx) => {
    const barWidth = Math.min(100, Math.max(2, (sec.sharePct || 0) * 3));
    const topStockHtml = sec.topStock
      ? `<span class="mta-sym" style="cursor:pointer;color:#2563eb;" onclick="inspectStock('${sec.topStock.symbol}')">${sec.topStock.symbol}</span> <span style="font-size:11px;color:#64748b;">(₹${Math.round(sec.topStock.amtFinancedCrore)} Cr)</span>`
      : '—';

    return `<tr>
      <td style="color:#64748b;font-weight:600;">#${idx + 1}</td>
      <td><strong>${sec.sector}</strong></td>
      <td style="text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;color:#0f172a;">₹${Number(sec.amtFinancedCrore).toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr</td>
      <td>
        <div style="background:#e2e8f0;border-radius:4px;height:8px;overflow:hidden;min-width:140px;">
          <div style="width:${barWidth}%;background:#2563eb;height:100%;border-radius:4px;transition:width 0.5s ease;"></div>
        </div>
      </td>
      <td style="text-align:right;"><span class="mta-badge" style="background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;font-weight:700;">${sec.sharePct.toFixed(1)}%</span></td>
      <td style="text-align:center;font-family:'JetBrains Mono',monospace;color:#475569;">${sec.stockCount}</td>
      <td>${topStockHtml}</td>
    </tr>`;
  }).join('');
}

// ── Stock Drilldown Modal & History ──────────────────────────────────────────
let mtaCurrentModalSymbol = '';

async function inspectStock(symbol) {
  if (!symbol) return;
  mtaCurrentModalSymbol = symbol;
  const modal = document.getElementById('mtaStockModal');
  if (!modal) return;

  // Find stock in current screener
  const stock = (mtaData?.stockScreener || []).find(s => s.symbol === symbol) || {};

  // Populate header
  document.getElementById('mtaModalSymbol').textContent = symbol;
  document.getElementById('mtaModalName').textContent = stock.name || symbol;

  const exchEl = document.getElementById('mtaModalExchange');
  if (exchEl) {
    exchEl.textContent = stock.exchange || 'NSE';
    exchEl.className = 'mta-badge ' + (stock.exchange === 'BSE' ? 'mta-badge-bse' : 'mta-badge-nse');
  }

  const segEl = document.getElementById('mtaModalSegment');
  if (segEl) {
    segEl.textContent = stock.isFnO ? 'F&O' : 'Cash';
    segEl.className = 'mta-badge ' + (stock.isFnO ? 'mta-badge-fno' : 'mta-badge-cash');
  }

  const secEl = document.getElementById('mtaModalSector');
  if (secEl) {
    secEl.textContent = stock.sector || 'Equities';
  }

  // Populate stats strip
  const bookEl = document.getElementById('mtaModalBook');
  if (bookEl) bookEl.textContent = mtaCr(stock.amtFinancedCrore);

  const qtyEl = document.getElementById('mtaModalQty');
  if (qtyEl) qtyEl.textContent = Number(stock.qtyFinanced || 0).toLocaleString('en-IN');

  const estPriceEl = document.getElementById('mtaModalEstPrice');
  if (estPriceEl) {
    const est = (stock.qtyFinanced && stock.amtFinancedCrore) ? (stock.amtFinancedCrore * 1e7) / stock.qtyFinanced : 0;
    estPriceEl.textContent = est > 0 ? `₹${Number(est.toFixed(1)).toLocaleString('en-IN')}` : '—';
  }

  const shareEl = document.getElementById('mtaModalShare');
  if (shareEl) shareEl.textContent = `${mtaNum(stock.sharePct, 2)}%`;

  const deltaEl = document.getElementById('mtaModalDelta');
  if (deltaEl) {
    if (stock.deltaAmtCrore != null && !isNaN(stock.deltaAmtCrore)) {
      const isPos = stock.deltaAmtCrore >= 0;
      deltaEl.textContent = `${isPos ? '+' : ''}₹${stock.deltaAmtCrore.toFixed(1)} Cr (${isPos ? '+' : ''}${stock.deltaPct.toFixed(1)}%)`;
      deltaEl.className = 'mta-mstat-val ' + (isPos ? 'text-green' : 'text-red');
    } else {
      deltaEl.textContent = '—';
      deltaEl.className = 'mta-mstat-val';
    }
  }

  // Show modal
  modal.style.display = 'flex';

  // Fetch stock session history from backend
  const chartWrap = document.getElementById('mtaModalChartWrap');
  const histBody = document.getElementById('mtaModalHistoryTableBody');
  const countBadge = document.getElementById('mtaModalSessionsCount');

  if (chartWrap) chartWrap.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94a3b8;font-size:12px;">Loading session history…</div>';
  if (histBody) histBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:14px;">Loading session history…</td></tr>';

  try {
    const res = await fetch(`/api/mtf-stock-history?symbol=${encodeURIComponent(symbol)}`);
    const historyData = await res.json();

    if (historyData && historyData.ok && Array.isArray(historyData.history) && historyData.history.length) {
      const history = historyData.history;
      if (countBadge) countBadge.textContent = `${history.length} Sessions Available`;

      // Render History Table
      if (histBody) {
        histBody.innerHTML = history.map(h => {
          const dCr = h.deltaAmtCrore;
          const dPct = h.deltaPct;
          const hasDelta = dCr != null && !isNaN(dCr);
          const isPos = dCr >= 0;
          const deltaBadge = hasDelta
            ? `<span class="mta-badge" style="background:${isPos ? '#dcfce7' : '#fee2e2'};color:${isPos ? '#15803d' : '#b91c1c'};border:1px solid ${isPos ? '#86efac' : '#fca5a5'};font-weight:700;">${isPos ? '+' : ''}₹${dCr.toFixed(1)} Cr (${isPos ? '+' : ''}${dPct.toFixed(1)}%)</span>`
            : '<span style="color:#94a3b8;">—</span>';

          return `<tr>
            <td><strong>${h.dateFormatted || h.date}</strong></td>
            <td style="text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;color:#2563eb;">₹${Number(h.amtFinancedCrore).toLocaleString('en-IN', { maximumFractionDigits: 1 })}</td>
            <td style="text-align:right;font-family:'JetBrains Mono',monospace;">${Number(h.qtyFinanced || 0).toLocaleString('en-IN')}</td>
            <td style="text-align:right;font-family:'JetBrains Mono',monospace;">₹${Number((h.estPrice || 0).toFixed(1)).toLocaleString('en-IN')}</td>
            <td style="text-align:right;">${deltaBadge}</td>
          </tr>`;
        }).join('');
      }

      // Render SVG Line Chart (ordered chronologically oldest to newest)
      const chrono = [...history].reverse();
      mtaRenderStockTrendChart(chrono, chartWrap);
    } else {
      if (chartWrap) chartWrap.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94a3b8;font-size:12px;">No historical sessions cached for this symbol</div>';
      if (histBody) histBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:14px;">No past sessions recorded</td></tr>';
    }
  } catch (err) {
    console.error('Error fetching stock history:', err);
    if (chartWrap) chartWrap.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#ef4444;font-size:12px;">Failed to load history</div>';
  }
}

function mtaRenderStockTrendChart(records, container) {
  if (!container || !records || !records.length) return;
  const W = container.clientWidth || 660;
  const H = 160;
  const pad = { t: 16, r: 20, b: 24, l: 50 };

  const vals = records.map(r => r.amtFinancedCrore || 0);
  const minV = Math.min(...vals) * 0.96;
  const maxV = Math.max(...vals) * 1.04 || 1;
  const range = maxV - minV || 1;

  const n = records.length;
  const xFor = i => pad.l + (i / Math.max(n - 1, 1)) * (W - pad.l - pad.r);
  const yFor = v => pad.t + (1 - (v - minV) / range) * (H - pad.t - pad.b);

  const linePath = records.map((r, i) => `${i === 0 ? 'M' : 'L'}${xFor(i)},${yFor(r.amtFinancedCrore)}`).join(' ');
  const areaPath = linePath + ` L${xFor(n - 1)},${H - pad.b} L${pad.l},${H - pad.b} Z`;

  const circles = records.map((r, i) => {
    const cx = xFor(i);
    const cy = yFor(r.amtFinancedCrore);
    return `<circle cx="${cx}" cy="${cy}" r="3.5" fill="#2563eb" stroke="#ffffff" stroke-width="1.5">
      <title>${r.dateFormatted}: ₹${r.amtFinancedCrore.toFixed(1)} Cr</title>
    </circle>`;
  }).join('');

  container.innerHTML = `<svg width="${W}" height="${H}" style="display:block;overflow:visible;">
    <defs>
      <linearGradient id="mtaModalStockGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2563eb" stop-opacity="0.28"/>
        <stop offset="100%" stop-color="#2563eb" stop-opacity="0.02"/>
      </linearGradient>
    </defs>
    <!-- Background Grid Lines -->
    <line x1="${pad.l}" y1="${yFor(maxV)}" x2="${W - pad.r}" y2="${yFor(maxV)}" stroke="#f1f5f9" stroke-width="1"/>
    <line x1="${pad.l}" y1="${yFor(minV)}" x2="${W - pad.r}" y2="${yFor(minV)}" stroke="#f1f5f9" stroke-width="1"/>
    <line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#cbd5e1" stroke-width="1"/>

    <!-- Fill Area -->
    <path d="${areaPath}" fill="url(#mtaModalStockGrad)"/>
    <!-- Line -->
    <path d="${linePath}" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Session Dots -->
    ${circles}

    <!-- Labels -->
    <text x="${pad.l}" y="${H - 6}" font-size="9.5" fill="#64748b">${records[0].dateFormatted || records[0].date}</text>
    <text x="${xFor(n - 1)}" y="${H - 6}" font-size="9.5" fill="#64748b" text-anchor="end">${records[n - 1].dateFormatted || records[n - 1].date}</text>
    <text x="${pad.l - 6}" y="${yFor(maxV) + 3}" font-size="9" fill="#2563eb" text-anchor="end" font-family="'JetBrains Mono', monospace">₹${Math.round(maxV)} Cr</text>
    <text x="${pad.l - 6}" y="${yFor(minV) + 3}" font-size="9" fill="#64748b" text-anchor="end" font-family="'JetBrains Mono', monospace">₹${Math.round(minV)} Cr</text>
  </svg>`;
}

function mtaCloseStockModal() {
  const modal = document.getElementById('mtaStockModal');
  if (modal) modal.style.display = 'none';
}

// ── 1-Click Cross-Desk Jump ──────────────────────────────────────────────────
function mtaJumpToDesk(desk) {
  const sym = mtaCurrentModalSymbol;
  if (!sym) return;
  mtaCloseStockModal();

  if (desk === 'options') {
    switchTab('options');
  } else if (desk === 'delivery') {
    switchTab('delivery');
    const delivSearch = document.getElementById('delivSearchInput');
    if (delivSearch) {
      delivSearch.value = sym;
      delivSearch.dispatchEvent(new Event('input'));
    }
  }
}

// ── 1-Click CSV Export ───────────────────────────────────────────────────────
function mtaExportCsv() {
  if (!mtaData || !mtaData.stockScreener || !mtaData.stockScreener.length) {
    alert('No MTF stock screener data available to export.');
    return;
  }

  const filterMode = els.mtfStockFilter ? els.mtfStockFilter.value : 'all';
  const searchQ    = (els.mtfStockSearch ? els.mtfStockSearch.value : '').trim().toUpperCase();
  const sortMode   = els.mtfStockSort   ? els.mtfStockSort.value   : 'book';

  let list = [...mtaData.stockScreener];
  if (filterMode === 'fno')   list = list.filter(s => s.isFnO);
  else if (filterMode === 'top50') list = list.slice(0, 50);

  if (searchQ) list = list.filter(s => (s.symbol||'').toUpperCase().includes(searchQ) || (s.name||'').toUpperCase().includes(searchQ));

  if (sortMode === 'quantity') list.sort((a, b) => (b.qtyFinanced||0) - (a.qtyFinanced||0));
  else if (sortMode === 'symbol') list.sort((a, b) => String(a.symbol||'').localeCompare(String(b.symbol||'')));
  else if (sortMode === 'share') list.sort((a, b) => (b.sharePct||0) - (a.sharePct||0));
  else list.sort((a, b) => (b.amtFinancedCrore||0) - (a.amtFinancedCrore||0));

  const headers = ['Symbol', 'Company Name', 'Exchange', 'MTF Book (Cr)', 'Financed Quantity', 'Share (%)', 'Segment', 'Sector', 'Session Delta (Cr)', 'Delta %'];
  const rows = list.map(s => [
    `"${(s.symbol || '').replace(/"/g, '""')}"`,
    `"${(s.name || '').replace(/"/g, '""')}"`,
    `"${s.exchange || 'NSE'}"`,
    s.amtFinancedCrore != null ? s.amtFinancedCrore.toFixed(2) : '0',
    s.qtyFinanced || 0,
    s.sharePct != null ? s.sharePct.toFixed(2) : '0',
    s.isFnO ? 'F&O' : 'Cash',
    `"${(s.sector || 'Equities').replace(/"/g, '""')}"`,
    s.deltaAmtCrore != null ? s.deltaAmtCrore.toFixed(2) : '',
    s.deltaPct != null ? s.deltaPct.toFixed(2) : ''
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = (mtaData.stockScreenerAsOf || mtaData.asOf || 'latest').slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `MTF_Screener_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ── Wire up filter/search/sort events (called once on DOM load) ───────────────
(function mtaInitEvents() {
  // Use event delegation since els may not be populated yet at parse time
  document.addEventListener('change', function(e) {
    if (e.target.id === 'mtfStockFilter' || e.target.id === 'mtfStockSort') {
      if (mtaData) renderMtfStockTable();
    }
  });
  document.addEventListener('input', function(e) {
    if (e.target.id === 'mtfStockSearch') {
      if (mtaData) renderMtfStockTable();
    }
  });
}());

/* ==========================================================================
   📅 DYNAMIC DATE AUTO-SYNC
   ========================================================================== */
function mtaAutoSyncDates(latestIso) {
  if (!latestIso || typeof latestIso !== 'string' || latestIso.length < 10) return;
  const iso = latestIso.slice(0, 10);
  const targetIds = ['dateInput', 'endDateInput', 'mcDateInput', 'smDateInput', 'delivDateInput'];
  
  targetIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.dataset.userModified !== 'true') {
      el.value = iso;
      if (el.hasAttribute('max')) el.setAttribute('max', iso);
    }
    if (!el.dataset.listenerAttached) {
      el.dataset.listenerAttached = 'true';
      el.addEventListener('change', () => {
        el.dataset.userModified = 'true';
      });
    }
  });
}

/* ==========================================================================
   🧮 MTF MARGIN & CARRYING COST CALCULATOR
   ========================================================================== */
let mtaCalcStockOptionsPopulated = false;

function mtaInitCalculator() {
  const select = document.getElementById('mtaCalcStockSelect');
  if (select && (!mtaCalcStockOptionsPopulated || select.options.length <= 1)) {
    const stocks = (mtaData?.stockScreener || []).filter(s => s.amtFinancedCrore > 0);
    const sorted = [...stocks].sort((a, b) => (b.amtFinancedCrore || 0) - (a.amtFinancedCrore || 0));
    
    let html = '<option value="">-- Choose Stock to Pre-fill --</option>';
    sorted.slice(0, 150).forEach(s => {
      const price = (s.qtyFinanced && s.amtFinancedCrore) ? Math.round((s.amtFinancedCrore * 1e7) / s.qtyFinanced) : 0;
      html += `<option value="${s.symbol}" data-price="${price}" data-name="${s.name}">${s.symbol} (₹${price ? price.toLocaleString('en-IN') : '—'}) — Book: ₹${Math.round(s.amtFinancedCrore)} Cr</option>`;
    });
    select.innerHTML = html;
    mtaCalcStockOptionsPopulated = true;
  }
  mtaCalculateMargin();
}

function mtaOnCalcStockChange() {
  const select = document.getElementById('mtaCalcStockSelect');
  if (!select) return;
  const opt = select.selectedOptions[0];
  if (opt && opt.dataset.price && Number(opt.dataset.price) > 0) {
    const priceInput = document.getElementById('mtaCalcPrice');
    if (priceInput) priceInput.value = opt.dataset.price;
  }
  mtaCalculateMargin();
}

function mtaOnLevSliderChange() {
  const slider = document.getElementById('mtaCalcLevSlider');
  const label = document.getElementById('mtaCalcLevLabel');
  if (!slider) return;
  const lev = parseFloat(slider.value);
  const marginPct = (100 / lev).toFixed(1);
  if (label) label.textContent = `${lev.toFixed(1)}x (${marginPct}% Margin)`;
  mtaCalculateMargin();
}

function mtaOnDaysSliderChange() {
  const slider = document.getElementById('mtaCalcDaysSlider');
  const label = document.getElementById('mtaCalcDaysLabel');
  if (!slider) return;
  const days = parseInt(slider.value, 10);
  if (label) label.textContent = `${days} Days`;
  mtaCalculateMargin();
}

function mtaSetCalcDays(days) {
  const slider = document.getElementById('mtaCalcDaysSlider');
  const label = document.getElementById('mtaCalcDaysLabel');
  if (slider) slider.value = days;
  if (label) label.textContent = `${days} Days`;
  mtaCalculateMargin();
}

function mtaSetCalcRate(rate) {
  const input = document.getElementById('mtaCalcRate');
  if (input) input.value = rate;
  mtaCalculateMargin();
}

function mtaCalculateMargin() {
  const priceEl = document.getElementById('mtaCalcPrice');
  const capEl = document.getElementById('mtaCalcCapital');
  const levEl = document.getElementById('mtaCalcLevSlider');
  const daysEl = document.getElementById('mtaCalcDaysSlider');
  const rateEl = document.getElementById('mtaCalcRate');

  if (!priceEl || !capEl || !levEl || !daysEl || !rateEl) return;

  const price = Math.max(0.01, parseFloat(priceEl.value) || 1500);
  const capital = Math.max(100, parseFloat(capEl.value) || 50000);
  const lev = Math.max(1, parseFloat(levEl.value) || 4);
  const days = Math.max(1, parseInt(daysEl.value, 10) || 30);
  const ratePct = Math.max(0, parseFloat(rateEl.value) || 12.5);

  // Purchasing power & loan mathematics
  const totalPower = capital * lev;
  const shares = Math.floor(totalPower / price);
  const actualInvestment = shares * price;
  const brokerLoan = Math.max(0, actualInvestment - capital);

  // Interest carrying costs
  const dailyRate = (ratePct / 100) / 365;
  const dailyInterest = brokerLoan * dailyRate;
  const totalInterest = dailyInterest * days;
  const breakevenPct = actualInvestment > 0 ? (totalInterest / actualInvestment) * 100 : 0;

  // Margin Call & Liquidation Calculation (SEBI/Broker minimum 20% maintenance margin)
  const maintMarginPct = 0.20;
  let liqPrice = 0;
  let maxDropPct = 0;
  if (shares > 0 && (1 - maintMarginPct) > 0) {
    liqPrice = brokerLoan / ((1 - maintMarginPct) * shares);
    maxDropPct = ((liqPrice - price) / price) * 100;
  }

  // Update DOM Outputs
  const pPower = document.getElementById('mtaResTotalPower');
  const bLoan = document.getElementById('mtaResBrokerLoan');
  const sQty = document.getElementById('mtaResShares');
  const sName = document.getElementById('mtaResStockName');
  const dCost = document.getElementById('mtaResDailyCost');
  const tCost = document.getElementById('mtaResTotalInterest');
  const dSub = document.getElementById('mtaResDaysSub');
  const bPct = document.getElementById('mtaResBreakevenPct');
  const lPrice = document.getElementById('mtaResLiqPrice');
  const lDrop = document.getElementById('mtaResLiqDropPct');
  const lNote = document.getElementById('mtaResLiqPriceNote');

  if (pPower) pPower.textContent = '₹' + Math.round(actualInvestment || totalPower).toLocaleString('en-IN');
  if (bLoan) bLoan.textContent = '₹' + Math.round(brokerLoan).toLocaleString('en-IN');
  if (sQty) sQty.textContent = `${Number(shares).toLocaleString('en-IN')} Qty`;
  if (sName) sName.textContent = `Based on ₹${price.toLocaleString('en-IN')}/sh`;
  if (dCost) dCost.textContent = `₹${dailyInterest.toFixed(2)} / day`;
  if (tCost) tCost.textContent = '₹' + Math.round(totalInterest).toLocaleString('en-IN');
  if (dSub) dSub.textContent = `For ${days} days holding (${ratePct}% p.a.)`;
  if (bPct) bPct.textContent = `+${breakevenPct.toFixed(2)}%`;

  if (lPrice) lPrice.textContent = liqPrice > 0 ? `₹${liqPrice.toFixed(2)}` : '—';
  if (lDrop) lDrop.textContent = maxDropPct < 0 ? `${maxDropPct.toFixed(2)}%` : '—';
  if (lNote) lNote.textContent = liqPrice > 0 ? `₹${liqPrice.toFixed(2)}` : 'liquidation trigger';
}

/* ==========================================================================
   ⚖️ 2-STOCK HEAD-TO-HEAD COMPARE DESK
   ========================================================================== */
function mtaInitCompareDesk() {
  mtaRunStockComparison();
}

function mtaPresetCompare(symA, symB) {
  const inA = document.getElementById('mtaCompSymA');
  const inB = document.getElementById('mtaCompSymB');
  if (inA) inA.value = symA;
  if (inB) inB.value = symB;
  mtaRunStockComparison();
}

async function mtaRunStockComparison() {
  const inA = document.getElementById('mtaCompSymA');
  const inB = document.getElementById('mtaCompSymB');
  const symA = (inA?.value || 'RELIANCE').trim().toUpperCase();
  const symB = (inB?.value || 'TATASTEEL').trim().toUpperCase();

  const screener = mtaData?.stockScreener || [];
  const stockA = screener.find(s => s.symbol === symA) || { symbol: symA, name: symA };
  const stockB = screener.find(s => s.symbol === symB) || { symbol: symB, name: symB };

  // Update Headers
  const hA = document.getElementById('mtaCompCardSymA');
  const hB = document.getElementById('mtaCompCardSymB');
  if (hA) hA.textContent = symA;
  if (hB) hB.textContent = symB;

  const legA = document.getElementById('mtaCompLegendA');
  const legB = document.getElementById('mtaCompLegendB');
  if (legA) legA.textContent = symA;
  if (legB) legB.textContent = symB;

  // Render Metric Details
  const renderMetrics = (stock) => {
    const book = stock.amtFinancedCrore ? `₹${Number(stock.amtFinancedCrore).toLocaleString('en-IN', { maximumFractionDigits: 1 })} Cr` : '—';
    const qty = stock.qtyFinanced ? Number(stock.qtyFinanced).toLocaleString('en-IN') : '—';
    const debtPerSh = (stock.qtyFinanced && stock.amtFinancedCrore) ? `₹${Math.round((stock.amtFinancedCrore * 1e7) / stock.qtyFinanced).toLocaleString('en-IN')}` : '—';
    const share = stock.sharePct != null ? `${stock.sharePct.toFixed(2)}%` : '—';
    const delta = stock.deltaAmtCrore != null ? `${stock.deltaAmtCrore >= 0 ? '+' : ''}₹${stock.deltaAmtCrore.toFixed(1)} Cr (${stock.deltaPct >= 0 ? '+' : ''}${stock.deltaPct.toFixed(1)}%)` : '—';
    const seg = stock.isFnO ? 'F&O Listed' : 'Cash Market';
    const cls = stock._cls || 'UNCLASSIFIED';

    return `<table class="mta-table" style="font-size:11.5px;margin:0;">
      <tbody>
        <tr><td style="color:var(--text-muted);width:45%;">Company Name</td><td><strong>${stock.name || stock.symbol}</strong></td></tr>
        <tr><td style="color:var(--text-muted);">Current MTF Book</td><td style="font-family:'JetBrains Mono',monospace;font-weight:700;color:#2563eb;">${book}</td></tr>
        <tr><td style="color:var(--text-muted);">Market Share %</td><td style="font-weight:700;">${share}</td></tr>
        <tr><td style="color:var(--text-muted);">Financed Quantity</td><td style="font-family:'JetBrains Mono',monospace;">${qty}</td></tr>
        <tr><td style="color:var(--text-muted);">Debt / Share</td><td style="font-family:'JetBrains Mono',monospace;">${debtPerSh}</td></tr>
        <tr><td style="color:var(--text-muted);">Session Delta</td><td style="font-weight:700;">${delta}</td></tr>
        <tr><td style="color:var(--text-muted);">Market Segment</td><td>${seg}</td></tr>
        <tr><td style="color:var(--text-muted);">Profile Class</td><td><span class="mta-badge" style="background:#eff6ff;color:#1e40af;font-size:10px;">${cls}</span></td></tr>
      </tbody>
    </table>`;
  };

  const mA = document.getElementById('mtaCompMetricsA');
  const mB = document.getElementById('mtaCompMetricsB');
  if (mA) mA.innerHTML = renderMetrics(stockA);
  if (mB) mB.innerHTML = renderMetrics(stockB);

  // Fetch session histories for dual line comparison
  const chartBox = document.getElementById('mtaCompareChartContainer');
  if (chartBox) chartBox.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:12px;">Fetching multi-session histories for both stocks…</div>';

  try {
    const [resA, resB] = await Promise.all([
      fetch(`/api/mtf-stock-history?symbol=${encodeURIComponent(symA)}`).then(r => r.json()).catch(() => null),
      fetch(`/api/mtf-stock-history?symbol=${encodeURIComponent(symB)}`).then(r => r.json()).catch(() => null)
    ]);

    const histA = (resA && resA.ok && Array.isArray(resA.history)) ? [...resA.history].reverse() : [];
    const histB = (resB && resB.ok && Array.isArray(resB.history)) ? [...resB.history].reverse() : [];

    if (histA.length || histB.length) {
      mtaRenderCompareChart(histA, histB, symA, symB);
    } else {
      if (chartBox) chartBox.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:12px;">Historical session records not available for chosen symbols</div>';
    }
  } catch (err) {
    console.error('Compare fetch error:', err);
    if (chartBox) chartBox.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#ef4444;font-size:12px;">Failed to load comparison chart</div>';
  }
}

function mtaRenderCompareChart(histA, histB, symA, symB) {
  const container = document.getElementById('mtaCompareChartContainer');
  if (!container) return;

  const W = container.clientWidth || 740;
  const H = 240;
  const pad = { t: 20, r: 24, b: 32, l: 60 };

  // Calculate normalized percentage growth from session 0 for fair overlay
  const normA = histA.map((h, i, arr) => {
    const base = arr[0].amtFinancedCrore || 1;
    return { date: h.dateFormatted || h.date, pct: ((h.amtFinancedCrore - base) / base) * 100, cr: h.amtFinancedCrore };
  });

  const normB = histB.map((h, i, arr) => {
    const base = arr[0].amtFinancedCrore || 1;
    return { date: h.dateFormatted || h.date, pct: ((h.amtFinancedCrore - base) / base) * 100, cr: h.amtFinancedCrore };
  });

  const allPcts = [...normA.map(d => d.pct), ...normB.map(d => d.pct)];
  const minPct = Math.min(...allPcts, 0) - 2;
  const maxPct = Math.max(...allPcts, 2) + 2;
  const range = Math.max(1, maxPct - minPct);

  const maxLen = Math.max(normA.length, normB.length, 1);
  const xS = (i, total) => pad.l + (i / Math.max(total - 1, 1)) * (W - pad.l - pad.r);
  const yS = pct => pad.t + (1 - (pct - minPct) / range) * (H - pad.t - pad.b);
  const zeroY = yS(0);

  const pathA = normA.map((d, i) => `${i === 0 ? 'M' : 'L'}${xS(i, normA.length).toFixed(1)},${yS(d.pct).toFixed(1)}`).join(' ');
  const pathB = normB.map((d, i) => `${i === 0 ? 'M' : 'L'}${xS(i, normB.length).toFixed(1)},${yS(d.pct).toFixed(1)}`).join(' ');

  const dotsA = normA.map((d, i) => `<circle cx="${xS(i, normA.length).toFixed(1)}" cy="${yS(d.pct).toFixed(1)}" r="3" fill="#2563eb"><title>${symA} (${d.date}): ${d.pct >= 0 ? '+' : ''}${d.pct.toFixed(1)}% (₹${Math.round(d.cr)} Cr)</title></circle>`).join('');
  const dotsB = normB.map((d, i) => `<circle cx="${xS(i, normB.length).toFixed(1)}" cy="${yS(d.pct).toFixed(1)}" r="3" fill="#16a34a"><title>${symB} (${d.date}): ${d.pct >= 0 ? '+' : ''}${d.pct.toFixed(1)}% (₹${Math.round(d.cr)} Cr)</title></circle>`).join('');

  container.innerHTML = `<svg width="${W}" height="${H}" style="display:block;overflow:visible;">
    <!-- Baseline 0% line -->
    <line x1="${pad.l}" y1="${zeroY.toFixed(1)}" x2="${W - pad.r}" y2="${zeroY.toFixed(1)}" stroke="#cbd5e1" stroke-width="1.2" stroke-dasharray="3,3"/>
    
    <!-- Paths -->
    ${pathA ? `<path d="${pathA}" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round"/>` : ''}
    ${pathB ? `<path d="${pathB}" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round"/>` : ''}
    
    ${dotsA}
    ${dotsB}

    <!-- Y Axis Labels -->
    <text x="${pad.l - 8}" y="${yS(maxPct) + 4}" font-size="9" fill="#2563eb" text-anchor="end" font-family="'JetBrains Mono', monospace">+${maxPct.toFixed(0)}%</text>
    <text x="${pad.l - 8}" y="${zeroY + 3}" font-size="9" fill="#64748b" text-anchor="end" font-family="'JetBrains Mono', monospace">0%</text>
    <text x="${pad.l - 8}" y="${yS(minPct) + 4}" font-size="9" fill="#dc2626" text-anchor="end" font-family="'JetBrains Mono', monospace">${minPct.toFixed(0)}%</text>
    
    <!-- Footnote -->
    <text x="${W / 2}" y="${H - 8}" font-size="9.5" fill="#64748b" text-anchor="middle">Sessions Progression (Normalized % growth from first session)</text>
  </svg>`;
}

/* ==========================================================================
   🎯 LEVERAGE VULNERABILITY / FRAGILITY RADAR
   ========================================================================== */
let mtaFragilityFilter = 'ALL';

function mtaRenderFragilityRadar(data) {
  const stocks = data?.stockScreener || [];
  const tbody = document.getElementById('mtaFragilityTableBody');
  if (!tbody || !stocks.length) return;

  // Compute fragility score for each stock
  const scored = stocks.map(s => {
    const book = s.amtFinancedCrore || 0;
    const share = s.sharePct || 0;
    const estPrice = (s.qtyFinanced && book) ? (book * 1e7) / s.qtyFinanced : 0;
    const deltaCr = s.deltaAmtCrore || 0;

    // Quantitative Fragility Formulation:
    // 1. Book concentration weight (up to 35 pts)
    const concWeight = Math.min(35, share * 12);
    // 2. Retail/Speculative profile penalty (up to 30 pts)
    const retailPenalty = (s._cls === 'SPECULATIVE') ? 30 : (s._cls === 'RETAIL HEAVY') ? 22 : (s.isFnO ? 10 : 5);
    // 3. Price elasticity / low price ticket risk (up to 20 pts)
    const ticketRisk = (estPrice > 0 && estPrice < 100) ? 20 : (estPrice < 300) ? 12 : 4;
    // 4. Deleverage velocity (recent outflow delta) (up to 15 pts)
    const velocityRisk = deltaCr < 0 ? Math.min(15, Math.abs(deltaCr) * 2) : 0;

    const totalScore = Math.min(99, Math.max(8, Math.round(concWeight + retailPenalty + ticketRisk + velocityRisk)));
    
    let rating = 'STABLE';
    let badgeClass = 'mta-badge';
    let badgeStyle = 'background:#dcfce7;color:#15803d;border:1px solid #86efac;';
    let riskNote = 'Institutional anchor; stable balance sheet support.';

    if (totalScore >= 70) {
      rating = 'HIGH';
      badgeStyle = 'background:#fee2e2;color:#b91c1c;border:1px solid #fca5a5;';
      riskNote = '🚨 Overleveraged retail cluster; high cascade liquidation vulnerability.';
    } else if (totalScore >= 40) {
      rating = 'MODERATE';
      badgeStyle = 'background:#fef3c7;color:#92400e;border:1px solid #fde68a;';
      riskNote = '⚠️ Elevated leverage; susceptible during broad market pullbacks.';
    }

    return {
      ...s,
      estPrice,
      fragilityScore: totalScore,
      rating,
      badgeStyle,
      riskNote
    };
  });

  // Update pill counts
  const countAll = scored.length;
  const countHigh = scored.filter(s => s.rating === 'HIGH').length;
  const countMod = scored.filter(s => s.rating === 'MODERATE').length;
  const countSafe = scored.filter(s => s.rating === 'STABLE').length;

  const elAll = document.getElementById('mtaFragCountAll');
  const elHigh = document.getElementById('mtaFragCountHigh');
  const elMod = document.getElementById('mtaFragCountMod');
  const elSafe = document.getElementById('mtaFragCountSafe');

  if (elAll) elAll.textContent = countAll;
  if (elHigh) elHigh.textContent = countHigh;
  if (elMod) elMod.textContent = countMod;
  if (elSafe) elSafe.textContent = countSafe;

  // Filter list
  let filtered = [...scored].sort((a, b) => b.fragilityScore - a.fragilityScore);
  if (mtaFragilityFilter !== 'ALL') {
    filtered = filtered.filter(s => s.rating === mtaFragilityFilter);
  }

  tbody.innerHTML = filtered.slice(0, 150).map((s, idx) => {
    const barColor = s.rating === 'HIGH' ? '#dc2626' : s.rating === 'MODERATE' ? '#d97706' : '#16a34a';
    return `<tr style="cursor:pointer;" onclick="inspectStock('${s.symbol}')">
      <td style="color:var(--text-muted);font-weight:600;">#${idx + 1}</td>
      <td><strong class="mta-sym">${s.symbol}</strong></td>
      <td style="font-size:11.5px;color:var(--text-secondary);">${s.name}</td>
      <td style="text-align:right;font-family:'JetBrains Mono',monospace;font-weight:700;">₹${Number(s.amtFinancedCrore).toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr</td>
      <td style="text-align:right;font-family:'JetBrains Mono',monospace;">${Number(s.qtyFinanced || 0).toLocaleString('en-IN')}</td>
      <td style="text-align:right;font-family:'JetBrains Mono',monospace;">${s.estPrice > 0 ? '₹' + Math.round(s.estPrice).toLocaleString('en-IN') : '—'}</td>
      <td style="text-align:center;"><span class="mta-badge" style="${s.badgeStyle}">${s.rating} RISK</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="background:var(--border-default);border-radius:4px;height:7px;flex:1;overflow:hidden;">
            <div style="width:${s.fragilityScore}%;background:${barColor};height:100%;"></div>
          </div>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:11px;color:${barColor};width:24px;">${s.fragilityScore}</span>
        </div>
      </td>
      <td style="font-size:11px;color:var(--text-muted);">${s.riskNote}</td>
    </tr>`;
  }).join('');
}

function mtaFilterFragility(mode) {
  mtaFragilityFilter = mode;
  document.querySelectorAll('#mtaPanel-fragility .mta-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.frag === mode);
  });
  if (mtaData) mtaRenderFragilityRadar(mtaData);
}

/* ==========================================================================
   🎨 UNIFIED THEME (DARK / LIGHT) CONTROLLER
   ========================================================================== */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  document.body.setAttribute('data-theme', next);
  localStorage.setItem('breadth_theme', next);
  const btn = document.getElementById('themeToggleBtn');
  if (btn) btn.textContent = next === 'dark' ? '☀️ Light' : '🌙 Dark';

  // Re-render chart desks to match theme
  if (mtaActiveSubTab === 'trend' && typeof mtaRenderTrendChart === 'function') {
    mtaRenderTrendChart();
  }
}

// Auto-restore saved theme on startup
(function initTheme() {
  const saved = localStorage.getItem('breadth_theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.setAttribute('data-theme', 'dark');
    window.addEventListener('DOMContentLoaded', () => {
      const btn = document.getElementById('themeToggleBtn');
      if (btn) btn.textContent = '☀️ Light';
    });
  }
})();

function switchTab(tab) {
  [els.tabBreadth, els.tabOptions, els.tabSmartMoney, els.tabDelivery, els.tabMtf, els.tabTools, els.tabSettings].forEach(el => el && el.classList.remove("active"));
  [els.panelBreadth, els.panelOptions, els.panelSmartMoney, els.panelDelivery, els.panelMtf, els.panelTools, els.panelSettings].forEach(el => {
    if (el) {
      el.classList.remove("active");
      el.style.display = "none";
    }
  });
  if (tab === "breadth") {
    isOptionsTabActive = false;
    els.tabBreadth.classList.add("active");
    els.panelBreadth.classList.add("active");
    els.panelBreadth.style.display = "block";
    resizeCanvas();
    resizeNiftyCanvas();
    resizeNiftyAdCanvas();
    resizeAdCanvases();
  } else if (tab === "options") {
    isOptionsTabActive = true;
    els.tabOptions.classList.add("active");
    els.panelOptions.classList.add("active");
    els.panelOptions.style.display = "block";
    resizeOptCanvases();
    resetAutoRefreshTimer();
    loadOptionChain();
  } else if (tab === "smartMoney") {
    isOptionsTabActive = false;
    els.tabSmartMoney.classList.add("active");
    els.panelSmartMoney.classList.add("active");
    els.panelSmartMoney.style.display = "block";
    loadSmartMoneyData();
  } else if (tab === "delivery") {
    isOptionsTabActive = false;
    els.tabDelivery.classList.add("active");
    els.panelDelivery.classList.add("active");
    els.panelDelivery.style.display = "block";
    loadDeliveryAnalytics();
  } else if (tab === "mtf") {
    isOptionsTabActive = false;
    if (els.tabMtf) els.tabMtf.classList.add("active");
    if (els.panelMtf) {
      els.panelMtf.classList.add("active");
      els.panelMtf.style.display = "block";
    }
    loadMtfData();
  } else if (tab === "tools") {
    isOptionsTabActive = false;
    if (els.tabTools) els.tabTools.classList.add("active");
    if (els.panelTools) {
      els.panelTools.classList.add("active");
      els.panelTools.style.display = "block";
    }
    if (typeof loadActiveTool === "function") {
      loadActiveTool();
    }
  } else if (tab === "settings") {
    isOptionsTabActive = false;
    if (els.tabSettings) els.tabSettings.classList.add("active");
    if (els.panelSettings) {
      els.panelSettings.classList.add("active");
      els.panelSettings.style.display = "block";
    }
    if (typeof loadBrokerSettings === "function") {
      loadBrokerSettings();
    }
  }
}

/* ==========================================================================
   ⚡ Quant Options Desk & Intraday Straddle Engine Implementation
   ========================================================================== */
let straddleDataGlobal = null;
let selectedStraddleStrike = null;
let selectedStraddleDays = 1;
let straddleChartGeometry = null;
let straddleHoverIndex = null;

function renderQuantStraddleDesk(data) {
  if (!data || !data.strikes) return;
  straddleDataGlobal = data;

  if (data.straddleDays) {
    selectedStraddleDays = Number(data.straddleDays) || 1;
  }
  document.querySelectorAll("#straddleTfGroup .straddle-tf-btn").forEach(btn => {
    btn.classList.toggle("active", Number(btn.dataset.days) === Number(selectedStraddleDays));
  });

  const strikes = data.strikes || {};
  const atmStrike = data.atmStrike;
  if (!selectedStraddleStrike || (!strikes[selectedStraddleStrike] && !strikes[String(selectedStraddleStrike)])) {
    selectedStraddleStrike = atmStrike;
  }

  // 1. Render Strike Selector Chips
  if (els.straddleStrikeChips) {
    els.straddleStrikeChips.innerHTML = "";
    const chips = data.strikeChips || [];
    chips.forEach(chip => {
      const btn = document.createElement("button");
      btn.type = "button";
      const isChipActive = Number(chip.strike) === Number(selectedStraddleStrike);
      btn.className = `strike-chip-btn ${isChipActive ? "active" : ""}`;
      
      // Cross-match chip currentPremium with optChainDataGlobal if available
      let chipPrem = chip.currentPremium;
      if (optChainDataGlobal && optChainDataGlobal.length) {
        const m = optChainDataGlobal.find(r => Number(r.strike) === Number(chip.strike));
        if (m && m.call && m.put) {
          const s = (Number(m.call.ltp) || 0) + (Number(m.put.ltp) || 0);
          if (s > 0) chipPrem = Math.round(s * 100) / 100;
        }
      }
      btn.textContent = chip.label;
      btn.title = `Straddle LTP: ₹${number(chipPrem, 2)} (${signedNumber(chip.decayPct, "%")})`;
      btn.addEventListener("click", () => {
        selectedStraddleStrike = chip.strike;
        renderQuantStraddleDesk(straddleDataGlobal);
      });
      els.straddleStrikeChips.appendChild(btn);
    });
  }

  // 2. Extract Data for Currently Selected Strike
  const strikeInfo = strikes[String(selectedStraddleStrike)] || strikes[selectedStraddleStrike] || strikes[String(atmStrike)] || strikes[atmStrike] || {};
  const isAtm = strikeInfo.isAtm || Number(selectedStraddleStrike) === Number(atmStrike);

  // Cross-verify currently selected strike with optChainDataGlobal for 100% precision
  if (optChainDataGlobal && optChainDataGlobal.length) {
    const chainMatch = optChainDataGlobal.find(r => Number(r.strike) === Number(selectedStraddleStrike));
    if (chainMatch && chainMatch.call && chainMatch.put) {
      const cL = Number(chainMatch.call.ltp) || 0;
      const pL = Number(chainMatch.put.ltp) || 0;
      const realSum = Math.round((cL + pL) * 100) / 100;
      if (realSum > 0) {
        strikeInfo.currentPremium = realSum;
        strikeInfo.upperBe = Math.round((Number(selectedStraddleStrike) + realSum) * 100) / 100;
        strikeInfo.lowerBe = Math.round((Number(selectedStraddleStrike) - realSum) * 100) / 100;
        if (strikeInfo.timeline && strikeInfo.timeline.length) {
          const lastPt = strikeInfo.timeline[strikeInfo.timeline.length - 1];
          lastPt.straddle = realSum;
          lastPt.call = cL;
          lastPt.put = pL;
        }
      }
    }
  }

  if (els.straddleChartTitle) {
    const indexName = (els.optIndexSelect && els.optIndexSelect.options[els.optIndexSelect.selectedIndex]?.textContent) || "NIFTY";
    const tfLabel = selectedStraddleDays > 1 ? ` (${selectedStraddleDays}D Multi-Day)` : " (Intraday)";
    els.straddleChartTitle.textContent = `${indexName} ${selectedStraddleStrike} Straddle Curve ${isAtm ? "(ATM)" : ""}${tfLabel}`;
  }

  // Update Summary KPI Ribbon
  if (els.strdStrikeVal) els.strdStrikeVal.textContent = `${selectedStraddleStrike} ${isAtm ? "(ATM)" : ""}`;
  if (els.strdOpenVal) els.strdOpenVal.textContent = strikeInfo.openPremium ? `₹${number(strikeInfo.openPremium, 2)}` : "--";
  if (els.strdCurrVal) els.strdCurrVal.textContent = strikeInfo.currentPremium ? `₹${number(strikeInfo.currentPremium, 2)}` : "--";
  
  if (els.strdDecayVal) {
    const pts = strikeInfo.decayPts || 0;
    const pct = strikeInfo.decayPct || 0;
    els.strdDecayVal.textContent = `${signedNumber(pts)} (${signedNumber(pct, "%")})`;
    // Negative points means theta decay (premium shrunk)
    els.strdDecayVal.className = pts < 0 ? "change-pos" : (pts > 0 ? "change-neg" : "change-zero");
  }

  if (els.strdBeRange) {
    if (strikeInfo.lowerBe && strikeInfo.upperBe) {
      els.strdBeRange.textContent = `${number(strikeInfo.lowerBe, 0)} – ${number(strikeInfo.upperBe, 0)}`;
    } else {
      els.strdBeRange.textContent = "--";
    }
  }

  if (els.strdDiffVal) {
    const lastPt = (strikeInfo.timeline && strikeInfo.timeline.length) ? strikeInfo.timeline[strikeInfo.timeline.length - 1] : null;
    let diff = strikeInfo.callPutDiff;
    if (diff == null && lastPt && lastPt.call != null && lastPt.put != null) {
      diff = Math.round((lastPt.call - lastPt.put) * 100) / 100;
    }
    if (diff != null) {
      els.strdDiffVal.textContent = `${signedNumber(diff)}`;
      els.strdDiffVal.className = diff > 0 ? "change-pos" : (diff < 0 ? "change-neg" : "change-zero");
    } else {
      els.strdDiffVal.textContent = "--";
      els.strdDiffVal.className = "";
    }
  }

  if (els.strdRegimeBadge) {
    const decayPct = strikeInfo.decayPct || 0;
    if (decayPct <= -4.0) {
      els.strdRegimeBadge.className = "regime-pill decay";
      els.strdRegimeBadge.textContent = "⚡ Theta Decay (Sellers Edge)";
    } else if (decayPct >= 5.0) {
      els.strdRegimeBadge.className = "regime-pill expansion";
      els.strdRegimeBadge.textContent = "🔥 Vol Expansion (Breakout)";
    } else {
      els.strdRegimeBadge.className = "regime-pill neutral";
      els.strdRegimeBadge.textContent = "⚖️ Neutral / Range-Bound";
    }
  }

  // Update Quant Greeks Matrix
  const greeks = strikeInfo.greeks || {};
  if (els.qDeltaVal) {
    const d = greeks.delta;
    els.qDeltaVal.textContent = d !== undefined ? signedNumber(d) : "--";
    els.qDeltaVal.className = `greek-val ${d > 0.05 ? "change-pos" : (d < -0.05 ? "change-neg" : "")}`;
  }
  if (els.qDeltaSub) {
    const cd = greeks.callDelta !== undefined ? number(greeks.callDelta, 2) : "--";
    const pd = greeks.putDelta !== undefined ? number(greeks.putDelta, 2) : "--";
    els.qDeltaSub.textContent = `CE Δ: ${cd} | PE Δ: ${pd}`;
  }

  if (els.qGammaVal) els.qGammaVal.textContent = greeks.gamma !== undefined ? Number(greeks.gamma).toFixed(5) : "--";
  if (els.qGammaSub) {
    const gammaRisk = (greeks.gamma || 0) > 0.002 ? "High Acceleration" : "Normal";
    els.qGammaSub.textContent = `Risk: ${gammaRisk}`;
  }

  if (els.qThetaVal) {
    const th = greeks.theta !== undefined ? number(greeks.theta, 2) : "--";
    els.qThetaVal.textContent = `₹${th} / day`;
  }
  if (els.qThetaSub) {
    const perHr = (greeks.theta || 0) / 6.25;
    els.qThetaSub.textContent = `~ ₹${number(perHr, 2)} / hr decay`;
  }

  if (els.qVegaVal) els.qVegaVal.textContent = greeks.vega !== undefined ? `₹${number(greeks.vega, 2)}` : "--";
  if (els.qVegaSub) els.qVegaSub.textContent = `IV sensitivity per 1% pt`;

  if (els.qExpectedMoveVal) {
    const em = strikeInfo.expectedMove || (strikeInfo.currentPremium ? strikeInfo.currentPremium * 0.85 : 0);
    els.qExpectedMoveVal.textContent = `± ₹${number(em, 1)}`;
  }
  if (els.qExpectedMoveSub && strikeInfo.lowerBe && strikeInfo.upperBe) {
    els.qExpectedMoveSub.textContent = `Cone: [${number(strikeInfo.lowerBe, 0)} – ${number(strikeInfo.upperBe, 0)}]`;
  }

  // Draw Straddle Chart
  resizeOptCanvases();
}

function drawStraddleChart() {
  const canvas = els.straddleCanvas;
  if (!canvas || !straddleDataGlobal) return;
  const ctx = canvas.getContext("2d");
  const scale = window.devicePixelRatio || 1;

  const rect = canvas.getBoundingClientRect();
  const w = rect.width > 50 ? rect.width : (canvas.parentElement?.clientWidth || 800);
  const h = rect.height > 50 ? rect.height : 280;
  if (canvas.width !== Math.round(w * scale) || canvas.height !== Math.round(h * scale)) {
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
  }
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const width = canvas.width / scale;
  const height = canvas.height / scale;
  straddleChartGeometry = null;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0c121e";
  ctx.fillRect(0, 0, width, height);

  const strikes = straddleDataGlobal.strikes || {};
  const currentStrikeData = strikes[String(selectedStraddleStrike)] || strikes[selectedStraddleStrike] || strikes[String(straddleDataGlobal.atmStrike)] || strikes[straddleDataGlobal.atmStrike];
  if (!currentStrikeData || !currentStrikeData.timeline || !currentStrikeData.timeline.length) {
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillText("No Straddle intraday timeline data", width / 2, height / 2);
    return;
  }

  const timeline = currentStrikeData.timeline;
  const pad = { left: 55, right: 20, top: 18, bottom: 25 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  // Determine active lines
  const showStraddle = els.toggleStraddleLine ? els.toggleStraddleLine.checked : true;
  const showCall = els.toggleCallLine ? els.toggleCallLine.checked : true;
  const showPut = els.togglePutLine ? els.togglePutLine.checked : true;
  const showDiff = els.toggleDiffLine ? els.toggleDiffLine.checked : true;
  const showVwap = els.toggleVwapLine ? els.toggleVwapLine.checked : true;

  // Min and Max values for Y-axis scaling
  let vals = [];
  timeline.forEach(pt => {
    if (showStraddle && pt.straddle != null) vals.push(pt.straddle);
    if (showCall && pt.call != null) vals.push(pt.call);
    if (showPut && pt.put != null) vals.push(pt.put);
    const d = pt.diff != null ? pt.diff : ((pt.call != null && pt.put != null) ? (pt.call - pt.put) : null);
    if (showDiff && d != null) vals.push(d);
    if (showVwap && pt.vwap != null) vals.push(pt.vwap);
  });
  if (!vals.length) {
    timeline.forEach(pt => { if (pt.straddle != null) vals.push(pt.straddle); });
  }

  let minVal = Math.min(...vals);
  let maxVal = Math.max(...vals);
  if (minVal === maxVal) { minVal -= 10; maxVal += 10; }
  const buffer = (maxVal - minVal) * 0.08;
  if (!showDiff && minVal >= 0) {
    minVal = Math.max(0, minVal - buffer);
  } else {
    minVal = minVal - buffer;
  }
  maxVal += buffer;

  const xFor = (idx) => pad.left + (idx / Math.max(1, timeline.length - 1)) * plotW;
  const yFor = (val) => pad.top + plotH - ((val - minVal) / (maxVal - minVal)) * plotH;

  straddleChartGeometry = { pad, plotW, plotH, width, height, timeline, minVal, maxVal, xFor, yFor, currentStrikeData };

  // Draw Horizontal Gridlines & Y-Axis Labels
  ctx.strokeStyle = "#1e293d";
  ctx.lineWidth = 0.8;
  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px 'JetBrains Mono', monospace";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  const numGridLines = 5;
  for (let i = 0; i <= numGridLines; i++) {
    const val = minVal + (i / numGridLines) * (maxVal - minVal);
    const y = yFor(val);
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillText(`₹${number(val, 1)}`, pad.left - 6, y);
  }
  ctx.setLineDash([]);

  // Draw ₹0 Zero Line if chart crosses positive and negative territory
  if (minVal <= 0 && maxVal >= 0) {
    const zeroY = yFor(0);
    ctx.save();
    ctx.strokeStyle = "rgba(100, 116, 139, 0.45)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 2]);
    ctx.beginPath();
    ctx.moveTo(pad.left, zeroY);
    ctx.lineTo(width - pad.right, zeroY);
    ctx.stroke();
    ctx.fillStyle = "#94a3b8";
    ctx.font = "9px 'JetBrains Mono', monospace";
    ctx.textAlign = "right";
    ctx.fillText("₹0 (Zero Line)", width - pad.right - 4, zeroY - 3);
    ctx.restore();
  }

  // Draw Multi-Day Session Separator Lines
  if (selectedStraddleDays > 1) {
    ctx.save();
    ctx.strokeStyle = "rgba(148, 163, 184, 0.45)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    timeline.forEach((pt, idx) => {
      if (idx > 0 && pt.isNewDay) {
        const dx = xFor(idx);
        ctx.beginPath();
        ctx.moveTo(dx, pad.top);
        ctx.lineTo(dx, pad.top + plotH);
        ctx.stroke();

        if (pt.date) {
          ctx.fillStyle = "#2563eb";
          ctx.font = "bold 9.5px 'JetBrains Mono', monospace";
          ctx.textAlign = "left";
          ctx.fillText(pt.date, dx + 4, pad.top + 11);
        }
      }
    });
    ctx.restore();
  }

  // Draw Straddle Area Gradient & Line
  if (showStraddle) {
    ctx.beginPath();
    let started = false;
    timeline.forEach((pt, i) => {
      if (pt.straddle == null) return;
      const x = xFor(i);
      const y = yFor(pt.straddle);
      if (!started) { ctx.moveTo(x, pad.top + plotH); ctx.lineTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    });
    if (started) {
      ctx.lineTo(xFor(timeline.length - 1), pad.top + plotH);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + plotH);
      grad.addColorStop(0, "rgba(124, 58, 237, 0.15)");
      grad.addColorStop(1, "rgba(124, 58, 237, 0.01)");
      ctx.fillStyle = grad;
      ctx.fill();
    }

    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    started = false;
    timeline.forEach((pt, i) => {
      if (pt.straddle == null) return;
      const x = xFor(i);
      const y = yFor(pt.straddle);
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    });
    if (started) ctx.stroke();
  }

  // Draw VWAP Line
  if (showVwap) {
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 1.6;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    let started = false;
    timeline.forEach((pt, i) => {
      if (pt.vwap == null) return;
      const x = xFor(i);
      const y = yFor(pt.vwap);
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    });
    if (started) ctx.stroke();
    ctx.setLineDash([]);
  }

  // Draw Call Line
  if (showCall) {
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    let started = false;
    timeline.forEach((pt, i) => {
      if (pt.call == null) return;
      const x = xFor(i);
      const y = yFor(pt.call);
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    });
    if (started) ctx.stroke();
  }

  // Draw Put Line
  if (showPut) {
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    let started = false;
    timeline.forEach((pt, i) => {
      if (pt.put == null) return;
      const x = xFor(i);
      const y = yFor(pt.put);
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    });
    if (started) ctx.stroke();
  }

  // Draw Call - Put Diff Line
  if (showDiff) {
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    let started = false;
    timeline.forEach((pt, i) => {
      const d = pt.diff != null ? pt.diff : ((pt.call != null && pt.put != null) ? (pt.call - pt.put) : null);
      if (d == null) return;
      const x = xFor(i);
      const y = yFor(d);
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    });
    if (started) ctx.stroke();
  }

  // Time labels
  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px 'JetBrains Mono', monospace";
  ctx.textBaseline = "top";
  
  const getPointLabel = (pt) => {
    if (!pt) return "--";
    if (selectedStraddleDays > 1 && pt.time && pt.time.length > 5) return pt.time;
    return formatTime(pt.time);
  };

  ctx.textAlign = "left";
  ctx.fillText(getPointLabel(timeline[0]), pad.left, height - pad.bottom + 6);
  ctx.textAlign = "center";
  const midIdx = Math.floor(timeline.length / 2);
  ctx.fillText(getPointLabel(timeline[midIdx]), xFor(midIdx), height - pad.bottom + 6);
  ctx.textAlign = "right";
  ctx.fillText(getPointLabel(timeline[timeline.length - 1]), width - pad.right, height - pad.bottom + 6);

  if (straddleHoverIndex !== null) drawStraddleHover(straddleHoverIndex);
}

function updateStraddleHoverFromClientX(clientX) {
  if (!straddleChartGeometry) return;
  const rect = els.straddleCanvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const { pad, plotW, timeline } = straddleChartGeometry;
  const clamped = Math.max(pad.left, Math.min(pad.left + plotW, x));
  straddleHoverIndex = Math.round(((clamped - pad.left) / plotW) * (timeline.length - 1));
  drawStraddleChart();
}

function drawStraddleHover(index) {
  if (!straddleChartGeometry) return;
  const { pad, plotH, timeline, xFor, yFor, currentStrikeData } = straddleChartGeometry;
  if (index < 0 || index >= timeline.length) return;
  const p = timeline[index];
  const x = xFor(index);
  const ctx = els.straddleCanvas.getContext("2d");

  ctx.save();
  ctx.strokeStyle = "rgba(124, 58, 237, 0.4)";
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(x, pad.top);
  ctx.lineTo(x, pad.top + plotH);
  ctx.stroke();

  // Draw points on active lines
  const showStraddle = els.toggleStraddleLine ? els.toggleStraddleLine.checked : true;
  const showCall = els.toggleCallLine ? els.toggleCallLine.checked : true;
  const showPut = els.togglePutLine ? els.togglePutLine.checked : true;
  const showDiff = els.toggleDiffLine ? els.toggleDiffLine.checked : true;
  const showVwap = els.toggleVwapLine ? els.toggleVwapLine.checked : true;

  if (showStraddle && p.straddle != null) {
    ctx.fillStyle = "#7c3aed";
    ctx.beginPath();
    ctx.arc(x, yFor(p.straddle), 4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (showCall && p.call != null) {
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(x, yFor(p.call), 3, 0, Math.PI * 2);
    ctx.fill();
  }
  if (showPut && p.put != null) {
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(x, yFor(p.put), 3, 0, Math.PI * 2);
    ctx.fill();
  }
  const dVal = p.diff != null ? p.diff : ((p.call != null && p.put != null) ? (p.call - p.put) : null);
  if (showDiff && dVal != null) {
    ctx.fillStyle = "#0284c7";
    ctx.beginPath();
    ctx.arc(x, yFor(dVal), 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  if (showVwap && p.vwap != null) {
    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.arc(x, yFor(p.vwap), 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  if (els.straddleTooltip) {
    const time = (selectedStraddleDays > 1 && p.time && p.time.length > 5) ? p.time : formatTime(p.time);
    const openPrem = currentStrikeData.openPremium || p.straddle;
    const curDecayPts = (p.straddle - openPrem);
    const curDecayPct = openPrem ? (curDecayPts / openPrem * 100) : 0;
    const decayText = `${signedNumber(curDecayPts)} (${signedNumber(curDecayPct, "%")})`;
    const decayColor = curDecayPts < 0 ? "#10b981" : (curDecayPts > 0 ? "#f43f5e" : "#94a3b8");

    const diffVal = p.diff != null ? p.diff : ((p.call != null && p.put != null) ? (p.call - p.put) : 0);
    const diffColor = diffVal > 0 ? "#38bdf8" : (diffVal < 0 ? "#f87171" : "#94a3b8");
    const decayLabel = selectedStraddleDays > 1 ? "Period decay" : "Decay from open";

    els.straddleTooltip.innerHTML = `
      <div style="font-weight:800; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:3px; margin-bottom:3px;">🕒 ${time} | Strike: ${selectedStraddleStrike} (${selectedStraddleDays}D)</div>
      <span style="color:#c084fc;">Straddle (CE+PE): <b>₹${number(p.straddle, 2)}</b></span>
      <span style="color:#34d399;">Call (CE): <b>₹${number(p.call, 2)}</b></span>
      <span style="color:#fb7185;">Put (PE): <b>₹${number(p.put, 2)}</b></span>
      <span style="color:${diffColor};">CE - PE Diff: <b>${signedNumber(diffVal)}</b></span>
      <span style="color:#fbbf24;">VWAP: <b>₹${number(p.vwap, 2)}</b></span>
      <span style="color:#38bdf8;">Spot: <b>${number(p.spot, 2)}</b></span>
      <span style="color:${decayColor};">${decayLabel}: <b>${decayText}</b></span>
    `;

    const canvasRect = els.straddleCanvas.getBoundingClientRect();
    const tipRect = els.straddleTooltip.getBoundingClientRect();
    const left = Math.min(Math.max(x + 14, 10), canvasRect.width - tipRect.width - 10);
    const top = Math.min(Math.max(yFor(p.straddle) - 60, 10), canvasRect.height - tipRect.height - 10);
    els.straddleTooltip.style.left = `${left}px`;
    els.straddleTooltip.style.top = `${top}px`;
    els.straddleTooltip.classList.add("visible");
  }
}

function hideStraddleTooltip() {
  straddleHoverIndex = null;
  if (els.straddleTooltip) els.straddleTooltip.classList.remove("visible");
}

let modelEdgeFilterMode = "all";

function renderEdgeBadge(opt) {
  if (!opt || opt.fairPrice == null || opt.mispricingDiff == null) {
    return '<span class="edge-badge fair">--</span>';
  }
  const diff = opt.mispricingDiff;
  const pct = opt.mispricingPct || 0;
  const st = opt.mispricingStatus;
  const vol = opt.fittedVol ? `${opt.fittedVol}%` : "";
  if (st === "CHEAP" || st === "UNDERVALUED") {
    return `<span class="edge-badge undervalued" title="MM Edge: Trading at ₹${Math.abs(diff)} (${Math.abs(pct)}%) discount below Black-76 Theo. Fitted Vol: ${vol}. BUYERS EDGE!">${signedNumber(diff)} (${signedNumber(pct, "%")})</span>`;
  } else if (st === "RICH" || st === "OVERVALUED") {
    return `<span class="edge-badge overvalued" title="MM Edge: Trading at ₹${diff} (${pct}%) premium above Black-76 Theo. Fitted Vol: ${vol}. SELLERS EDGE!">${signedNumber(diff)} (${signedNumber(pct, "%")})</span>`;
  }
  return `<span class="edge-badge fair" title="Fair Value inside MM spread (Theo ₹${number(opt.fairPrice, 1)}, Vol ${vol})">FAIR</span>`;
}

function applyTableDisplaySettings() {
  const showGreeks = els.optShowGreeks ? els.optShowGreeks.checked : true;
  const isCompact = els.optCompact ? els.optCompact.checked : false;
  const showModel = els.optShowModelFair ? els.optShowModelFair.checked : true;

  els.optionChainTable.classList.toggle("greek-hidden", !showGreeks);
  els.optionChainTable.classList.toggle("compact-view-enabled", isCompact);
  els.optionChainTable.classList.toggle("table-hide-model-pricing", !showModel);

  if (els.modelPricingRibbon) {
    els.modelPricingRibbon.style.display = showModel ? "flex" : "none";
  }

  // Adjust table header colSpan
  let sideCols = 5;
  if (showGreeks) sideCols += 2;
  if (showModel) sideCols += 2;
  if (els.callsHeaderCell) els.callsHeaderCell.colSpan = sideCols;
  if (els.putsHeaderCell) els.putsHeaderCell.colSpan = sideCols;
}

function resizeOptCanvases() {
  const scale = window.devicePixelRatio || 1;
  [els.optOiCanvas, els.optIvCanvas].forEach(canvas => {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(320, Math.round(rect.width * scale));
    canvas.height = Math.max(220, Math.round(rect.height * scale));
    const ctx = canvas.getContext("2d");
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
  });
  if (els.straddleCanvas) {
    const sRect = els.straddleCanvas.getBoundingClientRect();
    const w = sRect.width > 50 ? sRect.width : (els.straddleCanvas.parentElement?.clientWidth || 800);
    const h = sRect.height > 50 ? sRect.height : 280;
    els.straddleCanvas.width = Math.round(w * scale);
    els.straddleCanvas.height = Math.round(h * scale);
    const sCtx = els.straddleCanvas.getContext("2d");
    sCtx.setTransform(scale, 0, 0, scale, 0, 0);
  }
  if (optChainDataGlobal) {
    drawOptOiChart(optChainDataGlobal);
    drawOptIvChart(optChainDataGlobal);
  }
  if (straddleDataGlobal) {
    drawStraddleChart();
  }
}

function renderOiChips(container, items, side) {
  if (!container || !items || !items.length) {
    if (container) container.innerHTML = '<span class="oi-chip"><span class="val">--</span></span>';
    return;
  }
  container.innerHTML = items.slice(0, 4).map(item => {
    const val = compactNumber(item.oi);
    const cls = side === "call" ? "call-chip" : "put-chip";
    return `<span class="oi-chip ${cls}"><strong>${item.strike}</strong> (${val})</span>`;
  }).join("");
}

function renderOptionChain(chain, spot) {
  const body = els.optionChainBody;
  body.innerHTML = "";
  if (!chain || chain.length === 0) {
    body.innerHTML = `<tr><td colspan="21" style="text-align: center; padding: 16px;">No Option Chain data available.</td></tr>`;
    return;
  }
  
  let displayChain = chain;
  if (modelEdgeFilterMode === "undervalued") {
    displayChain = chain.filter(r => (r.call && (r.call.mispricingStatus === "CHEAP" || r.call.mispricingStatus === "UNDERVALUED")) || (r.put && (r.put.mispricingStatus === "CHEAP" || r.put.mispricingStatus === "UNDERVALUED")));
  } else if (modelEdgeFilterMode === "overvalued") {
    displayChain = chain.filter(r => (r.call && (r.call.mispricingStatus === "RICH" || r.call.mispricingStatus === "OVERVALUED")) || (r.put && (r.put.mispricingStatus === "RICH" || r.put.mispricingStatus === "OVERVALUED")));
  }

  if (displayChain.length === 0) {
    body.innerHTML = `<tr><td colspan="21" style="text-align: center; padding: 16px; color: var(--text-muted);">No strikes match the selected edge filter (${modelEdgeFilterMode}).</td></tr>`;
    return;
  }

  const maxCallOi = Math.max(...chain.map(r => (r.call && r.call.oi) || 0), 1);
  const maxPutOi = Math.max(...chain.map(r => (r.put && r.put.oi) || 0), 1);
  let atmStraddlePrice = 0;
  
  displayChain.forEach(row => {
    const tr = document.createElement("tr");
    tr.className = "option-row";
    if (row.strike < spot) tr.classList.add("itm-call");
    if (row.strike > spot) tr.classList.add("itm-put");
    if (row.isAtm) {
      tr.classList.add("atm-row");
      const cLtp = (row.call && row.call.ltp) || 0;
      const pLtp = (row.put && row.put.ltp) || 0;
      atmStraddlePrice = cLtp + pLtp;
    }
    
    const c = row.call || {};
    const p = row.put || {};
    
    const cOi = c.oi || 0;
    const cOiChg = c.oiChange || 0;
    const cVol = c.volume || 0;
    const cIv = c.iv || 0;
    const cLtp = c.ltp || 0;
    const cChgPct = c.percentChange || 0;
    const cDelta = c.delta;
    const cTheta = c.theta;
    
    const pOi = p.oi || 0;
    const pOiChg = p.oiChange || 0;
    const pVol = p.volume || 0;
    const pIv = p.iv || 0;
    const pLtp = p.ltp || 0;
    const pChgPct = p.percentChange || 0;
    const pDelta = p.delta;
    const pTheta = p.theta;
    
    const callOiPct = Math.min(100, Math.round((cOi / maxCallOi) * 100));
    const putOiPct = Math.min(100, Math.round((pOi / maxPutOi) * 100));
    
    // Real-time LTP tick flash comparison
    const prev = lastLtpCache[row.strike] || {};
    let callFlash = "";
    let putFlash = "";
    if (prev.callLtp != null && cLtp !== prev.callLtp) {
      callFlash = cLtp > prev.callLtp ? "flash-tick-up" : "flash-tick-down";
    }
    if (prev.putLtp != null && pLtp !== prev.putLtp) {
      putFlash = pLtp > prev.putLtp ? "flash-tick-up" : "flash-tick-down";
    }
    lastLtpCache[row.strike] = { callLtp: cLtp, putLtp: pLtp };

    tr.innerHTML = `
      <td class="call-col col-oi oi-cell-wrap">
        <div class="oi-depth-bg call" style="width:${callOiPct}%;"></div>
        <span class="oi-text">${compactNumber(cOi)}</span>
      </td>
      <td class="call-col col-oichg ${cOiChg > 0 ? "change-pos" : (cOiChg < 0 ? "change-neg" : "change-zero")}">${signedNumber(cOiChg)}</td>
      <td class="call-col col-vol">${compactNumber(cVol)}</td>
      <td class="call-col col-iv">${cIv > 0 ? cIv.toFixed(1) + "%" : "--"}</td>
      <td class="call-col col-greek col-delta">${cDelta !== undefined && cDelta !== null ? Number(cDelta).toFixed(2) : "--"}</td>
      <td class="call-col col-greek col-theta">${cTheta !== undefined && cTheta !== null ? Number(cTheta).toFixed(2) : "--"}</td>
      <td class="call-col col-model col-fair" title="${c.fairPrice ? 'Live Black-76 Fair Value: ₹' + c.fairPrice + ' | Today Decay: -₹' + (c.decayToday || 0) + ' (-₹' + (c.decayPerHr || 0) + '/hr)' : ''}">
        ${c.fairPrice ? '₹' + number(c.fairPrice, 1) : '--'}
      </td>
      <td class="call-col col-model col-edge">${renderEdgeBadge(c)}</td>
      <td class="call-col col-ltp font-semibold ${callFlash}">${number(cLtp, 2)}</td>
      <td class="call-col col-chg ${cChgPct > 0 ? "change-pos" : (cChgPct < 0 ? "change-neg" : "change-zero")}">${signedNumber(cChgPct, "%")}</td>
      
      <td class="strike-col ${row.isAtm ? 'atm-badge' : ''}">
        <div class="strike-title">${row.strike}${row.isAtm ? ' <span class="atm-tag">ATM</span>' : ''}</div>
        <div class="strike-straddle-sub" title="Straddle Premium (Call + Put)">₹${number(cLtp + pLtp, 2)}</div>
      </td>
      
      <td class="put-col col-chg ${pChgPct > 0 ? "change-pos" : (pChgPct < 0 ? "change-neg" : "change-zero")}">${signedNumber(pChgPct, "%")}</td>
      <td class="put-col col-ltp font-semibold ${putFlash}">${number(pLtp, 2)}</td>
      <td class="put-col col-model col-edge">${renderEdgeBadge(p)}</td>
      <td class="put-col col-model col-fair" title="${p.fairPrice ? 'Live Black-76 Fair Value: ₹' + p.fairPrice + ' | Today Decay: -₹' + (p.decayToday || 0) + ' (-₹' + (p.decayPerHr || 0) + '/hr)' : ''}">
        ${p.fairPrice ? '₹' + number(p.fairPrice, 1) : '--'}
      </td>
      <td class="put-col col-greek col-theta">${pTheta !== undefined && pTheta !== null ? Number(pTheta).toFixed(2) : "--"}</td>
      <td class="put-col col-greek col-delta">${pDelta !== undefined && pDelta !== null ? Number(pDelta).toFixed(2) : "--"}</td>
      <td class="put-col col-iv">${pIv > 0 ? pIv.toFixed(1) + "%" : "--"}</td>
      <td class="put-col col-vol">${compactNumber(pVol)}</td>
      <td class="put-col col-oichg ${pOiChg > 0 ? "change-pos" : (pOiChg < 0 ? "change-neg" : "change-zero")}">${signedNumber(pOiChg)}</td>
      <td class="put-col col-oi oi-cell-wrap">
        <div class="oi-depth-bg put" style="width:${putOiPct}%;"></div>
        <span class="oi-text">${compactNumber(pOi)}</span>
      </td>
    `;
    body.appendChild(tr);
  });
  
  if (els.optAtmStraddle) {
    els.optAtmStraddle.textContent = atmStraddlePrice > 0 ? `₹${number(atmStraddlePrice, 2)}` : "--";
  }
  applyTableDisplaySettings();
}

async function loadOptionChain(opts = {}) {
  if (isOptLoading) return;
  isOptLoading = true;
  const isBg = Boolean(opts && opts.isBackground);
  if (!isBg && els.optRefreshButton) {
    els.optRefreshButton.disabled = true;
    els.optRefreshButton.textContent = "Loading...";
  }
  try {
    const payload = {
      date: els.dateInput.value,
      dataSource: els.dataSource.value,
      index: els.optIndexSelect.value,
      interval: "ONE_MINUTE",
      includeOptionChain: true,
      expiry: els.optExpirySelect.value,
      strikeRange: Number(els.optStrikeRange.value),
      straddleDays: Math.max(selectedStraddleDays, wpcrDays),
      wpcrDays: wpcrDays,
      fastRefresh: true,
    };
    if ((els.dataSource.value === "angel" || els.dataSource.value === "broker") && els.totpInput && els.totpInput.value.trim()) {
      payload.manualTotp = els.totpInput.value.trim();
    }
    
    const res = await fetch("/api/nifty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.message || "Failed to load options data");
    }
    
    const index = data.index || {};
    const chainSummary = data.chainSummary || {};
    const chain = data.optionChain || [];
    const spot = index.spot || 0;
    
    optChainDataGlobal = chain;
    
    const currentExpiry = els.optExpirySelect.value;
    els.optExpirySelect.innerHTML = "";
    if (data.expiries && data.expiries.length) {
      data.expiries.forEach(exp => {
        const opt = document.createElement("option");
        opt.value = exp.value;
        opt.textContent = exp.label;
        els.optExpirySelect.appendChild(opt);
      });
      if (Array.from(els.optExpirySelect.options).some(o => o.value === currentExpiry)) {
        els.optExpirySelect.value = currentExpiry;
      } else if (data.selectedExpiry) {
        els.optExpirySelect.value = data.selectedExpiry;
      }
    } else {
      els.optExpirySelect.innerHTML = `<option value="auto">No Expiries Available</option>`;
    }
    
    const indexName = index.name || (els.optIndexSelect && els.optIndexSelect.options[els.optIndexSelect.selectedIndex]?.textContent) || "NIFTY";
    if (els.callsHeaderCell) els.callsHeaderCell.textContent = `${indexName} CALLS`;
    if (els.putsHeaderCell) els.putsHeaderCell.textContent = `${indexName} PUTS`;

    if (els.optSpot) els.optSpot.textContent = number(spot, 2);
    const change = index.change ?? data.chartSummary?.change ?? 0;
    const changePct = index.percentChange ?? data.chartSummary?.percentChange ?? 0;
    if (els.optChange) {
      els.optChange.textContent = `${signedNumber(change)} (${signedNumber(changePct, "%")})`;
      els.optChange.className = change > 0 ? "change-pos" : (change < 0 ? "change-neg" : "change-zero");
    }
    
    if (els.optPcr) els.optPcr.textContent = number(chainSummary.pcrOi, 2);
    if (els.optPcrVol) els.optPcrVol.textContent = number(chainSummary.pcrVolume, 2);
    if (els.optMaxPain) els.optMaxPain.textContent = chainSummary.maxPain ?? "--";
    if (els.optAtmIv) els.optAtmIv.textContent = chainSummary.atmIv ? chainSummary.atmIv.toFixed(1) + "%" : "--";
    if (els.optSupport) els.optSupport.textContent = chainSummary.support ?? "--";
    if (els.optResistance) els.optResistance.textContent = chainSummary.resistance ?? "--";

    renderOiChips(els.topCallOiStrikes, chainSummary.topCallOi, "call");
    renderOiChips(els.topPutOiStrikes, chainSummary.topPutOi, "put");
    
    renderOptionChain(chain, spot);
    drawOptOiChart(chain);
    drawOptIvChart(chain);

    if (data.straddleData) {
      renderQuantStraddleDesk(data.straddleData);
    }
    if (data.statistics) {
      renderOptionsStatistics(data.statistics, spot);
    }
    if (data.wpcrPceData) {
      renderWpcrPceTerminal(data.wpcrPceData);
    }
    if (data.volatilityDashboard) {
      renderVolatilityDashboard(data.volatilityDashboard);
    }
    if (data.modelPricing && els.modelSkewSummary) {
      const mp = data.modelPricing;
      els.modelSkewSummary.innerHTML = `
        <span style="color:#1d4ed8;">Fwd F: <b>₹${number(mp.syntheticForward, 1)}</b> (${signedNumber(mp.forwardPoints)} pts)</span> | 
        <span>ATM Vol: <b>${mp.atmVol}%</b></span> | 
        <span title="Skew Slope: institutional downside put pricing gradient">Skew (&alpha;): <b>${mp.skewSlope}</b></span> | 
        <span title="Wing Smile Curvature: tail risk kurtosis">Wing (&beta;): <b>+${mp.wingCurvature}</b></span>
      `;
    }
    if (els.optLastUpdatedTime) {
      const now = new Date();
      els.optLastUpdatedTime.textContent = `Last tick: ${now.toLocaleTimeString()}`;
    }
    resetAutoRefreshTimer();
    
  } catch (err) {
    console.error(err);
    if (els.optionChainBody) {
      els.optionChainBody.innerHTML = `<tr><td colspan="17" style="text-align: center; padding: 16px; color: var(--red);">Error: ${escapeHtml(err.message)}</td></tr>`;
    }
  } finally {
    isOptLoading = false;
    if (!isBg && els.optRefreshButton) {
      els.optRefreshButton.disabled = false;
      els.optRefreshButton.textContent = "🔄 Refresh Option Chain";
    }
  }
}

function drawOptOiChart(chain) {
  const canvas = els.optOiCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const scale = window.devicePixelRatio || 1;
  const width = canvas.width / scale;
  const height = canvas.height / scale;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0c121e";
  ctx.fillRect(0, 0, width, height);

  if (!chain || chain.length === 0) return;

  const pad = { left: 40, right: 15, top: 15, bottom: 30 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const maxCallOi = Math.max(...chain.map(r => r.call?.oi || 0), 1000);
  const maxPutOi = Math.max(...chain.map(r => r.put?.oi || 0), 1000);
  const maxOi = Math.max(maxCallOi, maxPutOi);

  ctx.strokeStyle = "#1e293d";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#94a3b8";
  ctx.font = "9px 'JetBrains Mono', monospace";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  for (let i = 0; i <= 3; i++) {
    const val = (maxOi * i) / 3;
    const y = pad.top + plotH - (i / 3) * plotH;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillText(compactNumber(val), pad.left - 6, y);
  }

  const barGap = 3;
  const strikeCount = chain.length;
  const totalGapW = (strikeCount - 1) * barGap;
  const strikeColW = (plotW - totalGapW) / strikeCount;
  const subBarW = (strikeColW - 1) / 2;

  chain.forEach((row, i) => {
    const x = pad.left + i * (strikeColW + barGap);
    const callH = ((row.call?.oi || 0) / maxOi) * plotH;
    const putH = ((row.put?.oi || 0) / maxOi) * plotH;

    ctx.fillStyle = "rgba(16, 185, 129, 0.9)";
    ctx.fillRect(x, pad.top + plotH - callH, subBarW, callH);

    ctx.fillStyle = "rgba(244, 63, 94, 0.9)";
    ctx.fillRect(x + subBarW + 1, pad.top + plotH - putH, subBarW, putH);

    if (strikeCount < 10 || i % 2 === 0) {
      ctx.fillStyle = "#cbd5e1";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillText(row.strike, x + strikeColW / 2, pad.top + plotH + 5);
    }
  });
}

function drawOptIvChart(chain) {
  const canvas = els.optIvCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const scale = window.devicePixelRatio || 1;
  const width = canvas.width / scale;
  const height = canvas.height / scale;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0c121e";
  ctx.fillRect(0, 0, width, height);

  if (!chain || chain.length === 0) return;

  const pad = { left: 40, right: 15, top: 15, bottom: 30 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const callIvs = chain.map(r => r.call?.iv || 0).filter(v => v > 0);
  const putIvs = chain.map(r => r.put?.iv || 0).filter(v => v > 0);
  const allIvs = [...callIvs, ...putIvs];
  const minIv = Math.max(0.01, Math.min(...allIvs, 10));
  const maxIv = Math.max(minIv + 2, Math.max(...allIvs, 30));
  const ivSpan = maxIv - minIv;

  ctx.strokeStyle = "#1e293d";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#94a3b8";
  ctx.font = "9px 'JetBrains Mono', monospace";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  for (let i = 0; i <= 3; i++) {
    const val = minIv + (ivSpan * i) / 3;
    const y = pad.top + plotH - (i / 3) * plotH;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillText(`${val.toFixed(0)}%`, pad.left - 5, y);
  }

  const strikeCount = chain.length;
  const xFor = (i) => pad.left + (i / (strikeCount - 1)) * plotW;
  const yFor = (val) => pad.top + plotH - ((val - minIv) / ivSpan) * plotH;

  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 2;
  ctx.beginPath();
  let started = false;
  chain.forEach((row, i) => {
    if (row.call?.iv && row.call.iv > 0) {
      const x = xFor(i);
      const y = yFor(row.call.iv);
      if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 2;
  ctx.beginPath();
  started = false;
  chain.forEach((row, i) => {
    if (row.put?.iv && row.put.iv > 0) {
      const x = xFor(i);
      const y = yFor(row.put.iv);
      if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  chain.forEach((row, i) => {
    if (strikeCount < 10 || i % 2 === 0) {
      const x = xFor(i);
      ctx.fillStyle = "#cbd5e1";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillText(row.strike, x, pad.top + plotH + 5);
    }
  });
}

/* ==========================================================================
   Market Analysis Desk: Delivery Analysis (StockEdge style)
   ========================================================================== */
async function loadDeliveryData() {
  if (!els.deliveryTableBody) return;
  els.delivRefreshBtn.disabled = true;
  els.delivRefreshBtn.textContent = "Loading...";
  try {
    const symbol = els.delivSymbolSelect ? els.delivSymbolSelect.value : "NIFTY";
    const res = await fetch("/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "delivery",
        symbol: symbol,
        timeframe: currentDeliveryTf,
        date: els.dateInput.value,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.message || "Failed to load delivery data");
    renderLegacyDeliveryTable(data);
  } catch (err) {
    console.error(err);
    els.deliveryTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:14px;color:var(--red);">Error: ${escapeHtml(err.message)}</td></tr>`;
  } finally {
    if (els.delivRefreshBtn) {
      els.delivRefreshBtn.disabled = false;
      els.delivRefreshBtn.textContent = "🔄 Refresh";
    }
  }
}

function renderLegacyDeliveryTable(data) {
  const summary = data.summary || {};
  if (els.delivAvg5D) els.delivAvg5D.textContent = `${summary.avgDeliveryPct5D || "--"}%`;
  if (els.delivAvg1M) els.delivAvg1M.textContent = `${summary.avgDeliveryPct1M || "--"}%`;
  
  if (els.delivHighestDay) {
    if (summary.highestDelivery) {
      els.delivHighestDay.textContent = `${summary.highestDelivery.deliveryPct || "--"}% (${summary.highestDelivery.date || ""})`;
    } else {
      els.delivHighestDay.textContent = "--";
    }
  }
  
  if (els.delivTrendBadge) {
    const trend = summary.deliveryTrend || "Normal";
    els.delivTrendBadge.textContent = trend;
    els.delivTrendBadge.className = `badge-tag ${trend.includes("Accumulation") ? "badge-bullish" : (trend.includes("Distribution") ? "badge-bearish" : "")}`;
  }

  const body = els.deliveryTableBody;
  body.innerHTML = "";
  const records = data.records || [];
  if (!records.length) {
    body.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:14px;">No delivery records found</td></tr>`;
    return;
  }

  records.forEach(r => {
    const tr = document.createElement("tr");
    const isPos = (r.changePct || 0) >= 0;
    const delPct = r.deliveryPct || 0;
    
    let fillClass = "fill-low";
    if (delPct >= 60) fillClass = "fill-high";
    else if (delPct >= 45) fillClass = "fill-mid";

    let actionClass = "action-neutral";
    if (r.action.includes("Accumulation")) actionClass = "action-accum";
    else if (r.action.includes("Distribution")) actionClass = "action-dist";
    else if (r.action.includes("Covering")) actionClass = "action-cover";

    tr.innerHTML = `
      <td class="text-left"><strong>${r.date}</strong></td>
      <td class="text-right">${number(r.close, 2)}</td>
      <td class="text-right ${isPos ? "change-pos" : "change-neg"}">${signedNumber(r.changePct, "%")}</td>
      <td class="text-right">${compactNumber(r.tradedQty)}</td>
      <td class="text-right">${compactNumber(r.deliveryQty)}</td>
      <td class="text-left">
        <div class="deliv-pct-wrap">
          <span class="deliv-pct-val">${delPct.toFixed(2)}%</span>
          <div class="deliv-progress-bar">
            <div class="deliv-progress-fill ${fillClass}" style="width: ${Math.min(100, Math.max(5, delPct))}%;"></div>
          </div>
        </div>
      </td>
      <td class="text-right" style="color: var(--text-muted);">${r.avgDeliveryPct ? r.avgDeliveryPct.toFixed(1) + "%" : "--"}</td>
      <td class="text-center"><span class="action-pill ${actionClass}">${r.action}</span></td>
    `;
    body.appendChild(tr);
  });
}

/* ==========================================================================
   Market Analysis Desk: Participant-Wise OI (Trendlyne style)
   ========================================================================== */
async function loadParticipantOiData() {
  if (!els.participantOiTableBody) return;
  els.participantOiRefreshBtn.disabled = true;
  els.participantOiRefreshBtn.textContent = "Loading...";
  try {
    const reportDate = els.participantOiDate ? els.participantOiDate.value : els.dateInput.value;
    const res = await fetch("/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "participant_oi",
        date: reportDate,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.message || "Failed to load participant OI data");
    renderParticipantOiTable(data);
  } catch (err) {
    console.error(err);
    els.participantOiTableBody.innerHTML = `<tr><td colspan="14" style="text-align:center;padding:14px;color:var(--red);">Error: ${escapeHtml(err.message)}</td></tr>`;
  } finally {
    els.participantOiRefreshBtn.disabled = false;
    els.participantOiRefreshBtn.textContent = "🔄 Refresh Report";
  }
}

function renderParticipantOiTable(data) {
  const summary = data.summary || {};
  els.fiiLongRatioBadge.textContent = `${summary.fiiIndexLongRatio || "--"}%`;
  els.fiiNetContracts.textContent = signedContracts(summary.fiiNetFutIdx);
  els.fiiNetContracts.className = (summary.fiiNetFutIdx || 0) >= 0 ? "positive-text" : "negative-text";
  
  els.fiiDayChange.textContent = signedContracts(summary.fiiFutIdxChange);
  els.fiiDayChange.className = (summary.fiiFutIdxChange || 0) >= 0 ? "positive-text" : "negative-text";

  const bias = summary.institutionalBias || "Neutral";
  els.smartMoneyBias.textContent = bias;
  els.smartMoneyBias.className = `badge-tag ${bias.includes("Bullish") ? "badge-bullish" : (bias.includes("Bearish") ? "badge-bearish" : "")}`;
  
  els.divergenceNote.textContent = summary.smartMoneyDivergence || "--";

  // Participant current table
  const pBody = els.participantOiTableBody;
  pBody.innerHTML = "";
  const participants = data.participants || [];
  participants.forEach(p => {
    const tr = document.createElement("tr");
    const futIdxNet = p.futIdx?.net || 0;
    const futIdxChg = p.futIdx?.dayChange || 0;
    const futStkNet = p.futStk?.net || 0;
    const futStkChg = p.futStk?.dayChange || 0;
    const ceNet = p.optIdxCe?.net || 0;
    const ceChg = p.optIdxCe?.dayChange || 0;
    const peNet = p.optIdxPe?.net || 0;
    const peChg = p.optIdxPe?.dayChange || 0;

    let sentimentClass = "action-neutral";
    if (p.bias === "Bullish") sentimentClass = "action-accum";
    else if (p.bias === "Bearish") sentimentClass = "action-dist";

    tr.innerHTML = `
      <td class="text-left" style="font-weight:700; color:#fff;">${p.name}</td>
      
      <td class="text-right">${compactNumber(p.futIdx?.long)}</td>
      <td class="text-right">${compactNumber(p.futIdx?.short)}</td>
      <td class="text-right ${futIdxNet >= 0 ? 'change-pos' : 'change-neg'}">${signedContracts(futIdxNet)}</td>
      <td class="text-right ${futIdxChg >= 0 ? 'change-pos' : 'change-neg'}">${signedContracts(futIdxChg)}</td>
      
      <td class="text-right">${compactNumber(p.futStk?.long)}</td>
      <td class="text-right">${compactNumber(p.futStk?.short)}</td>
      <td class="text-right ${futStkNet >= 0 ? 'change-pos' : 'change-neg'}">${signedContracts(futStkNet)}</td>
      <td class="text-right ${futStkChg >= 0 ? 'change-pos' : 'change-neg'}">${signedContracts(futStkChg)}</td>
      
      <td class="text-right ${ceNet >= 0 ? 'change-pos' : 'change-neg'}">${signedContracts(ceNet)}</td>
      <td class="text-right ${ceChg >= 0 ? 'change-pos' : 'change-neg'}">${signedContracts(ceChg)}</td>
      
      <td class="text-right ${peNet >= 0 ? 'change-pos' : 'change-neg'}">${signedContracts(peNet)}</td>
      <td class="text-right ${peChg >= 0 ? 'change-pos' : 'change-neg'}">${signedContracts(peChg)}</td>
      
      <td class="text-center"><span class="action-pill ${sentimentClass}">${p.bias} (${p.longRatio}%)</span></td>
    `;
    pBody.appendChild(tr);
  });

  // Participant historical table
  const hBody = els.participantHistoryTableBody;
  hBody.innerHTML = "";
  const history = data.history || [];
  history.forEach(h => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="text-left"><strong>${h.date}</strong></td>
      <td class="text-right ${(h.fiiNetFutIdx || 0) >= 0 ? 'change-pos' : 'change-neg'}">${signedContracts(h.fiiNetFutIdx)}</td>
      <td class="text-right ${(h.fiiFutChange || 0) >= 0 ? 'change-pos' : 'change-neg'}">${signedContracts(h.fiiFutChange)}</td>
      <td class="text-right" style="color:var(--cyan); font-weight:700;">${h.fiiLongRatio}%</td>
      <td class="text-right ${(h.proNetFutIdx || 0) >= 0 ? 'change-pos' : 'change-neg'}">${signedContracts(h.proNetFutIdx)}</td>
      <td class="text-right ${(h.clientNetFutIdx || 0) >= 0 ? 'change-pos' : 'change-neg'}">${signedContracts(h.clientNetFutIdx)}</td>
    `;
    hBody.appendChild(tr);
  });
}

/* ==========================================================================
   🕵️ Smart Money Secret Institutional Terminal Logic
   ========================================================================== */
async function loadSecretTerminalData() {
  if (!els.stealthAccumTableBody) return;
  if (els.secretRefreshBtn) {
    els.secretRefreshBtn.disabled = true;
    els.secretRefreshBtn.textContent = "Computing Alpha...";
  }
  try {
    const reportDate = els.participantOiDate ? els.participantOiDate.value : els.dateInput.value;
    const res = await fetch("/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "secrets",
        date: reportDate,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.message || "Failed to load secret models");
    renderSecretTerminal(data);
  } catch (err) {
    console.error(err);
  } finally {
    if (els.secretRefreshBtn) {
      els.secretRefreshBtn.disabled = false;
      els.secretRefreshBtn.textContent = "🔄 Refresh Alpha";
    }
  }
}

function renderSecretTerminal(data) {
  const trap = data.trapRadar || {};
  const gamma = data.gammaEngine || {};
  const coc = data.costOfCarry || {};
  const strat = data.positionalStrategy || {};

  // 0. Positional Option Selling Strategy Engine
  if (els.posStratBadge) els.posStratBadge.textContent = strat.badge || "Auto Strategy";
  if (els.posStratTitle) els.posStratTitle.textContent = strat.strategyName || "Positional Setup";
  if (els.posStratRationale) els.posStratRationale.textContent = strat.rationale || "--";
  if (els.posWinRate) els.posWinRate.textContent = strat.winRate || "--";
  if (els.posNetCredit) els.posNetCredit.textContent = strat.netCredit || "--";
  if (els.posMargin) els.posMargin.textContent = strat.marginRequired || "--";
  if (els.posHorizon) els.posHorizon.textContent = strat.horizon || "--";
  if (els.posSlRule) els.posSlRule.textContent = strat.stopLossRule || "--";

  if (els.posLegsList) {
    els.posLegsList.innerHTML = "";
    const legs = strat.legs || [];
    if (!legs.length) {
      els.posLegsList.innerHTML = `<div style="padding:10px; color:var(--text-muted); font-size:11px;">Waiting for clear breakout / range confirmation.</div>`;
    } else {
      legs.forEach(leg => {
        const div = document.createElement("div");
        div.className = "pos-leg-row";
        div.innerHTML = `
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="leg-act ${leg.type}">${leg.action}</span>
            <span class="leg-name">${leg.instrument}</span>
          </div>
          <span class="leg-price">${leg.approxPrice}</span>
        `;
        els.posLegsList.appendChild(div);
      });
    }
  }

  if (els.posConditionPills) {
    els.posConditionPills.innerHTML = "";
    const cond = strat.conditionMatrix || {};
    const pills = [
      { label: `Gamma: ${cond.gammaRegime || "--"}`, active: cond.gammaStatus },
      { label: `FII Long: ${cond.fiiLongRatio || "--"}`, active: cond.fiiStatus },
      { label: `Heavyweight: ${cond.heavyweightScore || "--"}`, active: cond.heavyweightStatus },
      { label: `Target Band: ${cond.safeRangeBand || "--"}`, active: true },
    ];
    pills.forEach(p => {
      const span = document.createElement("span");
      span.className = `cond-pill ${p.active ? "active" : ""}`;
      span.textContent = `${p.active ? "✓ " : "• "}${p.label}`;
      els.posConditionPills.appendChild(span);
    });
  }

  // 1. Trap Radar
  if (els.trapProbabilityBadge) {
    els.trapProbabilityBadge.textContent = `${trap.probability || 50}% Squeeze Risk`;
    els.trapProbabilityBadge.style.color = (trap.probability || 0) >= 75 ? "#f87171" : "#38bdf8";
  }
  if (els.trapAlertHeader) els.trapAlertHeader.textContent = trap.signal || "Institutional Model Active";
  if (els.trapAlertDesc) els.trapAlertDesc.textContent = trap.description || "--";
  if (els.trapTradeBias) {
    els.trapTradeBias.textContent = trap.tradeBias || "--";
    els.trapTradeBias.style.color = trap.tradeBiasColor === "bullish" ? "var(--green)" : (trap.tradeBiasColor === "bearish" ? "var(--red)" : "var(--cyan)");
  }

  // 2. Gamma Engine
  if (els.gammaFlipLine) els.gammaFlipLine.textContent = gamma.gammaFlipStrike ? `₹${gamma.gammaFlipStrike}` : "--";
  if (els.gammaRegimeVal) els.gammaRegimeVal.textContent = gamma.gammaRegime ? gamma.gammaRegime.split(" ")[0] + " Gamma" : "--";
  if (els.gammaRegimeSub) els.gammaRegimeSub.textContent = gamma.gammaRegime || "Market Maker Mode";
  if (els.expiryPinVal) els.expiryPinVal.textContent = gamma.expiryPinStrike ? `₹${gamma.expiryPinStrike}` : "--";
  if (els.cocVal) els.cocVal.textContent = coc.annualizedCoC || "--";
  if (els.cocSentimentVal) els.cocSentimentVal.textContent = coc.sentiment || "--";

  // 3. Stealth Accumulation Scanner (All NSE 500 / Liquid Universe)
  allScannerStocks = data.stealthAccumulation || [];
  const sum = data.scannerSummary || {};
  if (els.scannerCountTag) els.scannerCountTag.textContent = `${sum.totalScanned || allScannerStocks.length} Stocks`;
  if (els.accumCountBadge) els.accumCountBadge.textContent = sum.accumCount || 0;
  if (els.distCountBadge) els.distCountBadge.textContent = sum.distCount || 0;

  renderFilteredStealthTable();
}

function renderFilteredStealthTable() {
  const sBody = els.stealthAccumTableBody;
  if (!sBody) return;
  sBody.innerHTML = "";

  let list = allScannerStocks || [];

  // 1. Universe filter
  if (currentScannerUniverse === "nifty50") {
    list = list.filter(s => s.isNifty50);
  } else if (currentScannerUniverse === "banknifty") {
    list = list.filter(s => s.isBankNifty);
  }

  // 2. Action filter
  if (currentScannerFilter === "bull") {
    list = list.filter(s => s.statusType === "bull" && s.status.includes("Accumulation"));
  } else if (currentScannerFilter === "bear") {
    list = list.filter(s => s.statusType === "bear");
  } else if (currentScannerFilter === "momentum") {
    list = list.filter(s => s.status.includes("Momentum"));
  }

  // 3. Search query filter
  if (scannerSearchQuery.trim()) {
    const q = scannerSearchQuery.trim().toUpperCase();
    list = list.filter(s => s.symbol.includes(q));
  }

  if (!list.length) {
    sBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:14px;color:var(--text-muted);">No matching stocks found for current filter/search.</td></tr>`;
    return;
  }

  // Render top 150 rows for buttery smooth scrolling
  const renderRows = list.slice(0, 150);
  renderRows.forEach(item => {
    const tr = document.createElement("tr");
    const isPos = (item.changePct || 0) >= 0;
    const score = item.accumScore || 50;
    let scoreClass = "score-mid";
    if (score >= 70) scoreClass = "score-high";
    else if (score < 45) scoreClass = "score-low";

    let actClass = "action-neutral";
    if (item.statusType === "bull") actClass = "action-accum";
    else if (item.statusType === "bear") actClass = "action-dist";

    tr.innerHTML = `
      <td class="text-left" style="font-weight:700; color:#fff;">
        ${item.symbol}
        ${item.isNifty50 ? '<span style="font-size:9px; padding:1px 4px; border-radius:3px; background:rgba(56,189,248,0.2); color:#38bdf8; margin-left:4px;">NIFTY50</span>' : ''}
      </td>
      <td class="text-right">${number(item.close, 2)}</td>
      <td class="text-right ${isPos ? 'change-pos' : 'change-neg'}">${signedNumber(item.changePct, "%")}</td>
      <td class="text-right" style="font-weight:700; color:var(--cyan);">${(item.deliveryPct || 0).toFixed(1)}%</td>
      <td class="text-right" style="color:var(--text-muted); font-size:11px;">${compactNumber(item.deliveryQty || 0)}</td>
      <td class="text-center"><span class="score-pill ${scoreClass}">${score}/100</span></td>
      <td class="text-center"><span class="action-pill ${actClass}">${item.status}</span></td>
    `;
    sBody.appendChild(tr);
  });
}

/* ==========================================================================
   🚀 Morning Market Radar & Sector Delivery Flow Logic
   ========================================================================== */
async function loadMarketRadarData() {
  if (!els.masterRadarTableBody) return;
  if (els.radarRefreshBtn) {
    els.radarRefreshBtn.disabled = true;
    els.radarRefreshBtn.textContent = "Scanning Sectors...";
  }
  try {
    const reportDate = els.participantOiDate ? els.participantOiDate.value : els.dateInput.value;
    const res = await fetch("/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "morning_radar",
        date: reportDate,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.message || "Failed to load market radar");
    renderMarketRadar(data);
  } catch (err) {
    console.error(err);
  } finally {
    if (els.radarRefreshBtn) {
      els.radarRefreshBtn.disabled = false;
      els.radarRefreshBtn.textContent = "🔄 Refresh Radar";
    }
  }
}

function renderMarketRadar(data) {
  if (els.radarDateBadge) els.radarDateBadge.textContent = data.date ? `DATE: ${data.date}` : "NSE LIVE";
  allRadarStocks = data.stocks || [];
  if (els.radarTableCountBadge) els.radarTableCountBadge.textContent = `${allRadarStocks.length} Stocks`;

  // 1. Render Sector Tiles Heatmap
  const secGrid = els.sectorTilesGrid;
  if (secGrid) {
    secGrid.innerHTML = "";
    const sectors = data.sectors || [];
    sectors.forEach(sec => {
      const tile = document.createElement("div");
      tile.className = "sector-tile";
      const isPos = (sec.avgChangePct || 0) >= 0;
      const total = (sec.advances + sec.declines) || 1;
      const advWidth = Math.round((sec.advances / total) * 100);
      const decWidth = 100 - advWidth;

      tile.innerHTML = `
        <div class="sec-tile-top">
          <span class="sec-name">${sec.sector}</span>
          <span class="sec-chg ${isPos ? 'change-pos' : 'change-neg'}">${signedNumber(sec.avgChangePct, "%")}</span>
        </div>
        <div class="sec-ratio-bar" title="Advances: ${sec.advances} | Declines: ${sec.declines}">
          <div class="sec-ratio-adv" style="width: ${advWidth}%;"></div>
          <div class="sec-ratio-dec" style="width: ${decWidth}%;"></div>
        </div>
        <div class="sec-del-sub">Avg Del: <strong style="color:var(--cyan);">${sec.avgDeliveryPct}%</strong> (${sec.totalStocks} stks)</div>
      `;

      tile.addEventListener("click", () => {
        if (els.radarSectorSelect) {
          els.radarSectorSelect.value = sec.sector;
          currentRadarSector = sec.sector;
          renderFilteredRadarTable();
        }
      });
      secGrid.appendChild(tile);
    });
  }

  // 2. Render Highlights (Gainers, Losers, Vol Shockers, Delivery Spurts)
  const hl = data.highlights || {};
  renderHighlightList(els.hlGainersList, hl.topGainers || [], "changePct", "%", true);
  renderHighlightList(els.hlLosersList, hl.topLosers || [], "changePct", "%", true);
  renderHighlightList(els.hlVolShockersList, hl.volumeShockers || [], "volSurge", "x", false, "vol");
  renderHighlightList(els.hlDelSpurtsList, hl.deliverySpurts || [], "delSurge", "x", false, "del");

  // 3. Render Master Radar Table
  renderFilteredRadarTable();
}

function renderHighlightList(container, list, key, unit, isSigned, type) {
  if (!container) return;
  container.innerHTML = "";
  if (!list.length) {
    container.innerHTML = `<div style="color:var(--text-muted); font-size:10px; padding:4px;">No data</div>`;
    return;
  }
  list.slice(0, 5).forEach(item => {
    const row = document.createElement("div");
    row.className = "hl-item";
    const val = item[key];
    let valStr = "";
    let valClass = "";
    if (isSigned) {
      valStr = signedNumber(val, unit);
      valClass = val >= 0 ? "change-pos" : "change-neg";
    } else {
      valStr = `${val}${unit}`;
      valClass = type === "vol" ? "change-pos" : "change-pos";
    }
    row.innerHTML = `
      <span class="hl-sym">${item.symbol}</span>
      <span class="hl-val ${valClass}">${valStr}</span>
    `;
    container.appendChild(row);
  });
}

function renderFilteredRadarTable() {
  const rBody = els.masterRadarTableBody;
  if (!rBody) return;
  rBody.innerHTML = "";

  let list = allRadarStocks || [];

  // 1. Sector Filter
  if (currentRadarSector !== "all") {
    list = list.filter(s => s.sector.toLowerCase() === currentRadarSector.toLowerCase());
  }

  // 2. Universe Filter
  if (currentRadarUniverse === "nifty50") {
    list = list.filter(s => s.isNifty50);
  } else if (currentRadarUniverse === "banknifty") {
    list = list.filter(s => s.isBankNifty);
  }

  // 3. Signal Filter
  if (currentRadarSignal !== "all") {
    list = list.filter(s => s.signalType === currentRadarSignal);
  }

  // 4. Search Filter
  if (radarSearchQuery.trim()) {
    const q = radarSearchQuery.trim().toUpperCase();
    list = list.filter(s => s.symbol.includes(q));
  }

  if (els.radarTableCountBadge) els.radarTableCountBadge.textContent = `${list.length} Stocks`;

  if (!list.length) {
    rBody.innerHTML = `<tr><td colspan="12" style="text-align:center;padding:16px;color:var(--text-muted);">No matching stocks found for selected radar filters.</td></tr>`;
    return;
  }

  // Render top 150 rows for 60fps performance
  const renderRows = list.slice(0, 150);
  renderRows.forEach(item => {
    const tr = document.createElement("tr");
    const isPos = (item.changePct || 0) >= 0;
    const is5DPos = (item.change5DPct || 0) >= 0;
    const isDelSurge = (item.delSurge || 1.0) >= 1.25;
    const isVolSurge = (item.volSurge || 1.0) >= 1.35;

    let actClass = "action-neutral";
    if (item.signalType === "breakout") actClass = "action-accum";
    else if (item.signalType === "accum") actClass = "action-accum";
    else if (item.signalType === "dist") actClass = "action-dist";
    else if (item.signalType === "momentum") actClass = "action-cover";

    tr.innerHTML = `
      <td class="text-left" style="font-weight:700; color:#fff;">
        ${item.symbol}
        <span style="font-size:9px; padding:1px 4px; border-radius:3px; background:rgba(255,255,255,0.06); color:var(--text-muted); margin-left:4px;">${item.sector}</span>
      </td>
      <td class="text-right">${number(item.close, 2)}</td>
      <td class="text-right ${isPos ? 'change-pos' : 'change-neg'}">${signedNumber(item.changePct, "%")}</td>
      <td class="text-right ${is5DPos ? 'change-pos' : 'change-neg'}">${signedNumber(item.change5DPct, "%")}</td>
      <td class="text-right" style="font-weight:700; color:var(--cyan);">${(item.deliveryPct || 0).toFixed(1)}%</td>
      <td class="text-right" style="color:var(--text-muted);">${(item.prevDeliveryPct || 0).toFixed(1)}%</td>
      <td class="text-right">${(item.avgDeliveryPct5D || 0).toFixed(1)}%</td>
      <td class="text-right"><span class="surge-pill ${isDelSurge ? 'surge-high' : 'surge-neutral'}">${(item.delSurge || 1.0).toFixed(2)}x</span></td>
      <td class="text-right" style="font-size:11px;">${compactNumber(item.volume || 0)}</td>
      <td class="text-right" style="font-size:11px; color:var(--text-muted);">${compactNumber(item.avgVolume5D || 0)}</td>
      <td class="text-right"><span class="surge-pill ${isVolSurge ? 'surge-high' : 'surge-neutral'}">${(item.volSurge || 1.0).toFixed(2)}x</span></td>
      <td class="text-center"><span class="action-pill ${actClass}">${item.signal}</span></td>
    `;
    rBody.appendChild(tr);
  });
}

async function loadStatus() {
  const res = await fetch("/api/status");
  const data = await res.json();
  const today = data.now ? String(data.now).slice(0, 10) : new Date().toISOString().slice(0, 10);
  if (els.dateInput && (!els.dateInput.value || els.dateInput.value.startsWith("2026-07"))) els.dateInput.value = today;
  if (els.endDateInput && (!els.endDateInput.value || els.endDateInput.value.startsWith("2026-07"))) els.endDateInput.value = today;
  if (els.participantOiDate && (!els.participantOiDate.value || els.participantOiDate.value.startsWith("2026-07"))) els.participantOiDate.value = today;

  const bName = (data.activeBroker || "UPSTOX").toUpperCase();
  window.__activeBroker = bName;
  const brokerDisplayName = {
    ANGEL: "Angel One (SmartAPI)",
    UPSTOX: "Upstox API v2",
    KOTAK: "Kotak Neo API",
    KOTAK_NEO: "Kotak Neo API",
    FYERS: "Fyers API v3",
  }[bName] || bName;

  const brokerLabels = {
    ANGEL: `Angel SmartAPI: Connected (${data.clientCode || 'Active'})`,
    UPSTOX: `Upstox API v2: Connected`,
    KOTAK: `Kotak Neo API: Connected`,
    KOTAK_NEO: `Kotak Neo API: Connected`,
    FYERS: `Fyers API v3: Connected`,
  };

  if (els.dataSource) {
    const brokerOpt = Array.from(els.dataSource.options).find(o => o.value === "broker" || o.value === "angel");
    if (brokerOpt) {
      brokerOpt.value = "broker";
      brokerOpt.textContent = `⚡ Active Broker: ${brokerDisplayName}`;
    }
  }

  if (data.brokerConfigured) {
    const label = brokerLabels[bName] || `${bName}: Connected`;
    els.apiStatus.textContent = `🟢 ${label}`;
    els.apiStatus.className = "status ready";
    els.dataSource.value = "broker";
    applyDataSourceDefaults("broker");
  } else if (data.angelConfigured) {
    els.apiStatus.textContent = `🟢 Angel SmartAPI: Connected (${data.clientCode})`;
    els.apiStatus.className = "status ready";
    els.dataSource.value = "broker";
    applyDataSourceDefaults("broker");
  } else {
    els.apiStatus.textContent = "Live Terminal (Real-time)";
    els.apiStatus.className = "status ready";
    els.dataSource.value = "sample";
    applyDataSourceDefaults("sample");
  }
}

function selectedUniverseLimit() {
  return INDEX_SYMBOL_LIMITS[els.universeSelect.value] || 50;
}

function syncIndexChartToUniverse() {
  const value = els.universeSelect.value;
  if (Array.from(els.indexSelect.options).some((option) => option.value === value)) {
    els.indexSelect.value = value;
  }
  if (els.optIndexSelect && Array.from(els.optIndexSelect.options).some((option) => option.value === value)) {
    els.optIndexSelect.value = value;
  }
}

function applyUniverseDefaults() {
  syncIndexChartToUniverse();
  if (!els.symbolsInput.value.trim()) {
    els.maxSymbols.value = String(selectedUniverseLimit());
  }
  const uLabel = universeLabel(els.universeSelect.value);
  if (els.niftyAdChartTitle) {
    els.niftyAdChartTitle.textContent = `${uLabel} Advance / Decline Tracker`;
  }
  loadNifty({ fastRefresh: true });
}

function applyDataSourceDefaults(source) {
  if (source === "broker" || source === "angel") {
    applyUniverseDefaults();
    els.pnfBasis.value = "hl";
    if (els.totpLabel) els.totpLabel.style.display = (window.__activeBroker === "ANGEL") ? "flex" : "none";
    if (els.totpInput && window.__activeBroker === "ANGEL") setTimeout(() => els.totpInput.focus(), 100);
  } else {
    if (!els.symbolsInput.value.trim()) {
      applyUniverseDefaults();
      els.pnfBasis.value = "hl";
    }
    if (els.totpLabel) els.totpLabel.style.display = "none";
  }
}

// Event Listeners
els.runButton.addEventListener("click", () => runBreadth({ fastRefresh: false }));
els.refreshButton.addEventListener("click", () => runBreadth({ fastRefresh: true }));
els.dataSource.addEventListener("change", () => applyDataSourceDefaults(els.dataSource.value));
els.universeSelect.addEventListener("change", applyUniverseDefaults);
els.chartMode.addEventListener("change", () => hideTooltip());
els.indexSelect.addEventListener("change", () => loadNifty({ fastRefresh: true }));
els.autoRefresh.addEventListener("change", scheduleAutoRefresh);
els.refreshInterval.addEventListener("change", scheduleAutoRefresh);

els.canvas.addEventListener("mousemove", (event) => updateHoverFromClientX(event.clientX));
els.canvas.addEventListener("mouseleave", () => {
  if (!latestData) return;
  hideTooltip();
  drawChart(latestData.timeline);
});

els.niftyCanvas.addEventListener("mousemove", (event) => updateNiftyHoverFromClientX(event.clientX));
els.niftyCanvas.addEventListener("mouseleave", () => {
  if (!niftyData) return;
  hideNiftyTooltip();
  drawNiftyChart(niftyData.points || []);
});

if (els.adCanvas) {
  els.adCanvas.addEventListener("mousemove", (event) => updateAdHoverFromClientX(event.clientX));
  els.adCanvas.addEventListener("mouseleave", () => {
    if (!latestData) return;
    hideAdTooltip();
    drawAdChart(latestData.timeline || []);
  });
}

if (els.niftyAdCanvas) {
  els.niftyAdCanvas.addEventListener("mousemove", (event) => updateNiftyAdHoverFromClientX(event.clientX));
  els.niftyAdCanvas.addEventListener("mouseleave", () => {
    hideNiftyAdTooltip();
    if (latestData) drawNiftyAdChart(latestData.timeline || []);
  });
}

// Sector sort & filter listeners
[els.secSortBullish, els.secSortBearish, els.secSortAlpha, els.secSortStocks].forEach(btn => {
  if (!btn) return;
  btn.addEventListener("click", () => {
    [els.secSortBullish, els.secSortBearish, els.secSortAlpha, els.secSortStocks].forEach(b => b?.classList.remove("active"));
    btn.classList.add("active");
    sectorSortMode = btn.dataset.sort || "bullish";
    renderSectorHeatmap();
  });
});

if (els.secFilterSelect) {
  els.secFilterSelect.addEventListener("change", () => {
    sectorFilterMode = els.secFilterSelect.value;
    renderSectorHeatmap();
  });
}

// Quant Straddle multi-day period listeners
document.querySelectorAll("#straddleTfGroup .straddle-tf-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#straddleTfGroup .straddle-tf-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedStraddleDays = Number(btn.dataset.days) || 1;
    loadOptionChain();
  });
});

// Quant Straddle chart toggles & canvas listeners
[els.toggleStraddleLine, els.toggleCallLine, els.togglePutLine, els.toggleDiffLine, els.toggleVwapLine].forEach(toggle => {
  if (toggle) {
    toggle.addEventListener("change", () => drawStraddleChart());
  }
});

if (els.straddleCanvas) {
  els.straddleCanvas.addEventListener("mousemove", (event) => updateStraddleHoverFromClientX(event.clientX));
  els.straddleCanvas.addEventListener("mouseleave", () => {
    hideStraddleTooltip();
    drawStraddleChart();
  });
}

// Tab navigation listeners
els.tabBreadth.addEventListener("click", () => switchTab("breadth"));
els.tabOptions.addEventListener("click", () => switchTab("options"));
if (els.tabSmartMoney) {
  els.tabSmartMoney.addEventListener("click", () => switchTab("smartMoney"));
}
if (els.tabDelivery) {
  els.tabDelivery.addEventListener("click", () => switchTab("delivery"));
}
if (els.tabMtf) {
  els.tabMtf.addEventListener("click", () => switchTab("mtf"));
}
if (els.tabTools) {
  els.tabTools.addEventListener("click", () => switchTab("tools"));
}
if (els.tabSettings) {
  els.tabSettings.addEventListener("click", () => switchTab("settings"));
}
if (els.mtfRefreshBtn) {
  els.mtfRefreshBtn.addEventListener("click", () => loadMtfData({ forceRefresh: true }));
}
if (els.mtfSessionSelect) {
  els.mtfSessionSelect.addEventListener("change", () => {
    const val = els.mtfSessionSelect.value;
    loadMtfData({ date: val });
  });
}
if (els.mtfStockSearch) {
  els.mtfStockSearch.addEventListener("input", () => renderMtfStockTable());
}
if (els.mtfStockFilter) {
  els.mtfStockFilter.addEventListener("change", () => renderMtfStockTable());
}
if (els.mtfStockSort) {
  els.mtfStockSort.addEventListener("change", () => renderMtfStockTable());
}

// Smart Money EOD Tracker listeners
if (els.smRefreshBtn) {
  els.smRefreshBtn.addEventListener("click", () => loadSmartMoneyData());
}
if (els.smSessionSelect) {
  els.smSessionSelect.addEventListener("change", () => {
    const val = els.smSessionSelect.value;
    if (val) {
      if (els.smDateInput) els.smDateInput.value = val;
      loadSmartMoneyData(val);
    }
  });
}
if (els.smDateInput) {
  els.smDateInput.addEventListener("change", () => {
    const val = els.smDateInput.value;
    if (val && val.length === 10) {
      if (els.smSessionSelect) els.smSessionSelect.value = val;
      loadSmartMoneyData(val);
    }
  });
}

// Delivery Desk event listeners
if (els.delivRefreshBtn) {
  els.delivRefreshBtn.addEventListener("click", () => loadDeliveryAnalytics());
}
if (els.delivSessionSelect) {
  els.delivSessionSelect.addEventListener("change", () => {
    const val = els.delivSessionSelect.value;
    if (val) {
      if (els.delivDateInput) els.delivDateInput.value = val;
      loadDeliveryAnalytics(val);
    }
  });
}
if (els.delivDateInput) {
  els.delivDateInput.addEventListener("change", () => {
    const val = els.delivDateInput.value;
    if (val && val.length === 10) {
      if (els.delivSessionSelect) els.delivSessionSelect.value = val;
      loadDeliveryAnalytics(val);
    }
  });
}
if (els.delivUniverseSelect) {
  els.delivUniverseSelect.addEventListener("change", () => loadDeliveryAnalytics());
}
if (els.delivFilterGroup) {
  els.delivFilterGroup.querySelectorAll(".filter-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      els.delivFilterGroup.querySelectorAll(".filter-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      delivActiveFilter = btn.dataset.filter || "all";
      loadDeliveryAnalytics();
    });
  });
}
if (els.delivSearchInput) {
  let searchTimer = null;
  els.delivSearchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      delivSearchQuery = els.delivSearchInput.value.trim();
      applyDeliveryFilterAndRender();
    }, 150);
  });
  els.delivSearchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const sym = els.delivSearchInput.value.trim();
      if (sym) inspectStock(sym);
    }
  });
}
if (els.delivInspectBtn) {
  els.delivInspectBtn.addEventListener("click", () => {
    const sym = (els.delivSearchInput && els.delivSearchInput.value.trim()) || "RELIANCE";
    inspectStock(sym);
  });
}
if (els.closeInspectorBtn) {
  els.closeInspectorBtn.addEventListener("click", () => {
    if (els.stockInspectorCard) els.stockInspectorCard.style.display = "none";
  });
}
if (els.drilldownCloseBtn) {
  els.drilldownCloseBtn.addEventListener("click", closeDeliveryDrilldown);
}
if (els.delivDrilldownModal) {
  els.delivDrilldownModal.addEventListener("click", (e) => {
    if (e.target === els.delivDrilldownModal) closeDeliveryDrilldown();
  });
}
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDeliveryDrilldown();
});
if (els.smHistoryCanvas) {
  els.smHistoryCanvas.addEventListener("mousemove", (e) => updateSmHistoryHover(e.clientX));
  els.smHistoryCanvas.addEventListener("mouseleave", () => {
    hideSmHistoryTooltip();
    if (smartMoneyDataGlobal && smartMoneyDataGlobal.history) {
      drawSmartMoneyHistoryChart(smartMoneyDataGlobal.history);
    }
  });
}

// Date range toggle
els.dateRangeToggle.addEventListener("change", () => {
  els.endDateLabel.style.display = els.dateRangeToggle.checked ? "flex" : "none";
});

// Options subtabs listeners
if (els.subtabIndexOverview) {
  els.subtabIndexOverview.addEventListener("click", () => switchOptionsSubtab("indexOverviewView"));
}
if (els.subtabChain) {
  els.subtabChain.addEventListener("click", () => switchOptionsSubtab("chainView"));
}
if (els.subtabStats) {
  els.subtabStats.addEventListener("click", () => switchOptionsSubtab("statsView"));
}
if (els.subtabWpcrPce) {
  els.subtabWpcrPce.addEventListener("click", () => switchOptionsSubtab("wpcrPceView"));
}
if (els.subtabVolatility) {
  els.subtabVolatility.addEventListener("click", () => switchOptionsSubtab("volatilityView"));
}
if (els.btnRefreshIndicesOverview) {
  els.btnRefreshIndicesOverview.addEventListener("click", () => loadIndicesOverview(true));
}
if (els.smJumpToIndicesBtn) {
  els.smJumpToIndicesBtn.addEventListener("click", () => {
    switchTab("options");
    switchOptionsSubtab("chainView");
  });
}

const volScreenerGroup = document.getElementById("volScreenerFilterGroup");
if (volScreenerGroup) {
  volScreenerGroup.querySelectorAll(".edge-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      volScreenerGroup.querySelectorAll(".edge-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      volScreenerFilterMode = btn.dataset.filter || "all";
      if (optChainDataGlobal && optChainDataGlobal.volatilityDashboard) {
        renderVolStockTable(optChainDataGlobal.volatilityDashboard.stockScreener || []);
      }
    });
  });
}

if (els.wpcrCapitalCanvas) {
  els.wpcrCapitalCanvas.addEventListener("mousemove", (event) => updateWpcrHoverFromClientX(event.clientX));
  els.wpcrCapitalCanvas.addEventListener("mouseleave", () => {
    hideWpcrTooltip();
    drawWpcrCapitalChart();
  });
}

if (els.wpcrPriceCanvas) {
  els.wpcrPriceCanvas.addEventListener("mousemove", (event) => updateWpcrTsHover(event.clientX));
  els.wpcrPriceCanvas.addEventListener("mouseleave", () => hideWpcrTsTooltip());
}

if (els.wpcrPcrCanvas) {
  els.wpcrPcrCanvas.addEventListener("mousemove", (event) => updateWpcrTsHover(event.clientX));
  els.wpcrPcrCanvas.addEventListener("mouseleave", () => hideWpcrTsTooltip());
}

const wpcrZoomGroup = document.getElementById("wpcrZoomGroup");
if (wpcrZoomGroup) {
  wpcrZoomGroup.querySelectorAll(".opstra-zoom-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      wpcrZoomGroup.querySelectorAll(".opstra-zoom-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const zoom = btn.dataset.zoom || "1Y";
      const zoomMap = { "1D": 1, "5D": 5, "10D": 10, "15D": 15, "3M": 65, "1Y": 250, "All": 500 };
      wpcrDays = zoomMap[zoom] || 1;
      
      // Update Date inputs
      const today = new Date();
      const past = new Date();
      const dayOffset = zoom === "1D" ? 1 : (zoom === "5D" ? 7 : (zoom === "10D" ? 14 : (zoom === "15D" ? 21 : (zoom === "3M" ? 90 : 365))));
      past.setDate(today.getDate() - dayOffset);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const fromEl = document.getElementById("wpcrDateFrom");
      const toEl = document.getElementById("wpcrDateTo");
      if (fromEl) fromEl.value = `${months[past.getMonth()]} ${past.getDate()}, ${past.getFullYear()}`;
      if (toEl) toEl.value = `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

      loadOptionChain();
    });
  });
}

if (els.wpcrTsCanvas) {
  els.wpcrTsCanvas.addEventListener("mousemove", (event) => updateWpcrTsHover(event.clientX));
  els.wpcrTsCanvas.addEventListener("mouseleave", () => {
    hideWpcrTsTooltip();
    drawWpcrTimeSeriesChart();
  });
}

if (els.wpcrTfGroup) {
  els.wpcrTfGroup.querySelectorAll(".straddle-tf-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      els.wpcrTfGroup.querySelectorAll(".straddle-tf-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      wpcrDays = parseInt(btn.dataset.days || "1", 10);
      loadOptionChain();
    });
  });
}

if (els.wpcrModeGroup) {
  els.wpcrModeGroup.querySelectorAll(".edge-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      els.wpcrModeGroup.querySelectorAll(".edge-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      wpcrChartMode = btn.dataset.mode || "wpcr_spot";
      
      if (wpcrChartMode === "strike_bars") {
        if (els.wpcrTsWrap) els.wpcrTsWrap.style.display = "none";
        if (els.wpcrCapitalWrap) els.wpcrCapitalWrap.style.display = "block";
        if (els.wpcrChartTitle) els.wpcrChartTitle.textContent = "💰 Strike-by-Strike Institutional Capital Deployment (₹ Crores)";
        if (els.wpcrChartSubtitle) els.wpcrChartSubtitle.textContent = "Visualizes actual Rupee turnover committed: Call Writing (Red) vs Put Writing (Green)";
        drawWpcrCapitalChart();
      } else {
        if (els.wpcrTsWrap) els.wpcrTsWrap.style.display = "block";
        if (els.wpcrCapitalWrap) els.wpcrCapitalWrap.style.display = "none";
        if (els.wpcrChartTitle) {
          els.wpcrChartTitle.textContent = wpcrChartMode === "ce_pe_crossover"
            ? "⚔️ Total Put Capital vs Call Capital Dynamics & Crossover"
            : "📈 Intraday wPCR & Put-Call Capital Dynamics (Opstra Style)";
        }
        if (els.wpcrChartSubtitle) {
          els.wpcrChartSubtitle.textContent = wpcrChartMode === "ce_pe_crossover"
            ? "Green Line (Put Capital) vs Red Line (Call Capital) tracking institutional accumulation"
            : "Dual-axis time-series tracking institutional Rupee-weighted PCR vs Nifty Spot Price";
        }
        drawWpcrTimeSeriesChart();
      }
    });
  });
}

// Options desk controls listeners
els.optIndexSelect.addEventListener("change", () => loadOptionChain());
els.optExpirySelect.addEventListener("change", () => loadOptionChain());
els.optStrikeRange.addEventListener("change", () => loadOptionChain());
els.optShowGreeks.addEventListener("change", applyTableDisplaySettings);
if (els.optShowModelFair) {
  els.optShowModelFair.addEventListener("change", applyTableDisplaySettings);
}
document.querySelectorAll("#edgeFilterGroup .edge-filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#edgeFilterGroup .edge-filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    modelEdgeFilterMode = btn.dataset.mode || "all";
    if (optChainDataGlobal) {
      renderOptionChain(optChainDataGlobal, (straddleDataGlobal && straddleDataGlobal.spot) || 24000);
    }
  });
});
els.optCompact.addEventListener("change", applyTableDisplaySettings);
els.optRefreshButton.addEventListener("click", () => loadOptionChain());

window.addEventListener("resize", () => {
  resizeCanvas();
  resizeNiftyCanvas();
  resizeNiftyAdCanvas();
  resizeOptCanvases();
  resizeAdCanvases();
  });

(async function init() {
  resizeCanvas();
  resizeNiftyCanvas();
  resizeNiftyAdCanvas();
  resizeOptCanvases();
  initOptionsAutoRefresh();
  await loadStatus();
  
  if (els.optIndexSelect && els.indexSelect) {
    els.optIndexSelect.value = els.indexSelect.value;
  }

  // 1. Auto-run Market Breadth on page load in background
  runBreadth({ fastRefresh: true });
  
  // 2. Pre-fetch background data for Options, Smart Money, Delivery & MTF desks
  loadOptionChain({ isBackground: true });
  loadDeliveryAnalytics();
  loadMtfData();
  loadSmartMoneyData();
  
  drawNiftyChart([]);
})();



// ==============================================================================
// 🏦 Opstra-Style FII/FPI and DII Trading Activity in Cash Market Module
// ==============================================================================
let fiiDiiCashGlobal = null;
let fiiDiiActivePeriod = "yearly"; // "daily", "monthly", "yearly"
let fiiDiiActiveView = "net";      // "net", "fii", "dii"

async function loadFiiDiiCashData() {
  try {
    const res = await fetch("/api/fii-dii-cash");
    if (!res.ok) return;
    const data = await res.json();
    if (data && data.ok) {
      fiiDiiCashGlobal = data;
      renderFiiDiiCashSection();
    }
  } catch (err) {
    console.error("Failed to load FII/DII cash data:", err);
  }
}

function renderFiiDiiCashSection() {
  if (!fiiDiiCashGlobal) return;
  let items = fiiDiiCashGlobal[fiiDiiActivePeriod] || [];

  // Update Top 3 KPI Cards from latest daily item
  const dailyItems = fiiDiiCashGlobal["daily"] || [];
  if (dailyItems.length > 0) {
    const latest = dailyItems[0];
    const kpiFii = document.getElementById("kpiFiiNetVal");
    const kpiDii = document.getElementById("kpiDiiNetVal");
    const kpiTotal = document.getElementById("kpiTotalNetVal");
    const subFii = document.getElementById("kpiFiiBuySellSub");
    const subDii = document.getElementById("kpiDiiBuySellSub");

    if (kpiFii) {
      kpiFii.textContent = (latest.fiiNet >= 0 ? "+" : "") + latest.fiiNet.toLocaleString("en-IN") + " Cr";
      kpiFii.style.color = latest.fiiNet >= 0 ? "#10b981" : "#ef4444";
    }
    if (kpiDii) {
      kpiDii.textContent = (latest.diiNet >= 0 ? "+" : "") + latest.diiNet.toLocaleString("en-IN") + " Cr";
      kpiDii.style.color = latest.diiNet >= 0 ? "#10b981" : "#ef4444";
    }
    if (kpiTotal) {
      const tot = latest.totalNet !== undefined ? latest.totalNet : (latest.fiiNet + latest.diiNet);
      kpiTotal.textContent = (tot >= 0 ? "+" : "") + tot.toLocaleString("en-IN") + " Cr";
      kpiTotal.style.color = tot >= 0 ? "#10b981" : "#ef4444";
    }
    if (subFii) subFii.textContent = `Buy: ₹${(latest.fiiBuy||0).toLocaleString()} Cr | Sell: ₹${(latest.fiiSell||0).toLocaleString()} Cr`;
    if (subDii) subDii.textContent = `Buy: ₹${(latest.diiBuy||0).toLocaleString()} Cr | Sell: ₹${(latest.diiSell||0).toLocaleString()} Cr`;
  }

  // Populate Session Select dropdown
  const sessSelect = document.getElementById("fiiDiiSessionSelect");
  if (sessSelect && sessSelect.options.length <= 1) {
    sessSelect.innerHTML = `<option value="all">All Historical Sessions</option>`;
    dailyItems.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item.period || item.date;
      opt.textContent = `${item.period || item.date} (Net: ${item.totalNet >= 0 ? '+' : ''}${item.totalNet} Cr)`;
      sessSelect.appendChild(opt);
    });
  }

  // Filter items by search input or session select
  const searchInput = document.getElementById("fiiDiiSearchInput");
  const query = (searchInput?.value || "").trim().toLowerCase();
  const selectedSess = sessSelect?.value || "all";

  if (selectedSess !== "all" && fiiDiiActivePeriod === "daily") {
    items = items.filter(r => (r.period || r.date) === selectedSess);
  } else if (query) {
    items = items.filter(r => String(r.period || r.date).toLowerCase().includes(query));
  }

  // 1. Draw Bar Chart
  drawFiiDiiCashChart(items, fiiDiiActiveView);
  
  // 2. Populate Data Table
  const tbody = document.getElementById("fiiDiiCashTableBody");
  if (!tbody) return;
  
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:16px; color:#64748b;">No Matching FII/DII Cash Data Found</td></tr>`;
    return;
  }
  
  let html = "";
  items.forEach(row => {
    const period = row.period || row.date || "--";
    const totalNet = row.totalNet !== undefined ? row.totalNet : (row.fiiNet + row.diiNet);
    const fiiNet = row.fiiNet || 0;
    const diiNet = row.diiNet || 0;
    
    const fmt = val => (val >= 0 ? `+${val.toLocaleString("en-IN", {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : val.toLocaleString("en-IN", {minimumFractionDigits: 2, maximumFractionDigits: 2}));

    html += `
      <tr style="border-bottom: 1px solid #162032;">
        <td style="padding:10px 14px; font-weight:700; color:#f8fafc;">${period}</td>
        <td style="padding:10px 14px; text-align:right; font-weight:800; font-family:'JetBrains Mono', monospace; color:${totalNet >= 0 ? '#10b981' : '#ef4444'};">${fmt(totalNet)}</td>
        <td style="padding:10px 14px; text-align:right; font-weight:700; font-family:'JetBrains Mono', monospace; color:${fiiNet >= 0 ? '#10b981' : '#ef4444'};">${fmt(fiiNet)}</td>
        <td style="padding:10px 14px; text-align:right; font-weight:700; font-family:'JetBrains Mono', monospace; color:${diiNet >= 0 ? '#10b981' : '#ef4444'};">${fmt(diiNet)}</td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

function drawFiiDiiCashChart(items, view) {
  const canvas = document.getElementById("fiiDiiCashCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const scale = window.devicePixelRatio || 1;
  
  const rect = canvas.getBoundingClientRect();
  const w = rect.width > 50 ? rect.width : (canvas.parentElement?.clientWidth || 800);
  const h = rect.height > 50 ? rect.height : 280;
  if (canvas.width !== Math.round(w * scale) || canvas.height !== Math.round(h * scale)) {
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
  }
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const width = canvas.width / scale;
  const height = canvas.height / scale;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0c121e";
  ctx.fillRect(0, 0, width, height);

  if (!items || !items.length) {
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillText("No FII/DII Chart Data Available", width / 2, height / 2);
    return;
  }

  // Reverse items so oldest is on left, newest on right for chart
  const chartItems = [...items].reverse();

  const pad = { left: 65, right: 20, top: 25, bottom: 35 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  // Compute values according to view
  const vals = chartItems.map(item => {
    if (view === "fii") return item.fiiNet || 0;
    if (view === "dii") return item.diiNet || 0;
    return item.totalNet !== undefined ? item.totalNet : ((item.fiiNet || 0) + (item.diiNet || 0));
  });

  let maxVal = Math.max(...vals.map(v => Math.abs(v)), 100);
  maxVal *= 1.15;

  const yZero = pad.top + plotH / 2;
  const yForVal = val => pad.top + plotH / 2 - (val / maxVal) * (plotH / 2);

  // Draw Gridlines & Zero Axis
  ctx.strokeStyle = "#1e293d";
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);

  // Upper gridline
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(width - pad.right, pad.top);
  ctx.stroke();

  // Zero gridline (solid line)
  ctx.strokeStyle = "#334155";
  ctx.setLineDash([]);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pad.left, yZero);
  ctx.lineTo(width - pad.right, yZero);
  ctx.stroke();

  // Lower gridline
  ctx.strokeStyle = "#1e293d";
  ctx.setLineDash([3, 3]);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top + plotH);
  ctx.lineTo(width - pad.right, pad.top + plotH);
  ctx.stroke();

  // Axis Labels
  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px 'JetBrains Mono', monospace";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(`+${Math.round(maxVal).toLocaleString()} Cr`, pad.left - 8, pad.top);
  ctx.fillText("0 Cr", pad.left - 8, yZero);
  ctx.fillText(`-${Math.round(maxVal).toLocaleString()} Cr`, pad.left - 8, pad.top + plotH);

  // Draw Bars
  const count = chartItems.length;
  const barSlotW = plotW / count;
  const barW = Math.max(4, Math.min(26, barSlotW - 8));

  chartItems.forEach((item, i) => {
    const val = vals[i];
    const x = pad.left + i * barSlotW + (barSlotW - barW) / 2;
    const yVal = yForVal(val);
    const barH = Math.abs(yVal - yZero);

    // Color gradient
    const gradient = ctx.createLinearGradient(0, Math.min(yVal, yZero), 0, Math.max(yVal, yZero));
    if (val >= 0) {
      gradient.addColorStop(0, "#10b981");
      gradient.addColorStop(1, "#059669");
    } else {
      gradient.addColorStop(0, "#f43f5e");
      gradient.addColorStop(1, "#dc2626");
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(x, Math.min(yVal, yZero), barW, Math.max(barH, 2));

    // Period label on bottom axis
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "9px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const lbl = String(item.period || item.date || "").slice(-4);
    ctx.fillText(lbl, x + barW / 2, pad.top + plotH + 8);
  });
}

function initFiiDiiCashControls() {
  const pDaily = document.getElementById("fiiDiiPeriodDaily");
  const pMonthly = document.getElementById("fiiDiiPeriodMonthly");
  const pYearly = document.getElementById("fiiDiiPeriodYearly");
  
  const vNet = document.getElementById("fiiDiiViewNet");
  const vFii = document.getElementById("fiiDiiViewFii");
  const vDii = document.getElementById("fiiDiiViewDii");

  const setPeriod = (period, activeBtn) => {
    fiiDiiActivePeriod = period;
    [pDaily, pMonthly, pYearly].forEach(btn => btn?.classList.remove("active"));
    activeBtn?.classList.add("active");
    renderFiiDiiCashSection();
  };

  const setView = (view, activeBtn) => {
    fiiDiiActiveView = view;
    [vNet, vFii, vDii].forEach(btn => btn?.classList.remove("active"));
    activeBtn?.classList.add("active");
    renderFiiDiiCashSection();
  };

  pDaily?.addEventListener("click", () => setPeriod("daily", pDaily));
  pMonthly?.addEventListener("click", () => setPeriod("monthly", pMonthly));
  pYearly?.addEventListener("click", () => setPeriod("yearly", pYearly));

  vNet?.addEventListener("click", () => setView("net", vNet));
  vFii?.addEventListener("click", () => setView("fii", vFii));
  vDii?.addEventListener("click", () => setView("dii", vDii));

  const searchInput = document.getElementById("fiiDiiSearchInput");
  const sessSelect = document.getElementById("fiiDiiSessionSelect");
  const refreshBtn = document.getElementById("fiiDiiRefreshBtn");

  searchInput?.addEventListener("input", () => renderFiiDiiCashSection());
  sessSelect?.addEventListener("change", () => renderFiiDiiCashSection());
  refreshBtn?.addEventListener("click", () => loadFiiDiiCashData());

}



// ==============================================================================
// ⚡ Clickable Live Market Ticker Tape Event Listeners & Real-Time Updater
// ==============================================================================
function initMarketTickerTape() {
  const chips = document.querySelectorAll(".ticker-chip.clickable");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const tabTarget = chip.getAttribute("data-tab");
      if (tabTarget && typeof switchTab === "function") {
        switchTab(tabTarget);
        // Scroll smoothly to top of active panel
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
    const diiNet = row.diiNet || 0;
    
    const fmt = val => (val >= 0 ? `+${val.toLocaleString("en-IN", {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : val.toLocaleString("en-IN", {minimumFractionDigits: 2, maximumFractionDigits: 2}));

    html += `
      <tr style="border-bottom: 1px solid #162032;">
        <td style="padding:10px 14px; font-weight:700; color:#f8fafc;">${period}</td>
        <td style="padding:10px 14px; text-align:right; font-weight:800; font-family:'JetBrains Mono', monospace; color:${totalNet >= 0 ? '#10b981' : '#ef4444'};">${fmt(totalNet)}</td>
        <td style="padding:10px 14px; text-align:right; font-weight:700; font-family:'JetBrains Mono', monospace; color:${fiiNet >= 0 ? '#10b981' : '#ef4444'};">${fmt(fiiNet)}</td>
        <td style="padding:10px 14px; text-align:right; font-weight:700; font-family:'JetBrains Mono', monospace; color:${diiNet >= 0 ? '#10b981' : '#ef4444'};">${fmt(diiNet)}</td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

function drawFiiDiiCashChart(items, view) {
  const canvas = document.getElementById("fiiDiiCashCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const scale = window.devicePixelRatio || 1;
  
  const rect = canvas.getBoundingClientRect();
  const w = rect.width > 50 ? rect.width : (canvas.parentElement?.clientWidth || 800);
  const h = rect.height > 50 ? rect.height : 280;
  if (canvas.width !== Math.round(w * scale) || canvas.height !== Math.round(h * scale)) {
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
  }
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const width = canvas.width / scale;
  const height = canvas.height / scale;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0c121e";
  ctx.fillRect(0, 0, width, height);

  if (!items || !items.length) {
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillText("No FII/DII Chart Data Available", width / 2, height / 2);
    return;
  }

  // Reverse items so oldest is on left, newest on right for chart
  const chartItems = [...items].reverse();

  const pad = { left: 65, right: 20, top: 25, bottom: 35 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  // Compute values according to view
  const vals = chartItems.map(item => {
    if (view === "fii") return item.fiiNet || 0;
    if (view === "dii") return item.diiNet || 0;
    return item.totalNet !== undefined ? item.totalNet : ((item.fiiNet || 0) + (item.diiNet || 0));
  });

  let maxVal = Math.max(...vals.map(v => Math.abs(v)), 100);
  maxVal *= 1.15;

  const yZero = pad.top + plotH / 2;
  const yForVal = val => pad.top + plotH / 2 - (val / maxVal) * (plotH / 2);

  // Draw Gridlines & Zero Axis
  ctx.strokeStyle = "#1e293d";
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);

  // Upper gridline
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(width - pad.right, pad.top);
  ctx.stroke();

  // Zero gridline (solid line)
  ctx.strokeStyle = "#334155";
  ctx.setLineDash([]);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pad.left, yZero);
  ctx.lineTo(width - pad.right, yZero);
  ctx.stroke();

  // Lower gridline
  ctx.strokeStyle = "#1e293d";
  ctx.setLineDash([3, 3]);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top + plotH);
  ctx.lineTo(width - pad.right, pad.top + plotH);
  ctx.stroke();

  // Axis Labels
  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px 'JetBrains Mono', monospace";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(`+${Math.round(maxVal).toLocaleString()} Cr`, pad.left - 8, pad.top);
  ctx.fillText("0 Cr", pad.left - 8, yZero);
  ctx.fillText(`-${Math.round(maxVal).toLocaleString()} Cr`, pad.left - 8, pad.top + plotH);

  // Draw Bars
  const count = chartItems.length;
  const barSlotW = plotW / count;
  const barW = Math.max(4, Math.min(26, barSlotW - 8));

  chartItems.forEach((item, i) => {
    const val = vals[i];
    const x = pad.left + i * barSlotW + (barSlotW - barW) / 2;
    const yVal = yForVal(val);
    const barH = Math.abs(yVal - yZero);

    // Color gradient
    const gradient = ctx.createLinearGradient(0, Math.min(yVal, yZero), 0, Math.max(yVal, yZero));
    if (val >= 0) {
      gradient.addColorStop(0, "#10b981");
      gradient.addColorStop(1, "#059669");
    } else {
      gradient.addColorStop(0, "#f43f5e");
      gradient.addColorStop(1, "#dc2626");
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(x, Math.min(yVal, yZero), barW, Math.max(barH, 2));

    // Period label on bottom axis
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "9px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const lbl = String(item.period || item.date || "").slice(-4);
    ctx.fillText(lbl, x + barW / 2, pad.top + plotH + 8);
  });
}

function initFiiDiiCashControls() {
  const pDaily = document.getElementById("fiiDiiPeriodDaily");
  const pMonthly = document.getElementById("fiiDiiPeriodMonthly");
  const pYearly = document.getElementById("fiiDiiPeriodYearly");
  
  const vNet = document.getElementById("fiiDiiViewNet");
  const vFii = document.getElementById("fiiDiiViewFii");
  const vDii = document.getElementById("fiiDiiViewDii");

  const setPeriod = (period, activeBtn) => {
    fiiDiiActivePeriod = period;
    [pDaily, pMonthly, pYearly].forEach(btn => btn?.classList.remove("active"));
    activeBtn?.classList.add("active");
    renderFiiDiiCashSection();
  };

  const setView = (view, activeBtn) => {
    fiiDiiActiveView = view;
    [vNet, vFii, vDii].forEach(btn => btn?.classList.remove("active"));
    activeBtn?.classList.add("active");
    renderFiiDiiCashSection();
  };

  pDaily?.addEventListener("click", () => setPeriod("daily", pDaily));
  pMonthly?.addEventListener("click", () => setPeriod("monthly", pMonthly));
  pYearly?.addEventListener("click", () => setPeriod("yearly", pYearly));

  vNet?.addEventListener("click", () => setView("net", vNet));
  vFii?.addEventListener("click", () => setView("fii", vFii));
  vDii?.addEventListener("click", () => setView("dii", vDii));

  const searchInput = document.getElementById("fiiDiiSearchInput");
  const sessSelect = document.getElementById("fiiDiiSessionSelect");
  const refreshBtn = document.getElementById("fiiDiiRefreshBtn");

  searchInput?.addEventListener("input", () => renderFiiDiiCashSection());
  sessSelect?.addEventListener("change", () => renderFiiDiiCashSection());
  refreshBtn?.addEventListener("click", () => loadFiiDiiCashData());

}



// ==============================================================================
// ⚡ Clickable Live Market Ticker Tape Event Listeners & Real-Time Updater
// ==============================================================================
function initMarketTickerTape() {
  const chips = document.querySelectorAll(".ticker-chip.clickable");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const tabTarget = chip.getAttribute("data-tab");
      if (tabTarget && typeof switchTab === "function") {
        switchTab(tabTarget);
        // Scroll smoothly to top of active panel
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

function updateTickerBarData(data) {
  if (!data) return;
  if (data.fiiCashNet !== undefined) {
    const el = document.getElementById("tickerFiiCashVal");
    if (el) {
      el.textContent = (data.fiiCashNet >= 0 ? "+" : "") + "₹" + data.fiiCashNet.toLocaleString("en-IN") + " Cr";
      el.className = "ticker-val " + (data.fiiCashNet >= 0 ? "positive" : "negative");
    }
  }
  if (data.diiCashNet !== undefined) {
    const el = document.getElementById("tickerDiiCashVal");
    if (el) {
      el.textContent = (data.diiCashNet >= 0 ? "+" : "") + "₹" + data.diiCashNet.toLocaleString("en-IN") + " Cr";
      el.className = "ticker-val " + (data.diiCashNet >= 0 ? "positive" : "negative");
    }
  }
}


// ==============================================================================
// ⚙️ Multi-Broker Integration & Live Switcher Settings Module
// ==============================================================================

function toggleFieldVis(fieldId) {
  const input = document.getElementById(fieldId);
  if (!input) return;
  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}
window.toggleFieldVis = toggleFieldVis;

let settingsAlertTimer = null;
function showSettingsAlert(msg, type = "info", duration = 6000) {
  const banner = document.getElementById("settingsAlertBanner");
  if (!banner) return;
  if (settingsAlertTimer) {
    clearTimeout(settingsAlertTimer);
    settingsAlertTimer = null;
  }
  banner.className = `settings-alert ${type}`;
  let icon = "ℹ️";
  if (type === "success") icon = "✅";
  else if (type === "error") icon = "❌";
  else if (type === "warning") icon = "⚠️";
  banner.innerHTML = `<span>${icon}</span> <span>${msg}</span>`;
  banner.style.display = "flex";
  if (duration > 0) {
    settingsAlertTimer = setTimeout(() => {
      banner.style.display = "none";
    }, duration);
  }
}

function getUserBrokerStorageKey() {
  const uid = window.AuthSync?.user?.id || 'guest';
  return 'bl_broker_cfg_' + uid;
}

async function loadBrokerSettings() {
  try {
    // 1. Check if the active user has their own saved broker credentials in private storage
    const userBrokerKey = getUserBrokerStorageKey();
    let userBrokerData = null;
    try {
      const saved = localStorage.getItem(userBrokerKey);
      if (saved) userBrokerData = JSON.parse(saved);
    } catch(e) {}

    // Fallback: Check if user cloud workspace has brokerSettings
    if (!userBrokerData && window.AuthSync?.workspace?.brokerSettings) {
      userBrokerData = window.AuthSync.workspace.brokerSettings;
    }

    // Default: If new user / no custom broker entered yet, EVERYTHING IS BLANK by default!
    const data = userBrokerData || {
      activeBroker: "ANGEL",
      angel: { apiKey: "", clientCode: "", pin: "", totpSecret: "", totpCode: "", configured: false },
      upstox: { accessToken: "", apiKey: "", apiSecret: "", configured: false },
      kotak: { accessToken: "", consumerKey: "", consumerSecret: "", mobileNo: "", mpin: "", configured: false },
      fyers: { appId: "", accessToken: "", configured: false }
    };

    // Active Broker selection
    const active = (data.activeBroker || "ANGEL").toUpperCase();
    const radio = document.querySelector(`input[name="brokerSelect"][value="${active}"]`);
    if (radio) {
      radio.checked = true;
    }
    document.querySelectorAll(".broker-card-radio").forEach(card => {
      const broker = (card.getAttribute("data-broker") || "").toUpperCase();
      if (broker === active) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });

    // Angel One Fields
    if (data.angel) {
      const elKey = document.getElementById("cfgAngelApiKey");
      const elCode = document.getElementById("cfgAngelClientCode");
      const elPin = document.getElementById("cfgAngelPin");
      const elTotpSec = document.getElementById("cfgAngelTotpSecret");
      const elTotpCode = document.getElementById("cfgAngelTotpCode");
      if (elKey) elKey.value = data.angel.apiKey || "";
      if (elCode) elCode.value = data.angel.clientCode || "";
      if (elPin) elPin.value = data.angel.pin || "";
      if (elTotpSec) elTotpSec.value = data.angel.totpSecret || "";
      if (elTotpCode) elTotpCode.value = data.angel.totpCode || "";

      const badge = document.getElementById("badgeAngelStatus");
      if (badge) {
        const isCfg = Boolean(data.angel.apiKey && data.angel.clientCode && data.angel.pin);
        badge.className = isCfg ? "broker-status-pill configured" : "broker-status-pill not-configured";
        badge.textContent = isCfg ? "Configured" : "Not Configured";
      }
    }

    // Upstox Fields
    if (data.upstox) {
      const elToken = document.getElementById("cfgUpstoxAccessToken");
      const elKey = document.getElementById("cfgUpstoxApiKey");
      const elSecret = document.getElementById("cfgUpstoxApiSecret");
      if (elToken) elToken.value = data.upstox.accessToken || "";
      if (elKey) elKey.value = data.upstox.apiKey || "";
      if (elSecret) elSecret.value = data.upstox.apiSecret || "";

      const badge = document.getElementById("badgeUpstoxStatus");
      if (badge) {
        const isCfg = Boolean(data.upstox.accessToken);
        badge.className = isCfg ? "broker-status-pill configured" : "broker-status-pill not-configured";
        badge.textContent = isCfg ? "Configured" : "Not Configured";
      }
    }

    // Kotak Neo Fields
    if (data.kotak) {
      const elToken = document.getElementById("cfgKotakAccessToken");
      const elKey = document.getElementById("cfgKotakConsumerKey");
      const elSecret = document.getElementById("cfgKotakConsumerSecret");
      const elMobile = document.getElementById("cfgKotakMobileNo");
      const elMpin = document.getElementById("cfgKotakMpin");
      if (elToken) elToken.value = data.kotak.accessToken || "";
      if (elKey) elKey.value = data.kotak.consumerKey || "";
      if (elSecret) elSecret.value = data.kotak.consumerSecret || "";
      if (elMobile) elMobile.value = data.kotak.mobileNo || "";
      if (elMpin) elMpin.value = data.kotak.mpin || "";

      const badge = document.getElementById("badgeKotakStatus");
      if (badge) {
        const isCfg = Boolean(data.kotak.accessToken || (data.kotak.consumerKey && data.kotak.mobileNo));
        badge.className = isCfg ? "broker-status-pill configured" : "broker-status-pill not-configured";
        badge.textContent = isCfg ? "Configured" : "Not Configured";
      }
    }

    // Fyers Fields
    if (data.fyers) {
      const elAppId = document.getElementById("cfgFyersAppId");
      const elToken = document.getElementById("cfgFyersAccessToken");
      if (elAppId) elAppId.value = data.fyers.appId || "";
      if (elToken) elToken.value = data.fyers.accessToken || "";

      const badge = document.getElementById("badgeFyersStatus");
      if (badge) {
        const isCfg = Boolean(data.fyers.appId && data.fyers.accessToken);
        badge.className = isCfg ? "broker-status-pill configured" : "broker-status-pill not-configured";
        badge.textContent = isCfg ? "Configured" : "Not Configured";
      }
    }
  } catch (err) {
    console.error("Failed to load broker settings:", err);
  }
}

window.loadBrokerSettings = loadBrokerSettings;

async function saveBrokerSettings() {
  const selectedRadio = document.querySelector('input[name="brokerSelect"]:checked');
  const activeBroker = selectedRadio ? selectedRadio.value : "ANGEL";

  const payload = {
    activeBroker: activeBroker,
    angel: {
      apiKey: (document.getElementById("cfgAngelApiKey")?.value || "").trim(),
      clientCode: (document.getElementById("cfgAngelClientCode")?.value || "").trim(),
      pin: (document.getElementById("cfgAngelPin")?.value || "").trim(),
      totpSecret: (document.getElementById("cfgAngelTotpSecret")?.value || "").trim(),
      totpCode: (document.getElementById("cfgAngelTotpCode")?.value || "").trim(),
    },
    upstox: {
      accessToken: (document.getElementById("cfgUpstoxAccessToken")?.value || "").trim(),
      apiKey: (document.getElementById("cfgUpstoxApiKey")?.value || "").trim(),
      apiSecret: (document.getElementById("cfgUpstoxApiSecret")?.value || "").trim(),
    },
    kotak: {
      accessToken: (document.getElementById("cfgKotakAccessToken")?.value || "").trim(),
      consumerKey: (document.getElementById("cfgKotakConsumerKey")?.value || "").trim(),
      consumerSecret: (document.getElementById("cfgKotakConsumerSecret")?.value || "").trim(),
      mobileNo: (document.getElementById("cfgKotakMobileNo")?.value || "").trim(),
      mpin: (document.getElementById("cfgKotakMpin")?.value || "").trim(),
    },
    fyers: {
      appId: (document.getElementById("cfgFyersAppId")?.value || "").trim(),
      accessToken: (document.getElementById("cfgFyersAccessToken")?.value || "").trim(),
    },
  };

  // 1. Save locally for this user
  const userBrokerKey = getUserBrokerStorageKey();
  try {
    localStorage.setItem(userBrokerKey, JSON.stringify(payload));
  } catch(e) {}

  // 2. Sync to cloud workspace
  if (window.AuthSync && typeof window.AuthSync.saveWorkspace === "function") {
    window.AuthSync.saveWorkspace({ brokerSettings: payload });
  }

  const saveBtns = [
    document.getElementById("btnSaveAllSettings"),
    document.getElementById("btnSaveAllSettingsBottom"),
  ];
  saveBtns.forEach(btn => {
    if (btn) {
      btn.disabled = true;
      btn.dataset.prevHtml = btn.innerHTML;
      btn.innerHTML = `⏳ Saving...`;
    }
  });

  try {
    // Also save to server session if applicable
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});

    showSettingsAlert(`Your broker credentials have been securely saved to your account! Active: ${activeBroker}`, "success");
    await loadBrokerSettings();
  } catch (err) {
    showSettingsAlert(`Saved to your account profile!`, "success");
  } finally {
    saveBtns.forEach(btn => {
      if (btn) {
        btn.disabled = false;
        if (btn.dataset.prevHtml) btn.innerHTML = btn.dataset.prevHtml;
      }
    });
  }
}

async function testActiveBrokerConnection() {
  const selectedRadio = document.querySelector('input[name="brokerSelect"]:checked');
  const activeBroker = selectedRadio ? selectedRadio.value : "ANGEL";
  const manualTotp = (document.getElementById("cfgAngelTotpCode")?.value || "").trim();

  const testBtns = [
    document.getElementById("btnTestBrokerConn"),
    document.getElementById("btnTestBrokerConnBottom"),
  ];
  testBtns.forEach(btn => {
    if (btn) {
      btn.disabled = true;
      btn.dataset.prevHtml = btn.innerHTML;
      btn.innerHTML = `⏳ Testing ${activeBroker}...`;
    }
  });

  showSettingsAlert(`Connecting to ${activeBroker} API to verify credentials...`, "info", 10000);

  try {
    const res = await fetch("/api/settings/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ broker: activeBroker, manualTotp }),
    });
    const result = await res.json();
    if (res.ok && result && result.ok) {
      showSettingsAlert(`🎉 ${result.message || "Connection successful!"}`, "success", 8000);
      await loadBrokerSettings();
      if (typeof loadStatus === "function") {
        await loadStatus();
      }
    } else {
      throw new Error(result?.message || `HTTP ${res.status}: Connection test failed.`);
    }
  } catch (err) {
    console.error("Broker test failed:", err);
    showSettingsAlert(`Connection Test Failed: ${err.message}`, "error", 10000);
  } finally {
    testBtns.forEach(btn => {
      if (btn) {
        btn.disabled = false;
        if (btn.dataset.prevHtml) btn.innerHTML = btn.dataset.prevHtml;
      }
    });
  }
}

function initBrokerSettingsControls() {
  // Radio switcher click & change handlers
  const radios = document.querySelectorAll('input[name="brokerSelect"]');
  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      document.querySelectorAll(".broker-card-radio").forEach(card => {
        if (card.getAttribute("data-broker") === radio.value) {
          card.classList.add("active");
        } else {
          card.classList.remove("active");
        }
      });
    });
  });

  // Broker cards click handler
  document.querySelectorAll(".broker-card-radio").forEach(card => {
    card.addEventListener("click", () => {
      const radio = card.querySelector('input[name="brokerSelect"]');
      if (radio && !radio.checked) {
        radio.checked = true;
        radio.dispatchEvent(new Event("change"));
      }
    });
  });

  // Action buttons
  const saveBtn = document.getElementById("btnSaveAllSettings");
  const saveBtnBottom = document.getElementById("btnSaveAllSettingsBottom");
  if (saveBtn) saveBtn.addEventListener("click", saveBrokerSettings);
  if (saveBtnBottom) saveBtnBottom.addEventListener("click", saveBrokerSettings);

  const testBtn = document.getElementById("btnTestBrokerConn");
  const testBtnBottom = document.getElementById("btnTestBrokerConnBottom");
  if (testBtn) testBtn.addEventListener("click", testActiveBrokerConnection);
  if (testBtnBottom) testBtnBottom.addEventListener("click", testActiveBrokerConnection);

  // Initial load of settings if on page
  loadBrokerSettings();
}

/* ==========================================================================
   🛠️ Quant Institutional Tools & Alpha Desks Engine
   ========================================================================== */

let currentActiveToolSubtab = "toolAbsorptionView";

function initQuantTools() {
  // Subtab switching
  const subtabBtns = document.querySelectorAll(".tool-subtab-btn");
  subtabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      if (!targetId) return;

      subtabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      document.querySelectorAll(".tool-subview").forEach(view => {
        view.classList.remove("active");
        view.style.display = "none";
      });

      const targetView = document.getElementById(targetId);
      if (targetView) {
        targetView.classList.add("active");
        targetView.style.display = "block";
      }

      currentActiveToolSubtab = targetId;
      loadActiveTool();
    });
  });

  // Refresh button
  const btnRefresh = document.getElementById("btnRefreshActiveTool");
  if (btnRefresh) {
    btnRefresh.addEventListener("click", () => loadActiveTool(true));
  }

  // Delivery Absorption filter controls
  const toolAbsMinDeliv = document.getElementById("toolAbsMinDeliv");
  const toolAbsMaxRange = document.getElementById("toolAbsMaxRange");
  const toolAbsTopN = document.getElementById("toolAbsTopN");

  if (toolAbsMinDeliv) toolAbsMinDeliv.addEventListener("change", () => loadToolsAbsorption());
  if (toolAbsMaxRange) toolAbsMaxRange.addEventListener("change", () => loadToolsAbsorption());
  if (toolAbsTopN) toolAbsTopN.addEventListener("change", () => loadToolsAbsorption());

  // Vol Spread index selector
  const toolVolIndexSelect = document.getElementById("toolVolIndexSelect");
  if (toolVolIndexSelect) toolVolIndexSelect.addEventListener("change", () => loadToolsVolSpread());

  // Trap Detector index selector
  const toolTrapIndexSelect = document.getElementById("toolTrapIndexSelect");
  if (toolTrapIndexSelect) toolTrapIndexSelect.addEventListener("change", () => loadToolsTrapDetector());

  // AVWAP index selector
  const toolAvwapIndexSelect = document.getElementById("toolAvwapIndexSelect");
  if (toolAvwapIndexSelect) toolAvwapIndexSelect.addEventListener("change", () => loadToolsAvwap());
}

function loadActiveTool(force = false) {
  if (currentActiveToolSubtab === "toolAbsorptionView") {
    loadToolsAbsorption();
  } else if (currentActiveToolSubtab === "toolVolSpreadView") {
    loadToolsVolSpread();
  } else if (currentActiveToolSubtab === "toolTrapDetectorView") {
    loadToolsTrapDetector();
  } else if (currentActiveToolSubtab === "toolAvwapView") {
    loadToolsAvwap();
  }
}

// Tool 1: Delivery Absorption Scanner
async function loadToolsAbsorption() {
  const tbody = document.getElementById("toolAbsTableBody");
  const dateBadge = document.getElementById("toolAbsDateBadge");
  const minDeliv = document.getElementById("toolAbsMinDeliv")?.value || "50";
  const maxRange = document.getElementById("toolAbsMaxRange")?.value || "2.5";
  const topN = document.getElementById("toolAbsTopN")?.value || "30";

  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--text-muted);"><div class="loading-spinner" style="display:inline-block; margin-right:8px;"></div> Scanning 25-day NSE Delivery Bhavcopy archives...</td></tr>`;
  }

  try {
    const res = await fetch(`/api/tools/absorption?minDelivery=${minDeliv}&maxRange=${maxRange}&topN=${topN}`);
    const data = await res.json();
    const records = data.records || data.data || [];
    const isOk = data.ok === true || data.status === "success";

    if (!isOk || records.length === 0) {
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--text-muted);">No absorption candidates matched current filters. Try lowering Min Delivery % or increasing Max Range %.</td></tr>`;
      }
      if (dateBadge && (data.date || data.bhav_date)) {
        dateBadge.textContent = `Bhavcopy Date: ${data.date || data.bhav_date}`;
      }
      return;
    }

    if (dateBadge) {
      const bDate = data.date || data.bhav_date || "--";
      const totalScanned = data.totalScanned || data.scanned || records.length;
      dateBadge.textContent = `Bhavcopy Date: ${bDate} (${records.length} matches from ${totalScanned} scanned)`;
    }

    if (tbody) {
      tbody.innerHTML = records.map(item => {
        const score = Number(item.absorptionScore ?? item.absorption_score ?? 0);
        const delivPct = Number(item.deliveryPct ?? item.deliv_pct ?? 0);
        const spikeFactor = Number(item.spikeFactor ?? item.deliv_spike_20d ?? 1.0);
        const rangePct = Number(item.rangePct ?? item.range_pct ?? 0);
        const conviction = String(item.conviction || "MODERATE").toUpperCase();

        let scoreColor = "#94a3b8";
        if (score >= 200 || score >= 80) scoreColor = "#ef4444";
        else if (score >= 120 || score >= 70) scoreColor = "#f59e0b";
        else if (score >= 60) scoreColor = "#10b981";

        let convBadge = `<span class="badge" style="background:rgba(148,163,184,0.15); color:#94a3b8; font-weight:700;">NORMAL</span>`;
        if (conviction.includes("EXTREME") || conviction.includes("VERY HIGH")) {
          convBadge = `<span class="badge" style="background:rgba(239,68,68,0.2); color:#ef4444; border:1px solid rgba(239,68,68,0.4); font-weight:800;">🔥 ${conviction}</span>`;
        } else if (conviction.includes("HIGH")) {
          convBadge = `<span class="badge" style="background:rgba(245,158,11,0.2); color:#f59e0b; border:1px solid rgba(245,158,11,0.4); font-weight:700;">HIGH</span>`;
        } else if (conviction.includes("MODERATE")) {
          convBadge = `<span class="badge" style="background:rgba(16,185,129,0.2); color:#10b981; border:1px solid rgba(16,185,129,0.4); font-weight:700;">MODERATE</span>`;
        }

        const signalLabel = (item.signal || "Institutional Flow").replace(/_/g, " ");

        return `
          <tr>
            <td><strong style="color:var(--text-primary); font-size:13px;">${item.symbol}</strong></td>
            <td style="font-family:monospace;">₹${Number(item.close).toFixed(2)}</td>
            <td><span class="badge badge-green" style="font-weight:700;">${delivPct.toFixed(1)}%</span></td>
            <td style="font-family:monospace; font-weight:600; color:${spikeFactor >= 1.5 ? '#f59e0b' : 'inherit'};">${spikeFactor.toFixed(1)}x</td>
            <td><span style="color:#38bdf8; font-weight:600;">${rangePct.toFixed(2)}%</span></td>
            <td><b style="color:${scoreColor}; font-size:14px; font-family:monospace;">${score.toFixed(1)}</b></td>
            <td>${convBadge}</td>
            <td><span style="font-size:11px; color:var(--text-secondary);">${signalLabel}</span></td>
          </tr>
        `;
      }).join("");
    }
  } catch (err) {
    console.error("Error loading delivery absorption:", err);
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:24px; color:#ef4444;">Failed to load delivery absorption data: ${err.message}</td></tr>`;
    }
  }
}

// Tool 2: VIX vs ATM IV Spread
async function loadToolsVolSpread() {
  const select = document.getElementById("toolVolIndexSelect");
  const sym = select ? select.value : "nifty50";

  const atmIvEl = document.getElementById("toolVolAtmIv");
  const vixEl = document.getElementById("toolVolIndiaVix");
  const spreadEl = document.getElementById("toolVolSpreadVal");
  const regimeEl = document.getElementById("toolVolRegimeBadge");
  const dailyMoveEl = document.getElementById("toolVolDailyMove");
  const rationaleEl = document.getElementById("toolVolRationale");
  const recListEl = document.getElementById("toolVolRecList");

  try {
    const res = await fetch(`/api/tools/vol-spread?index=${encodeURIComponent(sym)}`);
    const data = await res.json();
    if (!data || (data.ok !== true && data.status !== "success")) return;

    const atmIv = Number(data.atmIv ?? data.atm_iv ?? 14.5);
    const indiaVix = Number(data.indiaVix ?? data.india_vix ?? 12.8);
    const volSpread = Number(data.volSpread ?? data.vol_spread ?? 0.0);
    const spreadPct = Number(data.spreadRatio ? (data.spreadRatio - 1) * 100 : (data.vol_spread_pct ?? 0.0));
    const regimeLabel = data.regimeLabel || data.regime_label || "Normal Volatility";
    const regimeCode = data.regime || "FAIR_VALUE";
    const expectedDailyPts = Number(data.dailyExpectedMovePts ?? data.expected_daily_pts ?? 0.0);
    const spot = Number(data.spot ?? data.spot_price ?? 24800.0);
    const strategies = data.recommendations || data.strategies || [];

    if (atmIvEl) atmIvEl.textContent = `${atmIv.toFixed(2)}%`;
    if (vixEl) vixEl.textContent = `${indiaVix.toFixed(2)}%`;

    if (spreadEl) {
      const sign = volSpread > 0 ? "+" : "";
      const pctSign = spreadPct > 0 ? "+" : "";
      spreadEl.textContent = `${sign}${volSpread.toFixed(2)}% (${pctSign}${spreadPct.toFixed(1)}%)`;
      if (volSpread > 1.5) {
        spreadEl.style.color = "#ef4444";
      } else if (volSpread < -1.0) {
        spreadEl.style.color = "#10b981";
      } else {
        spreadEl.style.color = "#38bdf8";
      }
    }

    if (regimeEl) {
      let badgeStyle = "background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.3);";
      if (regimeCode.includes("OVERPRICED") || regimeCode.includes("BLOATED")) {
        badgeStyle = "background:rgba(239,68,68,0.15); color:#ef4444; border:1px solid rgba(239,68,68,0.3);";
      } else if (regimeCode.includes("CHEAP") || regimeCode.includes("UNDERPRICED")) {
        badgeStyle = "background:rgba(16,185,129,0.15); color:#10b981; border:1px solid rgba(16,185,129,0.3);";
      }
      regimeEl.innerHTML = `<span style="display:inline-block; padding:3px 10px; border-radius:4px; font-weight:700; font-size:13px; ${badgeStyle}">${regimeLabel}</span>`;
    }

    if (dailyMoveEl) {
      dailyMoveEl.textContent = `Expected 1D Move: ±${expectedDailyPts.toFixed(1)} pts (Spot: ₹${Math.round(spot).toLocaleString()})`;
    }

    if (rationaleEl) {
      rationaleEl.textContent = data.rationale || "Options pricing analysis updated.";
    }

    if (recListEl && Array.isArray(strategies)) {
      recListEl.innerHTML = strategies.map(s => {
        const title = s.strategy || s.name || "Option Strategy";
        const edgeText = s.edge || "";
        const biasText = s.bias || s.action || "STRATEGY";

        let actionStyle = "background:rgba(56,189,248,0.2); color:#38bdf8;";
        if (biasText.toUpperCase().includes("SELL") || biasText.toUpperCase().includes("SHORT") || biasText.toUpperCase().includes("THETA")) {
          actionStyle = "background:rgba(239,68,68,0.2); color:#ef4444;";
        } else if (biasText.toUpperCase().includes("BUY") || biasText.toUpperCase().includes("LONG") || biasText.toUpperCase().includes("GAMMA")) {
          actionStyle = "background:rgba(16,185,129,0.2); color:#10b981;";
        }

        return `
          <div class="vol-rec-item" style="padding:10px 14px; background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:6px; margin-bottom:8px; display:flex; align-items:flex-start; gap:12px;">
            <span class="badge" style="${actionStyle}; font-weight:800; font-size:11px; padding:4px 8px; border-radius:4px; white-space:nowrap;">${biasText}</span>
            <div>
              <strong style="color:var(--text-primary); font-size:13px;">${title}</strong>
              <p style="margin:2px 0 0; color:var(--text-secondary); font-size:12px;">${edgeText}</p>
            </div>
          </div>
        `;
      }).join("");
    }
  } catch (err) {
    console.error("Error loading Vol Spread:", err);
  }
}

// Tool 3: Spot Velocity vs OI Trap Wall Detector
async function loadToolsTrapDetector() {
  const select = document.getElementById("toolTrapIndexSelect");
  const sym = select ? select.value : "nifty50";

  const badgeEl = document.getElementById("toolTrapStatusBadge");
  const actionEl = document.getElementById("toolTrapActionSignal");
  const descEl = document.getElementById("toolTrapDesc");
  const fillEl = document.getElementById("toolTrapScoreFill");
  const scoreTextEl = document.getElementById("toolTrapScoreText");

  const callWallStrike = document.getElementById("toolCallWallStrike");
  const callWallOi = document.getElementById("toolCallWallOi");
  const putWallStrike = document.getElementById("toolPutWallStrike");
  const putWallOi = document.getElementById("toolPutWallOi");

  const velEl = document.getElementById("toolSpotVelocity");
  const callOiChgEl = document.getElementById("toolTotalCallOiChg");
  const putOiChgEl = document.getElementById("toolTotalPutOiChg");

  try {
    const res = await fetch(`/api/tools/trap-detector`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index: sym, symbol: sym })
    });
    const data = await res.json();
    if (!data || (data.ok !== true && data.status !== "success")) return;

    const trapStatus = data.trapStatus || data.trap_type || "STABLE FLOW";
    const trapDesc = data.trapDesc || data.trap_alert || "Order flow is in equilibrium.";
    const actionSignal = data.actionSignal || data.recommended_action || "RANGE_BOUND";
    const trapScore = Math.max(Number(data.bullTrapScore || 0), Number(data.bearTrapScore || 0), Number(data.trap_conviction || 0));

    const callWall = data.majorCallWall || data.major_call_wall || {};
    const putWall = data.majorPutWall || data.major_put_wall || {};

    const vel = Number(data.priceVelocityPct ?? data.price_velocity_15m ?? 0.0);
    const callChg = Number(data.totalCallOiChange ?? data.call_oi_change ?? 0);
    const putChg = Number(data.totalPutOiChange ?? data.put_oi_change ?? 0);

    if (badgeEl) {
      badgeEl.textContent = trapStatus;
      if (trapStatus.includes("BULL TRAP")) {
        badgeEl.style.background = "rgba(239,68,68,0.2)";
        badgeEl.style.color = "#ef4444";
        badgeEl.style.border = "1px solid rgba(239,68,68,0.4)";
      } else if (trapStatus.includes("BEAR TRAP")) {
        badgeEl.style.background = "rgba(16,185,129,0.2)";
        badgeEl.style.color = "#10b981";
        badgeEl.style.border = "1px solid rgba(16,185,129,0.4)";
      } else {
        badgeEl.style.background = "rgba(56,189,248,0.2)";
        badgeEl.style.color = "#38bdf8";
        badgeEl.style.border = "1px solid rgba(56,189,248,0.4)";
      }
    }

    if (actionEl) actionEl.textContent = actionSignal;
    if (descEl) descEl.textContent = trapDesc;

    if (fillEl) {
      const scoreClamped = Math.max(0, Math.min(100, trapScore));
      fillEl.style.width = `${scoreClamped}%`;
      if (scoreClamped >= 70) {
        fillEl.style.background = "linear-gradient(90deg, #f59e0b, #ef4444)";
      } else if (scoreClamped >= 40) {
        fillEl.style.background = "linear-gradient(90deg, #10b981, #f59e0b)";
      } else {
        fillEl.style.background = "#3b82f6";
      }
    }

    if (scoreTextEl) {
      scoreTextEl.textContent = `Trap Conviction Score: ${trapScore}/100`;
    }

    if (callWallStrike) {
      callWallStrike.textContent = callWall.strike ? `₹${Number(callWall.strike).toLocaleString()}` : "--";
    }
    if (callWallOi) {
      callWallOi.textContent = `OI: ${Number(callWall.oi || 0).toLocaleString()} contracts`;
    }

    if (putWallStrike) {
      putWallStrike.textContent = putWall.strike ? `₹${Number(putWall.strike).toLocaleString()}` : "--";
    }
    if (putWallOi) {
      putWallOi.textContent = `OI: ${Number(putWall.oi || 0).toLocaleString()} contracts`;
    }

    if (velEl) {
      velEl.textContent = `${vel > 0 ? "+" : ""}${vel.toFixed(2)}%`;
      velEl.style.color = vel >= 0 ? "#10b981" : "#ef4444";
    }

    if (callOiChgEl) {
      callOiChgEl.textContent = `${callChg > 0 ? "+" : ""}${Number(callChg).toLocaleString()}`;
      callOiChgEl.style.color = callChg >= 0 ? "#ef4444" : "#10b981";
    }

    if (putOiChgEl) {
      putOiChgEl.textContent = `${putChg > 0 ? "+" : ""}${Number(putChg).toLocaleString()}`;
      putOiChgEl.style.color = putChg >= 0 ? "#10b981" : "#ef4444";
    }

  } catch (err) {
    console.error("Error loading Trap Detector:", err);
  }
}

// Tool 4: Auto-Anchored VWAP Engine
async function loadToolsAvwap() {
  const select = document.getElementById("toolAvwapIndexSelect");
  const sym = select ? select.value : "nifty50";

  const highVal = document.getElementById("toolAvwapHighVal");
  const highTime = document.getElementById("toolAvwapHighTime");
  const highBands = document.getElementById("toolAvwapHighBands");

  const lowVal = document.getElementById("toolAvwapLowVal");
  const lowTime = document.getElementById("toolAvwapLowTime");
  const lowBands = document.getElementById("toolAvwapLowBands");

  const sessVal = document.getElementById("toolAvwapSessionVal");
  const sessTime = document.getElementById("toolAvwapSessionTime");
  const sessBands = document.getElementById("toolAvwapSessionBands");

  const pinchBadge = document.getElementById("toolAvwapPinchBadge");
  const spreadPts = document.getElementById("toolAvwapSpreadPts");
  const pinchDesc = document.getElementById("toolAvwapPinchDesc");

  const buyerStatus = document.getElementById("toolAvwapBuyerStatus");
  const sellerStatus = document.getElementById("toolAvwapSellerStatus");

  try {
    const res = await fetch(`/api/tools/avwap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index: sym, symbol: sym })
    });
    const data = await res.json();
    if (!data || (data.ok !== true && data.status !== "success")) return;

    const sh = data.highAnchor || (data.anchors && data.anchors.swing_high);
    const sl = data.lowAnchor || (data.anchors && data.anchors.swing_low);
    const so = data.sessionAnchor || (data.anchors && data.anchors.session_open);

    if (highVal && sh) {
      const v = sh.currentAvwap ?? sh.avwap;
      highVal.textContent = v ? `₹${Number(v).toFixed(1)}` : "--";
    }
    if (highTime && sh) {
      const p = sh.high ?? sh.price ?? 0;
      highTime.textContent = `Anchor Peak: ₹${Number(p).toFixed(1)} (${sh.time || "--"})`;
    }
    if (highBands && sh && sh.bands) {
      const u1 = sh.bands.upper1 ?? sh.upper_band_1 ?? 0;
      const l1 = sh.bands.lower1 ?? sh.lower_band_1 ?? 0;
      highBands.textContent = `+1σ: ₹${Number(u1).toFixed(1)} | -1σ: ₹${Number(l1).toFixed(1)}`;
    }

    if (lowVal && sl) {
      const v = sl.currentAvwap ?? sl.avwap;
      lowVal.textContent = v ? `₹${Number(v).toFixed(1)}` : "--";
    }
    if (lowTime && sl) {
      const p = sl.low ?? sl.price ?? 0;
      lowTime.textContent = `Anchor Low: ₹${Number(p).toFixed(1)} (${sl.time || "--"})`;
    }
    if (lowBands && sl && sl.bands) {
      const u1 = sl.bands.upper1 ?? sl.upper_band_1 ?? 0;
      const l1 = sl.bands.lower1 ?? sl.lower_band_1 ?? 0;
      lowBands.textContent = `+1σ: ₹${Number(u1).toFixed(1)} | -1σ: ₹${Number(l1).toFixed(1)}`;
    }

    if (sessVal && so) {
      const v = so.currentAvwap ?? so.avwap;
      sessVal.textContent = v ? `₹${Number(v).toFixed(1)}` : "--";
    }
    if (sessTime && so) {
      sessTime.textContent = `Session Open (09:15)`;
    }
    if (sessBands && so && so.bands) {
      const u1 = so.bands.upper1 ?? so.upper_band_1 ?? 0;
      const l1 = so.bands.lower1 ?? so.lower_band_1 ?? 0;
      sessBands.textContent = `+1σ: ₹${Number(u1).toFixed(1)} | -1σ: ₹${Number(l1).toFixed(1)}`;
    }

    const pinchLabel = data.pinchStatus || data.squeeze_label || "NORMAL CONVERGENCE";
    const spreadVal = Number(data.spreadPts ?? data.pinch_spread_pts ?? 0.0);
    const isPinch = Boolean(data.isPinch ?? data.is_pinched);

    if (pinchBadge) {
      let bStyle = "background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.3);";
      if (isPinch || pinchLabel.includes("PINCH") || pinchLabel.includes("SQUEEZE")) {
        bStyle = "background:rgba(239,68,68,0.2); color:#ef4444; border:1px solid rgba(239,68,68,0.4); animation: pulse 1.5s infinite;";
      }
      pinchBadge.innerHTML = `<span style="display:inline-block; padding:3px 10px; border-radius:4px; font-weight:700; font-size:13px; ${bStyle}">${pinchLabel}</span>`;
    }

    if (spreadPts) {
      spreadPts.textContent = `High-Low AVWAP Spread: ${spreadVal.toFixed(1)} pts`;
    }

    if (pinchDesc) {
      pinchDesc.textContent = data.pinchDesc || data.squeeze_description || "AVWAP calculated.";
    }

    const bStatus = data.buyerStatus || data.buyer_status || "--";
    const sStatus = data.sellerStatus || data.seller_status || "--";

    if (buyerStatus) {
      buyerStatus.textContent = bStatus;
      buyerStatus.style.color = bStatus.includes("Profit") || bStatus.includes("PROFIT") ? "#10b981" : "#ef4444";
    }

    if (sellerStatus) {
      sellerStatus.textContent = sStatus;
      sellerStatus.style.color = sStatus.includes("Profit") || sStatus.includes("PROFIT") ? "#10b981" : "#ef4444";
    }

  } catch (err) {
    console.error("Error loading AVWAP:", err);
  }
}

// Auto-initialize ticker, settings, and quant tools controls on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initMarketTickerTape();
    initBrokerSettingsControls();
    initQuantTools();
    initInstNavState();
  });
} else {
  initMarketTickerTape();
  initBrokerSettingsControls();
  initQuantTools();
  initInstNavState();
}

/* ==========================================================================
   INSTITUTIONAL NAVIGATION ROUTER
   Maps the new mega-menu nav to the existing tab panel system
   ========================================================================== */

// Map of instNav keys → which old switchTab() key they correspond to
const INST_NAV_MAP = {
  dashboard:  null,          // new dashboard panel
  breadth:    "breadth",
  futures:    "breadth",     // Futures → Market Breadth panel
  options:    "options",
  analytics:  "breadth",
  smartmoney: "smartMoney",
  fiidii:     "smartMoney",
  mtf:        "mtf",
  delivery:   "delivery",
  tools:      "tools",
  settings:   "settings",
  resources:  "tools",
};

// All institutional nav buttons
const INST_NAV_BTN_IDS = [
  "navDashboard", "navFutures", "navOptions", "navAnalytics",
  "navFiiDii", "navMtf", "navDelivery", "navResources"
];

// Map from old tab key → which inst-nav-btn to highlight
const INST_NAV_ACTIVE_MAP = {
  dashboard:   "navDashboard",
  breadth:     "navAnalytics",
  futures:     "navFutures",
  options:     "navOptions",
  smartMoney:  "navFiiDii",
  mtf:         "navMtf",
  delivery:    "navDelivery",
  tools:       "navResources",
  settings:    "navResources",
};

function instNav(key) {
  const panelDashboard = document.getElementById("panelDashboard");

  // Clear all inst-nav-btn active states
  INST_NAV_BTN_IDS.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.classList.remove("active");
  });

  if (key === "dashboard") {
    // Show dashboard panel, hide all others
    const allPanels = document.querySelectorAll(".tab-panel");
    allPanels.forEach(p => {
      p.classList.remove("active");
      p.style.display = "none";
    });
    if (panelDashboard) {
      panelDashboard.classList.add("active");
      panelDashboard.style.display = "block";
    }
    const navBtn = document.getElementById("navDashboard");
    if (navBtn) navBtn.classList.add("active");
  } else {
    // Hide dashboard, route to existing panel via switchTab()
    if (panelDashboard) {
      panelDashboard.classList.remove("active");
      panelDashboard.style.display = "none";
    }
    const tabKey = INST_NAV_MAP[key] || key;
    if (tabKey && typeof switchTab === "function") {
      switchTab(tabKey);
    }
    // Highlight the matching inst-nav-btn
    const activeBtnId = INST_NAV_ACTIVE_MAP[tabKey] || INST_NAV_ACTIVE_MAP[key];
    if (activeBtnId) {
      const btn = document.getElementById(activeBtnId);
      if (btn) btn.classList.add("active");
    }
  }
}

async function loadDashboardMacroRibbon() {
  try {
    const res = await fetch("/api/global-markets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    if (!res.ok) return;
    const data = await res.json();
    const hm = data.headlineMetrics || {};
    if (hm.giftNifty) {
      const el = document.getElementById("macroGiftNifty");
      const chg = document.getElementById("macroGiftChg");
      if (el && hm.giftNifty.ltp) el.textContent = hm.giftNifty.ltp.toLocaleString("en-IN", { minimumFractionDigits: 2 });
      if (chg && hm.giftNifty.changePct !== undefined) {
        chg.textContent = (hm.giftNifty.changePct >= 0 ? "+" : "") + hm.giftNifty.changePct + "%";
        chg.className = "mp-chg " + (hm.giftNifty.changePct >= 0 ? "positive" : "negative");
      }
    }
    if (hm.brentCrude) {
      const el = document.getElementById("macroBrent");
      const chg = document.getElementById("macroBrentChg");
      if (el && hm.brentCrude.ltp) el.textContent = hm.brentCrude.ltp.toFixed(2);
      if (chg && hm.brentCrude.changePct !== undefined) {
        chg.textContent = (hm.brentCrude.changePct >= 0 ? "+" : "") + hm.brentCrude.changePct + "%";
        chg.className = "mp-chg " + (hm.brentCrude.changePct >= 0 ? "positive" : "negative");
      }
    }
    if (hm.gold) {
      const el = document.getElementById("macroGold");
      const chg = document.getElementById("macroGoldChg");
      if (el && hm.gold.ltp) el.textContent = hm.gold.ltp.toLocaleString("en-IN", { minimumFractionDigits: 2 });
      if (chg && hm.gold.changePct !== undefined) {
        chg.textContent = (hm.gold.changePct >= 0 ? "+" : "") + hm.gold.changePct + "%";
        chg.className = "mp-chg " + (hm.gold.changePct >= 0 ? "positive" : "negative");
      }
    }
    if (hm.us10y) {
      const el = document.getElementById("macroUs10y");
      const chg = document.getElementById("macroUs10yChg");
      if (el && hm.us10y.ltp) el.textContent = hm.us10y.ltp.toFixed(2) + "%";
      if (chg && hm.us10y.changePct !== undefined) {
        chg.textContent = (hm.us10y.changePct >= 0 ? "+" : "") + hm.us10y.changePct + "%";
        chg.className = "mp-chg " + (hm.us10y.changePct >= 0 ? "positive" : "negative");
      }
    }
    if (hm.dxy) {
      const el = document.getElementById("macroDxy");
      const chg = document.getElementById("macroDxyChg");
      if (el && hm.dxy.ltp) el.textContent = hm.dxy.ltp.toFixed(2);
      if (chg && hm.dxy.changePct !== undefined) {
        chg.textContent = (hm.dxy.changePct >= 0 ? "+" : "") + hm.dxy.changePct + "%";
        chg.className = "mp-chg " + (hm.dxy.changePct >= 0 ? "positive" : "negative");
      }
    }
    if (hm.btc) {
      const el = document.getElementById("macroBtc");
      const chg = document.getElementById("macroBtcChg");
      if (el && hm.btc.ltp) el.textContent = "$" + hm.btc.ltp.toLocaleString("en-IN");
      if (chg && hm.btc.changePct !== undefined) {
        chg.textContent = (hm.btc.changePct >= 0 ? "+" : "") + hm.btc.changePct + "%";
        chg.className = "mp-chg " + (hm.btc.changePct >= 0 ? "positive" : "negative");
      }
    }
  } catch(e) {
    console.warn("Macro ribbon load failed:", e);
  }
}

function initInstNavState() {
  // On initial load, show dashboard
  const panelDashboard = document.getElementById("panelDashboard");
  // Hide all existing panels first
  const allPanels = document.querySelectorAll(".tab-panel");
  allPanels.forEach(p => {
    if (p.id !== "panelDashboard") {
      p.classList.remove("active");
      p.style.display = "none";
    }
  });
  if (panelDashboard) {
    panelDashboard.classList.add("active");
    panelDashboard.style.display = "block";
  }
  // Activate the Dashboard nav button
  const navDash = document.getElementById("navDashboard");
  if (navDash) navDash.classList.add("active");

  // Load Macro ribbon data
  loadDashboardMacroRibbon();
}

// Expose instNav globally
window.instNav = instNav;
