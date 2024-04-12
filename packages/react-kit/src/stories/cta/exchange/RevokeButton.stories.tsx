import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { RevokeButton } from "../../../components/cta/exchange/RevokeButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Exchange/RevokeButton",
  component: RevokeButton,
  parameters: {
    // TODO: delete once storybook doesnt freeze if an arg is an object https://github.com/storybookjs/storybook/issues/17098
    docs: {
      source: {
        type: "code"
      }
    }
  }
} as ComponentMeta<typeof RevokeButton>;

const Template: ComponentStory<typeof RevokeButton> = (
  args: Parameters<typeof RevokeButton>[0]
) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper configId={args.coreSdkConfig.configId}>
      <RevokeButton
        {...args}
        coreSdkConfig={{ ...args.coreSdkConfig, web3Provider: provider }}
      />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof RevokeButton> = Template.bind({});
export const WithStep: ComponentStory<typeof RevokeButton> = Template.bind({});

Simple.args = {
  coreSdkConfig: {
    configId: "testing-80002-0",
    envName: "testing"
  },
  exchangeId: "28",
  disabled: false,
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

WithStep.args = {
  coreSdkConfig: {
    configId: "testing-80002-0",
    envName: "testing"
  },
  exchangeId: "28",
  extraInfo: "Step 2",
  disabled: false,
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
