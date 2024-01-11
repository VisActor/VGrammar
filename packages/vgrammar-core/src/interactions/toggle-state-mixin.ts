import type { IElement, IGlyphElement, IMark, IToggleStateMixin } from '../types';

export class ToggleStateMixin implements IToggleStateMixin {
  protected _statedElements?: (IElement | IGlyphElement)[];
  protected _marks?: IMark[];
  protected _stateMarks: Record<string, IMark[]>;

  updateStates(state?: string, reverseState?: string) {
    this._marks.forEach(mark => {
      const hasReverse =
        reverseState && this._stateMarks[reverseState] && this._stateMarks[reverseState].includes(mark);
      const hasState = state && this._stateMarks[state] && this._stateMarks[state].includes(mark);

      if (!hasReverse && !hasState) {
        return;
      }

      mark.elements.forEach(el => {
        const isStated = this._statedElements && this._statedElements.includes(el);

        if (isStated) {
          if (hasState) {
            el.addState(state);
          }

          if (hasReverse) {
            el.removeState(reverseState);
          }
        } else {
          if (hasState) {
            el.removeState(state);
          }

          if (hasReverse) {
            el.addState(reverseState);
          }
        }
      });
    });
  }

  clearAllStates(state?: string, reverseState?: string) {
    if (!this._statedElements || !this._statedElements.length) {
      return;
    }

    this._marks.forEach(mark => {
      if (reverseState && this._stateMarks[reverseState] && this._stateMarks[reverseState].includes(mark)) {
        mark.elements.forEach(el => {
          el.removeState(reverseState);
        });
      }

      if (state && this._stateMarks[state] && this._stateMarks[state].includes(mark)) {
        mark.elements.forEach(el => {
          el.removeState(state);
        });
      }
    });
  }
}
