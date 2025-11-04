import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ReserveRangeButton } from "../../../components/cta/offer/ReserveRangeButton";

import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Offer/ReserveRangeButton",
  component: ReserveRangeButton,
  parameters: {
    // TODO: delete once storybook doesnt freeze if an arg is an object https://github.com/storybookjs/storybook/issues/17098
    docs: {
      source: {
        type: "code"
      }
    }
  }
} as ComponentMeta<typeof ReserveRangeButton>;

const Template: ComponentStory<typeof ReserveRangeButton> = (
  args: Parameters<typeof ReserveRangeButton>[0]
) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper configId={args.coreSdkConfig.configId}>
      <ReserveRangeButton
        {...args}
        coreSdkConfig={{ ...args.coreSdkConfig, web3Provider: provider }}
      />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof ReserveRangeButton> = Template.bind(
  {}
);

Simple.args = {
  coreSdkConfig: {
    configId: "testing-80002-0",
    envName: "testing",
    web3Provider: undefined
  },
  offerId: "28",
  length: 5,
  to: "seller",
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
