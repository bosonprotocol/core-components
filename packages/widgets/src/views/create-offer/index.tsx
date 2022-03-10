import { useEffect, useState } from "react";
import styled from "styled-components";
import { WidgetLayout } from "../../lib/components/WidgetLayout";
import { StageIndicator } from "./StageIndicator";
import { TransactionProcessingModal } from "./TransactionProcessingModal";
import { CoreSDK, offers } from "@bosonprotocol/core-sdk";
import { EthersAdapter } from "@bosonprotocol/ethers-sdk";
import { IpfsMetadata } from "@bosonprotocol/ipfs-storage";
import { ethers } from "ethers";

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

// TODO: get from url params
const staticCreateOfferArgs: offers.CreateOfferArgs = {
  price: 1,
  deposit: 2,
  penalty: 3,
  quantity: 10,
  validFromDateInMS: Date.now() + 24 * 60 * 60 * 1000,
  validUntilDateInMS: Date.now() + 48 * 60 * 60 * 1000,
  redeemableDateInMS: Date.now() + 48 * 60 * 60 * 1000,
  fulfillmentPeriodDurationInMS: 24 * 60 * 60 * 1000,
  voucherValidDurationInMS: 24 * 60 * 60 * 1000,
  seller: ethers.constants.AddressZero, // TODO: replace dynamically with connected wallet
  exchangeToken: ethers.constants.AddressZero,
  metadataUri:
    "https://ipfs.io/ipfs/QmUttPYRg6mgDAzpjBjMTCvmfsqcgD6UpXj5PRqjvj6nT6",
  metadataHash: "QmUttPYRg6mgDAzpjBjMTCvmfsqcgD6UpXj5PRqjvj6nT6"
};

export function CreateOffer() {
  const urlParams = Object.fromEntries(
    new URLSearchParams(window.location.search).entries()
  );

  const {
    title,
    price,
    deposit,
    penalty,
    quantity,
    validFromDateInMS,
    validUntilDateInMS,
    redeemableDateInMS,
    fulfillmentPeriodDurationInMS,
    voucherValidDurationInMS,
    exchangeToken,
    metadataUri,
    metadataHash
  } = urlParams;

  const [isLoading, setIsLoading] = useState(false);
  const [coreSDK, setCoreSDK] = useState<null | CoreSDK>(null);

  useEffect(() => {
    if (window.ethereum) {
      CoreSDK.fromDefaultConfig({
        chainId: 3,
        web3Lib: new EthersAdapter({
          signer: new ethers.providers.Web3Provider(
            window.ethereum // TODO: replace with provider from web3-react
          ).getSigner()
        }),
        metadataStorage: new IpfsMetadata({
          url: "https://ipfs.infura.io:5001"
        }),
        theGraphStorage: IpfsMetadata.fromTheGraphIpfsUrl()
      })
        .then(setCoreSDK)
        .catch((e) => console.log("failed to init core-sdk", e));
    }
  }, []);

  return (
    <WidgetLayout title="Create Offer" offerName={title}>
      <Row>
        <Entry>
          <Label>Price</Label>
          <Money>
            <Value>{price}</Value>
            <Currency>{exchangeToken}</Currency>
          </Money>
        </Entry>
        <Entry>
          <Label>Seller Deposit</Label>
          <Money>
            <Value>{deposit}</Value>
            <Currency>{exchangeToken}</Currency>
          </Money>
        </Entry>
      </Row>
      <Row>
        <Entry>
          <Label>Quantity</Label>
          <Value>{quantity}</Value>
        </Entry>
        <Entry>
          <Label>Cancellation Penalty</Label>
          <Money>
            <Value>{penalty}</Value>
            <Currency>{exchangeToken}</Currency>
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
          <Value>{validFromDateInMS}</Value>
        </Entry>
        <Entry>
          <Label>Valid Until</Label>
          <Value>{validUntilDateInMS}</Value>
        </Entry>
      </Row>
      <Row>
        <Entry>
          <Label>Redeemable By</Label>
          <Value>{redeemableDateInMS}</Value>
        </Entry>
        <Entry>
          <Label>Validity Duration</Label>
          <Value>{fulfillmentPeriodDurationInMS}</Value>
        </Entry>
      </Row>
      <Row>
        <Entry>
          <Label>Dispute Period</Label>
          <Value>{voucherValidDurationInMS}</Value>
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
          <Value>{metadataUri}</Value>
        </Entry>
        <Entry>
          <Label>Metadata Hash</Label>
          <Value>{metadataHash}</Value>
        </Entry>
      </Row>
      <Spacer />
      <Actions>
        <Button onClick={() => setIsLoading(true)}>Approve Tokens</Button>
        <Button
          onClick={async () => {
            if (coreSDK) {
              const txResponse = await coreSDK.createOffer(
                staticCreateOfferArgs
              );
              console.log("txResponse", txResponse);
              const txReceipt = await txResponse.wait(1);
              console.log("txReceipt", txReceipt);
            }
          }}
        >
          Create Offer
        </Button>
      </Actions>
      <StageIndicator stage={1} />
      {isLoading && (
        <TransactionProcessingModal txHash="0x649e0d345e36bca92e237e097915118bbe37c5e3" />
      )}
    </WidgetLayout>
  );
}
