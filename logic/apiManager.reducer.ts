import { apiManagerConstants } from "./apiManager.constants";
import { generateTreeNode } from "./model";
import { IApiManager, INode, IRightPanel } from "../types/model";
import { IAction } from "../types";
import { dealTypeWithReducer } from "./apiManager.deal";
import {
  dealFilter,
  findNodeByKeys,
  getMatchKeys,
  getNewListByReplaceValueByIndex
} from "../utils/pageUtil";
import {
  apiListMapAddItem,
  apiListMapDeleteItem,
  apiListMapUpdateItem,
  transApiTreeToList
} from "../utils/apiData";
import { nanoid } from "nanoid";

export const initialState: IApiManager = {
  // api全量树,
  apiFullTree: [],
  // api展示树, 展示树的所有操作都要对应全量树,和apiList,apiMap
  apiTree: [],
  // 左侧铺平list结构
  apiList: [],
  // 左侧map用于查找
  apiMap: {},
  //右侧数据面板
  rightPanels: [],
  activePanelIndex: -1
};

function dealReducer(state = initialState, action: IAction): IApiManager {
  const { type, payload } = action;
  switch (type) {
    // OK
    case apiManagerConstants.INIT: {
      const apiMap = {};
      const apiList = transApiTreeToList(payload, apiMap);
      return {
        ...state,
        apiTree: payload,
        apiList,
        apiFullTree: payload,
        apiMap
      };
    }
    // OK
    case apiManagerConstants.FILTER_TREE: {
      if (payload) {
        const { apiList, apiMap } = state;
        const matchKeys = getMatchKeys(apiList, payload);
        const resTree = dealFilter(matchKeys, apiMap);
        return { ...state, apiTree: resTree };
      }
      return { ...state, apiTree: state.apiFullTree };
    }
    // OK 新增，根据key找到父节点，插入
    case apiManagerConstants.ADD_PROJECT:
    case apiManagerConstants.UPDATE_NEW_REQUEST: {
      const { parentKey, method, title } = payload;
      const { apiList, apiMap, apiTree, apiFullTree } = state;
      const isRequest = !!method;
      const projectInfo = generateTreeNode(title, !isRequest);
      const { rightPanels, activePanelIndex } = state;

      let newRightPanel = rightPanels;
      if (isRequest) {
        projectInfo.requestInfo = { ...payload, key: projectInfo.key };
        newRightPanel = getNewListByReplaceValueByIndex(
          rightPanels,
          activePanelIndex,
          {
            key: projectInfo.key,
            title
          }
        );
      }

      let parentArr: string[] = [];
      if (parentKey) {
        const parent = apiMap[parentKey];
        parentArr = [...parent?.parentKeys, parent?.key];
        const { node } = findNodeByKeys(apiTree, parentArr);
        node.children.push(projectInfo);
        const { node: match } = findNodeByKeys(apiFullTree, parentArr);
        if (node !== match) {
          match.children.push(projectInfo);
        }
      } else {
        apiTree.push(projectInfo);
        if (apiTree !== apiFullTree) {
          apiFullTree.push(projectInfo);
        }
      }
      const r = apiListMapAddItem(apiList, apiMap, projectInfo, parentArr);
      return {
        ...state,
        apiTree: [...apiTree],
        apiMap: { ...apiMap },
        apiList: r,
        apiFullTree: [...apiFullTree],
        rightPanels: newRightPanel
      };
    }
    // OK
    case apiManagerConstants.UPDATE_PROJECT:
    case apiManagerConstants.UPDATE_EXIST_REQUEST: {
      const { apiList, apiMap, apiTree, apiFullTree } = state;
      const { key: curKey } = payload as INode;
      const cur = apiMap[curKey];
      const curKeys = [...cur?.parentKeys, cur.key];
      const { node } = findNodeByKeys(apiTree, curKeys);
      const { node: fullNode } = findNodeByKeys(apiFullTree, curKeys);
      let projectInfo = payload;
      if (!!payload?.method) {
        node.title = payload.title;
        Object.keys(payload).forEach(key => {
          node.requestInfo[key] = payload[key];
          if (node !== fullNode) {
            fullNode.requestInfo[key] = payload[key];
          }
        });
        projectInfo = {
          ...projectInfo,
          title: payload.title,
          requestInfo: payload
        };
      } else {
        Object.keys(payload || {}).forEach(key => {
          node[key] = payload[key];
          if (node !== fullNode) {
            fullNode[key] = payload[key];
          }
        });
      }
      apiListMapUpdateItem(apiList, apiMap, projectInfo);

      const { rightPanels, activePanelIndex } = state;
      return {
        ...state,
        apiTree: [...apiTree],
        apiFullTree: [...apiFullTree],
        apiMap: { ...apiMap },
        apiList: [...apiList],
        rightPanels: getNewListByReplaceValueByIndex(
          rightPanels,
          activePanelIndex,
          { title: payload.title }
        )
      };
    }
    // OK
    case apiManagerConstants.OPEN_PROJECT:
    case apiManagerConstants.OPEN_EXIST_REQUEST: {
      const isIn = state.rightPanels.findIndex(i => i.key === payload);
      let newPanel: IRightPanel | null = null;
      if (isIn < 0) {
        newPanel = {
          key: payload,
          title: state.apiMap[payload].title
        };
        state.activePanelIndex = state.rightPanels.length;
      } else {
        state.activePanelIndex = isIn;
      }
      return {
        ...state,
        rightPanels: newPanel
          ? [...state.rightPanels, newPanel]
          : state.rightPanels
      };
    }
    // OK
    case apiManagerConstants.OPEN_NEW_REQUEST_ROOT:
    case apiManagerConstants.OPEN_NEW_REQUEST_TREE: {
      return {
        ...state,
        activePanelIndex: state.rightPanels.length,
        rightPanels: [
          ...state.rightPanels,
          {
            key: nanoid(),
            title: "新建接口",
            parentKey: payload
          }
        ]
      };
    }
    // OK
    case apiManagerConstants.DELETE_PROJECT:
    case apiManagerConstants.DELETE_REQUEST: {
      const { apiList, apiMap, apiTree, apiFullTree } = state;
      const current = apiMap[payload];
      const parentKeys = current.parentKeys;
      if (parentKeys.length === 0) {
        const index = apiTree.findIndex(i => i.key === payload);
        apiTree.splice(index, 1);
        if (apiTree !== apiFullTree) {
          const fullIndex = apiFullTree.findIndex(i => i.key === payload);
          apiFullTree.splice(fullIndex, 1);
        }
      } else {
        const { node } = findNodeByKeys(apiTree, parentKeys);
        const index = node.children.findIndex(i => i.key === payload);
        node.children.splice(index, 1);
        const { node: fullNode } = findNodeByKeys(apiFullTree, parentKeys);
        if (node !== fullNode) {
          const fullIndex = fullNode.children.findIndex(i => i.key === payload);
          fullNode.children.splice(fullIndex, 1);
        }
      }
      const inPanelIndex = state.rightPanels.findIndex(i => i.key === payload);
      const r = apiListMapDeleteItem(apiList, apiMap, payload);
      if (inPanelIndex > -1) {
        state.rightPanels.splice(inPanelIndex, 1);
        if (state.rightPanels[inPanelIndex] === undefined) {
          state.activePanelIndex = state.rightPanels.length - 1;
        }
      }
      return {
        ...state,
        apiTree: [...apiTree],
        apiFullTree: [...apiFullTree],
        apiMap: { ...apiMap },
        apiList: r,
        rightPanels: [...state.rightPanels]
      };
    }
    case apiManagerConstants.CHANGE_ACTIVE_INDEX: {
      return { ...state, activePanelIndex: payload };
    }
    case apiManagerConstants.REMOVE_PANEL_BY_KEY: {
      const { rightPanels, activePanelIndex } = state;
      const panels = rightPanels.filter(
        (_i, index) => payload.indexOf(index) < 0
      );
      if (panels[activePanelIndex] === undefined) {
        state.activePanelIndex = panels.length - 1;
      }
      return {
        ...state,
        rightPanels: panels
      };
    }
    default:
      return state;
  }
}

export const apiManagerReducer = (state = initialState, action: any) => {
  const res = dealReducer(state, action);
  dealTypeWithReducer(res, action);
  return res;
};
