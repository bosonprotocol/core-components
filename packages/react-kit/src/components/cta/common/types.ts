import React, { RefObject } from "react";
import { providers } from "ethers";
import { CoreSdkConfig } from "../../../hooks/useCoreSdk";
import { ButtonProps, ButtonSize } from "../../buttons/Button";

export type CtaButtonProps<T> = CoreSdkConfig & {
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
  onPendingSignature?: (actionName?: string) => void;
  /**
   * Optional callback to invoke after user signed the transaction and before the respective
   * number of blocks (`waitBlock`) were mined.
   */
  onPendingTransaction?: (
    txHash: string,
    isMetaTx?: boolean,
    actionName?: string
  ) => void;
  /**
   * Optional callback to invoke after a transaction was replaced or canceled.
   */
  onCancelledTransaction?: (
    oldTxHash: string,
    nexTxResponse: providers.TransactionResponse,
    isMetaTx?: boolean,
    actionName?: string
  ) => void;
  /**
   * Optional callback to invoke after a transaction was repriced, i.e. speed up.
   */
  onRepricedTransaction?: (
    oldTxHash: string,
    newTxResponse: providers.TransactionResponse,
    newTxReceipt: providers.TransactionReceipt,
    isMetaTx?: boolean,
    actionName?: string
  ) => void;
  /**
   * Optional callback to invoke after the respective number of block (`waitBlocks`) were
   * mined.
   */
  onSuccess?: (receipt: providers.TransactionReceipt, payload: T) => void;
  /**
   * Optional callback to invoke if an error happened.
   */
  onError?: (error: Error) => void;
  children?: React.ReactNode;
  size?: ButtonSize;
  variant?: ButtonProps["variant"];
  className?: string;
  buttonRef?: RefObject<HTMLButtonElement>;
};
