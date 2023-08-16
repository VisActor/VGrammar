/* eslint-disable no-console */

import type { IView, ViewSpec } from '@visactor/vgrammar';

const getMultiPointsData = () => {
  const categories = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  return categories.reduce((data, category) => {
    return data.concat(
      new Array(10).fill(0).map((v, i) => {
        return {
          category,
          key: Math.round(Math.random() * 100),
          value: Math.round(Math.random() * 100),
          index: `${category}-${i}`
        };
      })
    );
  }, [] as any[]);
};

export const spec: ViewSpec = {
  width: 400,
  height: 200,
  padding: 25,

  events: [
    {
      type: '@bar:mousedown',
      callback: (evt: any) => {
        console.log(evt);
      }
    },
    {
      type: 'rect:mousedown',
      callback: (evt: any) => {
        console.log(evt);
      }
    },
    {
      type: 'view:mousedown',
      callback: (evt: any) => {
        console.log(evt);
      }
    },
    {
      type: 'view:mousedown',
      target: [
        {
          target: 'signalB',
          callback: (evt: any) => {
            return { text: 'changed!' };
          }
        },
        {
          target: 'signalC',
          callback: (evt: any) => {
            return {};
          }
        }
      ]
    },
    {
      type: 'view:mousedown',
      callback: (evt: any) => {
        return { text: 'changed!' };
      }
    },
    {
      type: 'window:mousedown',
      callback: (evt: any) => {
        return { text: 'changed!' };
      }
    }
  ],

  signals: [
    {
      id: 'signalA',
      value: true
    },
    {
      id: 'signalAA',
      value: true
    },
    {
      id: 'signalB',
      value: true
    },
    {
      id: 'signalC',
      value: { text: 'balabala' }
    },
    {
      id: 'signalD',
      update: {
        callback: () => 666777
      }
    },
    {
      id: 'signalE',
      value: 123
    }
  ],

  data: [
    {
      id: 'table',
      values: [
        { category: 'A', amount: 28, index: 0 },
        { category: 'B', amount: 55, index: 1 },
        { category: 'C', amount: 43, index: 2 },
        { category: 'D', amount: 91, index: 3 },
        { category: 'E', amount: 81, index: 4 },
        { category: 'F', amount: 53, index: 5 },
        { category: 'G', amount: 19, index: 6 },
        { category: 'H', amount: 87, index: 7 }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'table', field: 'category' },
      range: {
        callback: (scale: any, params: any) => {
          return [0, params.width];
        },
        dependency: ['width']
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'amount' },
      nice: true,
      range: {
        callback: (scale: any, params: any) => {
          return [params.height, 0];
        },
        dependency: ['height']
      }
    }
  ],

  marks: [
    {
      type: 'rect',
      id: 'bar',
      from: { data: 'table' },
      key: 'category',
      groupBy: 'category',
      morph: true,
      morphKey: 'MORPH',
      animation: {
        enter: {
          type: 'growHeightIn',
          options: { orient: 'negative' },
          duration: 1000
        },
        exit: {
          type: 'fadeOut',
          duration: 1000
        },
        update: {
          type: 'update',
          duration: 1000
        }
      },
      encode: {
        enter: {},
        update: {
          x: { scale: 'xscale', field: 'category' },
          width: { scale: 'xscale', band: 1 },
          y: { scale: 'yscale', field: 'amount' },
          y1: { scale: 'yscale', value: 0 },
          fill: {
            callback: (datum: any, el: any, params: any) => {
              return datum.amount < 60 ? 'red' : 'lightgreen';
            },
            dependency: ['xscale']
          }
        },
        hover: {
          fill: 'red',
          width: { scale: 'xscale', band: 1.5 }
        }
      }
    },
    {
      type: 'line',
      id: 'line',
      from: { data: 'table' },
      morph: true,
      animation: {
        enter: {
          type: 'growPointsYIn',
          options: { orient: 'negative' },
          duration: 1000
        },
        exit: {
          type: 'growPointsYOut',
          options: { orient: 'negative' },
          duration: 1000,
          easing: 'linear'
        },
        update: {
          type: 'update',
          duration: 1000
        }
      },
      encode: {
        update: {
          x: { scale: 'xscale', field: 'category' },
          y: { scale: 'yscale', field: 'amount' },
          stroke: 'purple',
          lineWidth: 2
        }
      }
    }
  ]
};

const singleMorphSpec: ViewSpec = {
  width: 400,
  height: 200,
  padding: 25,

  events: [
    {
      type: '@bar:mousedown',
      callback: (evt: any) => {
        console.log(evt);
      }
    },
    {
      type: 'rect:mousedown',
      callback: (evt: any) => {
        console.log(evt);
      }
    },
    {
      type: 'view:mousedown',
      callback: (evt: any) => {
        console.log(evt);
      }
    },
    {
      type: 'view:mousedown',
      target: [
        {
          target: 'signalB',
          callback: (evt: any) => {
            return { text: 'changed!' };
          }
        },
        {
          target: 'signalC',
          callback: (evt: any) => {
            return {};
          }
        }
      ]
    },
    {
      type: 'view:mousedown',
      callback: (evt: any) => {
        return { text: 'changed!' };
      }
    },
    {
      type: 'window:mousedown',
      callback: (evt: any) => {
        return { text: 'changed!' };
      }
    }
  ],

  signals: [
    {
      id: 'signalA',
      value: true
    },
    {
      id: 'signalAA',
      value: true
    },
    {
      id: 'signalB',
      value: true
    },
    {
      id: 'signalC',
      value: { text: 'balabala' }
    },
    {
      id: 'signalD',
      update: {
        callback: () => 666777
      }
    },
    {
      id: 'signalE',
      value: 123
    }
  ],

  data: [
    {
      id: 'table',
      values: [
        { category: 'A', amount: 28, index: 0 },
        { category: 'B', amount: 55, index: 1 },
        { category: 'C', amount: 43, index: 2 },
        { category: 'D', amount: 91, index: 3 },
        { category: 'E', amount: 81, index: 4 },
        { category: 'F', amount: 53, index: 5 },
        { category: 'G', amount: 19, index: 6 },
        { category: 'H', amount: 87, index: 7 }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'table', field: 'category' },
      range: {
        callback: (scale: any, params: any) => {
          return [0, params.width];
        },
        dependency: ['width']
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'amount' },
      nice: true,
      range: {
        callback: (scale: any, params: any) => {
          return [params.height, 0];
        },
        dependency: ['height']
      }
    }
  ],

  marks: [
    {
      type: 'symbol',
      id: 'symbol',
      from: { data: 'table' },
      key: 'category',
      groupBy: 'category',
      morph: true,
      morphKey: 'MORPH',
      animation: {
        enter: {
          type: 'fadeIn',
          duration: 1000
        },
        exit: {
          type: 'fadeOut',
          duration: 1000
        },
        update: {
          type: 'update',
          duration: 1000
        }
      },
      encode: {
        enter: {},
        update: {
          x: { scale: 'xscale', field: 'category' },
          width: { scale: 'xscale', band: 1 },
          y: { scale: 'yscale', field: 'amount' },
          fill: 'pink'
        },
        hover: {
          fill: 'red'
        }
      }
    }
  ]
};

const multiMorphSpec: ViewSpec = {
  width: 400,
  height: 200,
  padding: 25,

  events: [
    {
      type: '@bar:mousedown',
      callback: (evt: any) => {
        console.log(evt);
      }
    },
    {
      type: 'rect:mousedown',
      callback: (evt: any) => {
        console.log(evt);
      }
    },
    {
      type: 'view:mousedown',
      callback: (evt: any) => {
        console.log(evt);
      }
    },
    {
      type: 'view:mousedown',
      target: [
        {
          target: 'signalB',
          callback: (evt: any) => {
            return { text: 'changed!' };
          }
        },
        {
          target: 'signalC',
          callback: (evt: any) => {
            return {};
          }
        }
      ]
    },
    {
      type: 'view:mousedown',
      callback: (evt: any) => {
        return { text: 'changed!' };
      }
    },
    {
      type: 'window:mousedown',
      callback: (evt: any) => {
        return { text: 'changed!' };
      }
    }
  ],

  signals: [
    {
      id: 'signalA',
      value: true
    },
    {
      id: 'signalAA',
      value: true
    },
    {
      id: 'signalB',
      value: true
    },
    {
      id: 'signalC',
      value: { text: 'balabala' }
    },
    {
      id: 'signalD',
      update: {
        callback: () => 666777
      }
    },
    {
      id: 'signalE',
      value: 123
    }
  ],

  data: [
    {
      id: 'table',
      values: getMultiPointsData()
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'linear',
      nice: true,
      domain: [0, 100],
      range: {
        callback: (scale: any, params: any) => {
          return [0, params.width];
        },
        dependency: ['width']
      }
    },
    {
      id: 'yscale',
      type: 'linear',
      nice: true,
      domain: [0, 100],
      range: {
        callback: (scale: any, params: any) => {
          return [params.height, 0];
        },
        dependency: ['height']
      }
    }
  ],

  marks: [
    {
      type: 'symbol',
      id: 'symbol',
      morphKey: 'MORPH',
      from: { data: 'table' },
      key: 'index',
      groupBy: 'category',
      morph: true,
      animation: {
        enter: {
          type: 'fadeIn',
          duration: 1000
        },
        exit: {
          type: 'fadeOut',
          duration: 1000
        },
        update: {
          type: 'update',
          duration: 1000
        }
      },
      encode: {
        enter: {},
        update: {
          x: { scale: 'xscale', field: 'key' },
          y: { scale: 'yscale', field: 'value' },
          size: 12,
          fill: (datum: any) => (datum.index === 'A-0' ? 'blue' : 'pink')
        },
        hover: {
          fill: 'red'
        }
      }
    }
  ]
};

const reuseSpec: ViewSpec = {
  width: 400,
  height: 200,
  padding: 25,

  events: [
    {
      type: '@bar:mousedown',
      callback: (evt: any) => {
        console.log(evt);
      }
    },
    {
      type: 'rect:mousedown',
      callback: (evt: any) => {
        console.log(evt);
      }
    },
    {
      type: 'view:mousedown',
      callback: (evt: any) => {
        console.log(evt);
      }
    },
    {
      type: 'view:mousedown',
      target: [
        {
          target: 'signalB',
          callback: (evt: any) => {
            return { text: 'changed!' };
          }
        },
        {
          target: 'signalC',
          callback: (evt: any) => {
            return {};
          }
        }
      ]
    },
    {
      type: 'view:mousedown',
      callback: (evt: any) => {
        return { text: 'changed!' };
      }
    },
    {
      type: 'window:mousedown',
      callback: (evt: any) => {
        return { text: 'changed!' };
      }
    }
  ],
  signals: [
    {
      id: 'signalA',
      value: true
    },
    {
      id: 'signalAA',
      value: true
    },
    {
      id: 'signalB',
      value: true
    },
    {
      id: 'signalC',
      value: { text: 'balabala' }
    },
    {
      id: 'signalD',
      update: {
        callback: () => 666777
      }
    },
    {
      id: 'signalE',
      value: 123
    }
  ],

  data: [
    {
      id: 'table',
      values: [
        { category: 'C', amount: 43, index: 2 },
        { category: 'D', amount: 91, index: 3 },
        { category: 'E', amount: 81, index: 4 },
        { category: 'F', amount: 53, index: 5 },
        { category: 'G', amount: 19, index: 6 },
        { category: 'H', amount: 87, index: 7 },
        { category: 'I', amount: 37, index: 8 },
        { category: 'J', amount: 67, index: 9 },
        { category: 'J', amount: 57, index: 10 }
      ]
    }
  ],

  scales: [
    {
      id: 'xscale',
      type: 'band',
      domain: { data: 'table', field: 'category' },
      range: {
        callback: (scale: any, params: any) => {
          return [0, params.width];
        },
        dependency: ['width']
      },
      padding: 0.05,
      round: true
    },
    {
      id: 'yscale',
      type: 'linear',
      domain: { data: 'table', field: 'amount' },
      nice: true,
      range: {
        callback: (scale: any, params: any) => {
          return [params.height, 0];
        },
        dependency: ['height']
      }
    }
  ],

  marks: [
    {
      type: 'rect',
      id: 'bar',
      from: { data: 'table' },
      key: 'category',
      groupBy: 'category',
      morph: true,
      animation: {
        enter: {
          type: 'growHeightIn',
          options: { orient: 'negative' },
          duration: 1000
        },
        exit: {
          type: 'fadeOut',
          duration: 1000
        },
        update: {
          type: 'update',
          duration: 1000
        }
      },
      encode: {
        enter: {},
        update: {
          x: { scale: 'xscale', field: 'category' },
          width: { scale: 'xscale', band: 1 },
          y: { scale: 'yscale', field: 'amount' },
          y1: { scale: 'yscale', value: 0 },
          fill: {
            callback: (datum: any, el: any, params: any) => {
              return datum.amount < 60 ? 'red' : 'lightgreen';
            },
            dependency: ['xscale']
          }
        },
        hover: {
          fill: 'red',
          width: { scale: 'xscale', band: 1.5 }
        }
      }
    },
    {
      type: 'symbol',
      id: 'symbol',
      from: { data: 'table' },
      key: 'category',
      morph: true,
      animation: {
        enter: {
          type: 'fadeIn',
          duration: 1000
        },
        exit: {
          type: 'fadeOut',
          duration: 1000
        },
        update: {
          type: 'update',
          duration: 1000
        }
      },
      encode: {
        update: {
          x: { scale: 'xscale', field: 'category' },
          y: { scale: 'yscale', field: 'amount' },
          fill: 'pink',
          size: 10
        }
      }
    }
  ]
};

export const callback = (view: IView) => {
  const updateToMorphButton = document.createElement('button');
  updateToMorphButton.innerText = 'update to single morph spec';
  document.getElementById('footer')?.appendChild(updateToMorphButton);

  const updateToMultiMorphButton = document.createElement('button');
  updateToMultiMorphButton.innerText = 'update to multi morph spec';
  document.getElementById('footer')?.appendChild(updateToMultiMorphButton);

  const updateToReuseButton = document.createElement('button');
  updateToReuseButton.innerText = 'update to reuse spec';
  document.getElementById('footer')?.appendChild(updateToReuseButton);

  const updateToOriginButton = document.createElement('button');
  updateToOriginButton.innerText = 'update to origin spec';
  document.getElementById('footer')?.appendChild(updateToOriginButton);

  updateToMorphButton.addEventListener('click', () => {
    view.updateSpec(singleMorphSpec);
    view.runAsync({ morph: true, animation: { delay: 500, duration: 1000, easing: 'quadInOut' } });
  });

  updateToMultiMorphButton.addEventListener('click', () => {
    view.updateSpec(multiMorphSpec);
    view.runAsync({
      morph: true,
      animation: { duration: 1000, easing: 'quadInOut', oneByOne: 50, splitPath: 'clone' }
    });
  });

  updateToReuseButton.addEventListener('click', () => {
    view.updateSpec(reuseSpec);
    view.runAsync();
  });

  updateToOriginButton.addEventListener('click', () => {
    view.updateSpec(spec);
    view.runAsync({ morph: true, animation: { delay: 500, duration: 1000, easing: 'quadInOut', oneByOne: 50 } });
  });
};
