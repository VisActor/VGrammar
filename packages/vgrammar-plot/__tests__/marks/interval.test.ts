import '../util';
import { Plot } from '../../src';
import { initBrowserEnv } from '@visactor/vgrammar-core';

initBrowserEnv();

test('add interval by api', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  });

  plot
    .interval()
    .data([
      { x: 'A', y: 1 },
      { x: 'B', y: 2 }
    ])
    .encode('x', 'x')
    .encode('y', 'y');

  plot.run();

  const marks = plot.view.getMarksByType('rect');

  expect(marks.length).toBe(1);

  const rectMark = marks[0];
  expect(rectMark.elements.length).toEqual(2);
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({
    x: 39.5,
    y: 590,
    x1: 355.5,
    y1: 590,
    fill: '#6690F2'
  });
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({
    x: 434.5,
    y: 0,
    x1: 750.5,
    y1: 590,
    fill: '#6690F2'
  });
});

test('add range interval by api', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  });

  plot
    .interval()
    .data([
      { x: 'A', y: 1, y0: 0 },
      { x: 'B', y: 2, y0: 10 }
    ])
    .encode('x', 'x')
    .encode('y', ['y0', 'y']);

  plot.run();

  const marks = plot.view.getMarksByType('rect');

  expect(marks.length).toBe(1);

  const rectMark = marks[0];
  expect(rectMark.elements.length).toEqual(2);
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({
    x: 39.5,
    x1: 355.5,
    y: 590,
    y1: 531,
    fill: '#6690F2'
  });
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({
    x: 434.5,
    y: 0,
    x1: 750.5,
    y1: 472,
    fill: '#6690F2'
  });
});

test('add grouped interval by api', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  });

  plot
    .interval()
    .data([
      { x: 'A', y: 1, cat: '0' },
      { x: 'B', y: 2, cat: '0' },
      { x: 'A', y: 4, cat: '1' },
      { x: 'B', y: 8, cat: '1' }
    ])
    .encode('x', 'x')
    .encode('y', 'y')
    .encode('group', 'cat');

  plot.run();

  const marks = plot.view.getMarksByType('rect');

  expect(marks.length).toBe(1);

  const rectMark = marks[0];
  expect(rectMark.elements.length).toEqual(4);
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({
    x: 39.5,
    y: 590,
    x1: 197.5,
    y1: 590,
    fill: '#6690F2'
  });
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({ x: 434.5, x1: 592.5, fill: '#6690F2' });
  expect((rectMark.elements[1].getGraphicItem().attribute as any).y).toBeCloseTo(505.7142857142858);
  expect((rectMark.elements[1].getGraphicItem().attribute as any).y1).toBeCloseTo(590);
  expect(rectMark.elements[2].getGraphicItem().attribute).toMatchObject({ x: 197.5, x1: 355.5, fill: '#70D6A3' });
  expect((rectMark.elements[2].getGraphicItem().attribute as any).y).toBeCloseTo(337.1428571428571);
  expect((rectMark.elements[2].getGraphicItem().attribute as any).y1).toBeCloseTo(590);
  expect(rectMark.elements[3].getGraphicItem().attribute).toMatchObject({
    x: 592.5,
    y: 0,
    y1: 590,
    x1: 750.5,
    fill: '#70D6A3'
  });
});

test('add interval by api in cartesian coordinate', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  }).coordinate('cartesian', { transpose: true });

  plot
    .interval()
    .data([
      { x: 'A', y: 1 },
      { x: 'B', y: 2 }
    ])
    .encode('x', 'x')
    .encode('y', 'y');

  plot.run();

  const marks = plot.view.getMarksByType('rect');

  expect(marks.length).toBe(1);

  const rectMark = marks[0];
  expect(rectMark.elements.length).toEqual(2);
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({
    x: 0,
    x1: 0,
    y: 324.5,
    y1: 560.5,
    fill: '#6690F2'
  });
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({
    x: 790,
    y: 29.5,
    x1: 0,
    y1: 265.5,
    fill: '#6690F2'
  });
});

test('add interval by api in polar coordinate', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  }).coordinate('polar');

  plot
    .interval()
    .data([
      { x: 'A', y: 1 },
      { x: 'B', y: 2 }
    ])
    .encode('x', 'x')
    .encode('y', 'y');

  plot.run();

  const marks = plot.view.getMarksByType('arc');

  expect(marks.length).toBe(1);

  const rectMark = marks[0];
  expect(rectMark.elements.length).toEqual(2);
  const attr0 = rectMark.elements[0].getGraphicItem().attribute;
  expect(attr0).toMatchObject({
    x: 395,
    y: 295,
    innerRadius: 0,
    outerRadius: 0,
    fill: '#6690F2'
  });
  expect((attr0 as any).sizeAttrs).toMatchObject({
    cx: 395,
    cy: 295
  });

  const attr1 = rectMark.elements[1].getGraphicItem().attribute;
  expect(attr1).toMatchObject({
    x: 395,
    y: 295,
    innerRadius: 295,
    outerRadius: 0,
    fill: '#6690F2'
  });
  expect((attr1 as any).sizeAttrs).toMatchObject({
    cx: 395,
    cy: 295
  });
});

test('add interval by api in polar coordinate', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  }).coordinate('polar', { transpose: true });

  plot
    .interval()
    .data([
      { x: 'A', y: 1 },
      { x: 'B', y: 2 }
    ])
    .encode('x', 'x')
    .encode('y', 'y');

  plot.run();

  const marks = plot.view.getMarksByType('arc');

  expect(marks.length).toBe(1);

  const rectMark = marks[0];
  expect(rectMark.elements.length).toEqual(2);
  const attr0 = rectMark.elements[0].getGraphicItem().attribute;
  expect(attr0).toMatchObject({
    x: 395,
    y: 295,
    startAngle: 0,
    endAngle: 0,
    fill: '#6690F2'
  });

  expect((attr0 as any).innerRadius).toBeCloseTo(14.75);
  expect((attr0 as any).outerRadius).toBeCloseTo(132.75);

  const attr1 = rectMark.elements[1].getGraphicItem().attribute;

  expect(attr1).toMatchObject({
    x: 395,
    y: 295,
    endAngle: 0,
    fill: '#6690F2'
  });
  expect((attr1 as any).innerRadius).toBeCloseTo(162.25);
  expect((attr1 as any).outerRadius).toBeCloseTo(280.25);
  expect((attr1 as any).startAngle).toBeCloseTo(6.283185307179586);
});
