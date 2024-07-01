import { isNumber } from '@visactor/vutils';
import type {
  IElement,
  IGrowAngleAnimationOptions,
  IAnimationParameters,
  IGrowRadiusAnimationOptions,
  TypeAnimation
} from '../../../types';

// grow angle

const growAngleInIndividual = (
  element: IElement,
  options: IGrowAngleAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const attrs = element.getFinalAnimationAttributes();
  if (options && options.orient === 'anticlockwise') {
    return {
      from: { startAngle: attrs?.endAngle },
      to: { startAngle: attrs?.startAngle }
    };
  }
  return {
    from: { endAngle: attrs?.startAngle },
    to: { endAngle: attrs?.endAngle }
  };
};

const growAngleInOverall = (
  element: IElement,
  options: IGrowAngleAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const attrs = element.getFinalAnimationAttributes();

  if (options && options.orient === 'anticlockwise') {
    const overallValue = isNumber(options.overall) ? options.overall : Math.PI * 2;
    return {
      from: {
        startAngle: overallValue,
        endAngle: overallValue
      },
      to: {
        startAngle: attrs?.startAngle,
        endAngle: attrs?.endAngle
      }
    };
  }
  const overallValue = isNumber(options?.overall) ? options.overall : 0;
  return {
    from: {
      startAngle: overallValue,
      endAngle: overallValue
    },
    to: {
      startAngle: attrs?.startAngle,
      endAngle: attrs?.endAngle
    }
  };
};

export const growAngleIn: TypeAnimation<IElement> = (
  element: IElement,
  options: IGrowAngleAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  return (options?.overall ?? false) !== false
    ? growAngleInOverall(element, options, animationParameters)
    : growAngleInIndividual(element, options, animationParameters);
};

const growAngleOutIndividual = (
  element: IElement,
  options: IGrowAngleAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const attrs = element.getFinalAnimationAttributes();

  if (options && options.orient === 'anticlockwise') {
    return {
      from: { startAngle: element.getGraphicAttribute('startAngle', true) },
      to: { startAngle: attrs?.endAngle }
    };
  }
  return {
    from: { endAngle: element.getGraphicAttribute('endAngle', true) },
    to: { endAngle: attrs?.startAngle }
  };
};

const growAngleOutOverall = (
  element: IElement,
  options: IGrowAngleAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  if (options && options.orient === 'anticlockwise') {
    const overallValue = isNumber(options.overall) ? options.overall : Math.PI * 2;
    return {
      from: {
        startAngle: element.getGraphicAttribute('startAngle', true),
        endAngle: element.getGraphicAttribute('endAngle', true)
      },
      to: {
        startAngle: overallValue,
        endAngle: overallValue
      }
    };
  }
  const overallValue = isNumber(options?.overall) ? options.overall : 0;
  return {
    from: {
      startAngle: element.getGraphicAttribute('startAngle', true),
      endAngle: element.getGraphicAttribute('endAngle', true)
    },
    to: {
      startAngle: overallValue,
      endAngle: overallValue
    }
  };
};

export const growAngleOut: TypeAnimation<IElement> = (
  element: IElement,
  options: IGrowAngleAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  return (options?.overall ?? false) !== false
    ? growAngleOutOverall(element, options, animationParameters)
    : growAngleOutIndividual(element, options, animationParameters);
};

// grow radius

const growRadiusInIndividual = (
  element: IElement,
  options: IGrowRadiusAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const attrs = element.getFinalAnimationAttributes();

  if (options && options.orient === 'inside') {
    return {
      from: { innerRadius: attrs?.outerRadius },
      to: { innerRadius: attrs?.innerRadius }
    };
  }
  return {
    from: { outerRadius: attrs?.innerRadius },
    to: { outerRadius: attrs?.outerRadius }
  };
};

const growRadiusInOverall = (
  element: IElement,
  options: IGrowRadiusAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const attrs = element.getFinalAnimationAttributes();
  const overallValue = isNumber(options?.overall) ? options.overall : 0;
  return {
    from: {
      innerRadius: overallValue,
      outerRadius: overallValue
    },
    to: {
      innerRadius: attrs?.innerRadius,
      outerRadius: attrs?.outerRadius
    }
  };
};

export const growRadiusIn: TypeAnimation<IElement> = (
  element: IElement,
  options: IGrowRadiusAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  return (options?.overall ?? false) !== false
    ? growRadiusInOverall(element, options, animationParameters)
    : growRadiusInIndividual(element, options, animationParameters);
};

const growRadiusOutIndividual = (
  element: IElement,
  options: IGrowRadiusAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const attrs = element.getFinalAnimationAttributes();
  if (options && options.orient === 'inside') {
    return {
      from: { innerRadius: element.getGraphicAttribute('innerRadius', true) },
      to: { innerRadius: attrs?.outerRadius }
    };
  }
  return {
    from: { outerRadius: element.getGraphicAttribute('outerRadius', true) },
    to: { outerRadius: attrs?.innerRadius }
  };
};

const growRadiusOutOverall = (
  element: IElement,
  options: IGrowRadiusAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const overallValue = isNumber(options?.overall) ? options.overall : 0;
  return {
    from: {
      innerRadius: element.getGraphicAttribute('innerRadius', true),
      outerRadius: element.getGraphicAttribute('outerRadius', true)
    },
    to: {
      innerRadius: overallValue,
      outerRadius: overallValue
    }
  };
};

export const growRadiusOut: TypeAnimation<IElement> = (
  element: IElement,
  options: IGrowRadiusAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  return (options?.overall ?? false) !== false
    ? growRadiusOutOverall(element, options, animationParameters)
    : growRadiusOutIndividual(element, options, animationParameters);
};
