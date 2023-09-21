import { TreemapLayout } from '../src/treemap/layout';
import { initBrowserEnv } from '@visactor/vgrammar-core';

initBrowserEnv();

test('layout(binary) simple data', () => {
  const data = [{ children: [{ source: 'A', target: 'B', value: 1 }] }];

  const layout = new TreemapLayout();
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.length).toBe(1);
  expect(result[0]).toMatchObject({
    depth: 0,
    maxDepth: 1,
    index: 0,
    key: '-0',
    value: 1,
    x0: 0,
    x1: 200,
    y0: 0,
    y1: 200
  });
});

test('layout(dice) simple data', () => {
  const data = [
    {
      children: [{ value: 1 }, { value: 1 }]
    }
  ];

  const layout = new TreemapLayout({ splitType: 'dice' });
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.length).toBe(1);
  expect(result[0]).toMatchObject({
    depth: 0,
    maxDepth: 1,
    index: 0,
    key: '-0',
    value: 2,
    x0: 0,
    x1: 200,
    y0: 0,
    y1: 200
  });
  expect(result[0].children.length).toBe(2);
  expect(result[0].children[0]).toMatchObject({
    depth: 1,
    maxDepth: 1,
    index: 0,
    key: '-0-0',
    value: 1,
    x0: 0,
    x1: 100,
    y0: 0,
    y1: 200
  });
});

test('layout(slice) simple data', () => {
  const data = [
    {
      children: [{ value: 1 }, { value: 1 }]
    }
  ];

  const layout = new TreemapLayout({ splitType: 'slice' });
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.length).toBe(1);
  expect(result[0]).toMatchObject({
    depth: 0,
    maxDepth: 1,
    index: 0,
    key: '-0',
    value: 2,
    x0: 0,
    x1: 200,
    y0: 0,
    y1: 200
  });
  expect(result[0].children.length).toBe(2);
  expect(result[0].children[0]).toMatchObject({
    depth: 1,
    maxDepth: 1,
    index: 0,
    key: '-0-0',
    value: 1,
    x0: 0,
    x1: 200,
    y0: 0,
    y1: 100
  });
});

test('layout(sliceDice) simple data', () => {
  const data = [
    {
      children: [{ children: [{ value: 1 }, { value: 1 }] }, { children: [{ value: 1 }, { value: 1 }] }]
    }
  ];

  const layout = new TreemapLayout({ splitType: 'sliceDice' });
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.length).toBe(1);
  expect(result[0]).toMatchObject({
    depth: 0,
    maxDepth: 2,
    index: 0,
    key: '-0',
    value: 4,
    x0: 0,
    x1: 200,
    y0: 0,
    y1: 200
  });
  expect(result[0].children.length).toBe(2);
  expect(result[0].children[0]).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 0,
    key: '-0-0',
    value: 2,
    x0: 0,
    x1: 100,
    y0: 0,
    y1: 200
  });
  expect(result[0].children[0].children.length).toBe(2);
  expect(result[0].children[0].children[1]).toMatchObject({
    depth: 2,
    maxDepth: 2,
    index: 1,
    key: '-0-0-1',
    value: 1,
    x0: 0,
    x1: 100,
    y0: 100,
    y1: 200
  });
});

test('layout(squarify) simple data', () => {
  const data = [
    {
      children: [{ children: [{ value: 1 }, { value: 1 }] }, { children: [{ value: 1 }, { value: 1 }] }]
    }
  ];

  const layout = new TreemapLayout({ splitType: 'squarify' });
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.length).toBe(1);
  expect(result[0]).toMatchObject({
    depth: 0,
    maxDepth: 2,
    index: 0,
    key: '-0',
    value: 4,
    x0: 0,
    x1: 200,
    y0: 0,
    y1: 200
  });
  expect(result[0].children.length).toBe(2);
  expect(result[0].children[0]).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 0,
    key: '-0-0',
    value: 2,
    x0: 0,
    x1: 200,
    y0: 0,
    y1: 100
  });
  expect(result[0].children[0].children.length).toBe(2);
  expect(result[0].children[0].children[1]).toMatchObject({
    depth: 2,
    maxDepth: 2,
    index: 1,
    key: '-0-0-1',
    value: 1,
    x0: 100,
    x1: 200,
    y0: 0,
    y1: 100
  });
});

test('layout labelPadding', () => {
  const data = [
    {
      children: [{ children: [{ value: 2 }, { value: 1 }] }, { value: 1 }]
    }
  ];

  const layout = new TreemapLayout({ labelPadding: [20, 10, 2] });
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.length).toBe(1);
  expect(result[0]).toMatchObject({
    depth: 0,
    maxDepth: 2,
    index: 0,
    key: '-0',
    value: 4,
    x0: 0,
    x1: 200,
    y0: 0,
    y1: 200
  });
  expect(result[0].labelRect).toMatchObject({
    x0: 0,
    x1: 200,
    y0: 0,
    y1: 20
  });
  expect(result[0].children.length).toBe(2);
  expect(result[0].children[0]).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 0,
    key: '-0-0',
    value: 3,
    x0: 0,
    x1: 150,
    y0: 20,
    y1: 200
  });
  expect(result[0].children[0].labelRect).toMatchObject({
    x0: 0,
    x1: 150,
    y0: 20,
    y1: 30
  });
  expect(result[0].children[0].children.length).toBe(2);
  expect(result[0].children[0].children[1]).toMatchObject({
    depth: 2,
    maxDepth: 2,
    index: 1,
    key: '-0-0-1',
    value: 1,
    x0: 0,
    x1: 150,
    y1: 200
  });
  expect(result[0].children[0].children[1].y0).toBeCloseTo(143.33333333333);
  expect(result[0].children[1]).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 1,
    key: '-0-1',
    value: 1,
    x0: 150,
    x1: 200,
    y0: 20,
    y1: 200
  });
});

test('layout labelPadding && labelPosition = "bottom"', () => {
  const data = [
    {
      children: [{ children: [{ value: 2 }, { value: 1 }] }, { value: 1 }]
    }
  ];

  const layout = new TreemapLayout({ labelPadding: [20, 10, 2], labelPosition: 'bottom' });
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.length).toBe(1);
  expect(result[0]).toMatchObject({
    depth: 0,
    maxDepth: 2,
    index: 0,
    key: '-0',
    value: 4,
    x0: 0,
    x1: 200,
    y0: 0,
    y1: 200
  });
  expect(result[0].labelRect).toMatchObject({
    x0: 0,
    x1: 200,
    y0: 180,
    y1: 200
  });
  expect(result[0].children.length).toBe(2);
  expect(result[0].children[0]).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 0,
    key: '-0-0',
    value: 3,
    x0: 0,
    x1: 150,
    y0: 0,
    y1: 180
  });
  expect(result[0].children[0].labelRect).toMatchObject({
    x0: 0,
    x1: 150,
    y0: 170,
    y1: 180
  });
  expect(result[0].children[0].children.length).toBe(2);
  expect(result[0].children[0].children[1]).toMatchObject({
    depth: 2,
    maxDepth: 2,
    index: 1,
    key: '-0-0-1',
    value: 1,
    x0: 0,
    x1: 150,
    y1: 170
  });
  expect(result[0].children[0].children[1].y0).toBeCloseTo(113.33333333333);
  expect(result[0].children[1]).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 1,
    key: '-0-1',
    value: 1,
    x0: 150,
    x1: 200,
    y0: 0,
    y1: 180
  });
});

test('layout labelPadding && labelPosition = "left"', () => {
  const data = [
    {
      children: [{ children: [{ value: 2 }, { value: 1 }] }, { value: 1 }]
    }
  ];

  const layout = new TreemapLayout({ labelPadding: [20, 10, 2], labelPosition: 'left' });
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.length).toBe(1);
  expect(result[0]).toMatchObject({
    depth: 0,
    maxDepth: 2,
    index: 0,
    key: '-0',
    value: 4,
    x0: 0,
    x1: 200,
    y0: 0,
    y1: 200
  });
  expect(result[0].labelRect).toMatchObject({
    x0: 0,
    x1: 20,
    y0: 0,
    y1: 200
  });
  expect(result[0].children.length).toBe(2);
  expect(result[0].children[0]).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 0,
    key: '-0-0',
    value: 3,
    x0: 20,
    x1: 200,
    y0: 0,
    y1: 150
  });
  expect(result[0].children[0].labelRect).toMatchObject({
    x0: 20,
    x1: 30,
    y0: 0,
    y1: 150
  });
  expect(result[0].children[0].children.length).toBe(2);
  expect(result[0].children[0].children[1]).toMatchObject({
    depth: 2,
    maxDepth: 2,
    index: 1,
    key: '-0-0-1',
    value: 1,
    y0: 0,
    x1: 200,
    y1: 150
  });
  expect(result[0].children[0].children[1].x0).toBeCloseTo(143.33333333333);
  expect(result[0].children[1]).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 1,
    key: '-0-1',
    value: 1,
    x0: 20,
    x1: 200,
    y0: 150,
    y1: 200
  });
});

test('layout labelPadding && labelPosition = "right"', () => {
  const data = [
    {
      children: [{ children: [{ value: 2 }, { value: 1 }] }, { value: 1 }]
    }
  ];

  const layout = new TreemapLayout({ labelPadding: [20, 10, 2], labelPosition: 'right' });
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.length).toBe(1);
  expect(result[0]).toMatchObject({
    depth: 0,
    maxDepth: 2,
    index: 0,
    key: '-0',
    value: 4,
    x0: 0,
    x1: 200,
    y0: 0,
    y1: 200
  });
  expect(result[0].labelRect).toMatchObject({
    x0: 180,
    x1: 200,
    y0: 0,
    y1: 200
  });
  expect(result[0].children.length).toBe(2);
  expect(result[0].children[0]).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 0,
    key: '-0-0',
    value: 3,
    x0: 0,
    x1: 180,
    y0: 0,
    y1: 150
  });
  expect(result[0].children[0].labelRect).toMatchObject({
    x0: 170,
    x1: 180,
    y0: 0,
    y1: 150
  });
  expect(result[0].children[0].children.length).toBe(2);
  expect(result[0].children[0].children[1]).toMatchObject({
    depth: 2,
    maxDepth: 2,
    index: 1,
    key: '-0-0-1',
    value: 1,
    y0: 0,
    x1: 170,
    y1: 150
  });
  expect(result[0].children[0].children[1].x0).toBeCloseTo(113.33333333333);
  expect(result[0].children[1]).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 1,
    key: '-0-1',
    value: 1,
    x0: 0,
    x1: 180,
    y0: 150,
    y1: 200
  });
});

test('layout gapWidth', () => {
  const data = [
    {
      children: [{ children: [{ value: 2 }, { value: 1 }] }, { value: 1 }]
    }
  ];

  const layout = new TreemapLayout({ gapWidth: [8, 1] });
  const result = layout.layout(data, { width: 200, height: 200 });

  expect(result.length).toBe(1);
  expect(result[0]).toMatchObject({
    depth: 0,
    maxDepth: 2,
    index: 0,
    key: '-0',
    value: 4,
    x0: 0,
    x1: 200,
    y0: 0,
    y1: 200
  });
  expect(result[0].labelRect).toBeUndefined();
  expect(result[0].children.length).toBe(2);
  expect(result[0].children[0]).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 0,
    key: '-0-0',
    value: 3,
    x0: 0,
    x1: 200,
    y0: 0
  });

  expect(result[0].children[0].y1).toBeCloseTo(149.75);
  expect(result[0].children[0].children.length).toBe(2);
  expect(result[0].children[0].children[1]).toMatchObject({
    depth: 2,
    maxDepth: 2,
    index: 1,
    key: '-0-0-1',
    value: 1,
    y0: 0,
    x1: 200
  });
  expect(result[0].children[0].children[1].x0).toBeCloseTo(133.33333333333334);
  expect(result[0].children[0].children[1].y1).toBeCloseTo(149.75);
  expect(result[0].children[1]).toMatchObject({
    depth: 1,
    maxDepth: 2,
    index: 1,
    key: '-0-1',
    value: 1,
    x0: 0,
    x1: 200,
    y1: 200
  });
  expect(result[0].children[1].y0).toBeCloseTo(150.75);
});
