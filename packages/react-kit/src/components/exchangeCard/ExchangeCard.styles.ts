import styled from "styled-components";
import { theme } from "../../theme";
import { ExchangeCardStatus } from "./ExchangeCard";

export const ExchangeCreator = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const ExchangeCreatorAvatar = styled.div`
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

export const ExchangeCreatorName = styled.div`
  font-weight: 600;
  font-size: 0.75rem;
  line-height: 150%;
  color: ${({ theme }) => theme?.colors?.light.accent};
  flex: none;
  order: 1;
  flex-grow: 0;
  justify-self: flex-end;
  margin-bottom: 0.25rem;
`;

export const ExchangeTitle = styled.div`
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 150%;
  color: ${({ theme }) => theme?.colors?.light.black};
  word-break: break-word;
`;

export const ExchangeCardPriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  max-width: 50%;
  min-width: 44%;
  span {
    padding-left: 0.5rem;
  }
`;

export const ExchangeCardPrice = styled.div`
  font-size: 0.75rem;
  line-height: 150%;
  text-align: right;
  margin-bottom: 0.25rem;
  color: ${({ theme }) => theme?.colors?.light.darkGrey};
`;

export const ExchangeCarData = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ExchangeCardBottom = styled.div`
  width: 100%;
  flex: 1 1;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme?.colors?.light.white};
`;
export const ExchangeCardBottomContent = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 1.5rem;
  box-sizing: border-box;
  align-items: flex-start;
  border-top: 2px solid ${theme.colors.light.border};
`;

export const ExchangeCardWrapper = styled.div<{
  $isHoverDisabled: boolean;
}>`
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: 0px;
  isolation: isolate;
  width: 100%;
  min-height: 31.25rem;
  border: 1px solid rgba(85, 96, 114, 0.15);
  box-shadow: 0px 4.31783px 107.946px rgba(21, 30, 52, 0.1);
  cursor: pointer;
  background: ${theme.colors.light.white};
  [data-image-wrapper] {
    position: static;
    padding-top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ${({ $isHoverDisabled }) =>
    !$isHoverDisabled
      ? `
    transition: all 300ms ease-in-out;
    &:hover {
      box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.05), 4px 4px 4px rgba(0, 0, 0, 0.05),
        8px 8px 8px rgba(0, 0, 0, 0.05), 16px 16px 16px rgba(0, 0, 0, 0.05);

      [data-image-wrapper] {
        img {
          transform: scale(1.05);
          transition: all 300ms ease-in-out;
        }
      }
      [data-cta-wrapper] {
        transition: all 0.4s ease-in-out;
        max-height: 100rem;
      }
    }
  `
      : `
      &:hover {
      [data-cta-wrapper] {
        transition: all 0.4s ease-in-out;
        max-height: 100rem;
      }
    `}
`;

export const ExchangeCardTop = styled.div<{ $isNotImageLoaded: boolean }>`
  position: ${({ $isNotImageLoaded }) =>
    $isNotImageLoaded ? "relative" : "static"};
  overflow: hidden;
  width: 100%;
  z-index: 0;
  display: flex;
  flex: 1 1;
  align-items: center;
`;
export const ExchangeButtonWrapper = styled.div`
  width: 100%;
  border-top: 1px solid rgba(85, 96, 114, 0.15);
  align-items: center;
`;

export const RedeemButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0;
  box-sizing: border-box;
`;
export const CommittedButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1.25rem 1.5rem 0.75rem 1.5rem;
  box-sizing: border-box;
`;

export const ExchangeStatus = styled.div<{
  $status: ExchangeCardStatus;
}>`
  position: absolute;
  top: 16px;
  right: 16px;
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
        return theme.colors.light.primary;
      case "COMMITTED":
        return theme.colors.light.accent;
      default:
        return theme.colors.light.white;
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case "COMMITTED":
        return theme.colors.light.white;
      default:
        return theme.colors.light.black;
    }
  }};
`;

export const CommittedBottomText = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 0.975rem;
  margin: 0;
  padding: 0 1.5rem 1.5rem 1.5rem;
  letter-spacing: 0.5px;
  color: ${theme.colors.light.darkGrey};
`;

export const ExchangeImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  max-height: 75%;
  :not([data-image]) {
    align-self: stretch;
    max-height: initial;
  }
`;

export const ExchangeCTAWrapper = styled.div`
  transition: all 0.4s ease-out;
  max-height: 0;
`;
