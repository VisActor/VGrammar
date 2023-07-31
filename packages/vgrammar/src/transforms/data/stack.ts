import type { StackTransformOptions } from '../../types';

export const transform = (options: StackTransformOptions, upstreamData: any[]) => {
  const positiveValues = new Map<string, number>();
  const negativeValues = new Map<string, number>();
  const needSum = options.asPercentStack || options.asPrevPercentStack || options.asPercent || options.asSum;

  const orient = options.orient ?? 'positive';
  const data = orient === 'negative' ? upstreamData.slice().reverse() : upstreamData;
  const defaultDimValue = Symbol('dim');

  let stackedValues = data.map(datum => {
    const dimension = datum[options.dimensionField] ?? defaultDimValue;
    const stackValue = datum[options.stackField];

    const map = stackValue >= 0 ? positiveValues : negativeValues;
    const lastValue = map.get(dimension) ?? 0;
    const value = stackValue + lastValue;
    map.set(dimension, value);

    if (needSum) {
      return {
        dimension,
        value: stackValue,
        stack: value,
        prevStack: lastValue,
        datum
      };
    }

    const newDatum = Object.assign({}, datum);
    newDatum[options.asStack ?? options.stackField] = value;
    if (options.asPrevStack) {
      newDatum[options.asPrevStack] = lastValue;
    }

    return newDatum;
  });

  if (needSum) {
    stackedValues = stackedValues.map(entry => {
      const { dimension, value, stack, prevStack, datum } = entry;
      const newDatum = Object.assign({}, datum);
      const map = value >= 0 ? positiveValues : negativeValues;
      const sum = map.get(dimension) ?? 0;

      if (options.asSum) {
        newDatum[options.asSum] = sum;
      }

      if (options.asPercent) {
        newDatum[options.asPercent] = sum === 0 ? 0 : value / sum;
      }

      if (options.asPercentStack) {
        newDatum[options.asPercentStack] = sum === 0 ? 0 : stack / sum;
      }

      if (options.asPrevPercentStack) {
        newDatum[options.asPrevPercentStack] = sum === 0 ? 0 : prevStack / sum;
      }

      if (options.asPrevStack) {
        newDatum[options.asPrevStack] = prevStack;
      }

      newDatum[options.asStack ?? options.stackField] = stack;

      return newDatum;
    });
  }

  return orient === 'negative' ? stackedValues.reverse() : stackedValues;
};
