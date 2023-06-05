import { registerTransform } from '@visactor/vgrammar';
import { transform as treemapTransform } from './treemap/transform';
import { transform as sunburtTransform } from './sunburst/transform';
import { transform as circlePackingTransform } from './circle-packing/transform';
import { transform as treeTransform } from './tree/transform';

export { TreemapLayout } from './treemap/layout';
export { CirclePackingLayout } from './circle-packing/layout';
export { SunburstLayout } from './sunburst/layout';
export { TreeLayout } from './tree/layout';

export * from './interface';
export * from './format';
export * from './utils';

export const registerTreemapTransforms = () => {
  registerTransform(
    'treemap',
    {
      transform: treemapTransform,
      markPhase: 'beforeJoin'
    },
    true
  );
};

export const registerSunburstTransforms = () => {
  registerTransform(
    'sunburst',
    {
      transform: sunburtTransform,
      markPhase: 'beforeJoin'
    },
    true
  );
};

export const registerCirclePackingTransforms = () => {
  registerTransform(
    'circlePacking',
    {
      transform: circlePackingTransform,
      markPhase: 'beforeJoin'
    },
    true
  );
};

export const registerTreeTransforms = () => {
  registerTransform(
    'tree',
    {
      transform: treeTransform,
      markPhase: 'beforeJoin'
    },
    true
  );
};

export const registerAllHierarchyTransforms = () => {
  registerTreemapTransforms();
  registerSunburstTransforms();
  registerCirclePackingTransforms();
  registerTreeTransforms();
};
