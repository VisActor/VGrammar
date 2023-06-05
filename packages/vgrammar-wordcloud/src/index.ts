import { registerTransform } from '@visactor/vgrammar';

import { transform } from './wordcloud';

export const registerWordCloudTransforms = () => {
  registerTransform(
    'wordcloud',
    {
      transform,
      markPhase: 'beforeJoin'
    },
    true
  );
};
