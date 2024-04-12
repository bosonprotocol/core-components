import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { RedeemButton } from "../../../components/cta/exchange/RedeemButton";

export default {
  title: "Visual Components/CTA/Exchange/RedeemButton",
  component: RedeemButton,
  parameters: {
    // TODO: delete once storybook doesnt freeze if an arg is an object https://github.com/storybookjs/storybook/issues/17098
    docs: {
      source: {
        type: "code"
      }
    }
  }
} as ComponentMeta<typeof RedeemButton>;

const Template: ComponentStory<typeof RedeemButton> = (args) => {
  return <RedeemButton {...args} />;
};

export const Simple: ComponentStory<typeof RedeemButton> = Template.bind({});
export const WithBiconomy: ComponentStory<typeof RedeemButton> = Template.bind(
  {}
);
export const WithExtraInfo: ComponentStory<typeof RedeemButton> = Template.bind(
  {}
);

Simple.args = {
  coreSdkConfig: {
    configId: "testing-80002-0",
    envName: "testing"
  },
  exchangeId: "92",
  disabled: false,
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
};

WithBiconomy.args = {
  ...Simple.args,
  coreSdkConfig: {
    configId: "staging-80002-0",
    envName: "staging",
    metaTx: {
      apiKey: "vYoPWofBr.e4f3e2f9-69e5-4076-8ce1-3b8e0916e02c"
      // metaTransactionsApiId: "3b8898fa-1e48-4bb2-8afa-aabc84b86ec0"
    }
  }
};

WithExtraInfo.args = {
  coreSdkConfig: {
    configId: "testing-80002-0",
    envName: "testing",
    web3Provider: undefined
  },
  exchangeId: "28",
  disabled: false,
  extraInfo: "Step 2",
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
};
