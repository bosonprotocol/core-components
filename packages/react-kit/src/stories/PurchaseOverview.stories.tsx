import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PurchaseOverview } from "../components/modal/components/PurchaseOverview/PurchaseOverview";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/PurchaseOverview",
  component: PurchaseOverview,
  argTypes: {
    lookAndFeel: {
      options: ["modal", "regular"],
      control: { type: "radio" }
    }
  }
} as ComponentMeta<typeof PurchaseOverview>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PurchaseOverview> = (args) => (
  <PurchaseOverview {...args} />
);

export const Base: ComponentStory<typeof PurchaseOverview> = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Base.args = {
  hideModal: () => console.log("hideModal"),
  lookAndFeel: "modal"
};
