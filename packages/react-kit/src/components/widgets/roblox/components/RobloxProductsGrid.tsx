import { GridContainer } from "../../../ui/GridContainer";
import { ProductCard } from "../../../productCard/ProductCard";
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
import {
  CommitButtonView,
  CommitButtonViewProps
} from "../../../buttons/CommitButtonView";
import { ProductType } from "../../../productCard/const";
import { ConnectWalletWithLogic } from "./ConnectWalletWithLogic";
import { ButtonThemeProps } from "./types";
import { BosonRobloxProductWithAvailability } from "../../../../hooks/roblox/backend.types";
import { Typography } from "../../../ui/Typography";
import { isTruthy } from "../../../../types/helpers";
import { LoginWithRoblox } from "./LoginWithRoblox";

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

export type RobloxProductsGridProps = {
  isLoading: boolean;
  products: BosonRobloxProductWithAvailability[] | undefined;
  numProducts?: number;
  walletButtonTheme: ButtonThemeProps;
  robloxButtonTheme: ButtonThemeProps;
  commitButtonTheme:
    | Pick<CommitButtonViewProps, "color" | "layout" | "shape">
    | undefined;
  handleSetProductUuid?: (uuid: string) => void;
  handleSetBundleUuid?: (uuid: string) => void;
  isLoggedInWithRoblox: boolean;
};
export const RobloxProductsGrid = ({
  isLoading,
  numProducts,
  products,
  walletButtonTheme,
  robloxButtonTheme,
  commitButtonTheme,
  handleSetBundleUuid,
  handleSetProductUuid,
  isLoggedInWithRoblox
}: RobloxProductsGridProps) => {
  const { address } = useAccount();
  const { ipfsImageGateway } = useIpfsContext();
  return (
    <GridContainer columnGap="2rem" rowGap="2rem" width="100%">
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
                CTAOnHover={
                  !isLoggedInWithRoblox ? (
                    <LoginWithRoblox
                      sellerId={seller.id}
                      robloxButtonTheme={robloxButtonTheme}
                    />
                  ) : !address ? (
                    <ConnectWalletWithLogic
                      buttonThemeProps={walletButtonTheme}
                      connectWalletButtonDisabled={false}
                    />
                  ) : (
                    <CommitButtonView
                      onClick={() => {
                        if (isProductV1(offer) && productUuid) {
                          handleSetProductUuid?.(productUuid);
                        } else if (isBundle(offer) && bundleUuid) {
                          handleSetBundleUuid?.(bundleUuid);
                        }
                      }}
                      color={commitButtonTheme?.color}
                      shape={commitButtonTheme?.shape}
                      layout={commitButtonTheme?.layout}
                    />
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
