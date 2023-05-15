import React, { useEffect } from "react";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import ConnectButton from "../../../../wallet/ConnectButton";
import { useModal } from "../../../useModal";
import { BosonFooter } from "../BosonFooter";
import RedeemForm from "./RedeemForm";

interface Props {
  isValid: boolean;
  onNextClick: () => void;
  onBackClick: () => void;
}

export default function RedeemFormView({
  isValid,
  onNextClick,
  onBackClick
}: Props) {
  const { showModal } = useModal();
  useEffect(() => {
    showModal("REDEEM", {
      headerComponent: (
        <Grid>
          <Typography tag="h3">Redeem your item</Typography>
          <ConnectButton showChangeWallet />
        </Grid>
      ),
      footerComponent: <BosonFooter />
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <RedeemForm
      isValid={isValid}
      onNextClick={onNextClick}
      onBackClick={onBackClick}
    />
  );
}
