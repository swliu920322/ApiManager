import React from "react";
import { apiManagerAction } from "../../logic";
import { RightSideCommon } from "../../components";
import { delayFunc } from "../../utils/pageUtil";
import { getPartiFromProps } from "../../utils";

const actionTypes = [
  "updateRequest",
  "updateProject",
  "changeActiveIndex",
  "removePanelByIndex"
];

function RightSide(props: any) {
  const { state, dispatch } = props;

  const actionProps = actionTypes.reduce((r, c) => {
    return { ...r, [c]: delayFunc(apiManagerAction[c], dispatch) };
  }, {});
  return (
    <RightSideCommon
      {...actionProps}
      {...getPartiFromProps(state, [
        "apiMap",
        "rightPanels",
        "activePanelIndex"
      ])}
    />
  );
}

export default RightSide;
