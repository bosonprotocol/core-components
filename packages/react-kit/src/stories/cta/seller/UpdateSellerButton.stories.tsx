import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { UpdateSellerButton } from "../../../components/cta/seller/UpdateSellerButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Seller/UpdateSellerButton",
  component: UpdateSellerButton
} as ComponentMeta<typeof UpdateSellerButton>;

const Template: ComponentStory<typeof UpdateSellerButton> = (args) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper>
      <UpdateSellerButton web3Provider={provider} {...args} />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof UpdateSellerButton> = Template.bind(
  {}
);
export const WithExtraInfo: ComponentStory<typeof UpdateSellerButton> =
  Template.bind({});

Simple.args = {
  envName: "testing",
  exchangeId: "28",
  updateSellerArgs: {
    id: 0,
    operator: "0x0123456789012345678901234567890123456789",
    admin: "0x0123456789012345678901234567890123456789",
    clerk: "0x0123456789012345678901234567890123456789",
    treasury: "0x0123456789012345678901234567890123456789",
    authTokenId: 0,
    authTokenType: 0
  },
  web3Provider: undefined,
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
  envName: "testing",
  exchangeId: "28",
  updateSellerArgs: {
    id: 0,
    operator: "0x0123456789012345678901234567890123456789",
    admin: "0x0123456789012345678901234567890123456789",
    clerk: "0x0123456789012345678901234567890123456789",
    treasury: "0x0123456789012345678901234567890123456789",
    authTokenId: 0,
    authTokenType: 0
  },
  web3Provider: undefined,
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
