import { transform } from '../../src/transforms/view/identifier';

test('identifier', () => {
  const data = [
    { category: 'A', amount: 28, index: 0 },
    { category: 'B', amount: 55, index: 1 },
    { category: 'C', amount: 43, index: 2 },
    { category: 'D', amount: 91, index: 3 },
    { category: 'E', amount: 81, index: 4 },
    { category: 'F', amount: 53, index: 5 },
    { category: 'G', amount: 19, index: 6 },
    { category: 'H', amount: 87, index: 7 }
  ];
  const view = {};

  transform({ as: 'id' }, data, null, view as any);

  expect((data[0] as any).id).toBe(1);
  expect((data[7] as any).id).toBe(8);
  expect(view[':vGrammar_identifier:']).toBe(8);
});
