/* Adapted from d3-hierarchy by Mike Bostock
 * https://observablehq.com/collection/@d3/d3-hierarchy
 * Licensed under the ISC

 * url: https://github.com/d3/d3-hierarchy/blob/main/src/treemap/sliceDice.js
 * License: https://github.com/d3/d3-hierarchy/blob/main/LICENSE
 * @license
 */

/**
 * split rect in vertical, horizontal direction alternatively
 */
import dice from './dice';
import type { TreemapNodeElement } from '../interface';
import slice from './slice';

export default function (parent: TreemapNodeElement, x0: number, y0: number, x1: number, y1: number) {
  (parent.depth % 2 === 1 ? slice : dice)(parent, x0, y0, x1, y1);
}
