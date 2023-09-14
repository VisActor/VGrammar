import { isNil, Logger } from '@visactor/vutils';
import type { FieldGetterFunction } from '@visactor/vgrammar-util';
import { field as getFieldAccessor } from '@visactor/vgrammar-util';
import type { JoinTransformOption } from '../../types';

export const transform = (options: JoinTransformOption, data: any[]) => {
  const logger = Logger.getInstance();
  let as = options.as;
  const { fields, from, key, values } = options;
  const keyAccessor = getFieldAccessor(key);
  const indexMap = (from || []).reduce((map: any, tuple: any) => {
    map[keyAccessor(tuple)] = tuple;
    return map;
  }, {});
  const defaultValue = isNil(options.default) ? null : options.default;
  const fieldAccessors = fields.map(field => getFieldAccessor(field));

  if (values) {
    if (fields.length > 1 && !as) {
      logger.error('Multi-field lookup requires explicit "as" parameter.');
    }
    if (as && as.length !== fields.length * values.length) {
      logger.error('The "as" parameter has too few output field names.');
    }

    if (isNil(as)) {
      as = values;
    }
    const valuesAccessors = values.map(value => getFieldAccessor(value));

    return data.map((entry: any) => {
      return fieldAccessors.reduce((res: any, fieldAccessor: FieldGetterFunction, fieldIndex: number) => {
        const value = indexMap[fieldAccessor(entry)];
        const valuesLength = values.length;
        const asValues = isNil(value)
          ? valuesAccessors.map((valuesAccessor: FieldGetterFunction) => defaultValue)
          : valuesAccessors.map((valuesAccessor: FieldGetterFunction) => valuesAccessor(value));

        return asValues.reduce((asRes: any, asValue: any, asIndex: number) => {
          asRes[as[fieldIndex * valuesLength + asIndex]] = asValue;

          return asRes;
        }, res);
      }, entry);
    });
  }
  if (!as) {
    logger.error('Missing output field names.');
  }

  return data.map((entry: any) => {
    return fieldAccessors.reduce((res: any, fieldAccessor: FieldGetterFunction, fieldIndex: number) => {
      const value = indexMap[fieldAccessor(entry)];

      res[as[fieldIndex]] = isNil(value) ? defaultValue : value;

      return res;
    }, entry);
  });
};
