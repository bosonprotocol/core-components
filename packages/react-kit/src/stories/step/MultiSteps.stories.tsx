import { ComponentStory, ComponentMeta } from "@storybook/react";

import { MultiSteps } from "../../components/step/MultiSteps";

export default {
  title: "Visual Components/Step/MultiSteps",
  component: MultiSteps
} as ComponentMeta<typeof MultiSteps>;

const Template: ComponentStory<typeof MultiSteps> = (args) => (
  <MultiSteps {...args} />
);

export const Example: ComponentStory<typeof MultiSteps> = Template.bind({});
export const SecondExample: ComponentStory<typeof MultiSteps> = Template.bind(
  {}
);

Example.args = {
  active: 2,
  data: [
    {
      name: "Profile Info",
      steps: 1
    },
    {
      name: "Product Data",
      steps: 2
    },
    {
      name: "Terms of Sale",
      steps: 3
    },
    {
      name: "Confirm",
      steps: 1
    }
  ]
};

SecondExample.args = {
  active: 2,
  callback: (current) => {
    console.log(current);
  },
  data: [
    {
      name: "Choose",
      steps: 1
    },
    {
      name: "Describe Problem",
      steps: 1
    },
    {
      name: "Additional Details",
      steps: 1
    },
    {
      name: "Make a Proposal",
      steps: 1
    },
    {
      name: "Review & Submit",
      steps: 1
    }
  ]
};
