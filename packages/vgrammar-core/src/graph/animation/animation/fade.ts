import type { IElement } from '../../../types';
import type { IAnimationParameters, TypeAnimation } from '../../../types/animate';

export const fadeIn: TypeAnimation<IElement> = (
  element: IElement,
  options: any,
  animationParameters: IAnimationParameters
) => {
  const finalAttrs = element.getFinalGraphicAttributes();

  return {
    from: {
      opacity: 0,
      fillOpacity: 0,
      strokeOpacity: 0
    },
    to: {
      opacity: finalAttrs.opacity ?? 1,
      fillOpacity: finalAttrs.fillOpacity ?? 1,
      strokeOpacity: finalAttrs.strokeOpacity ?? 1
    }
  };
};

export const fadeOut: TypeAnimation<IElement> = (
  element: IElement,
  options: any,
  animationParameters: IAnimationParameters
) => {
  return {
    from: {
      opacity: element.getGraphicAttribute('opacity', true) ?? 1,
      fillOpacity: element.getGraphicAttribute('fillOpacity', true) ?? 1,
      strokeOpacity: element.getGraphicAttribute('strokeOpacity', true) ?? 1
    },
    to: {
      opacity: 0,
      fillOpacity: 0,
      strokeOpacity: 0
    }
  };
};
