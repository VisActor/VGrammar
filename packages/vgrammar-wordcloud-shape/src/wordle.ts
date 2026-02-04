import type { CloudWordType, IWordMeasureCache, LayoutConfigType, SegmentationOutputType } from './interface';

export function layout(
  words: CloudWordType[],
  layoutConfig: LayoutConfigType,
  segmentationOutput: SegmentationOutputType
) {
  const { size, stepFactor } = layoutConfig;
  const {
    segmentation: { regions },
    tempCanvas: canvas,
    boardSize,
    shapeCenter,
    shapeMaxR,
    shapeRatio
  } = segmentationOutput;
  const board = initBoardWithShape(segmentationOutput);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  // 对每个区域开始进行布局
  for (const region of regions) {
    const { words: regionWords, center, maxR, ratio } = region;

    for (let i = 0; i < regionWords.length; i++) {
      // 批量测量单词的 bounds
      measureSprite(canvas, ctx, words, i, layoutConfig.measureCache);
      const word = regionWords[i];
      word.x = center[0];
      word.y = center[1];

      if (word.hasText && word.sprite && place(board, word, maxR, ratio, size, boardSize, stepFactor)) {
        word.hasPlaced = true;
      }
    }
  }

  // 对于放置失败的单词，缩小文字大小, 以 shapeCenter 为中心进行布局
  // 最多尝试尝试3次，如果还是失败，则认为该单词不能放置
  for (let _ = 0; _ < layoutConfig.textLayoutTimes; _++) {
    const failedWords = words.filter((word: CloudWordType) => {
      if (!word.hasPlaced) {
        word.hasText = false;
        word.sprite = null;
        word.fontSize = Math.max(~~(word.fontSize * layoutConfig.fontSizeShrinkFactor), layoutConfig.minFontSize);
      }

      return !word.hasPlaced;
    });

    if (failedWords.length === 0) {
      break;
    }

    for (let i = 0; i < failedWords.length; i++) {
      const word = failedWords[i];
      measureSprite(canvas, ctx, failedWords, i, layoutConfig.measureCache);
      word.x = shapeCenter[0];
      word.y = shapeCenter[1];
      if (word.hasText && place(board, word, shapeMaxR, shapeRatio, size, boardSize, stepFactor)) {
        word.hasPlaced = true;
      }
    }
  }

  layoutConfig.board = board;
}

export function layoutSelfShrink(
  words: CloudWordType,
  layoutConfig: LayoutConfigType,
  segmentationOutput: SegmentationOutputType
) {
  const { size, stepFactor } = layoutConfig;
  const {
    segmentation: { regions },
    tempCanvas: canvas,
    boardSize
  } = segmentationOutput;
  const board = initBoardWithShape(segmentationOutput);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  // 对每个区域开始进行布局
  for (const region of regions) {
    const { words: regionWords, center, maxR, ratio } = region;
    let fontFactor = 1;

    for (let i = 0; i < regionWords.length; i++) {
      // 批量测量单词的 bounds
      measureSprite(canvas, ctx, words, i, layoutConfig.measureCache);
      const word = regionWords[i];
      word.x = center[0];
      word.y = center[1];

      if (word.hasText && word.sprite && place(board, word, maxR, ratio, size, boardSize, stepFactor)) {
        word.hasPlaced = true;
      } else {
        // console.log('失败迭代', word.text);
        fontFactor = fontFactor * layoutConfig.fontSizeShrinkFactor;
        for (let j = i; j < regionWords.length; j++) {
          word.hasText = false;
          word.sprite = null;
          word.fontSize = Math.max(~~(word.fontSize * fontFactor), layoutConfig.minFontSize);
        }
        i--;
      }
    }
  }

  // // 对于放置失败的单词，缩小文字大小, 以 shapeCenter 为中心进行布局
  // // 最多尝试尝试3次，如果还是失败，则认为该单词不能放置
  // for (let _ = 0; _ < config.textLayoutTimes; _++) {
  //   const failedWords = words.filter((word) => {
  //     if (!word.hasPlaced) {
  //       word.hasText = false
  //       word.sprite = null
  //       word.fontSize = ~~(word.fontSize * config.fontSizeShrinkFactor)
  //     }

  //     return !word.hasPlaced
  //   })

  //   if (failedWords.length === 0) break

  //   for (let i = 0; i < failedWords.length; i++) {
  //     const word = failedWords[i]
  //     measureSprite(canvas, ctx, failedWords, i)
  //     word.x = shapeCenter[0]
  //     word.y = shapeCenter[1]
  //     if (
  //       word.hasText &&
  //       place(board, word, shapeMaxR, shapeRatio, size, boardSize, stepFactor)
  //     ) {
  //       word.hasPlaced = true
  //     }
  //   }
  // }

  layoutConfig.board = board;
}

export function layoutGlobalShrink(
  words: CloudWordType[],
  layoutConfig: LayoutConfigType,
  segmentationOutput: SegmentationOutputType
) {
  const { stepFactor, importantWordCount, globalShinkLimit } = layoutConfig;
  const {
    size,
    segmentation: { regions },
    tempCanvas: canvas,
    boardSize,
    shapeCenter,
    shapeMaxR,
    shapeRatio
  } = segmentationOutput;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const boardOrigin = initBoardWithShape(segmentationOutput);
  let board = boardOrigin.slice(0);

  const fontFactor = layoutConfig.fontSizeShrinkFactor;

  // 同一个词如果降低到globalShinkLimit还没有布局成功，恢复到该词未布局状态
  let id = null;
  let idIntialFactor = 1;
  /* eslint-disable no-loop-func */
  let globalShinkFactor = 1;
  // 找到高优保障词weight，暂定10个
  const importantCount = importantWordCount;
  let weightStd = 0;
  if (words.length > importantCount) {
    const wordWeights = words.sort((word0, word1) => {
      return word1.weight - word0.weight;
    });
    weightStd = wordWeights[importantCount].weight;
  }

  // 对每个区域开始进行布局
  for (let k = 0; k < regions.length; k++) {
    const region = regions[k];
    const { words: regionWords, center, maxR, ratio } = region;
    let restartTag = false;
    for (let i = 0; i < regionWords.length; i++) {
      // 批量测量单词的 bounds
      measureSprite(canvas, ctx, words, i, layoutConfig.measureCache);
      const word = regionWords[i];
      word.x = center[0];
      word.y = center[1];

      if (!word.skip && word.hasText && word.sprite && place(board, word, maxR, ratio, size, boardSize, stepFactor)) {
        word.hasPlaced = true;
      } else if (!word.skip && word.weight > weightStd && globalShinkFactor > globalShinkLimit) {
        const wordId = word.datum[Symbol.for('vGrammar_id')];
        if (wordId !== id) {
          id = wordId;
          idIntialFactor = globalShinkFactor;
        }
        // 缩小字号
        globalShinkFactor = globalShinkFactor * fontFactor;
        words.forEach(word => {
          word.hasText = false;
          word.sprite = null;
          word.fontSize = word.fontSize * fontFactor; // 这里因为存在字号缩小-还原逻辑，因此不加最小字号限制
        });

        // 清空布局画布
        board = boardOrigin.slice(0);
        // console.log('重启布局', word.text, globalShinkFactor);
        restartTag = true;
        break;
      } else if (!word.skip && word.datum[Symbol.for('vGrammar_id')] === id) {
        words.forEach(word => {
          word.hasText = false;
          word.sprite = null;
          word.fontSize = word.fontSize / globalShinkFactor;
        });

        word.skip = true;
        globalShinkFactor = idIntialFactor;
        id = null;

        // 清空布局画布
        board = boardOrigin.slice(0);
        // console.log('重启布局0', word.text, idIntialFactor);
        restartTag = true;
        break;
      }
    }
    if (restartTag) {
      // 重新布局
      // k--;
      k = -1;
      continue;
    }
  }

  // 对于放置失败的单词，缩小文字大小, 以 shapeCenter 为中心进行布局
  // 最多尝试尝试3次，如果还是失败，则认为该单词不能放置
  for (let _ = 0; _ < layoutConfig.textLayoutTimes; _++) {
    const failedWords = words.filter(word => {
      if (!word.hasPlaced) {
        word.hasText = false;
        word.sprite = null;
        word.fontSize = Math.max(~~(word.fontSize * layoutConfig.fontSizeShrinkFactor), layoutConfig.minFontSize);
      }

      return !word.hasPlaced;
    });

    if (failedWords.length === 0) {
      break;
    }

    for (let i = 0; i < failedWords.length; i++) {
      const word = failedWords[i];
      measureSprite(canvas, ctx, failedWords, i, layoutConfig.measureCache);
      word.x = shapeCenter[0];
      word.y = shapeCenter[1];
      if (word.hasText && place(board, word, shapeMaxR, shapeRatio, size, boardSize, stepFactor)) {
        word.hasPlaced = true;
      }
    }
  }

  layoutConfig.board = board;
}

export function layoutSelfEnlarge(
  words: CloudWordType[],
  layoutConfig: LayoutConfigType,
  segmentationOutput: SegmentationOutputType
) {
  const { size, stepFactor, importantWordCount } = layoutConfig;
  const {
    segmentation: { regions },
    tempCanvas: canvas,
    boardSize,
    shapeCenter,
    shapeMaxR,
    shapeRatio
  } = segmentationOutput;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const boardOrigin = initBoardWithShape(segmentationOutput);
  let board = boardOrigin.slice(0);

  const fontFactor = layoutConfig.fontSizeEnlargeFactor;
  // const fontFactor = 1.5;

  // 找到高优保障词weight，暂定10个
  const importantCount = Math.min(importantWordCount, words.length);
  let weightStd = 0;
  if (words.length > importantCount) {
    const wordWeights = words.sort((word0, word1) => {
      return word1.weight - word0.weight;
    });
    weightStd = wordWeights[importantCount - 1].weight;
  }

  // 高优词布局成功数量
  let importantWordSuccessedNum = 0;
  // 目前放大系数
  let globalEnlargeFactor = 1;
  // 回退标志
  let layoutFinish = false;

  // 对每个区域开始进行布局
  for (let k = 0; k < regions.length; k++) {
    const region = regions[k];
    const { words: regionWords, center, maxR, ratio } = region;
    let restartTag = false;
    for (let i = 0; i < regionWords.length; i++) {
      // 批量测量单词的 bounds
      measureSprite(canvas, ctx, words, i, layoutConfig.measureCache);
      const word = regionWords[i];
      word.x = center[0];
      word.y = center[1];

      if (word.hasText && word.sprite && place(board, word, maxR, ratio, size, boardSize, stepFactor)) {
        word.hasPlaced = true;
        if (word.weight >= weightStd) {
          importantWordSuccessedNum++;
        }
        if (importantWordSuccessedNum >= importantCount && !layoutFinish) {
          // 重点词完全布局，尝试增大字号
          // 增大系数
          globalEnlargeFactor = globalEnlargeFactor * fontFactor;

          // 增大字号
          words.forEach(word => {
            word.hasText = false;
            word.sprite = null;
            word.fontSize = word.fontSize * fontFactor; // 这里因为存在字号缩小-还原逻辑，因此不加最小字号限制
          });

          // 清空布局画布
          board = boardOrigin.slice(0);
          // console.log('重启布局', word.text, globalEnlargeFactor);
          restartTag = true;
          importantWordSuccessedNum = 0;

          break;
        }
      } else if (word.weight >= weightStd && globalEnlargeFactor > 1) {
        // 之前重点词完全布局，此次重点词未完成布局，回退字号
        words.forEach(word => {
          word.hasText = false;
          word.sprite = null;
          word.fontSize = word.fontSize / fontFactor;
        });

        // 恢复系数
        globalEnlargeFactor = globalEnlargeFactor / fontFactor;
        layoutFinish = true;

        // 清空布局画布
        board = boardOrigin.slice(0);
        // console.log('重启布局0', word.text, globalEnlargeFactor);
        restartTag = true;

        break;
      } else if (word.weight >= weightStd) {
        // 初次未完成布局，使用ensureMapping算法
        // console.log('use layoutGlobalShrink')
        return layoutGlobalShrink(words, layoutConfig, segmentationOutput);
      }
    }
    if (restartTag) {
      // 重新布局
      // k--;
      k = -1;
      continue;
    }
  }

  // 对于放置失败的单词，缩小文字大小, 以 shapeCenter 为中心进行布局
  // 最多尝试尝试3次，如果还是失败，则认为该单词不能放置
  for (let _ = 0; _ < layoutConfig.textLayoutTimes; _++) {
    const failedWords = words.filter(word => {
      if (!word.hasPlaced) {
        word.hasText = false;
        word.sprite = null;
        word.fontSize = Math.max(~~(word.fontSize * layoutConfig.fontSizeShrinkFactor), layoutConfig.minFontSize);
      }

      return !word.hasPlaced;
    });

    if (failedWords.length === 0) {
      break;
    }

    for (let i = 0; i < failedWords.length; i++) {
      const word = failedWords[i];
      measureSprite(canvas, ctx, failedWords, i, layoutConfig.measureCache);
      word.x = shapeCenter[0];
      word.y = shapeCenter[1];
      if (word.hasText && place(board, word, shapeMaxR, shapeRatio, size, boardSize, stepFactor)) {
        word.hasPlaced = true;
      }
    }
  }

  layoutConfig.board = board;
}

/**
 * 使用螺旋线放置单词，成功返回 true
 */
function place(
  board: number[],
  word: CloudWordType,
  maxR: number,
  ratio: number,
  size: [number, number],
  boardSize: [number, number],
  stepFactor: number
) {
  const startX = word.x;
  const startY = word.y;
  const spiral = archimedeanSpiral(ratio);

  const dt = 1 * stepFactor;
  let dxdy;
  let dx;
  let dy;
  let t = -dt;

  while ((dxdy = spiral((t += dt)))) {
    const {
      wordSize,
      bounds: { dTop, dBottom, dLeft, dRight }
    } = word;
    dx = dxdy[0];
    dy = dxdy[1];

    // 判断螺旋线是否超出了最大的半径
    if (Math.min(Math.abs(dx), Math.abs(dy)) >= maxR) {
      break;
    }
    word.x = ~~(startX + dx);
    word.y = ~~(startY + dy);

    // 检测根据单词的 bounds 检测是否超出范围
    if (word.x - dLeft < 0 || word.x + dRight > size[0] || word.y - dTop < 0 || word.y + dBottom > size[1]) {
      continue;
    }

    if (!isCollideWithBoard(word, board, boardSize)) {
      placeWordOnBoard(word, board, boardSize);

      return true;
    }
  }
  return false;
}

/**
 * 在 board 中放置 word
 * 会在 filling 中复用
 */
export function placeWordOnBoard(word: CloudWordType, board: number[], boardSize: [number, number]) {
  const { wordSize } = word;
  // 放置单词，以 x, y 为中心
  const sprite = word.sprite;
  const w = wordSize[0] >> 5; // 单词占用的 int 的数量
  const sw = boardSize[0] >> 5; // board 的宽度
  const lx = word.x - (w << 4); // 单词的左边界
  const sx = lx % 32; // 单词偏移（px）, 当前元素右侧移除数量
  const msx = 32 - sx; // 需要从sprite上一个元素中移除的数量
  const h = wordSize[1];
  let x = (word.y - (wordSize[1] >> 1)) * sw + (lx >> 5); // 数组的起始位置
  let last;

  if (sx === 0) {
    // 恰好对齐，不需要偏移
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        board[x + i] |= sprite[j * w + i];
      }
      x += sw;
    }
  } else {
    for (let j = 0; j < h; j++) {
      last = 0;
      for (let i = 0; i <= w; i++) {
        board[x + i] |= (last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0);
      }
      x += sw;
    }
  }
}

/**
 * 检测 word 是否与 board 中的元素发生碰撞
 *
 * 会在 filling words 中复用
 */
export function isCollideWithBoard(word: CloudWordType, board: number[], boardSize: [number, number]) {
  const { sprite, wordSize } = word;

  const sw = boardSize[0] >> 5;
  const w = wordSize[0] >> 5;
  const lx = word.x - (w << 4); // 单词的左边界
  const sx = lx % 32; // sprite数组左侧偏移
  const msx = 32 - sx; // 位移遮罩
  const h = wordSize[1];
  let last;
  let x = (word.y - (wordSize[1] >> 1)) * sw + (lx >> 5); // 数组的起始位置

  // 逐行遍历单词sprite，判断与已绘制内容重叠
  if (sx === 0) {
    // 恰好对齐，不需要偏移
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        if (board[x + i] & sprite[j * w + i]) {
          return true;
        }
      }
      x += sw;
    }
  } else {
    for (let j = 0; j < h; j++) {
      last = 0;
      for (let i = 0; i <= w; i++) {
        if (((last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0)) & board[x + i]) {
          return true;
        }
      }
      x += sw;
    }
  }

  return false;
}

function archimedeanSpiral(ratio: number) {
  // t 为弧度值
  return function (t: number) {
    return [ratio * (t *= 0.1) * Math.cos(t), t * Math.sin(t)];
  };
}

/**
 * 测量一批单词的 sprite
 * 会在测量 filling words 时复用，修改时注意兼容性
 */
export function measureSprite(
  canvas: HTMLCanvasElement | any,
  ctx: CanvasRenderingContext2D | null,
  words: CloudWordType[] | any,
  wi: number,
  cache?: IWordMeasureCache
) {
  const targetWord = words[wi];
  if (targetWord.sprite || targetWord.fontSize === 0) {
    return;
  }

  if (cache) {
    const cached = cache.get(getWordMeasureKey(targetWord));
    if (cached) {
      targetWord.sprite = cached.sprite;
      targetWord.bounds = cached.bounds;
      targetWord.wordSize = cached.wordSize;
      targetWord.hasText = true;
      return;
    }
  }

  const cw = 2048;
  const ch = 2048;
  const radians = Math.PI / 180;
  const n = words.length;

  canvas.width = cw;
  canvas.height = ch;
  ctx.clearRect(0, 0, cw, ch);
  ctx.textAlign = 'center';

  let x = 0;
  let y = 0;
  let maxHeight = 0;
  let wordW; // 单词盒子 宽度
  let wordH;
  let yMax = 0; // 记录画布中绘制的 y 最大范围

  const wiDist = wi;
  --wi;
  while (++wi < n) {
    const word = words[wi];
    const fontSize = Math.max(word.fontSize, 2); // 最小字号2px
    ctx.save();
    ctx.font = word.fontStyle + ' ' + word.fontWeight + ' ' + fontSize + 'px ' + word.fontFamily;

    // 计算单词盒子宽高
    wordW = ctx.measureText(word.text + 'm').width + word.padding * 2;
    wordH = fontSize * 2 + word.padding * 2;

    if (word.rotate !== 0) {
      const sr = Math.sin(word.rotate * radians);
      const cr = Math.cos(word.rotate * radians);
      const wcr = wordW * cr;
      const wsr = wordW * sr;
      const hcr = wordH * cr;
      const hsr = wordH * sr;
      wordW = Math.max(Math.abs(wcr + hsr), Math.abs(wcr - hsr));
      wordH = ~~Math.max(Math.abs(wsr + hcr), Math.abs(wsr - hcr));
    }
    wordW = ((wordW + 31) >> 5) << 5; // 宽度必须是 32 的倍数
    wordH = Math.ceil(wordH);

    // 记录当前行最大高度
    if (wordH > maxHeight) {
      maxHeight = wordH;
    }

    // 如果当前行放不下，就另起一行，y方向向下移动当前行的最大高度
    if (x + wordW >= cw) {
      x = 0;
      y += maxHeight;
      maxHeight = wordH;
    }

    // 如果绘制不下，则停止
    if (y + wordH >= ch) {
      if (y === 0) {
        word.hasText = false;
        continue;
      } else {
        break;
      }
    }
    // 更新绘制范围 y 的最大值
    if (y + wordH >= yMax) {
      yMax = y + wordH;
    }

    ctx.translate(x + (wordW >> 1), y + (wordH >> 1));
    if (word.rotate !== 0) {
      ctx.rotate(word.rotate * radians);
    }
    ctx.fillText(word.text, 0, 0);
    if (word.padding) {
      ctx.lineWidth = 2 * word.padding;
      ctx.strokeText(word.text, 0, 0);
    }
    ctx.restore();

    // 词语绘制完成，记录其在画布上位置信息
    word.LT = [x, y]; // 左上角点
    word.wordSize = [wordW, wordH];

    // 指示在临时画布上绘制过了单词
    word.hasText = true;

    // x位置右移，等待下一个词语绘制
    x += wordW;
  }

  if (yMax === 0) {
    return;
  }
  const pixels = ctx.getImageData(0, 0, cw, yMax).data;

  let i;
  let j;

  // 提取画布上的 sprite 信息
  while (--wi >= wiDist) {
    const word = words[wi];
    if (!word.hasText) {
      word.bounds = {
        dTop: Infinity,
        dBottom: -Infinity,
        dLeft: Infinity,
        dRight: -Infinity
      };
      break;
    }

    const { LT = [0, 0], wordSize } = word;
    [x, y] = LT;
    const w32 = wordSize[0] >> 5;
    // 将数组归0
    const sprite = new Array(w32 * wordSize[1]).fill(0);

    // 先记录单词 bounds 的行列号，然后转换成与中心的delta
    let [dTop, dBottom, dLeft, dRight] = [Infinity, -Infinity, Infinity, -Infinity];

    for (j = 0; j < wordSize[1]; j++) {
      let seen: any;
      for (i = 0; i < wordSize[0]; i++) {
        // 取 alpha 通道的值，
        if (pixels[((y + j) * cw + (x + i)) * 4 + 3] > 0) {
          const k = w32 * j + (i >> 5);
          const m = 1 << (31 - (i % 32));
          sprite[k] |= m;

          if (i < dLeft) {
            dLeft = i;
          }
          if (i > dRight) {
            dRight = i;
          }
          seen |= m;
        }
      }
      if (seen) {
        if (j < dTop) {
          dTop = j;
        }
        if (j > dBottom) {
          dBottom = j;
        }
      }
    }

    // 记录单词准确的的 bounds
    word.bounds = {
      dTop: (wordSize[1] >> 1) - dTop,
      dBottom: dBottom - (wordSize[1] >> 1),
      dLeft: (wordSize[0] >> 1) - dLeft,
      dRight: dRight - (wordSize[0] >> 1)
    };
    word.sprite = sprite;

    if (cache) {
      const key = getWordMeasureKey(word);
      cache.set(key, {
        sprite,
        bounds: word.bounds,
        wordSize
      });
    }

    // 后续操作中 LT 无意义
    delete word.LT;
  }

  // debug 代码
  // words.forEach((word) => {
  //   const {
  //     LT,
  //     wordSize,
  //     hasText,
  //     sprite,
  //     bounds: { dTop, dBottom, dLeft, dRight },
  //   } = word
  //   if (hasText) {
  //     paint(sprite, wordSize)
  //     // 绘制用于 debug 的
  //     ctx.save()
  //     ctx.strokeStyle = '#f00'
  //     ctx.fillStyle = '#0f0'
  //     // 绘制 word 包围盒
  //     ctx.strokeRect(...LT, ...wordSize)
  //     ctx.translate(LT[0] + wordSize[0] / 2, LT[1] + wordSize[1] / 2)
  //     ctx.strokeStyle = '#00f'
  //     // 绘制bounds
  //     ctx.strokeRect(-dLeft, -dTop, dLeft + dRight, dTop + dBottom)
  //     // 绘制中心点
  //     ctx.fillRect(0, 0, 3, 3)
  //     ctx.restore()
  //   }
  // })

  // document.body.prepend(canvas)
}

function getWordMeasureKey(word: CloudWordType | any) {
  return (
    String(word.text) +
    '|' +
    String(word.fontFamily) +
    '|' +
    String(word.fontStyle) +
    '|' +
    String(word.fontWeight) +
    '|' +
    String(word.fontSize) +
    '|' +
    String(word.rotate) +
    '|' +
    String(word.padding)
  );
}

/**
 *  根据 shape 相关的信息初始化 board
 */
function initBoardWithShape(segmentationOutput: SegmentationOutputType) {
  const {
    segmentation: { labels },
    boardSize,
    size
  } = segmentationOutput;
  // board 每个 int 编码 32 个像素的占用信息，求得 w32 表示一行有几个 int
  const w32 = boardSize[0] >> 5;
  const board = new Array(w32 * size[1]).fill(0);

  for (let i = 0; i < size[1]; i++) {
    for (let j = 0; j < size[0]; j++) {
      const label = labels[i * size[0] + j];
      if (label === 0) {
        // 取得 board 中对应 int 的索引
        const k = w32 * i + (j >> 5);
        // 构造代表该像素被占用的 int
        const m = 1 << (31 - (j % 32));
        board[k] |= m;
      }
    }
  }

  // 对 boardSize 和 size 进行比较，如果 boardSize 大于 size，则将差距的部分设置为不可放置
  if (boardSize[0] > size[0]) {
    const width = boardSize[0] - size[0];
    const m = (1 << width) - 1;
    for (let y = 0; y < size[1]; y++) {
      const k = w32 * y + w32 - 1;
      board[k] |= m;
    }
  }

  return board;
}
