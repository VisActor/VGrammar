/* eslint-disable no-console */
import type { IView, IPlot } from '@visactor/vgrammar';
import { category10 } from '../color-utils';

const originData = [
  { category: 'A', amount: 28, index: 0, type: 'A' },
  { category: 'B', amount: 55, index: 1, type: 'A' },
  { category: 'C', amount: 43, index: 2, type: 'A' },
  { category: 'D', amount: 91, index: 3, type: 'A' },
  { category: 'E', amount: 81, index: 4, type: 'A' },
  { category: 'F', amount: 53, index: 5, type: 'A' },
  { category: 'G', amount: 19, index: 6, type: 'A' },
  { category: 'H', amount: 87, index: 7, type: 'A' },

  { category: 'A', amount: 18, index: 0, type: 'B' },
  { category: 'B', amount: 35, index: 1, type: 'B' },
  { category: 'C', amount: 23, index: 2, type: 'B' },
  { category: 'D', amount: 71, index: 3, type: 'B' },
  { category: 'E', amount: 71, index: 4, type: 'B' },
  { category: 'F', amount: 33, index: 5, type: 'B' },
  { category: 'G', amount: 10, index: 6, type: 'B' },
  { category: 'H', amount: 47, index: 7, type: 'B' }
];

export const runner = (plot: IPlot) => {
  plot.interval()
    .data(originData)
    .encode('x', 'category')
    .encode('y', 'amount')
    .encode('group', 'type')
    .axis('x', true)
    .axis('y', true);
};

export const callback = (view: IView) => {
  // do nothing
};
