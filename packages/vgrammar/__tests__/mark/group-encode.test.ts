import type { IMark } from '../../src';
import { Data } from '../../src/view/data';
import { Mark } from '../../src/view/mark';
import { getMockedView } from '../util';

test('group encode of mark', () => {
  const mockView = getMockedView();
  const mark = new (Mark as any)(mockView, 'rect') as IMark;

  mark.encodeState('group', {
    fill: 'red',
    stroke: 'black'
  });

  mark.encodeState('update', {
    x: (datum: any) => datum.x,
    y: (datum: any) => datum.y
  });
  const data = new (Data as any)(mockView, [
    { x: 1, y: 10, key: '0' },
    { x: 2, y: 20, key: '1' }
  ]).id('testData');

  mark.join(data, 'key');

  (data as any).runSync();
  (mark as any).runSync();

  expect(mark.elements.length).toBe(2);
  expect(mark.elements[0].getGraphicAttribute('fill')).toEqual('red');
  expect(mark.elements[0].getGraphicAttribute('stroke')).toEqual('black');
  expect(mark.elements[0].getGraphicAttribute('x')).toEqual(1);
  expect(mark.elements[0].getGraphicAttribute('y')).toEqual(10);
});
