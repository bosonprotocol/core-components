import React from "react";
import {
  CurrencyDisplay,
  Currencies
} from "../currencyDisplay/CurrencyDisplay";

import {
  ProductCarData,
  ProductCardBottom,
  ProductCardPrice,
  ProductCardPriceWrapper,
  ProductCardTop,
  ProductCardWrapper,
  ProductCreator,
  ProductCreatorAvatar,
  ProductCreatorName,
  ProductTitle,
  ProductTypeWrapper
} from "./ProductCard.styles";

export enum ProductType {
  phygital = "Phygital",
  physical = "Physical",
  digital = "Digital"
}

interface ProductCardProps {
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  currency: Currencies;
  productType: ProductType;
  seller: {
    name: string;
    avatar: string;
  };
  onCardClick?: (productId: string) => void;
}

export const ProductCard = ({
  productId,
  productTitle,
  productImage,
  productPrice,
  currency,
  productType,
  seller,
  onCardClick
}: ProductCardProps) => {
  return (
    <ProductCardWrapper
      onClick={() => {
        onCardClick?.(productId);
      }}
    >
      <ProductCardTop>
        <img
          alt={productTitle}
          src={productImage}
          decoding="async"
          data-nimg="fill"
        />
      </ProductCardTop>
      <ProductCardBottom>
        <ProductCarData>
          <ProductCreator>
            <ProductCreatorAvatar>
              <img src={seller.avatar} alt="seller_avatar" />
            </ProductCreatorAvatar>
            <ProductCreatorName>{seller.name}</ProductCreatorName>
          </ProductCreator>
          <ProductTitle>{productTitle}</ProductTitle>
          <ProductTypeWrapper>
            <span>{productType}</span>
          </ProductTypeWrapper>
        </ProductCarData>
        <ProductCardPriceWrapper>
          <ProductCardPrice>Price</ProductCardPrice>
          <CurrencyDisplay value={productPrice} currency={currency} />
        </ProductCardPriceWrapper>
      </ProductCardBottom>
    </ProductCardWrapper>
  );
};
