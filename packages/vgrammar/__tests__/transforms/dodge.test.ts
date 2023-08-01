import { BandScale } from '@visactor/vscale';
import { transform } from '../../src/transforms/mark/dodge';
import { createSimpleElement } from '../util';

test('dodge rect', () => {
  const elementA = createSimpleElement('rect');
  const elementB = createSimpleElement('rect');
  const scaleX = new BandScale();
  scaleX.domain(['A', 'B']);
  scaleX.range([0, 100]);
  const scaleY = new BandScale();
  scaleY.domain(['A', 'B']);
  scaleY.range([0, 100]);
  elementA.mark.getScalesByChannel = () => {
    return { x: scaleX, y: scaleY };
  };
  elementB.mark.getScalesByChannel = () => {
    return { x: scaleX, y: scaleY };
  };
  elementA.data = [{ category: 'A' }];
  elementB.data = [{ category: 'B' }];
  elementA.items = [{ nextAttrs: { x: 0, width: 20, y: 0, height: 20 } } as any];
  elementB.items = [{ nextAttrs: { x: 0, width: 20, y: 0, height: 20 } } as any];

  transform({ innerGap: 10, dodgeChannel: 'x', dodgeBy: 'category' }, [elementA, elementB]);

  expect(elementA.getItemAttribute('x')).toBe(-10);
  expect(elementB.getItemAttribute('x')).toBe(15);

  transform({ innerGap: 10, dodgeChannel: 'y', dodgeBy: 'category' }, [elementA, elementB]);

  expect(elementA.getItemAttribute('y')).toBe(-10);
  expect(elementB.getItemAttribute('y')).toBe(15);
});

test('dodge symbol', () => {
  const elementA = createSimpleElement('symbol');
  const elementB = createSimpleElement('symbol');
  const scaleX = new BandScale();
  scaleX.domain(['A', 'B']);
  scaleX.range([0, 100]);
  const scaleY = new BandScale();
  scaleY.domain(['A', 'B']);
  scaleY.range([0, 100]);
  elementA.mark.getScalesByChannel = () => {
    return { x: scaleX, y: scaleY };
  };
  elementB.mark.getScalesByChannel = () => {
    return { x: scaleX, y: scaleY };
  };
  elementA.data = [{ category: 'A' }];
  elementB.data = [{ category: 'B' }];
  elementA.items = [{ nextAttrs: { x: 0, y: 0 } } as any];
  elementB.items = [{ nextAttrs: { x: 0, y: 0 } } as any];

  transform({ innerGap: 10, dodgeChannel: 'x', dodgeBy: 'category' }, [elementA, elementB]);

  expect(elementA.getItemAttribute('x')).toBe(12.5);
  expect(elementB.getItemAttribute('x')).toBe(37.5);

  transform({ innerGap: 10, dodgeChannel: 'y', dodgeBy: 'category' }, [elementA, elementB]);

  expect(elementA.getItemAttribute('y')).toBe(12.5);
  expect(elementB.getItemAttribute('y')).toBe(37.5);
});
