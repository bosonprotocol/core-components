import React from "react";

import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import { useAccount } from "hooks/connection/connection";
import { useBalance } from "wagmi";

import { getNumberWithoutDecimals } from "../../../../lib/numbers/numbers";
import { poll } from "../../../../lib/promises/promises";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";
import { useModal } from "../../useModal";
import {
  AmountWrapper,
  Input,
  InputWrapper,
  ProtocolStrong
} from "./FinancesStyles";
import { Spinner } from "phosphor-react";
import { Provider } from "@bosonprotocol/ethers-sdk";
import { DepositFundsButton } from "../../../cta/funds/DepositFundsButton";
import { useEnvContext } from "../../../environment/EnvironmentContext";
import { useCoreSDKWithContext } from "../../../../hooks/useCoreSdkWithContext";
import { useAddPendingTransactionWithContext } from "../../../../hooks/transactions/usePendingTransactionsWithContext";
import { subgraph } from "@bosonprotocol/core-sdk";
import { useEthersSigner } from "../../../../hooks/ethers/useEthersSigner";

interface Props {
  protocolBalance: string;
  symbol: string;
  accountId: string;
  tokenDecimals: string;
  exchangeToken: string;
  reload: () => void;
}

export default function FinanceDeposit({
  protocolBalance,
  symbol,
  accountId,
  exchangeToken,
  tokenDecimals,
  reload
}: Props) {
  const { envName, configId } = useEnvContext();
  const coreSDK = useCoreSDKWithContext();
  const [amountToDepositTouched, setAmountToDepositTouched] =
    useState<boolean>(false);
  const [amountToDeposit, setAmountToDeposit] = useState<string>("0");
  const [isBeingDeposit, setIsBeingDeposit] = useState<boolean>(false);
  const [isDepositInvalid, setIsDepositInvalid] = useState<boolean>(true);
  const [depositError, setDepositError] = useState<unknown>(null);

  const signer = useEthersSigner();
  const { address } = useAccount();

  const { data: dataBalance, refetch } = useBalance(
    exchangeToken !== ethers.constants.AddressZero
      ? {
          address: address as `0x${string}`,
          token: exchangeToken as `0x${string}`
        }
      : { address: address as `0x${string}` }
  );

  const { showModal, hideModal } = useModal();
  const addPendingTransaction = useAddPendingTransactionWithContext();

  const tokenStep = 10 ** -Number(tokenDecimals);
  const step = 0.01;

  const handleChangeDepositAmount = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAmountToDepositTouched(true);
    const valueStr = e.target.value;
    const value = e.target.valueAsNumber || 0;
    setIsDepositInvalid(false);
    setDepositError(null);
    if (value < tokenStep || value > Number.MAX_SAFE_INTEGER) {
      setIsDepositInvalid(true);
    }
    setAmountToDeposit(valueStr);
  };

  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="1.5rem">
      <Typography tag="p" margin="0" $fontSize="0.75rem">
        <ProtocolStrong>Protocol Balance:</ProtocolStrong> {protocolBalance}{" "}
        {symbol}
      </Typography>
      <Typography tag="p" margin="0" $fontSize="0.75rem" fontWeight="600">
        Choose Amount To Deposit:
      </Typography>
      <AmountWrapper>
        <InputWrapper
          $hasError={
            !!depositError || (isDepositInvalid && amountToDepositTouched)
          }
        >
          <Input
            type="number"
            step={step}
            min={0}
            onChange={handleChangeDepositAmount}
            value={amountToDeposit}
            disabled={isBeingDeposit}
          />
          <div>
            <Typography
              $fontSize="0.875rem"
              margin="0"
              fontWeight="600"
              textAlign="right"
              style={{
                display: "block"
              }}
            >
              {symbol}
            </Typography>
            <Typography $fontSize="0.625rem" margin="0">
              Balance {dataBalance?.formatted}
            </Typography>
          </div>
        </InputWrapper>
      </AmountWrapper>
      <Grid>
        <div />
        <DepositFundsButton
          coreSdkConfig={{
            envName: envName,
            configId: configId,
            web3Provider: signer?.provider as Provider,
            metaTx: coreSDK.metaTxConfig
          }}
          exchangeToken={exchangeToken}
          accountId={accountId}
          amountToDeposit={
            isDepositInvalid || !Number(amountToDeposit)
              ? BigNumber.from("0")
              : BigNumber.from(
                  getNumberWithoutDecimals(amountToDeposit, tokenDecimals)
                )
          }
          disabled={isBeingDeposit || isDepositInvalid}
          onPendingSignature={() => {
            setDepositError(null);
            setIsBeingDeposit(true);
            showModal("WAITING_FOR_CONFIRMATION");
          }}
          onPendingTransaction={(hash, isMetaTx, actionName) => {
            switch (actionName) {
              case "approveExchangeToken":
                showModal("TRANSACTION_SUBMITTED", {
                  action: "Approve ERC20 Token",
                  txHash: hash
                });
                break;
              case "depositFunds":
                showModal("TRANSACTION_SUBMITTED", {
                  action: "Finance deposit",
                  txHash: hash
                });
                addPendingTransaction({
                  type: subgraph.EventType.FundsDeposited,
                  hash: hash,
                  isMetaTx,
                  accountType: "Seller"
                });
                break;
              default:
                break;
            }
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
            setAmountToDeposit("0");
            setIsDepositInvalid(true);
            reload();
            setIsBeingDeposit(false);
            hideModal();
          }}
          onError={(error) => {
            console.error("onError", error);
            const hasUserRejectedTx =
              "code" in error &&
              (error as unknown as { code: string }).code === "ACTION_REJECTED";
            if (hasUserRejectedTx) {
              showModal("CONFIRMATION_FAILED");
            }
            setDepositError(error);
            reload();
            setIsBeingDeposit(false);
          }}
        >
          {isBeingDeposit ? (
            <Spinner size={20} />
          ) : (
            <Typography tag="p" margin="0" $fontSize="0.75rem" fontWeight="600">
              Deposit {symbol}
            </Typography>
          )}
        </DepositFundsButton>
      </Grid>
    </Grid>
  );
}
