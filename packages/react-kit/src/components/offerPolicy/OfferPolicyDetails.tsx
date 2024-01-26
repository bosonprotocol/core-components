import React from "react";
import styled from "styled-components";
import { theme } from "../../theme";
import { Grid } from "../ui/Grid";
import ThemedButton from "../ui/ThemedButton";
import { Typography } from "../ui/Typography";
import { offers, subgraph } from "@bosonprotocol/core-sdk";
import {
  ArrowSquareOut,
  CircleWavyQuestion,
  WarningCircle
} from "phosphor-react";
import DetailTable from "../modal/components/common/detail/DetailTable";
import useCheckExchangePolicy from "../../hooks/useCheckExchangePolicy";
import { useConfigContext } from "../config/ConfigContext";

const colors = theme.colors.light;
const NoPaddingButton = styled(ThemedButton)`
  padding: 0 !important;
  border-color: transparent !important;
`;

export interface OfferPolicyDetailsProps {
  offer: subgraph.OfferFieldsFragment;
  onContractualAgreementClick: () => void;
  onLicenseAgreementClick: () => void;
}

export default function OfferPolicyDetails({
  offer: offerData,
  onContractualAgreementClick,
  onLicenseAgreementClick
}: OfferPolicyDetailsProps) {
  const config = useConfigContext();

  const exchangePolicyCheckResult = useCheckExchangePolicy({
    offerId: offerData.id,
    defaultDisputeResolverId:
      config.config.defaultDisputeResolverId || "unknown",
    defaultTokens: config.config.defaultTokens ?? [], // TODO: check default tokens list
    fairExchangePolicyRules: config.fairExchangePolicyRules
  });
  const isExchangePolicyValid =
    exchangePolicyCheckResult &&
    (exchangePolicyCheckResult.isValid ||
      !exchangePolicyCheckResult.errors.find(
        (error) => error.path === "metadata.exchangePolicy.template"
      ));

  const exchangePolicy = {
    name: (
      (offerData?.metadata as subgraph.ProductV1MetadataEntity)?.exchangePolicy
        ?.label || "unspecified"
    ).replace("fairExchangePolicy", "Fair Exchange Policy"),
    version: (offerData?.metadata as subgraph.ProductV1MetadataEntity)
      ?.exchangePolicy?.version
      ? "v" +
        (
          offerData?.metadata as subgraph.ProductV1MetadataEntity
        )?.exchangePolicy?.version?.toString()
      : "",
    disputePeriod: offerData?.disputePeriodDuration
      ? parseInt(offerData?.disputePeriodDuration) / (3600 * 24)
      : "unspecified",
    escalationPeriod: offerData?.resolutionPeriodDuration
      ? parseInt(offerData?.resolutionPeriodDuration) / (3600 * 24)
      : "unspecified",
    returnPeriod:
      (offerData?.metadata as subgraph.ProductV1MetadataEntity)?.shipping
        ?.returnPeriodInDays || "unspecified",
    contractualAgreement: {
      title: isExchangePolicyValid ? (
        "Commerce Agreement"
      ) : (
        <>
          <WarningCircle size={20}></WarningCircle>
          <span style={{ margin: "0 0 0 0.2rem" }}>{"Commerce Agreement"}</span>
        </>
      ),
      version: isExchangePolicyValid ? "v1" : "(Non-standard)",
      color: isExchangePolicyValid ? undefined : colors.accent
    },
    rNFTLicense: {
      title: "License Agreement",
      version: "v1"
    }
  };
  const period = (
    periodValue: string | number,
    path: string,
    exchangePolicyCheckResult?: offers.CheckExchangePolicyResult
  ) => {
    const isValid =
      exchangePolicyCheckResult &&
      (exchangePolicyCheckResult.isValid ||
        !exchangePolicyCheckResult.errors.find((error) => error.path === path));
    return exchangePolicyCheckResult ? (
      isValid ? (
        <Typography tag="p" style={{ textAlign: "right" }}>
          {periodValue}
          {" days"}
        </Typography>
      ) : (
        <Typography
          tag="p"
          color={colors.orange}
          style={{ textAlign: "right" }}
        >
          <WarningCircle size={20}></WarningCircle>
          {" " + periodValue + " days"}
        </Typography>
      )
    ) : (
      <Typography tag="p" color={colors.accent} style={{ textAlign: "right" }}>
        <CircleWavyQuestion size={20}></CircleWavyQuestion> Unknown
      </Typography>
    );
  };

  return (
    <>
      <Typography tag="h3" data-title fontSize="1.5rem" marginTop="0">
        Exchange Policy
      </Typography>
      <Typography
        fontSize="1.25rem"
        color={colors.darkGrey}
        margin="0 0 2rem 0"
      >
        Boson Exchange Policies combine protocol variables and the underlying
        contractual agreement of an exchange into a standardized policy,
        ensuring fair terms and protection for both buyer and seller.
      </Typography>
      <DetailTable
        align
        data={[
          {
            name: "Policy name",
            info: undefined,
            value: (
              <Typography tag="p" style={{ textAlign: "right" }}>
                {exchangePolicy.name} {exchangePolicy.version}
              </Typography>
            )
          },
          {
            name: "Dispute Period",
            info: undefined,
            value: period(
              exchangePolicy.disputePeriod,
              "disputePeriodDuration",
              exchangePolicyCheckResult
            )
          },
          {
            name: "Escalation Period",
            info: undefined,
            value: period(
              exchangePolicy.escalationPeriod,
              "resolutionPeriodDuration",
              exchangePolicyCheckResult
            )
          },
          {
            name: "Return Period",
            info: undefined,
            value: period(
              exchangePolicy.returnPeriod,
              "metadata.shipping.returnPeriodInDays",
              exchangePolicyCheckResult
            )
          },
          {
            name: "Redeemable NFT Terms",
            value: (
              <Grid justifyContent="flex-start" style={{ textAlign: "right" }}>
                <NoPaddingButton
                  themeVal="blankOutline"
                  onClick={() => onLicenseAgreementClick()}
                  className="no-padding"
                >
                  <p>
                    {exchangePolicy.rNFTLicense.title}{" "}
                    {exchangePolicy.rNFTLicense.version}{" "}
                  </p>
                  <ArrowSquareOut size={20} style={{ cursor: "pointer" }} />
                </NoPaddingButton>
              </Grid>
            )
          },
          {
            name: "Buyer & Seller Agreement",
            value: (
              <Grid justifyContent="flex-start">
                <NoPaddingButton
                  themeVal="blankOutline"
                  onClick={() => onContractualAgreementClick()}
                  className="no-padding"
                  style={{
                    color: exchangePolicy.contractualAgreement.color
                  }}
                >
                  {exchangePolicy.contractualAgreement.title}{" "}
                  {exchangePolicy.contractualAgreement.version}{" "}
                  <ArrowSquareOut
                    size={20}
                    style={{ cursor: "pointer" }}
                    color={exchangePolicy.contractualAgreement.color}
                  />
                </NoPaddingButton>
              </Grid>
            )
          }
        ]}
        inheritColor={false}
      />
    </>
  );
}
