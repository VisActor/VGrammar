import { createSimpleBoxplotElement } from '../util';
import { registerBarBoxplotGlyph, registerBoxplotGlyph } from '../../src';
import { getGlyph } from '../../src/view/register-glyph';
import { barBoxplotScaleIn, barBoxplotScaleOut, boxplotScaleIn, boxplotScaleOut } from '../../src/glyph/boxplot';

registerBoxplotGlyph();

registerBarBoxplotGlyph();

test('boxplot encode', function () {
  const element = createSimpleBoxplotElement(getGlyph('boxplot'));
  element.updateData('key', [{ key: 0 }], 'key', {} as any);
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
        boxWidth: 60,
        ruleWidth: 40
      }
    } as any,
    false,
    {}
  );
  element.encodeGraphic();

  expect(element.getGraphicAttribute('points', undefined, 'shaft')).toEqual([
    { x: 10, y: 20 },
    { x: 10, y: 100 }
  ]);
  expect(element.getGraphicAttribute('x', undefined, 'box')).toEqual(-20);
  expect(element.getGraphicAttribute('width', undefined, 'box')).toEqual(60);
  expect(element.getGraphicAttribute('points', undefined, 'max')).toEqual([
    { x: -10, y: 100 },
    { x: 30, y: 100 }
  ]);
  expect(element.getGraphicAttribute('points', undefined, 'min')).toEqual([
    { x: -10, y: 20 },
    { x: 30, y: 20 }
  ]);
  expect(element.getGraphicAttribute('points', undefined, 'median')).toEqual([
    { x: -20, y: 60 },
    { x: 40, y: 60 }
  ]);
});

test('barBoxplot encode', function () {
  const element = createSimpleBoxplotElement(getGlyph('barBoxplot'));
  element.updateData('key', [{ key: 0 }], 'key', {} as any);
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
        q1q3Width: 60,
        minMaxWidth: 40
      }
    } as any,
    false,
    {}
  );
  element.encodeGraphic();

  expect(element.getGraphicAttribute('x', undefined, 'minMaxBox')).toEqual(-10);
  expect(element.getGraphicAttribute('width', undefined, 'minMaxBox')).toEqual(40);
  expect(element.getGraphicAttribute('x', undefined, 'q1q3Box')).toEqual(-20);
  expect(element.getGraphicAttribute('width', undefined, 'q1q3Box')).toEqual(60);
  expect(element.getGraphicAttribute('points', undefined, 'median')).toEqual([
    { x: -20, y: 60 },
    { x: 40, y: 60 }
  ]);
});

test('boxplot animation', function () {
  const element = createSimpleBoxplotElement(getGlyph('boxplot'), { transformType: 'rect' });
  element.updateData('key', [{ key: 0 }], 'key', {} as any);
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
        boxWidth: 60,
        ruleWidth: 40
      }
    } as any,
    false,
    {}
  );
  element.encodeGraphic();

  const scaleInAttributes = boxplotScaleIn(element, {}, {} as any);
  expect(scaleInAttributes).toEqual({
    from: {
      max: 60,
      median: 60,
      min: 60,
      q1: 60,
      q3: 60,
      x: 10,
      y: 0
    },
    to: {
      max: 100,
      median: 60,
      min: 20,
      q1: 40,
      q3: 80,
      x: 10,
      y: 0
    }
  });

  const scaleOutAttributes = boxplotScaleOut(element, {}, {} as any);
  expect(scaleOutAttributes).toEqual({
    from: {
      max: 100,
      median: 60,
      min: 20,
      q1: 40,
      q3: 80,
      x: 10,
      y: 0
    },
    to: {
      max: 60,
      median: 60,
      min: 60,
      q1: 60,
      q3: 60,
      x: 10,
      y: 0
    }
  });
});

test('barBoxplot animation', function () {
  const element = createSimpleBoxplotElement(getGlyph('barBoxplot'), { transformType: 'rect' });
  element.updateData('key', [{ key: 0 }], 'key', {} as any);
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
        q1q3Width: 60,
        minMaxWidth: 40
      }
    } as any,
    false,
    {}
  );
  element.encodeGraphic();

  const scaleInAttributes = barBoxplotScaleIn(element, {}, {} as any);
  expect(scaleInAttributes).toEqual({
    from: {
      max: 60,
      median: 60,
      min: 60,
      q1: 60,
      q3: 60,
      x: 10,
      y: 0
    },
    to: {
      max: 100,
      median: 60,
      min: 20,
      q1: 40,
      q3: 80,
      x: 10,
      y: 0
    }
  });

  const scaleOutAttributes = barBoxplotScaleOut(element, {}, {} as any);
  expect(scaleOutAttributes).toEqual({
    from: {
      max: 100,
      median: 60,
      min: 20,
      q1: 40,
      q3: 80,
      x: 10,
      y: 0
    },
    to: {
      max: 60,
      median: 60,
      min: 60,
      q1: 60,
      q3: 60,
      x: 10,
      y: 0
    }
  });
});
