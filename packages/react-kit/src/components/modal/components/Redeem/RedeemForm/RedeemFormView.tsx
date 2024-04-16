import React, { useEffect } from "react";
import RedeemForm from "./RedeemForm";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { Exchange } from "../../../../../types/exchange";
import { theme } from "../../../../../theme";
import { useAccount } from "../../../../../hooks/connection/connection";
import { RedeemHeader } from "../RedeemHeader";
import { BosonFooter } from "../../common/BosonFooter";

const colors = theme.colors.light;

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
  useEffect(() => {
    dispatch({
      payload: {
        headerComponent: RedeemHeader,
        contentStyle: {
          background: colors.white
        },
        footerComponent: <BosonFooter />
      }
    });
  }, [dispatch]);
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
