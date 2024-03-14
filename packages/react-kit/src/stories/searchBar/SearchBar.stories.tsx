import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import { EnvironmentType, getEnvConfigs } from "@bosonprotocol/core-sdk";
import { SearchBar } from "../../components/searchBar/SearchBar";

export default {
  title: "Visual Components/SearchBar/SearchBar",
  component: SearchBar
} as ComponentMeta<typeof SearchBar>;

const Template: ComponentStory<typeof SearchBar> = (args) => (
  <SearchBar {...args} />
);

export const Primary: ComponentStory<typeof SearchBar> = Template.bind({});
const envName =
  (process.env.STORYBOOK_DATA_ENV_NAME as EnvironmentType) || "testing";
const envConfig = getEnvConfigs(envName);
Primary.args = {
  disabled: false,
  envName,
  configId: envConfig[0].configId
};
