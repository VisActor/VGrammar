import type { IElement } from '../../../types';
import type { IAnimationParameters, TypeAnimation } from '../../../types/animate';

export const fadeIn: TypeAnimation<IElement> = (
  element: IElement,
  options: any,
  animationParameters: IAnimationParameters
) => {
  const attrs = element.getFinalAnimationAttributes() ?? {};

  return {
    from: {
      opacity: 0,
      fillOpacity: 0,
      strokeOpacity: 0
    },
    to: {
      opacity: attrs.opacity ?? 1,
      fillOpacity: attrs.fillOpacity ?? 1,
      strokeOpacity: attrs.strokeOpacity ?? 1
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
