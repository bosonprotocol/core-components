import styled from "styled-components";
import { WidgetLayout } from "../../lib/components/WidgetLayout";

const Entry = styled.div`
  width: 50%;
  display: inline-flex;
  align-items: center;
  vertical-align: top;
  margin-bottom: 10px;
`;

const Label = styled.div`
  font-weight: 500;
  display: inline-block;
  width: 140px;
  text-align: right;
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

  & + & {
    margin-left: 24px;
  }

  ${(p) =>
    p.disabled &&
    `
    background-color: #ced4db;
    cursor: initial;
  `}
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
`;

export function CreateOffer() {
  return (
    <WidgetLayout title="Create Offer" offerName="Baggy Jeans">
      <Entry>
        <Label>Price</Label>
        <Value>...</Value>
      </Entry>
      <Entry>
        <Label>Seller Deposit</Label>
        <Value>...</Value>
      </Entry>
      <Entry>
        <Label>Quantity</Label>
        <Value>...</Value>
      </Entry>
      <Entry>
        <Label>Cancellation Penalty</Label>
        <Value>...</Value>
      </Entry>
      <Entry>
        <Label>Dispute Resolver</Label>
        <Value>...</Value>
      </Entry>
      <Spacer />
      <Entry>
        <Label>Valid From</Label>
        <Value>...</Value>
      </Entry>
      <Entry>
        <Label>Valid Until</Label>
        <Value>...</Value>
      </Entry>
      <Entry>
        <Label>Redeemable By</Label>
        <Value>...</Value>
      </Entry>
      <Entry>
        <Label>Validity Duration</Label>
        <Value>...</Value>
      </Entry>
      <Entry>
        <Label>Dispute Period</Label>
        <Value>...</Value>
      </Entry>
      <Entry>
        <Label>Fulfilment Period</Label>
        <Value>...</Value>
      </Entry>
      <Spacer />
      <Entry>
        <Label>Metadata URI</Label>
        <Value>...</Value>
      </Entry>
      <Entry>
        <Label>Metadata Hash</Label>
        <Value>...</Value>
      </Entry>
      <Spacer />
      <Actions>
        <Button>Approve Tokens</Button>
        <Button disabled>Create Offer</Button>
      </Actions>
    </WidgetLayout>
  );
}
