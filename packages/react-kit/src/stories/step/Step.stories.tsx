import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Step } from "../../components/step/Step";

export default {
  title: "Visual Components/Step/Step",
  component: Step
} as ComponentMeta<typeof Step>;

const Template: ComponentStory<typeof Step> = (args) => <Step {...args} />;

export const Inactive: ComponentStory<typeof Step> = Template.bind({});

export const Active: ComponentStory<typeof Step> = Template.bind({});

export const Done: ComponentStory<typeof Step> = Template.bind({});

Inactive.args = {
  state: "inactive"
};

Active.args = {
  state: "active"
};

Done.args = {
  state: "done"
};
