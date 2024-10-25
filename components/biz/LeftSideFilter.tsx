import { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import React from "react";

export function LeftSideFilter(props: any) {
  const { filterTree } = props;
  const [filterStr, setFilterStr] = useState("");
  useEffect(() => {
    filterTree(filterStr);
  }, [filterStr]);
  return (
    <Input
      className="mr-10"
      value={filterStr}
      prefix={<SearchOutlined />}
      allowClear={true}
      onChange={e => setFilterStr(e.target.value)}
    />
  );
}
