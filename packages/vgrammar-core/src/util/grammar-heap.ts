type CompareFunc = (a: any, b: any) => number;

/**
 * moveToHead - Moves an element down the array until the target element is `smallar` than all the elements in head
 *
 * @param {any[]} array - The array to sift through
 * @param {number} start - The start index of the element
 * @param {number} idx - The index of the element to sift down
 * @param {CompareFunc} cmp - The function used to compare elements in the array
 * @returns {any[]} - The updated array with the sifted element in the correct position
 */
function moveToHead(array: any[], idx: number, start: number, cmp: CompareFunc) {
  let parent;
  let pidx;

  const item = array[idx];
  // Move the element down the array
  while (idx > start) {
    pidx = Math.floor((idx - 1) / 2);
    parent = array[pidx];
    if (cmp(item, parent) < 0) {
      array[idx] = parent;
      idx = pidx;
      continue;
    }
    break;
  }
  return (array[idx] = item);
}

/**
 * moveToTail - Moves an element up the array until the target element is `greater` than all the elements in tail
 *
 * @param {any[]} array - The array to sift through
 * @param {number} idx - The index of the element to sift up
 * @param {CompareFunc} cmp - The function used to compare elements in the array
 * @returns {any[]} - The updated array with the sifted element in the correct position
 */
function moveToTail(array: any[], idx: number, end: number | undefined, cmp: CompareFunc) {
  const start = idx;
  const endIdx = end ?? array.length;
  const item = array[idx];
  let cidx = idx * 2 + 1;
  let ridx;

  // Move the element up the array until it is in the correct position
  while (cidx < endIdx) {
    ridx = cidx + 1;
    if (ridx < endIdx && cmp(array[cidx], array[ridx]) >= 0) {
      cidx = ridx;
    }
    array[idx] = array[cidx];
    idx = cidx;
    cidx = idx * 2 + 1;
  }
  array[idx] = item;
  return moveToHead(array, idx, start, cmp);
}

export class Heap {
  protected compare: CompareFunc;

  protected nodes: any[];

  constructor(compare: CompareFunc) {
    this.compare = compare;
    this.nodes = [];
  }

  size() {
    return this.nodes.length;
  }

  last() {
    return this.nodes[0];
  }

  validate() {
    for (let i = this.nodes.length - 1; i > 0; i -= 1) {
      const parentIndex = Math.floor((i - 1) / 2);
      if (this.compare(this.nodes[parentIndex], this.nodes[i]) > 0) {
        return false;
      }
    }
    return true;
  }

  push(node: any) {
    if (this.nodes.includes(node)) {
      // node 的排序等级可能变更，需要重新执行 排序
      const index = this.nodes.indexOf(node);
      moveToHead(this.nodes, index, 0, this.compare);
      return moveToTail(this.nodes, index, null, this.compare);
    }
    this.nodes.push(node);
    return moveToHead(this.nodes, this.nodes.length - 1, 0, this.compare);
  }

  remove(node: any) {
    if (this.nodes.includes(node)) {
      const index = this.nodes.indexOf(node);

      this.nodes = this.nodes.slice(0, index).concat(this.nodes.slice(index + 1));

      moveToHead(this.nodes, index, 0, this.compare);
      moveToTail(this.nodes, index, null, this.compare);
    }
  }

  pop() {
    const last = this.nodes.pop();
    let item;

    if (this.nodes.length) {
      item = this.nodes[0];
      this.nodes[0] = last;

      moveToTail(this.nodes, 0, null, this.compare);
    } else {
      item = last;
    }
    return item;
  }

  clear() {
    this.nodes = [];
  }
}
