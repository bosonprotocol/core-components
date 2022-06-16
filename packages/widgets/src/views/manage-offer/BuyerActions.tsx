import { subgraph, offers } from "@bosonprotocol/core-sdk";
import { useState } from "react";
import styled from "styled-components";
import {
  TransactionModal,
  Transaction
} from "../../lib/components/modals/TransactionModal";
import { useCoreSDK } from "../../lib/useCoreSDK";
import {
  Actions,
  PrimaryButton
} from "../../lib/components/actions/shared-styles";

const CommitButton = styled(PrimaryButton)`
  width: 100%;

  &[disabled] {
    opacity: 0.2;
  }
`;

function isCommitDisabled(offer: subgraph.OfferFieldsFragment) {
  const offerStatus = offers.getOfferStatus(offer);

  if (offerStatus === offers.OfferState.EXPIRED) return true;
  if (offerStatus === offers.OfferState.VOIDED) return true;
  if (Number(offer.quantityAvailable) <= 0) return true;

  return false;
}

interface Props {
  offer: subgraph.OfferFieldsFragment;
  reloadOfferData: () => void;
}

export function BuyerActions({ offer, reloadOfferData }: Props) {
  const coreSDK = useCoreSDK();
  const [transaction, setTransaction] = useState<Transaction>({
    status: "idle"
  });

  const commitDisabled = isCommitDisabled(offer);

  async function handleCommit() {
    try {
      const txResponse = await coreSDK.commitToOffer(offer.id);

      setTransaction({
        status: "pending",
        txHash: txResponse.hash
      });

      const txReceipt = await txResponse.wait(2);
      const exchangeId = coreSDK.getCommittedExchangeIdFromLogs(txReceipt.logs);

      reloadOfferData();
      setTransaction({
        status: "success",
        txHash: txResponse.hash,
        dataToPreview: {
          label: "Exchange ID:",
          value: exchangeId || ""
        }
      });
    } catch (e) {
      setTransaction({
        status: "error",
        error: e as Error
      });
    }
  }

  return (
    <>
      <Actions>
        <CommitButton disabled={commitDisabled} onClick={handleCommit}>
          Commit to Offer
        </CommitButton>
      </Actions>
      <TransactionModal
        transaction={transaction}
        onClose={() => setTransaction({ status: "idle" })}
      />
    </>
  );
}
