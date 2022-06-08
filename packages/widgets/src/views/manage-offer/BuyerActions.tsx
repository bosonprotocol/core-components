import { offers } from "@bosonprotocol/core-sdk";
import { useState } from "react";
import styled from "styled-components";
import { ConfirmModal } from "../../lib/components/modals/ConfirmModal";
import { ErrorModal } from "../../lib/components/modals/ErrorModal";
import { SuccessModal } from "../../lib/components/modals/SuccessModal";
import { TransactionPendingModal } from "../../lib/components/modals/TransactionPendingModal";
import { useCoreSDK } from "../../lib/useCoreSDK";
import { getOfferStatus, OfferState } from "./getOfferStatus";
import { Actions, PrimaryButton, SecondaryButton } from "./shared-styles";

const CommitButton = styled(PrimaryButton)`
  width: 100%;

  &[disabled] {
    opacity: 0.2;
  }
`;

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

function isCommitDisabled(
  offer: offers.RawOfferFromSubgraph,
  exchangeId: string | null
) {
  const offerStatus = getOfferStatus(offer, exchangeId);

  if (offerStatus === OfferState.EXPIRED) return true;
  if (offerStatus === OfferState.VOIDED) return true;
  if (Number(offer.quantityAvailable) <= 0) return true;

  return false;
}

interface Props {
  offer: offers.RawOfferFromSubgraph;
  reloadOfferData: () => void;
  exchangeId: string | null;
}
export function BuyerActions({ offer, reloadOfferData, exchangeId }: Props) {
  const coreSDK = useCoreSDK();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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
        exchangeId: string;
      }
  >({ status: "idle" });

  const commitDisabled = isCommitDisabled(offer, exchangeId);

  return (
    <>
      <Actions>
        {exchangeId ? (
          <>
            <CancelButton onClick={() => console.log("cancel offer")}>
              Cancel
            </CancelButton>
            <RedeemButton onClick={() => console.log("redeem offer")}>
              Redeem
            </RedeemButton>
          </>
        ) : (
          <CommitButton
            disabled={commitDisabled}
            onClick={() => setShowConfirmModal(true)}
          >
            Commit to Offer
          </CommitButton>
        )}
      </Actions>
      {transaction.status === "pending" && (
        <TransactionPendingModal txHash={transaction.txHash} />
      )}
      {transaction.status === "success" && (
        <SuccessModal
          txHash={transaction.txHash}
          dataToPreview={{
            label: "Exchange ID",
            value: transaction.exchangeId
          }}
          onClose={() => setTransaction({ status: "idle" })}
        />
      )}
      {transaction.status === "error" && (
        <ErrorModal
          message={transaction.error.message}
          onClose={() => setTransaction({ status: "idle" })}
        />
      )}
      {showConfirmModal && (
        <ConfirmModal
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={async () => {
            setShowConfirmModal(false);
            try {
              const txResponse = await coreSDK.commitToOffer(offer.id);

              setTransaction({
                status: "pending",
                txHash: txResponse.hash
              });

              const txReceipt = await txResponse.wait(1);
              const exchangeId = coreSDK.getCommittedExchangeIdFromLogs(
                txReceipt.logs
              );

              reloadOfferData();
              setTransaction({
                status: "success",
                txHash: txResponse.hash,
                exchangeId: exchangeId ?? ""
              });
            } catch (e) {
              setTransaction({
                status: "error",
                error: e as Error
              });
            }
          }}
        />
      )}
    </>
  );
}
