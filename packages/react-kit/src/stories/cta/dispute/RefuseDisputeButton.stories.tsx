import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { RefuseDisputeButton } from "../../../components/cta/dispute/RefuseDisputeButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Dispute/RefuseDisputeButton",
  component: RefuseDisputeButton
} as ComponentMeta<typeof RefuseDisputeButton>;

const Template: ComponentStory<typeof RefuseDisputeButton> = (args) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper>
      <RefuseDisputeButton web3Provider={provider} {...args} />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof RefuseDisputeButton> = Template.bind(
  {}
);
export const WithExtraInfo: ComponentStory<typeof RefuseDisputeButton> =
  Template.bind({});

Simple.args = {
  envName: "testing",
  exchangeId: "28",
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
