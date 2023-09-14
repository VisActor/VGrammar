import { isValidNumber } from '@visactor/vutils';
import type { FunnelTransformOption } from '../../types';

export const transform = (options: FunnelTransformOption, upstreamData: any[]) => {
  const {
    field,
    asTransformRatio,
    asReachRatio,
    asHeightRatio,
    asValueRatio,
    asNextValueRatio,
    asLastValueRatio,
    asLastValue,
    asCurrentValue,
    asNextValue,
    heightVisual = false,
    isCone = true,
    range
  } = options;

  const max = upstreamData.reduce((m, d) => Math.max(m, Number.parseFloat(d[field]) || -Infinity), -Infinity);
  const min = upstreamData.reduce((m, d) => Math.min(m, Number.parseFloat(d[field]) || Infinity), Infinity);
  const rangeArr = [range?.min ?? min, range?.max ?? max];

  const data = upstreamData.map((originDatum, index) => {
    const datum = Object.assign({}, originDatum);
    const currentValue: number = Number.parseFloat(datum[field]);
    const lastValue: number = Number.parseFloat(upstreamData[index - 1]?.[field]);
    const nextValue: number = Number.parseFloat(upstreamData[index + 1]?.[field]);

    const transformRatio = !isValidNumber(nextValue * currentValue) ? null : nextValue / currentValue;

    const reachRatio = !isValidNumber(currentValue * currentValue) ? null : currentValue / lastValue;

    asLastValue && (datum[asLastValue] = lastValue);
    asNextValue && (datum[asNextValue] = nextValue);
    asTransformRatio && (datum[asTransformRatio] = transformRatio);
    asReachRatio && (datum[asReachRatio] = index === 0 ? 1 : reachRatio);
    asHeightRatio && (datum[asHeightRatio] = heightVisual === true ? transformRatio : 1 / upstreamData.length);
    asValueRatio && (datum[asValueRatio] = currentValue / rangeArr[1]);
    asNextValueRatio &&
      (datum[asNextValueRatio] =
        index === upstreamData.length - 1 ? (isCone ? 0 : datum[asValueRatio]) : nextValue / rangeArr[1]);
    asLastValueRatio && (datum[asLastValueRatio] = index === 0 ? 1 : lastValue / rangeArr[1]);
    asCurrentValue && (datum[asCurrentValue] = currentValue);

    return datum;
  });

  return data;
};
