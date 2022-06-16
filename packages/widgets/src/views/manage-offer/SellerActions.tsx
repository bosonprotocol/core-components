import { subgraph, offers } from "@bosonprotocol/core-sdk";
import { useState } from "react";
import {
  TransactionModal,
  Transaction
} from "../../lib/components/modals/TransactionModal";
import { useCoreSDK } from "../../lib/useCoreSDK";
import {
  Actions,
  SecondaryButton,
  PrimaryButton
} from "../../lib/components/actions/shared-styles";

interface Props {
  offer: subgraph.OfferFieldsFragment;
  reloadOfferData: () => void;
}

export function SellerActions({ offer, reloadOfferData }: Props) {
  const coreSDK = useCoreSDK();
  const [transaction, setTransaction] = useState<Transaction>({
    status: "idle"
  });

  const offerStatus = offers.getOfferStatus(offer);

  const voidOfferAvailable = [
    offers.OfferState.VALID,
    offers.OfferState.NOT_YET_VALID
  ].includes(offerStatus);

  async function handleVoid() {
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
        dataToPreview: {
          label: "Successfully voided offer",
          value: offer.id
        }
      });
    } catch (e) {
      setTransaction({
        status: "error",
        error: e as Error
      });
    }
  }

  async function handleWithdraw() {
    console.log("TODO");
  }

  return (
    <>
      <Actions>
        {voidOfferAvailable && (
          <SecondaryButton onClick={handleVoid}>Void Offer</SecondaryButton>
        )}
        <PrimaryButton onClick={handleWithdraw}>Withdraw</PrimaryButton>
      </Actions>
      <TransactionModal
        transaction={transaction}
        onClose={() => setTransaction({ status: "idle" })}
      />
    </>
  );
}
