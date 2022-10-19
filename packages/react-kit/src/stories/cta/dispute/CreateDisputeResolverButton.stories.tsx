import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CreateDisputeResolverButton } from "../../../components/cta/dispute/CreateDisputeResolverButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Dispute/CreateDisputeResolver",
  component: CreateDisputeResolverButton
} as ComponentMeta<typeof CreateDisputeResolverButton>;

const Template: ComponentStory<typeof CreateDisputeResolverButton> = (args) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper>
      <CreateDisputeResolverButton web3Provider={provider} {...args} />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof CreateDisputeResolverButton> =
  Template.bind({});
export const WithExtraInfo: ComponentStory<typeof CreateDisputeResolverButton> =
  Template.bind({});

Simple.args = {
  envName: "testing",
  exchangeId: "28",
  disputeResolverToCreate: {
    escalationResponsePeriodInMS: 0,
    operator: "",
    admin: "",
    clerk: "",
    treasury: "",
    metadataUri: "",
    fees: [],
    sellerAllowList: []
  },
  web3Provider: undefined,
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
  disputeResolverToCreate: {
    escalationResponsePeriodInMS: 0,
    operator: "",
    admin: "",
    clerk: "",
    treasury: "",
    metadataUri: "",
    fees: [],
    sellerAllowList: []
  },
  web3Provider: undefined,
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
