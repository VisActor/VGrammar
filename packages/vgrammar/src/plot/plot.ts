import type { CoordinateType } from '@visactor/vgrammar-coordinate';
import type { BaseEventHandler, IElement, IView, MultiScaleData, ScaleData, ViewSpec } from '../types';
import type { CoordinateOption, IPlot, IPlotOptions, PlotMark, PlotSpec } from '../types/plot';
import { View } from '../view';
import { Interval } from './interval';
import { Line } from './line';
import { Cell } from './cell';
import { RuleX } from './rule-x';
import { RuleY } from './rule-y';
import { SIGNAL_VIEW_BOX } from '../view/constants';
import { Area } from './area';
import { isNil } from '@visactor/vutils';
import { mergeGrammarSpecs } from '../parse/util';

export class Plot implements IPlot {
  private _view: IView;
  private _semanticMarks: PlotMark[];
  private _hasInited?: boolean;
  private _coordinate: CoordinateOption;

  constructor(option?: IPlotOptions) {
    this._view = new View(option);
    this._semanticMarks = [];
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
      const { data, marks, scales, coordinates, signals, projections, events } = mark.toViewSpec();

      if (data && data.length) {
        spec.data = mergeGrammarSpecs(data, spec.data);
      }
      if (marks && marks.length) {
        spec.marks = spec.marks.concat(marks);
      }

      if (scales && scales.length) {
        spec.scales = scales.reduce((res, scale) => {
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
        }, spec.scales);
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
        if (mark.type === 'interval') {
          this.interval().parseSpec(mark);
        } else if (mark.type === 'cell') {
          this.cell().parseSpec(mark);
        } else if (mark.type === 'line') {
          this.line().parseSpec(mark);
        }
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

    this._semanticMarks.forEach(mark => {
      mark.coordinate(this._coordinate);
    });
    return this;
  }

  interval() {
    const interval = new Interval();

    if (this._coordinate) {
      interval.coordinate(this._coordinate);
    }

    this._semanticMarks.push(interval);

    return interval;
  }

  line() {
    const line = new Line();

    if (this._coordinate) {
      line.coordinate(this._coordinate);
    }
    this._semanticMarks.push(line);

    return line;
  }

  area() {
    const area = new Area();

    if (this._coordinate) {
      area.coordinate(this._coordinate);
    }
    this._semanticMarks.push(area);

    return area;
  }
  cell() {
    const cell = new Cell();

    if (this._coordinate) {
      cell.coordinate(this._coordinate);
    }
    this._semanticMarks.push(cell);

    return cell;
  }

  ruleX() {
    const mark = new RuleX();

    if (this._coordinate) {
      mark.coordinate(this._coordinate);
    }
    this._semanticMarks.push(mark);

    return mark;
  }

  ruleY() {
    const mark = new RuleY();

    if (this._coordinate) {
      mark.coordinate(this._coordinate);
    }
    this._semanticMarks.push(mark);

    return mark;
  }
}
