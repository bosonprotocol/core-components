import React, { ReactNode, useState } from "react";
import {
  Currencies,
  CurrencyDisplay,
  CurrencyDisplayProps
} from "../currencyDisplay/CurrencyDisplay";
import { IBaseImage, Image } from "../image/Image";
import { Tooltip, TooltipProps } from "../tooltip/Tooltip";
import {
  ProductCardBottom,
  ProductCardBottomContent,
  ProductCardCreatorName,
  ProductCardImageWrapper,
  ProductCardTitle,
  ProductCardTitleWrapper,
  ProductCardWrapper,
  CTAOnHoverContainer,
  ProductTypeWrapper
} from "./ProductCard.styles";

import { ProductType } from "./const";
import { Grid } from "../ui/Grid";
import { CircleHalf } from "phosphor-react";
import { isMobile } from "@bosonprotocol/utils";
import { Typography } from "../ui/Typography";
import { getCssVar } from "../../theme";
import { ExchangeCardStatus } from "../exchangeCard/types";

export const PhygitalLabel = () => {
  return (
    <ProductTypeWrapper>
      <CircleHalf />
      <Typography fontSize={"0.75rem"} fontWeight={600}>
        Phygital
      </Typography>
    </ProductTypeWrapper>
  );
};

export interface IProductCard {
  asterisk?: boolean;
  onAvatarError?: React.ReactEventHandler<HTMLImageElement> | undefined;
  avatarName: JSX.Element | string;
  bottomText?: string;
  currency: Currencies;
  dataCard?: string;
  dataTestId?: string;
  imageProps: IBaseImage;
  isHoverDisabled?: boolean;
  onAvatarNameClick?: () => void;
  onCardClick?: () => void;
  price: string;
  productType?: ProductType;
  title: string;
  tooltip?: string;
  tooltipProps?: Omit<TooltipProps, "content">;
  CTAOnHover?: ReactNode;
  hideCreatorName?: boolean;
  isImageFitCover?: boolean;
  className?: string;
  currencyColor?: CurrencyDisplayProps["color"];
  status?: ExchangeCardStatus;
}

const Wrapper = ({
  children,
  tooltip,
  tooltipProps
}: {
  children: React.ReactElement;
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
    avatarName,
    currency,
    dataCard = "product-card",
    dataTestId = "offer",
    imageProps,
    isHoverDisabled = false,
    onCardClick,
    price,
    title,
    tooltip = "",
    tooltipProps = {},
    CTAOnHover,
    hideCreatorName = true,
    isImageFitCover = false,
    className,
    productType,
    currencyColor
  } = props;

  const [isHovered, setIsHovered] = useState(false);

  return (
    <ProductCardWrapper
      data-card={dataCard}
      $isHoverDisabled={isHoverDisabled}
      data-testid={dataTestId}
      $isImageFitCover={isImageFitCover}
      onClick={(e) => {
        e.preventDefault();
        onCardClick?.();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
      $isClickable={!!onCardClick}
    >
      <ProductCardImageWrapper>
        <Image {...imageProps} />
        {CTAOnHover && !isMobile && (
          <CTAOnHoverContainer $isHovered={isHovered}>
            {CTAOnHover}
          </CTAOnHoverContainer>
        )}
      </ProductCardImageWrapper>
      <ProductCardBottom>
        <ProductCardBottomContent>
          <Grid flexDirection="row" alignItems="flex-start">
            <ProductCardTitleWrapper>
              <ProductCardTitle
                fontSize={"0.75rem"}
                color={getCssVar("--main-text-color")}
                fontWeight={"600"}
              >
                {title}
              </ProductCardTitle>
            </ProductCardTitleWrapper>
            {!hideCreatorName && (
              <ProductCardCreatorName data-avatarname="product-card">
                {avatarName}
              </ProductCardCreatorName>
            )}
            <Wrapper tooltip={tooltip} tooltipProps={tooltipProps}>
              <CurrencyDisplay
                value={price}
                currency={currency}
                fontSize={"0.875rem"}
                color={currencyColor}
                iconSize={16}
                gap={"0.3125rem"}
                style={{
                  alignItems: "center",
                  justifyContent: "center"
                }}
              />
            </Wrapper>
          </Grid>

          {productType === ProductType.phygital && <PhygitalLabel />}
        </ProductCardBottomContent>
      </ProductCardBottom>
    </ProductCardWrapper>
  );
};
