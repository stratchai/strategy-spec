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

console.log("");
console.log(`${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
