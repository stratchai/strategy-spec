"use strict";
// Spec schema — boot-time validation for strategy spec JSON.
//
// Goal: fail-fast on typos in recently-added blocks (e.g., `limit_order_mode`)
// without forcing every existing field to be enumerated. The pattern:
//
//   - Top-level uses .passthrough() so older / strategy-specific keys flow
//     through unchanged. New top-level keys don't need a schema bump.
//   - Recently-added or well-defined sub-objects (limit_order_mode, sweep
//     params) use .strict() — typos like `bracket_tp_pcts` fail here.
//   - `params` stays .passthrough() because the contract is strategy-specific
//     and constantly growing. Common params (sl_pct, tp_pct, max_hold_ms) are
//     loosely typed when present but not required.
//
// Usage:
//   const { parseSpec } = require("./spec_schema");
//   const result = parseSpec(specJson);
//   if (!result.success) { /* log result.error; decide whether to abort */ }
//
// Or fail-hard:
//   const { parseSpecOrThrow } = require("./spec_schema");
//   const spec = parseSpecOrThrow(specJson);   // throws on validation error

const { z } = require("zod");

// ── Sub-schemas ─────────────────────────────────────────────────────────────

// A blacklist entry may be a bare ticker string (manual, permanent) or a
// `{product, ts}` object written by the auto-cull. Both forms coexist in
// every real spec.
const blacklistEntry = z.union([
  z.string(),
  z.object({
    product: z.string(),
    ts:      z.number(),
  }).passthrough(),
]);

// A condition inside `when:` — supports either a literal `value` or a
// `value_from_param` reference. Some conditions also carry `type` (used by
// exit rules: pnl / time / time_of_day / band / macro / trailing_stop /
// vi_band / rsi / stoch). We don't enumerate every `type` here — too many
// and growing — and `op` is optional because behavior types like
// `trailing_stop` use `trigger_from_param` / `trail_from_param` instead of
// the standard `op` + `value` comparison pattern. Validation here is
// shape-only; the runtime rule executor enforces type-specific contracts.
const ruleCondition = z.object({
  indicator:        z.string().optional(),
  type:             z.string().optional(),
  field:            z.string().optional(),
  op:               z.string().optional(),       // ==, !=, <, <=, >, >=
  value:            z.unknown().optional(),
  value_from_param: z.string().optional(),
}).passthrough();

const entryRule = z.object({
  mode: z.string().optional(),
  when: z.array(ruleCondition).min(1),
}).passthrough();

const exitRule = z.object({
  applies_to: z.string().optional(),             // "MODE_NAME" | "ANY"
  when:       z.array(ruleCondition).min(1),
  reason:     z.string().optional(),
}).passthrough();

// limit_order_mode — well-defined and recently added. Strict so typos fail.
const limitOrderModeSchema = z.object({
  enabled:         z.boolean().optional(),
  bracket_sl_pct:  z.number().optional(),
  bracket_tp_pct:  z.number().optional(),
}).strict();

// sweep — used by sweep tooling. Strict on the known top keys.
const sweepSchema = z.object({
  assets:     z.array(z.string()).optional(),
  min_trades: z.number().optional(),
  params:     z.record(z.string(), z.array(z.unknown())).optional(),
}).strict();

// news — Stream C item 1. Spec block for news-driven strategies. Today's
// news_paper_trader.js in sigma hardcodes two signal types (PEAD on earnings
// + velocity on mention-spikes); this schema formalizes them so the same
// runtime can route to either based on spec config.
//
// signal_type is a discriminator. Each variant has its own required fields;
// shared fields (news_source, technical_confirmation, hold_days) sit at the
// outer level. .strict() inside each variant means typos in PEAD-specific
// config won't silently pass as velocity config (and vice versa).
//
// technical_confirmation is a separate discriminated union — the first
// implementation (triangle_breakout) mirrors the descending-triangle filter
// shipped in sigma's news_trader_v2 merge (2026-05-27). Future patterns
// (pennants, ascending channels) plug in as new variants without changing
// callers.
const triangleBreakoutConfirmation = z.object({
  type: z.literal("triangle_breakout"),
  pattern_lookback_bars: z.number().int().positive(),
  pattern_min_bars:      z.number().int().positive(),
  swing_lookback:        z.number().int().positive(),
  min_swing_highs:       z.number().int().positive(),
  min_swing_lows:        z.number().int().positive(),
  support_tolerance_pct: z.number(),
  breakout_buffer_pct:   z.number(),
}).strict();

const technicalConfirmationSchema = z.discriminatedUnion("type", [
  triangleBreakoutConfirmation,
  // future: pennant_breakout, ascending_channel, etc.
]);

const peadSignal = z.object({
  signal_type:           z.literal("pead"),
  // Material / sentiment / timing thresholds applied to LLM classifier output.
  material_threshold:    z.enum(["HIGH", "MEDIUM"]),
  sentiment_direction:   z.enum(["BULLISH", "BEARISH", "NEUTRAL"]),
  timing_window:         z.array(z.enum(["HOURS", "DAYS", "WEEKS"])).min(1),
  // Event-type filter (e.g., "earnings_beat", "guidance_raise"). When
  // omitted, accepts any earnings-classified article.
  event_types:           z.array(z.string()).optional(),
}).strict();

const velocitySignal = z.object({
  signal_type:           z.literal("velocity"),
  velocity_sigma:        z.number().positive(),
  velocity_min_count:    z.number().int().positive(),
  velocity_baseline_days: z.number().int().positive(),
}).strict();

const newsSchema = z.object({
  // Universal fields.
  news_source:           z.array(z.string()).min(1),    // e.g. ["alphavantage"]
  hold_days:             z.number().int().positive(),   // strategy-level hold cap
  // Per-signal configuration (discriminated by signal_type).
  signal:                z.discriminatedUnion("signal_type", [peadSignal, velocitySignal]),
  // Optional technical pattern confirmation applied after signal fires.
  technical_confirmation: technicalConfirmationSchema.optional(),
}).strict();

// params — strategy-specific knobs. passthrough; only loosely type the
// common ones if present.
const paramsSchema = z.object({
  sl_pct:                       z.number().optional(),
  tp_pct:                       z.number().optional(),
  max_hold_ms:                  z.number().optional(),
  min_hold_ms:                  z.number().optional(),
  strategy_cooldown_ms:         z.number().optional(),
  profit_floor_pct:             z.number().optional(),
  flat_regime_profit_floor_pct: z.number().optional(),
  eod_exit_min_pnl_pct:         z.number().optional(),
}).passthrough();

// ── Top-level spec ──────────────────────────────────────────────────────────

const specSchema = z.object({
  name:               z.string(),
  exchange:           z.enum(["coinbase", "coinbase-paper", "alpaca", "ib"]).optional(),
  candle_granularity: z.enum([
    "ONE_MINUTE", "FIVE_MINUTE", "FIFTEEN_MINUTE",
    "THIRTY_MINUTE", "ONE_HOUR", "TWO_HOUR",
    "SIX_HOUR", "ONE_DAY",
  ]).optional(),
  candle_window:      z.number().optional(),
  // entry_trigger — Stream C item 2 (runtime migration). Selects which event
  // stream advances the strategy's entry-rule evaluator. "candle_close" is the
  // legacy behavior (every existing spec) — rules fire on bar close.
  // "news_event" and "macro_event" wire the strategy to event-driven runtimes
  // (news_paper_trader, macro_regime). Default preserves all current specs.
  entry_trigger:      z.enum(["candle_close", "news_event", "macro_event"])
                       .default("candle_close"),
  description:        z.string().optional(),
  params:             paramsSchema,
  entry_rules:        z.array(entryRule).min(1),
  exit_rules:         z.array(exitRule).min(1),
  sweep:              sweepSchema.optional(),
  scan_whitelist:     z.array(z.string()).optional(),
  scan_whitelist_auto:z.array(z.string()).optional(),
  scan_blacklist:     z.array(blacklistEntry).optional(),
  min_backtest_score: z.number().optional(),
  min_vet_trades:     z.number().optional(),
  limit_order_mode:   limitOrderModeSchema.optional(),
  overlays:           z.record(z.string(), z.string()).optional(),
  news:               newsSchema.optional(),
}).passthrough();

// ── Public API ──────────────────────────────────────────────────────────────

// Safe parse: returns { success, data | error }. error is a Zod error with
// .issues you can iterate for reporting.
function parseSpec(spec) {
  return specSchema.safeParse(spec);
}

// Throw on failure with a readable multi-line message. For callers that
// want strict fail-fast (e.g., agent.js when STRICT_SPEC_VALIDATION=on).
function parseSpecOrThrow(spec) {
  const r = specSchema.safeParse(spec);
  if (r.success) return r.data;
  throw new Error(`Invalid spec for "${spec?.name || "(unnamed)"}":\n${formatIssues(r.error)}`);
}

// Pretty-printer for issues — joins each issue's `.` path with the message.
// Designed for log output, not user-facing UI.
function formatIssues(zodError) {
  return zodError.issues
    .map(i => `  - ${i.path.length ? i.path.join(".") : "(root)"}: ${i.message}`)
    .join("\n");
}

module.exports = { parseSpec, parseSpecOrThrow, formatIssues, specSchema, newsSchema };
