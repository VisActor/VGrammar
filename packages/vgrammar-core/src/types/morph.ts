import type { EasingType } from '@visactor/vrender-core';
import type { DiffResult, Nil } from './base';
import type { IElement } from './element';
import type { IGrammarBase, IMark } from './grammar';
import type { GenericFunctionType } from './signal';
import type { IRunningConfig } from './view';

export type MorphData = { prev: any[]; next: any[] };
export type MorphElements = { prev: IElement[]; next: IElement[] };

export type MorphFunctionCallback<T> = (datum: MorphData, element: MorphElements, parameters: any) => T;

export type MorphFunctionType<T> = GenericFunctionType<MorphFunctionCallback<T>, T>;

export type MorphFunctionValueType<T> = MorphFunctionType<T> | T;

export interface IMorphAnimationConfig {
  easing?: EasingType;
  delay?: MorphFunctionValueType<number>;
  duration?: MorphFunctionValueType<number>;
  oneByOne?: MorphFunctionValueType<boolean | number>;
  splitPath?: MorphFunctionValueType<'clone' | Nil>;
}

export interface IMorph {
  diffGrammar: <U extends IGrammarBase>(prevGrammars: U[], nextGrammars: U[]) => DiffResult<U, U>;
  diffMark: (prevMarks: IMark[], nextMarks: IMark[], runningConfig: IRunningConfig) => DiffResult<IMark[], IMark[]>;

  morph: (prevMarks: IMark[], nextMarks: IMark[], runningConfig: IRunningConfig) => void;
}
