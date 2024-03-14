import type { INode } from '@visactor/vrender-core';
import { transformsByType } from '../graph/attributes';
import { DefaultKey, DefaultMarkData } from '../graph/constants';
import { BuiltInEncodeNames, GrammarMarkType, HOOK_EVENT } from '../graph/enums';
import { createElement } from '../graph/util/element';
import { createGraphicItem } from '../graph/util/graphic';
import type { IElement, IGlyphMark, IGroupMark, IMark, IView } from '../types';
import { Mark } from './mark';
import { isFunction, isNil } from '@visactor/vutils';

export class GroupMark extends Mark implements IGroupMark {
  children: (IMark | IGroupMark | IGlyphMark)[];

  layoutChildren?: (IMark | IGroupMark | IGlyphMark)[];

  constructor(view: IView, group?: IGroupMark) {
    super(view, GrammarMarkType.group, group);
    this.children = [];
  }

  parseRenderContext() {
    return { large: false };
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

  protected evaluateEncode(elements: IElement[], encoders: any, parameters: any, noGroupEncode?: boolean) {
    const spec = this.spec;
    const initAttrs: any = {};

    if (!isNil(spec.clip)) {
      initAttrs.clip = spec.clip;
    }

    if (!isNil(spec.zIndex)) {
      initAttrs.zIndex = spec.zIndex;
    }

    if (!isNil(spec.clipPath)) {
      initAttrs.path = isFunction(spec.clipPath) ? spec.clipPath(elements) : spec.clipPath;
    }

    if (encoders) {
      this.emit(HOOK_EVENT.BEFORE_ELEMENT_ENCODE, { encoders, parameters }, this);

      const groupEncodeAttrs = noGroupEncode
        ? null
        : this.evaluateGroupEncode(elements, encoders[BuiltInEncodeNames.group], parameters);

      elements.forEach(element => {
        element.items.forEach(item => {
          item.nextAttrs = Object.assign(item.nextAttrs, initAttrs, groupEncodeAttrs);
        });

        element.encodeItems(element.items, encoders, this._isReentered, parameters);
      });

      this._isReentered = false;

      this.evaluateTransform(this._getTransformsAfterEncodeItems(), elements, parameters);

      elements.forEach(element => {
        element.encodeGraphic();
      });
      this.emit(HOOK_EVENT.AFTER_ELEMENT_ENCODE, { encoders, parameters }, this);
    } else {
      elements.forEach(element => {
        element.initGraphicItem(initAttrs);
      });
    }
  }

  addGraphicItem(attrs: any, groupKey?: string, newGraphicItem?: any) {
    const graphicItem: any = newGraphicItem ?? createGraphicItem(this, this.markType, attrs);

    if (!graphicItem) {
      return;
    }

    this.emit(HOOK_EVENT.BEFORE_ADD_VRENDER_MARK, { graphicItem });

    graphicItem.name = `${this.id() || this.markType}`;

    this.graphicParent.insertIntoKeepIdx(graphicItem as unknown as INode, this.graphicIndex);
    this.emit(HOOK_EVENT.AFTER_ADD_VRENDER_MARK, { graphicItem });

    return graphicItem;
  }
}
