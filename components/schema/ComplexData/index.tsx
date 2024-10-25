import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Popover, Select, Tree } from "antd";
import {
  addNodeByIndex,
  changeNodeType,
  dealSchemaToTree,
  dealTreeToSchema,
  removeFormTree
} from "./logic";
import { scrollToElementIfNotInViewport } from "../../../utils/schema";
import { allTypeOptions } from "../../../configs/schema";
import { IComplexDataProps, IJsonTree } from "../../../types/schema";
import { CanEditNode, RequiredItem, RotateConfirm } from "../../common";

export const ComplexData = memo(
  forwardRef((props: IComplexDataProps, ref: any) => {
    const { data, setBodyValue } = props;
    const [jsonTree, setJsonTree] = useState<IJsonTree[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [editIndex, setEditIndex] = useState<number[]>([]);

    const stateRef = useRef(editIndex);

    useEffect(() => {
      stateRef.current = editIndex;
    }, [editIndex]);

    console.time("ComplexData");
    useEffect(() => {
      const { res, openKeys } = dealSchemaToTree(data);
      setJsonTree(res);
      setExpandedKeys(openKeys);
    }, [data]);

    function setParent() {
      setBodyValue(getJsonSchema());
    }

    useEffect(() => {
      document.addEventListener("click", handleOutsideClick);
      return () => {
        document.removeEventListener("click", handleOutsideClick);
      };
    }, [editIndex]);

    function handleOutsideClick(e: any) {
      if (
        [...e.target.classList]?.indexOf("edit-item") < 0 &&
        stateRef.current.length
      ) {
        setEditIndex([]);
        setParent();
      }
    }

    function removeItem(indexArr: number[]) {
      removeFormTree(indexArr, jsonTree);
      setJsonTree([...jsonTree]);
      setParent();
    }

    function onSelect(type: string, oriType: string, indexArr: number[]) {
      if (type !== oriType) {
        const res = changeNodeType(jsonTree[0], indexArr, type, oriType);
        setJsonTree([...jsonTree]);
        setParent();
        if (res) {
          const { newIndexArr, openKey } = res;
          if (newIndexArr.length) {
            setTimeout(() => {
              setEditIndex(newIndexArr);
            });
          }
          if (openKey) {
            setExpandedKeys([...expandedKeys, openKey]);
          }
        }
      }
    }

    function addNode(indexArr: number[], isChild?: boolean) {
      const newIndexArr = addNodeByIndex(jsonTree[0], indexArr, isChild);
      setJsonTree([...jsonTree]);
      setParent();
      setTimeout(() => {
        setEditIndex([...newIndexArr, 0]);
        scrollToElementIfNotInViewport(newIndexArr.join(","));
      });
    }

    /* type 为 object 可以给子类加属性， parent.type 为object 可以给父类加子属性*/
    function renderAdd(nodeData: IJsonTree) {
      const { type, parent, indexArr } = nodeData;
      if (type === "object" && parent?.type === "object") {
        const content = (
          <div className="flex-col">
            <span
              className="operate-item"
              onClick={() => addNode(indexArr, true)}
            >
              添加子节点
            </span>
            <span className="operate-item" onClick={() => addNode(indexArr)}>
              添加相邻节点
            </span>
          </div>
        );
        return (
          <Popover content={content}>
            <PlusCircleOutlined onClick={() => addNode(indexArr)} />
          </Popover>
        );
      } else if (type === "object") {
        return (
          <Popover content="添加子节点">
            <PlusCircleOutlined onClick={() => addNode(indexArr, true)} />
          </Popover>
        );
      } else if (parent?.type === "object") {
        return (
          <Popover content="添加相邻节点">
            <PlusCircleOutlined onClick={() => addNode(indexArr)} />
          </Popover>
        );
      }
      return <span className="p-10" />;
    }

    function titleRender(nodeData: IJsonTree) {
      const { title, key, type, indexArr, description } = nodeData;
      return (
        <div
          className="flex items-center"
          style={{ gap: 10 }}
          id={indexArr.join(",")}
        >
          <div
            className="flex-1"
            onClick={() => setEditIndex([...indexArr, 0])}
          >
            <CanEditNode
              indexArr={[...indexArr, 0]}
              title={title}
              valueChange={value => (nodeData.title = value)}
              placeholder="字段名"
              editIndexKeys={editIndex}
            />
          </div>
          <div
            className="flex items-center required-container"
            style={{ width: 200 }}
          >
            <Select
              className="type-item"
              value={type}
              onSelect={e => onSelect(e, type, indexArr)}
              options={allTypeOptions}
            />
            {title !== "ITEMS" && key !== "root" ? (
              <RequiredItem
                value={nodeData.required}
                onChange={value => (nodeData.required = value)}
              />
            ) : null}
          </div>

          <div
            style={{ width: 200 }}
            onClick={() => setEditIndex([...indexArr, 1])}
          >
            <CanEditNode
              indexArr={[...indexArr, 1]}
              title={description}
              placeholder="说明"
              valueChange={value => (nodeData.description = value)}
              editIndexKeys={editIndex}
            />
          </div>
          <div
            style={{ width: 50, gap: 8 }}
            className="flex items-center operate-area"
          >
            {renderAdd(nodeData)}
            <div
              style={{
                display: title !== "ITEMS" && key !== "root" ? "block" : "none"
              }}
            >
              <RotateConfirm onClick={() => removeItem(indexArr)} />
            </div>
          </div>
        </div>
      );
    }

    function getJsonSchema() {
      setEditIndex([]);
      return dealTreeToSchema(jsonTree[0]);
    }

    useImperativeHandle(ref, () => {
      return {
        getJsonSchema
      };
    });
    console.timeEnd("ComplexData");
    if (jsonTree.length) {
      return (
        <Tree
          treeData={jsonTree}
          selectable={false}
          expandedKeys={expandedKeys}
          showLine={true}
          onExpand={(e: string[]) => setExpandedKeys(e)}
          titleRender={titleRender}
          blockNode={true}
        />
      );
    }
    return null;
  })
);
