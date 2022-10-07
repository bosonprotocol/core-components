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
    | "primaryFill"
    | "primaryInverted"
    | "secondaryFill"
    | "secondaryInverted"
    | "accentFill"
    | "accentInverted";
  className?: string;
  children?: React.ReactNode;
  showBorder?: boolean;
  type?: "submit" | "reset" | "button" | undefined;
}

export const Button = ({
  children,
  onClick,
  className,
  size = ButtonSize.Medium,
  variant = "primaryFill",
  showBorder = true,
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <ButtonStyle
      variant={variant}
      className={className}
      onClick={onClick}
      size={size}
      showBorder={showBorder}
      type={type}
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
