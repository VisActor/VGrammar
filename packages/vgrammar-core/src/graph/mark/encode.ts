import { isNil, isNumber, isString } from '@visactor/vutils';
import { field as getFieldAccessor } from '@visactor/vgrammar-util';
import type { BaseSingleEncodeSpec, IElement, MarkElementItem } from '../../types';
import { isFieldEncode, isScaleEncode } from '../../parse/mark';
import { getGrammarOutput, invokeFunctionType, isFunctionType } from '../../parse/util';

/**
 * invoke encoder for multiple items
 */
export function invokeEncoderToItems(
  element: IElement,
  items: MarkElementItem[],
  encoder: BaseSingleEncodeSpec,
  parameters: any
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

      if (isScaleEncode(encode)) {
        const scale = getGrammarOutput(encode.scale, parameters);
        const offset = encode?.offset ?? 0;
        const bandOffset = !isNil(encode.band) && scale.bandwidth ? scale.bandwidth() * encode.band : null;
        const hasField = isString(encode?.field);
        const fieldAccessor = hasField ? getFieldAccessor(encode.field) : null;

        let to = hasField ? null : !isNil(encode?.value) ? scale.scale?.(encode.value) : 0;

        items.forEach(item => {
          if (hasField) {
            to = scale.scale?.(fieldAccessor(item.datum));
          }
          item.nextAttrs[channel] = isNumber(to) || isNumber(bandOffset) ? to + offset + bandOffset : to;
        });
      } else if (isFieldEncode(encode)) {
        const fieldAccessor = getFieldAccessor(encode.field);

        items.forEach(item => {
          item.nextAttrs[channel] = fieldAccessor(item.datum);
        });
      } else {
        items.forEach(item => {
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
export function invokeEncoder(encoder: BaseSingleEncodeSpec, datum: any, element: IElement, parameters: any) {
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
