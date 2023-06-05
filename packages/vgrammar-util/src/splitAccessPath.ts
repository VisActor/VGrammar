/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-util/src/splitAccessPath.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import { error } from './error';

export const splitAccessPath = (p: string) => {
  const path: string[] = [];
  const n = p.length;

  let q = null;
  let b = 0;
  let s = '';
  let i: number;
  let j: number;
  let c;

  p += '';

  const push = () => {
    path.push(s + p.substring(i, j));
    s = '';
    i = j + 1;
  };

  for (i = 0, j = 0; j < n; j += 1) {
    c = p[j];
    if (c === '\\') {
      s += p.substring(i, j);
      s += p.substring(++j, ++j);
      i = j;
    } else if (c === q) {
      push();
      q = null;
      b = -1;
    } else if (q) {
      continue;
    } else if (i === b && c === '"') {
      i = j + 1;
      q = c;
      // eslint-disable-next-line quotes
    } else if (i === b && c === "'") {
      i = j + 1;
      q = c;
    } else if (c === '.' && !b) {
      if (j > i) {
        push();
      } else {
        i = j + 1;
      }
    } else if (c === '[') {
      if (j > i) {
        push();
      }
      i = j + 1;
      b = i;
    } else if (c === ']') {
      if (!b) {
        error('Access path missing open bracket: ' + p);
      }
      if (b > 0) {
        push();
      }
      b = 0;
      i = j + 1;
    }
  }

  if (b) {
    error('Access path missing closing bracket: ' + p);
  }
  if (q) {
    error('Access path missing closing quote: ' + p);
  }

  if (j > i) {
    j += 1;
    push();
  }

  return path;
};
