import { isValid } from '@visactor/vutils';
import type { BinTransformOption } from '../../types';

export const transform = (options: BinTransformOption, upstreamData: any[]) => {
  if (!upstreamData || upstreamData.length === 0) {
    return upstreamData;
  }

  const { extent, bins, step } = options;
  const range = extent[1] - extent[0];
  const binStep = isValid(step) ? step : range / (bins ?? 10);

  upstreamData.forEach(datum => {
    const value = datum[options.field];
    const binIndex = Math.floor((value - extent[0]) / binStep);
    const binStart = extent[0] + binIndex * binStep;
    const binEnd = Math.min(extent[1], extent[0] + (binIndex + 1) * binStep);
    datum[options.as?.[0] ?? 'binStart'] = binStart;
    datum[options.as?.[1] ?? 'binEnd'] = binEnd;
  });

  return upstreamData;
};
