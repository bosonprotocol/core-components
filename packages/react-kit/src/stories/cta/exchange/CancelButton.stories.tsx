import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CancelButton from "../../../components/cta/exchange/CancelButton";
import { connectWallet, hooks, metaMask } from "../../helpers/connect-wallet";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/CTA/Exchange/CancelButton",
  component: CancelButton
} as ComponentMeta<typeof CancelButton>;

// TODO: Move connect wallet button into reusable template
const Template: ComponentStory<typeof CancelButton> = (args) => {
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
      <CancelButton web3Provider={provider} {...args} />
    </>
  );
};

export const Primary: ComponentStory<typeof CancelButton> = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  chainId: 1234,
  exchangeId: "28",
  web3Provider: undefined,
  metaTransactionsApiKey: undefined,
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
