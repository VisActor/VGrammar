import { isNil, isNumber } from '@visactor/vutils';
import type { CircularRelationTransformOptions, CircularRelationItem } from '../../types';
import { field as getFieldAccessor, extent, parseViewBox, toPercent } from '@visactor/vgrammar-util';

export const transform = (options: CircularRelationTransformOptions, upstreamData: any[]): CircularRelationItem[] => {
  if (!upstreamData || upstreamData.length === 0) {
    return [];
  }
  const viewBox = parseViewBox(options);
  const startAngle = options.startAngle ?? 0;
  const endAngle = options.endAngle ?? Math.PI * 2;
  const maxRadius = Math.max(viewBox.width / 2, viewBox.height / 2);
  const innerRadius = toPercent(options.innerRadius ?? 0, maxRadius);
  const outerRadius = toPercent(options.outerRadius, maxRadius);
  const center = [
    isNumber(options.center?.[0])
      ? options.center[0]
      : viewBox.x0 + toPercent(options.center?.[0] ?? '50%', viewBox.width),
    isNumber(options.center?.[1])
      ? options.center[1]
      : viewBox.y0 + toPercent(options.center?.[1] ?? '50%', viewBox.height)
  ] as [number, number];
  const fieldAccessor = getFieldAccessor(options.field);
  const values = upstreamData.map(fieldAccessor);
  const [min, max] = extent(values);
  const radiusScale =
    min === max
      ? (val: number) => (innerRadius + outerRadius) / 2
      : (val: number) => innerRadius + ((outerRadius - innerRadius) * (val - min)) / (max - min);

  const sizeAccessor = !isNil(options.radiusField) ? getFieldAccessor(options.radiusField) : fieldAccessor;
  const defaultSize = options?.radiusRange?.[1] ?? 5;
  let sizeScale = (datum: any) => defaultSize;

  if (sizeAccessor) {
    const [minSize, maxSize] = sizeAccessor !== fieldAccessor ? extent(upstreamData.map(sizeAccessor)) : [min, max];
    const minR = options.radiusRange?.[0] ?? 5;
    const maxR = options.radiusRange?.[1] ?? 5;

    if (minSize !== maxSize) {
      sizeScale = (datum: any) => minR + ((maxR - minR) * (sizeAccessor(datum) - minSize)) / (maxSize - minSize);
    }
  }

  const minAngle = Math.min(startAngle, endAngle);
  const maxAngle = Math.max(startAngle, endAngle);
  const angles = getPartialAngles(minAngle, maxAngle, upstreamData.length);

  const res: CircularRelationItem[] = [];
  const searchStep = 60;
  const searchAngle = (maxAngle - minAngle) / searchStep;

  upstreamData.forEach((datum, index) => {
    const radius = radiusScale(values[index] as number);
    const size = sizeScale(datum);
    let x: number;
    let y: number;
    let angle = angles[index];

    for (let i = 0; i < searchStep; i++) {
      x = center[0] + radius * Math.cos(angle);
      y = center[1] + radius * Math.sin(angle);

      if (
        hasOverlap({ x, y, radius: size }, res) ||
        x - size < viewBox.x0 ||
        x + size > viewBox.x1 ||
        y - size < viewBox.y0 ||
        y + size > viewBox.y1
      ) {
        if (i < searchStep - 1) {
          angle += searchAngle;

          if (angle > maxAngle) {
            angle = minAngle;
          } else if (angle < minAngle) {
            angle = maxAngle;
          }
        }
        continue;
      } else {
        break;
      }
    }

    res.push({ x, y, radius: size, datum });
  });

  return res;
};

const getPartialAngles = (minAngle: number, maxAngle: number, count: number) => {
  let offsetAngle = 0;
  let stepCount = Math.max(Math.ceil((2 * (maxAngle - minAngle)) / Math.PI), 2);
  let stepAngle = (maxAngle - minAngle) / stepCount;
  let stepIndex = 0;
  let stepSign = 1;
  let i = 0;
  let j = 0;
  const res: number[] = [];
  let startAngle = minAngle;

  while (i < count) {
    if (j < stepCount) {
      res.push(startAngle + (j % 2 ? Math.floor(j / 2) + Math.floor(stepCount / 2) : j / 2) * stepAngle * stepSign);
      j++;
    }

    i++;

    if (j === stepCount) {
      j = 0;
      stepIndex += 1;
      stepSign *= -1;

      if (offsetAngle === 0) {
        offsetAngle = stepAngle / 2;
      } else {
        offsetAngle /= 2;
      }
      startAngle = stepSign === -1 ? maxAngle - offsetAngle : minAngle + offsetAngle;

      if (stepIndex >= 2) {
        stepAngle /= 2;
        stepCount *= 2;
      }
    }
  }

  return res;
};

const hasOverlap = (item: Omit<CircularRelationItem, 'datum'>, arr: CircularRelationItem[]) => {
  if (!arr || !arr.length) {
    return false;
  }

  return arr.some(entry => {
    return Math.pow(item.x - entry.x, 2) + Math.pow(item.y - entry.y, 2) < Math.pow(item.radius + entry.radius, 2);
  });
};
