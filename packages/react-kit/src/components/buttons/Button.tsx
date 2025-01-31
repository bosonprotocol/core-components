import { forwardRef } from "react";
import ThemedButton, { IButton } from "../ui/ThemedButton";
import React from "react";

export type ButtonProps = IButton & {
  variant?:
    | "primaryFill" // default
    | "secondaryFill" // Dispute - Escalate
    | "secondaryInverted" // Dispute - Refuse, ProgressBar Cancel, Back to home page, Remove variant, Batch void, Void
    | "accentFill" // cookie
    | "accentInverted" // Dispute - Copy email, Upload File, Header Sell/Seller Hub, Create Product Draft - Start Fresh, ...
    | null;
  loading?: boolean;
};

export const variantToThemeKey = {
  primaryFill: "primary",
  secondaryFill: "secondary",
  secondaryInverted: "secondaryInverted",
  accentFill: "accentFill",
  accentInverted: "accentInverted"
} satisfies Record<NonNullable<ButtonProps["variant"]>, IButton["themeVal"]>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primaryFill", loading = false, ...props }, ref) => {
    const themeVal: IButton["themeVal"] = variant
      ? variantToThemeKey[variant] || props.themeVal
      : props.themeVal;
    return (
      <ThemedButton
        {...props}
        themeVal={themeVal}
        isLoading={loading}
        ref={ref}
      ></ThemedButton>
    );
  }
);
