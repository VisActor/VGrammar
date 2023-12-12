import type { ElementFilterOptions, IElement } from '../types';

export const generateFilterValue = (options: ElementFilterOptions) => {
  if (options.filterField) {
    return (el: IElement) => {
      return el.getDatum()?.[options.filterField];
    };
  }

  return (el: IElement) => {
    return el[options.filterType];
  };
};
