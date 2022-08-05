import { useEffect, useState } from "react";
import { BigNumber, constants, utils } from "ethers";
import { WidgetWrapper } from "../../lib/components/WidgetWrapper";
import { StageIndicator } from "./StageIndicator";
import { useCoreSDK } from "../../lib/useCoreSDK";
import { Button } from "../../lib/components/Button";
import { Actions } from "../../lib/components/actions/shared-styles";
import { useCreateOfferData } from "./useCreateOfferData";
import { hooks } from "../../lib/connectors/metamask";
import { OfferDetails } from "../../lib/components/details/OfferDetails";
import { FundsDetails } from "../../lib/components/details/FundsDetails";
import {
  getMinimalFundsAmountNeeded,
  getAvailableFundsOfSeller
} from "../../lib/funds";
import {
  TransactionModal,
  Transaction
} from "../../lib/components/modals/TransactionModal";
import { Spacer } from "../../lib/components/Spacer";

enum CreateOfferStage {
  APPROVE_TOKEN = 0,
  CREATE_OFFER = 1,
  DEPOSIT_FUNDS = 2
}

export default function CreateOffer() {
  const coreSDK = useCoreSDK();
  const account = hooks.useAccount();
  const [transaction, setTransaction] = useState<Transaction>({
    status: "idle"
  });
  const [stage, setStage] = useState<CreateOfferStage>(
    CreateOfferStage.APPROVE_TOKEN
  );

  const {
    data: createOfferData,
    reload: reloadCreateOfferData,
    reloadCounter
  } = useCreateOfferData();

  useEffect(() => {
    if (
      createOfferData.status === "loaded" &&
      createOfferData.tokenInfo &&
      stage !== CreateOfferStage.DEPOSIT_FUNDS
    ) {
      const tokenApprovalNeeded = BigNumber.from(
        createOfferData.tokenInfo.allowance
      ).lt(constants.MaxInt256.div(2));

      setStage(
        tokenApprovalNeeded
          ? CreateOfferStage.APPROVE_TOKEN
          : CreateOfferStage.CREATE_OFFER
      );
    }
  }, [createOfferData, reloadCounter, stage]);

  if (createOfferData.status === "error") {
    return (
      <WidgetWrapper loadingStatus="error" error={createOfferData.error} />
    );
  }

  if (createOfferData.status === "loading") {
    return <WidgetWrapper loadingStatus="loading" />;
  }

  const { tokenInfo, createOfferArgs, metadata, seller } = createOfferData;
  const minRequiredFunds = seller
    ? getMinimalFundsAmountNeeded({
        seller,
        sellerDeposit: createOfferArgs.sellerDeposit,
        exchangeToken: createOfferArgs.exchangeToken,
        quantity: createOfferArgs.quantityAvailable
      })
    : "0";
  const availableFunds = seller
    ? getAvailableFundsOfSeller(seller, createOfferArgs.exchangeToken)
    : "0";

  async function handleCreateOffer() {
    try {
      const operatorAddress = account || seller?.operator || "";

      setTransaction({
        status: "awaiting-confirm"
      });

      const txResponse = seller
        ? await coreSDK.createOffer(createOfferArgs)
        : await coreSDK.createSellerAndOffer(
            {
              operator: operatorAddress,
              // TODO: Allow to set separate seller address values
              admin: operatorAddress,
              treasury: operatorAddress,
              clerk: operatorAddress,
              authTokenId: "0",
              authTokenType: 0,
              // TODO: Allow to set from url params
              contractUri: "ipfs://seller-contract-uri"
            },
            createOfferArgs
          );

      setTransaction({
        status: "pending",
        txHash: txResponse.hash
      });

      const txReceipt = await txResponse.wait();
      const offerId = coreSDK.getCreatedOfferIdFromLogs(txReceipt.logs);

      setTransaction({
        status: "success",
        txHash: txResponse.hash,
        message: "Successfully Created Offer",
        dataToPreview: {
          label: "Offer ID",
          value: String(offerId)
        }
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
      setTransaction({
        status: "awaiting-confirm"
      });

      const txResponse = await coreSDK.approveExchangeToken(
        createOfferArgs.exchangeToken,
        constants.MaxInt256.sub(createOfferArgs.sellerDeposit)
      );

      setTransaction({
        status: "pending",
        txHash: txResponse.hash
      });

      await txResponse.wait();

      setTransaction({
        status: "success",
        txHash: txResponse.hash,
        message: "Successfully Approved Token",
        dataToPreview: {
          label: "Token Address",
          value: createOfferArgs.exchangeToken
        }
      });
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

      setTransaction({
        status: "awaiting-confirm"
      });

      const depositAmount = BigNumber.from(
        createOfferArgs.quantityAvailable
      ).mul(createOfferArgs.sellerDeposit);

      const txResponse = await coreSDK.depositFunds(
        seller.id,
        depositAmount,
        createOfferArgs.exchangeToken
      );

      setTransaction({
        status: "pending",
        txHash: txResponse.hash
      });

      await txResponse.wait();

      setTransaction({
        status: "success",
        txHash: txResponse.hash,
        message: "Successfully Deposited Funds",
        dataToPreview: {
          label: "Amount",
          value: `${utils.formatUnits(depositAmount, tokenInfo.decimals)} ${
            tokenInfo.symbol
          }`
        }
      });
    } catch (e) {
      setTransaction({
        status: "error",
        error: e as Error
      });
    }
  }

  function handleCloseTxModal() {
    if (transaction.status !== "error") {
      setStage((prevState) => (prevState + 1) % 3);
    }

    if (stage !== CreateOfferStage.CREATE_OFFER) {
      reloadCreateOfferData();
    }

    setTransaction({ status: "idle" });
  }

  return (
    <WidgetWrapper title="Create Offer" offerName={metadata?.name}>
      {stage === CreateOfferStage.DEPOSIT_FUNDS ? (
        <FundsDetails
          currencySymbol={tokenInfo.symbol}
          currencyDecimals={tokenInfo.decimals}
          availableFundsInWei={availableFunds}
          minRequiredFundsInWei={minRequiredFunds}
        />
      ) : (
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
          metadataHash={createOfferArgs.metadataHash}
          fulfillmentPeriodInMS={createOfferArgs.fulfillmentPeriodDurationInMS}
          resolutionPeriodInMS={createOfferArgs.resolutionPeriodDurationInMS}
        />
      )}

      <Spacer />
      <Actions>
        <Button
          disabled={stage !== CreateOfferStage.APPROVE_TOKEN}
          onClick={handleTokenApproval}
        >
          Approve Tokens
        </Button>
        <Button
          disabled={stage !== CreateOfferStage.CREATE_OFFER}
          onClick={handleCreateOffer}
        >
          Create Offer
        </Button>
        <Button
          disabled={stage !== CreateOfferStage.DEPOSIT_FUNDS}
          onClick={handleDepositFunds}
        >
          Deposit Funds
        </Button>
      </Actions>
      <StageIndicator stage={stage + 1} />
      <TransactionModal
        transaction={transaction}
        onClose={handleCloseTxModal}
      />
    </WidgetWrapper>
  );
}
