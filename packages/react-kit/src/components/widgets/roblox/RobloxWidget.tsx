import { styled } from "styled-components";
import { ConnectRoblox, ConnectRobloxProps } from "./components/ConnectRoblox";
import React from "react";
import { Grid } from "../../ui/Grid";
import {
  ProductsRoblox,
  ProductsRobloxProps
} from "./components/ProductsRoblox";
import { CommitWidgetProviders } from "../commit/CommitWidgetProviders";

const Wrapper = styled(Grid)``;

export type RobloxWidgetProps = {
  connectProps: ConnectRobloxProps;
  productsGridProps: ProductsRobloxProps;
};
export const RobloxWidget = ({
  connectProps,
  productsGridProps
}: RobloxWidgetProps) => {
  return (
    <CommitWidgetProviders
      configId={productsGridProps.configId}
      envName={productsGridProps.envName}
      contactSellerForExchangeUrl="https://bosonapp.io/#/chat/{id}"
      fairExchangePolicyRules="ipfs://QmX8Wnq1eWbf7pRhEDQqdAqWp17YSKXQq8ckZVe4YdqAvt"
      ipfsGateway={process.env.STORYBOOK_DATA_IPFS_GATEWAY}
      ipfsProjectId={process.env.STORYBOOK_DATA_IPFS_PROJECT_ID}
      ipfsProjectSecret={process.env.STORYBOOK_DATA_IPFS_PROJECT_SECRET}
      walletConnectProjectId={
        process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID ?? ""
      }
      dateFormat="YYYY/MM/DD"
      shortDateFormat="MMM DD, YYYY"
      defaultCurrencySymbol="$"
      defaultCurrencyTicker="USD"
      withCustomReduxContext={false}
      withReduxProvider={true}
      withWeb3React={true}
    >
      <Wrapper
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="3rem"
      >
        <ConnectRoblox {...connectProps} />
        {/* <ProductsRoblox {...productsGridProps} /> */}
      </Wrapper>
    </CommitWidgetProviders>
  );
};
