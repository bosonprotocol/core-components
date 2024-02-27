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
const envName =
  (process.env.STORYBOOK_DATA_ENV_NAME as EnvironmentType) || "testing";
const envConfig = getEnvConfigs(envName);

export const Commit: ComponentStory<typeof CommitWidget> = Template.bind({});

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
  sellerId: "138",
  metaTx: {
    apiKey: process.env.STORYBOOK_DATA_META_TX_API_KEY as string,
    apiIds: process.env.STORYBOOK_DATA_META_TX_API_IDS as string
  },
  closeWidgetClick: () => {
    console.log("closeWidgetClick()");
  },
  // onAlreadyOwnOfferClick: () => { // optional
  //   console.log("onAlreadyOwnOfferClick");
  // },
  forcedAccount: "",
  showBosonLogo: false
};

Commit.decorators = [(Story) => wrapper(Story)];

export const CommitTokenGated_ERC20: ComponentStory<typeof CommitWidget> =
  Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
CommitTokenGated_ERC20.args = {
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
  productUuid: "cc482a1-c004-d003-c3ca-a1ed7537af1", // token gated no variations
  sellerId: "138",
  metaTx: {
    apiKey: process.env.STORYBOOK_DATA_META_TX_API_KEY as string,
    apiIds: process.env.STORYBOOK_DATA_META_TX_API_IDS as string
  },
  closeWidgetClick: () => {
    console.log("closeWidgetClick()");
  },
  onAlreadyOwnOfferClick: () => {
    console.log("onAlreadyOwnOfferClick");
  },
  forcedAccount: "",
  showBosonLogo: false
};

CommitTokenGated_ERC20.decorators = [(Story) => wrapper(Story)];

export const CommitWithColorAndSizeVariations: ComponentStory<
  typeof CommitWidget
> = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
CommitWithColorAndSizeVariations.args = {
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
  productUuid: "1d4573d-42e-f557-0032-b1ab8170c102", // with color and size variations
  sellerId: "138",
  metaTx: {
    apiKey: process.env.STORYBOOK_DATA_META_TX_API_KEY as string,
    apiIds: process.env.STORYBOOK_DATA_META_TX_API_IDS as string
  },
  closeWidgetClick: () => {
    console.log("closeWidgetClick()");
  },
  onAlreadyOwnOfferClick: () => {
    console.log("onAlreadyOwnOfferClick");
  },
  forcedAccount: "",
  showBosonLogo: false
};

CommitWithColorAndSizeVariations.decorators = [(Story) => wrapper(Story)];

export const CommitTokenGated_ERC721: ComponentStory<typeof CommitWidget> =
  Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
CommitTokenGated_ERC721.args = {
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
  productUuid: "ce7faab-00c-26-a351-c71f615c07c2",
  sellerId: "138",
  metaTx: {
    apiKey: process.env.STORYBOOK_DATA_META_TX_API_KEY as string,
    apiIds: process.env.STORYBOOK_DATA_META_TX_API_IDS as string
  },
  closeWidgetClick: () => {
    console.log("closeWidgetClick()");
  },
  onAlreadyOwnOfferClick: () => {
    console.log("onAlreadyOwnOfferClick");
  },
  forcedAccount: "",
  showBosonLogo: false
};

CommitTokenGated_ERC721.decorators = [(Story) => wrapper(Story)];

export const CommitTokenGated_ERC721_2: ComponentStory<typeof CommitWidget> =
  Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
CommitTokenGated_ERC721_2.args = {
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
  productUuid: "5d14af-ee3b-8ea2-c4bc-4ab732c4b05c",
  sellerId: "26",
  metaTx: {
    apiKey: process.env.STORYBOOK_DATA_META_TX_API_KEY as string,
    apiIds: process.env.STORYBOOK_DATA_META_TX_API_IDS as string
  },
  closeWidgetClick: () => {
    console.log("closeWidgetClick()");
  },
  onAlreadyOwnOfferClick: () => {
    console.log("onAlreadyOwnOfferClick");
  },
  forcedAccount: "",
  showBosonLogo: false
};

CommitTokenGated_ERC721_2.decorators = [(Story) => wrapper(Story)];

export const CommitTokenGated_ERC1155: ComponentStory<typeof CommitWidget> =
  Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
CommitTokenGated_ERC1155.args = {
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
  productUuid: "d75860e-da32-224-870e-2a884c51a2ee", // token gated 1155
  sellerId: "138",
  metaTx: {
    apiKey: process.env.STORYBOOK_DATA_META_TX_API_KEY as string,
    apiIds: process.env.STORYBOOK_DATA_META_TX_API_IDS as string
  },
  closeWidgetClick: () => {
    console.log("closeWidgetClick()");
  },
  onAlreadyOwnOfferClick: () => {
    console.log("onAlreadyOwnOfferClick");
  },
  forcedAccount: "",
  showBosonLogo: false
};

CommitTokenGated_ERC1155.decorators = [(Story) => wrapper(Story)];

export const CommitBundle: ComponentStory<typeof CommitWidget> = Template.bind(
  {}
);

// More on args: https://storybook.js.org/docs/react/writing-stories/args
CommitBundle.args = {
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
  bundleUuid: "efc1ca63-c816-4636-bb09-0202ed5e75c3",
  productUuid: undefined,
  sellerId: "138",
  metaTx: {
    apiKey: process.env.STORYBOOK_DATA_META_TX_API_KEY as string,
    apiIds: process.env.STORYBOOK_DATA_META_TX_API_IDS as string
  },
  closeWidgetClick: () => {
    console.log("closeWidgetClick()");
  },
  onAlreadyOwnOfferClick: () => {
    console.log("onAlreadyOwnOfferClick");
  },
  forcedAccount: "",
  showBosonLogo: false
};

CommitBundle.decorators = [(Story) => wrapper(Story)];
