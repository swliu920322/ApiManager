import React from "react";

interface IRequiredItemProps {
  onClick?: () => void;
  onChange?: (value: boolean) => void;
  value?: boolean;
}

export function RequiredItem(props: IRequiredItemProps) {
  const { value, onChange, onClick } = props;
  return (
    <div
      className="required-flag"
      onClick={() => {
        onChange(!value);
        onClick?.();
      }}
      style={{ display: value ? "block" : "", color: value ? "red" : "black" }}
    >
      *
    </div>
  );
}
