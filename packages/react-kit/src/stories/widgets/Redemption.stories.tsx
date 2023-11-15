import React from "react";
import { ComponentMeta, ComponentStory, Story } from "@storybook/react";

import { RedemptionWidget } from "../../components/widgets/redemption/RedemptionWidget";
import { CtaButtonWrapper } from "../helpers/CtaButtonWrapper";
import {
  EnvironmentType,
  getEnvConfigs,
  subgraph
} from "@bosonprotocol/core-sdk";
import { RedemptionWidgetAction } from "../../components/widgets/redemption/provider/RedemptionContext";
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
  widgetAction: RedemptionWidgetAction.SELECT_EXCHANGE,
  showRedemptionOverview: true,
  exchangeState: subgraph.ExchangeState.Committed,
  sendDeliveryInfoThroughXMTP: true,
  forcedAccount: "",
  sellerIds: undefined
};

Redemption.decorators = [(Story) => wrapper(Story)];

export const RedemptionCallbacks: ComponentStory<typeof RedemptionWidget> =
  Template.bind({});

RedemptionCallbacks.args = {
  ...Redemption.args,
  sendDeliveryInfoThroughXMTP: false,
  postDeliveryInfoUrl: "http://localhost:3666/deliveryInfo",
  postRedemptionSubmittedUrl: "http://localhost:3666/submitted",
  postRedemptionConfirmedUrl: "http://localhost:3666/confirmed"
};

export const RedemptionCallbacksThenClose: ComponentStory<
  typeof RedemptionWidget
> = Template.bind({});

RedemptionCallbacksThenClose.args = {
  ...Redemption.args,
  sendDeliveryInfoThroughXMTP: false,
  postDeliveryInfoUrl: "http://localhost:3666/deliveryInfoThenClose",
  postRedemptionSubmittedUrl: "http://localhost:3666/submitted",
  postRedemptionConfirmedUrl: "http://localhost:3666/confirmed"
};

export const RedemptionCallbacksRedeemConfirm: ComponentStory<
  typeof RedemptionWidget
> = Template.bind({});

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
  postRedemptionConfirmedUrl: "http://localhost:3666/confirmed"
};

export const RedemptionCallbacksFailure: ComponentStory<
  typeof RedemptionWidget
> = Template.bind({});

RedemptionCallbacksFailure.args = {
  ...Redemption.args,
  sendDeliveryInfoThroughXMTP: false,
  postDeliveryInfoUrl: "http://localhost:3666/fail",
  postRedemptionSubmittedUrl: "http://localhost:3666/submitted",
  postRedemptionConfirmedUrl: "http://localhost:3666/confirmed"
};

export const RedemptionCallbacksFailure2: ComponentStory<
  typeof RedemptionWidget
> = Template.bind({});

RedemptionCallbacksFailure2.args = {
  ...Redemption.args,
  sendDeliveryInfoThroughXMTP: false,
  showRedemptionOverview: false,
  widgetAction: RedemptionWidgetAction.REDEEM_FORM,
  exchangeId: "149",
  postDeliveryInfoUrl: "http://localhost:3666/fail2",
  postRedemptionSubmittedUrl: "http://localhost:3666/submitted",
  postRedemptionConfirmedUrl: "http://localhost:3666/confirmed"
};

export const RedemptionCallbacksFailure3: ComponentStory<
  typeof RedemptionWidget
> = Template.bind({});

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
  postRedemptionConfirmedUrl: "http://localhost:3666/confirmed"
};

export const RedemptionCallbacksFailure4: ComponentStory<
  typeof RedemptionWidget
> = Template.bind({});

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
  postRedemptionConfirmedUrl: "http://localhost:3666/fail4"
};

export const RedemptionHandlers: ComponentStory<typeof RedemptionWidget> =
  Template.bind({});

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
  }
};

export const RedemptionHandlersNoResume: ComponentStory<
  typeof RedemptionWidget
> = Template.bind({});

RedemptionHandlersNoResume.args = {
  ...Redemption.args,
  deliveryInfoHandler: async (message, signature) => {
    console.log(`deliveryInfoHandler: ${JSON.stringify(message)} ${signature}`);
    return {
      accepted: true,
      reason: "",
      resume: false
    };
  }
};

export const RedemptionHandlersFailure1: ComponentStory<
  typeof RedemptionWidget
> = Template.bind({});

RedemptionHandlersFailure1.args = {
  ...Redemption.args,
  deliveryInfoHandler: async (message, signature) => {
    console.log(`deliveryInfoHandler: ${JSON.stringify(message)} ${signature}`);
    return {
      accepted: false,
      reason: "Redemption handler is failing",
      resume: false
    };
  }
};

export const RedemptionHandlersFailure2: ComponentStory<
  typeof RedemptionWidget
> = Template.bind({});

RedemptionHandlersFailure2.args = {
  ...Redemption.args,
  deliveryInfoHandler: async (message, signature) => {
    console.log(`deliveryInfoHandler: ${JSON.stringify(message)} ${signature}`);
    throw new Error("Redemption handler is throwing an exception");
  }
};
