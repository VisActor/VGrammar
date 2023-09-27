import { throttle } from '@visactor/vutils';
import type { ViewZoomOptions, IView, InteractionEvent, IScale, IData, IViewZoomMixin } from '../types';
import { ViewNavigationBase } from './view-navigation-base';
import { InteractionEventEnum } from '../graph/enums';

export class ViewZoom extends ViewNavigationBase<ViewZoomOptions> {
  static type: string = 'view-zoom';
  type: string = ViewZoom.type;

  static defaultOptions: ViewZoomOptions = {
    realtime: true,
    focus: true,
    trigger: 'wheel',
    endTrigger: 'pointerup',
    resetTrigger: 'dblclick',
    rate: 1,
    throttle: 100
  };

  protected _inited?: boolean;
  protected _lastScale: number;
  protected _scaleX: IScale;
  protected _scaleY: IScale;
  protected _data: IData;
  protected handleStart: (e: InteractionEvent) => void;

  constructor(view: IView, option?: ViewZoomOptions) {
    super(view, Object.assign({}, ViewZoom.defaultOptions, option));
    this.handleStart = throttle(this.handleStartInner, this.options.throttle);
  }

  protected getEvents() {
    const events = {
      [this.options.trigger]: this.handleStart,
      [this.options.endTrigger]: this.handleEnd,
      [this.options.resetTrigger]: this.handleReset
    };

    return events;
  }

  handleStartInner = (e: InteractionEvent) => {
    (this as unknown as IViewZoomMixin).formatZoomEvent(e);
    if (!e || (this.options.shouldStart && !this.options.shouldStart(e))) {
      return;
    }

    if (!this._inited) {
      this._initGrammars();
    }

    this.updateView(
      InteractionEventEnum.viewZoomStart,
      (this as unknown as IViewZoomMixin).handleZoomStart(e, this._state, {
        rate: this.options.rate,
        focus: this.options.focus
      })
    );
  };

  handleEnd = (e: InteractionEvent) => {
    (this as unknown as IViewZoomMixin).formatZoomEvent(e);
    if (!e || (this.options.shouldEnd && !this.options.shouldEnd(e))) {
      return;
    }

    this.updateView(
      InteractionEventEnum.viewZoomEnd,
      (this as unknown as IViewZoomMixin).handleZoomEnd(e, this._state, {
        rate: this.options.rate,
        focus: this.options.focus
      }),
      e
    );
  };

  handleReset = (e: InteractionEvent) => {
    if (!e || (this.options.shouldReset && !this.options.shouldReset(e))) {
      return;
    }
    this.updateView(
      InteractionEventEnum.viewZoomReset,
      (this as unknown as IViewZoomMixin).handleZoomReset(e, this._state, {
        rate: this.options.rate,
        focus: this.options.focus
      }),
      e
    );
  };
}
