import { Button, Divider, Popconfirm, Popover } from "antd";
import React from "react";
import {
  DashOutlined,
  FolderOpenOutlined,
  PlusOutlined
} from "@ant-design/icons";

const ExtraContent = (props: any) => {
  const { nodeData, openNewRequestByTree, openModal, removeItem } = props;
  const { setFolderKeyRef } = props;
  const { children, title, key } = nodeData;
  return (
    <div className="flex-col">
      {children ? (
        <>
          <span
            className="operate-item"
            onClick={e => {
              e?.stopPropagation();
              openNewRequestByTree(key);
            }}
          >
            添加接口
          </span>
          <span
            className="operate-item"
            onClick={e => {
              e.stopPropagation();
              setFolderKeyRef(key);
              openModal();
            }}
          >
            添加子目录
          </span>
        </>
      ) : null}
      <Popconfirm
        title={`确定要删除${title}${children ? "目录" : "接口"}么`}
        onConfirm={e => {
          e.stopPropagation();
          removeItem(nodeData);
        }}
      >
        <span className="operate-item" onClick={e => e.stopPropagation()}>
          删除
        </span>
      </Popconfirm>
    </div>
  );
};

export const RootContent = (props: any) => {
  const { openNewRequestByRoot, openModal } = props;
  return (
    <div className="flex-col">
      <Button type="text" onClick={() => openModal()}>
        新建目录
      </Button>
      <Divider style={{ margin: "5px 0" }} />
      <Button type="text" onClick={() => openNewRequestByRoot()}>
        新建接口
      </Button>
    </div>
  );
};

export const TitleRender = (props: any) => {
  const { nodeData, onSelect, openNewRequestByTree } = props;
  const { children, requestInfo, title, key } = nodeData;
  return (
    <div className={`flex items-center`} onClick={() => onSelect(nodeData)}>
      <div className="flex-1 flex items-center over-hidden">
        {requestInfo ? (
          <span
            title={requestInfo.method}
            className="method"
            style={{ width: 40 }}
          >
            {requestInfo.method}
          </span>
        ) : (
          <FolderOpenOutlined style={{ marginRight: 5 }} />
        )}
        <span className="text-ellipsis flex-1">
          {title}
          {children?.length ? `（${children.length}）` : null}
        </span>
      </div>
      <div className="icon-operate items-center ml-10 operate-area">
        {children ? (
          <Popover content="添加接口">
            <PlusOutlined
              onClick={e => {
                e.stopPropagation();
                openNewRequestByTree(key);
              }}
            />
          </Popover>
        ) : null}
        <Popover content={<ExtraContent {...props} />}>
          <DashOutlined
            onClick={e => {
              e.stopPropagation();
            }}
          />
        </Popover>
      </div>
    </div>
  );
};
