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
