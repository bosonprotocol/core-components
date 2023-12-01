import React from "react";
import { ComponentMeta, ComponentStory, Story } from "@storybook/react";

import { CommitWidget } from "../../components/widgets/commit/CommitWidget";
import { EnvironmentType, getEnvConfigs } from "@bosonprotocol/core-sdk";
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Widgets/Commit",
  component: CommitWidget
} as ComponentMeta<typeof CommitWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CommitWidget> = (args) => (
  <CommitWidget {...args} />
);

const wrapper = (Story: Story) => (
  <div>
    <Story />
  </div>
);

export const Commit: ComponentStory<typeof CommitWidget> = Template.bind({});

const envName =
  (process.env.STORYBOOK_DATA_ENV_NAME as EnvironmentType) || "testing";
const envConfig = getEnvConfigs(envName);
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Commit.args = {
  envName,
  configId: envConfig[0].configId,
  walletConnectProjectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID,
  dateFormat: "YYYY/MM/DD",
  defaultCurrencySymbol: "$",
  defaultCurrencyTicker: "USD",
  contactSellerForExchangeUrl: "https://bosonapp.io/#/chat/{id}",
  fairExchangePolicyRules:
    "ipfs://QmV3Wy2wmrFdEXzhyhvvaW25Q8w2wTd2UypFVyhwsdBE8T",
  ipfsGateway: process.env.STORYBOOK_DATA_IPFS_GATEWAY,
  ipfsProjectId: process.env.STORYBOOK_DATA_IPFS_PROJECT_ID,
  ipfsProjectSecret: process.env.STORYBOOK_DATA_IPFS_PROJECT_SECRET,
  offerId: "",
  defaultSelectedOfferId: "",
  disableVariationsSelects: true,
  productUuid: "28f220-3c44-d7f4-cf0-0c72702cd4",
  sellerId: "26",
  metaTx: {
    apiKey: process.env.STORYBOOK_DATA_META_TX_API_KEY as string,
    apiIds: process.env.STORYBOOK_DATA_META_TX_API_IDS as string
  },
  closeWidgetClick: () => {
    console.log("closeWidgetClick()");
  },
  modalMargin: "2%",
  forcedAccount: ""
};

Commit.decorators = [(Story) => wrapper(Story)];
