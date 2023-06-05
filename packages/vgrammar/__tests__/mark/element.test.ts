import { Rect } from '@visactor/vrender';
import { createGraphicItem } from '../../src/graph/util/graphic';
import { createElement } from '../../src/graph/util/element';
import { emptyFunction, getMockedView } from '../util';
import { transformsByType } from '../../src/graph/attributes';

const view = getMockedView();

function createSimpleElement(markType: string = 'rect') {
  const mark = {
    markType,
    isLargeMode: () => false,
    isCollectionMark: () => markType === 'line' || markType === 'area',
    needAnimate: () => false,
    getSpec: () => ({}),
    parameters: () => ({}),
    graphicParent: { appendChild: emptyFunction, insertInto: emptyFunction },
    emit: () => false,
    view,
    isProgressive: () => false,
    getAttributeTransforms: () => transformsByType.rect
  } as any;
  mark.addGraphicItem = () => {
    return (createGraphicItem as any)(mark, markType, {});
  };
  const element = createElement(mark);
  element.updateData('key', [{ key: 0 }], 'key', {} as any);
  return element;
}

test('Create element and update data', function () {
  const element = createSimpleElement();
  element.initGraphicItem();
  expect(element.getGraphicItem() instanceof Rect).toEqual(true);

  element.updateData('key', [{ key: 0 }, { key: 1 }], 'key', {} as any);
  expect(element.items.length).toEqual(2);
  expect(element.items[0].datum.key).toEqual(0);
});

test('Element executes state updating', function () {
  const element = createSimpleElement();

  element.state('hover', view, {});
  expect(element.getStates()).toEqual(['hover']);

  element.state(['hover', 'active'], view, {});
  expect(element.getStates()).toEqual(['hover', 'active']);

  element.state(
    (datum: any, el: any) => {
      return `${datum.key}-${el.mark.markType}`;
    },
    view,
    {}
  );
  expect(element.getStates()).toEqual(['0-rect']);
});

test('Element executes encoding', function () {
  const element = createSimpleElement();
  element.initGraphicItem();

  // encode enter
  expect(element.getGraphicAttribute('x')).toEqual(undefined);
  element.encodeItems(
    element.items,
    {
      enter: { x: 123 }
    },
    {}
  );
  element.encodeGraphic();
  expect(element.getGraphicAttribute('x')).toEqual(123);

  // encode update
  expect(element.getGraphicAttribute('stroke')).toEqual(undefined);
  element.encodeItems(
    element.items,
    {
      update: { fill: 'red' }
    },
    {}
  );
  element.encodeGraphic();
  expect(element.getGraphicAttribute('fill')).toEqual(true);
  expect(element.getGraphicAttribute('fillColor')).toEqual('red');

  // encode hover
  expect(element.getGraphicAttribute('x')).toEqual(123);
  element.encodeItems(
    element.items,
    {
      hover: { x: 233 }
    },
    {}
  );
  element.encodeGraphic();
  expect(element.getGraphicAttribute('x')).toEqual(123);
  element.mark.getSpec = () => ({
    encode: { hover: { x: 233 } }
  });
  element.useStates(['hover']);
  expect(element.getGraphicAttribute('x')).toEqual(233);
  element.mark.getSpec = () => ({});

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
    {}
  );
  element.encodeGraphic();
  expect(element.getGraphicAttribute('custom')).toEqual('0-rect');

  // encode field
  element.encodeItems(
    element.items,
    {
      update: {
        custom: { field: 'key' }
      }
    },
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
    {
      scaleA: { scale: (v: any) => `scaled-${v}` }
    }
  );

  element.encodeGraphic();
  expect(element.getGraphicAttribute('custom')).toEqual('scaled-0');
});
