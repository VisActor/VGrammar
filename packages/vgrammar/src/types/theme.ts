import type {
  IArc3dGraphicAttribute,
  IArcGraphicAttribute,
  IAreaGraphicAttribute,
  ICircleGraphicAttribute,
  IColor,
  IGroupGraphicAttribute,
  IImageGraphicAttribute,
  ILineGraphicAttribute,
  IPathGraphicAttribute,
  IPolygonGraphicAttribute,
  IPyramid3dGraphicAttribute,
  IRect3dGraphicAttribute,
  IRectGraphicAttribute,
  IRichTextGraphicAttribute,
  ISymbolAttribute,
  ISymbolGraphicAttribute,
  ITextGraphicAttribute
} from '@visactor/vrender';
import type {
  ArcLabelAttrs,
  CircleAxisAttributes,
  CircleCrosshairAttrs,
  ColorLegendAttributes,
  ContinuousPlayerAttributes,
  DataLabelAttrs,
  DataZoomAttributes,
  DiscreteLegendAttrs,
  DiscretePlayerAttributes,
  LineAxisAttributes,
  LineCrosshairAttrs,
  LineLabelAttrs,
  PolygonCrosshairAttrs,
  RectCrosshairAttrs,
  RectLabelAttrs,
  SectorCrosshairAttrs,
  SizeLegendAttributes,
  SliderAttributes,
  SymbolLabelAttrs,
  TooltipAttributes
} from '@visactor/vrender-components';
import type { IPadding } from '@visactor/vutils';
import type { RecursivePartial } from './base';

export interface IMarkTheme {
  rect?: IRectGraphicAttribute & { y1?: number; x1?: number };
  line?: Omit<ILineGraphicAttribute, 'points' | 'segments'>;
  circle?: ICircleGraphicAttribute;
  arc?: IArcGraphicAttribute;
  polygon?: IPolygonGraphicAttribute;
  arc3d?: IArc3dGraphicAttribute;
  pyramid3d?: IPyramid3dGraphicAttribute;
  area?: Omit<IAreaGraphicAttribute, 'points' | 'segments'>;
  group?: IGroupGraphicAttribute;
  image?: IImageGraphicAttribute;
  rect3d?: IRect3dGraphicAttribute;
  path?: IPathGraphicAttribute;
  rule?: Omit<ILineGraphicAttribute, 'points' | 'segments'> & { x1?: number; y1?: number };
  shape?: IPathGraphicAttribute;
  symbol?: ISymbolGraphicAttribute & { shape?: ISymbolAttribute['symbolType'] };
  text?: ITextGraphicAttribute & {
    limit?: number;
    autoLimit?: number;
  };
  richtext?: IRichTextGraphicAttribute;
  interval?: Omit<IRectGraphicAttribute, 'width' | 'height'> & {
    innerGap?: number | string;
    maxWidth?: number;
    minWidth?: number;
    categoryGap?: number | string;
  };
  cell?: ISymbolGraphicAttribute & {
    padding?: number | [number, number];
    shape?: ISymbolAttribute['symbolType'];
  };
}

export interface IComponentTheme {
  axis?: RecursivePartial<LineAxisAttributes>;
  circleAxis?: RecursivePartial<CircleAxisAttributes>;

  discreteLegend?: RecursivePartial<DiscreteLegendAttrs>;
  colorLegend?: RecursivePartial<ColorLegendAttributes>;
  sizeLegend?: RecursivePartial<SizeLegendAttributes>;

  lineCrosshair?: RecursivePartial<LineCrosshairAttrs>;
  rectCrosshair?: RecursivePartial<RectCrosshairAttrs>;
  sectorCrosshair?: RecursivePartial<SectorCrosshairAttrs>;
  circleCrosshair?: RecursivePartial<CircleCrosshairAttrs>;
  polygonCrosshair?: RecursivePartial<PolygonCrosshairAttrs>;

  slider?: RecursivePartial<SliderAttributes>;

  dataLabel?: RecursivePartial<DataLabelAttrs>;
  lineLabel?: RecursivePartial<LineLabelAttrs>;
  rectLabel?: RecursivePartial<RectLabelAttrs>;
  arcLabel?: RecursivePartial<ArcLabelAttrs>;
  symbolLabel?: RecursivePartial<SymbolLabelAttrs>;

  datazoom?: RecursivePartial<DataZoomAttributes>;

  continuousPlayer?: RecursivePartial<ContinuousPlayerAttributes>;
  discretePlayer?: RecursivePartial<DiscretePlayerAttributes>;

  tooltip?: RecursivePartial<TooltipAttributes>;
}

export interface ITheme {
  name?: string;
  background?: IColor;
  padding?: IPadding | number;
  palette?: Record<string, IColor[]>;
  marks?: IMarkTheme;
  components?: IComponentTheme;
}
