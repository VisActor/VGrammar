import { throttle } from '@visactor/vutils';
import type { ViewDragOptions, IView, InteractionEvent, IViewDragMixin } from '../types';
import { ViewNavigationBase } from './view-navigation-base';

export interface ViewDrag
  extends Pick<IViewDragMixin, 'handleDragStart' | 'handleDragEnd' | 'handleDragUpdate'>,
    ViewNavigationBase<ViewDragOptions> {}
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

  protected _isStarted?: boolean;

  constructor(view: IView, option?: ViewDragOptions) {
    super(view, Object.assign({}, ViewDrag.defaultOptions, option));
    this.handleUpdate = throttle(this.handleUpdateInner, this.options.throttle);
  }

  protected getEvents() {
    return [
      { type: this.options.trigger, handler: this.handleStart },
      { type: this.options.endTrigger, handler: this.handleEnd },
      { type: this.options.updateTrigger, handler: this.handleUpdate }
    ];
  }

  handleStart = (e: InteractionEvent) => {
    if (!e || (this.options.shouldStart && !this.options.shouldStart(e))) {
      return;
    }
    this._isStarted = true;

    if (!this._inited) {
      this._initGrammars();
    }

    this.updateView('start', this.handleDragStart(e, this._state, { reversed: this.options.reversed }), 'drag', e);
  };

  handleUpdateInner = (e: InteractionEvent) => {
    if (!this._isStarted || !e || (this.options.shouldUpdate && !this.options.shouldUpdate(e))) {
      return;
    }

    this.updateView('update', this.handleDragUpdate(e, this._state, { reversed: this.options.reversed }), 'drag', e);
  };

  handleEnd = (e: InteractionEvent) => {
    if (!this._isStarted || !e || (this.options.shouldEnd && !this.options.shouldEnd(e))) {
      return;
    }

    this.updateView('end', this.handleDragEnd(e, this._state, { reversed: this.options.reversed }), 'drag', e);

    this._isStarted = false;
  };
}
