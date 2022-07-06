import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ethers } from "ethers";

import CommitButton from "../components/button/CommitButton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/CommitButton",
  component: CommitButton
} as ComponentMeta<typeof CommitButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CommitButton> = (args) => (
  <CommitButton {...args} />
);

export const Primary: ComponentStory<typeof CommitButton> = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  web3Provider: "" as any,
  chainId: 0,
  offerId: "0x0",
  subgraphUrl: "https://api.thegraph.com",
  protocolDiamond: "0x0",
  onSuccess: ({ offerId, txHash }) => {
    console.log("on success");
    console.log("🚀 ~ file: index.tsx ~ line 32 ~ MainPage ~ txHash", txHash);
    console.log("🚀 ~ file: index.tsx ~ line 32 ~ MainPage ~ offerId", offerId);
  },
  onError: ({ offerId, message }) => {
    console.log("on error");
    console.log("🚀 ~ file: index.tsx ~ line 29 ~ MainPage ~ message", message);
    console.log("🚀 ~ file: index.tsx ~ line 29 ~ MainPage ~ offerId", offerId);
  },
  onPending: ({ offerId, isLoading }) => {
    console.log("on pending");
    console.log(
      "🚀 ~ file: index.tsx ~ line 32 ~ MainPage ~ isLoading",
      isLoading
    );
    console.log("🚀 ~ file: index.tsx ~ line 32 ~ MainPage ~ offerId", offerId);
  }
};
