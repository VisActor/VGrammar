/* Adapted from vega by University of Washington Interactive Data Lab
 * https://vega.github.io/vega/
 * Licensed under the BSD-3-Clause

 * url: https://github.com/vega/vega/blob/main/packages/vega-projection/src/projection.js
 * License: https://github.com/vega/vega/blob/main/LICENSE
 * @license
 */

import {
  geoAlbers,
  geoAlbersUsa,
  geoAzimuthalEqualArea,
  geoAzimuthalEquidistant,
  geoConicConformal,
  geoConicEqualArea,
  geoConicEquidistant,
  geoEqualEarth,
  geoEquirectangular,
  geoGnomonic,
  geoIdentity,
  geoMercator,
  geoNaturalEarth1,
  geoOrthographic,
  geoStereographic,
  geoTransverseMercator,
  geoPath
} from 'd3-geo';
import { error } from '@visactor/vgrammar-util';
import { isString } from '@visactor/vutils';

const defaultPath = geoPath();

export function getProjectionPath(proj: any) {
  return (proj && proj.path) || defaultPath;
}

const projections = {
  // base d3-geo projection types
};

export const projectionProperties = [
  // standard properties in d3-geo
  'clipAngle',
  'clipExtent',
  'scale',
  'translate',
  'center',
  'rotate',
  'parallels',
  'precision',
  'reflectX',
  'reflectY',

  // extended properties in d3-geo-projections
  'coefficient',
  'distance',
  'fraction',
  'lobes',
  'parallel',
  'radius',
  'ratio',
  'spacing',
  'tilt'
];

/**
 * Augment projections with their type and a copy method.
 */
function create(type: string, constructor: any) {
  return function projectionGenerator() {
    const p = constructor();

    p.type = type;

    p.path = geoPath().projection(p);

    p.copy =
      p.copy ||
      function () {
        const c = projectionGenerator();
        projectionProperties.forEach(prop => {
          if (p[prop]) {
            c[prop](p[prop]());
          }
        });
        c.path.pointRadius(p.path.pointRadius());
        return c;
      };

    return p;
  };
}

export function projection(type: string, proj?: () => any) {
  if (!type || !isString(type)) {
    error('Projection type must be a name string.');
  }
  const projectionType = type.toLowerCase();
  if (arguments.length > 1) {
    projections[projectionType] = create(projectionType, proj);
  }
  return projections[projectionType] || null;
}

const builtInProjections = {
  albers: geoAlbers,
  albersusa: geoAlbersUsa,
  azimuthalequalarea: geoAzimuthalEqualArea,
  azimuthalequidistant: geoAzimuthalEquidistant,
  conicconformal: geoConicConformal,
  conicequalarea: geoConicEqualArea,
  conicequidistant: geoConicEquidistant,
  equalEarth: geoEqualEarth,
  equirectangular: geoEquirectangular,
  gnomonic: geoGnomonic,
  identity: geoIdentity,
  mercator: geoMercator,
  naturalEarth1: geoNaturalEarth1,
  orthographic: geoOrthographic,
  stereographic: geoStereographic,
  transversemercator: geoTransverseMercator
};

Object.keys(builtInProjections).forEach((projectionType: string) => {
  projection(projectionType, builtInProjections[projectionType]);
});
