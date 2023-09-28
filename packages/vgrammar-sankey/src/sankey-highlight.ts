import { InteractionStateEnum, BaseInteraction } from '@visactor/vgrammar-core';
import type {
  IElement,
  IGlyphElement,
  IMark,
  IView,
  InteractionEvent,
  SankeyHighlightOptions
} from '@visactor/vgrammar-core';
import { array } from '@visactor/vutils';
import type { SankeyLinkDatum, SankeyLinkElement, SankeyNodeElement } from './interface';

export class SankeyHighlight extends BaseInteraction<SankeyHighlightOptions> {
  static type: string = 'sankey-highlight';
  type: string = SankeyHighlight.type;

  static defaultOptions: SankeyHighlightOptions = {
    highlightState: InteractionStateEnum.highlight,
    blurState: InteractionStateEnum.blur,
    trigger: 'pointerover',
    resetTrigger: 'pointerout'
  };
  options: SankeyHighlightOptions;
  protected _nodeMark?: IMark;
  protected _linkMark?: IMark;
  protected _activeElement?: IElement | IGlyphElement;

  constructor(view: IView, options?: SankeyHighlightOptions) {
    super(view, options);
    this.options = Object.assign({}, SankeyHighlight.defaultOptions, options);

    this._nodeMark = view.getMarksBySelector(this.options.nodeSelector)?.[0];
    this._linkMark = view.getMarksBySelector(this.options.linkSelector)?.[0];
  }

  protected getEvents() {
    return [
      {
        type: this.options.trigger,
        handler: this.handleStart
      },
      { type: this.options.resetTrigger, handler: this.handleReset }
    ];
  }

  clearPrevElements() {
    [this._linkMark, this._nodeMark].forEach(mark => {
      if (!mark) {
        return;
      }
      mark.elements.forEach(el => {
        if (el.hasState(this.options.highlightState)) {
          el.removeState(this.options.highlightState);
        }

        if (el.hasState(this.options.blurState)) {
          el.removeState(this.options.blurState);
        }
      });
    });
  }

  parseUpstreamLinks(element: IElement, isNode: boolean) {
    const datum = element.getDatum();
    const links = !isNode ? array(datum as SankeyLinkDatum) : (datum as SankeyNodeElement).targetLinks;

    return links.reduce((res: any[], link: any) => {
      const dividedLinks = array((link as any).datum);

      dividedLinks.forEach(dividedLink => {
        const parents = dividedLink.parents;
        const len = isNode ? parents.length : parents.length - 1;

        for (let i = 0; i < len; i++) {
          const source = parents[i].key;
          const target = parents[i + 1] ? parents[i + 1].key : datum.key;
          const value = dividedLink.value;

          // 检查 res 数组中是否已存在相同的 source 和 target
          const existingItem = res.find(item => item.source === source && item.target === target);

          if (existingItem) {
            // 如果存在相同的项，则对其 value 进行累加
            existingItem.value += value;
          } else {
            // 如果不存在相同的项，则添加新的项到 res 数组中
            res.push({ source, target, value });
          }
        }
      });
      return res;
    }, []);
  }

  highlightElement = (element: IElement, isNode: boolean) => {
    const datum = element.getDatum();
    const allNodeElements = this._nodeMark?.elements;
    const allLinkElements = this._linkMark?.elements;
    const highlightNodes: string[] = isNode ? [datum.key] : [datum.source, datum.target];
    const upstreamLinks = this.parseUpstreamLinks(element, isNode);

    allLinkElements.forEach(linkEl => {
      const linkDatum = linkEl.getDatum();
      const originalDatum = array(linkDatum.datum) as SankeyLinkElement[];

      if (!isNode && linkDatum.source === datum.source && linkDatum.target === datum.target) {
        linkEl.removeState(this.options.blurState);
        linkEl.addState(this.options.highlightState, { ratio: 1 });
        return;
      }

      const selectedDatum = isNode
        ? originalDatum.filter((entry: any) => entry.parents.some((par: any) => par.key === datum.key))
        : originalDatum.filter((entry: any) => entry.parents.some((par: any) => par.key === datum.target));

      if (selectedDatum && selectedDatum.length) {
        // 下游link
        if (!highlightNodes.includes(linkDatum.source)) {
          highlightNodes.push(linkDatum.source);
        }

        if (!highlightNodes.includes(linkDatum.target)) {
          highlightNodes.push(linkDatum.target);
        }

        const val = selectedDatum.reduce((sum: number, d: any) => {
          return (sum += d.value);
        }, 0);
        const ratio = val / linkDatum.value;

        linkEl.removeState(this.options.blurState);
        linkEl.addState(this.options.highlightState, { ratio });

        return;
      }

      const upSelectedLink = upstreamLinks.find(
        (upLink: any) => upLink.source === linkDatum.source && upLink.target === linkDatum.target
      );

      if (upSelectedLink) {
        // 点击节点的上游一层的节点
        if (!highlightNodes.includes(linkDatum.source)) {
          highlightNodes.push(linkDatum.source);
        }
        if (!highlightNodes.includes(linkDatum.target)) {
          highlightNodes.push(linkDatum.target);
        }

        linkEl.removeState(this.options.blurState);
        linkEl.addState(this.options.highlightState, { ratio: upSelectedLink.value / linkDatum.value });

        return;
      }

      linkEl.removeState(this.options.highlightState);
      linkEl.addState(this.options.blurState);

      return;
    });

    allNodeElements.forEach(el => {
      el.clearStates();
      if (highlightNodes.includes(el.getDatum().key)) {
        el.removeState(this.options.blurState);
        el.addState(this.options.highlightState);
      } else {
        el.removeState(this.options.highlightState);
        el.addState(this.options.blurState);
      }
    });
  };

  handleStart = (e: InteractionEvent) => {
    if (!e.element) {
      return;
    }

    if (e.element.mark === this._nodeMark) {
      this._activeElement = e.element;
      this.highlightElement(e.element, true);
    } else if (e.element.mark === this._linkMark) {
      this._activeElement = e.element;
      this.highlightElement(e.element, false);
    }
  };

  handleReset = (e: InteractionEvent) => {
    if (e.element && e.element === this._activeElement) {
      this.clearPrevElements();
    }
  };
}
