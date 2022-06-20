import { subgraph } from "@bosonprotocol/core-sdk";
import { useState } from "react";

import {
  TransactionModal,
  Transaction
} from "../../lib/components/modals/TransactionModal";
import {
  Actions,
  PrimaryButton,
  SecondaryButton
} from "../../lib/components/actions/shared-styles";
import { useCoreSDK } from "../../lib/useCoreSDK";
import { postRevokedVoucher } from "../../lib/iframe";

interface Props {
  exchange: subgraph.ExchangeFieldsFragment;
  reloadExchangeData: () => void;
}

export function SellerActions({ exchange, reloadExchangeData }: Props) {
  const coreSDK = useCoreSDK();
  const [transaction, setTransaction] = useState<Transaction>({
    status: "idle"
  });

  const isCommitted = exchange.state === subgraph.ExchangeState.Committed;

  async function handleRevoke() {
    try {
      setTransaction({
        status: "awaiting-confirm"
      });

      const txResponse = await coreSDK.revokeVoucher(exchange.id);

      setTransaction({
        status: "pending",
        txHash: txResponse.hash
      });

      await txResponse.wait(1);
      setTransaction({
        status: "success",
        txHash: txResponse.hash,
        message: "Successfully revoked"
      });
      postRevokedVoucher(exchange.id);
    } catch (error) {
      setTransaction({
        status: "error",
        error: error as Error
      });
    }
  }

  return (
    <>
      <Actions>
        {isCommitted && (
          <SecondaryButton onClick={handleRevoke}>Revoke</SecondaryButton>
        )}
        <PrimaryButton
          disabled // TODO: implement
        >
          Withdraw
        </PrimaryButton>
      </Actions>
      <TransactionModal
        transaction={transaction}
        onClose={() => {
          setTransaction({ status: "idle" });
          reloadExchangeData();
        }}
      />
    </>
  );
}
