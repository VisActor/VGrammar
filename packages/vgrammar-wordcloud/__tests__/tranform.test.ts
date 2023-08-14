import { getTransform } from '@visactor/vgrammar';
import { registerWordCloudTransforms } from '../src';

test('transform of wordcloud', () => {
  const tranform = getTransform('wordcloud');

  expect(tranform).toBeUndefined();
  registerWordCloudTransforms();
  expect(getTransform('wordcloud')).not.toBeUndefined();
});
