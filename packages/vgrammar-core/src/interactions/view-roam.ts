import { merge, throttle } from '@visactor/vutils';
import type {
  ViewRoamOptions,
  IView,
  InteractionEvent,
  IScale,
  IData,
  IViewZoomMixin,
  IViewScrollMixin,
  IViewDragMixin
} from '../types';
import { ViewNavigationBase } from './view-navigation-base';
import { InteractionEventEnum } from '../graph/enums';

export interface ViewRoam
  extends Pick<IViewDragMixin, 'handleDragStart' | 'handleDragEnd' | 'handleDragUpdate'>,
    Pick<IViewScrollMixin, 'formatScrollEvent' | 'handleScrollStart' | 'handleScrollEnd'>,
    Pick<
      IViewZoomMixin,
      'formatZoomEvent' | 'handleZoomStart' | 'handleZoomEnd' | 'handleZoomReset' | 'updateZoomRange'
    >,
    ViewNavigationBase<ViewRoamOptions> {}

export class ViewRoam extends ViewNavigationBase<ViewRoamOptions> {
  static type: string = 'view-roam';
  type: string = ViewRoam.type;

  static defaultOptions: ViewRoamOptions = {
    zoom: {
      realtime: true,
      enable: true,
      focus: true,
      trigger: 'wheel',
      endTrigger: 'pointerup',
      resetTrigger: 'dblclick',
      rate: 1
    },
    scroll: {
      realtime: true,
      enable: false,
      reversed: false,
      trigger: 'wheel',
      endTrigger: 'pointerup'
    },
    drag: {
      realtime: true,
      enable: true,
      reversed: false,
      trigger: 'pointerdown',
      updateTrigger: 'pointermove',
      endTrigger: 'pointerup'
    },
    throttle: 100
  };

  protected _inited?: boolean;
  protected _lastScale: number;
  protected _scaleX: IScale;
  protected _scaleY: IScale;
  protected _data: IData;
  protected handleRoamZoomStart: (e: InteractionEvent) => void;
  protected handleRoamDragUpdate: (e: InteractionEvent) => void;
  protected handleRoamScrollStart: (e: InteractionEvent) => void;

  constructor(view: IView, option?: ViewRoamOptions) {
    super(view, merge({}, ViewRoam.defaultOptions, option));
    this.handleRoamZoomStart = throttle(this.handleRoamZoomStartInner, this.options.throttle);
    this.handleRoamDragUpdate = throttle(this.handleRoamDragUpdateInner, this.options.throttle);
    this.handleRoamScrollStart = throttle(this.handleRoamScrollStartInner, this.options.throttle);
  }

  protected getEvents() {
    const events = {};

    if (this.options.zoom?.enable) {
      this.options.zoom?.trigger && (events[this.options.zoom.trigger] = [this.handleRoamZoomStart]);
      this.options.zoom?.endTrigger && (events[this.options.zoom.endTrigger] = [this.handleRoamZoomEnd]);
      this.options.zoom?.resetTrigger && (events[this.options.zoom?.resetTrigger] = [this.handleRoamZoomReset]);
    }

    if (this.options.scroll?.enable) {
      if (this.options.scroll?.trigger) {
        if (events[this.options.scroll.trigger]) {
          events[this.options.scroll.trigger].push(this.handleRoamScrollStart);
        } else {
          events[this.options.scroll.trigger] = this.handleRoamScrollStart;
        }
      }

      if (this.options.scroll?.endTrigger) {
        if (events[this.options.scroll.endTrigger]) {
          events[this.options.scroll.endTrigger].push(this.handleRoamScrollEnd);
        } else {
          events[this.options.scroll.endTrigger] = this.handleRoamScrollEnd;
        }
      }
    }

    if (this.options.drag?.enable) {
      if (this.options.drag?.trigger) {
        if (events[this.options.drag.trigger]) {
          events[this.options.drag.trigger].push(this.handleRoamDragStart);
        } else {
          events[this.options.drag.trigger] = this.handleRoamDragStart;
        }
      }

      if (this.options.drag?.updateTrigger) {
        if (events[this.options.drag.updateTrigger]) {
          events[this.options.drag.updateTrigger].push(this.handleRoamDragUpdate);
        } else {
          events[this.options.drag.updateTrigger] = this.handleRoamDragUpdate;
        }
      }

      if (this.options.drag?.endTrigger) {
        if (events[this.options.drag.endTrigger]) {
          events[this.options.drag.endTrigger].push(this.handleRoamDragEnd);
        } else {
          events[this.options.drag.endTrigger] = this.handleRoamDragEnd;
        }
      }
    }

    return events;
  }

  handleRoamZoomStartInner = (e: InteractionEvent) => {
    this.formatZoomEvent(e);
    if (!e || (this.options.shouldStart && !this.options.shouldStart(e))) {
      return;
    }

    if (!this._inited) {
      this._initGrammars();
    }

    this.updateView(InteractionEventEnum.viewZoomStart, this.handleZoomStart(e, this._state, this.options.zoom), e);
  };

  handleRoamZoomEnd = (e: InteractionEvent) => {
    this.formatZoomEvent(e);
    if (!e || (this.options.shouldEnd && !this.options.shouldEnd(e))) {
      return;
    }

    this.updateView(InteractionEventEnum.viewZoomEnd, this.handleZoomEnd(e, this._state, this.options.zoom), e);
  };

  handleRoamZoomReset = (e: InteractionEvent) => {
    if (!e || (this.options.shouldReset && !this.options.shouldReset(e))) {
      return;
    }
    this.updateView(InteractionEventEnum.viewZoomReset, this.handleZoomReset(e, this._state, this.options.zoom), e);
  };

  handleRoamDragStart = (e: InteractionEvent) => {
    if (!e || (this.options.shouldStart && !this.options.shouldStart(e))) {
      return;
    }

    if (!this._inited) {
      this._initGrammars();
    }

    this.updateView(InteractionEventEnum.viewDragStart, this.handleDragStart(e, this._state, this.options.drag), e);
  };

  handleRoamDragUpdateInner = (e: InteractionEvent) => {
    if (!e || (this.options.shouldUpdate && !this.options.shouldUpdate(e))) {
      return;
    }
    this.updateView(InteractionEventEnum.viewDragUpdate, this.handleDragUpdate(e, this._state, this.options.drag), e);
  };

  handleRoamDragEnd = (e: InteractionEvent) => {
    if (!e || (this.options.shouldEnd && !this.options.shouldEnd(e))) {
      return;
    }

    this.updateView(InteractionEventEnum.viewDragEnd, this.handleDragEnd(e, this._state, this.options.drag), e);
  };

  handleRoamScrollStartInner = (e: InteractionEvent) => {
    this.formatScrollEvent(e);
    if (!e || (this.options.shouldStart && !this.options.shouldStart(e))) {
      return;
    }

    if (!this._inited) {
      this._initGrammars();
    }

    this.updateView(
      InteractionEventEnum.viewScrollStart,
      this.handleScrollStart(e, this._state, this.options.scroll),
      e
    );
  };

  handleRoamScrollEnd = (e: InteractionEvent) => {
    this.formatScrollEvent(e);
    if (!e || (this.options.shouldEnd && !this.options.shouldEnd(e))) {
      return;
    }

    this.updateView(InteractionEventEnum.viewScrollEnd, this.handleScrollEnd(e, this._state, this.options.scroll), e);
  };
}
