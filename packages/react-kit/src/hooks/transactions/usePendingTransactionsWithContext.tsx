import { useConfigContext } from "../../components/config/ConfigContext";
import {
  useAddPendingTransaction,
  usePendingTransactionsStore
} from "./usePendingTransactions";

export function useAddPendingTransactionWithContext() {
  const { usePendingTransactions } = useConfigContext();
  const addPendingTransaction = useAddPendingTransaction({
    enabled: !!usePendingTransactions
  });
  return addPendingTransaction;
}

export function useRemovePendingTransactionWithContext() {
  const { usePendingTransactions } = useConfigContext();

  const removePendingTransaction = usePendingTransactionsStore({
    enabled: !!usePendingTransactions
  });

  return removePendingTransaction;
}
