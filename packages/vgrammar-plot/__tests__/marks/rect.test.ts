import '../util';
import { Plot } from '../../src';

test('add rect by api and x has two fields', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  });

  plot
    .rect()
    .data([
      { x: 'A', x1: 'B', y: 1 },
      { x: 'B', x1: 'C', y: 2 }
    ])
    .encode('x', ['x', 'x1'])
    .encode('y', 'y');

  plot.run();

  const marks = plot.view.getMarksByType('rect');

  expect(marks.length).toBe(1);

  const rectMark = marks[0];
  expect(rectMark.elements.length).toEqual(2);
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({ x: 0, fill: '#6690F2' });
  expect((rectMark.elements[0].getGraphicItem().attribute as any).y).toBeCloseTo(590);
  expect((rectMark.elements[0].getGraphicItem().attribute as any).y1).toBeCloseTo(590);
  expect((rectMark.elements[0].getGraphicItem().attribute as any).x1).toBeCloseTo(263.3333333333333);
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({ fill: '#6690F2' });
  expect((rectMark.elements[1].getGraphicItem().attribute as any).x).toBeCloseTo(263.3333333333333);
  expect((rectMark.elements[1].getGraphicItem().attribute as any).y).toBeCloseTo(0);
  expect((rectMark.elements[1].getGraphicItem().attribute as any).x1).toBeCloseTo(526.6666666666666);
  expect((rectMark.elements[1].getGraphicItem().attribute as any).y1).toBeCloseTo(590);
});

test('add rect by api', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  });

  plot
    .rect()
    .data([
      { x: 'A', x1: 'B', y: 1 },
      { x: 'B', x1: 'C', y: 2 }
    ])
    .encode('x', 'x')
    .encode('y', 'y');

  plot.run();

  const marks = plot.view.getMarksByType('rect');

  expect(marks.length).toBe(1);

  const rectMark = marks[0];
  expect(rectMark.elements.length).toEqual(2);
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({ x: 0, fill: '#6690F2' });
  expect((rectMark.elements[0].getGraphicItem().attribute as any).y).toBeCloseTo(590);
  expect((rectMark.elements[0].getGraphicItem().attribute as any).y1).toBeCloseTo(590);
  expect((rectMark.elements[0].getGraphicItem().attribute as any).x1).toBeCloseTo(395);
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({ fill: '#6690F2' });
  expect((rectMark.elements[1].getGraphicItem().attribute as any).x).toBeCloseTo(395);
  expect((rectMark.elements[1].getGraphicItem().attribute as any).y).toBeCloseTo(0);
  expect((rectMark.elements[1].getGraphicItem().attribute as any).y1).toBeCloseTo(590);
  expect((rectMark.elements[1].getGraphicItem().attribute as any).x1).toBeCloseTo(790);
});

test('add rect by api and y have two fields', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  });

  plot
    .rect()
    .data([
      { x: 'A', x1: 'B', y: 1, y1: 10 },
      { x: 'B', x1: 'C', y: 2, y1: 100 }
    ])
    .encode('x', ['x', 'x1'])
    .encode('y', ['y', 'y1']);

  plot.run();

  const marks = plot.view.getMarksByType('rect');

  expect(marks.length).toBe(1);

  const rectMark = marks[0];
  expect(rectMark.elements.length).toEqual(2);
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({ x: 0, fill: '#6690F2' });
  expect((rectMark.elements[0].getGraphicItem().attribute as any).y).toBeCloseTo(590);
  expect((rectMark.elements[0].getGraphicItem().attribute as any).y1).toBeCloseTo(536.3636363636364);
  expect((rectMark.elements[0].getGraphicItem().attribute as any).x1).toBeCloseTo(263.3333333333333);
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({ fill: '#6690F2' });
  expect((rectMark.elements[1].getGraphicItem().attribute as any).x).toBeCloseTo(263.3333333333333);
  expect((rectMark.elements[1].getGraphicItem().attribute as any).y).toBeCloseTo(584.040404040404);
  expect((rectMark.elements[1].getGraphicItem().attribute as any).x1).toBeCloseTo(526.6666666666666);
  expect((rectMark.elements[1].getGraphicItem().attribute as any).y1).toBeCloseTo(0);
});

test('add rect by api and y have two fields', () => {
  const plot = new Plot({
    width: 800,
    height: 600
  });

  plot
    .rect()
    .data([
      { x: 'A', x1: 'B', y: 1, y1: 10 },
      { x: 'B', x1: 'C', y: 2, y1: 100 }
    ])
    .encode('y', 'x1')
    .scale('y', { type: 'band' })
    .encode('x', 'y1')
    .scale('x', { type: 'linear' });

  plot.run();

  const marks = plot.view.getMarksByType('rect');

  expect(marks.length).toBe(1);

  const rectMark = marks[0];
  expect(rectMark.elements.length).toEqual(2);
  expect(rectMark.elements[0].getGraphicItem().attribute).toMatchObject({ x: 0, fill: '#6690F2' });
  expect((rectMark.elements[0].getGraphicItem().attribute as any).y).toBeCloseTo(295);
  expect((rectMark.elements[0].getGraphicItem().attribute as any).y1).toBeCloseTo(590);
  expect((rectMark.elements[0].getGraphicItem().attribute as any).x1).toBeCloseTo(0);
  expect(rectMark.elements[1].getGraphicItem().attribute).toMatchObject({ fill: '#6690F2' });
  expect((rectMark.elements[1].getGraphicItem().attribute as any).x).toBeCloseTo(790);
  expect((rectMark.elements[1].getGraphicItem().attribute as any).y).toBeCloseTo(0);
  expect((rectMark.elements[1].getGraphicItem().attribute as any).x1).toBeCloseTo(0);
  expect((rectMark.elements[1].getGraphicItem().attribute as any).y1).toBeCloseTo(295);
});
