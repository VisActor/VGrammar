import { range } from '@visactor/vutils';

interface RangeOptions {
  start: number;
  stop: number;
  step?: number;
  as?: string;
}

export const transform = (options: RangeOptions) => {
  const { start, stop, step = 1, as = 'data' } = options;

  return range(start, stop, step).map((val: number) => {
    return { [as]: val };
  });
};
