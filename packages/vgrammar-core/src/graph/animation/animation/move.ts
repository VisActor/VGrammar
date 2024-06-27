import { isFunction, isValidNumber } from '@visactor/vutils';
import type { IElement, IMoveAnimationOptions, IAnimationParameters, TypeAnimation } from '../../../types';

// When user did not provide proper x/y value, move animation will never work properly,
//  due to that, default x/y value won't be set.

export const moveIn: TypeAnimation<IElement> = (
  element: IElement,
  options: IMoveAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const { offset = 0, orient, direction, point: pointOpt, excludeChannels = [] } = options ?? {};
  let changedX = 0;
  let changedY = 0;

  if (orient === 'negative') {
    // consider the offset of group
    if (animationParameters.group) {
      changedX = (animationParameters as any).groupWidth ?? animationParameters.group.getBounds().width();
      changedY = (animationParameters as any).groupHeight ?? animationParameters.group.getBounds().height();

      (animationParameters as any).groupWidth = changedX;
      (animationParameters as any).groupHeight = changedY;
    } else {
      changedX = animationParameters.width;
      changedY = animationParameters.height;
    }
  }

  changedX += offset;
  changedY += offset;
  const point = isFunction(pointOpt) ? pointOpt.call(null, element.getDatum(), element, animationParameters) : pointOpt;
  const fromX = point && isValidNumber(point.x) ? point.x : changedX;
  const fromY = point && isValidNumber(point.y) ? point.y : changedY;
  const finalAttrsX = excludeChannels.includes('x')
    ? element.getGraphicAttribute('x')
    : element.getFinalAnimationAttribute('x');
  const finalAttrsY = excludeChannels.includes('y')
    ? element.getGraphicAttribute('y')
    : element.getFinalAnimationAttribute('y');

  switch (direction) {
    case 'x':
      return {
        from: { x: fromX },
        to: { x: finalAttrsX }
      };
    case 'y':
      return {
        from: { y: fromY },
        to: { y: finalAttrsY }
      };
    case 'xy':
    default:
      return {
        from: { x: fromX, y: fromY },
        to: {
          x: finalAttrsX,
          y: finalAttrsY
        }
      };
  }
};

export const moveOut: TypeAnimation<IElement> = (
  element: IElement,
  options: IMoveAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const { offset = 0, orient, direction, point: pointOpt } = options ?? {};

  // consider the offset of group
  const groupBounds = animationParameters.group ? animationParameters.group.getBounds() : null;
  const groupWidth = groupBounds?.width() ?? animationParameters.width;
  const groupHeight = groupBounds?.height() ?? animationParameters.height;
  const changedX = (orient === 'negative' ? groupWidth : 0) + offset;
  const changedY = (orient === 'negative' ? groupHeight : 0) + offset;
  const point = isFunction(pointOpt) ? pointOpt.call(null, element.getDatum(), element, animationParameters) : pointOpt;
  const fromX = point && isValidNumber(point.x) ? point.x : changedX;
  const fromY = point && isValidNumber(point.y) ? point.y : changedY;

  switch (direction) {
    case 'x':
      return {
        from: { x: element.getGraphicAttribute('x', true) },
        to: { x: fromX }
      };
    case 'y':
      return {
        from: { y: element.getGraphicAttribute('y', true) },
        to: { y: fromY }
      };
    case 'xy':
    default:
      return {
        from: {
          x: element.getGraphicAttribute('x', true),
          y: element.getGraphicAttribute('y', true)
        },
        to: { x: fromX, y: fromY }
      };
  }
};
