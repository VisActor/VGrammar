import { isNumberClose, isValidNumber } from '@visactor/vutils';
import type { IAnimationParameters, IRotateAnimationOptions, TypeAnimation, IElement } from '../../../types';

export const rotateIn: TypeAnimation<IElement> = (
  element: IElement,
  options: IRotateAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const finalAngle = element.getFinalGraphicAttributes()?.angle ?? 0;

  let angle = 0;
  if (isNumberClose(finalAngle / (Math.PI * 2), 0)) {
    angle = Math.round(finalAngle / (Math.PI * 2)) * Math.PI * 2;
  } else if (isValidNumber(options?.angle)) {
    angle = options.angle;
  } else if (options?.orient === 'anticlockwise') {
    angle = Math.ceil(finalAngle / (Math.PI * 2)) * Math.PI * 2;
  } else {
    angle = Math.floor(finalAngle / (Math.PI * 2)) * Math.PI * 2;
  }
  return {
    from: { angle },
    to: { angle: finalAngle }
  };
};

export const rotateOut: TypeAnimation<IElement> = (
  element: IElement,
  options: IRotateAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const finalAngle = element.getGraphicAttribute('angle', true) ?? 0;
  let angle = 0;
  if (isNumberClose(finalAngle / (Math.PI * 2), 0)) {
    angle = Math.round(finalAngle / (Math.PI * 2)) * Math.PI * 2;
  } else if (isValidNumber(options?.angle)) {
    angle = options.angle;
  } else if (options?.orient === 'anticlockwise') {
    angle = Math.ceil(finalAngle / (Math.PI * 2)) * Math.PI * 2;
  } else {
    angle = Math.floor(finalAngle / (Math.PI * 2)) * Math.PI * 2;
  }
  return {
    from: { angle: finalAngle },
    to: { angle }
  };
};
