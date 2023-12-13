import { registerDataZoom, Datazoom } from '../../src/component/datazoom';
import { emptyFunction, getMockedView } from '../util';
import { initBrowserEnv } from '../../src/env';

initBrowserEnv();
registerDataZoom();
test('datazoom', function () {
  const view = getMockedView() as any;
  const datazoom = new Datazoom(view).encode({
    x: 40,
    y: 340,
    size: {
      width: 270,
      height: 40
    }
  });
  (datazoom as any).graphicParent = { appendChild: emptyFunction };
  (datazoom as any).evaluateJoin();
  (datazoom as any).evaluateEncode(datazoom.elements, (datazoom as any)._getEncoders(), {});

  expect(datazoom.elements.length).toBe(1);
  expect(datazoom.elements[0].getGraphicItem().attribute).toEqual({
    backgroundChartStyle: {
      area: {
        fill: '#F6F8FC',
        lineWidth: 1,
        stroke: '#D1DBEE',
        visible: true
      },
      line: {
        lineWidth: 1,
        stroke: '#D1DBEE',
        visible: true
      }
    },
    backgroundStyle: {
      cornerRadius: 2,
      fill: 'white',
      lineWidth: 1,
      stroke: '#D1DBEE'
    },
    brushSelect: true,
    delayTime: 0,
    delayType: 'throttle',
    dragMaskStyle: {
      fill: '#B0C8F9',
      fillOpacity: 0.2
    },
    end: 1,
    endHandlerStyle: {
      fill: 'white',
      lineWidth: 0.5,
      stroke: '#B0C8F9',
      symbolType:
        // eslint-disable-next-line max-len
        'M -0.0544 0.25 C -0.0742 0.25 -0.0901 0.234 -0.0901 0.2143 L -0.0901 -0.1786 C -0.0901 -0.1983 -0.0742 -0.2143 -0.0544 -0.2143 L -0.0187 -0.2143 L -0.0187 -0.5 L 0.017 -0.5 L 0.017 -0.2143 L 0.0527 -0.2143 C 0.0724 -0.2143 0.0884 -0.1983 0.0884 -0.1786 L 0.0884 0.2143 C 0.0884 0.234 0.0724 0.25 0.0527 0.25 L 0.017 0.25 L 0.017 0.5 L -0.0187 0.5 L -0.0187 0.25 L -0.0544 0.25 Z M -0.0187 -0.1429 L -0.0544 -0.1429 L -0.0544 0.1786 L -0.0187 0.1786 L -0.0187 -0.1429 Z M 0.0527 -0.1429 L 0.017 -0.1429 L 0.017 0.1786 L 0.0527 0.1786 L 0.0527 -0.1429 Z',
      visible: true,
      triggerMinSize: 40
    },
    endTextStyle: {
      padding: 4,
      textStyle: {
        fill: '#6F6F6F',
        fontSize: 10
      }
    },
    maxSpan: 1,
    middleHandlerStyle: {
      background: {
        size: 8,
        style: {
          cornerRadius: 2,
          fill: 'white',
          stroke: '#B0C8F9'
        }
      },
      icon: {
        fill: 'white',
        lineWidth: 0.5,
        size: 6,
        stroke: '#B0C8F9',
        symbolType:
          // eslint-disable-next-line max-len
          'M 0.3 -0.5 C 0.41 -0.5 0.5 -0.41 0.5 -0.3 C 0.5 -0.3 0.5 0.3 0.5 0.3 C 0.5 0.41 0.41 0.5 0.3 0.5 C 0.3 0.5 -0.3 0.5 -0.3 0.5 C -0.41 0.5 -0.5 0.41 -0.5 0.3 C -0.5 0.3 -0.5 -0.3 -0.5 -0.3 C -0.5 -0.41 -0.41 -0.5 -0.3 -0.5 C -0.3 -0.5 0.3 -0.5 0.3 -0.5 Z'
      },
      visible: true
    },
    minSpan: 0,
    orient: 'bottom',
    position: {
      x: 0,
      y: 0
    },
    previewData: [],
    realTime: true,
    selectedBackgroundChartStyle: {
      area: {
        fill: '#fbb934',
        lineWidth: 1,
        stroke: '#B0C8F9',
        visible: true
      },
      line: {
        lineWidth: 1,
        stroke: '#fbb934',
        visible: true
      }
    },
    selectedBackgroundStyle: {
      fill: '#B0C8F9',
      fillOpacity: 0.5
    },
    showDetail: 'auto',
    size: {
      height: 40,
      width: 270
    },
    start: 0,
    startHandlerStyle: {
      fill: 'white',
      lineWidth: 0.5,
      stroke: '#B0C8F9',
      symbolType:
        // eslint-disable-next-line max-len
        'M -0.0544 0.25 C -0.0742 0.25 -0.0901 0.234 -0.0901 0.2143 L -0.0901 -0.1786 C -0.0901 -0.1983 -0.0742 -0.2143 -0.0544 -0.2143 L -0.0187 -0.2143 L -0.0187 -0.5 L 0.017 -0.5 L 0.017 -0.2143 L 0.0527 -0.2143 C 0.0724 -0.2143 0.0884 -0.1983 0.0884 -0.1786 L 0.0884 0.2143 C 0.0884 0.234 0.0724 0.25 0.0527 0.25 L 0.017 0.25 L 0.017 0.5 L -0.0187 0.5 L -0.0187 0.25 L -0.0544 0.25 Z M -0.0187 -0.1429 L -0.0544 -0.1429 L -0.0544 0.1786 L -0.0187 0.1786 L -0.0187 -0.1429 Z M 0.0527 -0.1429 L 0.017 -0.1429 L 0.017 0.1786 L 0.0527 0.1786 L 0.0527 -0.1429 Z',
      visible: true,
      triggerMinSize: 40
    },
    startTextStyle: {
      padding: 4,
      textStyle: {
        fill: '#6F6F6F',
        fontSize: 10
      }
    },
    x: 40,
    y: 340,
    zoomLock: false
  });
});
