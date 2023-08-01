import { Interval } from './interval';
import { Line } from './line';
import { Cell } from './cell';
import { RuleX } from './rule-x';
import { RuleY } from './rule-y';
import { Area } from './area';
import { Plot } from './plot';

Plot.useMarks([Interval, Line, Cell, RuleX, RuleY, Area]);

export { Plot };
