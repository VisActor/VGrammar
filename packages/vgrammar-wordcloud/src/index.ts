import { Factory } from '@visactor/vgrammar';

import { transform } from './wordcloud';

export const registerWordCloudTransforms = () => {
  Factory.registerTransform(
    'wordcloud',
    {
      transform,
      markPhase: 'beforeJoin'
    },
    true
  );
};
