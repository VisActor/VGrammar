import type { ITransform } from '../types/transform';

const transforms: Record<string, ITransform> = {};
const runtimeTransformTypes: string[] = [];

export const getTransform = (type: string) => {
  return transforms[type];
};

export const getAllTransforms = () => transforms;

export const getRuntimeTransformTypes = () => runtimeTransformTypes;

export const registerTransform = (type: string, transform: Omit<ITransform, 'type'>, isBuiltIn?: boolean) => {
  transforms[type] = Object.assign(transform, { type });

  if (!isBuiltIn) {
    runtimeTransformTypes.push(type);
  }
};

export const unregisterTransform = (type: string) => {
  delete transforms[type];
  const index = runtimeTransformTypes.indexOf(type);

  if (index >= 0) {
    runtimeTransformTypes.splice(index, 1);
  }
};

export const unregisterAllTransforms = () => {
  Object.keys(transforms).forEach(unregisterTransform);
};

export const unregisterRuntimeTransforms = () => {
  runtimeTransformTypes.slice().forEach((type: string) => {
    unregisterTransform(type);
  });
};
