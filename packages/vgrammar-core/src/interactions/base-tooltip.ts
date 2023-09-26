import type { TooltipAttributes, TooltipRowAttrs } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { Tooltip as TooltipComponent } from '@visactor/vrender-components';
import type { IBounds, IPointLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { array, isArray, isFunction, isNil, isObjectLike, isString, isValid, merge } from '@visactor/vutils';
import { field as getFieldAccessor } from '@visactor/vgrammar-util';
import { BaseInteraction } from './base';
import type { IMark, ITheme, ITooltipRow, IView, RecursivePartial, TooltipPopoverOptions } from '../types';
import { isFieldEncode } from '../parse/mark';
import { invokeFunctionType } from '../parse/util';

export const generateTooltipAttributes = (
  point: IPointLike,
  title: TooltipRowAttrs,
  content: TooltipRowAttrs[],
  bounds: IBounds,
  theme?: ITheme,
  addition?: RecursivePartial<TooltipAttributes>
): TooltipAttributes => {
  const tooltipTheme = theme?.components?.tooltip;

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

export abstract class BaseTooltip<T extends TooltipPopoverOptions> extends BaseInteraction {
  options: T;
  protected _tooltipComponent?: TooltipComponent;
  protected _marks?: IMark[];

  constructor(view: IView, options?: T) {
    super(view);
    this._marks = view.getMarksBySelector(options.selector);
  }

  bind(): void {
    super.bind();

    const stage = this.view.renderer.stage();
    if (this._tooltipComponent || !stage) {
      return;
    }
    this._tooltipComponent = new TooltipComponent({});

    (stage.defaultLayer as any).appendChild(this._tooltipComponent);
  }

  unbind(): void {
    super.unbind();

    if (this._tooltipComponent) {
      this._tooltipComponent.release();
      this._tooltipComponent = null;
    }
  }

  protected _computeTooltipRow(row: ITooltipRow, datum: any) {
    // compute visible
    let visible = invokeFunctionType(row.visible, {}, datum);
    visible = isNil(visible) ? true : !!visible;

    // compute key
    let key;
    if (isFieldEncode(row.key)) {
      const fieldAccessor = getFieldAccessor(row.key.field);
      key = fieldAccessor(datum);
    } else {
      key = invokeFunctionType(row.key, {}, datum);
    }
    key = isNil(key) ? undefined : isObjectLike(key) ? key : { text: key };

    // compute value
    let value;
    if (isFieldEncode(row.value)) {
      const fieldAccessor = getFieldAccessor(row.value.field);
      value = fieldAccessor(datum);
    } else {
      value = invokeFunctionType(row.value, {}, datum);
    }
    value = isNil(value) ? undefined : isObjectLike(value) ? value : { text: value };

    // compute symbol
    let symbol;
    if (isFieldEncode(row.symbol)) {
      const fieldAccessor = getFieldAccessor(row.symbol.field);
      symbol = fieldAccessor(datum);
    } else {
      symbol = invokeFunctionType(row.symbol, {}, datum);
    }
    symbol = isNil(symbol) ? undefined : isObjectLike(symbol) ? symbol : { symbolType: symbol };

    return { visible, key, value, shape: symbol };
  }

  protected _computeTitleContent(datum: any) {
    const title = isValid(this.options.title)
      ? isFunction(this.options.title)
        ? this.options.title.call(null, datum, null, {})
        : this._computeTooltipRow(
            isString(this.options.title) ? { value: this.options.title } : this.options.title,
            datum
          )
      : undefined;
    const content = isValid(this.options.content)
      ? isFunction(this.options.content)
        ? array(this.options.content.call(null, datum, null, {}))
        : array(datum).reduce((content, datumRow) => {
            return content.concat(
              array(this.options.content).map(row => this._computeTooltipRow(row as ITooltipRow, datumRow))
            );
          }, [])
      : undefined;

    // only display one single row in title
    return { title: isArray(title) ? title[0] : title, content };
  }
}
