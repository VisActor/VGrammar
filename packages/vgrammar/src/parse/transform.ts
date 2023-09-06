import { isArray, isFunction, isNil } from '@visactor/vutils';
import { Factory } from '../core/factory';
import type { IGrammarBase, IGrammarTask, IView, TransformSpec, TransformSpecValue } from '../types';
import { isSignal, parseFunctionType, parseReference } from './util';

const parseSimpleOptionValue = (key: string, transformSpecValue: TransformSpecValue, view: IView) => {
  if (key === 'callback' && isFunction(transformSpecValue)) {
    return {
      references: [],
      value: {
        callback: transformSpecValue,
        dependency: []
      }
    };
  }

  if (!isNil((transformSpecValue as TransformSpecValue).data)) {
    // { data: 'someData' }
    const grammarInstance = view.getDataById((transformSpecValue as TransformSpecValue).data);
    return {
      references: [grammarInstance],
      value: grammarInstance
    };
  }

  if (!isNil((transformSpecValue as TransformSpecValue).customized)) {
    // { customized: 'proj' }
    const grammarInstance = view.getCustomizedById((transformSpecValue as TransformSpecValue).customized);
    return {
      references: [grammarInstance],
      value: grammarInstance
    };
  }

  if (!isNil((transformSpecValue as TransformSpecValue).scale)) {
    // { scale: 'scaleX' }
    const grammarInstance = view.getScaleById((transformSpecValue as TransformSpecValue).scale);
    return {
      references: [grammarInstance],
      value: grammarInstance
    };
  }

  if (isSignal(transformSpecValue)) {
    const references = parseFunctionType(transformSpecValue, view);

    return {
      references,
      value: transformSpecValue.callback
        ? {
            value: transformSpecValue.callback,
            dependency: references
          }
        : references?.[0] ?? transformSpecValue
    };
  }

  return { value: transformSpecValue };
};

const parseTransformOption = (key: string, transformSpecValue: TransformSpecValue, view: IView) => {
  if (isNil(transformSpecValue)) {
    return { value: transformSpecValue };
  }

  if (isArray(transformSpecValue)) {
    const values = transformSpecValue.map((v: any) => parseSimpleOptionValue(key, v, view));

    return {
      references: values.reduce((res: any[], val: any) => {
        if (val.references) {
          res.concat(val.references);
        }

        return res;
      }, []),
      value: values.map((entry: any) => entry.value)
    };
  }

  return parseSimpleOptionValue(key, transformSpecValue, view);
};

const parseTransform = (transformSpec: TransformSpec, view: IView) => {
  const transformDef = Factory.getTransform(transformSpec.type);

  if (!transformDef) {
    return;
  }

  const options = {};
  let references: IGrammarBase[] = [];

  Object.keys(transformSpec).forEach(specKey => {
    // we dont need to parse type
    if (specKey === 'type') {
      return;
    }

    const specValue = transformSpec[specKey];
    if (specKey === 'dependency') {
      if (specValue?.length) {
        references = references.concat(parseReference(specValue, view));
      }
      return;
    }
    const res = parseTransformOption(specKey, specValue, view);

    if (res) {
      if (res.references?.length) {
        references = references.concat(res.references);
      }

      options[specKey] = res.value;
    }
  });

  return {
    markPhase: transformDef.markPhase,
    transform: transformDef.transform,
    canProgressive: transformDef.canProgressive,
    type: transformDef.type,
    options,
    references
  };
};

export const parseTransformSpec = (spec: TransformSpec[], view: IView) => {
  if (spec?.length) {
    const transforms: IGrammarTask[] = [];
    let refs: IGrammarBase[] = [];
    spec.forEach(transformSpec => {
      const transform = parseTransform(transformSpec, view);

      if (transform) {
        if (transform.references?.length) {
          refs = refs.concat(transform.references);
        }

        transforms.push(transform);
      }
    });
    return { transforms, refs };
  }

  return null;
};
