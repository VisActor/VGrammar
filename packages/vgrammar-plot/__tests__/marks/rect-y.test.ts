import '../util';
import { Plot } from '../../src';
import { initBrowserEnv } from '@visactor/vgrammar-core';

initBrowserEnv();

test('add rect-y by api', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  });

  plot
    .rectY()
    .data([
      { x: 'A', x1: 'B', y: 1 },
      { x: 'B', x1: 'C', y: 2 }
    ])
    .encode('y', ['x', 'x1'])
    .scale('y', { type: 'band' });

  plot.run();

  const marks = plot.view.getMarksByType('rect');

  expect(marks.length).toBe(1);

  const rectMark = marks[0];
  expect(rectMark.elements.length).toEqual(2);
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({ x: 0, x1: 790, fill: '#6690F2' });
  expect((rectMark.elements[0].getGraphicItem().attribute as any).y).toBeCloseTo(393.3333333333333);
  expect((rectMark.elements[0].getGraphicItem().attribute as any).y1).toBeCloseTo(196.66666666666666);
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({ x: 0, x1: 790, fill: '#6690F2' });
  expect((rectMark.elements[1].getGraphicItem().attribute as any).y).toBeCloseTo(196.66666666666666);
  expect((rectMark.elements[1].getGraphicItem().attribute as any).y1).toBeCloseTo(0);
});

test('add rect-y by api and channel y is linear', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  });

  plot
    .rectY()
    .data([
      { x: 30, y: 1 },
      { x: 100, y: 2 }
    ])
    .encode('y', 'x');

  plot.run();

  const marks = plot.view.getMarksByType('rect');

  expect(marks.length).toBe(1);

  const rectMark = marks[0];
  expect(rectMark.elements.length).toEqual(2);
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({
    x: 0,
    y: 590,
    x1: 790,
    y1: 590,
    fill: '#6690F2'
  });
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({
    x: 0,
    y: 0,
    x1: 790,
    y1: 590,
    fill: '#6690F2'
  });
});

test('add rect-y by api and scale y is band', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  });

  plot
    .rectY()
    .data([
      { x: 'A', y: 1 },
      { x: 'B', y: 2 }
    ])
    .encode('y', 'x')
    .scale('y', { type: 'band' });

  plot.run();

  const marks = plot.view.getMarksByType('rect');

  expect(marks.length).toBe(1);

  const rectMark = marks[0];
  expect(rectMark.elements.length).toEqual(2);
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({
    x: 0,
    y: 295,
    x1: 790,
    y1: 590,
    fill: '#6690F2'
  });
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({
    x: 0,
    y: 0,
    x1: 790,
    y1: 295,
    fill: '#6690F2'
  });
});

// test('add rect-y by api and scale x is band and the value is a array', () => {
//   const plot = new Plot({
//     width: 800,
//     height: 600
//   });

//   plot
//     .rectY()
//     .data([
//       { x: ['A', 'B'], y: 1 },
//       { x: ['B', 'C'], y: 2 }
//     ])
//     .encode('y', 'x')
//     .scale('y', { type: 'band' });

//   plot.run();

//   const marks = plot.view.getMarksByType('rect');

//   expect(marks.length).toBe(1);

//   const rectMark = marks[0];
//   expect(rectMark.elements.length).toEqual(2);
//   expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({
//     x: 0,
//     width: 790,
//     fill: '#6690F2'
//   });
//   expect((rectMark.elements[0].getGraphicItem().attribute as any).y).toBeCloseTo(196.66666666666666);
//   expect((rectMark.elements[0].getGraphicItem().attribute as any).height).toBeCloseTo(196.66666666666666);
//   expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({
//     y: 0,
//     width: 790,
//     fill: '#6690F2'
//   });

//   expect((rectMark.elements[1].getGraphicItem().attribute as any).y).toBeCloseTo(0);
//   expect((rectMark.elements[1].getGraphicItem().attribute as any).height).toBeCloseTo(196.66666666666666);
// });

test('add grouped rect-y by api', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  });

  plot
    .rectY()
    .data([
      { x: 'A', y: 1, cat: '0' },
      { x: 'B', y: 2, cat: '0' },
      { x: 'A', y: 4, cat: '1' },
      { x: 'B', y: 8, cat: '1' }
    ])
    .encode('y', 'x')
    .encode('group', 'cat')
    .scale('y', { type: 'band' });

  plot.run();

  const marks = plot.view.getMarksByType('rect');

  expect(marks.length).toBe(1);

  const rectMark = marks[0];
  expect(rectMark.elements.length).toEqual(4);
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({
    x: 0,
    y: 295,
    x1: 790,
    y1: 590,
    fill: '#6690F2'
  });
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({
    x: 0,
    y: 0,
    x1: 790,
    y1: 295,
    fill: '#6690F2'
  });
  expect(rectMark.elements[2].getGraphicItem().attribute).toMatchObject({
    x: 0,
    y: 295,
    x1: 790,
    y1: 590,
    fill: '#70D6A3'
  });
  expect(rectMark.elements[3].getGraphicItem().attribute).toMatchObject({
    x: 0,
    y: 0,
    x1: 790,
    y1: 295,
    fill: '#70D6A3'
  });
});

test('add rect-y by api and channel x is linear and transpose coordinate', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  }).coordinate('cartesian', { transpose: true });

  plot
    .rectY()
    .data([
      { x: 30, y: 1 },
      { x: 100, y: 2 }
    ])
    .encode('y', 'x');

  plot.run();

  const marks = plot.view.getMarksByType('rect');

  expect(marks.length).toBe(1);

  const rectMark = marks[0];
  expect(rectMark.elements.length).toEqual(2);
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({
    x: 0,
    y: 0,
    x1: 0,
    y1: 790,
    fill: '#6690F2'
  });
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({
    x1: 0,
    y: 0,
    x: 790,
    y1: 790,
    fill: '#6690F2'
  });
});
