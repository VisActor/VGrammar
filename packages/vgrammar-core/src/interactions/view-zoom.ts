import { throttle } from '@visactor/vutils';
import type { ViewZoomOptions, IView, InteractionEvent, IScale, IData, IViewZoomMixin } from '../types';
import { ViewNavigationBase } from './view-navigation-base';

export interface ViewZoom
  extends Pick<
      IViewZoomMixin,
      'formatZoomEvent' | 'handleZoomStart' | 'handleZoomEnd' | 'handleZoomReset' | 'updateZoomRange'
    >,
    ViewNavigationBase<ViewZoomOptions> {}
export class ViewZoom extends ViewNavigationBase<ViewZoomOptions> {
  static type: string = 'view-zoom';
  type: string = ViewZoom.type;

  static defaultOptions: ViewZoomOptions = {
    realtime: true,
    focus: true,
    trigger: 'wheel',
    endTrigger: 'pointerup',
    triggerOff: 'dblclick',
    rate: 1,
    throttle: 100
  };

  protected _inited?: boolean;
  protected _lastScale: number;
  protected _scaleX: IScale;
  protected _scaleY: IScale;
  protected _data: IData;
  protected handleStart: (e: InteractionEvent) => void;
  protected _isStarted?: boolean;

  constructor(view: IView, option?: ViewZoomOptions) {
    super(view, Object.assign({}, ViewZoom.defaultOptions, option));
    this.handleStart = throttle(this.handleStartInner, this.options.throttle);
  }

  protected getEvents() {
    return [
      { type: this.options.trigger, handler: this.handleStart },
      { type: this.options.endTrigger, handler: this.handleEnd },
      { type: this.options.triggerOff, handler: this.handleReset }
    ];
  }

  handleStartInner = (e: InteractionEvent) => {
    (this as unknown as IViewZoomMixin).formatZoomEvent(e);
    if (!e || (this.options.shouldStart && !this.options.shouldStart(e))) {
      return;
    }

    if (!this._inited) {
      this._initGrammars();
    }

    this._isStarted = true;

    this.updateView(
      'start',
      (this as unknown as IViewZoomMixin).handleZoomStart(e, this._state, {
        rate: this.options.rate,
        focus: this.options.focus
      }),
      'zoom',
      e
    );
  };

  handleEnd = (e: InteractionEvent) => {
    if (!this._isStarted) {
      return;
    }

    (this as unknown as IViewZoomMixin).formatZoomEvent(e);
    if (!e || (this.options.shouldEnd && !this.options.shouldEnd(e))) {
      return;
    }

    this.updateView(
      'end',
      (this as unknown as IViewZoomMixin).handleZoomEnd(e, this._state, {
        rate: this.options.rate,
        focus: this.options.focus
      }),
      'zoom',
      e
    );
  };

  handleReset = (e: InteractionEvent) => {
    if (!this._isStarted) {
      return;
    }
    if (!e || (this.options.shouldReset && !this.options.shouldReset(e))) {
      return;
    }

    this.updateView(
      'reset',
      (this as unknown as IViewZoomMixin).handleZoomReset(e, this._state, {
        rate: this.options.rate,
        focus: this.options.focus
      }),
      'zoom',
      e
    );
    this._isStarted = false;
  };
}
