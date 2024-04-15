/* Adapted from venn.js by Ben Frederickson
 * https://github.com/benfred/venn.js
 * Licensed under the MIT

 * url: https://github.com/benfred/venn.js/blob/master/src/layout.js
 * License: https://github.com/benfred/venn.js/blob/master/LICENSE
 * @license
 */

import { circleOverlap } from '../circle-intersection';
import { SMALL } from '../constant';
import { bisect, zerosM } from '../fmin';
import type { IVennArea } from '../interface';

/** Returns the distance necessary for two circles of radius r1 + r2 to
have the overlap area 'overlap' */
export function distanceFromIntersectArea(r1: number, r2: number, overlap: number) {
  // handle complete overlapped circles
  if (Math.min(r1, r2) * Math.min(r1, r2) * Math.PI <= overlap + SMALL) {
    return Math.abs(r1 - r2);
  }

  return bisect(
    function (distance: number) {
      return circleOverlap(r1, r2, distance) - overlap;
    },
    0,
    r1 + r2
  );
}

/// Returns two matrices, one of the euclidean distances between the sets
/// and the other indicating if there are subset or disjoint set relationships
export function getDistanceMatrices(areas: IVennArea[], sets: IVennArea[], setIds: Record<number, number>) {
  // initialize an empty distance matrix between all the points
  const distances = zerosM(sets.length, sets.length);
  const constraints = zerosM(sets.length, sets.length);

  // compute required distances between all the sets such that
  // the areas match
  areas
    .filter(function (x) {
      return x.sets.length === 2;
    })
    .map(function (current) {
      const left = setIds[current.sets[0]];
      const right = setIds[current.sets[1]];
      const r1 = Math.sqrt(sets[left].size / Math.PI);
      const r2 = Math.sqrt(sets[right].size / Math.PI);
      const distance = distanceFromIntersectArea(r1, r2, current.size);

      distances[left][right] = distances[right][left] = distance;

      // also update constraints to indicate if its a subset or disjoint
      // relationship
      let c = 0;
      if (current.size + 1e-10 >= Math.min(sets[left].size, sets[right].size)) {
        c = 1;
      } else if (current.size <= 1e-10) {
        c = -1;
      }
      constraints[left][right] = constraints[right][left] = c;
    });

  return { distances, constraints };
}
