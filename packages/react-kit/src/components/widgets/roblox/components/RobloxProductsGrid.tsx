import { GridContainer, GridContainerProps } from "../../../ui/GridContainer";
import { ProductCard } from "../../../productCard/ProductCard";
import styled, { css } from "styled-components";
import { Currencies } from "../../../currencyDisplay/CurrencyDisplay";
import { useAccount, useIpfsContext } from "../../../../hooks";
import React, { useCallback, useState } from "react";
import { utils } from "ethers";
import { CameraSlash } from "phosphor-react";
import { colors } from "../../../../theme";
import {
  getFallbackImageUrl,
  getImageUrl
} from "../../../../lib/images/images";
import { getOfferDetails } from "../../../../lib/offer/getOfferDetails";
import { Bundle, isBundle, isProductV1 } from "../../../../lib/offer/filter";
import { ProductCardSkeleton } from "../../../skeleton/ProductCardSkeleton";
import { ProductType } from "../../../productCard/const";
import { ConnectWalletWithLogic } from "./ConnectWalletWithLogic";
import { BosonRobloxProductWithAvailability } from "../../../../lib/roblox/types";
import { Typography } from "../../../ui/Typography";
import { isTruthy } from "../../../../types/helpers";
import { LoginWithRoblox } from "./LoginWithRoblox";
import { ThemedCommitButtonView } from "../../../buttons/commit/ThemedCommitButtonView";
import { isMobile } from "../../../../lib/userAgent/userAgent";

import InfiniteScroll from "react-infinite-scroll-component";
const Wrapper = styled.div`
  width: 100%;
  > * {
    width: 100%;
  }
`;
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
  height: 100%;
`;

export type RobloxProductsGridProps = {
  isLoading: boolean;
  products: BosonRobloxProductWithAvailability[] | undefined;
  numProducts?: number;
  itemsPerRow: GridContainerProps["itemsPerRow"];
  handleSetProductUuid?: (uuid: string) => void;
  handleSetBundleUuid?: (uuid: string) => void;
  isLoggedInWithRoblox: boolean;
  fetchNextPage: () => Promise<unknown> | unknown;
  refetch: () => Promise<unknown> | unknown;
  hasNextPage: boolean | undefined;
};
export const RobloxProductsGrid = ({
  isLoading,
  numProducts,
  itemsPerRow,
  products,
  handleSetBundleUuid,
  handleSetProductUuid,
  isLoggedInWithRoblox,
  fetchNextPage,
  refetch,
  hasNextPage
}: RobloxProductsGridProps) => {
  const { address } = useAccount();
  const { ipfsImageGateway } = useIpfsContext();
  const [isNextLoading, setNextLoading] = useState(false);
  const fetchNextPageLoading = useCallback(async () => {
    setNextLoading(true);
    try {
      await fetchNextPage();
    } finally {
      setNextLoading(false);
    }
  }, [fetchNextPage]);
  const arrayOfLoadingCards = new Array(numProducts || 3)
    .fill(null)
    .map((_, index) => {
      return <TransparentSkeletonProductCard key={index} />;
    });
  return (
    <Wrapper>
      <InfiniteScroll
        style={{ width: "100%" }}
        next={fetchNextPageLoading}
        hasMore={!!hasNextPage}
        loader={<></>}
        dataLength={products?.length || 0}
        refreshFunction={refetch}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <p style={{ textAlign: "center" }}>&#8595; Pull down to refresh</p>
        }
        releaseToRefreshContent={
          <p style={{ textAlign: "center" }}>&#8593; Release to refresh</p>
        }
      >
        <GridContainer
          columnGap="2rem"
          rowGap="2rem"
          width="100%"
          itemsPerRow={itemsPerRow}
        >
          {products?.length || isNextLoading ? (
            <>
              {products
                ?.filter((robloxProduct) => robloxProduct.offer.metadata)
                .map((robloxProduct) => {
                  const { exchangeToken, uuid, offer, product, seller } =
                    robloxProduct;
                  const key = uuid;
                  const { uuid: productUuid } = product;

                  const { price, metadata } = offer;
                  if (!(isProductV1(offer) || isBundle(offer))) {
                    return null;
                  }
                  // if(isProductV1(offer)){
                  //   offer.metadata
                  // }
                  const bundleUuid = isBundle(offer)
                    ? // TODO: remove cast once @bosonprotocol/roblox-sdk uses the same version of @bosonprotocol/core-sdk that we use
                      (offer as Bundle).metadata.bundleUuid
                    : "";

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
                      price={utils.formatUnits(
                        price || "0",
                        exchangeToken.decimals
                      )}
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
                          errorIcon: (
                            <CameraSlash size={32} color={colors.white} />
                          )
                        }
                      }}
                      onCardClick={isMobile ? onCardClick : undefined}
                      CTAOnHover={
                        !isLoggedInWithRoblox && !!seller ? (
                          <LoginWithRoblox sellerId={seller?.id} />
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
                .filter(isTruthy)}
              {isNextLoading && arrayOfLoadingCards}
            </>
          ) : (
            <Typography>No products found</Typography>
          )}
        </GridContainer>
      </InfiniteScroll>
    </Wrapper>
  );
};
