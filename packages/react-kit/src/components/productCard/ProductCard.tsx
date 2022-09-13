import React from "react";
import {
  CurrencyDisplay,
  Currencies
} from "../currencyDisplay/CurrencyDisplay";
import { IBaseImage, Image } from "../image/Image";
import {
  ProductCardImageWrapper,
  BottomText,
  ProductCardBottom,
  ProductCardBottomContent,
  ProductCardCreator,
  ProductCardCreatorAvatar,
  ProductCardCreatorName,
  ProductCardData,
  ProductCardPrice,
  ProductCardPriceWrapper,
  ProductCardTitle,
  ProductCardTop,
  ProductCardWrapper
} from "./ProductCard.styles";

export enum ProductType {
  phygital = "Phygital",
  physical = "Physical",
  digital = "Digital"
}
interface IProductCard {
  productId: string;
  title: string;
  price: number;
  currency: Currencies;
  avatar: string;
  avatarName: string;
  onCardClick?: (id: string | number) => void;
  imageProps: IBaseImage;
  productType?: ProductType;
  bottomText?: string;
}

export const ProductCard = (props: IProductCard) => {
  const {
    productId,
    title,
    imageProps,
    price,
    currency,
    avatar,
    avatarName,
    onCardClick,
    bottomText
  } = props;

  return (
    <ProductCardWrapper
      onClick={(e) => {
        e.preventDefault();
        onCardClick?.(productId);
      }}
    >
      <ProductCardTop>
        <ProductCardImageWrapper>
          <Image {...imageProps} />
        </ProductCardImageWrapper>
      </ProductCardTop>
      <ProductCardBottom>
        <ProductCardBottomContent>
          <ProductCardData>
            <ProductCardCreator>
              <ProductCardCreatorAvatar>
                <img src={avatar} alt="avatar" />
              </ProductCardCreatorAvatar>
              <ProductCardCreatorName>{avatarName}</ProductCardCreatorName>
            </ProductCardCreator>
            <ProductCardTitle>{title}</ProductCardTitle>
          </ProductCardData>
          <ProductCardPriceWrapper>
            <ProductCardPrice>Price</ProductCardPrice>
            <CurrencyDisplay value={price} currency={currency} />
          </ProductCardPriceWrapper>
        </ProductCardBottomContent>
        {bottomText && <BottomText>{bottomText}</BottomText>}
      </ProductCardBottom>
    </ProductCardWrapper>
  );
};
