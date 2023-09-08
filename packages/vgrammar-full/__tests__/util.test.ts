import { mergeGrammarSpecs } from '../src/util';

test('mergeGrammarSpecs() of scales', () => {
  const a = [{ id: 'a' }, { id: 'b' }];
  const b = [{ id: 'a' }, { id: 'b' }];
  const c = [{ id: 'c' }];

  expect(mergeGrammarSpecs(a, b).length).toBe(2);
  expect(mergeGrammarSpecs(a, c).length).toBe(3);
});
