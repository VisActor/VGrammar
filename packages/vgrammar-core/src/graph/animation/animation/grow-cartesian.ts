import type { IRectGraphicAttribute } from '@visactor/vrender-core';
import { isNil, isNumber, isValidNumber } from '@visactor/vutils';
import type { IGrowCartesianAnimationOptions, IAnimationParameters, IElement, TypeAnimation } from '../../../types';

// grow center
export const growCenterIn: TypeAnimation<IElement> = (
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const x = element.getGraphicAttribute('x', false);
  const x1 = element.getGraphicAttribute('x1', false);

  const y = element.getGraphicAttribute('y', false);
  const y1 = element.getGraphicAttribute('y1', false);

  const width = element.getGraphicAttribute('width', false);
  const height = element.getGraphicAttribute('height', false);

  switch (options?.direction) {
    case 'x': {
      const computedX = isValidNumber(width) ? Math.min(x, x + width) : Math.min(x, x1);
      const computedWidth = isValidNumber(width) ? Math.abs(width) : Math.abs(x - x1);

      return {
        from: {
          x: computedX + computedWidth / 2,
          x1: isNil(x1) ? undefined : computedX + computedWidth / 2,
          width: isNil(width) ? undefined : 0
        },
        to: { x, x1, width }
      };
    }
    case 'y': {
      const computedY = isValidNumber(height) ? Math.min(y, y + height) : Math.min(y, y1);
      const computedHeight = isValidNumber(height) ? Math.abs(height) : Math.abs(y - y1);

      return {
        from: {
          y: computedY + computedHeight / 2,
          y1: isNil(y1) ? undefined : computedY + computedHeight / 2,
          height: isNil(height) ? undefined : 0
        },
        to: { y, y1, height }
      };
    }
    case 'xy':
    default: {
      const computedX = isValidNumber(width) ? Math.min(x, x + width) : Math.min(x, x1);
      const computedWidth = isValidNumber(width) ? Math.abs(width) : Math.abs(x - x1);
      const computedY = isValidNumber(height) ? Math.min(y, y + height) : Math.min(y, y1);
      const computedHeight = isValidNumber(height) ? Math.abs(height) : Math.abs(y - y1);

      return {
        from: {
          x: computedX + computedWidth / 2,
          y: computedY + computedHeight / 2,
          x1: isNil(x1) ? undefined : computedX + computedWidth / 2,
          y1: isNil(y1) ? undefined : computedY + computedHeight / 2,
          width: isNil(width) ? undefined : 0,
          height: isNil(height) ? undefined : 0
        },
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
  const x = element.getGraphicAttribute('x', false);
  const y = element.getGraphicAttribute('y', false);
  const x1 = element.getGraphicAttribute('x1', false);
  const y1 = element.getGraphicAttribute('y1', false);
  const width = element.getGraphicAttribute('width', false);
  const height = element.getGraphicAttribute('height', false);

  switch (options?.direction) {
    case 'x': {
      const computedX = isValidNumber(width) ? Math.min(x, x + width) : Math.min(x, x1);
      const computedWidth = isValidNumber(width) ? Math.abs(width) : Math.abs(x - x1);

      return {
        to: {
          x: computedX + computedWidth / 2,
          x1: isNil(x1) ? undefined : computedX + computedWidth / 2,
          width: isNil(width) ? undefined : 0
        }
      };
    }
    case 'y': {
      const computedY = isValidNumber(height) ? Math.min(y, y + height) : Math.min(y, y1);
      const computedHeight = isValidNumber(height) ? Math.abs(height) : Math.abs(y - y1);

      return {
        to: {
          y: computedY + computedHeight / 2,
          y1: isNil(y1) ? undefined : computedY + computedHeight / 2,
          height: isNil(height) ? undefined : 0
        }
      };
    }
    case 'xy':
    default: {
      const computedX = isValidNumber(width) ? Math.min(x, x + width) : Math.min(x, x1);
      const computedWidth = isValidNumber(width) ? Math.abs(width) : Math.abs(x - x1);
      const computedY = isValidNumber(height) ? Math.min(y, y + height) : Math.min(y, y1);
      const computedHeight = isValidNumber(height) ? Math.abs(height) : Math.abs(y - y1);

      return {
        to: {
          x: computedX + computedWidth / 2,
          y: computedY + computedHeight / 2,
          x1: isNil(x1) ? undefined : computedX + computedWidth / 2,
          y1: isNil(y1) ? undefined : computedY + computedHeight / 2,
          width: isNil(width) ? undefined : 0,
          height: isNil(height) ? undefined : 0
        }
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
  const x = element.getGraphicAttribute('x', false);
  const x1 = element.getGraphicAttribute('x1', false);
  const width = element.getGraphicAttribute('width', false);

  if (options?.orient === 'negative') {
    const computedX1 = isValidNumber(width) ? Math.max(x, x + width) : Math.max(x, x1);

    return {
      from: { x: computedX1, x1: isNil(x1) ? undefined : computedX1, width: isNil(width) ? undefined : 0 },
      to: { x: x, x1: x1, width: width }
    };
  }

  const computedX = isValidNumber(width) ? Math.min(x, x + width) : Math.min(x, x1);
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
  const x = element.getGraphicAttribute('x', false);
  const x1 = element.getGraphicAttribute('x1', false);
  const width = element.getGraphicAttribute('width', false);
  let overallValue: number;
  if (options?.orient === 'negative') {
    if (isNumber(options?.overall)) {
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
  const x = element.getGraphicAttribute('x', false);
  const x1 = element.getGraphicAttribute('x1', false);
  const width = element.getGraphicAttribute('width', false);

  if (options?.orient === 'negative') {
    const computedX1 = isValidNumber(width) ? Math.max(x, x + width) : Math.max(x, x1);

    return {
      to: { x: computedX1, x1: isNil(x1) ? undefined : computedX1, width: isNil(width) ? undefined : 0 }
    };
  }

  const computedX = isValidNumber(width) ? Math.min(x, x + width) : Math.min(x, x1);
  return {
    to: { x: computedX, x1: isNil(x1) ? undefined : computedX, width: isNil(width) ? undefined : 0 }
  };
}

function growWidthOutOverall(
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) {
  const x1 = element.getGraphicAttribute('x1', false);
  const width = element.getGraphicAttribute('width', false);

  let overallValue: number;
  if (options?.orient === 'negative') {
    if (isNumber(options?.overall)) {
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
  const y = element.getGraphicAttribute('y', false);
  const y1 = element.getGraphicAttribute('y1', false);
  const height = element.getGraphicAttribute('height', false);

  if (options?.orient === 'negative') {
    const computedY1 = isValidNumber(height) ? Math.max(y, y + height) : Math.max(y, y1);
    return {
      from: { y: computedY1, y1: isNil(y1) ? undefined : computedY1, height: isNil(height) ? undefined : 0 },
      to: { y: y, y1: y1, height: height }
    };
  }

  const computedY = isValidNumber(height) ? Math.min(y, y + height) : Math.min(y, y1);
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
  const y = element.getGraphicAttribute('y', false);
  const y1 = element.getGraphicAttribute('y1', false);
  const height = element.getGraphicAttribute('height', false);

  let overallValue: number;
  if (options?.orient === 'negative') {
    if (isNumber(options?.overall)) {
      overallValue = options?.overall;
    } else if (animationParameters.group) {
      overallValue = (animationParameters as any).groupHeight ?? animationParameters.group.getBounds().height();

      (animationParameters as any).groupHeight = overallValue;
    } else {
      overallValue = animationParameters.height;
    }
  } else {
    overallValue = isNumber(options?.overall) ? options?.overall : 0;
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
  const y = element.getGraphicAttribute('y', false);
  const y1 = element.getGraphicAttribute('y1', false);
  const height = element.getGraphicAttribute('height', false);

  if (options?.orient === 'negative') {
    const computedY1 = isValidNumber(height) ? Math.max(y, y + height) : Math.max(y, y1);

    return {
      to: { y: computedY1, y1: isNil(y1) ? undefined : computedY1, height: isNil(height) ? undefined : 0 }
    };
  }

  const computedY = isValidNumber(height) ? Math.min(y, y + height) : Math.min(y, y1);
  return {
    to: { y: computedY, y1: isNil(y1) ? undefined : computedY, height: isNil(height) ? undefined : 0 }
  };
}

function growHeightOutOverall(
  element: IElement,
  options: IGrowCartesianAnimationOptions,
  animationParameters: IAnimationParameters
) {
  const y1 = element.getGraphicAttribute('y1', false);
  const height = element.getGraphicAttribute('height', false);

  let overallValue: number;
  if (options?.orient === 'negative') {
    if (isNumber(options?.overall)) {
      overallValue = options.overall;
    } else if (animationParameters.group) {
      overallValue = (animationParameters as any).groupHeight ?? animationParameters.group.getBounds().height();

      (animationParameters as any).groupHeight = overallValue;
    } else {
      overallValue = animationParameters.height;
    }
  } else {
    overallValue = isNumber(options?.overall) ? options?.overall : 0;
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
