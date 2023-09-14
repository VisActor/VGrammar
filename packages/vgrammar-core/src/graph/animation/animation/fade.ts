import type { IElement } from '../../../types';
import type { IAnimationParameters, TypeAnimation } from '../../../types/animate';

export const fadeIn: TypeAnimation<IElement> = (
  element: IElement,
  options: any,
  animationParameters: IAnimationParameters
) => {
  return {
    from: {
      opacity: 0,
      fillOpacity: 0,
      strokeOpacity: 0
    },
    to: {
      opacity: element.getGraphicAttribute('opacity', false) ?? 1,
      fillOpacity: element.getGraphicAttribute('fillOpacity', false) ?? 1,
      strokeOpacity: element.getGraphicAttribute('strokeOpacity', false) ?? 1
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
