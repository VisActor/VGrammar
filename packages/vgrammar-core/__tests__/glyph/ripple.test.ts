import { Factory, registerRippleGlyph } from '../../src';
import { createSimpleGlyphElement } from '../util';

registerRippleGlyph();

test('ripple encode', function () {
  const element = createSimpleGlyphElement(Factory.getGlyph('ripplePoint'));
  element.updateData('key', [{ key: 0 }], 'key', {} as any);
  element.initGraphicItem();
  element.encodeItems(
    element.items,
    {
      enter: {
        x: 10,
        y: 20,
        size: 30,
        fill: '#6690F2',
        ripple: 0
      }
    } as any,
    false,
    {}
  );
  element.encodeGraphic();

  expect(element.getGraphicAttribute('x', undefined, 'symbol')).toEqual(10);
  expect(element.getGraphicAttribute('size', undefined, 'symbol')).toEqual(30);
  expect(element.getGraphicAttribute('x', undefined, 'ripple0')).toEqual(10);
  expect(element.getGraphicAttribute('size', undefined, 'ripple0')).toEqual(30);
  expect(element.getGraphicAttribute('fillOpacity', undefined, 'ripple0')).toEqual(0.75);
  expect(element.getGraphicAttribute('x', undefined, 'ripple1')).toEqual(10);
  expect(element.getGraphicAttribute('size', undefined, 'ripple1')).toEqual(45);
  expect(element.getGraphicAttribute('fillOpacity', undefined, 'ripple1')).toEqual(0.5);
  expect(element.getGraphicAttribute('x', undefined, 'ripple2')).toEqual(10);
  expect(element.getGraphicAttribute('size', undefined, 'ripple2')).toEqual(60);
  expect(element.getGraphicAttribute('fillOpacity', undefined, 'ripple2')).toEqual(0.25);

  element.encodeItems(
    element.items,
    {
      enter: {
        x: 10,
        y: 20,
        size: 30,
        fill: '#6690F2',
        ripple: 0.5
      }
    } as any,
    false,
    {}
  );
  element.encodeGraphic();

  expect(element.getGraphicAttribute('x', undefined, 'symbol')).toEqual(10);
  expect(element.getGraphicAttribute('size', undefined, 'symbol')).toEqual(30);
  expect(element.getGraphicAttribute('x', undefined, 'ripple0')).toEqual(10);
  expect(element.getGraphicAttribute('size', undefined, 'ripple0')).toEqual(37.5);
  expect(element.getGraphicAttribute('fillOpacity', undefined, 'ripple0')).toEqual(0.625);
  expect(element.getGraphicAttribute('x', undefined, 'ripple1')).toEqual(10);
  expect(element.getGraphicAttribute('size', undefined, 'ripple1')).toEqual(52.5);
  expect(element.getGraphicAttribute('fillOpacity', undefined, 'ripple1')).toEqual(0.375);
  expect(element.getGraphicAttribute('x', undefined, 'ripple2')).toEqual(10);
  expect(element.getGraphicAttribute('size', undefined, 'ripple2')).toEqual(67.5);
  expect(element.getGraphicAttribute('fillOpacity', undefined, 'ripple2')).toEqual(0.125);

  element.encodeItems(
    element.items,
    {
      enter: {
        x: 10,
        y: 20,
        size: 30,
        fill: '#6690F2',
        ripple: 1
      }
    } as any,
    false,
    {}
  );
  element.encodeGraphic();

  expect(element.getGraphicAttribute('x', undefined, 'symbol')).toEqual(10);
  expect(element.getGraphicAttribute('size', undefined, 'symbol')).toEqual(30);
  expect(element.getGraphicAttribute('x', undefined, 'ripple0')).toEqual(10);
  expect(element.getGraphicAttribute('size', undefined, 'ripple0')).toEqual(45);
  expect(element.getGraphicAttribute('fillOpacity', undefined, 'ripple0')).toEqual(0.5);
  expect(element.getGraphicAttribute('x', undefined, 'ripple1')).toEqual(10);
  expect(element.getGraphicAttribute('size', undefined, 'ripple1')).toEqual(60);
  expect(element.getGraphicAttribute('fillOpacity', undefined, 'ripple1')).toEqual(0.25);
  expect(element.getGraphicAttribute('x', undefined, 'ripple2')).toEqual(10);
  expect(element.getGraphicAttribute('size', undefined, 'ripple2')).toEqual(75);
  expect(element.getGraphicAttribute('fillOpacity', undefined, 'ripple2')).toEqual(0);

  element.encodeItems(
    element.items,
    {
      update: {
        size: 50
      }
    } as any,
    false,
    {}
  );
  element.encodeGraphic();

  expect(element.getGraphicAttribute('x', undefined, 'symbol')).toEqual(10);
  expect(element.getGraphicAttribute('size', undefined, 'symbol')).toEqual(50);
  expect(element.getGraphicAttribute('x', undefined, 'ripple0')).toEqual(10);
  expect(element.getGraphicAttribute('size', undefined, 'ripple0')).toEqual(75);
  expect(element.getGraphicAttribute('fillOpacity', undefined, 'ripple0')).toEqual(0.5);
  expect(element.getGraphicAttribute('x', undefined, 'ripple1')).toEqual(10);
  expect(element.getGraphicAttribute('size', undefined, 'ripple1')).toEqual(100);
  expect(element.getGraphicAttribute('fillOpacity', undefined, 'ripple1')).toEqual(0.25);
  expect(element.getGraphicAttribute('x', undefined, 'ripple2')).toEqual(10);
  expect(element.getGraphicAttribute('size', undefined, 'ripple2')).toEqual(125);
  expect(element.getGraphicAttribute('fillOpacity', undefined, 'ripple2')).toEqual(0);
});
