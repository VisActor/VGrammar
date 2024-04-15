/* Adapted from venn.js by Ben Frederickson
 * https://github.com/benfred/venn.js
 * Licensed under the MIT

 * url: https://github.com/benfred/venn.js/blob/master/src/layout.js
 * License: https://github.com/benfred/venn.js/blob/master/LICENSE
 * @license
 */

import { circleOverlap, distance, intersectionArea } from '../circle-intersection';
import type { VennCircleName, IVennArea, IVennCircle } from '../interface';

/** Given a bunch of sets, and the desired overlaps between these sets - computes
the distance from the actual overlaps to the desired overlaps. Note that
this method ignores overlaps of more than 2 circles */
export function lossFunction(sets: Record<VennCircleName, IVennCircle>, overlaps: IVennArea[]): number {
  let output = 0;

  function getCircles(indices: VennCircleName[]) {
    return indices.map(function (i) {
      return sets[i];
    });
  }

  for (let i = 0; i < overlaps.length; ++i) {
    const area = overlaps[i];
    let overlap;
    if (area.sets.length === 1) {
      continue;
    } else if (area.sets.length === 2) {
      const left = sets[area.sets[0]];
      const right = sets[area.sets[1]];
      overlap = circleOverlap(left.radius, right.radius, distance(left, right));
    } else {
      overlap = intersectionArea(getCircles(area.sets));
    }

    const weight = area.hasOwnProperty('weight') ? area.weight : 1.0;
    output += weight * (overlap - area.size) * (overlap - area.size);
  }

  return output;
}
