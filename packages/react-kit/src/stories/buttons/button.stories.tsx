import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button } from "../../components/buttons/Button";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Buttons/Button",
  component: Button
} as ComponentMeta<typeof Button>;

const BASE_ARGS = {
  children: "Button Text",
  onClick: () => {},
  size: "medium"
};
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => (
  <Button {...BASE_ARGS} {...args} />
);

export const Primary: ComponentStory<typeof Button> = Template.bind({});

export const OutlinePrimary: ComponentStory<typeof Button> = Template.bind({});

export const Secondary: ComponentStory<typeof Button> = Template.bind({});

export const OutlineSecondary: ComponentStory<typeof Button> = Template.bind(
  {}
);

export const Ghost: ComponentStory<typeof Button> = Template.bind({});

export const GhostSecondary: ComponentStory<typeof Button> = Template.bind({});

export const GhostOrange: ComponentStory<typeof Button> = Template.bind({});

export const Disabled: ComponentStory<typeof Button> = Template.bind({});

export const Loading: ComponentStory<typeof Button> = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  disabled: false,
  loading: false,
  variant: "primary"
};

OutlinePrimary.args = {
  disabled: false,
  loading: false,
  variant: "primaryOutline"
};

Secondary.args = {
  disabled: false,
  loading: false,
  variant: "secondary"
};

OutlineSecondary.args = {
  disabled: false,
  loading: false,
  variant: "secondaryOutline"
};

GhostSecondary.args = {
  disabled: false,
  loading: false,
  variant: "ghostSecondary"
};

GhostOrange.args = {
  disabled: false,
  loading: false,
  variant: "ghostOrange"
};

Ghost.args = {
  disabled: false,
  loading: false,
  variant: "ghost"
};

Disabled.args = {
  disabled: true,
  loading: false,
  variant: "primary"
};

Loading.args = {
  disabled: false,
  loading: true,
  variant: "primary"
};
