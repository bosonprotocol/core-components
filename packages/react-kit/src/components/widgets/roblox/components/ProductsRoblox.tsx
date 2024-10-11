import { styled } from "styled-components";
import React, { useState } from "react";
import { Typography, TypographyProps } from "../../../ui/Typography";
import { Grid } from "../../../ui/Grid";
import { CommitWidget } from "../../commit/CommitWidget";
import { ConfigId, EnvironmentType } from "@bosonprotocol/core-sdk";
import { CommitWidgetProviders } from "../../commit/CommitWidgetProviders";

const Wrapper = styled(Grid)`
  width: 100%;
`;

type SectionThemeProps = Partial<{
  title: {
    style: Partial<TypographyProps["style"]>;
  };
  subtitle: {
    style: Partial<TypographyProps["style"]>;
  };
}>;
export type ProductsRobloxProps = {
  sellerId: string;
  configId: ConfigId;
  envName: EnvironmentType;
  theme?: Partial<{
    style: Partial<TypographyProps["style"]>;
    availableProducts: SectionThemeProps;
    unavailabeProducts: SectionThemeProps;
  }>;
};

export const ProductsRoblox = ({
  sellerId,
  theme,
  configId,
  envName
}: ProductsRobloxProps) => {
  const [productUuid, setProductUuid] = useState<string>("");
  const [bundleUuid, setBundleUuid] = useState<string>("");

  const handleSetProductUuid = (selectedProductUuid: string) => {
    setProductUuid(selectedProductUuid);
    setBundleUuid("");
  };
  const handleSetBundleUuid = (selectedBundleUuid: string) => {
    setProductUuid("");
    setBundleUuid(selectedBundleUuid);
  };
  return (
    <Wrapper
      style={theme?.style}
      flexDirection="column"
      alignItems="flex-start"
      gap="5rem"
    >
      <>
        <Grid flexDirection="column" alignItems="flex-start">
          <Typography tag="h3" style={theme?.availableProducts?.title?.style}>
            Available Products
          </Typography>
          <Typography style={theme?.availableProducts?.subtitle?.style}>
            Following products are available for you based on the Roblox
            inventory you have
          </Typography>
        </Grid>
        <Grid flexDirection="column" alignItems="flex-start">
          <Typography tag="h3" style={theme?.unavailabeProducts?.title?.style}>
            Unavailable products
          </Typography>
          <Typography style={theme?.unavailabeProducts?.subtitle?.style}>
            Other products that can be purchased when you have the right Roblox
            inventory item.
          </Typography>
        </Grid>
      </>
      <CommitWidget
        sellerId={sellerId}
        productUuid={productUuid}
        bundleUuid={bundleUuid}
        configId={configId}
        envName={envName}
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
        withExternalSigner={false}
        withCustomReduxContext={false}
        withWeb3React={true}
        lookAndFeel="regular"
      >
        <></>
      </CommitWidget>
    </Wrapper>
  );
};
