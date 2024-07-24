import { createSimpleElement } from '../util';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

test('addState to line', function () {
  const encode = {
    enter: { x: 1, y: 2 },
    selected: { fillOpacity: 0.5 },
    hover: { x: 3 }
  };
  const element = createSimpleElement('line', {
    markSpec: {
      encode
    }
  });

  element.updateData('key', [{ key: 0 }, { key: 1 }], 'key', {} as any);
  element.initGraphicItem();

  // encode enter
  expect(element.getGraphicAttribute('points')).toEqual(undefined);
  element.encodeItems(element.items, encode, false, {});
  element.encodeGraphic();
  expect(element.getGraphicAttribute('points')).toEqual([
    { x: 1, y: 2, context: 0 },
    { x: 1, y: 2, context: 1 }
  ]);
  expect(element.getGraphicAttribute('fillOpacity')).toBeUndefined();
  expect(element.getStates()).toEqual([]);

  element.addState('selected');
  expect(element.getStates()).toEqual(['selected']);
  expect(element.getGraphicItem().states).toEqual({ selected: encode.selected });
  expect(element.getGraphicAttribute('fillOpacity')).toBe(0.5);

  element.addState('hover');
  expect(element.getStates()).toEqual(['selected', 'hover']);
  expect(element.getGraphicItem().states.hover).toEqual({
    points: [
      { x: 3, y: 2, context: 0 },
      { x: 3, y: 2, context: 1 }
    ],
    segments: null
  });
  expect(element.getGraphicAttribute('fillOpacity')).toBe(0.5);
});

test('enableSegments is false of line', function () {
  const encode = {
    update: {
      fill: (datum: any) => (datum.key <= 1 ? 'red' : 'green'),
      x: (datum: any) => datum.key,
      y: 10
    }
  };
  const element = createSimpleElement('line', {
    markSpec: {
      encode,
      enableSegments: false
    }
  });

  element.updateData('key', [{ key: 0 }, { key: 1 }, { key: 2 }, { key: 3 }], 'key', {} as any);
  element.initGraphicItem();

  // encode enter
  expect(element.getGraphicAttribute('points')).toEqual(undefined);
  element.encodeItems(element.items, encode, false, {});
  element.encodeGraphic();
  expect(element.getGraphicAttribute('points')).toEqual([
    { x: 0, y: 10, context: 0, fill: 'red' },
    { x: 1, y: 10, context: 1 },
    { x: 2, y: 10, context: 2 },
    { x: 3, y: 10, context: 3 }
  ]);
  expect(element.getGraphicItem().attribute).toEqual({
    fill: 'red',
    points: [
      { x: 0, y: 10, context: 0, fill: 'red' },
      { x: 1, y: 10, context: 1 },
      { x: 2, y: 10, context: 2 },
      { x: 3, y: 10, context: 3 }
    ],
    segments: null
  });
});

test('enableSegments is true', function () {
  const encode = {
    update: {
      stroke: (datum: any) => (datum.key <= 1 ? 'red' : 'green'),
      x: (datum: any) => datum.key,
      y: 10
    }
  };
  const element = createSimpleElement('line', {
    markSpec: {
      encode,
      enableSegments: true
    }
  });

  element.updateData('key', [{ key: 0 }, { key: 1 }, { key: 2 }, { key: 3 }], 'key', {} as any);
  element.initGraphicItem();

  // encode enter
  expect(element.getGraphicAttribute('points')).toEqual(undefined);
  element.encodeItems(element.items, encode, false, {});
  element.encodeGraphic();
  expect(element.getGraphicItem().attribute).toEqual({
    points: null,
    segments: [
      {
        points: [
          { x: 0, y: 10, context: 0, stroke: 'red' },
          { x: 1, y: 10, context: 1, stroke: 'red' }
        ],
        stroke: 'red'
      },
      {
        points: [
          { x: 2, y: 10, context: 2, stroke: 'green' },
          { x: 3, y: 10, context: 3, stroke: 'green' }
        ],
        stroke: 'green'
      }
    ]
  });
});
