import React, { useRef } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CommitButton } from "../../../components/cta/offer/CommitButton";

import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Offer/CommitButton",
  component: CommitButton
} as ComponentMeta<typeof CommitButton>;

const Template: ComponentStory<typeof CommitButton> = (args) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper>
      <CommitButton web3Provider={provider} {...args} buttonRef={buttonRef} />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof CommitButton> = Template.bind({});
export const WithStep: ComponentStory<typeof CommitButton> = Template.bind({});
export const WithMetaTx: ComponentStory<typeof CommitButton> = Template.bind(
  {}
);

Simple.args = {
  envName: "testing",
  offerId: "28",
  price: "100",
  exchangeToken: "0x" + "0".repeat(40),
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
  envName: "testing",
  offerId: "52",
  price: "100",
  exchangeToken: "0x" + "0".repeat(40),
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

WithMetaTx.args = {
  envName: "testing",
  offerId: "19",
  price: "1000000000000000",
  exchangeToken: "0x1f5431E8679630790E8EbA3a9b41d1BB4d41aeD0",
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
  },
  metaTx: {
    relayerUrl: "https://api.biconomy.io",
    apiIds: {
      "0x785a225EBAC1b600cA3170C6c7fA3488A203Fc21": {
        // BOSON PROTOCOL
        executeMetaTransaction: "eaeff5a5-2efd-4c2b-85f5-b597c79eabf2"
      },
      "0x1f5431E8679630790E8EbA3a9b41d1BB4d41aeD0": {
        // BOSON TOKEN
        executeMetaTransaction: "0cfeee86-a304-4761-a1fd-dcf63ffd153c"
      }
    },
    apiKey: "change-me"
  }
};
