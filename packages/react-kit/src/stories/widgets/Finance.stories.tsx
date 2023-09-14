import React from "react";
import { ComponentMeta, ComponentStory, Story } from "@storybook/react";

import FinanceWidget from "../../components/widgets/finance/FinanceWidget";
import { CtaButtonWrapper } from "../helpers/CtaButtonWrapper";
import { EnvironmentType, getEnvConfigs } from "@bosonprotocol/core-sdk";
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Widgets/Finance",
  component: FinanceWidget
} as ComponentMeta<typeof FinanceWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FinanceWidget> = (args) => (
  <CtaButtonWrapper>
    <FinanceWidget {...args} />
  </CtaButtonWrapper>
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
  tokensList:
    process.env.STORYBOOK_DATA_TOKENS_LIST ||
    '[{"symbol":"MATIC","name":"Matic","address":"0x0000000000000000000000000000000000000000","decimals":"18"},{"symbol":"WETH","name":"Wrapped Ether","address":"0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa","decimals":"18"},{"symbol":"BOSON","name":"Boson Token","address":"0x1f5431E8679630790E8EbA3a9b41d1BB4d41aeD0","decimals":"18"},{"symbol":"DAI","name":"DAI","address":"0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F","decimals":"18"}]',
  walletConnectProjectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID,
  metaTx: {
    apiKey: process.env.STORYBOOK_DATA_META_TX_API_KEY as string,
    apiIds: process.env.STORYBOOK_DATA_META_TX_API_IDS as string
  }
};

Finance.decorators = [(Story) => wrapper(Story)];
