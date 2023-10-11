import { ViewSpec } from '@visactor/vgrammar';
import normalData from '../data/normal-2d.json';

export const spec = {
  padding: { top: 25, right: 5, bottom: 30, left: 60 },
  width: 500,
  height: 300,

  data: [
    {
      id: 'table',
      values: normalData
    },
    {
      id: 'markData',
      source: 'table',
    }
  ],
  interactions: [
    // {
    //   type: 'element-active',
    //   selector: 'symbol'
    // },
    // {
    //   type: 'view-zoom',
    //   scaleX: 'xscale'
    // },
    // {
    //   type: 'view-scroll',
    //   scaleX: 'xscale'
    // },
    // {
    //   type: 'view-drag',
    //   scaleX: 'xscale'
    // }
    // {
    //   type: 'view-roam',
    //   scaleX: 'datazoomXScale',
    //   dataTargetX: {
    //     data: 'markData',
    //     filter: 'u'
    //   },
    //   scroll: {
    //     enable: true
    //   },
    //   drag: {
    //     enable: false
    //   }
    // }

    {
      type: 'fish-eye',
      scaleX: 'xscale'
    }
  ],

  scales: [
    {
      id: 'datazoomXScale',
      type: 'band',
      domain: { data: 'table', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [0, params.viewBox.width()];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'xscale',
      type: 'linear',
      domain: { data: 'markData', field: 'u' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [0, params.viewBox.width()];
      },
      nice: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'markData', field: 'v' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [params.viewBox.height(), 0];
      },
      nice: true
    }
  ],

  marks: [
    {
      type: 'group',
      dependency: ['viewBox'],
      
      encode: {
        update: (scale, elment, params) => {
          return {
            x: params.viewBox.x1,
            y: params.viewBox.y1,
            width: params.viewBox.width(),
            height: params.viewBox.height()
          };
        }
      },

      marks: [
        {
          type: 'component',
          componentType: 'axis',
          scale: 'xscale',
          dependency: ['viewBox'],
          encode: {
            update: (scale, elment, params) => {
              return {
                x: 0,
                y: params.viewBox.height(),
                start: { x: 0, y: 0 },
                end: { x: params.viewBox.width(), y: 0 }
              };
            }
          }
        },
        {
          type: 'component',
          componentType: 'axis',
          scale: 'yscale',
          dependency: ['viewBox'],
          encode: {
            update: (scale, elment, params) => {
              return {
                x: 0,
                y: 0,
                start: { x: 0, y: params.viewBox.height() },
                end: { x: 0, y: 0 },
                verticalFactor: -1
              };
            }
          }
        },
        {
          type: 'component',
          componentType: 'crosshair',
          scale: 'xscale',
          crosshairShape: 'line',
          crosshairType: 'x',
          dependency: ['viewBox'],
          encode: {
            update: (scale, elment, params) => {
              return {
                start: { y: 0 },
                end: { y: params.viewBox.height() }
              };
            }
          }
        },
    
        {
          type: 'component',
          componentType: 'crosshair',
          scale: 'yscale',
          crosshairShape: 'line',
          crosshairType: 'y',
          dependency: ['viewBox'],
          encode: {
            update: (scale, elment, params) => {
              return {
                start: { x: 0 },
                end: { x: params.viewBox.width() }
              };
            }
          }
        },

        {
          type: 'group',
          dependency: ['viewBox'],
          clip: true,
          encode: {
            update: (scale, elment, params) => {
              return {
                x: 0,
                y: 0,
                width: params.viewBox.width(),
                height: params.viewBox.height()
              };
            }
          },

          marks: [
            {
              type: 'symbol',
              id: 'points',
              from: { data: 'markData' },
              encode: {
                update: {
                  x: { scale: 'xscale', field: 'u' },
                  y: { scale: 'yscale', field: 'v' },
                  size: 10,
                  fill: 'pink',
                },
                active: {
                  fill: 'red'
                }
              }
            },

          ]
        },
        {
          type: 'component',
          componentType: 'tooltip',
          target: 'points',
          title: { visible: false, value: 'u' },
          content: [
            {
              key: 'u',
              value: { field: 'u' },
              symbol: {
                symbolType: 'circle',
                fill: '#6690F2'
              }
            },
            {
              key: 'v',
              value: { field: 'v' },
              symbol: {
                symbolType: 'circle',
                fill: '#6690F2'
              }
            }
          ]
        }
      ]

    },
  
  ]

};
