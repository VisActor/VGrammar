import { Factory } from '@visactor/vgrammar-core';
import { registerWordCloudTransforms } from '../src';
import { initBrowserEnv } from '@visactor/vgrammar-core';

initBrowserEnv();

test('transform of wordcloud', () => {
  const tranform = Factory.getTransform('wordcloud');

  expect(tranform).toBeUndefined();
  registerWordCloudTransforms();
  expect(Factory.getTransform('wordcloud')).not.toBeUndefined();
});
