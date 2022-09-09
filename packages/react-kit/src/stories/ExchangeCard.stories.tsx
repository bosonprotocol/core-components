import React from "react";
import { ComponentStory, ComponentMeta, Story } from "@storybook/react";

import { ExchangeCard } from "../components/exchangeCard/ExchangeCard";
import { Currencies } from "../components/currencyDisplay/CurrencyDisplay";
import { ButtonSize } from "../components/buttons/Button";

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

const wrapper = (Story: Story) => (
  <div style={{ width: "20.188rem" }}>
    <Story />
  </div>
);

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
    console.log("----------ON CARD CLICK-------------");
    console.log("id", id);
  },
  status: "REDEEMED",
  disputeButtonConfig: {
    onClick: () => console.log("----------ON CLICK-------------")
  }
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
    console.log("----------ON CARD CLICK-------------");
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
    console.log("----------ON CARD CLICK-------------");
    console.log("id", id);
  },
  status: "COMMITTED",
  bottomText: "Redeemable until 30 days after commit",
  redeemButtonConfig: {
    chainId: 1234,
    exchangeId: "92",
    disabled: false,
    web3Provider: undefined,
    metaTransactionsApiKey: undefined,
    size: ButtonSize.Medium,
    onPendingSignature: () => {
      console.log("----------ON PENDING SIGNATURE-------------");
    },
    onPendingTransaction: (txHash: string) => {
      console.log("----------ON PENDING TRANSACTION-------------");
      console.log("txHash", txHash);
    },
    onSuccess: (receipt, payload) => {
      console.log("----------ON SUCCESS-------------");
      console.log("receipt", receipt);
      console.log("payload", payload);
    },
    onError: (error) => {
      console.log("----------ON ERROR-------------");
      console.log("error", error);
    }
  },
  cancelButtonConfig: {
    chainId: 1234,
    size: ButtonSize.Medium,
    variant: "ghostOrange",
    exchangeId: "28",
    web3Provider: undefined,
    metaTransactionsApiKey: undefined,
    onPendingSignature: () => {
      console.log("----------ON PENDING SIGNATURE-------------");
    },
    onPendingTransaction: (txHash: string) => {
      console.log("----------ON PENDING TRANSACTION-------------");
      console.log("txHash", txHash);
    },
    onSuccess: (receipt, payload) => {
      console.log("----------ON SUCCESS-------------");
      console.log("receipt", receipt);
      console.log("payload", payload);
    },
    onError: (error) => {
      console.log("----------ON ERROR-------------");
      console.log("error", error);
    }
  }
};

Redeemed.decorators = [(Story) => wrapper(Story)];
Cancelled.decorators = [(Story) => wrapper(Story)];
Committed.decorators = [(Story) => wrapper(Story)];
