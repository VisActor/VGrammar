import { isValid } from '@visactor/vutils';
import type { BinTransformOption } from '../../types';

const defaultBins = 10;

export const transform = (options: BinTransformOption, upstreamData: any[]) => {
  if (!upstreamData || upstreamData.length === 0) {
    return upstreamData;
  }

  const { extent, step } = options;
  const bins = isValid(options.bins) ? Math.max(options.bins, 1) : defaultBins;
  const range = extent[1] - extent[0];
  const binStep = isValid(step) ? step : range / bins;

  return upstreamData.map(upstreamDatum => {
    const datum = Object.assign({}, upstreamDatum);
    const value = upstreamDatum[options.field];
    const binIndex = Math.floor((value - extent[0]) / binStep);
    const binStart = extent[0] + binIndex * binStep;
    const binEnd = Math.min(extent[1], extent[0] + (binIndex + 1) * binStep);
    datum[options.as?.[0] ?? 'binStart'] = binStart;
    datum[options.as?.[1] ?? 'binEnd'] = binEnd;
    return datum;
  });
};
