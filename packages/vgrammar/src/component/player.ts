import { isArray, isString, merge } from '@visactor/vutils';
import type { IGraphic } from '@visactor/vrender';
import type {
  ContinuousPlayerAttributes,
  DiscretePlayerAttributes,
  IDiscretePlayer
} from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { PlayerEventEnum } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { ContinuousPlayer, DiscretePlayer } from '@visactor/vrender-components';
import type {
  BaseSignleEncodeSpec,
  IData,
  IElement,
  IGroupMark,
  ITheme,
  IView,
  Nil,
  RecursivePartial,
  StateEncodeSpec
} from '../types';
import { ComponentDataRank, ComponentEnum, PlayerEnum } from '../graph';
import type { IPlayer, PlayerFilterValue, PlayerSpec, PlayerType } from '../types/component';
import { Component } from '../view/component';
import { invokeEncoder } from '../graph/mark/encode';
import { Factory } from '../core/factory';

export const generateContinuousPlayerAttributes = (
  data: any[],
  theme?: ITheme,
  addition?: RecursivePartial<ContinuousPlayerAttributes>
): ContinuousPlayerAttributes => {
  const playerTheme = theme?.components?.continuousPlayer;
  return merge({}, playerTheme, { data, dataIndex: 0 }, addition ?? {});
};

export const generateDiscretePlayerAttributes = (
  data: any[],
  theme?: ITheme,
  addition?: RecursivePartial<DiscretePlayerAttributes>
): DiscretePlayerAttributes => {
  const playerTheme = theme?.components?.discretePlayer;
  return merge({}, playerTheme, { data, dataIndex: 0 }, addition ?? {});
};

export class Player extends Component implements IPlayer {
  static readonly componentType: string = ComponentEnum.player;
  protected declare spec: PlayerSpec;
  protected declare _filterValue: PlayerFilterValue;

  private _playerComponentType: keyof typeof PlayerEnum;

  constructor(view: IView, group?: IGroupMark) {
    super(view, ComponentEnum.player, group);
    this.spec.componentType = ComponentEnum.player;
    this.spec.playerType = 'auto';
  }

  protected parseAddition(spec: PlayerSpec) {
    super.parseAddition(spec);
    this.playerType(spec.playerType);
    this.target(spec.target?.data, spec.target?.source);
    return this;
  }

  playerType(playerType: PlayerType) {
    this.spec.playerType = playerType;
    // clear legend type when spec is changed
    this._playerComponentType = null;
    this._prepareRejoin();
    this.commit();
    return this;
  }

  target(data: IData | string | Nil, source: IData | string | any[] | Nil) {
    if (this.spec.target?.source) {
      const lastSource = this.spec.target?.source;
      const lastSourceDataGrammar = isArray(lastSource)
        ? null
        : isString(lastSource)
        ? this.view.getDataById(lastSource)
        : lastSource;
      this.detach(lastSourceDataGrammar);
    }
    const sourceDataGrammar = isArray(source) ? null : isString(source) ? this.view.getDataById(source) : source;
    this.attach(sourceDataGrammar);

    const lastData = this.spec.target?.data;
    const lastDataGrammar = isString(lastData) ? this.view.getDataById(lastData) : lastData;
    if (lastDataGrammar) {
      this.view.removeEventListener(PlayerEventEnum.OnChange, this._filterCallback);
    }
    this.spec.target = undefined;
    const dataGrammar = isString(data) ? this.view.getDataById(data) : data;
    const getFilterValue = (event: any) => ({ index: event.detail.index, value: event.detail.value });
    const dataTransform = (data: any[], filterValue: PlayerFilterValue) => filterValue.value;
    this._filterData(lastDataGrammar, dataGrammar, ComponentDataRank.player, getFilterValue, undefined, dataTransform);
    if (dataGrammar) {
      this.view.addEventListener(PlayerEventEnum.OnChange, this._filterCallback);
      this.spec.target = { data: dataGrammar, source };
    }
    return this;
  }

  play() {
    // FIXME: unite IDiscretePlayer and IContinuousPlayer interface in vis-component
    const datazoom = this.elements[0]?.getGraphicItem?.() as unknown as IDiscretePlayer;
    datazoom.play();
    return this;
  }

  pause() {
    // FIXME: unite IDiscretePlayer and IContinuousPlayer interface in vis-component
    const datazoom = this.elements[0]?.getGraphicItem?.() as unknown as IDiscretePlayer;
    datazoom.pause();
    return this;
  }

  backward() {
    // FIXME: unite IDiscretePlayer and IContinuousPlayer interface in vis-component
    const datazoom = this.elements[0]?.getGraphicItem?.() as unknown as IDiscretePlayer;
    datazoom.backward();
    return this;
  }

  forward() {
    // FIXME: unite IDiscretePlayer and IContinuousPlayer interface in vis-component
    const datazoom = this.elements[0]?.getGraphicItem?.() as unknown as IDiscretePlayer;
    datazoom.forward();
    return this;
  }

  addGraphicItem(attrs: any, groupKey?: string, newGraphicItem?: any) {
    // FIXME: vis-component should handle the situation when handlerStyle is not set
    const defaultAttributes = { slider: { handlerStyle: { size: 16 } } };
    const initialAttributes = merge(defaultAttributes, attrs);
    const graphicItem =
      newGraphicItem ?? Factory.createGraphicComponent(this._getPlayerComponentType(), initialAttributes);
    return super.addGraphicItem(initialAttributes, groupKey, graphicItem);
  }

  release() {
    if (this._filterCallback) {
      this.view.removeEventListener('change', this._filterCallback);
    }
    super.release();
  }

  protected _updateComponentEncoders() {
    const encoders = Object.assign({ update: {} }, this.spec.encode);
    const componentEncoders: StateEncodeSpec = Object.keys(encoders).reduce((res, state) => {
      const encoder = encoders[state];
      if (encoder) {
        res[state] = {
          callback: (datum: any, element: IElement, parameters: any) => {
            const theme = this.view.getCurrentTheme();
            const addition = invokeEncoder(encoder as BaseSignleEncodeSpec, datum, element, parameters);
            const source = this.spec.target?.source;
            const sourceDataGrammar = isArray(source)
              ? null
              : isString(source)
              ? this.view.getDataById(source)
              : source;
            const sourceData = isArray(source) ? source : sourceDataGrammar?.getValue() ?? [];
            switch (this._getPlayerComponentType()) {
              case 'continuousPlayer':
                return generateContinuousPlayerAttributes(sourceData, theme, addition);
              case 'discretePlayer':
                return generateDiscretePlayerAttributes(sourceData, theme, addition);
            }
          }
        };
      }
      return res;
    }, {});
    this._encoders = componentEncoders;
  }

  private _getPlayerComponentType() {
    if (this._playerComponentType) {
      return this._playerComponentType;
    }

    // compute legend component type when needed
    if (!this.spec.playerType || this.spec.playerType === 'auto') {
      // const scaleGrammar = isString(this.spec.scale) ? this.view.getScaleById(this.spec.scale) : this.spec.scale;
      // const scaleType = scaleGrammar?.getScaleType?.();
      // if (scaleType && isContinuous(scaleType)) {
      //   const range: any[] = scaleGrammar.getScale().range();
      //   if (parseColor(range?.[0])) {
      //     this._legendComponentType = LegendEnum.colorLegend;
      //   } else {
      //     this._legendComponentType = LegendEnum.sizeLegend;
      //   }
      // } else {
      //   this._legendComponentType = LegendEnum.discreteLegend;
      // }
      this._playerComponentType = 'discretePlayer';
    } else {
      this._playerComponentType =
        this.spec.playerType === 'discrete'
          ? 'discretePlayer'
          : this.spec.playerType === 'continuous'
          ? 'continuousPlayer'
          : 'discretePlayer';
    }
    return this._playerComponentType;
  }
}

export const registerPlayer = () => {
  Factory.registerGraphicComponent(
    PlayerEnum.continuousPlayer,
    (attrs: ContinuousPlayerAttributes) => new ContinuousPlayer(attrs) as unknown as IGraphic
  );
  Factory.registerGraphicComponent(
    PlayerEnum.discretePlayer,
    (attrs: DiscretePlayerAttributes) => new DiscretePlayer(attrs) as unknown as IGraphic
  );

  Factory.registerComponent(ComponentEnum.player, Player);
};
