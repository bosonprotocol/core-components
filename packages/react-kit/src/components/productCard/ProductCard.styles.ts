import styled from "styled-components";
import theme from "../../theme";

export const ProductCardCreator = styled.div`
  display: flex;
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
  margin-left: 0.5rem;
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

export const ProductCardTitle = styled.div`
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 150%;
  color: ${({ theme }) => theme?.colors?.light.black};
`;

export const ProductCardPriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
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

export const ProductCardData = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ProductCardBottom = styled.div`
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme?.colors?.light.white};
`;
export const ProductCardBottomContent = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 1.5rem 0.5rem 1.5rem;
  box-sizing: border-box;
  align-items: flex-start;
`;

export const ProductCardWrapper = styled.div<{ $isHoverDisabled: boolean }>`
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
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
          transform: translate(-50%, -50%) scale(1.05);
        }
      }
    }
  `
      : ""}
`;

export const ProductCardTop = styled.div`
  overflow: hidden;
  width: 100%;
  z-index: 0;
  margin-bottom: auto;
  flex-grow: 1;
`;

export const BottomText = styled.p`
  font-size: 0.75rem;
  font-weight: bold;
  line-height: 0.975rem;
  margin: 0;
  padding: 0 1.5rem 1rem 1.5rem;
  letter-spacing: 0.5px;
  color: ${theme.colors.light.darkGrey};
`;

export const ProductCardImageWrapper = styled.div`
  width: 100%;
  height: 100%;
`;
