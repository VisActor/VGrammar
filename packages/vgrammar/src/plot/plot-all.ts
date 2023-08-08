import { Interval } from './interval';
import { Line } from './line';
import { Cell } from './cell';
import { RuleX } from './rule-x';
import { RuleY } from './rule-y';
import { Area } from './area';
import { Plot } from './plot';
import { ImageSemanticMark } from './image';
import { PathSemanticMark } from './path';
import { PolygonSemanticMark } from './polygon';
import { RectXSemanticMark } from './rect-x';
import { RectYSemanticMark } from './rect-y';
import { RectSemanticMark } from './rect';
import { Rule } from './rule';
import { SymbolSemanticMark } from './symbol';
import { TextSemanticMark } from './text';
import { SankeySemanticMark } from './sankey';
import { SunburstSemanticMark } from './sunburst';
import { TreemapSemanticMark } from './treemap';
import { CirclePackingSemanticMark } from './circle-packing';
import { TreeSemanticMark } from './tree';
import { WordcloudSemanticMark } from './wordcloud';
import { WordcloudShapeSemanticMark } from './wordcloud-shape';

Plot.useMarks([
  Interval,
  Line,
  Cell,
  RuleX,
  RuleY,
  Area,
  ImageSemanticMark,
  PathSemanticMark,
  PolygonSemanticMark,
  RectSemanticMark,
  RectXSemanticMark,
  RectYSemanticMark,
  Rule,
  SymbolSemanticMark,
  TextSemanticMark,
  SankeySemanticMark,
  SunburstSemanticMark,
  TreemapSemanticMark,
  CirclePackingSemanticMark,
  TreeSemanticMark,
  WordcloudSemanticMark,
  WordcloudShapeSemanticMark
]);

export { Plot };
