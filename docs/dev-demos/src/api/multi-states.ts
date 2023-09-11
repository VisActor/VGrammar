/* eslint-disable no-console */
import { IView } from '@visactor/vgrammar-simple';

const originData = [
  { category: 'A', amount: 28, index: 0 },
  { category: 'B', amount: 55, index: 1 },
  { category: 'C', amount: 43, index: 2 },
  { category: 'D', amount: 91, index: 3 },
  { category: 'E', amount: 81, index: 4 },
  { category: 'F', amount: 53, index: 5 },
  { category: 'G', amount: 19, index: 6 },
  { category: 'H', amount: 87, index: 7 }
];

export const runner = (view: IView) => {
  const data = view.data(originData);
};

export const callback = (view: IView) => {
  // do nothing
};
