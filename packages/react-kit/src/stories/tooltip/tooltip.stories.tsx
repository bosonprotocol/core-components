import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Tooltip } from "../../components/tooltip/Tooltip";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Tooltip/Tooltip",
  component: Tooltip
} as ComponentMeta<typeof Tooltip>;

const BASE_ARGS = {
  placement: "top"
};
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Tooltip> = (args) => (
  <Tooltip {...BASE_ARGS} {...args} />
);

export const ExampleTooltip: ComponentStory<typeof Tooltip> = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
ExampleTooltip.args = {
  content: "lorem ipsum dolor"
};
