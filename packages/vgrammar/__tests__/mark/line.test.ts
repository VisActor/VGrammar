import { createSimpleElement } from '../util';

test('cornerRadius can be set to Rect', function () {
  const encode = {
    enter: { x: 1, y: 2 },
    selected: { fillOpacity: 0.5 }
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
  element.encodeItems(element.items, encode, {});
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
});
