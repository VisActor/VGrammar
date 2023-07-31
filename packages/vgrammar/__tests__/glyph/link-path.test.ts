import { registerLinkPathGlyph } from '../../src';
import { getGlyph } from '../../src/view/register-glyph';
import { createSimpleBoxplotElement } from '../util';

registerLinkPathGlyph();

test('line path encode', function () {
  const element = createSimpleBoxplotElement(getGlyph('linkPath'));
  element.updateData('key', [{ key: 0 }], 'key', {} as any);
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
    {}
  );
  element.encodeGraphic();

  expect(element.getGraphicAttribute('path', undefined, 'back')).toEqual('');
  expect(element.getGraphicAttribute('path', undefined, 'front')).toEqual(
    'M10,137C61,137,61,141,111,141\n  L111,160C61,160,61,156,10,156Z'
  );
});
