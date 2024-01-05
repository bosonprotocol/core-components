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
    "ipfs://QmX8Wnq1eWbf7pRhEDQqdAqWp17YSKXQq8ckZVe4YdqAvt",
  ipfsGateway: process.env.STORYBOOK_DATA_IPFS_GATEWAY,
  ipfsProjectId: process.env.STORYBOOK_DATA_IPFS_PROJECT_ID,
  ipfsProjectSecret: process.env.STORYBOOK_DATA_IPFS_PROJECT_SECRET,
  offerId: "",
  defaultSelectedOfferId: "",
  disableVariationsSelects: false,
  productUuid: "086b32-3fcd-00d1-0624-67513e85415c", // with size variations
  // productUuid: "1d4573d-42e-f557-0032-b1ab8170c102", // with color and size variations
  // productUuid: "cc482a1-c004-d003-c3ca-a1ed7537af1", // token gated no variations
  sellerId: "138",
  metaTx: {
    apiKey: process.env.STORYBOOK_DATA_META_TX_API_KEY as string,
    apiIds: process.env.STORYBOOK_DATA_META_TX_API_IDS as string
  },
  closeWidgetClick: () => {
    console.log("closeWidgetClick()");
  },
  forcedAccount: "",
  showBosonLogo: false
};

Commit.decorators = [(Story) => wrapper(Story)];
