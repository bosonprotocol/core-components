import React, { ReactNode, useState } from "react";
import {
  Currencies,
  CurrencyDisplay
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
  ProductTypeWrapper,
  Label
} from "./ProductCard.styles";

import { ProductType, LabelType } from "./const";
import { Grid } from "../ui/Grid";
import { CircleHalf } from "phosphor-react";

interface IProductCard {
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
  label?: (typeof LabelType)[keyof typeof LabelType];
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
    hideCreatorName = false,
    isImageFitCover = false,
    className,
    productType,
    label
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
        {label === LabelType.purchased && (
          <Label data-test="label">Purchased</Label>
        )}
        <Image {...imageProps} />
        {CTAOnHover && (
          <CTAOnHoverContainer $isHovered={isHovered}>
            {CTAOnHover}
          </CTAOnHoverContainer>
        )}
      </ProductCardImageWrapper>

      <ProductCardBottom>
        <ProductCardBottomContent>
          <Grid flexDirection="column">
            <ProductCardTitleWrapper>
              <ProductCardTitle fontSize={"0.75rem"} fontWeight={"600"}>
                {title}
              </ProductCardTitle>
            </ProductCardTitleWrapper>
            {!hideCreatorName && (
              <ProductCardCreatorName data-avatarname="product-card">
                {avatarName}
              </ProductCardCreatorName>
            )}
          </Grid>
          <Wrapper tooltip={tooltip} tooltipProps={tooltipProps}>
            <CurrencyDisplay
              value={price}
              currency={currency}
              fontSize={"0.875rem"}
              iconSize={16}
              gap={"0.3125rem"}
              style={{
                wordBreak: "break-all",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "0.25rem"
              }}
            />
          </Wrapper>
          {productType === ProductType.phygital && (
            <ProductTypeWrapper>
              <CircleHalf />
              Phygital
            </ProductTypeWrapper>
          )}
        </ProductCardBottomContent>
      </ProductCardBottom>
    </ProductCardWrapper>
  );
};
