import type {
  LegendBaseAttributes,
  SliderAttributes,
  DataZoomAttributes,
  BaseLabelAttrs,
  PlayerAttributes,
  OrientType
} from '@visactor/vrender-components';
import type { ILogger } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { Logger, array, isArray, isBoolean, isNil, isPlainObject, merge } from '@visactor/vutils';
import { isContinuous, type IBaseScale, isDiscrete } from '@visactor/vscale';
import type {
  ISemanticMark,
  ISemanticMarkSpec,
  ParsedSimpleEncode,
  WithDefaultEncode,
  SemanticTooltipOption,
  SemanticAxisOption,
  SemanticPlayerOption,
  SemanticLabelOption,
  SemanticDataZoomOption,
  SemanticSliderOption,
  SemanticLegendOption,
  SemanticCrosshairOption,
  CoordinateOption,
  PolarCoordinateOption,
  AxisSpec,
  CrosshairSpec,
  DatazoomSpec,
  LabelSpec,
  LegendSpec,
  PlayerSpec,
  SliderSpec,
  TooltipSpec,
  CoordinateSpec,
  DataSpec,
  ChannelEncodeType,
  ScaleSpec,
  TransformSpec,
  MarkAnimationSpec,
  ViewSpec,
  MarkType,
  Nil,
  ValueOf,
  GenerateBaseEncodeSpec,
  IElement,
  IAnimationConfig,
  MarkSpec,
  MarkRelativeItemSpec,
  IPlot,
  SemanticTooltipContentItem,
  SemanticGridOption,
  GridSpec,
  TitleSpec,
  SemanticTitleOption,
  InteractionSpec,
  LegendFilterSpec,
  SliderFilterSpec,
  DatazoomFilterSpec,
  PlayerFilterSpec,
  DimensionTooltipSpec
} from '@visactor/vgrammar-core';
// eslint-disable-next-line no-duplicate-imports
import { ComponentEnum, SIGNAL_VIEW_BOX, BuiltInEncodeNames, ThemeManager, Factory } from '@visactor/vgrammar-core';
import { field as getFieldAccessor, toPercent } from '@visactor/vgrammar-util';
import type { IBaseCoordinate } from '@visactor/vgrammar-coordinate';
import type { ITextAttribute } from '@visactor/vrender-core';

let semanticMarkId = -1;

export abstract class SemanticMark<EncodeSpec, K extends string> implements ISemanticMark<EncodeSpec, K> {
  //declare type: T;
  spec: ISemanticMarkSpec<EncodeSpec, K>;
  viewSpec?: ViewSpec;

  readonly uid: number;
  protected _logger: ILogger;
  protected _coordinate: CoordinateOption;
  readonly type: string;
  readonly plot: IPlot;

  constructor(type: string, id?: string | number, plot?: IPlot) {
    this.type = type;
    this.uid = ++semanticMarkId;
    this._logger = Logger.getInstance();
    this.plot = plot;

    this.spec = { id: id ?? `${this.type}-${this.uid}` };
  }

  parseSpec(spec: Partial<ISemanticMarkSpec<EncodeSpec, K>>) {
    if (isNil(spec.id)) {
      spec.id = this.spec.id;
    }
    this.spec = spec as ISemanticMarkSpec<EncodeSpec, K>;
    return this;
  }

  coordinate(option: CoordinateOption) {
    this._coordinate = option;
    return this;
  }

  data(values: any, transform?: TransformSpec[], id?: string) {
    if (isNil(values)) {
      return this;
    }

    this.spec.data = { values, transform, id };
    return this;
  }

  encode(channel: K, option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>) {
    if (!this.spec.encode) {
      this.spec.encode = {};
    }
    this.spec.encode[channel] = option;

    return this;
  }
  scale(channel: string, option: Partial<ScaleSpec>) {
    if (!this.spec.scale) {
      this.spec.scale = {};
    }

    this.spec.scale[channel] = option;
    return this;
  }
  style(style: Partial<EncodeSpec & any>) {
    this.spec.style = style;
    return this;
  }
  transform(option: TransformSpec | TransformSpec[]) {
    this.spec.transform = array(option) as TransformSpec[];

    return this;
  }
  state(state: string, option: Partial<EncodeSpec>) {
    if (
      (
        [
          BuiltInEncodeNames.enter,
          BuiltInEncodeNames.update,
          BuiltInEncodeNames.exit,
          BuiltInEncodeNames.group
        ] as string[]
      ).includes(state)
    ) {
      this._logger.warn(
        `[VGrammar]: ${state} is a reserved keyword to specify the encode of different data state, 
        don't use this keyword`
      );

      return;
    }

    if (!this.spec.state) {
      this.spec.state = {};
    }
    this.spec.state[state] = option;
    return this;
  }
  animate(state: string, option: IAnimationConfig | IAnimationConfig[]) {
    if (state === 'state') {
      this._logger.warn(
        `[VGrammar]: ${state} is a keyword use to specify state animation config, don't use this keyword`
      );

      return this;
    }

    if (!this.spec.animation) {
      this.spec.animation = {};
    }

    this.spec.animation[state] = option;

    return this;
  }
  axis(channel: string, option: SemanticAxisOption | boolean = true, layout?: MarkRelativeItemSpec) {
    if (!Factory.hasComponent('axis')) {
      this._logger.error(
        `Please add this line of code: import { registerAxis } from '@visactor/vgrammar-core'; 
        and run "registerAxis();" or "View.useRegisters([registerAxis]);" `
      );

      return this;
    }

    if (!this.spec.axis) {
      this.spec.axis = {};
    }
    this.spec.axis[channel] = { option, layout };

    return this;
  }

  grid(channel: string, option: SemanticGridOption | boolean = true) {
    if (!Factory.hasComponent('grid')) {
      this._logger.error(
        `Please add this line of code: import { registerGrid } from '@visactor/vgrammar-core'; 
        and run "registerGrid();" or "View.useRegisters([registerGrid]);" `
      );

      return this;
    }

    if (!this.spec.grid) {
      this.spec.grid = {};
    }
    this.spec.grid[channel] = option;

    return this;
  }

  legend(channel: string, option: SemanticLegendOption | boolean = true, layout?: MarkRelativeItemSpec) {
    if (!Factory.hasComponent('legend')) {
      this._logger.error(
        `Please add this line of code: import { registerLegend } from '@visactor/vgrammar-core'; 
        and run "registerLegend();" or "View.useRegisters([registerLegend]);" `
      );

      return this;
    }

    if (!this.spec.legend) {
      this.spec.legend = {};
    }

    this.spec.legend[channel] = { option, layout };

    return this;
  }
  crosshair(channel: string, option?: SemanticCrosshairOption | boolean) {
    if (!Factory.hasComponent('crosshair')) {
      this._logger.error(
        `Please add this line of code: import { registerCrosshair } from '@visactor/vgrammar-core'; 
        and run "registerCrosshair();" or "View.useRegisters([registerCrosshair]);" `
      );

      return this;
    }

    if (!this.spec.crosshair) {
      this.spec.crosshair = {};
    }

    this.spec.crosshair[channel] = option;

    return this;
  }
  tooltip(option: SemanticTooltipOption | boolean) {
    if (!Factory.hasComponent('tooltip')) {
      this._logger.error(
        `Please add this line of code: import { registerTooltip } from '@visactor/vgrammar-core'; 
        and run "registerTooltip();" or "View.useRegisters([registerTooltip]);" `
      );

      return this;
    }

    this.spec.tooltip = option;

    return this;
  }

  slider(channel: string, option?: SemanticSliderOption | boolean, layout?: MarkRelativeItemSpec) {
    if (!Factory.hasComponent('slider')) {
      this._logger.error(
        `Please add this line of code: import { registerSlider } from '@visactor/vgrammar-core'; 
        and run "registerSlider();" or "View.useRegisters([registerSlider]);" `
      );

      return this;
    }

    if (!this.spec.slider) {
      this.spec.slider = {};
    }

    this.spec.slider[channel] = { option, layout };

    return this;
  }
  datazoom(channel: string, option?: SemanticDataZoomOption | boolean, layout?: MarkRelativeItemSpec) {
    if (!Factory.hasComponent('datazoom')) {
      this._logger.error(
        `Please add this line of code: import { registerDataZoom } from '@visactor/vgrammar-core'; 
        and run "registerDataZoom();" or "View.useRegisters([registerDataZoom]);" `
      );

      return this;
    }

    if (!this.spec.datazoom) {
      this.spec.datazoom = {};
    }

    this.spec.datazoom[channel] = { option, layout };

    return this;
  }
  label(channel: string, option?: SemanticLabelOption | boolean) {
    if (!Factory.hasComponent('label')) {
      this._logger.error(
        `Please add this line of code: import { registerLabel } from '@visactor/vgrammar-core'; 
        and run "registerLabel();" or "View.useRegisters([registerLabel]);" `
      );

      return this;
    }

    if (!this.spec.label) {
      this.spec.label = {};
    }

    this.spec.label[channel] = option;

    return this;
  }
  player(data?: any[], option?: SemanticPlayerOption | boolean, layout?: MarkRelativeItemSpec) {
    if (!Factory.hasComponent('player')) {
      this._logger.error(
        `Please add this line of code: import { registerPlayer } from '@visactor/vgrammar-core'; 
        and run "registerPlayer();" or "View.useRegisters([registerPlayer]);" `
      );

      return this;
    }

    this.spec.player = { data, option, layout };

    return this;
  }

  title(option: SemanticTitleOption, layout?: MarkRelativeItemSpec) {
    if (!Factory.hasComponent('title')) {
      this._logger.error(
        `Please add this line of code: import { registerTitle } from '@visactor/vgrammar-core'; 
        and run "registerTitle();" or "View.useRegisters([registerTitle]);" `
      );

      return this;
    }

    this.spec.title = { option, layout };

    return this;
  }

  protected getPalette() {
    return (this.plot ? this.plot.view.getCurrentTheme() : ThemeManager.getDefaultTheme()).palette?.default;
  }

  abstract setMarkType(): MarkType;
  abstract parseScaleByEncode(channel: K, option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>): ScaleSpec | Nil;
  abstract convertMarkEncode(encode: WithDefaultEncode<EncodeSpec, K>): GenerateBaseEncodeSpec<EncodeSpec>;

  protected setDefaultDataTransform(): TransformSpec[] {
    return [];
  }

  protected setMultipleData(): DataSpec[] {
    return null;
  }

  protected setDefaultMarkTransform(): TransformSpec[] {
    return [];
  }

  protected convertMarkTransform(userTransform: TransformSpec[], defaultTransform: TransformSpec[] = []) {
    if (defaultTransform && defaultTransform.length) {
      if (userTransform && userTransform.length) {
        let transforms = [];
        const excludeIndex = [];

        for (let i = 0, len = userTransform.length; i < len; i++) {
          const customizedSpec = userTransform[i];
          const index = defaultTransform.findIndex(entry => entry.type === customizedSpec.type);

          if (index >= 0) {
            transforms.push(merge({}, defaultTransform[index], customizedSpec));
            excludeIndex.push(index);
          } else {
            transforms.push(customizedSpec);
          }
        }

        for (let j = 0, dlen = defaultTransform.length; j < dlen; j++) {
          if (!excludeIndex.includes(j)) {
            transforms = [defaultTransform[j]].concat(transforms);
          }
        }

        return transforms;
      }

      return defaultTransform;
    }

    return userTransform;
  }

  protected convertMarkAnimation(): MarkAnimationSpec {
    if (!this.spec.animation) {
      return null;
    }

    return this.spec.animation;
  }

  protected convertSimpleMarkEncode(encode: WithDefaultEncode<EncodeSpec, K>): ParsedSimpleEncode<EncodeSpec, K> {
    if (!encode) {
      return {};
    }

    const markEncoder = {};

    Object.keys(encode).map(channel => {
      markEncoder[channel] = { field: encode[channel], scale: this.getScaleId(channel), band: 0.5 };
    });

    return markEncoder;
  }

  protected getDataIdOfFiltered() {
    return `${this.spec.data?.id ?? this.spec.id}-data-filtered`;
  }

  protected getDataIdOfMain() {
    return `${this.spec.data?.id ?? this.spec.id}-data`;
  }

  protected getDataIdOfPlayer() {
    return `${this.spec.data?.id ?? this.spec.id}-player`;
  }

  protected getDataZoomScaleId(channel: string) {
    return {
      x: `datazoom-scale-${channel}-x`,
      y: `datazoom-scale-${channel}-y`
    };
  }

  protected getScaleId(channel: string) {
    return this.spec.scale?.[channel]?.id ?? `scale-${channel}`;
  }

  protected getMarkId() {
    return `${this.spec.id}-mark`;
  }

  protected getComponentId(id: string, component?: string) {
    return `${this.spec.id}-${component ?? 'component'}-${id}`;
  }

  protected getScaleSpec(scaleId: string) {
    return this.viewSpec?.scales?.find?.(scale => scale.id === scaleId);
  }

  protected parseScaleOfEncodeX(option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>): ScaleSpec | Nil {
    return {
      type: 'band',
      id: this.getScaleId('x'),
      dependency: [SIGNAL_VIEW_BOX],
      domain: {
        data: this.getDataIdOfFiltered(),
        field: option as string
      },
      range: this._coordinate
        ? { coordinate: this._coordinate.id, dimension: 'x' }
        : (scale: IBaseScale, params: any) => {
            return [0, params.viewBox.width()];
          }
    };
  }

  protected parseScaleOfEncodeY(option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>): ScaleSpec | Nil {
    return {
      type: 'linear',
      dependency: [SIGNAL_VIEW_BOX],
      id: this.getScaleId('y'),
      domain: {
        data: this.getDataIdOfFiltered(),
        field: option as string
      },
      range: this._coordinate
        ? { coordinate: this._coordinate.id, dimension: 'y' }
        : (scale: IBaseScale, params: any) => {
            return [params.viewBox.height(), 0];
          }
    };
  }

  protected parseScaleOfEncodeColor(option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>): ScaleSpec | Nil {
    return {
      type: 'ordinal',
      id: this.getScaleId('color'),
      domain: {
        data: this.getDataIdOfMain(),
        field: option as string
      },
      range: this.getPalette()
    };
  }

  protected parseScaleOfEncodeStroke(option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>): ScaleSpec | Nil {
    return {
      type: 'ordinal',
      id: this.getScaleId('stroke'),
      domain: {
        data: this.getDataIdOfMain(),
        field: option as string
      },
      range: this.getPalette()
    };
  }

  protected parseScaleOfEncodeGroup(option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>): ScaleSpec | Nil {
    return {
      type: 'ordinal',
      id: this.getScaleId('group'),
      domain: {
        data: this.getDataIdOfMain(),
        field: option as string
      },
      range: this.getPalette()
    };
  }

  protected parseScaleOfCommonEncode(
    channel: K,
    option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>
  ): ScaleSpec | Nil {
    if (channel === 'x') {
      return this.parseScaleOfEncodeX(option);
    }

    if (channel === 'y') {
      return this.parseScaleOfEncodeY(option);
    }

    if (channel === 'color') {
      return this.parseScaleOfEncodeColor(option);
    }

    if (channel === 'group') {
      return this.parseScaleOfEncodeGroup(option);
    }

    if (channel === 'stroke') {
      return this.parseScaleOfEncodeStroke(option);
    }

    return null;
  }

  protected setDefaultAxis(): Record<string, Partial<AxisSpec>> {
    return {};
  }

  protected parseAxisSpec(): {
    marks: AxisSpec[];
    interactions: InteractionSpec[];
  } {
    const axis = this.spec.axis;
    const res = {
      marks: [] as AxisSpec[],
      interactions: [] as InteractionSpec[]
    };

    if (axis) {
      Object.keys(axis).forEach(channel => {
        const { option, layout } = this.parseOption<SemanticAxisOption>(axis[channel]);

        if (option) {
          const axisMarkSpec: AxisSpec = {
            type: 'component',
            componentType: ComponentEnum.axis,
            scale: this.getScaleId(channel),
            dependency: [SIGNAL_VIEW_BOX],
            tickCount: (option as SemanticAxisOption).tickCount,
            encode: {
              update: (datum: any, elment: IElement, params: any) => {
                const positionAttrs = this._coordinate
                  ? {}
                  : channel === 'x'
                  ? {
                      x: 0,
                      y: params.viewBox.height(),
                      start: { x: 0, y: 0 },
                      end: { x: params.viewBox.width(), y: 0 }
                    }
                  : {
                      x: 0,
                      y: params.viewBox.height(),
                      start: { x: 0, y: 0 },
                      verticalFactor: -1,
                      end: { x: 0, y: -params.viewBox.height() }
                    };

                return isPlainObject(option) ? merge(positionAttrs, option) : positionAttrs;
              }
            }
          };
          axisMarkSpec.layout = layout ?? {
            position: this._coordinate
              ? 'auto'
              : isPlainObject(layout) && !isNil((layout as SemanticAxisOption).orient)
              ? (layout as SemanticAxisOption).orient
              : channel === 'x'
              ? 'bottom'
              : 'left'
          };
          res.marks.push(axisMarkSpec);
        }
      });
    }

    return res;
  }

  protected parseGridSpec(): {
    marks: GridSpec[];
    interactions: InteractionSpec[];
  } {
    const grid = this.spec.grid;
    const res = {
      marks: [] as GridSpec[],
      interactions: [] as InteractionSpec[]
    };

    if (grid) {
      Object.keys(grid).forEach(channel => {
        const option = grid[channel];

        if (option) {
          const relatedAxisOption = this.parseOption<SemanticAxisOption>(this.spec.axis?.[channel])?.option;
          const visiualChannel = this.getVisualChannel(channel as 'x' | 'y');
          const isCircleGrid = visiualChannel === 'radius';
          const tickCount =
            (option as SemanticGridOption).tickCount ?? (relatedAxisOption as SemanticAxisOption)?.tickCount;
          const otherChannel = channel === 'x' ? 'y' : 'x';
          const otherScaleId = this.getScaleId(otherChannel);
          const otherAxisOption = this.parseOption<SemanticAxisOption>(this.spec.axis?.[otherChannel])?.option;

          const markSpec: GridSpec = {
            type: 'component',
            componentType: ComponentEnum.grid,
            scale: this.getScaleId(channel),
            dependency: [SIGNAL_VIEW_BOX, otherScaleId],
            tickCount: tickCount,
            inside: (option as SemanticGridOption).inside,
            baseValue: (option as SemanticGridOption).baseValue,
            gridType: visiualChannel === 'angle' ? 'circle' : 'line',
            gridShape: isCircleGrid ? (option.type === 'polygon' ? 'polygon' : 'circle') : 'line',
            encode: {
              update: (datum: any, elment: IElement, params: any) => {
                const positionAttrs = this._coordinate
                  ? {}
                  : channel === 'x'
                  ? {
                      x: 0,
                      y: params.viewBox.height(),
                      start: { x: 0, y: 0 },
                      end: { x: params.viewBox.width(), y: 0 },
                      length: params.viewBox.height()
                    }
                  : {
                      x: 0,
                      y: params.viewBox.height(),
                      start: { x: 0, y: 0 },
                      verticalFactor: -1,
                      end: { x: 0, y: -params.viewBox.height() },
                      length: params.viewBox.width()
                    };

                if (isCircleGrid && option.type === 'polygon') {
                  (positionAttrs as any).sides =
                    option?.sides ??
                    params[otherScaleId]?.ticks((otherAxisOption as SemanticAxisOption)?.tickCount)?.length;
                }

                return isPlainObject(option) ? merge(positionAttrs, option) : positionAttrs;
              }
            }
          };

          res.marks.push(markSpec);
        }
      });
    }

    return res;
  }

  protected parseOption<T>(spec: { option: T | boolean; layout?: MarkRelativeItemSpec } | T | boolean) {
    let option: T | boolean;
    let layout: MarkRelativeItemSpec;

    if (isPlainObject(spec)) {
      if (isNil((spec as any).option)) {
        option = spec as T;
      } else {
        option = (spec as { option: T | boolean; layout?: MarkRelativeItemSpec }).option;
        layout = (spec as { option: T | boolean; layout?: MarkRelativeItemSpec }).layout;
      }
    } else {
      option = spec;
    }

    return { option, layout };
  }

  protected setDefaultLegend(): Record<string, Partial<LegendSpec>> {
    return {};
  }

  protected parseLegendSpec(): {
    marks: LegendSpec[];
    interactions: InteractionSpec[];
  } {
    const legend = this.spec.legend;
    const res = {
      marks: [] as LegendSpec[],
      interactions: [] as InteractionSpec[]
    };

    if (legend) {
      Object.keys(legend).forEach(channel => {
        const { option, layout } = this.parseOption<SemanticLegendOption>(legend[channel]);

        if (option) {
          const markLayout =
            layout ??
            (isPlainObject(option) && !isNil((option as LegendBaseAttributes).layout)
              ? (option as LegendBaseAttributes).layout === 'horizontal'
                ? { position: 'top', align: 'center' }
                : (option as LegendBaseAttributes).layout === 'vertical'
                ? { position: 'right', align: 'middle' }
                : { position: 'top', align: 'center' }
              : { position: 'top', align: 'center' });
          const markSpec: LegendSpec = {
            type: 'component',
            id: this.getComponentId(channel, 'legend'),
            componentType: ComponentEnum.legend,
            scale: this.getScaleId(channel),
            shapeScale: this.getScaleId('shape'),
            dependency: [SIGNAL_VIEW_BOX],
            encode: {
              update: (datum: any, element: IElement, params: any) => {
                const calculatedAttrs =
                  markLayout.position === 'left'
                    ? {
                        layout: 'vertical',
                        x: element.mark?.relativePosition?.left ?? 0, // todo, this is a dynamic number
                        y: element.mark?.relativePosition?.top ?? 0
                      }
                    : markLayout.position === 'right'
                    ? {
                        layout: 'vertical',
                        x: element.mark?.relativePosition?.left ?? params.viewBox.width(),
                        y: element.mark?.relativePosition?.top ?? 0
                      }
                    : markLayout.position === 'bottom'
                    ? {
                        layout: 'horizontal',
                        x: element.mark?.relativePosition?.left ?? 0,
                        y: element.mark?.relativePosition?.top ?? params.viewBox.height()
                      }
                    : {
                        layout: 'horizontal',
                        x: element.mark?.relativePosition?.left ?? 0,
                        y: element.mark?.relativePosition?.top ?? 0
                      };
                const attrs = isPlainObject(option) ? merge({}, calculatedAttrs, option) : calculatedAttrs;

                return attrs;
              }
            }
          };
          markSpec.layout = markLayout;
          const interactionSpec: LegendFilterSpec = {
            type: 'legend-filter',
            source: `#${this.getComponentId(channel, 'legend')}`,
            target: {
              data: this.getDataIdOfFiltered(),
              filter: this.spec.encode?.[channel]
            }
          };
          res.marks.push(markSpec);
          res.interactions.push(interactionSpec);
        }
      });
    }

    return res;
  }

  protected setDefaultCrosshair(): Record<string, Pick<CrosshairSpec, 'crosshairShape' | 'crosshairType'>> {
    return {};
  }

  protected getVisualChannel(channel: 'x' | 'y'): 'x' | 'y' | 'angle' | 'radius' {
    if (this._coordinate?.type === 'polar') {
      return this._coordinate.transpose ? (channel === 'x' ? 'radius' : 'angle') : channel === 'x' ? 'angle' : 'radius';
    }

    return (this._coordinate?.transpose ? (channel === 'x' ? 'y' : 'x') : channel) as 'x' | 'y' | 'angle' | 'radius';
  }

  protected parseCrosshairSpec(): {
    marks: MarkSpec[];
    interactions: CrosshairSpec[];
  } {
    const defaultCrosshair = this.setDefaultCrosshair();
    const defaultKeys = Object.keys(defaultCrosshair);
    const crosshairKeys = this.spec.crosshair
      ? Object.keys(this.spec.crosshair).reduce((res, key) => {
          if (!res.includes(key)) {
            res.push(key);
          }
          return res;
        }, defaultKeys)
      : defaultKeys;
    const res = {
      marks: [] as MarkSpec[],
      interactions: [] as CrosshairSpec[]
    };

    if (crosshairKeys.length) {
      crosshairKeys.forEach(channel => {
        const userOption = this.spec.crosshair?.[channel];
        const option = userOption ?? defaultCrosshair[channel];

        if (option) {
          const scaleId = this.getScaleId(channel);
          const scaleSpec = this.getScaleSpec(scaleId);
          const interactionSpec: CrosshairSpec = {
            type: 'crosshair',
            scale: this.getScaleId(channel),
            crosshairShape: isBoolean(option)
              ? scaleSpec?.type === 'band'
                ? 'rect'
                : 'line'
              : (option as CrosshairSpec).crosshairShape ?? (scaleSpec?.type === 'band' ? 'rect' : 'line'),
            crosshairType: this.getVisualChannel(channel as 'x' | 'y'),
            container: '#plotContainer'
          };

          if (isPlainObject(userOption)) {
            interactionSpec.attributes = userOption;
            if (userOption.type === 'polygon') {
              interactionSpec.crosshairType = 'radius-polygon';
              const anotherDimScaleId = this.getScaleId(channel === 'x' ? 'y' : 'x');
              (interactionSpec.attributes as any).sides = (datum: any, params: any) => {
                const scale = params[anotherDimScaleId];
                return scale && isDiscrete(scale.type) ? scale.domain().length : undefined;
              };
              (interactionSpec.attributes as any).startAngle = (datum: any, params: any) => {
                const scale = params[anotherDimScaleId];
                return scale && isDiscrete(scale.type) ? scale.range()[0] + (scale?.bandwidth?.() ?? 0) / 2 : undefined;
              };
              (interactionSpec.attributes as any).endAngle = (datum: any, params: any) => {
                const scale = params[anotherDimScaleId];
                return scale && isDiscrete(scale.type) ? scale.range()[1] + (scale?.bandwidth?.() ?? 0) / 2 : undefined;
              };
              interactionSpec.dependencies = [anotherDimScaleId];
            }
          }
          res.interactions.push(interactionSpec);
        }
      });
    }

    return res;
  }

  protected setDefaultTooltip(): SemanticTooltipOption | Nil {
    return null;
  }

  protected parseTooltipSpec(): {
    marks: MarkSpec[];
    interactions: InteractionSpec[];
  } {
    const defaultTooltipSpec = this.setDefaultTooltip();
    const userTooltipSpec = this.spec.tooltip;
    const res = {
      marks: [] as MarkSpec[],
      interactions: [] as InteractionSpec[]
    };

    if (userTooltipSpec !== false && userTooltipSpec !== null && defaultTooltipSpec !== null) {
      const tooltipSpec = merge({}, defaultTooltipSpec, userTooltipSpec === true ? {} : userTooltipSpec);
      const colorChannel = isNil((this.spec.encode as any).color)
        ? isNil((this.spec.encode as any).group)
          ? 'stroke'
          : 'group'
        : 'color';
      const colorEncode = (this.spec.encode as any)[colorChannel];
      const dependency = colorEncode ? [this.getScaleId(colorChannel)] : [];
      const colorAccessor = colorEncode ? getFieldAccessor(colorEncode) : null;
      const title = {
        visible: !!tooltipSpec.title || !!tooltipSpec.staticTitle,
        key: 'title',
        value: !isNil(tooltipSpec.staticTitle)
          ? tooltipSpec.staticTitle
          : {
              field: (datum: any, el: IElement, params: any) => {
                return tooltipSpec.title
                  ? getFieldAccessor(tooltipSpec.title)(isArray(datum) ? datum[0] : datum)
                  : undefined;
              }
            }
      };

      if ((this.spec.encode as any).shape) {
        dependency.push(this.getScaleId('shape'));
      }
      const content =
        isArray(tooltipSpec.content) && tooltipSpec.content.length
          ? tooltipSpec.content.map((entry: SemanticTooltipContentItem, index: number) => {
              return {
                key: entry.key
                  ? { field: entry.key }
                  : !isNil(tooltipSpec.staticContentKey)
                  ? isArray(tooltipSpec.staticContentKey)
                    ? tooltipSpec.staticContentKey[index]
                    : tooltipSpec.staticContentKey
                  : (datum: any, params: any) => {
                      return colorAccessor ? colorAccessor(datum) : undefined;
                    },
                value: { field: entry.value },
                symbol: (datum: any, params: any) => {
                  const scale = params[this.getScaleId(colorChannel)];
                  const shapeScale = params[this.getScaleId('shape')];
                  let symbolType = 'circle';
                  if (shapeScale && entry.symbol) {
                    symbolType = shapeScale.scale(getFieldAccessor(entry.symbol)(datum));
                  } else if (entry.symbol) {
                    symbolType = getFieldAccessor(entry.symbol)(datum);
                  }
                  return {
                    fill: scale && colorAccessor ? scale.scale(colorAccessor(datum)) : this.getPalette()?.[0],
                    symbolType
                  };
                }
              };
            })
          : null;
      if (tooltipSpec.disableGraphicTooltip !== true) {
        const interactionSpec: TooltipSpec = {
          type: 'tooltip',
          selector: `#${this.getMarkId()}`,
          title,
          content,
          attributes: {
            zIndex: 1000
          },
          dependencies: [this.getScaleId(colorChannel), this.getScaleId('shape')]
        };
        res.interactions.push(interactionSpec);
      }

      if (tooltipSpec.disableDimensionTooltip !== true) {
        const channel = tooltipSpec.dimensionTooltipChannel ?? 'x';
        const interactionSpec: DimensionTooltipSpec = {
          type: 'dimension-tooltip',
          tooltipType: this.getVisualChannel(channel as 'x' | 'y'),
          scale: this.getScaleId(channel),
          target: { data: this.getDataIdOfFiltered(), filter: (this.spec.encode as any)?.[channel] },
          title,
          content,
          avoidMark: tooltipSpec.disableGraphicTooltip ? [] : [`#${this.getMarkId()}`],
          attributes: {
            zIndex: 1000
          },
          dependencies: [this.getScaleId(colorChannel), this.getScaleId('shape')]
        };
        res.interactions.push(interactionSpec);
      }

      return res;
    }

    return res;
  }

  protected setDefaultSlider(): Record<string, Partial<SliderSpec>> {
    return {};
  }

  protected parseSliderSpec(): {
    marks: SliderSpec[];
    interactions: InteractionSpec[];
  } {
    const slider = this.spec.slider;
    const res = {
      marks: [] as SliderSpec[],
      interactions: [] as InteractionSpec[]
    };

    if (slider) {
      Object.keys(slider).forEach(channel => {
        const { option, layout } = this.parseOption<SemanticSliderOption>(slider[channel]);

        if (option) {
          const scaleId = this.getScaleId(channel);
          const scaleSpec = this.getScaleSpec(scaleId);
          const dataId = this.getDataIdOfMain();

          if (!scaleSpec || !isContinuous(scaleSpec.type)) {
            this._logger.warn(`[VGrammar]: Don't use slider in a channel which has scale type = ${scaleSpec?.type}`);
            return;
          }
          const theme = this.plot ? this.plot.view.getCurrentTheme() : ThemeManager.getDefaultTheme();
          const getter = getFieldAccessor(this.spec.encode?.[channel]);
          const markLayout =
            layout ??
            (isPlainObject(option) && !isNil((option as SliderAttributes).layout)
              ? (option as SliderAttributes).layout === 'horizontal'
                ? { position: 'top', align: 'center' }
                : (option as SliderAttributes).layout === 'vertical'
                ? { position: 'right', align: 'middle' }
                : { position: 'top', align: 'center' }
              : { position: 'top', align: 'center' });

          const markSpec: SliderSpec = {
            type: 'component',
            id: this.getComponentId(channel, 'slider'),
            componentType: ComponentEnum.slider,
            dependency: [SIGNAL_VIEW_BOX, dataId],
            min: (datum: any, elment: IElement, params: any) => {
              const data = params[dataId];

              return Math.min.apply(null, data.map(getter));
            },
            max: (datum: any, elment: IElement, params: any) => {
              const data = params[dataId];

              return Math.max.apply(null, data.map(getter));
            },
            encode: {
              update: (datum: any, elment: IElement, params: any) => {
                const calculatedAttrs =
                  markLayout.position === 'left'
                    ? {
                        layout: 'vertical',
                        x: elment.mark?.relativePosition?.left ?? 0, // todo, this is a dynamic number
                        y: elment.mark?.relativePosition?.top ?? 0,
                        railWidth: theme.components.slider.railHeight,
                        railHeight: params.viewBox.height()
                      }
                    : markLayout.position === 'right'
                    ? {
                        layout: 'vertical',
                        x: elment.mark?.relativePosition?.left ?? params.viewBox.width(),
                        y: elment.mark?.relativePosition?.top ?? 0,
                        railWidth: theme.components.slider.railHeight,
                        railHeight: params.viewBox.height()
                      }
                    : markLayout.position === 'bottom'
                    ? {
                        layout: 'horizontal',
                        x: elment.mark?.relativePosition?.left ?? 0,
                        y: elment.mark?.relativePosition?.top ?? params.viewBox.height(),
                        railHeight: theme.components.slider.railHeight,
                        railWidth: params.viewBox.width()
                      }
                    : {
                        layout: 'horizontal',
                        x: elment.mark?.relativePosition?.left ?? 0,
                        y: elment.mark?.relativePosition?.top ?? 0,
                        railHeight: theme.components.slider.railHeight,
                        railWidth: params.viewBox.width()
                      };
                const attrs = isPlainObject(option) ? merge({}, calculatedAttrs, option) : calculatedAttrs;

                return attrs;
              }
            }
          };
          markSpec.layout = markLayout;
          const interactionSpec: SliderFilterSpec = {
            type: 'slider-filter',
            source: `#${this.getComponentId(channel, 'slider')}`,
            target: {
              data: this.getDataIdOfFiltered(),
              filter: this.spec.encode?.[channel]
            }
          };
          res.marks.push(markSpec);
          res.interactions.push(interactionSpec);
        }
      });
    }

    return res;
  }

  protected setDefaultDataZoom(): Record<string, Partial<DatazoomSpec>> {
    return {};
  }

  protected getVisiualPositionByDimension(channel: string) {
    return channel === 'y' ? 'left' : 'bottom';
  }

  protected parseDatazoomSpec(): {
    marks: DatazoomSpec[];
    interactions: InteractionSpec[];
  } {
    const datazoom = this.spec.datazoom;
    const res = {
      marks: [] as DatazoomSpec[],
      interactions: [] as InteractionSpec[]
    };

    if (datazoom) {
      Object.keys(datazoom).forEach(channel => {
        const { option, layout } = this.parseOption<SemanticDataZoomOption>(datazoom[channel]);

        if (option) {
          const dataId = this.getDataIdOfMain();
          const markLayout =
            layout ??
            (isPlainObject(option) && !isNil((option as DataZoomAttributes).orient)
              ? { position: (option as DataZoomAttributes).orient }
              : { position: this.getVisiualPositionByDimension(channel) });
          const preview: DatazoomSpec['preview'] = {
            data: dataId
          };
          const { x, y } = this.getDataZoomScaleId(channel);

          if (channel === 'x') {
            preview.x = { scale: x, field: this.spec.encode?.[channel] };
            preview.y = { scale: y, field: (this.spec.encode as any)?.y };
          } else {
            preview[markLayout.position === 'top' || markLayout.position === 'bottom' ? 'x' : 'y'] = {
              scale: x,
              field: (this.spec.encode as any)?.[channel] ?? channel
            };
          }

          const theme = this.plot ? this.plot.view.getCurrentTheme() : ThemeManager.getDefaultTheme();
          const markSpec: DatazoomSpec = {
            type: 'component',
            id: this.getComponentId(channel, 'datazoom'),
            componentType: ComponentEnum.datazoom,
            dependency: [SIGNAL_VIEW_BOX, dataId],
            preview,
            encode: {
              update: (datum: any, elment: IElement, params: any) => {
                const calculatedAttrs =
                  markLayout.position === 'left'
                    ? {
                        orient: markLayout.position as OrientType,
                        x: elment.mark?.relativePosition?.left ?? 0, // todo, this is a dynamic number
                        y: elment.mark?.relativePosition?.top ?? 0,
                        size: { height: params.viewBox.height(), width: theme.components.datazoom.size.height }
                      }
                    : markLayout.position === 'right'
                    ? {
                        orient: markLayout.position as OrientType,
                        x: elment.mark?.relativePosition?.left ?? params.viewBox.width(),
                        y: elment.mark?.relativePosition?.top ?? 0,
                        size: { height: params.viewBox.height(), width: theme.components.datazoom.size.height }
                      }
                    : markLayout.position === 'bottom'
                    ? {
                        orient: markLayout.position as OrientType,
                        x: elment.mark?.relativePosition?.left ?? 0,
                        y: elment.mark?.relativePosition?.top ?? params.viewBox.height(),
                        size: { width: params.viewBox.width(), height: theme.components.datazoom.size.height }
                      }
                    : {
                        orient: markLayout.position as OrientType,
                        x: elment.mark?.relativePosition?.left ?? 0,
                        y: elment.mark?.relativePosition?.top ?? 0,
                        size: { width: params.viewBox.width(), height: theme.components.datazoom.size.height }
                      };

                const attrs = isPlainObject(option) ? merge({}, calculatedAttrs, option) : calculatedAttrs;

                return attrs;
              }
            }
          };
          markSpec.layout = markLayout;
          const interactionSpec: DatazoomFilterSpec = {
            type: 'datazoom-filter',
            source: `#${this.getComponentId(channel, 'datazoom')}`,
            target: {
              data: this.getDataIdOfFiltered(),
              filter: this.spec.encode?.[channel]
            }
          };
          res.marks.push(markSpec);
          res.interactions.push(interactionSpec);
        }
      });
    }

    return res;
  }

  protected setDefaultLabel(): Record<string, Partial<LabelSpec>> {
    return {};
  }

  protected getLabelPosition(): string {
    if (this._coordinate?.type === 'polar') {
      return this._coordinate.transpose ? 'endAngle' : 'outer';
    }

    return this._coordinate?.transpose ? 'right' : 'top';
  }

  protected setLabelTextGetter(
    channel: string,
    option: SemanticLabelOption | boolean
  ): ChannelEncodeType<ITextAttribute['text']> {
    return { field: channel };
  }

  protected parseLabelSpec(): {
    marks: LabelSpec[];
    interactions: InteractionSpec[];
  } {
    const label = this.spec.label;
    const res = {
      marks: [] as LabelSpec[],
      interactions: [] as InteractionSpec[]
    };

    if (label) {
      Object.keys(label).forEach(channel => {
        const option = label[channel];

        if (option) {
          const markSpec: LabelSpec = {
            type: 'component',
            componentType: ComponentEnum.label,
            target: this.getMarkId(),
            layout: {
              position: 'content',
              skipBeforeLayouted: true
            },
            labelStyle: isPlainObject(option)
              ? merge(
                  {
                    position: this.getLabelPosition()
                  },
                  option as BaseLabelAttrs
                )
              : { position: this.getLabelPosition() },
            encode: {
              update: {
                text: this.spec.encode[channel]
                  ? { field: this.spec.encode[channel] }
                  : this.setLabelTextGetter(channel, option)
              }
            }
          };
          res.marks.push(markSpec);
        }
      });
    }

    return res;
  }

  protected setDefaultPlayer(): Record<string, Partial<PlayerSpec>> {
    return {};
  }

  protected parsePlayerSpec(): {
    marks: PlayerSpec[];
    interactions: InteractionSpec[];
  } {
    const player = this.spec.player;
    const res = {
      marks: [] as PlayerSpec[],
      interactions: [] as InteractionSpec[]
    };

    if (player) {
      const option = player?.option;
      const layout = player?.layout;

      if (option) {
        const markLayout =
          layout ??
          (isPlainObject(option) && !isNil((option as PlayerAttributes).orient)
            ? { position: (option as PlayerAttributes).orient }
            : { position: 'bottom' });

        const markSpec: PlayerSpec = {
          type: 'component',
          id: this.getComponentId('', 'player'),
          componentType: ComponentEnum.player,
          dependency: [SIGNAL_VIEW_BOX],
          playerType: isPlainObject(option) ? (option as any).type ?? 'auto' : 'auto',
          source: this.getDataIdOfPlayer(),
          encode: {
            update: (datum: any, elment: IElement, params: any) => {
              const calculatedAttrs =
                markLayout.position === 'left'
                  ? {
                      x: elment.mark?.relativePosition?.left ?? 0, // todo, this is a dynamic number
                      y: elment.mark?.relativePosition?.top ?? 0,
                      size: { height: params.viewBox.height(), width: 20 }
                    }
                  : markLayout.position === 'right'
                  ? {
                      x: elment.mark?.relativePosition?.left ?? params.viewBox.width(),
                      y: elment.mark?.relativePosition?.top ?? 0,
                      size: { height: params.viewBox.height(), width: 20 }
                    }
                  : markLayout.position === 'bottom'
                  ? {
                      x: elment.mark?.relativePosition?.left ?? 0,
                      y: elment.mark?.relativePosition?.top ?? params.viewBox.height(),
                      size: { width: params.viewBox.width(), height: 20 }
                    }
                  : {
                      x: elment.mark?.relativePosition?.left ?? 0,
                      y: elment.mark?.relativePosition?.top ?? 0,
                      size: { width: params.viewBox.width(), height: 20 }
                    };

              const attrs = isPlainObject(option) ? merge({}, calculatedAttrs, option) : calculatedAttrs;

              return attrs;
            }
          }
        };
        markSpec.layout = markLayout;
        const interactionSpec: PlayerFilterSpec = {
          type: 'player-filter',
          source: `#${this.getComponentId('', 'player')}`,
          target: {
            data: this.getDataIdOfMain()
          }
        };
        res.marks.push(markSpec);
        res.interactions.push(interactionSpec);
      }
    }

    return res;
  }

  protected parseTitleSpec(): {
    marks: TitleSpec[];
    interactions: InteractionSpec[];
  } {
    const title = this.spec.title;
    const res = {
      marks: [] as TitleSpec[],
      interactions: [] as InteractionSpec[]
    };

    if (title) {
      const { option, layout } = this.parseOption<SemanticTitleOption>(title);

      if (option) {
        const markLayout = layout ?? { position: 'top' };

        const markSpec: TitleSpec = {
          type: 'component',
          componentType: ComponentEnum.title,
          dependency: [SIGNAL_VIEW_BOX],
          title: (option as SemanticTitleOption).text,
          subTitle: (option as SemanticTitleOption).subtext,
          encode: {
            update: (datum: any, elment: IElement, params: any) => {
              const calculatedAttrs =
                markLayout.position === 'left'
                  ? {
                      x: elment.mark?.relativePosition?.left ?? 0, // todo, this is a dynamic number
                      y: elment.mark?.relativePosition?.top ?? 0
                    }
                  : markLayout.position === 'right'
                  ? {
                      x: elment.mark?.relativePosition?.left ?? params.viewBox.width(),
                      y: elment.mark?.relativePosition?.top ?? 0
                    }
                  : markLayout.position === 'bottom'
                  ? {
                      x: elment.mark?.relativePosition?.left ?? 0,
                      y: elment.mark?.relativePosition?.top ?? params.viewBox.height(),
                      width: params.viewBox.width()
                    }
                  : {
                      x: elment.mark?.relativePosition?.left ?? 0,
                      y: elment.mark?.relativePosition?.top ?? 0,
                      width: params.viewBox.width()
                    };
              const attrs = isPlainObject(option) ? merge({}, calculatedAttrs, option) : calculatedAttrs;

              return attrs;
            }
          }
        };
        markSpec.layout = markLayout;
        res.marks.push(markSpec);
      }
    }

    return res;
  }

  protected parseDataSpec() {
    const { data, player } = this.spec;
    const res: DataSpec[] = [];

    if (player?.data) {
      res.push({
        id: this.getDataIdOfPlayer(),
        values: player.data
      });
      res.push({
        id: this.getDataIdOfMain(),
        values: player.data?.[0]
      });
      res.push({
        id: this.getDataIdOfFiltered(),
        source: this.getDataIdOfMain()
      });
    } else if (data) {
      const dataId = this.getDataIdOfMain();
      const userTransforms = data.transform;
      const transform = this.convertMarkTransform(userTransforms, this.setDefaultDataTransform());

      res.push({
        id: dataId,
        values: data.values,
        transform
      });
      res.push({
        id: this.getDataIdOfFiltered(),
        source: dataId
      });
    }

    const multiDatas = this.setMultipleData();

    if (multiDatas) {
      multiDatas.forEach(entry => {
        if (entry.id) {
          if (entry.id === this.getDataIdOfFiltered() && res.length) {
            res[res.length - 1].transform = entry.transform;
          } else {
            res.push(entry);
          }
        }
      });
    }

    return res;
  }

  protected parseScaleSpec() {
    const { encode, scale, datazoom } = this.spec;
    const scales: Record<string, ScaleSpec & { userScale?: ScaleSpec }> = {};
    if (encode) {
      Object.keys(encode).forEach(k => {
        const encodeOption = encode[k];
        const scaleId = this.getScaleId(k);
        const userScale = this.spec.scale?.[k];

        if (userScale) {
          scales[scaleId] = Object.assign({ id: scaleId }, this.parseScaleByEncode(k as K, encodeOption), userScale, {
            userScale
          });
        } else {
          scales[scaleId] = Object.assign({ id: scaleId }, this.parseScaleByEncode(k as K, encodeOption));
        }
      });
    }
    if (scale) {
      Object.keys(scale).forEach(k => {
        const scaleId = this.getScaleId(k);
        if (!scales[scaleId]) {
          scales[scaleId] = scale[k];
          scales[scaleId].userScale = scale[k];
        }
      });
    }

    if (datazoom) {
      Object.keys(datazoom).forEach(k => {
        const scaleId = this.getScaleId(k);
        const { x: xScaleId, y: yScaleId } = this.getDataZoomScaleId(k);

        if (k === 'x' && encode[k]) {
          scales[xScaleId] = {
            type: scales[scaleId].type,
            id: xScaleId,
            domain: {
              data: this.getDataIdOfMain(),
              field: encode[k]
            },
            dependency: [SIGNAL_VIEW_BOX],
            range: (scale: IBaseScale, params: any) => {
              return [0, params.viewBox.width()];
            }
          };

          if ((encode as any).y) {
            const theme = this.plot ? this.plot.view.getCurrentTheme() : ThemeManager.getDefaultTheme();
            scales[yScaleId] = {
              type: scales[this.getScaleId('y')]?.type ?? 'linear',
              id: yScaleId,
              domain: {
                data: this.getDataIdOfMain(),
                field: (encode as any)?.y
              },
              range: (scale: IBaseScale, params: any) => {
                const option = this.parseOption<SemanticDataZoomOption>(datazoom[k]).option;
                return [
                  0,
                  isPlainObject(option)
                    ? (option as DataZoomAttributes).size?.height ?? theme.components.datazoom.size.height
                    : theme.components.datazoom.size.height
                ];
              }
            };
          }
        } else {
          scales[xScaleId] = {
            type: scales[scaleId].type ?? 'band',
            id: xScaleId,
            domain: {
              data: this.getDataIdOfMain(),
              field: (encode as any)?.[k] ?? k
            }
          };
        }
      });
    }

    return Array.from(Object.values(scales));
  }

  protected parseCoordinateSpec(): CoordinateSpec[] {
    if (!this._coordinate) {
      return [];
    }
    const coordinate: CoordinateSpec = {
      type: this._coordinate.type ?? 'cartesian',
      transpose: this._coordinate.transpose,
      id: this._coordinate.id,
      dependency: [SIGNAL_VIEW_BOX],
      start: [0, 0],
      end: (coord: IBaseCoordinate, params: any) => {
        return [params.viewBox.width(), params.viewBox.height()];
      }
    };

    if (this._coordinate.type === 'polar' && this._coordinate.origin) {
      coordinate.origin = (coord: IBaseCoordinate, params: any) => {
        return [
          toPercent((this._coordinate as PolarCoordinateOption).origin[0], params.viewBox.width()),
          toPercent((this._coordinate as PolarCoordinateOption).origin[1], params.viewBox.height())
        ] as [number, number];
      };
    }

    return [coordinate];
  }

  protected setMainMarkEnterEncode() {
    return this.spec.style;
  }

  protected setMainMarkSpec() {
    return {};
  }

  protected setMultiMarksSpec(): MarkSpec[] {
    return null;
  }

  toViewSpec(): ViewSpec {
    this.viewSpec = {};
    const filteredDataId = this.getDataIdOfFiltered();
    this.viewSpec.data = this.parseDataSpec();
    this.viewSpec.scales = this.parseScaleSpec();
    this.viewSpec.coordinates = this.parseCoordinateSpec();
    let marks: MarkSpec[] = [];
    let interactions: InteractionSpec[] = [];

    const legendSpec = this.parseLegendSpec();
    marks = marks.concat(legendSpec.marks);
    interactions = interactions.concat(legendSpec.interactions);

    const axisSpec = this.parseAxisSpec();
    marks = marks.concat(axisSpec.marks);
    interactions = interactions.concat(axisSpec.interactions);

    const gridSpec = this.parseGridSpec();
    marks = marks.concat(gridSpec.marks);
    interactions = interactions.concat(gridSpec.interactions);

    const crosshairSpec = this.parseCrosshairSpec();
    marks = marks.concat(crosshairSpec.marks);
    interactions = interactions.concat(crosshairSpec.interactions);

    const sliderSpec = this.parseSliderSpec();
    marks = marks.concat(sliderSpec.marks);
    interactions = interactions.concat(sliderSpec.interactions);

    const datazoomSpec = this.parseDatazoomSpec();
    marks = marks.concat(datazoomSpec.marks);
    interactions = interactions.concat(datazoomSpec.interactions);

    const playerSpec = this.parsePlayerSpec();
    marks = marks.concat(playerSpec.marks);
    interactions = interactions.concat(playerSpec.interactions);

    const titleSpec = this.parseTitleSpec();
    marks = marks.concat(titleSpec.marks);
    interactions = interactions.concat(titleSpec.interactions);

    marks.push(
      Object.assign(
        {
          id: this.getMarkId(),
          type: this.setMarkType(),
          coordinate: this._coordinate?.id,
          from: {
            data: filteredDataId
          },
          groupBy: (this.spec.encode as any)?.group,
          layout: {
            position: 'content',
            skipBeforeLayouted: true
          },
          dependency: this.viewSpec.scales.map(scale => scale.id).concat(SIGNAL_VIEW_BOX),
          transform: this.convertMarkTransform(this.spec.transform, this.setDefaultMarkTransform()),
          animation: this.convertMarkAnimation(),
          encode: Object.assign({}, this.spec.state, {
            enter: this.setMainMarkEnterEncode(),
            update: this.convertMarkEncode(this.spec.encode)
          })
        },
        this.setMainMarkSpec()
      )
    );

    const otherMarks = this.setMultiMarksSpec();

    if (otherMarks) {
      marks = marks.concat(otherMarks);
    }

    const labelSpec = this.parseLabelSpec();
    marks = marks.concat(labelSpec.marks);
    interactions = interactions.concat(labelSpec.interactions);

    const tooltipSpec = this.parseTooltipSpec();
    marks = marks.concat(tooltipSpec.marks);
    interactions = interactions.concat(tooltipSpec.interactions);

    this.viewSpec.marks = marks;
    this.viewSpec.interactions = interactions;

    return this.viewSpec;
  }

  clear() {
    this.spec = { id: this.spec.id };
  }
}
