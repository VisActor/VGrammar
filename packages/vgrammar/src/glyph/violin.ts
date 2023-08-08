import { isValidNumber } from '@visactor/vutils';
import type { IGlyphElement, ViolinEncoderSpec } from '../types';
import { registerGlyph } from '../view/register-glyph';

const encodeViolinSize = (encodeValues: any, datum: any, element: IGlyphElement, config: any) => {
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

  if (config?.direction === 'horizontal') {
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
  registerGlyph<ViolinEncoderSpec>('violin', {
    violin: 'polygon',
    shaft: 'rule',
    box: 'rect',
    median: 'symbol'
  })
    .registerFunctionEncoder(encodeViolinSize)
    .registerChannelEncoder('x', (channel, encodeValue, encodeValues, datum, element, config) => {
      if (config?.direction === 'horizontal') {
        return null;
      }
      return {
        shaft: { x: encodeValue, x1: encodeValue }
      };
    })
    .registerChannelEncoder('y', (channel, encodeValue, encodeValues, datum, element, config) => {
      if (!(config?.direction === 'horizontal')) {
        return null;
      }
      return {
        shaft: { y: encodeValue, y1: encodeValue }
      };
    })
    .registerChannelEncoder('q1', (channel, encodeValue, encodeValues, datum, element, config) => {
      return config?.direction === 'horizontal' ? { box: { x: encodeValue } } : { box: { y: encodeValue } };
    })
    .registerChannelEncoder('q3', (channel, encodeValue, encodeValues, datum, element, config) => {
      return config?.direction === 'horizontal' ? { box: { x1: encodeValue } } : { box: { y1: encodeValue } };
    })
    .registerChannelEncoder('min', (channel, encodeValue, encodeValues, datum, element, config) => {
      return config?.direction === 'horizontal' ? { shaft: { x: encodeValue } } : { shaft: { y: encodeValue } };
    })
    .registerChannelEncoder('max', (channel, encodeValue, encodeValues, datum, element, config) => {
      return config?.direction === 'horizontal' ? { shaft: { x1: encodeValue } } : { shaft: { y1: encodeValue } };
    })
    .registerChannelEncoder('median', (channel, encodeValue, encodeValues, datum, element, config) => {
      return config?.direction === 'horizontal'
        ? { median: { x: encodeValue, x1: encodeValue, visible: true } }
        : { median: { y: encodeValue, y1: encodeValue, visible: true } };
    })
    .registerChannelEncoder('angle', (channel, encodeValue, encodeValues, datum, element, config) => {
      const defaultAnchor =
        config?.direction === 'horizontal'
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
};
