import { ComponentStory, ComponentMeta } from "@storybook/react";

import { MultiSteps } from "../../components/step/MultiSteps";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Step/MultiSteps",
  component: MultiSteps
} as ComponentMeta<typeof MultiSteps>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MultiSteps> = (args) => (
  <MultiSteps {...args} />
);

export const Example: ComponentStory<typeof MultiSteps> = Template.bind({});
export const SecondExample: ComponentStory<typeof MultiSteps> = Template.bind(
  {}
);

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Example.args = {
  data: [
    {
      name: "Profile Info",
      steps: [{ state: "done" }]
    },
    {
      name: "Product Data",
      steps: [{ state: "done" }, { state: "active" }, { state: "inactive" }]
    },
    {
      name: "Terms of Sale",
      steps: [
        { state: "inactive" },
        { state: "inactive" },
        { state: "inactive" }
      ]
    },
    {
      name: "Confirm",
      steps: [{ state: "inactive" }]
    }
  ]
};

SecondExample.args = {
  data: [
    {
      name: "Choose",
      steps: [{ state: "done" }]
    },
    {
      name: "Describe Problem",
      steps: [{ state: "done" }]
    },
    {
      name: "Additional Details",
      steps: [{ state: "active" }]
    },
    {
      name: "Make a Proposal",
      steps: [{ state: "done" }]
    },
    {
      name: "Review & Submit",
      steps: [{ state: "inactive" }]
    }
  ]
};
