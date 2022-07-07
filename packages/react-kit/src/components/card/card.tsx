import React from "react";
import { CardArticle, CardBottom, CardLink, CardTop } from "./card.styles";

interface Props {
  title: string;
  image: string;
  link: string;
  price: string;
  onBuy: () => void;
}

const Card = ({ title, image, link = "#", price, onBuy }: Props) => {
  return (
    <CardArticle>
      <CardLink href={link}>
        <CardTop>
          <img alt={title} src={image} decoding="async" data-nimg="fill" />
        </CardTop>
        <CardBottom>
          <div id="description">{title}</div>
          <div id="price">
            <span>Price</span>
            <div id="valueWrapper">
              <img
                alt="ETH"
                src="https://openseauserdata.com/files/6f8e2979d428180222796ff4a33ab929.svg"
              />
              <div id="value">{price}</div>
            </div>
          </div>
          <button id="button" type="button" onClick={onBuy}>
            <p>Buy now</p>
          </button>
        </CardBottom>
      </CardLink>
    </CardArticle>
  );
};

export default Card;
