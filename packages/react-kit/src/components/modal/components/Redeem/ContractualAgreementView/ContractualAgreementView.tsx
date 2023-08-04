import React from "react";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import ConnectButton from "../../../../wallet/ConnectButton";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../types/exchange";
import ContractualAgreement from "../../../../contractualAgreement/ContractualAgreement";
import { BosonFooter } from "../BosonFooter";
import NonModal from "../../../NonModal";

interface Props {
  onBackClick: () => void;
  exchange: Exchange | null;
}

export function ContractualAgreementView({ onBackClick, exchange }: Props) {
  if (!exchange) {
    return <p>Exchange could not be retrieved</p>;
  }
  const { offer } = exchange;
  const offerId = offer.id;

  return (
    <NonModal
      props={{
        headerComponent: (
          <Grid>
            <ArrowLeft
              onClick={onBackClick}
              size={32}
              style={{ cursor: "pointer" }}
            />
            <Typography tag="h3">Contractual Agreement</Typography>
            <ConnectButton showChangeWallet />
          </Grid>
        ),
        footerComponent: <BosonFooter />
      }}
    >
      <ContractualAgreement offerId={offerId} offerData={offer} />
    </NonModal>
  );
}
