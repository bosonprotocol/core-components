import styled from "styled-components";
import React, { useState } from "react";
import { Typography } from "../../../ui/Typography";
import { Grid } from "../../../ui/Grid";
import { CommitModalWithOffer } from "../../commit/CommitModalWithOffer";
import { RobloxProductsGrid } from "./RobloxProductsGrid";
import { useRobloxProducts } from "../../../../hooks/roblox/useRobloxProducts";
import { useRobloxExchanges } from "../../../../hooks/roblox/useRobloxExchanges";
import { useAccount } from "../../../../hooks";
import { RobloxExchangesGrid } from "./RobloxExchangesGrid";
import {
  BosonRobloxExchange,
  ProductAvailabilityStatus
} from "../../../../hooks/roblox/backend.types";
import { CancelExchange } from "../../../modal/components/Redeem/ExchangeView/cancellation/CancelExchange";
import NonModal from "../../../modal/nonModal/NonModal";
import { useIsRobloxLoggedIn } from "../../../../hooks/roblox/useIsRobloxLoggedIn";
import { getCssVar } from "../../../../theme";
import { GridContainerProps } from "../../../ui/GridContainer";
import { isBundle, isProductV1 } from "../../../../lib/offer/filter";
import { subgraph } from "@bosonprotocol/core-sdk";
import { CommitNonModalProps } from "../../../modal/components/Commit/CommitNonModal";
import { maxWidthStepper } from "./styles";

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
  requestShipmentProps: CommitNonModalProps["requestShipmentProps"];
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
  const { data: robloxProducts, isLoading } = useRobloxProducts({
    sellerId,
    options: { enabled: true }
  });
  const robloxExclusives = robloxProducts;
  const robloxExclusivesLoading = isLoading;
  const availableProducts = robloxProducts?.filter((robloxProduct) =>
    (
      [
        "AVAILABLE",
        "POTENTIALLY",
        "PENDING"
      ] satisfies ProductAvailabilityStatus["status"][]
    )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .includes(robloxProduct.availability.status as any)
  );
  const unavailableProducts = robloxProducts?.filter((robloxProduct) =>
    (
      [
        "NOT_AVAILABLE",
        "UNKNOWN"
      ] satisfies ProductAvailabilityStatus["status"][]
    )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .includes(robloxProduct.availability.status as any)
  );
  const unavailableProductsLoading = isLoading;
  const availableProductLoading = isLoading;
  const { data: purchasedProducts, isLoading: purchasedProductsLoading } =
    useRobloxExchanges({
      sellerId,
      userWallet: address ?? "",
      options: { enabled: !!address }
    });
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
    xs: 1,
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
            requestShipmentProps={requestShipmentProps}
            lookAndFeel="regular"
            hideModal={clearSelection}
            withExternalSigner={false}
            showBosonLogoInFooter={false}
          />
        ) : exchangeToCancel ? (
          <NonModal
            showConnectButton={false}
            lookAndFeel="regular"
            hideModal={() => {
              resetExchangeToCancel();
            }}
            closable
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
