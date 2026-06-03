# @stratchai/strategy-spec

Declarative trading strategy specifications. Compose strategies from indicators + rule predicates instead of hand-writing JavaScript.

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

The emitted strategy file uses [`@stratchai/indicators`](https://www.npmjs.com/package/@stratchai/indicators) at runtime. Install both:

```sh
npm install @stratchai/strategy-spec @stratchai/indicators
```

## CLI

```sh
# Generate a strategy from a JSON spec
sk-build-spec specs/my_strategy.json

# Override the output directory (default: ./strategies/)
STRATCHAI_STRATEGIES_DIR=./generated sk-build-spec specs/my_strategy.json
```

## API

### `parseSpec(obj)` / `parseSpecOrThrow(obj)`

Validate a spec object against the zod schema. Returns the parsed spec or a structured `ZodError` (or throws on `parseSpecOrThrow`).

### `generateStrategyCode(spec)`

Emit a strategy.js source string ready to write to disk. Pure function: same input → same output.

### `specSchema`

The raw zod schema. Compose with your own validators or generate JSON Schema for tooling.

## Supported indicators

Generated strategies can reference these indicators via `{ indicator: "<name>", field: "<field>", op, value }`:

`adx`, `alligator`, `ao`, `aroon`, `ascendingTriangle`, `band` (BB), `candle_pattern`, `cmf`, `cupAndHandle`, `donchian`, `doubleBottom`, `ema`, `engulfing`, `fib`, `flag`, `hammer`, `hma`, `ichimoku`, `keltner`, `macd`, `massIndex`, `mfi`, `morningStar`, `obv`, `opening_range`, `pivot`, `psar`, `roc`, `rsi`, `sma`, `squeeze`, `stoch`, `supertrend`, `trend`, `vwap`, `week52`.

Each indicator exposes specific fields — see [`@stratchai/indicators`](https://www.npmjs.com/package/@stratchai/indicators) for the catalog.

## Supported predicate types

- `indicator` predicates (above)
- `time_of_day` — ET-aware (DST-aware) decimal hour comparisons
- `pnl` — percentage move from entry
- `time` — milliseconds held
- `macro` — read `data/macro_guard.json` cached state
- `breakeven` — has price recovered to entry

## Origin

Extracted from [`@stratchai/core`](https://www.npmjs.com/package/@stratchai/core) v1.2.22 (2026-06-03). The full git history of the generator lives in core's tree at `src/tools/build/strategy_from_spec.js` through v1.2.21. Future development happens here.

## License

MIT
