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
  expect(elementB.getGraphicAttribute('visible')).toBeUndefined();

  transform({ direction: 1, delta: 60 }, [elementA, elementB]);
  expect(elementB.getGraphicAttribute('visible')).toBe(false);
});

test('mark overlap x of initial hidden points', () => {
  const elements = new Array(10).fill(0).map((entry, index) => {
    const el = createSimpleElement('symbol');
    el.initGraphicItem();
    el.setGraphicAttributes({ x: index * 40, y: 0, size: 20 });

    if (index < 5) {
      el.setGraphicAttribute('visible', false);
    } else {
      el.setGraphicAttribute('visible', true);
    }

    return el;
  });

  transform({ direction: 1, delta: 10 }, elements);
  expect(elements[0].getGraphicAttribute('visible')).toBeFalsy();
  expect(elements[1].getGraphicAttribute('visible')).toBeFalsy();
  expect(elements[2].getGraphicAttribute('visible')).toBeFalsy();
  expect(elements[3].getGraphicAttribute('visible')).toBeFalsy();
  expect(elements[4].getGraphicAttribute('visible')).toBeFalsy();
  expect(elements[5].getGraphicAttribute('visible')).toBeTruthy();
  expect(elements[6].getGraphicAttribute('visible')).toBeTruthy();
  expect(elements[7].getGraphicAttribute('visible')).toBeTruthy();
  expect(elements[8].getGraphicAttribute('visible')).toBeTruthy();
  expect(elements[9].getGraphicAttribute('visible')).toBeTruthy();

  transform({ direction: 1, delta: 60 }, elements);
  expect(elements[0].getGraphicAttribute('visible')).toBeFalsy();
  expect(elements[1].getGraphicAttribute('visible')).toBeFalsy();
  expect(elements[2].getGraphicAttribute('visible')).toBeFalsy();
  expect(elements[3].getGraphicAttribute('visible')).toBeFalsy();
  expect(elements[4].getGraphicAttribute('visible')).toBeFalsy();
  expect(elements[5].getGraphicAttribute('visible')).toBeTruthy();
  expect(elements[6].getGraphicAttribute('visible')).toBeFalsy();
  expect(elements[7].getGraphicAttribute('visible')).toBeTruthy();
  expect(elements[8].getGraphicAttribute('visible')).toBeFalsy();
  expect(elements[9].getGraphicAttribute('visible')).toBeTruthy();
});
