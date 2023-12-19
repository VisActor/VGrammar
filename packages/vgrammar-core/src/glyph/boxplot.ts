import { isValidNumber } from '@visactor/vutils';
import type {
  BarBoxPlotEncoderSpec,
  BoxPlotEncoderSpec,
  IAnimationParameters,
  IGlyphElement,
  TypeAnimation
} from '../types';
import { Factory } from '../core/factory';
import { registerGlyphGraphic, registerRectGraphic, registerRuleGraphic } from '../graph/mark/graphic';
import { isHorizontal } from '@visactor/vgrammar-util';

export interface IBoxplotScaleAnimationOptions {
  center?: number;
}

const scaleIn = (
  computeCenter: (
    element: IGlyphElement,
    direction: 'vertical' | 'horizontal',
    options: IBoxplotScaleAnimationOptions
  ) => number
): TypeAnimation<IGlyphElement> => {
  return (
    element: IGlyphElement,
    options: IBoxplotScaleAnimationOptions,
    animationParameters: IAnimationParameters
  ) => {
    const direction =
      element.getGraphicAttribute('direction', false) ?? element.mark.getGlyphConfig()?.direction ?? 'vertical';
    const center = computeCenter(element, direction, options);
    if (!isValidNumber(center)) {
      return {};
    }
    const x = element.getGraphicAttribute('x', false);
    const y = element.getGraphicAttribute('y', false);
    const min = element.getGraphicAttribute('min', false);
    const max = element.getGraphicAttribute('max', false);
    const q1 = element.getGraphicAttribute('q1', false);
    const q3 = element.getGraphicAttribute('q3', false);
    const median = element.getGraphicAttribute('median', false);
    const animateAttributes: any = { from: { x, y }, to: { x, y } };
    if (isValidNumber(min)) {
      animateAttributes.from.min = center;
      animateAttributes.to.min = min;
    }
    if (isValidNumber(max)) {
      animateAttributes.from.max = center;
      animateAttributes.to.max = max;
    }
    if (isValidNumber(q1)) {
      animateAttributes.from.q1 = center;
      animateAttributes.to.q1 = q1;
    }
    if (isValidNumber(q3)) {
      animateAttributes.from.q3 = center;
      animateAttributes.to.q3 = q3;
    }
    if (isValidNumber(median)) {
      animateAttributes.from.median = center;
      animateAttributes.to.median = median;
    }
    return animateAttributes;
  };
};

const scaleOut = (
  computeCenter: (
    element: IGlyphElement,
    direction: 'vertical' | 'horizontal',
    options: IBoxplotScaleAnimationOptions
  ) => number
): TypeAnimation<IGlyphElement> => {
  return (
    element: IGlyphElement,
    options: IBoxplotScaleAnimationOptions,
    animationParameters: IAnimationParameters
  ) => {
    const direction =
      element.getGraphicAttribute('direction', false) ?? element.mark.getGlyphConfig()?.direction ?? 'vertical';
    const center = computeCenter(element, direction, options);
    if (!isValidNumber(center)) {
      return {};
    }
    const x = element.getGraphicAttribute('x', true);
    const y = element.getGraphicAttribute('y', true);
    const min = element.getGraphicAttribute('min', true);
    const max = element.getGraphicAttribute('max', true);
    const q1 = element.getGraphicAttribute('q1', true);
    const q3 = element.getGraphicAttribute('q3', true);
    const median = element.getGraphicAttribute('median', true);
    const animateAttributes: any = { from: { x, y }, to: { x, y } };
    if (isValidNumber(min)) {
      animateAttributes.to.min = center;
      animateAttributes.from.min = min;
    }
    if (isValidNumber(max)) {
      animateAttributes.to.max = center;
      animateAttributes.from.max = max;
    }
    if (isValidNumber(q1)) {
      animateAttributes.to.q1 = center;
      animateAttributes.from.q1 = q1;
    }
    if (isValidNumber(q3)) {
      animateAttributes.to.q3 = center;
      animateAttributes.from.q3 = q3;
    }
    if (isValidNumber(median)) {
      animateAttributes.to.median = center;
      animateAttributes.from.median = median;
    }
    return animateAttributes;
  };
};

const computeBoxplotCenter = (
  glyphElement: IGlyphElement,
  direction: 'vertical' | 'horizontal',
  options: IBoxplotScaleAnimationOptions
) => {
  if (options && isValidNumber(options.center)) {
    return options.center;
  }
  let median: number;
  let max: number;
  let min: number;
  let q1: number;
  let q3: number;
  if (isHorizontal(direction)) {
    median = glyphElement.getGraphicAttribute('points', false, 'median')?.[0]?.x;
    max = glyphElement.getGraphicAttribute('points', false, 'max')?.[0]?.x;
    min = glyphElement.getGraphicAttribute('points', false, 'min')?.[0]?.x;

    const boxWidth = glyphElement.getGraphicAttribute('width', false, 'box');
    const boxX = glyphElement.getGraphicAttribute('x', false, 'box');
    q1 = boxX;
    q3 = boxX + boxWidth;
  } else {
    median = glyphElement.getGraphicAttribute('points', false, 'median')?.[0]?.y;
    max = glyphElement.getGraphicAttribute('points', false, 'max')?.[0]?.y;
    min = glyphElement.getGraphicAttribute('points', false, 'min')?.[0]?.y;

    const boxHeight = glyphElement.getGraphicAttribute('height', false, 'box');
    const boxY = glyphElement.getGraphicAttribute('y', false, 'box');
    q1 = boxY;
    q3 = boxY + boxHeight;
  }

  if (isValidNumber(median)) {
    return median;
  }
  if (isValidNumber(q1) && isValidNumber(q3)) {
    return (q1 + q3) / 2;
  }
  if (isValidNumber(max) && isValidNumber(min)) {
    return (max + min) / 2;
  }
  if (isValidNumber(min)) {
    return min;
  }
  if (isValidNumber(max)) {
    return max;
  }
  return NaN;
};

const encodeBoxplotSize = (encodeValues: any, datum: any, element: IGlyphElement, config: any) => {
  const attributes = {
    shaft: {},
    box: {},
    max: {},
    min: {},
    median: {}
  };

  const x = encodeValues.x ?? element.getGraphicAttribute('x', false);
  const y = encodeValues.y ?? element.getGraphicAttribute('y', false);
  const width = encodeValues.width ?? element.getGraphicAttribute('width', false);
  const height = encodeValues.height ?? element.getGraphicAttribute('height', false);
  const boxWidth = encodeValues.boxWidth ?? element.getGraphicAttribute('boxWidth', false);
  const boxHeight = encodeValues.boxHeight ?? element.getGraphicAttribute('boxHeight', false);
  const ruleWidth = encodeValues.ruleWidth ?? element.getGraphicAttribute('ruleWidth', false);
  const ruleHeight = encodeValues.ruleHeight ?? element.getGraphicAttribute('ruleHeight', false);

  if (config && isHorizontal(config.direction)) {
    if (isValidNumber(boxHeight)) {
      Object.assign(attributes.box, { y: y - boxHeight / 2, y1: y + boxHeight / 2 });
      Object.assign(attributes.median, { y: y - boxHeight / 2, y1: y + boxHeight / 2 });
    } else {
      // median rule always has the same length with box rect
      Object.assign(attributes.box, { y: y - height / 2, y1: y + height / 2 });
      Object.assign(attributes.median, { y: y - height / 2, y1: y + height / 2 });
    }
    if (isValidNumber(ruleHeight)) {
      Object.assign(attributes.max, { y: y - ruleHeight / 2, y1: y + ruleHeight / 2 });
      Object.assign(attributes.min, { y: y - ruleHeight / 2, y1: y + ruleHeight / 2 });
    } else {
      Object.assign(attributes.max, { y: y - height / 2, y1: y + height / 2 });
      Object.assign(attributes.min, { y: y - height / 2, y1: y + height / 2 });
    }
  } else {
    if (isValidNumber(boxWidth)) {
      Object.assign(attributes.box, { x: x - boxWidth / 2, x1: x + boxWidth / 2 });
      Object.assign(attributes.median, { x: x - boxWidth / 2, x1: x + boxWidth / 2 });
    } else {
      Object.assign(attributes.box, { x: x - width / 2, x1: x + width / 2 });
      Object.assign(attributes.median, { x: x - width / 2, x1: x + width / 2 });
    }
    if (isValidNumber(ruleWidth)) {
      Object.assign(attributes.max, { x: x - ruleWidth / 2, x1: x + ruleWidth / 2 });
      Object.assign(attributes.min, { x: x - ruleWidth / 2, x1: x + ruleWidth / 2 });
    } else {
      Object.assign(attributes.max, { x: x - width / 2, x1: x + width / 2 });
      Object.assign(attributes.min, { x: x - width / 2, x1: x + width / 2 });
    }
  }
  return attributes;
};

export const boxplotScaleIn = scaleIn(computeBoxplotCenter);
export const boxplotScaleOut = scaleOut(computeBoxplotCenter);

export function registerBoxplotGlyph() {
  Factory.registerGlyph<BoxPlotEncoderSpec, { direction?: 'horizontal' | 'vertical' }>('boxplot', {
    shaft: 'rule',
    box: 'rect',
    max: 'rule',
    min: 'rule',
    median: 'rule'
  })
    .registerProgressiveChannels([
      'x',
      'y',
      'q1',
      'q3',
      'min',
      'max',
      'median',
      'angle',
      'width',
      'height',
      'boxWidth',
      'boxHeight',
      'ruleWidth',
      'ruleHeight'
    ])
    .registerFunctionEncoder(encodeBoxplotSize)
    .registerChannelEncoder('x', (channel, encodeValue, encodeValues, datum, element, config) => {
      if (config && isHorizontal(config.direction)) {
        return null;
      }
      return {
        shaft: { x: encodeValue, x1: encodeValue }
      };
    })
    .registerChannelEncoder('y', (channel, encodeValue, encodeValues, datum, element, config) => {
      if (!isHorizontal(config?.direction)) {
        return null;
      }
      return {
        shaft: { y: encodeValue, y1: encodeValue }
      };
    })
    .registerChannelEncoder('q1', (channel, encodeValue, encodeValues, datum, element, config) => {
      return config && isHorizontal(config.direction) ? { box: { x: encodeValue } } : { box: { y: encodeValue } };
    })
    .registerChannelEncoder('q3', (channel, encodeValue, encodeValues, datum, element, config) => {
      return config && isHorizontal(config.direction) ? { box: { x1: encodeValue } } : { box: { y1: encodeValue } };
    })
    .registerChannelEncoder('min', (channel, encodeValue, encodeValues, datum, element, config) => {
      return config && isHorizontal(config.direction)
        ? {
            shaft: { x: encodeValue },
            min: { x: encodeValue, x1: encodeValue, visible: true }
          }
        : {
            shaft: { y: encodeValue },
            min: { y: encodeValue, y1: encodeValue, visible: true }
          };
    })
    .registerChannelEncoder('max', (channel, encodeValue, encodeValues, datum, element, config) => {
      return config && isHorizontal(config.direction)
        ? {
            shaft: { x1: encodeValue },
            max: { x: encodeValue, x1: encodeValue, visible: true }
          }
        : {
            shaft: { y1: encodeValue },
            max: { y: encodeValue, y1: encodeValue, visible: true }
          };
    })
    .registerChannelEncoder('median', (channel, encodeValue, encodeValues, datum, element, config) => {
      return config && isHorizontal(config.direction)
        ? {
            median: { x: encodeValue, x1: encodeValue, visible: true }
          }
        : {
            median: { y: encodeValue, y1: encodeValue, visible: true }
          };
    })
    .registerChannelEncoder('angle', (channel, encodeValue, encodeValues, datum, element, config) => {
      const defaultAnchor =
        config && isHorizontal(config.direction)
          ? [(encodeValues.min + encodeValues.max) / 2, encodeValues.y]
          : [encodeValues.x, (encodeValues.min + encodeValues.max) / 2];
      const anchor = encodeValues.anchor ?? defaultAnchor;
      return {
        shaft: { angle: encodeValue, anchor },
        box: { angle: encodeValue, anchor },
        max: { angle: encodeValue, anchor },
        min: { angle: encodeValue, anchor },
        median: { angle: encodeValue, anchor }
      };
    })
    .registerDefaultEncoder(() => {
      return {
        max: { visible: false },
        min: { visible: false },
        median: { visible: false }
      };
    });

  Factory.registerAnimationType('boxplotScaleIn', boxplotScaleIn);
  Factory.registerAnimationType('boxplotScaleOut', boxplotScaleOut);
}

const computeBarBoxplotCenter = (
  glyphElement: IGlyphElement,
  direction: 'vertical' | 'horizontal',
  options: IBoxplotScaleAnimationOptions
) => {
  if (isValidNumber(options?.center)) {
    return options.center;
  }
  let median: number;
  let max: number;
  let min: number;
  let q1: number;
  let q3: number;
  if (isHorizontal(direction)) {
    median = glyphElement.getGraphicAttribute('points', false, 'median')?.[0]?.x;

    const minMaxBoxWidth = glyphElement.getGraphicAttribute('width', false, 'minMaxBox');
    const minMaxBoxBoxX = glyphElement.getGraphicAttribute('x', false, 'minMaxBox');
    min = minMaxBoxBoxX;
    max = minMaxBoxBoxX + minMaxBoxWidth;

    const q1q3BoxWidth = glyphElement.getGraphicAttribute('width', false, 'q1q3Box');
    const q1q3BoxX = glyphElement.getGraphicAttribute('x', false, 'q1q3Box');
    q1 = q1q3BoxX;
    q3 = q1q3BoxX + q1q3BoxWidth;
  } else {
    median = glyphElement.getGraphicAttribute('points', false, 'median')?.[0]?.y;

    const minMaxBoxHeight = glyphElement.getGraphicAttribute('height', false, 'minMaxBox');
    const minMaxBoxBoxY = glyphElement.getGraphicAttribute('y', false, 'minMaxBox');
    min = minMaxBoxBoxY;
    max = minMaxBoxBoxY + minMaxBoxHeight;

    const q1q3BoxHeight = glyphElement.getGraphicAttribute('height', false, 'q1q3Box');
    const q1q3BoxY = glyphElement.getGraphicAttribute('y', false, 'q1q3Box');
    q1 = q1q3BoxY;
    q3 = q1q3BoxY + q1q3BoxHeight;
  }

  if (isValidNumber(median)) {
    return median;
  }
  if (isValidNumber(q1) && isValidNumber(q3)) {
    return (q1 + q3) / 2;
  }
  if (isValidNumber(max) && isValidNumber(min)) {
    return (max + min) / 2;
  }
  if (isValidNumber(min)) {
    return min;
  }
  if (isValidNumber(max)) {
    return max;
  }
  return NaN;
};

const encodeBarBoxplotSize = (encodeValues: any, datum: any, element: IGlyphElement, config: any) => {
  const attributes = {
    minMaxBox: {},
    q1q3Box: {},
    median: {}
  };

  const x = encodeValues.x ?? element.getGraphicAttribute('x', false);
  const y = encodeValues.y ?? element.getGraphicAttribute('y', false);
  const width = encodeValues.width ?? element.getGraphicAttribute('width', false);
  const minMaxWidth = encodeValues.minMaxWidth ?? element.getGraphicAttribute('minMaxWidth', false);
  const q1q3Width = encodeValues.q1q3Width ?? element.getGraphicAttribute('q1q3Width', false);
  const height = encodeValues.height ?? element.getGraphicAttribute('height', false);
  const minMaxHeight = encodeValues.minMaxHeight ?? element.getGraphicAttribute('minMaxHeight', false);
  const q1q3Height = encodeValues.q1q3Height ?? element.getGraphicAttribute('q1q3Height', false);

  if (config && isHorizontal(config.direction)) {
    if (isValidNumber(minMaxHeight)) {
      Object.assign(attributes.minMaxBox, { y: y - minMaxHeight / 2, y1: y + minMaxHeight / 2 });
    } else {
      Object.assign(attributes.minMaxBox, { y: y - height / 2, y1: y + height / 2 });
    }
    if (isValidNumber(q1q3Height)) {
      Object.assign(attributes.q1q3Box, { y: y - q1q3Height / 2, y1: y + q1q3Height / 2 });
      Object.assign(attributes.median, { y: y - q1q3Height / 2, y1: y + q1q3Height / 2 });
    } else {
      // median rule always has the same length with q1q3box rect
      Object.assign(attributes.q1q3Box, { y: y - height / 2, y1: y + height / 2 });
      Object.assign(attributes.median, { y: y - height / 2, y1: y + height / 2 });
    }
  } else {
    if (isValidNumber(minMaxWidth)) {
      Object.assign(attributes.minMaxBox, { x: x - minMaxWidth / 2, x1: x + minMaxWidth / 2 });
    } else {
      Object.assign(attributes.minMaxBox, { x: x - width / 2, x1: x + width / 2 });
    }
    if (isValidNumber(q1q3Width)) {
      Object.assign(attributes.q1q3Box, { x: x - q1q3Width / 2, x1: x + q1q3Width / 2 });
      Object.assign(attributes.median, { x: x - q1q3Width / 2, x1: x + q1q3Width / 2 });
    } else {
      // median rule always has the same length with q1q3box rect
      Object.assign(attributes.q1q3Box, { x: x - width / 2, x1: x + width / 2 });
      Object.assign(attributes.median, { x: x - width / 2, x1: x + width / 2 });
    }
  }
  return attributes;
};

export const barBoxplotScaleIn = scaleIn(computeBarBoxplotCenter);
export const barBoxplotScaleOut = scaleOut(computeBarBoxplotCenter);

export function registerBarBoxplotGlyph() {
  Factory.registerGlyph<BarBoxPlotEncoderSpec, { direction?: 'horizontal' | 'vertical' }>('barBoxplot', {
    minMaxBox: 'rect',
    q1q3Box: 'rect',
    median: 'rule'
  })
    .registerProgressiveChannels([
      'x',
      'y',
      'q1',
      'q3',
      'min',
      'max',
      'median',
      'angle',
      'width',
      'height',
      'minMaxWidth',
      'q1q3Width',
      'minMaxHeight',
      'q1q3Height'
    ])
    .registerFunctionEncoder(encodeBarBoxplotSize)
    .registerChannelEncoder('q1', (channel, encodeValue, encodeValues, datum, element, config) => {
      return config && isHorizontal(config.direction)
        ? { q1q3Box: { x: encodeValue } }
        : { q1q3Box: { y: encodeValue } };
    })
    .registerChannelEncoder('q3', (channel, encodeValue, encodeValues, datum, element, config) => {
      return config && isHorizontal(config.direction)
        ? { q1q3Box: { x1: encodeValue } }
        : { q1q3Box: { y1: encodeValue } };
    })
    .registerChannelEncoder('min', (channel, encodeValue, encodeValues, datum, element, config) => {
      return config && isHorizontal(config.direction)
        ? { minMaxBox: { x: encodeValue } }
        : { minMaxBox: { y: encodeValue } };
    })
    .registerChannelEncoder('max', (channel, encodeValue, encodeValues, datum, element, config) => {
      return config && isHorizontal(config.direction)
        ? { minMaxBox: { x1: encodeValue } }
        : { minMaxBox: { y1: encodeValue } };
    })
    .registerChannelEncoder('median', (channel, encodeValue, encodeValues, datum, element, config) => {
      return config && isHorizontal(config.direction)
        ? { median: { x: encodeValue, x1: encodeValue, visible: true } }
        : { median: { y: encodeValue, y1: encodeValue, visible: true } };
    })
    .registerChannelEncoder('angle', (channel, encodeValue, encodeValues, datum, element, config) => {
      const anchor = encodeValues.anchor ?? [encodeValues.x, (encodeValues.min + encodeValues.max) / 2];
      return {
        minMaxBox: { angle: encodeValue, anchor },
        q1q3Box: { angle: encodeValue, anchor },
        median: { angle: encodeValue, anchor }
      };
    })
    .registerChannelEncoder('lineWidth', (channel, encodeValue, encodeValues, datum, element, config) => {
      return {
        minMaxBox: { lineWidth: 0 },
        q1q3Box: { lineWidth: 0 }
      };
    })
    .registerChannelEncoder('minMaxFillOpacity', (channel, encodeValue, encodeValues, datum, element, config) => {
      return {
        minMaxBox: { fillOpacity: encodeValue }
      };
    })
    .registerChannelEncoder('stroke', (channel, encodeValue, encodeValues, datum, element, config) => {
      return {
        minMaxBox: { stroke: false },
        q1q3Box: { stroke: false }
      };
    })
    .registerDefaultEncoder(() => {
      return {
        minMaxBox: { lineWidth: 0 },
        q1q3Box: { lineWidth: 0 },
        median: { visible: false }
      };
    });

  Factory.registerAnimationType('barBoxplotScaleIn', barBoxplotScaleIn);
  Factory.registerAnimationType('barBoxplotScaleOut', barBoxplotScaleOut);
  registerGlyphGraphic();
  registerRectGraphic();
  registerRuleGraphic();
}
