import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { AddFeesDisputeResolverButton } from "../../../components/cta/dispute/AddFeesDisputeResolverButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Dispute/AddFeesDisputeResolver",
  component: AddFeesDisputeResolverButton,
  parameters: {
    // TODO: delete once storybook doesnt freeze if an arg is an object https://github.com/storybookjs/storybook/issues/17098
    docs: {
      source: {
        type: "code"
      }
    }
  }
} as ComponentMeta<typeof AddFeesDisputeResolverButton>;

const Template: ComponentStory<typeof AddFeesDisputeResolverButton> = (
  args: Parameters<typeof AddFeesDisputeResolverButton>[0]
) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper configId={args.coreSdkConfig.configId}>
      <AddFeesDisputeResolverButton
        {...args}
        coreSdkConfig={{ ...args.coreSdkConfig, web3Provider: provider }}
      />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof AddFeesDisputeResolverButton> =
  Template.bind({});
export const WithExtraInfo: ComponentStory<
  typeof AddFeesDisputeResolverButton
> = Template.bind({});

Simple.args = {
  coreSdkConfig: {
    configId: "testing-80001-0",
    envName: "testing",
    web3Provider: undefined
  },
  disputeResolverId: "28",
  fees: [
    {
      tokenAddress: "0x0123456789012345678901234567890123456789",
      tokenName: "",
      feeAmount: 1
    }
  ],

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
    configId: "testing-80001-0",
    envName: "testing",
    web3Provider: undefined
  },
  disputeResolverId: "28",
  fees: [
    {
      tokenAddress: "0x0123456789012345678901234567890123456789",
      tokenName: "",
      feeAmount: 1
    }
  ],
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
