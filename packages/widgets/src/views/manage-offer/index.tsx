import { WidgetLayout } from "../../lib/components/WidgetLayout";
import {
  Entry,
  Label,
  Row,
  Spacer,
  Value
} from "../../lib/components/details/shared-styles";
import { ErrorModal } from "../../lib/components/modals/ErrorModal";
import styled from "styled-components";
import { getURLParams } from "../../lib/parseUrlParams";
import { colors } from "../../lib/colors";
import { SpinnerCircular } from "spinners-react";
import { closeWidget } from "../../lib/closeWidget";
import { SellerActions } from "./SellerActions";
import { getOfferStatus, OfferState } from "./getOfferStatus";
import { useManageOfferData } from "./useManageOfferData";
import { hooks } from "../../lib/connectors/metamask";
import { BuyerActions } from "./BuyerActions";
import { Actions, SecondaryButton } from "./shared-styles";
import { connectWallet } from "../../lib/connectWallet";
import { subgraph } from "@bosonprotocol/core-sdk";
import { getConfig } from "../../lib/config";
import { OfferDetails } from "../../lib/components/details/OfferDetails";

const Center = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
`;

const ConnectButton = styled(SecondaryButton)`
  width: 100%;
`;

function isAccountSeller(offer: subgraph.OfferFieldsFragment, account: string) {
  if (offer.seller.clerk.toLowerCase() === account.toLowerCase()) return true;
  if (offer.seller.operator.toLowerCase() === account.toLowerCase())
    return true;
  return false;
}

export default function ManageOffer() {
  const { offerId, forceBuyerView, exchangeId } = getURLParams();
  const { offerData, reloadOfferData } = useManageOfferData(offerId);
  const { chainId } = getConfig();
  const account = hooks.useAccount();

  if (offerData.status === "error")
    return (
      <WidgetLayout title="" offerName="" hideWallet hideCloseButton>
        <ErrorModal message={offerData.error.message} onClose={closeWidget} />
      </WidgetLayout>
    );

  if (offerData.status === "loading")
    return (
      <WidgetLayout title="" offerName="" hideWallet hideCloseButton>
        <Center>
          <SpinnerCircular className="" size={80} color={colors.satinWhite} />
        </Center>
      </WidgetLayout>
    );

  const { offer } = offerData;

  const isSeller = isAccountSeller(offer, account ?? "") && !forceBuyerView;
  const offerStatus = getOfferStatus(offer, exchangeId);
  const isExchange = [OfferState.COMMITTED].includes(offerStatus); // TODO: refactor into own view
  const title = isExchange ? "Exchange" : "Offer"; // TODO: refactor into own view
  const offerName = offer.metadata?.name ?? "";
  return (
    <WidgetLayout
      hideCloseButton
      title={title}
      offerName={isExchange ? "" : offerName}
    >
      <Row>
        <Entry>
          <Label>{title} ID</Label>
          <Value>{isExchange ? exchangeId : offer.id}</Value>
        </Entry>
        <Entry>
          <Label>Status</Label>
          <Value>{offerStatus}</Value>
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
      {!account ? (
        <Actions>
          <ConnectButton onClick={() => connectWallet(chainId)}>
            Connect Wallet
          </ConnectButton>
        </Actions>
      ) : isSeller ? (
        <SellerActions
          offer={offer}
          reloadOfferData={reloadOfferData}
          exchangeId={isExchange ? exchangeId : null}
        />
      ) : (
        <BuyerActions
          offer={offer}
          reloadOfferData={reloadOfferData}
          exchangeId={isExchange ? exchangeId : null}
        />
      )}
    </WidgetLayout>
  );
}
