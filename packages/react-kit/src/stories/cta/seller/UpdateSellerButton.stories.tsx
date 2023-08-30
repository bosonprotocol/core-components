import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { UpdateSellerButton } from "../../../components/cta/seller/UpdateSellerButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Seller/UpdateSellerButton",
  component: UpdateSellerButton,
  parameters: {
    // TODO: delete once storybook doesnt freeze if an arg is an object https://github.com/storybookjs/storybook/issues/17098
    docs: {
      source: {
        type: "code"
      }
    }
  }
} as ComponentMeta<typeof UpdateSellerButton>;

const Template: ComponentStory<typeof UpdateSellerButton> = (args) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper>
      <UpdateSellerButton
        {...args}
        coreSdkConfig={{ ...args.coreSdkConfig, web3Provider: provider }}
      />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof UpdateSellerButton> = Template.bind(
  {}
);
export const WithExtraInfo: ComponentStory<typeof UpdateSellerButton> =
  Template.bind({});

Simple.args = {
  coreSdkConfig: {
    configId: "testing-80001-0",
    envName: "testing",
    web3Provider: undefined
  },
  exchangeId: "28",
  updateSellerArgs: {
    id: 0,
    assistant: "0x0123456789012345678901234567890123456789",
    admin: "0x0123456789012345678901234567890123456789",
    treasury: "0x0123456789012345678901234567890123456789",
    clerk: "0x0123456789012345678901234567890123456789",
    authTokenId: 0,
    authTokenType: 0,
    metadataUri: ""
  },
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
  exchangeId: "28",
  updateSellerArgs: {
    id: 0,
    assistant: "0x0123456789012345678901234567890123456789",
    admin: "0x0123456789012345678901234567890123456789",
    clerk: "0x0123456789012345678901234567890123456789",
    treasury: "0x0123456789012345678901234567890123456789",
    authTokenId: 0,
    authTokenType: 0,
    metadataUri: ""
  },
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
