import { createSimpleElement } from '../util';
import { initBrowserEnv } from '../../src/env';
import { registerGroupGraphic } from '../../src';

initBrowserEnv();
registerGroupGraphic();

test('cornerRadius can be set to Group', function () {
  const element = createSimpleElement('group', { transformType: 'rect' });

  element.updateData('key', [{ key: 0 }], 'key', {} as any);
  element.initGraphicItem();

  // encode enter
  expect(element.getGraphicAttribute('cornerRadius')).toEqual(undefined);
  element.encodeItems(
    element.items,
    {
      enter: { cornerRadius: [5, 4, 3, 2] }
    },
    false,
    {}
  );
  element.encodeGraphic();
  expect(element.getGraphicAttribute('cornerRadius')).toEqual([5, 4, 3, 2]);

  // encode update
  element.encodeItems(
    element.items,
    {
      update: { cornerRadius: 5 }
    },
    false,
    {}
  );
  element.encodeGraphic();
  expect(element.getGraphicAttribute('cornerRadius')).toEqual(5);
});

test("'strokeTop', 'strokeRight', 'strokeBottom', 'strokeLeft' can be set to Group", function () {
  const element = createSimpleElement('group', { transformType: 'rect' });

  element.updateData('key', [{ key: 0 }], 'key', {} as any);
  element.initGraphicItem();

  // encode enter
  expect(element.getGraphicAttribute('stroke')).toBeUndefined();
  element.encodeItems(
    element.items,
    {
      enter: {
        stroke: 'red',
        strokeTop: true,
        strokeRight: false
      }
    },
    false,
    {}
  );
  element.encodeGraphic();
  expect(element.getGraphicAttribute('stroke')).toBe('red');
  expect(element.getGraphicAttribute('strokeTop')).toBe(true);
  expect(element.getGraphicAttribute('strokeRight')).toBe(false);
  expect(element.getGraphicAttribute('strokeAttrs')).toBeUndefined();
});

test('size channels can be set to Group', function () {
  const element = createSimpleElement('group', { transformType: 'rect' });

  element.updateData('key', [{ key: 0 }], 'key', {} as any);
  element.initGraphicItem();

  // encode enter
  element.encodeItems(
    element.items,
    {
      enter: {
        x: 10,
        y: 10,
        x1: 20,
        y1: 20
      }
    },
    false,
    {}
  );
  element.encodeGraphic();

  expect(element.getGraphicItem().attribute).toEqual({
    x: 10,
    y: 10,
    x1: 20,
    y1: 20
  });
  expect(element.getGraphicAttribute('x')).toBe(10);
  expect(element.getGraphicAttribute('y')).toBe(10);
  expect(element.getGraphicAttribute('x1')).toBe(20);
  expect(element.getGraphicAttribute('y1')).toBe(20);
  expect(element.getGraphicAttribute('width')).toBeUndefined();
  expect(element.getGraphicAttribute('height')).toBeUndefined();
});
