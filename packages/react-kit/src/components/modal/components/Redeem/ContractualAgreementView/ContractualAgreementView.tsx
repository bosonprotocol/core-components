import React from "react";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../types/exchange";
import ContractualAgreement from "../../../../contractualAgreement/ContractualAgreement";
import { useNonModalContext } from "../../../NonModal";

interface Props {
  onBackClick: () => void;
  exchange: Exchange | null;
}

export function ContractualAgreementView({ onBackClick, exchange }: Props) {
  const offer = exchange?.offer;
  const offerId = offer?.id;
  const dispatch = useNonModalContext();
  dispatch({
    payload: {
      headerComponent: (
        <Grid>
          <ArrowLeft
            onClick={onBackClick}
            size={32}
            style={{ cursor: "pointer" }}
          />
          <Typography tag="h3">Contractual Agreement</Typography>
        </Grid>
      )
    }
  });
  return (
    <>
      {exchange ? (
        <ContractualAgreement offerId={offerId} offerData={offer} />
      ) : (
        <p>Exchange could not be retrieved</p>
      )}
    </>
  );
}
