import { ErrorModal } from "./ErrorModal";
import { SuccessModal } from "./SuccessModal";
import { TransactionPendingModal } from "./TransactionPendingModal";

export type Transaction =
  | {
      status: "idle";
    }
  | {
      status: "awaiting-confirm";
    }
  | {
      status: "pending";
      txHash: string;
    }
  | {
      status: "error";
      error: Error;
    }
  | {
      status: "success";
      txHash: string;
      message?: string;
      dataToPreview?: {
        label: string;
        value: string;
      };
    };

type Props = {
  transaction: Transaction;
  onClose: () => void;
};

export function TransactionModal({ transaction, onClose }: Props) {
  if (transaction.status === "awaiting-confirm") {
    return <TransactionPendingModal status={transaction.status} />;
  }

  if (transaction.status === "pending") {
    return (
      <TransactionPendingModal
        status={transaction.status}
        txHash={transaction.txHash}
      />
    );
  }

  if (transaction.status === "error") {
    return <ErrorModal message={transaction.error.message} onClose={onClose} />;
  }

  if (transaction.status === "success") {
    return (
      <SuccessModal
        txHash={transaction.txHash}
        dataToPreview={transaction.dataToPreview}
        message={transaction.message}
        onClose={onClose}
      />
    );
  }

  return null;
}
