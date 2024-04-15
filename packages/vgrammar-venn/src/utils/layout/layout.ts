/* Adapted from venn.js by Ben Frederickson
 * https://github.com/benfred/venn.js
 * Licensed under the MIT

 * url: https://github.com/benfred/venn.js/blob/master/src/layout.js
 * License: https://github.com/benfred/venn.js/blob/master/LICENSE
 * @license
 */

import { nelderMead } from '../fmin';
import type { VennCircleName, IVennArea, IVennCircle, IVennParams, VennAreaName } from '../interface';
import { greedyLayout } from './greedy-layout';
import { lossFunction } from './loss';
import { constrainedMDSLayout } from './constrained-mds-layout';

/** given a list of set objects, and their corresponding overlaps.
updates the (x, y, radius) attribute on each set such that their positions
roughly correspond to the desired overlaps */
export function venn(areas: IVennArea[], parameters?: IVennParams) {
  parameters = parameters || {};
  parameters.maxIterations = parameters.maxIterations || 500;
  const initialLayout = parameters.initialLayout || bestInitialLayout;
  const loss = parameters.lossFunction || lossFunction;

  // add in missing pairwise areas as having 0 size
  areas = addMissingAreas(areas);

  // initial layout is done greedily
  const circles = initialLayout(areas, parameters);

  // transform x/y coordinates to a vector to optimize
  const initial: number[] = [];
  const setIds: VennCircleName[] = [];
  for (const setId in circles) {
    if (circles.hasOwnProperty(setId)) {
      initial.push(circles[setId].x);
      initial.push(circles[setId].y);
      setIds.push(setId);
    }
  }

  // optimize initial layout from our loss function
  const solution = nelderMead(
    function (values: number[]) {
      const current = {};
      for (let i = 0; i < setIds.length; ++i) {
        const setId = setIds[i];
        current[setId] = {
          x: values[2 * i],
          y: values[2 * i + 1],
          radius: circles[setId].radius
          // size : circles[setId].size
        };
      }
      return loss(current, areas);
    },
    initial,
    parameters
  );

  // transform solution vector back to x/y points
  const positions = solution.x;
  for (let i = 0; i < setIds.length; ++i) {
    const setId = setIds[i];
    circles[setId].x = positions[2 * i];
    circles[setId].y = positions[2 * i + 1];
  }

  return circles;
}

/** Missing pair-wise intersection area data can cause problems:
 treating as an unknown means that sets will be laid out overlapping,
 which isn't what people expect. To reflect that we want disjoint sets
 here, set the overlap to 0 for all missing pairwise set intersections */
function addMissingAreas(areas: IVennArea[]) {
  areas = areas.slice();

  // two circle intersections that aren't defined
  const ids: VennCircleName[] = [];
  const pairs: Record<VennAreaName, true> = {};
  for (let i = 0; i < areas.length; ++i) {
    const area = areas[i];
    if (area.sets.length === 1) {
      ids.push(area.sets[0]);
    } else if (area.sets.length === 2) {
      const a = area.sets[0];
      const b = area.sets[1];
      pairs[[a, b].toString()] = true;
      pairs[[b, a].toString()] = true;
    }
  }
  ids.sort(function (a, b) {
    return +(a > b);
  });

  for (let i = 0; i < ids.length; ++i) {
    const a = ids[i];
    for (let j = i + 1; j < ids.length; ++j) {
      const b = ids[j];
      if (!([a, b].toString() in pairs)) {
        areas.push({ sets: [a, b], size: 0 });
      }
    }
  }
  return areas;
}

/// takes the best working variant of either constrained MDS or greedy
export function bestInitialLayout(areas: IVennArea[], params: IVennParams): Record<VennCircleName, IVennCircle> {
  let initial = greedyLayout(areas, params);
  const loss = params.lossFunction || lossFunction;

  // greedyLayout is sufficient for all 2/3 circle cases. try out
  // constrained MDS for higher order problems, take its output
  // if it outperforms. (greedy is aesthetically better on 2/3 circles
  // since it axis aligns)
  if (areas.length >= 8) {
    const constrained = constrainedMDSLayout(areas, params);
    const constrainedLoss = loss(constrained, areas);
    const greedyLoss = loss(initial, areas);

    if (constrainedLoss + 1e-8 < greedyLoss) {
      initial = constrained;
    }
  }
  return initial;
}
