import type { IBounds, IPointLike } from '@visactor/vutils';
import { AABBBounds, isValid } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isObjectLike, throttle } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { array, isNil, isString, merge } from '@visactor/vutils';
import type { IGraphic, IGroup } from '@visactor/vrender';
import type { TooltipAttributes, TooltipRowAttrs } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { Tooltip as TooltipComponent } from '@visactor/vrender-components';
import { field as getFieldAccessor } from '@visactor/vgrammar-util';
import { registerComponent } from '../view/register-component';
import type {
  BaseSignleEncodeSpec,
  IElement,
  IGrammarBase,
  IGroupMark,
  IMark,
  IView,
  Nil,
  RecursivePartial,
  StateEncodeSpec
} from '../types';
import { ComponentEnum } from '../graph';
import type { ITooltip, ITooltipRow, TooltipSpec } from '../types/component';
import { Component } from '../view/component';
import { defaultTheme } from '../theme/default';
import { invokeEncoder } from '../graph/mark/encode';
import { invokeFunctionType, parseFunctionType } from '../parse/util';
import { isFieldEncode } from '../parse/mark';

registerComponent(
  ComponentEnum.tooltip,
  (attrs: TooltipAttributes) => new TooltipComponent(attrs) as unknown as IGraphic
);

export const generateTooltipAttributes = (
  point: IPointLike,
  title: TooltipRowAttrs,
  content: TooltipRowAttrs[],
  bounds: IBounds,
  addition?: RecursivePartial<TooltipAttributes>
): TooltipAttributes => {
  const tooltipTheme = defaultTheme.tooltip;

  return merge(
    {},
    tooltipTheme,
    {
      visible: true,
      pointerX: point.x,
      pointerY: point.y,
      title,
      content,
      parentBounds: bounds
    },
    addition ?? {}
  );
};

export class Tooltip extends Component implements ITooltip {
  protected declare spec: TooltipSpec;

  private _targetMarks: IMark[] = [];
  private _additionalEncodeResult: any;
  private _lastElement: IElement;

  constructor(view: IView, group?: IGroupMark) {
    super(view, ComponentEnum.tooltip, group);
    this.spec.componentType = ComponentEnum.tooltip;
  }

  protected parseAddition(spec: TooltipSpec) {
    super.parseAddition(spec);
    this.target(spec.target);
    this.title(spec.title);
    this.content(spec.content);
    return this;
  }

  target(mark: IMark | IMark[] | string | string[] | Nil): this {
    if (this.spec.target) {
      const prevMarks = array(this.spec.target).map(m => (isString(m) ? this.view.getMarkById(m) : m));
      this.detach(prevMarks);
    }
    this.spec.target = mark;
    const nextMarks = array(mark).map(m => (isString(m) ? this.view.getMarkById(m) : m));
    this.attach(nextMarks);
    this._targetMarks = nextMarks.filter(m => !isNil(m));
    this.commit();
    return this;
  }

  title(title: ITooltipRow | string | Nil) {
    if (this.spec.title && !isString(this.spec.title)) {
      this.detach(this._parseTooltipRow(this.spec.title));
    }
    this.spec.title = title;
    if (title && !isString(title)) {
      this.attach(this._parseTooltipRow(title));
    }
    this.commit();
    return this;
  }

  content(content: ITooltipRow | ITooltipRow[] | Nil) {
    if (this.spec.content) {
      this.detach(this._parseTooltipRow(this.spec.content));
    }
    this.spec.content = content;
    if (content) {
      this.attach(this._parseTooltipRow(this.spec.content));
    }
    this.commit();
    return this;
  }

  configureComponent(config: any) {
    // if
    super.configureComponent(config);
    return this;
  }

  release() {
    this.view.removeEventListener('pointermove', this._onTooltipShow);
    this.view.removeEventListener('pointerleave', this._onTooltipHide);
    super.release();
  }

  protected init(stage: any, parameters: any) {
    super.init(stage, parameters);
    this.view.addEventListener('pointermove', this._onTooltipShow);
    this.view.addEventListener('pointerleave', this._onTooltipHide);
  }

  protected _updateComponentEncoders() {
    const encoders = Object.assign({ update: {} }, this.spec.encode);
    const componentEncoders: StateEncodeSpec = Object.keys(encoders).reduce((res, state) => {
      const encoder = encoders[state];
      if (encoder) {
        res[state] = {
          callback: (datum: any, element: IElement, parameters: any) => {
            this._additionalEncodeResult = invokeEncoder(encoder as BaseSignleEncodeSpec, datum, element, parameters);
          }
        };
      }
      return res;
    }, {});
    this._encoders = componentEncoders;
  }

  private _parseTooltipRow(tooltipRow: ITooltipRow | ITooltipRow[] | Nil) {
    return array(tooltipRow).reduce((dependencies, row) => {
      dependencies = dependencies.concat(parseFunctionType(row.visible, this.view));
      if (!isFieldEncode(row.key)) {
        dependencies = dependencies.concat(parseFunctionType(row.key, this.view));
      }
      if (!isFieldEncode(row.value)) {
        dependencies = dependencies.concat(parseFunctionType(row.value, this.view));
      }
      if (!isFieldEncode(row.symbol)) {
        dependencies = dependencies.concat(parseFunctionType(row.symbol, this.view));
      }
      return dependencies;
    }, [] as IGrammarBase[]);
  }

  private _onTooltipShow = throttle((event: any, element: IElement) => {
    const tooltip = this.elements[0].getGraphicItem() as IGroup;
    if (!this._targetMarks.includes(element?.mark)) {
      tooltip.hideAll();
      return;
    }

    tooltip.showAll();

    const groupGraphicItem = this.group.getGroupGraphicItem();
    // FIXME: waiting for vRender to add transformed position to event
    const point = { x: 0, y: 0 };
    groupGraphicItem.globalTransMatrix.transformPoint(event.canvas, point);

    if (element === this._lastElement) {
      // only update pointer when element is not changed
      tooltip.setAttributes({ pointerX: point.x, pointerY: point.y } as any);
      return;
    }

    const boundsStart = { x: 0, y: 0 };
    groupGraphicItem.globalTransMatrix.transformPoint({ x: 0, y: 0 }, boundsStart);
    const boundsEnd = { x: 0, y: 0 };
    groupGraphicItem.globalTransMatrix.transformPoint(
      {
        x: this.view.getSignalById('width').getValue() as number,
        y: this.view.getSignalById('height').getValue() as number
      },
      boundsEnd
    );
    const bounds = new AABBBounds().set(boundsStart.x, boundsStart.y, boundsEnd.x, boundsEnd.y);
    const { title, content } = this._computeTitleContent(element);
    const attributes = generateTooltipAttributes(point, title, content, bounds, this._additionalEncodeResult);
    tooltip.setAttributes(attributes);
  }, 10);

  private _onTooltipHide = (event: any) => {
    const tooltip = this.elements[0].getGraphicItem() as IGroup;
    tooltip.hideAll();
  };

  private _computeTooltipRow(row: ITooltipRow, datum: any, element: IElement, parameters: any) {
    // compute visible
    let visible = invokeFunctionType(row.visible, parameters, datum, element);
    visible = isNil(visible) ? true : !!visible;

    // compute key
    let key;
    if (isFieldEncode(row.key)) {
      const fieldAccessor = getFieldAccessor(row.key.field);
      key = fieldAccessor(datum);
    } else {
      key = invokeFunctionType(row.key, parameters, datum, element);
    }
    key = isNil(key) ? undefined : isObjectLike(key) ? key : { text: key };

    // compute value
    let value;
    if (isFieldEncode(row.value)) {
      const fieldAccessor = getFieldAccessor(row.value.field);
      value = fieldAccessor(datum);
    } else {
      value = invokeFunctionType(row.value, parameters, datum, element);
    }
    value = isNil(value) ? undefined : isObjectLike(value) ? value : { text: value };

    // compute symbol
    let symbol;
    if (isFieldEncode(row.symbol)) {
      const fieldAccessor = getFieldAccessor(row.symbol.field);
      symbol = fieldAccessor(datum);
    } else {
      symbol = invokeFunctionType(row.symbol, parameters, datum, element);
    }
    symbol = isNil(symbol) ? undefined : isObjectLike(symbol) ? symbol : { symbolType: symbol };

    return { visible, key, value, shape: symbol };
  }

  private _computeTitleContent(element: IElement) {
    const datum = element.getDatum();
    const parameters = this.parameters();

    const title = isValid(this.spec.title)
      ? this._computeTooltipRow(
          isString(this.spec.title) ? { value: this.spec.title } : this.spec.title,
          datum,
          element,
          parameters
        )
      : undefined;
    const content = this.spec.content
      ? array(datum).reduce((content, datumRow) => {
          return content.concat(
            array(this.spec.content).map(row => this._computeTooltipRow(row, datumRow, element, parameters))
          );
        }, [])
      : undefined;

    return { title, content };
  }
}
