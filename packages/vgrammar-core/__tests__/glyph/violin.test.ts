import { createSimpleGlyphElement, getMockedView } from '../util';
import { Factory, registerViolinGlyph } from '../../src';
import { Scale } from '../../src/view/scale';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

registerViolinGlyph();

test('violin encode', function () {
  const scale = new Scale(getMockedView() as any, 'linear');
  scale.domain([0, 100]).range([0, 100]);

  const element = createSimpleGlyphElement(Factory.getGlyph('violin'));
  element.updateData(
    'key',
    [
      {
        key: 0,
        density: [
          [0, 0],
          [100, 0],
          [200, 0],
          [300, 0.0001],
          [400, 0.0001],
          [500, 0.0002],
          [600, 0.0003],
          [700, 0.0007],
          [800, 0.0006],
          [900, 0.0006],
          [1000, 0.0002],
          [1200, 0.0001],
          [1300, 0]
        ]
      }
    ],
    'key',
    {} as any
  );
  element.initGraphicItem();
  element.encodeItems(
    element.items,
    {
      enter: {
        x: 10,
        max: 100,
        q3: 80,
        median: 60,
        q1: 40,
        min: 20,
        density: { scale: scale, field: 'density' },
        densitySize: 20,
        width: 10,
        size: 6,
        opacity: 1
      }
    } as any,
    false,
    {}
  );
  element.mark.getScalesByChannel = () => {
    return { density: scale.output() };
  };
  element.mark.getFieldsByChannel = () => {
    return { density: 'density' };
  };
  element.encodeGraphic();

  expect(element.getGraphicAttribute('points', undefined, 'violin')).toEqual([
    { x: -0, y: 0 },
    { x: -0, y: 100 },
    { x: -0, y: 200 },
    { x: -2.857142857142857, y: 300 },
    { x: -2.857142857142857, y: 400 },
    { x: -5.714285714285714, y: 500 },
    { x: -8.571428571428571, y: 600 },
    { x: -20, y: 700 },
    { x: -17.142857142857142, y: 800 },
    { x: -17.142857142857142, y: 900 },
    { x: -5.714285714285714, y: 1000 },
    { x: -2.857142857142857, y: 1200 },
    { x: -0, y: 1300 },
    { x: 0, y: 1300 },
    { x: 2.857142857142857, y: 1200 },
    { x: 5.714285714285714, y: 1000 },
    { x: 17.142857142857142, y: 900 },
    { x: 17.142857142857142, y: 800 },
    { x: 20, y: 700 },
    { x: 8.571428571428571, y: 600 },
    { x: 5.714285714285714, y: 500 },
    { x: 2.857142857142857, y: 400 },
    { x: 2.857142857142857, y: 300 },
    { x: 0, y: 200 },
    { x: 0, y: 100 },
    { x: 0, y: 0 }
  ]);
  expect(element.getGraphicAttribute('points', undefined, 'shaft')).toEqual([
    { x: 10, y: 20 },
    { x: 10, y: 100 }
  ]);
  expect(element.getGraphicAttribute('x', undefined, 'box')).toEqual(5);
  expect(element.getGraphicAttribute('width', undefined, 'box')).toEqual(10);
  expect(element.getGraphicAttribute('y', undefined, 'box')).toEqual(40);
  expect(element.getGraphicAttribute('x', undefined, 'median')).toEqual(10);
  expect(element.getGraphicAttribute('y', undefined, 'median')).toEqual(60);
});
