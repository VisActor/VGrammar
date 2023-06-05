/* eslint-disable no-console */
import type { View } from '@visactor/vgrammar';

export const runner = (view: View) => {
  const polar = view.coordinate('polar').origin([200, 200]);

  const arc = view
    .mark('arc', view.rootMark)
    .encode({
      r: 0,
      theta: 0,
      fill: 'grey',
      outerRadius: 200,
      innerRadius: 198,
      startAngle: Math.PI,
      endAngle: Math.PI * 2
    })
    .coordinate(polar);
  const tickData = view.data([
    { value: 0, index: 0 },
    { value: 20, index: 1 },
    { value: 40, index: 2 },
    { value: 60, index: 3 },
    { value: 80, index: 4 },
    { value: 100, index: 5 }
  ]);
  const tickLabel = view
    .mark('text', view.rootMark)
    .join(tickData)
    .coordinate(polar)
    .encode({
      r: 185,
      theta: (datum: any) => Math.PI + (datum.index / 5) * Math.PI,
      fill: 'grey',
      text: (datum: any) => datum.value,
      fontSize: 12,
      textBaseline: 'middle',
      textAlign: 'center'
    });

  const pinRoot = view.mark('arc', view.rootMark).coordinate(polar).encode({
    r: 0,
    theta: 0,
    fill: 'grey',
    outerRadius: 10,
    innerRadius: 8
  });
  const pin = view
    .mark('rule', view.rootMark)
    .coordinate(polar)
    .encode({
      r: 10,
      theta: 0,
      stroke: 'grey',
      lineWidth: 3,
      r1: 120,
      angle: Math.PI * 2,
      anchor: [200, 200]
    })
    .animation({
      enter: {
        channel: {
          angle: {
            from: Math.PI,
            to: Math.PI * 2
          }
        },
        duration: 2000,
        easing: 'linear'
      }
    });
  const labelText = view
    .mark('text', view.rootMark)
    .coordinate(polar)
    .encode({
      r: 60,
      theta: Math.PI / 2,
      fill: 'black',
      text: '优',
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold'
    })
    .animation({
      enter: {
        channel: {
          gaugeValue: {
            from: 0,
            to: 100
          }
        },
        custom: (ratio: number, from: any, to: any, nextAttributes: any) => {
          const currentValue = ratio * (to.gaugeValue - from.gaugeValue) + from.gaugeValue;
          if (currentValue < 33) {
            nextAttributes.text = [Math.round(currentValue), '差'];
            nextAttributes.fillColor = 'orange';
          } else if (currentValue < 66) {
            nextAttributes.text = [Math.round(currentValue), '良'];
            nextAttributes.fillColor = 'gold';
          } else {
            nextAttributes.text = [Math.round(currentValue), '优'];
            nextAttributes.fillColor = 'green';
          }
        },
        duration: 2000,
        easing: 'linear'
      }
    });
};

export const callback = (chartInstance: any) => {
  // do nothing
};
