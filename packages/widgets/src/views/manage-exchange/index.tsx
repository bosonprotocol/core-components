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
import { useManageExchangeData } from "./useManageExchangeData";
import { hooks } from "../../lib/connectors/metamask";
import { BuyerActions } from "./BuyerActions";
import { OfferDetails } from "../../lib/components/details/OfferDetails";
import { isAccountSeller } from "../../lib/seller";
import { ActionsWrapper } from "../../lib/components/actions/ActionsWrapper";

export default function ManageExchange() {
  const { forceBuyerView, exchangeId } = getURLParams();
  const { exchangeData, reloadExchangeData } =
    useManageExchangeData(exchangeId);
  const account = hooks.useAccount();

  if (exchangeData.status === "error") {
    return <WidgetWrapper loadingStatus="error" error={exchangeData.error} />;
  }

  if (exchangeData.status === "loading") {
    return <WidgetWrapper loadingStatus="loading" />;
  }

  const { exchange } = exchangeData;
  const { offer } = exchange;

  const offerName = offer.metadata?.name || "";

  return (
    <WidgetWrapper title="Exchange" offerName={offerName}>
      <Row>
        <Entry>
          <Label>Exchange ID</Label>
          <Value>{exchangeId}</Value>
        </Entry>
        <Entry>
          <Label>Status</Label>
          <Value>{exchange.state}</Value>
        </Entry>
      </Row>
      <OfferDetails
        name={offerName}
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
        fulfillmentPeriodInMS={offer.fulfillmentPeriodDuration}
        resolutionPeriodInMS={offer.resolutionPeriodDuration}
        metadataUri={offer.metadataUri}
      />
      <Spacer />
      <ActionsWrapper
        BuyerActions={
          <BuyerActions
            exchange={exchange}
            reloadExchangeData={reloadExchangeData}
          />
        }
        SellerActions={
          <SellerActions
            exchange={exchange}
            reloadExchangeData={reloadExchangeData}
          />
        }
        isSeller={
          isAccountSeller(account ?? "", offer.seller) && !forceBuyerView
        }
      />
    </WidgetWrapper>
  );
}
