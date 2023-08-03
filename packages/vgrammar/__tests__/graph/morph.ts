import { Morph } from '../../src/graph/animation/morph';

test('morph', function () {
  const morph = new Morph();

  const grammarResult = morph.diffGrammar(
    [{ id: () => 'a' }, { id: () => 'b' }, { id: () => 'c' }] as any,
    [{ id: () => 'a' }, { id: () => 'd' }, { id: () => 'e' }] as any
  );
  expect(grammarResult.enter.length).toBe(2);
  expect(grammarResult.update.length).toBe(1);
  expect(grammarResult.exit.length).toBe(2);

  const markResult = morph.diffMark(
    [
      { id: () => 'a', markType: 'rect', getMorphConfig: () => ({}) },
      { id: () => 'b', markType: 'group', getMorphConfig: () => ({}) },
      { id: () => 'c', markType: 'group', getMorphConfig: () => ({ morphKey: 'key' }) }
    ] as any,
    [
      { id: () => 'a', markType: 'rect', getMorphConfig: () => ({}) },
      { id: () => 'b', markType: 'group', getMorphConfig: () => ({}) },
      { id: () => 'd', markType: 'group', getMorphConfig: () => ({ morphKey: 'key' }) }
    ] as any,
    { morph: false }
  );
  expect(markResult.enter.length).toBe(3);
  expect(markResult.update.length).toBe(0);
  expect(markResult.exit.length).toBe(3);

  const allMarkResult = morph.diffMark(
    [
      { id: () => 'a', markType: 'rect', getMorphConfig: () => ({}) },
      { id: () => 'b', markType: 'group', getMorphConfig: () => ({}) },
      { id: () => 'c', markType: 'line', getMorphConfig: () => ({ morphKey: 'key' }) }
    ] as any,
    [
      { id: () => 'a', markType: 'rect', getMorphConfig: () => ({}) },
      { id: () => 'b', markType: 'group', getMorphConfig: () => ({}) },
      { id: () => 'd', markType: 'line', getMorphConfig: () => ({ morphKey: 'key' }) }
    ] as any,
    { morph: true, morphAll: true }
  );
  expect(allMarkResult.enter.length).toBe(1);
  expect(allMarkResult.update.length).toBe(2);
  expect(allMarkResult.exit.length).toBe(1);
});
