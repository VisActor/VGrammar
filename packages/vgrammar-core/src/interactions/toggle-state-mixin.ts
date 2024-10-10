import type { IElement, IGlyphElement, IMark, IToggleStateMixin } from '../types';

export class ToggleStateMixin implements IToggleStateMixin {
  protected _statedElements?: (IElement | IGlyphElement)[];
  protected _marks?: IMark[];
  protected _stateMarks: Record<string, IMark[]>;

  updateStates(
    newStatedElements: (IElement | IGlyphElement)[],
    prevStatedElements?: (IElement | IGlyphElement)[],
    state?: string,
    reverseState?: string
  ) {
    if (!newStatedElements || !newStatedElements.length) {
      return null;
    }
    if (state && reverseState) {
      if (prevStatedElements && prevStatedElements.length) {
        // toggle
        this.toggleReverseStateOfElements(newStatedElements, prevStatedElements, reverseState);
        this.toggleStateOfElements(newStatedElements, prevStatedElements, state);
      } else {
        // update all the elements
        this.addBothStateOfElements(newStatedElements, state, reverseState);
      }
    } else if (state) {
      if (prevStatedElements && prevStatedElements.length) {
        this.toggleStateOfElements(newStatedElements, prevStatedElements, state);
      } else {
        this.addStateOfElements(newStatedElements, state);
      }
    }

    return newStatedElements;
  }

  protected toggleReverseStateOfElements(
    newStatedElements: (IElement | IGlyphElement)[],
    prevStatedElements: (IElement | IGlyphElement)[],
    reverseState: string
  ) {
    prevStatedElements.forEach(element => {
      const hasReverse =
        reverseState && this._stateMarks[reverseState] && this._stateMarks[reverseState].includes(element.mark);

      if (hasReverse) {
        element.addState(reverseState);
      }
    });

    newStatedElements.forEach(element => {
      const hasReverse =
        reverseState && this._stateMarks[reverseState] && this._stateMarks[reverseState].includes(element.mark);

      if (hasReverse) {
        element.removeState(reverseState);
      }
    });
  }

  protected toggleStateOfElements(
    newStatedElements: (IElement | IGlyphElement)[],
    prevStatedElements: (IElement | IGlyphElement)[],
    state: string
  ) {
    prevStatedElements.forEach(element => {
      const hasState = state && this._stateMarks[state] && this._stateMarks[state].includes(element.mark);

      if (hasState) {
        element.removeState(state);
      }
    });

    newStatedElements.forEach(element => {
      const hasState = state && this._stateMarks[state] && this._stateMarks[state].includes(element.mark);

      if (hasState) {
        element.addState(state);
      }
    });
  }

  protected addBothStateOfElements(statedElements: (IElement | IGlyphElement)[], state: string, reverseState: string) {
    this._marks.forEach(mark => {
      const hasReverse =
        reverseState && this._stateMarks[reverseState] && this._stateMarks[reverseState].includes(mark);
      const hasState = state && this._stateMarks[state] && this._stateMarks[state].includes(mark);

      if (!hasReverse && !hasState) {
        return;
      }

      mark.elements?.forEach(el => {
        const isStated = statedElements && statedElements.includes(el);

        if (isStated) {
          if (hasState) {
            el.addState(state);
          }
        } else {
          if (hasReverse) {
            el.addState(reverseState);
          }
        }
      });
    });
  }

  protected addStateOfElements(statedElements: (IElement | IGlyphElement)[], state: string) {
    this._marks.forEach(mark => {
      const hasState = state && this._stateMarks[state] && this._stateMarks[state].includes(mark);

      if (!hasState) {
        return;
      }

      mark.elements?.forEach(el => {
        const isStated = statedElements && statedElements.includes(el);

        if (isStated) {
          if (hasState) {
            el.addState(state);
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
      if (mark && mark.elements) {
        if (reverseState && this._stateMarks[reverseState] && this._stateMarks[reverseState].includes(mark)) {
          mark.elements.forEach(el => {
            el.removeState(reverseState);
          });
        }

        if (state && this._stateMarks[state] && this._stateMarks[state].includes(mark)) {
          mark.elements.forEach(el => {
            if (this._statedElements.includes(el)) {
              el.removeState(state);
            }
          });
        }
      }
    });
  }
}
