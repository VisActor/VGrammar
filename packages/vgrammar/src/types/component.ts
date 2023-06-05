import type { ISymbolGraphicAttribute, ITextGraphicAttribute } from '@visactor/vrender';
import type { BaseLabelAttrs, DataLabelAttrs } from '@visactor/vis-components';
import type { ComponentEnum } from '../graph';
import type { Nil, RecursivePartial } from './base';
import type { IComponent, IData, IMark, IScale } from './grammar';
import type { ChannelEncodeType, ComponentSpec, FieldEncodeType, MarkFunctionType, ScaleEncodeType } from './mark';

// scale component

export interface IScaleComponent extends IComponent {
  scale: (scale?: IScale | string) => this;
}

export interface ScaleComponentSpec extends ComponentSpec {
  scale?: IScale | string;
}

// axis component

export type AxisType = 'line' | 'circle';

export interface IAxis extends IScaleComponent {
  axisType: (axisType: AxisType | Nil) => this;
  tickCount: (tickCount: MarkFunctionType<number> | Nil) => this;
}

export interface AxisSpec extends ScaleComponentSpec {
  componentType: ComponentEnum.axis;
  axisType?: AxisType;
  tickCount?: MarkFunctionType<number>;
  inside?: MarkFunctionType<boolean>;
  baseValue?: number;
}

// legend component

export type LegendType = 'auto' | 'discrete' | 'color' | 'size';

export interface ILegend extends IScaleComponent {
  legendType: (legendType: LegendType | Nil) => this;
  target: (data: IData | string | Nil, filter: string | ((datum: any, legendValues: any) => boolean) | Nil) => this;

  // immediate functions
  setSelected: (selectedValues: any[]) => this;
}

export interface LegendSpec extends ScaleComponentSpec {
  componentType: ComponentEnum.legend;
  legendType?: LegendType;
  target?: {
    data: IData | string;
    filter: string | ((datum: any, legendValues: any[]) => boolean);
  };
}

// crosshair component

export type CrosshairType = 'x' | 'y' | 'angle' | 'radius' | 'radius-polygon';

export type CrosshairShape = 'line' | 'rect';

export interface ICrosshair extends IScaleComponent {
  crosshairType: (crosshairType: CrosshairType | Nil) => this;
  crosshairShape: (crosshairShape: CrosshairShape | Nil) => this;
}

export interface CrosshairSpec extends ScaleComponentSpec {
  componentType: ComponentEnum.crosshair;
  crosshairType?: CrosshairType;
  crosshairShape?: CrosshairShape;
}

// slider component

export type SliderFilterValue = { start: number; end: number };

export interface ISlider extends IComponent {
  min: (min: MarkFunctionType<number> | Nil) => this;
  max: (max: MarkFunctionType<number> | Nil) => this;
  target: (
    data: IData | string | Nil,
    filter: string | ((datum: any, value: SliderFilterValue) => boolean) | Nil
  ) => this;

  // immediate functions
  setStartEndValue: (start?: number, end?: number) => this;
}

export interface SliderSpec extends ComponentSpec {
  componentType: ComponentEnum.slider;
  min?: MarkFunctionType<number>;
  max?: MarkFunctionType<number>;
  target?: {
    data: IData | string;
    filter: string | ((datum: any, value: SliderFilterValue) => boolean);
  };
}

// datazoom component

export type DatazoomFilterValue = { start: number; end: number; startRatio: number; endRatio: number };

export interface IDatazoom extends IComponent {
  preview: (
    data: IData | string | Nil,
    x: ScaleEncodeType | Nil,
    y: ScaleEncodeType | Nil,
    x1?: ChannelEncodeType | Nil,
    y1?: ChannelEncodeType | Nil
  ) => this;
  target: (
    data: IData | string | Nil,
    filter: string | ((datum: any, value: DatazoomFilterValue) => boolean) | Nil
  ) => this;

  // immediate functions
  setStartEndValue: (start?: number, end?: number) => this;
}

export interface DatazoomSpec extends ComponentSpec {
  componentType: ComponentEnum.datazoom;
  preview?: {
    data: IData | string;
    x: ScaleEncodeType;
    y: ScaleEncodeType;
    x1?: ChannelEncodeType;
    y1?: ChannelEncodeType;
  };
  target?: {
    data: IData | string;
    filter: string | ((datum: any, value: DatazoomFilterValue) => boolean);
  };
}

// label component

export interface ILabel extends IComponent {
  labelStyle: (attributes: MarkFunctionType<RecursivePartial<BaseLabelAttrs>>) => this;
  size: (attributes: MarkFunctionType<DataLabelAttrs['size']>) => this;
  target: (mark: IMark | IMark[] | string | string[] | Nil) => this;
}

export interface LabelSpec extends ComponentSpec {
  componentType: ComponentEnum.label;
  labelStyle?: MarkFunctionType<RecursivePartial<BaseLabelAttrs>>;
  size?: MarkFunctionType<DataLabelAttrs['size']>;
  target?: IMark | IMark[] | string | string[];
}

// player component

export type PlayerType = 'auto' | 'discrete' | 'continuous';

export type PlayerFilterValue = { index: number; value: any };

export interface IPlayer extends IComponent {
  playerType: (playerType: PlayerType) => this;
  target: (data: IData | string | Nil, source: IData | string | any[] | Nil) => this;

  // immediate functions
  play: () => this;
  pause: () => this;
  backward: () => this;
  forward: () => this;
}

export interface PlayerSpec extends ComponentSpec {
  componentType: ComponentEnum.player;
  playerType?: PlayerType;
  target?: {
    data: IData | string;
    source: IData | string | any[];
  };
}

// tooltip component

export interface ITooltipRow {
  visible?: boolean;
  key?: MarkFunctionType<string | Partial<ITextGraphicAttribute>> | FieldEncodeType;
  value?: MarkFunctionType<string | Partial<ITextGraphicAttribute>> | FieldEncodeType;
  symbol?: MarkFunctionType<string | Partial<ISymbolGraphicAttribute>> | FieldEncodeType;
}

export interface ITooltip extends IComponent {
  target: (mark: IMark | IMark[] | string | string[] | Nil) => this;
  title: (title: ITooltipRow | Nil) => this;
  content: (content: ITooltipRow | ITooltipRow[] | Nil) => this;
}

export interface TooltipSpec extends ComponentSpec {
  componentType: ComponentEnum.tooltip;
  target?: IMark | IMark[] | string | string[];
  title?: ITooltipRow;
  content?: ITooltipRow | ITooltipRow[];
}

// built-in components

export type BuiltInComponentSpec =
  | AxisSpec
  | LegendSpec
  | CrosshairSpec
  | SliderSpec
  | DatazoomSpec
  | LabelSpec
  | PlayerSpec;
