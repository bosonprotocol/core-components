import { offers } from "@bosonprotocol/core-sdk";
import { useState } from "react";
import { ConfirmModal } from "../../lib/components/modals/ConfirmModal";
import { ErrorModal } from "../../lib/components/modals/ErrorModal";
import { SuccessModal } from "../../lib/components/modals/SuccessModal";
import { TransactionPendingModal } from "../../lib/components/modals/TransactionPendingModal";
import { useCoreSDK } from "../../lib/useCoreSDK";
import { getOfferStatus, OfferState } from "./getOfferStatus";
import { Actions, SecondaryButton, PrimaryButton } from "./shared-styles";

interface Props {
  offer: offers.RawOfferFromSubgraph;
  reloadOfferData: () => void;
}

export function SellerActions({ offer, reloadOfferData }: Props) {
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
        offerId: string;
      }
  >({ status: "idle" });

  const voidOfferAvailable = [
    OfferState.VALID,
    OfferState.NOT_YET_VALID
  ].includes(getOfferStatus(offer));

  return (
    <>
      <Actions>
        {voidOfferAvailable && (
          <SecondaryButton onClick={async () => setShowConfirmModal(true)}>
            Void Offer
          </SecondaryButton>
        )}
        <PrimaryButton
          style={{ width: !voidOfferAvailable ? "100%" : undefined }}
        >
          Withdraw
        </PrimaryButton>
      </Actions>
      {transaction.status === "pending" && (
        <TransactionPendingModal txHash={transaction.txHash} />
      )}
      {transaction.status === "success" && (
        <SuccessModal
          txHash={transaction.txHash}
          dataToPreview={{ label: "Offer ID", value: transaction.offerId }}
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
              const txResponse = await coreSDK.voidOffer(offer.id);

              setTransaction({
                status: "pending",
                txHash: txResponse.hash
              });

              await txResponse.wait(1);

              reloadOfferData();
              setTransaction({
                status: "success",
                txHash: txResponse.hash,
                offerId: offer.id
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
