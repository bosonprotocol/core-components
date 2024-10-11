import styled, { css } from "styled-components";
import { theme } from "../../theme";
import { cardWrapperStyles } from "./commonStyles";
import { Typography } from "../ui/Typography";
import { zIndex } from "../ui/zIndex";

export const ProductCardLabelWrapper = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: white;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.light.darkGrey};
  z-index: 1;
`;

export const TopLeftRibbon = styled.div`
  --d: 6px; /* folded part */
  position: relative;
  z-index: 1;
  &:before {
    content: attr(data-text);
    font-size: var(--f);
    font-weight: 600;
    /* I : position & coloration */
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(0%, 125%) rotate(-45deg);
    transform-origin: bottom left;
    padding: 5px 35px calc(var(--d) + 5px);
    color: ${({ theme }) => theme?.colors?.light.white};
    background: linear-gradient(rgba(0, 0, 0, 0.5) 0 0) bottom/100% var(--d)
      no-repeat ${({ theme }) => theme?.colors?.light.secondary};
    /* II : clipping */
    clip-path: polygon(
      0 0,
      100% 0,
      100% 100%,
      calc(100% - var(--d)) calc(100% - var(--d)),
      var(--d) calc(100% - var(--d)),
      0 100%
    );
    /* III : masking */
    -webkit-mask:
      linear-gradient(135deg, transparent calc(50% - var(--d) * 0.707), #fff 0)
        bottom left,
      linear-gradient(-135deg, transparent calc(50% - var(--d) * 0.707), #fff 0)
        bottom right;
    -webkit-mask-size: 300vmax 300vmax;
    -webkit-mask-composite: destination-in;
    mask-composite: intersect;
  }
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
  color: ${({ theme }) => theme?.colors?.light.darkGrey};
  flex: none;
  order: 1;
  flex-grow: 0;
  justify-self: flex-start;
  margin-right: auto;
  > span {
    font-weight: 600;
    font-size: 0.625rem;
    color: ${({ theme }) => theme?.colors?.light.darkGrey};
  }
`;

export const ProductCardTitle = styled(Typography).attrs({
  className: "title"
})`
  color: ${({ theme }) => theme?.colors?.light.black};
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-height: 1.5em;
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
  color: ${({ theme }) => theme?.colors?.light.darkGrey};
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
`;

export const ProductCardWrapper = styled.div<{
  $isHoverDisabled: boolean;
  $isImageFitCover: boolean;
}>`
  ${cardWrapperStyles}
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  cursor: pointer;
  min-height: 286px;
  height: 286px;
  padding: 0 1rem 1rem 1rem;
  [data-image-wrapper] {
    position: static;
    padding-top: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
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
  ${({ $isHoverDisabled }) =>
    !$isHoverDisabled
      ? css`
          transition: all 300ms ease-in-out;
          &:hover {
            box-shadow:
              0px 0px 0px rgba(0, 0, 0, 0.05),
              4px 4px 4px rgba(0, 0, 0, 0.05),
              8px 8px 8px rgba(0, 0, 0, 0.05),
              16px 16px 16px rgba(0, 0, 0, 0.05);

            [data-image-wrapper] {
              width: 110%;
              img {
                transform: scale(1.5);
                object-position: center;
                transition: all 300ms ease-in-out;
              }
            }
          }
        `
      : ""}
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
  color: ${theme.colors.light.darkGrey};
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

export const CTAOnHoverContainer = styled.div<{ $isHovered: boolean }>`
  position: absolute;
  z-index: ${zIndex.OfferCard};
  bottom: ${({ $isHovered }) => ($isHovered ? "95px" : "1.875rem")};
  transition: all 300ms ease-in-out;
`;
