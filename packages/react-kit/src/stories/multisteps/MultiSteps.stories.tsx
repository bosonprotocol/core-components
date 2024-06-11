import { fn } from "@storybook/test";
import { MultiSteps, theme } from "../../index";
import React from "react";
import { Meta } from "@storybook/react";
const colors = theme.colors.light;
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/MultiSteps",
  component: MultiSteps,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  args: {
    callback: fn()
  },
  argTypes: {
    disableInactiveSteps: { control: "boolean" },
    isRightArrowEnabled: { control: "boolean" },
    hideArrows: { control: "boolean" },
    active: { control: "number" },
    enabledArrowColor: { control: "color" },
    disabledArrowColor: { control: "color" },
    stepInactiveDotColor: { control: "color" },
    stepInactiveBackgroundColor: { control: "color" },
    stepInactiveHoverDotColor: { control: "color" },
    stepInactiveHoverBackgroundColor: { control: "color" },
    stepActiveBackgroundColor: { control: "color" },
    stepActiveDotsColor: { control: "color" },
    stepDoneBackgroundColor: { control: "color" },
    stepDoneCheckColor: { control: "color" },
    stepDoneHoverBackgroundColor: { control: "color" },
    stepDoneHoverCheckColor: { control: "color" }
  },
  decorators: [
    (Story) => {
      return <Story />;
    }
  ]
} satisfies Meta<typeof MultiSteps>;

const BASE_ARGS = {
  active: 1,
  data: [
    { name: "Create profile", steps: 2 },
    { name: "Summary of profile creation", steps: 1 }
  ],
  enabledArrowColor: colors.darkGrey,
  disabledArrowColor: colors.lightArrowColor,
  stepInactiveDotColor: "#d3d5db",
  stepInactiveBackgroundColor: colors.white,
  stepInactiveHoverDotColor: colors.darkGrey,
  stepInactiveHoverBackgroundColor: colors.lightGrey,
  stepActiveBackgroundColor: colors.black,
  stepActiveDotsColor: colors.green,
  stepDoneBackgroundColor: colors.green,
  stepDoneCheckColor: colors.black,
  stepDoneHoverBackgroundColor: colors.black,
  stepDoneHoverCheckColor: colors.green
} as const;

export const BosonTheme = {
  args: {
    ...BASE_ARGS
  }
};

export const CustomTheme = {
  args: {
    ...BASE_ARGS,
    enabledArrowColor: colors.darkOrange,
    disabledArrowColor: colors.orange,
    stepInactiveDotColor: colors.arsenic,
    stepInactiveBackgroundColor: colors.blue,
    stepInactiveHoverDotColor: colors.cyan,
    stepInactiveHoverBackgroundColor: colors.darkRed,
    stepActiveBackgroundColor: colors.torquise,
    stepActiveDotsColor: colors.froly,
    stepDoneBackgroundColor: "#eeee00",
    stepDoneCheckColor: "#00ff00",
    stepDoneHoverBackgroundColor: "#123456",
    stepDoneHoverCheckColor: "#034f80"
  }
};
