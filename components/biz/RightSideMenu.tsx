import React from "react";
import { CloseOutlined } from "@ant-design/icons";

export function RightSideMenu(props: any) {
  const { setVisible, curIndex, positionRef, visible } = props;
  const { removePanelByIndex, length } = props;
  const [left, top] = positionRef;

  function closeCur() {
    removePanelByIndex([curIndex]);
    setVisible(false);
  }

  function closeOther() {
    const indexArr = Array.from({ length }).map((_i, index) => index);
    indexArr.splice(curIndex, 1);
    removePanelByIndex(indexArr);
    setVisible(false);
  }

  function closeAll() {
    const indexArr = Array.from({ length }).map((_i, index) => index);
    removePanelByIndex(indexArr);
    setVisible(false);
  }

  if (visible) {
    return (
      <ul
        className="flex-col position-fixed menu-container"
        style={{ left, top }}
      >
        <li className="menu-container__item" onClick={closeCur}>
          <CloseOutlined />
          <span className="ml-10">关闭当前</span>
        </li>
        <li className="menu-container__item" onClick={closeOther}>
          <span style={{ marginLeft: 24 }}>关闭其他</span>
        </li>
        <li className="menu-container__item" onClick={closeAll}>
          <span style={{ marginLeft: 24 }}>关闭所有</span>
        </li>
      </ul>
    );
  }
  return null;
}
