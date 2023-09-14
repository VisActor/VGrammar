import { createSimpleElement } from '../util';

test('image channel of symbol', function () {
  const element = createSimpleElement('symbol');

  element.updateData('key', [{ key: 0 }], 'key', {} as any);
  element.initGraphicItem();

  // encode enter
  expect(element.getGraphicAttribute('background', true)).toEqual(undefined);
  element.encodeItems(
    element.items,
    {
      enter: {
        image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/log.jpeg'
      }
    },
    false,
    {}
  );
  expect(element.getItemAttribute('image')).toEqual('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/log.jpeg');
  element.encodeGraphic();
  expect(element.getGraphicAttribute('image')).toBe('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/log.jpeg');
  expect(element.getGraphicAttribute('background')).toBeUndefined();
  expect(element.getGraphicAttribute('fill')).toBeUndefined();
  expect(element.getGraphicAttribute('imageAttrs')).toEqual({
    fill: undefined,
    background: undefined,
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/log.jpeg'
  });
  expect(element.getGraphicItem().attribute).toEqual({
    background: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/log.jpeg',
    fill: false,
    imageAttrs: {
      fill: undefined,
      background: undefined,
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/log.jpeg'
    }
  });

  // encode update
  element.encodeItems(
    element.items,
    {
      update: { fill: 'red' }
    },
    false,
    {}
  );
  element.encodeGraphic();

  expect(element.getGraphicAttribute('image')).toBe('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/log.jpeg');
  expect(element.getGraphicAttribute('background')).toBeUndefined();
  expect(element.getGraphicAttribute('fill')).toBe('red');
  expect(element.getGraphicAttribute('imageAttrs')).toEqual({
    fill: 'red',
    background: undefined,
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/log.jpeg'
  });
  expect(element.getGraphicItem().attribute).toEqual({
    background: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/log.jpeg',
    fill: false,
    imageAttrs: {
      fill: 'red',
      background: undefined,
      image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/log.jpeg'
    }
  });
});

test('symbolType channel of symbol', function () {
  const element = createSimpleElement('symbol');

  element.updateData('key', [{ key: 0 }], 'key', {} as any);
  element.initGraphicItem();

  // encode enter
  expect(element.getGraphicAttribute('symbolType')).toEqual(undefined);
  expect(element.getGraphicAttribute('shape')).toEqual(undefined);
  element.encodeItems(
    element.items,
    {
      enter: {
        shape: 'diamond'
      }
    },
    false,
    {}
  );
  expect(element.getItemAttribute('shape')).toEqual('diamond');
  element.encodeGraphic();
  expect(element.getGraphicAttribute('symbolType')).toBe('diamond');
  expect(element.getGraphicAttribute('shape')).toBeUndefined();

  expect(element.getGraphicItem().attribute).toEqual({
    symbolType: 'diamond'
  });

  // encode update
  element.encodeItems(
    element.items,
    {
      update: { shape: 'circle' }
    },
    false,
    {}
  );
  element.encodeGraphic();

  expect(element.getGraphicAttribute('symbolType')).toBe('circle');
  expect(element.getGraphicAttribute('shape')).toBeUndefined();

  expect(element.getGraphicItem().attribute).toEqual({
    symbolType: 'circle'
  });
});
