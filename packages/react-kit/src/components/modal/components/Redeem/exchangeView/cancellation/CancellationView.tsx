import { ArrowLeft } from "phosphor-react";
import React, { useEffect } from "react";
import { Exchange } from "../../../../../../types/exchange";
import Grid from "../../../../../ui/Grid";
import Typography from "../../../../../ui/Typography";
import ConnectButton from "../../../../../wallet/ConnectButton";
import { useModal } from "../../../../useModal";
import { BosonFooter } from "../../BosonFooter";
import { CancelExchange, CancelExchangeProps } from "./CancelExchange";

export interface CancellationViewProps {
  exchange: Exchange | null;
  onBackClick: CancelExchangeProps["onBackClick"];
  onSuccess: CancelExchangeProps["onSuccess"];
}

export const CancellationView: React.FC<CancellationViewProps> = ({
  exchange,
  onBackClick
}) => {
  const { showModal } = useModal();
  useEffect(() => {
    showModal("REDEEM", {
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
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!exchange) {
    return <p>Exchange could not be retrieved</p>;
  }

  return (
    <CancelExchange
      exchange={exchange}
      onBackClick={onBackClick}
      onSuccess={onBackClick}
    />
  );
};
