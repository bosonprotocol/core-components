import { subgraph } from "@bosonprotocol/core-sdk";
import { GridContainer } from "../../../ui/GridContainer";
import { ProductCard } from "../../../productCard/ProductCard";
import styled from "styled-components";
import { Currencies } from "../../../currencyDisplay/CurrencyDisplay";
import { useAccount } from "../../../../hooks";
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
import { isTruthy } from "../../../../types/helpers";
import { isBundle, isProductV1 } from "../../../../lib/offer/filter";

const colors = theme.colors.light;

const TransparentProductCard = styled(ProductCard)`
  background: transparent;
  box-shadow: unset;
`;

export type ProductsGridProps = {
  products: subgraph.OfferFieldsFragment[];
};
export const ProductsGrid = ({ products }: ProductsGridProps) => {
  const { address } = useAccount();

  return (
    <GridContainer columnGap="2rem" rowGap="2rem">
      {products
        .filter((offer) => offer.metadata)
        .filter((offer) => isProductV1(offer) || isBundle(offer))
        .map((offer) => {
          if (!offer.metadata || !(isProductV1(offer) || isBundle(offer))) {
            return null;
          }
          const { mainImage } = getOfferDetails(offer.metadata);

          const imageSrc = getImageUrl(
            (mainImage || metadata?.imageUrl) ?? "",
            {
              height: 500
            }
          );
          return (
            <TransparentProductCard
              avatarName=""
              currency={Currencies.BOSON}
              price={utils.formatUnits(
                offer.price || "0",
                offer.exchangeToken.decimals
              )}
              title={offer.metadata?.name ?? ""}
              imageProps={{
                src: imageSrc,
                fallbackSrc: getFallbackImageUrl(imageSrc),
                withLoading: true,
                errorConfig: {
                  errorIcon: <CameraSlash size={32} color={colors.white} />
                }
              }}
              CTAOnHover={
                address ? <Button>Connect Account</Button> : undefined
              }
            />
          );
        })}
    </GridContainer>
  );
};
