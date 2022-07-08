import { ComponentStory, ComponentMeta } from "@storybook/react";

import Button from "../../components/buttons/button";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Buttons/Button",
  component: Button
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary: ComponentStory<typeof Button> = Template.bind({});

export const Secondary: ComponentStory<typeof Button> = Template.bind({});

export const Ghost: ComponentStory<typeof Button> = Template.bind({});

export const Disabled: ComponentStory<typeof Button> = Template.bind({});

export const Loading: ComponentStory<typeof Button> = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  children: "Button Text",
  onClick: () => {
    console.log("buy");
  },
  disabled: false,
  loading: false,
  size: "medium",
  variant: "primary"
};

Secondary.args = {
  onClick: () => {
    console.log("buy");
  },
  disabled: false,
  loading: false,
  size: "medium",
  variant: "secondary",
  children: "Button Text"
};

Ghost.args = {
  onClick: () => {
    console.log("buy");
  },
  disabled: false,
  loading: false,
  size: "medium",
  variant: "ghost",
  children: "Button Text"
};

Disabled.args = {
  onClick: () => {
    console.log("buy");
  },
  disabled: true,
  loading: false,
  size: "medium",
  variant: "primary",
  children: "Button Text"
};

Loading.args = {
  onClick: () => {
    console.log("buy");
  },
  disabled: false,
  loading: true,
  size: "medium",
  variant: "primary",
  children: "Button Text"
};
