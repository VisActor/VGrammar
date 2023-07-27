import type { CoordinateType } from '@visactor/vgrammar-coordinate';
import type { IElement, IView, ViewSpec } from '../types';
import type { CoordinateOption, IInterval, IPlot, IPlotOptions } from '../types/plot';
import { View } from '../view';
import { Interval } from './interval';
import { Line } from './line';

export class Plot implements IPlot {
  private _view: IView;
  private _semanticMarks: IInterval[];
  private _hasInited?: boolean;
  private _coordinate: CoordinateOption;

  constructor(option?: IPlotOptions) {
    this._view = new View(option);
    this._semanticMarks = [];
  }
  render() {
    if (this._view) {
      if (!this._hasInited) {
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
            spec.data = spec.data.concat(data);
          }
          if (marks && marks.length) {
            spec.marks = spec.marks.concat(marks);
          }

          if (scales && scales.length) {
            spec.scales = spec.scales.concat(scales);
          }
          if (coordinates && coordinates.length) {
            spec.coordinates = coordinates.reduce((res, coord) => {
              if (coord.id && !res.some(prevCoord => prevCoord.id === coord.id)) {
                res.push(coord);
              }

              return res;
            }, spec.coordinates);
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
            dependency: ['viewBox'],
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

        this._view.parseSpec(spec);
      }

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
}
