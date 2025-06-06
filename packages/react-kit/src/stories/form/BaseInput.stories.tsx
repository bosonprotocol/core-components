import React from "react";
import { Input } from "../../components/form";
import { Formik } from "formik";
import type { Meta } from "@storybook/react";
import { fn } from "@storybook/test";
const inputWithErrors = "With error";
const defaultHeightSize = "regular";
const inputName = "test";
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Inputs/BaseInput",
  component: Input,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    disabled: { control: "boolean" },
    heightSize: {
      control: "select",
      options: ["small", "regular", "large"]
    },
    isClearable: { control: "boolean" }
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
  decorators: [
    (Story, { name }) => {
      return (
        <Formik<{ [inputName]: unknown }>
          onSubmit={() => {
            //
          }}
          initialErrors={
            name === inputWithErrors
              ? { [inputName]: "Input error before typing!" }
              : {}
          }
          initialValues={{ [inputName]: "" }}
          initialTouched={{ [inputName]: true }}
        >
          <Story />
        </Formik>
      );
    }
  ] satisfies Meta<typeof Input>["decorators"]
} satisfies Meta<typeof Input>;

export const Simple = {
  args: {
    name: inputName,
    placeholder: "this is a placeholder",
    heightSize: defaultHeightSize
  }
};

export const InputWithError = {
  name: "With error",
  args: {
    name: inputName,
    placeholder: "this is a placeholder",
    heightSize: defaultHeightSize
  }
};
