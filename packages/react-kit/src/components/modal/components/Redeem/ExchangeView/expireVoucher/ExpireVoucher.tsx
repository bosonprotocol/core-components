import { subgraph } from "@bosonprotocol/core-sdk";
import { Provider } from "@bosonprotocol/ethers-sdk";
import React, { useState } from "react";
import styled from "styled-components";
import { useSigner } from "../../../../../../hooks/connection/connection";
import { useCoreSDKWithContext } from "../../../../../../hooks/core-sdk/useCoreSdkWithContext";
import { useAddPendingTransactionWithContext } from "../../../../../../hooks/transactions/usePendingTransactionsWithContext";
import useRefundData from "../../../../../../hooks/useRefundData";
import { extractUserFriendlyError } from "../../../../../../lib/errors/transactions";
import { useDisplayFloatWithConfig } from "../../../../../../lib/price/prices";
import { poll } from "../../../../../../lib/promises/promises";
import { colors } from "../../../../../../theme";
import { Exchange } from "../../../../../../types/exchange";
import {
  ExpireButton,
  IExpireButton
} from "../../../../../cta/exchange/ExpireButton";
import { useEnvContext } from "../../../../../environment/EnvironmentContext";
import { SimpleError } from "../../../../../error/SimpleError";
import { Grid } from "../../../../../ui/Grid";
import ThemedButton from "../../../../../ui/ThemedButton";
import { Typography } from "../../../../../ui/Typography";
import { Spinner } from "../../../../../ui/loading/Spinner";
import DetailTable from "../../../common/detail/DetailTable";

const Content = styled.div`
  width: 100%;
  margin-top: 0.75rem;
  margin-bottom: 1.9375rem;
  strong {
    margin-right: 0.2rem;
  }
  tbody {
    tr td:first-child {
      width: auto;
    }
    tr td:last-child {
      width: auto;
    }
  }
`;

const ButtonsWrapper = styled.div`
  border-top: 1px solid ${colors.greyLight};
  padding-top: 2rem;
`;
const Line = styled.hr`
  all: unset;
  display: block;
  width: 100%;
  border-bottom: 2px solid ${colors.black};
  margin: 1rem 0;
`;

export interface ExpireVoucherProps
  extends Pick<
    IExpireButton,
    "onSuccess" | "onError" | "onPendingSignature" | "onPendingTransaction"
  > {
  exchange: Exchange;
  onBackClick: () => void;
}
export default function ExpireVoucher({
  exchange,
  onBackClick,
  onError,
  onPendingSignature,
  onPendingTransaction,
  onSuccess
}: ExpireVoucherProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expireError, setExpireError] = useState<Error | null>(null);
  const { envName, configId } = useEnvContext();
  const coreSDK = useCoreSDKWithContext();
  const addPendingTransaction = useAddPendingTransactionWithContext();
  const signer = useSigner();
  const displayFloat = useDisplayFloatWithConfig();

  const { currency, price, penalty, refund } = useRefundData(
    exchange,
    exchange.offer.price
  );

  return (
    <>
      <Grid
        flexDirection="column"
        style={{
          padding: "0 2rem"
        }}
      >
        <Typography
          tag="p"
          fontWeight="600"
          textAlign="left"
          margin="0 0 0.25rem 0"
          style={{
            width: "100%"
          }}
        >
          What does this mean?
        </Typography>
        <Typography
          tag="p"
          textAlign="left"
          margin="0"
          color={colors.greyDark}
          width="100%"
          style={{
            width: "100%"
          }}
        >
          Your rNFT is no longer redeemable. In order to withdraw your refunded
          amount, the exchange state must be updated to “Expired”. Upon
          completion, you will be redirected to a page where your funds can be
          withdrawn.
        </Typography>
        <Content>
          <DetailTable
            noBorder
            data={[
              price && {
                name: "Item price",
                value: (
                  <>
                    {displayFloat(price.value)} {currency}
                    {price.show ? (
                      <small>
                        ({price.converted.currency}{" "}
                        {displayFloat(price.converted.value)})
                      </small>
                    ) : (
                      ""
                    )}
                  </>
                )
              },
              penalty && {
                name: "Buyer Cancel. Penalty",
                value: (
                  <>
                    -{displayFloat(penalty.value)}%
                    {penalty.show ? (
                      <small>
                        ({penalty.converted.currency}{" "}
                        {displayFloat(penalty.converted.value)})
                      </small>
                    ) : (
                      ""
                    )}
                  </>
                )
              }
            ]}
          />
          <Line />
          <DetailTable
            noBorder
            tag="strong"
            data={[
              refund && {
                name: "Your refund",
                value: (
                  <>
                    {displayFloat(refund.value)} {currency}
                    {refund.show ? (
                      <small>
                        ({refund.converted.currency}{" "}
                        {displayFloat(refund.converted.value)})
                      </small>
                    ) : (
                      ""
                    )}
                  </>
                )
              }
            ]}
          />
          {expireError && <SimpleError errorMessage={expireError.message} />}
        </Content>
      </Grid>
      <ButtonsWrapper>
        <Grid
          justifyContent="space-between"
          style={{
            padding: "0 2rem"
          }}
        >
          <ExpireButton
            variant="primaryFill"
            exchangeId={exchange.id}
            coreSdkConfig={{
              envName,
              configId,
              web3Provider: signer?.provider as Provider,
              metaTx: coreSDK.metaTxConfig
            }}
            disabled={isLoading}
            onError={async (...args) => {
              const [error, context] = args;
              const errorMessage = await extractUserFriendlyError(error, {
                txResponse: context.txResponse,
                provider: signer?.provider
              });
              console.error(
                "Error while expiring voucher",
                error,
                errorMessage
              );
              error.message = errorMessage;
              setExpireError(error);
              setIsLoading(false);
              onError?.(...args);
            }}
            onPendingSignature={(...args) => {
              setIsLoading(true);
              setExpireError(null);
              onPendingSignature?.(...args);
            }}
            onPendingTransaction={(...args) => {
              const [hash, isMetaTx] = args;
              onPendingTransaction?.(...args);
              addPendingTransaction({
                type: subgraph.EventType.VOUCHER_EXPIRED,
                hash,
                isMetaTx,
                accountType: "Buyer",
                exchange: {
                  id: exchange.id
                }
              });
            }}
            onSuccess={async (...args) => {
              const [, { exchangeId }] = args;
              await poll(
                async () => {
                  const expiredExchange =
                    await coreSDK.getExchangeById(exchangeId);
                  return expiredExchange.expired;
                },
                (expired) => {
                  return !expired;
                },
                500
              );
              setIsLoading(false);
              setExpireError(null);
              onSuccess?.(...args);
            }}
          >
            <Grid gap="0.5rem">
              Expire Voucher
              {isLoading && <Spinner size="20" />}
            </Grid>
          </ExpireButton>
          <ThemedButton themeVal="blankOutline" onClick={onBackClick}>
            Back
          </ThemedButton>
        </Grid>
      </ButtonsWrapper>
    </>
  );
}
