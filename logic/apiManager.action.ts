import { apiManagerConstants } from "./apiManager.constants";
import { INode, IProjectInfo, IRequestInfo } from "../types";

export const apiManagerAction = {
  init(apiTree: INode[]) {
    return { type: apiManagerConstants.INIT, payload: apiTree };
  },
  filterTree(str: string) {
    return { type: apiManagerConstants.FILTER_TREE, payload: str };
  },
  addProject(projectName: string, parentKey?: string) {
    return {
      type: apiManagerConstants.ADD_PROJECT,
      payload: { title: projectName, parentKey }
    };
  },
  updateProject(projectInfo: IProjectInfo) {
    return {
      type: apiManagerConstants.UPDATE_PROJECT,
      payload: projectInfo
    };
  },
  updateRequest(requestInfo: IRequestInfo) {
    if (requestInfo.key) {
      return {
        type: apiManagerConstants.UPDATE_EXIST_REQUEST,
        payload: requestInfo
      };
    }
    return {
      type: apiManagerConstants.UPDATE_NEW_REQUEST,
      payload: requestInfo
    };
  },
  openProject(key: string) {
    return {
      type: apiManagerConstants.OPEN_PROJECT,
      payload: key
    };
  },

  // 从根打开，归属根
  // OPEN_NEW_REQUEST_ROOT = "OPEN_NEW_REQUEST_ROOT",
  // // 从目录打开，归属该目录
  // OPEN_NEW_REQUEST_CATEGORY = "OPEN_NEW_REQUEST_CATEGORY",
  // // 从API打开，保存时归属该API父类，保持同级
  // OPEN_NEW_REQUEST_API = "OPEN_NEW_REQUEST_API",
  // OPEN_EXIST_REQUEST = "OPEN_EXIST_REQUEST",
  openNewRequestByRoot() {
    return {
      type: apiManagerConstants.OPEN_NEW_REQUEST_ROOT,
      payload: ""
    };
  },
  openNewRequestByTree(key: string) {
    return {
      type: apiManagerConstants.OPEN_NEW_REQUEST_TREE,
      payload: key
    };
  },
  openExistRequest(key: string) {
    return {
      type: apiManagerConstants.OPEN_EXIST_REQUEST,
      payload: key
    };
  },

  removeItem(key: string, isRequest = false) {
    if (isRequest) {
      return {
        type: apiManagerConstants.DELETE_REQUEST,
        payload: key
      };
    }
    return {
      type: apiManagerConstants.DELETE_PROJECT,
      payload: key
    };
  },
  changeActiveIndex(key: string) {
    return {
      type: apiManagerConstants.CHANGE_ACTIVE_INDEX,
      payload: key
    };
  },
  removePanelByIndex(key: string[]) {
    return {
      type: apiManagerConstants.REMOVE_PANEL_BY_KEY,
      payload: key
    };
  }
};
