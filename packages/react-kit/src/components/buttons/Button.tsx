import React, { forwardRef } from "react";
import { Loading } from "../Loading";

import { ButtonStyle } from "./Button.styles";

export enum ButtonSize {
  Small = "small",
  Medium = "medium",
  Large = "large"
}

export interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
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
  style?: React.CSSProperties;
  withBosonStyle?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      onClick,
      className,
      size = ButtonSize.Medium,
      variant = "primaryFill",
      showBorder = true,
      type,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <ButtonStyle
        variant={variant}
        className={className}
        onClick={onClick}
        size={size}
        ref={ref}
        showBorder={showBorder}
        style={style}
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
  }
);
