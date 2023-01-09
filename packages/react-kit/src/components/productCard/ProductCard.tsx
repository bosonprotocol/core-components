import React, { useState } from "react";
import styled from "styled-components";
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
  onAvatarError?: React.ReactEventHandler<HTMLImageElement> | undefined;
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
  tooltipProps?: Omit<TooltipProps, "content">;
}

const Wrapper = ({
  children,
  tooltip,
  tooltipProps
}: {
  children: React.ReactNode;
  tooltip?: string;
  tooltipProps?: Omit<TooltipProps, "content">;
}) => {
  if (tooltip && tooltip !== "") {
    return (
      <Tooltip wrap={false} content={tooltip} {...tooltipProps}>
        {children}
      </Tooltip>
    );
  }
  return <>{children}</>;
};

export const ProductCard = (props: IProductCard) => {
  const {
    asterisk = false,
    avatar,
    onAvatarError,
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

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const isNotImageLoaded = !isImageLoaded;

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
      <ProductCardImageWrapper>
        <Image {...imageProps} onLoaded={() => setIsImageLoaded(true)} />
      </ProductCardImageWrapper>
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
                <img src={avatar} alt="avatar" onError={onAvatarError} />
              </ProductCardCreatorAvatar>
              <ProductCardCreatorName data-avatarname="product-card">
                {avatarName}
              </ProductCardCreatorName>
            </ProductCardCreator>
            <ProductCardTitle>{title}</ProductCardTitle>
          </ProductCardData>
          <ProductCardPriceWrapper>
            <Wrapper tooltip={tooltip} tooltipProps={tooltipProps}>
              <ProductCardPrice>Price {asterisk && "*"}</ProductCardPrice>
              <CurrencyDisplay
                value={price}
                currency={currency}
                style={{
                  wordBreak: "break-all",
                  alignItems: "flex-start",
                  justifyContent: "flex-end"
                }}
              />
            </Wrapper>
          </ProductCardPriceWrapper>
        </ProductCardBottomContent>
        {bottomText && <BottomText>{bottomText}</BottomText>}
      </ProductCardBottom>
    </ProductCardWrapper>
  );
};
