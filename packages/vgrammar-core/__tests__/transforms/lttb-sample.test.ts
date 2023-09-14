import { transform } from '../../src/transforms/mark/lttb-sample';
import { createSimpleElement } from '../util';

test('lttb sample', () => {
  const elements = [];
  for (let i = 0; i < 100; i++) {
    const element = createSimpleElement('symbol');
    element.initGraphicItem();
    element.setGraphicAttributes({ x: 0, y: 0 });
    element.data = [{ index: i }];
    elements.push(element);
  }

  const lttb = transform({ size: 10 }, elements);
  // FIXME
  expect(lttb.length).toBe(12);
  expect(lttb.map(element => element.data[0].index)).toEqual([0, 1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 99]);
});
