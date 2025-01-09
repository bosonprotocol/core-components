import { GridContainer, GridContainerProps } from "../../../ui/GridContainer";
import { ProductCard } from "../../../productCard/ProductCard";
import styled, { css } from "styled-components";
import { Currencies } from "../../../currencyDisplay/CurrencyDisplay";
import { useAccount, useIpfsContext } from "../../../../hooks";
import React from "react";
import { utils } from "ethers";
import { CameraSlash } from "phosphor-react";
import { colors } from "../../../../theme";
import {
  getFallbackImageUrl,
  getImageUrl
} from "../../../../lib/images/images";
import { getOfferDetails } from "../../../../lib/offer/getOfferDetails";
import { isBundle, isProductV1 } from "../../../../lib/offer/filter";
import { ProductCardSkeleton } from "../../../skeleton/ProductCardSkeleton";
import { ProductType } from "../../../productCard/const";
import { ConnectWalletWithLogic } from "./ConnectWalletWithLogic";
import { BosonRobloxProductWithAvailability } from "../../../../hooks/roblox/backend.types";
import { Typography } from "../../../ui/Typography";
import { isTruthy } from "../../../../types/helpers";
import { LoginWithRoblox } from "./LoginWithRoblox";
import { ThemedCommitButtonView } from "../../../buttons/ThemedCommitButtonView";
import { isMobile } from "../../../../lib/userAgent/userAgent";

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

export type RobloxProductsGridProps = {
  isLoading: boolean;
  products: BosonRobloxProductWithAvailability[] | undefined;
  numProducts?: number;
  itemsPerRow: GridContainerProps["itemsPerRow"];
  handleSetProductUuid?: (uuid: string) => void;
  handleSetBundleUuid?: (uuid: string) => void;
  isLoggedInWithRoblox: boolean;
};
export const RobloxProductsGrid = ({
  isLoading,
  numProducts,
  itemsPerRow,
  products,
  handleSetBundleUuid,
  handleSetProductUuid,
  isLoggedInWithRoblox
}: RobloxProductsGridProps) => {
  const { address } = useAccount();
  const { ipfsImageGateway } = useIpfsContext();
  console.log({ isMobile });
  return (
    <GridContainer
      columnGap="2rem"
      rowGap="2rem"
      width="100%"
      itemsPerRow={itemsPerRow}
    >
      {isLoading ? (
        new Array(numProducts || 3).fill(null).map((_, index) => {
          return <TransparentSkeletonProductCard key={index} />;
        })
      ) : products?.length ? (
        products
          .filter((robloxProduct) => robloxProduct.offer.metadata)
          .map((robloxProduct) => {
            const { exchangeToken, uuid, offer, product, seller } =
              robloxProduct;
            const key = uuid;
            const { uuid: productUuid } = product;

            const { price, metadata } = offer;
            if (!(isProductV1(offer) || isBundle(offer))) {
              return null;
            }
            const bundleUuid = isBundle(offer) ? offer.metadata.bundleUuid : "";

            const { mainImage } = getOfferDetails(offer);
            const imageOptimizationOptions = {
              height: 500
            };
            const imageSrc = getImageUrl(
              (mainImage || metadata?.image) ?? "",
              ipfsImageGateway,
              imageOptimizationOptions
            );
            const onCardClick = () => {
              if (isProductV1(offer) && productUuid) {
                handleSetProductUuid?.(productUuid);
              } else if (isBundle(offer) && bundleUuid) {
                handleSetBundleUuid?.(bundleUuid);
              }
            };
            return (
              <TransparentProductCard
                key={key}
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
                onCardClick={isMobile ? onCardClick : undefined}
                CTAOnHover={
                  !isLoggedInWithRoblox ? (
                    <LoginWithRoblox sellerId={seller.id} />
                  ) : !address ? (
                    <ConnectWalletWithLogic
                      connectWalletButtonDisabled={false}
                    />
                  ) : (
                    <ThemedCommitButtonView onClick={onCardClick} />
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
