import { ArrowLeft } from "phosphor-react";
import React from "react";
import { Exchange } from "../../../../../../types/exchange";
import Grid from "../../../../../ui/Grid";
import Typography from "../../../../../ui/Typography";
import ConnectButton from "../../../../../wallet/ConnectButton";
import { BosonFooter } from "../../BosonFooter";
import { CancelExchange, CancelExchangeProps } from "./CancelExchange";
import NonModal from "../../../../NonModal";

export interface CancellationViewProps {
  exchange: Exchange | null;
  onBackClick: CancelExchangeProps["onBackClick"];
  onSuccess: CancelExchangeProps["onSuccess"];
}

export const CancellationView: React.FC<CancellationViewProps> = ({
  exchange,
  onBackClick
}) => {
  return (
    <NonModal
      props={{
        headerComponent: (
          <Grid gap="1rem">
            <ArrowLeft
              onClick={onBackClick}
              size={32}
              style={{ cursor: "pointer", flexShrink: 0 }}
            />
            <Typography tag="h3" style={{ flex: "1 1" }}>
              Cancel exchange
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
        <CancelExchange
          exchange={exchange}
          onBackClick={onBackClick}
          onSuccess={onBackClick}
        />
      )}
    </NonModal>
  );
};
