import { isNil, isNumber, isValid } from '@visactor/vutils';
import type { IGrowCartesianAnimationOptions, IAnimationParameters, IElement, TypeAnimation } from '../../../types';

// grow center
export const growCenterIn: TypeAnimation<IElement> = (
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  switch (options?.direction) {
    case 'x': {
      const x = element.getFinalGraphicAttributes()?.x;
      const x1 = element.getFinalGraphicAttributes()?.x1;
      const width = element.getFinalGraphicAttributes()?.width;

      return {
        from: isValid(width)
          ? {
              x: x + width / 2,
              x1: undefined,
              width: 0
            }
          : {
              x: (x + x1) / 2,
              x1: (x + x1) / 2,
              width: undefined
            },
        to: { x, x1, width }
      };
    }
    case 'y': {
      const y = element.getFinalGraphicAttributes()?.y;
      const y1 = element.getFinalGraphicAttributes()?.y1;
      const height = element.getFinalGraphicAttributes()?.height;

      return {
        from: isValid(height)
          ? {
              y: y + height / 2,
              y1: undefined,
              height: 0
            }
          : {
              y: (y + y1) / 2,
              y1: (y + y1) / 2,
              height: undefined
            },
        to: { y, y1, height }
      };
    }
    case 'xy':
    default: {
      const x = element.getFinalGraphicAttributes()?.x;
      const x1 = element.getFinalGraphicAttributes()?.x1;
      const width = element.getFinalGraphicAttributes()?.width;
      const y = element.getFinalGraphicAttributes()?.y;
      const y1 = element.getFinalGraphicAttributes()?.y1;
      const height = element.getFinalGraphicAttributes()?.height;
      const from: any = {};

      if (isValid(width)) {
        from.x = x + width / 2;
        from.width = 0;
        from.x1 = undefined;
      } else {
        from.x = (x + x1) / 2;
        from.x1 = (x + x1) / 2;
        from.width = undefined;
      }

      if (isValid(height)) {
        from.y = y + height / 2;
        from.height = 0;
        from.y1 = undefined;
      } else {
        from.y = (y + y1) / 2;
        from.y1 = (y + y1) / 2;
        from.height = undefined;
      }

      return {
        from,
        to: { x, y, x1, y1, width, height }
      };
    }
  }
};

export const growCenterOut: TypeAnimation<IElement> = (
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  switch (options?.direction) {
    case 'x': {
      const x = element.getFinalGraphicAttributes()?.x;
      const x1 = element.getFinalGraphicAttributes()?.x1;
      const width = element.getFinalGraphicAttributes()?.width;

      return {
        to: isValid(width)
          ? {
              x: x + width / 2,
              x1: undefined,
              width: 0
            }
          : {
              x: (x + x1) / 2,
              x1: (x + x1) / 2,
              width: undefined
            }
      };
    }
    case 'y': {
      const y = element.getFinalGraphicAttributes()?.y;
      const y1 = element.getFinalGraphicAttributes()?.y1;
      const height = element.getFinalGraphicAttributes()?.height;

      return {
        to: isValid(height)
          ? {
              y: y + height / 2,
              y1: undefined,
              height: 0
            }
          : {
              y: (y + y1) / 2,
              y1: (y + y1) / 2,
              height: undefined
            }
      };
    }
    case 'xy':
    default: {
      const x = element.getFinalGraphicAttributes()?.x;
      const y = element.getFinalGraphicAttributes()?.y;
      const x1 = element.getFinalGraphicAttributes()?.x1;
      const y1 = element.getFinalGraphicAttributes()?.y1;
      const width = element.getFinalGraphicAttributes()?.width;
      const height = element.getFinalGraphicAttributes()?.height;
      const to: any = {};

      if (isValid(width)) {
        to.x = x + width / 2;
        to.width = 0;
        to.x1 = undefined;
      } else {
        to.x = (x + x1) / 2;
        to.x1 = (x + x1) / 2;
        to.width = undefined;
      }

      if (isValid(height)) {
        to.y = y + height / 2;
        to.height = 0;
        to.y1 = undefined;
      } else {
        to.y = (y + y1) / 2;
        to.y1 = (y + y1) / 2;
        to.height = undefined;
      }

      return {
        to
      };
    }
  }
};

// grow width
function growWidthInIndividual(
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) {
  const x = element.getFinalGraphicAttributes()?.x;
  const x1 = element.getFinalGraphicAttributes()?.x1;
  const width = element.getFinalGraphicAttributes()?.width;

  if (options && options.orient === 'negative') {
    const computedX1 = isValid(width) ? Math.max(x, x + width) : Math.max(x, x1);

    return {
      from: { x: computedX1, x1: isNil(x1) ? undefined : computedX1, width: isNil(width) ? undefined : 0 },
      to: { x: x, x1: x1, width: width }
    };
  }

  const computedX = isValid(width) ? Math.min(x, x + width) : Math.min(x, x1);
  return {
    from: { x: computedX, x1: isNil(x1) ? undefined : computedX, width: isNil(width) ? undefined : 0 },
    to: { x: x, x1: x1, width: width }
  };
}

function growWidthInOverall(
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) {
  // no need to handle the situation where x > x1
  const x = element.getFinalGraphicAttributes()?.x;
  const x1 = element.getFinalGraphicAttributes()?.x1;
  const width = element.getFinalGraphicAttributes()?.width;
  let overallValue: number;
  if (options && options.orient === 'negative') {
    if (isNumber(options.overall)) {
      overallValue = options.overall;
    } else if (animationParameters.group) {
      overallValue = (animationParameters as any).groupWidth ?? animationParameters.group.getBounds().width();

      (animationParameters as any).groupWidth = overallValue;
    } else {
      overallValue = animationParameters.width;
    }
  } else {
    overallValue = isNumber(options?.overall) ? options?.overall : 0;
  }
  return {
    from: { x: overallValue, x1: isNil(x1) ? undefined : overallValue, width: isNil(width) ? undefined : 0 },
    to: { x: x, x1: x1, width: width }
  };
}

export const growWidthIn: TypeAnimation<IElement> = (
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  return (options?.overall ?? false) !== false
    ? growWidthInOverall(element, options, animationParameters)
    : growWidthInIndividual(element, options, animationParameters);
};

function growWidthOutIndividual(
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) {
  const x = element.getFinalGraphicAttributes()?.x;
  const x1 = element.getFinalGraphicAttributes()?.x1;
  const width = element.getFinalGraphicAttributes()?.width;

  if (options && options.orient === 'negative') {
    const computedX1 = isValid(width) ? Math.max(x, x + width) : Math.max(x, x1);

    return {
      to: { x: computedX1, x1: isNil(x1) ? undefined : computedX1, width: isNil(width) ? undefined : 0 }
    };
  }

  const computedX = isValid(width) ? Math.min(x, x + width) : Math.min(x, x1);
  return {
    to: { x: computedX, x1: isNil(x1) ? undefined : computedX, width: isNil(width) ? undefined : 0 }
  };
}

function growWidthOutOverall(
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) {
  const x1 = element.getFinalGraphicAttributes()?.x1;
  const width = element.getFinalGraphicAttributes()?.width;

  let overallValue: number;
  if (options && options.orient === 'negative') {
    if (isNumber(options.overall)) {
      overallValue = options.overall;
    } else if (animationParameters.group) {
      overallValue = (animationParameters as any).groupWidth ?? animationParameters.group.getBounds().width();

      (animationParameters as any).groupWidth = overallValue;
    } else {
      overallValue = animationParameters.width;
    }
  } else {
    overallValue = isNumber(options?.overall) ? options.overall : 0;
  }
  return {
    to: { x: overallValue, x1: isNil(x1) ? undefined : overallValue, width: isNil(width) ? undefined : 0 }
  };
}

export const growWidthOut: TypeAnimation<IElement> = (
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  return (options?.overall ?? false) !== false
    ? growWidthOutOverall(element, options, animationParameters)
    : growWidthOutIndividual(element, options, animationParameters);
};

// grow height

function growHeightInIndividual(
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) {
  const y = element.getFinalGraphicAttributes()?.y;
  const y1 = element.getFinalGraphicAttributes()?.y1;
  const height = element.getFinalGraphicAttributes()?.height;

  if (options && options.orient === 'negative') {
    const computedY1 = isValid(height) ? Math.max(y, y + height) : Math.max(y, y1);
    return {
      from: { y: computedY1, y1: isNil(y1) ? undefined : computedY1, height: isNil(height) ? undefined : 0 },
      to: { y: y, y1: y1, height: height }
    };
  }

  const computedY = isValid(height) ? Math.min(y, y + height) : Math.min(y, y1);
  return {
    from: { y: computedY, y1: isNil(y1) ? undefined : computedY, height: isNil(height) ? undefined : 0 },
    to: { y: y, y1: y1, height: height }
  };
}

function growHeightInOverall(
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) {
  const y = element.getFinalGraphicAttributes()?.y;
  const y1 = element.getFinalGraphicAttributes()?.y1;
  const height = element.getFinalGraphicAttributes()?.height;

  let overallValue: number;
  if (options && options.orient === 'negative') {
    if (isNumber(options.overall)) {
      overallValue = options.overall;
    } else if (animationParameters.group) {
      overallValue = (animationParameters as any).groupHeight ?? animationParameters.group.getBounds().height();

      (animationParameters as any).groupHeight = overallValue;
    } else {
      overallValue = animationParameters.height;
    }
  } else {
    overallValue = isNumber(options?.overall) ? options.overall : 0;
  }
  return {
    from: { y: overallValue, y1: isNil(y1) ? undefined : overallValue, height: isNil(height) ? undefined : 0 },
    to: { y: y, y1: y1, height: height }
  };
}

export const growHeightIn: TypeAnimation<IElement> = (
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  return (options?.overall ?? false) !== false
    ? growHeightInOverall(element, options, animationParameters)
    : growHeightInIndividual(element, options, animationParameters);
};

function growHeightOutIndividual(
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) {
  const y = element.getFinalGraphicAttributes()?.y;
  const y1 = element.getFinalGraphicAttributes()?.y1;
  const height = element.getFinalGraphicAttributes()?.height;

  if (options && options.orient === 'negative') {
    const computedY1 = isValid(height) ? Math.max(y, y + height) : Math.max(y, y1);

    return {
      to: { y: computedY1, y1: isNil(y1) ? undefined : computedY1, height: isNil(height) ? undefined : 0 }
    };
  }

  const computedY = isValid(height) ? Math.min(y, y + height) : Math.min(y, y1);
  return {
    to: { y: computedY, y1: isNil(y1) ? undefined : computedY, height: isNil(height) ? undefined : 0 }
  };
}

function growHeightOutOverall(
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) {
  const y1 = element.getFinalGraphicAttributes()?.y1;
  const height = element.getFinalGraphicAttributes()?.height;

  let overallValue: number;
  if (options && options.orient === 'negative') {
    if (isNumber(options.overall)) {
      overallValue = options.overall;
    } else if (animationParameters.group) {
      overallValue = (animationParameters as any).groupHeight ?? animationParameters.group.getBounds().height();

      (animationParameters as any).groupHeight = overallValue;
    } else {
      overallValue = animationParameters.height;
    }
  } else {
    overallValue = isNumber(options?.overall) ? options.overall : 0;
  }
  return {
    to: { y: overallValue, y1: isNil(y1) ? undefined : overallValue, height: isNil(height) ? undefined : 0 }
  };
}

export const growHeightOut: TypeAnimation<IElement> = (
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  return (options?.overall ?? false) !== false
    ? growHeightOutOverall(element, options, animationParameters)
    : growHeightOutIndividual(element, options, animationParameters);
};
