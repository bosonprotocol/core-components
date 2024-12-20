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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primaryFill", loading = false, ...props }, ref) => {
    let themeVal: IButton["themeVal"] = props.themeVal;
    switch (variant) {
      case "primaryFill": {
        themeVal = "primary";
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
