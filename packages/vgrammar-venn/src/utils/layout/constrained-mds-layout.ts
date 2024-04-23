/* Adapted from venn.js by Ben Frederickson
 * https://github.com/benfred/venn.js
 * Licensed under the MIT

 * url: https://github.com/benfred/venn.js/blob/master/src/layout.js
 * License: https://github.com/benfred/venn.js/blob/master/LICENSE
 * @license
 */

import { conjugateGradient, norm2, scale, zeros } from '@visactor/vutils';
import type { VennCircleName, IVennArea, IVennCircle, IVennParams } from '../interface';
import { getDistanceMatrices } from './common';

/// use the constrained MDS variant to generate an initial layout
export function constrainedMDSLayout(areas: IVennArea[], params: IVennParams): Record<VennCircleName, IVennCircle> {
  params = params || {};
  const restarts = params.restarts || 10;

  // bidirectionally map sets to a rowid  (so we can create a matrix)
  const sets = [];
  const setIds = {};
  let i;
  for (i = 0; i < areas.length; ++i) {
    const area = areas[i];
    if (area.sets.length === 1) {
      setIds[area.sets[0]] = sets.length;
      sets.push(area);
    }
  }

  const matrices = getDistanceMatrices(areas, sets, setIds);
  let distances = matrices.distances;
  const constraints = matrices.constraints;

  // keep distances bounded, things get messed up otherwise.
  // TODO: proper preconditioner?
  const norm = norm2(distances.map(norm2)) / distances.length;
  distances = distances.map(function (row) {
    return row.map(function (value) {
      return value / norm;
    });
  });

  const obj = function (x: number[], fxPrime: number[]) {
    return constrainedMDSGradient(x, fxPrime, distances, constraints);
  };

  let best;
  let current;
  for (i = 0; i < restarts; ++i) {
    const initial = zeros(distances.length * 2).map(Math.random);

    current = conjugateGradient(obj, initial, params);
    if (!best || current.fx < best.fx) {
      best = current;
    }
  }
  const positions = best.x;

  // translate rows back to (x,y,radius) coordinates
  const circles = {};
  for (i = 0; i < sets.length; ++i) {
    const set = sets[i];
    circles[set.sets[0]] = {
      x: positions[2 * i] * norm,
      y: positions[2 * i + 1] * norm,
      radius: Math.sqrt(set.size / Math.PI)
    };
  }

  if (params.history) {
    for (i = 0; i < params.history.length; ++i) {
      (scale as any)(params.history[i].x, norm);
    }
  }
  return circles;
}

/// computes the gradient and loss simulatenously for our constrained MDS optimizer
function constrainedMDSGradient(x: number[], fxPrime: number[], distances: number[][], constraints: number[][]) {
  let loss = 0;
  let i;
  for (i = 0; i < fxPrime.length; ++i) {
    fxPrime[i] = 0;
  }

  for (i = 0; i < distances.length; ++i) {
    const xi = x[2 * i];
    const yi = x[2 * i + 1];
    for (let j = i + 1; j < distances.length; ++j) {
      const xj = x[2 * j];
      const yj = x[2 * j + 1];
      const dij = distances[i][j];
      const constraint = constraints[i][j];

      const squaredDistance = (xj - xi) * (xj - xi) + (yj - yi) * (yj - yi);
      const distance = Math.sqrt(squaredDistance);
      const delta = squaredDistance - dij * dij;

      if ((constraint > 0 && distance <= dij) || (constraint < 0 && distance >= dij)) {
        continue;
      }

      loss += 2 * delta * delta;

      fxPrime[2 * i] += 4 * delta * (xi - xj);
      fxPrime[2 * i + 1] += 4 * delta * (yi - yj);

      fxPrime[2 * j] += 4 * delta * (xj - xi);
      fxPrime[2 * j + 1] += 4 * delta * (yj - yi);
    }
  }
  return loss;
}
