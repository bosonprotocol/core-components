import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CommitButton from "../../../components/cta/offer/CommitButton";

import { connectWallet, hooks, metaMask } from "../../helpers/connect-wallet";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/CTA/Offer/CommitButton",
  component: CommitButton
} as ComponentMeta<typeof CommitButton>;

// TODO: Move connect wallet button into reusable template
const Template: ComponentStory<typeof CommitButton> = (args) => {
  const account = hooks.useAccount();
  const provider = hooks.useProvider();

  return (
    <>
      {account ? (
        <>
          <div>Connected: {account}</div>
          <button onClick={() => metaMask.deactivate()}>Disconnect MM</button>
        </>
      ) : (
        <button onClick={() => connectWallet()}>Connect MM</button>
      )}
      <CommitButton web3Provider={provider} {...args} />
    </>
  );
};

export const Primary: ComponentStory<typeof CommitButton> = Template.bind({});
export const WithStep: ComponentStory<typeof CommitButton> = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  chainId: 1234,
  offerId: "28",
  metaTransactionsApiKey: undefined,
  web3Provider: undefined,
  extraInfo: "",
  disabled: false,
  onSuccess: ({ offerId, txHash, exchangeId }) => {
    console.log("----------ON SUCCESS-------------");
    console.log("txHash", txHash);
    console.log("offerId", offerId);
    console.log("exchangeId", exchangeId);
  },
  onError: ({ offerId, message, error }) => {
    console.log("----------ON ERROR-------------");
    console.log("error", error);
    console.log("message", message);
    console.log("offerId", offerId);
  },
  onPendingUserConfirmation: ({ offerId, isLoading }) => {
    console.log("----------ON PENDING-------------");
    console.log("isLoading", isLoading);
    console.log("offerId", offerId);
  },
  onPendingTransactionConfirmation: (txHash: string) => {
    console.log("----------ON PENDING-------------");
    console.log("txHash", txHash);
  }
};

WithStep.args = {
  chainId: 1234,
  offerId: "28",
  metaTransactionsApiKey: undefined,
  web3Provider: undefined,
  extraInfo: "Step 1",
  disabled: false,
  onSuccess: ({ offerId, txHash, exchangeId }) => {
    console.log("----------ON SUCCESS-------------");
    console.log("txHash", txHash);
    console.log("offerId", offerId);
    console.log("exchangeId", exchangeId);
  },
  onError: ({ offerId, message, error }) => {
    console.log("----------ON ERROR-------------");
    console.log("error", error);
    console.log("message", message);
    console.log("offerId", offerId);
  },
  onPendingUserConfirmation: ({ offerId, isLoading }) => {
    console.log("----------ON PENDING-------------");
    console.log("isLoading", isLoading);
    console.log("offerId", offerId);
  },
  onPendingTransactionConfirmation: (txHash: string) => {
    console.log("----------ON PENDING-------------");
    console.log("txHash", txHash);
  }
};
