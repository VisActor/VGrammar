/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-statistics/src/lcg.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

// https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
const a = 1664525;
const c = 1013904223;
const m = 4294967296; // 2^32

export function randomLCG(initS: number = 1) {
  let s = initS;
  return () => (s = (a * s + c) % m) / m;
}
