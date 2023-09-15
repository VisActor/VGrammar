import type { IGraphic } from '@visactor/vrender-core';
import type {
  GlyphChannelEncoder,
  GlyphDefaultEncoder,
  IComponentConstructor,
  IElement,
  IGlyphElement,
  IGlyphMeta,
  IGrammarBaseConstructor,
  IGroupMark,
  IInteractionConstructor,
  IPlotMarkConstructor,
  ISemanticMark,
  ITransform,
  IView,
  MarkType,
  TypeAnimation
} from '../types';
import { GlyphMeta } from '../view/glyph-meta';

export class Factory {
  private static _plotMarks: Record<string, IPlotMarkConstructor> = {};
  private static _components: Record<string, IComponentConstructor> = {};
  private static _graphicComponents: Record<string, (attrs: any, mode?: '2d' | '3d') => IGraphic> = {};
  private static _transforms: Record<string, ITransform> = {};
  private static _grammars: Record<string, { grammarClass: IGrammarBaseConstructor; specKey: string }> = {};
  private static _glyphs: Record<string, IGlyphMeta<any, any>> = {};
  private static _animations: Record<string, TypeAnimation<IGlyphElement> | TypeAnimation<IElement>> = {};
  private static _interactions: Record<string, IInteractionConstructor> = {};

  static registerPlotMarks(key: string, mark: IPlotMarkConstructor) {
    Factory._plotMarks[key] = mark;
  }

  static createPlotMark(type: string, id?: string): ISemanticMark<any, any> | null {
    if (!Factory._plotMarks[type]) {
      return null;
    }
    const MarkConstructor = Factory._plotMarks[type];
    return new MarkConstructor(id);
  }

  static registerComponent(key: string, component: IComponentConstructor) {
    Factory._components[key] = component;
  }

  static createComponent(componentType: string, view: IView, group?: IGroupMark, mode?: '2d' | '3d') {
    const Ctor = Factory._components[componentType];
    if (!Ctor) {
      return null;
    }

    return new Ctor(view, group, mode);
  }

  static hasComponent(componentType: string) {
    return !!Factory._components[componentType];
  }

  static registerGraphicComponent(key: string, creator: (attrs: any, mode?: '2d' | '3d') => IGraphic) {
    Factory._graphicComponents[key] = creator;
  }

  static createGraphicComponent(componentType: string, attrs: any, mode?: '2d' | '3d') {
    const compCreator = Factory._graphicComponents[componentType];

    if (!compCreator) {
      return null;
    }

    return compCreator(attrs, mode);
  }

  static registerTransform(type: string, transform: Omit<ITransform, 'type'>, isBuiltIn?: boolean) {
    Factory._transforms[type] = Object.assign(transform, { type, isBuiltIn: !!isBuiltIn });
  }

  static getTransform(type: string) {
    return Factory._transforms[type];
  }

  static unregisterRuntimeTransforms() {
    Object.keys(Factory._transforms).forEach(type => {
      if (Factory._transforms[type] && !Factory._transforms[type].isBuiltIn) {
        Factory._transforms[type] = null;
      }
    });
  }

  static registerGrammar(type: string, grammarClass: IGrammarBaseConstructor, specKey?: string) {
    Factory._grammars[type] = {
      grammarClass: grammarClass,
      specKey: specKey ?? type
    };
  }

  static createGrammar(type: string, view: IView) {
    const Ctor = Factory._grammars[type]?.grammarClass;

    if (!Ctor) {
      return null;
    }

    return new Ctor(view);
  }

  static getGrammars() {
    return this._grammars;
  }

  static registerGlyph = <EncodeValuesType = any, GlyphConfigType = any>(
    glyphType: string,
    marks: { [markName: string]: MarkType },
    encoders?: { [markName: string]: GlyphChannelEncoder<any, EncodeValuesType, GlyphConfigType> },
    defaultEncoder?: GlyphDefaultEncoder,
    progressiveChannels?: string | string[]
  ): IGlyphMeta<EncodeValuesType, GlyphConfigType> => {
    Factory._glyphs[glyphType] = new GlyphMeta<EncodeValuesType, GlyphConfigType>(
      marks,
      encoders,
      defaultEncoder,
      progressiveChannels
    );
    return Factory._glyphs[glyphType];
  };

  static getGlyph(glyphType: string): IGlyphMeta {
    return Factory._glyphs[glyphType];
  }

  static registerAnimationType = (
    animationType: string,
    animation: TypeAnimation<IGlyphElement> | TypeAnimation<IElement>
  ): void => {
    Factory._animations[animationType] = animation;
  };

  static getAnimationType = (animationType: string) => {
    return Factory._animations[animationType];
  };

  static registerInteraction = (interactionType: string, interaction: IInteractionConstructor) => {
    Factory._interactions[interactionType] = interaction;
  };

  static createInteraction(interactionType: string, view: IView, options?: any) {
    const Ctor = Factory._interactions[interactionType];
    if (!Ctor) {
      return null;
    }

    return new Ctor(view, options);
  }
}
