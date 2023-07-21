import { registerProjection, registerGeoTransforms, IProjection } from '@visactor/vgrammar-projection';
import data from '../data/world-2.json';

registerProjection();
registerGeoTransforms();

export const spec = {
  width: 960,
  height: 1000,
  padding: 20,

  data: [
    {
      id: 'geoData',
      values: data
    },
    
  ],

  projections: [
    {
      id: 'projection',
      // type: 'mercator',
      // type: 'albersUsa',
      // type: 'albers',
     // type: 'identity',
     type: 'gnomonic',
      dependency: ['geoData', 'viewBox'],
      fit: (proj: IProjection, params: any) => {
        console.log(params)
        return params.geoData;
      },
      size:  (proj: IProjection, params: any) => {
        return [params.viewBox.width(), params.viewBox.height()];
      },
    }
  ],

  marks: [
    {
      type: 'shape',
      from: { data: 'geoData' },
      transform: [{ type: 'geoPath', projection: { customized: 'projection' }, as: 'path' }],
      encode: {
        enter: {
          dx: 20,
          dy: 20
        },
        update: {
          fill: 'pink',
          stroke: 'black',
          path: { field: 'path' }
        }
      },
      
    }
  ]
};
