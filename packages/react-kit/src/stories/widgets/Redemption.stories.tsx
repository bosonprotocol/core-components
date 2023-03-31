import React from "react";
import { ComponentMeta, ComponentStory, Story } from "@storybook/react";

import { RedemptionWidget } from "../../components/widgets/redemption/RedemptionWidget";
import { CtaButtonWrapper } from "../helpers/CtaButtonWrapper";
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Widgets/Redemption",
  component: RedemptionWidget
} as ComponentMeta<typeof RedemptionWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof RedemptionWidget> = (args) => (
  <CtaButtonWrapper>
    <RedemptionWidget {...args} />
  </CtaButtonWrapper>
);

const wrapper = (Story: Story) => (
  <div>
    <Story />
  </div>
);

export const Redemption: ComponentStory<typeof RedemptionWidget> =
  Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Redemption.args = {
  envName: "testing",
  dateFormat: "YYYY/MM/DD",
  defaultCurrencySymbol: "$",
  defaultCurrencyTicker: "USD",
  contactSellerForExchangeUrl: "https://bosonapp.io/#/chat/{id}"
};

Redemption.decorators = [(Story) => wrapper(Story)];
