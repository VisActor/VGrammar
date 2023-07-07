import { SunburstLayout } from '../src/sunburst/layout';
import { mockData } from './data/tree';

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

test('layout data when innerRadius is an array', () => {
  const innerRadius = [20, 200, 300];
  const layout = new SunburstLayout({ innerRadius: innerRadius });
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
    flattenIndex: 0,
    isLeaf: false
  });
  expect(result[0].startAngle).toBeCloseTo(Math.PI / 2);
  expect(result[0].endAngle).toBeCloseTo(-(3 * Math.PI) / 2);
  expect(result[0].innerRadius).toBeCloseTo(innerRadius[0]);
  expect(result[0].outerRadius).toBeCloseTo(innerRadius[1]);

  const child0 = result[0].children[0];

  expect(child0).toMatchObject({
    depth: 1,
    maxDepth: 3,
    index: 0,
    key: '-0-0',
    value: 16017,
    x: 400,
    y: 400,
    flattenIndex: 1,
    isLeaf: false
  });
  expect(child0.innerRadius).toBeCloseTo(innerRadius[1]);
  expect(child0.outerRadius).toBeCloseTo(innerRadius[2]);

  const child1 = child0.children[0];

  expect(child1).toMatchObject({
    depth: 2,
    maxDepth: 3,
    index: 0,
    key: '-0-0-0',
    value: 2680,
    x: 400,
    y: 400,
    flattenIndex: 2,
    isLeaf: false
  });

  expect(child1.innerRadius).toBeCloseTo(innerRadius[2]);
  expect(child1.outerRadius).toBeCloseTo(400);
});

test('layout data when innerRadius is an array and has gapRadius', () => {
  const innerRadius = [20, 200, 300];
  const gapRadius = 10;
  const layout = new SunburstLayout({ innerRadius: innerRadius, gapRadius });
  const result = layout.layout(mockData, { width: 800, height: 800 });

  expect(result.length).toBe(1);
  expect(result[0].innerRadius).toBeCloseTo(innerRadius[0]);
  expect(result[0].outerRadius).toBeCloseTo(innerRadius[1] - gapRadius);

  const child0 = result[0].children[0];

  expect(child0.innerRadius).toBeCloseTo(innerRadius[1]);
  expect(child0.outerRadius).toBeCloseTo(innerRadius[2] - gapRadius);

  const child1 = child0.children[0];

  expect(child1.innerRadius).toBeCloseTo(innerRadius[2]);
  expect(child1.outerRadius).toBeCloseTo(400 - gapRadius);
});

test('layout data when innerRadius is number, outerRadius is any array', () => {
  const innerRadius = 20;
  const outerRadius = [100, 200, 300];
  const gapRadius = 10;
  const layout = new SunburstLayout({ innerRadius, outerRadius, gapRadius });
  const result = layout.layout(mockData, { width: 800, height: 800 });

  expect(result.length).toBe(1);
  expect(result[0].innerRadius).toBeCloseTo(innerRadius);
  expect(result[0].outerRadius).toBeCloseTo(outerRadius[0]);

  const child0 = result[0].children[0];

  expect(child0.innerRadius).toBeCloseTo(outerRadius[0] - gapRadius);
  expect(child0.outerRadius).toBeCloseTo(outerRadius[1]);

  const child1 = child0.children[0];

  expect(child1.innerRadius).toBeCloseTo(outerRadius[1] - gapRadius);
  expect(child1.outerRadius).toBeCloseTo(outerRadius[2]);
});

test('layout with label', () => {
  const innerRadius = [20, 120, 220, 320];
  const outerRadius = [100, 200, 300];
  const layout = new SunburstLayout({ innerRadius, outerRadius, label: true });
  const result = layout.layout(mockData, { width: 800, height: 800 });

  expect(result.length).toBe(1);
  expect(result[0].innerRadius).toBeCloseTo(innerRadius[0]);
  expect(result[0].outerRadius).toBeCloseTo(outerRadius[0]);
  expect(result[0].label).toMatchObject({
    maxLineWidth: 80,
    textAlign: 'center',
    textBaseline: 'middle'
  });
  expect(result[0].label.x).toBeCloseTo(400);
  expect(result[0].label.y).toBeCloseTo(340);
  expect(result[0].label.angle).toBeCloseTo(4.71238898038469);

  const child0 = result[0].children[0];

  expect(child0.innerRadius).toBeCloseTo(innerRadius[1]);
  expect(child0.outerRadius).toBeCloseTo(outerRadius[1]);
  expect(child0.label).toMatchObject({
    maxLineWidth: 80,
    textAlign: 'center',
    textBaseline: 'middle'
  });
  expect(child0.label.x).toBeCloseTo(538.5640646055101);
  expect(child0.label.y).toBeCloseTo(480);
  expect(child0.label.angle).toBeCloseTo(0.5235987755982989);

  const child1 = child0.children[0];
  expect(child1.innerRadius).toBeCloseTo(innerRadius[2]);
  expect(child1.outerRadius).toBeCloseTo(outerRadius[2]);
  expect(child1.label).toMatchObject({
    maxLineWidth: 80,
    textAlign: 'center',
    textBaseline: 'middle'
  });
  expect(child1.label.x).toBeCloseTo(445.3242923387021);
  expect(child1.label.y).toBeCloseTo(656.0189612587237);
  expect(child1.label.angle).toBeCloseTo(1.3955769076023585);

  const child2 = child1.children[0];

  expect(child2.innerRadius).toBeNaN();
  expect(child2.outerRadius).toBeNaN();
  expect(child2.label).toMatchObject({
    maxLineWidth: undefined,
    textAlign: 'center',
    textBaseline: 'middle'
  });
  expect(child2.label.x).toBeNaN();
  expect(child2.label.y).toBeNaN();
  expect(child2.label.angle).toBeCloseTo(1.5169228934312207);
});

test('layout with label of array options', () => {
  const innerRadius = [20, 120, 220, 320];
  const outerRadius = [100, 200, 300];
  const layout = new SunburstLayout({
    innerRadius,
    outerRadius,
    label: [
      {
        align: 'center',
        rotate: 'tangential'
      },
      { rotate: 'radial', align: 'end' },
      { rotate: 'radial', align: 'start', offset: 10 }
    ]
  });
  const result = layout.layout(mockData, { width: 800, height: 800 });

  expect(result.length).toBe(1);
  expect(result[0].innerRadius).toBeCloseTo(innerRadius[0]);
  expect(result[0].outerRadius).toBeCloseTo(outerRadius[0]);
  expect(result[0].label).toMatchObject({
    textAlign: 'center',
    textBaseline: 'middle'
  });
  expect(result[0].label.maxLineWidth).toBeCloseTo(376.99111843077515);
  expect(result[0].label.x).toBeCloseTo(400);
  expect(result[0].label.y).toBeCloseTo(340);
  expect(result[0].label.angle).toBeCloseTo(-3.141592653589793);

  const child0 = result[0].children[0];

  expect(child0.innerRadius).toBeCloseTo(innerRadius[1]);
  expect(child0.outerRadius).toBeCloseTo(outerRadius[1]);
  expect(child0.label).toMatchObject({
    maxLineWidth: 80,
    textAlign: 'end',
    textBaseline: 'middle'
  });
  expect(child0.label.x).toBeCloseTo(573.2050807568877);
  expect(child0.label.y).toBeCloseTo(500);
  expect(child0.label.angle).toBeCloseTo(0.5235987755982989);

  const child1 = child0.children[0];
  expect(child1.innerRadius).toBeCloseTo(innerRadius[2]);
  expect(child1.outerRadius).toBeCloseTo(outerRadius[2]);
  expect(child1.label).toMatchObject({
    textAlign: 'start',
    textBaseline: 'middle'
  });
  expect(child1.label.maxLineWidth).toBeCloseTo(80);
  expect(child1.label.x).toBeCloseTo(440.0945662996211);
  expect(child1.label.y).toBeCloseTo(626.4783118827171);
  expect(child1.label.angle).toBeCloseTo(1.3955769076023585);

  const child2 = child1.children[0];

  expect(child2.innerRadius).toBeNaN();
  expect(child2.outerRadius).toBeNaN();
  expect(child2.label).toBeUndefined();
});
