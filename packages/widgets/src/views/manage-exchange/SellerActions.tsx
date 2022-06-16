import { subgraph } from "@bosonprotocol/core-sdk";
import { useState } from "react";

import {
  TransactionModal,
  Transaction
} from "../../lib/components/modals/TransactionModal";
import { useCoreSDK } from "../../lib/useCoreSDK";
import {
  Actions,
  PrimaryButton,
  SecondaryButton
} from "../../lib/components/actions/shared-styles";

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

  return (
    <>
      <Actions>
        {isCommitted && (
          <SecondaryButton
            onClick={() => {
              console.log("revoke voucher"); // TODO: implement
            }}
          >
            Revoke
          </SecondaryButton>
        )}
        <PrimaryButton
          onClick={() => {
            console.log("withdraw voucher"); // TODO: implement
          }}
        >
          Withdraw
        </PrimaryButton>
      </Actions>
      <TransactionModal
        transaction={transaction}
        onClose={() => setTransaction({ status: "idle" })}
      />
    </>
  );
}
