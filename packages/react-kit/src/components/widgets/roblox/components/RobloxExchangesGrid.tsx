import { GridContainer, GridContainerProps } from "../../../ui/GridContainer";
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
import { isBundle, isProductV1 } from "../../../../lib/offer/filter";
import { ProductCardSkeleton } from "../../../skeleton/ProductCardSkeleton";
import { ProductType } from "../../../productCard/const";
import { ConnectWalletWithLogic } from "./ConnectWalletWithLogic";
import {
  BosonRobloxExchange,
  GetExchangesResponse
} from "@bosonprotocol/roblox-sdk";
import { Typography } from "../../../ui/Typography";
import { isTruthy } from "../../../../types/helpers";
import { ExchangeCard } from "../../../exchangeCard/ExchangeCard";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters
} from "react-query";
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
const TransparentExchangeCard = styled(ExchangeCard)`
  ${commonCardStyles}
`;
const TransparentSkeletonProductCard = styled(ProductCardSkeleton)`
  ${commonCardStyles}
  height: 100%;
`;

export type RobloxExchangesGridProps = {
  isLoading: boolean;
  numProducts?: number;
  itemsPerRow: GridContainerProps["itemsPerRow"];
  raiseDisputeForExchangeUrl: string;
  handleRequestShipment: (robloxExchange: BosonRobloxExchange) => void;
  handleCancellation: (robloxExchange: BosonRobloxExchange) => void;
  exchanges: BosonRobloxExchange[] | undefined;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<InfiniteQueryObserverResult<GetExchangesResponse, unknown>>;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<
    QueryObserverResult<InfiniteData<GetExchangesResponse>, unknown>
  >;
  hasNextPage: boolean | undefined;
};
const gap = "2rem";
export const RobloxExchangesGrid = ({
  isLoading,
  numProducts,
  itemsPerRow,
  raiseDisputeForExchangeUrl,
  exchanges,
  handleRequestShipment,
  handleCancellation,
  fetchNextPage,
  refetch,
  hasNextPage
}: RobloxExchangesGridProps) => {
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
        dataLength={exchanges?.length || 0}
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
          columnGap={gap}
          rowGap={gap}
          width="100%"
          itemsPerRow={itemsPerRow}
        >
          {exchanges?.length || isNextLoading ? (
            <>
              {exchanges
                ?.filter((robloxExchange) => robloxExchange.offer.metadata)
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
                      price={utils.formatUnits(
                        price || "0",
                        exchangeToken.decimals
                      )}
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
                          errorIcon: (
                            <CameraSlash size={32} color={colors.white} />
                          )
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
                              const windowToUse = window.top || window.parent;
                              windowToUse.open(urlWithHttpPrefix, "_blank");
                            }
                          },
                          type: "button"
                        } as const
                      }
                      isConnected={!!address}
                      CTAIfDisconnected={
                        <ConnectWalletWithLogic
                          connectWalletButtonDisabled={false}
                        />
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
