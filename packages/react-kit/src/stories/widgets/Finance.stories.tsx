import { ComponentMeta, ComponentStory, Story } from "@storybook/react";
import React from "react";

import { Currencies } from "../../components/currencyDisplay/CurrencyDisplay";

import FinanceWidget from "../../components/widgets/finance/FinanceWidget";
import { ProgressStatus } from "../../lib/progress/progressStatus";
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Widgets/Finance",
  component: FinanceWidget
} as ComponentMeta<typeof FinanceWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FinanceWidget> = (args) => (
  <FinanceWidget {...args} />
);

const wrapper = (Story: Story) => (
  <div>
    <Story />
  </div>
);

export const Finance: ComponentStory<typeof FinanceWidget> = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Finance.args = {
  sellerId: "25",
  envName: "testing",
  defaultTokensList:
    '[{"symbol":"MATIC","name":"Matic","address":"0x0000000000000000000000000000000000000000","decimals":"18"},{"symbol":"WETH","name":"Wrapped Ether","address":"0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa","decimals":"18"},{"symbol":"BOSON","name":"Boson Token","address":"0x1f5431E8679630790E8EbA3a9b41d1BB4d41aeD0","decimals":"18"},{"symbol":"DAI","name":"DAI","address":"0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F","decimals":"18"}]'
};

Finance.decorators = [(Story) => wrapper(Story)];
