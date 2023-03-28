import React, { useEffect } from "react";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import ConnectButton from "../../../../wallet/ConnectButton";
import { useModal } from "../../../useModal";
import { ReactComponent } from "../../../../../assets/logo.svg";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../types/exchange";
import License from "../../../../license/License";

interface Props {
  onBackClick: () => void;
  exchange: Exchange | null;
}

export function LicenseAgreementView({ onBackClick, exchange }: Props) {
  const { showModal } = useModal();
  useEffect(() => {
    showModal("REDEEM", {
      headerComponent: (
        <Grid>
          <ArrowLeft
            onClick={onBackClick}
            size={32}
            style={{ cursor: "pointer" }}
          />
          <Typography tag="h3">License Agreement</Typography>
          <ConnectButton />
        </Grid>
      ),
      footerComponent: (
        <Grid justifyContent="center" padding="1.5rem 0">
          <ReactComponent height="24px" />
        </Grid>
      )
    });
  }, []);
  if (!exchange) {
    return <p>Exchange could not be retrieved</p>;
  }
  const { offer } = exchange;
  const offerId = offer.id;

  return <License offerId={offerId} offerData={offer} />;
}
