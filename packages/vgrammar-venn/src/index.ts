import { Factory } from '@visactor/vgrammar-core';

import { transform, transformMark } from './venn';

export * from './interface';
export * from './constants';
export * from './animation';

export const registerVennTransforms = () => {
  Factory.registerTransform(
    'venn',
    {
      transform,
      markPhase: 'beforeJoin'
    },
    true
  );
  Factory.registerTransform(
    'vennMark',
    {
      transform: transformMark,
      markPhase: 'beforeJoin'
    },
    true
  );
};
