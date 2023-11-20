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
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({ width: 316, height: 0, fill: '#6690F2' });
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({ width: 316, height: 590, fill: '#6690F2' });
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
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({ width: 316, height: 59, fill: '#6690F2' });
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({ width: 316, height: 472, fill: '#6690F2' });
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
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({ width: 158, height: 0, fill: '#6690F2' });
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({ width: 158, fill: '#6690F2' });
  expect(rectMark.elements[2].getGraphicItem().attribute).toMatchObject({ width: 158, fill: '#70D6A3' });
  expect((rectMark.elements[2].getGraphicItem().attribute as any).height).toBeCloseTo(252.8571428571429);
  expect(rectMark.elements[3].getGraphicItem().attribute).toMatchObject({ width: 158, fill: '#70D6A3' });
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
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({ width: 0, height: 236, fill: '#6690F2' });
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({ width: 790, height: 236, fill: '#6690F2' });
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
