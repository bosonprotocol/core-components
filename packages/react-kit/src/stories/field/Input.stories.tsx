import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Field } from "../../components/field/Field";

export default {
  title: "Visual Components/Field/Input",
  component: Field
} as ComponentMeta<typeof Field>;

const BASE_ARGS = {
  fieldType: "input",
  placeholder: "Type in anything..."
};
const Template: ComponentStory<typeof Field> = (args) => (
  <Field {...BASE_ARGS} {...args} />
);

export const Initial: ComponentStory<typeof Field> = Template.bind({});
export const Error: ComponentStory<typeof Field> = Template.bind({});
export const Disabled: ComponentStory<typeof Field> = Template.bind({});

Initial.args = {};

Error.args = {
  error: "An error occured!"
};

Disabled.args = {
  disabled: true
};
