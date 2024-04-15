/* Adapted from venn.js by Ben Frederickson
 * https://github.com/benfred/venn.js
 * Licensed under the MIT

 * url: https://github.com/benfred/venn.js/blob/master/src/layout.js
 * License: https://github.com/benfred/venn.js/blob/master/LICENSE
 * @license
 */

import { circleCircleIntersection } from '../circle-intersection';
import { SMALL } from '../constant';
import type { VennCircleName, IVennArea, IVennCircle, IPoint, IVennSingleArea, IVennParams } from '../interface';
import { lossFunction } from './loss';
import { distanceFromIntersectArea } from './common';

/** Lays out a Venn diagram greedily, going from most overlapped sets to
least overlapped, attempting to position each new set such that the
overlapping areas to already positioned sets are basically right */
export function greedyLayout(areas: IVennArea[], params: IVennParams): Record<VennCircleName, IVennCircle> {
  const loss = params && params.lossFunction ? params.lossFunction : lossFunction;
  // define a circle for each set
  const circles: Record<VennCircleName, IVennCircle> = {};
  const setOverlaps: Record<VennCircleName, IVennSingleArea[]> = {};
  for (let i = 0; i < areas.length; ++i) {
    const area = areas[i];
    if (area.sets.length === 1) {
      const set = area.sets[0];
      circles[set] = {
        x: 1e10,
        y: 1e10,
        size: area.size,
        radius: Math.sqrt(area.size / Math.PI)
      };
      setOverlaps[set] = [];
    }
  }
  areas = areas.filter(function (a) {
    return a.sets.length === 2;
  });

  // map each set to a list of all the other sets that overlap it
  for (let i = 0; i < areas.length; ++i) {
    const current = areas[i];
    let weight = current.hasOwnProperty('weight') ? current.weight : 1.0;
    const left = current.sets[0];
    const right = current.sets[1];

    // completely overlapped circles shouldn't be positioned early here
    if (current.size + SMALL >= Math.min(circles[left].size, circles[right].size)) {
      weight = 0;
    }

    setOverlaps[left].push({ set: right, size: current.size, weight: weight });
    setOverlaps[right].push({ set: left, size: current.size, weight: weight });
  }

  // get list of most overlapped sets
  const mostOverlapped: IVennSingleArea[] = [];
  for (const set in setOverlaps) {
    if (setOverlaps.hasOwnProperty(set)) {
      let size = 0;
      for (let i = 0; i < setOverlaps[set].length; ++i) {
        size += setOverlaps[set][i].size * setOverlaps[set][i].weight;
      }

      mostOverlapped.push({ set, size });
    }
  }

  // sort by size desc
  function sortOrder(a: IVennSingleArea, b: IVennSingleArea) {
    return b.size - a.size;
  }
  mostOverlapped.sort(sortOrder);

  // keep track of what sets have been laid out
  const positioned: Record<VennCircleName, true> = {};
  function isPositioned(element: IVennSingleArea) {
    return element.set in positioned;
  }

  // adds a point to the output
  function positionSet(point: IPoint, index: VennCircleName) {
    circles[index].x = point.x;
    circles[index].y = point.y;
    positioned[index] = true;
  }

  // add most overlapped set at (0,0)
  positionSet({ x: 0, y: 0 }, mostOverlapped[0].set);

  // get distances between all points. TODO, necessary?
  // answer: probably not
  // var distances = venn.getDistanceMatrices(circles, areas).distances;
  for (let i = 1; i < mostOverlapped.length; ++i) {
    const setIndex = mostOverlapped[i].set;
    const overlap = setOverlaps[setIndex].filter(isPositioned);
    const set = circles[setIndex];
    overlap.sort(sortOrder);

    if (overlap.length === 0) {
      // this shouldn't happen anymore with addMissingAreas
      throw 'ERROR: missing pairwise overlap information';
    }

    const points: IPoint[] = [];
    for (let j = 0; j < overlap.length; ++j) {
      // get appropriate distance from most overlapped already added set
      const p1 = circles[overlap[j].set];
      const d1 = distanceFromIntersectArea(set.radius, p1.radius, overlap[j].size);

      // sample positions at 90 degrees for maximum aesthetics
      points.push({ x: p1.x + d1, y: p1.y });
      points.push({ x: p1.x - d1, y: p1.y });
      points.push({ y: p1.y + d1, x: p1.x });
      points.push({ y: p1.y - d1, x: p1.x });

      // if we have at least 2 overlaps, then figure out where the
      // set should be positioned analytically and try those too
      for (let k = j + 1; k < overlap.length; ++k) {
        const p2 = circles[overlap[k].set];
        const d2 = distanceFromIntersectArea(set.radius, p2.radius, overlap[k].size);

        const extraPoints = circleCircleIntersection(
          { x: p1.x, y: p1.y, radius: d1 },
          { x: p2.x, y: p2.y, radius: d2 }
        );

        for (let l = 0; l < extraPoints.length; ++l) {
          points.push(extraPoints[l]);
        }
      }
    }

    // we have some candidate positions for the set, examine loss
    // at each position to figure out where to put it at
    let bestLoss = 1e50;
    let bestPoint = points[0];
    for (let j = 0; j < points.length; ++j) {
      circles[setIndex].x = points[j].x;
      circles[setIndex].y = points[j].y;
      const localLoss = loss(circles, areas);
      if (localLoss < bestLoss) {
        bestLoss = localLoss;
        bestPoint = points[j];
      }
    }

    positionSet(bestPoint, setIndex);
  }

  return circles;
}
