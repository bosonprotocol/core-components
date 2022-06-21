import { subgraph } from "@bosonprotocol/core-sdk";
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
import { postCancelledVoucher, postRedeemedVoucher } from "../../lib/iframe";
import { getExchangeState } from "../../lib/exchanges";

const RedeemButton = styled(PrimaryButton)`
  width: 50%;

  &[disabled] {
    opacity: 0.2;
  }
`;

const CancelButton = styled(SecondaryButton)`
  width: 50%;

  &[disabled] {
    opacity: 0.2;
  }
`;

interface Props {
  exchange: subgraph.ExchangeFieldsFragment;
  reloadExchangeData: () => void;
}

export function BuyerActions({ exchange, reloadExchangeData }: Props) {
  const coreSDK = useCoreSDK();
  const [transaction, setTransaction] = useState<Transaction>({
    status: "idle"
  });

  const exchangeState = getExchangeState(exchange);
  const isCommitted = exchangeState === subgraph.ExchangeState.Committed;

  async function handleCancel() {
    try {
      setTransaction({
        status: "awaiting-confirm"
      });

      const txResponse = await coreSDK.cancelVoucher(exchange.id);

      setTransaction({
        status: "pending",
        txHash: txResponse.hash
      });

      await txResponse.wait(1);
      setTransaction({
        status: "success",
        txHash: txResponse.hash,
        message: "Successfully cancelled"
      });
      postCancelledVoucher(exchange.id);
    } catch (error) {
      setTransaction({
        status: "error",
        error: error as Error
      });
    }
  }

  async function handleRedeem() {
    try {
      setTransaction({
        status: "awaiting-confirm"
      });

      const txResponse = await coreSDK.redeemVoucher(exchange.id);

      setTransaction({
        status: "pending",
        txHash: txResponse.hash
      });

      await txResponse.wait(1);
      setTransaction({
        status: "success",
        txHash: txResponse.hash,
        message: "Successfully redeemed"
      });
      postRedeemedVoucher(exchange.id);
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
        <CancelButton disabled={!isCommitted} onClick={handleCancel}>
          Cancel
        </CancelButton>
        <RedeemButton disabled={!isCommitted} onClick={handleRedeem}>
          Redeem
        </RedeemButton>
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
