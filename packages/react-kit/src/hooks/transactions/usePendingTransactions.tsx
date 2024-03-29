import { CoreSDK, subgraph } from "@bosonprotocol/core-sdk";
import { useCallback } from "react";
import create from "zustand";
import { EventLog } from "../../types/transactions";
import { useAccount } from "../connection/connection";

type PendingTransaction = Omit<EventLog, "__typename" | "account"> & {
  accountType: "Buyer" | "Seller" | string;
  isMetaTx?: boolean;
  offerId?: string;
  newHash?: string; // only exists on meta transactions after first reconcile
};

type PendingTransactionsState = {
  transactions: PendingTransaction[];
  didInitiallyReconcile: boolean;
  isLoading: boolean;
  resetInitialReconcile: () => void;
  addPendingTransaction: (pendingTx: PendingTransaction) => void;
  removePendingTransaction: (
    key: keyof PendingTransaction,
    value: string
  ) => void;
  reconcilePendingTransactions: (coreSDK: CoreSDK) => Promise<void>;
};

export function createPendingTx(
  args: Omit<PendingTransaction, "id" | "timestamp" | "account">
): PendingTransaction {
  return {
    ...args,

    id: Date.now().toString(),
    timestamp: Math.floor(Date.now() / 1000).toString()
  };
}
type Props = {
  enabled: boolean;
};

export function useAddPendingTransaction(
  { enabled }: Props = { enabled: true }
) {
  const { address } = useAccount();
  const result = usePendingTransactionsStore({ enabled })?.();
  const addPendingTransaction = result?.addPendingTransaction;

  const addPendingTx = useCallback(
    (
      args: Omit<
        Parameters<typeof createPendingTx>[0],
        "executedBy" | "accountId"
      >
    ) => {
      if (address) {
        addPendingTransaction?.(
          createPendingTx({
            executedBy: address,
            ...args
          })
        );
      }
    },
    [address, addPendingTransaction]
  );

  return addPendingTx;
}

export function useRemovePendingTransaction(
  { enabled }: Props = { enabled: true }
) {
  const result = usePendingTransactionsStore({ enabled })?.();
  const removePendingTransaction = result?.removePendingTransaction;

  const removePendingTx = useCallback(
    (key: keyof PendingTransaction, value: string) => {
      removePendingTransaction?.(key, value);
    },
    [removePendingTransaction]
  );

  return removePendingTx;
}

export const usePendingTransactionsStore = (
  { enabled }: Props = { enabled: true }
) => {
  if (enabled) {
    return create<PendingTransactionsState>((set, get) => ({
      transactions: [],
      didInitiallyReconcile: false,
      isLoading: false,
      resetInitialReconcile: () =>
        set((state) => ({ ...state, didInitiallyReconcile: false })),
      addPendingTransaction: (pendingTx: PendingTransaction) =>
        set((state) => ({
          ...state,
          transactions: [pendingTx, ...state.transactions]
        })),
      removePendingTransaction: (
        key: keyof PendingTransaction,
        value: string
      ) =>
        set((state) => ({
          ...state,
          transactions: [
            ...state.transactions.filter((tx) => tx?.[key] !== value)
          ]
        })),
      reconcilePendingTransactions: async (coreSDK: CoreSDK) => {
        set((state) => ({
          ...state,
          isLoading: true
        }));

        const commitTransactions = get().transactions.filter(
          (tx) => tx.type === subgraph.EventType.BUYER_COMMITTED
        );
        const pendingTransactions = get().transactions.filter(
          (tx) => !tx.isMetaTx && tx.type !== subgraph.EventType.BUYER_COMMITTED
        );
        const pendingMetaTransactions = get().transactions.filter(
          (tx) => tx.isMetaTx && tx.type !== subgraph.EventType.BUYER_COMMITTED
        );

        const [
          reconciledPendingTransactions,
          reconciledPendingMetaTransactions
        ] = await Promise.all([
          getReconciledPendingTransactions(coreSDK, pendingTransactions),
          getReconciledPendingMetaTransactions(coreSDK, pendingMetaTransactions)
        ]);

        set((state) => ({
          ...state,
          didInitiallyReconcile: true,
          isLoading: false,
          transactions: [
            ...commitTransactions,
            ...reconciledPendingTransactions,
            ...reconciledPendingMetaTransactions
          ].sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
        }));
      }
    }));
  }
  return null;
};

async function getReconciledPendingTransactions(
  coreSDK: CoreSDK,
  pendingTransactions: PendingTransaction[]
) {
  try {
    const logs = await coreSDK.getEventLogs({
      logsFilter: {
        hash_in: pendingTransactions.map((tx) => tx.hash)
      }
    });
    const completedTxHashes = new Set(logs.map((log) => log.hash));
    return pendingTransactions.filter((tx) => !completedTxHashes.has(tx.hash));
  } catch (error) {
    console.error(error);
    return pendingTransactions;
  }
}

async function getReconciledPendingMetaTransactions(
  coreSDK: CoreSDK,
  pendingTransactions: PendingTransaction[]
) {
  try {
    const resubmittedMetaTxResults = await Promise.all(
      pendingTransactions.map((metaTx) =>
        coreSDK.getResubmittedMetaTx(metaTx.hash)
      )
    );
    const pendingMetaTxHashes = new Set(
      resubmittedMetaTxResults
        .filter((result) => result.newStatus === "PENDING")
        .map((result) => result.oldHash)
    );
    return pendingTransactions
      .filter((tx) => pendingMetaTxHashes.has(tx.hash))
      .map((tx) => {
        const resubmittedResult = resubmittedMetaTxResults.find(
          (result) => result.oldHash === tx.hash
        );
        if (resubmittedResult) {
          return {
            ...tx,
            newHash: resubmittedResult.newHash
          };
        }
        return tx;
      });
  } catch (error) {
    console.error(error);
    return pendingTransactions;
  }
}
