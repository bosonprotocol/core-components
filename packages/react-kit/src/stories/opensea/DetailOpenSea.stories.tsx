import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { ArrowSquareOut } from "phosphor-react";

import { Exchange } from "../../types/exchange";
import { EnvironmentProvider } from "../../components/environment/EnvironmentProvider";
import { OpenSeaButton } from "../../components/modal/components/common/detail/Detail.style";
import { getOpenSeaUrl, getExchangeTokenId } from "@bosonprotocol/utils";

const meta = {
  title: "Visual Components/Opensea/DetailOpenSea",
  component: OpenSeaButton,
  decorators: [
    (Story, { args }) => {
      const exchange = {
        id: args.exchangeId,
        committedDate: Math.floor(Date.now() / 1000),
        offer: {
          id: args.offerId
        },
        seller: {
          voucherCloneAddress: args.voucherCloneAddress
        }
      } as unknown as Exchange;
      const openSeaUrl = getOpenSeaUrl({
        envName: args.envName,
        configId: args.configId,
        tokenId: getExchangeTokenId(exchange, args.envName),
        contractAddress: exchange.seller.voucherCloneAddress
      });
      return (
        <EnvironmentProvider envName={args.envName} configId={args.configId}>
          <OpenSeaButton
            href={openSeaUrl}
            $disabled={!openSeaUrl}
            target="_blank"
          >
            View on OpenSea
            <ArrowSquareOut size={18} />
          </OpenSeaButton>
        </EnvironmentProvider>
      );
    }
  ]
} as ComponentMeta<typeof OpenSeaButton>;

export default meta;

const Template: ComponentStory<typeof OpenSeaButton> = (args) => (
  <OpenSeaButton {...args} />
);

export const TestingAmoy: ComponentStory<typeof OpenSeaButton> = Template.bind(
  {}
);
TestingAmoy.args = {
  disabled: false,
  envName: "testing",
  configId: "testing-80002-0",
  exchangeId: "1100",
  offerId: "228",
  voucherCloneAddress: "0xf79c7b5745ba851cda7c6e17fc3fc72b75166836"
};

export const TestingSepolia: ComponentStory<typeof OpenSeaButton> =
  Template.bind({});
TestingSepolia.args = {
  disabled: false,
  envName: "testing",
  configId: "testing-11155111-0",
  exchangeId: "12",
  offerId: "8",
  voucherCloneAddress: "0xf79c7b5745ba851cda7c6e17fc3fc72b75166836"
};

export const TestingOptimism: ComponentStory<typeof OpenSeaButton> =
  Template.bind({});
TestingOptimism.args = {
  disabled: false,
  envName: "testing",
  configId: "testing-11155420-0",
  exchangeId: "3",
  offerId: "4",
  voucherCloneAddress: "0x041f56fe77ac1558cc415de46f7777234d9d141a"
};

export const TestingArbitrum: ComponentStory<typeof OpenSeaButton> =
  Template.bind({});
TestingArbitrum.args = {
  disabled: false,
  envName: "testing",
  configId: "testing-421614-0",
  exchangeId: "3",
  offerId: "4",
  voucherCloneAddress: "0x041f56fe77ac1558cc415de46f7777234d9d141a"
};

export const TestingBase: ComponentStory<typeof OpenSeaButton> = Template.bind(
  {}
);
TestingBase.args = {
  disabled: false,
  envName: "testing",
  configId: "testing-84532-0",
  exchangeId: "6",
  offerId: "10",
  voucherCloneAddress: "0x041f56fe77ac1558cc415de46f7777234d9d141a"
};
