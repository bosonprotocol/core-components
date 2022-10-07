import React from "react";
import { Loading } from "../Loading";

import { ButtonStyle } from "./Button.styles";

export enum ButtonSize {
  Small = "small",
  Medium = "medium",
  Large = "large"
}

export interface ButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonSize;
  variant?:
    | "primary"
    | "primaryOutline"
    | "secondary"
    | "secondaryOutline"
    | "ghost"
    | "ghostSecondary"
    | "ghostOrange"
    | "tertiary"
    | "danger"
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
  return (
    <ButtonStyle
      variant={variant}
      className={className}
      onClick={onClick}
      size={size}
      {...props}
    >
      {props.loading ? (
        <Loading data-loading />
      ) : (
        <span id="buttonText">{children}</span>
      )}
    </ButtonStyle>
  );
};
