import { range } from '@visactor/vutils';
import type { RangeTransformOptions } from '../../types';

export const transform = (options: RangeTransformOptions) => {
  const { start, stop, step = 1, as = 'data' } = options;

  return range(start, stop, step).map((val: number) => {
    return { [as]: val };
  });
};
