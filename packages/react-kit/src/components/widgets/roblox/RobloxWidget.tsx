import { ConnectRoblox, ConnectRobloxProps } from "./components/ConnectRoblox";
import React, { useRef } from "react";
import { Grid } from "../../ui/Grid";
import {
  ProductsRoblox,
  ProductsRobloxProps
} from "./components/ProductsRoblox";
import {
  CommitWidgetProviders,
  CommitWidgetProvidersProps
} from "../commit/CommitWidgetProviders";
import { Typography } from "../../ui/Typography";
import {
  AccountDrawer,
  useCloseAccountDrawer
} from "../../wallet2/accountDrawer";
import { Portal } from "../../portal/Portal";
import { getCssVar } from "../../../theme";
import { bosonButtonThemes } from "../../ui/ThemedButton";
export * from "./components/types";

const bosonThemes = bosonButtonThemes();
const primaryButtonTheme = bosonThemes["primary"];
const orangeInverseButtonTheme = bosonThemes["orangeInverse"];

const Wrapper = Grid;
type ProductKeysThatGoToConfig =
  | "sellerId"
  | "raiseDisputeForExchangeUrl"
  | "showProductsPreLogin"
  | "layout";
export type RobloxWidgetProps = {
  connectProps: Omit<ConnectRobloxProps, "sellerId">;
  configProps: Omit<
    CommitWidgetProvidersProps,
    | "withWeb3React"
    | "withCustomReduxContext"
    | "withReduxProvider"
    | "withGlobalStyle"
    | "children"
  > &
    Pick<ProductsRobloxProps, ProductKeysThatGoToConfig> &
    ProductsRobloxProps["requestShipmentProps"];
};
export const RobloxWidget = ({
  connectProps,
  configProps: {
    sellerId,
    raiseDisputeForExchangeUrl,
    showProductsPreLogin,
    layout,
    ...configProps
  }
}: RobloxWidgetProps) => {
  const singleStepConnectRobloxRef = useRef<HTMLDivElement>(null);
  const closeAccountDrawer = useCloseAccountDrawer();
  return (
    <CommitWidgetProviders
      {...configProps}
      withCustomReduxContext={false}
      withReduxProvider={true}
      withWeb3React={true}
      withMagicLink={false}
      withGlobalStyle={true}
    >
      <Wrapper
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
      >
        <ConnectRoblox
          {...connectProps}
          ref={singleStepConnectRobloxRef}
          sellerId={sellerId}
        />
        <ProductsRoblox
          layout={layout}
          requestShipmentProps={configProps}
          sellerId={sellerId}
          raiseDisputeForExchangeUrl={raiseDisputeForExchangeUrl}
          showProductsPreLogin={showProductsPreLogin}
        />
      </Wrapper>
      <Portal>
        <AccountDrawer
          backgroundColor={getCssVar("--background-accent-color")}
          buyCryptoTheme={primaryButtonTheme}
          disconnectBorderRadius={undefined}
          disconnectBackgroundColor={undefined}
          disconnectColor={undefined}
          onUserDisconnect={closeAccountDrawer}
          walletModalProps={{
            withMagicLogin: false,
            optionProps: {
              backgroundColor: getCssVar("--secondary-accent-color"),
              hoverFocusBackgroundColor: getCssVar(
                "--secondary-accent-hover-color"
              ),
              borderRadius: getCssVar("--button-border-radius"),
              color: getCssVar("--secondary-button-text-color"),
              hoverColor: getCssVar("--secondary-button-text-hover-color"),
              iconBorderRadius: getCssVar("--button-border-radius")
            },
            connectionErrorProps: {
              backToWalletSelectionTheme: orangeInverseButtonTheme,
              tryAgainTheme: orangeInverseButtonTheme
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
                    color: getCssVar("--sub-text-color"),
                    textDecoration: "underline"
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
                    color: getCssVar("--sub-text-color"),
                    textDecoration: "underline"
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
    </CommitWidgetProviders>
  );
};
