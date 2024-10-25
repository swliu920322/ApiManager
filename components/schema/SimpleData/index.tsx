import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Form, Input, Select, message } from "antd";
import { ISimpleDataProps, IJsonArr } from "../../../types/schema";
import { typeSelectOptions } from "../../../configs/schema";
import { RotateConfirm, RequiredItem } from "../../common";
import { IFormRef } from "../../../types/model";

const { Item, List } = Form;

export const SimpleData = memo(
  forwardRef((props: ISimpleDataProps, ref: any) => {
    const { data } = props;
    const formRef = useRef<IFormRef>();

    async function getConfigs(): Promise<IJsonArr[]> {
      return formRef.current.validateFields().then(r => {
        return r.configs.filter((i: {}) =>
          Object.keys(i)
            .map((key: string) => i[key])
            .some(Boolean)
        );
      });
    }

    const [allRequired, setAllRequired] = useState(false);

    useEffect(() => {
      const res = data || ([{}] as IJsonArr[]);
      setAllRequired(res.every(i => i.required));
      formRef.current.setFieldsValue({ configs: res });
    }, [data]);

    function updateRequired() {
      getConfigs().then(r => {
        setAllRequired(r.every((i: any) => i.required));
      });
    }

    function toggleAllRequired(required: boolean) {
      setAllRequired(required);
      getConfigs().then(r => {
        formRef.current.setFieldsValue({
          configs: r.map(i => ({ ...i, required }))
        });
      });
    }

    function addLine(addFunc: () => void) {
      // 如果数组有一项都为undefined，则不能新增
      getConfigs().then(r => {
        let canAdd = true;
        for (const i of r) {
          if (
            Object.keys(i).every(key => ["", undefined].indexOf(i[key]) > -1)
          ) {
            canAdd = false;
            break;
          }
        }
        if (canAdd) {
          addFunc();
        } else {
          message.error("请至少输入一个内容");
        }
      });
    }

    useImperativeHandle(ref, () => {
      return {
        getConfigs
      };
    });
    return (
      <Form
        name="form"
        labelCol={{ span: 0 }}
        wrapperCol={{ span: 22 }}
        ref={(refs: any) => (formRef.current = refs)}
      >
        <List name="configs">
          {(fields: object[], { add, remove }: any) => {
            return (
              <>
                <div className="w-full flex">
                  <Item className="flex-1">参数名</Item>
                  <Item className="flex-1 ">
                    <div className="flex items-center required-container">
                      <span className="ml-10">类型</span>
                      <RequiredItem
                        value={allRequired}
                        onChange={toggleAllRequired}
                      />
                    </div>
                  </Item>
                  <Item className="flex-1">说明</Item>
                  <div style={{ width: 50 }} />
                </div>
                {fields.map(({ key, name, fieldKey, ...item }: any, index) => {
                  return (
                    <div className="w-full flex" key={key}>
                      <Item className="flex-1" {...item} name={[name, "name"]}>
                        <Input placeholder="请输入参数名" />
                      </Item>
                      <div className="flex-1 flex items-center required-container">
                        <Item {...item} name={[name, "type"]}>
                          <Select
                            style={{ width: "unset" }}
                            className="type-item"
                            placeholder="请选择参数类型"
                            options={typeSelectOptions}
                          />
                        </Item>
                        <Item {...item} name={[name, "required"]}>
                          <RequiredItem onClick={updateRequired} />
                        </Item>
                      </div>
                      <Item
                        className="flex-1"
                        {...item}
                        name={[name, "description"]}
                      >
                        <Input placeholder="请输入说明" />
                      </Item>
                      <div
                        className="flex items-center operate-area"
                        style={{ width: 50, height: 30 }}
                      >
                        <PlusCircleOutlined onClick={() => addLine(add)} />
                        <div
                          style={{
                            display: fields.length > 1 ? "block" : "none"
                          }}
                        >
                          <RotateConfirm onClick={() => remove(index)} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            );
          }}
        </List>
      </Form>
    );
  }),
  (prevProps, nextProps) => {
    return prevProps.data?.length === nextProps.data?.length;
  }
);
