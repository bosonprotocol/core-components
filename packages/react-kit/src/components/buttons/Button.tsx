import { forwardRef } from "react";
import ThemedButton, { IButton } from "../ui/ThemedButton";
import React from "react";

export type ButtonProps = IButton & {
  variant?:
    | "primaryFill" // default
    | "primaryInverted" // ?
    | "secondaryFill" // Dispute - Escalate
    | "secondaryInverted" // Dispute - Refuse, ProgressBar Cancel, Back to home page, Remove variant, Batch void, Void
    | "accentFill" // cookie
    | "accentInverted" // Dispute - Copy email, Upload File, Header Sell/Seller Hub, Create Product Draft - Start Fresh, ...
    | "accentInvertedNoBorder"
    | null;
  loading?: boolean;
};

export const variantToThemeKey = {
  primaryFill: "primary",
  primaryInverted: "secondary",
  secondaryFill: "bosonSecondaryInverse",
  secondaryInverted: "secondaryInverted",
  accentFill: "accentFill",
  accentInverted: "accentInverted",
  accentInvertedNoBorder: "accentInvertedNoBorder"
} satisfies Record<NonNullable<ButtonProps["variant"]>, IButton["themeVal"]>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primaryFill", loading = false, ...props }, ref) => {
    const themeVal: IButton["themeVal"] = variant
      ? variantToThemeKey[variant] || props.themeVal
      : props.themeVal;
    console.log({ themeVal, theme: props.theme, variant });
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
