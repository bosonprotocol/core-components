import { GridContainer } from "../../../ui/GridContainer";
import styled, { css } from "styled-components";
import { Currencies } from "../../../currencyDisplay/CurrencyDisplay";
import { useAccount, useIpfsContext } from "../../../../hooks";
import React from "react";
import { utils } from "ethers";
import { CameraSlash } from "phosphor-react";
import { theme } from "../../../../theme";
import {
  getFallbackImageUrl,
  getImageUrl
} from "../../../../lib/images/images";
import { getOfferDetails } from "../../../../lib/offer/getOfferDetails";
import { isBundle, isProductV1 } from "../../../../lib/offer/filter";
import { ProductCardSkeleton } from "../../../skeleton/ProductCardSkeleton";
import { ProductType } from "../../../productCard/const";
import { ConnectWalletWithLogic } from "./ConnectWalletWithLogic";
import { ButtonThemeProps } from "./types";
import { BosonRobloxExchange } from "../../../../hooks/roblox/backend.types";
import { Typography } from "../../../ui/Typography";
import { isTruthy } from "../../../../types/helpers";
import { ExchangeCard } from "../../../exchangeCard/ExchangeCard";

const colors = theme.colors.light;

const commonCardStyles = css`
  background: transparent;
  box-shadow: unset;
  padding: 0;
  > * {
    padding-top: 0;
  }
`;
const TransparentExchangeCard = styled(ExchangeCard)`
  ${commonCardStyles}
`;
const TransparentSkeletonProductCard = styled(ProductCardSkeleton)`
  ${commonCardStyles}
`;

export type RobloxExchangesGridProps = {
  isLoading: boolean;
  numProducts?: number;
  raiseDisputeForExchangeUrl: string;
  walletButtonTheme: ButtonThemeProps;
  handleRequestShipment: (robloxExchange: BosonRobloxExchange) => void;
  handleCancellation: (robloxExchange: BosonRobloxExchange) => void;
  exchanges: BosonRobloxExchange[] | undefined;
};
export const RobloxExchangesGrid = ({
  isLoading,
  numProducts,
  raiseDisputeForExchangeUrl,
  exchanges,
  walletButtonTheme,
  handleRequestShipment,
  handleCancellation
}: RobloxExchangesGridProps) => {
  const { address } = useAccount();
  const { ipfsImageGateway } = useIpfsContext();
  return (
    <GridContainer columnGap="2rem" rowGap="2rem" width="100%">
      {isLoading ? (
        new Array(numProducts || 3).fill(null).map((_, index) => {
          return <TransparentSkeletonProductCard key={index} />;
        })
      ) : exchanges?.length ? (
        exchanges
          .filter((robloxExchange) => robloxExchange.offer.metadata)
          .map((robloxExchange) => {
            const { offer, state, id: exchangeId } = robloxExchange;
            const { price, metadata } = offer;
            if (!(isProductV1(offer) || isBundle(offer))) {
              return null;
            }
            const { exchangeToken } = offer;
            const { mainImage } = getOfferDetails(offer);
            const imageOptimizationOptions = {
              height: 500
            };
            const imageSrc = getImageUrl(
              (mainImage || metadata?.image) ?? "",
              ipfsImageGateway,
              imageOptimizationOptions
            );

            return (
              <TransparentExchangeCard
                key={exchangeId}
                id={exchangeId}
                productType={
                  isBundle(offer)
                    ? ProductType.phygital
                    : isProductV1(offer)
                      ? ProductType.physical
                      : ProductType.digital
                }
                avatarName=""
                avatar={imageSrc}
                currency={exchangeToken.symbol as Currencies}
                price={utils.formatUnits(price || "0", exchangeToken.decimals)}
                isHoverDisabled
                status={state}
                title={metadata?.name ?? ""}
                imageProps={{
                  src: imageSrc,
                  fallbackSrc: getFallbackImageUrl(
                    imageSrc,
                    ipfsImageGateway,
                    imageOptimizationOptions
                  ),
                  withLoading: true,
                  errorConfig: {
                    errorIcon: <CameraSlash size={32} color={colors.white} />
                  }
                }}
                redeemButtonConfig={
                  {
                    onClick: () => {
                      handleRequestShipment(robloxExchange);
                    },
                    type: "button"
                  } as const
                }
                cancelButtonConfig={
                  {
                    onClick: () => {
                      handleCancellation(robloxExchange);
                    },
                    type: "button"
                  } as const
                }
                disputeButtonConfig={
                  {
                    onClick: () => {
                      const raiseDisputeForExchangeUrlWithId:
                        | string
                        | undefined = raiseDisputeForExchangeUrl?.replace(
                        "{id}",
                        exchangeId || ""
                      );
                      if (raiseDisputeForExchangeUrlWithId) {
                        const urlWithHttpPrefix =
                          raiseDisputeForExchangeUrlWithId.startsWith(
                            "http://"
                          ) ||
                          raiseDisputeForExchangeUrlWithId.startsWith(
                            "https://"
                          )
                            ? raiseDisputeForExchangeUrlWithId
                            : `https://${raiseDisputeForExchangeUrlWithId}`;
                        window.open(urlWithHttpPrefix, "_blank");
                      }
                    },
                    type: "button"
                  } as const
                }
                isConnected={!!address}
                CTAIfDisconnected={
                  <ConnectWalletWithLogic
                    buttonThemeProps={walletButtonTheme}
                    connectWalletButtonDisabled={false}
                  />
                }
              />
            );
          })
          .filter(isTruthy)
      ) : (
        <Typography>No products found</Typography>
      )}
    </GridContainer>
  );
};
