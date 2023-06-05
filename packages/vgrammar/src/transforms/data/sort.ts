import { compare } from '@visactor/vgrammar-util';
import { isFunction } from '@visactor/vutils';
import type { SortConfigSpec } from '../../types';

export const transform = (
  options: {
    sort: SortConfigSpec | ((a: any, b: any) => number);
  },
  upstreamData: any[]
) => {
  const sort = options.sort;

  if (sort && upstreamData) {
    const sortFn = isFunction(sort) ? sort : compare(sort.field, sort.order);

    upstreamData.sort((a: any, b: any) => sortFn(a, b));
  }

  return upstreamData;
};
