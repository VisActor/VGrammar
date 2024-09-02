import type { CloudWordType, LayoutConfigType, SegmentationOutputType } from './interface';
import { measureSprite, isCollideWithBoard, placeWordOnBoard } from './wordle';

export function filling(
  words: CloudWordType[],
  layoutConfig: LayoutConfigType,
  segmentationOutput: SegmentationOutputType
) {
  const {
    size,
    fillingTimes,
    fillingXStep,
    fillingYStep,
    getFillingFontStyle,
    getFillingFontWeight,
    getFillingFontFamily,
    fillingInitialFontSize,
    fillingDeltaFontSize,
    fillingInitialOpacity,
    fillingDeltaOpacity,
    fillingRotateList,
    getFillingPadding,
    random,
    board,
    minFillFontSize
  } = layoutConfig;

  const { boardSize, shapeBounds, tempCanvas: canvas, randomGenerator } = segmentationOutput;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  // const padding = fillingPadding

  let fontSize = fillingInitialFontSize;
  let opacity = fillingInitialOpacity;
  const placedFillingWords: CloudWordType[] = [];

  for (let i = 0; i < fillingTimes; i++) {
    filling1Time(fontSize, opacity);

    // 完成一次填充，则更新一下填充词的属性，继续下一次填充
    fontSize = Math.max(
      fontSize > fillingDeltaFontSize ? fontSize - fillingDeltaFontSize : fillingDeltaFontSize,
      minFillFontSize
    ); // 填充词最小字号4px
    opacity = opacity > fillingDeltaOpacity ? opacity - fillingDeltaOpacity : fillingDeltaOpacity;
  }

  return placedFillingWords;

  function filling1Time(fontSize: number, opacity: number) {
    const fillingWords: CloudWordType[] = words.map(word => {
      const { text, color, fillingColor, hasPlaced, datum } = word;
      return {
        x: 0,
        y: 0,
        weight: 0,
        text,
        fontFamily: getFillingFontFamily(datum),
        fontStyle: getFillingFontStyle(datum),
        fontWeight: getFillingFontWeight(datum),
        fontSize,
        rotate: fillingRotateList[~~(randomGenerator() * fillingRotateList.length)],
        padding: getFillingPadding(datum),
        opacity,
        visible: true,
        color,
        fillingColor,
        hasPlaced,
        datum
      };
    });
    randomArray(fillingWords);
    let wi = 0;
    const { x1, y1, x2, y2 } = shapeBounds;
    // 小范围随机一个起点
    const [startX, startY] = [
      x1 + ~~(randomGenerator() * fillingXStep * 2),
      y1 + ~~(randomGenerator() * fillingYStep * 2)
    ];

    for (let y = startY; y <= y2; y += fillingYStep) {
      for (let x = startX; x <= x2; x += fillingXStep) {
        // 测量填充词的 bounds
        measureSprite(canvas, ctx, fillingWords, wi);
        const word = fillingWords[wi];
        word.x = x;
        word.y = y;
        const { wordSize, bounds, hasPlaced } = word;

        /*
         * 这里有一个问题，如果一个词语一直布局不通过，就会在一次filling1Time中一直尝试布局
         * 导致fill次数达到上限后也无法填满空隙
         * 因此在此处跳过无法布局的核心词（一般为超场词），避免出现问题
         */
        if (!hasPlaced || !bounds) {
          // 跳过未成功布局的核心词
          if (++wi === fillingWords.length) {
            wi = 0;
            if (random) {
              randomArray(fillingWords);
            }
          }
          continue;
        }

        const { dTop, dBottom, dLeft, dRight } = bounds;
        // 检测根据单词的 bounds 检测是否超出范围
        if (word.x - dLeft < 0 || word.x + dRight > size[0] || word.y - dTop < 0 || word.y + dBottom > size[1]) {
          continue;
        }

        if (word.hasText && word.sprite && !isCollideWithBoard(word, board, boardSize)) {
          placeWordOnBoard(word, board, boardSize);
          placedFillingWords.push(Object.assign({}, word));
          // 所有单词放置完后，随机排序一下填充词
          if (++wi === fillingWords.length) {
            wi = 0;
            if (random) {
              randomArray(fillingWords);
            }
          }
        }
      }
    }
  }

  function randomArray(words: CloudWordType[]) {
    return words.sort(() => randomGenerator() - 0.5);
  }
}
