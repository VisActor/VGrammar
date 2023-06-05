import { isValidNumber } from '@visactor/vutils';

export const transform = (
  options: {
    field: string;
    /** 转化率（当前层到下一层的比例） **/
    asTransformRatio?: string;
    /** 到达率 （上一层到当前层的比例）*/
    asReachRatio?: string;
    /** 高度轴占总量的比例 **/
    asHeightRatio?: string;
    /** 当前值大小占比 */
    asValueRatio?: string;
    /** 上一层值大小占比 */
    asLastValueRatio?: string;
    /** 下一层值大小占比 */
    asNextValueRatio?: string;
    /** 当前层的值 */
    asCurrentValue?: string;
    /** 上一层的值 **/
    asLastValue?: string;
    /** 下一层的值 **/
    asNextValue?: string;

    /** 最底层漏斗是否为锥形 */
    isCone?: boolean;
    /** 高度是否进行数据映射 **/
    heightVisual?: boolean;

    /** 数值范围 */
    range?: { min: number; max: number };
  },
  upstreamData: any[]
) => {
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
