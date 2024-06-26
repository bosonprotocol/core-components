import { ComponentMeta, ComponentStory } from "@storybook/react";
import React, { useRef } from "react";

import { WithdrawFundsButton } from "../../../components/cta/funds/WithdrawFundsButton";

import { BigNumber } from "ethers";
import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/funds/WithdrawFundsButton",
  component: WithdrawFundsButton,
  parameters: {
    // TODO: delete once storybook doesnt freeze if an arg is an object https://github.com/storybookjs/storybook/issues/17098
    docs: {
      source: {
        type: "code"
      }
    }
  }
} as ComponentMeta<typeof WithdrawFundsButton>;

const Template: ComponentStory<typeof WithdrawFundsButton> = (
  args: Parameters<typeof WithdrawFundsButton>[0]
) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const provider = hooks.useProvider();

  return (
    <CtaButtonWrapper configId={args.coreSdkConfig.configId}>
      <WithdrawFundsButton
        {...args}
        coreSdkConfig={{ ...args.coreSdkConfig, web3Provider: provider }}
        buttonRef={buttonRef}
      />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof WithdrawFundsButton> = Template.bind(
  {}
);
export const WithStep: ComponentStory<typeof WithdrawFundsButton> =
  Template.bind({});
export const WithMetaTx: ComponentStory<typeof WithdrawFundsButton> =
  Template.bind({});

Simple.args = {
  coreSdkConfig: {
    configId: "testing-80002-0",
    envName: "testing"
  },
  accountId: "42",
  tokensToWithdraw: [
    {
      address: "",
      amount: BigNumber.from(0)
    }
  ],
  disabled: false,
  onPendingSignature: () => {
    console.log("----------ON PENDING SIGNATURE-------------");
  },
  onPendingTransaction: (txHash: string) => {
    console.log("----------ON PENDING TRANSACTION-------------");
    console.log("txHash", txHash);
  },
  onCancelledTransaction: (oldTxHash, newTxResponse) => {
    console.log("----------ON CANCELLED TRANSACTION-------------");
    console.log({ oldTxHash, newTxResponse });
  },
  onRepricedTransaction: (oldTxHash, newTxResponse, newTxReceipt) => {
    console.log("----------ON REPRICED TRANSACTION-------------");
    console.log({ oldTxHash, newTxResponse, newTxReceipt });
  },
  onSuccess: (receipt, payload) => {
    console.log("----------ON SUCCESS-------------");
    console.log("receipt", receipt);
    console.log("payload", payload);
  },
  onError: (error) => {
    console.log("----------ON ERROR-------------");
    console.log("error", error);
  }
};

WithStep.args = {
  coreSdkConfig: {
    configId: "testing-80002-0",
    envName: "testing"
  },
  tokensToWithdraw: [
    {
      amount: "100",
      address: "0x" + "0".repeat(40)
    }
  ],
  extraInfo: "Step 1",
  disabled: false,
  onPendingSignature: () => {
    console.log("----------ON PENDING SIGNATURE-------------");
  },
  onPendingTransaction: (txHash: string) => {
    console.log("----------ON PENDING TRANSACTION-------------");
    console.log("txHash", txHash);
  },
  onSuccess: (receipt, payload) => {
    console.log("----------ON SUCCESS-------------");
    console.log("receipt", receipt);
    console.log("payload", payload);
  },
  onError: (error) => {
    console.log("----------ON ERROR-------------");
    console.log("error", error);
  }
};

WithMetaTx.args = {
  coreSdkConfig: {
    configId: "testing-80002-0",
    envName: "testing",
    metaTx: {
      relayerUrl: "https://api.biconomy.io",
      apiIds: {
        "0x785a225ebac1b600ca3170c6c7fa3488a203fc21": {
          // BOSON PROTOCOL
          executeMetaTransaction: "eaeff5a5-2efd-4c2b-85f5-b597c79eabf2"
        },
        "0x1f5431e8679630790e8eba3a9b41d1bb4d41aed0": {
          // BOSON TOKEN
          executeMetaTransaction: "0cfeee86-a304-4761-a1fd-dcf63ffd153c"
        }
      },
      apiKey: "change-me"
    }
  },
  tokensToWithdraw: [
    {
      amount: "1000000000000000",
      address: "0x1f5431E8679630790E8EbA3a9b41d1BB4d41aeD0"
    }
  ],
  extraInfo: "",
  disabled: false,
  onPendingSignature: () => {
    console.log("----------ON PENDING SIGNATURE-------------");
  },
  onPendingTransaction: (txHash: string) => {
    console.log("----------ON PENDING TRANSACTION-------------");
    console.log("txHash", txHash);
  },
  onSuccess: (receipt, payload) => {
    console.log("----------ON SUCCESS-------------");
    console.log("receipt", receipt);
    console.log("payload", payload);
  },
  onError: (error) => {
    console.log("----------ON ERROR-------------");
    console.log("error", error);
  }
};
