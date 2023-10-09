import { useAccount } from "hooks/connection/connection";
import React from "react";
import Typography from "../../../../ui/Typography";
import RedeemForm from "./RedeemForm";
import { useNonModalContext } from "../../../NonModal";
import { Exchange } from "../../../../../types/exchange";

interface Props {
  exchange: Exchange | null;
  isValid: boolean;
  onNextClick: () => void;
  onBackClick: () => void;
}

export default function RedeemFormView({
  exchange,
  isValid,
  onNextClick,
  onBackClick
}: Props) {
  const { address } = useAccount();
  const dispatch = useNonModalContext();
  dispatch({
    payload: {
      headerComponent: <Typography tag="h3">Redeem your item</Typography>
    }
  });
  return (
    <>
      {!exchange ? (
        <p>Exchange could not be retrieved.</p>
      ) : exchange.buyer?.wallet?.toLowerCase() !== address?.toLowerCase() ? (
        <p>You do not own this exchange.</p>
      ) : exchange.state !== "COMMITTED" ? (
        <p>Invalid exchange state.</p>
      ) : (
        <RedeemForm
          isValid={isValid}
          onNextClick={onNextClick}
          onBackClick={onBackClick}
        />
      )}
    </>
  );
}
