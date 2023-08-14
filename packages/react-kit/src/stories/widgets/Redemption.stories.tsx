import React from "react";
import { ComponentMeta, ComponentStory, Story } from "@storybook/react";

import { RedemptionWidget } from "../../components/widgets/redemption/RedemptionWidget";
import { CtaButtonWrapper } from "../helpers/CtaButtonWrapper";
import { EnvironmentType } from "@bosonprotocol/core-sdk";
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
const defaultDisputeResolverId =
  envName === "testing" ? "13" : envName === "staging" ? "2" : "1";
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Redemption.args = {
  envName,
  tokensList:
    process.env.STORYBOOK_DATA_TOKENS_LIST ||
    '[{"symbol":"MATIC","name":"MATIC","address":"0x0000000000000000000000000000000000000000","decimals":"18"},{"symbol":"WETH","name":"Wrapped Ether","address":"0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa","decimals":"18"},{"symbol":"BOSON","name":"Boson Token (PoS)","address":"0x1f5431E8679630790E8EbA3a9b41d1BB4d41aeD0","decimals":"18"},{"symbol":"USDC","name":"Mumbai USD Coin","address":"0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747","decimals":"6"},{"symbol":"DAI","name":"DAI","address":"0x001b3b4d0f3714ca98ba10f6042daebf0b1b7b6f","decimals":"18"},{"symbol":"USDT","name":"Tether USD","address":"0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832","decimals":"6"}]',
  walletConnectProjectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID,
  dateFormat: "YYYY/MM/DD",
  defaultCurrencySymbol: "$",
  defaultCurrencyTicker: "USD",
  contactSellerForExchangeUrl: "https://bosonapp.io/#/chat/{id}",
  fairExchangePolicyRules:
    "ipfs://QmV3Wy2wmrFdEXzhyhvvaW25Q8w2wTd2UypFVyhwsdBE8T",
  defaultDisputeResolverId,
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
  bypassMode: RedemptionBypassMode.NORMAL
};

Redemption.decorators = [(Story) => wrapper(Story)];
