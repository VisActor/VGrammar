import { UniqueList } from '../../src/util/unique-list';

test('UniqueList', () => {
  const uList = new UniqueList((entry: any) => entry.id);

  uList.add({ id: 1 });
  uList.add({ id: 2 });
  uList.add({ id: 3 });
  uList.add({ id: 2, content: 'new' });

  expect(uList.length).toBe(3);

  expect(uList.filter(u => u.id > 2).length).toBe(1);
});
