import React, { useRef } from "react";
import { Tabs, message } from "antd";
import { Body } from "./Body";
import { IRequestInfo } from "../../types/model";
import { netWorkRequestConfig } from "../../configs/sdk";
import { RightSideBase } from "./RightSideBase";
import { RightSideParams } from "./RightSideParams";

interface IRequest {
  requestInfo: IRequestInfo;
  updateRequest: (...args: any) => any;
}

export const RightSideRequest = (props: IRequest) => {
  const { updateRequest, requestInfo } = props;
  const paramRef = useRef<any>();

  async function save(itemInfo: {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    title: string;
  }) {
    const params = await paramRef.current.getParams();
    const data: IRequestInfo = {
      ...itemInfo,
      ...params,
      title: itemInfo.title || "未命名接口",
      responses: [
        {
          code: 200,
          name: "成功",
          jsonSchema: await responseRef.current.getJsonSchema()
        }
      ]
    };
    await netWorkRequestConfig?.saveRequest?.(data);
    updateRequest(data);
    message.success("保存成功");
  }

  const responseRef = useRef<any>();
  return (
    <div className="p-16 pt-0 h-full flex-col">
      <RightSideBase save={save} requestInfo={requestInfo} />
      <div className="flex-1 over-auto pt-10">
        <RightSideParams requestInfo={requestInfo} ref={paramRef} />
        <h3>返回响应</h3>
        <Tabs defaultValue="1">
          {requestInfo.responses.map((i, index) => {
            return (
              <Tabs.TabPane tab="成功(200)" key={index}>
                <Body key={i.code} ref={responseRef} body={i.jsonSchema} />
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};
