import { ApiList, ApiMap, INode } from "../types";

export function transApiTreeToList(
  tree: INode[],
  apiMap: Record<string, Omit<INode, "children">>,
  parent?: INode,
  existParentKeys = [] as string[]
): ApiList[] {
  return tree.reduce((r, c) => {
    const { children, ...extra } = c;

    const parentKeys = [...existParentKeys, parent?.key].filter(i => !!i);
    const res = [...r, { ...extra, parentKeys }];
    apiMap[c.key] = { ...extra, parentKeys };
    if (children) {
      return [...res, ...transApiTreeToList(children, apiMap, c, parentKeys)];
    }
    return res;
  }, []);
}

export function apiListMapAddItem(
  apiList: ApiList[],
  apiMap: ApiMap,
  projectInfo: INode,
  parentKeys: string[]
) {
  apiMap[projectInfo.key] = { ...projectInfo, parentKeys };
  return [...apiList, { ...projectInfo, parentKeys }];
}

export function apiListMapUpdateItem(
  apiList: ApiList[],
  apiMap: ApiMap,
  projectInfo: Partial<INode>
) {
  const index = apiList.findIndex(i => i.key === projectInfo.key);
  const match = apiList[index];
  Object.keys(projectInfo).forEach((key: string) => {
    match[key] = projectInfo[key];
  });
  apiMap[projectInfo.key] = match;
}

export function apiListMapDeleteItem(
  apiList: ApiList[],
  apiMap: ApiMap,
  key: string
) {
  const index = apiList.findIndex(i => i.key === key);
  delete apiMap[key];
  return [...apiList.slice(0, index), ...apiList.slice(index + 1)];
}
