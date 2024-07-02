import { mixin } from '@visactor/vutils';
import View from './View';
import { ViewAnimate } from './animate';
import type { IViewAnimate } from '../types/animate';
import type { IView } from '../types';

class ViewAnimateMixin {
  animate: IViewAnimate;

  initAnimate(view: IView) {
    this.animate = new ViewAnimate(view);
  }
}

export const registerViewAnimateAPI = () => {
  mixin(View, ViewAnimateMixin);
};
