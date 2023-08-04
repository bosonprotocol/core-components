import React from "react";
import Grid from "../../../../../ui/Grid";
import Typography from "../../../../../ui/Typography";
import ConnectButton from "../../../../../wallet/ConnectButton";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../../types/exchange";
import { BosonFooter } from "../../BosonFooter";
import { ExchangeFullDescription } from "./ExchangeFullDescription";
import NonModal from "../../../../NonModal";

interface Props {
  onBackClick: () => void;
  exchange: Exchange | null;
}

export function ExchangeFullDescriptionView({ onBackClick, exchange }: Props) {
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
            <Typography tag="h3">
              {exchange?.offer.metadata.name || ""}
            </Typography>
            <ConnectButton showChangeWallet />
          </Grid>
        ),
        footerComponent: <BosonFooter />
      }}
    >
      {!exchange ? (
        <p>Exchange could not be retrieved</p>
      ) : (
        <ExchangeFullDescription exchange={exchange} />
      )}
    </NonModal>
  );
}
