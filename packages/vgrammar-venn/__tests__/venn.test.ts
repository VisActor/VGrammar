import {
  VGRAMMAR_VENN_CIRCLE_RADIUS,
  VGRAMMAR_VENN_CIRCLE_X,
  VGRAMMAR_VENN_CIRCLE_Y,
  VGRAMMAR_VENN_DATUM_TYPE,
  VGRAMMAR_VENN_OVERLAP_PATH
} from '../src';
import type { IVennCircleDatum, IVennOverlapDatum } from '../src/interface';
import { getArcsFromPath, getCirclesFromArcs } from '../src/utils/path';
import { transform } from '../src/venn';
import { initBrowserEnv } from '@visactor/vgrammar-core';

initBrowserEnv();

const data = [
  { sets: ['A'], size: 12, label: 'A' },
  { sets: ['B'], size: 12, label: 'B' },
  { sets: ['C'], size: 12, label: 'C' },
  { sets: ['A', 'B'], size: 4, label: 'A,B', stroke: 'red' },
  { sets: ['A', 'C'], size: 4, label: 'A,C', stroke: 'red' },
  { sets: ['B', 'C'], size: 4, label: 'B,C', stroke: 'red' },
  { sets: ['A', 'B', 'C'], size: 2, label: 'A,B,C', stroke: 'blue' }
];

test('Data transform of 3 element venn', async () => {
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

  expect(result[0][VGRAMMAR_VENN_DATUM_TYPE]).toEqual('circle');
  expect(result[3][VGRAMMAR_VENN_DATUM_TYPE]).toEqual('overlap');

  expect((result[0] as IVennCircleDatum)[VGRAMMAR_VENN_CIRCLE_RADIUS]).toBeCloseTo(160.8, 0);
  expect((result[0] as IVennCircleDatum)[VGRAMMAR_VENN_CIRCLE_X]).toBeCloseTo(160.8, 0);
  expect((result[0] as IVennCircleDatum)[VGRAMMAR_VENN_CIRCLE_Y]).toBeCloseTo(327.1, 0);
});

test('Path transform of 3 element venn', async () => {
  const result = await transform(
    {
      x0: 0,
      y0: 0,
      x1: 500,
      y1: 500
    },
    data
  );

  const circles = getCirclesFromArcs(getArcsFromPath((result[6] as IVennOverlapDatum)[VGRAMMAR_VENN_OVERLAP_PATH]));

  expect(circles.length).toEqual(3);

  expect(circles[0].radius).toBeCloseTo((result[1] as IVennCircleDatum)[VGRAMMAR_VENN_CIRCLE_RADIUS], 0);
  expect(circles[0].x).toBeCloseTo((result[1] as IVennCircleDatum)[VGRAMMAR_VENN_CIRCLE_X], 0);
  expect(circles[0].y).toBeCloseTo((result[1] as IVennCircleDatum)[VGRAMMAR_VENN_CIRCLE_Y], 0);

  expect(circles[1].radius).toBeCloseTo((result[2] as IVennCircleDatum)[VGRAMMAR_VENN_CIRCLE_RADIUS], 0);
  expect(circles[1].x).toBeCloseTo((result[2] as IVennCircleDatum)[VGRAMMAR_VENN_CIRCLE_X], 0);
  expect(circles[1].y).toBeCloseTo((result[2] as IVennCircleDatum)[VGRAMMAR_VENN_CIRCLE_Y], 0);

  expect(circles[2].radius).toBeCloseTo((result[0] as IVennCircleDatum)[VGRAMMAR_VENN_CIRCLE_RADIUS], 0);
  expect(circles[2].x).toBeCloseTo((result[0] as IVennCircleDatum)[VGRAMMAR_VENN_CIRCLE_X], 0);
  expect(circles[2].y).toBeCloseTo((result[0] as IVennCircleDatum)[VGRAMMAR_VENN_CIRCLE_Y], 0);
});
