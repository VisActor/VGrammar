import { IView } from "@visactor/vgrammar";

export const spec = {
  width: 800,
  height: 400,
  padding: { top: 5, right: 5, bottom: 100, left: 60 },
  interactions: [
    { 
      type: 'crosshair', 
      container: '#innerContainer',
      scale: 'xscale',
      crosshairShape: 'rect',
      crosshairType: 'x' 
    },
    {
      type: 'tooltip',
      selector: 'rect',
      title: { visible: false, value: 'value' },
      content: [
        {
          key: { field: 'name' },
          value: { field: 'value' },
          symbol: {
            symbolType: 'circle',
            fill: '#6690F2'
          }
        }
      ]
    },
    {
      type: 'datazoom-filter',
      source: '#datazoomComp',
      target: {
        data: 'markData',
        filter: 'name'
      }
    },
    {
      type: 'view-roam',
      linkedComponentX: 'datazoomComp'
    }
  ],
  data: [
    {
      id: 'table',
      values: [
        {
          name: 'Apple',
          value: 214480
        },
        {
          name: 'Google',
          value: 155506
        },
        {
          name: 'Amazon',
          value: 100764
        },
        {
          name: 'Microsoft',
          value: 92715
        },
        {
          name: 'Coca-Cola',
          value: 66341
        },
        {
          name: 'Samsung',
          value: 59890
        },
        {
          name: 'Toyota',
          value: 53404
        },
        {
          name: 'Mercedes-Benz',
          value: 48601
        },
        {
          name: 'Facebook',
          value: 45168
        },
        {
          name: "McDonald's",
          value: 43417
        },
        {
          name: 'Intel',
          value: 43293
        },
        {
          name: 'IBM',
          value: 42972
        },
        {
          name: 'BMW',
          value: 41006
        },
        {
          name: 'Disney',
          value: 39874
        },
        {
          name: 'Cisco',
          value: 34575
        },
        {
          name: 'GE',
          value: 32757
        },
        {
          name: 'Nike',
          value: 30120
        },
        {
          name: 'Louis Vuitton',
          value: 28152
        },
        {
          name: 'Oracle',
          value: 26133
        },
        {
          name: 'Honda',
          value: 23682
        }
      ]
    },
    {
      id: 'markData',
      source: 'table',
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
      type: 'band',
      domain: { data: 'markData', field: 'name' },
      dependency: ['viewBox'],
      range: (scale, params) => {
        return [0, params.viewBox.width()];
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'markData', field: 'value' },
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
      id: 'outerContainer',
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
          tickCount: -1,
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
          type: 'group',
          dependency: ['viewBox'],
          id: 'innerContainer',
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
              type: 'rect',
              id: 'rect',
              from: { data: 'markData' },
              dependency: ['yscale'],
              encode: {
                update: {
                  x: { scale: 'xscale', field: 'name', band: 0.25 },
                  width: { scale: 'xscale', band: 0.5 },
                  y: { scale: 'yscale', field: 'value' },
                  y1: (datum, element, params) => {
                    return params.yscale.scale(params.yscale.domain()[0]);
                  },
                  fill: '#6690F2'
                },
                hover: {
                  fill: 'red'
                }
              }
            },

          ]
        },

        

        {
          type: 'component',
          id: 'datazoomComp',
          componentType: 'datazoom',
          dependency: ['viewBox'],
          preview: {
            data: 'table',
            x: {
              scale: 'datazoomXScale',
              field: 'name'
            }
          },
          encode: {
            update: (scale, elment, params) => {
              return {
                x: 0,
                y: params.viewBox.y2 + 30,
                size: { width: params.viewBox.width() },
                start: 0,
                end: 1
              };
            }
          }
        }
      ]
    }
  ]
};

export const callback = (view: IView) => {
  const updateDataButton = document.createElement('button');
  updateDataButton.innerText = 'update data';
  document.getElementById('footer')?.appendChild(updateDataButton);

  updateDataButton.addEventListener('click', () => {
    const tableData = view.getDataById('table');
    tableData.values([
      { name: 'A', value: Math.floor(100 * Math.random()) },
      { name: 'B', value: Math.floor(100 * Math.random()) },
      { name: 'C', value: Math.floor(100 * Math.random()) },
      { name: 'D', value: Math.floor(100 * Math.random()) },
      { name: 'E', value: Math.floor(100 * Math.random()) },
      { name: 'F', value: Math.floor(100 * Math.random()) },
      { name: 'G', value: Math.floor(100 * Math.random()) },
      { name: 'H', value: Math.floor(100 * Math.random()) },
      { name: 'I', value: Math.floor(100 * Math.random()) },
      { name: 'J', value: Math.floor(100 * Math.random()) },
      { name: 'K', value: Math.floor(100 * Math.random()) },
      { name: 'L', value: Math.floor(100 * Math.random()) },
      { name: 'M', value: Math.floor(100 * Math.random()) }
    ]);
    view.run();
  });
};

