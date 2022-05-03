import { useEffect, useState } from "react";
import { WidgetLayout } from "../../lib/components/WidgetLayout";
import { offers } from "@bosonprotocol/core-sdk";
import { useCoreSDK } from "../../lib/useCoreSDK";
import {
  columnGap,
  emptyOfferDetails,
  Entry,
  Label,
  OfferDetails,
  Row,
  Spacer,
  Value
} from "../../lib/components/OfferDetails";
import { TransactionPendingModal } from "../../lib/components/modals/TransactionPendingModal";
import { SuccessModal } from "../../lib/components/modals/SuccessModal";
import { ErrorModal } from "../../lib/components/modals/ErrorModal";
import styled from "styled-components";
import { Button } from "../../lib/components/Button";
import { useReloadToken } from "../../lib/useReloadToken";
import { ConfirmModal } from "../../lib/components/modals/ConfirmModal";
import { getURLParams } from "../../lib/parseUrlParams";
import { colors } from "../../lib/colors";

enum OfferState {
  VOIDED = "VOIDED",
  NOT_YET_VALID = "NOT YET VALID",
  EXPIRED = "EXPIRED",
  VALID = "VALID"
}

function getOfferStatus(offer: offers.RawOfferFromSubgraph) {
  const toTimeStamp = (numberString: string) => Number(numberString) * 1000;
  const timeNow = Date.now();

  if (offer.voidedAt) return OfferState.VOIDED;
  if (toTimeStamp(offer.validFromDate) > timeNow)
    return OfferState.NOT_YET_VALID;
  if (toTimeStamp(offer.validUntilDate) < timeNow) return OfferState.EXPIRED;
  return OfferState.VALID;
}

const PrimaryButton = styled(Button)`
  background-color: ${colors.cyberSpaceGray};
  color: ${colors.neonGreen};
  border-color: ${colors.neonGreen};
`;

const SecondaryButton = styled(Button)`
  background-color: ${colors.neonGreen};
  opacity: 0.9;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${columnGap}px;
`;

export default function ManageOffer() {
  const { offerId } = getURLParams();

  const { reload: reloadOfferData, reloadToken } = useReloadToken();
  const [offer, setOffer] = useState<offers.RawOfferFromSubgraph>();
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

  const coreSDK = useCoreSDK();

  useEffect(() => {
    coreSDK.getOfferById(offerId).then(setOffer);
  }, [coreSDK, offerId, reloadToken]);

  const voidOfferAvailable =
    offer &&
    [OfferState.VALID, OfferState.NOT_YET_VALID].includes(
      getOfferStatus(offer)
    );

  const currency = offer?.exchangeToken.symbol ?? "...";

  return (
    <WidgetLayout
      hideCloseButton
      title="Manage Offer"
      offerName={offer?.metadata?.name ?? "..."}
    >
      <Row>
        <Entry>
          <Label>Offer ID</Label>
          <Value>{offer?.id ?? "..."}</Value>
        </Entry>
        <Entry>
          <Label>Status</Label>
          <Value>{offer ? getOfferStatus(offer) : "..."}</Value>
        </Entry>
      </Row>
      <OfferDetails
        createOfferArgs={
          !offer
            ? emptyOfferDetails
            : {
                sellerDeposit: offer.sellerDeposit,
                exchangeToken: offer.exchangeToken.address,
                offerChecksum: offer.offerChecksum,
                metadataUri: offer.metadataUri,
                buyerCancelPenalty: offer.buyerCancelPenalty,
                price: offer.price,
                quantityAvailable: offer.quantityAvailable,
                validFromDateInMS: Number(offer.validFromDate) * 1000,
                validUntilDateInMS: Number(offer.validUntilDate) * 1000,
                voucherValidDurationInMS:
                  Number(offer.voucherValidDuration) * 1000,
                fulfillmentPeriodDurationInMS:
                  Number(offer.fulfillmentPeriodDuration) * 1000,
                redeemableFromDateInMS: Number(offer.redeemableFromDate) * 1000
              }
        }
        currency={currency}
      />
      <Spacer />
      <Actions>
        {voidOfferAvailable && (
          <PrimaryButton onClick={async () => setShowConfirmModal(true)}>
            Void Offer
          </PrimaryButton>
        )}
        <SecondaryButton
          style={{ width: !voidOfferAvailable ? "100%" : undefined }}
          onClick={async () => {
            const txResponse = await coreSDK.commitToOffer(
              offer ? offer.id : 1
            );
            const receipt = await txResponse.wait();
            console.log(receipt.logs);
            const exchangeId = coreSDK.getCommittedExchangeIdFromLogs(
              receipt.logs
            );
            console.log(exchangeId);
          }}
        >
          Withdraw
        </SecondaryButton>
      </Actions>
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
              const txResponse = await coreSDK.voidOffer(offerId);

              setTransaction({
                status: "pending",
                txHash: txResponse.hash
              });

              await txResponse.wait(1);

              reloadOfferData();
              setTransaction({
                status: "success",
                txHash: txResponse.hash,
                offerId: offerId
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
    </WidgetLayout>
  );
}
