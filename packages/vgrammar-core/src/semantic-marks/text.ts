import { GrammarMarkType } from '../graph/enums';
import type { IMark, MarkSpec } from '../types';
import { Mark } from '../view/mark';
import { createGraphicItem } from '../graph/util/graphic';

export class Text extends Mark {
  static markType = GrammarMarkType.text;
  declare markType: GrammarMarkType.text;
  protected declare spec: MarkSpec;

  addGraphicItem(initAttrs: any, groupKey?: string) {
    const originalAttrs = initAttrs && initAttrs.limitAttrs;

    const isRich =
      originalAttrs &&
      (originalAttrs.textType === 'rich' || (originalAttrs.text && originalAttrs.text.type === 'rich'));

    const graphicItem = createGraphicItem(
      this as IMark,
      isRich ? GrammarMarkType.richtext : GrammarMarkType.text,
      initAttrs
    );

    return super.addGraphicItem(initAttrs, groupKey, graphicItem);
  }

  release(): void {
    super.release();
  }
}
