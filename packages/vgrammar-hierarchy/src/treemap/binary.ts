/* Adapted from d3-hierarchy by Mike Bostock
 * https://observablehq.com/collection/@d3/d3-hierarchy
 * Licensed under the ISC

 * url: https://github.com/d3/d3-hierarchy/blob/main/src/treemap/binary.js
 * License: https://github.com/d3/d3-hierarchy/blob/main/LICENSE
 * @license
 */

import type { TreemapNodeElement } from '../interface';

export default function (parent: TreemapNodeElement, x0: number, y0: number, x1: number, y1: number) {
  const nodes = parent.children;
  const n = nodes.length;
  let sum = 0;
  const sums = new Array(n + 1);
  sums[0] = 0;

  for (let i = 0; i < n; ++i) {
    sum += nodes[i].value;
    sums[i + 1] = sum;
  }

  const partition = (i: number, j: number, value: number, x0: number, y0: number, x1: number, y1: number) => {
    if (i >= j - 1) {
      const node = nodes[i];
      node.x0 = x0;
      node.y0 = y0;
      node.x1 = x1;
      node.y1 = y1;
      return;
    }

    const valueOffset = sums[i];
    const valueTarget = value / 2 + valueOffset;
    let k = i + 1;
    let hi = j - 1;

    while (k < hi) {
      const mid = (k + hi) >>> 1;
      if (sums[mid] < valueTarget) {
        k = mid + 1;
      } else {
        hi = mid;
      }
    }

    if (valueTarget - sums[k - 1] < sums[k] - valueTarget && i + 1 < k) {
      --k;
    }

    const valueLeft = sums[k] - valueOffset;
    const valueRight = value - valueLeft;

    if (x1 - x0 > y1 - y0) {
      const xk = value ? (x0 * valueRight + x1 * valueLeft) / value : x1;
      partition(i, k, valueLeft, x0, y0, xk, y1);
      partition(k, j, valueRight, xk, y0, x1, y1);
    } else {
      const yk = value ? (y0 * valueRight + y1 * valueLeft) / value : y1;
      partition(i, k, valueLeft, x0, y0, x1, yk);
      partition(k, j, valueRight, x0, yk, x1, y1);
    }
  };

  partition(0, n, parent.value, x0, y0, x1, y1);
}
