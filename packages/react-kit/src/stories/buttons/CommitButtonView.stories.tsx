import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CommitButtonView } from "../../components/buttons/CommitButtonView";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Buttons/CommitButton",
  component: CommitButtonView,
  argTypes: {
    layout: {
      options: ["horizontal", "vertical"],
      control: { type: "radio" }
    },
    color: {
      options: ["green", "black", "white"],
      control: { type: "radio" }
    },
    shape: {
      options: ["sharp", "rounded", "pill"],
      control: { type: "radio" }
    }
  }
} as ComponentMeta<typeof CommitButtonView>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CommitButtonView> = (args) => (
  <CommitButtonView {...args} />
);

export const Base: ComponentStory<typeof CommitButtonView> = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Base.args = {
  disabled: false,
  onClick: () => console.log("click"),
  onTaglineClick: () => console.log("tagline click"),
  minWidth: "200px",
  minHeight: "300px",
  layout: "horizontal",
  color: "green",
  shape: "sharp"
};
