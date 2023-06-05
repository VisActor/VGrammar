import type { IElement, IGlyphMark, IMark } from '../../types';
import { GrammarMarkType } from '../enums';
import { Element } from '../element';
import { GlyphElement } from '../glyph-element';

export const createElement = (mark: IMark): IElement => {
  if (mark.markType === GrammarMarkType.glyph) {
    return new GlyphElement(mark as IGlyphMark);
  }
  return new Element(mark);
};
