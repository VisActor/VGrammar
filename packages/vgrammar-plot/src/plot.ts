import type { CoordinateType } from '@visactor/vgrammar-coordinate';
import type {
  BaseEventHandler,
  IElement,
  IRunningConfig,
  IView,
  MultiScaleData,
  ScaleData,
  ScaleSpec,
  ViewSpec,
  CoordinateOption,
  IPlot,
  IPlotMarkConstructor,
  IPlotOptions,
  PlotMark,
  PlotSpec
} from '@visactor/vgrammar-core';
import type { ILogger } from '@visactor/vutils';
import { Logger, isNil, merge } from '@visactor/vutils';
import { mergeGrammarSpecs } from './util';
import { PlotMakType } from './enums';
import { Factory, SIGNAL_VIEW_BOX, View } from '@visactor/vgrammar-core';

export class Plot implements IPlot {
  static useMarks(marks: IPlotMarkConstructor[]) {
    marks.forEach(mark => {
      Factory.registerPlotMarks(mark.type, mark);
    });
  }
  readonly view: IView;
  private _semanticMarks: PlotMark[];
  private _hasInited?: boolean;
  private _coordinate: CoordinateOption;
  private _logger: ILogger;
  private _theme?: string;

  constructor(option?: IPlotOptions) {
    this.view = new View(option);
    this._semanticMarks = [];
    this._logger = Logger.getInstance();
  }

  theme(theme: string) {
    this._theme = theme;

    this.view.parseSpec({ theme });

    return this;
  }

  private _mergeScales(scales: ScaleSpec[], prevScales: ScaleSpec[]) {
    return scales.reduce((res, scale) => {
      if (scale.id) {
        const prevIndex = res.findIndex(prev => prev.id === scale.id);

        if (prevIndex >= 0) {
          const prevScale = res[prevIndex];
          if ((scale.domain as ScaleData).data && (scale.domain as ScaleData).field) {
            if ((prevScale.domain as ScaleData).data && (prevScale.domain as ScaleData).field) {
              if (
                (scale.domain as ScaleData).data === (prevScale.domain as ScaleData).data &&
                (scale.domain as ScaleData).field !== (prevScale.domain as ScaleData).field
              ) {
                (prevScale.domain as ScaleData).field = []
                  .concat((prevScale.domain as ScaleData).field)
                  .concat((scale.domain as ScaleData).field);
              } else if ((scale.domain as ScaleData).data !== (prevScale.domain as ScaleData).data) {
                (prevScale.domain as MultiScaleData) = {
                  datas: [
                    { data: (prevScale.domain as ScaleData).data, field: (prevScale.domain as ScaleData).field },
                    { data: (scale.domain as ScaleData).data, field: (scale.domain as ScaleData).field }
                  ],
                  sort: (prevScale.domain as MultiScaleData).sort
                };
              }
              if (!isNil((scale.domain as ScaleData).sort)) {
                (prevScale.domain as ScaleData).sort = (scale.domain as ScaleData).sort;
              }
            } else if ((prevScale.domain as MultiScaleData).datas) {
              const prevData = (prevScale.domain as MultiScaleData).datas.find(
                entry => entry.data === (scale.domain as ScaleData).data
              );

              if (prevData && (scale.domain as ScaleData).field !== prevData.field) {
                prevData.field = [].concat(prevData.field).concat((scale.domain as ScaleData).field);
              } else if (!prevData) {
                (prevScale.domain as MultiScaleData).datas.push({
                  data: (scale.domain as ScaleData).data,
                  field: (scale.domain as ScaleData).field
                });
              }

              if (!isNil((scale.domain as ScaleData).sort)) {
                (prevScale.domain as ScaleData).sort = (scale.domain as ScaleData).sort;
              }
            }
          }

          if ((scale as any).userScale) {
            res[prevIndex] = merge(prevScale, (scale as any).userScale);
          }
        } else {
          (scale as any).userScale = null;
          res.push(scale);
        }
      }

      return res;
    }, prevScales);
  }

  protected parseViewSpec() {
    const spec: ViewSpec = {
      theme: this._theme,
      data: [],
      marks: [],
      scales: [],
      coordinates: [],
      signals: [],
      projections: [],
      events: []
    };

    this._semanticMarks.forEach(mark => {
      if (this._coordinate) {
        mark.coordinate(this._coordinate);
      }
      const { data, marks, scales, coordinates, signals, projections, events } = mark.toViewSpec();

      if (data && data.length) {
        spec.data = mergeGrammarSpecs(data, spec.data);
      }
      if (marks && marks.length) {
        spec.marks = spec.marks.concat(marks);
      }

      if (scales && scales.length) {
        // todo: optimize the following code of combine scales
        spec.scales = this._mergeScales(scales, spec.scales);
      }
      if (coordinates && coordinates.length) {
        spec.coordinates = mergeGrammarSpecs(coordinates, spec.coordinates);
      }
      if (signals && signals.length) {
        spec.signals = spec.signals.concat(signals);
      }
      if (projections && projections.length) {
        spec.projections = spec.projections.concat(projections);
      }
      if (events && events.length) {
        spec.events = spec.events.concat(events);
      }
    });

    spec.marks = [
      {
        type: 'group',
        layout: {
          display: 'relative',
          updateViewSignals: true
        },
        dependency: [SIGNAL_VIEW_BOX],
        encode: {
          update: (datum: any, elment: IElement, params: any) => {
            return {
              x: params.viewBox.x1,
              y: params.viewBox.y1,
              width: params.viewBox.width(),
              height: params.viewBox.height()
            };
          }
        },
        marks: spec.marks
      }
    ];

    return spec;
  }
  run(morphConfig?: IRunningConfig) {
    if (this.view) {
      if (!this._hasInited) {
        this.view.parseSpec(this.parseViewSpec());
      } else {
        this.view.updateSpec(this.parseViewSpec());
      }
      this._hasInited = true;

      this.view.runSync(morphConfig);
    }

    return this;
  }

  async runAsync(morphConfig?: IRunningConfig) {
    if (this.view) {
      if (!this._hasInited) {
        this.view.parseSpec(this.parseViewSpec());
      } else {
        this.view.updateSpec(this.parseViewSpec());
      }
      this._hasInited = true;

      await this.view.runAsync(morphConfig);
    }

    return this;
  }

  release() {
    if (this.view) {
      this.view.release();
    }

    return this;
  }

  updateSpec(spec: PlotSpec) {
    this.parseSpec(spec, true);
    return this;
  }
  parseSpec(spec: PlotSpec, isUpdate?: boolean) {
    if (spec.coordinate) {
      this.coordinate(spec.coordinate.type, spec.coordinate);
    }

    if (spec?.marks?.length) {
      spec.marks.forEach(mark => {
        const plotMark: PlotMark = Factory.createPlotMark(mark.type);
        plotMark.parseSpec(mark as any);

        this._semanticMarks.push(plotMark);
      });
    }

    const viewSpec = this.parseViewSpec();
    viewSpec.width = spec.width;
    viewSpec.height = spec.height;
    viewSpec.background = spec.background;
    viewSpec.padding = spec.padding;

    if (isUpdate) {
      this.view.updateSpec(viewSpec);
    } else {
      this.view.parseSpec(viewSpec);
    }
    this._hasInited = true;

    return this;
  }

  getImageBuffer() {
    return this.view?.getImageBuffer?.();
  }

  on(type: string, handler: BaseEventHandler) {
    if (this.view) {
      this.view.addEventListener(type, handler);
    }
    return this;
  }
  off(type: string, handler?: BaseEventHandler) {
    if (this.view) {
      this.view.removeEventListener(type, handler);
    }
    return this;
  }

  protected getCoordinateId(viewId: string | number = '0') {
    return `coordinate-${viewId}`;
  }

  coordinate(type: CoordinateType, spec?: Omit<CoordinateOption, 'type'>) {
    this._coordinate = Object.assign({ type, id: this.getCoordinateId() }, spec);

    return this;
  }

  interval() {
    const mark = Factory.createPlotMark(PlotMakType.interval);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.interval} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }

  line() {
    const mark = Factory.createPlotMark(PlotMakType.line);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.line} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }

  area() {
    const mark = Factory.createPlotMark(PlotMakType.area);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.area} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }
  cell() {
    const mark = Factory.createPlotMark(PlotMakType.cell);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.cell} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }

  ruleX() {
    const mark = Factory.createPlotMark(PlotMakType.ruleX);

    if (!mark) {
      this._logger.error(`Please register ${this.ruleX} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }

  ruleY() {
    const mark = Factory.createPlotMark(PlotMakType.ruleY);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.ruleY} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }

  image() {
    const mark = Factory.createPlotMark(PlotMakType.image);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.image} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }

  path() {
    const mark = Factory.createPlotMark(PlotMakType.path);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.path} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }

  polygon() {
    const mark = Factory.createPlotMark(PlotMakType.polygon);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.polygon} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }

  rectX() {
    const mark = Factory.createPlotMark(PlotMakType.rectX);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.rectX} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }

  rectY() {
    const mark = Factory.createPlotMark(PlotMakType.rectY);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.rectY} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }

  rect() {
    const mark = Factory.createPlotMark(PlotMakType.rect);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.rect} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }

  rule() {
    const mark = Factory.createPlotMark(PlotMakType.rule);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.rule} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }

  symbol() {
    const mark = Factory.createPlotMark(PlotMakType.symbol);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.symbol} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }

  text() {
    const mark = Factory.createPlotMark(PlotMakType.text);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.text} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }

  sankey() {
    const mark = Factory.createPlotMark(PlotMakType.sankey);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.sankey} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }

  sunburst() {
    const mark = Factory.createPlotMark(PlotMakType.sunburst);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.sunburst} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }

  tree() {
    const mark = Factory.createPlotMark(PlotMakType.tree);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.tree} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }

  treemap() {
    const mark = Factory.createPlotMark(PlotMakType.treemap);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.treemap} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }

  circlePacking() {
    const mark = Factory.createPlotMark(PlotMakType.circlePacking);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.circlePacking} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }

  wordcloud() {
    const mark = Factory.createPlotMark(PlotMakType.wordcloud);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.wordcloud} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }

  wordcloudShape() {
    const mark = Factory.createPlotMark(PlotMakType.wordcloudShape);

    if (!mark) {
      this._logger.error(`Please register ${PlotMakType.wordcloudShape} before use it`);
    } else {
      this._semanticMarks.push(mark);
    }

    return mark;
  }
}
