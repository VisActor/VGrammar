import '../util';
import { Plot } from '../../src';
import { initBrowserEnv } from '@visactor/vgrammar-core';

initBrowserEnv();

test('add rect-x by api', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  });

  plot
    .rectX()
    .data([
      { x: 'A', x1: 'B', y: 1 },
      { x: 'B', x1: 'C', y: 2 }
    ])
    .encode('x', ['x', 'x1']);

  plot.run();

  const marks = plot.view.getMarksByType('rect');

  expect(marks.length).toBe(1);

  const rectMark = marks[0];
  expect(rectMark.elements.length).toEqual(2);
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({ x: 0, y: 0, height: 590, fill: '#6690F2' });
  expect((rectMark.elements[0].getGraphicItem().attribute as any).width).toBeCloseTo(263.3333333333333);
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({ y: 0, height: 590, fill: '#6690F2' });
  expect((rectMark.elements[1].getGraphicItem().attribute as any).x).toBeCloseTo(263.3333333333333);
  expect((rectMark.elements[1].getGraphicItem().attribute as any).width).toBeCloseTo(263.3333333333333);
});

test('add rect-x by api and channel x is linear', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  });

  plot
    .rectX()
    .data([
      { x: 30, y: 1 },
      { x: 100, y: 2 }
    ])
    .scale('x', { type: 'linear' })
    .encode('x', 'x');

  plot.run();

  const marks = plot.view.getMarksByType('rect');

  expect(marks.length).toBe(1);

  const rectMark = marks[0];
  expect(rectMark.elements.length).toEqual(2);
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({
    x: 0,
    y: 0,
    width: 0,
    height: 590,
    fill: '#6690F2'
  });
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({
    x: 0,
    y: 0,
    width: 790,
    height: 590,
    fill: '#6690F2'
  });
});

test('add rect-x by api and scale x is band', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  });

  plot
    .rectX()
    .data([
      { x: 'A', y: 1 },
      { x: 'B', y: 2 }
    ])
    .encode('x', 'x');

  plot.run();

  const marks = plot.view.getMarksByType('rect');

  expect(marks.length).toBe(1);

  const rectMark = marks[0];
  expect(rectMark.elements.length).toEqual(2);
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({
    x: 0,
    y: 0,
    width: 395,
    height: 590,
    fill: '#6690F2'
  });
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({
    x: 395,
    y: 0,
    width: 395,
    height: 590,
    fill: '#6690F2'
  });
});

// test('add rect-x by api and scale x is band and the value is a array', () => {
//   const plot = new Plot({
//     width: 800,
//     height: 600
//   });

//   plot
//     .rectX()
//     .data([
//       { x: ['A', 'B'], y: 1 },
//       { x: ['B', 'C'], y: 2 }
//     ])
//     .encode('x', 'x');

//   plot.run();

//   const marks = plot.view.getMarksByType('rect');

//   expect(marks.length).toBe(1);

//   const rectMark = marks[0];
//   expect(rectMark.elements.length).toEqual(2);
//   expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({
//     x: 0,
//     y: 0,
//     height: 590,
//     fill: '#6690F2'
//   });
//   expect((rectMark.elements[0].getGraphicItem().attribute as any).width).toBeCloseTo(263.3333333333333);
//   expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({
//     y: 0,

//     height: 590,
//     fill: '#6690F2'
//   });

//   expect((rectMark.elements[1].getGraphicItem().attribute as any).x).toBeCloseTo(263.3333333333333);
//   expect((rectMark.elements[1].getGraphicItem().attribute as any).width).toBeCloseTo(263.3333333333333);
// });

test('add grouped rect-x by api', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  });

  plot
    .rectX()
    .data([
      { x: 'A', y: 1, cat: '0' },
      { x: 'B', y: 2, cat: '0' },
      { x: 'A', y: 4, cat: '1' },
      { x: 'B', y: 8, cat: '1' }
    ])
    .encode('x', 'x')
    .encode('group', 'cat');

  plot.run();

  const marks = plot.view.getMarksByType('rect');

  expect(marks.length).toBe(1);

  const rectMark = marks[0];
  expect(rectMark.elements.length).toEqual(4);
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({
    x: 0,
    y: 0,
    width: 395,
    height: 590,
    fill: '#6690F2'
  });
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({
    x: 395,
    y: 0,
    width: 395,
    height: 590,
    fill: '#6690F2'
  });
  expect(rectMark.elements[2].getGraphicItem().attribute).toMatchObject({
    x: 0,
    y: 0,
    width: 395,
    height: 590,
    fill: '#70D6A3'
  });
  expect(rectMark.elements[3].getGraphicItem().attribute).toMatchObject({
    x: 395,
    y: 0,
    width: 395,
    height: 590,
    fill: '#70D6A3'
  });
});

test('add rect-x by api and channel x is linear and transpose coordinate', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  }).coordinate('cartesian', { transpose: true });

  plot
    .rectX()
    .data([
      { x: 30, y: 1 },
      { x: 100, y: 2 }
    ])
    .scale('x', { type: 'linear' })
    .encode('x', 'x');

  plot.run();

  const marks = plot.view.getMarksByType('rect');

  expect(marks.length).toBe(1);

  const rectMark = marks[0];
  expect(rectMark.elements.length).toEqual(2);
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({
    x: 0,
    y: 590,
    width: 590,
    height: 0,
    fill: '#6690F2'
  });
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({
    x: 0,
    y: 0,
    width: 590,
    height: 590,
    fill: '#6690F2'
  });
});
