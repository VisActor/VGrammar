import { registerGrammar, registerTransform } from '@visactor/vgrammar';
export { projection, projectionProperties, getProjectionPath } from './projections';
import { Projection } from './projection';
import { transform as geoPathTransform } from './geo-path';

export const registerProjection = () => {
  registerGrammar('projection', Projection, 'projections');
};

export { Projection };

export const registerGeoTransforms = () => {
  registerTransform(
    'geoPath',
    {
      transform: geoPathTransform,
      markPhase: 'beforeJoin'
    },
    true
  );
};

export * from './interface';
