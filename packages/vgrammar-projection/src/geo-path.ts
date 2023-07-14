import { identity, field as getFieldAccessor } from '@visactor/vgrammar-util';
import { isNil } from '@visactor/vutils';
import { getProjectionPath } from './projections';
import type { GeoPath, GeoProjection } from 'd3-geo';

function initPath(path: GeoPath, pointRadius: number) {
  const prev = path.pointRadius();
  path.context(null);
  if (!isNil(pointRadius)) {
    path.pointRadius(pointRadius);
  }
  return prev;
}

export const transform = (
  options: {
    field?: string;
    as?: string;
    projection?: GeoProjection;
    pointRadius?: number;
  },
  upstreamData: any[]
) => {
  const field = isNil(options.field) ? identity : getFieldAccessor(options.field);
  const as = options.as;
  const path = getProjectionPath(options.projection);

  const prev = initPath(path, options.pointRadius);
  let output = upstreamData;

  if (isNil(as)) {
    output = upstreamData.map(entry => {
      return path(field(entry));
    });
  } else {
    upstreamData.forEach(entry => {
      entry[as] = path(field(entry));
    });
  }

  path.pointRadius(prev);

  return output;
};
