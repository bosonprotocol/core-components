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
export const WithExtraInfo: ComponentStory<typeof RedeemButton> = Template.bind(
  {}
);

Simple.args = {
  envName: "testing",
  exchangeId: "92",
  disabled: false,
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
