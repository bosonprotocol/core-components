import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { AddSellerToDisputeResolver } from "../../../components/cta/dispute/AddSellerToDisputeResolverButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Dispute/AddSellerToDisputeResolver",
  component: AddSellerToDisputeResolver
} as ComponentMeta<typeof AddSellerToDisputeResolver>;

const Template: ComponentStory<typeof AddSellerToDisputeResolver> = (args) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper>
      <AddSellerToDisputeResolver web3Provider={provider} {...args} />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof AddSellerToDisputeResolver> =
  Template.bind({});
export const WithExtraInfo: ComponentStory<typeof AddSellerToDisputeResolver> =
  Template.bind({});

Simple.args = {
  envName: "testing",
  disputeResolverId: "28",
  sellerAllowList: [1, 2],
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
  disputeResolverId: "28",
  sellerAllowList: [1, 2],
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
