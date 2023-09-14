import { GrammarMarkType } from '../graph/enums';
import type { IGlyphMark, IGroupMark, IView, GlyphMarkSpec, IGlyphMeta } from '../types';
import { createGlyphGraphicItem } from '../graph/util/graphic';
import { Mark } from './mark';
import { Factory } from '../core/factory';

export class GlyphMark extends Mark implements IGlyphMark {
  protected declare spec: GlyphMarkSpec;
  declare markType: GrammarMarkType.glyph;
  readonly glyphType: string;

  private glyphMeta: IGlyphMeta;

  constructor(view: IView, glyphType: string, group?: IGroupMark) {
    super(view, GrammarMarkType.glyph, group);
    this.glyphType = glyphType;
    this.glyphMeta = Factory.getGlyph(glyphType);
  }

  configureGlyph(config: any) {
    this.spec.glyphConfig = config;
    this.commit();
    return this;
  }

  getGlyphMeta() {
    return this.glyphMeta;
  }

  getGlyphConfig() {
    return this.spec.glyphConfig;
  }

  addGraphicItem(attrs: any, groupKey?: string) {
    const graphicItem = createGlyphGraphicItem(this, this.glyphMeta, attrs);
    return super.addGraphicItem(attrs, groupKey, graphicItem);
  }
}
