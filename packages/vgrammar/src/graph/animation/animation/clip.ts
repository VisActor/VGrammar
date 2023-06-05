import type { IElement } from '../../../types';
import type { IAnimationParameters, IClipAnimationOptions, TypeAnimation } from '../../../types/animate';

export const clipIn: TypeAnimation<IElement> = (
  element: IElement,
  options: IClipAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const clipDimension = element.getGraphicAttribute('clipRangeByDimension', false);
  const clipRange = element.getGraphicAttribute('clipRange', false) ?? 1;
  if (options?.clipDimension) {
    return {
      from: { clipRange: 0, clipRangeByDimension: options.clipDimension },
      to: { clipRange: clipRange, clipRangeByDimension: clipDimension }
    };
  }
  return {
    from: { clipRange: 0 },
    to: { clipRange: clipRange }
  };
};

export const clipOut: TypeAnimation<IElement> = (
  element: IElement,
  options: IClipAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const clipDimension = element.getGraphicAttribute('clipRangeByDimension', true);
  const clipRange = element.getGraphicAttribute('clipRange', true) ?? 1;
  if (options?.clipDimension) {
    return {
      from: { clipRange: clipRange, clipRangeByDimension: options.clipDimension },
      to: { clipRange: 0, clipRangeByDimension: clipDimension }
    };
  }
  return {
    from: { clipRange: clipRange },
    to: { clipRange: 0 }
  };
};
