import { Tabs } from "antd";
import { SimpleData } from "../schema";
import { Body } from "./Body";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState
} from "react";

export const RightSideParams = forwardRef((props: any, ref) => {
  const { requestInfo } = props;
  const [activeKey, setActiveKey] = useState("1");

  const queryRef = useRef<any>();
  const bodyRef = useRef<any>();
  const headerRef = useRef<any>();
  const cookieRef = useRef<any>();

  async function getParams() {
    const query = await queryRef.current.getConfigs();
    const header = await headerRef.current.getConfigs();
    const cookie = await cookieRef.current.getConfigs();
    const reqBody = await bodyRef.current.getJsonSchema();
    return {
      parameters: { query, header, cookie },
      requestBody: {
        jsonSchema: reqBody
      }
    };
  }

  useImperativeHandle(ref, () => {
    return {
      getParams
    };
  });
  return (
    <>
      <h3>请求参数</h3>
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
        <Tabs.TabPane tab="Query" key="1" />
        <Tabs.TabPane tab="Body" key="2" />
        <Tabs.TabPane tab="Header" key="3" />
        <Tabs.TabPane tab="Cookie" key="4" />
      </Tabs>
      <>
        <div className={activeKey !== "1" ? "display-none" : ""}>
          <SimpleData
            key={requestInfo.key}
            ref={queryRef}
            data={requestInfo.parameters.query}
          />
        </div>
        <div className={activeKey !== "2" ? "display-none" : ""}>
          <Body
            key={requestInfo.key}
            ref={bodyRef}
            body={requestInfo.requestBody.jsonSchema}
          />
        </div>
        <div className={activeKey !== "3" ? "display-none" : ""}>
          <SimpleData
            key={requestInfo.key}
            ref={headerRef}
            data={requestInfo.parameters.header}
          />
        </div>
        <div className={activeKey !== "4" ? "display-none" : ""}>
          <SimpleData
            key={requestInfo.key}
            ref={cookieRef}
            data={requestInfo.parameters.cookie}
          />
        </div>
      </>
    </>
  );
});
