import { useEffect, useState } from "react";
import styled from "styled-components";
import { WidgetLayout } from "../../lib/components/WidgetLayout";
import { StageIndicator } from "./StageIndicator";
import { TransactionPendingModal } from "../../lib/components/modals/TransactionPendingModal";
import { offers } from "@bosonprotocol/core-sdk";
import { useCoreSDK } from "../../lib/useCoreSDK";
import { useExchangeToken } from "../../lib/useExchangeToken";
import { hooks } from "../../lib/connectors/metamask";
import axios from "axios";
import { Button } from "../../lib/components/Button";
import { SuccessModal } from "../../lib/components/modals/SuccessModal";
import { ErrorModal } from "../../lib/components/modals/ErrorModal";
import { ethers } from "ethers";
import { columnGap, OfferDetails } from "../../lib/components/OfferDetails";

const Spacer = styled.div`
  height: 20px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${columnGap}px;
`;

function useMetadata(metadataUri: string) {
  const [metadata, setMetadata] = useState<Record<string, string>>();

  useEffect(() => {
    axios.get(metadataUri).then((resp) => setMetadata(resp.data));
  }, [metadataUri]);

  return metadata;
}

export function CreateOffer() {
  const urlParams = Object.fromEntries(
    new URLSearchParams(window.location.hash.split("?")[1]).entries()
  );

  const account = hooks.useAccount();

  const createOfferArgs: offers.CreateOfferArgs = {
    price: urlParams["price"],
    deposit: urlParams["deposit"],
    penalty: urlParams["penalty"],
    quantity: urlParams["quantity"],
    validFromDateInMS: urlParams["validFromDateInMS"],
    validUntilDateInMS: urlParams["validUntilDateInMS"],
    redeemableDateInMS: urlParams["redeemableDateInMS"],
    fulfillmentPeriodDurationInMS: urlParams["fulfillmentPeriodDurationInMS"],
    voucherValidDurationInMS: urlParams["voucherValidDurationInMS"],
    seller: account ?? "",
    exchangeToken: urlParams["exchangeToken"],
    metadataUri: urlParams["metadataUri"],
    metadataHash: urlParams["metadataHash"]
  };

  const [transaction, setTransaction] = useState<
    | {
        status: "idle";
      }
    | {
        status: "pending";
        txHash: string;
      }
    | {
        status: "error";
        error: Error;
      }
    | {
        status: "success";
        txHash: string;
        offerId: string;
      }
  >({ status: "idle" });

  const metadata = useMetadata(createOfferArgs.metadataUri);
  const coreSDK = useCoreSDK();
  const { tokenState, reload: reloadExhangeToken } = useExchangeToken({
    exchangeTokenAddress: createOfferArgs.exchangeToken,
    coreSDK
  });

  const currency =
    tokenState.status === "token" ? tokenState.token.symbol : "...";

  const tokenApprovalNeeded =
    tokenState.status === "token"
      ? tokenState.token.allowance.lt(ethers.constants.MaxInt256.div(2))
      : true;

  return (
    <WidgetLayout title="Create Offer" offerName={metadata?.title ?? "..."}>
      <OfferDetails createOfferArgs={createOfferArgs} currency={currency} />
      <Spacer />
      <Actions>
        <Button
          disabled={!tokenApprovalNeeded}
          onClick={async () => {
            if (!coreSDK) return;

            try {
              const txResponse = await coreSDK.approveExchangeToken(
                createOfferArgs.exchangeToken,
                ethers.constants.MaxInt256.sub(createOfferArgs.deposit)
              );

              setTransaction({
                status: "pending",
                txHash: txResponse.hash
              });

              await txResponse.wait();

              reloadExhangeToken();
              setTransaction({ status: "idle" });
            } catch (e) {
              setTransaction({
                status: "error",
                error: e as Error
              });
            }
          }}
        >
          Approve Tokens
        </Button>
        <Button
          disabled={tokenApprovalNeeded}
          onClick={async () => {
            if (!coreSDK) return;

            try {
              const txResponse = await coreSDK.createOffer(createOfferArgs);

              setTransaction({
                status: "pending",
                txHash: txResponse.hash
              });

              const txReceipt = await txResponse.wait(1);
              const offerId = coreSDK.getCreatedOfferIdFromLogs(txReceipt.logs);

              setTransaction({
                status: "success",
                txHash: txResponse.hash,
                offerId: offerId || ""
              });
            } catch (e) {
              setTransaction({
                status: "error",
                error: e as Error
              });
            }
          }}
        >
          Create Offer
        </Button>
      </Actions>
      <StageIndicator stage={tokenApprovalNeeded ? 1 : 2} />
      {transaction.status === "pending" && (
        <TransactionPendingModal txHash={transaction.txHash} />
      )}
      {transaction.status === "success" && (
        <SuccessModal
          txHash={transaction.txHash}
          offerId={transaction.offerId}
          onClose={() => setTransaction({ status: "idle" })}
        />
      )}
      {transaction.status === "error" && (
        <ErrorModal
          error={transaction.error}
          onClose={() => setTransaction({ status: "idle" })}
        />
      )}
    </WidgetLayout>
  );
}
