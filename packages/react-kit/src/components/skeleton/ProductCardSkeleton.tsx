import React, { ButtonHTMLAttributes } from "react";
import {
  BottomText,
  ProductCardBottom,
  ProductCardImageWrapper,
  ProductCardTitle,
  ProductCardTitleWrapper,
  ProductCardWrapper
} from "../productCard/ProductCard.styles";
import { theme } from "../../theme";
import { LoadingBubble } from "./common";
import styled from "styled-components";

type SkeletonCardProps = ButtonHTMLAttributes<HTMLDivElement> & {
  withBottomText?: boolean;
};

const ProductCardImageWrapperStyled = styled(ProductCardImageWrapper)`
  overflow: hidden;
  width: 100%;
  /* REMs gives bad height here on smaller views */
  max-height: 210px;
  min-height: 11.25rem;
`;

const ProductCardTitleWrapperStyled = styled(ProductCardTitleWrapper)`
  margin-bottom: 5px;
`;
export const ProductCardSkeleton = (props: SkeletonCardProps) => {
  const { withBottomText } = props;

  return (
    <ProductCardWrapper {...props} $isHoverDisabled={true} $isClickable={false}>
      <ProductCardImageWrapperStyled>
        <LoadingBubble
          $width="100%"
          $height="340px"
          $borderRadius="0px"
          $backgroundColor={theme.colors.light.greyDark}
        />
      </ProductCardImageWrapperStyled>
      <ProductCardBottom>
        <div>
          <ProductCardTitleWrapperStyled>
            <ProductCardTitle>
              <LoadingBubble $width="50%" $height="12px" />
            </ProductCardTitle>
          </ProductCardTitleWrapperStyled>
          <ProductCardTitleWrapperStyled>
            <ProductCardTitle>
              <LoadingBubble $width="20%" $height="8px" />
            </ProductCardTitle>
          </ProductCardTitleWrapperStyled>
        </div>
        {withBottomText && (
          <BottomText>
            <LoadingBubble $width="15%" $height="13px" />
          </BottomText>
        )}
      </ProductCardBottom>
    </ProductCardWrapper>
  );
};
