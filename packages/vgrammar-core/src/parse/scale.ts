import {
  isArray,
  isFunction,
  isNil,
  isNumber,
  isString,
  isValidNumber,
  maxInArray,
  minInArray
} from '@visactor/vutils';
import type {
  IBaseScale,
  IBandLikeScale,
  ILinearScale,
  IPowScale,
  ILogScale,
  ISymlogScale,
  IContinuousScale,
  IContinuesScaleTicks,
  IQuantizeScale,
  IQuantileScale
} from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import {
  LinearScale,
  BandScale,
  OrdinalScale,
  PointScale,
  isContinuous,
  TimeScale,
  ThresholdScale,
  SqrtScale,
  SymlogScale,
  QuantizeScale,
  QuantileScale,
  PowScale,
  LogScale,
  isDiscretizing,
  IdentityScale
} from '@visactor/vscale';
import type { IView } from '../types/view';
import type { IGrammarBase } from '../types/grammar';
import type {
  BandScaleSpec,
  BaseBandScaleSpec,
  LinearScaleSpec,
  OrdinalScaleSpec,
  PointScaleSpec,
  ScaleFunctionType,
  ScaleData,
  MultiScaleData,
  ScaleSpec,
  ScaleConfigureSpec,
  ScaleCoordinate,
  PowScaleSpec,
  ContinuousScaleSpec,
  ScaleTicksSpec,
  ScaleDomainSpec,
  LogScaleSpec,
  SqrtScaleSpec,
  SymlogScaleSpec,
  QuantizeScaleSpec,
  TimeScaleSpec,
  GrammarScaleType
} from '../types/scale';
import { getGrammarOutput, invokeFunctionType, parseFunctionType } from './util';
import { field as getFieldAccessor } from '@visactor/vgrammar-util';

export function createScale(type: GrammarScaleType): IBaseScale {
  switch (type) {
    case 'band':
      return new BandScale();
    case 'linear':
      return new LinearScale();
    case 'log':
      return new LogScale();
    case 'ordinal':
      return new OrdinalScale();
    case 'point':
      return new PointScale();
    case 'pow':
      return new PowScale();
    case 'quantile':
      return new QuantileScale();
    case 'quantize':
      return new QuantizeScale();
    case 'sqrt':
      return new SqrtScale();
    case 'symlog':
      return new SymlogScale();
    case 'threshold':
      return new ThresholdScale();
    case 'time':
      return new TimeScale();
    case 'utc':
      return new TimeScale(true);
    case 'identity':
      return new IdentityScale();
  }
  return new LinearScale();
}

function isScaleDataType(spec: ScaleData | any): spec is ScaleData {
  return !isNil(spec?.data);
}

function parseScaleDataType(spec: ScaleData, view: IView): IGrammarBase[] {
  if (isString(spec.data)) {
    const data = view.getGrammarById(spec.data as string);
    return data ? [data] : [];
  } else if ((spec.data as IGrammarBase)?.grammarType === 'data') {
    return [spec.data as IGrammarBase];
  }
  return [];
}

function isMultiScaleDataType(spec: MultiScaleData | any): spec is MultiScaleData {
  return !isNil(spec?.datas);
}

function parseMultiScaleDataType(spec: MultiScaleData, view: IView): IGrammarBase[] {
  if (spec?.datas && spec.datas.length) {
    const res: IGrammarBase[] = [];
    spec.datas.forEach(data => {
      const gramarBase = parseScaleDataType(data, view);

      if (gramarBase.length) {
        res.push(gramarBase[0]);
      }
    });

    return res;
  }

  return [];
}

function isScaleCoordinateType(spec: ScaleCoordinate | any): spec is ScaleCoordinate {
  return !isNil(spec?.coordinate);
}

function parseScaleCoordinateType(spec: ScaleCoordinate, view: IView): IGrammarBase[] {
  if (isString(spec.coordinate)) {
    const coordinate = view.getCoordinateById(spec.coordinate as string);
    return coordinate ? [coordinate] : [];
  } else if ((spec.coordinate as IGrammarBase)?.grammarType === 'coordinate') {
    return [spec.coordinate as IGrammarBase];
  }
  return [];
}

function parseLinearScale(spec: Omit<LinearScaleSpec, 'type'>, view: IView) {
  let dependencies: IGrammarBase[] = [];
  dependencies = dependencies.concat(parseFunctionType(spec.nice, view));
  dependencies = dependencies.concat(parseFunctionType(spec.niceMin, view));
  dependencies = dependencies.concat(parseFunctionType(spec.niceMax, view));
  dependencies = dependencies.concat(parseFunctionType(spec.min, view));
  dependencies = dependencies.concat(parseFunctionType(spec.max, view));
  dependencies = dependencies.concat(parseFunctionType(spec.zero, view));
  dependencies = dependencies.concat(parseFunctionType(spec.roundRange, view));
  return dependencies;
}

function parsePowScale(spec: PowScaleSpec, view: IView) {
  const dependencies = parseLinearScale(spec, view);
  return dependencies.concat(parseFunctionType(spec.exponent, view));
}

function parseSymlogScale(spec: SymlogScaleSpec, view: IView) {
  const dependencies = parseLinearScale(spec, view);
  return dependencies.concat(parseFunctionType(spec.constant, view));
}

function parseLogScale(spec: Omit<LogScaleSpec, 'type'>, view: IView) {
  let dependencies: IGrammarBase[] = [];
  dependencies = dependencies.concat(parseFunctionType(spec.nice, view));
  dependencies = dependencies.concat(parseFunctionType(spec.min, view));
  dependencies = dependencies.concat(parseFunctionType(spec.max, view));
  dependencies = dependencies.concat(parseFunctionType(spec.zero, view));
  dependencies = dependencies.concat(parseFunctionType(spec.roundRange, view));
  return dependencies;
}

function parseQuantizeScale(spec: QuantizeScaleSpec, view: IView) {
  let dependencies: IGrammarBase[] = [];
  dependencies = dependencies.concat(parseFunctionType(spec.nice, view));
  dependencies = dependencies.concat(parseFunctionType(spec.niceMin, view));
  dependencies = dependencies.concat(parseFunctionType(spec.niceMax, view));
  dependencies = dependencies.concat(parseFunctionType(spec.min, view));
  dependencies = dependencies.concat(parseFunctionType(spec.max, view));
  dependencies = dependencies.concat(parseFunctionType(spec.zero, view));
  return dependencies;
}

function parseOrdinalScale(spec: OrdinalScaleSpec, view: IView) {
  return [] as IGrammarBase[];
}

function parseBaseBandScale(spec: BaseBandScaleSpec, view: IView) {
  let dependencies: IGrammarBase[] = [];
  dependencies = dependencies.concat(parseFunctionType(spec.round, view));
  dependencies = dependencies.concat(parseFunctionType(spec.padding, view));
  dependencies = dependencies.concat(parseFunctionType(spec.paddingInner, view));
  dependencies = dependencies.concat(parseFunctionType(spec.paddingOuter, view));
  dependencies = dependencies.concat(parseFunctionType(spec.align, view));
  return dependencies;
}

function parseBandScale(spec: BandScaleSpec, view: IView) {
  const dependencies = parseBaseBandScale(spec, view);
  return dependencies.concat(parseFunctionType(spec.paddingInner, view));
}

function parsePointScale(spec: PointScaleSpec, view: IView) {
  return parseBaseBandScale(spec, view);
}

export function parseScaleDomainRange(domain: ScaleFunctionType<any> | ScaleData | MultiScaleData, view: IView) {
  if (isScaleDataType(domain)) {
    return parseScaleDataType(domain, view);
  }

  if (isMultiScaleDataType(domain)) {
    return parseMultiScaleDataType(domain, view);
  }

  if (isScaleCoordinateType(domain)) {
    return parseScaleCoordinateType(domain, view);
  }
  return parseFunctionType(domain, view);
}

export function parseScaleConfig(type: GrammarScaleType, config: ScaleConfigureSpec, view: IView): IGrammarBase[] {
  if (isNil(config)) {
    return [];
  }
  const deps: IGrammarBase[] = parseFunctionType(config.unknown, view);
  switch (type) {
    case 'linear':
    case 'sqrt':
      return deps.concat(parseLinearScale(config as LinearScaleSpec, view));
    case 'ordinal':
      return deps.concat(parseOrdinalScale(config as OrdinalScaleSpec, view));
    case 'band':
      return deps.concat(parseBandScale(config as BandScaleSpec, view));
    case 'point':
      return deps.concat(parsePointScale(config as PointScaleSpec, view));
    case 'pow':
      return deps.concat(parsePowScale(config as PowScaleSpec, view));
    case 'log':
    case 'time':
    case 'utc':
      return deps.concat(parseLogScale(config as LogScaleSpec, view));
    case 'symlog':
      return deps.concat(parseSymlogScale(config as SymlogScaleSpec, view));
    case 'quantize':
      return deps.concat(parseQuantizeScale(config as QuantizeScaleSpec, view));
  }
  return deps;
}

function configureScaleNice(spec: Pick<ScaleTicksSpec, 'nice'>, scale: IContinuesScaleTicks, parameters: any) {
  const nice = invokeFunctionType(spec.nice, parameters, scale);
  if (nice === true) {
    scale.nice();
  } else if (isValidNumber(nice)) {
    scale.nice(nice as number);
  }
}
function configureScaleNiceMinMax(
  spec: Pick<ScaleTicksSpec, 'niceMin' | 'niceMax'>,
  scale: IContinuesScaleTicks,
  parameters: any
) {
  const niceMax = invokeFunctionType(spec.niceMax, parameters, scale);
  if (niceMax === true) {
    scale.niceMax();
  } else if (isValidNumber(niceMax)) {
    scale.niceMax(niceMax as number);
  }
  const niceMin = invokeFunctionType(spec.niceMin, parameters, scale);
  if (niceMin === true) {
    scale.niceMin();
  } else if (isValidNumber(niceMin)) {
    scale.niceMin(niceMin as number);
  }
}

function configureScaleDomain(spec: ScaleDomainSpec, scale: IBaseScale, parameters: any) {
  const min = invokeFunctionType(spec.min, parameters, scale);
  const max = invokeFunctionType(spec.max, parameters, scale);
  const zero = invokeFunctionType(spec.zero, parameters, scale);
  const hasValidMin = isValidNumber(min);
  const hasValidmax = isValidNumber(max);
  const prevDomain = scale.domain();

  if (prevDomain.length === 2 && (hasValidMin || hasValidmax || zero)) {
    let newMin = Math.min(prevDomain[0], prevDomain[prevDomain.length - 1]);
    let newMax = Math.max(prevDomain[0], prevDomain[prevDomain.length - 1]);

    if (zero && newMin > 0) {
      newMin = 0;
    } else if (hasValidMin) {
      newMin = Math.min(newMin, min);
    }

    if (zero && newMax < 0) {
      newMax = 0;
    } else if (hasValidmax) {
      newMax = Math.max(newMax, max);
    }

    scale.domain([newMin, newMax], true);
  }
}

function configureContinuousScale(spec: Omit<ContinuousScaleSpec, 'type'>, scale: IContinuousScale, parameters: any) {
  const rangeRound = invokeFunctionType(spec.roundRange, parameters, scale);

  if (rangeRound) {
    scale.rangeRound(scale.range(), true);
  }

  const config = invokeFunctionType(spec.config, parameters, scale);

  if (config?.interpolate) {
    scale.interpolate(config.interpolate, true);
  }

  if (!isNil(config?.clamp)) {
    if (isFunction(config.clamp)) {
      scale.clamp(true, config.clamp, true);
    } else {
      scale.clamp(config.clamp, undefined, true);
    }
  }

  const tickCount = invokeFunctionType(spec.tickCount, parameters, scale);
  if (tickCount) {
    // tickCount may change the domain of scale, so need to call here
    scale.tickData(tickCount);
  }
}

function configureLinearScale(spec: Omit<LinearScaleSpec, 'type'>, scale: ILinearScale, parameters: any) {
  configureScaleNice(spec, scale, parameters);
  configureScaleNiceMinMax(spec, scale, parameters);
  configureScaleDomain(spec, scale, parameters);
  configureContinuousScale(spec, scale, parameters);
}

function configurePowScale(spec: PowScaleSpec, scale: IPowScale, parameters: any) {
  configureLinearScale(spec, scale, parameters);

  const exponent = invokeFunctionType(spec.exponent, parameters, scale);
  if (exponent > 0) {
    scale.exponent(exponent as number);
  }
}

function configureLogScale(spec: LogScaleSpec, scale: ILogScale, parameters: any) {
  configureScaleNice(spec, scale, parameters);
  configureScaleDomain(spec, scale, parameters);

  const base = invokeFunctionType(spec.base, parameters, scale);
  if (base > 0) {
    scale.base(base as number);
  }
  configureContinuousScale(spec, scale, parameters);
}

function configureSqrtScale(spec: SqrtScaleSpec, scale: ILinearScale, parameters: any) {
  configureLinearScale(spec, scale, parameters);
}

function configureTimeScale(spec: Omit<TimeScaleSpec, 'type'>, scale: ILinearScale, parameters: any) {
  configureScaleNice(spec, scale, parameters);
  configureScaleDomain(spec, scale, parameters);
  configureContinuousScale(spec, scale, parameters);
}

function configureSymlogScale(spec: SymlogScaleSpec, scale: ISymlogScale, parameters: any) {
  configureLinearScale(spec, scale, parameters);

  const constant = invokeFunctionType(spec.constant, parameters, scale);
  if (isValidNumber(constant)) {
    scale.constant(constant as number);
  }
}

function configureQuantizeScale(spec: QuantizeScaleSpec, scale: IQuantizeScale, parameters: any) {
  configureScaleNice(spec, scale, parameters);
  configureScaleNiceMinMax(spec, scale, parameters);
  configureScaleDomain(spec, scale, parameters);
}

function configureBaseBandScale(spec: BaseBandScaleSpec, scale: IBandLikeScale, parameters: any) {
  spec.round && scale.round(invokeFunctionType(spec.round, parameters, scale), true);
  spec.padding && scale.padding(invokeFunctionType(spec.padding, parameters, scale), true);
  spec.paddingInner && scale.paddingInner(invokeFunctionType(spec.paddingInner, parameters, scale), true);
  spec.paddingOuter && scale.paddingOuter(invokeFunctionType(spec.paddingOuter, parameters, scale), true);
  spec.align && scale.align(invokeFunctionType(spec.align, parameters, scale), true);
}

function configureBandScale(spec: BandScaleSpec, scale: IBandLikeScale, parameters: any) {
  return configureBaseBandScale(spec, scale, parameters);
}

function configurePointScale(spec: PointScaleSpec, scale: IBandLikeScale, parameters: any) {
  return configureBaseBandScale(spec, scale, parameters);
}

function parseFieldData(spec: ScaleData, parameters: any) {
  const field = spec.field;
  const refData = getGrammarOutput(spec.data, parameters) as any[];
  const fieldData: any[] = [];

  if (isArray(field)) {
    field.forEach(entry => {
      const getter = getFieldAccessor(entry);

      refData &&
        refData.forEach(datum => {
          fieldData.push(getter(datum));
        });
    });
  } else {
    const getter = getFieldAccessor(field);

    refData &&
      refData.forEach(datum => {
        fieldData.push(getter(datum));
      });
  }

  return fieldData;
}
function parseMultiFieldData(spec: MultiScaleData, parameters: any) {
  let fieldData: any[] = [];

  spec.datas.forEach(entry => {
    fieldData = fieldData.concat(parseFieldData(entry, parameters));
  });

  return fieldData;
}

function parseScaleDataTypeValue(
  fieldData: any[],
  scale: IBaseScale,
  sort?: (datumA: any, datumB: any) => number,
  filterNumber?: boolean
) {
  if (sort) {
    fieldData.sort(sort);
  }

  if (!isContinuous(scale.type)) {
    return fieldData;
  }

  if (filterNumber) {
    fieldData.filter(entry => isNumber(entry));
  }
  return [minInArray(fieldData), maxInArray(fieldData)];
}

export function configureScale(spec: ScaleSpec, scale: IBaseScale, parameters: any) {
  if (isScaleDataType(spec.domain)) {
    scale.domain(parseScaleDataTypeValue(parseFieldData(spec.domain, parameters), scale, spec.domain.sort, true), true);
  } else if (isMultiScaleDataType(spec.domain)) {
    scale.domain(
      parseScaleDataTypeValue(parseMultiFieldData(spec.domain, parameters), scale, spec.domain.sort, true),
      true
    );
  } else {
    scale.domain(invokeFunctionType(spec.domain, parameters, scale), true);
  }

  if (spec.type !== 'identity') {
    if (isScaleDataType(spec.range)) {
      scale.range(parseScaleDataTypeValue(parseFieldData(spec.range, parameters), scale), true);
    } else if (isMultiScaleDataType(spec.range)) {
      scale.range(parseScaleDataTypeValue(parseMultiFieldData(spec.range, parameters), scale), true);
    } else if (isScaleCoordinateType(spec.range)) {
      const coord = getGrammarOutput(spec.range.coordinate, parameters);

      if (!isDiscretizing(scale.type) && coord) {
        scale.range(coord.getRangeByDimension(spec.range.dimension, spec.range.isSubshaft, spec.range.reversed));
      }
    } else {
      scale.range(invokeFunctionType(spec.range, parameters, scale), true);
    }
  }
  if (!isNil(spec.unknown)) {
    scale.unknown(invokeFunctionType(spec.unknown, parameters, scale));
  }

  switch (spec.type) {
    case 'linear':
      configureLinearScale(spec, scale as ILinearScale, parameters);
      (scale as ILinearScale).rescale();
      break;
    case 'band':
      configureBandScale(spec, scale as IBandLikeScale, parameters);
      (scale as IBandLikeScale).rescale();
      break;
    case 'point':
      configurePointScale(spec, scale as IBandLikeScale, parameters);
      (scale as IBandLikeScale).rescale();
      break;
    case 'pow':
      configurePowScale(spec, scale as IPowScale, parameters);
      (scale as IContinuousScale).rescale();
      break;
    case 'log':
      configureLogScale(spec, scale as ILogScale, parameters);
      (scale as IContinuousScale).rescale();
      break;
    case 'sqrt':
      configureSqrtScale(spec, scale as ILinearScale, parameters);
      (scale as IContinuousScale).rescale();
      break;
    case 'symlog':
      configureSymlogScale(spec, scale as ISymlogScale, parameters);
      (scale as IContinuousScale).rescale();
      break;
    case 'time':
    case 'utc':
      configureTimeScale(spec, scale as ILinearScale, parameters);
      (scale as IContinuousScale).rescale();
      break;
    case 'quantize':
      configureQuantizeScale(spec, scale as IQuantizeScale, parameters);
      (scale as IQuantizeScale).rescale();
      break;
    case 'quantile':
      (scale as IQuantileScale).rescale();
      break;
  }
}
