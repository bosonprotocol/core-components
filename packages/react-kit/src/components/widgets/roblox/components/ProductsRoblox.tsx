import { CSSProperties, styled } from "styled-components";
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
import { useModal } from "../../../modal/useModal";

const Wrapper = styled(Grid)``;
const ContentWrapper = styled(Grid)``;

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
  maxWidth?: CSSProperties["maxWidth"];
};

// const purchasedProducts = [{}] as any[];
// const purchasedProductsLoading = false;
const unavailableProducts = [{}] as any[];
const unavailableProductsLoading = false;
export const ProductsRoblox = ({
  sellerId,
  theme,
  configId,
  envName,
  maxWidth
}: ProductsRobloxProps) => {
  const { showModal } = useModal();
  const {
    data,
    isLoading: availableProductLoading,
    ...rest
  } = useProductByOfferId("17", {
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
  const purchasedProducts = availableProducts;
  const purchasedProductsLoading = availableProductLoading;

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
    <Wrapper style={theme?.style} justifyContent="center" alignItems="center">
      <ContentWrapper
        flexDirection="column"
        alignItems="flex-start"
        gap="5rem"
        maxWidth={maxWidth}
      >
        {productUuid || bundleUuid ? (
          <CommitModalWithOffer
            sellerId={sellerId}
            productUuid={productUuid}
            bundleUuid={bundleUuid}
            lookAndFeel="regular"
            hideModal={clearSelection}
          />
        ) : (
          <>
            <Grid flexDirection="column" alignItems="flex-start">
              <Typography
                tag="h3"
                style={theme?.purchasedProducts?.title?.style}
              >
                Purchased Products
              </Typography>
              <ProductsGrid
                products={purchasedProducts}
                cta="request-shipment"
                handleRequestShipment={(offer) => {
                  showModal("REQUEST_SHIPMENT", {
                    offer,
                    exchange: {
                      offer,
                      buyer: { id: "3" },
                      seller: { id: "5", assistant: "0x123" }
                    } as unknown as subgraph.ExchangeFieldsFragment // TODO: remove cast
                  });
                }}
                isLoading={purchasedProductsLoading}
              />
            </Grid>
            <Grid flexDirection="column" alignItems="flex-start">
              <Typography
                tag="h3"
                style={theme?.availableProducts?.title?.style}
              >
                Available Products
              </Typography>
              <Typography style={theme?.availableProducts?.subtitle?.style}>
                Following products are available for you based on the Roblox
                inventory you have
              </Typography>
              <ProductsGrid
                products={availableProducts}
                handleSetProductUuid={handleSetProductUuid}
                handleSetBundleUuid={handleSetBundleUuid}
                isLoading={availableProductLoading}
                cta="buy"
              />
            </Grid>
            <Grid flexDirection="column" alignItems="flex-start">
              <Typography
                tag="h3"
                style={theme?.unavailabeProducts?.title?.style}
              >
                Unavailable products
              </Typography>
              <Typography style={theme?.unavailabeProducts?.subtitle?.style}>
                Other products that can be purchased when you have the right
                Roblox inventory item.
              </Typography>
              <ProductsGrid
                products={unavailableProducts}
                handleSetProductUuid={handleSetProductUuid}
                handleSetBundleUuid={handleSetBundleUuid}
                isLoading={unavailableProductsLoading}
                cta="buy"
              />
            </Grid>
          </>
        )}
      </ContentWrapper>
    </Wrapper>
  );
};
