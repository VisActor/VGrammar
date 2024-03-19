import { isArray, isFunction, isNil, isString } from '@visactor/vutils';
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
import { getScaleRangeRatio } from '../util/scale';

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
    dataTarget?: FilterDataTarget,
    rangeOptions?: [number, number] | (() => [number, number])
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

      if (isArray(rangeOptions)) {
        // set the initial value of rangeFactor
        this._state[dim].rangeFactor = rangeOptions;
        this._state[dim].initRangeFactor = rangeOptions;
      } else if (isFunction(rangeOptions)) {
        this._state[dim].getCurrentRange = rangeOptions as () => [number, number];
      } else if (scaleGrammar && scaleGrammar.getRangeFactor()) {
        this._state[dim].rangeFactor = scaleGrammar.getRangeFactor();
        this._state[dim].initRangeFactor = scaleGrammar.getRangeFactor();
      }
      return;
    }

    dataGrammar.attach(scaleGrammar);

    const filterByScale = isString(dataTarget.filter)
      ? (datum: any, filterValue: number[]) => {
          const scale = scaleGrammar.getScale();
          const ratio = getScaleRangeRatio(scale, datum[dataTarget.filter as string]);

          return ratio >= filterValue[0] && ratio <= filterValue[1];
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

    this._state[dim] = { data: dataGrammar, scale: scaleGrammar };
  }

  protected _initGrammars() {
    const {
      enableX,
      enableY,
      scaleX,
      scaleY,
      dataTargetX,
      dataTargetY,
      linkedComponentX,
      linkedComponentY,
      rangeX,
      rangeY
    } = this.options;

    this._state = {};

    if (enableX !== false) {
      this._initStateByDim('x', linkedComponentX, scaleX, dataTargetX, rangeX);
    }

    if (enableY !== false) {
      this._initStateByDim('y', linkedComponentY, scaleY, dataTargetY, rangeY);
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

  updateView(
    type: 'start' | 'reset' | 'update' | 'end',
    newRange: ViewNavigationRange,
    eventType: string,
    e?: InteractionEvent
  ) {
    if (newRange && newRange.x && this._state?.x?.linkedComponent) {
      this._updateLinkedComponent(this._state.x.linkedComponent, newRange.x);
    }

    if (newRange && newRange.y && this._state?.y?.linkedComponent) {
      this._updateLinkedComponent(this._state.y.linkedComponent, newRange.y);
    }

    if (newRange && newRange.needUpdate) {
      this.view.run();
    }

    this.dispatchEvent(type, { viewRange: newRange, event: e, eventType });
  }

  unbind() {
    super.unbind();

    if (this._state) {
      Object.keys(this._state).forEach(dim => {
        const { data, scale } = this._state[dim as 'x' | 'y'];

        if (data && scale) {
          data.detach(scale);
          data.removeDataFilter(dim === 'x' ? this._dataFilterX : this._dataFilterY);
        } else if (scale) {
          scale.setRangeFactor(null);
          scale.commit();
        }
      });
    }

    this._state = null;
  }
}
