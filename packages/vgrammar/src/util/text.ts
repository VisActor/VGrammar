import type { IRichText, IRichTextCharacter } from '@visactor/vrender';
import { xul as vRenderXul, RichText } from '@visactor/vrender';

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

export function richJsx(richText: IRichText | { children?: IRichTextCharacter[] }) {
  return {
    type: 'rich',
    text: richText instanceof RichText ? richText.attribute.textConfig : richText.children
  };
}

export function textHtml(strings: TemplateStringsArray, ...insertVars: (string | number)[]) {
  return {
    type: 'html',
    text: strings.reduce((res, temp, i) => {
      return res + temp + (i >= insertVars.length ? '' : insertVars[i]);
    }, '')
  };
}
