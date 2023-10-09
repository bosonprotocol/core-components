import React from "react";
import Grid from "../../../../../ui/Grid";
import Typography from "../../../../../ui/Typography";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../../types/exchange";
import { ExchangeFullDescription } from "./ExchangeFullDescription";
import { useNonModalContext } from "../../../../NonModal";

interface Props {
  onBackClick: () => void;
  exchange: Exchange | null;
}

export function ExchangeFullDescriptionView({ onBackClick, exchange }: Props) {
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
          <Typography tag="h3">
            {exchange?.offer.metadata.name || ""}
          </Typography>
        </Grid>
      )
    }
  });
  return (
    <>
      {!exchange ? (
        <p>Exchange could not be retrieved</p>
      ) : (
        <ExchangeFullDescription exchange={exchange} />
      )}
    </>
  );
}
