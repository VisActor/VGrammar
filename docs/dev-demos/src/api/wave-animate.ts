/* eslint-disable no-console */
import type { View } from '@visactor/vgrammar-simple';
import { registerRippleGlyph, registerWaveGlyph } from '@visactor/vgrammar-simple';

registerRippleGlyph();
registerWaveGlyph();

export const runner = (view: View) => {
  const ripple = view
    .glyph('ripplePoint', view.rootMark)
    .id('ripple')
    .encode({
      x: 50,
      y: 50,
      size: 40,
      fill: 'DarkBlue',
      ripple: 0.5
    })
    .animation({
      enter: {
        channel: {
          ripple: { from: 0, to: 1 }
        },
        duration: 1000,
        easing: 'linear',
        loop: true
      }
    });

  // TODO: clip
  const wave = view
    .glyph('wave', view.rootMark)
    .id('wave')
    .encode({
      // x: 50,
      y: 100,
      height: 100,
      fill: 'DarkOrange',
      wave: 0
    })
    .animation({
      enter: {
        channel: {
          wave: { from: 0, to: 1 },
          y: { from: 100, to: 100 },
          height: { from: 100, to: 100 }
        },
        duration: 2000,
        easing: 'linear',
        loop: true
      }
    });
};

export const callback = (view: View) => {
  // do nothing
};
