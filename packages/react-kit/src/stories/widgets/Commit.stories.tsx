import React, { ReactElement } from "react";
import { Meta } from "@storybook/react";

import {
  CommitWidget,
  CommitWidgetProps
} from "../../components/widgets/commit/CommitWidget";
import { EnvironmentType, getEnvConfigs } from "@bosonprotocol/core-sdk";
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Widgets/Commit",
  component: CommitWidget
} as Meta<typeof CommitWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <CommitWidget {...args} />;

const wrapper = (Story: () => ReactElement) => (
  <div>
    <Story />
  </div>
);
const envName =
  (process.env.STORYBOOK_DATA_ENV_NAME as EnvironmentType) || "testing";
const envConfig = getEnvConfigs(envName);

export const Commit = Template.bind({});
const BASE_ARGS = {
  envName,
  configId: envConfig[0].configId,
  walletConnectProjectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || "",
  withCustomReduxContext: false,
  withExternalSigner: false,
  lookAndFeel: "modal",
  withMagicLink: true,
  roundness: "min",
  sendDeliveryInfoThroughXMTP: true,
  withGlobalStyle: true
} as const;
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Commit.args = {
  ...BASE_ARGS,
  dateFormat: "YYYY/MM/DD",
  defaultCurrencySymbol: "$",
  defaultCurrencyTicker: "USD",
  contactSellerForExchangeUrl: "https://bosonapp.io/#/chat/{id}",
  fairExchangePolicyRules:
    "ipfs://QmX8Wnq1eWbf7pRhEDQqdAqWp17YSKXQq8ckZVe4YdqAvt",
  ipfsGateway: process.env.STORYBOOK_DATA_IPFS_GATEWAY,
  ipfsProjectId: process.env.STORYBOOK_DATA_IPFS_PROJECT_ID,
  ipfsProjectSecret: process.env.STORYBOOK_DATA_IPFS_PROJECT_SECRET,
  defaultSelectedOfferId: "",
  disableVariationsSelects: false,
  productUuid: "f4bb0f8-2f2c-d151-2801-0d3c6250461", // with size variations
  sellerId: "4",
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
  showBosonLogo: false,
  withWeb3React: true
} satisfies CommitWidgetProps;

Commit.decorators = [(Story) => wrapper(Story)];

export const CommitTokenGated_ERC20 = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
CommitTokenGated_ERC20.args = {
  ...BASE_ARGS,
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
  bundleUuid: "",
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
  showBosonLogo: false,
  withWeb3React: true
} satisfies CommitWidgetProps;

CommitTokenGated_ERC20.decorators = [(Story) => wrapper(Story)];

export const CommitWithColorAndSizeVariations = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
CommitWithColorAndSizeVariations.args = {
  ...BASE_ARGS,
  contactSellerForExchangeUrl: "https://bosonapp.io/#/chat/{id}",
  fairExchangePolicyRules:
    "ipfs://QmX8Wnq1eWbf7pRhEDQqdAqWp17YSKXQq8ckZVe4YdqAvt",
  ipfsGateway: process.env.STORYBOOK_DATA_IPFS_GATEWAY,
  ipfsProjectId: process.env.STORYBOOK_DATA_IPFS_PROJECT_ID,
  ipfsProjectSecret: process.env.STORYBOOK_DATA_IPFS_PROJECT_SECRET,
  offerId: "",
  defaultSelectedOfferId: "",
  disableVariationsSelects: false,
  bundleUuid: "",
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
  showBosonLogo: false,
  withWeb3React: true
} satisfies CommitWidgetProps;

CommitWithColorAndSizeVariations.decorators = [(Story) => wrapper(Story)];

export const CommitTokenGated_ERC721 = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
CommitTokenGated_ERC721.args = {
  ...BASE_ARGS,
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
  bundleUuid: "",
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
  showBosonLogo: false,
  withWeb3React: true
} satisfies CommitWidgetProps;

CommitTokenGated_ERC721.decorators = [(Story) => wrapper(Story)];

export const CommitTokenGated_ERC721_2 = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
CommitTokenGated_ERC721_2.args = {
  ...BASE_ARGS,
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
  bundleUuid: "",
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
  showBosonLogo: false,
  withWeb3React: true
} satisfies CommitWidgetProps;

CommitTokenGated_ERC721_2.decorators = [(Story) => wrapper(Story)];

export const CommitTokenGated_ERC1155 = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
CommitTokenGated_ERC1155.args = {
  ...BASE_ARGS,
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
  bundleUuid: "",
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
  showBosonLogo: false,
  withWeb3React: true
} satisfies CommitWidgetProps;

CommitTokenGated_ERC1155.decorators = [(Story) => wrapper(Story)];

export const CommitBundle = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
CommitBundle.args = {
  ...BASE_ARGS,
  configId: "testing-11155111-0",
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
  bundleUuid: "e637fb4-32b2-dd-c0ba-e178826513a3",
  productUuid: undefined,
  sellerId: "5",
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
  showBosonLogo: false,
  withWeb3React: true
} satisfies CommitWidgetProps;

CommitBundle.decorators = [(Story) => wrapper(Story)];
