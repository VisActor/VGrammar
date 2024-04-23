import { array, isNumber, isString } from '@visactor/vutils';
import type { ElementFilterOptions, ElementSelectTriggerOff, EventType, IElement, IMark, MarkSpec } from '../types';

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
    const markSpec = (mark && mark.getSpec()) as MarkSpec;
    const encode = markSpec && markSpec.encode;

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

export const parseTriggerOffOfSelect = (triggerOff: ElementSelectTriggerOff | ElementSelectTriggerOff[]) => {
  const triggerOffArray = array(triggerOff);
  const resetType: ('view' | 'self' | 'timeout')[] = [];
  const eventNames: EventType[] = [];

  triggerOffArray.forEach(off => {
    if (off === 'empty') {
      resetType.push('view');
    } else if (isString(off) && off !== 'none') {
      if ((off as string).includes('view:')) {
        eventNames.push((off as string).replace('view:', '') as EventType);

        resetType.push('view');
      } else {
        eventNames.push(off as EventType);

        resetType.push('self');
      }
    } else if (isNumber(off)) {
      resetType.push('timeout');
    }
  });

  return {
    eventNames,
    resetType
  };
};
