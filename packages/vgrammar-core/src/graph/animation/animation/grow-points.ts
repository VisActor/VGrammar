import type { IPointLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isValidNumber } from '@visactor/vutils';
import type {
  IElement,
  IGrowPointsOverallAnimationOptions,
  IAnimationParameters,
  IGrowPointsAnimationOptions,
  TypeAnimation
} from '../../../types';

const getCenterPoints = (
  element: IElement,
  options: IGrowPointsOverallAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const points: IPointLike[] = element.getGraphicAttribute('points', false);
  const center: IPointLike = { x: 0, y: 0 };
  points.forEach(point => {
    center.x += point.x;
    center.y += point.y;
  });
  center.x /= points.length;
  center.y /= points.length;

  if (options && options.center) {
    if (isValidNumber(options.center.x)) {
      center.x = options.center.x;
    }
    if (isValidNumber(options.center.y)) {
      center.y = options.center.y;
    }
  }

  if (element.mark.markType === 'area') {
    center.x1 = center.x;
    center.y1 = center.y;
  }

  return points.map(point => Object.assign({}, point, center));
};

export const growPointsIn: TypeAnimation<IElement> = (
  element: IElement,
  options: IGrowPointsOverallAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  return {
    from: { points: getCenterPoints(element, options, animationParameters) },
    to: { points: element.getGraphicAttribute('points', false) }
  };
};

export const growPointsOut: TypeAnimation<IElement> = (
  element: IElement,
  options: IGrowPointsOverallAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  return {
    from: { points: element.getGraphicAttribute('points', true) },
    to: { points: getCenterPoints(element, options, animationParameters) }
  };
};

// grow points x

const changePointsX = (
  element: IElement,
  options: IGrowPointsAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const points = element.getGraphicAttribute('points', false);
  return points.map((point: IPointLike) => {
    if (options && options.orient === 'negative') {
      let groupRight = animationParameters.width;

      if (animationParameters.group) {
        groupRight = (animationParameters as any).groupWidth ?? animationParameters.group.getBounds().width();

        (animationParameters as any).groupWidth = groupRight;
      }

      return {
        ...point,
        x: groupRight,
        y: point.y,
        x1: groupRight,
        y1: point.y1,
        defined: point.defined !== false
      } as IPointLike;
    }
    return {
      ...point,
      x: 0,
      y: point.y,
      x1: 0,
      y1: point.y1,
      defined: point.defined !== false
    } as IPointLike;
  });
};

export const growPointsXIn: TypeAnimation<IElement> = (
  element: IElement,
  options: IGrowPointsAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  return {
    from: { points: changePointsX(element, options, animationParameters) },
    to: { points: element.getGraphicAttribute('points', false) }
  };
};

export const growPointsXOut: TypeAnimation<IElement> = (
  element: IElement,
  options: IGrowPointsAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  return {
    from: { points: element.getGraphicAttribute('points', true) },
    to: { points: changePointsX(element, options, animationParameters) }
  };
};

// grow points y

const changePointsY = (
  element: IElement,
  options: IGrowPointsAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const points = element.getGraphicAttribute('points', false);
  return points.map((point: IPointLike) => {
    if (options && options.orient === 'negative') {
      let groupBottom = animationParameters.height;

      if (animationParameters.group) {
        groupBottom = (animationParameters as any).groupHeight ?? animationParameters.group.getBounds().height();

        (animationParameters as any).groupHeight = groupBottom;
      }

      return {
        ...point,
        x: point.x,
        y: groupBottom,
        x1: point.x1,
        y1: groupBottom,
        defined: point.defined !== false
      } as IPointLike;
    }
    return {
      ...point,
      x: point.x,
      y: 0,
      x1: point.x1,
      y1: 0,
      defined: point.defined !== false
    } as IPointLike;
  });
};

export const growPointsYIn: TypeAnimation<IElement> = (
  element: IElement,
  options: IGrowPointsAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  return {
    from: { points: changePointsY(element, options, animationParameters) },
    to: { points: element.getGraphicAttribute('points', false) }
  };
};

export const growPointsYOut: TypeAnimation<IElement> = (
  element: IElement,
  options: IGrowPointsAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  return {
    from: { points: element.getGraphicAttribute('points', true) },
    to: { points: changePointsY(element, options, animationParameters) }
  };
};
