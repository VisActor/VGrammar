/* Adapted from venn.js by Ben Frederickson
 * https://github.com/benfred/venn.js
 * Licensed under the MIT

 * url: https://github.com/benfred/venn.js/blob/master/src/layout.js
 * License: https://github.com/benfred/venn.js/blob/master/LICENSE
 * @license
 */

import type { VennCircleName, IVennCircle } from '../interface';
import { getBoundingBox } from './common';

/** Scales a solution from venn.venn or venn.greedyLayout such that it fits in
a rectangle of width/height - with padding around the borders. also
centers the diagram in the available space at the same time */
export function scaleSolution(
  solution: Record<VennCircleName, IVennCircle>,
  width: number,
  height: number,
  x0: number,
  y0: number
): Record<VennCircleName, IVennCircle> {
  width = Math.max(width, 1);
  height = Math.max(height, 1);

  const circles: IVennCircle[] = [];
  const setIds: VennCircleName[] = [];
  for (const setId in solution) {
    if (solution.hasOwnProperty(setId)) {
      setIds.push(setId);
      circles.push(solution[setId]);
    }
  }

  const bounds = getBoundingBox(circles);
  const xRange = bounds.xRange;
  const yRange = bounds.yRange;

  if (xRange.max === xRange.min || yRange.max === yRange.min) {
    // eslint-disable-next-line no-console
    console.log('not scaling solution: zero size detected');
    return solution;
  }

  const xScaling = width / (xRange.max - xRange.min);
  const yScaling = height / (yRange.max - yRange.min);
  const scaling = Math.min(yScaling, xScaling);

  // while we're at it, center the diagram too
  const xOffset = (width - (xRange.max - xRange.min) * scaling) / 2;
  const yOffset = (height - (yRange.max - yRange.min) * scaling) / 2;

  const scaled: Record<VennCircleName, IVennCircle> = {};
  for (let i = 0; i < circles.length; ++i) {
    const circle = circles[i];
    scaled[setIds[i]] = {
      radius: scaling * circle.radius,
      x: x0 + xOffset + (circle.x - xRange.min) * scaling,
      y: y0 + yOffset + (circle.y - yRange.min) * scaling,
      setId: circle.setId
    } as IVennCircle;
  }

  return scaled;
}
