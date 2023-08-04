import React from "react";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import ConnectButton from "../../../../wallet/ConnectButton";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../types/exchange";
import { BosonFooter } from "../BosonFooter";
import { offers } from "@bosonprotocol/core-sdk";
import ExchangePolicyDetails, {
  ExchangePolicyDetailsProps
} from "../../../../exchangePolicy/ExchangePolicyDetails";
import NonModal from "../../../NonModal";

interface Props {
  onBackClick: () => void;
  exchange: Exchange | null;
  onContractualAgreementClick: ExchangePolicyDetailsProps["onContractualAgreementClick"];
  onLicenseAgreementClick: ExchangePolicyDetailsProps["onLicenseAgreementClick"];
  exchangePolicyCheckResult?: offers.CheckExchangePolicyResult;
}

export function ExchangePolicy({
  onBackClick,
  exchange,
  onContractualAgreementClick,
  onLicenseAgreementClick,
  exchangePolicyCheckResult
}: Props) {
  const exchangeName = exchange?.offer.metadata.name || "";
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
              {exchangeName}
            </Typography>
            <ConnectButton showChangeWallet />
          </Grid>
        ),
        footerComponent: <BosonFooter />
      }}
    >
      {exchange ? (
        <ExchangePolicyDetails
          exchange={exchange}
          exchangePolicyCheckResult={exchangePolicyCheckResult}
          onContractualAgreementClick={onContractualAgreementClick}
          onLicenseAgreementClick={onLicenseAgreementClick}
        />
      ) : (
        <p>Exchange could not be retrieved</p>
      )}
    </NonModal>
  );
}
