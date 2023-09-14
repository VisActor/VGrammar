import { transformsByType } from '../graph/attributes';
import { DefaultKey, DefaultMarkData } from '../graph/constants';
import { GrammarMarkType } from '../graph/enums';
import { createElement } from '../graph/util/element';
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

  includesChild(mark: IMark, descendant: boolean = true) {
    if (this.children.includes(mark)) {
      return true;
    }
    if (!descendant) {
      return false;
    }
    return this.children.some(child => {
      if (child.markType === GrammarMarkType.group) {
        return (child as IGroupMark).includesChild(mark, true);
      }
      return false;
    });
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
    if (!this.elements.length) {
      const el = createElement(this);

      el.updateData(DefaultKey, DefaultMarkData, () => '', this.view);
      this.elements = [el];
      this.elementMap.set(DefaultKey, el);
    }
  }
}
