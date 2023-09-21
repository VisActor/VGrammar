import { transform } from '../../src/transforms/data/bin';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

test('basic bin', () => {
  const data = [
    { category: 'A', amount: 28, index: 0 },
    { category: 'B', amount: 55, index: 1 },
    { category: 'C', amount: 43, index: 2 },
    { category: 'D', amount: 91, index: 3 },
    { category: 'E', amount: 81, index: 4 },
    { category: 'F', amount: 53, index: 5 },
    { category: 'G', amount: 19, index: 6 },
    { category: 'H', amount: 87, index: 7 }
  ];

  const binnedData = transform(
    {
      field: 'amount',
      extent: [0, 100],
      step: 10,
      as: ['binStart', 'binEnd']
    },
    data
  );
  expect(binnedData).toEqual([
    { category: 'A', amount: 28, index: 0, binStart: 20, binEnd: 30 },
    { category: 'B', amount: 55, index: 1, binStart: 50, binEnd: 60 },
    { category: 'C', amount: 43, index: 2, binStart: 40, binEnd: 50 },
    { category: 'D', amount: 91, index: 3, binStart: 90, binEnd: 100 },
    { category: 'E', amount: 81, index: 4, binStart: 80, binEnd: 90 },
    { category: 'F', amount: 53, index: 5, binStart: 50, binEnd: 60 },
    { category: 'G', amount: 19, index: 6, binStart: 10, binEnd: 20 },
    { category: 'H', amount: 87, index: 7, binStart: 80, binEnd: 90 }
  ]);
});
