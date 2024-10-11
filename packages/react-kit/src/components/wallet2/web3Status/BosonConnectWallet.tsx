import React from "react";
import { ConnectWallet } from ".";
import { bosonButtonThemes } from "../../ui/ThemedButton";
import { Portal } from "../../portal/Portal";
import { AccountDrawer } from "../accountDrawer";
import { Typography } from "../../ui/Typography";
import { BaseButtonTheme } from "../../buttons/BaseButton";

const defaultBorderRadiusPx = 12;
const defaultBorderRadius = `${defaultBorderRadiusPx}px`;
const bosonThemes = bosonButtonThemes({ withBosonStyle: true });
const customBosonPrimaryTheme = {
  ...bosonThemes["bosonPrimary"],
  borderRadius: defaultBorderRadiusPx
} satisfies BaseButtonTheme;
const custombosonSecondaryInverseBlackTheme = {
  ...bosonThemes["bosonSecondaryInverseBlack"],
  borderRadius: defaultBorderRadiusPx
} satisfies BaseButtonTheme;
const bosonPrimaryTheme = bosonThemes["bosonPrimary"] satisfies BaseButtonTheme;
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
          backgroundColor="white"
          buyCryptoTheme={customBosonPrimaryTheme}
          disconnectBorderRadius={defaultBorderRadius}
          disconnectBackgroundColor={customBosonPrimaryTheme.background}
          disconnectColor={customBosonPrimaryTheme.color}
          walletModalProps={{
            withMagicLogin: true,
            optionProps: {
              backgroundColor: custombosonSecondaryInverseBlackTheme.background,
              color: custombosonSecondaryInverseBlackTheme.color,
              borderRadius: defaultBorderRadius,
              iconBorderRadius: defaultBorderRadius,
              hoverFocusBackgroundColor:
                custombosonSecondaryInverseBlackTheme.hover?.background,
              hoverColor: custombosonSecondaryInverseBlackTheme.hover?.color
            },
            magicLoginButtonProps: {
              buttonProps: {
                theme: customBosonPrimaryTheme
              }
            },
            connectionErrorProps: {
              tryAgainTheme: customBosonPrimaryTheme,
              backToWalletSelectionTheme: custombosonSecondaryInverseBlackTheme
            },
            PrivacyPolicy: () => (
              <Typography
                style={{ color: "rgb(9, 24, 44)", fontSize: "0.75rem" }}
                display="block"
              >
                By connecting a wallet, you agree to Boson App 's{" "}
                <a
                  href="https://bosonapp.io/#/terms-and-conditions"
                  target="_blank"
                  rel="noreferrer noopener"
                  style={{ fontSize: "inherit" }}
                >
                  Terms & Conditions
                </a>{" "}
                and consent to its{" "}
                <a
                  href="https://bosonapp.io/#/privacy-policy"
                  target="_blank"
                  rel="noreferrer noopener"
                  style={{ fontSize: "inherit" }}
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
