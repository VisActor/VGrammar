/* Adapted from venn.js by Ben Frederickson
 * https://github.com/benfred/venn.js
 * Licensed under the MIT

 * url: https://github.com/benfred/venn.js/blob/master/src/layout.js
 * License: https://github.com/benfred/venn.js/blob/master/LICENSE
 * @license
 */

import type { VennCircleName, IVennCircle, ICluster } from '../interface';
import { disjointCluster, getBoundingBox, orientateCircles } from './common';

export function normalizeSolution(
  solution: Record<VennCircleName, IVennCircle>,
  orientation: number,
  orientationOrder: any
): Record<VennCircleName, IVennCircle> {
  if (orientation === null) {
    orientation = Math.PI / 2;
  }

  // work with a list instead of a dictionary, and take a copy so we
  // don't mutate input
  let circles: ICluster = [];
  for (const setId in solution) {
    if (solution.hasOwnProperty(setId)) {
      const previous = solution[setId];
      circles.push({ x: previous.x, y: previous.y, radius: previous.radius, setId });
    }
  }

  // get all the disjoint clusters
  const clusters = disjointCluster(circles);

  // orientate all disjoint sets, get sizes
  for (let i = 0; i < clusters.length; ++i) {
    orientateCircles(clusters[i], orientation, orientationOrder);
    const bounds = getBoundingBox(clusters[i]);
    clusters[i].size = (bounds.xRange.max - bounds.xRange.min) * (bounds.yRange.max - bounds.yRange.min);
    clusters[i].bounds = bounds;
  }
  clusters.sort(function (a: ICluster, b: ICluster) {
    return b.size - a.size;
  });

  // orientate the largest at 0,0, and get the bounds
  circles = clusters[0];
  let returnBounds = circles.bounds;

  const spacing = (returnBounds.xRange.max - returnBounds.xRange.min) / 50;

  function addCluster(cluster: ICluster, right: boolean, bottom: boolean) {
    if (!cluster) {
      return;
    }

    const bounds = cluster.bounds;
    let xOffset;
    let yOffset;
    let centering;

    if (right) {
      xOffset = returnBounds.xRange.max - bounds.xRange.min + spacing;
    } else {
      xOffset = returnBounds.xRange.max - bounds.xRange.max;
      centering = (bounds.xRange.max - bounds.xRange.min) / 2 - (returnBounds.xRange.max - returnBounds.xRange.min) / 2;
      if (centering < 0) {
        xOffset += centering;
      }
    }

    if (bottom) {
      yOffset = returnBounds.yRange.max - bounds.yRange.min + spacing;
    } else {
      yOffset = returnBounds.yRange.max - bounds.yRange.max;
      centering = (bounds.yRange.max - bounds.yRange.min) / 2 - (returnBounds.yRange.max - returnBounds.yRange.min) / 2;
      if (centering < 0) {
        yOffset += centering;
      }
    }

    for (let j = 0; j < cluster.length; ++j) {
      cluster[j].x += xOffset;
      cluster[j].y += yOffset;
      circles.push(cluster[j]);
    }
  }

  let index = 1;
  while (index < clusters.length) {
    addCluster(clusters[index], true, false);
    addCluster(clusters[index + 1], false, true);
    addCluster(clusters[index + 2], true, true);
    index += 3;

    // have one cluster (in top left). lay out next three relative
    // to it in a grid
    returnBounds = getBoundingBox(circles);
  }

  // convert back to solution form
  const ret: Record<VennCircleName, IVennCircle> = {};
  for (let i = 0; i < circles.length; ++i) {
    ret[circles[i].setId] = circles[i];
  }
  return ret;
}
