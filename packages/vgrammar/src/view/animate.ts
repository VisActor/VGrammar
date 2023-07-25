import { HOOK_EVENT } from '../graph';
import type { IView, IBaseAnimate, AnimationEvent, IMark } from '../types';

export class ViewAnimate implements IBaseAnimate {
  private _view: IView;
  private _animatingMarks: IMark[] = [];

  constructor(view: IView) {
    this._view = view;

    this._view.addEventListener(HOOK_EVENT.ANIMATION_START, this._onAnimationStart);
    this._view.addEventListener(HOOK_EVENT.ANIMATION_END, this._onAnimationEnd);
  }

  stop() {
    this._view.traverseMarkTree(mark => {
      mark.animate?.stop?.();
    });
    return this;
  }

  pause() {
    this._view.traverseMarkTree(mark => {
      mark.animate?.pause?.();
    });
    return this;
  }

  resume() {
    this._view.traverseMarkTree(mark => {
      mark.animate?.resume?.();
    });
    return this;
  }

  enable() {
    this._view.traverseMarkTree(mark => {
      mark.animate?.enable?.();
    });
    return this;
  }

  disable() {
    this._view.traverseMarkTree(mark => {
      mark.animate?.disable?.();
    });
    return this;
  }

  enableAnimationState(state: string | string[]) {
    this._view.traverseMarkTree(mark => {
      mark.animate?.enableAnimationState?.(state);
    });
    return this;
  }

  disableAnimationState(state: string | string[]) {
    this._view.traverseMarkTree(mark => {
      mark.animate?.disableAnimationState?.(state);
    });
    return this;
  }

  isAnimating() {
    // let isAnimating = false;
    // this._view.traverseMarkTree(mark => {
    //   isAnimating = isAnimating || mark.animate?.isAnimating?.();
    // });
    // return isAnimating;
    return this._animatingMarks.length !== 0;
  }

  animate() {
    this._view.traverseMarkTree(
      mark => {
        if (mark.isUpdated && mark.animate) {
          mark.animate.animate();
        }
        mark.cleanExitElements();
        mark.isUpdated = false;
      },
      null,
      true
    );
    return this;
  }

  private _onAnimationStart = (event: AnimationEvent) => {
    if (this._animatingMarks.length === 0) {
      this._view.emit(HOOK_EVENT.ALL_ANIMATION_START, {});
    }
    this._animatingMarks = this._animatingMarks.concat(event.mark);
  };

  private _onAnimationEnd = (event: AnimationEvent) => {
    this._animatingMarks = this._animatingMarks.filter(mark => mark !== event.mark);
    if (this._animatingMarks.length === 0) {
      this._view.emit(HOOK_EVENT.ALL_ANIMATION_END, {});
    }
  };

  release() {
    this._view.removeEventListener(HOOK_EVENT.ALL_ANIMATION_START, this._onAnimationStart);
    this._view.removeEventListener(HOOK_EVENT.ALL_ANIMATION_END, this._onAnimationEnd);
  }
}
