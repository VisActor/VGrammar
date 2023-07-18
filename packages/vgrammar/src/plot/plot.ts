import type { IView, ViewSpec } from '../types';
import type { IInterval, IPlot, IPlotOptions } from '../types/plot';
import { View } from '../view';
import { Interval } from './interval';

export class Plot implements IPlot {
  private _view: IView;
  private _semanticMarks: IInterval[];
  private _hasInited?: boolean;

  constructor(option?: IPlotOptions) {
    this._view = new View(option);
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
            spec.coordinates = spec.coordinates.concat(coordinates);
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

  interval() {
    const interval = new Interval();

    if (!this._semanticMarks) {
      this._semanticMarks = [];
    }
    this._semanticMarks.push(interval);

    return interval;
  }
}
