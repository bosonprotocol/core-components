import React from "react";
import { ComponentStory, ComponentMeta, Story } from "@storybook/react";

import {
  ProductCard,
  ProductType
} from "../components/productCard/ProductCard";
import { Currencies } from "../components/currencyDisplay/CurrencyDisplay";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/ProductCard",
  component: ProductCard
} as ComponentMeta<typeof ProductCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ProductCard> = (args) => (
  <ProductCard {...args} />
);

const wrapper = (Story: Story) => (
  <div style={{ width: "20.188rem" }}>
    <Story />
  </div>
);

export const ProductCardPrimary: ComponentStory<typeof ProductCard> =
  Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
ProductCardPrimary.args = {
  productId: "123",
  title: "Super Shoe",
  avatar:
    "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
  avatarName: "JSON Doe",
  price: 1.23,
  currency: Currencies.ETH,
  productType: ProductType.physical,
  onCardClick: (productId) => {
    console.log("----------ON CLICK-------------");
    console.log("productId", productId);
  },
  onAvatarNameClick: () => {
    console.log("----------ON AVATAR NAME CLICK-------------");
  },
  imageProps: {
    src: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDV8fHByb2R1Y3R8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
  },
  bottomText: "Redeemable until 30 days after commit"
};

ProductCardPrimary.decorators = [(Story) => wrapper(Story)];
