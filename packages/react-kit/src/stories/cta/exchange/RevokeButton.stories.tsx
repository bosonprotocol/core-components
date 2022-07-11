import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import RevokeButton from "../../../components/cta/exchange/RevokeButton";
import { connectWallet, hooks, metaMask } from "../../helpers/connect-wallet";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/CTA/Exchange/RevokeButton",
  component: RevokeButton
} as ComponentMeta<typeof RevokeButton>;

// TODO: Move connect wallet button into reusable template
const Template: ComponentStory<typeof RevokeButton> = (args) => {
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
      <RevokeButton web3Provider={provider} {...args} />
    </>
  );
};

export const Primary: ComponentStory<typeof RevokeButton> = Template.bind({});
export const WithStep: ComponentStory<typeof RevokeButton> = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  chainId: 1234,
  exchangeId: "28",
  web3Provider: undefined,
  disabled: false,
  onSuccess: ({ exchangeId, txHash }) => {
    console.log("----------ON SUCCESS-------------");
    console.log("txHash", txHash);
    console.log("exchangeId", exchangeId);
  },
  onError: ({ exchangeId, message, error }) => {
    console.log("----------ON ERROR-------------");
    console.log("error", error);
    console.log("message", message);
    console.log("exchangeId", exchangeId);
  },
  onPending: ({ exchangeId, isLoading }) => {
    console.log("----------ON PENDING-------------");
    console.log("isLoading", isLoading);
    console.log("exchangeId", exchangeId);
  }
};
WithStep.args = {
  chainId: 1234,
  exchangeId: "28",
  web3Provider: undefined,
  extraInfo: "Step 2",
  disabled: false,
  onSuccess: ({ exchangeId, txHash }) => {
    console.log("----------ON SUCCESS-------------");
    console.log("txHash", txHash);
    console.log("exchangeId", exchangeId);
  },
  onError: ({ exchangeId, message, error }) => {
    console.log("----------ON ERROR-------------");
    console.log("error", error);
    console.log("message", message);
    console.log("exchangeId", exchangeId);
  },
  onPending: ({ exchangeId, isLoading }) => {
    console.log("----------ON PENDING-------------");
    console.log("isLoading", isLoading);
    console.log("exchangeId", exchangeId);
  }
};
