import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { RemoveSellerFromDisputeResolverButton } from "../../../components/cta/dispute/RemoveSellerFromDisputeResolverButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Dispute/RemoveSellerFromDisputeResolverButton",
  component: RemoveSellerFromDisputeResolverButton
} as ComponentMeta<typeof RemoveSellerFromDisputeResolverButton>;

const Template: ComponentStory<typeof RemoveSellerFromDisputeResolverButton> = (
  args
) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper>
      <RemoveSellerFromDisputeResolverButton
        web3Provider={provider}
        {...args}
      />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<
  typeof RemoveSellerFromDisputeResolverButton
> = Template.bind({});
export const WithExtraInfo: ComponentStory<
  typeof RemoveSellerFromDisputeResolverButton
> = Template.bind({});

Simple.args = {
  envName: "testing",
  disputeResolverId: 0,
  sellerAllowList: ["0x0123456789012345678901234567890123456789"],
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
  disputeResolverId: 0,
  sellerAllowList: ["0x0123456789012345678901234567890123456789"],
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
