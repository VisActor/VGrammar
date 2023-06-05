import type { FieldGetterFunction } from '@visactor/vgrammar-util';
import { field as getFieldAccessor } from '@visactor/vgrammar-util';
import { isString } from '@visactor/vutils';
import { fieldNames } from '../util/util';

interface ProjectOptions {
  as?: string[];
  fields: string[] | FieldGetterFunction[];
}

function project(source: any, fields: FieldGetterFunction[], as: string[]) {
  return fields.reduce((res: any, field: FieldGetterFunction, index: number) => {
    res[as[index]] = field(source);

    return res;
  }, {});
}

export const transform = (options: ProjectOptions, upstreamData: any[]) => {
  const { fields = [] } = options;
  const as = fieldNames(fields, options.as || []);
  const fieldsAccessors = fields.map(field =>
    isString(field) ? getFieldAccessor(field) : field
  ) as FieldGetterFunction[];

  return fieldsAccessors.length
    ? upstreamData.map((entry, index) => {
        return project(entry, fieldsAccessors, as);
      })
    : upstreamData.map((entry, index) => {
        return {};
      });
};
