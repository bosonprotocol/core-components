import { providers } from "ethers";
import { CoreSdkConfig } from "../../../hooks/useCoreSdk";
import { ButtonSize } from "../../buttons/Button";

export type CtaButtonProps<T> = CoreSdkConfig & {
  /**
   * Optional Biconomy meta transactions API key. If set, then meta transactions will be
   * enabled.
   */
  metaTransactionsApiKey?: string;
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
  onPendingSignature?: () => void;
  /**
   * Optional callback to invoke after user signed the transaction and before the respective
   * number of blocks (`waitBlock`) were mined.
   */
  onPendingTransaction?: (txHash: string) => void;
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
  className?: string;
};
