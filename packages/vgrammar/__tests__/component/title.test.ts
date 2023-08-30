import { Title } from '../../src/component/title';
import { emptyFunction, getMockedView } from '../util';

test('title', function () {
  const view = getMockedView() as any;
  const title = new Title(view).title('主标题').subTitle(['副标题 balabala', '嘿嘿嘿']).encode({
    x: 100,
    y: 50
  });
  (title as any).graphicParent = { appendChild: emptyFunction };
  (title as any).evaluateJoin();
  (title as any).evaluateEncode(title.elements, (title as any)._getEncoders(), {});

  expect(title.elements.length).toBe(1);
  expect(title.elements[0].getGraphicItem().attribute).toEqual({
    subtext: ['副标题 balabala', '嘿嘿嘿'],
    subtextStyle: {
      ellipsis: '...',
      fill: '#606773',
      fontSize: 16,
      fontWeight: 'normal',
      textAlign: 'left',
      textBaseline: 'top'
    },
    text: '主标题',
    textStyle: {
      ellipsis: '...',
      fill: '#21252c',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'left',
      textBaseline: 'top'
    },
    x: 100,
    y: 50
  });
});
