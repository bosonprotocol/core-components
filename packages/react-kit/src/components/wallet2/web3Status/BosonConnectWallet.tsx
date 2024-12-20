import React from "react";
import { ConnectWallet } from ".";
import { bosonButtonThemes } from "../../ui/ThemedButton";
import { Portal } from "../../portal/Portal";
import { AccountDrawer } from "../accountDrawer";
import { Typography } from "../../ui/Typography";
import { BaseButtonTheme } from "../../buttons/BaseButton";
import { getCssVar } from "../../../theme";

const defaultBorderRadiusPx = 12;
const defaultBorderRadius = `${defaultBorderRadiusPx}px` as const;
const bosonThemes = bosonButtonThemes();
const customBosonPrimaryTheme = {
  ...bosonThemes["primary"],
  borderRadius: defaultBorderRadius
} satisfies BaseButtonTheme;
const secondaryTheme = {
  ...bosonThemes["secondary"],
  borderRadius: defaultBorderRadius
} satisfies BaseButtonTheme;
const bosonPrimaryTheme = bosonThemes["primary"] satisfies BaseButtonTheme;
const orangeTheme = bosonThemes["orange"] satisfies BaseButtonTheme;

export const BosonConnectWallet = () => {
  return (
    <>
      <ConnectWallet
        connectWalletButtonTheme={bosonPrimaryTheme}
        connectedButtonTheme={bosonPrimaryTheme}
        errorButtonTheme={orangeTheme}
      />
      <Portal>
        <AccountDrawer
          backgroundColor={getCssVar("--background-accent-color")}
          buyCryptoTheme={customBosonPrimaryTheme}
          disconnectBorderRadius={defaultBorderRadius}
          disconnectBackgroundColor={customBosonPrimaryTheme.background}
          disconnectColor={customBosonPrimaryTheme.color}
          walletModalProps={{
            withMagicLogin: true,
            optionProps: {
              backgroundColor: secondaryTheme.background,
              color: secondaryTheme.color,
              borderRadius: defaultBorderRadius,
              iconBorderRadius: defaultBorderRadius,
              hoverFocusBackgroundColor: secondaryTheme.hover?.background,
              hoverColor: secondaryTheme.hover?.color
            },
            magicLoginButtonProps: {
              buttonProps: {
                theme: customBosonPrimaryTheme
              }
            },
            connectionErrorProps: {
              tryAgainTheme: customBosonPrimaryTheme,
              backToWalletSelectionTheme: secondaryTheme
            },
            PrivacyPolicy: () => (
              <Typography style={{ fontSize: "0.75rem" }} display="block">
                By connecting a wallet, you agree to Boson App 's{" "}
                <a
                  href="https://bosonapp.io/#/terms-and-conditions"
                  target="_blank"
                  rel="noreferrer noopener"
                  style={{
                    fontSize: "inherit",
                    color: getCssVar("--sub-text-color")
                  }}
                >
                  Terms & Conditions
                </a>{" "}
                and consent to its{" "}
                <a
                  href="https://bosonapp.io/#/privacy-policy"
                  target="_blank"
                  rel="noreferrer noopener"
                  style={{
                    fontSize: "inherit",
                    color: getCssVar("--sub-text-color")
                  }}
                >
                  Privacy Policy
                </a>
                . (Last Updated 18 August 2023)
              </Typography>
            )
          }}
        />
      </Portal>
    </>
  );
};
