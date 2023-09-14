import { isNil } from '@visactor/vutils';
import { Differ, groupData } from '../../src/graph/mark/differ';

const data0 = [
  { index: 0, value: 13, category: 'A' },
  { index: 1, value: 63, category: 'A' },
  { index: 2, value: 12, category: 'A' },
  { index: 3, value: 76, category: 'B' },
  { index: 4, value: 67, category: 'B' },
  { index: 5, value: 93, category: 'B' },
  { index: 6, value: 12, category: 'C' },
  { index: 7, value: 17, category: 'C' },
  { index: 8, value: 25, category: 'C' }
];

const data1 = [
  // { index: 0, value: 13, category: 'A' },
  // { index: 1, value: 63, category: 'A' },
  // { index: 2, value: 12, category: 'A' },
  { index: 3, value: 76, category: 'B' },
  { index: 4, value: 67, category: 'B' },
  // { index: 5, value: 93, category: 'B' },
  { index: 6, value: 12, category: 'C' },
  { index: 7, value: 17, category: 'C' },
  // { index: 8, value: 25, category: 'C' },
  { index: 9, value: 29, category: 'D' },
  { index: 10, value: 79, category: 'D' }
];

test('Differ handle data grouping and sorting', function () {
  const differ0 = new Differ(data0, 'index', (datum0: any, datum1: any) => datum0.value - datum1.value);
  expect((differ0 as any).prevData.keys).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  expect((differ0 as any).prevData.data.size).toEqual(9);
  expect((differ0 as any).prevData.data.get(0)[0].value).toEqual(13);

  const differ1 = new Differ(data0, 'category', (datum0: any, datum1: any) => datum0.value - datum1.value);
  expect((differ1 as any).prevData.keys).toEqual(['A', 'B', 'C']);
  expect((differ1 as any).prevData.data.size).toEqual(3);
  expect((differ1 as any).prevData.data.get('A')[0].value).toEqual(12);
});

test('Differ handle data diffing', function () {
  let count = { exit: 0, enter: 0, update: 0 };
  const diffHandler = (key: symbol | string, data: any, prevData: any) => {
    if (isNil(data)) {
      // exit
      count.exit += 1;
    } else if (isNil(prevData)) {
      // enter
      count.enter += 1;
    } else {
      // update
      count.update += 1;
    }
  };

  // diff by index field
  const differ0 = new Differ(data0, 'index', (datum0: any, datum1: any) => datum0.value - datum1.value);
  count = { exit: 0, enter: 0, update: 0 };
  differ0.setCallback(diffHandler);
  differ0.setCurrentData(groupData(data1, 'index', (datum0: any, datum1: any) => datum0.value - datum1.value));
  differ0.doDiff();
  expect(count.exit).toEqual(5);
  expect(count.enter).toEqual(2);
  expect(count.update).toEqual(4);

  const differ1 = new Differ(data1, 'index', (datum0: any, datum1: any) => datum0.value - datum1.value);
  count = { exit: 0, enter: 0, update: 0 };
  differ1.setCallback(diffHandler);
  differ1.setCurrentData(groupData(data0, 'index', (datum0: any, datum1: any) => datum0.value - datum1.value));
  differ1.doDiff();
  expect(count.exit).toEqual(2);
  expect(count.enter).toEqual(5);
  expect(count.update).toEqual(4);

  // diff by category field
  const differ2 = new Differ(data0, 'category', (datum0: any, datum1: any) => datum0.value - datum1.value);
  count = { exit: 0, enter: 0, update: 0 };
  differ2.setCallback(diffHandler);
  differ2.setCurrentData(groupData(data1, 'category', (datum0: any, datum1: any) => datum0.value - datum1.value));
  differ2.doDiff();
  expect(count.exit).toEqual(1);
  expect(count.enter).toEqual(1);
  expect(count.update).toEqual(2);

  const differ3 = new Differ(data1, 'category', (datum0: any, datum1: any) => datum0.value - datum1.value);
  count = { exit: 0, enter: 0, update: 0 };
  differ3.setCallback(diffHandler);
  differ3.setCurrentData(groupData(data0, 'category', (datum0: any, datum1: any) => datum0.value - datum1.value));
  differ3.doDiff();
  expect(count.exit).toEqual(1);
  expect(count.enter).toEqual(1);
  expect(count.update).toEqual(2);
});

test('Differ update after diffing', function () {
  const differ0 = new Differ(data0, 'index', (datum0: any, datum1: any) => datum0.value - datum1.value);
  differ0.setCurrentData(groupData(data1, 'index', (datum0: any, datum1: any) => datum0.value - datum1.value));
  differ0.doDiff();
  expect((differ0 as any).prevData.keys).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  expect((differ0 as any).currentData.keys).toEqual([3, 4, 6, 7, 9, 10]);

  differ0.updateToCurrent();
  expect((differ0 as any).prevData.keys).toEqual([3, 4, 6, 7, 9, 10]);
  expect((differ0 as any).currentData).toEqual(null);
});
