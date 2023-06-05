import type { IView, IBaseAnimate } from '../types';

export class ViewAnimate implements IBaseAnimate {
  private view: IView;

  constructor(view: IView) {
    this.view = view;
  }

  stop() {
    this.view.traverseMarkTree(mark => {
      mark.animate?.stop();
    });
    return this;
  }

  pause() {
    this.view.traverseMarkTree(mark => {
      mark.animate?.pause();
    });
    return this;
  }

  resume() {
    this.view.traverseMarkTree(mark => {
      mark.animate?.resume();
    });
    return this;
  }

  enable() {
    this.view.traverseMarkTree(mark => {
      mark.animate?.enable();
    });
    return this;
  }

  disable() {
    this.view.traverseMarkTree(mark => {
      mark.animate?.disable();
    });
    return this;
  }

  enableAnimationState(state: string | string[]) {
    this.view.traverseMarkTree(mark => {
      mark.animate?.enableAnimationState(state);
    });
    return this;
  }

  disableAnimationState(state: string | string[]) {
    this.view.traverseMarkTree(mark => {
      mark.animate?.disableAnimationState(state);
    });
    return this;
  }

  animate() {
    this.view.traverseMarkTree(
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

  release() {
    // do nothing
  }
}
