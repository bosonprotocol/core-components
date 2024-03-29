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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primaryFill", loading = false, ...props }, ref) => {
    let themeVal: IButton["themeVal"] = props.themeVal;
    switch (variant) {
      case "primaryFill": {
        themeVal = "primary";
        break;
      }
      case "primaryInverted": {
        themeVal = "secondary";
        break;
      }
      case "secondaryFill": {
        themeVal = "bosonSecondaryInverse";
        break;
      }
      case "secondaryInverted": {
        themeVal = "secondaryInverted";
        break;
      }
      case "accentFill": {
        themeVal = "accentFill";
        break;
      }
      case "accentInverted": {
        themeVal = "accentInverted";
        break;
      }
      case "accentInvertedNoBorder": {
        themeVal = "accentInvertedNoBorder";
        break;
      }
    }
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
