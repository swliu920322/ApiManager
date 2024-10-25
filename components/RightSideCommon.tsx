import React, { memo, useMemo, useRef, useState } from "react";
import { Tabs } from "antd";
import { IRightPanel } from "../types";
import { RightCache } from "./biz/RightCache";
import { RightSideMenu } from "./biz/RightSideMenu";

export const RightSideCommon = memo(
  (props: any) => {
    const {
      changeActiveIndex,
      removePanelByIndex,
      updateRequest,
      updateProject
    } = props;
    const { rightPanels, activePanelIndex, apiMap } = props;

    function findIndexByKey(key: string) {
      return rightPanels.findIndex((i: { key: string }) => i.key === key);
    }

    function changeActive(key: string) {
      changeActiveIndex(findIndexByKey(key));
    }

    const activeKey = useMemo(() => {
      if (rightPanels.length) {
        return rightPanels[activePanelIndex]?.key;
      }
      return "";
    }, [rightPanels, activePanelIndex]);

    function onRemove(key: string) {
      removePanelByIndex([findIndexByKey(key)]);
    }

    const [visible, setVisible] = useState(false);
    const indexRef = useRef<number>();
    const positionRef = useRef<number[]>([]);
    // 显示右键菜单的函数
    const showMenu = (e: any, index: number) => {
      e.preventDefault();
      const { clientX, clientY } = e.nativeEvent;
      setVisible(false);
      indexRef.current = index;
      positionRef.current = [clientX, clientY];
      setTimeout(() => setVisible(true));
    };

    return (
      <>
        <RightSideMenu
          length={rightPanels.length}
          visible={visible}
          curIndex={indexRef.current}
          positionRef={positionRef.current}
          setVisible={setVisible}
          removePanelByIndex={removePanelByIndex}
        />
        <Tabs
          className="h-full over-hidden tabs-total"
          activeKey={activeKey}
          onChange={changeActive}
          type="editable-card"
          onEdit={onRemove}
          hideAdd={true}
        >
          {rightPanels.map((panel: IRightPanel, index: number) => {
            return (
              <Tabs.TabPane
                key={panel.key}
                tab={
                  <div
                    onContextMenu={e => showMenu(e, index)}
                    style={{ width: 100 }}
                    className="text-ellipsis"
                  >
                    {panel.title}
                  </div>
                }
              >
                <RightCache
                  key={panel.key}
                  apiMap={apiMap}
                  panel={panel}
                  updateRequest={updateRequest}
                  updateProject={updateProject}
                />
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      JSON.stringify(prevProps.rightPanels) ===
        JSON.stringify(nextProps.rightPanels) &&
      prevProps.activePanelIndex === nextProps.activePanelIndex
    );
  }
);
