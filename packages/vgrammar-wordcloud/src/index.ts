import { Factory } from '@visactor/vgrammar-core';

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

export { transform };

export { shapes } from '@visactor/vgrammar-util';
