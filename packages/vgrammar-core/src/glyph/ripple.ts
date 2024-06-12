import type { IElement, RipplePointEncoderSpec } from '../types';
import { Factory } from '../core/factory';
import { registerGlyphGraphic, registerSymbolGraphic } from '../graph/mark/graphic';
import { registerGlyphMark } from '../view/glyph';

export const registerRippleGlyph = () => {
  Factory.registerGlyph<RipplePointEncoderSpec>('ripplePoint', {
    symbol: 'symbol',
    ripple0: 'symbol',
    ripple1: 'symbol',
    ripple2: 'symbol'
  })
    .registerFunctionEncoder((encodeValues: RipplePointEncoderSpec, datum: any, element: IElement, config: any) => {
      // ripple value should be between 0 and 1
      const ripple = Math.max(0, Math.min(encodeValues.ripple, 1));
      const size = encodeValues.size ?? element.getGraphicAttribute('size');
      const rippleSize = size * 0.5;
      return {
        ripple0: { size: size + rippleSize * ripple, fillOpacity: 0.75 - ripple * 0.25 },
        ripple1: { size: size + rippleSize * (1 + ripple), fillOpacity: 0.5 - ripple * 0.25 },
        ripple2: { size: size + rippleSize * (2 + ripple), fillOpacity: 0.25 - ripple * 0.25 }
      };
    })
    .registerDefaultEncoder(() => {
      return {
        ripple0: { fillOpacity: 0.75 },
        ripple1: { fillOpacity: 0.5 },
        ripple2: { fillOpacity: 0.25 }
      };
    });
  registerGlyphMark();
  registerGlyphGraphic();
  registerSymbolGraphic();
};
