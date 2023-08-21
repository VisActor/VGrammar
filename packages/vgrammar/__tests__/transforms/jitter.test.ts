import { registerBasicTransforms } from '../../src';
import type { IMark } from '../../src/types';
import { Data } from '../../src/view/data';
import { Mark } from '../../src/view/mark';
import { getMockedView } from '../util';

test('jitter transform', () => {
  registerBasicTransforms();
  const mockView = getMockedView();
  const mark = new (Mark as any)(mockView, 'rect') as IMark;

  mark.encodeState('update', {
    x: 10,
    y: (datum: any) => datum.y
  });
  mark.transform([
    {
      type: 'jitter',
      bandWidth: 10,
      widthRatio: 0.5,
      random: (index: number, total: number) => index / total
    }
  ]);
  const data = new (Data as any)(mockView, [
    { x: 1, y: 10, key: '0' },
    { x: 2, y: 20, key: '1' },
    { x: 1, y: 10, key: '2' },
    { x: 2, y: 20, key: '3' },
    { x: 1, y: 10, key: '4' },
    { x: 2, y: 20, key: '5' },
    { x: 1, y: 10, key: '6' },
    { x: 2, y: 20, key: '7' },
    { x: 1, y: 10, key: '8' },
    { x: 2, y: 20, key: '9' }
  ]).id('testData');

  mark.join(data, 'key');

  (data as any).runSync();
  (mark as any).runSync();

  expect(mark.elements[0].getGraphicItem().attribute).toMatchObject({ x: 5, y: 10 });
  expect(mark.elements[1].getGraphicItem().attribute).toMatchObject({ x: 6, y: 11 });
  expect(mark.elements[2].getGraphicItem().attribute).toMatchObject({ x: 7, y: 12 });
  expect(mark.elements[3].getGraphicItem().attribute).toMatchObject({ x: 8, y: 13 });
  expect(mark.elements[4].getGraphicItem().attribute).toMatchObject({ x: 9, y: 14 });
  expect(mark.elements[5].getGraphicItem().attribute).toMatchObject({ x: 10, y: 15 });
  expect(mark.elements[6].getGraphicItem().attribute).toMatchObject({ x: 11, y: 16 });
  expect(mark.elements[7].getGraphicItem().attribute).toMatchObject({ x: 12, y: 17 });
  expect(mark.elements[8].getGraphicItem().attribute).toMatchObject({ x: 13, y: 18 });
  expect(mark.elements[9].getGraphicItem().attribute).toMatchObject({ x: 14, y: 19 });
});
