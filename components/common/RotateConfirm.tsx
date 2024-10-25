import { CloseCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface IRotateConfirmProps {
  onClick: (...args: any[]) => any;
}

export function RotateConfirm(props: IRotateConfirmProps) {
  const { onClick } = props;
  const [isConfirmed, setIsConfirmed] = useState(false);
  const refs = useRef<HTMLDivElement>();
  useEffect(() => {
    if (isConfirmed) {
      setTimeout(() => {
        refs.current.classList.add("rotate-icon");
      });
      setTimeout(() => {
        if (refs.current) {
          refs.current.classList.remove("rotate-icon");
          setIsConfirmed(false);
        }
      }, 2000);
    }
  }, [isConfirmed]);

  function click(e: React.MouseEvent<HTMLDivElement>) {
    if (isConfirmed) {
      onClick(e);
    } else {
      setIsConfirmed(true);
    }
  }

  const { ICON, style } = useMemo(() => {
    return isConfirmed
      ? {
          ICON: CloseCircleOutlined,
          style: { color: "red" }
        }
      : { ICON: MinusCircleOutlined };
  }, [isConfirmed]);
  return (
    <ICON
      ref={refs}
      style={{ ...style }}
      className="flex just-center items-center"
      onClick={click}
    />
  );
}
