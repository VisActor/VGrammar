/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-geo/src/Projection.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import { array, isFunction, isNil, merge } from '@visactor/vutils';
import { error } from '@visactor/vgrammar-util';
import { projection, projectionProperties } from './projections';
import type { IView, GrammarType, IGrammarBase } from '@visactor/vgrammar';
// eslint-disable-next-line no-duplicate-imports
import { GrammarBase, parseFunctionType, invokeFunctionType } from '@visactor/vgrammar';
import type { FeatureCollectionData, FeatureData, IProjection, ProjectionSpec } from './interface';

const Feature = 'Feature';
const FeatureCollection = 'FeatureCollection';

function featurize(f: FeatureCollectionData | FeatureData) {
  return f.type === FeatureCollection
    ? f.features
    : array(f)
        .filter(d => !isNil(d))
        .map(d => (d.type === Feature ? d : { type: Feature, geometry: d }));
}

export function collectGeoJSON(data: any) {
  const arrayData = array(data);
  return arrayData.length === 1
    ? arrayData[0]
    : {
        type: FeatureCollection,
        features: arrayData.reduce((a, f) => a.concat(featurize(f)), [])
      };
}

function create(type: string) {
  const constructor = projection((type || 'mercator').toLowerCase());
  if (!constructor) {
    error('Unrecognized projection type: ' + type);
  }
  return constructor();
}

function set(proj: any, key: string, value: any) {
  if (isFunction(proj[key])) {
    proj[key](value);
  }
}

const projectionOptions = projectionProperties.concat(['pointRadius', 'fit', 'extent', 'size']);

export function parseProjection(spec: ProjectionSpec, view: IView) {
  let refs: IGrammarBase[] = [];

  if (!spec) {
    return refs;
  }

  Object.keys(spec).forEach(key => {
    if (projectionOptions.includes(key)) {
      refs = refs.concat(parseFunctionType(spec[key], view));
    }
  });

  return refs;
}

export class Projection extends GrammarBase implements IProjection {
  readonly grammarType: GrammarType = 'projection';

  private projection: any;

  constructor(view: IView) {
    super(view);
  }

  parse(spec: ProjectionSpec) {
    super.parse(spec);
    this.spec = merge(this.spec, spec);
    this.attach(parseProjection(spec, this.view));

    return this;
  }

  evaluate(upstream: any, parameters: any) {
    if (!this.projection || this.projection.type !== this.spec.type) {
      this.projection = create(this.spec.type);
      this.projection.type = this.spec.type;
    }
    projectionProperties.forEach(prop => {
      if (!isNil(this.spec[prop])) {
        set(this.projection, prop, invokeFunctionType(this.spec[prop], parameters, projection));
      }
    });

    if (!isNil(this.spec.pointRadius)) {
      this.projection.path.pointRadius(invokeFunctionType(this.spec.pointRadius, parameters, projection));
    }
    if (!isNil(this.spec.fit)) {
      const fit = invokeFunctionType(this.spec.fit, parameters, projection);
      const data = collectGeoJSON(fit);

      if (this.spec.extent) {
        this.projection.fitExtent(invokeFunctionType(this.spec.extent, parameters, projection), data);
      } else if (this.spec.size) {
        this.projection.fitSize(invokeFunctionType(this.spec.size, parameters, projection), data);
      }
    }

    return this.projection;
  }

  output() {
    return this.projection;
  }
}
