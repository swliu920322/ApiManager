import { Button, Modal, Tabs, message } from "antd";
import { ComplexData } from "../schema";
import React, { forwardRef, useRef, useState } from "react";
import { JsonEditor } from "../common";
import { IJSONSchema } from "../../types";

interface IBody {
  body: IJSONSchema;
}

export const Body = forwardRef((props: IBody, ref) => {
  const { body } = props;
  const [bodyTab, setBodyTab] = useState("0");
  const [visible, setVisible] = useState(false);
  const editorRef = useRef<any>();
  const bodyValueRef = useRef(body);

  function save() {
    const val = editorRef.current.getValue();
    try {
      bodyValueRef.current = JSON.parse(val);
      setVisible(false);
    } catch (e) {
      message.error("JSON Schema 校验失败");
      console.error(e);
    }
  }

  function cancel() {
    editorRef.current.setValue(JSON.stringify(bodyValueRef.current, null, 2));
    setVisible(false);
  }

  function setFunc(value: IJSONSchema) {
    bodyValueRef.current = value;
  }

  function openSchema() {
    setTimeout(() => {
      setVisible(true);
    });
  }

  return (
    <>
      {/*@ts-ignore*/}
      <Modal
        centered={true}
        visible={visible}
        width={"70%"}
        title="JSON Editor"
        onCancel={cancel}
        onOk={save}
        okText="保存"
      >
        <JsonEditor
          ref={editorRef}
          json={JSON.stringify(bodyValueRef.current, null, 2)}
        />
      </Modal>
      <Tabs
        tabBarExtraContent={<Button onClick={openSchema}>JSON Schema</Button>}
        activeKey={bodyTab}
        onChange={setBodyTab}
      >
        <Tabs.TabPane tab="数据结构" key="0" />
      </Tabs>
      <div className={bodyTab !== "0" ? "display-none" : ""}>
        <ComplexData
          setBodyValue={setFunc}
          ref={ref}
          data={bodyValueRef.current}
        />
      </div>
    </>
  );
});
