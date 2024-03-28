import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CommitButtonView } from "../../components/buttons/CommitButtonView";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Buttons/CommitButton",
  component: CommitButtonView
} as ComponentMeta<typeof CommitButtonView>;

const BASE_ARGS = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClick: () => {},
  size: "regular"
} as const;
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CommitButtonView> = (args) => (
  <CommitButtonView {...BASE_ARGS} {...args} />
);

export const Base: ComponentStory<typeof CommitButtonView> = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Base.args = {
  disabled: false,
  onClick: () => console.log("click")
};
