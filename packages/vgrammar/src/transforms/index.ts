import { transform as sortTransform } from './data/sort';
import { transform as filterTransform } from './data/filter';
import { transform as mapTransform } from './data/map';
import { transform as joinTransform } from './data/join';
import { transform as pickTransform } from './data/pick';
import { transform as rangeTransform } from './data/range';
import { transform as stackTransform } from './data/stack';

import { transform as funnelTransform } from './data/funnel';
import { transform as pieTransform } from './data/pie';

import { transform as lttbsampleTransform } from './mark/lttb-sample';
import { transform as markoverlapTransform } from './mark/mark-overlap';

import { transform as identifierTransform } from './view/identifier';

import { transform as dodgeTransform } from './mark/dodge';
import type { ITransform } from '../types';

export const transforms: Record<string, Omit<ITransform, 'type'>> = {
  sort: { transform: sortTransform, markPhase: 'beforeJoin' },
  filter: { transform: filterTransform, markPhase: 'beforeJoin' },
  map: { transform: mapTransform, markPhase: 'beforeJoin' },
  lookup: { transform: joinTransform, markPhase: 'beforeJoin' },
  pick: { transform: pickTransform, markPhase: 'beforeJoin' },
  range: { transform: rangeTransform, markPhase: 'beforeJoin' },
  stack: { transform: stackTransform, markPhase: 'beforeJoin' },
  funnel: { transform: funnelTransform, markPhase: 'beforeJoin' },
  pie: { transform: pieTransform, markPhase: 'beforeJoin' },

  lttbsample: { transform: lttbsampleTransform, markPhase: 'afterEncode' },
  markoverlap: { transform: markoverlapTransform, markPhase: 'afterEncode' },

  identifier: { transform: identifierTransform, markPhase: 'beforeJoin' },
  dodge: { transform: dodgeTransform, markPhase: 'afterEncodeItems' }
};
