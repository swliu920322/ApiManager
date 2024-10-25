interface IProperty {
  [key: string]: IJSONSchema;
}

export interface IJsonTree {
  type: string;
  title: string;
  description?: string;
  key: string;
  required: boolean;
  children?: IJsonTree[];
  indexArr: number[];
  parent?: IJsonTree;
}

export interface IJSONSchema {
  type?: string;
  title?: string;
  properties?: IProperty;
  items?: IJSONSchema;
  description?: string;
  required?: string[];
}

export interface IComplexDataProps {
  data: IJSONSchema;
  setBodyValue: (val: IJSONSchema) => any;
}

export interface ISimpleDataProps {
  data: IJsonArr[];
}

export interface IJsonArr {
  type: string;
  name: string;
  required: boolean;
  description?: string;
}
