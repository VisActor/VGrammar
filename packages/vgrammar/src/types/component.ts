import type {
  IGraphicAttribute,
  ISymbolGraphicAttribute,
  ITextAttribute,
  ITextGraphicAttribute
} from '@visactor/vrender';
import type {
  AxisBaseAttributes,
  BaseCrosshairAttrs,
  BaseLabelAttrs,
  DataLabelAttrs,
  DataZoomAttributes,
  Direction,
  GridBaseAttributes,
  LegendBaseAttributes,
  OrientType,
  PlayerAttributes,
  ScrollBarAttributes,
  SliderAttributes,
  TitleAttrs,
  TooltipAttributes,
  TooltipRowAttrs
} from '@visactor/vrender-components';
import type { AxisEnum, ComponentEnum } from '../graph';
import type { Nil } from './base';
import type { IComponent, IData, IGroupMark, IMark, IScale } from './grammar';
import type {
  ChannelEncodeType,
  ComponentSpec,
  FieldEncodeType,
  GenerateBasicEncoderSpec,
  MarkFunctionType,
  ScaleEncodeType
} from './mark';
import type { IPointLike } from '@visactor/vutils';
import type { IElement } from './element';
import type { IView } from './view';

// scale component

export interface IScaleComponent extends IComponent {
  scale: (scale?: IScale | string | Nil) => this;
}

export interface ScaleComponentSpec<
  BasicEncoderSpec extends GenerateBasicEncoderSpec<IGraphicAttribute> = GenerateBasicEncoderSpec<IGraphicAttribute>
> extends ComponentSpec<BasicEncoderSpec> {
  scale?: IScale | string;
}

// axis component

export type AxisType = 'line' | 'circle';

export interface IAxis extends IScaleComponent {
  axisType: (axisType: AxisType | Nil) => this;
  tickCount: (tickCount: MarkFunctionType<number> | Nil) => this;
  inside: (inside: MarkFunctionType<boolean> | Nil) => this;
  baseValue: (baseValue: MarkFunctionType<number> | Nil) => this;

  // internal interface
  getAxisComponentType: () => keyof typeof AxisEnum;
}

export interface AxisSpec extends ScaleComponentSpec<Partial<AxisBaseAttributes>> {
  componentType: ComponentEnum.axis;
  axisType?: AxisType;
  tickCount?: MarkFunctionType<number>;
  inside?: MarkFunctionType<boolean>;
  baseValue?: MarkFunctionType<number>;
}

// grid component

export type GridType = 'line' | 'circle';

export type GridShape = 'line' | 'circle' | 'polygon';

export interface IGrid extends IScaleComponent {
  gridType: (gridType: GridType | Nil) => this;
  gridShape: (gridShape: GridShape | Nil) => this;
  target: (axis: IAxis | string | Nil) => this;
  tickCount: (tickCount: MarkFunctionType<number> | Nil) => this;
  inside: (inside: MarkFunctionType<boolean> | Nil) => this;
  baseValue: (baseValue: MarkFunctionType<number> | Nil) => this;
}

export interface GridSpec extends ScaleComponentSpec<Partial<GridBaseAttributes>> {
  componentType: ComponentEnum.grid;
  gridType?: GridType;
  gridShape?: GridShape;
  target?: IAxis | string;
  tickCount?: MarkFunctionType<number>;
  inside?: MarkFunctionType<boolean>;
  baseValue?: MarkFunctionType<number>;
}

// legend component

export type LegendType = 'auto' | 'discrete' | 'color' | 'size';

export interface ILegend extends IScaleComponent {
  legendType: (legendType: LegendType | Nil) => this;
  target: (data: IData | string | Nil, filter: string | ((datum: any, legendValues: any) => boolean) | Nil) => this;

  // immediate functions
  setSelected: (selectedValues: any[]) => this;
}

export interface LegendSpec extends ScaleComponentSpec<LegendBaseAttributes> {
  componentType: ComponentEnum.legend;
  legendType?: LegendType;
  shapeScale?: IScale | string;
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

export interface CrosshairSpec extends ScaleComponentSpec<BaseCrosshairAttrs> {
  componentType: ComponentEnum.crosshair;
  crosshairType?: CrosshairType;
  crosshairShape?: CrosshairShape;
  componentConfig?: { radius?: number; center?: IPointLike };
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

export interface SliderSpec extends ComponentSpec<Partial<SliderAttributes>> {
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

export type DataZoomEncoderSpec = GenerateBasicEncoderSpec<Partial<DataZoomAttributes> & { x1?: number; y1?: number }>;
export interface DatazoomSpec extends ComponentSpec<DataZoomEncoderSpec> {
  componentType: ComponentEnum.datazoom;
  preview?: {
    data: IData | string;
    x?: ScaleEncodeType;
    y?: ScaleEncodeType;
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
  labelStyle: (attributes: MarkFunctionType<Partial<BaseLabelAttrs>>) => this;
  size: (attributes: MarkFunctionType<DataLabelAttrs['size']>) => this;
  target: (mark: IMark | IMark[] | string | string[] | Nil) => this;
}

export type LabelEncoderSpec = GenerateBasicEncoderSpec<Partial<BaseLabelAttrs> & { text?: ITextAttribute['text'] }>;
export interface LabelSpec extends ComponentSpec<LabelEncoderSpec> {
  componentType: ComponentEnum.label;
  labelStyle?: MarkFunctionType<Partial<BaseLabelAttrs>>;
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

export interface PlayerSpec extends ComponentSpec<Partial<PlayerAttributes>> {
  componentType: ComponentEnum.player;
  playerType?: PlayerType;
  target?: {
    data: IData | string;
    source: IData | string | any[];
  };
}

// tooltip component

export type CustomTooltipCallback = (
  datum: any,
  element: IElement,
  parameters: any
) => TooltipRowAttrs | TooltipRowAttrs[];

export interface ITooltipRow {
  visible?: boolean;
  key?: MarkFunctionType<string | Partial<ITextGraphicAttribute>> | FieldEncodeType;
  value?: MarkFunctionType<string | Partial<ITextGraphicAttribute>> | FieldEncodeType;
  symbol?: MarkFunctionType<string | Partial<ISymbolGraphicAttribute>> | FieldEncodeType;
}

export interface IBaseTooltip extends IComponent {
  title: (title: ITooltipRow | string | CustomTooltipCallback | Nil) => this;
  content: (content: ITooltipRow | ITooltipRow[] | CustomTooltipCallback | Nil) => this;
}

export interface ITooltip extends IBaseTooltip {
  target: (mark: IMark | IMark[] | string | string[] | Nil) => this;
}

export interface BaseTooltipSpec extends ComponentSpec<TooltipAttributes> {
  title?: ITooltipRow | string | CustomTooltipCallback;
  content?: ITooltipRow | ITooltipRow[] | CustomTooltipCallback;
}

export interface TooltipSpec extends BaseTooltipSpec {
  componentType: ComponentEnum.tooltip;
  target?: IMark | IMark[] | string | string[];
}

export type TooltipType = 'x' | 'y' | 'angle' | 'radius';

export interface IDimensionTooltip extends IBaseTooltip {
  scale: (scale?: IScale | string | Nil) => this;
  tooltipType: (tooltipType: TooltipType | Nil) => this;
  target: (data: IData | string | Nil, filter: string | ((datum: any, tooltipValue: any) => boolean) | Nil) => this;
  avoidMark: (mark: IMark | IMark[] | string | string[] | Nil) => this;
}

export interface DimensionTooltipSpec extends BaseTooltipSpec {
  componentType: ComponentEnum.dimensionTooltip;
  scale?: IScale | string;
  tooltipType?: TooltipType;
  target?: {
    data: IData | string;
    filter: string | ((datum: any, tooltipValue: any) => boolean);
  };
  avoidMark?: IMark | IMark[] | string | string[];
  componentConfig?: { center?: IPointLike };
}

// title component

export interface ITitle extends IComponent {
  title: (text: MarkFunctionType<string | number | number[] | string[]> | Nil) => this;
  subTitle: (text: MarkFunctionType<string | number | number[] | string[]> | Nil) => this;
}

export interface TitleSpec extends ComponentSpec<Partial<TitleAttrs>> {
  componentType: ComponentEnum.title;
  title?: MarkFunctionType<string | number | number[] | string[]>;
  subTitle?: MarkFunctionType<string | number | number[] | string[]>;
}

// scrollbar component

export type ScrollbarFilterValue = { start?: number; end?: number; startRatio: number; endRatio: number };

export interface IScrollbar extends IScaleComponent {
  target: (
    data: IData | string | Nil,
    filter: string | ((datum: any, value: ScrollbarFilterValue) => boolean) | Nil
  ) => this;
  container: (container: IGroupMark | string | Nil) => this;
  direction: (direction: MarkFunctionType<Direction> | Nil) => this;
  position: (position: MarkFunctionType<OrientType> | Nil) => this;

  // immediate functions
  setScrollStart: (start: number) => this;
}

export interface ScrollbarSpec extends ScaleComponentSpec<Partial<ScrollBarAttributes>> {
  componentType: ComponentEnum.scrollbar;
  target?: {
    data: IData | string;
    filter: string | ((datum: any, value: ScrollbarFilterValue) => boolean);
  };
  container?: IGroupMark | string;
  direction?: MarkFunctionType<Direction>;
  position?: MarkFunctionType<OrientType>;
}

// built-in components

export type BuiltInComponentSpec =
  | AxisSpec
  | LegendSpec
  | CrosshairSpec
  | SliderSpec
  | DatazoomSpec
  | LabelSpec
  | PlayerSpec
  | TooltipSpec
  | DimensionTooltipSpec
  | TitleSpec
  | ScrollbarSpec;

export interface IComponentConstructor {
  readonly componentType: string;

  new (view: IView, group?: IGroupMark, mode?: '2d' | '3d'): IComponent;
}
