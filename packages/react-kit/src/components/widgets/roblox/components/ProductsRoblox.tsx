import { CSSProperties } from "styled-components";
import React, { useState } from "react";
import { Typography, TypographyProps } from "../../../ui/Typography";
import { Grid } from "../../../ui/Grid";
import { CommitModalWithOffer } from "../../commit/CommitModalWithOffer";
import { RobloxProductsGrid } from "./RobloxProductsGrid";
import { useModal } from "../../../modal/useModal";
import { RequestShipmentModalProps } from "../../../modal/components/RequestShipment/RequestShipmentModal";
import { ButtonThemeProps } from "./types";
import { useRobloxProducts } from "../../../../hooks/roblox/useRobloxProducts";
import { useRobloxExchanges } from "../../../../hooks/roblox/useRobloxExchanges";
import { useAccount } from "../../../../hooks";
import { RobloxExchangesGrid } from "./RobloxExchangesGrid";
import {
  BosonRobloxExchange,
  ProductAvailabilityStatus
} from "../../../../hooks/roblox/backend.types";
import { CancelExchange } from "../../../modal/components/Redeem/ExchangeView/cancellation/CancelExchange";
import { subgraph } from "@bosonprotocol/core-sdk";
import NonModal from "../../../modal/nonModal/NonModal";
import { useIsRobloxLoggedIn } from "../../../../hooks/roblox/useIsRobloxLoggedIn";

const Wrapper = Grid;
const ContentWrapper = Grid;

type SectionThemeProps = Partial<{
  title: {
    style: Partial<TypographyProps["style"]>;
  };
  subtitle: {
    style: Partial<TypographyProps["style"]>;
  };
}>;
export type ProductsRobloxProps = {
  requestShipmentProps: Pick<
    RequestShipmentModalProps,
    | "postDeliveryInfoUrl"
    | "deliveryInfoHandler"
    | "redemptionSubmittedHandler"
    | "redemptionConfirmedHandler"
    | "forcedAccount"
    | "parentOrigin"
    | "signatures"
  >;
  walletButtonTheme: ButtonThemeProps;
  sellerId: string;
  theme?: Partial<{
    style: Partial<TypographyProps["style"]>;
    purchasedProducts: Omit<SectionThemeProps, "subtitle">;
    availableProducts: SectionThemeProps;
    unavailabeProducts: SectionThemeProps;
  }>;
  maxWidth?: CSSProperties["maxWidth"];
  raiseDisputeForExchangeUrl: string;
  showProductsPreLogin: boolean;
};

export const ProductsRoblox = ({
  sellerId,
  raiseDisputeForExchangeUrl,
  theme,
  maxWidth,
  walletButtonTheme,
  requestShipmentProps: {
    deliveryInfoHandler,
    postDeliveryInfoUrl,
    redemptionSubmittedHandler,
    redemptionConfirmedHandler,
    forcedAccount,
    parentOrigin,
    signatures
  },
  showProductsPreLogin
}: ProductsRobloxProps) => {
  const { address } = useAccount();
  const { showModal } = useModal();
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
  console.log({ robloxExclusives });
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
  const [productUuid, setProductUuid] = useState<string>("");
  const [bundleUuid, setBundleUuid] = useState<string>("");
  const [exchangeToCancel, setExchangeToCancel] =
    useState<BosonRobloxExchange>();

  const resetExchangeToCancel = () => setExchangeToCancel(undefined);

  const handleSetProductUuid = (selectedProductUuid: string) => {
    setProductUuid(selectedProductUuid);
    setBundleUuid("");
    resetExchangeToCancel();
  };
  const handleSetBundleUuid = (selectedBundleUuid: string) => {
    setProductUuid("");
    setBundleUuid(selectedBundleUuid);
    resetExchangeToCancel();
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
            withExternalSigner={false}
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
              <Typography
                tag="h3"
                style={theme?.purchasedProducts?.title?.style}
              >
                Purchased Products
              </Typography>

              <RobloxExchangesGrid
                walletButtonTheme={walletButtonTheme}
                raiseDisputeForExchangeUrl={raiseDisputeForExchangeUrl}
                exchanges={purchasedProducts}
                handleCancellation={(robloxExchange) => {
                  setExchangeToCancel(robloxExchange);
                }}
                handleRequestShipment={(robloxExchange) => {
                  showModal("REQUEST_SHIPMENT", {
                    exchange: robloxExchange,
                    deliveryInfoHandler,
                    parentOrigin,
                    postDeliveryInfoUrl,
                    redemptionConfirmedHandler,
                    redemptionSubmittedHandler,
                    signatures,
                    forcedAccount
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
              <RobloxProductsGrid
                walletButtonTheme={walletButtonTheme}
                products={availableProducts}
                handleSetProductUuid={handleSetProductUuid}
                handleSetBundleUuid={handleSetBundleUuid}
                isLoading={availableProductLoading}
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
              <RobloxProductsGrid
                walletButtonTheme={walletButtonTheme}
                products={unavailableProducts}
                handleSetProductUuid={handleSetProductUuid}
                handleSetBundleUuid={handleSetBundleUuid}
                isLoading={unavailableProductsLoading}
              />
            </Grid>
          </>
        ) : showProductsPreLogin && !robloxLoggedInData?.isLoggedIn ? (
          <>
            <Grid flexDirection="column" alignItems="flex-start">
              <Typography
                tag="h3"
                style={theme?.unavailabeProducts?.title?.style}
              >
                Roblox exclusives
              </Typography>
              <Typography style={theme?.unavailabeProducts?.subtitle?.style}>
                Other products that can be purchased when you have the right
                Roblox inventory item.
              </Typography>
              <RobloxProductsGrid
                walletButtonTheme={walletButtonTheme}
                products={robloxExclusives}
                isLoading={robloxExclusivesLoading}
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
