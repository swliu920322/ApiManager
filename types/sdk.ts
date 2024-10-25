import {INode} from "../types/model";
import React from "react";

export interface INetWorkProps {
	getApiTree?: () => Promise<INode[]>;
	saveProject?: (...extra: any[]) => Promise<any>;
	removeProject?: (...extra: any[]) => Promise<any>;
	getRequestDetail?: (...extra: any[]) => Promise<any>;
	saveRequest?: (...extra: any[]) => Promise<any>;
	removeRequest?: (...extra: any[]) => Promise<any>;
	useStorage?: boolean;
	expandAll?: boolean;
	folderRender?: (props: {
		labelCol: { span: number },
		wrapperCol: { span: number },
	}) => React.ReactNode;
}
