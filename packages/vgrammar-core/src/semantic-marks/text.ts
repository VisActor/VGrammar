import { GrammarMarkType } from '../graph/enums';
import type { IMark, MarkSpec } from '../types';
import { Mark } from '../view/mark';
import { createGraphicItem } from '../graph/util/graphic';
import { transformsByType } from '../graph/attributes';

export class Text extends Mark {
  declare markType: GrammarMarkType.text;
  protected declare spec: MarkSpec;

  addGraphicItem(initAttrs: any, groupKey?: string) {
    const textConfig = initAttrs?.text;
    const isRich = textConfig?.type === 'rich';
    const graphicItem = createGraphicItem(
      this as IMark,
      isRich ? GrammarMarkType.richtext : GrammarMarkType.text,
      initAttrs
    );

    if (isRich) {
      initAttrs.textConfig = [];
    }

    return super.addGraphicItem(initAttrs, groupKey, graphicItem);
  }

  getAttributeTransforms() {
    return this.getGroupGraphicItem()?.type === 'richtext' ? transformsByType.richtext : transformsByType.text;
  }

  release(): void {
    super.release();
  }
}
