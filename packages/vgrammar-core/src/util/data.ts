import type { Parser } from '@visactor/vdataset';
// eslint-disable-next-line no-duplicate-imports
import { DataSet, DataView, csvParser, dsvParser, tsvParser } from '@visactor/vdataset';
import type { DataFormatSpec, Datum } from '../types';
import { array, isString } from '@visactor/vutils';

const jsonParser: Parser = (data: string, options: any = {}, dataView: DataView) => {
  if (!isString(data)) {
    return array(data);
  }
  try {
    return array(JSON.parse(data));
  } catch (e) {
    return [];
  }
};

const parsers: Record<string, Parser> = {
  csv: csvParser,
  dsv: dsvParser,
  tsv: tsvParser,
  json: jsonParser
};

export const parseFormat = (data: any, format?: DataFormatSpec): Datum[] => {
  if (!format || !parsers[format.type]) {
    return array(data);
  }
  const options = format.type === 'dsv' ? { delimiter: format.delimiter } : {};
  return parsers[format.type](data, options, new DataView(new DataSet()));
};
