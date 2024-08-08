import { mixin } from '@visactor/vutils';
import View from './View';
import type { IMark } from '../types/grammar';
import { morph } from '../graph/animation/morph';
import type { IRunningConfig } from '../types/view';

class ViewMorphMixin {
  private _willMorphMarks: { prev: IMark[]; next: IMark[] }[];

  protected morph(normalizedRunningConfig?: IRunningConfig) {
    this._willMorphMarks?.forEach(morphMarks => {
      morph(morphMarks.prev, morphMarks.next, normalizedRunningConfig);
    });
    this._willMorphMarks = null;
  }

  protected addMorphMarks(mark: { prev: IMark[]; next: IMark[] }) {
    if (!this._willMorphMarks) {
      this._willMorphMarks = [];
    }

    this._willMorphMarks.push(mark);
  }
}

export const registerViewMorphAPI = () => {
  mixin(View, ViewMorphMixin);
};
