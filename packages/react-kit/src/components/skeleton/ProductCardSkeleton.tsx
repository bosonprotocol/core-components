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
export const ProductCardSkeleton = (props: SkeletonCardProps) => {
  const { withBottomText } = props;

  return (
    <ProductCardWrapper {...props} $isHoverDisabled={true}>
      <ProductCardImageWrapperStyled>
        <LoadingBubble
          $width="100%"
          $height="340px"
          $borderRadius="0px"
          $backgroundColor={theme.colors.light.darkGrey}
        />
      </ProductCardImageWrapperStyled>
      <ProductCardBottom>
        <div>
          <ProductCardTitleWrapper>
            <ProductCardTitle>
              <LoadingBubble $width="70%" $height="30px" />
            </ProductCardTitle>
          </ProductCardTitleWrapper>
        </div>
        {withBottomText && (
          <BottomText>
            <LoadingBubble $width="30%" $height="15.5px" />
          </BottomText>
        )}
      </ProductCardBottom>
    </ProductCardWrapper>
  );
};
