import React from "react";
import { Loading } from "../Loading";

import { ButtonStyle } from "./Button.styles";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: "small" | "medium" | "large";
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
  size = "medium",
  variant = "primary",
  ...props
}: ButtonProps) => {
  return (
    <ButtonStyle
      variant={variant}
      className={className}
      onClick={onClick}
      {...props}
    >
      {props.loading ? <Loading /> : <span>{children}</span>}
    </ButtonStyle>
  );
};
