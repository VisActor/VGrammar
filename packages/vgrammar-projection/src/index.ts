import { registerGrammar } from '@visactor/vgrammar';

export { projection, projectionProperties, getProjectionPath } from './projections';
import { Projection } from './projection';

export const registerProjection = () => {
  registerGrammar('projection', Projection, 'projections');
};

export { Projection };
