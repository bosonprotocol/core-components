import React from "react";
import { BaseTagsInputProps, BaseTagsInput } from "../../components/form";
import { Formik } from "formik";
import * as yup from "yup";
import type { Meta } from "@storybook/react";
import { fn } from "@storybook/test";
const inputWithErrors = "With error";
const defaultHeightSize = "regular";
const inputName = "test";
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Inputs/BaseTagsInput",
  component: BaseTagsInput,
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
    }
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
  decorators: [
    (Story, { name }) => {
      return (
        <Formik<{ [inputName]: unknown }>
          validationSchema={
            name === inputWithErrors
              ? yup.object({ [inputName]: yup.array(yup.string()).required() })
              : undefined
          }
          onSubmit={() => {
            //
          }}
          initialValues={{ [inputName]: "" }}
          initialTouched={{ [inputName]: true }}
        >
          <Story />
        </Formik>
      );
    }
  ] satisfies Meta<typeof BaseTagsInput>["decorators"]
} satisfies Meta<typeof BaseTagsInput>;

const BASE_ARGS = {
  name: inputName,
  placeholder: "this is a placeholder",
  label: "label",
  onAddTag: (tag) => console.log("added tag", tag),
  onRemoveTag: (tag) => console.log("removed tag", tag)
} satisfies BaseTagsInputProps;

export const Simple = {
  args: {
    ...BASE_ARGS,

    heightSize: defaultHeightSize
  } satisfies BaseTagsInputProps
};

export const InputWithError = {
  name: "With error",
  args: {
    ...BASE_ARGS,
    heightSize: defaultHeightSize
  } satisfies BaseTagsInputProps
};
