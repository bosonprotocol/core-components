import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { AddSellerToDisputeResolver } from "../../../components/cta/dispute/AddSellerToDisputeResolverButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Dispute/AddSellerToDisputeResolver",
  component: AddSellerToDisputeResolver,
  parameters: {
    // TODO: delete once storybook doesnt freeze if an arg is an object https://github.com/storybookjs/storybook/issues/17098
    docs: {
      source: {
        type: "code"
      }
    }
  }
} as ComponentMeta<typeof AddSellerToDisputeResolver>;

const Template: ComponentStory<typeof AddSellerToDisputeResolver> = (args) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper>
      <AddSellerToDisputeResolver
        {...args}
        coreSdkConfig={{ ...args.coreSdkConfig, web3Provider: provider }}
      />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof AddSellerToDisputeResolver> =
  Template.bind({});
export const WithExtraInfo: ComponentStory<typeof AddSellerToDisputeResolver> =
  Template.bind({});

Simple.args = {
  coreSdkConfig: {
    configId: "testing-80001-0",
    envName: "testing",
    web3Provider: undefined
  },
  disputeResolverId: "28",
  sellerAllowList: [1, 2],
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
  sellerAllowList: [1, 2],
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
