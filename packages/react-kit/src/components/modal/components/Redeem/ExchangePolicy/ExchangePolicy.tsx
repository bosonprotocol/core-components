import React, { useEffect } from "react";
import FairExchangePolicy, {
  FairExchangePolicyProps
} from "../../../../exchangePolicy/FairExchangePolicy";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import ConnectButton from "../../../../wallet/ConnectButton";
import { useModal } from "../../../useModal";
import { ReactComponent } from "../../../../../assets/logo.svg";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../types/exchange";
import { BosonFooter } from "../BosonFooter";

interface Props {
  onBackClick: () => void;
  exchange: Exchange | null;
  onContractualAgreementClick: FairExchangePolicyProps["onContractualAgreementClick"];
  onLicenseAgreementClick: FairExchangePolicyProps["onLicenseAgreementClick"];
}

export function ExchangePolicy({
  onBackClick,
  exchange,
  onContractualAgreementClick,
  onLicenseAgreementClick
}: Props) {
  const { showModal } = useModal();
  const exchangeName = exchange?.offer.metadata.name || "";
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
            {exchangeName}
          </Typography>
          <ConnectButton showChangeWallet />
        </Grid>
      ),
      footerComponent: <BosonFooter />
    });
  }, [exchangeName]);
  if (!exchange) {
    return <p>Exchange could not be retrieved</p>;
  }
  return (
    <FairExchangePolicy
      exchange={exchange}
      onContractualAgreementClick={onContractualAgreementClick}
      onLicenseAgreementClick={onLicenseAgreementClick}
    />
  );
}
