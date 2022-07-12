import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CommitButton } from "../../../components/cta/offer/CommitButton";

import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrappet";

export default {
  title: "Visual Components/CTA/Offer/CommitButton",
  component: CommitButton
} as ComponentMeta<typeof CommitButton>;

const Template: ComponentStory<typeof CommitButton> = (args) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper>
      <CommitButton web3Provider={provider} {...args} />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof CommitButton> = Template.bind({});
export const WithStep: ComponentStory<typeof CommitButton> = Template.bind({});

Simple.args = {
  chainId: 1234,
  offerId: "28",
  metaTransactionsApiKey: undefined,
  web3Provider: undefined,
  extraInfo: "",
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
  offerId: "28",
  metaTransactionsApiKey: undefined,
  web3Provider: undefined,
  extraInfo: "Step 1",
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
