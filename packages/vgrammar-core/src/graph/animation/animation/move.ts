import { isFunction, isValidNumber } from '@visactor/vutils';
import type { IElement, IMoveAnimationOptions, IAnimationParameters, TypeAnimation } from '../../../types';

// When user did not provide proper x/y value, move animation will never work properly,
//  due to that, default x/y value won't be set.

export const moveIn: TypeAnimation<IElement> = (
  element: IElement,
  options: IMoveAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const offset = options?.offset ?? 0;
  let changedX = 0;
  let changedY = 0;

  if (options?.orient === 'negative') {
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
  const point = isFunction(options?.point)
    ? options.point.call(null, element.getDatum(), element, animationParameters)
    : options?.point;
  const fromX = isValidNumber(point?.x) ? point.x : changedX;
  const fromY = isValidNumber(point?.y) ? point.y : changedY;
  switch (options?.direction) {
    case 'x':
      return {
        from: { x: fromX },
        to: { x: element.getGraphicAttribute('x', false) }
      };
    case 'y':
      return {
        from: { y: fromY },
        to: { y: element.getGraphicAttribute('y', false) }
      };
    case 'xy':
    default:
      return {
        from: { x: fromX, y: fromY },
        to: {
          x: element.getGraphicAttribute('x', false),
          y: element.getGraphicAttribute('y', false)
        }
      };
  }
};

export const moveOut: TypeAnimation<IElement> = (
  element: IElement,
  options: IMoveAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const offset = options?.offset ?? 0;
  // consider the offset of group
  const groupBounds = animationParameters.group ? animationParameters.group.getBounds() : null;
  const groupWidth = groupBounds?.width() ?? animationParameters.width;
  const groupHeight = groupBounds?.height() ?? animationParameters.height;
  const changedX = (options?.orient === 'negative' ? groupWidth : 0) + offset;
  const changedY = (options?.orient === 'negative' ? groupHeight : 0) + offset;
  const point = isFunction(options?.point)
    ? options.point.call(null, element.getDatum(), element, animationParameters)
    : options?.point;
  const fromX = isValidNumber(point?.x) ? point.x : changedX;
  const fromY = isValidNumber(point?.y) ? point.y : changedY;

  switch (options?.direction) {
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
