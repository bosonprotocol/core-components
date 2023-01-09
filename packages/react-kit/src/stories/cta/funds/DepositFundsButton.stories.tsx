import React, { useRef } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { DepositFundsButton } from "../../../components/cta/funds/DepositFundsButton";

import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";

export default {
  title: "Visual Components/CTA/funds/DepositFundsButton",
  component: DepositFundsButton
} as ComponentMeta<typeof DepositFundsButton>;

const Template: ComponentStory<typeof DepositFundsButton> = (args) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const provider = hooks.useProvider();
  return (
    <CtaButtonWrapper>
      <DepositFundsButton
        web3Provider={provider}
        {...args}
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
  envName: "testing",
  accountId: "",
  exchangeToken: "0x" + "0".repeat(40),
  amountToDeposit: 100,
  disabled: false,
  onPendingSignature: (actionName) => {
    console.log("----------ON PENDING SIGNATURE-------------");
    console.log(actionName, "actionName");
  },
  onPendingTransaction: (
    txHash: string,
    isMetaTx: boolean,
    actionName: string
  ) => {
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
  envName: "testing",
  offerId: "52",
  price: "100",
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
  envName: "testing",
  offerId: "19",
  price: "1000000000000000",
  exchangeToken: "0x1f5431E8679630790E8EbA3a9b41d1BB4d41aeD0",
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
  },
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
};
