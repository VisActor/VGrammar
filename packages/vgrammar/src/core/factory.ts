import type { IPlotMarkConstructor, ISemanticMark } from '../types/plot';

export class Factory {
  private static _plotMarks: { [key: string]: IPlotMarkConstructor } = {};

  static registerPlotMarks(key: string, mark: IPlotMarkConstructor) {
    Factory._plotMarks[key] = mark;
  }

  static createPlotMark(type: string, id?: string): ISemanticMark<any, any> | null {
    if (!Factory._plotMarks[type]) {
      return null;
    }
    const MarkConstructor = Factory._plotMarks[type];
    return new MarkConstructor(id);
  }
}
