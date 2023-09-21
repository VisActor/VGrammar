import { Factory, registerWaveGlyph } from '../../src';
import { createSimpleGlyphElement } from '../util';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

registerWaveGlyph();

test('wave encode', function () {
  const element = createSimpleGlyphElement(Factory.getGlyph('wave'));
  element.updateData('key', [{ key: 0 }], 'key', {} as any);
  element.initGraphicItem();
  element.encodeItems(
    element.items,
    {
      enter: {
        y: 100,
        height: 1000,
        fill: '#6690F2',
        wave: 0
      }
    } as any,
    false,
    {}
  );
  element.encodeGraphic();

  expect(element.getGraphicAttribute('fillOpacity', undefined, 'wave0')).toEqual(1);
  expect(element.getGraphicAttribute('fillOpacity', undefined, 'wave1')).toEqual(0.66);
  expect(element.getGraphicAttribute('fillOpacity', undefined, 'wave2')).toEqual(0.33);
  expect(element.getGraphicAttribute('points', undefined, 'wave0')).toEqual([
    { x: -500, y: 120, y1: 1100 },
    { x: -450, y: 100, y1: 1100 },
    { x: -400, y: 120, y1: 1100 },
    { x: -350, y: 100, y1: 1100 },
    { x: -300, y: 120, y1: 1100 },
    { x: -250, y: 100, y1: 1100 },
    { x: -200, y: 120, y1: 1100 },
    { x: -150, y: 100, y1: 1100 },
    { x: -100, y: 120, y1: 1100 },
    { x: -50, y: 100, y1: 1100 },
    { x: 0, y: 120, y1: 1100 },
    { x: 50, y: 100, y1: 1100 },
    { x: 100, y: 120, y1: 1100 },
    { x: 150, y: 100, y1: 1100 },
    { x: 200, y: 120, y1: 1100 },
    { x: 250, y: 100, y1: 1100 },
    { x: 300, y: 120, y1: 1100 },
    { x: 350, y: 100, y1: 1100 },
    { x: 400, y: 120, y1: 1100 },
    { x: 450, y: 100, y1: 1100 },
    { x: 500, y: 120, y1: 1100 }
  ]);
  expect(element.getGraphicAttribute('points', undefined, 'wave1')[0]).toEqual({ x: -540, y: 120, y1: 1100 });
  expect(element.getGraphicAttribute('points', undefined, 'wave2')[0]).toEqual({ x: -520, y: 120, y1: 1100 });

  element.encodeItems(
    element.items,
    {
      enter: {
        y: 100,
        height: 1000,
        fill: '#6690F2',
        wave: 0.5
      }
    } as any,
    false,
    {}
  );
  element.encodeGraphic();
  expect(element.getGraphicAttribute('points', undefined, 'wave0')[0]).toEqual({ x: -450, y: 120, y1: 1100 });
  expect(element.getGraphicAttribute('points', undefined, 'wave1')[0]).toEqual({ x: -440, y: 120, y1: 1100 });
  expect(element.getGraphicAttribute('points', undefined, 'wave2')[0]).toEqual({ x: -370, y: 120, y1: 1100 });

  element.encodeItems(
    element.items,
    {
      enter: {
        y: 100,
        height: 1000,
        fill: '#6690F2',
        wave: 1
      }
    } as any,
    false,
    {}
  );
  element.encodeGraphic();
  expect(element.getGraphicAttribute('points', undefined, 'wave0')[0]).toEqual({ x: -400, y: 120, y1: 1100 });
  expect(element.getGraphicAttribute('points', undefined, 'wave1')[0]).toEqual({ x: -340, y: 120, y1: 1100 });
  expect(element.getGraphicAttribute('points', undefined, 'wave2')[0]).toEqual({ x: -220, y: 120, y1: 1100 });
});
