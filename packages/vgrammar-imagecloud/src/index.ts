import { Factory } from '@visactor/vgrammar-core';

import { transform } from './imagecloud';

export const registerImageCloudTransforms = () => {
  Factory.registerTransform(
    'imagecloud',
    {
      transform,
      markPhase: 'beforeJoin'
    },
    true
  );
};
