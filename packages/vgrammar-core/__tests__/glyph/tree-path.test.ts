import { Factory, registerTreePathGlyph } from '../../src';
import { createSimpleGlyphElement } from '../util';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

registerTreePathGlyph();

test('line path encode', function () {
  const element = createSimpleGlyphElement(Factory.getGlyph('treePath'));
  element.updateData('key', [{ key: 0 }], 'key');
  element.initGraphicItem();
  element.encodeItems(
    element.items,
    {
      enter: {
        direction: 'vertical',
        startArrow: false,
        endArrow: true,
        // pathType: 'line',
        x0: 10,
        x1: 60,
        y0: 60,
        y1: 70,
        thickness: 1,
        lineWidth: 1
      }
    } as any,
    false,
    {}
  );
  element.encodeGraphic();

  expect(element.getGraphicAttribute('path', undefined, 'main')).toEqual('M10,60C10,65,60,65,60,70');
  expect(element.getGraphicAttribute('path', undefined, 'startArrow')).toEqual('');
  expect(element.getGraphicAttribute('path', undefined, 'endArrow')).toEqual('M57,67L60,70L63,67');
});
