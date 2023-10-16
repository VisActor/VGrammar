import { throttle } from '@visactor/vutils';
import { InteractionEventEnum } from '../graph/enums';
import type { ViewScrollOptions, IView, InteractionEvent, IViewScrollMixin } from '../types';
import { ViewNavigationBase } from './view-navigation-base';

export interface ViewScroll
  extends Pick<IViewScrollMixin, 'formatScrollEvent' | 'handleScrollStart' | 'handleScrollEnd'>,
    ViewNavigationBase<ViewScrollOptions> {}

export class ViewScroll extends ViewNavigationBase<ViewScrollOptions> {
  static type: string = 'view-scroll';
  type: string = ViewScroll.type;

  static defaultOptions: ViewScrollOptions = {
    realtime: true,
    reversed: false,
    trigger: 'wheel',
    endTrigger: 'pointerup',
    throttle: 100
  };

  protected handleStart: (e: InteractionEvent) => void;

  constructor(view: IView, option?: ViewScrollOptions) {
    super(view, Object.assign({}, ViewScroll.defaultOptions, option));

    this.handleStart = throttle(this.handleStartInner, this.options.throttle);
  }

  protected getEvents() {
    return [
      { type: this.options.trigger, handler: this.handleStart },
      { type: this.options.endTrigger, handler: this.handleEnd }
    ];
  }

  handleStartInner = (e: InteractionEvent) => {
    (this as unknown as IViewScrollMixin).formatScrollEvent(e);
    if (!e || (this.options.shouldStart && !this.options.shouldStart(e))) {
      return;
    }

    if (!this._inited) {
      this._initGrammars();
    }

    this.updateView(
      InteractionEventEnum.viewScrollStart,
      (this as unknown as IViewScrollMixin).handleScrollStart(e, this._state, this.options),
      e
    );
  };

  handleEnd = (e: InteractionEvent) => {
    (this as unknown as IViewScrollMixin).formatScrollEvent(e);
    if (!e || (this.options.shouldEnd && !this.options.shouldEnd(e))) {
      return;
    }

    this.updateView(
      InteractionEventEnum.viewScrollEnd,
      (this as unknown as IViewScrollMixin).handleScrollEnd(e, this._state, this.options),
      e
    );
  };
}
