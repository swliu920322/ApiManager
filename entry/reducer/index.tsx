import React, { useReducer } from "react";
import "../../less/apiManager.less";
import "../../less/common.less";
import LeftSide from "./LeftSide";
import RightSide from "./RightSide";
import { apiManagerReducer } from "../../logic";
import { initialState } from "../../logic/apiManager.reducer";

export default function ApiManager() {
  const [state, dispatch] = useReducer(apiManagerReducer, initialState);
  return (
    <div className="w-full h-full flex p-16 bg-white">
      <div style={{ minWidth: 300, width: "20%" }}>
        <LeftSide state={state} dispatch={dispatch} />
      </div>
      <div className="flex-1 over-hidden api-manager">
        <RightSide state={state} dispatch={dispatch} />
      </div>
    </div>
  );
}
