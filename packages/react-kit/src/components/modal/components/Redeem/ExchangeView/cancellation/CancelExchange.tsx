import { subgraph } from "@bosonprotocol/core-sdk";
import { Provider } from "@bosonprotocol/ethers-sdk";
import { CheckCircle, Info as InfoComponent } from "phosphor-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useSigner } from "../../../../../../hooks/connection/connection";
import { useCoreSDKWithContext } from "../../../../../../hooks/core-sdk/useCoreSdkWithContext";
import { useAddPendingTransactionWithContext } from "../../../../../../hooks/transactions/usePendingTransactionsWithContext";
import useRefundData from "../../../../../../hooks/useRefundData";
import { extractUserFriendlyError } from "../../../../../../lib/errors/transactions";
import { useDisplayFloatWithConfig } from "../../../../../../lib/price/prices";
import { poll } from "../../../../../../lib/promises/promises";
import { theme } from "../../../../../../theme";
import { Exchange } from "../../../../../../types/exchange";
import {
  CancelButton,
  ICancelButton
} from "../../../../../cta/exchange/CancelButton";
import { useEnvContext } from "../../../../../environment/EnvironmentContext";
import { SimpleError } from "../../../../../error/SimpleError";
import SuccessTransactionToast from "../../../../../toasts/SuccessTransactionToast";
import { Grid } from "../../../../../ui/Grid";
import ThemedButton from "../../../../../ui/ThemedButton";
import { Spinner } from "../../../../../ui/loading/Spinner";
import {
  RedemptionWidgetAction,
  useRedemptionContext
} from "../../../../../widgets/redemption/provider/RedemptionContext";
import DetailTable from "../../../common/detail/DetailTable";

const colors = theme.colors.light;

export interface CancelExchangeProps
  extends Pick<
    ICancelButton,
    "onSuccess" | "onError" | "onPendingSignature" | "onPendingTransaction"
  > {
  exchange: Exchange;
  onBackClick: () => void;
}

const Line = styled.hr`
  all: unset;
  display: block;
  width: 100%;
  border-bottom: 2px solid ${colors.black};
  margin: 1rem 0;
`;

const Info = styled.div`
  padding: 1.5rem;
  background-color: ${colors.lightGrey};
  margin: 2rem 0;
  color: ${colors.darkGrey};
  display: flex;
  align-items: center;
`;

const InfoIcon = styled(InfoComponent)`
  margin-right: 1.1875rem;
`;

const SuccessIcon = styled(CheckCircle).attrs({ color: colors.green })`
  margin-right: 1.1875rem;
`;

const ButtonsSection = styled.div`
  border-top: 2px solid ${colors.border};
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

const CancelButtonWrapper = styled.div`
  button {
    background: transparent;
    border-color: ${colors.orange};
    border: 2px solid ${colors.orange};
    color: ${colors.orange};
    &:hover {
      background: ${colors.orange};
      border-color: ${colors.orange};
      border: 2px solid ${colors.orange};
      color: ${colors.white};
    }
  }
`;

export function CancelExchange({
  exchange,
  onSuccess,
  onBackClick,
  onError,
  onPendingSignature,
  onPendingTransaction
}: CancelExchangeProps) {
  const [cancelSuccess, setCancelSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cancelError, setCancelError] = useState<Error | null>(null);
  const { offer } = exchange;

  const displayFloat = useDisplayFloatWithConfig();
  const coreSDK = useCoreSDKWithContext();

  const addPendingTransaction = useAddPendingTransactionWithContext();
  const signer = useSigner();
  const { envName, configId } = useEnvContext();
  const { currency, price, penalty, refund } = useRefundData(
    exchange,
    exchange.offer.price
  );
  const { widgetAction } = useRedemptionContext();
  const isCancelModeOnly = widgetAction === RedemptionWidgetAction.CANCEL_FORM;
  return (
    <>
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

      {cancelSuccess ? (
        <Info>
          <SuccessIcon />
          Your exchange has been cancelled
        </Info>
      ) : (
        <Info>
          <InfoIcon />
          Your rNFT will be burned after cancellation.
        </Info>
      )}
      {cancelError && <SimpleError errorMessage={cancelError.message} />}
      <ButtonsSection>
        <CancelButtonWrapper>
          <CancelButton
            coreSdkConfig={{
              envName: envName,
              configId: configId,
              web3Provider: signer?.provider as Provider,
              metaTx: coreSDK.metaTxConfig
            }}
            variant="accentInverted"
            exchangeId={exchange.id}
            disabled={isLoading || cancelSuccess}
            onError={async (...args) => {
              const [error, context] = args;
              const errorMessage = await extractUserFriendlyError(error, {
                txResponse: context.txResponse,
                provider: signer?.provider
              });
              console.error("Error while cancelling", error, errorMessage);
              error.message = errorMessage;
              setCancelError(error);
              setIsLoading(false);
              onError?.(...args);
            }}
            onPendingSignature={(...args) => {
              setIsLoading(true);
              setCancelError(null);
              onPendingSignature?.(...args);
            }}
            onPendingTransaction={(...args) => {
              const [hash, isMetaTx] = args;
              onPendingTransaction?.(...args);
              addPendingTransaction({
                type: subgraph.EventType.VOUCHER_CANCELED,
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
                  const canceledExchange =
                    await coreSDK.getExchangeById(exchangeId);
                  return canceledExchange.cancelledDate;
                },
                (cancelledDate) => {
                  return !cancelledDate;
                },
                500
              );
              setCancelSuccess(true);
              setIsLoading(false);
              setCancelError(null);
              onSuccess?.(...args);
              toast((t) => (
                <SuccessTransactionToast
                  t={t}
                  action={`Cancelled exchange: ${offer.metadata?.name}`}
                />
              ));
            }}
          >
            <Grid gap="0.5rem">
              Confirm cancellation
              {isLoading && <Spinner size="20" />}
            </Grid>
          </CancelButton>
        </CancelButtonWrapper>
        {!isCancelModeOnly && (
          <ThemedButton themeVal="blankOutline" onClick={() => onBackClick()}>
            Back
          </ThemedButton>
        )}
      </ButtonsSection>
    </>
  );
}
