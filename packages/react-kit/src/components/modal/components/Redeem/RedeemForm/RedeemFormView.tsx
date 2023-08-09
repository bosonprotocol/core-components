import React from "react";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import ConnectButton from "../../../../wallet/ConnectButton";
import { BosonFooter } from "../BosonFooter";
import RedeemForm from "./RedeemForm";
import NonModal, { NonModalProps } from "../../../NonModal";

interface Props {
  isValid: boolean;
  onNextClick: () => void;
  onBackClick: () => void;
  nonModalProps: Partial<NonModalProps>;
}

export default function RedeemFormView({
  isValid,
  onNextClick,
  onBackClick,
  nonModalProps
}: Props) {
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
      <RedeemForm
        isValid={isValid}
        onNextClick={onNextClick}
        onBackClick={onBackClick}
      />
    </NonModal>
  );
}
