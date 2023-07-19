import { registerProjection, registerGeoTransforms, IProjection } from '@visactor/vgrammar-projection';

registerProjection();
registerGeoTransforms();

export const spec = {
  width: 960,
  height: 1000,

  data: [
    {
      id: 'geoData',
      values: [
              
{
  "type": "FeatureCollection",
  "features": [
      {
          "type": "Feature",
          "properties": {
              "name": "",
              "adchar": "JD",
              "adcode": "100000_JD"
          },
          "geometry": {
              "type": "MultiPolygon",
              "coordinates": [
                  [
                      [
                          [
                              109.82951587,
                              15.22896754
                          ],
                          [
                              109.77065019,
                              15.44468789
                          ],
                          [
                              109.67264555,
                              15.66561455
                          ],
                          [
                              109.57455994,
                              15.82609887
                          ],
                          [
                              109.51574449,
                              15.91095759
                          ],
                          [
                              109.29314007,
                              16.19491896
                          ],
                          [
                              109.29161878,
                              16.19765288
                          ],
                          [
                              109.29101677,
                              16.20072311
                          ],
                          [
                              109.29139298,
                              16.2038291
                          ],
                          [
                              109.29271057,
                              16.20666681
                          ],
                          [
                              109.29484059,
                              16.20895848
                          ],
                          [
                              109.29757451,
                              16.21047978
                          ],
                          [
                              109.30064474,
                              16.21108179
                          ],
                          [
                              109.30375073,
                              16.21070558
                          ],
                          [
                              109.30658844,
                              16.20938798
                          ],
                          [
                              109.30888011,
                              16.20725797
                          ],
                          [
                              109.53166592,
                              15.92306523
                          ],
                          [
                              109.53201478,
                              15.92259221
                          ],
                          [
                              109.59116145,
                              15.8372556
                          ],
                          [
                              109.59147511,
                              15.83677407
                          ],
                          [
                              109.6900529,
                              15.67548445
                          ],
                          [
                              109.69066131,
                              15.67432448
                          ],
                          [
                              109.7892391,
                              15.45210582
                          ],
                          [
                              109.78974541,
                              15.45068337
                          ],
                          [
                              109.84889209,
                              15.23393326
                          ],
                          [
                              109.84903675,
                              15.23333003
                          ],
                          [
                              109.8648092,
                              15.15722425
                          ],
                          [
                              109.86495704,
                              15.15409906
                          ],
                          [
                              109.86413191,
                              15.15108113
                          ],
                          [
                              109.86241457,
                              15.1484659
                          ],
                          [
                              109.85997314,
                              15.14650935
                          ],
                          [
                              109.85704658,
                              15.145403
                          ],
                          [
                              109.85392139,
                              15.14525516
                          ],
                          [
                              109.85090347,
                              15.14608029
                          ],
                          [
                              109.84828823,
                              15.14779763
                          ],
                          [
                              109.84633168,
                              15.15023907
                          ],
                          [
                              109.84522534,
                              15.15316562
                          ],
                          [
                              109.82951587,
                              15.22896754
                          ]
                      ]
                  ]
              ]
          }
      }
  ]
}    
      ]
    },
    
  ],

  projections: [
    {
      id: 'projection',
      type: 'mercator',
      scale: 24365,
      dependency: ['geoData', 'viewBox'],
      fit: (proj: IProjection, params: any) => {
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
        update: {
          fill: () => {
            return ['red', 'green'][Math.floor(2 * Math.random())]
          },
          stroke: 'black',
          path: { field: 'path' }
        }
      },
      
    }
  ]
};
