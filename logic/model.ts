import { IJSONSchema } from "../types";
import { INode, IRequestInfo } from "../types";
import { nanoid } from "nanoid";

function generateJson(): IJSONSchema {
  return {
    type: "object",
    properties: {},
    required: []
  };
}

// 右侧结构
export function generateRequestInfo(
  title = "",
  extraInfo?: Partial<IRequestInfo>
): IRequestInfo {
  return {
    title,
    url: "",
    key: "",
    method: "GET",
    parameters: {},
    requestBody: {
      jsonSchema: generateJson()
    },
    responses: [
      {
        code: 200,
        name: "成功",
        jsonSchema: generateJson()
      }
    ],
    ...extraInfo
  };
}

// 左侧结构
export function generateTreeNode(
  title: string,
  isFolder: boolean,
  info?: Record<string, any>
): INode {
  return {
    title,
    description: "",
    key: nanoid(),
    // uuid: nanoid(),
    ...info,
    ...(isFolder ? { children: [] } : { requestInfo: generateRequestInfo() })
  };
}
