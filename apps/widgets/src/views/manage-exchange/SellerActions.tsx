import { exchanges, subgraph } from "@bosonprotocol/core-sdk";
import { useState } from "react";
import styled from "styled-components";
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

const RevokeButton = styled(SecondaryButton)`
  width: 50%;

  &[disabled] {
    opacity: 0.2;
  }
`;

const WithdrawButton = styled(PrimaryButton)`
  width: 50%;

  &[disabled] {
    opacity: 0.2;
  }
`;

interface Props {
  exchange: subgraph.ExchangeFieldsFragment;
  reloadExchangeData: () => void;
}

export function SellerActions({ exchange, reloadExchangeData }: Props) {
  const coreSDK = useCoreSDK();
  const [transaction, setTransaction] = useState<Transaction>({
    status: "idle"
  });

  const exchangeState = exchanges.getExchangeState(exchange);
  const isCommitted = exchangeState === subgraph.ExchangeState.Committed;

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
        <RevokeButton disabled={!isCommitted} onClick={handleRevoke}>
          Revoke
        </RevokeButton>
        <WithdrawButton
          disabled // TODO: implement
        >
          Withdraw
        </WithdrawButton>
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
