import { styled } from "styled-components";
import { Grid } from "../../../../ui/Grid";
import { Typography } from "../../../../ui/Typography";
import React from "react";
import { Button } from "../../../../buttons/Button";
import { Info } from "phosphor-react";
import { useConfigContext, useExchanges } from "../../../../../hooks";
import { getOpenSeaUrl } from "../../../../../lib/opensea/getOpenSeaUrl";
import dayjs from "dayjs";
import { getDateTimestamp } from "../../../../../lib/dates/getDateTimestamp";
import { colors } from "../../../../../colors";

const Wrapper = styled(Grid)`
  background-color: ${colors.white};
  box-shadow: 0px 4.318px 40px 0px rgba(21, 30, 52, 0.1);
  padding: 1rem;
  margin: 1rem 0;
`;

const InfoWrapper = styled(Grid)`
  background-color: ${colors.greyLight};
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
`;

export type RedeemWhatsNextProps = {
  exchangeId: string;
};
export const RedeemWhatsNext = ({ exchangeId }: RedeemWhatsNextProps) => {
  const { config, dateFormat } = useConfigContext();
  const { data: exchanges } = useExchanges(
    {
      id: exchangeId
    },
    {
      enabled: true
    }
  );
  const exchange = exchanges?.[0];
  const voucherRedeemableUntilDate =
    exchange?.validUntilDate ?? exchange?.offer.voucherRedeemableUntilDate
      ? dayjs(
          getDateTimestamp(
            exchange?.validUntilDate ??
              exchange?.offer.voucherRedeemableUntilDate
          )
        )
      : null;
  return (
    <Wrapper flexDirection="column" alignItems="flex-start" gap="1rem">
      <Typography fontWeight={600}>What's next?</Typography>
      <Grid gap="2rem">
        <Button>Request shipment</Button>
        {exchange && (
          <a
            href={getOpenSeaUrl({
              configId: config.configId,
              envName: config.envName,
              exchange
            })}
            target="_blank"
            rel="noreferrer"
          >
            <Button themeVal="blankSecondaryOutline">Trade Physical NFT</Button>
          </a>
        )}
      </Grid>
      <InfoWrapper gap="0.8438rem">
        <Info color={colors.violet} size={18} />
        <Grid flexDirection="column" alignItems="flex-start">
          <Typography
            color={colors.greyDark}
            fontSize="0.75rem"
            fontWeight={600}
          >
            Holding your NFT
          </Typography>
          <Typography
            color={colors.greyDark}
            fontSize="0.75rem"
            fontWeight={600}
            opacity={0.5}
          >
            You can request shipment or trade the NFT later. Feel free to leave
            this modal and return until{" "}
            {voucherRedeemableUntilDate
              ? voucherRedeemableUntilDate.format(dateFormat)
              : "-"}
            .
          </Typography>
        </Grid>
      </InfoWrapper>
    </Wrapper>
  );
};
