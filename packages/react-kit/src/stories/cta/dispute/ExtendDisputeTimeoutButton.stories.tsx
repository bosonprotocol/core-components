import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ExtendDisputeTimeoutButton } from "../../../components/cta/dispute/ExtendDisputeTimeoutButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Dispute/ExtendDisputeTimeoutButton",
  component: ExtendDisputeTimeoutButton,
  parameters: {
    // TODO: delete once storybook doesnt freeze if an arg is an object https://github.com/storybookjs/storybook/issues/17098
    docs: {
      source: {
        type: "code"
      }
    }
  }
} as ComponentMeta<typeof ExtendDisputeTimeoutButton>;

const Template: ComponentStory<typeof ExtendDisputeTimeoutButton> = (
  args: Parameters<typeof ExtendDisputeTimeoutButton>[0]
) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper configId={args.coreSdkConfig.configId}>
      <ExtendDisputeTimeoutButton
        {...args}
        coreSdkConfig={{ ...args.coreSdkConfig, web3Provider: provider }}
      />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof ExtendDisputeTimeoutButton> =
  Template.bind({});
export const WithExtraInfo: ComponentStory<typeof ExtendDisputeTimeoutButton> =
  Template.bind({});

Simple.args = {
  coreSdkConfig: {
    configId: "testing-80002-0",
    envName: "testing"
    // metaTransactionsApiKey: undefined,
    // metaTransactionsApiId: "dummyApiId",
  },
  exchangeId: "28",
  newDisputeTimeout: "10000",
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
    envName: "testing"
    // metaTransactionsApiKey: undefined,
  },
  exchangeId: "28",
  newDisputeTimeout: "10000",
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
