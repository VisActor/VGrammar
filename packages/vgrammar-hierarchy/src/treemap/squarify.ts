/* Adapted from d3-hierarchy by Mike Bostock
 * https://observablehq.com/collection/@d3/d3-hierarchy
 * Licensed under the ISC

 * url: https://github.com/d3/d3-hierarchy/blob/main/src/treemap/squarify.js
 * License: https://github.com/d3/d3-hierarchy/blob/main/LICENSE
 * @license
 */

import type { TreemapNodeElement } from '../interface';
import treemapDice from './dice';
import treemapSlice from './slice';

export function squarifyRatio(
  ratio: number,
  parent: TreemapNodeElement,
  x0: number,
  y0: number,
  x1: number,
  y1: number
) {
  const rows = [];
  const nodes = parent.children;
  let row;
  let nodeValue;
  let i0 = 0;
  let i1 = 0;
  const n = nodes.length;
  let dx;
  let dy;
  let value = parent.value;
  let sumValue;
  let minValue;
  let maxValue;
  let newRatio;
  let minRatio;
  let alpha;
  let beta;

  while (i0 < n) {
    dx = x1 - x0;
    dy = y1 - y0;

    // Find the next non-empty node.
    do {
      sumValue = nodes[i1++].value;
    } while (!sumValue && i1 < n);

    minValue = sumValue;
    maxValue = sumValue;
    alpha = Math.max(dy / dx, dx / dy) / (value * ratio);
    beta = sumValue * sumValue * alpha;
    minRatio = Math.max(maxValue / beta, beta / minValue);

    // Keep adding nodes while the aspect ratio maintains or improves.
    for (; i1 < n; ++i1) {
      nodeValue = nodes[i1].value;
      sumValue += nodeValue;

      if (nodeValue < minValue) {
        minValue = nodeValue;
      }
      if (nodeValue > maxValue) {
        maxValue = nodeValue;
      }
      beta = sumValue * sumValue * alpha;
      newRatio = Math.max(maxValue / beta, beta / minValue);
      if (newRatio > minRatio) {
        sumValue -= nodeValue;
        break;
      }
      minRatio = newRatio;
    }

    // Position and record the row orientation.
    row = Object.assign({}, parent, { value: sumValue, children: nodes.slice(i0, i1) });
    rows.push(row);
    if (dx < dy) {
      treemapDice(row, x0, y0, x1, value ? (y0 += (dy * sumValue) / value) : y1);
    } else {
      treemapSlice(row, x0, y0, value ? (x0 += (dx * sumValue) / value) : x1, y1);
    }
    value -= sumValue;
    i0 = i1;
  }

  return rows;
}

export const generateSquarify = (ratio: number) => {
  return (parent: TreemapNodeElement, x0: number, y0: number, x1: number, y1: number) => {
    squarifyRatio(ratio, parent, x0, y0, x1, y1);
  };
};
