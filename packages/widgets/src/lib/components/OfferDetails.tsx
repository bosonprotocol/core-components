import styled from "styled-components";
import { formatEther } from "ethers/lib/utils";
import { offers } from "@bosonprotocol/core-sdk";

export const columnGap = 24;

export const Value = styled.div`
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

export const Row = styled.div`
  display: flex;
  gap: ${columnGap}px;
  min-width: 0;
`;

export const Entry = styled.div`
  flex-grow: 1;
  max-width: calc(50% - ${columnGap / 2}px);
  display: inline-flex;
  align-items: center;
  vertical-align: top;
  margin-bottom: 10px;
`;

export const Label = styled.div`
  font-weight: 500;
  display: inline-block;
  min-width: 140px;
  padding-right: 8px;
  font-size: 14px;
  user-select: none;
`;

export const Spacer = styled.div`
  height: 20px;
`;

export const emptyOfferDetails = {
  deposit: "0",
  exchangeToken: "...",
  metadataHash: "...",
  metadataUri: "...",
  penalty: "0",
  price: "0",
  quantity: "0",
  seller: "...",
  validFromDateInMS: "0",
  validUntilDateInMS: "0",
  voucherValidDurationInMS: "0",
  fulfillmentPeriodDurationInMS: "0",
  redeemableDateInMS: "0"
};

interface Props {
  createOfferArgs: offers.CreateOfferArgs;
  currency: string;
}

export function OfferDetails({ createOfferArgs, currency }: Props) {
  return (
    <>
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
    </>
  );
}
