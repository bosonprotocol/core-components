import { forwardRef } from "react";
import ThemedButton, { IButton } from "../ui/ThemedButton";
import React from "react";

export enum ButtonSize {
  Small = "small",
  Medium = "regular",
  Large = "large"
}

export type ButtonProps = Omit<IButton, "theme"> & {
  variant?:
    | "primaryFill" // default
    | "primaryInverted" // ?
    | "secondaryFill" // Dispute - Escalate
    | "secondaryInverted" // Dispute - Refuse, ProgressBar Cancel, Back to home page, Remove variant, Batch void, Void
    | "accentFill" // cookie
    | "accentInverted"; // Dispute - Copy email, Upload File, Header Sell/Seller Hub, Create Product Draft - Start Fresh, ...
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primaryFill", loading = false, ...props }, ref) => {
    let theme: IButton["theme"];
    switch (variant) {
      case "primaryFill": {
        theme = "primary";
        break;
      }
      case "primaryInverted": {
        theme = "secondary";
        break;
      }
      case "secondaryFill": {
        theme = "bosonSecondaryInverse";
        break;
      }
      case "secondaryInverted": {
        theme = "bosonSecondary";
        break;
      }
      case "accentFill": {
        theme = "accentFill";
        break;
      }
      case "accentInverted": {
        theme = "orangeInverse";
        break;
      }
    }
    return (
      <ThemedButton {...props} theme={theme} isLoading={loading}></ThemedButton>
    );
  }
);
