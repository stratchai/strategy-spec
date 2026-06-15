// Minimal smoke test — exercise the package's public API end-to-end.
"use strict";

const assert = require("assert");
const { parseSpec, parseSpecOrThrow, specSchema, generateStrategyCode } = require("..");

let pass = 0, fail = 0;
function ok(label, fn) {
  try { fn(); console.log("  ✓", label); pass++; }
  catch (e) { console.log("  ✗", label, "—", e.message); fail++; }
}

console.log("smoke tests:");

ok("specSchema is a zod schema", () => {
  assert.strictEqual(typeof specSchema.parse, "function");
});

ok("parseSpec returns { success, data } on valid input", () => {
  const r = parseSpec({
    name: "test_strategy",
    exchange: "coinbase",
    candle_granularity: "ONE_DAY",
    candle_window: 200,
    params: { sl_pct: -3, tp_pct: 6 },
    entry_rules: [{
      mode: "ENTRY",
      when: [{ indicator: "trend", field: "up", op: "==", value: true }],
    }],
    exit_rules: [{
      applies_to: "ENTRY",
      when: [{ type: "pnl", field: "pnlPct", op: "<=", value_from_param: "sl_pct" }],
      reason: "SL",
    }],
  });
  assert.strictEqual(r.success, true);
  assert.strictEqual(r.data.name, "test_strategy");
});

ok("parseSpecOrThrow throws on invalid input", () => {
  let threw = false;
  try { parseSpecOrThrow({ name: 123 }); } catch (_) { threw = true; }
  assert.strictEqual(threw, true);
});

ok("generateStrategyCode emits a valid JS string", () => {
  const code = generateStrategyCode({
    name: "smoke_test",
    exchange: "coinbase",
    candle_granularity: "ONE_DAY",
    candle_window: 200,
    params: { sl_pct: -3, tp_pct: 6 },
    entry_rules: [{
      mode: "ENTRY",
      when: [{ indicator: "trend", field: "up", op: "==", value: true }],
    }],
    exit_rules: [{
      applies_to: "ENTRY",
      when: [{ type: "pnl", field: "pnlPct", op: "<=", value_from_param: "sl_pct" }],
      reason: "SL",
    }],
  });
  assert.strictEqual(typeof code, "string");
  assert.ok(code.includes("createStrategy"), "should export createStrategy");
  assert.ok(code.includes("@stratchai/indicators"), "should require indicators package");
  assert.ok(code.includes("smoke_test"), "should reference spec name");
});

ok("generated code is parseable JavaScript", () => {
  const code = generateStrategyCode({
    name: "parseable_test",
    exchange: "coinbase",
    candle_granularity: "ONE_DAY",
    candle_window: 200,
    params: { sl_pct: -3, tp_pct: 6 },
    entry_rules: [{
      mode: "ENTRY",
      when: [{ indicator: "trend", field: "up", op: "==", value: true }],
    }],
    exit_rules: [{
      applies_to: "ENTRY",
      when: [{ type: "pnl", field: "pnlPct", op: "<=", value_from_param: "sl_pct" }],
      reason: "SL",
    }],
  });
  // Parse without executing — catches generator-bug syntax errors
  new Function(code);
});

ok("v0.4.0: crypto spec emits BTC-driven regime read (isFlat)", () => {
  const code = generateStrategyCode({
    name: "crypto_regime_test",
    exchange: "coinbase",
    candle_granularity: "ONE_DAY",
    candle_window: 200,
    params: { sl_pct: -3, tp_pct: 6, profit_floor_pct: 5, flat_regime_profit_floor_pct: 3 },
    entry_rules: [{
      mode: "ENTRY",
      when: [{ indicator: "trend", field: "up", op: "==", value: true }],
    }],
    exit_rules: [{
      applies_to: "ENTRY",
      when: [{ type: "pnl", field: "pnlPct", op: "<=", value_from_param: "sl_pct" }],
      reason: "SL",
    }],
  });
  assert.ok(code.includes("r?.isFlat ==="), "coinbase exchange should read isFlat (BTC regime)");
  assert.ok(!code.includes("r?.isFlatStock ==="), "coinbase exchange should NOT read isFlatStock");
  assert.ok(code.includes("btc_regime.json"), "coinbase exchange should fall back to btc_regime.json");
  assert.ok(!code.includes("spy_regime.json"), "coinbase exchange should NOT reference spy_regime.json");
  assert.ok(code.includes("macro_guard.json"), "coinbase exchange should fall back to macro_guard.json");
});

ok("v0.4.0: stock spec emits SPY-driven regime read (isFlatStock)", () => {
  const code = generateStrategyCode({
    name: "stock_regime_test",
    exchange: "alpaca",
    candle_granularity: "ONE_DAY",
    candle_window: 200,
    params: { sl_pct: -3, tp_pct: 6, profit_floor_pct: 5, flat_regime_profit_floor_pct: 3 },
    entry_rules: [{
      mode: "ENTRY",
      when: [{ indicator: "trend", field: "up", op: "==", value: true }],
    }],
    exit_rules: [{
      applies_to: "ENTRY",
      when: [{ type: "pnl", field: "pnlPct", op: "<=", value_from_param: "sl_pct" }],
      reason: "SL",
    }],
  });
  assert.ok(code.includes("r?.isFlatStock ==="), "alpaca exchange should read isFlatStock (SPY regime)");
  assert.ok(!code.includes("r?.isFlat ==="), "alpaca exchange should NOT read isFlat (BTC regime)");
  assert.ok(code.includes("spy_regime.json"), "alpaca exchange should fall back to spy_regime.json");
  assert.ok(!code.includes("btc_regime.json"), "alpaca exchange should NOT reference btc_regime.json");
  assert.ok(code.includes("macro_equity_guard.json"), "alpaca exchange should fall back to macro_equity_guard.json");
  assert.ok(code.includes("bearishStocks"), "alpaca exchange should read bearishStocks field");
});

ok("v0.5.0: entry_trigger defaults to candle_close when omitted", () => {
  const r = parseSpec({
    name: "default_trigger_test",
    exchange: "coinbase",
    candle_granularity: "ONE_DAY",
    candle_window: 200,
    params: { sl_pct: -3, tp_pct: 6 },
    entry_rules: [{
      mode: "ENTRY",
      when: [{ indicator: "trend", field: "up", op: "==", value: true }],
    }],
    exit_rules: [{
      applies_to: "ENTRY",
      when: [{ type: "pnl", field: "pnlPct", op: "<=", value_from_param: "sl_pct" }],
      reason: "SL",
    }],
  });
  assert.strictEqual(r.success, true);
  assert.strictEqual(r.data.entry_trigger, "candle_close");
});

ok("v0.5.0: entry_trigger accepts news_event explicitly", () => {
  const r = parseSpec({
    name: "news_trigger_test",
    exchange: "alpaca",
    candle_granularity: "ONE_DAY",
    candle_window: 200,
    entry_trigger: "news_event",
    params: { sl_pct: -3, tp_pct: 6 },
    entry_rules: [{
      mode: "ENTRY",
      when: [{ indicator: "trend", field: "up", op: "==", value: true }],
    }],
    exit_rules: [{
      applies_to: "ENTRY",
      when: [{ type: "pnl", field: "pnlPct", op: "<=", value_from_param: "sl_pct" }],
      reason: "SL",
    }],
  });
  assert.strictEqual(r.success, true);
  assert.strictEqual(r.data.entry_trigger, "news_event");
});

ok("v0.5.x: macro_regime_gate accepts recession + favorable defaults", () => {
  const r = parseSpec({
    name: "macro_gate_default_test",
    exchange: "alpaca",
    candle_granularity: "ONE_DAY",
    candle_window: 200,
    params: { sl_pct: -3, tp_pct: 6 },
    entry_rules: [{
      mode: "ENTRY",
      when: [{ indicator: "trend", field: "up", op: "==", value: true }],
    }],
    exit_rules: [{
      applies_to: "ENTRY",
      when: [{ type: "pnl", field: "pnlPct", op: "<=", value_from_param: "sl_pct" }],
      reason: "SL",
    }],
    macro_regime_gate: { category: "recession" },
  });
  assert.strictEqual(r.success, true);
  assert.strictEqual(r.data.macro_regime_gate.category, "recession");
  assert.strictEqual(r.data.macro_regime_gate.required_bucket, "favorable");
  assert.strictEqual(r.data.macro_regime_gate.fallback_when_insufficient_history, "block");
});

ok("v0.6.0: macro_regime_gate rejects unknown / unvalidated categories", () => {
  // "stagflation" is not in the enum
  const r1 = parseSpec({
    name: "bad_gate_cat_test",
    exchange: "alpaca",
    candle_granularity: "ONE_DAY",
    candle_window: 200,
    params: { sl_pct: -3, tp_pct: 6 },
    entry_rules: [{ mode: "ENTRY", when: [{ indicator: "trend", field: "up", op: "==", value: true }] }],
    exit_rules: [{ applies_to: "ENTRY", when: [{ type: "pnl", field: "pnlPct", op: "<=", value_from_param: "sl_pct" }], reason: "SL" }],
    macro_regime_gate: { category: "stagflation" },
  });
  assert.strictEqual(r1.success, false);
  // "inflation" is upstream-tracked but advisory-only ("low_weak") — schema
  // intentionally rejects until a backtest validates it as a hard gate.
  const r2 = parseSpec({
    name: "advisory_inflation_test",
    exchange: "alpaca",
    candle_granularity: "ONE_DAY",
    candle_window: 200,
    params: { sl_pct: -3, tp_pct: 6 },
    entry_rules: [{ mode: "ENTRY", when: [{ indicator: "trend", field: "up", op: "==", value: true }] }],
    exit_rules: [{ applies_to: "ENTRY", when: [{ type: "pnl", field: "pnlPct", op: "<=", value_from_param: "sl_pct" }], reason: "SL" }],
    macro_regime_gate: { category: "inflation" },
  });
  assert.strictEqual(r2.success, false);
});

ok("v0.5.x: macro_regime_gate rejects unknown sub-keys (strict)", () => {
  const r = parseSpec({
    name: "bad_gate_key_test",
    exchange: "alpaca",
    candle_granularity: "ONE_DAY",
    candle_window: 200,
    params: { sl_pct: -3, tp_pct: 6 },
    entry_rules: [{ mode: "ENTRY", when: [{ indicator: "trend", field: "up", op: "==", value: true }] }],
    exit_rules: [{ applies_to: "ENTRY", when: [{ type: "pnl", field: "pnlPct", op: "<=", value_from_param: "sl_pct" }], reason: "SL" }],
    macro_regime_gate: { category: "recession", reqired_bucket: "favorable" },  // typo
  });
  assert.strictEqual(r.success, false);
});

ok("v0.5.x: generator emits MACRO_REGIME_GATE block when gate is set", () => {
  const code = generateStrategyCode({
    name: "gate_emission_test",
    exchange: "alpaca",
    candle_granularity: "ONE_DAY",
    candle_window: 200,
    params: { sl_pct: -3, tp_pct: 6 },
    entry_rules: [{ mode: "ENTRY", when: [{ indicator: "trend", field: "up", op: "==", value: true }] }],
    exit_rules: [{ applies_to: "ENTRY", when: [{ type: "pnl", field: "pnlPct", op: "<=", value_from_param: "sl_pct" }], reason: "SL" }],
    macro_regime_gate: { category: "recession" },
  });
  assert.ok(code.includes("MACRO_REGIME_GATE"), "should emit gate block header comment");
  assert.ok(code.includes("data/macro_gate.json"), "should read from data/macro_gate.json");
  assert.ok(code.includes("_mg?.categories?.recession"), "should reference the configured category");
  assert.ok(code.includes('_cat.bucket !== "favorable"'), "should block when not favorable");
  // Parse without executing — catches syntax errors in emitted guard
  new Function(code);
});

ok("v0.5.x: generator does NOT emit gate when macro_regime_gate omitted", () => {
  const code = generateStrategyCode({
    name: "no_gate_test",
    exchange: "alpaca",
    candle_granularity: "ONE_DAY",
    candle_window: 200,
    params: { sl_pct: -3, tp_pct: 6 },
    entry_rules: [{ mode: "ENTRY", when: [{ indicator: "trend", field: "up", op: "==", value: true }] }],
    exit_rules: [{ applies_to: "ENTRY", when: [{ type: "pnl", field: "pnlPct", op: "<=", value_from_param: "sl_pct" }], reason: "SL" }],
  });
  assert.ok(!code.includes("MACRO_REGIME_GATE"), "should NOT emit gate block when not configured");
  assert.ok(!code.includes("data/macro_gate.json"), "should NOT reference macro_gate.json when not configured");
});

ok("v0.5.x: gate fallback=allow emits 'false' on missing history", () => {
  const code = generateStrategyCode({
    name: "allow_fallback_test",
    exchange: "alpaca",
    candle_granularity: "ONE_DAY",
    candle_window: 200,
    params: { sl_pct: -3, tp_pct: 6 },
    entry_rules: [{ mode: "ENTRY", when: [{ indicator: "trend", field: "up", op: "==", value: true }] }],
    exit_rules: [{ applies_to: "ENTRY", when: [{ type: "pnl", field: "pnlPct", op: "<=", value_from_param: "sl_pct" }], reason: "SL" }],
    macro_regime_gate: { category: "recession", fallback_when_insufficient_history: "allow" },
  });
  // The guard's _cat-missing branch must return false (don't block).
  // Match the literal "return false" inside the fallback context.
  assert.ok(code.includes('if (!_cat) return false'), "missing-category fallback should be 'return false' under allow");
});

ok("v0.6.1: alpaca spec WITHOUT eod_exit_min_pnl_pct skips the EOD block entirely", () => {
  const code = generateStrategyCode({
    name: "no_eod_test",
    exchange: "alpaca",
    candle_granularity: "ONE_DAY",
    candle_window: 200,
    params: { sl_pct: -3, tp_pct: 6 },  // no eod_exit_min_pnl_pct
    entry_rules: [{ mode: "ENTRY", when: [{ indicator: "trend", field: "up", op: "==", value: true }] }],
    exit_rules: [{ applies_to: "ENTRY", when: [{ type: "pnl", field: "pnlPct", op: "<=", value_from_param: "sl_pct" }], reason: "SL" }],
  });
  assert.ok(!code.includes("EOD_EXIT"), "generated code must NOT emit EOD_EXIT when param absent");
  assert.ok(!code.includes("eod_exit_min_pnl_pct"), "generated code must NOT reference eod_exit_min_pnl_pct when param absent");
  assert.ok(!code.includes("_isEodWindow"),       "generated code must NOT emit _isEodWindow helper when EOD block skipped");
});

ok("v0.6.1: alpaca spec WITH eod_exit_min_pnl_pct still emits the EOD block", () => {
  const code = generateStrategyCode({
    name: "with_eod_test",
    exchange: "alpaca",
    candle_granularity: "ONE_DAY",
    candle_window: 200,
    params: { sl_pct: -3, tp_pct: 6, eod_exit_min_pnl_pct: 0.5 },
    entry_rules: [{ mode: "ENTRY", when: [{ indicator: "trend", field: "up", op: "==", value: true }] }],
    exit_rules: [{ applies_to: "ENTRY", when: [{ type: "pnl", field: "pnlPct", op: "<=", value_from_param: "sl_pct" }], reason: "SL" }],
  });
  assert.ok(code.includes("EOD_EXIT"),                "generated code must emit EOD_EXIT when param is set");
  assert.ok(code.includes("eod_exit_min_pnl_pct"),    "generated code must reference eod_exit_min_pnl_pct when set");
  assert.ok(code.includes("_isEodWindow"),            "generated code must emit _isEodWindow helper when set");
});

ok("v0.6.1: coinbase spec never emits EOD block regardless of param", () => {
  const code = generateStrategyCode({
    name: "coinbase_no_eod_test",
    exchange: "coinbase",
    candle_granularity: "ONE_DAY",
    candle_window: 200,
    params: { sl_pct: -3, tp_pct: 6, eod_exit_min_pnl_pct: 0.5 },  // set but should be ignored
    entry_rules: [{ mode: "ENTRY", when: [{ indicator: "trend", field: "up", op: "==", value: true }] }],
    exit_rules: [{ applies_to: "ENTRY", when: [{ type: "pnl", field: "pnlPct", op: "<=", value_from_param: "sl_pct" }], reason: "SL" }],
  });
  assert.ok(!code.includes("EOD_EXIT"), "coinbase spec must not emit EOD_EXIT (crypto trades 24/7)");
});

ok("generated code has zero @stratchai/core references (must be self-contained)", () => {
  const code = generateStrategyCode({
    name: "isolation_test",
    exchange: "coinbase",
    candle_granularity: "ONE_DAY",
    candle_window: 200,
    params: { sl_pct: -3, tp_pct: 6 },
    entry_rules: [{
      mode: "ENTRY",
      when: [{ indicator: "trend", field: "up", op: "==", value: true }],
    }],
    exit_rules: [{
      applies_to: "ENTRY",
      when: [{ type: "pnl", field: "pnlPct", op: "<=", value_from_param: "sl_pct" }],
      reason: "SL",
    }],
  });
  // The generated strategy must only require @stratchai/indicators at runtime.
  // Any @stratchai/core reference (real or in comments) is a regression — core
  // is not on npm, so generated code with that reference fails to load for
  // anyone outside the private workspace.
  assert.ok(
    !code.includes("@stratchai/core"),
    "generated code must not reference @stratchai/core (even in comments)"
  );
});

// on_closed_bar_only: indicator-condition flag that swaps the generated
// RSI read from rsiValue (uses partial in-progress bar via the every-tick
// `prices.push(price)` in agent.js) to rsiValueClosed (RSI on closed bars
// only — matches walk-forward audit semantics). Required so the audited
// rule and the live rule are the same rule.
ok("schema accepts on_closed_bar_only flag", () => {
  const r = parseSpec({
    name: "closed_bar_flag_test",
    exchange: "coinbase-paper",
    candle_granularity: "ONE_DAY",
    candle_window: 250,
    params: { rsi_period: 14, rsi_exit: 55, min_hold_ms: 86400000 },
    entry_rules: [{ mode: "X", when: [{ indicator: "rsi", field: "value", op: "<", value: 30 }] }],
    exit_rules: [{
      applies_to: "X",
      reason: "RSI_RECOVERY",
      when: [
        { type: "time", field: "holdMs", op: ">=", value_from_param: "min_hold_ms" },
        { indicator: "rsi", field: "value", op: ">=", value_from_param: "rsi_exit", on_closed_bar_only: true },
      ],
    }],
  });
  assert.strictEqual(r.success, true);
});

ok("generator emits rsiValueClosed precompute (always present, cost is negligible)", () => {
  const code = generateStrategyCode({
    name: "closed_bar_precompute",
    exchange: "coinbase-paper",
    candle_granularity: "ONE_DAY",
    candle_window: 250,
    params: { rsi_period: 14 },
    entry_rules: [{ mode: "X", when: [{ indicator: "rsi", field: "value", op: "<", value: 30 }] }],
    exit_rules: [{ applies_to: "X", reason: "TIME_EXIT", when: [{ type: "time", field: "holdMs", op: ">=", value: 1 }] }],
  });
  assert.ok(code.includes("rsiValueClosed"), "should declare rsiValueClosed");
  assert.ok(code.includes("prices.slice(0, -1)"), "rsiValueClosed should slice off the partial bar");
});

ok("generator emits rsiValueClosed reference when on_closed_bar_only=true (indicator form)", () => {
  const code = generateStrategyCode({
    name: "closed_bar_emit_indicator",
    exchange: "coinbase-paper",
    candle_granularity: "ONE_DAY",
    candle_window: 250,
    params: { rsi_period: 14, rsi_exit: 55, min_hold_ms: 86400000 },
    entry_rules: [{ mode: "X", when: [{ indicator: "rsi", field: "value", op: "<", value: 30 }] }],
    exit_rules: [{
      applies_to: "X",
      reason: "RSI_RECOVERY",
      when: [
        { type: "time", field: "holdMs", op: ">=", value_from_param: "min_hold_ms" },
        { indicator: "rsi", field: "value", op: ">=", value_from_param: "rsi_exit", on_closed_bar_only: true },
      ],
    }],
  });
  // The closed-bar exit condition emits the NaN-coerced form for null safety.
  assert.ok(code.includes("(rsiValueClosed ?? NaN)"), "exit condition should reference closed-bar RSI (NaN-coerced)");
  // Ensure the standard `rsiValue >= params.rsi_exit` form for this exit is GONE.
  assert.ok(!/rsiValue \>= params\.rsi_exit/.test(code), "live-tick rsiValue read for rsi_exit should be replaced");
});

ok("generator keeps rsiValue (partial-bar) when on_closed_bar_only is absent", () => {
  const code = generateStrategyCode({
    name: "partial_bar_default",
    exchange: "coinbase-paper",
    candle_granularity: "ONE_DAY",
    candle_window: 250,
    params: { rsi_period: 14, rsi_exit: 55, min_hold_ms: 86400000 },
    entry_rules: [{ mode: "X", when: [{ indicator: "rsi", field: "value", op: "<", value: 30 }] }],
    exit_rules: [{
      applies_to: "X",
      reason: "RSI_RECOVERY",
      when: [
        { type: "time", field: "holdMs", op: ">=", value_from_param: "min_hold_ms" },
        { indicator: "rsi", field: "value", op: ">=", value_from_param: "rsi_exit" }, // no flag → keep current behavior
      ],
    }],
  });
  // Without the flag, the exit references rsiValue (partial-bar). Closed-bar
  // precompute is still present (it's cheap and unconditional) but isn't used.
  assert.ok(/rsiValue \>= params\.rsi_exit/.test(code), "default exit should still read rsiValue (partial-bar)");
});

console.log("");
console.log(`${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
