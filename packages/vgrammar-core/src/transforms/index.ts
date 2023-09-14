import { transform as binTransform } from './data/bin';
import { transform as contourTransform } from './data/contour';
import { transform as sortTransform } from './data/sort';
import { transform as filterTransform } from './data/filter';
import { transform as mapTransform } from './data/map';
import { transform as kdeTransform } from './data/kde';
import { transform as joinTransform } from './data/join';
import { transform as pickTransform } from './data/pick';
import { transform as rangeTransform } from './data/range';
import { transform as stackTransform } from './data/stack';
import { transform as foldTransform } from './data/fold';
import { transform as unfoldTransform } from './data/unfold';

import { transform as funnelTransform } from './data/funnel';
import { transform as pieTransform } from './data/pie';
import { transform as circularRelationTransform } from './data/circular-relation';

import { transform as lttbsampleTransform } from './mark/lttb-sample';
import { transform as markoverlapTransform } from './mark/mark-overlap';

import { transform as identifierTransform } from './view/identifier';

import { transform as dodgeTransform } from './mark/dodge';
import { transform as jitterTransform, jitterX as jitterXTransform, jitterY as jitterYTransform } from './mark/jitter';
import { symmetry as symmetryTransform } from './mark/symmetry';
import { Factory } from '../core/factory';
import type { ITransform } from '../types';

export const registerBinTransform = () => {
  Factory.registerTransform(
    'bin',
    { transform: binTransform, markPhase: 'beforeJoin' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerContourTransform = () => {
  Factory.registerTransform(
    'contour',
    { transform: contourTransform, markPhase: 'beforeJoin' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerSortTransform = () => {
  Factory.registerTransform(
    'sort',
    { transform: sortTransform, markPhase: 'beforeJoin' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerFilterTransform = () => {
  Factory.registerTransform(
    'filter',
    { transform: filterTransform, markPhase: 'beforeJoin' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerJoinTransform = () => {
  Factory.registerTransform(
    'join',
    { transform: joinTransform, markPhase: 'beforeJoin' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerKdeTransform = () => {
  Factory.registerTransform(
    'kde',
    { transform: kdeTransform, markPhase: 'beforeJoin' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerMapTransform = () => {
  Factory.registerTransform(
    'map',
    { transform: mapTransform, markPhase: 'beforeJoin' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerPickTransform = () => {
  Factory.registerTransform(
    'pick',
    { transform: pickTransform, markPhase: 'beforeJoin' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerRangeTransform = () => {
  Factory.registerTransform(
    'range',
    { transform: rangeTransform, markPhase: 'beforeJoin' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerStackTransform = () => {
  Factory.registerTransform(
    'stack',
    { transform: stackTransform, markPhase: 'beforeJoin' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerFunnelTransform = () => {
  Factory.registerTransform(
    'funnel',
    { transform: funnelTransform, markPhase: 'beforeJoin' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerPieTransform = () => {
  Factory.registerTransform(
    'pie',
    { transform: pieTransform, markPhase: 'beforeJoin' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerCircularRelationTransform = () => {
  Factory.registerTransform(
    'circularRelation',
    { transform: circularRelationTransform, markPhase: 'beforeJoin' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerFoldTransform = () => {
  Factory.registerTransform(
    'fold',
    { transform: foldTransform, markPhase: 'beforeJoin' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerUnfoldTransform = () => {
  Factory.registerTransform(
    'unfold',
    { transform: unfoldTransform, markPhase: 'beforeJoin' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerIdentifierTransform = () => {
  Factory.registerTransform(
    'identifier',
    { transform: identifierTransform, markPhase: 'beforeJoin' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerLttbSampleTransform = () => {
  Factory.registerTransform(
    'lttbsample',
    { transform: lttbsampleTransform, markPhase: 'afterEncode' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerMarkOverlapTransform = () => {
  Factory.registerTransform(
    'markoverlap',
    { transform: markoverlapTransform, markPhase: 'afterEncode' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerDodgeTransform = () => {
  Factory.registerTransform(
    'dodge',
    { transform: dodgeTransform, markPhase: 'afterEncodeItems' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerJitterTransform = () => {
  Factory.registerTransform(
    'jitter',
    { transform: jitterTransform, markPhase: 'afterEncodeItems' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerJitterXTransform = () => {
  Factory.registerTransform(
    'jitterX',
    { transform: jitterXTransform, markPhase: 'afterEncodeItems' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerJitterYTransform = () => {
  Factory.registerTransform(
    'jitterY',
    { transform: jitterYTransform, markPhase: 'afterEncodeItems' } as Omit<ITransform, 'type'>,
    true
  );
};

export const registerSymmetryTransform = () => {
  Factory.registerTransform(
    'symmetry',
    { transform: symmetryTransform, markPhase: 'afterEncodeItems' } as Omit<ITransform, 'type'>,
    true
  );
};
