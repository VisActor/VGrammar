import type { IColor } from '@visactor/vrender';
import type {
  ArcLabelAttrs,
  BaseLabelAttrs,
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
  TitleAttrs,
  TooltipAttributes
} from '@visactor/vrender-components';
import type { IPadding } from '@visactor/vutils';
import type { RecursivePartial } from './base';
import type { BasicEncoderSpecMap } from '.';

// glyph mark includes multiple types, not support theme for glyph for now
export type IMarkTheme = Partial<Omit<BasicEncoderSpecMap, 'glyph'>>;

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
  pointLabel?: RecursivePartial<BaseLabelAttrs>;

  datazoom?: RecursivePartial<DataZoomAttributes>;

  continuousPlayer?: RecursivePartial<ContinuousPlayerAttributes>;
  discretePlayer?: RecursivePartial<DiscretePlayerAttributes>;

  tooltip?: RecursivePartial<TooltipAttributes>;

  title?: RecursivePartial<TitleAttrs>;
}

export interface ITheme {
  name?: string;
  background?: IColor;
  padding?: IPadding | number;
  palette?: Record<string, IColor[]>;
  marks?: IMarkTheme;
  components?: IComponentTheme;
}
