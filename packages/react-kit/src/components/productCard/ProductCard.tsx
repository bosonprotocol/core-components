import styled from "styled-components";
import React from "react";
import {
  CurrencyDisplay,
  Currencies
} from "../currencyDisplay/CurrencyDisplay";

interface ProductCardProps {
  productId: string;
  productTitle: string;
  sellerName: string;
  productImage: string;
  productPrice: number;
  currency: Currencies;
  additionalText: string;
}

export const ProductCard = ({
  productId,
  productTitle,
  sellerName,
  productImage,
  productPrice,
  currency,
  additionalText
}: ProductCardProps) => {
  return (
    <ProductCardWrapper>
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
            <ProductCreatorAvatar />
            <ProductCreatorName>MekaVerse</ProductCreatorName>
          </ProductCreator>
          <ProductTitle>{productTitle}</ProductTitle>
          <ProductType>
            <ProductTypeSymbol />
            <span>Phygital</span>
          </ProductType>
          {/* MekaVerse
          FEWO SHOE EPIC
          <ProductType/> */}
        </ProductCarData>
        <ProductCardPriceWrapper>
          <ProductCardPrice>Price</ProductCardPrice>
          <CurrencyDisplay value={productPrice} currency={currency} />
        </ProductCardPriceWrapper>
      </ProductCardBottom>
    </ProductCardWrapper>
  );
};

const ProductCreator = styled.div``;
const ProductCreatorAvatar = styled.img``;
const ProductCreatorName = styled.div``;
const ProductTitle = styled.div`
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 150%;

  color: ${({ theme }) => theme?.colors?.light.black};
`;
const ProductType = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 16px 4px 8px;
  gap: 4px;
  width: 91px;
  height: 26px;
  background: #f1f3f9;
  flex: none;
  order: 1;
  flex-grow: 0;
  span {
    font-weight: 600;
    font-size: 0.75rem;
    line-height: 150%;

    color: #556072;

    flex: none;
    order: 1;
    flex-grow: 0;
  }
`;

const ProductTypeSymbol = styled.div`
  position: absolute;
  left: 12.5%;
  right: 12.5%;
  top: 12.5%;
  bottom: 12.5%;
  border: 1.5px solid #556072;
`;

const ProductCardPriceWrapper = styled.div`
  grid-area: 1 / 3 / 2 / 4;
`;

const ProductCardPrice = styled.div`
  font-size: 12px;
  line-height: 150%;
  text-align: right;
  color: ${({ theme }) => theme?.colors?.light.darkGrey};
`;

const ProductCarData = styled.div`
  grid-area: 1 / 1 / 2 / 3;
`;

const ProductCardBottom = styled.div`
  margin: 16px 25px;
  height: 118px;
  width: calc(100% - 25px);

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

  width: 323px;
  max-height: 500px;

  border: 1px solid rgba(85, 96, 114, 0.15);

  box-shadow: 0px 4.31783px 107.946px rgba(21, 30, 52, 0.1);
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
