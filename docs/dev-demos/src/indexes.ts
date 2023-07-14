export const indexes = [
  {
    menu: 'mark',
    children: [
      {
        path: 'group-mark',
        name: 'group-mark'
      },
      {
        path: 'text',
        name: 'text'
      },
      {
        path: 'line-mark',
        name: 'line-mark'
      },
      {
        path: 'area-mark',
        name: 'area-mark'
      },
      {
        path: 'polygon-mark',
        name: 'polygon-mark'
      },
      {
        path: 'image-mark',
        name: 'image-mark'
      }
    ]
  },
  {
    menu: 'layout',
    children: [
      {
        path: 'layout-demo',
        name: 'layout-demo'
      },
      {
        path: 'grid-bar',
        name: '栅格布局',
        type: 'api'
      },
      {
        path: 'layout-data-update',
        name: '布局流程数据更新示例',
        type: 'api'
      }
    ]
  },
  {
    menu: 'rect',
    children: [
      {
        path: 'bar-chart',
        name: '带trigger柱图'
      },
      {
        path: 'group-bar-chart',
        name: '分组柱图'
      },
      {
        path: 'simple-bar-chart',
        name: '简单柱图'
      },
      {
        path: 'bidirectional-bar',
        name: '双向柱图'
      },
      {
        path: 'colorful-bar-chart',
        name: '多颜色填充柱图'
      },
      {
        path: 'interval-chart',
        name: 'interval'
      },
      {
        path: 'cell-chart',
        name: '色块图'
      },
      {
        path: 'stack',
        name: '堆积柱图',
        type: 'api'
      }
    ]
  },
  {
    menu: 'area',
    children: [
      {
        path: 'simple-area-chart',
        name: '简单面积图'
      }
    ]
  },
  {
    menu: 'line',
    children: [
      {
        path: 'line-chart',
        name: '线图'
      },
      {
        path: 'line-chart-segments',
        name: '分段线图'
      }
    ]
  },
  {
    menu: 'symbol',
    children: [
      {
        path: 'symbol-chart',
        name: '简单散点图'
      }
    ]
  },

  // {
  //   menu: 'map',
  //   children: [
  //     {
  //       path: 'country-unemployment',
  //       name: '美国失业率'
  //     }
  //   ]
  // },

  {
    menu: 'interaction',
    children: [
      {
        path: 'budget-forecasts',
        name: '[交互]budget-forecasts'
      },
      {
        path: 'zoomable-scatter-plot',
        name: '[交互]zoomable-scatter-plot'
      },
      {
        path: 'state-encode',
        name: '[交互]特殊交互示例',
        type: 'api'
      },
      {
        path: 'use-states',
        name: '[交互]useStates示例',
        type: 'api'
      },
      {
        path: 'multi-states',
        name: '[交互]多状态',
        type: 'api'
      }
    ]
  },

  {
    menu: 'animation',
    children: [
      {
        path: 'bar-animation',
        name: '[动画]柱状图'
      },
      {
        path: 'pie-animation',
        name: '[动画]饼图'
      },
      {
        path: 'area-animation',
        name: '[动画]面积图'
      },
      {
        path: 'arrange-animate',
        name: '[动画]动画编排',
        type: 'api'
      },
      {
        path: 'text-animate',
        name: '[动画]文字复杂动画',
        type: 'api'
      },
      {
        path: 'gauge-animate',
        name: '[动画]仪表动画',
        type: 'api'
      },
      {
        path: 'wave-animate',
        name: '[动画]波浪&涟漪动画',
        type: 'api'
      },
      {
        path: 'rect-animation',
        name: '[动画]rect动画测试',
        type: 'api'
      },
      {
        path: 'line-animation',
        name: '[动画]line动画测试',
        type: 'api'
      },
      {
        path: 'clip-animate',
        name: '[动画]clip动画测试',
        type: 'api'
      }
    ]
  },
  {
    menu: 'api',
    children: [
      {
        path: 'bar',
        name: '[API]柱状图',
        type: 'api'
      },
      {
        path: 'line',
        name: '[API]折线图',
        type: 'api'
      },
      {
        path: 'polar-line',
        name: '[API]极坐标系折线图',
        type: 'api'
      }
    ]
  },
  {
    menu: 'wordcloud',
    children: [
      {
        path: 'wordcloud',
        name: '词云'
      },
      {
        path: 'wordcloud-fast',
        name: '词云快速布局'
      },
      {
        path: 'wordcloud-fast-3d',
        name: '词云快速布局3d版本'
      }
    ]
  },
  {
    menu: 'sankey',
    children: [
      {
        path: 'sankey',
        name: 'sankey'
      },
      {
        path: 'sankey-vertical',
        name: 'sankey-vertical'
      },
      {
        path: 'sankey-label',
        name: 'sankey-label'
      },
      {
        path: 'sankey-hierarchy',
        name: 'sankey-hierarchy'
      }
    ]
  },
  {
    menu: 'hierarchy',
    children: [
      {
        path: 'treemap',
        name: 'treemap'
      },
      {
        path: 'treemap-color',
        name: 'treemap-color'
      },
      {
        path: 'sunburst',
        name: 'sunburst'
      },
      {
        path: 'circle-packing',
        name: 'circle-packing'
      },
      {
        path: 'circle-packing-image',
        name: 'circle-packing-image'
      },
      {
        path: 'tree',
        name: 'tree'
      }
    ]
  },
  {
    menu: 'wordcloud-shape',
    children: [
      {
        path: 'wordcloud-shape',
        name: '形状词云'
      }
    ]
  },
  {
    menu: 'glyph',
    children: [
      {
        path: 'glyph',
        name: 'glyph 测试',
        type: 'api'
      },
      {
        path: 'boxplot',
        name: 'boxplot',
        type: 'api'
      }
    ]
  },
  {
    menu: 'coordinate',
    children: [
      {
        path: 'coordinate-polar',
        name: '[Coordinate]极坐标系',
        type: 'api'
      }
    ]
  },
  {
    menu: 'api-test',
    children: [
      {
        path: 'refresh',
        name: '[API-TEST]refresh()测试',
        type: 'api'
      },
      {
        path: 'remove',
        name: '[API-TEST]view.remove&addModel()测试',
        type: 'api'
      },
      {
        path: 'api-usage',
        name: '[API-TEST]api使用形式测试',
        type: 'api'
      },
      {
        path: 'grammar-rank',
        name: '[API-TEST]api声明顺序测试',
        type: 'api'
      },
      {
        path: 'update-spec',
        name: '[API-TEST]updateSpec()测试'
      },
      {
        path: 'update-api',
        name: '[API-TEST]update api测试',
        type: 'api'
      }
    ]
  },
  {
    menu: '大数据渲染',
    children: [
      {
        path: 'large-bar-chart',
        name: '大数据柱图'
      },
      {
        path: 'large-group-bar-chart',
        name: '大数据分组柱图'
      },
      {
        path: 'large-group-line-chart',
        name: '大数据分组线图'
      },
      {
        path: 'large-group-area-chart',
        name: '大数据分组面积图'
      },
      {
        path: 'large-group-symbol-chart',
        name: '大数据分组散点图'
      },
      {
        path: 'large-glyph',
        name: '大数据glyph'
      },
      {
        path: 'large-boxplot',
        name: '大数据箱线图',
        type: 'api'
      }
    ]
  },
  {
    menu: '组件',
    children: [
      {
        path: 'legend',
        name: '[组件]图例',
        type: 'api'
      },
      {
        path: 'slider',
        name: '[组件]slider & datazoom',
        type: 'api'
      },
      {
        path: 'player',
        name: '[组件]player',
        type: 'api'
      }
    ]
  },
  {
    menu: 'other', 
    children: [
      {
        path: 'geo-path',
        name: 'geo-path',
      }
    ]
  }
];
