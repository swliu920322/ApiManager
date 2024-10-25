import React, { Dispatch } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { LeftSideCommon } from "../../components";
import { apiManagerAction } from "../../logic";
import { getPartiFromProps } from "../../utils";

function LeftSide(props: any) {
  return <LeftSideCommon {...props} />;
}

function mapStateToProps(state: any) {
  return {
    ...getPartiFromProps(state.apiManagerReducer, ["apiTree", "apiList"])
  };
}

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

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return actionTypes.reduce((r, c) => {
    return {
      ...r,
      [c]: bindActionCreators(apiManagerAction[c], dispatch)
    };
  }, {});
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftSide);
