import { Button, Input, Select } from "antd";
import { requestMethods } from "../../configs/schema";
import React, { useState } from "react";
import { IRequestInfo } from "../../types";

export function RightSideBase(props: any) {
  const { requestInfo, save } = props;
  const [itemInfo, setItemInfo] = useState<IRequestInfo>(requestInfo);

  function valueChange(key: string, val: any) {
    setItemInfo({ ...itemInfo, [key]: val });
  }

  return (
    <>
      <div className="flex items-center over-hidden">
        <Select
          style={{ width: 120 }}
          options={requestMethods}
          value={itemInfo.method}
          onSelect={value => valueChange("method", value)}
        />
        <Input
          className="flex-1 mr-10"
          value={itemInfo.url}
          placeholder="接口路径，'/'起始"
          onChange={value => valueChange("url", value.target.value)}
        />
        <Button type="primary" onClick={() => save(itemInfo)}>
          保存
        </Button>
      </div>
      <Input
        className="mt-10"
        value={itemInfo.title}
        placeholder="未命名接口"
        onChange={value => valueChange("title", value.target.value)}
      />
    </>
  );
}
