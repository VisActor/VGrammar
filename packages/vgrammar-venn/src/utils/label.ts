/* Adapted from venn.js by Ben Frederickson
 * https://github.com/benfred/venn.js
 * Licensed under the MIT

 * url: https://github.com/benfred/venn.js/blob/master/src/diagram.js
 * License: https://github.com/benfred/venn.js/blob/master/LICENSE
 * @license
 */

import type { IOverlapAreaStats, IPointLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { PointService, getCenter, intersectionArea, nelderMead, Logger } from '@visactor/vutils';
import type { VennCircleName, IVennArea, IVennCircle, VennAreaName } from './interface';

export function computeTextCenters(
  circles: Record<VennCircleName, IVennCircle>,
  areas: IVennArea[]
): Record<VennAreaName, IPointLike> {
  const ret: Record<VennAreaName, IPointLike> = {};
  const overlapped = getOverlappingCircles(circles);
  for (let i = 0; i < areas.length; ++i) {
    const area = areas[i].sets;
    const areaIds: Record<VennCircleName, true> = {};
    const exclude: Record<VennCircleName, true> = {};
    for (let j = 0; j < area.length; ++j) {
      areaIds[area[j]] = true;
      const overlaps = overlapped[area[j]];
      // keep track of any circles that overlap this area,
      // and don't consider for purposes of computing the text
      // centre
      for (let k = 0; k < overlaps.length; ++k) {
        exclude[overlaps[k]] = true;
      }
    }

    const interior: IVennCircle[] = [];
    const exterior: IVennCircle[] = [];
    for (const setId in circles) {
      if (setId in areaIds) {
        interior.push(circles[setId]);
      } else if (!(setId in exclude)) {
        exterior.push(circles[setId]);
      }
    }
    const center = computeTextCenter(interior, exterior);
    ret[area.toString()] = center;
    if (center.disjoint && areas[i].size > 0) {
      const logger = Logger.getInstance();
      logger.error('Area ' + area + ' not represented on screen');
    }
  }
  return ret;
}

// given a dictionary of {setid : circle}, returns
// a dictionary of setid to list of circles that completely overlap it
function getOverlappingCircles(circles: Record<VennCircleName, IVennCircle>): Record<VennCircleName, VennCircleName[]> {
  const ret: Record<VennCircleName, VennCircleName[]> = {};
  const circleIds: VennCircleName[] = [];
  for (const circleId in circles) {
    circleIds.push(circleId);
    ret[circleId] = [];
  }
  for (let i = 0; i < circleIds.length; i++) {
    const a = circles[circleIds[i]];
    for (let j = i + 1; j < circleIds.length; ++j) {
      const b = circles[circleIds[j]];
      const d = PointService.distancePP(a, b);

      if (d + b.radius <= a.radius + 1e-10) {
        ret[circleIds[j]].push(circleIds[i]);
      } else if (d + a.radius <= b.radius + 1e-10) {
        ret[circleIds[i]].push(circleIds[j]);
      }
    }
  }
  return ret;
}

// compute the center of some circles by maximizing the margin of
// the center point relative to the circles (interior) after subtracting
// nearby circles (exterior)
export function computeTextCenter(interior: IVennCircle[], exterior: IVennCircle[]) {
  // get an initial estimate by sampling around the interior circles
  // and taking the point with the biggest margin
  const points: IPointLike[] = [];
  for (let i = 0; i < interior.length; ++i) {
    const c = interior[i];
    points.push({ x: c.x, y: c.y });
    points.push({ x: c.x + c.radius / 2, y: c.y });
    points.push({ x: c.x - c.radius / 2, y: c.y });
    points.push({ x: c.x, y: c.y + c.radius / 2 });
    points.push({ x: c.x, y: c.y - c.radius / 2 });
  }
  let initial = points[0];
  let margin = circleMargin(points[0], interior, exterior);
  for (let i = 1; i < points.length; ++i) {
    const m = circleMargin(points[i], interior, exterior);
    if (m >= margin) {
      initial = points[i];
      margin = m;
    }
  }

  // maximize the margin numerically
  const solution = nelderMead(
    function (p: number[]) {
      return -1 * circleMargin({ x: p[0], y: p[1] }, interior, exterior);
    },
    [initial.x, initial.y],
    { maxIterations: 500, minErrorDelta: 1e-10 }
  ).x;
  let ret: {
    x: number;
    y: number;
    disjoint?: boolean;
  } = { x: solution[0], y: solution[1] };

  // check solution, fallback as needed (happens if fully overlapped
  // etc)
  let valid = true;
  for (let i = 0; i < interior.length; ++i) {
    if (PointService.distancePP(ret, interior[i]) > interior[i].radius) {
      valid = false;
      break;
    }
  }

  for (let i = 0; i < exterior.length; ++i) {
    if (PointService.distancePP(ret, exterior[i]) < exterior[i].radius) {
      valid = false;
      break;
    }
  }

  if (!valid) {
    if (interior.length === 1) {
      ret = { x: interior[0].x, y: interior[0].y };
    } else {
      const areaStats: IOverlapAreaStats = {};
      intersectionArea(interior, areaStats);

      if (areaStats.arcs.length === 0) {
        ret = { x: 0, y: -1000, disjoint: true };
      } else if (areaStats.arcs.length === 1) {
        ret = { x: areaStats.arcs[0].circle.x, y: areaStats.arcs[0].circle.y };
      } else if (exterior.length) {
        // try again without other circles
        ret = computeTextCenter(interior, []);
      } else {
        // take average of all the points in the intersection
        // polygon. this should basically never happen
        // and has some issues:
        // https://github.com/benfred/venn.js/issues/48#issuecomment-146069777
        ret = getCenter(
          areaStats.arcs.map(function (a) {
            return a.p1;
          })
        );
      }
    }
  }

  return ret;
}

function circleMargin(current: IPointLike, interior: IVennCircle[], exterior: IVennCircle[]) {
  let margin = interior[0].radius - PointService.distancePP(interior[0], current);
  let i;
  let m;
  for (i = 1; i < interior.length; ++i) {
    m = interior[i].radius - PointService.distancePP(interior[i], current);
    if (m <= margin) {
      margin = m;
    }
  }

  for (i = 0; i < exterior.length; ++i) {
    m = PointService.distancePP(exterior[i], current) - exterior[i].radius;
    if (m <= margin) {
      margin = m;
    }
  }
  return margin;
}
