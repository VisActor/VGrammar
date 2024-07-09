import { type IProgressiveTransformResult } from '@visactor/vgrammar-core';

/*!
 * wordcloud2.js
 * http://timdream.org/wordcloud2.js/
 *
 * Copyright 2011 - 2019 Tim Guan-tin Chien and contributors.
 * Released under the MIT license
 */

import type { IBaseLayoutOptions } from './interface';
import { isObject, merge, shuffleArray } from '@visactor/vutils';
import { BaseLayout } from './base';
import type { CanvasMaskShape } from '@visactor/vgrammar-util';
import { generateIsEmptyPixel, generateMaskCanvas, getMaxRadiusAndCenter } from '@visactor/vgrammar-util';

interface IGridLayoutOptions extends IBaseLayoutOptions {
  gridSize?: number;

  ellipticity?: number;
}

interface TextInfo {
  datum: any;
  /** Read the pixels and save the information to the occupied array */
  occupied: [number, number][];
  bounds: [number, number, number, number];
  gw: number;
  gh: number;
  fillTextOffsetX: number;
  fillTextOffsetY: number;
  fillTextWidth: number;
  fillTextHeight: number;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  fontFamily: string;
  angle: number;
  text: string;
  distance?: number;
  theta?: number;
}

export class GridLayout extends BaseLayout<IGridLayoutOptions> implements IProgressiveTransformResult {
  static defaultOptions: Partial<IGridLayoutOptions> = {
    gridSize: 8,
    ellipticity: 1,
    maxSingleWordTryCount: 1
  };

  private gridSize: number;

  /* ================== runtime vars ================== */
  private center: [number, number];
  private pointsAtRadius: [number, number, number][][];
  private ngx: number;
  private ngy: number;
  private grid: boolean[][];
  private maxRadius: number;

  constructor(options: IGridLayoutOptions) {
    super(merge({}, GridLayout.defaultOptions, options));

    this.gridSize = Math.max(Math.floor(this.options.gridSize), 4);
  }

  private getPointsAtRadius(radius: number) {
    if (this.pointsAtRadius[radius]) {
      return this.pointsAtRadius[radius];
    }

    // Look for these number of points on each radius
    const T = radius * 8;

    // Getting all the points at this radius
    let t = T;
    const points: [number, number, number][] = [];

    if (radius === 0) {
      points.push([this.center[0], this.center[1], 0]);
    }

    while (t--) {
      // distort the radius to put the cloud in shape
      const rx = this.shape((t / T) * 2 * Math.PI); // 0 to 1

      // Push [x, y, t] t is used solely for getTextColor()
      points.push([
        this.center[0] + radius * rx * Math.cos((-t / T) * 2 * Math.PI),
        this.center[1] + radius * rx * Math.sin((-t / T) * 2 * Math.PI) * this.options.ellipticity,
        (t / T) * 2 * Math.PI
      ]);
    }

    this.pointsAtRadius[radius] = points;
    return points;
  }

  private getTextInfo(item: any, shrinkRatio: number = 1, index: number): TextInfo {
    // calculate the acutal font size
    // fontSize === 0 means weightFactor function wants the text skipped,
    // and size < minSize means we cannot draw the text.
    const sizeShrinkRatio = this.options.clip ? 1 : shrinkRatio;

    const fontSize = Math.max(
      Math.floor((this.isTryRepeatFill ? this.options.fillTextFontSize : this.getTextFontSize(item)) * sizeShrinkRatio),
      this.options.minFontSize
    );
    let word = this.getText(item) + '';

    if (this.options.clip) {
      word = word.slice(0, Math.ceil(word.length * shrinkRatio));
    }

    if (!word) {
      return null;
    }

    // Get fontWeight that will be used to set fctx.font
    const fontWeight = this.getTextFontWeight(item);
    const fontStyle = this.getTextFontStyle(item);
    const angle = this.getTextRotate ? this.getTextRotate(item, index) ?? 0 : 0;
    const fontFamily = this.getTextFontFamily(item);

    // eslint-disable-next-line no-undef
    const fcanvas = document.createElement('canvas');
    const fctx = fcanvas.getContext('2d', { willReadFrequently: true });

    fctx.font = fontStyle + ' ' + fontWeight + ' ' + fontSize.toString(10) + 'px ' + fontFamily;

    // Estimate the dimension of the text with measureText().
    const fw = fctx.measureText(word).width;
    const fh = Math.max(fontSize, fctx.measureText('m').width, fctx.measureText('\uFF37').width);

    // Create a boundary box that is larger than our estimates,
    // so text don't get cut of (it sill might)
    let boxWidth = fw + fh * 2;
    let boxHeight = fh * 3;
    const fgw = Math.ceil(boxWidth / this.gridSize);
    const fgh = Math.ceil(boxHeight / this.gridSize);
    boxWidth = fgw * this.gridSize;
    boxHeight = fgh * this.gridSize;

    // Calculate the proper offsets to make the text centered at
    // the preferred position.

    // This is simply half of the width.
    const fillTextOffsetX = -fw / 2;
    // Instead of moving the box to the exact middle of the preferred
    // position, for Y-offset we move 0.4 instead, so Latin alphabets look
    // vertical centered.
    const fillTextOffsetY = -fh * 0.4;

    // Calculate the actual dimension of the canvas, considering the rotation.
    const cgh = Math.ceil(
      (boxWidth * Math.abs(Math.sin(angle)) + boxHeight * Math.abs(Math.cos(angle))) / this.gridSize
    );
    const cgw = Math.ceil(
      (boxWidth * Math.abs(Math.cos(angle)) + boxHeight * Math.abs(Math.sin(angle))) / this.gridSize
    );
    const width = cgw * this.gridSize;
    const height = cgh * this.gridSize;

    fcanvas.setAttribute('width', '' + width);
    fcanvas.setAttribute('height', '' + height);

    // Scale the canvas with |mu|.
    fctx.scale(1, 1);
    fctx.translate(width / 2, height / 2);
    fctx.rotate(-angle);

    // Once the width/height is set, ctx info will be reset.
    // Set it again here.
    fctx.font = fontStyle + ' ' + fontWeight + ' ' + fontSize.toString(10) + 'px ' + fontFamily;

    // Fill the text into the fcanvas.
    // XXX: We cannot because textBaseline = 'top' here because
    // Firefox and Chrome uses different default line-height for canvas.
    // Please read https://bugzil.la/737852#c6.
    // Here, we use textBaseline = 'middle' and draw the text at exactly
    // 0.5 * fontSize lower.
    fctx.fillStyle = '#000';
    fctx.textBaseline = 'middle';
    fctx.fillText(word, fillTextOffsetX, fillTextOffsetY);

    // Get the pixels of the text
    const imageData = fctx.getImageData(0, 0, width, height).data;

    if (this.exceedTime()) {
      return null;
    }

    // Read the pixels and save the information to the occupied array
    const occupied: [number, number][] = [];
    let gx = cgw;
    let gy;
    const bounds: [number, number, number, number] = [cgh / 2, cgw / 2, cgh / 2, cgw / 2];

    const singleGridLoop = (gx: number, gy: number, out: [number, number][]) => {
      let y = this.gridSize;
      while (y--) {
        let x = this.gridSize;
        while (x--) {
          if (imageData[((gy * this.gridSize + y) * width + (gx * this.gridSize + x)) * 4 + 3]) {
            out.push([gx, gy]);

            if (gx < bounds[3]) {
              bounds[3] = gx;
            }
            if (gx > bounds[1]) {
              bounds[1] = gx;
            }
            if (gy < bounds[0]) {
              bounds[0] = gy;
            }
            if (gy > bounds[2]) {
              bounds[2] = gy;
            }

            return;
          }
        }
      }
    };
    while (gx--) {
      gy = cgh;
      while (gy--) {
        singleGridLoop(gx, gy, occupied);
      }
    }

    // Return information needed to create the text on the real canvas
    return {
      datum: item,
      occupied: occupied,
      bounds: bounds,
      gw: cgw,
      gh: cgh,
      fillTextOffsetX: fillTextOffsetX,
      fillTextOffsetY: fillTextOffsetY,
      fillTextWidth: fw,
      fillTextHeight: fh,
      fontSize,
      fontStyle,
      fontWeight,
      fontFamily,
      angle,
      text: word
    };
  }

  private calculateEmptyRate() {
    const totalCount = this.ngx * this.ngy;
    let emptyCount = 0;

    for (let gx = 0; gx < this.ngx; gx++) {
      for (let gy = 0; gy < this.ngy; gy++) {
        if (this.grid[gx][gy]) {
          emptyCount++;
        }
      }
    }
    return emptyCount / totalCount;
  }

  /* Help function to updateGrid */
  private fillGridAt = (x: number, y: number) => {
    if (x >= this.ngx || y >= this.ngy || x < 0 || y < 0) {
      return;
    }

    this.grid[x][y] = false;
  };

  /* Update the filling information of the given space with occupied points.
         Draw the mask on the canvas if necessary. */
  private updateGrid = (gx: number, gy: number, gw: number, gh: number, info: TextInfo) => {
    const occupied = info.occupied;

    let i = occupied.length;
    while (i--) {
      const px = gx + occupied[i][0];
      const py = gy + occupied[i][1];

      if (px >= this.ngx || py >= this.ngy || px < 0 || py < 0) {
        continue;
      }

      this.fillGridAt(px, py);
    }
  };

  /* Determine if there is room available in the given dimension */
  private canFitText(gx: number, gy: number, gw: number, gh: number, occupied: number[][]) {
    // Go through the occupied points,
    // return false if the space is not available.
    let i = occupied.length;
    while (i--) {
      const px = gx + occupied[i][0];
      const py = gy + occupied[i][1];

      if (px >= this.ngx || py >= this.ngy || px < 0 || py < 0) {
        if (!this.options.drawOutOfBound) {
          return false;
        }
        continue;
      }

      if (!this.grid[px][py]) {
        return false;
      }
    }
    return true;
  }

  /* putWord() processes each item on the list,
         calculate it's size and determine it's position, and actually
         put it on the canvas. */
  layoutWord(index: number, shrinkRatio: number = 1): boolean {
    // get info needed to put the text onto the canvas
    const item = this.data[index];
    const info = this.getTextInfo(item, shrinkRatio, index);

    // not getting the info means we shouldn't be drawing this one.
    if (!info) {
      return false;
    }

    if (this.exceedTime()) {
      return false;
    }

    // If drawOutOfBound is set to false,
    // skip the loop if we have already know the bounding box of
    // word is larger than the canvas.
    if (
      !this.options.drawOutOfBound &&
      (!this.options.shrink || info.fontSize <= this.options.minFontSize) &&
      !this.options.clip
    ) {
      const bounds = info.bounds;
      if (bounds[1] - bounds[3] + 1 > this.ngx || bounds[2] - bounds[0] + 1 > this.ngy) {
        return false;
      }
    }

    // Determine the position to put the text by
    // start looking for the nearest points
    let r = this.maxRadius + 1;

    const tryToPutWordAtPoint = (gxy: [number, number, number]) => {
      const gx = Math.floor(gxy[0] - info.gw / 2);
      const gy = Math.floor(gxy[1] - info.gh / 2);
      const gw = info.gw;
      const gh = info.gh;

      // If we cannot fit the text at this position, return false
      // and go to the next position.
      if (!this.canFitText(gx, gy, gw, gh, info.occupied)) {
        return false;
      }

      info.distance = this.maxRadius - r;
      info.theta = gxy[2];

      // Actually put the text on the canvas
      this.outputText(gx, gy, info);

      // Mark the spaces on the grid as filled
      this.updateGrid(gx, gy, gw, gh, info);

      // Return true so some() will stop and also return true.
      return true;
    };

    while (r--) {
      let points = this.getPointsAtRadius(this.maxRadius - r);

      if (this.options.random) {
        points = [].concat(points);
        shuffleArray(points);
      }

      // Try to fit the words by looking at each point.
      // array.some() will stop and return true
      // when putWordAtPoint() returns true.
      // If all the points returns false, array.some() returns false.
      const drawn = points.some(tryToPutWordAtPoint);

      if (drawn) {
        // leave putWord() and return true
        return true;
      }
    }
    if (this.options.clip) {
      return this.layoutWord(index, shrinkRatio * 0.75);
    } else if (this.options.shrink && info.fontSize > this.options.minFontSize) {
      return this.layoutWord(index, shrinkRatio * 0.75);
    }
    // we tried all distances but text won't fit, return false
    return false;
  }

  private outputText(gx: number, gy: number, info: TextInfo) {
    const color = this.getTextColor(info);
    const output = {
      text: info.text,
      datum: info.datum,
      color,
      fontStyle: info.fontStyle,
      fontWeight: info.fontWeight,
      fontFamily: info.fontFamily,
      angle: info.angle,
      width: info.fillTextWidth,
      height: info.fillTextHeight,
      x: (gx + info.gw / 2) * this.gridSize,
      y: (gy + info.gh / 2) * this.gridSize + info.fillTextOffsetY + info.fontSize * 0.5,
      fontSize: info.fontSize
    };

    this.result.push(output);

    if (this.progressiveResult) {
      this.progressiveResult.push(output);
    }
  }

  private initGrid(config: { width: number; height: number }) {
    /* Clear the canvas only if the clearCanvas is set,
         if not, update the grid to the current canvas state */
    this.grid = [];
    const shape = this.options.shape;

    if (isObject(shape)) {
      const canvas = generateMaskCanvas(shape as CanvasMaskShape, config.width, config.height);
      /* Read back the pixels of the canvas we got to tell which part of the
      canvas is empty.
      (no clearCanvas only works with a canvas, not divs) */
      let imageData = canvas.getContext('2d').getImageData(0, 0, this.ngx * this.gridSize, this.ngy * this.gridSize);

      if (this.options.onUpdateMaskCanvas) {
        this.options.onUpdateMaskCanvas(canvas);
      }

      let isEmptyPixel = generateIsEmptyPixel((shape as CanvasMaskShape).backgroundColor);
      let i;
      const singleGridLoop = (gx: number, gy: number) => {
        let y = this.gridSize;
        while (y--) {
          let x = this.gridSize;
          while (x--) {
            i = 4;

            if (!isEmptyPixel(imageData, gy * this.gridSize + y, gx * this.gridSize + x)) {
              this.grid[gx][gy] = true;
              return;
            }
          }
        }
        this.grid[gx][gy] = false;
      };

      let gx = this.ngx;
      while (gx--) {
        this.grid[gx] = [];
        let gy = this.ngy;
        while (gy--) {
          /* eslint no-labels: ["error", { "allowLoop": true }] */
          singleGridLoop(gx, gy);
          if (this.grid[gx][gy] !== false) {
            this.grid[gx][gy] = true;
          }
        }
      }

      imageData = isEmptyPixel = undefined;
    } else {
      /* fill the grid with empty state */
      let gx = this.ngx;
      while (gx--) {
        this.grid[gx] = [];
        let gy = this.ngy;
        while (gy--) {
          this.grid[gx][gy] = true;
        }
      }
    }
  }

  canRepeat() {
    return this.calculateEmptyRate() > 1e-3;
  }

  layout(data: any[], config: { width: number; height: number; origin?: [number, number] }) {
    this.initProgressive();
    this.drawnCount = 0;
    this.isTryRepeatFill = false;
    this.originalData = data;
    this.data = data;
    this.pointsAtRadius = [];
    this.ngx = Math.floor(config.width / this.gridSize);
    this.ngy = Math.floor(config.height / this.gridSize);
    const { center, maxRadius } = getMaxRadiusAndCenter(this.options.shape as string, [config.width, config.height]);

    // Determine the center of the word cloud
    this.center = config.origin
      ? [config.origin[0] / this.gridSize, config.origin[1] / this.gridSize]
      : [center[0] / this.gridSize, center[1] / this.gridSize];

    // Maxium radius to look for space
    this.maxRadius = Math.floor(maxRadius / this.gridSize);

    this.initGrid(config);
    this.result = [];

    return this.progressiveRun();
  }
}
