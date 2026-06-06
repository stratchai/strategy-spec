#!/usr/bin/env node
require("dotenv").config();
const fs = require("fs");
const path = require("path");

function loadSpec(specPath) {
  const raw = fs.readFileSync(specPath, "utf8");
  return JSON.parse(raw);
}

// Returns true if any rule in the spec references the squeeze indicator.
function hasSqueezeIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "squeeze"));
}

// Returns true if any rule references opening_range. Unlike other indicators
// this one is STATEFUL — it needs per-day session tracking (reset at ET
// session open, accumulate range for the first N bars, then expose
// aboveHigh/belowLow predicates). State lives in module-level closure vars
// of the generated strategy.js.
function hasOpeningRangeIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "opening_range"));
}

// Returns true if any rule in the spec references the vwap indicator.
function hasVwapIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "vwap"));
}

// Returns true if any rule in the spec references the engulfing indicator.
function hasEngulfingIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "engulfing"));
}

// Returns true if any rule in the spec references the morningStar indicator.
function hasMorningStarIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "morningStar"));
}

// Returns true if any rule in the spec references the doubleBottom indicator.
function hasDoubleBottomIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "doubleBottom"));
}

// Returns true if any rule in the spec references the cupAndHandle indicator.
function hasCupAndHandleIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "cupAndHandle"));
}

// Returns true if any rule in the spec references the mass_index indicator.
function hasMassIndexIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "mass_index"));
}

// Returns true if any rule in the spec references the aroon indicator.
function hasAroonIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "aroon"));
}

// Returns true if any rule in the spec references the adx indicator.
function hasAdxIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "adx"));
}

// Returns true if any rule in the spec references the supertrend indicator.
function hasSupertrendIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "supertrend"));
}

// Returns true if any rule in the spec references the obv indicator.
function hasObvIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "obv"));
}

// Returns true if any rule in the spec references the psar indicator.
function hasPsarIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "psar"));
}

// Returns true if any rule in the spec references the alligator indicator.
function hasAlligatorIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "alligator"));
}

// Returns true if any rule in the spec references the ao (awesome oscillator) indicator.
function hasAoIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "ao"));
}

// Returns true if any rule in the spec references the roc indicator.
function hasRocIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "roc"));
}

// Returns true if any rule in the spec references the keltner indicator.
function hasKeltnerIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "keltner"));
}

// Returns true if any rule in the spec references the mfi indicator.
function hasMfiIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "mfi"));
}

// Returns true if any rule in the spec references the cmf indicator.
function hasCmfIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "cmf"));
}

// Returns true if any rule in the spec references the donchian indicator.
function hasDonchianIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "donchian"));
}

// Returns true if any rule in the spec references the hma indicator.
function hasHmaIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "hma"));
}

// Returns true if any rule in the spec references the week52 indicator.
function hasWeek52Indicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "week52"));
}

// Returns true if any rule in the spec references the pivot indicator.
function hasPivotIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "pivot"));
}

// Returns true if any rule in the spec references the fib indicator.
function hasFibIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "fib"));
}

// Returns true if any rule in the spec references the ichimoku indicator.
function hasIchimokuIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "ichimoku"));
}

// Returns true if any rule references the event_score (macro_regime composite) indicator.
// Used to conditionally emit the macro_regime.json reader at strategy step time.
function hasEventScoreIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "event_score"));
}

function hasAscendingTriangleIndicator(spec) {
  const allRules = [...(spec.entry_rules || []), ...(spec.exit_rules || [])];
  return allRules.some(r => (r.when || []).some(c => c.indicator === "ascendingTriangle"));
}

function generateStrategyCode(spec) {
  const hasSqueeze       = hasSqueezeIndicator(spec);
  const hasVwap          = hasVwapIndicator(spec);
  const hasEngulfing     = hasEngulfingIndicator(spec);
  const hasMorningStar   = hasMorningStarIndicator(spec);
  const hasDoubleBottom  = hasDoubleBottomIndicator(spec);
  const hasCupAndHandle  = hasCupAndHandleIndicator(spec);
  const hasMassIndex     = hasMassIndexIndicator(spec);
  const hasAroon         = hasAroonIndicator(spec);
  const hasAdx           = hasAdxIndicator(spec);
  const hasSupertrend    = hasSupertrendIndicator(spec);
  const hasObv           = hasObvIndicator(spec);
  const hasPsar          = hasPsarIndicator(spec);
  const hasAlligator     = hasAlligatorIndicator(spec);
  const hasAo            = hasAoIndicator(spec);
  const hasRoc           = hasRocIndicator(spec);
  const hasKeltner       = hasKeltnerIndicator(spec);
  const hasMfi           = hasMfiIndicator(spec);
  const hasCmf           = hasCmfIndicator(spec);
  const hasDonchian      = hasDonchianIndicator(spec);
  const hasHma           = hasHmaIndicator(spec);
  const hasWeek52        = hasWeek52Indicator(spec);
  const hasPivot         = hasPivotIndicator(spec);
  const hasFib           = hasFibIndicator(spec);
  const hasIchimoku            = hasIchimokuIndicator(spec);
  const hasAscendingTriangle   = hasAscendingTriangleIndicator(spec);
  const hasOpeningRange        = hasOpeningRangeIndicator(spec);

  // Auto-gen notice prepended to every emitted strategy_*.js so anyone who
  // opens the file in an IDE knows their edits will be overwritten on next
  // rebuild and can find the source spec without grep archaeology.
  const autogen = `// AUTO-GENERATED from specs/${spec.name}.json by src/tools/build/strategy_from_spec.js\n// DO NOT EDIT — your changes will be overwritten on the next rebuild.\n\n`;

  const header = spec.description
    ? `/**\n${spec.description.trim().split("\n").map(l => ` * ${l}`).join("\n")}\n */\n\n`
    : "";

  return `${autogen}${header}const { calcVolIndex, calcBollingerBands, calcSMA, calcRSI, calcATR, calcATRExpansion, calcEMA, calcMACD, calcStochastic, calcTrendStructure, calcFlagPattern, calcCandlePattern, calcHammer${hasVwap ? ", calcVWAP" : ""}${hasEngulfing ? ", calcEngulfing" : ""}${hasMorningStar ? ", calcMorningStar" : ""}${hasDoubleBottom ? ", calcDoubleBottom" : ""}${hasCupAndHandle ? ", calcCupAndHandle" : ""}${hasMassIndex ? ", calcMassIndex" : ""}${hasAroon ? ", calcAroon" : ""}${hasAdx ? ", calcADX" : ""}${hasSupertrend ? ", calcSupertrend" : ""}${hasObv ? ", calcOBV" : ""}${hasPsar ? ", calcParabolicSAR" : ""}${hasAlligator ? ", calcAlligator" : ""}${hasAo ? ", calcAwesomeOscillator" : ""}${hasRoc ? ", calcROC" : ""}${hasKeltner ? ", calcKeltner" : ""}${hasMfi ? ", calcMFI" : ""}${hasCmf ? ", calcCMF" : ""}${hasDonchian ? ", calcDonchian" : ""}${hasHma ? ", calcHMA" : ""}${hasWeek52 ? ", calc52WeekHighLow" : ""}${hasPivot ? ", calcPivotPoints" : ""}${hasFib ? ", calcFibonacci" : ""}${hasIchimoku ? ", calcIchimoku" : ""}${hasAscendingTriangle ? ", calcAscendingTriangle" : ""} } = require("@stratchai/indicators");
// Library-default fallbacks for params not provided in the spec's \`params\`
// block. The spec's params take precedence (via the \`params.X ?? CONST\`
// pattern below). These literals make the generated strategy self-contained:
// only @stratchai/indicators is required at runtime.
const STOP_LOSS_PCT     = -3;       // unused in the current template; kept for forward-compat
const TAKE_PROFIT_PCT   = 6;        // unused in the current template; kept for forward-compat
const MIN_BANDWIDTH_PCT = 3;        // fallback for params.min_bw_pct
const COOLDOWN_MS       = 60_000;   // fallback for params.strategy_cooldown_ms (60s)

const _defaultParams = ${JSON.stringify(spec.params || {})};

function createStrategy(overrideParams = {}) {
  const params = { ..._defaultParams, ...overrideParams };
  const MAX_HOLD_MS = params.max_hold_ms ?? ${spec.params.max_hold_ms || 2 * 24 * 60 * 60 * 1000};
  let prevVI = null;
${hasSqueeze ? "  const bwHistory = []; // rolling bandwidth window for squeeze detection" : ""}
${hasVwap ? "  const _vwapTs = []; // per-bar timestamps for VWAP window" : ""}
${hasOpeningRange ? `  // opening_range state — tracks today's session range (ET-aware, DST-aware).
  // Resets at session-open detection (new ET date). Accumulates bar high/low
  // for first \`opening_range_bars\` bars (default 2 × 15m = 30 min). After
  // accumulation, openingRange.aboveHigh / belowLow predicates become valid.
  let _orbDayKey = null;
  let _orbRangeHigh = null;
  let _orbRangeLow = null;
  let _orbBarsCounted = 0;` : ""}

function runStrategyStep(ctx) {
  const { price, prices, highs, lows, opens, volumes, position, lastExitTime, now } = ctx;

  // --- indicator precompute ---
  const vi = calcVolIndex(prices, 1);
  const bb = calcBollingerBands(prices, 20, 2);
  const candlePattern = calcCandlePattern(opens ?? [], highs, lows, prices, { ...params, bbMiddle: bb ? bb.middle : null });

  const slowLen = params.slow_ma_len ?? 50;
  const fastLen = params.fast_ma_len ?? 20;

  const slowSMA = calcSMA(prices, slowLen);
  const fastSMA = calcSMA(prices, fastLen);

  const rsiPeriod = params.rsi_period ?? 14;
  const rsiValue = calcRSI(prices, rsiPeriod); // null until enough data

  const atrPeriod = params.atr_period ?? 14;
  const atrData = calcATRExpansion(highs, lows, prices, atrPeriod);
  const atr = atrData ? atrData.atr : null;
  const atrPct = atrData ? atrData.pct : null;
  const atrExpansion = atrData ? atrData.expansion : null;

  // EMA
  const emaFast = calcEMA(prices, params.ema_fast_len ?? 12);
  const emaSlow = calcEMA(prices, params.ema_slow_len ?? 26);
  const emaFastAboveSlow = emaFast != null && emaSlow != null && emaFast > emaSlow;
  const emaFastBelowSlow = emaFast != null && emaSlow != null && emaFast < emaSlow;
  const emaTrendUp = emaSlow != null && price > emaSlow;

  // MACD
  const macdResult = calcMACD(prices, params.macd_fast ?? 12, params.macd_slow ?? 26, params.macd_signal ?? 9);
  const macdBullish = !!(macdResult && macdResult.histogram > 0);
  const macdBearish = !!(macdResult && macdResult.histogram < 0);
  const macdAboveZero = !!(macdResult && macdResult.macd > 0);

  // Stochastic %K
  const stochK = calcStochastic(highs, lows, prices, params.stoch_period ?? 14);

  // Trend structure: higher highs / higher lows
  const trendStruct = calcTrendStructure(
    prices,
    highs,
    lows,
    {
      swing_lookback: params.swing_lookback ?? 20,
      min_swing_distance_pct: params.min_swing_distance_pct ?? 0.5,
      trend_ma_period: params.trend_ma_period ?? 50,
    }
  );

  const trendHasUptrend    = !!(trendStruct && trendStruct.hasUptrend);
  const trendHigherHigh    = !!(trendStruct && trendStruct.lastHigherHigh);
  const trendHigherLow     = !!(trendStruct && trendStruct.lastHigherLow);
  const trendBrokeHigherLow = !!(trendStruct && trendStruct.brokeHigherLow);
  const trendPriceAboveMa  = !!(trendStruct && trendStruct.priceAboveMa);

  // Candle pattern (declared above at indicator precompute)
  const candlePatternLong = !!(candlePattern && candlePattern.patternLong);

  // Flag pattern (pole + consolidation + volume-confirmed breakout)
  const flagPattern = calcFlagPattern(prices, highs, lows, {
    poleLen:    params.pole_len    ?? 5,
    flagLen:    params.flag_len    ?? 4,
    minPolePct: params.min_pole_pct ?? 0.4,
  }, volumes ?? null);
  const flagPatternFlag = !!(flagPattern && flagPattern.patternFlag);

  // Hammer candle (lower wick rejection pattern)
  const hammerResult = calcHammer(opens ?? [], highs, lows, prices, {
    wick_ratio:     params.wick_ratio     ?? 2.0,
    upper_wick_max: params.upper_wick_max ?? 0.15,
    body_top_pct:   params.body_top_pct   ?? 0.35,
  });
  const isHammer = !!(hammerResult && hammerResult.isHammer);

${hasEngulfing ? `
  // Bullish engulfing pattern (2-candle reversal)
  const engulfingResult = calcEngulfing(opens ?? [], highs, lows, prices, {
    min_body_pct:     params.min_body_pct     ?? 0.3,
    min_engulf_ratio: params.min_engulf_ratio ?? 1.0,
  });
  const isBullishEngulfing       = !!(engulfingResult && engulfingResult.isBullishEngulfing);
  const engulfingPriorBelowLower = !!(engulfingResult && bb && engulfingResult.priorClose != null && engulfingResult.priorClose <= bb.lower);
` : ""}
${hasMorningStar ? `
  // Morning star pattern (3-candle bottom reversal)
  const morningStarResult = calcMorningStar(opens ?? [], highs, lows, prices, {
    first_body_min_pct:    params.first_body_min_pct    ?? 0.5,
    star_body_max_pct:     params.star_body_max_pct     ?? 0.3,
    third_body_min_pct:    params.third_body_min_pct    ?? 0.4,
    third_penetration_pct: params.third_penetration_pct ?? 0.5,
  });
  const isMorningStar = !!(morningStarResult && morningStarResult.isMorningStar);
` : ""}
${hasDoubleBottom ? `
  // Double bottom pattern (two equal swing lows + neckline breakout)
  const doubleBottomResult = calcDoubleBottom(prices, highs, lows, {
    swing_lookback:        params.swing_lookback        ?? 5,
    trough_tolerance_pct:  params.trough_tolerance_pct  ?? 4,
    min_trough_separation: params.min_trough_separation ?? 10,
    max_trough_separation: params.max_trough_separation ?? 60,
  });
  const isDoubleBottom = !!(doubleBottomResult && doubleBottomResult.isDoubleBottom);
` : ""}
${hasCupAndHandle ? `
  // Cup and handle pattern (rounded base + handle pullback + pivot breakout)
  const cupAndHandleResult = calcCupAndHandle(prices, highs, lows, {
    cup_len_min:            params.cup_len_min            ?? 20,
    cup_len_max:            params.cup_len_max            ?? 80,
    handle_len:             params.handle_len             ?? 5,
    cup_depth_min_pct:      params.cup_depth_min_pct      ?? 10,
    cup_depth_max_pct:      params.cup_depth_max_pct      ?? 40,
    rim_tolerance_pct:      params.rim_tolerance_pct      ?? 8,
    handle_retrace_max_pct: params.handle_retrace_max_pct ?? 50,
  });
  const isCupAndHandle = !!(cupAndHandleResult && cupAndHandleResult.isCupAndHandle);
` : ""}
${hasMassIndex ? `
  // Mass Index (Dorsey 1992) — range expansion/contraction reversal detector
  const massIndexData   = calcMassIndex(highs, lows, params.mass_index_period ?? 9, params.mass_index_sum ?? 25, params.mass_index_bulge_lookback ?? 10);
  const massIndexValue  = massIndexData ? massIndexData.value : null;
  // True Dorsey bulge: MI exceeded 27 within bulgeLookback bars, then fell below 26.5
  const massIndexBulge  = massIndexData ? massIndexData.bulge : false;
` : ""}
${hasAroon ? `
  // Aroon (Chande 1995) — trend freshness: how recently was the period high/low?
  const aroonData       = calcAroon(highs, lows, params.aroon_period ?? 25);
  const aroonUp         = aroonData ? aroonData.up         : null;
  const aroonDown       = aroonData ? aroonData.down       : null;
  const aroonOscillator = aroonData ? aroonData.oscillator : null;
` : ""}
${hasAdx ? `
  // ADX (Wilder 1978) — trend strength: ADX >= 25 trending, < 20 ranging
  const adxData    = calcADX(highs, lows, prices, params.adx_period ?? 14);
  const adxValue   = adxData ? adxData.value   : null;
  const adxDiPlus  = adxData ? adxData.diPlus  : null;
  const adxDiMinus = adxData ? adxData.diMinus : null;
  const adxTrending = adxValue !== null && adxValue >= (params.adx_trending_min ?? 25);
  const adxRanging  = adxValue !== null && adxValue <  (params.adx_ranging_max  ?? 20);
  const adxBullish  = adxDiPlus !== null && adxDiMinus !== null && adxDiPlus > adxDiMinus;
  const adxBearish  = adxDiPlus !== null && adxDiMinus !== null && adxDiMinus > adxDiPlus;
` : ""}
${hasSupertrend ? `
  // Supertrend — ATR-based trend band; flips on close crossover
  const supertrendData    = calcSupertrend(highs, lows, prices, params.supertrend_period ?? 10, params.supertrend_mult ?? 3.0);
  const supertrendValue   = supertrendData ? supertrendData.value    : null;
  const supertrendBullish = supertrendData ? supertrendData.bullish  : null;
  const supertrendBearish = supertrendData ? supertrendData.bearish  : null;
  const supertrendDist    = supertrendData ? supertrendData.distance : null;
` : ""}
${hasObv ? `
  // OBV (Granville 1963) — volume confirms trend: rising OBV = accumulation
  const obvData     = calcOBV(prices, volumes ?? [], params.obv_sma_period ?? 20);
  const obvValue    = obvData ? obvData.value    : null;
  const obvRising   = obvData ? obvData.rising   : null;
  const obvSmaRatio = obvData ? obvData.smaRatio : null;
` : ""}
${hasPsar ? `
  // Parabolic SAR (Wilder 1978) — accelerating trailing stop
  const psarData    = calcParabolicSAR(highs, lows, prices, params.psar_af_step ?? 0.02, params.psar_af_max ?? 0.2);
  const psarValue   = psarData ? psarData.value   : null;
  const psarBullish = psarData ? psarData.bullish  : null;
  const psarBearish = psarData ? psarData.bearish  : null;
` : ""}
${hasAlligator ? `
  // Williams Alligator (Bill Williams 1995) — three SMMA lines: jaw/teeth/lips
  const alligatorData    = calcAlligator(prices, params.alligator_jaw_period ?? 13, params.alligator_teeth_period ?? 8, params.alligator_lips_period ?? 5);
  const alligatorJaw     = alligatorData ? alligatorData.jaw      : null;
  const alligatorTeeth   = alligatorData ? alligatorData.teeth    : null;
  const alligatorLips    = alligatorData ? alligatorData.lips     : null;
  const alligatorBullish  = alligatorData ? alligatorData.bullish  : null;
  const alligatorBearish  = alligatorData ? alligatorData.bearish  : null;
  const alligatorSleeping = alligatorData ? alligatorData.sleeping : null;
` : ""}
${hasAo ? `
  // Awesome Oscillator (Bill Williams 1995) — SMA(5,midpoint) - SMA(34,midpoint)
  const aoData     = calcAwesomeOscillator(highs, lows, params.ao_fast_period ?? 5, params.ao_slow_period ?? 34);
  const aoValue    = aoData ? aoData.value    : null;
  const aoPositive = aoData ? aoData.positive : null;
  const aoNegative = aoData ? aoData.negative : null;
  const aoRising   = aoData ? aoData.rising   : null;
  const aoFalling  = aoData ? aoData.falling  : null;
` : ""}
${hasRoc ? `
  // ROC (Rate of Change) — % price change over period bars
  const rocData        = calcROC(prices, params.roc_period ?? 14);
  const rocValue       = rocData ? rocData.value        : null;
  const rocPositive    = rocData ? rocData.positive     : null;
  const rocNegative    = rocData ? rocData.negative     : null;
  const rocAccelerating = rocData ? rocData.accelerating : null;
  const rocDecelerating = rocData ? rocData.decelerating : null;
` : ""}
${hasKeltner ? `
  // Keltner Channels — EMA ± multiplier×ATR volatility envelope
  const keltnerData   = calcKeltner(highs, lows, prices, params.keltner_period ?? 20, params.keltner_mult ?? 1.5, params.keltner_atr_period ?? 14);
  const keltnerUpper  = keltnerData ? keltnerData.upper      : null;
  const keltnerMiddle = keltnerData ? keltnerData.middle     : null;
  const keltnerLower  = keltnerData ? keltnerData.lower      : null;
  const keltnerAbove  = keltnerData ? keltnerData.priceAbove : null;
  const keltnerBelow  = keltnerData ? keltnerData.priceBelow : null;
` : ""}
${hasMfi ? `
  // MFI (Money Flow Index) — volume-weighted RSI; overbought >= 80, oversold <= 20
  const mfiData       = calcMFI(highs, lows, prices, volumes ?? [], params.mfi_period ?? 14);
  const mfiValue      = mfiData ? mfiData.value      : null;
  const mfiOverbought = mfiData ? mfiData.overbought : null;
  const mfiOversold   = mfiData ? mfiData.oversold   : null;
` : ""}
${hasCmf ? `
  // CMF (Chaikin Money Flow) — volume-weighted accumulation/distribution pressure
  const cmfData    = calcCMF(highs, lows, prices, volumes ?? [], params.cmf_period ?? 20);
  const cmfValue   = cmfData ? cmfData.value   : null;
  const cmfBullish = cmfData ? cmfData.bullish : null;
  const cmfBearish = cmfData ? cmfData.bearish : null;
` : ""}
${hasDonchian ? `
  // Donchian Channels — highest high / lowest low over period (Turtle Trading)
  const donchianData   = calcDonchian(highs, lows, prices, params.donchian_period ?? 20);
  const donchianUpper  = donchianData ? donchianData.upper      : null;
  const donchianMiddle = donchianData ? donchianData.middle     : null;
  const donchianLower  = donchianData ? donchianData.lower      : null;
  const donchianAbove  = donchianData ? donchianData.priceAbove : null;
  const donchianBelow  = donchianData ? donchianData.priceBelow : null;
` : ""}
${hasHma ? `
  // HMA (Hull Moving Average) — low-lag WMA-based trend line
  const hmaData   = calcHMA(prices, params.hma_period ?? 20);
  const hmaValue  = hmaData ? hmaData.value  : null;
  const hmaRising = hmaData ? hmaData.rising : null;
  const hmaFalling = hmaData ? hmaData.falling : null;
` : ""}
${hasWeek52 ? `
  // 52-Week High/Low — annual price extremes proximity
  const week52Data     = calc52WeekHighLow(prices, params.week52_near_pct ?? 5);
  const week52High     = week52Data ? week52Data.high52       : null;
  const week52Low      = week52Data ? week52Data.low52        : null;
  const week52PctHigh  = week52Data ? week52Data.pctFromHigh  : null;
  const week52PctLow   = week52Data ? week52Data.pctFromLow   : null;
  const week52NearHigh = week52Data ? week52Data.nearHigh     : null;
  const week52NearLow  = week52Data ? week52Data.nearLow      : null;
` : ""}
${hasPivot ? `
  // Pivot Points — classic floor-trader S/R levels from prior bar
  const pivotData       = calcPivotPoints(highs, lows, prices);
  const pivotValue      = pivotData ? pivotData.pivot       : null;
  const pivotR1         = pivotData ? pivotData.r1          : null;
  const pivotR2         = pivotData ? pivotData.r2          : null;
  const pivotS1         = pivotData ? pivotData.s1          : null;
  const pivotS2         = pivotData ? pivotData.s2          : null;
  const pivotAbove      = pivotData ? pivotData.abovePivot  : null;
  const pivotBelow      = pivotData ? pivotData.belowPivot  : null;
` : ""}
${hasFib ? `
  // Fibonacci retracement levels from prior swing high/low
  const fibData    = calcFibonacci(highs, lows, prices, params.fib_period ?? 50, params.fib_near_pct ?? 2);
  const fibHigh    = fibData ? fibData.swingHigh  : null;
  const fibLow     = fibData ? fibData.swingLow   : null;
  const fib236     = fibData ? fibData.level236   : null;
  const fib382     = fibData ? fibData.level382   : null;
  const fib500     = fibData ? fibData.level500   : null;
  const fib618     = fibData ? fibData.level618   : null;
  const fib786     = fibData ? fibData.level786   : null;
  const fibNear    = fibData ? fibData.nearLevel  : null;
` : ""}
${hasIchimoku ? `
  // Ichimoku Kinko Hyo cloud system
  const ichimokuData        = calcIchimoku(highs, lows, prices,
    params.ichimoku_tenkan        ?? 9,
    params.ichimoku_kijun         ?? 26,
    params.ichimoku_senkou_b      ?? 52,
    params.ichimoku_displacement  ?? 26);
  const ichimokuAboveCloud  = ichimokuData ? ichimokuData.aboveCloud    : false;
  const ichimokuBelowCloud  = ichimokuData ? ichimokuData.belowCloud    : false;
  const ichimokuInCloud     = ichimokuData ? ichimokuData.inCloud       : false;
  const ichimokuCloudBullish = ichimokuData ? ichimokuData.cloudBullish : false;
  const ichimokuTkBullish   = ichimokuData ? ichimokuData.tkBullish     : false;
  const ichimokuTkBearish   = ichimokuData ? ichimokuData.tkBearish     : false;
  const ichimokuChikou      = ichimokuData ? ichimokuData.chikouConfirm : false;
  const ichimokuTenkan      = ichimokuData ? ichimokuData.tenkan        : null;
  const ichimokuKijun       = ichimokuData ? ichimokuData.kijun         : null;
  const ichimokuSenkouA     = ichimokuData ? ichimokuData.senkouA       : null;
  const ichimokuSenkouB     = ichimokuData ? ichimokuData.senkouB       : null;
` : ""}
${hasAscendingTriangle ? `
  // Ascending triangle pattern (flat resistance + ascending higher lows + volume breakout)
  const ascTriResult               = calcAscendingTriangle(highs, lows, prices, volumes ?? [], {
    lookback:                 params.at_lookback                  ?? 40,
    resistance_tolerance_pct: params.at_resistance_tolerance_pct  ?? 1.5,
    min_resistance_touches:   params.at_min_resistance_touches    ?? 2,
    min_higher_lows:          params.at_min_higher_lows           ?? 2,
    vol_multiplier:           params.at_vol_multiplier            ?? 1.2,
    vol_avg_period:           params.at_vol_avg_period            ?? 20,
  });
  const isAscendingTriangle        = !!(ascTriResult && ascTriResult.isAscendingTriangle);
  const ascTriResistance           = ascTriResult ? ascTriResult.resistance           : null;
  const ascTriTarget               = ascTriResult ? ascTriResult.target               : null;
  const ascTriBreakoutVolConfirmed = ascTriResult ? ascTriResult.breakoutVolConfirmed : false;
` : ""}
${hasVwap ? `
  // Track per-bar timestamps for the VWAP window (must happen every bar, before any early return)
  _vwapTs.push(now);
  if (_vwapTs.length > prices.length) _vwapTs.shift();
` : ""}
  // Derived band/price variables (computed early so overlays and entry rules can reference them)
  const bandWidthPct = bb ? ((bb.upper - bb.lower) / bb.middle) * 100 : 0;
  const wideEnough = bandWidthPct >= (params.min_bw_pct ?? MIN_BANDWIDTH_PCT);
  const deepBelowLower = !!(bb && price <= bb.lower - 0.002 * bb.middle);
  const deepBelowPct = params.deep_below_pct != null
    ? !!(bb && price < bb.lower * (1 - params.deep_below_pct))
    : deepBelowLower;
  const touchLower = !!(bb && price <= bb.lower);
  const nearUpper = !!(bb && price >= bb.upper);
  const aboveUpper = !!(bb && price > bb.upper);
  const priceAboveUpper = nearUpper;
  // % gap between fill price and BB upper band. Negative when price still below
  // the band, positive when price has gapped through. Useful for filtering out
  // "stale signal" entries where the candle ran far past the band before the
  // order executed — see momentum_breakout_stock_daily SNOW trade 2026-05-29.
  const bbFillDivergencePct = bb ? ((price - bb.upper) / bb.upper) * 100 : 0;
  // Distance of entry price from BB middle, as % of middle. Negative = below
  // middle; positive = above. Stronger fast-SL separator than bb-position
  // alone (Cohen's d=0.78 vs bb_pos d=0.63 on the 2026-06-03 358-trade
  // probe). Use as an entry gate to reject extended breakouts in
  // wide-band-regime conditions.
  const bbDistFromMiddlePct = bb && bb.middle ? ((price - bb.middle) / bb.middle) * 100 : 0;

${hasOpeningRange ? `  // opening_range update — track today's ET session range.
  // Reset state on new ET date; accumulate high/low for first N bars; expose
  // aboveHigh/belowLow predicates once accumulation is complete.
  const _orbET = (() => {
    const _d = new Date(now);
    const _y = _d.getUTCFullYear();
    const _ms = new Date(Date.UTC(_y, 2, 1)), _me = new Date(Date.UTC(_y, 10, 1));
    const _dstS = new Date(Date.UTC(_y, 2, 8 + ((7 - _ms.getUTCDay()) % 7)));
    const _dstE = new Date(Date.UTC(_y, 10, 1 + ((7 - _me.getUTCDay()) % 7)));
    const _isDST = _d >= _dstS && _d < _dstE;
    const _etMs = now + (_isDST ? -4 : -5) * 3600 * 1000;
    const _etD = new Date(_etMs);
    return {
      dateKey: _etD.getUTCFullYear() + "-" + (_etD.getUTCMonth() + 1) + "-" + _etD.getUTCDate(),
      hour_decimal: _etD.getUTCHours() + _etD.getUTCMinutes() / 60,
    };
  })();
  if (_orbDayKey !== _orbET.dateKey) {
    _orbDayKey = _orbET.dateKey;
    _orbRangeHigh = null;
    _orbRangeLow = null;
    _orbBarsCounted = 0;
  }
  // Only count bars during regular hours after 9:30 ET (skip pre-market).
  // The session-start gate prevents pre-market bars from polluting the range.
  if (_orbET.hour_decimal >= 9.5) {
    if (_orbBarsCounted < (params.opening_range_bars ?? 2)) {
      const _hi = (highs && highs.length) ? highs[highs.length - 1] : price;
      const _lo = (lows  && lows.length)  ? lows[lows.length - 1]  : price;
      _orbRangeHigh = _orbRangeHigh == null ? _hi : Math.max(_orbRangeHigh, _hi);
      _orbRangeLow  = _orbRangeLow  == null ? _lo : Math.min(_orbRangeLow,  _lo);
    }
    _orbBarsCounted++;
  }
  const openingRangeReady     = _orbBarsCounted > (params.opening_range_bars ?? 2);
  const openingRangeHigh      = _orbRangeHigh;
  const openingRangeLow       = _orbRangeLow;
  const openingRangeAboveHigh = !!(openingRangeReady && _orbRangeHigh != null && price > _orbRangeHigh);
  const openingRangeBelowLow  = !!(openingRangeReady && _orbRangeLow  != null && price < _orbRangeLow);
` : ""}

${generateOverlaysBlock(spec)}

  ${hasOpeningRange ? `// opening_range strategies don't depend on bb/rsi/sma for their entry rules.
  // The guard below requires those indicators (legacy from BB-based daily
  // strategies); skip it when opening_range is the active signal — the
  // indicator has its own \`ready\` predicate.
  if (!vi) {
    prevVI = vi;
    return { action: "HOLD", position, lastExitTime, vi, bb, overlays: null };
  }` : `if (!vi || !bb || slowSMA == null || fastSMA == null || rsiValue == null) {
    prevVI = vi;
    return { action: "HOLD", position, lastExitTime, vi, bb, overlays: null };
  }`}

${hasSqueeze ? `
  // Squeeze indicator — rolling min bandwidth (stateful)
  bwHistory.push(bandWidthPct);
  if (bwHistory.length > (params.squeeze_lookback ?? 60)) bwHistory.shift();
  const _recentMinBW = Math.min(...bwHistory);
  const wasSqueezed  = _recentMinBW <= (params.squeeze_max_bw ?? 0.35);
  const isExpanding  = bandWidthPct >= _recentMinBW * (params.expand_mult ?? 2.0);
` : ""}
${hasVwap ? `
  // VWAP pullback indicator
  const _vwap = calcVWAP(prices, highs, lows, _vwapTs, params);
  const vwapPriceAbove     = !!(_vwap && _vwap.priceAboveVwap);
  const vwapSlopeUp        = !!(_vwap && _vwap.vwapSlopeUp);
  const vwapRecentPullback = !!(_vwap && _vwap.recentPullback);
  const vwapReclaimed      = !!(_vwap && _vwap.reclaimed);
` : ""}
  const viTurnUp = prevVI && vi.vIndex >= prevVI.vIndex;
  const viRollingOver = prevVI && vi.vIndex <= prevVI.vIndex;
  const inCooldown = now - lastExitTime < (params.strategy_cooldown_ms ?? COOLDOWN_MS);

  // SMA slope trend filter: true when SMA(trend_sma_period) is flat or rising
  const _smaTrendPeriod = params.trend_sma_period ?? 50;
  const _smaTrendLookback = params.trend_lookback ?? 10;
  const _smaNow = calcSMA(prices, _smaTrendPeriod);
  const _smaPrev = prices.length >= _smaTrendPeriod + _smaTrendLookback
    ? calcSMA(prices.slice(0, -_smaTrendLookback), _smaTrendPeriod)
    : null;
  const smaTrendNotFalling = !_smaPrev || (_smaNow != null && _smaNow >= _smaPrev);

  // trend + MA state
  const fastAboveSlow = fastSMA > slowSMA;
  const fastBelowSlow = fastSMA < slowSMA;
  const trendUp = price > slowSMA;

  // expose RSI value
  // rsiValue already computed above
${hasEventScoreIndicator(spec) ? `
  // macro_regime event_score — composite per-category signal emitted by
  // scripts/event/macro_regime/poll.js. Locked spec (2026-06-03): per-market
  // score = 0.3*d1h + 0.7*d4h + 0*d1d, inverse-liquidity weighted, aggregated
  // per category. Null when poll.js hasn't run yet — gate fails closed.
  let eventScoreFedPivot = null;
  let eventScoreRecession = null;
  let eventScoreEmployment = null;
  let eventScoreGeopolitical = null;
  let eventScoreInflation = null;
  try {
    const _fs   = require("fs");
    const _path = require("path");
    const _root = process.env.STRATCHAI_ROOT || process.cwd();
    const _mr   = JSON.parse(_fs.readFileSync(_path.join(_root, "data/macro_regime.json"), "utf8"));
    const _c    = _mr && _mr.categories ? _mr.categories : {};
    eventScoreFedPivot     = _c.fed_pivot?.aggregate?.event_score    ?? null;
    eventScoreRecession    = _c.recession?.aggregate?.event_score    ?? null;
    eventScoreEmployment   = _c.employment?.aggregate?.event_score   ?? null;
    eventScoreGeopolitical = _c.geopolitical?.aggregate?.event_score ?? null;
    eventScoreInflation    = _c.inflation?.aggregate?.event_score    ?? null;
  } catch (_) { /* file missing or unparseable — gate fails closed */ }
` : ""}
  // --- ENTRY ---
  if (!position && !inCooldown) {
    let newPos = null;
    let reason = "";

    // generated entry rules
${generateEntryBlocks(spec.entry_rules).join("\n")}

    if (newPos) {
      prevVI = vi;
      return { action: "BUY", position: newPos, lastExitTime, vi, bb, reason, overlays };
    }

    prevVI = vi;
    return { action: "HOLD", position, lastExitTime, vi, bb, overlays };
  }

  // --- EXIT (only if in position) ---
  const pnlPct = position
    ? ((price - position.entryPrice) / position.entryPrice) * 100
    : 0;

  if (!position) {
    prevVI = vi;
    return { action: "HOLD", position, lastExitTime, vi, bb, overlays };
  }

  const holdTimeMs = now - (position.entryTime || now);

  // Track high-water mark using intrabar high for breakeven stop
  const _currentHigh = highs.length ? highs[highs.length - 1] : price;
  const _pnlHighPct = position ? ((_currentHigh - position.entryPrice) / position.entryPrice) * 100 : 0;
  if (_pnlHighPct > (position.highWaterMarkPct || 0)) {
    position.highWaterMarkPct = _pnlHighPct;
  }

  let shouldExit = false;
  let exitReason = "";

  // EOD_EXIT — only emitted for stock specs (exchange === 'alpaca'). Triggers
  // in the last 30 minutes of regular trading hours (15:30–16:00 ET) when the
  // position is up at least eod_exit_min_pnl_pct. Avoids overnight gap risk on
  // small winners that won't reach the trending profit_floor before close.
${spec.exchange === 'alpaca' ? `
  if (!shouldExit && params.eod_exit_min_pnl_pct != null && pnlPct >= params.eod_exit_min_pnl_pct) {
    const _isEodWindow = (() => {
      const _d = new Date(now);
      // Skip weekends quickly (UTC days 0=Sun, 6=Sat — these always include the ET weekend).
      const _utcDay = _d.getUTCDay();
      if (_utcDay === 0 || _utcDay === 6) return false;
      const _isDST = (() => {
        const _y = _d.getUTCFullYear();
        const _ms = new Date(Date.UTC(_y, 2, 1)), _me = new Date(Date.UTC(_y, 10, 1));
        const _dstS = new Date(Date.UTC(_y, 2,  8 + ((7 - _ms.getUTCDay()) % 7)));
        const _dstE = new Date(Date.UTC(_y, 10, 1 + ((7 - _me.getUTCDay()) % 7)));
        return _d >= _dstS && _d < _dstE;
      })();
      const _etHour = ((_d.getUTCHours() + (_isDST ? -4 : -5) + 24) % 24) + _d.getUTCMinutes() / 60;
      return _etHour >= 15.5 && _etHour < 16.0;
    })();
    if (_isEodWindow) {
      shouldExit = true;
      exitReason = "EOD_EXIT";
    }
  }
` : ''}
  // PROFIT_FLOOR exit. In a flat / non-trending regime, exit on a smaller win
  // rather than waiting for the trending-regime floor (which often never gets
  // hit because the move stalls out). Reads cached regime files synchronously
  // (5-min TTL on writes); fails open (treats regime as trending) on any error.
  //
  // Resolution order:
  //   - flat regime + flat_regime_profit_floor_pct set → PROFIT_FLOOR_FLAT at that value
  //   - profit_floor_pct set (any regime, including flat with no flat-floor) → PROFIT_FLOOR
  //   - neither set → no profit floor exit
  if (!shouldExit) {
    // Regime field routing: stock (alpaca) strategies read SPY-driven
    // isFlatStock; crypto (coinbase/coinbase-paper) read BTC-driven isFlat.
    // Pre-2026-06-06 the generator hardcoded isFlat for both, which silently
    // gated stock strategies on BTC's daily change. Bug fixed in v0.4.0.
    const _isFlatRegime = (() => {
      try {
        const _fs = require('fs');
        const _path = require('path');
        const _root = process.env.STRATCHAI_ROOT || process.cwd();
        // Prefer the hysteresis-aware regime.json written by scanner.js.
        // Fall back to direct computation if it doesn't exist yet.
        try {
          const r = JSON.parse(_fs.readFileSync(_path.join(_root, 'data/regime.json'), 'utf8'));
          if (typeof r?.${spec.exchange === 'alpaca' ? 'isFlatStock' : 'isFlat'} === 'boolean') return r.${spec.exchange === 'alpaca' ? 'isFlatStock' : 'isFlat'};
        } catch {}
        let _bearish = false;
        let _change = null;
        try { _bearish = !!JSON.parse(_fs.readFileSync(_path.join(_root, 'data/${spec.exchange === 'alpaca' ? 'macro_equity_guard' : 'macro_guard'}.json'), 'utf8')).${spec.exchange === 'alpaca' ? 'bearishStocks' : 'bearish'}; } catch {}
        try { _change = JSON.parse(_fs.readFileSync(_path.join(_root, 'data/${spec.exchange === 'alpaca' ? 'spy_regime' : 'btc_regime'}.json'), 'utf8')).changePct; } catch {}
        // Fallback (no regime.json yet): mid-point threshold, no hysteresis.
        // Asymmetric (matches scanner.js): down-trending macro index also classifies as flat.
        return _bearish || (typeof _change === 'number' && _change < ${spec.exchange === 'alpaca' ? '0.4' : '1.0'});
      } catch { return false; }
    })();
    let _floor = null;
    let _flatExit = false;
    if (_isFlatRegime && params.flat_regime_profit_floor_pct != null) {
      _floor = params.flat_regime_profit_floor_pct;
      _flatExit = true;
    } else if (params.profit_floor_pct != null) {
      _floor = params.profit_floor_pct;
    }
    if (_floor != null && pnlPct >= _floor) {
      shouldExit = true;
      exitReason = _flatExit ? "PROFIT_FLOOR_FLAT" : "PROFIT_FLOOR";
    }
  }

${generateExitBlocks(spec.exit_rules).join("\n")}

  if (shouldExit) {
    prevVI = vi;
    return { action: "SELL", position, lastExitTime: now, vi, bb, pnlPct, reason: exitReason, overlays };
  }

  prevVI = vi;
  return { action: "HOLD", position, lastExitTime, vi, bb, pnlPct, overlays };
}

  return runStrategyStep;
}

module.exports = { createStrategy, params: _defaultParams };
`;
}

// Emits the `const overlays` line from spec.overlays (a label → JS-expression map).
// Strategies without an overlays block emit `const overlays = null` so all return
// statements can safely include `overlays` without any conditional logic.
function generateOverlaysBlock(spec) {
  const entries = Object.entries(spec.overlays || {});
  if (!entries.length) return "  const overlays = null;";
  const pairs = entries.map(([label, expr]) => `    ${JSON.stringify(label)}: ${expr}`).join(",\n");
  return `  const overlays = {\n${pairs},\n  };`;
}

function generateEntryBlocks(rules) {
  return rules.map((rule) => {
    const cond = rule.when.map(buildConditionExpr).join(" && ");
    const mode = rule.mode || "GEN";
    const reason = rule.mode ? `${rule.mode}_ENTRY` : "ENTRY";
    return `    if (!newPos && (${cond})) {
      newPos = { entryPrice: price, entryTime: now, mode: "${mode}" };
      reason = "${reason}";
    }`;
  });
}

function generateExitBlocks(rules) {
  return rules.map((rule) => {
    const cond = rule.when.map(buildExitConditionExpr).join(" && ");
    const applies = rule.applies_to || "ANY";
    const appliesClause = applies === "ANY"
      ? "true"
      : Array.isArray(applies)
        ? applies.map(m => `position.mode === "${m}"`).join(" || ")
        : `position.mode === "${applies}"`;
    return `  if (!shouldExit && (${appliesClause}) && (${cond})) {
    shouldExit = true;
    exitReason = "${rule.reason || "EXIT"}";
  }`;
  });
}

function buildConditionExpr(c) {
  if (c.type === "time_of_day") return buildTimeOfDayExpr(c);

  const left = mapLeftSide(c);
  const op = c.op || "==";

  let right;
  if (c.value_from_param) {
    right = `params.${c.value_from_param}`;
  } else if (typeof c.value === "boolean") {
    right = c.value;
  } else {
    right = JSON.stringify(c.value);
  }

  return `${left} ${op} ${right}`;
}

// Shared ET time-of-day expression.
// et_hour_decimal = current ET hour as decimal (e.g. 9.75 = 9:45 AM ET).
// DST-aware: -4h during EDT (Mar–Nov), -5h during EST.
function buildTimeOfDayExpr(c) {
  const val = c.value_from_param ? `params.${c.value_from_param}` : c.value;
  return `(() => {
    const _d = new Date(now);
    const _isDST = (() => {
      const _y = _d.getUTCFullYear();
      const _ms = new Date(Date.UTC(_y,2,1)), _me = new Date(Date.UTC(_y,10,1));
      const _dstS = new Date(Date.UTC(_y,2, 8 + ((7-_ms.getUTCDay())%7)));
      const _dstE = new Date(Date.UTC(_y,10, 1 + ((7-_me.getUTCDay())%7)));
      return _d >= _dstS && _d < _dstE;
    })();
    const _et = ((_d.getUTCHours() + (_isDST ? -4 : -5) + 24) % 24) + _d.getUTCMinutes() / 60;
    return _et ${c.op} ${val};
  })()`;
}

function buildExitConditionExpr(c) {
  const val = c.value_from_param ? `params.${c.value_from_param}` : c.value;

  if (c.type === "pnl") return `pnlPct ${c.op} ${val}`;
  if (c.type === "time") return `holdTimeMs ${c.op} ${val}`;
  if (c.type === "time_of_day") return buildTimeOfDayExpr(c);
  if (c.type === "macro") {
    // Reads cached macro_guard.json synchronously (5-min TTL). Fails open (false) on error.
    return `(() => { try { return JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'data/macro_guard.json'), 'utf8')).bearish; } catch { return false; } })() ${c.op} ${val}`;
  }
  if (c.type === "breakeven") {
    // fires when pnlPct falls to 0 after having risen above the trigger threshold
    return `(position.highWaterMarkPct || 0) >= ${val} && pnlPct <= 0`;
  }
  if (c.type === "no_progress") {
    // fires when hold time exceeds min_hold and pnl is between -band and +band
    const minHold = c.min_hold_from_param ? `params.${c.min_hold_from_param}` : (c.min_hold ?? 7200000);
    const band    = c.band_from_param     ? `params.${c.band_from_param}`     : (c.band    ?? 0.3);
    return `holdTimeMs >= ${minHold} && pnlPct > -${band} && pnlPct < ${band}`;
  }
  if (c.type === "trailing_stop") {
    // fires when pnlPct falls N% below the high-water mark (once above trigger)
    const trigger = c.trigger_from_param ? `params.${c.trigger_from_param}` : (c.trigger ?? 0);
    const trail   = c.trail_from_param   ? `params.${c.trail_from_param}`   : (c.trail ?? 1);
    return `(position.highWaterMarkPct || 0) >= ${trigger} && pnlPct <= (position.highWaterMarkPct || 0) - ${trail}`;
  }
  if (c.type === "stoch") return `stochK ${c.op} ${val}`;
  if (c.type === "vi_band" && c.field === "mrExit") {
    return `nearUpper && viRollingOver && Math.abs((price - bb.middle) / bb.middle) * 100 >= 1.5`;
  }
  if (c.type === "band" && c.field === "priceAboveMiddle") {
    return `price >= bb.middle`;
  }
  if (c.type === "band" && c.field === "priceAboveUpper") {
    return `priceAboveUpper`;
  }
  if (c.type === "band" && c.field === "priceBelowUpper") {
    return `price < bb.upper`;
  }
  if (c.type === "band" && c.field === "priceBelowMiddle") {
    return `price < bb.middle`;
  }
  if (c.type === "rsi") {
    return `rsiValue ${c.op} ${val}`;
  }
  if (c.type === "trend") {
    const trendMap = {
      hasUptrend:     "trendHasUptrend",
      lastHigherHigh: "trendHigherHigh",
      lastHigherLow:  "trendHigherLow",
      brokeHigherLow: "trendBrokeHigherLow",
      priceAboveMa:   "trendPriceAboveMa",
    };
    const varName = trendMap[c.field] ?? "false";
    return `${varName} ${c.op} ${val}`;
  }
  return buildConditionExpr(c);
}

function mapLeftSide(c) {
  if (c.indicator === "band" && c.field === "widthPct") return "bandWidthPct";
  if (c.indicator === "band" && c.field === "wideEnough") return "wideEnough";
  if (c.indicator === "band" && c.field === "aboveUpper") return "aboveUpper";
  if (c.indicator === "band" && c.field === "fillDivergencePct") return "bbFillDivergencePct";
  if (c.indicator === "band" && c.field === "distFromMiddlePct") return "bbDistFromMiddlePct";
  if (c.indicator === "band" && c.field === "priceAboveMiddle") return "price >= bb.middle";
  if (c.indicator === "opening_range" && c.field === "aboveHigh")  return "openingRangeAboveHigh";
  if (c.indicator === "opening_range" && c.field === "belowLow")   return "openingRangeBelowLow";
  if (c.indicator === "opening_range" && c.field === "ready")      return "openingRangeReady";
  if (c.indicator === "opening_range" && c.field === "high")       return "openingRangeHigh";
  if (c.indicator === "opening_range" && c.field === "low")        return "openingRangeLow";
  if (c.indicator === "price_vs_band" && c.field === "deepBelowLower")
    return "deepBelowLower";
  if (c.indicator === "trend" && c.field === "up") return "trendUp";
  if (c.indicator === "event_score" && c.field === "fed_pivot")    return "eventScoreFedPivot";
  if (c.indicator === "event_score" && c.field === "recession")    return "eventScoreRecession";
  if (c.indicator === "event_score" && c.field === "employment")   return "eventScoreEmployment";
  if (c.indicator === "event_score" && c.field === "geopolitical") return "eventScoreGeopolitical";
  if (c.indicator === "event_score" && c.field === "inflation")    return "eventScoreInflation";
  if (c.indicator === "trend" && c.field === "hasUptrend") return "trendHasUptrend";
  if (c.indicator === "trend" && c.field === "lastHigherHigh") return "trendHigherHigh";
  if (c.indicator === "trend" && c.field === "lastHigherLow") return "trendHigherLow";
  if (c.indicator === "trend" && c.field === "brokeHigherLow") return "trendBrokeHigherLow";
  if (c.indicator === "trend" && c.field === "priceAboveMa") return "trendPriceAboveMa";
  if (c.indicator === "vi" && c.field === "turnUp") return "viTurnUp";
  if (c.indicator === "price_vs_band" && c.field === "touchLower")
    return "touchLower";
  if (c.indicator === "price_vs_band" && c.field === "deepBelowPct")
    return "deepBelowPct";
  if (c.indicator === "trend_sma" && c.field === "notFalling")
    return "smaTrendNotFalling";
  if (c.indicator === "ma" && c.field === "fastAboveSlow")
    return "fastAboveSlow";
  if (c.indicator === "ma" && c.field === "fastBelowSlow")
    return "fastBelowSlow";
  if (c.indicator === "rsi" && c.field === "value") return "rsiValue";
  if (c.indicator === "atr" && c.field === "pct") return "atrPct";
  if (c.indicator === "atr" && c.field === "expansion") return "atrExpansion";
  if (c.indicator === "ema" && c.field === "fastAboveSlow") return "emaFastAboveSlow";
  if (c.indicator === "ema" && c.field === "fastBelowSlow") return "emaFastBelowSlow";
  if (c.indicator === "ema" && c.field === "trendUp") return "emaTrendUp";
  if (c.indicator === "macd" && c.field === "bullish") return "macdBullish";
  if (c.indicator === "macd" && c.field === "bearish") return "macdBearish";
  if (c.indicator === "macd" && c.field === "aboveZero") return "macdAboveZero";
  if (c.indicator === "stoch" && c.field === "k") return "stochK";
  if (c.indicator === "squeeze" && c.field === "wasSqueezed") return "wasSqueezed";
  if (c.indicator === "squeeze" && c.field === "isExpanding")  return "isExpanding";
  if (c.indicator === "candle_pattern" && c.field === "patternLong") return "candlePatternLong";
  if (c.indicator === "flag_pattern"   && c.field === "patternFlag")  return "flagPatternFlag";
  if (c.indicator === "hammer"         && c.field === "isHammer")     return "isHammer";
  if (c.indicator === "engulfing"      && c.field === "isBullishEngulfing")    return "isBullishEngulfing";
  if (c.indicator === "engulfing"      && c.field === "priorCloseBelowLower") return "engulfingPriorBelowLower";
  if (c.indicator === "morningStar"    && c.field === "isMorningStar")        return "isMorningStar";
  if (c.indicator === "doubleBottom"   && c.field === "isDoubleBottom")       return "isDoubleBottom";
  if (c.indicator === "cupAndHandle"   && c.field === "isCupAndHandle")       return "isCupAndHandle";
  if (c.indicator === "candle_pattern" && c.field === "patternLong") return "candlePattern && candlePattern.patternLong";
  if (c.indicator === "vwap" && c.field === "priceAboveVwap") return "vwapPriceAbove";
  if (c.indicator === "vwap" && c.field === "vwapSlopeUp")    return "vwapSlopeUp";
  if (c.indicator === "vwap" && c.field === "recentPullback") return "vwapRecentPullback";
  if (c.indicator === "vwap" && c.field === "reclaimed")      return "vwapReclaimed";
  if (c.indicator === "mass_index" && c.field === "value")    return "massIndexValue";
  if (c.indicator === "mass_index" && c.field === "bulge")    return "massIndexBulge";
  if (c.indicator === "aroon" && c.field === "up")            return "aroonUp";
  if (c.indicator === "aroon" && c.field === "down")          return "aroonDown";
  if (c.indicator === "aroon" && c.field === "oscillator")    return "aroonOscillator";
  if (c.indicator === "adx"   && c.field === "value")         return "adxValue";
  if (c.indicator === "adx"   && c.field === "diPlus")        return "adxDiPlus";
  if (c.indicator === "adx"   && c.field === "diMinus")       return "adxDiMinus";
  if (c.indicator === "adx"   && c.field === "trending")      return "adxTrending";
  if (c.indicator === "adx"   && c.field === "ranging")       return "adxRanging";
  if (c.indicator === "adx"   && c.field === "bullish")       return "adxBullish";
  if (c.indicator === "adx"   && c.field === "bearish")       return "adxBearish";
  if (c.indicator === "supertrend" && c.field === "value")    return "supertrendValue";
  if (c.indicator === "supertrend" && c.field === "bullish")  return "supertrendBullish";
  if (c.indicator === "supertrend" && c.field === "bearish")  return "supertrendBearish";
  if (c.indicator === "supertrend" && c.field === "distance") return "supertrendDist";
  if (c.indicator === "obv"  && c.field === "value")    return "obvValue";
  if (c.indicator === "obv"  && c.field === "rising")   return "obvRising";
  if (c.indicator === "obv"  && c.field === "smaRatio") return "obvSmaRatio";
  if (c.indicator === "psar" && c.field === "value")    return "psarValue";
  if (c.indicator === "psar" && c.field === "bullish")  return "psarBullish";
  if (c.indicator === "psar" && c.field === "bearish")  return "psarBearish";
  if (c.indicator === "alligator" && c.field === "jaw")      return "alligatorJaw";
  if (c.indicator === "alligator" && c.field === "teeth")    return "alligatorTeeth";
  if (c.indicator === "alligator" && c.field === "lips")     return "alligatorLips";
  if (c.indicator === "alligator" && c.field === "bullish")  return "alligatorBullish";
  if (c.indicator === "alligator" && c.field === "bearish")  return "alligatorBearish";
  if (c.indicator === "alligator" && c.field === "sleeping") return "alligatorSleeping";
  if (c.indicator === "ao" && c.field === "value")    return "aoValue";
  if (c.indicator === "ao" && c.field === "positive") return "aoPositive";
  if (c.indicator === "ao" && c.field === "negative") return "aoNegative";
  if (c.indicator === "ao" && c.field === "rising")   return "aoRising";
  if (c.indicator === "ao" && c.field === "falling")  return "aoFalling";
  if (c.indicator === "roc" && c.field === "value")        return "rocValue";
  if (c.indicator === "roc" && c.field === "positive")     return "rocPositive";
  if (c.indicator === "roc" && c.field === "negative")     return "rocNegative";
  if (c.indicator === "roc" && c.field === "accelerating") return "rocAccelerating";
  if (c.indicator === "roc" && c.field === "decelerating") return "rocDecelerating";
  if (c.indicator === "keltner" && c.field === "upper")      return "keltnerUpper";
  if (c.indicator === "keltner" && c.field === "middle")     return "keltnerMiddle";
  if (c.indicator === "keltner" && c.field === "lower")      return "keltnerLower";
  if (c.indicator === "keltner" && c.field === "priceAbove") return "keltnerAbove";
  if (c.indicator === "keltner" && c.field === "priceBelow") return "keltnerBelow";
  if (c.indicator === "mfi" && c.field === "value")      return "mfiValue";
  if (c.indicator === "mfi" && c.field === "overbought") return "mfiOverbought";
  if (c.indicator === "mfi" && c.field === "oversold")   return "mfiOversold";
  if (c.indicator === "cmf" && c.field === "value")   return "cmfValue";
  if (c.indicator === "cmf" && c.field === "bullish") return "cmfBullish";
  if (c.indicator === "cmf" && c.field === "bearish") return "cmfBearish";
  if (c.indicator === "donchian" && c.field === "upper")      return "donchianUpper";
  if (c.indicator === "donchian" && c.field === "middle")     return "donchianMiddle";
  if (c.indicator === "donchian" && c.field === "lower")      return "donchianLower";
  if (c.indicator === "donchian" && c.field === "priceAbove") return "donchianAbove";
  if (c.indicator === "donchian" && c.field === "priceBelow") return "donchianBelow";
  if (c.indicator === "hma" && c.field === "value")   return "hmaValue";
  if (c.indicator === "hma" && c.field === "rising")  return "hmaRising";
  if (c.indicator === "hma" && c.field === "falling") return "hmaFalling";
  if (c.indicator === "week52" && c.field === "high52")      return "week52High";
  if (c.indicator === "week52" && c.field === "low52")       return "week52Low";
  if (c.indicator === "week52" && c.field === "pctFromHigh") return "week52PctHigh";
  if (c.indicator === "week52" && c.field === "pctFromLow")  return "week52PctLow";
  if (c.indicator === "week52" && c.field === "nearHigh")    return "week52NearHigh";
  if (c.indicator === "week52" && c.field === "nearLow")     return "week52NearLow";
  if (c.indicator === "pivot" && c.field === "pivot")       return "pivotValue";
  if (c.indicator === "pivot" && c.field === "r1")          return "pivotR1";
  if (c.indicator === "pivot" && c.field === "r2")          return "pivotR2";
  if (c.indicator === "pivot" && c.field === "s1")          return "pivotS1";
  if (c.indicator === "pivot" && c.field === "s2")          return "pivotS2";
  if (c.indicator === "pivot" && c.field === "abovePivot")  return "pivotAbove";
  if (c.indicator === "pivot" && c.field === "belowPivot")  return "pivotBelow";
  if (c.indicator === "fib" && c.field === "swingHigh")  return "fibHigh";
  if (c.indicator === "fib" && c.field === "swingLow")   return "fibLow";
  if (c.indicator === "fib" && c.field === "level236")   return "fib236";
  if (c.indicator === "fib" && c.field === "level382")   return "fib382";
  if (c.indicator === "fib" && c.field === "level500")   return "fib500";
  if (c.indicator === "fib" && c.field === "level618")   return "fib618";
  if (c.indicator === "fib" && c.field === "level786")   return "fib786";
  if (c.indicator === "fib" && c.field === "nearLevel")  return "fibNear";
  if (c.indicator === "ichimoku" && c.field === "aboveCloud")    return "ichimokuAboveCloud";
  if (c.indicator === "ichimoku" && c.field === "belowCloud")    return "ichimokuBelowCloud";
  if (c.indicator === "ichimoku" && c.field === "inCloud")       return "ichimokuInCloud";
  if (c.indicator === "ichimoku" && c.field === "cloudBullish")  return "ichimokuCloudBullish";
  if (c.indicator === "ichimoku" && c.field === "tkBullish")     return "ichimokuTkBullish";
  if (c.indicator === "ichimoku" && c.field === "tkBearish")     return "ichimokuTkBearish";
  if (c.indicator === "ichimoku" && c.field === "chikouConfirm") return "ichimokuChikou";
  if (c.indicator === "ichimoku" && c.field === "tenkan")        return "ichimokuTenkan";
  if (c.indicator === "ichimoku" && c.field === "kijun")         return "ichimokuKijun";
  if (c.indicator === "ichimoku" && c.field === "senkouA")       return "ichimokuSenkouA";
  if (c.indicator === "ichimoku" && c.field === "senkouB")       return "ichimokuSenkouB";
  if (c.indicator === "ascendingTriangle" && c.field === "isAscendingTriangle")        return "isAscendingTriangle";
  if (c.indicator === "ascendingTriangle" && c.field === "resistance")                 return "ascTriResistance";
  if (c.indicator === "ascendingTriangle" && c.field === "target")                     return "ascTriTarget";
  if (c.indicator === "ascendingTriangle" && c.field === "breakoutVolConfirmed")       return "ascTriBreakoutVolConfirmed";

  return "false";
}


// CLI
if (require.main === module) {
  const specPath = process.argv[2];
  if (!specPath) {
    console.error("Usage: sk-build-spec path/to/spec.json");
    console.error("       (set STRATCHAI_STRATEGIES_DIR to override output location)");
    process.exit(1);
  }
  const spec = loadSpec(specPath);
  const code = generateStrategyCode(spec);
  // Consumer sets STRATCHAI_STRATEGIES_DIR=<their-root>/strategies to choose
  // the output location. Without it, fall back to <cwd>/strategies — the
  // common "run from project root" case.
  const strategiesDir = process.env.STRATCHAI_STRATEGIES_DIR
    ? path.resolve(process.env.STRATCHAI_STRATEGIES_DIR)
    : path.join(process.cwd(), "strategies");
  if (!fs.existsSync(strategiesDir)) {
    console.error(`Output directory does not exist: ${strategiesDir}`);
    console.error("Either create it or set STRATCHAI_STRATEGIES_DIR to a valid path.");
    process.exit(1);
  }
  const outPath = path.join(strategiesDir, `strategy_${spec.name}.js`);
  fs.writeFileSync(outPath, code, "utf8");
  console.log("Wrote", outPath);
}

module.exports = { generateStrategyCode };
