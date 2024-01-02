import React from "react";
import { ComponentMeta, ComponentStory, Story } from "@storybook/react";

import FinanceWidget from "../../components/widgets/finance/FinanceWidget";
import { EnvironmentType, getEnvConfigs } from "@bosonprotocol/core-sdk";
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Widgets/Finance",
  component: FinanceWidget
} as ComponentMeta<typeof FinanceWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FinanceWidget> = (args) => (
  <FinanceWidget {...args} />
);

const wrapper = (Story: Story) => (
  <div>
    <Story />
  </div>
);

export const Finance: ComponentStory<typeof FinanceWidget> = Template.bind({});
const envName =
  (process.env.STORYBOOK_DATA_ENV_NAME as EnvironmentType) || "testing";
const envConfig = getEnvConfigs(envName);
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Finance.args = {
  sellerId: process.env.STORYBOOK_DATA_SELLER_ID || "25",
  envName,
  configId: envConfig[0].configId,
  walletConnectProjectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID,
  metaTx: {
    apiKey: process.env.STORYBOOK_DATA_META_TX_API_KEY as string,
    apiIds: process.env.STORYBOOK_DATA_META_TX_API_IDS as string
  },
  withExternalSigner: false
};

Finance.decorators = [(Story) => wrapper(Story)];
