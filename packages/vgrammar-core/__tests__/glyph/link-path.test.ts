import { Factory, registerLinkPathGlyph } from '../../src';
import { createSimpleGlyphElement } from '../util';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

registerLinkPathGlyph();

test('link path encode', function () {
  const element = createSimpleGlyphElement(Factory.getGlyph('linkPath'));
  element.updateData('key', [{ key: 0 }], 'key');
  element.initGraphicItem();
  element.encodeItems(
    element.items,
    {
      enter: {
        x0: 10,
        x1: 111,
        y0: 146,
        y1: 150,
        thickness: 19,
        round: true,
        fill: 'pink',
        fillOpacity: 0.5
      }
    } as any,
    false,
    {}
  );
  element.encodeGraphic();

  expect(element.getGraphicAttribute('path', undefined, 'back')).toEqual('');
  expect(element.getGraphicAttribute('path', undefined, 'front')).toEqual(
    'M10,137C61,137,61,141,111,141\n  L111,160C61,160,61,156,10,156Z'
  );
});

test('add state to a link path', function () {
  const element = createSimpleGlyphElement(Factory.getGlyph('linkPath'));
  element.updateData('key', [{ key: 0 }], 'key');
  element.initGraphicItem();
  element.encodeItems(
    element.items,
    {
      enter: {
        x0: 10,
        x1: 111,
        y0: 146,
        y1: 150,
        thickness: 19,
        round: true,
        fill: 'pink',
        fillOpacity: 0.5
      }
    } as any,
    false,
    {}
  );
  element.encodeGraphic();

  expect(element.getGraphicAttribute('fill')).toBe('pink');
  expect(element.getGraphicAttribute('ratio')).toBeUndefined();
  expect(element.getGraphicAttribute('path', undefined, 'back')).toEqual('');
  expect(element.getGraphicAttribute('path', undefined, 'front')).toEqual(
    'M10,137C61,137,61,141,111,141\n  L111,160C61,160,61,156,10,156Z'
  );

  element.addState('selected', { ratio: 0.5, fill: 'red' });
  expect(element.getGraphicAttribute('path', undefined, 'back')).toEqual(
    'M10,137C61,137,61,141,111,141\n  L111,160C61,160,61,156,10,156Z'
  );
  expect(element.getGraphicAttribute('path', undefined, 'front')).toEqual(
    `M10,137C61,137,61,141,111,141
  L111,151C61,151,61,147,10,147Z`
  );
  expect(element.getGraphicAttribute('fill')).toBe('red');
  expect(element.getGraphicAttribute('ratio')).toBe(0.5);
});
