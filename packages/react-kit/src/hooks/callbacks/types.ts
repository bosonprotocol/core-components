import { FormType as RedeemFormType } from "../../components/modal/components/Redeem/RedeemFormModel";

export type RedemptionInfo = {
  exchangeId: string;
  offerId: string;
  buyerId: string;
  sellerId: string;
  sellerAddress: string;
  buyerAddress: string;
};

export type DeliveryInfoMessage = RedemptionInfo & {
  deliveryDetails: RedeemFormType;
};

export type RedeemTransactionMessage = {
  isError: boolean;
  error?: {
    name: string;
    message: string;
  };
  redemptionInfo: RedemptionInfo;
};

export type RedeemTransactionSubmittedMessage = RedeemTransactionMessage & {
  redeemTx?: {
    hash: string;
  };
};

export type RedeemTransactionConfirmedMessage = RedeemTransactionMessage & {
  redeemTx?: {
    hash: string;
    blockNumber: number;
  };
};

export type DeliveryInfoCallbackResponse = {
  accepted: boolean;
  reason: string;
  resume: boolean;
};

export type RedeemTransactionSubmittedCallbackResponse = {
  accepted: boolean;
  reason: string;
};

export type RedeemTransactionConfirmedCallbackResponse = {
  accepted: boolean;
  reason: string;
};
