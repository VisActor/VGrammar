import { throttle } from '@visactor/vutils';
import { InteractionEventEnum } from '../graph/enums';
import type { ViewDragOptions, IView, InteractionEvent } from '../types';
import type { ViewDragMixin } from './view-drag-mixin';
import { ViewNavigationBase } from './view-navigation-base';

export class ViewDrag extends ViewNavigationBase<ViewDragOptions> {
  static type: string = 'view-drag';
  type: string = ViewDrag.type;

  static defaultOptions: ViewDragOptions = {
    realtime: true,
    reversed: false,
    trigger: 'pointerdown',
    updateTrigger: 'pointermove',
    endTrigger: 'pointerup',
    throttle: 100
  };

  protected _inited?: boolean;

  protected handleUpdate: (e: InteractionEvent) => void;

  constructor(view: IView, option?: ViewDragOptions) {
    super(view, Object.assign({}, ViewDrag.defaultOptions, option));
    this.handleUpdate = throttle(this.handleUpdateInner, this.options.throttle);
  }

  protected getEvents() {
    const events = {
      [this.options.trigger]: this.handleStart,
      [this.options.endTrigger]: this.handleEnd,
      [this.options.updateTrigger]: this.handleUpdate
    };

    return events;
  }

  handleStart = (e: InteractionEvent) => {
    if (!e || (this.options.shouldStart && !this.options.shouldStart(e))) {
      return;
    }

    if (!this._inited) {
      this._initGrammars();
    }

    this.updateView(
      InteractionEventEnum.viewDragStart,
      (this as unknown as ViewDragMixin).handleDragStart(e, this._state, { reversed: this.options.reversed }),
      e
    );
  };

  handleUpdateInner = (e: InteractionEvent) => {
    if (!e || (this.options.shouldUpdate && !this.options.shouldUpdate(e))) {
      return;
    }

    this.updateView(
      InteractionEventEnum.viewDragUpdate,
      (this as unknown as ViewDragMixin).handleDragUpdate(e, this._state, { reversed: this.options.reversed }),
      e
    );
  };

  handleEnd = (e: InteractionEvent) => {
    if (!e || (this.options.shouldEnd && !this.options.shouldEnd(e))) {
      return;
    }

    this.updateView(
      InteractionEventEnum.viewDragEnd,
      (this as unknown as ViewDragMixin).handleDragEnd(e, this._state, { reversed: this.options.reversed }),
      e
    );
  };
}
