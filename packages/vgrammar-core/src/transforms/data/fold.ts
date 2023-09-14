import type { FoldTransformOptions } from '../../types';

export const transform = (options: FoldTransformOptions, upstreamData: any[]) => {
  if (!upstreamData || !upstreamData.length) {
    return [];
  }

  const { fields, asKey = 'key', asValue = 'value', retains } = options;
  const results: any[] = [];

  for (let i = 0, len = upstreamData.length; i < len; i++) {
    const entry = upstreamData[i];
    fields.forEach((field: string) => {
      const item = {};

      if (retains) {
        retains.forEach(retain => {
          item[retain] = entry[retain];
        });
      } else {
        for (const prop in entry) {
          if (fields.indexOf(prop) === -1) {
            item[prop] = entry[prop];
          }
        }
      }

      item[asKey] = field;
      item[asValue] = entry[field];

      results.push(item);
    });
  }
  return results;
};
