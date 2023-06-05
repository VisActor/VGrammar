import { isNil } from '@visactor/vutils';
import type { HierarchicalDatum, HierarchicalNodeElement } from './interface';

export const calculateNodeValue = <Datum extends HierarchicalDatum, NodeElement extends HierarchicalNodeElement<Datum>>(
  subTree: Datum[],
  output: NodeElement[],
  depth: number = 0,
  flattenIndex: number = -1,
  parent?: NodeElement,
  getNodeKey?: (datum: Datum) => string
): { sum: number; maxDepth: number; flattenIndex: number } => {
  let sum = 0;
  let prevFlattenIndex = flattenIndex ?? -1;
  let maxDepth = depth;

  subTree.forEach((datum, index) => {
    const node = {
      flattenIndex: ++prevFlattenIndex,
      key: getNodeKey ? getNodeKey(datum) : `${parent?.key ?? ''}-${index}`,
      maxDepth: -1,
      depth,
      index,
      value: datum.value,
      isLeaf: true,
      datum: parent ? parent.datum.concat(datum) : [datum],
      parentKey: parent?.key
    } as NodeElement;

    if (datum.children?.length) {
      node.children = [];
      node.isLeaf = false;
      const res = calculateNodeValue(
        datum.children as Datum[],
        node.children,
        depth + 1,
        prevFlattenIndex,
        node,
        getNodeKey
      );
      node.value = isNil(datum.value) ? res.sum : Math.max(res.sum, node.value);

      prevFlattenIndex = res.flattenIndex;
      maxDepth = Math.max(res.maxDepth, maxDepth);
    } else {
      node.isLeaf = true;
      node.value = isNil(datum.value) ? 0 : datum.value;
    }

    sum += Math.abs(node.value);
    output.push(node);
  });

  return { sum, maxDepth, flattenIndex: prevFlattenIndex };
};

export const eachBefore = <NodeElement extends HierarchicalDatum, ContextType = any>(
  subTree: NodeElement[],
  callback: (node: NodeElement, index?: number, parent?: NodeElement, ctx?: ContextType) => ContextType,
  parent?: NodeElement,
  ctx?: ContextType
) => {
  let ctxRes = ctx;

  subTree.forEach((node, index) => {
    ctxRes = callback(node, index, parent, ctxRes);
    if (node.children?.length) {
      ctxRes = eachBefore(node.children as NodeElement[], callback, node, ctxRes);
    }
  });

  return ctx;
};

export const eachAfter = <NodeElement extends HierarchicalDatum, ContextType = any>(
  subTree: NodeElement[],
  callback: (node: NodeElement, index?: number, parent?: NodeElement, ctx?: ContextType) => ContextType,
  parent?: NodeElement,
  ctx?: ContextType
) => {
  let ctxRes = ctx;

  subTree.forEach((node, index) => {
    if (node.children?.length) {
      ctxRes = eachAfter(node.children as NodeElement[], callback, node, ctxRes);
    }
    ctxRes = callback(node, index, parent, ctxRes);
  });

  return ctxRes;
};
