import React from "react";

import { BigNumber, ethers } from "ethers";
import { Spinner } from "phosphor-react";
import { useState } from "react";
import styled from "styled-components";
import { useAccount, useBalance, useSigner } from "wagmi";

import {
  getNumberWithDecimals,
  getNumberWithoutDecimals
} from "../../../../lib/numbers/numbers";
import { poll } from "../../../../lib/promises/promises";

import { theme } from "../../../../theme";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";
import { useModal } from "../../useModal";
import {
  AmountWrapper,
  Input,
  InputWrapper,
  ProtocolStrong
} from "./FinancesStyles";
import { WithdrawFundsButton } from "../../../cta/funds/WithdrawFundsButton";
import { Provider } from "@bosonprotocol/ethers-sdk";
import { useCoreSDKWithContext } from "../../../../hooks/useCoreSdkWithContext";
import { useEnvContext } from "../../../environment/EnvironmentContext";
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
  const { envName } = useEnvContext();
  const coreSDK = useCoreSDKWithContext();
  const [amountToWithdrawTouched, setAmountToDepositTouched] =
    useState<boolean>(false);
  const [amountToWithdraw, setAmountToWithdraw] = useState<string>("0");
  const [isBeingWithdrawn, setIsBeingWithdrawn] = useState<boolean>(false);
  const [isWithdrawInvalid, setIsWithdrawInvalid] = useState<boolean>(true);
  const [withdrawError, setWithdrawError] = useState<unknown>(null);

  const { data: signer } = useSigner();
  const { address } = useAccount();
  // const addPendingTransaction = useAddPendingTransaction();

  const { data: dataBalance, refetch } = useBalance(
    exchangeToken !== ethers.constants.AddressZero
      ? {
          addressOrName: address,
          token: exchangeToken as `0x${string}`
        }
      : { addressOrName: address }
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
      <Typography tag="p" margin="0" $fontSize="0.75rem">
        <ProtocolStrong>Withdrawable Balance:</ProtocolStrong> {protocolBalance}{" "}
        {symbol}
      </Typography>
      <Typography tag="p" margin="0" $fontSize="0.75rem" fontWeight="600">
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
            <Typography $fontSize="0.875rem" margin="0" fontWeight="600">
              {symbol}
            </Typography>
          </div>
        </InputWrapper>
        <MaxLimitWrapper>
          <Typography tag="p" $fontSize="0.75rem" margin="0">
            (Max Limit {protocolBalance} {symbol})
          </Typography>
        </MaxLimitWrapper>
      </AmountWrapper>
      <Grid>
        {dataBalance ? (
          <Typography tag="p" margin="0" $fontSize="0.75rem" fontWeight="600">
            Wallet Balance: {dataBalance?.formatted} {dataBalance?.symbol}
          </Typography>
        ) : (
          <div />
        )}
        <WithdrawFundsButton
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
          envName={envName}
          disabled={isBeingWithdrawn || isWithdrawInvalid}
          web3Provider={signer?.provider as Provider}
          metaTx={coreSDK.metaTxConfig}
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
          }}
          onSuccess={async () => {
            await poll(
              async () => {
                const balance = await refetch();
                return balance;
              },
              (balance) => {
                return dataBalance?.formatted === balance.data?.formatted;
              },
              500
            );
            setAmountToWithdraw("0");
            setIsWithdrawInvalid(true);
            hideModal();
            reload();
            setIsBeingWithdrawn(false);
          }}
          onError={(error) => {
            console.error("onError", error);
            const hasUserRejectedTx =
              "code" in error &&
              (error as unknown as { code: string }).code === "ACTION_REJECTED";
            if (hasUserRejectedTx) {
              showModal("CONFIRMATION_FAILED");
            }
            setWithdrawError(error);
            reload();
            setIsBeingWithdrawn(false);
          }}
        >
          {isBeingWithdrawn ? (
            <Spinner size={20} />
          ) : (
            <Typography tag="p" margin="0" $fontSize="0.75rem" fontWeight="600">
              Withdraw {symbol}
            </Typography>
          )}
        </WithdrawFundsButton>
      </Grid>
    </Grid>
  );
}
