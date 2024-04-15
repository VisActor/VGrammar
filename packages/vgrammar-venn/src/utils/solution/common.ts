/* Adapted from venn.js by Ben Frederickson
 * https://github.com/benfred/venn.js
 * Licensed under the MIT

 * url: https://github.com/benfred/venn.js/blob/master/src/layout.js
 * License: https://github.com/benfred/venn.js/blob/master/LICENSE
 * @license
 */

import { distance } from '../circle-intersection';
import type { VennCircleName, IVennCircle, ICluster } from '../interface';

// orientates a bunch of circles to point in orientation
export function orientateCircles(circles: IVennCircle[], orientation: number, orientationOrder: any) {
  if (orientationOrder === null) {
    circles.sort(function (a, b) {
      return b.radius - a.radius;
    });
  } else {
    circles.sort(orientationOrder);
  }

  let i;
  // shift circles so largest circle is at (0, 0)
  if (circles.length > 0) {
    const largestX = circles[0].x;
    const largestY = circles[0].y;

    for (i = 0; i < circles.length; ++i) {
      circles[i].x -= largestX;
      circles[i].y -= largestY;
    }
  }

  if (circles.length === 2) {
    // if the second circle is a subset of the first, arrange so that
    // it is off to one side. hack for https://github.com/benfred/venn.js/issues/120
    const dist = distance(circles[0], circles[1]);
    if (dist < Math.abs(circles[1].radius - circles[0].radius)) {
      circles[1].x = circles[0].x + circles[0].radius - circles[1].radius - 1e-10;
      circles[1].y = circles[0].y;
    }
  }

  // rotate circles so that second largest is at an angle of 'orientation'
  // from largest
  if (circles.length > 1) {
    const rotation = Math.atan2(circles[1].x, circles[1].y) - orientation;
    const c = Math.cos(rotation);
    const s = Math.sin(rotation);
    let x;
    let y;

    y;

    for (i = 0; i < circles.length; ++i) {
      x = circles[i].x;
      y = circles[i].y;
      circles[i].x = c * x - s * y;
      circles[i].y = s * x + c * y;
    }
  }

  // mirror solution if third solution is above plane specified by
  // first two circles
  if (circles.length > 2) {
    let angle = Math.atan2(circles[2].x, circles[2].y) - orientation;
    while (angle < 0) {
      angle += 2 * Math.PI;
    }
    while (angle > 2 * Math.PI) {
      angle -= 2 * Math.PI;
    }
    if (angle > Math.PI) {
      const slope = circles[1].y / (1e-10 + circles[1].x);
      for (i = 0; i < circles.length; ++i) {
        const d = (circles[i].x + slope * circles[i].y) / (1 + slope * slope);
        circles[i].x = 2 * d - circles[i].x;
        circles[i].y = 2 * d * slope - circles[i].y;
      }
    }
  }
}

export function disjointCluster(circles: IVennCircle[]): ICluster[] {
  // union-find clustering to get disjoint sets
  circles.map(function (circle: IVennCircle) {
    circle.parent = circle;
  });

  // path compression step in union find
  function find(circle: IVennCircle) {
    if (circle.parent !== circle) {
      circle.parent = find(circle.parent);
    }
    return circle.parent;
  }

  function union(x: IVennCircle, y: IVennCircle) {
    const xRoot = find(x);
    const yRoot = find(y);
    xRoot.parent = yRoot;
  }

  // get the union of all overlapping sets
  for (let i = 0; i < circles.length; ++i) {
    for (let j = i + 1; j < circles.length; ++j) {
      const maxDistance = circles[i].radius + circles[j].radius;
      if (distance(circles[i], circles[j]) + 1e-10 < maxDistance) {
        union(circles[j], circles[i]);
      }
    }
  }

  // find all the disjoint clusters and group them together
  const disjointClusters: Record<VennCircleName, IVennCircle[]> = {};
  let setId;
  for (let i = 0; i < circles.length; ++i) {
    setId = find(circles[i]).parent.setId;
    if (!(setId in disjointClusters)) {
      disjointClusters[setId] = [];
    }
    disjointClusters[setId].push(circles[i]);
  }

  // cleanup bookkeeping
  circles.map(function (circle: IVennCircle) {
    delete circle.parent;
  });

  // return in more usable form
  const ret: IVennCircle[][] = [];
  for (setId in disjointClusters) {
    if (disjointClusters.hasOwnProperty(setId)) {
      ret.push(disjointClusters[setId]);
    }
  }
  return ret;
}

export function getBoundingBox(circles: IVennCircle[]) {
  const minMax = function (d: string) {
    const hi = Math.max.apply(
      null,
      circles.map(function (c) {
        return c[d] + c.radius;
      })
    );
    const lo = Math.min.apply(
      null,
      circles.map(function (c) {
        return c[d] - c.radius;
      })
    );
    return { max: hi, min: lo };
  };

  return { xRange: minMax('x'), yRange: minMax('y') };
}
