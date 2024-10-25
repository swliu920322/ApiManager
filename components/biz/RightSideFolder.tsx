import React, {useEffect, useMemo} from "react";
import {Button, Col, Form, Input, Row} from "antd";
import {netWorkRequestConfig} from "../../configs/sdk";

export function RightSideFolder(props: any) {
	const {projectInfo, updateProject} = props;
	const [form] = Form.useForm();
	useEffect(() => {
		form.setFieldsValue(projectInfo);
	}, [projectInfo]);

	async function update() {
		const r = await form.validateFields();
		const data = {...projectInfo, ...r};
		await netWorkRequestConfig?.saveProject?.(data);
		updateProject(data);
	}

	const {folderRender} = netWorkRequestConfig;
	const customRender = useMemo(() => {
		if (folderRender) {
			return folderRender({
				labelCol: {span: 4},
				wrapperCol: {span: 16}
			});
		}
		return null;
	}, [folderRender]);
	return (
		<div className="p-16 pt-0 h-full flex-col over-auto">
			<h3>基本信息</h3>
			<Form
				labelCol={{span: 4}}
				wrapperCol={{span: 16}}
				form={form}
				className="mb-10 flex-1"
			>
				<Form.Item label="名称" name="title">
					<Input/>
				</Form.Item>
				<Form.Item label="备注" name="description">
					<Input.TextArea/>
				</Form.Item>
				{customRender}
				<Row>
					<Col span={16} offset={4}>
						<Button type="primary" onClick={update}>
							更新
						</Button>
					</Col>
				</Row>
			</Form>
		</div>
	);
}
