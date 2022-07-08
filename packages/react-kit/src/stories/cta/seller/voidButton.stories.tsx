import { ComponentStory, ComponentMeta } from "@storybook/react";

import VoidButton from "../../../components/cta/seller/voidButton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/CTA/Buyer/CommitButton",
  component: VoidButton
} as ComponentMeta<typeof VoidButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// TODO: Move connect wallet button into reusable template
const Template: ComponentStory<typeof VoidButton> = (args) => {
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
      <VoidButton web3Provider={provider} {...args} />
    </>
  );
};

export const Primary: ComponentStory<typeof VoidButton> = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  chainId: 1234,
  offerId: "28",
  onSuccess: ({ offerId, txHash }) => {
    console.log("----------ON SUCCESS-------------");
    console.log("txHash", txHash);
    console.log("offerId", offerId);
  },
  onError: ({ offerId, message, error }) => {
    console.log("----------ON ERROR-------------");
    console.log("error", error);
    console.log("message", message);
    console.log("offerId", offerId);
  },
  onPending: ({ offerId, isLoading }) => {
    console.log("----------ON PENDING-------------");
    console.log("isLoading", isLoading);
    console.log("offerId", offerId);
  }
};
