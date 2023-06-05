import { TreeLayout } from '../src/tree/layout';

test('layout simple data', () => {
  const data = [{ children: [{ value: 1 }] }];

  const layout = new TreeLayout();
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.length).toBe(1);
  expect(result[0]).toMatchObject({
    depth: 0,
    maxDepth: 1,
    index: 0,
    key: '-0',
    value: 1,
    x: 0,
    y: 100,
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

  const layout = new TreeLayout();
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.length).toBe(1);
  expect(result[0]).toMatchObject({
    depth: 0,
    maxDepth: 2,
    index: 0,
    key: '-0',
    value: 4,
    x: 0,
    flattenIndex: 0,
    isLeaf: false
  });
  expect(result[0].y).toBeCloseTo(114.28571428571429);

  const child0 = result[0].children[0];

  expect(child0).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 0,
    key: '-0-0',
    value: 3,
    x: 100,
    flattenIndex: 1,
    isLeaf: false
  });

  expect(child0.y).toBeCloseTo(85.71428571428572);

  const child1 = result[0].children[1];

  expect(child1).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 1,
    key: '-0-1',
    value: 1,
    x: 100,
    flattenIndex: 4,
    isLeaf: true
  });
  expect(child1.y).toBeCloseTo(142.85714285714286);
});

test('layout data which has two levels and alignType = "leaf" & direction="BT"', () => {
  const data = [
    {
      children: [{ children: [{ value: 2 }, { value: 1 }] }, { value: 1 }]
    }
  ];

  const layout = new TreeLayout({ alignType: 'leaf', direction: 'BT' });
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.length).toBe(1);
  expect(result[0]).toMatchObject({
    depth: 0,
    maxDepth: 2,
    index: 0,
    key: '-0',
    value: 4,
    flattenIndex: 0,
    isLeaf: false
  });
  expect(result[0].x).toBeCloseTo(110);
  expect(result[0].y).toBeCloseTo(200);

  const child0 = result[0].children[0];

  expect(child0).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 0,
    key: '-0-0',
    value: 3,
    flattenIndex: 1,
    isLeaf: false
  });

  expect(child0.x).toBeCloseTo(60);
  expect(child0.y).toBeCloseTo(100);

  const child1 = result[0].children[1];

  expect(child1).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 1,
    key: '-0-1',
    value: 1,
    flattenIndex: 4,
    isLeaf: true
  });
  expect(child1.x).toBeCloseTo(160);
  expect(child1.y).toBeCloseTo(0);
});

test('layout data which has two levels & layoutType === "radial"', () => {
  const data = [
    {
      children: [{ children: [{ value: 2 }, { value: 1 }] }, { value: 1 }]
    }
  ];

  const layout = new TreeLayout({ layoutType: 'radial' });
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.length).toBe(1);
  expect(result[0]).toMatchObject({
    depth: 0,
    maxDepth: 2,
    index: 0,
    key: '-0',
    value: 4,
    flattenIndex: 0,
    isLeaf: false
  });
  expect(result[0].x).toBeCloseTo(100);
  expect(result[0].y).toBeCloseTo(100);

  const child0 = result[0].children[0];

  expect(child0).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 0,
    key: '-0-0',
    value: 3,
    flattenIndex: 1,
    isLeaf: false
  });

  expect(child0.x).toBeCloseTo(54.951556604879045);
  expect(child0.y).toBeCloseTo(121.69418695587791);

  const child1 = result[0].children[1];

  expect(child1).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 1,
    key: '-0-1',
    value: 1,
    flattenIndex: 4,
    isLeaf: true
  });
  expect(child1.x).toBeCloseTo(88.87395330218428);
  expect(child1.y).toBeCloseTo(51.25360439090882);
});
