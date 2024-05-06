import { Factory } from '@visactor/vgrammar-core';
import { registerVennTransforms } from '../src';
import { initBrowserEnv } from '@visactor/vgrammar-core';

initBrowserEnv();

test('transform of wordcloud', () => {
  const tranform = Factory.getTransform('venn');

  expect(tranform).toBeUndefined();
  registerVennTransforms();
  expect(Factory.getTransform('venn')).not.toBeUndefined();
  expect(Factory.getTransform('vennMark')).not.toBeUndefined();
});
