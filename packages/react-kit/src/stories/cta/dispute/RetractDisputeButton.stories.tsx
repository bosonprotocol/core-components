import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { RetractDisputeButton } from "../../../components/cta/dispute/RetractDisputeButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Dispute/RetractDisputeButton",
  component: RetractDisputeButton,
  parameters: {
    // TODO: delete once storybook doesnt freeze if an arg is an object https://github.com/storybookjs/storybook/issues/17098
    docs: {
      source: {
        type: "code"
      }
    }
  }
} as ComponentMeta<typeof RetractDisputeButton>;

const Template: ComponentStory<typeof RetractDisputeButton> = (
  args: Parameters<typeof RetractDisputeButton>[0]
) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper configId={args.coreSdkConfig.configId}>
      <RetractDisputeButton
        {...args}
        coreSdkConfig={{ ...args.coreSdkConfig, web3Provider: provider }}
      />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof RetractDisputeButton> =
  Template.bind({});
export const WithExtraInfo: ComponentStory<typeof RetractDisputeButton> =
  Template.bind({});

Simple.args = {
  coreSdkConfig: {
    configId: "testing-80002-0",
    envName: "testing"
    //   metaTransactionsApiKey: undefined,
    // metaTransactionsApiId: "dummyApiId",
  },
  exchangeId: "28",
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
