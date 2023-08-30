import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { RedeemButton } from "../../../components/cta/exchange/RedeemButton";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/Exchange/RedeemButton",
  component: RedeemButton
} as ComponentMeta<typeof RedeemButton>;

const Template: ComponentStory<typeof RedeemButton> = (args) => {
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper>
      <RedeemButton
        {...args}
        coreSdkConfig={{ ...args.coreSdkConfig, web3Provider: provider }}
      />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof RedeemButton> = Template.bind({});
export const WithBiconomy: ComponentStory<typeof RedeemButton> = Template.bind(
  {}
);
export const WithExtraInfo: ComponentStory<typeof RedeemButton> = Template.bind(
  {}
);

Simple.args = {
  coreSdkConfig: {
    configId: "testing-80001-0",
    envName: "testing"
  },
  exchangeId: "92",
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

WithBiconomy.args = {
  ...Simple.args,
  coreSdkConfig: {
    configId: "staging-80001-0",
    envName: "staging",
    metaTx: {
      apiKey: "vYoPWofBr.e4f3e2f9-69e5-4076-8ce1-3b8e0916e02c"
      // metaTransactionsApiId: "3b8898fa-1e48-4bb2-8afa-aabc84b86ec0"
    }
  }
};

WithExtraInfo.args = {
  coreSdkConfig: {
    configId: "testing-80001-0",
    envName: "testing",
    web3Provider: undefined
  },
  exchangeId: "28",
  disabled: false,
  extraInfo: "Step 2",
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
