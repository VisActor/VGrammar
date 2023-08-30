import type {
  CircleAxisAttributes,
  CircleCrosshairAttrs,
  ColorLegendAttributes,
  ContinuousPlayerAttributes,
  DataLabelAttrs,
  DataZoomAttributes,
  DiscreteLegendAttrs,
  DiscretePlayerAttributes,
  LineAxisAttributes,
  LineCrosshairAttrs,
  LineLabelAttrs,
  PolygonCrosshairAttrs,
  RectCrosshairAttrs,
  RectLabelAttrs,
  SectorCrosshairAttrs,
  SizeLegendAttributes,
  SliderAttributes,
  SymbolLabelAttrs,
  ArcLabelAttrs,
  TooltipAttributes,
  BaseLabelAttrs,
  TitleAttrs
} from '@visactor/vrender-components';
import type { IComponentTheme, RecursivePartial } from '../../types';

const axis: RecursivePartial<LineAxisAttributes> = {
  label: {
    visible: true,
    inside: false,
    space: 4,
    style: {
      fontSize: 12,
      fill: '#6F6F6F',
      fontWeight: 'normal',
      fillOpacity: 1
    }
  },
  tick: {
    visible: true,
    inside: false,
    alignWithLabel: true,
    length: 4,
    style: {
      lineWidth: 1,
      stroke: '#D8DCE3',
      strokeOpacity: 1
    }
  },
  subTick: {
    visible: false,
    inside: false,
    count: 4,
    length: 2,
    style: {
      lineWidth: 1,
      stroke: '#D8DCE3',
      strokeOpacity: 1
    }
  },
  line: {
    visible: true,
    style: {
      lineWidth: 1,
      stroke: '#dfdfdf',
      strokeOpacity: 1
    }
  },
  grid: {
    visible: false,
    style: {
      lineWidth: 1,
      stroke: '#dfdfdf',
      strokeOpacity: 1,
      lineDash: [4, 4]
    },
    length: 100,
    type: 'line'
  },
  subGrid: {
    visible: false,
    style: {
      lineWidth: 1,
      stroke: '#dfdfdf',
      strokeOpacity: 1,
      lineDash: [4, 4]
    }
  },
  items: [],
  start: { x: 0, y: 0 },
  end: { x: 100, y: 0 },
  x: 0,
  y: 0
};

const circleAxis: RecursivePartial<CircleAxisAttributes> = {
  title: {
    space: 4,
    padding: [0, 0, 0, 0],
    textStyle: {
      fontSize: 12,
      fill: '#333333',
      fontWeight: 'normal',
      fillOpacity: 1
    },
    text: 'theta'
  },
  label: {
    visible: true,
    inside: false,
    space: 4,
    style: {
      fontSize: 12,
      fill: '#6F6F6F',
      fontWeight: 'normal',
      fillOpacity: 1
    }
  },
  tick: {
    visible: true,
    inside: false,
    alignWithLabel: true,
    length: 4,
    style: {
      lineWidth: 1,
      stroke: '#D8DCE3',
      strokeOpacity: 1
    }
  },
  subTick: {
    visible: false,
    inside: false,
    count: 4,
    length: 2,
    style: {
      lineWidth: 1,
      stroke: '#D8DCE3',
      strokeOpacity: 1
    }
  },
  line: {
    visible: true,
    style: {
      lineWidth: 1,
      stroke: '#dfdfdf',
      strokeOpacity: 1
    }
  },
  grid: {
    style: {
      lineWidth: 1,
      stroke: '#dfdfdf',
      strokeOpacity: 1,
      lineDash: [4, 4]
    },
    type: 'line',
    visible: false,
    smoothLink: true
  },
  subGrid: {
    visible: false,
    style: {
      lineWidth: 1,
      stroke: '#dfdfdf',
      strokeOpacity: 1,
      lineDash: [4, 4]
    }
  },
  items: [],
  startAngle: 0,
  endAngle: Math.PI * 2,
  radius: 100,
  innerRadius: 0,
  center: { x: 0, y: 0 },
  x: 0,
  y: 0
};

const discreteLegend: RecursivePartial<DiscreteLegendAttrs> = {
  layout: 'vertical',
  title: {
    align: 'start',
    space: 12,
    textStyle: {
      fontSize: 12,
      fontWeight: 'bold',
      fill: '#2C3542'
    }
  },
  item: {
    spaceCol: 10,
    spaceRow: 10,
    shape: {
      space: 4,
      style: {
        size: 10,
        cursor: 'pointer'
      },
      state: {
        selectedHover: {
          opacity: 0.85
        },
        unSelected: {
          fill: '#D8D8D8',
          stroke: '#D8D8D8',
          fillOpacity: 0.5
        }
      }
    },
    label: {
      space: 4,
      style: {
        fontSize: 12,
        fill: 'black',
        cursor: 'pointer'
      },
      state: {
        selectedHover: {
          opacity: 0.85
        },
        unSelected: {
          fill: '#D8D8D8',
          fillOpacity: 0.5
        }
      }
    },
    value: {
      alignRight: false,
      style: {
        fontSize: 12,
        fill: '#ccc',
        cursor: 'pointer'
      },
      state: {
        selectedHover: {
          opacity: 0.85
        },
        unSelected: {
          fill: '#D8D8D8'
        }
      }
    },
    background: {
      style: {
        cursor: 'pointer'
      },
      state: {
        selectedHover: {
          fillOpacity: 0.7,
          fill: 'gray'
        },
        unSelectedHover: {
          fillOpacity: 0.2,
          fill: 'gray'
        }
      }
    },
    focus: false,
    focusIconStyle: {
      size: 10,
      fill: '#333',
      cursor: 'pointer'
    },
    visible: true,
    padding: {
      top: 2,
      bottom: 2,
      left: 2,
      right: 2
    }
  },
  autoPage: true,
  pager: {
    space: 12,
    handler: {
      style: {
        size: 10
      },
      space: 4
    }
  },
  hover: true,
  select: true,
  selectMode: 'multiple',
  allowAllCanceled: false,
  items: [
    {
      index: 0,
      id: '',
      label: '',
      shape: {
        fill: '#6690F2',
        stroke: '#6690F2',
        symbolType: 'circle'
      }
    }
  ]
};

const colorLegend: RecursivePartial<ColorLegendAttributes> = {
  title: {
    visible: false,
    text: ''
  },
  colors: [],
  layout: 'horizontal',
  railWidth: 200,
  railHeight: 8,
  railStyle: {
    cornerRadius: 5
  }
};

const sizeLegend: RecursivePartial<SizeLegendAttributes> = {
  title: {
    visible: false,
    text: ''
  },
  trackStyle: {
    fill: '#ccc'
  },
  layout: 'horizontal',
  align: 'bottom',
  railWidth: 200,
  railHeight: 6,
  min: 0,
  max: 1,
  value: [0, 1]
};

const lineCrosshair: RecursivePartial<LineCrosshairAttrs> = {
  start: { x: 0, y: 0 },
  end: { x: 0, y: 0 }
};

const rectCrosshair: RecursivePartial<RectCrosshairAttrs> = {
  start: { x: 0, y: 0 },
  end: { x: 0, y: 0 },
  rectStyle: {
    width: 10,
    height: 10
  }
};

const sectorCrosshair: RecursivePartial<SectorCrosshairAttrs> = {
  center: { x: 0, y: 0 },
  radius: 100,
  startAngle: 0,
  endAngle: Math.PI / 6
};

const circleCrosshair: RecursivePartial<CircleCrosshairAttrs> = {
  center: { x: 0, y: 0 },
  radius: 100,
  startAngle: 0,
  endAngle: Math.PI * 2
};

const polygonCrosshair: RecursivePartial<PolygonCrosshairAttrs> = {
  center: { x: 0, y: 0 },
  radius: 100,
  startAngle: 0,
  endAngle: Math.PI * 2,
  sides: 6
};

const slider: RecursivePartial<SliderAttributes> = {
  layout: 'horizontal',
  railWidth: 200,
  railHeight: 10,
  railStyle: {
    cornerRadius: 5
  },
  range: {
    draggableTrack: true
  },
  startText: {
    visible: true,
    text: '',
    space: 8
  },
  endText: {
    visible: true,
    text: '',
    space: 8
  },
  min: 0,
  max: 1,
  value: [0, 1]
};

export const dataLabel: RecursivePartial<DataLabelAttrs> = {
  size: { width: 400, height: 400 },
  dataLabels: []
};

export const lineLabel: RecursivePartial<LineLabelAttrs> = {
  type: 'line',
  data: [
    {
      text: '',
      data: {}
    }
  ],
  position: 'start',
  overlap: {
    avoidBaseMark: true,
    clampForce: false,
    size: {
      width: 1000,
      height: 1000
    },
    strategy: [
      {
        type: 'position'
      }
    ]
  },
  smartInvert: false
};

export const rectLabel: RecursivePartial<RectLabelAttrs> = {
  type: 'rect',
  data: [
    {
      text: '',
      data: {}
    }
  ],
  position: 'top',
  overlap: {
    size: {
      width: 1000,
      height: 1000
    },
    strategy: [
      {
        type: 'position'
      }
    ]
  },
  smartInvert: false
};

export const symbolLabel: RecursivePartial<SymbolLabelAttrs> = {
  type: 'symbol',
  data: [
    {
      text: '',
      data: {}
    }
  ],
  position: 'top',
  overlap: {
    avoidBaseMark: true,
    size: {
      width: 1000,
      height: 1000
    },
    strategy: [
      {
        type: 'position'
      }
    ]
  },
  smartInvert: false
};

export const arcLabel: RecursivePartial<ArcLabelAttrs> = {
  type: 'arc',
  data: [
    {
      text: '',
      data: {}
    }
  ],
  width: 800,
  height: 600,
  position: 'outside',

  zIndex: 302
};

export const pointLabel: RecursivePartial<BaseLabelAttrs> = {
  data: [
    {
      text: '',
      data: {}
    }
  ],
  overlap: {
    avoidBaseMark: false,
    clampForce: false,
    size: {
      width: 1000,
      height: 1000
    }
  },
  smartInvert: false
};

export const datazoom: RecursivePartial<DataZoomAttributes> = {
  orient: 'bottom',
  showDetail: 'auto',
  brushSelect: true,
  start: 0,
  end: 1,
  position: { x: 0, y: 0 },
  size: { width: 500, height: 40 },
  previewData: []
};

export const continuousPlayer: RecursivePartial<ContinuousPlayerAttributes> = {};

export const discretePlayer: RecursivePartial<DiscretePlayerAttributes> = {};

export const tooltip: RecursivePartial<TooltipAttributes> = {};

export const title: RecursivePartial<TitleAttrs> = {};

export const defaultComponentTheme: IComponentTheme = {
  axis,
  circleAxis,

  discreteLegend,
  colorLegend,
  sizeLegend,

  lineCrosshair,
  rectCrosshair,
  sectorCrosshair,
  circleCrosshair,
  polygonCrosshair,

  slider,

  dataLabel,
  pointLabel,
  lineLabel,
  rectLabel,
  symbolLabel,
  arcLabel,

  datazoom,

  continuousPlayer,
  discretePlayer,

  tooltip,

  title
};
