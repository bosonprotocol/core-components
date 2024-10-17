import { styled } from "styled-components";
import React, { useMemo, useState } from "react";
import { Typography, TypographyProps } from "../../../ui/Typography";
import { Grid } from "../../../ui/Grid";
import { ConfigId, EnvironmentType, subgraph } from "@bosonprotocol/core-sdk";
import { CommitModalWithOffer } from "../../commit/CommitModalWithOffer";
import { Currencies } from "../../../currencyDisplay/CurrencyDisplay";
import { GridContainer } from "../../../ui/GridContainer";
import { ProductsGrid } from "./ProductsGrid";
import useProductByOfferId from "../../../../hooks/products/useProductByOfferId";
import { isTruthy } from "../../../../types/helpers";

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
    purchasedProducts: Omit<SectionThemeProps, "subtitle">;
    availableProducts: SectionThemeProps;
    unavailabeProducts: SectionThemeProps;
  }>;
};

const unavailableProducts = [{}] as any[];
export const ProductsRoblox = ({
  sellerId,
  theme,
  configId,
  envName
}: ProductsRobloxProps) => {
  const { data, ...rest } = useProductByOfferId("17", {
    enabled: true
  });
  console.log({ data, ...rest });
  const availableProducts = useMemo(
    () =>
      data?.variants.at(0)?.offer
        ? [data?.variants.at(0)?.offer].filter(isTruthy) || []
        : [],
    [data?.variants]
  );
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
  const clearSelection = () => {
    setProductUuid("");
    setBundleUuid("");
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
          <Typography tag="h3" style={theme?.purchasedProducts?.title?.style}>
            Purchased Products
          </Typography>
        </Grid>
        <Grid flexDirection="column" alignItems="flex-start">
          <Typography tag="h3" style={theme?.availableProducts?.title?.style}>
            Available Products
          </Typography>
          <Typography style={theme?.availableProducts?.subtitle?.style}>
            Following products are available for you based on the Roblox
            inventory you have
          </Typography>
          <ProductsGrid products={availableProducts} />
        </Grid>
        <Grid flexDirection="column" alignItems="flex-start">
          <Typography tag="h3" style={theme?.unavailabeProducts?.title?.style}>
            Unavailable products
          </Typography>
          <Typography style={theme?.unavailabeProducts?.subtitle?.style}>
            Other products that can be purchased when you have the right Roblox
            inventory item.
          </Typography>
          <ProductsGrid products={unavailableProducts} />
        </Grid>
      </>
      {(productUuid || bundleUuid) && (
        <CommitModalWithOffer
          sellerId={sellerId}
          productUuid={productUuid}
          bundleUuid={bundleUuid}
          lookAndFeel="regular"
          hideModal={clearSelection}
        />
      )}
    </Wrapper>
  );
};
