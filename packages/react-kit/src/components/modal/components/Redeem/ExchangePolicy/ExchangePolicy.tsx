import React, { useEffect } from "react";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import { ArrowLeft } from "phosphor-react";
import { Exchange } from "../../../../../types/exchange";
import { offers } from "@bosonprotocol/core-sdk";
import ExchangePolicyDetails, {
  ExchangePolicyDetailsProps
} from "../../../../exchangePolicy/ExchangePolicyDetails";
import { useNonModalContext } from "../../../nonModal/NonModal";
import { theme } from "../../../../../theme";

const colors = theme.colors.light;
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
  const dispatch = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
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
          </Grid>
        ),
        contentStyle: {
          background: colors.white
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, exchangeName]);
  return (
    <>
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
    </>
  );
}
