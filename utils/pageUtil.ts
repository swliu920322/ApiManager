import { ApiList, ApiMap, INode } from "../types";
import {Dispatch} from "react";

export function dealOpenKeys(arr: INode[], openKeys: string[]) {
  arr?.forEach((i, index) => {
    if (i.children) {
      openKeys.push(i.key);
      dealOpenKeys(i.children, openKeys);
    }
  });
}

export function getMatchKeys(apiList: ApiList[], filterStr: string) {
  // 从后匹配，形成一个树状节点，如果已存在，则跳过，最后根据树keys，重新生成一个树
  const matchKeys: string[][] = [];
  apiList.forEach((i: ApiList) => {
    const matchArr = [i.title].filter(Boolean);
    if (matchArr.some(ii => ii.indexOf(filterStr) >= 0)) {
      matchKeys.push([...i.parentKeys, i.key]);
    }
  });
  return matchKeys;
}

export function findNodeByKeys(
  tree: INode[],
  keys: string[]
): {
  tree: INode[];
  node: INode;
  indexArr: number[];
} {
  return keys.reduce(
    (r, c) => {
      const matchIndex = r.tree?.findIndex(i => i.key === c);
      const match = r.tree?.[matchIndex];
      return {
        tree: match?.children,
        node: match,
        indexArr: [...r.indexArr, matchIndex]
      };
    },
    { tree, node: null, indexArr: [] }
  );
}

function buildTree(
  tree: INode[],
  keys: string[],
  length: number,
  parentTreeNode: Omit<INode, "children">,
  apiMap: ApiMap
) {
  if (keys.length < length) {
    return;
  }
  const { node } = findNodeByKeys(tree, keys.slice(0, length));
  if (node) {
    if (keys.length > length) {
      buildTree(tree, keys, length + 1, node, apiMap);
    }
  } else {
    const newNode = { ...apiMap[keys[length - 1]] };
    if (!newNode.requestInfo) {
      newNode.children = [];
    }
    if (keys.length > length) {
      buildTree(tree, keys, length + 1, newNode, apiMap);
    }
    if (length > 1) {
      if (parentTreeNode.children) {
        parentTreeNode.children.push(newNode);
      } else {
        parentTreeNode.children = [newNode];
      }
    } else {
      tree.push(newNode as INode);
    }
  }
}

// 有几种做法，1.循环对树进行标记，然后筛选掉未标记的，会对树遍历两遍
// 构建树，最后一个才是request，之前的都是project, 效率高点
// 从第一个元素开始查，查不到，就从根插入，如果查到了就下一个，查不到，在上一个的children里插入。
// 难点是怎么保存上一个，查到就扔到栈里，查不到，构建一个放栈里。
export function dealFilter(matchKeys: string[][], apiMap: ApiMap) {
  const resTree: INode[] = [];
  matchKeys.forEach(keys => {
    buildTree(resTree, keys, 1, apiMap[keys[0]], apiMap);
  });
  return resTree;
}

export function dealInit() {
  let val = localStorage.getItem("apiManager");
  if (val === "undefined" || !val) {
    val = "[]";
  }
  return val;
}

export function getNewListByReplaceValueByIndex(
  list: any[],
  index: number,
  value: Record<string, any>
) {
  const match = { ...list[index], ...value };
  return [...list.slice(0, index), match, ...list.slice(index + 1)];
}

export const delayFunc = (action: (...arg: any[]) => any, dispatch: Dispatch<any>) => (
  ...args: any[]
) => {
  dispatch(action(...args));
};