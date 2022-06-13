import { useState } from "react";
import styled from "styled-components";
import { WidgetLayout } from "../../lib/components/WidgetLayout";
import { StageIndicator } from "./StageIndicator";
import { TransactionPendingModal } from "../../lib/components/modals/TransactionPendingModal";
import { useCoreSDK } from "../../lib/useCoreSDK";
import { Button } from "../../lib/components/Button";
import { SuccessModal } from "../../lib/components/modals/SuccessModal";
import { ErrorModal } from "../../lib/components/modals/ErrorModal";
import { constants } from "ethers";
import { columnGap } from "../../lib/components/details/shared-styles";
import { useCreateOfferData, ValidationError } from "./useCreateOfferData";
import { SpinnerCircular } from "spinners-react";
import { hooks } from "../../lib/connectors/metamask";
import { closeWidget } from "../../lib/closeWidget";
import { colors } from "../../lib/colors";
import { OfferDetails } from "../../lib/components/details/OfferDetails";

const Spacer = styled.div`
  height: 20px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${columnGap}px;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
`;

function formatErrorMessage(error: Error | ValidationError) {
  if (error.name === "ValidationError") {
    const err = error as ValidationError;
    return JSON.stringify(
      { providedValue: err.value, validationError: err.errors },
      null,
      2
    );
  }

  return error.message;
}

export default function CreateOffer() {
  const coreSDK = useCoreSDK();
  const account = hooks.useAccount();
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

  const { data: createOfferData, reload: reloadCreateOfferData } =
    useCreateOfferData();

  if (createOfferData.status === "error")
    return (
      <WidgetLayout title="" offerName="" hideWallet>
        <ErrorModal
          message={formatErrorMessage(createOfferData.error)}
          onClose={closeWidget}
        />
      </WidgetLayout>
    );

  if (createOfferData.status === "loading")
    return (
      <WidgetLayout title="" offerName="" hideWallet>
        <Center>
          <SpinnerCircular className="" size={80} color={colors.satinWhite} />
        </Center>
      </WidgetLayout>
    );

  const { tokenInfo, createOfferArgs, metadata, seller } = createOfferData;

  const tokenApprovalNeeded = tokenInfo.allowance.lt(
    constants.MaxInt256.div(2)
  );

  async function handleCreateOffer() {
    try {
      const operatorAddress = account || seller?.operator || "";

      const txResponse = seller
        ? await coreSDK.createOffer(createOfferArgs)
        : await coreSDK.createSellerAndOffer(
            {
              operator: operatorAddress,
              // TODO: Allow to set separate seller address values
              admin: operatorAddress,
              treasury: operatorAddress,
              clerk: operatorAddress
            },
            createOfferArgs
          );

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
  }

  async function handleTokenApproval() {
    try {
      const txResponse = await coreSDK.approveExchangeToken(
        createOfferArgs.exchangeToken,
        constants.MaxInt256.sub(createOfferArgs.sellerDeposit)
      );

      setTransaction({
        status: "pending",
        txHash: txResponse.hash
      });

      await txResponse.wait();

      reloadCreateOfferData();
      setTransaction({ status: "idle" });
    } catch (e) {
      setTransaction({
        status: "error",
        error: e as Error
      });
    }
  }

  return (
    <WidgetLayout title="Create Offer" offerName={metadata?.name}>
      <OfferDetails
        currencySymbol={tokenInfo.symbol}
        currencyDecimals={tokenInfo.decimals}
        priceInWei={createOfferArgs.price}
        quantityAvailable={createOfferArgs.quantityAvailable}
        buyerCancelPenaltyInWei={createOfferArgs.buyerCancelPenalty}
        sellerDepositInWei={createOfferArgs.sellerDeposit}
        validFromDateInMS={createOfferArgs.validFromDateInMS}
        validUntilDateInMS={createOfferArgs.validUntilDateInMS}
        voucherRedeemableFromDateInMS={
          createOfferArgs.voucherRedeemableFromDateInMS
        }
        voucherRedeemableUntilDateInMS={
          createOfferArgs.voucherRedeemableUntilDateInMS
        }
        metadataUri={createOfferArgs.metadataUri}
        offerChecksum={createOfferArgs.offerChecksum}
        protocolFeeInWei={createOfferArgs.protocolFee}
        fulfillmentPeriodInMS={createOfferArgs.fulfillmentPeriodDurationInMS}
        resolutionPeriodInMS={createOfferArgs.resolutionPeriodDurationInMS}
      />
      <Spacer />
      <Actions>
        <Button disabled={!tokenApprovalNeeded} onClick={handleTokenApproval}>
          Approve Tokens
        </Button>
        <Button disabled={tokenApprovalNeeded} onClick={handleCreateOffer}>
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
          dataToPreview={{ label: "Offer ID", value: transaction.offerId }}
          onClose={() => setTransaction({ status: "idle" })}
        />
      )}
      {transaction.status === "error" && (
        <ErrorModal
          message={formatErrorMessage(transaction.error)}
          onClose={() => setTransaction({ status: "idle" })}
        />
      )}
    </WidgetLayout>
  );
}
