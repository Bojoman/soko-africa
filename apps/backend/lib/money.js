/**
 * Money arithmetic in integer minor units.
 *
 * The implementation lives in `@soko/units` because the storefront has to
 * compute the same per-line rounding the server does — if the two diverge the
 * buyer sees one total and gets charged another. Re-exported here so backend
 * modules can keep importing from `lib/`.
 */
export {
  clampMinor,
  fromMinor,
  lineTotalMinor,
  minorExponent,
  minorToDecimalString,
  pctOfMinor,
  roundToProviderGranularity,
  sumMinor,
  toMinor,
  toNumber
} from '@soko/units';
