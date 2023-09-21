import { transform as kde } from '../../src/transforms/data/kde';
import { transform } from '../../src/transforms/data/contour';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

test('basic kde 1d', () => {
  const data = [
    { x: 62, y: 95, index: 0 },
    { x: 84, y: 63, index: 1 },
    { x: 94, y: 31, index: 2 },
    { x: 42, y: 56, index: 3 },
    { x: 22, y: 83, index: 4 },
    { x: 76, y: 39, index: 5 },
    { x: 17, y: 89, index: 6 },
    { x: 29, y: 21, index: 7 },
    { x: 31, y: 16, index: 8 },
    { x: 38, y: 72, index: 9 },
    { x: 59, y: 96, index: 10 },
    { x: 17, y: 77, index: 11 },
    { x: 83, y: 78, index: 12 },
    { x: 83, y: 48, index: 13 },
    { x: 2, y: 5, index: 14 },
    { x: 75, y: 84, index: 15 },
    { x: 29, y: 11, index: 16 },
    { x: 50, y: 27, index: 17 },
    { x: 31, y: 1, index: 18 },
    { x: 75, y: 89, index: 19 }
  ];

  const kdeData = kde(
    {
      dimension: '2d',
      field: ['x', 'y'],
      extent: [
        { x: 0, y: 0 },
        { x: 100, y: 100 }
      ],
      bandwidth: 3,
      bins: 100,
      as: ['x', 'y', 'kde']
    },
    data
  );
  const contourData = transform(
    {
      field: 'kde',
      row: 100,
      column: 100,
      levels: 5
    },
    kdeData
  );
  expect(contourData.length).toEqual(14);
  expect(contourData[0].threshold).toEqual(0.0013412097754200718);
  expect(contourData[0].points.length).toEqual(140);
  expect(contourData[1].threshold).toEqual(0.0013412097754200718);
  expect(contourData[1].points.length).toEqual(149);
  expect(contourData[13].threshold).toEqual(0.005360808283458207);
  expect(contourData[13].points.length).toEqual(73);
});
