import { BandScale } from '@visactor/vscale';
import { symmetry } from '../../src/transforms/mark/symmetry';
import { createSimpleElement } from '../util';

test('symmetry rect', () => {
  const elementA = createSimpleElement('rect');
  const elementB = createSimpleElement('rect');

  elementA.data = [{ category: 'A' }];
  elementB.data = [{ category: 'B' }];
  elementA.items = [{ nextAttrs: { x: 0, width: 20, y: 0, y1: 20 } } as any];
  elementB.items = [{ nextAttrs: { x: 0, width: 20, y: 0, y1: 100 } } as any];

  symmetry({}, [elementA, elementB]);

  expect(elementA.getItemAttribute('y')).toBe(40);
  expect(elementA.getItemAttribute('y1')).toBe(60);
  expect(elementB.getItemAttribute('y')).toBe(0);
  expect(elementB.getItemAttribute('y1')).toBe(100);
});

test('symmetry rect and align = "min"', () => {
  const elementA = createSimpleElement('rect');
  const elementB = createSimpleElement('rect');

  elementA.data = [{ category: 'A' }];
  elementB.data = [{ category: 'B' }];
  elementA.items = [{ nextAttrs: { x: 0, width: 20, y: 60, y1: 300 } } as any];
  elementB.items = [{ nextAttrs: { x: 0, width: 20, y: 100, y1: 300 } } as any];

  symmetry({ align: 'min' }, [elementA, elementB]);

  expect(elementA.getItemAttribute('y')).toBe(60);
  expect(elementA.getItemAttribute('y1')).toBe(300);
  expect(elementB.getItemAttribute('y')).toBe(80);
  expect(elementB.getItemAttribute('y1')).toBe(280);
});

test('symmetry rect and align = "min", channel="x"', () => {
  const elementA = createSimpleElement('rect');
  const elementB = createSimpleElement('rect');

  elementA.data = [{ category: 'A' }];
  elementB.data = [{ category: 'B' }];
  elementA.items = [{ nextAttrs: { x: 100, x1: 300, y: 60, y1: 300 } } as any];
  elementB.items = [{ nextAttrs: { x: 120, x1: 300, y: 100, y1: 300 } } as any];

  symmetry({ align: 'min', channel: 'x' }, [elementA, elementB]);

  expect(elementA.getItemAttribute('x')).toBe(100);
  expect(elementA.getItemAttribute('x1')).toBe(300);
  expect(elementB.getItemAttribute('x')).toBe(110);
  expect(elementB.getItemAttribute('x1')).toBe(290);
});
