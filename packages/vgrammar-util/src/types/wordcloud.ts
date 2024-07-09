/**
 * text mask of wordcloud
 */
export interface TextShapeMask {
  type: 'text';
  text: string;
  hollow?: boolean;
  backgroundColor?: string;
  fill?: string;
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: string;
  fontVariant: string;
}

/**
 * text mask of wordcloud
 */
export interface GeometricMaskShape {
  type: 'geometric';
  shape: string;
  hollow?: boolean;
  backgroundColor?: string;
  fill?: string;
}

export type CanvasMaskShape = TextShapeMask | GeometricMaskShape;
