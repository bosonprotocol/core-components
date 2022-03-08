import { useState } from "react";
import styled from "styled-components";
import { WidgetLayout } from "../../lib/components/WidgetLayout";
import { StageIndicator } from "./StageIndicator";
import { TransactionProcessingModal } from "./TransactionProcessingModal";

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

const Button = styled.button`
  all: unset;
  user-select: none;
  width: 200px;
  background-color: #0ffbad;
  color: #333333;
  border: 2px solid #5e5e5e;
  padding: 8px 16px;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;

  ${(p) =>
    p.disabled &&
    `
    background-color: #ced4db;
    cursor: initial;
  `}
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

export function CreateOffer() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <WidgetLayout title="Create Offer" offerName="Baggy Jeans">
      <Row>
        <Entry>
          <Label>Price</Label>
          <Money>
            <Value>123456</Value>
            <Currency>ETH</Currency>
          </Money>
        </Entry>
        <Entry>
          <Label>Seller Deposit</Label>
          <Money>
            <Value>123456</Value>
            <Currency>ETH</Currency>
          </Money>
        </Entry>
      </Row>
      <Row>
        <Entry>
          <Label>Quantity</Label>
          <Value>123456</Value>
        </Entry>
        <Entry>
          <Label>Cancellation Penalty</Label>
          <Money>
            <Value>123456</Value>
            <Currency>ETH</Currency>
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
          <Value>...</Value>
        </Entry>
        <Entry>
          <Label>Valid Until</Label>
          <Value>...</Value>
        </Entry>
      </Row>
      <Row>
        <Entry>
          <Label>Redeemable By</Label>
          <Value>...</Value>
        </Entry>
        <Entry>
          <Label>Validity Duration</Label>
          <Value>...</Value>
        </Entry>
      </Row>
      <Row>
        <Entry>
          <Label>Dispute Period</Label>
          <Value>...</Value>
        </Entry>
        <Entry>
          <Label>Fulfilment Period</Label>
          <Value>...</Value>
        </Entry>
      </Row>
      <Spacer />
      <Row>
        <Entry>
          <Label>Metadata URI</Label>
          <Value>...</Value>
        </Entry>
        <Entry>
          <Label>Metadata Hash</Label>
          <Value>...</Value>
        </Entry>
      </Row>
      <Spacer />
      <Actions>
        <Button onClick={() => setIsLoading(true)}>Approve Tokens</Button>
        <Button disabled>Create Offer</Button>
      </Actions>
      <StageIndicator stage={1} />
      {isLoading && (
        <TransactionProcessingModal txHash="0x649e0d345e36bca92e237e097915118bbe37c5e3" />
      )}
    </WidgetLayout>
  );
}
