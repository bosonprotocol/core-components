import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Step } from "../../components/step/Step";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Step/Step",
  component: Step
} as ComponentMeta<typeof Step>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Step> = (args) => <Step {...args} />;

export const Inactive: ComponentStory<typeof Step> = Template.bind({});

export const Active: ComponentStory<typeof Step> = Template.bind({});

export const Done: ComponentStory<typeof Step> = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Inactive.args = {
  state: "inactive"
};

Active.args = {
  state: "active"
};

Done.args = {
  state: "done"
};
