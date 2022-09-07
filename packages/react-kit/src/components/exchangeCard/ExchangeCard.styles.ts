import styled from "styled-components";
import theme from "../../theme";
import { ExchangeCardStatus } from "./ExchangeCard";

export const ExchangeCreator = styled.div`
  display: flex;
`;

export const ExchangeCreatorAvatar = styled.div`
  width: 1rem;
  height: 1rem;
  flex: none;
  order: 0;
  flex-grow: 0;
  padding-right: 0.5rem;
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
  color: ${({ theme }) => theme?.colors?.light.secondary};
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
`;

export const ExchangeCardPriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
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
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 1.5rem;
  box-sizing: border-box;
  align-items: flex-start;
`;

export const ExchangeCardWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0px;
  isolation: isolate;
  width: 20.188rem;
  border: 1px solid rgba(85, 96, 114, 0.15);
  box-shadow: 0px 4.31783px 107.946px rgba(21, 30, 52, 0.1);
  cursor: pointer;
  height: 31.25rem;
  background: ${theme.colors.light.white};
`;

export const ExchangeCardTop = styled.div<{
  $status: ExchangeCardStatus;
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  width: inherit;
  height: ${({ $status }) => {
    switch ($status) {
      case "REDEEMED":
        return "20.125rem";
      case "CANCELLED":
        return "26rem";
      case "COMMITTED":
        return "18.5rem";
      default:
        return;
    }
  }};
  flex: none;
  order: 0;
  flex-grow: 1;
  z-index: 0;
  img {
    min-width: 100%;
    min-height: 100%;
    object-fit: cover;
  }
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
  padding: 0.5rem;
  box-sizing: border-box;
`;
export const CommittedButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  box-sizing: border-box;
`;

export const ExchangeStatus = styled.div<{
  $status: ExchangeCardStatus;
}>`
  position: absolute;
  top: 16px;
  right: 16px;
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
        return theme.colors.light.secondary;
      default:
        return;
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case "COMMITTED":
        return theme.colors.light.white;
      default:
        return;
    }
  }};
`;

export const CommittedBottomText = styled.p`
  font-size: 0.75rem;
  font-weight: bold;
  line-height: 0.975rem;
  margin: 0;
  padding: 0 1.5rem 1.5rem 1.5rem;
  letter-spacing: 0.5px;
  color: ${theme.colors.light.darkGrey};
`;
