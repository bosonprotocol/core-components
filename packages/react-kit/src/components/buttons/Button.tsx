import React from "react";
import { Loading } from "../Loading";

import { ButtonStyle } from "./Button.styles";

export enum ButtonSize {
  Small = "small",
  Medium = "medium",
  Large = "large"
}

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonSize;
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "danger"
    | "ghost"
    | "warning";
  className?: string;
  children?: React.ReactNode;
}

export const Button = ({
  children,
  onClick,
  className,
  size = ButtonSize.Medium,
  variant = "primary",
  ...props
}: ButtonProps) => {
  console.log("🚀 ~ file: Button.tsx ~ line 33 ~ size", size);
  return (
    <ButtonStyle
      variant={variant}
      className={className}
      onClick={onClick}
      size={size}
      {...props}
    >
      {props.loading ? <Loading /> : <span>{children}</span>}
    </ButtonStyle>
  );
};
