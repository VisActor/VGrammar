import { isValidNumber } from '@visactor/vutils';
import type { IGlyphElement, ViolinEncoderSpec } from '../types';
import { Factory } from '../core/factory';
import type { IBaseScale } from '@visactor/vscale';
import {
  registerGlyphGraphic,
  registerPolygonGraphic,
  registerRectGraphic,
  registerRuleGraphic,
  registerSymbolGraphic
} from '../graph/mark/graphic';
import { isHorizontal } from '@visactor/vgrammar-util';

const defaultDensitySize = 30;

const computeViolinPoints = (density: [number, number][], densitySize: number, scale: IBaseScale, config: any) => {
  if (!density || density.length === 0) {
    return [];
  }
  const maxDensity = density.reduce((max, d) => Math.max(max, d[1]), 0);

  if (config && isHorizontal(config.direction)) {
    const topPoints = density.map(d => {
      return {
        y: -densitySize * (1 / maxDensity) * d[1],
        x: scale.scale(d[0])
      };
    });
    const bottomPoints = density.map(d => {
      return {
        y: densitySize * (1 / maxDensity) * d[1],
        x: scale.scale(d[0])
      };
    });
    return [...topPoints, ...bottomPoints.reverse()];
  }

  const leftPoints = density.map(d => {
    return {
      x: -densitySize * (1 / maxDensity) * d[1],
      y: scale.scale(d[0])
    };
  });
  const rightPoints = density.map(d => {
    return {
      x: densitySize * (1 / maxDensity) * d[1],
      y: scale.scale(d[0])
    };
  });
  return [...leftPoints, ...rightPoints.reverse()];
};

const encodeViolin = (encodeValues: any, datum: any, element: IGlyphElement, config: any) => {
  const attributes = {
    violin: {},
    shaft: {},
    box: {},
    median: {}
  };

  const x = encodeValues.x ?? element.getGraphicAttribute('x', false);
  const y = encodeValues.y ?? element.getGraphicAttribute('y', false);
  const width = encodeValues.width ?? element.getGraphicAttribute('width', false);
  const height = encodeValues.height ?? element.getGraphicAttribute('height', false);
  const boxWidth = encodeValues.boxWidth ?? element.getGraphicAttribute('boxWidth', false);
  const boxHeight = encodeValues.boxHeight ?? element.getGraphicAttribute('boxHeight', false);
  const densitySize =
    encodeValues.densitySize ?? element.getGraphicAttribute('densitySize', false) ?? defaultDensitySize;

  const densityScale = element.mark.getScalesByChannel().density;
  const densityField = element.mark.getFieldsByChannel().density;
  if (densityField && densityScale) {
    const points = computeViolinPoints(datum[densityField], densitySize, densityScale, config);
    Object.assign(attributes.violin, { points });
  }

  if (config && isHorizontal(config.direction)) {
    if (isValidNumber(boxHeight)) {
      Object.assign(attributes.box, { y: y - boxHeight / 2, y1: y + boxHeight / 2 });
    } else {
      Object.assign(attributes.box, { y: y - height / 2, y1: y + height / 2 });
    }
  } else {
    if (isValidNumber(boxWidth)) {
      Object.assign(attributes.box, { x: x - boxWidth / 2, x1: x + boxWidth / 2 });
    } else {
      Object.assign(attributes.box, { x: x - width / 2, x1: x + width / 2 });
    }
  }
  return attributes;
};

export const registerViolinGlyph = () => {
  Factory.registerGlyph<ViolinEncoderSpec>('violin', {
    violin: 'polygon',
    shaft: 'rule',
    box: 'rect',
    median: 'symbol'
  })
    .registerFunctionEncoder(encodeViolin)
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
      return config && isHorizontal(config.direction) ? { shaft: { x: encodeValue } } : { shaft: { y: encodeValue } };
    })
    .registerChannelEncoder('max', (channel, encodeValue, encodeValues, datum, element, config) => {
      return config && isHorizontal(config.direction) ? { shaft: { x1: encodeValue } } : { shaft: { y1: encodeValue } };
    })
    .registerChannelEncoder('median', (channel, encodeValue, encodeValues, datum, element, config) => {
      return config && isHorizontal(config.direction)
        ? { median: { x: encodeValue, x1: encodeValue, visible: true } }
        : { median: { y: encodeValue, y1: encodeValue, visible: true } };
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
        median: { angle: encodeValue, anchor }
      };
    })
    .registerChannelEncoder('medianFill', (channel, encodeValue, encodeValues, datum, element, config) => {
      return { median: { fill: encodeValue } };
    })
    .registerChannelEncoder('violinFill', (channel, encodeValue, encodeValues, datum, element, config) => {
      return { violin: { fill: encodeValue } };
    })
    .registerChannelEncoder('violinStroke', (channel, encodeValue, encodeValues, datum, element, config) => {
      return { violin: { stroke: encodeValue } };
    })
    .registerChannelEncoder('density', (channel, encodeValue, encodeValues, datum, element, config) => {
      return { violin: { points: encodeValue } };
    })
    .registerDefaultEncoder(() => {
      return {
        violin: { fill: '#ff807f', stroke: '#ff0000' },
        shaft: { stroke: '#000000' },
        box: { fill: '#000000' },
        median: { fill: '#FFFFFF', visible: false }
      };
    });
  registerGlyphGraphic();
  registerPolygonGraphic();
  registerRuleGraphic();
  registerRectGraphic();
  registerSymbolGraphic();
};
