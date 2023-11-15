import { DefaultKey } from '../graph/constants';
import { GrammarMarkType } from '../graph/enums';
import type {
  IGroupMark,
  IView,
  IComponent,
  ComponentSpec,
  IData,
  Nil,
  MarkFunctionType,
  StateEncodeSpec,
  BaseSignleEncodeSpec
} from '../types';
import { Mark } from './mark';
import { Factory } from '../core/factory';

export class Component extends Mark implements IComponent {
  declare markType: GrammarMarkType.component;
  readonly componentType: string;
  protected declare spec: ComponentSpec;

  protected mode?: '2d' | '3d';

  protected _componentDatum = { [DefaultKey]: 0 };
  protected _encoders: StateEncodeSpec;

  constructor(view: IView, componentType: string, group?: IGroupMark, mode?: '2d' | '3d') {
    super(view, GrammarMarkType.component, group);
    this.componentType = componentType;
    this.spec.type = 'component';
    this.spec.componentType = componentType;
    this.mode = mode;
    this._updateComponentEncoders();
  }

  configureComponent(config: any) {
    this.spec.componentConfig = config;
    this.commit();
    return this;
  }

  addGraphicItem(attrs: any, groupKey?: string, newGraphicItem?: any) {
    const graphicItem =
      newGraphicItem ??
      Factory.createGraphicComponent(this.componentType, attrs, { mode: this.mode, skipDefault: this.spec.skipTheme });
    return super.addGraphicItem(attrs, groupKey, graphicItem);
  }

  join(data: IData | string | Nil) {
    return super.join(data, DefaultKey);
  }

  encodeState(state: string, channel: string | BaseSignleEncodeSpec, value?: MarkFunctionType<any>) {
    super.encodeState(state, channel, value);
    this._updateComponentEncoders();
    return this;
  }

  protected _prepareRejoin() {
    this._componentDatum[DefaultKey] += 1;
  }

  protected evaluateJoin(data: any[]) {
    this.spec.key = DefaultKey;
    // component mark do not support data join
    return super.evaluateJoin([this._componentDatum]);
  }

  protected _updateComponentEncoders() {
    this._encoders = this.spec.encode;
  }

  protected _getEncoders() {
    return this._encoders ?? {};
  }
}
