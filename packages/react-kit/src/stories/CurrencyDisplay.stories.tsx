import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import {
  Currencies,
  CurrencyDisplay
} from "../components/currencyDisplay/CurrencyDisplay";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/CurrencyDisplay",
  component: CurrencyDisplay
} as ComponentMeta<typeof CurrencyDisplay>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CurrencyDisplay> = (args) => (
  <CurrencyDisplay {...args} />
);

export const CurrencyDisplayWithPrice: ComponentStory<typeof CurrencyDisplay> =
  Template.bind({});

export const CurrencyDisplaySmall: ComponentStory<typeof CurrencyDisplay> =
  Template.bind({});

export const CurrencyDisplayLarge: ComponentStory<typeof CurrencyDisplay> =
  Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
CurrencyDisplayWithPrice.args = {
  currency: Currencies.ETH,
  height: 25,
  value: 10
};

CurrencyDisplaySmall.args = {
  currency: Currencies.ETH,
  height: 25,
  value: undefined
};

CurrencyDisplayLarge.args = {
  currency: Currencies.ETH,
  height: 100,
  value: undefined
};
