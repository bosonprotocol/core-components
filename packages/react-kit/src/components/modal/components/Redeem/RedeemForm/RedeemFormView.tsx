import React, { useEffect } from "react";
import RedeemForm from "./RedeemForm";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { Exchange } from "../../../../../types/exchange";
import { theme } from "../../../../../theme";
import { useAccount } from "../../../../../hooks/connection/connection";
import { RedeemHeader } from "../RedeemHeader";
import { BosonLogo } from "../../common/BosonLogo";

const colors = theme.colors.light;

interface Props {
  exchange: Exchange | null;
  isValid: boolean;
  onNextClick: () => void;
  onBackClick: () => void;
  setConnectedWalletAddress: () => void;
}

export default function RedeemFormView({
  exchange,
  isValid,
  onNextClick,
  onBackClick,
  setConnectedWalletAddress
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
        footerComponent: <BosonLogo />
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
          exchange={exchange}
          isValid={isValid}
          onNextClick={onNextClick}
          onBackClick={onBackClick}
          setConnectedWalletAddress={setConnectedWalletAddress}
        />
      )}
    </>
  );
}
