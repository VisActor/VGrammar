import { SunburstLayout } from '../src/sunburst/layout';

test('layout simple data', () => {
  const data = [{ children: [{ value: 1 }] }];

  const layout = new SunburstLayout();
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
    innerRadius: 0,
    outerRadius: 35,
    flattenIndex: 0,
    isLeaf: false
  });
  expect(result[0].startAngle).toBeCloseTo(Math.PI / 2);
  expect(result[0].endAngle).toBeCloseTo(-1.5 * Math.PI);
});

test('layout data which has two levels', () => {
  const data = [
    {
      children: [{ children: [{ value: 2 }, { value: 1 }] }, { value: 1 }]
    }
  ];

  const layout = new SunburstLayout();
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
    flattenIndex: 0,
    isLeaf: false
  });
  expect(result[0].startAngle).toBeCloseTo(Math.PI / 2);
  expect(result[0].endAngle).toBeCloseTo(-(3 * Math.PI) / 2);
  expect(result[0].innerRadius).toBeCloseTo(0);
  expect(result[0].outerRadius).toBeCloseTo(23.33333333);

  const child0 = result[0].children[0];

  expect(child0).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 0,
    key: '-0-0',
    value: 3,
    x: 100,
    y: 100,
    flattenIndex: 1,
    isLeaf: false
  });
  expect(child0.startAngle).toBeCloseTo(Math.PI / 2);
  expect(child0.endAngle).toBeCloseTo(-Math.PI);
  expect(child0.innerRadius).toBeCloseTo(23.33333333);
  expect(child0.outerRadius).toBeCloseTo(46.66666666);

  const child1 = result[0].children[1];

  expect(child1).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 1,
    key: '-0-1',
    value: 1,
    x: 100,
    y: 100,
    flattenIndex: 4,
    isLeaf: true
  });

  expect(child1.startAngle).toBeCloseTo(-Math.PI);
  expect(child1.endAngle).toBeCloseTo(-(3 * Math.PI) / 2);
  expect(child1.innerRadius).toBeCloseTo(23.33333333);
  expect(child1.outerRadius).toBeCloseTo(46.66666666);
});
