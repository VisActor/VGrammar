import { CirclePackingLayout } from '../src/circle-packing/layout';
import { mockData } from './data/tree';
import { initBrowserEnv } from '@visactor/vgrammar-core';

initBrowserEnv();

test('layout simple data', () => {
  const data = [{ children: [{ value: 1 }] }];

  const layout = new CirclePackingLayout();
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.length).toBe(1);
  expect(result[0]).toMatchObject({
    depth: 0,
    maxDepth: 1,
    index: 0,
    key: '-0',
    value: 1,
    x: 100,
    y: 100,
    radius: 100,
    flattenIndex: 0,
    isLeaf: false
  });
});

test('layout data which has two levels', () => {
  const data = [
    {
      children: [{ children: [{ value: 2 }, { value: 1 }] }, { value: 1 }]
    }
  ];

  const layout = new CirclePackingLayout();
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.length).toBe(1);
  expect(result[0]).toMatchObject({
    depth: 0,
    maxDepth: 2,
    index: 0,
    key: '-0',
    value: 4,
    x: 100,
    y: 100,
    radius: 100,
    flattenIndex: 0,
    isLeaf: false
  });

  const child0 = result[0].children[0];

  expect(child0).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 0,
    key: '-0-0',
    value: 3,
    y: 100,
    flattenIndex: 1,
    isLeaf: false
  });

  expect(child0.x).toBeCloseTo(70.71067811865476);
  expect(child0.radius).toBeCloseTo(70.71067811865476);

  const child1 = result[0].children[1];

  expect(child1).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 1,
    key: '-0-1',
    value: 1,
    x: 170.71067811865476,
    flattenIndex: 4,
    isLeaf: true
  });
  expect(child1.y).toBeCloseTo(100);
  expect(child1.radius).toBeCloseTo(29.28932188134525);
});

test('layout mockData', () => {
  const layout = new CirclePackingLayout();
  const result = layout.layout(mockData, { width: 800, height: 800 });

  expect(result.length).toBe(1);
  expect(result[0]).toMatchObject({
    depth: 0,
    maxDepth: 3,
    index: 0,
    key: '-0',
    value: 48051,
    x: 400,
    y: 400,
    radius: 400,
    flattenIndex: 0,
    isLeaf: false
  });

  const child0 = result[0].children[0];

  expect(child0).toMatchObject({
    depth: 1,
    maxDepth: 3,
    index: 0,
    key: '-0-0',
    value: 16017,
    flattenIndex: 1,
    isLeaf: false
  });

  expect(child0.x).toBeCloseTo(214.35935394489815);
  expect(child0.y).toBeCloseTo(292.8203230275509);
  expect(child0.radius).toBeCloseTo(185.64064605510183);

  const child1 = result[0].children[1];

  expect(child1).toMatchObject({
    depth: 1,
    maxDepth: 3,
    index: 1,
    key: '-0-1',
    value: 16017,
    flattenIndex: 26,
    isLeaf: false
  });

  expect(child1.x).toBeCloseTo(585.6406460551018);
  expect(child1.y).toBeCloseTo(292.8203230275509);
  expect(child1.radius).toBeCloseTo(185.64064605510185);
});
