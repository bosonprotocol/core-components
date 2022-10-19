import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { AddFeesDisputeResolverButton } from "../../../components/cta/dispute/AddFeesDisputeResolverButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Dispute/AddFeesDisputeResolver",
  component: AddFeesDisputeResolverButton
} as ComponentMeta<typeof AddFeesDisputeResolverButton>;

const Template: ComponentStory<typeof AddFeesDisputeResolverButton> = (
  args
) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper>
      <AddFeesDisputeResolverButton web3Provider={provider} {...args} />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof AddFeesDisputeResolverButton> =
  Template.bind({});
export const WithExtraInfo: ComponentStory<
  typeof AddFeesDisputeResolverButton
> = Template.bind({});

Simple.args = {
  envName: "testing",
  disputeResolverId: "28",
  fees: [
    {
      tokenAddress: "0x0123456789012345678901234567890123456789",
      tokenName: "",
      feeAmount: 1
    }
  ],
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
  fees: [
    {
      tokenAddress: "0x0123456789012345678901234567890123456789",
      tokenName: "",
      feeAmount: 1
    }
  ],
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
