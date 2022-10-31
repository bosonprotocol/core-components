import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ResolveDisputeButton } from "../../../components/cta/dispute/ResolveDisputeButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Dispute/ResolveDisputeButton",
  component: ResolveDisputeButton
} as ComponentMeta<typeof ResolveDisputeButton>;

const Template: ComponentStory<typeof ResolveDisputeButton> = (args) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper>
      <ResolveDisputeButton web3Provider={provider} {...args} />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof ResolveDisputeButton> =
  Template.bind({});
export const WithExtraInfo: ComponentStory<typeof ResolveDisputeButton> =
  Template.bind({});

Simple.args = {
  envName: "testing",
  exchangeId: "28",
  metaTransactionsApiKey: undefined,
  proposal: {
    signature:
      "0xe18764e41f6791c2aa09234e4487e19e778ede85d6cb5ed7c432f1a8ea91282d25637188d5aab4c4ea9592c92b4c86e3f1b02a0f61795989b3d9fda43f456c871b",
    percentageAmount: "1",
    type: "Refund"
  },
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
  proposal: {
    signature:
      "0xe18764e41f6791c2aa09234e4487e19e778ede85d6cb5ed7c432f1a8ea91282d25637188d5aab4c4ea9592c92b4c86e3f1b02a0f61795989b3d9fda43f456c871b",
    percentageAmount: "1",
    type: "Refund"
  },
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
