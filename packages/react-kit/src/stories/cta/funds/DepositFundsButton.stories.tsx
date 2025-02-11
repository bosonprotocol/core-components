import React, { useRef } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { DepositFundsButton } from "../../../components/cta/funds/DepositFundsButton";

import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/funds/DepositFundsButton",
  component: DepositFundsButton,
  parameters: {
    // TODO: delete once storybook doesnt freeze if an arg is an object https://github.com/storybookjs/storybook/issues/17098
    docs: {
      source: {
        type: "code"
      }
    }
  }
} as ComponentMeta<typeof DepositFundsButton>;

const Template: ComponentStory<typeof DepositFundsButton> = (
  args: Parameters<typeof DepositFundsButton>[0]
) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const provider = hooks.useProvider();
  return (
    <CtaButtonWrapper configId={args.coreSdkConfig.configId}>
      <DepositFundsButton
        {...args}
        coreSdkConfig={{ ...args.coreSdkConfig, web3Provider: provider }}
        buttonRef={buttonRef}
      />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof DepositFundsButton> = Template.bind(
  {}
);
export const WithStep: ComponentStory<typeof DepositFundsButton> =
  Template.bind({});
export const WithMetaTx: ComponentStory<typeof DepositFundsButton> =
  Template.bind({});

Simple.args = {
  coreSdkConfig: {
    configId: "testing-80002-0",
    envName: "testing"
  },
  accountId: "",
  exchangeToken: "0x" + "0".repeat(40),
  amountToDeposit: 100,
  disabled: false,
  onPendingSignature: (actionName) => {
    console.log("----------ON PENDING SIGNATURE-------------");
    console.log(actionName, "actionName");
  },
  onPendingTransaction: (txHash, isMetaTx, actionName) => {
    console.log("----------ON PENDING TRANSACTION-------------");
    console.log({ txHash, isMetaTx, actionName });
  },
  onCancelledTransaction: (oldTxHash, newTxResponse, isMetaTx, actionName) => {
    console.log("----------ON CANCELLED TRANSACTION-------------");
    console.log({ oldTxHash, newTxResponse, actionName });
  },
  onRepricedTransaction: (
    oldTxHash,
    newTxResponse,
    newTxReceipt,
    isMetaTx,
    actionName
  ) => {
    console.log("----------ON REPRICED TRANSACTION-------------");
    console.log({
      oldTxHash,
      newTxResponse,
      newTxReceipt,
      isMetaTx,
      actionName
    });
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
  ...Simple.args,
  coreSdkConfig: {
    configId: "testing-80002-0",
    envName: "testing"
  },
  exchangeToken: "0x" + "0".repeat(40),
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
  ...Simple.args,
  coreSdkConfig: {
    configId: "testing-80002-0",
    envName: "testing",
    metaTx: {
      relayerUrl: "https://meta-tx-gateway-testing-114403180314.europe-west2.run.app",
      apiIds: {
        "0x7de418a7ce94debd057c34ebac232e7027634ade": {
          // BOSON PROTOCOL
          executeMetaTransaction: "910fa736-3d73-4d09-b398-28ef052c4b24"
        },
        "0x94e32c4bfca1d3fe08b6f8252abb47a5b14ac2bd": {
          // BOSON TOKEN
          executeMetaTransaction: "4c6608aa-829f-401d-9663-91fe62cabc56"
        }
      },
      apiKey: "change-me"
    }
  },
  exchangeToken: "0x94e32c4bfcA1D3fe08B6F8252ABB47A5B14AC2bD",
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
