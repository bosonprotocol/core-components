import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { UpdateDisputeResolverButton } from "../../../components/cta/dispute/UpdateDisputeResolverButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Dispute/UpdateDisputeResolverButton",
  component: UpdateDisputeResolverButton
} as ComponentMeta<typeof UpdateDisputeResolverButton>;

const Template: ComponentStory<typeof UpdateDisputeResolverButton> = (args) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper>
      <UpdateDisputeResolverButton web3Provider={provider} {...args} />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof UpdateDisputeResolverButton> =
  Template.bind({});
export const WithExtraInfo: ComponentStory<typeof UpdateDisputeResolverButton> =
  Template.bind({});

Simple.args = {
  envName: "testing",
  exchangeId: "28",
  createSellerArgs: {
    operator: "",
    admin: "",
    clerk: "",
    treasury: "",
    contractUri: "",
    royaltyPercentage: 0,
    authTokenId: 0,
    authTokenType: 0
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
  createSellerArgs: {
    operator: "testing",
    admin: "testing",
    clerk: "testing",
    treasury: "testing",
    contractUri: "testing",
    royaltyPercentage: 0,
    authTokenId: 0,
    authTokenType: 0
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
