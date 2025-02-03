import styled, { css } from "styled-components";
import { colors, getCssVar } from "../../theme";
import { cardWrapperStyles } from "./commonStyles";
import { Typography } from "../ui/Typography";
import { zIndex } from "../ui/zIndex";
import { buttonBorderRadius } from "../../borders";
import { ExchangeCardStatus } from "../exchangeCard/types";

export const ProductCardLabelWrapper = styled.div`
  z-index: 1;
  position: relative;
  background-color: ${getCssVar("--main-text-color")};
  color: ${getCssVar("--background-accent-color")};
  border-radius: ${buttonBorderRadius["mid"]};
  padding: 0.125rem 0.5rem 0.125rem 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  position: relative;
  left: 0;
`;

export const ProductCardCreator = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ProductCardCreatorAvatar = styled.div`
  width: 1rem;
  height: 1rem;
  flex: none;
  order: 0;
  flex-grow: 0;
  img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }
`;

export const ProductCardCreatorName = styled.div`
  font-weight: 600;
  font-size: 0.625rem;
  line-height: 150%;
  color: ${colors.greyDark};
  flex: none;
  order: 1;
  flex-grow: 0;
  justify-self: flex-start;
  margin-right: auto;
  > span {
    font-weight: 600;
    font-size: 0.625rem;
    color: ${colors.greyDark};
  }
`;

export const ProductCardTitle = styled(Typography).attrs({
  className: "title"
})`
  max-height: calc(1.5em * 2);
`;

export const ProductCardPriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  max-width: 50%;
  min-width: 44%;
  span {
    padding-left: 0.5rem;
  }
`;

export const ProductCardPrice = styled.div`
  font-size: 0.75rem;
  line-height: 150%;
  text-align: right;
  margin-bottom: 0.25rem;
  color: ${colors.greyDark};
`;

export const ProductCardBottom = styled.div.attrs({ className: "bottom" })`
  width: 100%;
  height: 12rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  z-index: ${zIndex.ChatSeparator};
  flex: 0;
`;
export const ProductCardBottomContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  align-items: flex-start;
  column-gap: 0.25rem;
`;

export const ProductCardTitleWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  align-items: flex-start;
`;

export const ProductCardWrapper = styled.div<{
  $isHoverDisabled: boolean;
  $isImageFitCover?: boolean;
  $isClickable?: boolean;
}>`
  ${cardWrapperStyles}
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  min-height: 286px;
  height: 286px;
  ${({ $isHoverDisabled }) =>
    $isHoverDisabled
      ? ""
      : css`
          transition: all 300ms ease-in-out;
          &:hover {
            [data-image-wrapper] {
              width: 110%;
              img {
                transform: scale(1.5);
                object-position: center;
                transition: all 300ms ease-in-out;
              }
            }
          }
        `}
  ${({ $isClickable }) => {
    if ($isClickable) {
      return css`
        cursor: pointer;
      `;
    }
    return "";
  }}
  [data-image-wrapper] {
    position: static;
    padding-top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid ${colors.border};
    border-radius: ${getCssVar("--modal-border-radius")};
    width: auto;
    ${({ $isImageFitCover }) =>
      $isImageFitCover
        ? css`
            width: 100%;
            img {
              object-fit: cover;
            }
          `
        : ""}
  }
`;

export const ProductCardTop = styled.div<{ $isNotImageLoaded: boolean }>`
  position: ${({ $isNotImageLoaded }) =>
    $isNotImageLoaded ? "relative" : "static"};
  overflow: hidden;
  width: 100%;
  align-self: stretch;
  z-index: ${zIndex.Default};
`;

export const BottomText = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 0.975rem;
  margin: 0;
  letter-spacing: 0.5px;
  color: ${colors.greyDark};
`;

export const ProductCardImageWrapper = styled.div`
  width: 100%;
  height: 13.125rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0.9375rem;
  padding-bottom: 0.9375rem;
  flex: 1;
`;

export const ProductCardImageAndCTAContainer = styled.div`
  position: relative;
`;

const CTAstartState = css`
  opacity: 0;
  bottom: 30px;
`;
const CTAendState = css`
  opacity: 1;
  bottom: 70px;
`;
export const CTAOnHoverContainer = styled.div<{ $isHovered: boolean }>`
  @keyframes appear {
    from {
      ${CTAstartState}
    }
    to {
      ${CTAendState}
    }
  }
  position: absolute;
  z-index: ${zIndex.OfferCard};
  ${CTAstartState}
  ${({ $isHovered }) => {
    if ($isHovered) {
      return css`
        animation: appear 300ms forwards;
      `;
    }
    return "";
  }};
`;

export const ProductTypeWrapper = styled.div`
  background-color: ${colors.black};
  color: ${colors.white};
  align-items: center;
  gap: 0.25rem;
  border-radius: ${getCssVar("--button-border-radius")};
  margin-top: 0.5rem;
  padding: 0.125rem 0.5rem 0.125rem 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  position: relative;
  left: 0;
`;

export const ProductExchangeStatus = styled.div<{
  $status: ExchangeCardStatus;
}>`
  position: absolute;
  z-index: 10;
  letter-spacing: 0.5px;
  line-height: 16px;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  &:first-letter {
    text-transform: uppercase;
  }
  background: ${({ $status }) => {
    switch ($status) {
      case "REDEEMED":
      case "CANCELLED":
        return colors.green;
      case "COMMITTED":
        return colors.violet;
      default:
        return colors.white;
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case "COMMITTED":
        return colors.white;
      default:
        return colors.black;
    }
  }};
  left: 0.5rem;
  top: 24px;
`;
