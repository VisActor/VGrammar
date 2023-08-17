import { allocateWords } from './segmentation';
import { layout, layoutGlobalShrink, layoutSelfEnlarge } from './wordle';
import { filling } from './filling';
import type { LayoutConfigType, SegmentationOutputType } from './interface';

export default function (words: any, layoutConfig: LayoutConfigType, segmentationOutput: SegmentationOutputType) {
  // 将单词分配到各个连通区域中
  allocateWords(words, segmentationOutput);
  if (layoutConfig.layoutMode === 'ensureMapping') {
    layoutGlobalShrink(words, layoutConfig, segmentationOutput);
  } else if (layoutConfig.layoutMode === 'ensureMappingEnlarge') {
    layoutSelfEnlarge(words, layoutConfig, segmentationOutput);
  } else {
    layout(words, layoutConfig, segmentationOutput);
  }
  // const fillingWords = []
  const fillingWords = filling(words, layoutConfig, segmentationOutput);

  // 处理布局失败的单词, 设置 visible 为 false
  // const failedWords = words.filter((word) => !word.hasPlaced)
  const failedWords = [];
  const successedWords = [];
  for (let i = 0; i < words.length; i++) {
    if (words[i].hasPlaced) {
      successedWords.push(words[i]);
    } else {
      failedWords.push(words[i]);
    }
  }
  failedWords.forEach(word => (word.visible = false));

  // debug 常用代码
  // const { board, boardSize } = layoutConfig
  // paint(board, boardSize)
  // paintLabels(layoutConfig)
  // draw(words, fillingWords, layoutConfig, 1)
  // console.log(`核心词数量:${words.length}  填充词数量:${fillingWords.length}`)
  // console.log('放置失败的单词', failedWords)
  // console.log(layoutConfig, words, fillingWords)

  return {
    fillingWords,
    successedWords,
    failedWords
  };
}
