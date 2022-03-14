import { useEffect, useState } from "react";
import styled from "styled-components";
import { WidgetLayout } from "../../lib/components/WidgetLayout";
import { StageIndicator } from "./StageIndicator";
import { TransactionPendingModal } from "./modals/TransactionPendingModal";
import { offers } from "@bosonprotocol/core-sdk";
import { ethers } from "ethers";
import { useCoreSDK } from "../../lib/useCoreSDK";
import { useExchangeToken } from "../../lib/useExchangeToken";
import { hooks } from "../../lib/connectors/metamask";
import axios from "axios";
import { Button } from "./Button";
import { SuccessModal } from "./modals/SuccessModal";
import { ErrorModal } from "./modals/ErrorModal";
import { formatEther } from "ethers/lib/utils";

const columnGap = 24;

const Entry = styled.div`
  flex-grow: 1;
  max-width: calc(50% - ${columnGap / 2}px);
  display: inline-flex;
  align-items: center;
  vertical-align: top;
  margin-bottom: 10px;
`;

const Label = styled.div`
  font-weight: 500;
  display: inline-block;
  min-width: 140px;
  padding-right: 8px;
  font-size: 14px;
  user-select: none;
`;

const Value = styled.div`
  display: inline-block;
  padding: 4px 8px;
  border: 2px solid #5e5e5e;
  background-color: #ced4db;
  color: #333333;
  border-radius: 4px;
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

const Spacer = styled.div`
  height: 20px;
`;

const Row = styled.div`
  display: flex;
  gap: ${columnGap}px;
  min-width: 0;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${columnGap}px;
`;

const Money = styled.div`
  display: flex;
  flex-grow: 1;
  min-width: 0;

  ${Value} {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    border-right: none;
  }
`;

const Currency = styled.div`
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border: 2px solid #5e5e5e;
  background-color: #adb2b8;
  color: #333333;
  padding: 4px;
`;

function useMetadata(metadataUri: string) {
  const [metadata, setMetadata] = useState<Record<string, string>>();

  useEffect(() => {
    axios.get(metadataUri).then((resp) => setMetadata(resp.data));
  }, [metadataUri]);

  return metadata;
}

const BOSON_TOKEN = "0xf47E4fd9d2eBd6182F597eE12E487CcA37FC524c";

export function CreateOffer() {
  const urlParams = Object.fromEntries(
    new URLSearchParams(window.location.search).entries()
  );

  const account = hooks.useAccount();

  const createOfferArgs: offers.CreateOfferArgs = {
    price: urlParams["price"],
    deposit: urlParams["deposit"],
    penalty: urlParams["penalty"],
    quantity: urlParams["quantity"],
    validFromDateInMS: urlParams["validFromDateInMS"],
    validUntilDateInMS: urlParams["validUntilDateInMS"],
    redeemableDateInMS: urlParams["redeemableDateInMS"],
    fulfillmentPeriodDurationInMS: urlParams["fulfillmentPeriodDurationInMS"],
    voucherValidDurationInMS: urlParams["voucherValidDurationInMS"],
    seller: account ?? ethers.constants.AddressZero,
    exchangeToken: ethers.constants.AddressZero,
    metadataUri: urlParams["metadataUri"],
    metadataHash: urlParams["metadataHash"]
  };

  const metadata = useMetadata(createOfferArgs.metadataUri);

  const currency =
    createOfferArgs.exchangeToken === ethers.constants.AddressZero
      ? "ETH"
      : "UNKNOWN";
  const coreSDK = useCoreSDK();

  const { exchangeToken, isLoading, error } = useExchangeToken(
    BOSON_TOKEN, // TODO: properly use from field input / url query param
    coreSDK
  );
  console.log(exchangeToken, isLoading, error);

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

  return (
    <WidgetLayout title="Create Offer" offerName={metadata?.title ?? ""}>
      <Row>
        <Entry>
          <Label>Price</Label>
          <Money>
            <Value>{formatEther(createOfferArgs.price)}</Value>
            <Currency>{currency}</Currency>
          </Money>
        </Entry>
        <Entry>
          <Label>Seller Deposit</Label>
          <Money>
            <Value>{formatEther(createOfferArgs.deposit)}</Value>
            <Currency>{currency}</Currency>
          </Money>
        </Entry>
      </Row>
      <Row>
        <Entry>
          <Label>Quantity</Label>
          <Value>{createOfferArgs.quantity}</Value>
        </Entry>
        <Entry>
          <Label>Cancellation Penalty</Label>
          <Money>
            <Value>{formatEther(createOfferArgs.penalty)}</Value>
            <Currency>{currency}</Currency>
          </Money>
        </Entry>
      </Row>
      <Row>
        <Entry>
          <Label>Dispute Resolver</Label>
          <Value>...</Value>
        </Entry>
        <Entry />
      </Row>
      <Spacer />
      <Row>
        <Entry>
          <Label>Valid From</Label>
          <Value>{createOfferArgs.validFromDateInMS}</Value>
        </Entry>
        <Entry>
          <Label>Valid Until</Label>
          <Value>{createOfferArgs.validUntilDateInMS}</Value>
        </Entry>
      </Row>
      <Row>
        <Entry>
          <Label>Redeemable By</Label>
          <Value>{createOfferArgs.redeemableDateInMS}</Value>
        </Entry>
        <Entry>
          <Label>Validity Duration</Label>
          <Value>{createOfferArgs.voucherValidDurationInMS}</Value>
        </Entry>
      </Row>
      <Row>
        <Entry>
          <Label>Dispute Period</Label>
          <Value>...</Value>
        </Entry>
        <Entry>
          <Label>Fulfilment Period</Label>
          <Value>{createOfferArgs.fulfillmentPeriodDurationInMS}</Value>
        </Entry>
      </Row>
      <Spacer />
      <Row>
        <Entry>
          <Label>Metadata URI</Label>
          <Value>{createOfferArgs.metadataUri}</Value>
        </Entry>
        <Entry>
          <Label>Metadata Hash</Label>
          <Value>{createOfferArgs.metadataHash}</Value>
        </Entry>
      </Row>
      <Spacer />
      <Actions>
        <Button
          onClick={async () => {
            if (!coreSDK) {
              return;
            }

            const txResponse = await coreSDK.approveExchangeToken(
              BOSON_TOKEN,
              1
            );
            console.log(txResponse);

            const txReceipt = await txResponse.wait();
            console.log(txReceipt);
          }}
        >
          Approve Tokens
        </Button>
        <Button
          onClick={async () => {
            if (!coreSDK) return;

            console.log({ createOfferArgs });

            try {
              const txResponse = await coreSDK.createOffer(createOfferArgs);
              console.log({ txResponse });

              setTransaction({
                status: "pending",
                txHash: txResponse.hash
              });

              const txReceipt = await txResponse.wait(1);
              console.log({ txReceipt });

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
          }}
        >
          Create Offer
        </Button>
      </Actions>
      <StageIndicator stage={2} />
      {transaction.status === "pending" && (
        <TransactionPendingModal txHash={transaction.txHash} />
      )}
      {transaction.status === "success" && (
        <SuccessModal
          txHash={transaction.txHash}
          offerId={transaction.offerId}
          onClickClose={() => setTransaction({ status: "idle" })}
        />
      )}
      {transaction.status === "error" && (
        <ErrorModal
          error={transaction.error}
          onClickClose={() => setTransaction({ status: "idle" })}
        />
      )}
    </WidgetLayout>
  );
}
