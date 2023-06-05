/* Adapted from d3-hierarchy by Mike Bostock
 * https://observablehq.com/collection/@d3/d3-hierarchy
 * Licensed under the ISC

 * url: https://github.com/d3/d3-hierarchy/blob/main/src/treemap/dice.js
 * License: https://github.com/d3/d3-hierarchy/blob/main/LICENSE
 * @license
 */

import type { HierarchicalDatum } from '../interface';

/**
 * split rect in horizontal direction
 */
export default function <T extends HierarchicalDatum>(
  parent: T,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  keyMap: Record<string, string> = { x0: 'x0', x1: 'x1', y0: 'y0', y1: 'y1' }
) {
  const nodes = parent.children;
  let node;
  let i = -1;
  const n = nodes.length;
  const k = parent.value && (x1 - x0) / parent.value;

  while (++i < n) {
    node = nodes[i];
    node[keyMap.y0] = y0;
    node[keyMap.y1] = y1;
    node[keyMap.x0] = x0;
    node[keyMap.x1] = x0 += node.value * k;
  }
}
