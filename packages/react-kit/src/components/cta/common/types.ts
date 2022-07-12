import { providers } from "ethers";
import { CoreSdkConfig } from "../../../hooks/useCoreSdk";
import { ButtonSize } from "../../buttons/Button";

export type CtaButtonProps<T> = CoreSdkConfig & {
  metaTransactionsApiKey?: string;
  disabled?: boolean;
  waitBlocks?: number;
  extraInfo?: string;
  onPendingSignature: () => void;
  onPendingTransaction: (txHash: string) => void;
  onSuccess: (receipt: providers.TransactionReceipt, payload: T) => void;
  onError: (error: Error) => void;
  children?: React.ReactNode;
  size?: ButtonSize;
  className?: string;
};
