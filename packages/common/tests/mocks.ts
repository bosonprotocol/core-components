import { AdditionalOfferMetadata } from "./../../core-sdk/src/offers/renderContractualAgreement";
import { MSEC_PER_DAY, SEC_PER_DAY } from "../src/utils/timestamp";
import { parseEther } from "@ethersproject/units";
import { AddressZero } from "@ethersproject/constants";
import {
  Web3LibAdapter,
  TransactionResponse,
  OfferStruct,
  MetadataStorage,
  AnyMetadata,
  CreateOfferArgs,
  OfferDatesStruct,
  OfferDurationsStruct,
  TransactionRequest,
  TransactionReceipt
} from "../src/types";
import { MetadataType } from "@bosonprotocol/metadata";

export const IPFS_HASH = "QmYXc12ov6F2MZVZwPs5XeCBbf61cW3wKRk8h3D5NTYj4T";
export const IPFS_URI = `ipfs://${IPFS_HASH}`;

export const ADDRESS = "0x57faFe1fB7C682216FCe44e50946C5249192b9D5";

export function mockOfferStruct(overrides?: Partial<OfferStruct>): OfferStruct {
  return {
    id: "1",
    voided: false,
    price: parseEther("1"),
    sellerDeposit: parseEther("1"),
    buyerCancelPenalty: parseEther("1"),
    quantityAvailable: 10,
    sellerId: "1",
    exchangeToken: AddressZero,
    metadataUri: IPFS_URI,
    metadataHash: IPFS_HASH,
    ...overrides
  };
}

export function mockOfferDatesStruct(
  overrides?: Partial<OfferDatesStruct>
): OfferDatesStruct {
  return {
    validFrom: Math.floor(Date.now() / 1000),
    validUntil: Math.floor((Date.now() + 2 * 60 * 1000) / 1000),
    voucherRedeemableFrom: Math.floor((Date.now() + 1 * 60 * 1000) / 1000),
    voucherRedeemableUntil: Math.floor((Date.now() + 1 * 60 * 1000) / 1000),
    ...overrides
  };
}

export function mockOfferDurationsStruct(
  overrides?: Partial<OfferDurationsStruct>
): OfferDurationsStruct {
  return {
    disputePeriod: 60 * 60,
    voucherValid: 60 * 60,
    resolutionPeriod: 60 * 60,
    ...overrides
  };
}

export function mockCreateOfferArgs(
  overrides?: Partial<CreateOfferArgs>
): CreateOfferArgs {
  return {
    price: parseEther("0.03"),
    sellerDeposit: parseEther("0.01"),
    agentId: "0",
    buyerCancelPenalty: parseEther("0.01"),
    quantityAvailable: 10,
    validFromDateInMS: Date.now() + 1000,
    validUntilDateInMS: Date.now() + 20 * MSEC_PER_DAY,
    voucherRedeemableFromDateInMS: Date.now() + 1000,
    voucherRedeemableUntilDateInMS: Date.now() + 30 * MSEC_PER_DAY,
    disputePeriodDurationInMS: 40 * MSEC_PER_DAY,
    voucherValidDurationInMS: 0,
    resolutionPeriodDurationInMS: 50 * MSEC_PER_DAY,
    exchangeToken: AddressZero,
    disputeResolverId: "1",
    metadataUri: IPFS_URI,
    metadataHash: IPFS_HASH,
    ...overrides
  };
}

export function mockAdditionalOfferMetadata(
  overrides?: Partial<AdditionalOfferMetadata>
): AdditionalOfferMetadata {
  return {
    sellerContactMethod: "Chat App in the dApp",
    disputeResolverContactMethod: "email to: disputes@redeemeum.com",
    escalationDeposit: parseEther("0.01"),
    escalationResponsePeriodInSec: 20 * SEC_PER_DAY,
    sellerTradingName: "Best Brand Ever",
    returnPeriodInDays: 15,
    ...overrides
  };
}

type MockedWeb3LibReturnValues = {
  getSignerAddress: string;
  getChainId: number;
  getBalance: string;
  sendTransaction: TransactionResponse;
  call: string;
  send: string;
  getTransactionReceipt: TransactionReceipt;
};

const defaultMockedReturnValues: MockedWeb3LibReturnValues = {
  getSignerAddress: ADDRESS,
  getChainId: 1,
  getBalance: parseEther("0.001").toString(),
  sendTransaction: {
    hash: "0x",
    wait: async () => ({
      transactionHash: "0x",
      from: ADDRESS,
      to: ADDRESS,
      logs: [],
      status: 0,
      effectiveGasPrice: "10"
    })
  },
  send: "0x",
  call: "0x",
  getTransactionReceipt: {
    transactionHash: "0x",
    from: ADDRESS,
    to: ADDRESS,
    logs: [],
    status: 0,
    effectiveGasPrice: "10"
  }
};

export class MockWeb3LibAdapter implements Web3LibAdapter {
  private _returnValues: MockedWeb3LibReturnValues;

  sendTransactionArgs: Array<TransactionRequest> = [];
  getTransactionReceiptArgs: Array<string> = [];

  constructor(returnValues: Partial<MockedWeb3LibReturnValues> = {}) {
    this._returnValues = {
      ...defaultMockedReturnValues,
      ...returnValues
    };
  }
  async getTransactionReceipt(txHash: string): Promise<TransactionReceipt> {
    this.getTransactionReceiptArgs.push(txHash);
    return this._returnValues.getTransactionReceipt;
  }

  async getSignerAddress() {
    return this._returnValues.getSignerAddress;
  }

  async getChainId() {
    return this._returnValues.getChainId;
  }

  async getBalance() {
    return this._returnValues.getBalance;
  }

  async sendTransaction(args: TransactionRequest) {
    this.sendTransactionArgs.push(args);
    return this._returnValues.sendTransaction;
  }

  async call() {
    return this._returnValues.call;
  }

  async send() {
    return this._returnValues.send;
  }
}

type MockedMetadataStorageReturnValues = {
  getMetadata: AnyMetadata;
  storeMetadata: string;
};

const defaultMockedMetadataStorageReturnValues: MockedMetadataStorageReturnValues =
  {
    getMetadata: {
      name: "name",
      description: "description",
      externalUrl: "externalUrl",
      animationUrl: "animationUrl",
      licenseUrl: "licenseUrl",
      schemaUrl: "schemaUrl",
      type: MetadataType.BASE
    },
    storeMetadata: IPFS_URI
  };

export class MockMetadataStorage implements MetadataStorage {
  private _returnValues: MockedMetadataStorageReturnValues;

  constructor(returnValues: Partial<MockedMetadataStorageReturnValues> = {}) {
    this._returnValues = {
      ...defaultMockedMetadataStorageReturnValues,
      ...returnValues
    };
  }

  async getMetadata(metadataUri: string): Promise<AnyMetadata> {
    return this._returnValues.getMetadata;
  }

  async storeMetadata(metadata: AnyMetadata): Promise<string> {
    return this._returnValues.storeMetadata;
  }
}
