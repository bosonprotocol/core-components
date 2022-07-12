import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { RevokeButton } from "../../../components/cta/exchange/RevokeButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrappet";

export default {
  title: "Visual Components/CTA/Exchange/RevokeButton",
  component: RevokeButton
} as ComponentMeta<typeof RevokeButton>;

const Template: ComponentStory<typeof RevokeButton> = (args) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper>
      <RevokeButton web3Provider={provider} {...args} />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof RevokeButton> = Template.bind({});
export const WithStep: ComponentStory<typeof RevokeButton> = Template.bind({});

Simple.args = {
  chainId: 1234,
  exchangeId: "28",
  web3Provider: undefined,
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
  chainId: 1234,
  exchangeId: "28",
  web3Provider: undefined,
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
