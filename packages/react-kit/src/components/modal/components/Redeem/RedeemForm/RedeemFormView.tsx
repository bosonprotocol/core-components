import React, { useEffect } from "react";
import RedeemForm from "./RedeemForm";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { Exchange } from "../../../../../types/exchange";
import { getCssVar } from "../../../../../theme";
import { useAccount } from "../../../../../hooks/connection/connection";
import { RedeemHeader } from "../RedeemHeader";
import { BosonLogo } from "../../common/BosonLogo";

interface Props {
  exchange: Exchange | null;
  isValid: boolean;
  onNextClick: () => void;
  onBackClick: () => void;
  setConnectedWalletAddress: () => void;
  showBosonLogoInFooter: boolean;
}

export default function RedeemFormView({
  exchange,
  isValid,
  onNextClick,
  onBackClick,
  setConnectedWalletAddress,
  showBosonLogoInFooter
}: Props) {
  const { address } = useAccount();
  const { dispatch } = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        onArrowLeftClick: null,
        headerComponent: RedeemHeader,
        contentStyle: {
          background: getCssVar("--background-accent-color")
        },
        footerComponent: showBosonLogoInFooter ? <BosonLogo /> : null
      }
    });
  }, [dispatch, showBosonLogoInFooter]);
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
          offer={exchange.offer}
          isValid={isValid}
          onNextClick={onNextClick}
          onBackClick={onBackClick}
          setConnectedWalletAddress={setConnectedWalletAddress}
        />
      )}
    </>
  );
}
