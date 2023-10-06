import React from "react";
import { ComponentMeta, ComponentStory, Story } from "@storybook/react";

import { RedemptionWidget } from "../../components/widgets/redemption/RedemptionWidget";
import { CtaButtonWrapper } from "../helpers/CtaButtonWrapper";
import { EnvironmentType, getEnvConfigs } from "@bosonprotocol/core-sdk";
import { RedemptionBypassMode } from "../../components/modal/components/Redeem/RedeemNonModal";
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Widgets/Redemption",
  component: RedemptionWidget
} as ComponentMeta<typeof RedemptionWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof RedemptionWidget> = (args) => (
  <CtaButtonWrapper>
    <RedemptionWidget {...args} />
  </CtaButtonWrapper>
);

const wrapper = (Story: Story) => (
  <div>
    <Story />
  </div>
);

export const Redemption: ComponentStory<typeof RedemptionWidget> =
  Template.bind({});

const envName =
  (process.env.STORYBOOK_DATA_ENV_NAME as EnvironmentType) || "testing";
const envConfig = getEnvConfigs(envName);
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Redemption.args = {
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
  exchangeId: "",
  metaTx: {
    apiKey: process.env.STORYBOOK_DATA_META_TX_API_KEY as string,
    apiIds: process.env.STORYBOOK_DATA_META_TX_API_IDS as string
  },
  closeWidgetClick: () => {
    console.log("closeWidgetClick()");
  },
  modalMargin: "2%",
  bypassMode: RedemptionBypassMode.NORMAL,
  forcedAccount: ""
};

Redemption.decorators = [(Story) => wrapper(Story)];
