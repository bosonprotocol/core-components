import { ethers } from "ethers";
import { CreateOfferArgs, PriceType } from "@bosonprotocol/common";
import { offers, subgraph } from "@bosonprotocol/core-sdk";
import { useEffect, useState } from "react";
import { ProgressStatus } from "../lib/progress/progressStatus";
import { useCoreSDKWithContext } from "./core-sdk/useCoreSdkWithContext";

import { useIpfsStorage } from "./useIpfsStorage";

type OfferFieldsFragment = subgraph.OfferFieldsFragment;
type AdditionalOfferMetadata = offers.AdditionalOfferMetadata;
type ProductV1MetadataFields = subgraph.ProductV1MetadataEntity;

export function useRenderTemplate(
  offerId: string | undefined,
  offerData: OfferFieldsFragment | undefined,
  templateUrl: string
) {
  const [renderStatus, setRenderStatus] = useState<ProgressStatus>(
    ProgressStatus.IDLE
  );
  const [renderResult, setRenderResult] = useState<string>("");
  const ipfsMetadataStorage = useIpfsStorage();
  const coreSDK = useCoreSDKWithContext();

  useEffect(() => {
    async function fetchTemplate() {
      setRenderStatus(ProgressStatus.LOADING);
      if (ipfsMetadataStorage && coreSDK) {
        try {
          const rawTemplate = (await ipfsMetadataStorage.get<Uint8Array>(
            templateUrl,
            false,
            false
          )) as Uint8Array;
          const template = Buffer.from(rawTemplate).toString("utf-8");
          let theOfferData = offerData;
          // If the offerData is not specified, retrieve the data from offerId
          if (!offerData) {
            if (!offerId) {
              throw new Error("OfferData or OfferId needs to be defined");
            }
            // Get the offer fields from subgraph
            theOfferData = await coreSDK.getOfferById(offerId);
          }
          // Convert offer fields format to offer data format
          const { offerArgs, offerMetadata } = buildOfferData(
            theOfferData as OfferFieldsFragment
          );
          const result = await coreSDK.renderContractualAgreement(
            template,
            offerArgs,
            offerMetadata
          );
          setRenderResult(result);
          setRenderStatus(ProgressStatus.SUCCESS);
        } catch (e) {
          console.error(e);
          setRenderStatus(ProgressStatus.ERROR);
        }
      }
    }
    if (
      renderStatus !== ProgressStatus.SUCCESS &&
      renderStatus !== ProgressStatus.ERROR
    ) {
      fetchTemplate();
    }
  }, [
    templateUrl,
    offerId,
    offerData,
    renderStatus,
    ipfsMetadataStorage,
    coreSDK
  ]);
  return { renderStatus, renderResult };
}

function buildOfferData(offerFields: OfferFieldsFragment): {
  offerArgs: CreateOfferArgs;
  offerMetadata: AdditionalOfferMetadata;
} {
  return {
    offerArgs: {
      price: offerFields.price as string,
      sellerDeposit: offerFields.sellerDeposit as string,
      agentId: offerFields.agentId as string,
      buyerCancelPenalty: offerFields.buyerCancelPenalty as string,
      quantityAvailable: offerFields.quantityAvailable as string,
      validFromDateInMS: ethers.BigNumber.from(offerFields.validFromDate)
        .mul(1000)
        .toString(),
      validUntilDateInMS: ethers.BigNumber.from(offerFields.validUntilDate)
        .mul(1000)
        .toString(),
      voucherRedeemableFromDateInMS: ethers.BigNumber.from(
        offerFields.voucherRedeemableFromDate
      )
        .mul(1000)
        .toString(),
      voucherRedeemableUntilDateInMS: ethers.BigNumber.from(
        offerFields.voucherRedeemableUntilDate
      )
        .mul(1000)
        .toString(),
      disputePeriodDurationInMS: ethers.BigNumber.from(
        offerFields.disputePeriodDuration
      )
        .mul(1000)
        .toString(),
      resolutionPeriodDurationInMS: ethers.BigNumber.from(
        offerFields.resolutionPeriodDuration
      )
        .mul(1000)
        .toString(),
      exchangeToken: offerFields.exchangeToken.address as string,
      disputeResolverId: offerFields.disputeResolverId as string,
      metadataHash: offerFields.metadataHash as string,
      metadataUri: offerFields.metadataUri as string,
      collectionIndex: offerFields.collectionIndex || 0,
      feeLimit: offerFields.price, // feeLimit is never stored on-chain. By default, set it to offer price
      priceType: PriceType.Static,
      royaltyInfo: {
        recipients: [ethers.constants.AddressZero], // AddressZero means Seller's treasury account
        bps: ["0"] // Values should be greater or equal than Seller's minimum royalty amount
      }
    },
    offerMetadata: {
      sellerContactMethod:
        (offerFields.metadata as ProductV1MetadataFields)?.exchangePolicy
          ?.sellerContactMethod || "undefined",
      disputeResolverContactMethod:
        (offerFields.metadata as ProductV1MetadataFields)?.exchangePolicy
          ?.disputeResolverContactMethod || "undefined",
      escalationDeposit:
        offerFields.disputeResolutionTerms.buyerEscalationDeposit,
      escalationResponsePeriodInSec:
        offerFields.disputeResolutionTerms.escalationResponsePeriod,
      sellerTradingName:
        (offerFields.metadata as ProductV1MetadataFields)?.productV1Seller
          ?.name || "undefined",
      returnPeriodInDays:
        (offerFields.metadata as ProductV1MetadataFields)?.shipping
          ?.returnPeriodInDays || 0
    }
  };
}
