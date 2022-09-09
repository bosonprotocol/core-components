import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { DisputeButton } from "../../../components/cta/exchange/DisputeButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Exchange/DisputeButton",
  component: DisputeButton
} as ComponentMeta<typeof DisputeButton>;

const Template: ComponentStory<typeof DisputeButton> = (args) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper>
      <DisputeButton web3Provider={provider} {...args} />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof DisputeButton> = Template.bind({});
export const WithExtraInfo: ComponentStory<typeof DisputeButton> =
  Template.bind({});

Simple.args = {
  chainId: 1234,
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
};

WithExtraInfo.args = {
  chainId: 1234,
  exchangeId: "28",
  web3Provider: undefined,
  metaTransactionsApiKey: undefined,
  extraInfo: "Step X",
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
