import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CreateOfferButton } from "../../../components/cta/offer/CreateOfferButton";

import { hooks } from "../../helpers/connect-wallet";
import { CtaButtonWrapper } from "../../helpers/CtaButtonWrapper";
import { AuthTokenType } from "@bosonprotocol/common";

export default {
  title: "Visual Components/CTA/Offer/CreateOfferButton",
  component: CreateOfferButton
} as ComponentMeta<typeof CreateOfferButton>;

const Template: ComponentStory<typeof CreateOfferButton> = (args) => {
  const provider = hooks.useProvider();
  return (
    <CtaButtonWrapper>
      <CreateOfferButton web3Provider={provider} {...args} />
    </CtaButtonWrapper>
  );
};

export const Simple: ComponentStory<typeof CreateOfferButton> = Template.bind(
  {}
);
export const WithStep: ComponentStory<typeof CreateOfferButton> = Template.bind(
  {}
);

Simple.args = {
  envName: "testing",
  hasSellerAccount: true,
  sellerInfo: {
    operator: "",
    admin: "",
    clerk: "",
    treasury: "",
    contractUri: "ipfs://sample",
    royaltyPercentage: "0",
    authTokenId: "0",
    authTokenType: AuthTokenType.NONE
  },
  isMultiVariant: true,
  web3Provider: undefined,
  ipfsMetadataStorageHeaders: {
    authorization: ""
  },
  extraInfo: "",
  disabled: false,
  offersToCreate: [
    {
      price: "100000000000000000",
      sellerDeposit: "10000000000000000",
      buyerCancelPenalty: "10000000000000000",
      quantityAvailable: 2,
      voucherRedeemableFromDateInMS: "1666908000000",
      voucherRedeemableUntilDateInMS: "1667257140000",
      voucherValidDurationInMS: 0,
      validFromDateInMS: "1666994400000",
      validUntilDateInMS: "1667257140000",
      disputePeriodDurationInMS: "2592000000",
      resolutionPeriodDurationInMS: "1296000000",
      exchangeToken: "0x0000000000000000000000000000000000000000",
      disputeResolverId: "3",
      agentId: 0,
      metadataUri: "ipfs://QmT5qbKLcowzmzunzrknUXzC5V8Ykq5edXr96cwD2rP2KE",
      metadataHash: "QmT5qbKLcowzmzunzrknUXzC5V8Ykq5edXr96cwD2rP2KE"
    },
    {
      price: "100000000000000000",
      sellerDeposit: "10000000000000000",
      buyerCancelPenalty: "10000000000000000",
      quantityAvailable: 10,
      voucherRedeemableFromDateInMS: "1666908000000",
      voucherRedeemableUntilDateInMS: "1667257140000",
      voucherValidDurationInMS: 0,
      validFromDateInMS: "1666994400000",
      validUntilDateInMS: "1667257140000",
      disputePeriodDurationInMS: "2592000000",
      resolutionPeriodDurationInMS: "1296000000",
      exchangeToken: "0x0000000000000000000000000000000000000000",
      disputeResolverId: "3",
      agentId: 0,
      metadataUri: "ipfs://Qmbj7y32TfsPbAKT6aGSPupPXoeBGCqHspHBbPhdnchRBf",
      metadataHash: "Qmbj7y32TfsPbAKT6aGSPupPXoeBGCqHspHBbPhdnchRBf"
    }
  ],
  onPendingSignature: () => {
    console.log("----------ON PENDING SIGNATURE-------------");
  },
  onPendingTransaction: (txHash: string) => {
    console.log("----------ON PENDING TRANSACTION-------------");
    console.log("txHash", txHash);
  },
  onSuccess: (receipt, payload) => {
    console.log("----------ON SUCCESS-------------");
    console.log("receipt", receipt);
    console.log("payload", payload);
  },
  onError: (error) => {
    console.log("----------ON ERROR-------------");
    console.log("error", error);
  }
};

WithStep.args = {
  envName: "testing",
  hasSellerAccount: true,
  sellerInfo: {
    operator: "0x4c9c92860153ca658b2a55c9250c2bc53f11db8b",
    admin: "0x0000000000000000000000000000000000000000",
    clerk: "0x4c9c92860153ca658b2a55c9250c2bc53f11db8b",
    treasury: "0x4c9c92860153ca658b2a55c9250c2bc53f11db8b",
    contractUri: "ipfs://sample",
    royaltyPercentage: "0",
    authTokenId: "0",
    authTokenType: AuthTokenType.NONE
  },
  web3Provider: undefined,
  ipfsMetadataStorageHeaders: {
    authorization: "change-me"
  },
  extraInfo: "Step 1",
  disabled: false,
  offersToCreate: [
    {
      price: "100000000000000000",
      sellerDeposit: "10000000000000000",
      buyerCancelPenalty: "10000000000000000",
      quantityAvailable: 1,
      voucherRedeemableFromDateInMS: "1666788540000",
      voucherRedeemableUntilDateInMS: "1667257140000",
      voucherValidDurationInMS: 0,
      validFromDateInMS: "1666788540000",
      validUntilDateInMS: "1667257140000",
      disputePeriodDurationInMS: "2592000000",
      resolutionPeriodDurationInMS: "1296000000",
      exchangeToken: "0x0000000000000000000000000000000000000000",
      disputeResolverId: "3",
      agentId: 0,
      metadataUri: "ipfs://QmUQnnx6fA2ZbeWcK1kfnushaVxRVwZzA4RMBFSqWjh796",
      metadataHash: "QmUQnnx6fA2ZbeWcK1kfnushaVxRVwZzA4RMBFSqWjh796"
    }
  ],
  onPendingSignature: () => {
    console.log("----------ON PENDING SIGNATURE-------------");
  },
  onPendingTransaction: (txHash: string) => {
    console.log("----------ON PENDING TRANSACTION-------------");
    console.log("txHash", txHash);
  },
  onSuccess: (receipt, payload) => {
    console.log("----------ON SUCCESS-------------");
    console.log("receipt", receipt);
    console.log("payload", payload);
  },
  onError: (error) => {
    console.log("----------ON ERROR-------------");
    console.log("error", error);
  }
};
