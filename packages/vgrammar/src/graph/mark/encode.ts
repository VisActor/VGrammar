import { isNil, isNumber, isString } from '@visactor/vutils';
import { field as getFieldAccessor } from '@visactor/vgrammar-util';
import type { BaseSignleEncodeSpec, IElement, MarkElementItem } from '../../types';
import { isFieldEncode, isScaleEncode } from '../../parse/mark';
import { getGrammarOutput, invokeFunctionType, isFunctionType } from '../../parse/util';
import { getGlyph } from '../../view/register-glyph';
import { isPositionOrSizeChannel } from '../attributes';
import { GrammarMarkType } from '../enums';
import { ScaleEnum } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import type { IBandLikeScale, IBaseScale } from '@visactor/vscale';

/**
 * invoke encoder for multiple items
 */
export function invokeEncoderToItems(
  element: IElement,
  items: MarkElementItem[],
  encoder: BaseSignleEncodeSpec,
  parameters: any,
  onlyFullEncodeFirst?: boolean
) {
  if (!encoder) {
    return;
  }

  if (isFunctionType(encoder)) {
    items.forEach(item => {
      const attributes = invokeFunctionType(encoder, parameters, item.datum, element);
      Object.assign(item.nextAttrs, attributes);
    });
  } else {
    Object.keys(encoder).forEach(channel => {
      const encode = encoder[channel];
      const encodeItems =
        onlyFullEncodeFirst && !isPositionOrSizeChannel(element.mark.markType, channel) ? [items[0]] : items;

      if (isScaleEncode(encode)) {
        const scale = getGrammarOutput(encode.scale, parameters);
        const offset = encode?.offset ?? 0;
        const bandOffset = !isNil(encode.band) && scale.bandwidth ? scale.bandwidth() * encode.band : null;
        const hasField = isString(encode?.field);
        const fieldAccessor = hasField ? getFieldAccessor(encode.field) : null;

        let to = hasField ? null : !isNil(encode?.value) ? scale.scale?.(encode.value) : 0;

        encodeItems.forEach(item => {
          if (hasField) {
            to = scale.scale?.(fieldAccessor(item.datum));
          }
          item.nextAttrs[channel] = isNumber(to) || isNumber(bandOffset) ? to + offset + bandOffset : to;
        });
      } else if (isFieldEncode(encode)) {
        const fieldAccessor = getFieldAccessor(encode.field);

        encodeItems.forEach(item => {
          item.nextAttrs[channel] = fieldAccessor(item.datum);
        });
      } else {
        encodeItems.forEach(item => {
          item.nextAttrs[channel] = invokeFunctionType(encode, parameters, item.datum, element);
        });
      }
    });
  }
}

/**
 * invoke encoder for single item
 * use invokeEncoderToItems instead if item amount is large
 */
export function invokeEncoder(encoder: BaseSignleEncodeSpec, datum: any, element: IElement, parameters: any) {
  if (!encoder) {
    return null;
  }
  if (isFunctionType(encoder)) {
    return invokeFunctionType(encoder, parameters, datum, element);
  }
  const attributes: any = {};
  Object.keys(encoder).forEach(channel => {
    const encode = encoder[channel];

    if (isScaleEncode(encode)) {
      const scale = getGrammarOutput(encode.scale, parameters);
      const offset = encode?.offset ?? 0;
      const bandOffset = !isNil(encode.band) && scale.bandwidth ? scale.bandwidth() * encode.band : null;
      const hasField = isString(encode?.field);
      const fieldAccessor = hasField ? getFieldAccessor(encode.field) : null;
      const to = hasField
        ? scale.scale?.(fieldAccessor(datum))
        : !isNil(encode?.value)
        ? scale.scale?.(encode.value)
        : 0;

      attributes[channel] = isNumber(to) || isNumber(bandOffset) ? to + offset + bandOffset : to;
    } else if (isFieldEncode(encode)) {
      const fieldAccessor = getFieldAccessor(encode.field);
      attributes[channel] = fieldAccessor(datum);
    } else {
      attributes[channel] = invokeFunctionType(encode, parameters, datum, element);
    }
  });
  return attributes;
}

export function splitEncoderInLarge(markType: string, encoder: BaseSignleEncodeSpec, glyphType?: string) {
  // function encoder can not be splitted
  if (isFunctionType(encoder)) {
    return { themeEncoder: {}, positionEncoder: encoder };
  }

  const themeEncoder = {};
  const positionEncoder = {};

  if (markType === GrammarMarkType.glyph && getGlyph(glyphType)) {
    const glyphMeta = getGlyph(glyphType);
    const progressiveChannels = glyphMeta.getProgressiveChannels();
    if (progressiveChannels) {
      Object.keys(encoder).forEach(channel => {
        if (progressiveChannels.includes(channel)) {
          positionEncoder[channel] = encoder[channel];
        } else {
          themeEncoder[channel] = encoder[channel];
        }
      });
    } else {
      const markTypes = Array.from(new Set(Object.values(glyphMeta.getMarks())));
      Object.keys(encoder).forEach(channel => {
        if (markTypes.some(type => isPositionOrSizeChannel(type, channel))) {
          positionEncoder[channel] = encoder[channel];
        } else {
          themeEncoder[channel] = encoder[channel];
        }
      });
    }
  } else {
    Object.keys(encoder).forEach(channel => {
      if (isPositionOrSizeChannel(markType, channel)) {
        positionEncoder[channel] = encoder[channel];
      } else {
        themeEncoder[channel] = encoder[channel];
      }
    });
  }

  return { positionEncoder, themeEncoder };
}

export function isBandLikeScale(scale: IBaseScale) {
  return scale && (scale.type === ScaleEnum.Band || scale.type === ScaleEnum.Point);
}

export function getBandWidthOfScale(scale: IBaseScale) {
  if (!scale) {
    return undefined;
  }

  return scale.type === ScaleEnum.Band
    ? (scale as IBandLikeScale).bandwidth()
    : scale.type === ScaleEnum.Point
    ? (scale as IBandLikeScale).step()
    : undefined;
}
