import { fn } from "@storybook/test";
import { Button } from "../../components/buttons/Button";
import React from "react";
import { Meta } from "@storybook/react";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Buttons/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  args: { onClick: fn() },
  argTypes: {
    disabled: { control: "boolean" },
    size: {
      control: "select",
      options: ["small", "regular", "large"]
    },
    children: { control: "text" },
    tooltip: { control: "text" }
  },
  decorators: [
    (Story) => {
      return <Story />;
    }
  ]
} satisfies Meta<typeof Button>;

const BASE_ARGS = {
  children: "Button Text",
  size: "regular",
  tooltip: "tooltip shown when disabled only"
} as const;

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const PrimaryFill = {
  args: {
    ...BASE_ARGS,
    disabled: false,
    loading: false,
    variant: "primaryFill"
  }
};

export const PrimaryInverted = {
  args: {
    ...BASE_ARGS,
    disabled: false,
    loading: false,
    variant: "primaryInverted"
  }
};

export const SecondaryFill = {
  args: {
    ...BASE_ARGS,
    disabled: false,
    loading: false,
    variant: "secondaryFill"
  }
};

export const SecondaryInverted = {
  args: {
    ...BASE_ARGS,
    disabled: false,
    loading: false,
    variant: "secondaryInverted"
  }
};

export const AccentFill = {
  args: {
    ...BASE_ARGS,
    disabled: false,
    loading: false,
    variant: "accentFill"
  }
};

export const AccentInverted = {
  args: {
    ...BASE_ARGS,
    disabled: false,
    loading: false,
    variant: "accentInverted"
  }
};

export const Disabled = {
  args: {
    ...BASE_ARGS,
    disabled: true,
    loading: false,
    variant: "primaryFill"
  }
};

export const Loading = {
  args: {
    ...BASE_ARGS,
    disabled: false,
    loading: true,
    variant: "primaryFill"
  }
};
