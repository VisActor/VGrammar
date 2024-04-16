import type { IVennArea, IVennParams } from './utils/interface';
import type {
  VGRAMMAR_VENN_CIRCLE_RADIUS,
  VGRAMMAR_VENN_CIRCLE_X,
  VGRAMMAR_VENN_CIRCLE_Y,
  VGRAMMAR_VENN_DATUM_TYPE,
  VGRAMMAR_VENN_LABEL_X,
  VGRAMMAR_VENN_LABEL_Y,
  VGRAMMAR_VENN_OVERLAP_PATH
} from './constants';

export interface IVennTransformOptions extends IVennParams {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  setField?: string;
  valueField?: string;
  orientation?: number;
  orientationOrder?: any;
}

export interface IVennTransformMarkOptions {
  datumType: 'circle' | 'overlap';
}

export interface IVennCircleDatum extends IVennArea, IVennLabelDatum {
  [VGRAMMAR_VENN_DATUM_TYPE]: 'circle';
  [VGRAMMAR_VENN_CIRCLE_X]: number;
  [VGRAMMAR_VENN_CIRCLE_Y]: number;
  [VGRAMMAR_VENN_CIRCLE_RADIUS]: number;
}

export interface IVennOverlapDatum extends IVennArea, IVennLabelDatum {
  [VGRAMMAR_VENN_DATUM_TYPE]: 'overlap';
  [VGRAMMAR_VENN_OVERLAP_PATH]: string;
}

export interface IVennLabelDatum {
  [VGRAMMAR_VENN_LABEL_X]?: number;
  [VGRAMMAR_VENN_LABEL_Y]?: number;
  label?: string;
}
