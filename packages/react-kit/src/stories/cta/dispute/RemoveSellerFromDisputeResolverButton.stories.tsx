import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { RemoveSellerFromDisputeResolverButton } from "../../../components/cta/dispute/RemoveSellerFromDisputeResolverButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Dispute/RemoveSellerFromDisputeResolverButton",
  component: RemoveSellerFromDisputeResolverButton,
  parameters: {
    // TODO: delete once storybook doesnt freeze if an arg is an object https://github.com/storybookjs/storybook/issues/17098
    docs: {
      source: {
        type: "code"
      }
    }
  }
} as ComponentMeta<typeof RemoveSellerFromDisputeResolverButton>;

const Template: ComponentStory<typeof RemoveSellerFromDisputeResolverButton> = (
  args: Parameters<typeof RemoveSellerFromDisputeResolverButton>[0]
) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper configId={args.coreSdkConfig.configId}>
      <RemoveSellerFromDisputeResolverButton
        {...args}
        coreSdkConfig={{ ...args.coreSdkConfig, web3Provider: provider }}
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
  coreSdkConfig: {
    configId: "testing-80002-0",
    envName: "testing",
    web3Provider: undefined
  },
  disputeResolverId: 0,
  sellerAllowList: ["0x0123456789012345678901234567890123456789"],
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
  coreSdkConfig: {
    configId: "testing-80002-0",
    envName: "testing",
    web3Provider: undefined
  },
  disputeResolverId: 0,
  sellerAllowList: ["0x0123456789012345678901234567890123456789"],
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
