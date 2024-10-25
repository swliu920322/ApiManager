import React from "react";
import "../../less/apiManager.less";
import "../../less/common.less";
import LeftSideRedux from "./LeftSide";
import RightSideRedux from "./RightSide";

export default function ApiManager() {
  return (
    <div className="w-full h-full flex p-16 bg-white">
      <div style={{ minWidth: 300, width: "20%" }}>
        <LeftSideRedux />
      </div>
      <div className="flex-1 over-hidden api-manager">
        <RightSideRedux />
      </div>
    </div>
  );
}
