import { IApiManager } from "../types/model";
import { IAction } from "../types";
import { apiManagerConstants } from "./apiManager.constants";
import { netWorkRequestConfig } from "../configs/sdk";

const saveTypes: string[] = [
  apiManagerConstants.ADD_PROJECT,
  apiManagerConstants.UPDATE_PROJECT,
  apiManagerConstants.UPDATE_NEW_REQUEST,
  apiManagerConstants.UPDATE_EXIST_REQUEST,
  apiManagerConstants.DELETE_PROJECT,
  apiManagerConstants.DELETE_REQUEST
];

export function dealTypeWithReducer(state: IApiManager, action: IAction): any {
  const { type } = action;
  if (saveTypes.indexOf(type) >= 0) {
    const { useStorage } = netWorkRequestConfig;
    if (useStorage) {
      localStorage.setItem("apiManager", JSON.stringify(state.apiFullTree));
    }
  }
}
