import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { RedeemButton } from "../../../components/cta/exchange/RedeemButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Exchange/RedeemButton",
  component: RedeemButton
} as ComponentMeta<typeof RedeemButton>;

const Template: ComponentStory<typeof RedeemButton> = (args) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper>
      <RedeemButton web3Provider={provider} {...args} />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof RedeemButton> = Template.bind({});
export const WithBiconomy: ComponentStory<typeof RedeemButton> = Template.bind(
  {}
);
export const WithExtraInfo: ComponentStory<typeof RedeemButton> = Template.bind(
  {}
);

Simple.args = {
  envName: "testing",
  exchangeId: "92",
  disabled: false,
  metaTransactionsApiKey: undefined,
  metaTransactionsApiId: "dummyApiId",
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
  envName: "staging",
  metaTransactionsApiKey: "vYoPWofBr.e4f3e2f9-69e5-4076-8ce1-3b8e0916e02c",
  metaTransactionsApiId: "3b8898fa-1e48-4bb2-8afa-aabc84b86ec0"
};

WithExtraInfo.args = {
  envName: "testing",
  exchangeId: "28",
  disabled: false,
  web3Provider: undefined,
  metaTransactionsApiKey: undefined,
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
