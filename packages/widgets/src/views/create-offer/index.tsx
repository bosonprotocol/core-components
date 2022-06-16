import { useState } from "react";
import { constants } from "ethers";
import { WidgetWrapper } from "../../lib/components/WidgetWrapper";
import { StageIndicator } from "./StageIndicator";
import { useCoreSDK } from "../../lib/useCoreSDK";
import { Button } from "../../lib/components/Button";
import { Actions } from "../../lib/components/actions/shared-styles";
import { useCreateOfferData } from "./useCreateOfferData";
import { hooks } from "../../lib/connectors/metamask";
import { OfferDetails } from "../../lib/components/details/OfferDetails";
import { getMinimalFundsAmountNeeded } from "../../lib/funds";
import {
  TransactionModal,
  Transaction
} from "../../lib/components/modals/TransactionModal";
import { Spacer } from "../../lib/components/Spacer";

export default function CreateOffer() {
  const coreSDK = useCoreSDK();
  const account = hooks.useAccount();
  const [transaction, setTransaction] = useState<Transaction>({
    status: "idle"
  });

  const { data: createOfferData, reload: reloadCreateOfferData } =
    useCreateOfferData();

  if (createOfferData.status === "error") {
    return (
      <WidgetWrapper loadingStatus="error" error={createOfferData.error} />
    );
  }

  if (createOfferData.status === "loading") {
    return <WidgetWrapper loadingStatus="loading" />;
  }

  const { tokenInfo, createOfferArgs, metadata, seller } = createOfferData;

  const tokenApprovalNeeded = tokenInfo.allowance.lt(
    constants.MaxInt256.div(2)
  );
  const showDepositFundsButton =
    seller &&
    getMinimalFundsAmountNeeded({
      seller,
      sellerDeposit: createOfferArgs.sellerDeposit,
      exchangeToken: createOfferArgs.exchangeToken,
      quantity: createOfferArgs.quantityAvailable
    }).gt(0);

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

      const txReceipt = await txResponse.wait(2);
      const offerId = coreSDK.getCreatedOfferIdFromLogs(txReceipt.logs);

      setTransaction({
        status: "success",
        txHash: txResponse.hash,
        dataToPreview: {
          label: "Successfully created offer",
          value: `Offer ID: ${offerId}`
        }
      });

      reloadCreateOfferData();
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

      await txResponse.wait(2);

      setTransaction({
        status: "success",
        txHash: txResponse.hash,
        dataToPreview: {
          label: "Successfully approved token",
          value: ""
        }
      });

      reloadCreateOfferData();
    } catch (e) {
      setTransaction({
        status: "error",
        error: e as Error
      });
    }
  }

  async function handleDepositFunds() {
    try {
      if (!seller) {
        return;
      }

      const txResponse = await coreSDK.depositFunds(
        seller.id,
        getMinimalFundsAmountNeeded({
          seller,
          sellerDeposit: createOfferArgs.sellerDeposit,
          exchangeToken: createOfferArgs.exchangeToken,
          quantity: createOfferArgs.quantityAvailable
        }),
        createOfferArgs.exchangeToken
      );

      setTransaction({
        status: "pending",
        txHash: txResponse.hash
      });

      await txResponse.wait(2);

      setTransaction({
        status: "success",
        txHash: txResponse.hash,
        dataToPreview: {
          label: "Successfully deposited funds",
          value: ""
        }
      });

      reloadCreateOfferData();
    } catch (e) {
      setTransaction({
        status: "error",
        error: e as Error
      });
    }
  }

  return (
    <WidgetWrapper title="Create Offer" offerName={metadata?.name}>
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
        {showDepositFundsButton && (
          <Button onClick={handleDepositFunds}>Deposit Funds</Button>
        )}
      </Actions>
      <StageIndicator stage={tokenApprovalNeeded ? 1 : 2} />
      <TransactionModal
        transaction={transaction}
        onClose={() => setTransaction({ status: "idle" })}
      />
    </WidgetWrapper>
  );
}
