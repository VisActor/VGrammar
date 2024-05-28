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
  const finalAttrs = element.getFinalGraphicAttributes();
  if (options && options.orient === 'anticlockwise') {
    return {
      from: { startAngle: finalAttrs?.endAngle },
      to: { startAngle: finalAttrs?.startAngle }
    };
  }
  return {
    from: { endAngle: finalAttrs?.startAngle },
    to: { endAngle: finalAttrs?.endAngle }
  };
};

const growAngleInOverall = (
  element: IElement,
  options: IGrowAngleAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const finalAttrs = element.getFinalGraphicAttributes();

  if (options && options.orient === 'anticlockwise') {
    const overallValue = isNumber(options.overall) ? options.overall : Math.PI * 2;
    return {
      from: {
        startAngle: overallValue,
        endAngle: overallValue
      },
      to: {
        startAngle: finalAttrs?.startAngle,
        endAngle: finalAttrs?.endAngle
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
      startAngle: finalAttrs?.startAngle,
      endAngle: finalAttrs?.endAngle
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
  const finalAttrs = element.getFinalGraphicAttributes();

  if (options && options.orient === 'anticlockwise') {
    return {
      from: { startAngle: element.getGraphicAttribute('startAngle', true) },
      to: { startAngle: finalAttrs?.endAngle }
    };
  }
  return {
    from: { endAngle: element.getGraphicAttribute('endAngle', true) },
    to: { endAngle: finalAttrs?.startAngle }
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
  const finalAttrs = element.getFinalGraphicAttributes();

  if (options && options.orient === 'inside') {
    return {
      from: { innerRadius: finalAttrs?.outerRadius },
      to: { innerRadius: finalAttrs?.innerRadius }
    };
  }
  return {
    from: { outerRadius: finalAttrs?.innerRadius },
    to: { outerRadius: finalAttrs?.outerRadius }
  };
};

const growRadiusInOverall = (
  element: IElement,
  options: IGrowRadiusAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const finalAttrs = element.getFinalGraphicAttributes();
  const overallValue = isNumber(options?.overall) ? options.overall : 0;
  return {
    from: {
      innerRadius: overallValue,
      outerRadius: overallValue
    },
    to: {
      innerRadius: finalAttrs?.innerRadius,
      outerRadius: finalAttrs?.outerRadius
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
  const finalAttrs = element.getFinalGraphicAttributes();
  if (options && options.orient === 'inside') {
    return {
      from: { innerRadius: element.getGraphicAttribute('innerRadius', true) },
      to: { innerRadius: finalAttrs?.outerRadius }
    };
  }
  return {
    from: { outerRadius: element.getGraphicAttribute('outerRadius', true) },
    to: { outerRadius: finalAttrs?.innerRadius }
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
