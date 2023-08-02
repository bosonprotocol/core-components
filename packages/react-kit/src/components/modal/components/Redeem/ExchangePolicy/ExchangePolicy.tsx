import React, { useEffect } from "react";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import ConnectButton from "../../../../wallet/ConnectButton";
import { useModal } from "../../../useModal";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../types/exchange";
import { BosonFooter } from "../BosonFooter";
import { offers } from "@bosonprotocol/core-sdk";
import ExchangePolicyDetails, {
  ExchangePolicyDetailsProps
} from "../../../../exchangePolicy/ExchangePolicyDetails";

interface Props {
  onBackClick: () => void;
  exchange: Exchange | null;
  fairExchangePolicyRules: string;
  defaultDisputeResolverId: string;
  onContractualAgreementClick: ExchangePolicyDetailsProps["onContractualAgreementClick"];
  onLicenseAgreementClick: ExchangePolicyDetailsProps["onLicenseAgreementClick"];
  exchangePolicyCheckResult?: offers.CheckExchangePolicyResult;
}

export function ExchangePolicy({
  onBackClick,
  exchange,
  fairExchangePolicyRules,
  defaultDisputeResolverId,
  onContractualAgreementClick,
  onLicenseAgreementClick,
  exchangePolicyCheckResult
}: Props) {
  const { showModal } = useModal();
  const exchangeName = exchange?.offer.metadata.name || "";
  useEffect(() => {
    showModal("REDEEM", {
      fairExchangePolicyRules,
      defaultDisputeResolverId,
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
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchangeName]);
  if (!exchange) {
    return <p>Exchange could not be retrieved</p>;
  }
  return (
    <ExchangePolicyDetails
      exchange={exchange}
      exchangePolicyCheckResult={exchangePolicyCheckResult}
      onContractualAgreementClick={onContractualAgreementClick}
      onLicenseAgreementClick={onLicenseAgreementClick}
    />
  );
}
