import { WidgetWrapper } from "../../lib/components/WidgetWrapper";
import {
  Entry,
  Label,
  Row,
  Spacer,
  Value
} from "../../lib/components/details/shared-styles";
import { getURLParams } from "../../lib/parseUrlParams";
import { SellerActions } from "./SellerActions";
import { useManageOfferData } from "./useManageOfferData";
import { hooks } from "../../lib/connectors/metamask";
import { BuyerActions } from "./BuyerActions";
import { OfferDetails } from "../../lib/components/details/OfferDetails";
import { ActionsWrapper } from "../../lib/components/actions/ActionsWrapper";
import { isAccountSeller } from "../../lib/seller";
import { AnyMetadata, offers } from "@bosonprotocol/core-sdk";
import { useMemo } from "react";
import { validation } from "@bosonprotocol/ipfs-storage";

export default function ManageOffer() {
  const { offerId, forceBuyerView } = getURLParams();
  const { offerData, reloadOfferData } = useManageOfferData(offerId);
  const isMetadataValid = useMemo(() => {
    if (offerData.status === "success" && offerData.offer.metadata) {
      return offerData.offer.metadata
        ? validation.validateMetadata(offerData.offer.metadata as AnyMetadata)
        : false;
    }
    return false;
  }, [offerData]);
  const account = hooks.useAccount();

  if (offerData.status === "error") {
    return (
      <WidgetWrapper
        loadingStatus="error"
        error={offerData.error}
        hideCloseButton
      />
    );
  }

  if (offerData.status === "loading") {
    return <WidgetWrapper loadingStatus="loading" hideCloseButton />;
  }

  const { offer } = offerData;
  const offerName = offer.metadata?.name ?? "";
  const uiStatus = isMetadataValid
    ? offers.getOfferStatus(offer)
    : `${offers.getOfferStatus(offer)} / UNSUPPORTED`;

  return (
    <WidgetWrapper title={"Offer"} offerName={offerName} hideCloseButton>
      <Row>
        <Entry>
          <Label>Offer ID</Label>
          <Value>{offer.id}</Value>
        </Entry>
        <Entry>
          <Label>Status</Label>
          <Value>{uiStatus}</Value>
        </Entry>
      </Row>
      <OfferDetails
        quantityAvailable={offer.quantityAvailable}
        quantityInitial={offer.quantityInitial}
        protocolFeeInWei={offer.protocolFee}
        currencySymbol={offer.exchangeToken.symbol}
        priceInWei={offer.price}
        buyerCancelPenaltyInWei={offer.buyerCancelPenalty}
        sellerDepositInWei={offer.sellerDeposit}
        validFromDateInMS={Number(offer.validFromDate) * 1000}
        validUntilDateInMS={Number(offer.validUntilDate) * 1000}
        voucherRedeemableFromDateInMS={
          Number(offer.voucherRedeemableFromDate) * 1000
        }
        voucherRedeemableUntilDateInMS={
          Number(offer.voucherRedeemableUntilDate) * 1000
        }
        voucherValidDurationInMS={Number(offer.voucherValidDuration) * 1000}
        fulfillmentPeriodInMS={offer.fulfillmentPeriodDuration}
        resolutionPeriodInMS={offer.resolutionPeriodDuration}
        metadataUri={offer.metadataUri}
      />
      <Spacer />
      <ActionsWrapper
        BuyerActions={
          <BuyerActions offer={offer} reloadOfferData={reloadOfferData} />
        }
        SellerActions={
          <SellerActions offer={offer} reloadOfferData={reloadOfferData} />
        }
        isSeller={
          isAccountSeller(account ?? "", offer.seller) && !forceBuyerView
        }
      />
    </WidgetWrapper>
  );
}
