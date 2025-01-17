import styled from "styled-components";
import React, { useCallback, useMemo, useState } from "react";
import { Typography } from "../../../ui/Typography";
import { Grid } from "../../../ui/Grid";
import { CommitModalWithOffer } from "../../commit/CommitModalWithOffer";
import { RobloxProductsGrid } from "./RobloxProductsGrid";
import { useRobloxProducts } from "../../../../hooks/roblox/useRobloxProducts";
import { useRobloxExchanges } from "../../../../hooks/roblox/useRobloxExchanges";
import { useAccount } from "../../../../hooks";
import { RobloxExchangesGrid } from "./RobloxExchangesGrid";
import { BosonRobloxExchange } from "@bosonprotocol/roblox-sdk";
import { CancelExchange } from "../../../modal/components/Redeem/ExchangeView/cancellation/CancelExchange";
import NonModal from "../../../modal/nonModal/NonModal";
import { useIsRobloxLoggedIn } from "../../../../hooks/roblox/useIsRobloxLoggedIn";
import { getCssVar } from "../../../../theme";
import { GridContainerProps } from "../../../ui/GridContainer";
import { isBundle, isProductV1 } from "../../../../lib/offer/filter";
import { subgraph } from "@bosonprotocol/core-sdk";
import { maxWidthStepper } from "./styles";
import { ThemedBosonLogo } from "../../../modal/components/common/ThemedBosonLogo";
import { productsPageSize, purchasedProductsPageSize, statuses } from "./const";
import { OfferVariantViewProps } from "../../../modal/components/Commit/OfferVariantView";

const Wrapper = styled(Grid).attrs({
  paddingTop: "5rem",
  paddingBottom: "5rem",
  alignItems: "flex-start"
})`
  flex: 1;
  background-color: ${getCssVar("--background-color")};
`;
const ContentWrapper = styled(Grid)`
  max-width: calc(${maxWidthStepper} * 3);
  > * {
    width: 100%;
  }
`;

export type ProductsRobloxProps = {
  requestShipmentProps: OfferVariantViewProps["requestShipmentProps"];
  sellerId: string;
  raiseDisputeForExchangeUrl: string;
  showProductsPreLogin: boolean;
  layout: "vertical" | "horizontal";
};

export const ProductsRoblox = ({
  sellerId,
  raiseDisputeForExchangeUrl,
  requestShipmentProps,
  showProductsPreLogin,
  layout
}: ProductsRobloxProps) => {
  const { address } = useAccount();
  const { data: robloxLoggedInData } = useIsRobloxLoggedIn({
    sellerId,
    options: {
      enabled: !!showProductsPreLogin
    }
  });
  const {
    data: availableRobloxProductsInPage,
    isLoading: availableProductLoading,
    fetchNextPage: fetchNextPageAvailableProducts,
    refetch: refetchAvailableProducts,
    hasNextPage: hasNextPageAvailableProducts
  } = useRobloxProducts({
    sellerId,
    pageSize: productsPageSize,
    statuses: statuses.availableProducts,
    options: { enabled: true }
  });
  const availableProducts = useMemo(() => {
    return (
      availableRobloxProductsInPage?.pages?.flatMap((page) => page.products) ||
      []
    );
  }, [availableRobloxProductsInPage]);
  const {
    data: robloxUnavailableProductsInPage,
    isLoading: unavailableProductsLoading,
    fetchNextPage: fetchNextPageUnavailableProducts,
    refetch: refetchUnavailableProducts,
    hasNextPage: hasNextPageUnavailableProducts
  } = useRobloxProducts({
    sellerId,
    pageSize: productsPageSize,
    statuses: statuses.unavailableProducts,
    options: { enabled: true }
  });
  const robloxUnavailableProducts = useMemo(() => {
    return (
      robloxUnavailableProductsInPage?.pages?.flatMap(
        (page) => page.products
      ) || []
    );
  }, [robloxUnavailableProductsInPage]);

  const robloxExclusives = useMemo(() => {
    return robloxUnavailableProducts.concat(availableProducts);
  }, [robloxUnavailableProducts]);
  const unavailableProducts = robloxUnavailableProducts;
  const robloxExclusivesLoading =
    unavailableProductsLoading || availableProductLoading;
  const hasNextPageProducts =
    hasNextPageAvailableProducts || hasNextPageUnavailableProducts;
  const refetchProducts = useCallback(() => {
    refetchAvailableProducts();
    refetchUnavailableProducts();
  }, []);
  const fetchNextPageProducts = useCallback(() => {
    fetchNextPageAvailableProducts();
    fetchNextPageUnavailableProducts();
  }, []);

  const {
    data: purchasedProductsInPage,
    isLoading: purchasedProductsLoading,
    fetchNextPage: fetchNextPagePurchasedProducts,
    hasNextPage: hasNextPagePurchasedProducts,
    refetch: refetchPurchasedProducts
  } = useRobloxExchanges({
    sellerId,
    userWallet: address ?? "",
    pageSize: purchasedProductsPageSize,
    options: { enabled: !!address }
  });
  const purchasedProducts = useMemo(() => {
    return (
      purchasedProductsInPage?.pages?.flatMap((page) => page.exchanges) || []
    );
  }, [purchasedProductsInPage]);
  const [exchange, setExchange] = useState<subgraph.ExchangeFieldsFragment>();
  const [productUuid, setProductUuid] = useState<string>("");
  const [bundleUuid, setBundleUuid] = useState<string>("");
  const [exchangeToCancel, setExchangeToCancel] =
    useState<BosonRobloxExchange>();

  const resetExchangeToCancel = () => setExchangeToCancel(undefined);

  const handleSetProductUuid = ({
    selectedProductUuid,
    exchange
  }: {
    selectedProductUuid: string;
    exchange?: subgraph.ExchangeFieldsFragment;
  }) => {
    setProductUuid(selectedProductUuid);
    setBundleUuid("");
    resetExchangeToCancel();
    setExchange(exchange);
  };
  const handleSetBundleUuid = ({
    selectedBundleUuid,
    exchange
  }: {
    selectedBundleUuid: string;
    exchange?: subgraph.ExchangeFieldsFragment;
  }) => {
    setProductUuid("");
    setBundleUuid(selectedBundleUuid);
    resetExchangeToCancel();
    setExchange(exchange);
  };
  const clearSelection = () => {
    setProductUuid("");
    setBundleUuid("");
    setExchange(undefined);
  };
  const itemsPerRow = {
    xs: layout === "vertical" ? 1 : 2,
    s: layout === "vertical" ? 1 : 2,
    m: layout === "vertical" ? 2 : 3,
    l: layout === "vertical" ? 2 : 4,
    xl: layout === "vertical" ? 2 : 5
  } satisfies GridContainerProps["itemsPerRow"];
  return (
    <Wrapper justifyContent="center" alignItems="center">
      <ContentWrapper flexDirection="column" alignItems="flex-start" gap="5rem">
        {productUuid || bundleUuid ? (
          <CommitModalWithOffer
            sellerId={sellerId}
            productUuid={productUuid}
            bundleUuid={bundleUuid}
            exchange={exchange}
            forcedAccount={requestShipmentProps?.forcedAccount}
            signatures={requestShipmentProps?.signatures}
            parentOrigin={requestShipmentProps?.parentOrigin}
            lookAndFeel="regular"
            hideModal={clearSelection}
            showConnectButton={false}
            showBosonLogoInHeader={true}
            withLeftArrowButton={true}
          />
        ) : exchangeToCancel ? (
          <NonModal
            showConnectButton={false}
            headerComponent={
              <Grid
                gap="1rem"
                style={{ flex: "1 1" }}
                justifyContent="flex-end"
              >
                <ThemedBosonLogo />
              </Grid>
            }
            lookAndFeel="regular"
            hideModal={() => {
              resetExchangeToCancel();
            }}
            closable
            withLeftArrowButton
          >
            <CancelExchange
              exchange={exchangeToCancel}
              showBackButton
              onBackClick={() => {
                resetExchangeToCancel();
              }}
              onPendingSignature={undefined}
              onError={undefined}
              onPendingTransaction={undefined}
              onSuccess={() => {
                resetExchangeToCancel();
              }}
            />
          </NonModal>
        ) : robloxLoggedInData?.isLoggedIn ? (
          <>
            <Grid flexDirection="column" alignItems="flex-start">
              <Typography tag="h3" marginBottom="32px" margin="0">
                Purchased Products
              </Typography>

              <RobloxExchangesGrid
                numProducts={purchasedProductsPageSize}
                fetchNextPage={fetchNextPagePurchasedProducts}
                hasNextPage={hasNextPagePurchasedProducts}
                refetch={refetchPurchasedProducts}
                itemsPerRow={itemsPerRow}
                raiseDisputeForExchangeUrl={raiseDisputeForExchangeUrl}
                exchanges={purchasedProducts}
                handleCancellation={(robloxExchange) => {
                  setExchangeToCancel(robloxExchange);
                }}
                handleRequestShipment={(robloxExchange) => {
                  const { offer } = robloxExchange;
                  if (isProductV1(offer)) {
                    handleSetProductUuid({
                      selectedProductUuid: offer.metadata.product.uuid,
                      exchange: robloxExchange
                    });
                  } else if (isBundle(offer)) {
                    handleSetBundleUuid({
                      selectedBundleUuid: offer.metadata.bundleUuid,
                      exchange: robloxExchange
                    });
                  }
                }}
                isLoading={purchasedProductsLoading}
              />
            </Grid>
            <Grid flexDirection="column" alignItems="flex-start">
              <Typography tag="h3" margin="0">
                Available Products
              </Typography>
              <Typography
                marginBottom="32px"
                color={getCssVar("--sub-text-color")}
              >
                Following products are available for you based on the Roblox
                inventory you have
              </Typography>
              <RobloxProductsGrid
                fetchNextPage={fetchNextPageAvailableProducts}
                hasNextPage={hasNextPageAvailableProducts}
                refetch={refetchAvailableProducts}
                itemsPerRow={itemsPerRow}
                products={availableProducts}
                handleSetProductUuid={(uuid) =>
                  handleSetProductUuid({ selectedProductUuid: uuid })
                }
                handleSetBundleUuid={(uuid) =>
                  handleSetBundleUuid({ selectedBundleUuid: uuid })
                }
                isLoading={availableProductLoading}
                isLoggedInWithRoblox={!!robloxLoggedInData?.isLoggedIn}
              />
            </Grid>
            <Grid flexDirection="column" alignItems="flex-start">
              <Typography tag="h3" margin={0}>
                Unavailable products
              </Typography>
              <Typography
                marginBottom="32px"
                color={getCssVar("--sub-text-color")}
              >
                Other products that can be purchased when you have the right
                Roblox inventory item.
              </Typography>
              <RobloxProductsGrid
                fetchNextPage={fetchNextPageUnavailableProducts}
                hasNextPage={hasNextPageUnavailableProducts}
                refetch={refetchUnavailableProducts}
                itemsPerRow={itemsPerRow}
                products={unavailableProducts}
                handleSetProductUuid={(uuid) =>
                  handleSetProductUuid({ selectedProductUuid: uuid })
                }
                handleSetBundleUuid={(uuid) =>
                  handleSetBundleUuid({ selectedBundleUuid: uuid })
                }
                isLoading={unavailableProductsLoading}
                isLoggedInWithRoblox={!!robloxLoggedInData?.isLoggedIn}
              />
            </Grid>
          </>
        ) : showProductsPreLogin && !robloxLoggedInData?.isLoggedIn ? (
          <>
            <Grid flexDirection="column" alignItems="flex-start">
              <Typography tag="h3" margin="0">
                Roblox exclusives
              </Typography>
              <Typography
                marginBottom="32px"
                color={getCssVar("--sub-text-color")}
              >
                Other products that can be purchased when you have the right
                Roblox inventory item.
              </Typography>
              <RobloxProductsGrid
                fetchNextPage={fetchNextPageProducts}
                hasNextPage={hasNextPageProducts}
                refetch={refetchProducts}
                itemsPerRow={itemsPerRow}
                products={robloxExclusives}
                isLoading={robloxExclusivesLoading}
                isLoggedInWithRoblox={!!robloxLoggedInData?.isLoggedIn}
              />
            </Grid>
          </>
        ) : (
          <></>
        )}
      </ContentWrapper>
    </Wrapper>
  );
};
