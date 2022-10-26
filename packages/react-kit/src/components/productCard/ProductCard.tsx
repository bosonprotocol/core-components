import React from "react";
import {
  Currencies,
  CurrencyDisplay
} from "../currencyDisplay/CurrencyDisplay";
import { IBaseImage, Image } from "../image/Image";
import { Tooltip, TooltipProps } from "../tooltip/Tooltip";
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
  ProductCardTop,
  ProductCardWrapper
} from "./ProductCard.styles";

export enum ProductType {
  phygital = "Phygital",
  physical = "Physical",
  digital = "Digital"
}
interface IProductCard {
  asterisk?: boolean;
  avatar: string;
  avatarName: JSX.Element | string;
  bottomText?: string;
  currency: Currencies;
  dataCard?: string;
  dataTestId?: string;
  imageProps: IBaseImage;
  isHoverDisabled?: boolean;
  onAvatarNameClick?: () => void;
  onCardClick?: (id: string | number) => void;
  price: number;
  productId: string;
  productType?: ProductType;
  title: string;
  tooltip?: string;
  tooltipProps?: TooltipProps;
}

export const ProductCard = (props: IProductCard) => {
  const {
    asterisk = false,
    avatar,
    avatarName,
    bottomText,
    currency,
    dataCard = "product-card",
    dataTestId = "offer",
    imageProps,
    isHoverDisabled = false,
    onAvatarNameClick,
    onCardClick,
    price,
    productId,
    title,
    tooltip = "",
    tooltipProps = {}
  } = props;

  const isNotImageLoaded = ["idle", "loading", "error"].includes(
    imageProps?.preloadConfig?.status ?? ""
  );

  const Wrapper = tooltip && tooltip !== "" ? Tooltip : React.Fragment;
  const wrapperParams =
    tooltip && tooltip !== ""
      ? { wrap: false, content: tooltip, ...tooltipProps }
      : {};

  return (
    <ProductCardWrapper
      data-card={dataCard}
      $isHoverDisabled={isHoverDisabled}
      data-testid={dataTestId}
      onClick={(e) => {
        e.preventDefault();
        onCardClick?.(productId);
      }}
    >
      <ProductCardTop $isNotImageLoaded={isNotImageLoaded}>
        <ProductCardImageWrapper>
          <Image {...imageProps} />
        </ProductCardImageWrapper>
      </ProductCardTop>
      <ProductCardBottom $isNotImageLoaded={isNotImageLoaded}>
        <ProductCardBottomContent>
          <ProductCardData>
            <ProductCardCreator
              onClick={(e) => {
                e.stopPropagation();
                onAvatarNameClick?.();
              }}
            >
              <ProductCardCreatorAvatar>
                <img src={avatar} alt="avatar" />
              </ProductCardCreatorAvatar>
              <ProductCardCreatorName data-avatarname="product-card">
                {avatarName}
              </ProductCardCreatorName>
            </ProductCardCreator>
            <ProductCardTitle>{title}</ProductCardTitle>
          </ProductCardData>
          <ProductCardPriceWrapper>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <Wrapper {...wrapperParams}>
              <ProductCardPrice>Price {asterisk && "*"}</ProductCardPrice>
              <CurrencyDisplay value={price} currency={currency} />
            </Wrapper>
          </ProductCardPriceWrapper>
        </ProductCardBottomContent>
        {bottomText && <BottomText>{bottomText}</BottomText>}
      </ProductCardBottom>
    </ProductCardWrapper>
  );
};
