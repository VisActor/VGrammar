import type { CoordinateType } from '@visactor/vgrammar-coordinate';
import type { BaseEventHandler, IElement, IView, MultiScaleData, ScaleData, ScaleSpec, ViewSpec } from '../types';
import type {
  CoordinateOption,
  IArea,
  ICell,
  IInterval,
  ILine,
  IPlot,
  IPlotMarkConstructor,
  IPlotOptions,
  PlotMark,
  PlotSpec
} from '../types/plot';
import { View } from '../view';
import { SIGNAL_VIEW_BOX } from '../view/constants';
import type { ILogger } from '@visactor/vutils';
import { Logger, isNil } from '@visactor/vutils';
import { mergeGrammarSpecs } from '../parse/util';
import { Factory } from '../core/factory';

export class Plot implements IPlot {
  static useMarks(marks: IPlotMarkConstructor[]) {
    marks.forEach(mark => {
      Factory.registerPlotMarks(mark.type, mark);
    });
  }
  private _view: IView;
  private _semanticMarks: PlotMark[];
  private _hasInited?: boolean;
  private _coordinate: CoordinateOption;
  private _logger: ILogger;

  constructor(option?: IPlotOptions) {
    this._view = new View(option);
    this._semanticMarks = [];
    this._logger = Logger.getInstance();
  }

  private _mergeScales(scales: ScaleSpec[], prevScales: ScaleSpec[]) {
    return scales.reduce((res, scale) => {
      if (scale.id) {
        const prevScale = res.find(prev => prev.id === scale.id);

        if (prevScale) {
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
                entry => entry.data !== (scale.domain as ScaleData).data
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
        } else {
          res.push(scale);
        }
      }

      return res;
    }, prevScales);
  }

  protected parseViewSpec() {
    const spec: ViewSpec = {
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
  render() {
    if (this._view) {
      if (!this._hasInited) {
        this._view.parseSpec(this.parseViewSpec());
      }
      this._hasInited = true;

      this._view.runSync();
    }

    return this;
  }
  release() {
    if (this._view) {
      this._view.release();
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
      this._view.updateSpec(viewSpec);
    } else {
      this._view.parseSpec(viewSpec);
    }
    this._hasInited = true;

    return this;
  }

  getImageBuffer() {
    return this._view?.getImageBuffer?.();
  }

  on(type: string, handler: BaseEventHandler) {
    if (this._view) {
      this._view.addEventListener(type, handler);
    }
    return this;
  }
  off(type: string, handler?: BaseEventHandler) {
    if (this._view) {
      this._view.removeEventListener(type, handler);
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
    const mark = Factory.createPlotMark('interval');

    if (!mark) {
      this._logger.error('Please register Interval before use it');
    } else {
      this._semanticMarks.push(mark);
    }

    return mark as IInterval;
  }

  line() {
    const mark = Factory.createPlotMark('line');

    if (!mark) {
      this._logger.error('Please register Line before use it');
    } else {
      this._semanticMarks.push(mark);
    }

    return mark as ILine;
  }

  area() {
    const mark = Factory.createPlotMark('area');

    if (!mark) {
      this._logger.error('Please register Area before use it');
    } else {
      this._semanticMarks.push(mark);
    }

    return mark as IArea;
  }
  cell() {
    const mark = Factory.createPlotMark('cell');

    if (!mark) {
      this._logger.error('Please register Cell before use it');
    } else {
      this._semanticMarks.push(mark);
    }

    return mark as ICell;
  }

  ruleX() {
    const mark = Factory.createPlotMark('ruleX');

    if (!mark) {
      this._logger.error('Please register RuleX before use it');
    } else {
      this._semanticMarks.push(mark);
    }

    return mark as ICell;
  }

  ruleY() {
    const mark = Factory.createPlotMark('ruleY');

    if (!mark) {
      this._logger.error('Please register RuleY before use it');
    } else {
      this._semanticMarks.push(mark);
    }

    return mark as ICell;
  }
}
