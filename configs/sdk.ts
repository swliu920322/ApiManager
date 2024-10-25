import { INetWorkProps } from "../types/sdk";

export const netWorkRequestConfig: INetWorkProps = {
  getApiTree: undefined,
  saveProject: undefined,
  removeProject: undefined,
  saveRequest: undefined,
  removeRequest: undefined,
  useStorage: true,
  expandAll: true,
  folderRender: undefined
};
export const setRequestConfig = (nextConfig: INetWorkProps) => {
  Object.keys(nextConfig).forEach(key => {
    netWorkRequestConfig[key] = nextConfig[key];
  });
};
