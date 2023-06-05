import { registerTransform } from '@visactor/vgrammar';
import { transform } from './transform';

export { SankeyLayout } from './layout';

export * from './interface';
export * from './format';

export const registerSankeyTransforms = () => {
  registerTransform(
    'sankey',
    {
      transform,
      markPhase: 'beforeJoin'
    },
    true
  );
};
