/* eslint-disable no-console */
import { IncreaseCount, InputText, FadeInPlus } from '@visactor/vrender';
import type { View, MarkAnimationSpec } from '@visactor/vgrammar';

export const runner = (view: View) => {
  const growTextAnimation: MarkAnimationSpec = {
    enter: {
      // channel: ['text'],
      // custom: (ratio: number, from: any, to: any, nextAttributes: any) => {
      //   nextAttributes.text = Math.ceil(Number.parseInt(to, 10) * ratio);
      //   return false;
      // },
      channel: {
        // text: {
        //   from: 0,
        //   to: 100
        // },
        textAlign: {
          from: 'left',
          to: 'center'
        }
      },
      // custom: IncreaseCount,
      // customParameters: () => ({ fixed: 2 }),
      duration: 2000,
      easing: 'linear'
    }
  };
  const growText = view
    .mark('text', view.rootMark)
    .encode({
      text: '100',
      fontSize: 20,
      x: 0,
      y: 50,
      textAlign: 'left',
      fill: 'black'
    })
    .animation(growTextAnimation);
  //   .animation({
  //     update: { type: 'update', duration: 1000 }
  //   });
  // window['update'] = () => {
  //   growText.encode('textAlign', 'center');
  //   view.runAsync();
  // }

  const fadeText = view
    .mark('text', view.rootMark)
    .encode({
      text: '文字渐入测试文字渐入测试',
      fontSize: 20,
      x: 0,
      y: 65,
      fill: 'black',
      textBaseline: 'top'
    })
    .animation({
      enter: {
        custom: FadeInPlus,
        customParameters: { direction: 2 },
        duration: 3000
      }
    });

  const typingAnimation: MarkAnimationSpec = {
    enter: {
      channel: {
        text: {
          from: '',
          to: '打字机动画打字机动画打字机动画打字机动画'
        }
      },
      custom: InputText,
      duration: 3000,
      easing: 'quadInOut'
    }
  };
  const typingText = view
    .mark('text', view.rootMark)
    .encode({
      text: '打字机动画打字机动画打字机动画打字机动画',
      fontSize: 20,
      x: 0,
      y: 100,
      fill: 'black',
      textBaseline: 'top'
    })
    .animation(typingAnimation);

  // TODO: clip
  const rollTextGroup = view
    .group(view.rootMark)
    .encode({
      x: 50,
      y: 130,
      width: 300,
      height: 30,
      fill: 'grey',
      fillOpacity: 0.3
    })
    .configure({ clip: true });
  const rollText0 = view
    .mark('text', rollTextGroup)
    .encode({
      text: '长长长长长长滚动文本长长长长长长',
      fontSize: 20,
      x: 0,
      y: 20,
      fill: 'black'
    })
    .animation({
      enter: {
        channel: {
          x: {
            from: 0,
            to: -400
          }
        },
        duration: 2000,
        easing: 'linear',
        loop: true
      }
    });
  const rollText1 = view
    .mark('text', rollTextGroup)
    .encode({
      text: '长长长长长长滚动文本长长长长长长',
      fontSize: 20,
      x: 400,
      y: 20,
      fill: 'black'
    })
    .animation({
      enter: {
        channel: {
          x: {
            from: 400,
            to: 0
          }
        },
        duration: 2000,
        easing: 'linear',
        loop: true
      }
    });
};

export const callback = (chartInstance: any) => {
  // do nothing
};
