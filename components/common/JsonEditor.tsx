import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef
} from "react";
import loader from "@monaco-editor/loader";
import copyThing from "copy-to-clipboard";
import { editor } from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import { Button, message } from "antd";

interface IJsonEditorProps {
  json: string;
}

export const JsonEditor = forwardRef((props: IJsonEditorProps, ref) => {
  const { json } = props;
  const divRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<IStandaloneCodeEditor>(null);

  useEffect(() => {
    if (editorRef.current) {
      return editorRef.current.setValue(json);
    }
    loader.init().then(monaco => {
      editorRef.current = monaco.editor.create(divRef.current, {
        value: json,
        language: "json"
      });
    });
  }, [json]);

  function getValue() {
    return editorRef.current.getValue();
  }

  function copy() {
    copyThing(getValue());
    message.success("拷贝成功");
  }

  useImperativeHandle(ref, () => {
    return {
      getValue,
      setValue: (val: string) => editorRef.current.setValue(val)
    };
  });
  return (
    <div className="h-full flex-col" style={{ height: "70vh" }}>
      <Button style={{ alignSelf: "flex-end" }} onClick={copy}>
        复制代码
      </Button>
      <div ref={divRef} className="flex-1 mt-10" />
    </div>
  );
});
