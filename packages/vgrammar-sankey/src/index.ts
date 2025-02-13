import { Factory } from '@visactor/vgrammar-core';
import { transform } from './transform';
import { SankeyHighlight } from './sankey-highlight';

export { SankeyLayout } from './layout';
export { transform };

export * from './interface';
export * from './format';

export const registerSankeyTransforms = () => {
  Factory.registerTransform(
    'sankey',
    {
      transform,
      markPhase: 'beforeJoin'
    },
    true
  );
};

export const registerSankeyHighlight = () => {
  Factory.registerInteraction(SankeyHighlight.type, SankeyHighlight);
};
