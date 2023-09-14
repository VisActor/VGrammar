import type { PieTransformOption } from '../../types';
import { computeQuadrant } from '../util/util';

export const transform = (options: PieTransformOption, upstreamData: any[]) => {
  if (!upstreamData || upstreamData.length === 0) {
    return upstreamData;
  }
  const field = options.field;
  const startAngle = options.startAngle ?? 0;
  const endAngle = options.endAngle ?? Math.PI * 2;

  const { asStartAngle, asEndAngle, asMiddleAngle, asRadian, asRatio, asQuadrant, asK } = options;

  const total = upstreamData.reduce((sum, d) => Number.parseFloat(d[field]) + sum, 0);
  const max = upstreamData.reduce((m, d) => Math.max(m, Number.parseFloat(d[field])), -Infinity);

  const intervalAngle = endAngle - startAngle;
  let lastAngle = startAngle;
  const data = upstreamData.map(originDatum => {
    const datum = Object.assign({}, originDatum);
    const ratio = Number.parseFloat(datum[field]) / total;
    const radian = ratio * intervalAngle;

    asRatio && (datum[asRatio] = ratio);
    asStartAngle && (datum[asStartAngle] = lastAngle);
    asEndAngle && (datum[asEndAngle] = lastAngle + radian);
    asMiddleAngle && (datum[asMiddleAngle] = lastAngle + radian / 2);
    asRadian && (datum[asRadian] = radian);
    asQuadrant && (datum[asQuadrant] = computeQuadrant(lastAngle + radian / 2));
    asK && (datum[asK] = Number.parseFloat(datum[field]) / max);

    lastAngle = datum[asEndAngle];
    return datum;
  });
  data[data.length - 1][asEndAngle] = endAngle;
  return data;
};
