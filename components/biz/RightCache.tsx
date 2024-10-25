import React, { memo } from "react";
import { RightSideRequest } from "./RightSideRequest";
import { RightSideFolder } from "./RightSideFolder";
import { generateRequestInfo } from "../../logic/model";

export const RightCache = memo(
  (props: any) => {
    const { panel, updateRequest, updateProject, apiMap } = props;
    const { key, parentKey } = panel;
    let info = apiMap[key];
    if (!info) {
      // 新增只有接口
      info = {
        title: "新建接口",
        requestInfo: { ...generateRequestInfo(""), parentKey }
      };
    } else {
      if (!info.requestInfo) {
        return (
          <RightSideFolder updateProject={updateProject} projectInfo={info} />
        );
      }
      info.requestInfo.key = key;
    }
    return (
      <RightSideRequest
        updateRequest={updateRequest}
        requestInfo={info.requestInfo}
      />
    );
  },
  (prevProps, nextProps) => {
    return prevProps.panel.key === nextProps.panel.key;
  }
);
