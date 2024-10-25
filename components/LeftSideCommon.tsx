import React, { memo, useRef, useState } from "react";
import { Button, Popover } from "antd";
import { PlusOutlined, HomeOutlined } from "@ant-design/icons";
import { LeftSideModal } from "./biz/LeftSideModal";
import { RootContent, TitleRender } from "./biz/LeftSideRender";
import { netWorkRequestConfig } from "../configs/sdk";
import message from "antd/lib/message";
import { LeftSideFilter } from "./biz/LeftSideFilter";
import { LeftSideTree } from "./biz/LeftSideTree";

export const LeftSideCommon = memo((props: any) => {
  const { addProject, openNewRequestByRoot, openNewRequestByTree } = props;
  const { removeItem, init, openProject, filterTree } = props;
  const { openExistRequest, apiTree } = props;

  const onSelect = (nodeData: any) => {
    const { key, children } = nodeData;
    children ? openProject(key) : openExistRequest(key);
  };
  const [isModalOpen, setModalVisible] = useState(false);
  const folderKeyRef = useRef<string>("");
  const setFolderKeyRef = (val?: string) => (folderKeyRef.current = val);

  async function saveProject(projectName: string) {
    await netWorkRequestConfig.saveProject?.({ projectName, isNew: true });
    addProject(projectName, folderKeyRef.current);
    message.success("保存目录成功!");
  }

  async function removeTree(nodeData: any) {
    const { key, children } = nodeData;
    await netWorkRequestConfig.removeProject?.(nodeData);
    removeItem(key, !children);
  }

  function titleRender(data: any) {
    return (
      <TitleRender
        nodeData={data}
        onSelect={onSelect}
        removeItem={removeTree}
        openNewRequestByTree={openNewRequestByTree}
        openModal={() => setModalVisible(true)}
        setFolderKeyRef={setFolderKeyRef}
      />
    );
  }

  return (
    <div className="p-10 pl-0 h-full flex-col">
      <LeftSideModal
        addProject={saveProject}
        isModalOpen={isModalOpen}
        setModalVisible={setModalVisible}
      />
      <div className="flex items-center">
        <LeftSideFilter filterTree={filterTree} />
        <Popover
          content={
            <RootContent
              openNewRequestByRoot={openNewRequestByRoot}
              openModal={() => {
                setModalVisible(true);
                setFolderKeyRef();
              }}
            />
          }
          trigger="hover"
        >
          <Button type="primary" shape="circle" icon={<PlusOutlined />} />
        </Popover>
      </div>
      <div className="flex items-center mt-10">
        <HomeOutlined />
        <span style={{ marginLeft: 6 }}>根目录</span>
      </div>
      <div className="flex-1 over-auto">
        <LeftSideTree init={init} apiTree={apiTree} titleRender={titleRender} />
      </div>
    </div>
  );
});
