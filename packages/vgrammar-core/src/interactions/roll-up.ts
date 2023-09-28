import type { EventType, IView, InteractionEvent, RollUpOptions } from '../types';
import { DataFilterRank } from '../graph';
import { isArray, isString } from '@visactor/vutils';
import { Filter } from './filter';

export class RollUp extends Filter {
  static type: string = 'roll-up';
  type: string = RollUp.type;

  static defaultOptions: Omit<RollUpOptions, 'target'> = {
    trigger: 'click',
    resetTrigger: 'empty'
  };
  options: RollUpOptions;

  protected _isToggle: boolean = false;

  constructor(view: IView, options?: RollUpOptions) {
    super(view, options);
    this.options = Object.assign({}, RollUp.defaultOptions, options);

    this._marks = view.getMarksBySelector(this.options.source);
    this._data = isString(this.options.target.data)
      ? view.getDataById(this.options.target.data)
      : this.options.target.data;
  }

  protected getEvents() {
    if (!this._marks || this._marks.length === 0) {
      return [];
    }

    if (!this._data) {
      return [];
    }

    const transform = this.options.target.transform;

    const getFilterValue = (event: InteractionEvent) => event?.element?.getDatum?.();
    const dataTransform = (data: any[], filterValue: any) => {
      return transform(data, filterValue);
    };

    this._filterData(this._data, null, DataFilterRank.rollUp, getFilterValue, undefined, dataTransform);

    const events = [
      {
        type: this.options.trigger,
        handler: this.handleStart
      }
    ];

    const eventName =
      this.options.resetTrigger === 'empty'
        ? this.options.trigger
        : this.options.resetTrigger.includes('view:')
        ? this.options.resetTrigger.replace('view:', '')
        : this.options.resetTrigger;

    if (eventName !== this.options.trigger) {
      events.push({
        type: eventName as EventType,
        handler: this.handleReset
      });
      this._isToggle = false;
    } else {
      this._isToggle = true;
    }

    return events;
  }

  protected handleStart = (event: InteractionEvent) => {
    const element = event.element;
    if (element && this._marks && this._marks.includes(element.mark)) {
      const filterValue = event.element?.getDatum?.();

      const isEqualFilterValue =
        filterValue === this._filterData ||
        (isArray(filterValue) &&
          isArray(this._filterValue) &&
          filterValue.length === this._filterValue.length &&
          filterValue.every(datum => !this._filterValue.includes(datum)));

      if (isEqualFilterValue) {
        // reset filter value when toggle is enabled
        if (this._isToggle) {
          this._filterValue = null;
          this.handleFilter(event);
        }
      } else {
        this.handleFilter(event);
      }
    }
  };

  protected handleReset = (event: InteractionEvent) => {
    if (this._filterValue) {
      this._filterValue = null;
      this.handleFilter(event);
    }
  };
}
