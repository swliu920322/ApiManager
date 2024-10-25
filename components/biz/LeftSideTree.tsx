import React, { useEffect } from "react";
import { Tree } from "antd";
import { netWorkRequestConfig } from "../../configs/sdk";
import { dealInit } from "../../utils/pageUtil";

export const LeftSideTree = (props: any) => {
  const { titleRender, init, apiTree } = props;
  const { getApiTree, expandAll } = netWorkRequestConfig;
  useEffect(() => {
    if (getApiTree) {
      getApiTree().then(init);
    } else {
      init(JSON.parse(dealInit()));
    }
  }, []);

  if (apiTree.length) {
    return (
      <Tree
        blockNode={true}
        showLine={{ showLeafIcon: false }}
        selectable={false}
        defaultExpandAll={expandAll}
        treeData={apiTree}
        titleRender={titleRender}
        className="menu-tree"
      />
    );
  }
  return null;
};
