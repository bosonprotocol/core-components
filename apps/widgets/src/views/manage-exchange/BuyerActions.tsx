import { exchanges, subgraph } from "@bosonprotocol/core-sdk";
import { useState } from "react";
import styled from "styled-components";
import {
  TransactionModal,
  Transaction
} from "../../lib/components/modals/TransactionModal";
import {
  Actions,
  PrimaryButton,
  SecondaryButton
} from "../../lib/components/actions/shared-styles";
import { useCoreSDK } from "../../lib/useCoreSDK";
import { postCancelledVoucher, postRedeemedVoucher } from "../../lib/iframe";
import { hooks } from "../../lib/connectors/metamask";
import { getConfig } from "../../lib/config";
import { useMetaTxHandlerContract } from "../../lib/meta-transactions/useMetaTxHandlerContract";

const RedeemButton = styled(PrimaryButton)`
  width: 50%;

  &[disabled] {
    opacity: 0.2;
  }
`;

const CancelButton = styled(SecondaryButton)`
  width: 50%;

  &[disabled] {
    opacity: 0.2;
  }
`;

interface Props {
  exchange: subgraph.ExchangeFieldsFragment;
  reloadExchangeData: () => void;
}

export function BuyerActions({ exchange, reloadExchangeData }: Props) {
  const coreSDK = useCoreSDK();
  const config = getConfig();
  const metaTxContract = useMetaTxHandlerContract();
  const account = hooks.useAccount();
  const [transaction, setTransaction] = useState<Transaction>({
    status: "idle"
  });

  const exchangeState = exchanges.getExchangeState(exchange);
  const isCommitted = exchangeState === subgraph.ExchangeState.Committed;
  const areMetaTxEnabled = metaTxContract && account;

  async function handleCancel() {
    try {
      setTransaction({
        status: "awaiting-confirm"
      });

      let txResponse;

      if (areMetaTxEnabled) {
        const nonce = Date.now();

        const { r, s, v } = await coreSDK.signExecuteMetaTxCancelVoucher({
          chainId: config.chainId,
          exchangeId: exchange.id,
          nonce
        });

        txResponse = await metaTxContract.executeMetaTxCancelVoucher(
          account,
          {
            exchangeId: exchange.id
          },
          nonce,
          r,
          s,
          v
        );
      } else {
        txResponse = await coreSDK.cancelVoucher(exchange.id);
      }

      setTransaction({
        status: "pending",
        txHash: txResponse.hash
      });

      await txResponse.wait(1);
      setTransaction({
        status: "success",
        txHash: txResponse.hash,
        message: "Successfully cancelled"
      });
      postCancelledVoucher(exchange.id);
    } catch (error) {
      setTransaction({
        status: "error",
        error: error as Error
      });
    }
  }

  async function handleRedeem() {
    try {
      setTransaction({
        status: "awaiting-confirm"
      });

      let txResponse;

      if (areMetaTxEnabled) {
        const nonce = Date.now();

        const { r, s, v } = await coreSDK.signExecuteMetaTxRedeemVoucher({
          chainId: config.chainId,
          exchangeId: exchange.id,
          nonce
        });

        txResponse = await metaTxContract.executeMetaTxRedeemVoucher(
          account,
          {
            exchangeId: exchange.id
          },
          nonce,
          r,
          s,
          v
        );
      } else {
        txResponse = await coreSDK.redeemVoucher(exchange.id);
      }

      setTransaction({
        status: "pending",
        txHash: txResponse.hash
      });

      setTransaction({
        status: "pending",
        txHash: txResponse.hash
      });

      await txResponse.wait(1);
      setTransaction({
        status: "success",
        txHash: txResponse.hash,
        message: "Successfully redeemed"
      });
      postRedeemedVoucher(exchange.id);
    } catch (error) {
      setTransaction({
        status: "error",
        error: error as Error
      });
    }
  }

  return (
    <>
      <Actions>
        <CancelButton disabled={!isCommitted} onClick={handleCancel}>
          Cancel
        </CancelButton>
        <RedeemButton disabled={!isCommitted} onClick={handleRedeem}>
          Redeem
        </RedeemButton>
      </Actions>
      <TransactionModal
        transaction={transaction}
        onClose={() => {
          setTransaction({ status: "idle" });
          reloadExchangeData();
        }}
      />
    </>
  );
}
