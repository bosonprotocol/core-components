import { ComponentStory, ComponentMeta } from "@storybook/react";

import RevokeButton from "../../components/cta/revokeButton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/CTA/RevokeButton",
  component: RevokeButton
} as ComponentMeta<typeof RevokeButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof RevokeButton> = (args) => (
  <RevokeButton {...args} />
);

export const Primary: ComponentStory<typeof RevokeButton> = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  chainId: 1234,
  exchangeId: "39",
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
