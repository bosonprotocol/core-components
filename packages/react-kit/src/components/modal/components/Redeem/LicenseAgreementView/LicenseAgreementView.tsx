import React from "react";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../types/exchange";
import License from "../../../../license/License";
import { useNonModalContext } from "../../../NonModal";

interface Props {
  onBackClick: () => void;
  exchange: Exchange | null;
}

export function LicenseAgreementView({ onBackClick, exchange }: Props) {
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
          <Typography tag="h3">License Agreement</Typography>
        </Grid>
      )
    }
  });
  return (
    <>
      {exchange ? (
        <License offerId={exchange.offer?.id} offerData={exchange.offer} />
      ) : (
        <p>Exchange could not be retrieved</p>
      )}
    </>
  );
}
