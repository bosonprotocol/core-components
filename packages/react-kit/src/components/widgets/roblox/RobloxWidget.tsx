import { CSSProperties, styled } from "styled-components";
import { ConnectRoblox, ConnectRobloxProps } from "./components/ConnectRoblox";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Grid } from "../../ui/Grid";
import {
  ProductsRoblox,
  ProductsRobloxProps
} from "./components/ProductsRoblox";
import { CommitWidgetProviders } from "../commit/CommitWidgetProviders";
import { CommitWidgetProps } from "../commit/CommitWidget";

const Wrapper = styled(Grid)``;
const numSteps = 3;
const numGaps = numSteps - 1;
export type RobloxWidgetProps = {
  connectProps: ConnectRobloxProps;
  productsGridProps: Omit<ProductsRobloxProps, "backendOrigin">;
  configProps: Omit<
    CommitWidgetProps,
    "lookAndFeel" | "withWeb3React" | "withCustomReduxContext"
  >;
};
export const RobloxWidget = ({
  connectProps,
  productsGridProps,
  configProps
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
        <ConnectRoblox {...connectProps} ref={singleStepConnectRobloxRef} />
        <ProductsRoblox
          {...productsGridProps}
          maxWidth={singleStepWidth}
          backendOrigin={configProps.backendOrigin}
        />
      </Wrapper>
    </CommitWidgetProviders>
  );
};
