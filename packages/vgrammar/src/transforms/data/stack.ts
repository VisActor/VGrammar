import { field } from '@visactor/vgrammar-util';
import { groupData } from '../../graph/mark/differ';
import type { StackTransformOptions } from '../../types';

const stack = (options: StackTransformOptions, data: any[]) => {
  const positiveValues = new Map<string, number>();
  const negativeValues = new Map<string, number>();

  const offset = options.offset ?? 'diverging';

  return data.map(datum => {
    const dimension = datum[options.dimensionField];
    const stackValue = offset === 'diverging' ? datum[options.stackField] : Math.abs(datum[options.stackField]);

    const map = stackValue >= 0 ? positiveValues : negativeValues;
    const lastValue = map.get(dimension) ?? 0;
    const value = stackValue + lastValue;
    map.set(dimension, value);

    return {
      dimension,
      value: stackValue,
      stack: value,
      prevStack: lastValue,
      datum
    };
  });
};

const silhouetteOffset = (options: StackTransformOptions, data: any[]) => {
  if (!data || data.length === 0) {
    return data;
  }
  const groupedData = groupData(data, field('dimension'));
  groupedData.keys.forEach(key => {
    const dimensionData = groupedData.data.get(key);
    if (!dimensionData || dimensionData.length <= 0) {
      return 0;
    }
    // refer to Stacked Graphs – Geometry & Aesthetics by Lee Byron & Martin Wattenberg, http://leebyron.com/streamgraph/
    const g0 = -dimensionData.reduce((sum, entry) => sum + entry.value, 0) / 2;
    dimensionData.forEach(datum => {
      datum.stack = datum.stack + g0;
      datum.prevStack = datum.prevStack + g0;
    });
  });

  return data;
};

const wiggleOffset = (options: StackTransformOptions, data: any[]) => {
  if (!data || data.length === 0) {
    return data;
  }
  const groupedData = groupData(data, field('dimension'));
  groupedData.keys.forEach(key => {
    const dimensionData = groupedData.data.get(key);
    if (!dimensionData || dimensionData.length <= 0) {
      return 0;
    }
    // refer to Stacked Graphs – Geometry & Aesthetics by Lee Byron & Martin Wattenberg, http://leebyron.com/streamgraph/
    const n = dimensionData.length;
    const g0 = -(1 / (n + 1)) * dimensionData.reduce((sum, entry, i) => entry.value * (n - i + 1), 0);
    dimensionData.forEach(datum => {
      datum.stack = datum.stack + g0;
      datum.prevStack = datum.prevStack + g0;
    });
  });

  return data;
};

const setFields = (options: StackTransformOptions, data: any[]) => {
  const needPercent = options.asPercentStack || options.asPrevPercentStack || options.asPercent || options.asSum;
  if (!needPercent) {
    return data.map(entry => {
      const { stack, prevStack, datum } = entry;
      const newDatum = Object.assign({}, datum);

      newDatum[options.asStack ?? options.stackField] = stack;
      if (options.asPrevStack) {
        newDatum[options.asPrevStack] = prevStack;
      }

      return newDatum;
    });
  }

  const positiveSums = new Map<string, number>();
  const negativeSums = new Map<string, number>();
  data.forEach(entry => {
    const { dimension, value } = entry;
    const map = value >= 0 ? positiveSums : negativeSums;
    map.set(dimension, (map.get(dimension) ?? 0) + value);
  });

  return data.map(entry => {
    const { dimension, value, stack, prevStack, datum } = entry;
    const newDatum = Object.assign({}, datum);
    const map = value >= 0 ? positiveSums : negativeSums;
    const sum = map.get(dimension) ?? 0;

    newDatum[options.asStack ?? options.stackField] = stack;
    if (options.asPrevStack) {
      newDatum[options.asPrevStack] = prevStack;
    }

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

    return newDatum;
  });
};

export const transform = (options: StackTransformOptions, upstreamData: any[]) => {
  const offset = options.offset ?? 'diverging';
  const data = options.order === 'negative' ? upstreamData.slice().reverse() : upstreamData;

  const stackedValues = stack(options, data);

  if (offset === 'silhouette') {
    silhouetteOffset(options, stackedValues);
  } else if (offset === 'wiggle') {
    wiggleOffset(options, stackedValues);
  }

  const output = setFields(options, stackedValues);

  return options.order === 'negative' ? output.reverse() : output;
};
