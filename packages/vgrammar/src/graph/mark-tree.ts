import type { IGroupMark, IMark } from '../types';
import { GrammarMarkType } from './enums';

export const traverseMarkTree = (
  rootMark: IMark,
  childrenKey: 'children' | 'layoutChildren',
  apply: (mark: IMark) => any,
  filter?: (mark: IMark) => boolean,
  leafFirst?: boolean
) => {
  const traverse = (mark: IMark) => {
    if (!leafFirst) {
      if (mark && (!filter || filter(mark))) {
        apply.call(null, mark);
      }
    }

    if (mark.markType === GrammarMarkType.group) {
      const children: IMark[] = (mark as IGroupMark)[childrenKey];

      if (children) {
        children.forEach(child => {
          traverse(child);
        });
      }
    }

    if (leafFirst) {
      if (mark && (!filter || filter(mark))) {
        apply.call(null, mark);
      }
    }
  };

  traverse(rootMark);
};
