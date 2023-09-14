import { Data } from '../../src/view/data';
import { getMockedView, registerDefaultTransforms } from '../util';

registerDefaultTransforms();

const view = getMockedView();

test('Data maintains datums', async function () {
  const data = new Data(view as any).values([
    { key: 0, value: 123 },
    { key: 1, value: 233 }
  ]);
  await data.run();
  expect(data.output().length).toEqual(2);
  data.transform([
    {
      type: 'filter',
      callback: (datum: any) => {
        return datum.value > 200;
      },
      dependency: 'filterSignal'
    } as any
  ]);

  await data.run();
  expect(data.output().length).toEqual(1);
});

test('Data parse spec and collect dependencies', function () {
  const data = new Data(view as any);

  const spec0 = {
    id: 'table',
    values: [
      { category: 'A', amount: 68, index: 0 },
      { category: 'B', amount: 55, index: 1 },
      { category: 'C', amount: 43, index: 2 },
      { category: 'D', amount: 91, index: 3 },
      { category: 'E', amount: 81, index: 4 },
      { category: 'F', amount: 53, index: 5 },
      { category: 'G', amount: 19, index: 6 },
      { category: 'H', amount: 87, index: 7 }
    ],
    transform: [
      {
        type: 'filter',
        callback: (datum: any, params: any) => {
          return datum.index >= params.filterSignal;
        },
        dependency: 'filterSignal'
      }
    ]
  };
  data.parse(spec0 as any);
  const references0 = [] as any[];
  data.references.forEach((count, reference) => references0.push({ count, reference }));
  expect(data.references.size).toEqual(1);
  expect(references0[0].count).toEqual(1);
  expect(references0[0].reference.id()).toEqual('filterSignal');
  expect(data.transforms.length).toEqual(1);

  const spec1 = {
    id: 'table',
    values: [
      { category: 'A', amount: 68, index: 0 },
      { category: 'B', amount: 55, index: 1 },
      { category: 'C', amount: 43, index: 2 }
    ]
  };
  data.parse(spec1 as any);
  expect(data.references.size).toEqual(0);
  expect(data.transforms.length).toEqual(0);
});

test('Data sets configs by api', function () {
  const data = new Data(view as any);

  data
    .values([
      { key: 0, value: 123 },
      { key: 1, value: 233 }
    ])
    .transform([
      {
        type: 'filter',
        callback: (datum: any) => {
          return true;
        },
        dependency: 'filterSignal'
      } as any
    ]);
  const references0 = [] as any[];
  data.references.forEach((count, reference) => references0.push({ count, reference }));
  expect(data.references.size).toEqual(1);
  expect(references0[0].count).toEqual(1);
  expect(references0[0].reference.id()).toEqual('filterSignal');
  expect(data.transforms.length).toEqual(1);
});
