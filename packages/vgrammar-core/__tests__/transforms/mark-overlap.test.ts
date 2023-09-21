import { transform } from '../../src/transforms/mark/mark-overlap';
import { createSimpleElement } from '../util';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();

test('mark overlap x', () => {
  const elementA = createSimpleElement('symbol');
  const elementB = createSimpleElement('symbol');
  elementA.initGraphicItem();
  elementB.initGraphicItem();
  elementA.setGraphicAttributes({ x: 0, y: 0, size: 20 });
  elementB.setGraphicAttributes({ x: 40, y: 0, size: 20 });

  transform({ direction: 1, delta: 10 }, [elementA, elementB]);
  expect(elementB.getGraphicAttribute('visible')).toBe(true);

  transform({ direction: 1, delta: 60 }, [elementA, elementB]);
  expect(elementB.getGraphicAttribute('visible')).toBe(false);
});
