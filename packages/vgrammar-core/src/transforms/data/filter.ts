import type { FilterTransformOption } from '../../types';

export const transform = (options: FilterTransformOption, data: any[], parameters?: any) => {
  return data.filter(entry => {
    return options.callback(entry, parameters);
  });
};
