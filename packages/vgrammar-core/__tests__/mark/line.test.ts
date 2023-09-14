import { createSimpleElement } from '../util';

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
