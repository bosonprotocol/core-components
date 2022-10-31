import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ExpireEscalationDisputeButton } from "../../../components/cta/dispute/ExpireEscalationDisputeButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Dispute/ExpireEscalationDisputeButton",
  component: ExpireEscalationDisputeButton
} as ComponentMeta<typeof ExpireEscalationDisputeButton>;

const Template: ComponentStory<typeof ExpireEscalationDisputeButton> = (
  args
) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper>
      <ExpireEscalationDisputeButton web3Provider={provider} {...args} />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof ExpireEscalationDisputeButton> =
  Template.bind({});
export const WithExtraInfo: ComponentStory<
  typeof ExpireEscalationDisputeButton
> = Template.bind({});

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
