import { TransactionResponse } from "@bosonprotocol/common";
import { metaTx } from "@bosonprotocol/core-sdk";
import { providers } from "ethers";
import React, { RefObject } from "react";
import { CoreSdkConfig } from "../../../hooks/core-sdk/useCoreSdk";
import { ButtonProps } from "../../buttons/Button";
import { BaseButtonTheme } from "../../buttons/BaseButton";

type WriteContractFn = () => Promise<TransactionResponse>;
type SignMetaTxFn = () => Promise<metaTx.handler.SignedMetaTx>;
type MetaTxCondition = boolean;
export type ActionName = "approveExchangeToken" | "depositFunds" | "commit";
export type Action = {
  name?: ActionName;
  signMetaTxFn?: SignMetaTxFn;
  writeContractFn: WriteContractFn;
  additionalMetaTxCondition?: MetaTxCondition;
  nativeMetaTxContract?: string;
  shouldActionRun?: () => Promise<boolean>;
};
export type CtaButtonProps<T> = Omit<ButtonProps, "onError"> & {
  coreSdkConfig: CoreSdkConfig;
  showLoading?: boolean;
  disabled?: boolean;
  /**
   * Optional number of block confirmations to wait for after transaction is sent.
   * Defaults to 1.
   */
  waitBlocks?: number;
  /**
   * Optional additional information to show as a button label.
   */
  extraInfo?: string;
  /**
   * Optional callback to invoke before user signs the transaction.
   */
  onPendingSignature?: (actionName?: Action["name"]) => void;
  /**
   * Optional callback to invoke after user signed the transaction and before the respective
   * number of blocks (`waitBlock`) were mined.
   */
  onPendingTransaction?: (
    txHash: string,
    isMetaTx?: boolean,
    actionName?: Action["name"]
  ) => void;
  /**
   * Optional callback to invoke after a transaction was replaced or canceled.
   */
  onCancelledTransaction?: (
    oldTxHash: string,
    nexTxResponse: providers.TransactionResponse,
    isMetaTx?: boolean,
    actionName?: Action["name"]
  ) => void;
  /**
   * Optional callback to invoke after a transaction was repriced, i.e. speed up.
   */
  onRepricedTransaction?: (
    oldTxHash: string,
    newTxResponse: providers.TransactionResponse,
    newTxReceipt: providers.TransactionReceipt,
    isMetaTx?: boolean,
    actionName?: Action["name"]
  ) => void;
  /**
   * Optional callback to invoke after the respective number of block (`waitBlocks`) were
   * mined.
   */
  onSuccess?: (receipt: providers.TransactionReceipt, payload: T) => void;
  /**
   * Optional callback to invoke if an error happened.
   */
  onError?: (
    error: Error,
    context: {
      txResponse: providers.TransactionResponse | undefined;
    }
  ) => void;
  children?: React.ReactNode;

  className?: string;
  buttonRef?: RefObject<HTMLButtonElement>;
} & ({ variant?: ButtonProps["variant"] } | { theme: BaseButtonTheme });
