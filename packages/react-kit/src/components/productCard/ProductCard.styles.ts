import styled from "styled-components";

export const ProductCreator = styled.div`
  display: flex;
`;

export const ProductCreatorAvatar = styled.div`
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

export const ProductCreatorName = styled.div`
  font-weight: 600;
  font-size: 0.75rem;
  line-height: 150%;
  color: ${({ theme }) => theme?.colors?.light.secondary};
  flex: none;
  order: 1;
  flex-grow: 0;
  justify-self: flex-end;
`;

export const ProductTitle = styled.div`
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 150%;
  color: ${({ theme }) => theme?.colors?.light.black};
`;

export const ProductTypeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.25rem 1rem 0.25rem 0.5rem;
  gap: 0.25rem;
  width: 91px;
  height: 26px;
  background: ${({ theme }) => theme?.colors?.light.lightGrey};
  flex: none;
  order: 1;
  flex-grow: 0;
  justify-content: center;
  span {
    font-weight: 600;
    font-size: 0.75rem;
    line-height: 150%;
    color: ${({ theme }) => theme?.colors?.light.darkGrey};
    flex: none;
    order: 1;
    flex-grow: 0;
  }
`;

export const ProductCardPriceWrapper = styled.div`
  grid-area: 1 / 3 / 2 / 4;
`;

export const ProductCardPrice = styled.div`
  font-size: 0.75rem;
  line-height: 150%;
  text-align: center;
  color: ${({ theme }) => theme?.colors?.light.darkGrey};
`;

export const ProductCarData = styled.div`
  grid-area: 1 / 1 / 2 / 3;
`;

export const ProductCardBottom = styled.div`
  margin: 1rem 1.563rem;
  height: 7.375rem;
  width: calc(100% - 1.563rem);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
`;

export const ProductCardWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0px;
  isolation: isolate;
  width: 20.188rem;
  max-height: 31.25rem;
  border: 1px solid rgba(85, 96, 114, 0.15);
  box-shadow: 0px 4.31783px 107.946px rgba(21, 30, 52, 0.1);
  cursor: pointer;
`;

export const ProductCardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  width: inherit;
  height: 382px;
  flex: none;
  order: 0;
  flex-grow: 1;
  z-index: 0;
  img {
    flex-shrink: 0;
    min-width: 100%;
    min-height: 100%;
  }
`;
