import styled from "styled-components";
import React from "react";
import {
  CurrencyDisplay,
  Currencies
} from "../currencyDisplay/CurrencyDisplay";

export enum ProductType {
  phygital = "Phygital",
  physical = "Physical",
  digital = "Digital"
}

interface ProductCardProps {
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  currency: Currencies;
  productType: ProductType;
  seller: {
    name: string;
    avatar: string;
  };
  onCardClick?: (productId: string) => void;
}

export const ProductCard = ({
  productId,
  productTitle,
  productImage,
  productPrice,
  currency,
  productType,
  seller,
  onCardClick
}: ProductCardProps) => {
  return (
    <ProductCardWrapper
      onClick={() => {
        onCardClick?.(productId);
      }}
    >
      <ProductCardTop>
        <img
          alt={productTitle}
          src={productImage}
          decoding="async"
          data-nimg="fill"
        />
      </ProductCardTop>
      <ProductCardBottom>
        <ProductCarData>
          <ProductCreator>
            <ProductCreatorAvatar>
              <img src={seller.avatar} alt="seller_avatar" />
            </ProductCreatorAvatar>
            <ProductCreatorName>{seller.name}</ProductCreatorName>
          </ProductCreator>
          <ProductTitle>{productTitle}</ProductTitle>
          <ProductTypeWrapper>
            <span>{productType}</span>
          </ProductTypeWrapper>
        </ProductCarData>
        <ProductCardPriceWrapper>
          <ProductCardPrice>Price</ProductCardPrice>
          <CurrencyDisplay value={productPrice} currency={currency} />
        </ProductCardPriceWrapper>
      </ProductCardBottom>
    </ProductCardWrapper>
  );
};

const ProductCreator = styled.div`
  display: flex;
`;

const ProductCreatorAvatar = styled.div`
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

const ProductCreatorName = styled.div`
  font-weight: 600;
  font-size: 0.75rem;
  line-height: 150%;
  color: ${({ theme }) => theme?.colors?.light.secondary};
  flex: none;
  order: 1;
  flex-grow: 0;
  justify-self: flex-end;
`;

const ProductTitle = styled.div`
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 150%;
  color: ${({ theme }) => theme?.colors?.light.black};
`;

const ProductTypeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.25rem 1rem 0.25rem 0.5rem;
  gap: 0.25rem;
  width: 91px;
  height: 26px;
  background: #f1f3f9;
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

const ProductCardPriceWrapper = styled.div`
  grid-area: 1 / 3 / 2 / 4;
`;

const ProductCardPrice = styled.div`
  font-size: 0.75rem;
  line-height: 150%;
  text-align: center;
  color: ${({ theme }) => theme?.colors?.light.darkGrey};
`;

const ProductCarData = styled.div`
  grid-area: 1 / 1 / 2 / 3;
`;

const ProductCardBottom = styled.div`
  margin: 1rem 1.563rem;
  height: 7.375rem;
  width: calc(100% - 1.563rem);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
`;

const ProductCardWrapper = styled.div`
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

const ProductCardTop = styled.div`
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
