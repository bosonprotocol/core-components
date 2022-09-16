import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { SearchBar } from "../../components/searchBar/SearchBar";

export default {
  title: "Visual Components/SearchBar/SearchBar",
  component: SearchBar
} as ComponentMeta<typeof SearchBar>;

const Template: ComponentStory<typeof SearchBar> = (args) => (
  <SearchBar {...args} />
);

export const Primary: ComponentStory<typeof SearchBar> = Template.bind({});

Primary.args = {
  disabled: false,
  envName: "testing"
};
