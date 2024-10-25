import { IJsonArr, IJSONSchema } from "./schema";

export interface IProjectInfo {
  [prop: string]: any;

  title: string;
  description: string;
}

export type ApiList = Omit<INode, "children"> & { parentKeys: string[] };
export type ApiMap = Record<string, Omit<INode, "children">>;

// 页面先去apiMap里找，找到的话，分组件渲染，找不到的话，就是正在新增的接口
export interface IRightPanel {
  key: string; // 唯一标识，新增的话，new 一个，
  parentKey?: string; // 父亲标识,新增的时候要传
  title: string;
}

export interface IApiManager {
  apiFullTree: INode[];
  apiTree: INode[];
  apiList: ApiList[];
  apiMap: ApiMap;
  rightPanels: IRightPanel[];
  activePanelIndex: number;
}

export interface INode extends IProjectInfo {
  key: string;
  requestInfo?: IRequestInfo;
  children?: INode[];
}

export interface IRequestInfo {
  key?: string;
  parentKey?: string;

  title: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  parameters: {
    query?: IJsonArr[];
    header?: IJsonArr[];
    cookie?: IJsonArr[];
  };
  requestBody: {
    jsonSchema: IJSONSchema;
  };
  responses: Array<{
    code: number;
    name: string;
    jsonSchema: IJSONSchema;
  }>;
}

export interface IFormRef {
  setFieldsValue: (formData: Record<string, any>) => void;
  validateFields: () => Promise<Record<string, any>>;
}
