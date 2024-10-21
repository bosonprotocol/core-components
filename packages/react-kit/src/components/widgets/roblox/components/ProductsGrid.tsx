import { subgraph } from "@bosonprotocol/core-sdk";
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

const colors = theme.colors.light;

const commonCardStyles = css`
  background: transparent;
  box-shadow: unset;
`;
const TransparentProductCard = styled(ProductCard)`
  ${commonCardStyles}
`;
const TransparentSkeletonProductCard = styled(ProductCardSkeleton)`
  ${commonCardStyles}
`;

export type ProductsGridProps = {
  products: subgraph.OfferFieldsFragment[];
  isLoading: boolean;
  numProducts?: number;
} & (
  | {
      cta: "buy";
      handleSetProductUuid: (uuid: string) => void;
      handleSetBundleUuid: (uuid: string) => void;
      handleRequestShipment?: never;
    }
  | {
      cta: "request-shipment";
      handleRequestShipment: (offer: subgraph.OfferFieldsFragment) => void;
      handleSetProductUuid?: never;
      handleSetBundleUuid?: never;
    }
);
export const ProductsGrid = ({
  isLoading,
  numProducts,
  products,
  cta,
  handleSetBundleUuid,
  handleSetProductUuid,
  handleRequestShipment
}: ProductsGridProps) => {
  const { address } = useAccount();
  const { ipfsImageGateway } = useIpfsContext();
  return (
    <GridContainer columnGap="2rem" rowGap="2rem" width="100%">
      {isLoading
        ? new Array(numProducts || 4).fill(null).map(() => {
            return <TransparentSkeletonProductCard />;
          })
        : products
            .filter((offer) => offer.metadata)
            .map((offer) => {
              if (!offer.metadata || !(isProductV1(offer) || isBundle(offer))) {
                return null;
              }
              const metadata = offer.metadata;
              const { mainImage } = getOfferDetails(offer);
              const imageOptimizationOptions = {
                height: 500
              };
              const imageSrc = getImageUrl(
                (mainImage || metadata?.imageUrl) ?? "",
                ipfsImageGateway,
                imageOptimizationOptions
              );

              return (
                <TransparentProductCard
                  avatarName=""
                  currency={offer.exchangeToken.symbol as Currencies}
                  price={utils.formatUnits(
                    offer.price || "0",
                    offer.exchangeToken.decimals
                  )}
                  title={offer.metadata?.name ?? ""}
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
                    address ? (
                      <Button>Connect Account</Button>
                    ) : cta === "buy" ? (
                      <Button
                        onClick={() => {
                          if (isProductV1(offer) && offer.metadata?.uuid) {
                            handleSetProductUuid(offer.metadata.uuid);
                          } else if (
                            isBundle(offer) &&
                            offer.metadata?.bundleUuid
                          ) {
                            handleSetBundleUuid(offer.metadata.bundleUuid);
                          }
                        }}
                      >
                        Buy
                      </Button>
                    ) : (
                      <Button onClick={() => handleRequestShipment(offer)}>
                        Request Shipment
                      </Button>
                    )
                  }
                />
              );
            })}
    </GridContainer>
  );
};
