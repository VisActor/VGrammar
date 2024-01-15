import type { ElementFilterOptions, IElement, IMark, MarkSpec } from '../types';

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

export const groupMarksByState = (marks: IMark[], states: string[]): Record<string, IMark[]> => {
  if (!states || !marks) {
    return null;
  }

  const res = {};

  marks.forEach(mark => {
    const encode = (mark.getSpec() as MarkSpec).encode;

    if (!encode) {
      return;
    }

    states.forEach(state => {
      if (state && encode[state]) {
        if (!res[state]) {
          res[state] = [];
        }

        res[state].push(mark);
      }
    });
  });

  return res;
};
