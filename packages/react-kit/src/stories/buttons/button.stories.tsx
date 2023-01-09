import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button } from "../../components/buttons/Button";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Buttons/Button",
  component: Button
} as ComponentMeta<typeof Button>;

const BASE_ARGS = {
  children: "Button Text",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClick: () => {},
  size: "medium"
};
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => (
  <Button {...BASE_ARGS} {...args} />
);

export const PrimaryFill: ComponentStory<typeof Button> = Template.bind({});

export const PrimaryInverted: ComponentStory<typeof Button> = Template.bind({});

export const SecondaryFill: ComponentStory<typeof Button> = Template.bind({});

export const SecondaryInverted: ComponentStory<typeof Button> = Template.bind(
  {}
);

export const AccentFill: ComponentStory<typeof Button> = Template.bind({});

export const AccentInverted: ComponentStory<typeof Button> = Template.bind({});

export const Disabled: ComponentStory<typeof Button> = Template.bind({});

export const Loading: ComponentStory<typeof Button> = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
PrimaryFill.args = {
  disabled: false,
  loading: false,
  variant: "primaryFill"
};

PrimaryInverted.args = {
  disabled: false,
  loading: false,
  variant: "primaryInverted"
};

SecondaryFill.args = {
  disabled: false,
  loading: false,
  variant: "secondaryFill"
};

SecondaryInverted.args = {
  disabled: false,
  loading: false,
  variant: "secondaryInverted"
};

AccentFill.args = {
  disabled: false,
  loading: false,
  variant: "accentFill"
};

AccentInverted.args = {
  disabled: false,
  loading: false,
  variant: "accentInverted"
};

Disabled.args = {
  disabled: true,
  loading: false,
  variant: "primaryFill"
};

Loading.args = {
  disabled: false,
  loading: true,
  variant: "primaryFill"
};
