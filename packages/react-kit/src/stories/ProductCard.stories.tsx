import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ProductCard } from "../components/productCard/ProductCard";
import { Currencies } from "../components/currencyDisplay/CurrencyDisplay";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Sample Stories/ProductCard",
  component: ProductCard
} as ComponentMeta<typeof ProductCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ProductCard> = (args) => (
  <ProductCard {...args} />
);

export const ProductCardPrimary: ComponentStory<typeof ProductCard> =
  Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
ProductCardPrimary.args = {
  productId: "123",
  productTitle: "Product Title",
  sellerName: "Seller Name",
  productImage:
    "https://images.unsplash.com/photo-1636718282214-0b4162a154f0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=302&q=80",
  productPrice: 123,
  currency: Currencies.ETH,
  additionalText: "Additional Text"
};
