# @stratchai/strategy-spec

[![npm version](https://img.shields.io/npm/v/@stratchai/strategy-spec.svg)](https://www.npmjs.com/package/@stratchai/strategy-spec)
[![npm downloads](https://img.shields.io/npm/dm/@stratchai/strategy-spec.svg)](https://www.npmjs.com/package/@stratchai/strategy-spec)
[![license](https://img.shields.io/npm/l/@stratchai/strategy-spec.svg)](./LICENSE)
[![node](https://img.shields.io/node/v/@stratchai/strategy-spec.svg)](https://nodejs.org)

**Declarative trading strategy specifications + code generator.** Write a strategy as a JSON spec — indicator references, rule predicates, exit conditions — and emit production JavaScript that runs against `@stratchai/indicators`.

```js
const { generateStrategyCode, parseSpecOrThrow } = require("@stratchai/strategy-spec");
const fs = require("fs");

const spec = parseSpecOrThrow({
  name: "rsi_oversold_bounce",
  exchange: "coinbase",
  candle_granularity: "ONE_DAY",
  candle_window: 200,
  params: { rsi_period: 14, rsi_oversold: 32, sl_pct: -4, tp_pct: 8 },
  entry_rules: [{
    mode: "RSI_OVERSOLD",
    when: [
      { indicator: "rsi",   field: "value", op: "<",  value_from_param: "rsi_oversold" },
      { indicator: "trend", field: "up",    op: "==", value: true }
    ]
  }],
  exit_rules: [
    { applies_to: "RSI_OVERSOLD", when: [{ type: "pnl", field: "pnlPct", op: ">=", value_from_param: "tp_pct" }], reason: "TP" },
    { applies_to: "RSI_OVERSOLD", when: [{ type: "pnl", field: "pnlPct", op: "<=", value_from_param: "sl_pct" }], reason: "SL" }
  ]
});

const code = generateStrategyCode(spec);
fs.writeFileSync("./strategies/strategy_rsi_oversold_bounce.js", code);
```

## Why specs?

Hand-written strategy code accumulates accidental complexity. Three problems compound:

- **Mistakes in the indicator-to-rule translation.** Off-by-one on `closes[length-1]` vs `closes[length-2]`, wrong comparison operator, forgotten warmup guard — these slip into hand-rolled code regularly and are tedious to test.
- **No single source of truth.** When entry conditions live in `.js`, you can't query them, version them, or generate documentation from them. They're not data.
- **Drift across variants.** A spec for `coinbase-paper` and one for `alpaca` end up as two diverged JavaScript files where they should be the same rules with different routing.

This package turns a strategy into validated, queryable data — and emits the runtime code from it. You write rules, the generator handles correct indicator dispatch, warmup periods, exit-rule ordering, regime-gate routing per exchange, and idiomatic profit-floor exits.

## Install

```bash
npm install @stratchai/strategy-spec @stratchai/indicators
```

`@stratchai/indicators` is a peer dependency — the generated strategy code calls it at runtime.

## Stratchai ecosystem

`@stratchai/strategy-spec` is the middle layer of a three-package toolkit:

| Package | Purpose |
|---|---|
| [`@stratchai/indicators`](https://www.npmjs.com/package/@stratchai/indicators) | 37 technical indicators + 12 series variants |
| **`@stratchai/strategy-spec`** | **Declarative specs → generated JavaScript (this package)** |
| [`@stratchai/backtest`](https://www.npmjs.com/package/@stratchai/backtest) | Walk-forward audit primitives for OOS validation |

Typical workflow: write a spec → generate the strategy → audit it on history with `@stratchai/backtest` → deploy the generated code into your live-trading runtime.

## CLI

```sh
# Generate a strategy from a JSON spec
sk-build-spec specs/my_strategy.json

# Override the output directory (default: ./strategies/)
STRATCHAI_STRATEGIES_DIR=./generated sk-build-spec specs/my_strategy.json
```

The CLI is identical to `generateStrategyCode(spec)` — useful in build scripts and CI.

## API

### `parseSpec(obj)` / `parseSpecOrThrow(obj)`

Validate a spec object against the zod schema. `parseSpec` returns `{ success, data }` (or `{ success: false, error: ZodError }`); `parseSpecOrThrow` throws on invalid input.

### `generateStrategyCode(spec)`

Emit a strategy.js source string. Pure function: same input → same output.

The emitted code is **self-contained** — it requires only `@stratchai/indicators` at runtime. No reference to internal frameworks, no hidden imports.

### `specSchema`

The raw zod schema. Compose with your own validators or generate JSON Schema for tooling, docs, or editor autocomplete.

## Spec format

A spec is a JSON object with these top-level fields:

| Field | Description |
|---|---|
| `name` | Strategy identifier (snake_case). Used for the output filename and log labels. |
| `exchange` | `"coinbase"`, `"coinbase-paper"`, or `"alpaca"`. Drives regime-gate field routing (BTC vs SPY). |
| `candle_granularity` | e.g. `"ONE_DAY"`, `"FIFTEEN_MINUTE"`. |
| `candle_window` | How many trailing bars the strategy needs. |
| `params` | Strategy parameters referenced by rules via `value_from_param`. |
| `entry_rules[]` | List of `{ mode, when: [predicate, ...] }`. All `when` predicates must match for entry. |
| `exit_rules[]` | List of `{ applies_to, when: [...], reason }`. First matching rule wins. |

### Supported predicate types

| Type | Example |
|---|---|
| `indicator` | `{ indicator: "rsi", field: "value", op: "<", value_from_param: "rsi_oversold" }` |
| `time_of_day` | `{ type: "time_of_day", field: "et_hour_decimal", op: ">=", value: 9.75 }` (ET-aware, DST-aware) |
| `pnl` | `{ type: "pnl", field: "pnlPct", op: "<=", value_from_param: "sl_pct" }` |
| `time` | `{ type: "time", field: "holdMs", op: ">=", value_from_param: "min_hold_ms" }` |
| `macro` | reads cached macro-guard state |
| `breakeven` | has price recovered to entry |

### Supported indicators in predicates

`adx`, `alligator`, `ao`, `aroon`, `ascendingTriangle`, `band` (Bollinger), `candle_pattern`, `cmf`, `cupAndHandle`, `donchian`, `doubleBottom`, `ema`, `engulfing`, `fib`, `flag`, `hammer`, `hma`, `ichimoku`, `keltner`, `macd`, `massIndex`, `mfi`, `morningStar`, `obv`, `opening_range`, `pivot`, `psar`, `roc`, `rsi`, `sma`, `squeeze`, `stoch`, `supertrend`, `trend`, `vwap`, `week52`.

Each indicator exposes specific fields. See [`@stratchai/indicators`](https://www.npmjs.com/package/@stratchai/indicators) for the catalog of return shapes.

## License

[MIT](./LICENSE)
