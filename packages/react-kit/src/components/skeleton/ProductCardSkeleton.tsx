import React, { ButtonHTMLAttributes } from "react";
import styled, { CSSProperties, css, keyframes } from "styled-components";
import { lighten } from "polished";
import {
  BottomText,
  ProductCardBottom,
  ProductCardBottomContent,
  ProductCardCreator,
  ProductCardCreatorAvatar,
  ProductCardCreatorName,
  ProductCardData,
  ProductCardImageWrapper,
  ProductCardPrice,
  ProductCardPriceWrapper,
  ProductCardTitle,
  ProductCardTitleWrapper,
  ProductCardWrapper
} from "../productCard/ProductCard.styles";
import Grid from "../ui/Grid";
import { theme } from "../../theme";
import { LoadingBubble } from "./common";

type SkeletonCardProps = ButtonHTMLAttributes<HTMLDivElement> & {
  withBottomText?: boolean;
};
export const ProductCardSkeleton = (props: SkeletonCardProps) => {
  const { withBottomText } = props;

  return (
    <ProductCardWrapper {...props} $isHoverDisabled={true}>
      <ProductCardImageWrapper>
        <LoadingBubble
          $width="100%"
          $height="340px"
          $borderRadius="0px"
          $backgroundColor={theme.colors.light.darkGrey}
        />
      </ProductCardImageWrapper>
      <ProductCardBottom>
        <div>
          <ProductCardBottomContent>
            <ProductCardData>
              <ProductCardCreator>
                <ProductCardCreatorAvatar>
                  <LoadingBubble $width="16px" $height="16px" />
                </ProductCardCreatorAvatar>
                <ProductCardCreatorName data-avatarname="product-card">
                  <LoadingBubble $width="50px" $height="12.5px" />
                </ProductCardCreatorName>
              </ProductCardCreator>
            </ProductCardData>
            <ProductCardPriceWrapper>
              <ProductCardPrice>
                <Grid justifyContent="flex-end">
                  <LoadingBubble $width="30px" $height="10px" />
                </Grid>
              </ProductCardPrice>
              <Grid justifyContent="flex-end" gap="8px">
                <LoadingBubble $width="24px" $height="24px" />
                <LoadingBubble $width="calc(100% - 24px - 8px)" />
              </Grid>
            </ProductCardPriceWrapper>
          </ProductCardBottomContent>
          <ProductCardTitleWrapper>
            <ProductCardTitle>
              <LoadingBubble $width="100%" $height="30px" />
            </ProductCardTitle>
          </ProductCardTitleWrapper>
        </div>
        {withBottomText && (
          <BottomText>
            <LoadingBubble $width="100%" $height="15.5px" />
          </BottomText>
        )}
      </ProductCardBottom>
    </ProductCardWrapper>
  );
};
