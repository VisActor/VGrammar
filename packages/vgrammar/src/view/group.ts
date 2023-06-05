import { transformsByType } from '../graph/attributes';
import { DefaultMarkData } from '../graph/constants';
import { GrammarMarkType } from '../graph/enums';
import type { IGlyphMark, IGroupMark, IMark, IView } from '../types';
import { Mark } from './mark';

export class GroupMark extends Mark implements IGroupMark {
  children: (IMark | IGroupMark | IGlyphMark)[];

  layoutChildren?: (IMark | IGroupMark | IGlyphMark)[];

  constructor(view: IView, group?: IGroupMark) {
    super(view, GrammarMarkType.group, group);
    this.children = [];
  }

  appendChild(mark: IMark) {
    this.children.push(mark);
    return this;
  }
  removeChild(mark: IMark) {
    this.children = this.children.filter(child => child !== mark);
    return this;
  }

  updateLayoutChildren() {
    if (!this.children.length) {
      return this;
    }
    if (!this.layoutChildren) {
      this.layoutChildren = [];
    }

    this.layoutChildren = this.children.filter(child => child.needLayout());

    return this;
  }

  getAttributeTransforms() {
    return transformsByType.rect;
  }

  protected evaluateJoin(data: any[]) {
    // group mark do not support data join
    return super.evaluateJoin(DefaultMarkData);
  }
}
