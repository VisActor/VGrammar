import { mixin } from '@visactor/vutils';
import { Animate } from '../graph/animation/animate';
import type { IMark, MarkSpec } from '../types';
import type { IAnimate } from '../types/animate';
import { Mark } from './mark';

class MarkAnimateMixin {
  animate: IAnimate = new Animate(this as unknown as IMark, {});

  initAnimate(spec: MarkSpec) {
    if (!this.animate) {
      this.animate = new Animate(this as unknown as IMark, spec.animation);
      if ((this as any).needAnimate()) {
        this.animate.updateState(spec.animationState);
      }
    }
  }

  reuseAnimate(mark: IMark) {
    this.animate = mark.animate;
    this.animate.mark = this as unknown as IMark;
  }

  updateAnimate(spec: MarkSpec) {
    if (spec.animation) {
      this.animate.updateConfig(spec.animation);
    }
    this.animate.updateState(spec.animationState);
  }
}

export const registerMarkAnimateAPI = () => {
  mixin(Mark, MarkAnimateMixin);
};
