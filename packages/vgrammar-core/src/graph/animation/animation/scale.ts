import type { IElement, IScaleAnimationOptions, IAnimationParameters, TypeAnimation } from '../../../types';

// TODO: negative direction, need support from VRender

export const scaleIn: TypeAnimation<IElement> = (
  element: IElement,
  options: IScaleAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const finalAttrs = element.getFinalGraphicAttributes();

  switch (options?.direction) {
    case 'x':
      return {
        from: { scaleX: 0 },
        to: { scaleX: finalAttrs?.scaleX ?? 1 }
      };
    case 'y':
      return {
        from: { scaleY: 0 },
        to: { scaleY: finalAttrs?.scaleY ?? 1 }
      };
    case 'xy':
    default:
      return {
        from: { scaleX: 0, scaleY: 0 },
        to: {
          scaleX: finalAttrs?.scaleX ?? 1,
          scaleY: finalAttrs?.scaleY ?? 1
        }
      };
  }
};

export const scaleOut: TypeAnimation<IElement> = (
  element: IElement,
  options: IScaleAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  switch (options?.direction) {
    case 'x':
      return {
        from: { scaleX: element.getGraphicAttribute('scaleX', true) ?? 1 },
        to: { scaleX: 0 }
      };
    case 'y':
      return {
        from: { scaleY: element.getGraphicAttribute('scaleY', true) ?? 1 },
        to: { scaleY: 0 }
      };
    case 'xy':
    default:
      return {
        from: {
          scaleX: element.getGraphicAttribute('scaleX', true) ?? 1,
          scaleY: element.getGraphicAttribute('scaleY', true) ?? 1
        },
        to: { scaleX: 0, scaleY: 0 }
      };
  }
};
