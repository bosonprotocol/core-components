import { parseEther } from "@ethersproject/units";
import { AddressZero } from "@ethersproject/constants";
import {
  Web3LibAdapter,
  TransactionResponse,
  OfferStruct,
  MetadataStorage,
  Metadata,
  CreateOfferArgs
} from "../src/types";

export const IPFS_HASH = "QmYXc12ov6F2MZVZwPs5XeCBbf61cW3wKRk8h3D5NTYj4T";
export const IPFS_URI = `https://ipfs.io/ipfs/${IPFS_HASH}`;

export const ADDRESS = "0x57faFe1fB7C682216FCe44e50946C5249192b9D5";

export function mockOfferStruct(overrides?: Partial<OfferStruct>): OfferStruct {
  return {
    id: "1",
    voided: false,
    price: parseEther("1"),
    deposit: parseEther("1"),
    penalty: parseEther("1"),
    quantity: 10,
    validFromDate: Math.floor(Date.now() / 1000),
    validUntilDate: Math.floor((Date.now() + 2 * 60 * 1000) / 1000),
    redeemableDate: Math.floor((Date.now() + 1 * 60 * 1000) / 1000),
    fulfillmentPeriodDuration: 60 * 60,
    voucherValidDuration: 60 * 60,
    seller: ADDRESS,
    exchangeToken: AddressZero,
    metadataUri: IPFS_URI,
    metadataHash: IPFS_HASH,
    ...overrides
  };
}

export function mockCreateOfferArgs(
  overrides?: Partial<CreateOfferArgs>
): CreateOfferArgs {
  return {
    id: "1",
    price: parseEther("1"),
    deposit: parseEther("1"),
    penalty: parseEther("1"),
    quantity: 10,
    validFromDateInMS: Date.now(),
    validUntilDateInMS: Date.now() + 2 * 60 * 1000,
    redeemableDateInMS: Date.now() + 1 * 60 * 1000,
    fulfillmentPeriodDurationInMS: 60 * 60 * 1000,
    voucherValidDurationInMS: 60 * 60 * 1000,
    seller: ADDRESS,
    exchangeToken: AddressZero,
    metadataUri: IPFS_URI,
    metadataHash: IPFS_HASH,
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
  getMetadata: Metadata;
  storeMetadata: string;
};

const defaultMockedMetadataStorageReturnValues: MockedMetadataStorageReturnValues =
  {
    getMetadata: {
      title: "title",
      description: "description"
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

  async getMetadata(metadataUri: string): Promise<Metadata> {
    return this._returnValues.getMetadata;
  }

  async storeMetadata(metadata: Metadata): Promise<string> {
    return this._returnValues.storeMetadata;
  }
}
