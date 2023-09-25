import type { DataFilterOptions, IComponent, IPlayer, IView, PlayerFilterValue } from '../types';
import { DataFilterRank, GrammarMarkType } from '../graph';
import { isString } from '@visactor/vutils';
import { Filter } from './filter';
import { PlayerEventEnum } from '@visactor/vrender-components';

export class PlayerFilter extends Filter {
  static type: string = 'player-filter';
  type: string = PlayerFilter.type;

  static defaultOptions: Omit<DataFilterOptions, 'target'> = {};
  options: DataFilterOptions;

  constructor(view: IView, options?: DataFilterOptions) {
    super(view, options);
    this.options = Object.assign({}, PlayerFilter.defaultOptions, options);

    this._marks = view
      .getMarksBySelector(this.options.source)
      .filter(mark => mark.markType === GrammarMarkType.component && (mark as IComponent).componentType === 'player');
    this._data = isString(this.options.target.data)
      ? view.getDataById(this.options.target.data)
      : this.options.target.data;
  }

  protected getEvents() {
    if (!this._marks || this._marks.length === 0) {
      return {};
    }

    const player = this._marks[0] as IPlayer;

    if (!this._data || !player) {
      return {};
    }

    const transform = this.options.target.transform;

    const getFilterValue = (event: any) => ({ index: event.detail.index, value: event.detail.value });
    const dataTransform = (data: any[], filterValue: PlayerFilterValue) => {
      return transform ? transform(data, filterValue) : filterValue.value;
    };

    this._filterData(this._data, player, DataFilterRank.player, getFilterValue, undefined, dataTransform);

    return {
      [PlayerEventEnum.OnChange]: this.handleFilter
    };
  }
}
