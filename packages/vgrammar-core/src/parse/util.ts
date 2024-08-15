import { isString, isFunction, isNil, array, Color } from '@visactor/vutils';
import type { IElement } from '../types/element';
import type {
  FunctionCallback,
  SignalDependency,
  SignalReference,
  IView,
  GenericFunctionType,
  SignalFunction,
  ParameterFunctionType,
  ParameterCallback,
  Nil
} from '../types';
import type { IGrammarBase } from '../types/grammar';

export function parseReference(dependency: SignalDependency | SignalDependency[], view: IView): IGrammarBase[] {
  const dependencies: SignalDependency[] = array(dependency);
  return dependencies.reduce((refs: IGrammarBase[], dep: string | IGrammarBase) => {
    const ref = (isString(dep) ? view.getGrammarById(dep as string) : dep) as IGrammarBase;

    if (ref) {
      refs.push(ref);
    }
    return refs;
  }, []);
}

function isSignalReferenceType(signal: any): signal is SignalReference {
  return !isFunction(signal) && !!(signal as SignalReference)?.signal;
}

function isSignalFunctionType<Callback extends FunctionCallback<T>, T>(
  signal: any
): signal is SignalFunction<Callback, T> {
  return !isFunction(signal) && !!(signal as SignalFunction<Callback, T>)?.callback;
}

export function parseFunctionType<Callback extends FunctionCallback<T>, T>(
  spec: GenericFunctionType<Callback, T> | Nil,
  view: IView
): IGrammarBase[] {
  if (isNil(spec)) {
    return [];
  }
  if (isSignalReferenceType(spec)) {
    const signal = spec.signal;
    if (isString(signal)) {
      return array<IGrammarBase>(view.getGrammarById(signal as string) as IGrammarBase);
    } else if ((signal as IGrammarBase)?.grammarType === 'signal') {
      return [signal as IGrammarBase];
    }
  } else if (isSignalFunctionType(spec)) {
    return parseReference((spec as SignalFunction<Callback, T>).dependency, view);
  }
  return [];
}

export function isFunctionType<Callback extends FunctionCallback<T>, T>(
  spec: any
): spec is Callback | SignalReference | SignalFunction<Callback, T> {
  return isFunction(spec) || spec?.signal || !!(spec as SignalFunction<Callback, T>)?.callback;
}

export function invokeFunctionType<Callback extends FunctionCallback<T>, T>(
  spec: GenericFunctionType<Callback, T> | Nil,
  parameters: any,
  datumOrGrammarInstance?: any | IGrammarBase,
  element?: IElement | any
): T {
  if (isNil(spec)) {
    return spec as T;
  }

  if (isFunction(spec)) {
    if (element) {
      return (spec as Callback).call(null, datumOrGrammarInstance, element, parameters);
    }
    return (spec as Callback).call(null, datumOrGrammarInstance, parameters);
  } else if ((spec as SignalReference).signal) {
    const signal = (spec as SignalReference).signal;
    if (isString(signal)) {
      return parameters?.[signal as string];
    }
    return (signal as IGrammarBase).output();
  } else if ((spec as SignalFunction<Callback, T>).callback) {
    if (element) {
      return (spec as SignalFunction<Callback, T>).callback.call(null, datumOrGrammarInstance, element, parameters);
    }
    return (spec as SignalFunction<Callback, T>).callback.call(null, datumOrGrammarInstance, parameters);
  }
  return spec as T;
}

export function invokeParameterFunctionType<T>(spec: ParameterFunctionType<T>, parameters: any): T {
  if (isNil(spec)) {
    return spec as T;
  }

  if (isFunction(spec)) {
    return spec.call(null, parameters);
  } else if ((spec as SignalReference).signal) {
    const signal = (spec as SignalReference).signal;
    if (isString(signal)) {
      return parameters?.[signal as string];
    }
    return (signal as IGrammarBase).output();
  } else if ((spec as SignalFunction<ParameterCallback<T>, T>).callback) {
    return (spec as SignalFunction<ParameterCallback<T>, T>).callback.call(null, parameters);
  }
  return spec as T;
}

export function getGrammarOutput(grammar: IGrammarBase | string, parameters: any) {
  return isGrammar(grammar) ? grammar.output() : parameters[grammar];
}

/**
 * 判断是否是依赖signal
 */
export function isSignal(obj: any) {
  return obj && (obj.signal || obj.callback);
}

export const isGrammar = (el: any): el is IGrammarBase => {
  return el && !isNil(el.grammarType);
};

export const parseField = <T>(field: ((datum: T) => symbol | string) | string | symbol) => {
  if (isFunction(field)) {
    return field as (datum: T) => symbol | string;
  }
  return (datum: T) => datum[field as string | symbol];
};

export const parseColor = (color: any): string | null => {
  if (isString(color) && Color.parseColorString(color)) {
    return color;
  }
  return null;
};
