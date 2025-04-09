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
import { colors, getCssVar } from "../../../../../theme";
import { useModal } from "../../../useModal";
import { RequestShipmentModalProps } from "../../RequestShipment/RequestShipmentModal";
import ThemedButton from "../../../../ui/ThemedButton";
import { getExchangeTokenId } from "../../../../../lib/utils/exchange";

const DividerWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  &::after {
    content: "OR";
    position: absolute;
    padding: 0 1rem;
    background: ${getCssVar("--background-accent-color")};
    color: color-mix(
      in srgb,
      ${getCssVar("--sub-text-color")} 50%,
      transparent 50%
    );
    font-weight: 736;
  }

  hr {
    width: 100%;
    border: none;
    border-top: 1px solid ${getCssVar("--sub-text-color")};
    opacity: 0.5;
  }
`;

const Wrapper = styled(Grid)`
  container-type: inline-size;
  background-color: ${getCssVar("--background-accent-color")};
  box-shadow: 0px 4.318px 40px 0px rgba(21, 30, 52, 0.1);
  padding: 1rem;
  margin: 1rem 0;
`;
const containerBreakpoint = "400px";
const CtaGrid = styled(Grid)`
  flex-direction: column;
  gap: 1rem;
  > * {
    width: 100%;
  }
  @container (width > ${containerBreakpoint}) {
    flex-direction: row;
    gap: 2rem;
    > * {
      flex: 1 1 100%;
    }
  }
`;

const InfoWrapper = styled(Grid)`
  background-color: ${getCssVar("--background-color")};
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
`;

export type RedeemWhatsNextProps = {
  exchangeId: string;
  requestShipmentProps:
    | Pick<
        RequestShipmentModalProps,
        "forcedAccount" | "parentOrigin" | "signatures"
      >
    | undefined;
};
export const RedeemWhatsNext = ({
  exchangeId,
  requestShipmentProps
}: RedeemWhatsNextProps) => {
  const { showModal } = useModal();
  const { config } = useConfigContext();
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
    (exchange?.validUntilDate ?? exchange?.offer.voucherRedeemableUntilDate)
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
      {exchange && (
        <>
          <CtaGrid>
            {requestShipmentProps && (
              <Button
                style={{ flex: "1 1 50%" }}
                onClick={() => {
                  showModal(
                    "REQUEST_SHIPMENT",
                    {
                      exchange,
                      ...requestShipmentProps
                    },
                    "auto",
                    { xs: "550px" }
                  );
                }}
              >
                Request shipment
              </Button>
            )}

            <a
              href={getOpenSeaUrl({
                configId: config.configId,
                envName: config.envName,
                tokenId: getExchangeTokenId(exchange, config.envName),
                contractAddress: exchange.seller.voucherCloneAddress
              })}
              target="_blank"
              rel="noreferrer"
              style={{ flex: "1 1 50%" }}
            >
              <ThemedButton themeVal="secondary" style={{ width: "100%" }}>
                Trade Physical NFT
              </ThemedButton>
            </a>
          </CtaGrid>
          <DividerWrapper>
            <hr />
          </DividerWrapper>
        </>
      )}
      <InfoWrapper gap="0.8438rem">
        <Info color={colors.violet} size={18} />
        <Grid flexDirection="column" alignItems="flex-start">
          <Typography
            color={getCssVar("--main-text-color")}
            fontSize="0.75rem"
            fontWeight={600}
          >
            Holding your NFT
          </Typography>
          <Typography
            color={getCssVar("--sub-text-color")}
            fontSize="0.75rem"
            fontWeight={600}
            opacity={0.5}
          >
            You can request shipment or trade the NFT later. Feel free to leave
            this modal and return until{" "}
            {voucherRedeemableUntilDate
              ? voucherRedeemableUntilDate.format("MMMM D, YYYY")
              : "-"}
            .
          </Typography>
        </Grid>
      </InfoWrapper>
    </Wrapper>
  );
};
