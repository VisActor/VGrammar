/**
 * this animtion is only used for interval mark
 */
import type { IGrowCartesianAnimationOptions, IAnimationParameters, IElement, TypeAnimation } from '../../../types';
import { isNumber } from '@visactor/vutils';

function growIntervalInIndividual(
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) {
  const attrs = element.getFinalAnimationAttributes();

  if (options && options.direction === 'x') {
    const x = attrs?.x;
    const x1 = attrs?.x1;
    if (options.orient === 'negative') {
      return {
        from: { x: x1, x1: x1 },
        to: { x: x, x1: x1 }
      };
    }
    return {
      from: { x: x, x1: x },
      to: { x: x, y1: x1 }
    };
  }
  const y = attrs?.y;
  const y1 = attrs?.y1;
  if (options && options.orient === 'negative') {
    return {
      from: { y: y1, y1: y1 },
      to: { y: y, y1: y1 }
    };
  }
  return {
    from: { y: y, y1: y },
    to: { y: y, y1: y1 }
  };
}

function growIntervalInOverall(
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) {
  const attrs = element.getFinalAnimationAttributes();

  if (options && options.direction === 'x') {
    const x = attrs?.x;
    const x1 = attrs?.x1;
    let overallValue: number;
    if (options.orient === 'negative') {
      if (isNumber(options.overall)) {
        overallValue = options.overall as number;
      } else if (animationParameters.group) {
        overallValue = (animationParameters as any).groupWidth ?? animationParameters.group.getBounds().width();

        (animationParameters as any).groupWidth = overallValue;
      } else {
        overallValue = animationParameters.width;
      }
    } else {
      overallValue = isNumber(options?.overall) ? (options.overall as number) : 0;
    }
    return {
      from: { x: overallValue, x1: overallValue },
      to: { x: x, y1: x1 }
    };
  }

  const y = attrs?.y;
  const y1 = attrs?.y1;
  let overallValue: number;
  if (options && options.orient === 'negative') {
    if (isNumber(options.overall)) {
      overallValue = options.overall as number;
    } else if (animationParameters.group) {
      overallValue = (animationParameters as any).groupHeight ?? animationParameters.group.getBounds().height();

      (animationParameters as any).groupHeight = overallValue;
    } else {
      overallValue = animationParameters.height;
    }
  } else {
    overallValue = isNumber(options?.overall) ? (options.overall as number) : 0;
  }
  return {
    from: { y: overallValue, y1: overallValue },
    to: { y: y, y1: y1 }
  };
}

export const growIntervalIn: TypeAnimation<IElement> = (
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const coord = element.mark?.coord?.output();
  const isTransposed = coord.isTransposed();
  const isPolar = coord.type === 'polar';
  const newOptions: IGrowCartesianAnimationOptions = {
    orient: 'negative',
    direction: isTransposed && !isPolar ? 'x' : 'y'
  };

  return options && options.overall !== true
    ? growIntervalInIndividual(element, newOptions, animationParameters)
    : growIntervalInOverall(element, newOptions, animationParameters);
};

function growIntervalOutIndividual(
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) {
  const attrs = element.getFinalAnimationAttributes();
  if (options && options.direction === 'x') {
    const x = attrs?.x;
    const x1 = attrs?.x1;
    const prevX = element.getGraphicAttribute('x', true);
    const prevX1 = element.getGraphicAttribute('x1', true);
    if (options.orient === 'negative') {
      return {
        from: { x: prevX, x1: prevX1 },
        to: { x: x1, x1: x1 }
      };
    }
    return {
      from: { x: prevX, x1: prevX1 },
      to: { x: x, x1: x }
    };
  }

  const y = attrs?.y;
  const y1 = attrs?.y1;
  const prevY = element.getGraphicAttribute('y', true);
  const prevY1 = element.getGraphicAttribute('y1', true);
  if (options && options.orient === 'negative') {
    return {
      from: { y: prevY, y1: prevY1 },
      to: { y: y1, y1: y1 }
    };
  }
  return {
    from: { y: prevY, y1: prevY1 },
    to: { y: y, y1: y }
  };
}

function growIntervalOutOverall(
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) {
  if (options && options.direction === 'x') {
    const prevX = element.getGraphicAttribute('x', true);
    const prevX1 = element.getGraphicAttribute('x1', true);
    let overallValue: number;
    if (options.orient === 'negative') {
      if (isNumber(options.overall)) {
        overallValue = options.overall as number;
      } else if (animationParameters.group) {
        overallValue = (animationParameters as any).groupWidth ?? animationParameters.group.getBounds().width();

        (animationParameters as any).groupWidth = overallValue;
      } else {
        overallValue = animationParameters.width;
      }
    } else {
      overallValue = isNumber(options?.overall) ? (options.overall as number) : 0;
    }
    return {
      from: { x: prevX, x1: prevX1 },
      to: { x: overallValue, x1: overallValue }
    };
  }

  const prevY = element.getGraphicAttribute('y', true);
  const prevY1 = element.getGraphicAttribute('y1', true);
  let overallValue: number;
  if (options && options.orient === 'negative') {
    if (isNumber(options.overall)) {
      overallValue = options.overall as number;
    } else if (animationParameters.group) {
      overallValue = (animationParameters as any).groupHeight ?? animationParameters.group.getBounds().height();

      (animationParameters as any).groupHeight = overallValue;
    } else {
      overallValue = animationParameters.height;
    }
  } else {
    overallValue = isNumber(options?.overall) ? (options.overall as number) : 0;
  }
  return {
    from: { y: prevY, y1: prevY1 },
    to: { y: overallValue, y1: overallValue }
  };
}

export const growIntervalOut: TypeAnimation<IElement> = (
  element: IElement,
  options: Pick<IGrowCartesianAnimationOptions, 'overall'>,
  animationParameters: IAnimationParameters
) => {
  const coord = element.mark?.coord?.output();
  const isTransposed = coord.isTransposed();
  const isPolar = coord.type === 'polar';
  const newOptions: IGrowCartesianAnimationOptions = {
    orient: 'negative',
    direction: isTransposed && !isPolar ? 'x' : 'y'
  };

  return options && options.overall !== true
    ? growIntervalOutIndividual(element, newOptions, animationParameters)
    : growIntervalOutOverall(element, newOptions, animationParameters);
};
