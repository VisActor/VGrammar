import type { IGraphic } from '@visactor/vrender';

const components: Record<string, { creator: (attrs: any, mode?: '2d' | '3d') => IGraphic }> = {};

export const getComponent = (type: string) => {
  return components[type];
};

export const getComponents = () => components;

export const registerComponent = (type: string, creator: (attrs: any, mode?: '2d' | '3d') => IGraphic) => {
  components[type] = {
    creator
  };
};

export const unregisterComponent = (type: string) => {
  delete components[type];
};

export const unregisterAllComponents = () => {
  Object.keys(components).forEach(unregisterComponent);
};
