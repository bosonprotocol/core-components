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
  offer: subgraph.OfferFieldsFragment;
  exchange: subgraph.ExchangeFieldsFragment;
  reloadExchangeData: () => void;
}

export function BuyerActions({ offer, exchange, reloadExchangeData }: Props) {
  const coreSDK = useCoreSDK();
  const [transaction, setTransaction] = useState<Transaction>({
    status: "idle"
  });

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
        <CancelButton
          disabled={isCancelDisabled(exchange)}
          onClick={handleCancel}
        >
          Cancel
        </CancelButton>
        <RedeemButton
          disabled={isRedeemDisabled(exchange)}
          onClick={handleRedeem}
        >
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

function isRedeemDisabled(exchange: subgraph.ExchangeFieldsFragment) {
  const exchangeStatus = exchange.state;

  const isRedeemable =
    exchangeStatus === subgraph.ExchangeState.Committed &&
    Number(exchange.validUntilDate) * 1000 < Date.now();

  return !isRedeemable;
}

function isCancelDisabled(exchange: subgraph.ExchangeFieldsFragment) {
  return exchange.state !== subgraph.ExchangeState.Committed;
}
