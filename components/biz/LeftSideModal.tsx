import { Form, Input, Modal } from "antd";
import React from "react";

export const LeftSideModal = (props: any) => {
  const { isModalOpen, setModalVisible } = props;

  function closeModal() {
    setModalVisible(false);
  }

  const [form] = Form.useForm();

  function addProject() {
    form
      .validateFields()
      .then(r => {
        props.addProject(r.projectName);
      })
      .then(() => {
        form.resetFields();
      })
      .then(() => {
        closeModal();
      });
  }

  return (
    // @ts-ignoreWX
    <Modal
      visible={isModalOpen}
      title="新增"
      onOk={addProject}
      onCancel={closeModal}
    >
      <Form form={form}>
        <Form.Item
          name="projectName"
          label="项目名称"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
