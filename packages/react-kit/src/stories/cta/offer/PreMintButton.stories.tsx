import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { PreMintButton } from "../../../components/cta/offer/PreMintButton";

import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Offer/PreMintButton",
  component: PreMintButton,
  parameters: {
    // TODO: delete once storybook doesnt freeze if an arg is an object https://github.com/storybookjs/storybook/issues/17098
    docs: {
      source: {
        type: "code"
      }
    }
  }
} as ComponentMeta<typeof PreMintButton>;

const Template: ComponentStory<typeof PreMintButton> = (
  args: Parameters<typeof PreMintButton>[0]
) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper configId={args.coreSdkConfig.configId}>
      <PreMintButton
        {...args}
        coreSdkConfig={{ ...args.coreSdkConfig, web3Provider: provider }}
      />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof PreMintButton> = Template.bind({});

Simple.args = {
  coreSdkConfig: {
    configId: "testing-80002-0",
    envName: "testing",
    web3Provider: undefined
  },
  offerId: "28",
  amount: 5,
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
