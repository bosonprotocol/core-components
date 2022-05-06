import { offers } from "@bosonprotocol/core-sdk";
import { useState } from "react";
import styled from "styled-components";
import { ConfirmModal } from "../../lib/components/modals/ConfirmModal";
import { ErrorModal } from "../../lib/components/modals/ErrorModal";
import { SuccessModal } from "../../lib/components/modals/SuccessModal";
import { TransactionPendingModal } from "../../lib/components/modals/TransactionPendingModal";
import { useCoreSDK } from "../../lib/useCoreSDK";
import { Actions, PrimaryButton } from "./shared-styles";

const CommitButton = styled(PrimaryButton)`
  width: 100%;

  &[disabled] {
    opacity: 0.2;
  }
`;

function isCommitDisabled(offer: offers.RawOfferFromSubgraph) {
  const toTimeStamp = (numberString: string) => Number(numberString) * 1000;

  if (toTimeStamp(offer.validUntilDate) < Date.now()) return true;
  if (Number(offer.quantityAvailable) <= 0) return true;

  return false;
}

interface Props {
  offer: offers.RawOfferFromSubgraph;
  reloadOfferData: () => void;
}
export function BuyerActions({ offer, reloadOfferData }: Props) {
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

  const commitDisabled = isCommitDisabled(offer);

  return (
    <>
      <Actions>
        <CommitButton
          disabled={commitDisabled}
          onClick={() => setShowConfirmModal(true)}
        >
          Commit to Offer
        </CommitButton>
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
