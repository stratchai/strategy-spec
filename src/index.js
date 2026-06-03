/**
 * @stratchai/strategy-spec
 *
 * Declarative trading strategy specifications. Compose strategies from
 * indicators + rule predicates instead of hand-writing JavaScript.
 *
 * Public API:
 *   const { parseSpec, specSchema, generateStrategyCode } = require("@stratchai/strategy-spec");
 *
 * - `parseSpec(obj)` / `parseSpecOrThrow(obj)`: validate a spec object
 * - `specSchema`: the zod schema (compose with your own validators)
 * - `generateStrategyCode(spec)`: emit a strategy.js source string ready to write to disk
 *
 * Generated strategies depend on `@stratchai/indicators` at runtime (peer
 * dependency). Consumers should install both packages.
 */
"use strict";

const schema = require("./schema");
const generator = require("./generator");

module.exports = {
  // Schema / validation API
  parseSpec:        schema.parseSpec,
  parseSpecOrThrow: schema.parseSpecOrThrow,
  formatIssues:     schema.formatIssues,
  specSchema:       schema.specSchema,
  newsSchema:       schema.newsSchema,

  // Code generation API
  generateStrategyCode: generator.generateStrategyCode,
};
