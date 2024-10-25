import React, { Dispatch } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RightSideCommon } from "../../components";
import { apiManagerAction } from "../../logic";
import { getPartiFromProps } from "../../utils";

function RightSide(props: any) {
  return <RightSideCommon {...props} />;
}

function mapStateToProps(state: any) {
  return {
    ...getPartiFromProps(state.apiManagerReducer, [
      "apiMap",
      "rightPanels",
      "activePanelIndex"
    ])
  };
}

const actionTypes = [
  "updateRequest",
  "updateProject",
  "changeActiveIndex",
  "removePanelByIndex"
];

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return actionTypes.reduce((r, c) => {
    return {
      ...r,
      [c]: bindActionCreators(apiManagerAction[c], dispatch)
    };
  }, {});
}

export default connect(mapStateToProps, mapDispatchToProps)(RightSide as any);
