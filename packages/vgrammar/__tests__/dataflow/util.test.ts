import { Heap } from '../../src/util/grammar-heap';
import { UniqueList } from '../../src/util/unique-list';

test('Heap functions', function () {
  const heap = new Heap((a: any, b: any) => a.qrank - b.qrank);

  const nodes = [3, 1, 2, 9, 4, 8, 6, 7, 0, 5].map(qrank => ({ qrank }));

  // push nodes
  nodes.forEach(node => {
    heap.push(node);
    expect(heap.validate()).toBe(true);
  });
  expect(heap.size()).toBe(10);

  // pop nodes
  expect(heap.pop().qrank).toBe(0);
  expect(heap.validate()).toBe(true);
  expect(heap.pop().qrank).toBe(1);
  expect(heap.validate()).toBe(true);
  expect(heap.pop().qrank).toBe(2);
  expect(heap.validate()).toBe(true);
  expect(heap.size()).toBe(7);

  // modify rank & re-push
  nodes[4].qrank = 2;
  heap.push(nodes[4]);
  expect(heap.validate()).toBe(true);
  expect(heap.size()).toBe(7);

  nodes[6].qrank = 10;
  heap.push(nodes[6]);
  expect(heap.validate()).toBe(true);
  expect(heap.size()).toBe(7);
});

test('UniqueList', () => {
  const uList = new UniqueList((entry: any) => entry.id);

  uList.add({ id: 1 });
  uList.add({ id: 2 });
  uList.add({ id: 3 });
  uList.add({ id: 2, content: 'new' });

  expect(uList.length).toBe(3);
});
