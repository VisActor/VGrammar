import { builtInAnimations } from '../graph/animation/animation';
import type { IElement, IGlyphElement, TypeAnimation } from '../types';

const animations: { [type: string]: TypeAnimation<IGlyphElement> | TypeAnimation<IElement> } = {
  ...builtInAnimations
};

export const getAnimations = () => animations;

export const getAnimationType = (animationType: string) => {
  return animations[animationType];
};

export const registerAnimationType = (
  animationType: string,
  animation: TypeAnimation<IGlyphElement> | TypeAnimation<IElement>
): void => {
  animations[animationType] = animation;
};

export const unregisterAnimationType = (animationType: string): void => {
  delete animations[animationType];
};

export const unregisterAllAnimations = () => {
  Object.keys(animations).forEach(unregisterAnimationType);
  // Object.assign(animations, builtInAnimations);
};
