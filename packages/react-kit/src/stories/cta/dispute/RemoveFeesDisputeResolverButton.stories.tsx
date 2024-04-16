import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { RemoveFeesDisputeResolver } from "../../../components/cta/dispute/RemoveFeesDisputeResolverButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Dispute/RemoveFeesDisputeResolver",
  component: RemoveFeesDisputeResolver,
  parameters: {
    // TODO: delete once storybook doesnt freeze if an arg is an object https://github.com/storybookjs/storybook/issues/17098
    docs: {
      source: {
        type: "code"
      }
    }
  }
} as ComponentMeta<typeof RemoveFeesDisputeResolver>;

const Template: ComponentStory<typeof RemoveFeesDisputeResolver> = (
  args: Parameters<typeof RemoveFeesDisputeResolver>[0]
) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper configId={args.coreSdkConfig.configId}>
      <RemoveFeesDisputeResolver
        {...args}
        coreSdkConfig={{ ...args.coreSdkConfig, web3Provider: provider }}
      />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof RemoveFeesDisputeResolver> =
  Template.bind({});
export const WithExtraInfo: ComponentStory<typeof RemoveFeesDisputeResolver> =
  Template.bind({});

Simple.args = {
  coreSdkConfig: {
    configId: "testing-80002-0",
    envName: "testing",
    web3Provider: undefined
  },
  disputeResolverId: 0,
  feeTokenAddresses: ["0x0123456789012345678901234567890123456789"],
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
  feeTokenAddresses: ["0x0123456789012345678901234567890123456789"],
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
