import { Glyph, Rect, Line } from '@visactor/vrender';
import { registerGlyph } from '../../src/view/register-glyph';
import { createElement } from '../../src/graph/util/element';
import type { IGlyphElement } from '../../src/types';
import { emptyFunction, getMockedView } from '../util';
import { createGlyphGraphicItem } from '../../src/graph/util/graphic';
import { transformsByType } from '../../src/graph/attributes';

const view = getMockedView();

const glyphMeta = registerGlyph(
  'testGlyph',
  { rect: 'rect', rule: 'rule' },
  {
    color: (channel: string, encodeValue: any) => {
      return {
        rule: { fill: encodeValue, stroke: encodeValue },
        rect: { fill: encodeValue, stroke: encodeValue }
      };
    },
    width: (channel: string, encodeValue: any, encodeValues: any) => {
      return {
        rule: { x1: encodeValues.x + encodeValue, ruleWidth: encodeValues.x + encodeValue }
      };
    },
    y: (channel: string, encodeValue: any, encodeValues: any) => {
      const yCenter = (encodeValues.y + encodeValues.y1) / 2;
      return {
        rule: { y: yCenter, y1: yCenter }
      };
    }
  },
  () => {
    return {
      rule: { lineWidth: 4 },
      rect: { lineWidth: 4, borderRadius: 5 }
    };
  }
);

function createSimpleElement() {
  const mark = {
    markType: 'glyph',
    isLargeMode: () => false,
    isCollectionMark: () => false,
    needAnimate: () => false,
    graphicParent: { appendChild: emptyFunction, insertInto: emptyFunction },
    getSpec: () => ({}),
    parameters: () => ({}),
    glyphMeta,
    getGlyphMeta: () => glyphMeta,
    emit: () => false,
    view,
    isProgressive: () => false,
    getGlyphConfig: () => null as any,
    getAttributeTransforms: () => transformsByType.rect
  } as any;
  mark.addGraphicItem = () => {
    return (createGlyphGraphicItem as any)(mark, glyphMeta, {});
  };
  const element = createElement(mark) as IGlyphElement;
  element.updateData('key', [{ key: 0 }], 'key', {} as any);
  return element;
}

test('Register glyph meta', function () {
  const glyphMeta0 = registerGlyph('testGlyph0', { rect: 'arc', rule: 'rect' })
    .registerDefaultEncoder(() => {
      return {
        rule: { lineWidth: 4 },
        rect: { lineWidth: 4, borderRadius: 5 }
      };
    })
    .registerChannelEncoder('color', (channel: string, encodeValue: any) => {
      return {
        rule: { fill: encodeValue, stroke: encodeValue },
        rect: { fill: encodeValue, stroke: encodeValue }
      };
    })
    .registerChannelEncoder('width', (channel: string, encodeValue: any, encodeValues: any) => {
      return {
        rule: { x1: encodeValues.x + encodeValue }
      };
    })
    .registerChannelEncoder('y', (channel: string, encodeValue: any, encodeValues: any) => {
      const yCenter = (encodeValues.y + encodeValues.y1) / 2;
      return {
        rule: { y: yCenter, y1: yCenter }
      };
    });
  expect(Object.keys(glyphMeta0.getMarks())).toEqual(['rect', 'rule']);
  expect(Object.values(glyphMeta0.getMarks())).toEqual(['arc', 'rect']);
  const defaultEncodeResult0 = glyphMeta0.getDefaultEncoder()({}, {} as any, null);
  expect(defaultEncodeResult0.rule.lineWidth).toEqual(4);
  expect(defaultEncodeResult0.rect.borderRadius).toEqual(5);
  const widthResult0 = glyphMeta0.getChannelEncoder().width('width', 40, { x: 10 }, {}, {} as any, null);
  expect(widthResult0.rule.x1).toEqual(50);

  const glyphMeta1 = registerGlyph(
    'testGlyph1',
    { rect: 'arc', rule: 'rect' },
    {
      color: (channel: string, encodeValue: any) => {
        return {
          rule: { fill: encodeValue, stroke: encodeValue },
          rect: { fill: encodeValue, stroke: encodeValue }
        };
      },
      width: (channel: string, encodeValue: any, encodeValues: any) => {
        return {
          rule: { x1: encodeValues.x + encodeValue }
        };
      },
      y: (channel: string, encodeValue: any, encodeValues: any) => {
        const yCenter = (encodeValues.y + encodeValues.y1) / 2;
        return {
          rule: { y: yCenter, y1: yCenter }
        };
      }
    },
    () => {
      return {
        rule: { lineWidth: 4 },
        rect: { lineWidth: 4, borderRadius: 5 }
      };
    }
  );
  expect(Object.keys(glyphMeta1.getMarks())).toEqual(['rect', 'rule']);
  expect(Object.values(glyphMeta0.getMarks())).toEqual(['arc', 'rect']);
  const defaultEncodeResult1 = glyphMeta1.getDefaultEncoder()({}, {} as any, null);
  expect(defaultEncodeResult1.rule.lineWidth).toEqual(4);
  expect(defaultEncodeResult1.rect.borderRadius).toEqual(5);
  const widthResult1 = glyphMeta1.getChannelEncoder().width('width', 40, { x: 10 }, {}, {} as any, null);
  expect(widthResult1.rule.x1).toEqual(50);
});

test('Create element and update data', function () {
  const element = createSimpleElement();
  element.initGraphicItem();
  expect(element.getGraphicItem() instanceof Glyph).toEqual(true);
  expect(element.getGlyphGraphicItems().rect instanceof Rect).toEqual(true);
  expect(element.getGlyphGraphicItems().rule instanceof Line).toEqual(true);

  element.updateData('key', [{ key: 0 }, { key: 1 }], 'key', {} as any);
  expect(element.items.length).toEqual(2);
  expect(element.items[0].datum.key).toEqual(0);
});

test('Element executes state updating', function () {
  const element = createSimpleElement();

  element.state('hover');
  expect(element.getStates()).toEqual(['hover']);

  element.state(['hover', 'active']);
  expect(element.getStates()).toEqual(['hover', 'active']);

  element.state((datum: any, el: any) => {
    return `${datum.key}-${el.mark.markType}`;
  });
  expect(element.getStates()).toEqual(['0-glyph']);
});

test('Element executes encoding', function () {
  const element = createSimpleElement();
  element.initGraphicItem();

  // encode enter
  expect(element.getGraphicAttribute('fill')).toEqual(undefined);
  expect(element.getGraphicAttribute('stroke')).toEqual(undefined);
  element.encodeItems(
    element.items,
    {
      enter: { color: 'red' }
    },
    false,
    {}
  );
  element.encodeGraphic();
  expect(element.getGraphicAttribute('fill', false, 'rect')).toEqual('red');
  expect(element.getGraphicAttribute('stroke', false, 'rect')).toEqual('red');

  // encode update
  expect(element.getGraphicAttribute('ruleWidth', false, 'rule')).toEqual(undefined);
  element.encodeItems(
    element.items,
    {
      update: { x: 10, width: 40 }
    },
    false,
    {}
  );
  element.encodeGraphic();
  expect(element.getGraphicAttribute('ruleWidth', false, 'rect')).toEqual(undefined);
  expect(element.getGraphicAttribute('width', false, 'rect')).toEqual(40);
  expect(element.getGraphicAttribute('ruleWidth', false, 'rule')).toEqual(50);

  // encode function
  element.encodeItems(
    element.items,
    {
      update: {
        custom: (datum: any, el: any) => {
          return `${datum.key}-${el.mark.markType}`;
        }
      }
    },
    false,
    {}
  );
  element.encodeGraphic();
  expect(element.getGraphicAttribute('custom')).toEqual('0-glyph');

  // encode field
  element.encodeItems(
    element.items,
    {
      update: {
        custom: { field: 'key' }
      }
    },
    false,
    {}
  );
  element.encodeGraphic();
  expect(element.getGraphicAttribute('custom')).toEqual(0);

  // encode scale
  element.encodeItems(
    element.items,
    {
      update: {
        custom: { scale: 'scaleA', field: 'key' }
      }
    },
    false,
    {
      scaleA: { scale: (v: any) => `scaled-${v}` }
    }
  );
  element.encodeGraphic();
  expect(element.getGraphicAttribute('custom')).toEqual('scaled-0');
});
