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
    triggerOff: 'pointerout',
    effect: 'related'
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
      { type: this.options.triggerOff, handler: this.handleReset }
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
    const links = isNode ? (datum as SankeyNodeElement).targetLinks : array(datum as SankeyLinkDatum);

    return links.reduce((res: any[], link: any) => {
      const dividedLinks = array((link as any).datum);

      dividedLinks.forEach(dividedLink => {
        const parents = dividedLink.parents ?? [{ key: dividedLink.source }];
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

  highlightAdjacentElement = (element: IElement, isNode: boolean) => {
    const datum = element.getDatum();
    const allLinkElements = this._linkMark?.elements ?? [];
    const highlightNodes: (string | number)[] = isNode ? [datum.key] : [datum.source, datum.target];
    const getIsHighlight = isNode
      ? (linkDatum: SankeyLinkElement) => {
          return linkDatum.target === datum.key || linkDatum.source === datum.key;
        }
      : (linkDatum: SankeyLinkElement) => {
          return linkDatum.source === datum.source && linkDatum.target === datum.target;
        };

    allLinkElements.forEach(linkEl => {
      const linkDatum = linkEl.getDatum() as SankeyLinkElement;

      if (getIsHighlight(linkDatum)) {
        linkEl.removeState(this.options.blurState);
        linkEl.addState(this.options.highlightState, { ratio: 1 });

        if (!highlightNodes.includes(linkDatum.source)) {
          highlightNodes.push(linkDatum.source);
        }
        if (!highlightNodes.includes(linkDatum.target)) {
          highlightNodes.push(linkDatum.target);
        }
      } else {
        linkEl.removeState(this.options.highlightState);
        linkEl.addState(this.options.blurState);
      }
    });
    return highlightNodes;
  };

  highlightRelatedBySourceTarget = (element: IElement, isNode: boolean) => {
    if (!isNode) {
      return this.highlightAdjacentElement(element, isNode);
    }

    const datum = element.getDatum() as SankeyNodeElement;
    const allNodeElements = this._nodeMark?.elements ?? [];
    const highlightNodes: (string | number)[] = [];
    const allLinkElements = this._linkMark?.elements ?? [];
    const highlightLinks: SankeyLinkElement[] = [];
    const allNodes = allNodeElements.reduce((res, nodeEl) => {
      const nodeDatum = nodeEl.getDatum() as SankeyNodeElement;

      res[nodeDatum?.key] = { datum: nodeDatum, el: nodeEl };
      return res;
    }, {});
    const downNodes: SankeyNodeElement[] = [datum];
    const upNodes: SankeyNodeElement[] = [datum];

    while (downNodes.length) {
      const first = downNodes.pop();

      if (first?.sourceLinks?.length) {
        first.sourceLinks.forEach(link => {
          highlightLinks.push(link);

          if (allNodes[link.target]) {
            downNodes.push(allNodes[link.target].datum);
          }
        });
      }
    }

    while (upNodes.length) {
      const first = upNodes.pop();

      if (first?.targetLinks?.length) {
        first.targetLinks.forEach(link => {
          highlightLinks.push(link);

          if (allNodes[link.source]) {
            upNodes.push(allNodes[link.source].datum);
          }
        });
      }
    }

    allLinkElements.forEach(linkEl => {
      const linkDatum = linkEl.getDatum();

      if (highlightLinks.some(link => link.source === linkDatum.source && link.target === linkDatum.target)) {
        linkEl.removeState(this.options.blurState);
        linkEl.addState(this.options.highlightState, { ratio: 1 });

        if (!highlightNodes.includes(linkDatum.source)) {
          highlightNodes.push(linkDatum.source);
        }

        if (!highlightNodes.includes(linkDatum.target)) {
          highlightNodes.push(linkDatum.target);
        }
      } else {
        linkEl.removeState(this.options.highlightState);
        linkEl.addState(this.options.blurState);
      }
    });

    return highlightNodes;
  };

  highlightRelatedElement = (element: IElement, isNode: boolean) => {
    const allLinkElements = this._linkMark?.elements ?? [];
    const isHierarchyData = !!allLinkElements[0]?.getDatum?.()?.parents;

    if (!isHierarchyData) {
      return this.highlightRelatedBySourceTarget(element, isNode);
    }

    const datum = element.getDatum();
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
        ? originalDatum.filter((entry: any) => (entry.parents ?? []).some((par: any) => par.key === datum.key))
        : originalDatum.filter((entry: any) => (entry.parents ?? []).some((par: any) => par.key === datum.target));

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

    return highlightNodes;
  };

  highlightElement = (element: IElement, isNode: boolean) => {
    const allNodeElements = this._nodeMark?.elements ?? [];
    const highlightNodes =
      this.options.effect === 'related'
        ? this.highlightRelatedElement(element, isNode)
        : this.highlightAdjacentElement(element, isNode);
    allNodeElements.forEach(el => {
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
