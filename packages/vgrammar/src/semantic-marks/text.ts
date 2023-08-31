import { GrammarMarkType } from '../graph/enums';
import type { MarkSpec } from '../types';
import { Mark } from '../view/mark';
import { createGraphicItem } from '../graph/util/graphic';

export class Text extends Mark {
  declare markType: GrammarMarkType.text;
  protected declare spec: MarkSpec;

  addGraphicItem(initAttrs: any, groupKey?: string) {
    const textConfig = initAttrs?.text;
    const graphicItem = createGraphicItem(
      this,
      textConfig?.type === 'rich' ? GrammarMarkType.richtext : GrammarMarkType.text,
      initAttrs
    );

    return super.addGraphicItem(initAttrs, groupKey, graphicItem);
  }

  release(): void {
    super.release();
  }
}
