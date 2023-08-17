import { useAccount } from "wagmi";
import React from "react";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import ConnectButton from "../../../../wallet/ConnectButton";
import { BosonFooter } from "../BosonFooter";
import RedeemForm from "./RedeemForm";
import NonModal, { NonModalProps } from "../../../NonModal";
import { Exchange } from "../../../../../types/exchange";

interface Props {
  exchange: Exchange | null;
  isValid: boolean;
  onNextClick: () => void;
  onBackClick: () => void;
  nonModalProps: Partial<NonModalProps>;
}

export default function RedeemFormView({
  exchange,
  isValid,
  onNextClick,
  onBackClick,
  nonModalProps
}: Props) {
  const { address } = useAccount();
  return (
    <NonModal
      props={{
        ...nonModalProps,
        headerComponent: (
          <Grid>
            <Typography tag="h3">Redeem your item</Typography>
            <ConnectButton showChangeWallet />
          </Grid>
        ),
        footerComponent: <BosonFooter />
      }}
    >
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
    </NonModal>
  );
}
