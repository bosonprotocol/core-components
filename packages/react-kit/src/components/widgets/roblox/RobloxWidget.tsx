import { CSSProperties } from "styled-components";
import { ConnectRoblox, ConnectRobloxProps } from "./components/ConnectRoblox";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Grid } from "../../ui/Grid";
import {
  ProductsRoblox,
  ProductsRobloxProps
} from "./components/ProductsRoblox";
import { CommitWidgetProviders } from "../commit/CommitWidgetProviders";
import { CommitWidgetProps } from "../commit/CommitWidget";
import { Typography } from "../../ui/Typography";
import { AccountDrawer } from "../../wallet2/accountDrawer";
import { Portal } from "../../portal/Portal";

const Wrapper = Grid;
const numSteps = 3;
const numGaps = numSteps - 1;
type ProductKeysThatGoToConfig =
  | "sellerId"
  | "raiseDisputeForExchangeUrl"
  | "showProductsPreLogin";
export type RobloxWidgetProps = {
  connectProps: Omit<ConnectRobloxProps, "sellerId">;
  productsGridProps: Omit<
    ProductsRobloxProps,
    | "backendOrigin"
    | "configId"
    | "envName"
    | "requestShipmentProps"
    | "walletButtonTheme"
    | "robloxButtonTheme"
    | "commitButtonTheme"
    | ProductKeysThatGoToConfig
  >;
  configProps: Omit<
    CommitWidgetProps,
    "lookAndFeel" | "withWeb3React" | "withCustomReduxContext"
  > &
    Pick<ProductsRobloxProps, ProductKeysThatGoToConfig> &
    ProductsRobloxProps["requestShipmentProps"];
};
export const RobloxWidget = ({
  connectProps,
  productsGridProps,
  configProps: {
    sellerId,
    raiseDisputeForExchangeUrl,
    showProductsPreLogin,
    ...configProps
  }
}: RobloxWidgetProps) => {
  const singleStepConnectRobloxRef = useRef<HTMLDivElement>(null);
  const [singleStepWidth, setSingleStepWidth] =
    useState<CSSProperties["maxWidth"]>();
  const updateWidth = useCallback(() => {
    if (singleStepConnectRobloxRef.current) {
      const newWidth =
        (singleStepConnectRobloxRef.current.getBoundingClientRect().width ||
          0) *
          numSteps +
        numGaps * (connectProps.theme.gapInPx || 0);
      if (newWidth) {
        setSingleStepWidth(`${newWidth}px`);
      }
    }
  }, [connectProps.theme.gapInPx]);

  useEffect(() => {
    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [updateWidth]);

  return (
    <CommitWidgetProviders
      {...configProps}
      withCustomReduxContext={false}
      withReduxProvider={true}
      withWeb3React={true}
      withMagicLink={false}
    >
      <Wrapper
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="3rem"
      >
        <ConnectRoblox
          {...connectProps}
          ref={singleStepConnectRobloxRef}
          sellerId={sellerId}
        />
        <ProductsRoblox
          {...productsGridProps}
          walletButtonTheme={connectProps.theme.walletCard.button}
          robloxButtonTheme={connectProps.theme.robloxCard.button}
          requestShipmentProps={configProps}
          maxWidth={singleStepWidth}
          sellerId={sellerId}
          raiseDisputeForExchangeUrl={raiseDisputeForExchangeUrl}
          showProductsPreLogin={showProductsPreLogin}
        />
      </Wrapper>
      <Portal>
        <AccountDrawer
          backgroundColor={connectProps.theme?.walletPanel.backgroundColor}
          buyCryptoTheme={connectProps.theme?.walletPanel.buyCryptoTheme}
          disconnectBorderRadius={
            connectProps.theme.walletPanel.disconnectBorderRadius
          }
          disconnectBackgroundColor={
            connectProps.theme.walletPanel.disconnectBackgroundColor
          }
          disconnectColor={connectProps.theme.walletPanel.disconnectColor}
          walletModalProps={{
            withMagicLogin: false,
            optionProps: connectProps.theme.walletPanel.optionProps,
            connectionErrorProps:
              connectProps.theme.walletPanel.connectionErrorProps,
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
    </CommitWidgetProviders>
  );
};
