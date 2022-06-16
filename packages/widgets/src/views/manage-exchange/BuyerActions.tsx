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
  const [transaction, setTransaction] = useState<Transaction>({
    status: "idle"
  });

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
