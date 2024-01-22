import * as Sentry from "@sentry/browser";
import React from "react";

import { BigNumber } from "ethers";
import { Spinner } from "phosphor-react";
import { useState } from "react";
import styled from "styled-components";
import {
  getNumberWithDecimals,
  getNumberWithoutDecimals
} from "../../../../lib/numbers/numbers";
import { poll } from "../../../../lib/promises/promises";

import { subgraph } from "@bosonprotocol/core-sdk";
import { Provider } from "@bosonprotocol/ethers-sdk";
import { useSigner } from "../../../../hooks/connection/connection";
import { useCoreSDKWithContext } from "../../../../hooks/core-sdk/useCoreSdkWithContext";
import { useExchangeTokenBalance } from "../../../../hooks/offer/useExchangeTokenBalance";
import { useAddPendingTransactionWithContext } from "../../../../hooks/transactions/usePendingTransactionsWithContext";
import {
  extractUserFriendlyError,
  getHasUserRejectedTx
} from "../../../../lib/errors/transactions";
import { theme } from "../../../../theme";
import { WithdrawFundsButton } from "../../../cta/funds/WithdrawFundsButton";
import { useEnvContext } from "../../../environment/EnvironmentContext";
import { Grid } from "../../../ui/Grid";
import { Typography } from "../../../ui/Typography";
import { useModal } from "../../useModal";
import {
  AmountWrapper,
  Input,
  InputWrapper,
  ProtocolStrong
} from "./FinancesStyles";
const colors = theme.colors.light;

const MaxLimitWrapper = styled.div`
  color: ${colors.lightGrey};
  margin-top: 0.25rem;
`;

interface Props {
  protocolBalance: string;
  symbol: string;
  accountId: string;
  tokenDecimals: string;
  exchangeToken: string;
  availableAmount: string;
  reload: () => void;
}

export default function FinanceWithdraw({
  protocolBalance,
  symbol,
  accountId,
  exchangeToken,
  tokenDecimals,
  reload,
  availableAmount
}: Props) {
  const { envName, configId } = useEnvContext();
  const coreSDK = useCoreSDKWithContext();
  const [amountToWithdrawTouched, setAmountToDepositTouched] =
    useState<boolean>(false);
  const [amountToWithdraw, setAmountToWithdraw] = useState<string>("0");
  const [isBeingWithdrawn, setIsBeingWithdrawn] = useState<boolean>(false);
  const [isWithdrawInvalid, setIsWithdrawInvalid] = useState<boolean>(true);
  const [withdrawError, setWithdrawError] = useState<unknown>(null);

  const signer = useSigner();
  const addPendingTransaction = useAddPendingTransactionWithContext();

  const {
    balance: dataBalance,
    refetch,
    formatted
  } = useExchangeTokenBalance(
    {
      address: exchangeToken,
      decimals: tokenDecimals
    },
    {
      enabled: true
    }
  );
  const { showModal, hideModal } = useModal();

  const tokenStep = 10 ** -Number(tokenDecimals);
  const step = 0.01;

  const handleChangeWithdrawAmount = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAmountToDepositTouched(true);
    const valueStr = e.target.value;
    const value = e.target.valueAsNumber || 0;
    setIsWithdrawInvalid(false);

    const availableFundsBig = getNumberWithDecimals(
      availableAmount,
      tokenDecimals
    );

    if (value < tokenStep || value > availableFundsBig || !value) {
      setIsWithdrawInvalid(true);
    }

    setAmountToWithdraw(valueStr);
  };

  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="1.5rem">
      <Typography tag="p" margin="0" fontSize="0.75rem">
        <ProtocolStrong>Withdrawable Balance:</ProtocolStrong> {protocolBalance}{" "}
        {symbol}
      </Typography>
      <Typography tag="p" margin="0" fontSize="0.75rem" fontWeight="600">
        Enter Amount To Withdraw:
      </Typography>
      <AmountWrapper>
        <InputWrapper
          $hasError={
            !!withdrawError || (isWithdrawInvalid && amountToWithdrawTouched)
          }
        >
          <Input
            type="number"
            step={step}
            min={0}
            onChange={handleChangeWithdrawAmount}
            value={amountToWithdraw}
            disabled={isBeingWithdrawn}
          />
          <div>
            <Typography fontSize="0.875rem" margin="0" fontWeight="600">
              {symbol}
            </Typography>
          </div>
        </InputWrapper>
        <MaxLimitWrapper>
          <Typography tag="p" fontSize="0.75rem" margin="0">
            (Max Limit {protocolBalance} {symbol})
          </Typography>
        </MaxLimitWrapper>
      </AmountWrapper>
      <Grid>
        {dataBalance ? (
          <Typography tag="p" margin="0" fontSize="0.75rem" fontWeight="600">
            Wallet Balance: {formatted} {symbol}
          </Typography>
        ) : (
          <div />
        )}
        <WithdrawFundsButton
          coreSdkConfig={{
            envName: envName,
            configId: configId,
            web3Provider: signer?.provider as Provider,
            metaTx: coreSDK.metaTxConfig
          }}
          accountId={accountId}
          tokensToWithdraw={[
            {
              address: exchangeToken,
              amount:
                isWithdrawInvalid || !Number(amountToWithdraw)
                  ? BigNumber.from("0")
                  : BigNumber.from(
                      getNumberWithoutDecimals(amountToWithdraw, tokenDecimals)
                    )
            }
          ]}
          disabled={isBeingWithdrawn || isWithdrawInvalid}
          onPendingSignature={() => {
            setWithdrawError(null);
            setIsBeingWithdrawn(true);
            showModal("WAITING_FOR_CONFIRMATION");
          }}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onPendingTransaction={(hash, isMetaTx) => {
            showModal("TRANSACTION_SUBMITTED", {
              action: "Finance withdraw",
              txHash: hash
            });
            addPendingTransaction({
              type: subgraph.EventType.FundsWithdrawn,
              hash: hash,
              isMetaTx: isMetaTx,
              accountType: "Account"
            });
          }}
          onSuccess={async () => {
            await poll(
              async () => {
                const balance = await refetch();
                return balance;
              },
              (balance) => {
                return dataBalance?.toString() === balance?.toString();
              },
              500
            );
            setAmountToWithdraw("0");
            setIsWithdrawInvalid(true);
            hideModal();
            reload();
            setIsBeingWithdrawn(false);
          }}
          onError={async (...args) => {
            const [error, context] = args;
            const errorMessage = await extractUserFriendlyError(error, {
              txResponse: context.txResponse,
              provider: signer?.provider
            });
            console.error("Error while withdrawing funds", error, errorMessage);
            error.message = errorMessage;
            const hasUserRejectedTx = getHasUserRejectedTx(error);
            if (hasUserRejectedTx) {
              showModal("TRANSACTION_FAILED");
            } else {
              Sentry.captureException(error);
              showModal("TRANSACTION_FAILED", {
                errorMessage: "Something went wrong",
                detailedErrorMessage: errorMessage
              });
            }
            setWithdrawError(error);
            reload();
            setIsBeingWithdrawn(false);
          }}
        >
          {isBeingWithdrawn ? (
            <Spinner size={20} />
          ) : (
            <Typography tag="p" margin="0" fontSize="0.75rem" fontWeight="600">
              Withdraw {symbol}
            </Typography>
          )}
        </WithdrawFundsButton>
      </Grid>
    </Grid>
  );
}
