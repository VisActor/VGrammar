import { Rect } from '@visactor/vrender-core';
import { createSimpleElement } from '../util';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

test('Create element and update data', function () {
  const element = createSimpleElement();
  element.updateData('key', [{ key: 0 }], 'key');
  element.initGraphicItem();
  expect(element.getGraphicItem() instanceof Rect).toEqual(true);

  element.updateData('key', [{ key: 0 }, { key: 1 }], 'key');
  expect(element.items.length).toEqual(2);
  expect(element.items[0].datum.key).toEqual(0);
});

test('Element executes state updating', function () {
  const element = createSimpleElement();

  element.updateData('key', [{ key: 0 }], 'key');

  element.state('hover');
  expect(element.getStates()).toEqual(['hover']);

  element.state(['hover', 'active']);
  expect(element.getStates()).toEqual(['hover', 'active']);

  element.state((datum: any, el: any) => {
    return `${datum.key}-${el.mark.markType}`;
  });
  expect(element.getStates()).toEqual(['0-rect']);
});

test('Element executes encoding', function () {
  const element = createSimpleElement();

  element.updateData('key', [{ key: 0 }], 'key');
  element.initGraphicItem();

  // encode enter
  expect(element.getGraphicAttribute('x')).toEqual(undefined);
  element.encodeItems(
    element.items,
    {
      enter: { x: 123 }
    },
    false,
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
    false,
    {}
  );
  element.encodeGraphic();
  expect(element.getGraphicAttribute('fill')).toEqual('red');

  // encode hover
  expect(element.getGraphicAttribute('x')).toEqual(123);
  element.encodeItems(
    element.items,
    {
      hover: { x: 233 }
    },
    false,
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
    false,
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
