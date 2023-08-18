import { createSimpleElement } from '../util';

test('Element executes state updating', function () {
  const element = createSimpleElement();

  element.updateData('key', [{ key: 0 }], 'key', {} as any);
  element.initGraphicItem();
  element.addState('hover', { fill: 'red' });
  expect(element.getStates()).toEqual(['hover']);
  expect(element.getGraphicItem().attribute).toEqual({ fill: 'red' });

  element.addState('hover', { fill: 'green' });
  expect(element.getStates()).toEqual(['hover']);
  expect(element.getGraphicItem().attribute).toEqual({ fill: 'green' });
});
