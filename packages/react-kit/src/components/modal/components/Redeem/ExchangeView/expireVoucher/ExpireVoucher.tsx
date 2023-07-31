import { subgraph } from "@bosonprotocol/core-sdk";
import { Provider } from "@bosonprotocol/ethers-sdk";
import React, { useState } from "react";
import styled from "styled-components";
import { useAddPendingTransactionWithContext } from "../../../../../../hooks/transactions/usePendingTransactionsWithContext";
import { useCoreSDKWithContext } from "../../../../../../hooks/useCoreSdkWithContext";
import useRefundData from "../../../../../../hooks/useRefundData";
import { useDisplayFloat } from "../../../../../../lib/price/prices";
import { poll } from "../../../../../../lib/promises/promises";
import { theme } from "../../../../../../theme";
import { Exchange } from "../../../../../../types/exchange";
import {
  ExpireButton,
  IExpireButton
} from "../../../../../cta/exchange/ExpireButton";
import { useEnvContext } from "../../../../../environment/EnvironmentContext";
import SimpleError from "../../../../../error/SimpleError";
import Grid from "../../../../../ui/Grid";
import { Spinner } from "../../../../../ui/loading/Spinner";
import ThemedButton from "../../../../../ui/ThemedButton";
import Typography from "../../../../../ui/Typography";
import DetailTable from "../detail/DetailTable";
import { useEthersSigner } from "../../../../../../hooks/ethers/useEthersSigner";

const colors = theme.colors.light;

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
  border-top: 1px solid ${colors.lightGrey};
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
  const { envName } = useEnvContext();
  const coreSDK = useCoreSDKWithContext();
  const addPendingTransaction = useAddPendingTransactionWithContext();
  const signer = useEthersSigner();
  const displayFloat = useDisplayFloat();

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
          color={colors.darkGrey}
          $width="100%"
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
          {expireError && <SimpleError />}
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
            envName={envName}
            disabled={isLoading}
            onError={(...args) => {
              const [error] = args;
              console.error(error);
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
                type: subgraph.EventType.VoucherExpired,
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
                  const expiredExchange = await coreSDK.getExchangeById(
                    exchangeId
                  );
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
            web3Provider={signer?.provider as Provider}
            metaTx={coreSDK.metaTxConfig}
          >
            <Grid gap="0.5rem">
              Expire Voucher
              {isLoading && <Spinner size="20" />}
            </Grid>
          </ExpireButton>
          <ThemedButton theme="blankOutline" onClick={onBackClick}>
            Back
          </ThemedButton>
        </Grid>
      </ButtonsWrapper>
    </>
  );
}
