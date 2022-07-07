import { ComponentStory, ComponentMeta } from "@storybook/react";

import CommitButton from "../../components/cta/commitButton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/CTA/CommitButton",
  component: CommitButton
} as ComponentMeta<typeof CommitButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CommitButton> = (args) => (
  <CommitButton {...args} />
);

export const Primary: ComponentStory<typeof CommitButton> = Template.bind({});

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
