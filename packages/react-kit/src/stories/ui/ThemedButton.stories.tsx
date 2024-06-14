import { Meta } from "@storybook/react";

import { fn } from "@storybook/test";
import { CaretDown } from "phosphor-react";
import React from "react";
import ThemedButton from "../../components/ui/ThemedButton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Buttons/ThemedButton",
  component: ThemedButton,
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
    children: {
      table: {
        disable: true
      }
    },
    onClick: {
      table: {
        disable: true
      }
    },
    tooltip: { control: "text" }
  },
  decorators: [
    (Story) => {
      return <Story />;
    }
  ]
} satisfies Meta<typeof ThemedButton>;

const BASE_ARGS = {
  children: (
    <>
      Button Text <CaretDown size={16} />
    </>
  ),
  size: "regular"
} as const;

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary = {
  args: {
    ...BASE_ARGS,
    disabled: false,
    isLoading: false,
    themeVal: "primary",
    withBosonStyle: false
  }
};

export const BosonPrimary = {
  args: {
    ...BASE_ARGS,
    disabled: false,
    isLoading: false,
    themeVal: "bosonPrimary",
    withBosonStyle: true
  }
};

export const Secondary = {
  args: {
    ...BASE_ARGS,
    disabled: false,
    isLoading: false,
    themeVal: "secondary",
    withBosonStyle: false
  }
};

export const BosonSecondary = {
  args: {
    ...BASE_ARGS,
    disabled: false,
    isLoading: false,
    themeVal: "secondary",
    withBosonStyle: true
  }
};

export const AccentFiil = {
  args: {
    ...BASE_ARGS,
    disabled: false,
    isLoading: false,
    themeVal: "accentFill",
    withBosonStyle: true
  }
};
