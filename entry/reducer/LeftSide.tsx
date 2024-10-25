import React from "react";
import { apiManagerAction } from "../../logic";
import { LeftSideCommon } from "../../components";
import { getPartiFromProps } from "../../utils";
import { delayFunc } from "../../utils/pageUtil";

const actionTypes = [
  "addProject",
  "openProject",
  "init",
  "removeItem",
  "openNewRequestByRoot",
  "openNewRequestByTree",
  "openExistRequest",
  "filterTree"
];

export default function LeftSide(props: any) {
  const { state, dispatch } = props;
  const actionProps = actionTypes.reduce((r, c) => {
    return { ...r, [c]: delayFunc(apiManagerAction[c], dispatch) };
  }, {});

  return (
    <LeftSideCommon
      {...actionProps}
      {...getPartiFromProps(state, ["apiTree", "apiList"])}
    />
  );
}
