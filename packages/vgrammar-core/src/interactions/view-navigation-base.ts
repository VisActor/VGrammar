import { isNil, isString } from '@visactor/vutils';
import type {
  FilterDataTarget,
  IBaseInteractionOptions,
  IComponent,
  IDataFilter,
  IDatazoom,
  IMark,
  IScale,
  IScrollbar,
  IView,
  InteractionEvent,
  ViewNavigationBaseOptions,
  ViewNavigationRange,
  ViewStateByDim
} from '../types';
import { BaseInteraction } from './base';
import { ComponentEnum, DataFilterRank, GrammarMarkType } from '../graph/enums';
import { isContinuous } from '@visactor/vscale';

export abstract class ViewNavigationBase<
  T extends ViewNavigationBaseOptions & IBaseInteractionOptions
> extends BaseInteraction<T> {
  options: T;

  protected _state: Partial<Record<'x' | 'y', ViewStateByDim>>;
  protected _inited?: boolean;
  protected _dataFilterX: IDataFilter;
  protected _dataFilterY: IDataFilter;

  constructor(view: IView, options?: T) {
    super(view, options);
    this.options = options;
  }

  protected _parseLinkedComponent(option: string | IDatazoom | IScrollbar): IDatazoom | IScrollbar {
    if (!option) {
      return null;
    }
    const comp: IMark = isString(option) ? this.view.getMarkById(option) : option;

    if (
      comp &&
      comp.markType === GrammarMarkType.component &&
      ((comp as IComponent).componentType === ComponentEnum.datazoom ||
        (comp as IComponent).componentType === ComponentEnum.scrollbar)
    ) {
      return comp as IDatazoom | IScrollbar;
    }

    return null;
  }

  protected _initStateByDim(
    dim: 'x' | 'y',
    linkedComponent?: string | IDatazoom | IScrollbar,
    scale?: string | IScale,
    dataTarget?: FilterDataTarget
  ) {
    const comp = this._parseLinkedComponent(linkedComponent);

    if (comp) {
      this._state[dim] = { linkedComponent: comp };
      return;
    }

    const scaleGrammar = !isNil(scale) ? (isString(scale) ? this.view.getScaleById(scale) : scale) : null;
    const dataGrammar = !isNil(dataTarget?.data)
      ? isString(dataTarget.data)
        ? this.view.getDataById(dataTarget.data)
        : dataTarget.data
      : null;

    if (!scaleGrammar || !dataGrammar) {
      this._state[dim] = { data: dataGrammar, scale: scaleGrammar };
      return;
    }

    const cloned = scaleGrammar.getScale().clone();

    const filterByScale = isString(dataTarget.filter)
      ? isContinuous(cloned.type)
        ? (datum: any, filterValue: number[]) => {
            return (
              datum[dataTarget.filter as string] >= filterValue[0] &&
              datum[dataTarget.filter as string] <= filterValue[1]
            );
          }
        : (datum: any, filterValue: any[]) => {
            return filterValue.includes(datum[dataTarget.filter as string]);
          }
      : dataTarget.filter;
    const dataFilter = {
      source: `${scaleGrammar.uid}`,
      rank: DataFilterRank.normal,
      filter: (data: any[]) => {
        const filterValue = dim === 'x' ? this._state?.x?.filterValue : this._state?.y?.filterValue;
        if (!filterValue) {
          return data;
        }
        const filteredData = data.filter(datum => filterByScale(datum, filterValue));
        return dataTarget.transform ? dataTarget.transform(filteredData, filterValue) : filteredData;
      }
    };

    if (dim === 'x') {
      this._dataFilterX = dataFilter;
    } else {
      this._dataFilterY = dataFilter;
    }

    dataGrammar.addDataFilter(dataFilter);

    this._state[dim] = { data: dataGrammar, scale: scaleGrammar, wholeScale: cloned };
  }

  protected _initGrammars() {
    const { enableX, enableY, scaleX, scaleY, dataTargetX, dataTargetY, linkedComponentX, linkedComponentY } =
      this.options;

    this._state = {};

    if (enableX !== false) {
      this._initStateByDim('x', linkedComponentX, scaleX, dataTargetX);
    }

    if (enableY !== false) {
      this._initStateByDim('y', linkedComponentY, scaleY, dataTargetY);
    }

    this._inited = true;
  }

  protected _updateLinkedComponent(comp: IDatazoom | IScrollbar, newRange: [number, number]) {
    if (comp.componentType === ComponentEnum.datazoom) {
      (comp as IDatazoom).setStartEndValue(newRange[0], newRange[1]);
    } else {
      // fix: need to update range scrollbar
      (comp as IScrollbar).setScrollStart(newRange[0]);
    }
  }

  updateView(type: string, newRange: ViewNavigationRange, e?: InteractionEvent) {
    if (newRange?.needUpdate) {
      if (newRange.x && this._state?.x?.linkedComponent) {
        this._updateLinkedComponent(this._state.x.linkedComponent, newRange.x);
      }

      if (newRange.y && this._state?.y?.linkedComponent) {
        this._updateLinkedComponent(this._state.y.linkedComponent, newRange.y);
      }

      this.view.runAsync();
    }

    this.dispatchEvent(type, newRange, e);
  }

  protected dispatchEvent(type: string, viewRange: ViewNavigationRange, e?: InteractionEvent) {
    this.view.emit(type, {
      viewRange,
      event: e
    });
  }
}
