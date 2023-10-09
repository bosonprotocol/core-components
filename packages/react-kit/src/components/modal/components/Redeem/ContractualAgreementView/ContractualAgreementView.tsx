import React from "react";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import ConnectButton from "../../../../wallet/ConnectButton";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../types/exchange";
import ContractualAgreement from "../../../../contractualAgreement/ContractualAgreement";
import { BosonFooter } from "../BosonFooter";
import NonModal, { NonModalProps } from "../../../NonModal";

interface Props {
  onBackClick: () => void;
  exchange: Exchange | null;
  nonModalProps: Partial<NonModalProps>;
}

export function ContractualAgreementView({
  onBackClick,
  exchange,
  nonModalProps
}: Props) {
  const offer = exchange?.offer;
  const offerId = offer?.id;

  return (
    <NonModal
      props={{
        ...nonModalProps,
        headerComponent: (
          <Grid>
            <ArrowLeft
              onClick={onBackClick}
              size={32}
              style={{ cursor: "pointer" }}
            />
            <Typography tag="h3">Contractual Agreement</Typography>
          </Grid>
        ),
        footerComponent: <BosonFooter />
      }}
    >
      {exchange ? (
        <ContractualAgreement offerId={offerId} offerData={offer} />
      ) : (
        <p>Exchange could not be retrieved</p>
      )}
    </NonModal>
  );
}
