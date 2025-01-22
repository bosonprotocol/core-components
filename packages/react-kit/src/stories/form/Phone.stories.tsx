import React from "react";
import { Phone, PhoneProps } from "../../components/form";
import { Formik } from "formik";
import * as yup from "yup";
import type { Meta } from "@storybook/react";
import { fn } from "@storybook/test";
const inputWithErrors = "With error";
const inputName = "test";
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Inputs/Phone",
  component: Phone,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    disabled: { control: "boolean" }
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
  decorators: [
    (Story, { args, name }) => {
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
          {({ values }) => {
            return (
              <>
                <Story args={{ ...args, name: inputName }} />
                <div>selected value: {JSON.stringify(values)}</div>
              </>
            );
          }}
        </Formik>
      );
    }
  ] satisfies Meta<typeof Phone>["decorators"]
} satisfies Meta<typeof Phone>;

const BASE_ARGS = {
  name: inputName,
  placeholder: "this is a placeholder"
} satisfies PhoneProps;

export const Simple = {
  args: {
    ...BASE_ARGS
  } satisfies PhoneProps
};

export const InputWithError = {
  name: "With error",
  args: {
    ...BASE_ARGS
  } satisfies PhoneProps
};
