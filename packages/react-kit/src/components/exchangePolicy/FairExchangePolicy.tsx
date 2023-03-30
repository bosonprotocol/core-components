import React from "react";
import styled from "styled-components";
import { theme } from "../../theme";
import { Exchange } from "../../types/exchange";
import { useConfigContext } from "../config/ConfigContext";
import DetailTable from "../modal/components/Redeem/ExchangeView/detail/DetailTable";
import Grid from "../ui/Grid";
import ThemedButton from "../ui/ThemedButton";
import Typography from "../ui/Typography";

const colors = theme.colors.light;
const NoPaddingButton = styled(ThemedButton)`
  padding: 0 !important;
  border-color: transparent !important;
`;

export interface FairExchangePolicyProps {
  exchange: Exchange;
  onContractualAgreementClick: () => void;
  onLicenseAgreementClick: () => void;
}

export default function FairExchangePolicy({
  exchange,
  onContractualAgreementClick,
  onLicenseAgreementClick
}: FairExchangePolicyProps) {
  const { minimumDisputePeriodInDays, minimumDisputeResolutionPeriodDays } =
    useConfigContext();
  return (
    <>
      <Typography tag="h3" data-title $fontSize="1.5rem" marginTop="0">
        Fair exchange policy
      </Typography>
      <Typography
        $fontSize="1.25rem"
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
            value: (
              <Grid justifyContent="flex-end">
                <Typography>Fair Exchange Policy v1.0</Typography>
              </Grid>
            )
          },
          {
            name: "Dispute Period",
            value: (
              <Grid justifyContent="flex-end">
                <Typography>Min. {minimumDisputePeriodInDays} days</Typography>
              </Grid>
            )
          },
          {
            name: "Escalation Period",
            value: (
              <Grid justifyContent="flex-end">
                <Typography>
                  Min. {minimumDisputeResolutionPeriodDays} days
                </Typography>
              </Grid>
            )
          },
          {
            name: "Redeemable NFT Terms",
            value: (
              <Grid justifyContent="flex-end">
                <NoPaddingButton
                  theme="blankOutline"
                  onClick={() => onLicenseAgreementClick()}
                  className="no-padding"
                >
                  License Agreement v1
                </NoPaddingButton>
              </Grid>
            )
          },
          {
            name: "Buyer & Seller Agreement",
            value: (
              <Grid justifyContent="flex-end">
                <NoPaddingButton
                  theme="blankOutline"
                  onClick={() => onContractualAgreementClick()}
                  className="no-padding"
                >
                  Commerce Agreement v1
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
