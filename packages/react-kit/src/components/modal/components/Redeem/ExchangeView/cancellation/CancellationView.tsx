import { useAccount } from "wagmi";
import { ArrowLeft } from "phosphor-react";
import React from "react";
import { Exchange } from "../../../../../../types/exchange";
import Grid from "../../../../../ui/Grid";
import Typography from "../../../../../ui/Typography";
import ConnectButton from "../../../../../wallet/ConnectButton";
import { BosonFooter } from "../../BosonFooter";
import { CancelExchange, CancelExchangeProps } from "./CancelExchange";
import NonModal, { NonModalProps } from "../../../../NonModal";

export interface CancellationViewProps {
  exchange: Exchange | null;
  onBackClick: CancelExchangeProps["onBackClick"];
  onSuccess: CancelExchangeProps["onSuccess"];
  nonModalProps: Partial<NonModalProps>;
}

export const CancellationView: React.FC<CancellationViewProps> = ({
  exchange,
  onBackClick,
  nonModalProps
}) => {
  const { address } = useAccount();
  return (
    <NonModal
      props={{
        ...nonModalProps,
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
        <p>Exchange could not be retrieved.</p>
      ) : exchange.buyer?.wallet?.toLowerCase() !== address?.toLowerCase() ? (
        <p>You do not own this exchange.</p>
      ) : exchange.state !== "COMMITTED" ? (
        <p>Invalid exchange state.</p>
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
