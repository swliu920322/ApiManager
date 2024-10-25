import React, { memo, useMemo } from "react";
import { useState } from "react";
import { Input } from "antd";

interface ICanEditProps {
  title: string;
  placeholder: string;
  indexArr: number[];
  editIndexKeys: number[];
  valueChange?: (value: string) => any;
}

export const CanEditNode = memo(
  (props: ICanEditProps) => {
    const { indexArr, title, editIndexKeys, placeholder } = props;
    const [innerState, setInnerState] = useState(title);

    const isUnEditable = useMemo(
      () => ["根节点", "ITEMS"].indexOf(title) >= 0,
      [title]
    );

    function valueChange(e: React.ChangeEvent<HTMLInputElement>) {
      const value = e.target.value;
      props.valueChange?.(value);
      setInnerState(value);
    }

    if (indexArr.join(",") === editIndexKeys.join(",") && !isUnEditable) {
      return (
        <Input
          className="edit-item"
          autoFocus={true}
          value={innerState}
          placeholder={placeholder}
          onChange={valueChange}
        />
      );
    }
    return (
      <div className="edit-item flex items-center" style={{ height: 30 }}>
        <span
          className={isUnEditable ? "un-editable" : "edit-item"}
          style={{ color: innerState ? "black" : "#CACCCF" }}
        >
          {innerState || placeholder}
        </span>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.title === nextProps.title &&
      prevProps.editIndexKeys.toString() === nextProps.editIndexKeys.toString()
    );
  }
);
