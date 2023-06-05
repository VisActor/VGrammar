import { array } from '@visactor/vutils';
import type { IGrammarBase, IView, MarkFunctionType, ScaleEncodeType, FieldEncodeType } from '../types';
import { isGrammar, parseFunctionType } from './util';

export function isScaleEncode(encode: any): encode is ScaleEncodeType {
  return !!encode?.scale;
}

export function isFieldEncode(encode: any): encode is FieldEncodeType {
  return !!encode?.field;
}

export function parseEncodeType(encoder: MarkFunctionType<any> | ScaleEncodeType, view: IView): IGrammarBase[] {
  if (!encoder) {
    return [];
  }
  let dependencies: IGrammarBase[] = [];
  if (encoder.scale) {
    if (isGrammar(encoder.scale)) {
      dependencies = [encoder.scale];
    } else {
      dependencies = array(view.getScaleById(encoder.scale) as IGrammarBase);
    }
  }
  return dependencies.concat(parseFunctionType(encoder, view));
}
