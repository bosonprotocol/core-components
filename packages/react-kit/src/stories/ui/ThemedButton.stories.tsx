import { ComponentStory, ComponentMeta } from "@storybook/react";

import ThemedButton, { IButton } from "../../components/ui/ThemedButton";
import React from "react";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/UI/ThemedButton",
  component: ThemedButton
} as ComponentMeta<typeof ThemedButton>;

const BASE_ARGS: Pick<IButton, "onClick" | "size" | "children"> = {
  children: "Button Text",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClick: () => {},
  size: "regular"
};
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ThemedButton> = (args) => (
  <ThemedButton {...BASE_ARGS} {...args} />
);

export const Primary: ComponentStory<typeof ThemedButton> = Template.bind({});

export const BosonPrimary: ComponentStory<typeof ThemedButton> = Template.bind(
  {}
);

export const Secondary: ComponentStory<typeof ThemedButton> = Template.bind({});
export const BosonSecondary: ComponentStory<typeof ThemedButton> = Template.bind({});
export const AccentFiil: ComponentStory<typeof ThemedButton> = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  disabled: false,
  loading: false,
  theme: "primary",
  withBosonStyle: false
};

BosonPrimary.args = {
  disabled: false,
  loading: false,
  theme: "bosonPrimary",
  withBosonStyle: true
};

Secondary.args = {
  disabled: false,
  loading: false,
  theme: "secondary",
  withBosonStyle: false
};

BosonSecondary.args = {
  disabled: false,
  loading: false,
  theme: "secondary",
  withBosonStyle: true
};

AccentFiil.args = {
  disabled: false,
  loading: false,
  theme: "accentFill",
  withBosonStyle: true
};
