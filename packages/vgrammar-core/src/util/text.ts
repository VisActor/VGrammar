import type { IRichText, IRichTextCharacter } from '@visactor/vrender-core';
import { xul as vRenderXul, RichText } from '@visactor/vrender-core';
import { isArray } from '@visactor/vutils';

export function richXul(strings: TemplateStringsArray, ...insertVars: (string | number)[]) {
  return {
    type: 'rich',
    text: vRenderXul(
      strings.reduce((res, temp, i) => {
        return res + temp + (i >= insertVars.length ? '' : insertVars[i]);
      }, '')
    )
  };
}

export function richJsx(
  richText: IRichText | { attribute: IRichTextCharacter; type: string }[] | IRichTextCharacter[]
) {
  return {
    type: 'rich',
    text:
      richText instanceof RichText
        ? richText.attribute.textConfig
        : isArray(richText)
        ? richText.map(entry => {
            return (entry as { attribute: IRichTextCharacter; type: string }).type
              ? (entry as { attribute: IRichTextCharacter; type: string }).attribute
              : entry;
          })
        : []
  };
}
