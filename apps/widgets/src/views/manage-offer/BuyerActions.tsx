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
import { postCreatedExchange } from "../../lib/iframe";
import { hooks } from "../../lib/connectors/metamask";
import { getConfig } from "../../lib/config";
import { useMetaTxHandlerContract } from "../../lib/meta-transactions/useMetaTxHandlerContract";

const CommitButton = styled(PrimaryButton)`
  width: 100%;

  &[disabled] {
    opacity: 0.2;
  }
`;

function isCommitDisabled(offer: subgraph.OfferFieldsFragment) {
  const offerStatus = offers.getOfferStatus(offer);

  if (offerStatus === offers.OfferState.NOT_YET_VALID) return true;
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
  const config = getConfig();
  const metaTxContract = useMetaTxHandlerContract();
  const account = hooks.useAccount();
  const [transaction, setTransaction] = useState<Transaction>({
    status: "idle"
  });

  const commitDisabled = isCommitDisabled(offer);
  const areMetaTxEnabled = metaTxContract && account;

  async function handleCommit() {
    try {
      setTransaction({
        status: "awaiting-confirm"
      });

      let txResponse;

      if (areMetaTxEnabled) {
        const nonce = Date.now();

        const { r, s, v } = await coreSDK.signExecuteMetaTxCommitToOffer({
          chainId: config.chainId,
          offerId: offer.id,
          nonce
        });

        txResponse = await metaTxContract.executeMetaTxCommitToOffer(
          account,
          { buyer: account, offerId: offer.id },
          nonce,
          r,
          s,
          v
        );
      } else {
        txResponse = await coreSDK.commitToOffer(offer.id);
      }

      setTransaction({
        status: "pending",
        txHash: txResponse.hash
      });

      const txReceipt = await txResponse.wait(1);
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
      postCreatedExchange(exchangeId || "");
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
