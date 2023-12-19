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
  if (options && options.orient === 'anticlockwise') {
    return {
      from: { startAngle: element.getGraphicAttribute('endAngle', false) },
      to: { startAngle: element.getGraphicAttribute('startAngle', false) }
    };
  }
  return {
    from: { endAngle: element.getGraphicAttribute('startAngle', false) },
    to: { endAngle: element.getGraphicAttribute('endAngle', false) }
  };
};

const growAngleInOverall = (
  element: IElement,
  options: IGrowAngleAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  if (options && options.orient === 'anticlockwise') {
    const overallValue = isNumber(options.overall) ? options.overall : Math.PI * 2;
    return {
      from: {
        startAngle: overallValue,
        endAngle: overallValue
      },
      to: {
        startAngle: element.getGraphicAttribute('startAngle', false),
        endAngle: element.getGraphicAttribute('endAngle', false)
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
      startAngle: element.getGraphicAttribute('startAngle', false),
      endAngle: element.getGraphicAttribute('endAngle', false)
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
  if (options && options.orient === 'anticlockwise') {
    return {
      from: { startAngle: element.getGraphicAttribute('startAngle', true) },
      to: { startAngle: element.getGraphicAttribute('endAngle', false) }
    };
  }
  return {
    from: { endAngle: element.getGraphicAttribute('endAngle', true) },
    to: { endAngle: element.getGraphicAttribute('startAngle', false) }
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
  if (options && options.orient === 'inside') {
    return {
      from: { innerRadius: element.getGraphicAttribute('outerRadius', false) },
      to: { innerRadius: element.getGraphicAttribute('innerRadius', false) }
    };
  }
  return {
    from: { outerRadius: element.getGraphicAttribute('innerRadius', false) },
    to: { outerRadius: element.getGraphicAttribute('outerRadius', false) }
  };
};

const growRadiusInOverall = (
  element: IElement,
  options: IGrowRadiusAnimationOptions,
  animationParameters: IAnimationParameters
) => {
  const overallValue = isNumber(options?.overall) ? options.overall : 0;
  return {
    from: {
      innerRadius: overallValue,
      outerRadius: overallValue
    },
    to: {
      innerRadius: element.getGraphicAttribute('innerRadius', false),
      outerRadius: element.getGraphicAttribute('outerRadius', false)
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
  if (options && options.orient === 'inside') {
    return {
      from: { innerRadius: element.getGraphicAttribute('innerRadius', true) },
      to: { innerRadius: element.getGraphicAttribute('outerRadius', false) }
    };
  }
  return {
    from: { outerRadius: element.getGraphicAttribute('outerRadius', true) },
    to: { outerRadius: element.getGraphicAttribute('innerRadius', false) }
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
