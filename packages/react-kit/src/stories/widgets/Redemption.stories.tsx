import React, { ReactElement } from "react";
import { Meta } from "@storybook/react";

import {
  RedemptionWidget,
  RedemptionWidgetProps
} from "../../components/widgets/redemption/RedemptionWidget";
import {
  EnvironmentType,
  getEnvConfigs,
  subgraph
} from "@bosonprotocol/core-sdk";
import { RedemptionWidgetAction } from "../../components/widgets";
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Widgets/Redemption",
  component: RedemptionWidget
} as Meta<typeof RedemptionWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <RedemptionWidget {...args} />;

const wrapper = (Story: () => ReactElement) => (
  <div>
    <Story />
  </div>
);

export const Redemption = Template.bind({});

const envName =
  (process.env.STORYBOOK_DATA_ENV_NAME as EnvironmentType) || "testing";
const envConfig = getEnvConfigs(envName);
const BASE_ARGS = {
  withCustomReduxContext: false,
  raiseDisputeForExchangeUrl: "https://domain.com/{id}",
  lookAndFeel: "modal",
  withWeb3React: true,
  withReduxProvider: true
} as const;
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Redemption.args = {
  envName,
  configId: envConfig[0].configId,
  walletConnectProjectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || "",
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
  widgetAction: RedemptionWidgetAction.SELECT_EXCHANGE,
  showRedemptionOverview: true,
  exchangeState: subgraph.ExchangeState.COMMITTED,
  sendDeliveryInfoThroughXMTP: true,
  forcedAccount: "",
  withExternalSigner: false,
  sellerIds: undefined,
  signatures: undefined,
  ...BASE_ARGS
} satisfies RedemptionWidgetProps;

Redemption.decorators = [(Story) => wrapper(Story)];

export const RedemptionCallbacks = Template.bind({});

RedemptionCallbacks.args = {
  ...Redemption.args,
  sendDeliveryInfoThroughXMTP: false,
  postDeliveryInfoUrl: "http://localhost:3666/deliveryInfo",
  postRedemptionSubmittedUrl: "http://localhost:3666/submitted",
  postRedemptionConfirmedUrl: "http://localhost:3666/confirmed",
  sellerIds: ["0", "26"],
  signatures: [
    "0x8357f1aabd7b1811c4b7e30ed867471b9d813614ebb56ce0a90d9bae0b86c4a5272a1b9749c1cf9ad6823eb6fe5a0367c0f727b68bd411eec02167080d28d3a21c",
    "0x8357f1aabd7b1811c4b7e30ed867471b9d813614ebb56ce0a90d9bae0b86c4a5272a1b9749c1cf9ad6823eb6fe5a0367c0f727b68bd411eec02167080d28d3a21c"
  ],
  ...BASE_ARGS
} satisfies RedemptionWidgetProps;

export const RedemptionCallbacksThenClose = Template.bind({});

RedemptionCallbacksThenClose.args = {
  ...Redemption.args,
  sendDeliveryInfoThroughXMTP: false,
  postDeliveryInfoUrl: "http://localhost:3666/deliveryInfoThenClose",
  postRedemptionSubmittedUrl: "http://localhost:3666/submitted",
  postRedemptionConfirmedUrl: "http://localhost:3666/confirmed",
  ...BASE_ARGS
} satisfies RedemptionWidgetProps;

export const RedemptionCallbacksRedeemConfirm = Template.bind({});

RedemptionCallbacksRedeemConfirm.args = {
  ...Redemption.args,
  sendDeliveryInfoThroughXMTP: false,
  showRedemptionOverview: false,
  widgetAction: RedemptionWidgetAction.CONFIRM_REDEEM,
  exchangeId: "149",
  deliveryInfo: process.env.REACT_APP_DELIVERY_ADDRESS_MOCK
    ? JSON.parse(process.env.REACT_APP_DELIVERY_ADDRESS_MOCK)
    : undefined,
  postDeliveryInfoUrl: "http://localhost:3666/deliveryInfo",
  postRedemptionSubmittedUrl: "http://localhost:3666/submitted",
  postRedemptionConfirmedUrl: "http://localhost:3666/confirmed",
  ...BASE_ARGS
} satisfies RedemptionWidgetProps;

export const RedemptionCallbacksFailure = Template.bind({});

RedemptionCallbacksFailure.args = {
  ...Redemption.args,
  sendDeliveryInfoThroughXMTP: false,
  postDeliveryInfoUrl: "http://localhost:3666/fail",
  postRedemptionSubmittedUrl: "http://localhost:3666/submitted",
  postRedemptionConfirmedUrl: "http://localhost:3666/confirmed",
  ...BASE_ARGS
} satisfies RedemptionWidgetProps;

export const RedemptionCallbacksFailure2 = Template.bind({});

RedemptionCallbacksFailure2.args = {
  ...Redemption.args,
  sendDeliveryInfoThroughXMTP: false,
  showRedemptionOverview: false,
  widgetAction: RedemptionWidgetAction.REDEEM_FORM,
  exchangeId: "149",
  postDeliveryInfoUrl: "http://localhost:3666/fail2",
  postRedemptionSubmittedUrl: "http://localhost:3666/submitted",
  postRedemptionConfirmedUrl: "http://localhost:3666/confirmed",
  ...BASE_ARGS
} satisfies RedemptionWidgetProps;

export const RedemptionCallbacksFailure3 = Template.bind({});

RedemptionCallbacksFailure3.args = {
  ...Redemption.args,
  sendDeliveryInfoThroughXMTP: false,
  showRedemptionOverview: false,
  widgetAction: RedemptionWidgetAction.CONFIRM_REDEEM,
  exchangeId: "149",
  deliveryInfo: {
    name: "TOTO",
    streetNameAndNumber: "1 grand place",
    city: "LILLE",
    state: "NORD",
    zip: "59000",
    country: "FR",
    email: "toto@mail.com",
    phone: "+33123456789"
  },
  postDeliveryInfoUrl: "http://localhost:3666/deliveryInfo",
  postRedemptionSubmittedUrl: "http://localhost:3666/fail3",
  postRedemptionConfirmedUrl: "http://localhost:3666/confirmed",
  ...BASE_ARGS
} satisfies RedemptionWidgetProps;

export const RedemptionCallbacksFailure4 = Template.bind({});

RedemptionCallbacksFailure4.args = {
  ...Redemption.args,
  sendDeliveryInfoThroughXMTP: false,
  showRedemptionOverview: false,
  widgetAction: RedemptionWidgetAction.CONFIRM_REDEEM,
  exchangeId: "149",
  deliveryInfo: {
    name: "TOTO",
    streetNameAndNumber: "1 grand place",
    city: "LILLE",
    state: "NORD",
    zip: "59000",
    country: "FR",
    email: "toto@mail.com",
    phone: "+33123456789"
  },
  postDeliveryInfoUrl: "http://localhost:3666/deliveryInfo",
  postRedemptionSubmittedUrl: "http://localhost:3666/submitted",
  postRedemptionConfirmedUrl: "http://localhost:3666/fail4",
  ...BASE_ARGS
} satisfies RedemptionWidgetProps;

export const RedemptionHandlers = Template.bind({});

RedemptionHandlers.args = {
  ...Redemption.args,
  sendDeliveryInfoThroughXMTP: false,
  deliveryInfoHandler: async (message, signature) => {
    console.log(`deliveryInfoHandler: ${JSON.stringify(message)} ${signature}`);
    return {
      accepted: true,
      reason: "",
      resume: true
    };
  },
  redemptionConfirmedHandler: async (message) => {
    console.log(`redemptionConfirmedHandler: ${JSON.stringify(message)}`);
    return {
      accepted: true,
      reason: ""
    };
  },
  redemptionSubmittedHandler: async (message) => {
    console.log(`redemptionSubmittedHandler: ${JSON.stringify(message)}`);
    return {
      accepted: true,
      reason: ""
    };
  },
  ...BASE_ARGS
} satisfies RedemptionWidgetProps;

export const RedemptionHandlersNoResume = Template.bind({});

RedemptionHandlersNoResume.args = {
  ...Redemption.args,
  deliveryInfoHandler: async (message, signature) => {
    console.log(`deliveryInfoHandler: ${JSON.stringify(message)} ${signature}`);
    return {
      accepted: true,
      reason: "",
      resume: false
    };
  },
  ...BASE_ARGS
} satisfies RedemptionWidgetProps;

export const RedemptionHandlersFailure1 = Template.bind({});

RedemptionHandlersFailure1.args = {
  ...Redemption.args,
  deliveryInfoHandler: async (message, signature) => {
    console.log(`deliveryInfoHandler: ${JSON.stringify(message)} ${signature}`);
    return {
      accepted: false,
      reason: "Redemption handler is failing",
      resume: false
    };
  },
  ...BASE_ARGS
} satisfies RedemptionWidgetProps;

export const RedemptionHandlersFailure2 = Template.bind({});

RedemptionHandlersFailure2.args = {
  ...Redemption.args,
  deliveryInfoHandler: async (message, signature) => {
    console.log(`deliveryInfoHandler: ${JSON.stringify(message)} ${signature}`);
    throw new Error("Redemption handler is throwing an exception");
  },
  ...BASE_ARGS
} satisfies RedemptionWidgetProps;

export const RedemptionHandlersFailure3 = Template.bind({});

RedemptionHandlersFailure3.args = {
  ...Redemption.args,
  sendDeliveryInfoThroughXMTP: false,
  deliveryInfoHandler: async (message, signature) => {
    console.log(`deliveryInfoHandler: ${JSON.stringify(message)} ${signature}`);
    return {
      accepted: true,
      reason: "",
      resume: true
    };
  },
  redemptionSubmittedHandler: async (message) => {
    console.log(`redemptionSubmittedHandler: ${JSON.stringify(message)}`);
    throw new Error("Redemption handler is throwing an exception");
  },
  ...BASE_ARGS
} satisfies RedemptionWidgetProps;

export const RedemptionHandlersFailure4 = Template.bind({});

RedemptionHandlersFailure4.args = {
  ...Redemption.args,
  sendDeliveryInfoThroughXMTP: false,
  deliveryInfoHandler: async (message, signature) => {
    console.log(`deliveryInfoHandler: ${JSON.stringify(message)} ${signature}`);
    return {
      accepted: true,
      reason: "",
      resume: true
    };
  },
  redemptionConfirmedHandler: async (message) => {
    console.log(`redemptionConfirmedHandler: ${JSON.stringify(message)}`);
    throw new Error("Redemption handler is throwing an exception");
  },
  ...BASE_ARGS
} satisfies RedemptionWidgetProps;
