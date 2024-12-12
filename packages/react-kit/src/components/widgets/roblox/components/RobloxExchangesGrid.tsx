import { GridContainer } from "../../../ui/GridContainer";
import { ProductCard } from "../../../productCard/ProductCard";
import styled, { css } from "styled-components";
import { Currencies } from "../../../currencyDisplay/CurrencyDisplay";
import { useAccount, useIpfsContext } from "../../../../hooks";
import { Button } from "../../../buttons/Button";
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
import { LabelType, ProductType } from "../../../productCard/const";
import { ConnectWalletWithLogic } from "./ConnectWalletWithLogic";
import { ButtonThemeProps } from "./types";
import { BosonRobloxExchange } from "../../../../hooks/roblox/backend.types";
import { Typography } from "../../../ui/Typography";
import { isTruthy } from "../../../../types/helpers";

const colors = theme.colors.light;

const commonCardStyles = css`
  background: transparent;
  box-shadow: unset;
  padding: 0;
  > * {
    padding-top: 0;
  }
`;
const TransparentProductCard = styled(ProductCard)`
  ${commonCardStyles}
`;
const TransparentSkeletonProductCard = styled(ProductCardSkeleton)`
  ${commonCardStyles}
`;

export type RobloxExchangesGridProps = {
  isLoading: boolean;
  numProducts?: number;
  walletButtonTheme: ButtonThemeProps;
  handleRequestShipment: (robloxProduct: BosonRobloxExchange) => void;
  exchanges: BosonRobloxExchange[] | undefined;
};
export const RobloxExchangesGrid = ({
  isLoading,
  numProducts,
  exchanges,
  walletButtonTheme,
  handleRequestShipment
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
            const { offer } = robloxExchange;
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
              <TransparentProductCard
                key={robloxExchange.id}
                productType={
                  isBundle(offer)
                    ? ProductType.phygital
                    : isProductV1(offer)
                      ? ProductType.physical
                      : ProductType.digital
                }
                avatarName=""
                currency={exchangeToken.symbol as Currencies}
                price={utils.formatUnits(price || "0", exchangeToken.decimals)}
                isHoverDisabled
                isImageFitCover
                label={LabelType.purchased}
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
                CTAOnHover={
                  !address ? (
                    <ConnectWalletWithLogic
                      buttonThemeProps={walletButtonTheme}
                      connectWalletButtonDisabled={false}
                    />
                  ) : (
                    <Button
                      onClick={() => handleRequestShipment(robloxExchange)}
                    >
                      Request Shipment
                    </Button>
                  )
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
