import type { IVennCircleDatum } from '../src/interface';
import { transform } from '../src/venn';
import { initBrowserEnv } from '@visactor/vgrammar-core';

initBrowserEnv();

test('Default transform of 3 element venn', async () => {
  const data = [
    { sets: ['A'], size: 12, label: 'A' },
    { sets: ['B'], size: 12, label: 'B' },
    { sets: ['C'], size: 12, label: 'C' },
    { sets: ['A', 'B'], size: 4, label: 'A,B', stroke: 'red' },
    { sets: ['A', 'C'], size: 4, label: 'A,C', stroke: 'red' },
    { sets: ['B', 'C'], size: 4, label: 'B,C', stroke: 'red' },
    { sets: ['A', 'B', 'C'], size: 2, label: 'A,B,C', stroke: 'blue' }
  ];

  const result = await transform(
    {
      x0: 0,
      y0: 0,
      x1: 500,
      y1: 500
    },
    data
  );

  expect(result.length).toEqual(7);

  expect(result[0].type).toEqual('circle');
  expect(result[3].type).toEqual('overlap');

  expect((result[0] as IVennCircleDatum).radius).toBeCloseTo(160.8, 0);
  expect((result[0] as IVennCircleDatum).x).toBeCloseTo(160.8, 0);
  expect((result[0] as IVennCircleDatum).y).toBeCloseTo(327.1, 0);
});
