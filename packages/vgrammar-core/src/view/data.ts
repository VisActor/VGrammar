import { array, isNil } from '@visactor/vutils';
import type {
  IGrammarBase,
  DataSpec,
  IData,
  GrammarType,
  DataFormatSpec,
  IView,
  IGrammarTask,
  TransformSpec,
  ParameterFunctionType,
  IDataFilter
} from '../types';
import { GrammarBase } from './grammar-base';
import { invokeParameterFunctionType, isGrammar, parseFunctionType } from '../parse/util';
import { parseTransformSpec } from '../parse/transform';
import type { Nil } from '../types/base';
import { HOOK_EVENT } from '../graph/enums';
import { load, parseFormat } from '../util/data';

export class Data extends GrammarBase implements IData {
  readonly grammarType: GrammarType = 'data';

  protected spec: DataSpec = {};

  private _dataIDKey = `VGRAMMAR_DATA_ID_KEY_${this.uid}`;

  /** 原始输入数据 */
  private _input: any[];

  /** 计算后的数据 */
  private _values: any[];

  private _isLoaded?: boolean;
  private _loadTasks: IGrammarTask[] = [];
  private _postFilters: IDataFilter[] = [];

  constructor(view: IView, values?: any, format?: DataFormatSpec) {
    super(view);
    this._loadTasks = [];

    if (!isNil(values)) {
      this.values(values, format);
      // this.ingest({ values });
    }
  }

  parse(spec: DataSpec) {
    super.parse(spec);
    this._isLoaded = false;

    this.source(spec.source, spec.format, false);
    this.url(spec.url, spec.format, false);
    this.values(spec.values, spec.format, false);
    this.transform(spec.transform);

    this.parseLoad(spec);

    this.commit();
    return this;
  }

  private parseDataSource(spec: DataSpec) {
    const refs: IGrammarBase[] = [];
    const transforms: IGrammarTask[] = [];

    const formatRef = spec.format ? parseFunctionType(spec.format, this.view)[0] : null;
    if (formatRef) {
      refs.push(formatRef);
    }

    if (spec.values) {
      const valuesRef = parseFunctionType(spec.values, this.view)[0];

      if (valuesRef) {
        refs.push(valuesRef);
      }

      transforms.push({
        type: 'ingest',
        transform: this.ingest,
        isRawOptions: true,
        options: {
          values: spec.values,
          format: spec.format
        }
      });
    } else if (spec.url) {
      const urlRef = parseFunctionType(spec.url, this.view)[0];
      if (urlRef) {
        refs.push(urlRef);
      }

      transforms.push({
        type: 'load',
        transform: this.load,
        options: {
          url: urlRef ?? spec.url,
          format: formatRef ?? spec.format
        }
      });
    } else if (spec.source) {
      const upstreamData: IData[] = [];

      array(spec.source).forEach(sourceId => {
        const sourceData = isGrammar(sourceId) ? sourceId : this.view.getDataById(sourceId);

        if (sourceData) {
          refs.push(sourceData);
          upstreamData.push(sourceData as IData);
        }
      });

      if (upstreamData.length) {
        transforms.push({
          type: 'relay',
          transform: this.relay,
          options: upstreamData
        });
        this.grammarSource = upstreamData[0];
      }
    }
    return { transforms, refs };
  }

  private ingest = (options: { values?: any; format?: ParameterFunctionType<DataFormatSpec> }) => {
    const format = invokeParameterFunctionType(options.format, this.parameters());
    this._input = parseFormat(options.values, format);
    return this._input;
  };

  private load = (
    options:
      | { url: ParameterFunctionType<string>; format?: ParameterFunctionType<DataFormatSpec> }
      | { values: any; format?: ParameterFunctionType<DataFormatSpec> }
  ) => {
    if ((options as { values: any; format?: ParameterFunctionType<DataFormatSpec> }).values) {
      return this.ingest(options as { values: any; format?: ParameterFunctionType<DataFormatSpec> });
    }
    const url = invokeParameterFunctionType((options as { url: ParameterFunctionType<string> }).url, this.parameters());
    // default format for loaded data is json
    const format = invokeParameterFunctionType(options.format, this.parameters()) ?? { type: 'json' };
    return load(url).then(data => this.ingest({ values: data, format }));
  };

  private relay = (options: any[]) => {
    return options[0];
  };

  async evaluate(upstream: any, parameters: any) {
    this.view.emit(HOOK_EVENT.BEFORE_EVALUATE_DATA);
    const tasks = this._isLoaded ? this.transforms : this._loadTasks.concat(this.transforms);
    if (this.grammarSource) {
      this._input = upstream;
    }

    const values = await this.evaluateTransform(tasks, this._input, parameters);
    const filteredValues = this._evaluateFilter(values, parameters);
    this.setValues(filteredValues);

    this._isLoaded = true;
    this.view.emit(HOOK_EVENT.AFTER_EVALUATE_DATA);

    return this;
  }

  evaluateSync = (upstream: any, parameters: any) => {
    this.view.emit(HOOK_EVENT.BEFORE_EVALUATE_DATA);
    const tasks = this._isLoaded ? this.transforms : this._loadTasks.concat(this.transforms);

    const values = this.evaluateTransformSync(tasks, this.grammarSource ? upstream : this._input, parameters);
    const filteredValues = this._evaluateFilter(values, parameters);
    this.setValues(filteredValues);

    this._isLoaded = true;

    this.view.emit(HOOK_EVENT.AFTER_EVALUATE_DATA);

    return this;
  };

  output() {
    return this._values;
  }

  getDataIDKey() {
    return this._dataIDKey;
  }

  values(values: any | Nil, format?: ParameterFunctionType<DataFormatSpec>, load: boolean = true) {
    const spec = Object.assign({}, this.spec, { values, format });
    if (!isNil(values)) {
      spec.url = undefined;
      spec.source = undefined;
    }
    return load ? this.parseLoad(spec) : this;
  }

  url(url: ParameterFunctionType<string> | Nil, format?: ParameterFunctionType<DataFormatSpec>, load: boolean = true) {
    const spec = Object.assign({}, this.spec, { url, format });
    if (!isNil(url)) {
      spec.values = undefined;
      spec.source = undefined;
    }
    return load ? this.parseLoad(spec) : this;
  }

  source(
    source: string | string[] | IData | IData[] | Nil,
    format?: ParameterFunctionType<DataFormatSpec>,
    load: boolean = true
  ) {
    const spec = Object.assign({}, this.spec, { source, format });
    if (!isNil(source)) {
      spec.values = undefined;
      spec.url = undefined;
    }
    return load ? this.parseLoad(spec) : this;
  }

  private parseLoad(spec: DataSpec) {
    this.detach(this.parseDataSource(this.spec).refs);

    this.spec = spec;

    const dataSourceResult = this.parseDataSource(this.spec);
    this.attach(dataSourceResult.refs);
    this._loadTasks = dataSourceResult.transforms;
    this._isLoaded = false;

    this.commit();
    return this;
  }

  private setValues(data: any[]) {
    this._values = array(data).map((entry, index) => {
      const datum = entry === Object(entry) ? entry : { data: entry };
      datum[this._dataIDKey] = index;
      return datum;
    });
  }

  field(field: string): any[] {
    return this._values.map((value: any) => value[field]);
  }

  transform(transforms: TransformSpec[] | Nil): this {
    const prevTransforms = parseTransformSpec(this.spec.transform, this.view);
    if (prevTransforms) {
      this.detach(prevTransforms.refs);
      this.transforms = [];
    }

    this.spec.transform = transforms;

    const nextTransforms = parseTransformSpec(this.spec.transform, this.view);
    if (nextTransforms) {
      this.attach(nextTransforms.refs);
      this.transforms = nextTransforms.transforms;
    }

    this.commit();
    return this;
  }

  getValue() {
    return this._values;
  }

  getInput() {
    return this._input;
  }

  addDataFilter(filter: IDataFilter | IDataFilter[]) {
    this._postFilters = this._postFilters.concat(array(filter));
    this._postFilters.sort((filterA, filterB) => (filterA.rank ?? 0) - (filterB.rank ?? 0));
    return this;
  }

  removeDataFilter(filter: IDataFilter | IDataFilter[]) {
    const filters = array(filter);
    this._postFilters = this._postFilters.filter(filter => !filters.includes(filter));
    return this;
  }

  private _evaluateFilter(value: any, parameters: any) {
    return this._postFilters.reduce((result, filter) => {
      return filter.filter(result, parameters);
    }, value);
  }

  reuse(grammar: IGrammarBase) {
    if (grammar.grammarType !== this.grammarType) {
      return this;
    }

    this._isLoaded = false;
    this._values = grammar.output();
    return this;
  }

  clear() {
    super.clear();
    this._input = null;
    this._values = null;
  }
}
