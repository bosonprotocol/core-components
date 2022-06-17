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
import { ExchangeState } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";

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

function isRedeemDisabled(
  offer: subgraph.OfferFieldsFragment,
  exchange: subgraph.ExchangeFieldsFragment
) {
  const exchangeStatus = exchange.state;

  const isRedeemable =
    exchangeStatus === ExchangeState.Committed &&
    Number(offer.voucherRedeemableFromDate) * 1000 < Date.now();

  return !isRedeemable;
}

interface Props {
  offer: subgraph.OfferFieldsFragment;
  exchange: subgraph.ExchangeFieldsFragment;
  reloadExchangeData: () => void;
}

export function BuyerActions({ offer, exchange, reloadExchangeData }: Props) {
  const [transaction, setTransaction] = useState<Transaction>({
    status: "idle"
  });

  const redeemDisabled = isRedeemDisabled(offer, exchange);

  return (
    <>
      <Actions>
        <CancelButton
          onClick={() => {
            console.log("cancel voucher"); // TODO: implement
          }}
        >
          Cancel
        </CancelButton>
        <RedeemButton
          disabled={redeemDisabled}
          onClick={() => {
            console.log("redeem voucher"); // TODO: implement
          }}
        >
          Redeem
        </RedeemButton>
      </Actions>
      <TransactionModal
        transaction={transaction}
        onClose={() => setTransaction({ status: "idle" })}
      />
    </>
  );
}
