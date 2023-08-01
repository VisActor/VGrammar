import type { ITransform } from './types/transform';
// -- Transforms -----
import { registerTransform } from './transforms/register';
import { transforms } from './transforms/index';

export const registerTransforms = (...transformMaps: Record<string, Omit<ITransform, 'type'>>[]) => {
  transformMaps.forEach(transformMap => {
    Object.keys(transformMap).forEach(key => {
      registerTransform(key, transformMap[key], true);
    });
  });
};
export const basicTransforms = transforms;
export const registerBasicTransforms = () => {
  registerTransforms(transforms);
};

// 这个是有副作用的代码，打包的时候会去掉
registerBasicTransforms();

// -- Exports -----

export const version = __VERSION__;

export * as Util from '@visactor/vgrammar-util';

export * from './graph';
export * from './glyph';
export * from './component';

export { registerTransform, getTransform, unregisterTransform, getAllTransforms } from './transforms/register';
export { View } from './view';
export { parseFunctionType, invokeFunctionType } from './parse/util';
export { GrammarBase } from './view/grammar-base';
export { registerAnimationType, unregisterAnimationType } from './view/register-animation';
export { registerComponent, unregisterComponent, unregisterAllComponents } from './view/register-component';
export { registerGlyph, unregisterGlyph, unregisterAllGlyphs } from './view/register-glyph';
export { registerGrammar, unregisterGrammar, unregisterAllGrammars } from './view/register-grammar';
export * from './types';

export { Plot } from './plot/plot-all';
