import { WidgetLayout } from "../../lib/components/WidgetLayout";
import {
  Entry,
  Label,
  OfferDetails,
  Row,
  Spacer,
  Value
} from "../../lib/components/OfferDetails";
import { ErrorModal } from "../../lib/components/modals/ErrorModal";
import styled from "styled-components";
import { getURLParams } from "../../lib/parseUrlParams";
import { colors } from "../../lib/colors";
import { SpinnerCircular } from "spinners-react";
import { closeWidget } from "../../lib/closeWidget";
import { SellerActions } from "./SellerActions";
import { getOfferStatus } from "./getOfferStatus";
import { useManageOfferData } from "./useManageOfferData";
import { hooks } from "../../lib/connectors/metamask";
import { BuyerActions } from "./BuyerActions";
import { Actions, SecondaryButton } from "./shared-styles";
import { connectWallet } from "../../lib/connectWallet";
import { offers } from "@bosonprotocol/core-sdk";

const Center = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
`;

const ConnectButton = styled(SecondaryButton)`
  width: 100%;
`;

function isAccountSeller(offer: offers.RawOfferFromSubgraph, account: string) {
  if (offer.seller.clerk.toLowerCase() === account.toLowerCase()) return true;
  if (offer.seller.operator.toLowerCase() === account.toLowerCase())
    return true;
  return false;
}

export default function ManageOffer() {
  const { offerId, forceBuyerView } = getURLParams();
  const { offerData, reloadOfferData } = useManageOfferData(offerId);
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

  return (
    <WidgetLayout
      hideCloseButton
      title={isSeller ? "Manage Offer" : "Offer"}
      offerName={offer.metadata?.name ?? ""}
    >
      <Row>
        <Entry>
          <Label>Offer ID</Label>
          <Value>{offer.id}</Value>
        </Entry>
        <Entry>
          <Label>Status</Label>
          <Value>{getOfferStatus(offer)}</Value>
        </Entry>
      </Row>
      <OfferDetails
        createOfferArgs={{
          sellerDeposit: offer.sellerDeposit,
          exchangeToken: offer.exchangeToken.address,
          offerChecksum: offer.offerChecksum,
          metadataUri: offer.metadataUri,
          buyerCancelPenalty: offer.buyerCancelPenalty,
          price: offer.price,
          quantityAvailable: offer.quantityAvailable,
          validFromDateInMS: Number(offer.validFromDate) * 1000,
          validUntilDateInMS: Number(offer.validUntilDate) * 1000,
          voucherValidDurationInMS: Number(offer.voucherValidDuration) * 1000,
          fulfillmentPeriodDurationInMS:
            Number(offer.fulfillmentPeriodDuration) * 1000,
          redeemableFromDateInMS: Number(offer.redeemableFromDate) * 1000
        }}
        currency={offer.exchangeToken.symbol}
      />
      <Spacer />
      {!account ? (
        <Actions>
          <ConnectButton onClick={connectWallet}>Connect Wallet</ConnectButton>
        </Actions>
      ) : isSeller ? (
        <SellerActions offer={offer} reloadOfferData={reloadOfferData} />
      ) : (
        <BuyerActions offer={offer} reloadOfferData={reloadOfferData} />
      )}
    </WidgetLayout>
  );
}
