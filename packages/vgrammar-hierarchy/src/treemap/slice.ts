/* Adapted from d3-hierarchy by Mike Bostock
 * https://observablehq.com/collection/@d3/d3-hierarchy
 * Licensed under the ISC

 * url: https://github.com/d3/d3-hierarchy/blob/main/src/treemap/slice.js
 * License: https://github.com/d3/d3-hierarchy/blob/main/LICENSE
 * @license
 */

import type { TreemapNodeElement } from '../interface';

/**
 * split rect in vertical direction
 */
export default function (parent: TreemapNodeElement, x0: number, y0: number, x1: number, y1: number) {
  const nodes = parent.children;
  let node;
  let i = -1;
  const n = nodes.length;
  const k = parent.value && (y1 - y0) / parent.value;

  while (++i < n) {
    node = nodes[i];
    node.x0 = x0;
    node.x1 = x1;
    node.y0 = y0;
    y0 += node.value * k;
    node.y1 = y0;
  }
}
