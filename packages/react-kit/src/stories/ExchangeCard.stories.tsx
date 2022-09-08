import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ExchangeCard } from "../components/exchangeCard/ExchangeCard";
import { Currencies } from "../components/currencyDisplay/CurrencyDisplay";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/ExchangeCard",
  component: ExchangeCard
} as ComponentMeta<typeof ExchangeCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ExchangeCard> = (args) => (
  <ExchangeCard {...args} />
);

export const Redeemed: ComponentStory<typeof ExchangeCard> = Template.bind({});
export const Cancelled: ComponentStory<typeof ExchangeCard> = Template.bind({});
export const Committed: ComponentStory<typeof ExchangeCard> = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Redeemed.args = {
  id: "4852",
  title: "ABI #4852",
  avatarName: "Abi",
  avatar:
    "https://images.unsplash.com/photo-1613771404721-1f92d799e49f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cG9rZW1vbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
  imageProps: {
    src: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDV8fHByb2R1Y3R8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
  },
  price: 0.1,
  currency: Currencies.ETH,
  onCardClick: (id) => {
    console.log("----------ON CLICK-------------");
    console.log("id", id);
  },
  redeemConfig: {
    onDisputeClick: () => console.log("REDEEMED - onDisputeClick"),
    isDisputeLoading: false,
    isDisputeDisabled: false
  },
  status: "REDEEMED"
};

Cancelled.args = {
  id: "123",
  title: "ABI #4852",
  avatarName: "Abi",
  avatar:
    "https://images.unsplash.com/photo-1613771404721-1f92d799e49f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cG9rZW1vbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
  imageProps: {
    src: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDV8fHByb2R1Y3R8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    preloadConfig: {
      status: "success",
      errorIcon: <></>,
      errorImageText: ""
    }
  },
  price: 20.5,
  currency: Currencies.ETH,
  onCardClick: (id) => {
    console.log("----------ON CLICK-------------");
    console.log("id", id);
  },
  status: "CANCELLED"
};

Committed.args = {
  id: "123",
  title: "ABI #4852",
  avatarName: "Abi",
  avatar:
    "https://images.unsplash.com/photo-1613771404721-1f92d799e49f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cG9rZW1vbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
  imageProps: {
    src: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDV8fHByb2R1Y3R8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
  },
  price: 1.25,
  currency: Currencies.ETH,
  onCardClick: (id) => {
    console.log("----------ON CLICK-------------");
    console.log("id", id);
  },
  status: "COMMITTED",
  committedConfig: {
    onRedeemClick: () => console.log("COMMITTED - onRedeemClick"),
    isRedeemLoading: false,
    isRedeemDisabled: false,
    onCancelClick: () => console.log("COMMITTED - onCancelClick"),
    isCancelLoading: false,
    isCancelDisabled: false,
    bottomText: "Redeemable until 30 days after commit"
  }
};
