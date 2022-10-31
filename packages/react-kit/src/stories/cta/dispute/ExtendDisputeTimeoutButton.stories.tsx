import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ExtendDisputeTimeoutButton } from "../../../components/cta/dispute/ExtendDisputeTimeoutButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Dispute/ExtendDisputeTimeoutButton",
  component: ExtendDisputeTimeoutButton
} as ComponentMeta<typeof ExtendDisputeTimeoutButton>;

const Template: ComponentStory<typeof ExtendDisputeTimeoutButton> = (args) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper>
      <ExtendDisputeTimeoutButton web3Provider={provider} {...args} />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof ExtendDisputeTimeoutButton> =
  Template.bind({});
export const WithExtraInfo: ComponentStory<typeof ExtendDisputeTimeoutButton> =
  Template.bind({});

Simple.args = {
  envName: "testing",
  exchangeId: "28",
  newDisputeTimeout: "10000",
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

WithExtraInfo.args = {
  envName: "testing",
  exchangeId: "28",
  newDisputeTimeout: "10000",
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
