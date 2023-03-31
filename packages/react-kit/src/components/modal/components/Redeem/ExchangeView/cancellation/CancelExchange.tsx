import { Provider } from "@bosonprotocol/ethers-sdk";
import { Info as InfoComponent } from "phosphor-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useSigner } from "wagmi";
import { useCoreSDKWithContext } from "../../../../../../hooks/useCoreSdkWithContext";
import useRefundData from "../../../../../../hooks/useRefundData";
import { useDisplayFloat } from "../../../../../../lib/price/prices";
import { poll } from "../../../../../../lib/promises/promises";
import { theme } from "../../../../../../theme";
import { Exchange } from "../../../../../../types/exchange";
import {
  CancelButton,
  ICancelButton
} from "../../../../../cta/exchange/CancelButton";
import { useEnvContext } from "../../../../../environment/EnvironmentContext";
import SimpleError from "../../../../../error/SimpleError";
import SuccessTransactionToast from "../../../../../toasts/SuccessTransactionToast";
import Grid from "../../../../../ui/Grid";
import { Spinner } from "../../../../../ui/loading/Spinner";
import ThemedButton from "../../../../../ui/ThemedButton";
import DetailTable from "../detail/DetailTable";

const colors = theme.colors.light;

interface Props
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
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cancelError, setCancelError] = useState<Error | null>(null);
  const { offer } = exchange;

  const displayFloat = useDisplayFloat();
  const coreSDK = useCoreSDKWithContext();
  // TODO:
  // const addPendingTransaction = useAddPendingTransaction();
  const { data: signer } = useSigner();
  const { envName } = useEnvContext();
  const { currency, price, penalty, refund } = useRefundData(
    exchange,
    exchange.offer.price
  );

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
      <Info>
        <InfoIcon />
        Your rNFT will be burned after cancellation.
      </Info>
      {cancelError && <SimpleError />}
      <ButtonsSection>
        <CancelButtonWrapper>
          <CancelButton
            variant="accentInverted"
            exchangeId={exchange.id}
            envName={envName}
            disabled={isLoading}
            onError={(...args) => {
              const [error] = args;
              console.error(error);
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
              onPendingTransaction?.(...args);
            }}
            onSuccess={async (...args) => {
              const [, { exchangeId }] = args;
              await poll(
                async () => {
                  const canceledExchange = await coreSDK.getExchangeById(
                    exchangeId
                  );
                  return canceledExchange.cancelledDate;
                },
                (cancelledDate) => {
                  return !cancelledDate;
                },
                500
              );
              setIsLoading(false);
              setCancelError(null);
              onSuccess?.(...args);
              toast((t) => (
                <SuccessTransactionToast
                  t={t}
                  action={`Cancelled exchange: ${offer.metadata.name}`}
                />
              ));
            }}
            web3Provider={signer?.provider as Provider}
            metaTx={coreSDK.metaTxConfig}
          >
            <Grid gap="0.5rem">
              Confirm cancellation
              {isLoading && <Spinner size="20" />}
            </Grid>
          </CancelButton>
        </CancelButtonWrapper>
        <ThemedButton theme="blankOutline" onClick={() => onBackClick()}>
          Back
        </ThemedButton>
      </ButtonsSection>
    </>
  );
}
