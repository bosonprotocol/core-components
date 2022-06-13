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
  OfferDurationsStruct
} from "../src/types";
import { MetadataType } from "@bosonprotocol/metadata";

export const IPFS_HASH = "QmYXc12ov6F2MZVZwPs5XeCBbf61cW3wKRk8h3D5NTYj4T";
export const IPFS_URI = `ipfs://${IPFS_HASH}`;

export const ADDRESS = "0x57faFe1fB7C682216FCe44e50946C5249192b9D5";

export function mockOfferStruct(overrides?: Partial<OfferStruct>): OfferStruct {
  return {
    id: "1",
    disputeResolverId: "1",
    voided: false,
    price: parseEther("1"),
    protocolFee: parseEther("1"),
    sellerDeposit: parseEther("1"),
    buyerCancelPenalty: parseEther("1"),
    quantityAvailable: 10,
    sellerId: "1",
    exchangeToken: AddressZero,
    metadataUri: IPFS_URI,
    offerChecksum: IPFS_HASH, // TODO: use correct checksum
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
    fulfillmentPeriod: 60 * 60,
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
    protocolFee: parseEther("0.001"),
    buyerCancelPenalty: parseEther("0.01"),
    quantityAvailable: 10,
    validFromDateInMS: Date.now() + 3000,
    validUntilDateInMS: Date.now() + 2 * 60 * 1000,
    voucherRedeemableFromDateInMS: Date.now() + 1 * 60 * 1000,
    voucherRedeemableUntilDateInMS: Date.now() + 2 * 60 * 1000,
    fulfillmentPeriodDurationInMS: 60 * 60 * 1000,
    voucherValidDurationInMS: 0,
    resolutionPeriodDurationInMS: 60 * 60 * 1000,
    exchangeToken: AddressZero,
    disputeResolverId: "1",
    metadataUri: IPFS_URI,
    offerChecksum: IPFS_HASH, // TODO: use correct checksum
    ...overrides
  };
}

type MockedWeb3LibReturnValues = {
  getSignerAddress: string;
  getChainId: number;
  getBalance: string;
  sendTransaction: TransactionResponse;
  call: string;
};

const defaultMockedReturnValues: MockedWeb3LibReturnValues = {
  getSignerAddress: ADDRESS,
  getChainId: 1,
  getBalance: parseEther("0.001").toString(),
  sendTransaction: {
    hash: "0x",
    wait: async (confirmations: number) => ({
      transactionHash: "0x",
      from: ADDRESS,
      to: ADDRESS,
      logs: []
    })
  },
  call: "0x"
};

export class MockWeb3LibAdapter implements Web3LibAdapter {
  private _returnValues: MockedWeb3LibReturnValues;

  constructor(returnValues: Partial<MockedWeb3LibReturnValues> = {}) {
    this._returnValues = {
      ...defaultMockedReturnValues,
      ...returnValues
    };
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

  async sendTransaction() {
    return this._returnValues.sendTransaction;
  }

  async call() {
    return this._returnValues.call;
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
