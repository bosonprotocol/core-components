import { GraphQLClient } from "graphql-request";
import * as Dom from "graphql-request/dist/types.dom";
import gql from "graphql-tag";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: string;
  Bytes: string;
};

/**
 * Accounts
 *
 */
export type Account = {
  funds: Array<FundsEntity>;
  id: Scalars["ID"];
};

/**
 * Accounts
 *
 */
export type AccountFundsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<FundsEntity_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<FundsEntity_Filter>;
};

export type Account_Filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
};

export enum Account_OrderBy {
  Funds = "funds",
  Id = "id"
}

export type BaseMetadataEntity = MetadataInterface & {
  __typename?: "BaseMetadataEntity";
  createdAt: Scalars["BigInt"];
  description?: Maybe<Scalars["String"]>;
  exchangeToken: ExchangeToken;
  externalUrl?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  offer: Offer;
  schemaUrl?: Maybe<Scalars["String"]>;
  seller: Seller;
  type: MetadataType;
  validFromDate: Scalars["BigInt"];
  validUntilDate: Scalars["BigInt"];
  voided: Scalars["Boolean"];
};

export type BaseMetadataEntity_Filter = {
  createdAt?: InputMaybe<Scalars["BigInt"]>;
  createdAt_gt?: InputMaybe<Scalars["BigInt"]>;
  createdAt_gte?: InputMaybe<Scalars["BigInt"]>;
  createdAt_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  createdAt_lt?: InputMaybe<Scalars["BigInt"]>;
  createdAt_lte?: InputMaybe<Scalars["BigInt"]>;
  createdAt_not?: InputMaybe<Scalars["BigInt"]>;
  createdAt_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  description?: InputMaybe<Scalars["String"]>;
  description_contains?: InputMaybe<Scalars["String"]>;
  description_contains_nocase?: InputMaybe<Scalars["String"]>;
  description_ends_with?: InputMaybe<Scalars["String"]>;
  description_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  description_gt?: InputMaybe<Scalars["String"]>;
  description_gte?: InputMaybe<Scalars["String"]>;
  description_in?: InputMaybe<Array<Scalars["String"]>>;
  description_lt?: InputMaybe<Scalars["String"]>;
  description_lte?: InputMaybe<Scalars["String"]>;
  description_not?: InputMaybe<Scalars["String"]>;
  description_not_contains?: InputMaybe<Scalars["String"]>;
  description_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  description_not_ends_with?: InputMaybe<Scalars["String"]>;
  description_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  description_not_in?: InputMaybe<Array<Scalars["String"]>>;
  description_not_starts_with?: InputMaybe<Scalars["String"]>;
  description_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  description_starts_with?: InputMaybe<Scalars["String"]>;
  description_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken?: InputMaybe<Scalars["String"]>;
  exchangeToken_contains?: InputMaybe<Scalars["String"]>;
  exchangeToken_contains_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken_ends_with?: InputMaybe<Scalars["String"]>;
  exchangeToken_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken_gt?: InputMaybe<Scalars["String"]>;
  exchangeToken_gte?: InputMaybe<Scalars["String"]>;
  exchangeToken_in?: InputMaybe<Array<Scalars["String"]>>;
  exchangeToken_lt?: InputMaybe<Scalars["String"]>;
  exchangeToken_lte?: InputMaybe<Scalars["String"]>;
  exchangeToken_not?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_contains?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_ends_with?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_in?: InputMaybe<Array<Scalars["String"]>>;
  exchangeToken_not_starts_with?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken_starts_with?: InputMaybe<Scalars["String"]>;
  exchangeToken_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  externalUrl?: InputMaybe<Scalars["String"]>;
  externalUrl_contains?: InputMaybe<Scalars["String"]>;
  externalUrl_contains_nocase?: InputMaybe<Scalars["String"]>;
  externalUrl_ends_with?: InputMaybe<Scalars["String"]>;
  externalUrl_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  externalUrl_gt?: InputMaybe<Scalars["String"]>;
  externalUrl_gte?: InputMaybe<Scalars["String"]>;
  externalUrl_in?: InputMaybe<Array<Scalars["String"]>>;
  externalUrl_lt?: InputMaybe<Scalars["String"]>;
  externalUrl_lte?: InputMaybe<Scalars["String"]>;
  externalUrl_not?: InputMaybe<Scalars["String"]>;
  externalUrl_not_contains?: InputMaybe<Scalars["String"]>;
  externalUrl_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  externalUrl_not_ends_with?: InputMaybe<Scalars["String"]>;
  externalUrl_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  externalUrl_not_in?: InputMaybe<Array<Scalars["String"]>>;
  externalUrl_not_starts_with?: InputMaybe<Scalars["String"]>;
  externalUrl_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  externalUrl_starts_with?: InputMaybe<Scalars["String"]>;
  externalUrl_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  name?: InputMaybe<Scalars["String"]>;
  name_contains?: InputMaybe<Scalars["String"]>;
  name_contains_nocase?: InputMaybe<Scalars["String"]>;
  name_ends_with?: InputMaybe<Scalars["String"]>;
  name_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  name_gt?: InputMaybe<Scalars["String"]>;
  name_gte?: InputMaybe<Scalars["String"]>;
  name_in?: InputMaybe<Array<Scalars["String"]>>;
  name_lt?: InputMaybe<Scalars["String"]>;
  name_lte?: InputMaybe<Scalars["String"]>;
  name_not?: InputMaybe<Scalars["String"]>;
  name_not_contains?: InputMaybe<Scalars["String"]>;
  name_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  name_not_ends_with?: InputMaybe<Scalars["String"]>;
  name_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]>>;
  name_not_starts_with?: InputMaybe<Scalars["String"]>;
  name_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  name_starts_with?: InputMaybe<Scalars["String"]>;
  name_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  offer?: InputMaybe<Scalars["String"]>;
  offer_contains?: InputMaybe<Scalars["String"]>;
  offer_contains_nocase?: InputMaybe<Scalars["String"]>;
  offer_ends_with?: InputMaybe<Scalars["String"]>;
  offer_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  offer_gt?: InputMaybe<Scalars["String"]>;
  offer_gte?: InputMaybe<Scalars["String"]>;
  offer_in?: InputMaybe<Array<Scalars["String"]>>;
  offer_lt?: InputMaybe<Scalars["String"]>;
  offer_lte?: InputMaybe<Scalars["String"]>;
  offer_not?: InputMaybe<Scalars["String"]>;
  offer_not_contains?: InputMaybe<Scalars["String"]>;
  offer_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  offer_not_ends_with?: InputMaybe<Scalars["String"]>;
  offer_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  offer_not_in?: InputMaybe<Array<Scalars["String"]>>;
  offer_not_starts_with?: InputMaybe<Scalars["String"]>;
  offer_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  offer_starts_with?: InputMaybe<Scalars["String"]>;
  offer_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  schemaUrl?: InputMaybe<Scalars["String"]>;
  schemaUrl_contains?: InputMaybe<Scalars["String"]>;
  schemaUrl_contains_nocase?: InputMaybe<Scalars["String"]>;
  schemaUrl_ends_with?: InputMaybe<Scalars["String"]>;
  schemaUrl_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  schemaUrl_gt?: InputMaybe<Scalars["String"]>;
  schemaUrl_gte?: InputMaybe<Scalars["String"]>;
  schemaUrl_in?: InputMaybe<Array<Scalars["String"]>>;
  schemaUrl_lt?: InputMaybe<Scalars["String"]>;
  schemaUrl_lte?: InputMaybe<Scalars["String"]>;
  schemaUrl_not?: InputMaybe<Scalars["String"]>;
  schemaUrl_not_contains?: InputMaybe<Scalars["String"]>;
  schemaUrl_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  schemaUrl_not_ends_with?: InputMaybe<Scalars["String"]>;
  schemaUrl_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  schemaUrl_not_in?: InputMaybe<Array<Scalars["String"]>>;
  schemaUrl_not_starts_with?: InputMaybe<Scalars["String"]>;
  schemaUrl_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  schemaUrl_starts_with?: InputMaybe<Scalars["String"]>;
  schemaUrl_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  seller?: InputMaybe<Scalars["String"]>;
  seller_contains?: InputMaybe<Scalars["String"]>;
  seller_contains_nocase?: InputMaybe<Scalars["String"]>;
  seller_ends_with?: InputMaybe<Scalars["String"]>;
  seller_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  seller_gt?: InputMaybe<Scalars["String"]>;
  seller_gte?: InputMaybe<Scalars["String"]>;
  seller_in?: InputMaybe<Array<Scalars["String"]>>;
  seller_lt?: InputMaybe<Scalars["String"]>;
  seller_lte?: InputMaybe<Scalars["String"]>;
  seller_not?: InputMaybe<Scalars["String"]>;
  seller_not_contains?: InputMaybe<Scalars["String"]>;
  seller_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  seller_not_ends_with?: InputMaybe<Scalars["String"]>;
  seller_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  seller_not_in?: InputMaybe<Array<Scalars["String"]>>;
  seller_not_starts_with?: InputMaybe<Scalars["String"]>;
  seller_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  seller_starts_with?: InputMaybe<Scalars["String"]>;
  seller_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<MetadataType>;
  type_in?: InputMaybe<Array<MetadataType>>;
  type_not?: InputMaybe<MetadataType>;
  type_not_in?: InputMaybe<Array<MetadataType>>;
  validFromDate?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_gt?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_gte?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  validFromDate_lt?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_lte?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_not?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  validUntilDate?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_gt?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_gte?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  validUntilDate_lt?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_lte?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_not?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  voided?: InputMaybe<Scalars["Boolean"]>;
  voided_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  voided_not?: InputMaybe<Scalars["Boolean"]>;
  voided_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
};

export enum BaseMetadataEntity_OrderBy {
  CreatedAt = "createdAt",
  Description = "description",
  ExchangeToken = "exchangeToken",
  ExternalUrl = "externalUrl",
  Id = "id",
  Name = "name",
  Offer = "offer",
  SchemaUrl = "schemaUrl",
  Seller = "seller",
  Type = "type",
  ValidFromDate = "validFromDate",
  ValidUntilDate = "validUntilDate",
  Voided = "voided"
}

/** The block at which the query should be executed. */
export type Block_Height = {
  /** Value containing a block hash */
  hash?: InputMaybe<Scalars["Bytes"]>;
  /** Value containing a block number */
  number?: InputMaybe<Scalars["Int"]>;
  /**
   * Value containing the minimum block number.
   * In the case of `number_gte`, the query will be executed on the latest block only if
   * the subgraph has progressed to or past the minimum block number.
   * Defaults to the latest block when omitted.
   *
   */
  number_gte?: InputMaybe<Scalars["Int"]>;
};

export type Buyer = Account & {
  __typename?: "Buyer";
  active: Scalars["Boolean"];
  exchanges: Array<Exchange>;
  funds: Array<FundsEntity>;
  id: Scalars["ID"];
  wallet: Scalars["Bytes"];
};

export type BuyerExchangesArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Exchange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<Exchange_Filter>;
};

export type BuyerFundsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<FundsEntity_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<FundsEntity_Filter>;
};

export type Buyer_Filter = {
  active?: InputMaybe<Scalars["Boolean"]>;
  active_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  active_not?: InputMaybe<Scalars["Boolean"]>;
  active_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  wallet?: InputMaybe<Scalars["Bytes"]>;
  wallet_contains?: InputMaybe<Scalars["Bytes"]>;
  wallet_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  wallet_not?: InputMaybe<Scalars["Bytes"]>;
  wallet_not_contains?: InputMaybe<Scalars["Bytes"]>;
  wallet_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
};

export enum Buyer_OrderBy {
  Active = "active",
  Exchanges = "exchanges",
  Funds = "funds",
  Id = "id",
  Wallet = "wallet"
}

export type DisputeResolver = {
  __typename?: "DisputeResolver";
  active: Scalars["Boolean"];
  id: Scalars["ID"];
  offers: Array<Offer>;
  wallet: Scalars["Bytes"];
};

export type DisputeResolverOffersArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Offer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<Offer_Filter>;
};

export type DisputeResolver_Filter = {
  active?: InputMaybe<Scalars["Boolean"]>;
  active_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  active_not?: InputMaybe<Scalars["Boolean"]>;
  active_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  wallet?: InputMaybe<Scalars["Bytes"]>;
  wallet_contains?: InputMaybe<Scalars["Bytes"]>;
  wallet_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  wallet_not?: InputMaybe<Scalars["Bytes"]>;
  wallet_not_contains?: InputMaybe<Scalars["Bytes"]>;
  wallet_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
};

export enum DisputeResolver_OrderBy {
  Active = "active",
  Id = "id",
  Offers = "offers",
  Wallet = "wallet"
}

export type Exchange = {
  __typename?: "Exchange";
  buyer: Buyer;
  committedDate: Scalars["BigInt"];
  disputed: Scalars["Boolean"];
  expired: Scalars["Boolean"];
  finalizedDate?: Maybe<Scalars["BigInt"]>;
  id: Scalars["ID"];
  offer: Offer;
  redeemedDate?: Maybe<Scalars["BigInt"]>;
  seller?: Maybe<Seller>;
  state: ExchangeState;
  validUntilDate?: Maybe<Scalars["BigInt"]>;
};

/**
 * Exchange and Voucher
 *
 */
export enum ExchangeState {
  Cancelled = "CANCELLED",
  Committed = "COMMITTED",
  Completed = "COMPLETED",
  Redeemed = "REDEEMED",
  Revoked = "REVOKED"
}

/**
 * Tokens
 *
 */
export type ExchangeToken = {
  __typename?: "ExchangeToken";
  address: Scalars["Bytes"];
  decimals: Scalars["BigInt"];
  funds: Array<FundsEntity>;
  id: Scalars["ID"];
  name: Scalars["String"];
  offers: Array<Offer>;
  symbol: Scalars["String"];
};

/**
 * Tokens
 *
 */
export type ExchangeTokenFundsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<FundsEntity_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<FundsEntity_Filter>;
};

/**
 * Tokens
 *
 */
export type ExchangeTokenOffersArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Offer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<Offer_Filter>;
};

export type ExchangeToken_Filter = {
  address?: InputMaybe<Scalars["Bytes"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  address_not?: InputMaybe<Scalars["Bytes"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  decimals?: InputMaybe<Scalars["BigInt"]>;
  decimals_gt?: InputMaybe<Scalars["BigInt"]>;
  decimals_gte?: InputMaybe<Scalars["BigInt"]>;
  decimals_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  decimals_lt?: InputMaybe<Scalars["BigInt"]>;
  decimals_lte?: InputMaybe<Scalars["BigInt"]>;
  decimals_not?: InputMaybe<Scalars["BigInt"]>;
  decimals_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  name?: InputMaybe<Scalars["String"]>;
  name_contains?: InputMaybe<Scalars["String"]>;
  name_contains_nocase?: InputMaybe<Scalars["String"]>;
  name_ends_with?: InputMaybe<Scalars["String"]>;
  name_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  name_gt?: InputMaybe<Scalars["String"]>;
  name_gte?: InputMaybe<Scalars["String"]>;
  name_in?: InputMaybe<Array<Scalars["String"]>>;
  name_lt?: InputMaybe<Scalars["String"]>;
  name_lte?: InputMaybe<Scalars["String"]>;
  name_not?: InputMaybe<Scalars["String"]>;
  name_not_contains?: InputMaybe<Scalars["String"]>;
  name_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  name_not_ends_with?: InputMaybe<Scalars["String"]>;
  name_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]>>;
  name_not_starts_with?: InputMaybe<Scalars["String"]>;
  name_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  name_starts_with?: InputMaybe<Scalars["String"]>;
  name_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  symbol?: InputMaybe<Scalars["String"]>;
  symbol_contains?: InputMaybe<Scalars["String"]>;
  symbol_contains_nocase?: InputMaybe<Scalars["String"]>;
  symbol_ends_with?: InputMaybe<Scalars["String"]>;
  symbol_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  symbol_gt?: InputMaybe<Scalars["String"]>;
  symbol_gte?: InputMaybe<Scalars["String"]>;
  symbol_in?: InputMaybe<Array<Scalars["String"]>>;
  symbol_lt?: InputMaybe<Scalars["String"]>;
  symbol_lte?: InputMaybe<Scalars["String"]>;
  symbol_not?: InputMaybe<Scalars["String"]>;
  symbol_not_contains?: InputMaybe<Scalars["String"]>;
  symbol_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  symbol_not_ends_with?: InputMaybe<Scalars["String"]>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  symbol_not_in?: InputMaybe<Array<Scalars["String"]>>;
  symbol_not_starts_with?: InputMaybe<Scalars["String"]>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  symbol_starts_with?: InputMaybe<Scalars["String"]>;
  symbol_starts_with_nocase?: InputMaybe<Scalars["String"]>;
};

export enum ExchangeToken_OrderBy {
  Address = "address",
  Decimals = "decimals",
  Funds = "funds",
  Id = "id",
  Name = "name",
  Offers = "offers",
  Symbol = "symbol"
}

export type Exchange_Filter = {
  buyer?: InputMaybe<Scalars["String"]>;
  buyer_contains?: InputMaybe<Scalars["String"]>;
  buyer_contains_nocase?: InputMaybe<Scalars["String"]>;
  buyer_ends_with?: InputMaybe<Scalars["String"]>;
  buyer_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  buyer_gt?: InputMaybe<Scalars["String"]>;
  buyer_gte?: InputMaybe<Scalars["String"]>;
  buyer_in?: InputMaybe<Array<Scalars["String"]>>;
  buyer_lt?: InputMaybe<Scalars["String"]>;
  buyer_lte?: InputMaybe<Scalars["String"]>;
  buyer_not?: InputMaybe<Scalars["String"]>;
  buyer_not_contains?: InputMaybe<Scalars["String"]>;
  buyer_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  buyer_not_ends_with?: InputMaybe<Scalars["String"]>;
  buyer_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  buyer_not_in?: InputMaybe<Array<Scalars["String"]>>;
  buyer_not_starts_with?: InputMaybe<Scalars["String"]>;
  buyer_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  buyer_starts_with?: InputMaybe<Scalars["String"]>;
  buyer_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  committedDate?: InputMaybe<Scalars["BigInt"]>;
  committedDate_gt?: InputMaybe<Scalars["BigInt"]>;
  committedDate_gte?: InputMaybe<Scalars["BigInt"]>;
  committedDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  committedDate_lt?: InputMaybe<Scalars["BigInt"]>;
  committedDate_lte?: InputMaybe<Scalars["BigInt"]>;
  committedDate_not?: InputMaybe<Scalars["BigInt"]>;
  committedDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  disputed?: InputMaybe<Scalars["Boolean"]>;
  disputed_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  disputed_not?: InputMaybe<Scalars["Boolean"]>;
  disputed_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  expired?: InputMaybe<Scalars["Boolean"]>;
  expired_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  expired_not?: InputMaybe<Scalars["Boolean"]>;
  expired_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  finalizedDate?: InputMaybe<Scalars["BigInt"]>;
  finalizedDate_gt?: InputMaybe<Scalars["BigInt"]>;
  finalizedDate_gte?: InputMaybe<Scalars["BigInt"]>;
  finalizedDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  finalizedDate_lt?: InputMaybe<Scalars["BigInt"]>;
  finalizedDate_lte?: InputMaybe<Scalars["BigInt"]>;
  finalizedDate_not?: InputMaybe<Scalars["BigInt"]>;
  finalizedDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  offer?: InputMaybe<Scalars["String"]>;
  offer_contains?: InputMaybe<Scalars["String"]>;
  offer_contains_nocase?: InputMaybe<Scalars["String"]>;
  offer_ends_with?: InputMaybe<Scalars["String"]>;
  offer_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  offer_gt?: InputMaybe<Scalars["String"]>;
  offer_gte?: InputMaybe<Scalars["String"]>;
  offer_in?: InputMaybe<Array<Scalars["String"]>>;
  offer_lt?: InputMaybe<Scalars["String"]>;
  offer_lte?: InputMaybe<Scalars["String"]>;
  offer_not?: InputMaybe<Scalars["String"]>;
  offer_not_contains?: InputMaybe<Scalars["String"]>;
  offer_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  offer_not_ends_with?: InputMaybe<Scalars["String"]>;
  offer_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  offer_not_in?: InputMaybe<Array<Scalars["String"]>>;
  offer_not_starts_with?: InputMaybe<Scalars["String"]>;
  offer_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  offer_starts_with?: InputMaybe<Scalars["String"]>;
  offer_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  redeemedDate?: InputMaybe<Scalars["BigInt"]>;
  redeemedDate_gt?: InputMaybe<Scalars["BigInt"]>;
  redeemedDate_gte?: InputMaybe<Scalars["BigInt"]>;
  redeemedDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  redeemedDate_lt?: InputMaybe<Scalars["BigInt"]>;
  redeemedDate_lte?: InputMaybe<Scalars["BigInt"]>;
  redeemedDate_not?: InputMaybe<Scalars["BigInt"]>;
  redeemedDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  seller?: InputMaybe<Scalars["String"]>;
  seller_contains?: InputMaybe<Scalars["String"]>;
  seller_contains_nocase?: InputMaybe<Scalars["String"]>;
  seller_ends_with?: InputMaybe<Scalars["String"]>;
  seller_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  seller_gt?: InputMaybe<Scalars["String"]>;
  seller_gte?: InputMaybe<Scalars["String"]>;
  seller_in?: InputMaybe<Array<Scalars["String"]>>;
  seller_lt?: InputMaybe<Scalars["String"]>;
  seller_lte?: InputMaybe<Scalars["String"]>;
  seller_not?: InputMaybe<Scalars["String"]>;
  seller_not_contains?: InputMaybe<Scalars["String"]>;
  seller_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  seller_not_ends_with?: InputMaybe<Scalars["String"]>;
  seller_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  seller_not_in?: InputMaybe<Array<Scalars["String"]>>;
  seller_not_starts_with?: InputMaybe<Scalars["String"]>;
  seller_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  seller_starts_with?: InputMaybe<Scalars["String"]>;
  seller_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  state?: InputMaybe<ExchangeState>;
  state_in?: InputMaybe<Array<ExchangeState>>;
  state_not?: InputMaybe<ExchangeState>;
  state_not_in?: InputMaybe<Array<ExchangeState>>;
  validUntilDate?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_gt?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_gte?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  validUntilDate_lt?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_lte?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_not?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
};

export enum Exchange_OrderBy {
  Buyer = "buyer",
  CommittedDate = "committedDate",
  Disputed = "disputed",
  Expired = "expired",
  FinalizedDate = "finalizedDate",
  Id = "id",
  Offer = "offer",
  RedeemedDate = "redeemedDate",
  Seller = "seller",
  State = "state",
  ValidUntilDate = "validUntilDate"
}

/**
 * Funds
 *
 */
export type FundsEntity = {
  __typename?: "FundsEntity";
  account: Account;
  accountId: Scalars["BigInt"];
  availableAmount: Scalars["BigInt"];
  id: Scalars["ID"];
  token: ExchangeToken;
  tokenAddress: Scalars["Bytes"];
};

export type FundsEntity_Filter = {
  account?: InputMaybe<Scalars["String"]>;
  accountId?: InputMaybe<Scalars["BigInt"]>;
  accountId_gt?: InputMaybe<Scalars["BigInt"]>;
  accountId_gte?: InputMaybe<Scalars["BigInt"]>;
  accountId_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  accountId_lt?: InputMaybe<Scalars["BigInt"]>;
  accountId_lte?: InputMaybe<Scalars["BigInt"]>;
  accountId_not?: InputMaybe<Scalars["BigInt"]>;
  accountId_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  account_contains?: InputMaybe<Scalars["String"]>;
  account_contains_nocase?: InputMaybe<Scalars["String"]>;
  account_ends_with?: InputMaybe<Scalars["String"]>;
  account_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  account_gt?: InputMaybe<Scalars["String"]>;
  account_gte?: InputMaybe<Scalars["String"]>;
  account_in?: InputMaybe<Array<Scalars["String"]>>;
  account_lt?: InputMaybe<Scalars["String"]>;
  account_lte?: InputMaybe<Scalars["String"]>;
  account_not?: InputMaybe<Scalars["String"]>;
  account_not_contains?: InputMaybe<Scalars["String"]>;
  account_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  account_not_ends_with?: InputMaybe<Scalars["String"]>;
  account_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  account_not_in?: InputMaybe<Array<Scalars["String"]>>;
  account_not_starts_with?: InputMaybe<Scalars["String"]>;
  account_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  account_starts_with?: InputMaybe<Scalars["String"]>;
  account_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  availableAmount?: InputMaybe<Scalars["BigInt"]>;
  availableAmount_gt?: InputMaybe<Scalars["BigInt"]>;
  availableAmount_gte?: InputMaybe<Scalars["BigInt"]>;
  availableAmount_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  availableAmount_lt?: InputMaybe<Scalars["BigInt"]>;
  availableAmount_lte?: InputMaybe<Scalars["BigInt"]>;
  availableAmount_not?: InputMaybe<Scalars["BigInt"]>;
  availableAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  token?: InputMaybe<Scalars["String"]>;
  tokenAddress?: InputMaybe<Scalars["Bytes"]>;
  tokenAddress_contains?: InputMaybe<Scalars["Bytes"]>;
  tokenAddress_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  tokenAddress_not?: InputMaybe<Scalars["Bytes"]>;
  tokenAddress_not_contains?: InputMaybe<Scalars["Bytes"]>;
  tokenAddress_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  token_contains?: InputMaybe<Scalars["String"]>;
  token_contains_nocase?: InputMaybe<Scalars["String"]>;
  token_ends_with?: InputMaybe<Scalars["String"]>;
  token_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  token_gt?: InputMaybe<Scalars["String"]>;
  token_gte?: InputMaybe<Scalars["String"]>;
  token_in?: InputMaybe<Array<Scalars["String"]>>;
  token_lt?: InputMaybe<Scalars["String"]>;
  token_lte?: InputMaybe<Scalars["String"]>;
  token_not?: InputMaybe<Scalars["String"]>;
  token_not_contains?: InputMaybe<Scalars["String"]>;
  token_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  token_not_ends_with?: InputMaybe<Scalars["String"]>;
  token_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  token_not_in?: InputMaybe<Array<Scalars["String"]>>;
  token_not_starts_with?: InputMaybe<Scalars["String"]>;
  token_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  token_starts_with?: InputMaybe<Scalars["String"]>;
  token_starts_with_nocase?: InputMaybe<Scalars["String"]>;
};

export enum FundsEntity_OrderBy {
  Account = "account",
  AccountId = "accountId",
  AvailableAmount = "availableAmount",
  Id = "id",
  Token = "token",
  TokenAddress = "tokenAddress"
}

export type MetadataInterface = {
  /**
   * Enriched fields from offer entity to allow nested query workaround
   *
   */
  createdAt: Scalars["BigInt"];
  description?: Maybe<Scalars["String"]>;
  /** Reference to related ExchangeToken entity */
  exchangeToken: ExchangeToken;
  /** Arbitrary URL which is linked to metadata */
  externalUrl?: Maybe<Scalars["String"]>;
  /** <OFFER_ID>-metadata */
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  /** Reference to related Offer entity */
  offer: Offer;
  /** JSON schema URL */
  schemaUrl?: Maybe<Scalars["String"]>;
  /** Reference to related Seller entity */
  seller: Seller;
  /** Enum */
  type: MetadataType;
  validFromDate: Scalars["BigInt"];
  validUntilDate: Scalars["BigInt"];
  voided: Scalars["Boolean"];
};

export type MetadataInterface_Filter = {
  createdAt?: InputMaybe<Scalars["BigInt"]>;
  createdAt_gt?: InputMaybe<Scalars["BigInt"]>;
  createdAt_gte?: InputMaybe<Scalars["BigInt"]>;
  createdAt_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  createdAt_lt?: InputMaybe<Scalars["BigInt"]>;
  createdAt_lte?: InputMaybe<Scalars["BigInt"]>;
  createdAt_not?: InputMaybe<Scalars["BigInt"]>;
  createdAt_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  description?: InputMaybe<Scalars["String"]>;
  description_contains?: InputMaybe<Scalars["String"]>;
  description_contains_nocase?: InputMaybe<Scalars["String"]>;
  description_ends_with?: InputMaybe<Scalars["String"]>;
  description_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  description_gt?: InputMaybe<Scalars["String"]>;
  description_gte?: InputMaybe<Scalars["String"]>;
  description_in?: InputMaybe<Array<Scalars["String"]>>;
  description_lt?: InputMaybe<Scalars["String"]>;
  description_lte?: InputMaybe<Scalars["String"]>;
  description_not?: InputMaybe<Scalars["String"]>;
  description_not_contains?: InputMaybe<Scalars["String"]>;
  description_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  description_not_ends_with?: InputMaybe<Scalars["String"]>;
  description_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  description_not_in?: InputMaybe<Array<Scalars["String"]>>;
  description_not_starts_with?: InputMaybe<Scalars["String"]>;
  description_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  description_starts_with?: InputMaybe<Scalars["String"]>;
  description_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken?: InputMaybe<Scalars["String"]>;
  exchangeToken_contains?: InputMaybe<Scalars["String"]>;
  exchangeToken_contains_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken_ends_with?: InputMaybe<Scalars["String"]>;
  exchangeToken_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken_gt?: InputMaybe<Scalars["String"]>;
  exchangeToken_gte?: InputMaybe<Scalars["String"]>;
  exchangeToken_in?: InputMaybe<Array<Scalars["String"]>>;
  exchangeToken_lt?: InputMaybe<Scalars["String"]>;
  exchangeToken_lte?: InputMaybe<Scalars["String"]>;
  exchangeToken_not?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_contains?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_ends_with?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_in?: InputMaybe<Array<Scalars["String"]>>;
  exchangeToken_not_starts_with?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken_starts_with?: InputMaybe<Scalars["String"]>;
  exchangeToken_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  externalUrl?: InputMaybe<Scalars["String"]>;
  externalUrl_contains?: InputMaybe<Scalars["String"]>;
  externalUrl_contains_nocase?: InputMaybe<Scalars["String"]>;
  externalUrl_ends_with?: InputMaybe<Scalars["String"]>;
  externalUrl_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  externalUrl_gt?: InputMaybe<Scalars["String"]>;
  externalUrl_gte?: InputMaybe<Scalars["String"]>;
  externalUrl_in?: InputMaybe<Array<Scalars["String"]>>;
  externalUrl_lt?: InputMaybe<Scalars["String"]>;
  externalUrl_lte?: InputMaybe<Scalars["String"]>;
  externalUrl_not?: InputMaybe<Scalars["String"]>;
  externalUrl_not_contains?: InputMaybe<Scalars["String"]>;
  externalUrl_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  externalUrl_not_ends_with?: InputMaybe<Scalars["String"]>;
  externalUrl_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  externalUrl_not_in?: InputMaybe<Array<Scalars["String"]>>;
  externalUrl_not_starts_with?: InputMaybe<Scalars["String"]>;
  externalUrl_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  externalUrl_starts_with?: InputMaybe<Scalars["String"]>;
  externalUrl_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  name?: InputMaybe<Scalars["String"]>;
  name_contains?: InputMaybe<Scalars["String"]>;
  name_contains_nocase?: InputMaybe<Scalars["String"]>;
  name_ends_with?: InputMaybe<Scalars["String"]>;
  name_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  name_gt?: InputMaybe<Scalars["String"]>;
  name_gte?: InputMaybe<Scalars["String"]>;
  name_in?: InputMaybe<Array<Scalars["String"]>>;
  name_lt?: InputMaybe<Scalars["String"]>;
  name_lte?: InputMaybe<Scalars["String"]>;
  name_not?: InputMaybe<Scalars["String"]>;
  name_not_contains?: InputMaybe<Scalars["String"]>;
  name_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  name_not_ends_with?: InputMaybe<Scalars["String"]>;
  name_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]>>;
  name_not_starts_with?: InputMaybe<Scalars["String"]>;
  name_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  name_starts_with?: InputMaybe<Scalars["String"]>;
  name_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  offer?: InputMaybe<Scalars["String"]>;
  offer_contains?: InputMaybe<Scalars["String"]>;
  offer_contains_nocase?: InputMaybe<Scalars["String"]>;
  offer_ends_with?: InputMaybe<Scalars["String"]>;
  offer_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  offer_gt?: InputMaybe<Scalars["String"]>;
  offer_gte?: InputMaybe<Scalars["String"]>;
  offer_in?: InputMaybe<Array<Scalars["String"]>>;
  offer_lt?: InputMaybe<Scalars["String"]>;
  offer_lte?: InputMaybe<Scalars["String"]>;
  offer_not?: InputMaybe<Scalars["String"]>;
  offer_not_contains?: InputMaybe<Scalars["String"]>;
  offer_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  offer_not_ends_with?: InputMaybe<Scalars["String"]>;
  offer_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  offer_not_in?: InputMaybe<Array<Scalars["String"]>>;
  offer_not_starts_with?: InputMaybe<Scalars["String"]>;
  offer_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  offer_starts_with?: InputMaybe<Scalars["String"]>;
  offer_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  schemaUrl?: InputMaybe<Scalars["String"]>;
  schemaUrl_contains?: InputMaybe<Scalars["String"]>;
  schemaUrl_contains_nocase?: InputMaybe<Scalars["String"]>;
  schemaUrl_ends_with?: InputMaybe<Scalars["String"]>;
  schemaUrl_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  schemaUrl_gt?: InputMaybe<Scalars["String"]>;
  schemaUrl_gte?: InputMaybe<Scalars["String"]>;
  schemaUrl_in?: InputMaybe<Array<Scalars["String"]>>;
  schemaUrl_lt?: InputMaybe<Scalars["String"]>;
  schemaUrl_lte?: InputMaybe<Scalars["String"]>;
  schemaUrl_not?: InputMaybe<Scalars["String"]>;
  schemaUrl_not_contains?: InputMaybe<Scalars["String"]>;
  schemaUrl_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  schemaUrl_not_ends_with?: InputMaybe<Scalars["String"]>;
  schemaUrl_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  schemaUrl_not_in?: InputMaybe<Array<Scalars["String"]>>;
  schemaUrl_not_starts_with?: InputMaybe<Scalars["String"]>;
  schemaUrl_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  schemaUrl_starts_with?: InputMaybe<Scalars["String"]>;
  schemaUrl_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  seller?: InputMaybe<Scalars["String"]>;
  seller_contains?: InputMaybe<Scalars["String"]>;
  seller_contains_nocase?: InputMaybe<Scalars["String"]>;
  seller_ends_with?: InputMaybe<Scalars["String"]>;
  seller_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  seller_gt?: InputMaybe<Scalars["String"]>;
  seller_gte?: InputMaybe<Scalars["String"]>;
  seller_in?: InputMaybe<Array<Scalars["String"]>>;
  seller_lt?: InputMaybe<Scalars["String"]>;
  seller_lte?: InputMaybe<Scalars["String"]>;
  seller_not?: InputMaybe<Scalars["String"]>;
  seller_not_contains?: InputMaybe<Scalars["String"]>;
  seller_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  seller_not_ends_with?: InputMaybe<Scalars["String"]>;
  seller_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  seller_not_in?: InputMaybe<Array<Scalars["String"]>>;
  seller_not_starts_with?: InputMaybe<Scalars["String"]>;
  seller_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  seller_starts_with?: InputMaybe<Scalars["String"]>;
  seller_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<MetadataType>;
  type_in?: InputMaybe<Array<MetadataType>>;
  type_not?: InputMaybe<MetadataType>;
  type_not_in?: InputMaybe<Array<MetadataType>>;
  validFromDate?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_gt?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_gte?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  validFromDate_lt?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_lte?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_not?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  validUntilDate?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_gt?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_gte?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  validUntilDate_lt?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_lte?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_not?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  voided?: InputMaybe<Scalars["Boolean"]>;
  voided_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  voided_not?: InputMaybe<Scalars["Boolean"]>;
  voided_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
};

export enum MetadataInterface_OrderBy {
  CreatedAt = "createdAt",
  Description = "description",
  ExchangeToken = "exchangeToken",
  ExternalUrl = "externalUrl",
  Id = "id",
  Name = "name",
  Offer = "offer",
  SchemaUrl = "schemaUrl",
  Seller = "seller",
  Type = "type",
  ValidFromDate = "validFromDate",
  ValidUntilDate = "validUntilDate",
  Voided = "voided"
}

export enum MetadataType {
  Base = "BASE",
  ProductV1 = "PRODUCT_V1"
}

/**
 * Offer
 *
 */
export type Offer = {
  __typename?: "Offer";
  buyerCancelPenalty: Scalars["BigInt"];
  createdAt: Scalars["BigInt"];
  disputeResolver: DisputeResolver;
  disputeResolverId: Scalars["BigInt"];
  exchangeToken: ExchangeToken;
  exchanges: Array<Exchange>;
  /** Offer durations */
  fulfillmentPeriodDuration: Scalars["BigInt"];
  id: Scalars["ID"];
  metadata?: Maybe<MetadataInterface>;
  metadataUri: Scalars["String"];
  offerChecksum: Scalars["String"];
  price: Scalars["BigInt"];
  protocolFee: Scalars["BigInt"];
  quantityAvailable: Scalars["BigInt"];
  quantityInitial: Scalars["BigInt"];
  resolutionPeriodDuration: Scalars["BigInt"];
  seller: Seller;
  sellerDeposit: Scalars["BigInt"];
  sellerId: Scalars["BigInt"];
  /** Offer dates */
  validFromDate: Scalars["BigInt"];
  validUntilDate: Scalars["BigInt"];
  voided: Scalars["Boolean"];
  voidedAt?: Maybe<Scalars["BigInt"]>;
  voucherRedeemableFromDate: Scalars["BigInt"];
  voucherRedeemableUntilDate: Scalars["BigInt"];
  voucherValidDuration: Scalars["BigInt"];
};

/**
 * Offer
 *
 */
export type OfferExchangesArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Exchange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<Exchange_Filter>;
};

export type Offer_Filter = {
  buyerCancelPenalty?: InputMaybe<Scalars["BigInt"]>;
  buyerCancelPenalty_gt?: InputMaybe<Scalars["BigInt"]>;
  buyerCancelPenalty_gte?: InputMaybe<Scalars["BigInt"]>;
  buyerCancelPenalty_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  buyerCancelPenalty_lt?: InputMaybe<Scalars["BigInt"]>;
  buyerCancelPenalty_lte?: InputMaybe<Scalars["BigInt"]>;
  buyerCancelPenalty_not?: InputMaybe<Scalars["BigInt"]>;
  buyerCancelPenalty_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  createdAt?: InputMaybe<Scalars["BigInt"]>;
  createdAt_gt?: InputMaybe<Scalars["BigInt"]>;
  createdAt_gte?: InputMaybe<Scalars["BigInt"]>;
  createdAt_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  createdAt_lt?: InputMaybe<Scalars["BigInt"]>;
  createdAt_lte?: InputMaybe<Scalars["BigInt"]>;
  createdAt_not?: InputMaybe<Scalars["BigInt"]>;
  createdAt_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  disputeResolver?: InputMaybe<Scalars["String"]>;
  disputeResolverId?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_gt?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_gte?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  disputeResolverId_lt?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_lte?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_not?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  disputeResolver_contains?: InputMaybe<Scalars["String"]>;
  disputeResolver_contains_nocase?: InputMaybe<Scalars["String"]>;
  disputeResolver_ends_with?: InputMaybe<Scalars["String"]>;
  disputeResolver_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  disputeResolver_gt?: InputMaybe<Scalars["String"]>;
  disputeResolver_gte?: InputMaybe<Scalars["String"]>;
  disputeResolver_in?: InputMaybe<Array<Scalars["String"]>>;
  disputeResolver_lt?: InputMaybe<Scalars["String"]>;
  disputeResolver_lte?: InputMaybe<Scalars["String"]>;
  disputeResolver_not?: InputMaybe<Scalars["String"]>;
  disputeResolver_not_contains?: InputMaybe<Scalars["String"]>;
  disputeResolver_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  disputeResolver_not_ends_with?: InputMaybe<Scalars["String"]>;
  disputeResolver_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  disputeResolver_not_in?: InputMaybe<Array<Scalars["String"]>>;
  disputeResolver_not_starts_with?: InputMaybe<Scalars["String"]>;
  disputeResolver_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  disputeResolver_starts_with?: InputMaybe<Scalars["String"]>;
  disputeResolver_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken?: InputMaybe<Scalars["String"]>;
  exchangeToken_contains?: InputMaybe<Scalars["String"]>;
  exchangeToken_contains_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken_ends_with?: InputMaybe<Scalars["String"]>;
  exchangeToken_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken_gt?: InputMaybe<Scalars["String"]>;
  exchangeToken_gte?: InputMaybe<Scalars["String"]>;
  exchangeToken_in?: InputMaybe<Array<Scalars["String"]>>;
  exchangeToken_lt?: InputMaybe<Scalars["String"]>;
  exchangeToken_lte?: InputMaybe<Scalars["String"]>;
  exchangeToken_not?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_contains?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_ends_with?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_in?: InputMaybe<Array<Scalars["String"]>>;
  exchangeToken_not_starts_with?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken_starts_with?: InputMaybe<Scalars["String"]>;
  exchangeToken_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  fulfillmentPeriodDuration?: InputMaybe<Scalars["BigInt"]>;
  fulfillmentPeriodDuration_gt?: InputMaybe<Scalars["BigInt"]>;
  fulfillmentPeriodDuration_gte?: InputMaybe<Scalars["BigInt"]>;
  fulfillmentPeriodDuration_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  fulfillmentPeriodDuration_lt?: InputMaybe<Scalars["BigInt"]>;
  fulfillmentPeriodDuration_lte?: InputMaybe<Scalars["BigInt"]>;
  fulfillmentPeriodDuration_not?: InputMaybe<Scalars["BigInt"]>;
  fulfillmentPeriodDuration_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  metadata?: InputMaybe<Scalars["String"]>;
  metadataUri?: InputMaybe<Scalars["String"]>;
  metadataUri_contains?: InputMaybe<Scalars["String"]>;
  metadataUri_contains_nocase?: InputMaybe<Scalars["String"]>;
  metadataUri_ends_with?: InputMaybe<Scalars["String"]>;
  metadataUri_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  metadataUri_gt?: InputMaybe<Scalars["String"]>;
  metadataUri_gte?: InputMaybe<Scalars["String"]>;
  metadataUri_in?: InputMaybe<Array<Scalars["String"]>>;
  metadataUri_lt?: InputMaybe<Scalars["String"]>;
  metadataUri_lte?: InputMaybe<Scalars["String"]>;
  metadataUri_not?: InputMaybe<Scalars["String"]>;
  metadataUri_not_contains?: InputMaybe<Scalars["String"]>;
  metadataUri_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  metadataUri_not_ends_with?: InputMaybe<Scalars["String"]>;
  metadataUri_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  metadataUri_not_in?: InputMaybe<Array<Scalars["String"]>>;
  metadataUri_not_starts_with?: InputMaybe<Scalars["String"]>;
  metadataUri_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  metadataUri_starts_with?: InputMaybe<Scalars["String"]>;
  metadataUri_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  metadata_contains?: InputMaybe<Scalars["String"]>;
  metadata_contains_nocase?: InputMaybe<Scalars["String"]>;
  metadata_ends_with?: InputMaybe<Scalars["String"]>;
  metadata_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  metadata_gt?: InputMaybe<Scalars["String"]>;
  metadata_gte?: InputMaybe<Scalars["String"]>;
  metadata_in?: InputMaybe<Array<Scalars["String"]>>;
  metadata_lt?: InputMaybe<Scalars["String"]>;
  metadata_lte?: InputMaybe<Scalars["String"]>;
  metadata_not?: InputMaybe<Scalars["String"]>;
  metadata_not_contains?: InputMaybe<Scalars["String"]>;
  metadata_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  metadata_not_ends_with?: InputMaybe<Scalars["String"]>;
  metadata_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  metadata_not_in?: InputMaybe<Array<Scalars["String"]>>;
  metadata_not_starts_with?: InputMaybe<Scalars["String"]>;
  metadata_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  metadata_starts_with?: InputMaybe<Scalars["String"]>;
  metadata_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  offerChecksum?: InputMaybe<Scalars["String"]>;
  offerChecksum_contains?: InputMaybe<Scalars["String"]>;
  offerChecksum_contains_nocase?: InputMaybe<Scalars["String"]>;
  offerChecksum_ends_with?: InputMaybe<Scalars["String"]>;
  offerChecksum_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  offerChecksum_gt?: InputMaybe<Scalars["String"]>;
  offerChecksum_gte?: InputMaybe<Scalars["String"]>;
  offerChecksum_in?: InputMaybe<Array<Scalars["String"]>>;
  offerChecksum_lt?: InputMaybe<Scalars["String"]>;
  offerChecksum_lte?: InputMaybe<Scalars["String"]>;
  offerChecksum_not?: InputMaybe<Scalars["String"]>;
  offerChecksum_not_contains?: InputMaybe<Scalars["String"]>;
  offerChecksum_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  offerChecksum_not_ends_with?: InputMaybe<Scalars["String"]>;
  offerChecksum_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  offerChecksum_not_in?: InputMaybe<Array<Scalars["String"]>>;
  offerChecksum_not_starts_with?: InputMaybe<Scalars["String"]>;
  offerChecksum_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  offerChecksum_starts_with?: InputMaybe<Scalars["String"]>;
  offerChecksum_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  price?: InputMaybe<Scalars["BigInt"]>;
  price_gt?: InputMaybe<Scalars["BigInt"]>;
  price_gte?: InputMaybe<Scalars["BigInt"]>;
  price_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  price_lt?: InputMaybe<Scalars["BigInt"]>;
  price_lte?: InputMaybe<Scalars["BigInt"]>;
  price_not?: InputMaybe<Scalars["BigInt"]>;
  price_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  protocolFee?: InputMaybe<Scalars["BigInt"]>;
  protocolFee_gt?: InputMaybe<Scalars["BigInt"]>;
  protocolFee_gte?: InputMaybe<Scalars["BigInt"]>;
  protocolFee_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  protocolFee_lt?: InputMaybe<Scalars["BigInt"]>;
  protocolFee_lte?: InputMaybe<Scalars["BigInt"]>;
  protocolFee_not?: InputMaybe<Scalars["BigInt"]>;
  protocolFee_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  quantityAvailable?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_gt?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_gte?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  quantityAvailable_lt?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_lte?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_not?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  quantityInitial?: InputMaybe<Scalars["BigInt"]>;
  quantityInitial_gt?: InputMaybe<Scalars["BigInt"]>;
  quantityInitial_gte?: InputMaybe<Scalars["BigInt"]>;
  quantityInitial_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  quantityInitial_lt?: InputMaybe<Scalars["BigInt"]>;
  quantityInitial_lte?: InputMaybe<Scalars["BigInt"]>;
  quantityInitial_not?: InputMaybe<Scalars["BigInt"]>;
  quantityInitial_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  resolutionPeriodDuration?: InputMaybe<Scalars["BigInt"]>;
  resolutionPeriodDuration_gt?: InputMaybe<Scalars["BigInt"]>;
  resolutionPeriodDuration_gte?: InputMaybe<Scalars["BigInt"]>;
  resolutionPeriodDuration_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  resolutionPeriodDuration_lt?: InputMaybe<Scalars["BigInt"]>;
  resolutionPeriodDuration_lte?: InputMaybe<Scalars["BigInt"]>;
  resolutionPeriodDuration_not?: InputMaybe<Scalars["BigInt"]>;
  resolutionPeriodDuration_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  seller?: InputMaybe<Scalars["String"]>;
  sellerDeposit?: InputMaybe<Scalars["BigInt"]>;
  sellerDeposit_gt?: InputMaybe<Scalars["BigInt"]>;
  sellerDeposit_gte?: InputMaybe<Scalars["BigInt"]>;
  sellerDeposit_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  sellerDeposit_lt?: InputMaybe<Scalars["BigInt"]>;
  sellerDeposit_lte?: InputMaybe<Scalars["BigInt"]>;
  sellerDeposit_not?: InputMaybe<Scalars["BigInt"]>;
  sellerDeposit_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  sellerId?: InputMaybe<Scalars["BigInt"]>;
  sellerId_gt?: InputMaybe<Scalars["BigInt"]>;
  sellerId_gte?: InputMaybe<Scalars["BigInt"]>;
  sellerId_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  sellerId_lt?: InputMaybe<Scalars["BigInt"]>;
  sellerId_lte?: InputMaybe<Scalars["BigInt"]>;
  sellerId_not?: InputMaybe<Scalars["BigInt"]>;
  sellerId_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  seller_contains?: InputMaybe<Scalars["String"]>;
  seller_contains_nocase?: InputMaybe<Scalars["String"]>;
  seller_ends_with?: InputMaybe<Scalars["String"]>;
  seller_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  seller_gt?: InputMaybe<Scalars["String"]>;
  seller_gte?: InputMaybe<Scalars["String"]>;
  seller_in?: InputMaybe<Array<Scalars["String"]>>;
  seller_lt?: InputMaybe<Scalars["String"]>;
  seller_lte?: InputMaybe<Scalars["String"]>;
  seller_not?: InputMaybe<Scalars["String"]>;
  seller_not_contains?: InputMaybe<Scalars["String"]>;
  seller_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  seller_not_ends_with?: InputMaybe<Scalars["String"]>;
  seller_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  seller_not_in?: InputMaybe<Array<Scalars["String"]>>;
  seller_not_starts_with?: InputMaybe<Scalars["String"]>;
  seller_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  seller_starts_with?: InputMaybe<Scalars["String"]>;
  seller_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  validFromDate?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_gt?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_gte?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  validFromDate_lt?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_lte?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_not?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  validUntilDate?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_gt?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_gte?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  validUntilDate_lt?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_lte?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_not?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  voided?: InputMaybe<Scalars["Boolean"]>;
  voidedAt?: InputMaybe<Scalars["BigInt"]>;
  voidedAt_gt?: InputMaybe<Scalars["BigInt"]>;
  voidedAt_gte?: InputMaybe<Scalars["BigInt"]>;
  voidedAt_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  voidedAt_lt?: InputMaybe<Scalars["BigInt"]>;
  voidedAt_lte?: InputMaybe<Scalars["BigInt"]>;
  voidedAt_not?: InputMaybe<Scalars["BigInt"]>;
  voidedAt_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  voided_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  voided_not?: InputMaybe<Scalars["Boolean"]>;
  voided_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  voucherRedeemableFromDate?: InputMaybe<Scalars["BigInt"]>;
  voucherRedeemableFromDate_gt?: InputMaybe<Scalars["BigInt"]>;
  voucherRedeemableFromDate_gte?: InputMaybe<Scalars["BigInt"]>;
  voucherRedeemableFromDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  voucherRedeemableFromDate_lt?: InputMaybe<Scalars["BigInt"]>;
  voucherRedeemableFromDate_lte?: InputMaybe<Scalars["BigInt"]>;
  voucherRedeemableFromDate_not?: InputMaybe<Scalars["BigInt"]>;
  voucherRedeemableFromDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  voucherRedeemableUntilDate?: InputMaybe<Scalars["BigInt"]>;
  voucherRedeemableUntilDate_gt?: InputMaybe<Scalars["BigInt"]>;
  voucherRedeemableUntilDate_gte?: InputMaybe<Scalars["BigInt"]>;
  voucherRedeemableUntilDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  voucherRedeemableUntilDate_lt?: InputMaybe<Scalars["BigInt"]>;
  voucherRedeemableUntilDate_lte?: InputMaybe<Scalars["BigInt"]>;
  voucherRedeemableUntilDate_not?: InputMaybe<Scalars["BigInt"]>;
  voucherRedeemableUntilDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  voucherValidDuration?: InputMaybe<Scalars["BigInt"]>;
  voucherValidDuration_gt?: InputMaybe<Scalars["BigInt"]>;
  voucherValidDuration_gte?: InputMaybe<Scalars["BigInt"]>;
  voucherValidDuration_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  voucherValidDuration_lt?: InputMaybe<Scalars["BigInt"]>;
  voucherValidDuration_lte?: InputMaybe<Scalars["BigInt"]>;
  voucherValidDuration_not?: InputMaybe<Scalars["BigInt"]>;
  voucherValidDuration_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
};

export enum Offer_OrderBy {
  BuyerCancelPenalty = "buyerCancelPenalty",
  CreatedAt = "createdAt",
  DisputeResolver = "disputeResolver",
  DisputeResolverId = "disputeResolverId",
  ExchangeToken = "exchangeToken",
  Exchanges = "exchanges",
  FulfillmentPeriodDuration = "fulfillmentPeriodDuration",
  Id = "id",
  Metadata = "metadata",
  MetadataUri = "metadataUri",
  OfferChecksum = "offerChecksum",
  Price = "price",
  ProtocolFee = "protocolFee",
  QuantityAvailable = "quantityAvailable",
  QuantityInitial = "quantityInitial",
  ResolutionPeriodDuration = "resolutionPeriodDuration",
  Seller = "seller",
  SellerDeposit = "sellerDeposit",
  SellerId = "sellerId",
  ValidFromDate = "validFromDate",
  ValidUntilDate = "validUntilDate",
  Voided = "voided",
  VoidedAt = "voidedAt",
  VoucherRedeemableFromDate = "voucherRedeemableFromDate",
  VoucherRedeemableUntilDate = "voucherRedeemableUntilDate",
  VoucherValidDuration = "voucherValidDuration"
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = "asc",
  Desc = "desc"
}

export type ProductV1Brand = {
  __typename?: "ProductV1Brand";
  id: Scalars["ID"];
  name: Scalars["String"];
  products: Array<ProductV1MetadataEntity>;
};

export type ProductV1BrandProductsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1MetadataEntity_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ProductV1MetadataEntity_Filter>;
};

export type ProductV1Brand_Filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  name?: InputMaybe<Scalars["String"]>;
  name_contains?: InputMaybe<Scalars["String"]>;
  name_contains_nocase?: InputMaybe<Scalars["String"]>;
  name_ends_with?: InputMaybe<Scalars["String"]>;
  name_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  name_gt?: InputMaybe<Scalars["String"]>;
  name_gte?: InputMaybe<Scalars["String"]>;
  name_in?: InputMaybe<Array<Scalars["String"]>>;
  name_lt?: InputMaybe<Scalars["String"]>;
  name_lte?: InputMaybe<Scalars["String"]>;
  name_not?: InputMaybe<Scalars["String"]>;
  name_not_contains?: InputMaybe<Scalars["String"]>;
  name_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  name_not_ends_with?: InputMaybe<Scalars["String"]>;
  name_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]>>;
  name_not_starts_with?: InputMaybe<Scalars["String"]>;
  name_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  name_starts_with?: InputMaybe<Scalars["String"]>;
  name_starts_with_nocase?: InputMaybe<Scalars["String"]>;
};

export enum ProductV1Brand_OrderBy {
  Id = "id",
  Name = "name",
  Products = "products"
}

export type ProductV1MetadataEntity = MetadataInterface & {
  __typename?: "ProductV1MetadataEntity";
  brand: ProductV1Brand;
  brandName?: Maybe<Scalars["String"]>;
  createdAt: Scalars["BigInt"];
  description?: Maybe<Scalars["String"]>;
  exchangeToken: ExchangeToken;
  externalUrl?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  /**
   * ProductV1MetadataEntity specific fields
   *
   */
  images?: Maybe<Array<Scalars["String"]>>;
  name?: Maybe<Scalars["String"]>;
  offer: Offer;
  schemaUrl?: Maybe<Scalars["String"]>;
  seller: Seller;
  tags?: Maybe<Array<Scalars["String"]>>;
  type: MetadataType;
  validFromDate: Scalars["BigInt"];
  validUntilDate: Scalars["BigInt"];
  voided: Scalars["Boolean"];
};

export type ProductV1MetadataEntity_Filter = {
  brand?: InputMaybe<Scalars["String"]>;
  brandName?: InputMaybe<Scalars["String"]>;
  brandName_contains?: InputMaybe<Scalars["String"]>;
  brandName_contains_nocase?: InputMaybe<Scalars["String"]>;
  brandName_ends_with?: InputMaybe<Scalars["String"]>;
  brandName_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  brandName_gt?: InputMaybe<Scalars["String"]>;
  brandName_gte?: InputMaybe<Scalars["String"]>;
  brandName_in?: InputMaybe<Array<Scalars["String"]>>;
  brandName_lt?: InputMaybe<Scalars["String"]>;
  brandName_lte?: InputMaybe<Scalars["String"]>;
  brandName_not?: InputMaybe<Scalars["String"]>;
  brandName_not_contains?: InputMaybe<Scalars["String"]>;
  brandName_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  brandName_not_ends_with?: InputMaybe<Scalars["String"]>;
  brandName_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  brandName_not_in?: InputMaybe<Array<Scalars["String"]>>;
  brandName_not_starts_with?: InputMaybe<Scalars["String"]>;
  brandName_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  brandName_starts_with?: InputMaybe<Scalars["String"]>;
  brandName_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  brand_contains?: InputMaybe<Scalars["String"]>;
  brand_contains_nocase?: InputMaybe<Scalars["String"]>;
  brand_ends_with?: InputMaybe<Scalars["String"]>;
  brand_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  brand_gt?: InputMaybe<Scalars["String"]>;
  brand_gte?: InputMaybe<Scalars["String"]>;
  brand_in?: InputMaybe<Array<Scalars["String"]>>;
  brand_lt?: InputMaybe<Scalars["String"]>;
  brand_lte?: InputMaybe<Scalars["String"]>;
  brand_not?: InputMaybe<Scalars["String"]>;
  brand_not_contains?: InputMaybe<Scalars["String"]>;
  brand_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  brand_not_ends_with?: InputMaybe<Scalars["String"]>;
  brand_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  brand_not_in?: InputMaybe<Array<Scalars["String"]>>;
  brand_not_starts_with?: InputMaybe<Scalars["String"]>;
  brand_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  brand_starts_with?: InputMaybe<Scalars["String"]>;
  brand_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["BigInt"]>;
  createdAt_gt?: InputMaybe<Scalars["BigInt"]>;
  createdAt_gte?: InputMaybe<Scalars["BigInt"]>;
  createdAt_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  createdAt_lt?: InputMaybe<Scalars["BigInt"]>;
  createdAt_lte?: InputMaybe<Scalars["BigInt"]>;
  createdAt_not?: InputMaybe<Scalars["BigInt"]>;
  createdAt_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  description?: InputMaybe<Scalars["String"]>;
  description_contains?: InputMaybe<Scalars["String"]>;
  description_contains_nocase?: InputMaybe<Scalars["String"]>;
  description_ends_with?: InputMaybe<Scalars["String"]>;
  description_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  description_gt?: InputMaybe<Scalars["String"]>;
  description_gte?: InputMaybe<Scalars["String"]>;
  description_in?: InputMaybe<Array<Scalars["String"]>>;
  description_lt?: InputMaybe<Scalars["String"]>;
  description_lte?: InputMaybe<Scalars["String"]>;
  description_not?: InputMaybe<Scalars["String"]>;
  description_not_contains?: InputMaybe<Scalars["String"]>;
  description_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  description_not_ends_with?: InputMaybe<Scalars["String"]>;
  description_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  description_not_in?: InputMaybe<Array<Scalars["String"]>>;
  description_not_starts_with?: InputMaybe<Scalars["String"]>;
  description_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  description_starts_with?: InputMaybe<Scalars["String"]>;
  description_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken?: InputMaybe<Scalars["String"]>;
  exchangeToken_contains?: InputMaybe<Scalars["String"]>;
  exchangeToken_contains_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken_ends_with?: InputMaybe<Scalars["String"]>;
  exchangeToken_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken_gt?: InputMaybe<Scalars["String"]>;
  exchangeToken_gte?: InputMaybe<Scalars["String"]>;
  exchangeToken_in?: InputMaybe<Array<Scalars["String"]>>;
  exchangeToken_lt?: InputMaybe<Scalars["String"]>;
  exchangeToken_lte?: InputMaybe<Scalars["String"]>;
  exchangeToken_not?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_contains?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_ends_with?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_in?: InputMaybe<Array<Scalars["String"]>>;
  exchangeToken_not_starts_with?: InputMaybe<Scalars["String"]>;
  exchangeToken_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken_starts_with?: InputMaybe<Scalars["String"]>;
  exchangeToken_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  externalUrl?: InputMaybe<Scalars["String"]>;
  externalUrl_contains?: InputMaybe<Scalars["String"]>;
  externalUrl_contains_nocase?: InputMaybe<Scalars["String"]>;
  externalUrl_ends_with?: InputMaybe<Scalars["String"]>;
  externalUrl_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  externalUrl_gt?: InputMaybe<Scalars["String"]>;
  externalUrl_gte?: InputMaybe<Scalars["String"]>;
  externalUrl_in?: InputMaybe<Array<Scalars["String"]>>;
  externalUrl_lt?: InputMaybe<Scalars["String"]>;
  externalUrl_lte?: InputMaybe<Scalars["String"]>;
  externalUrl_not?: InputMaybe<Scalars["String"]>;
  externalUrl_not_contains?: InputMaybe<Scalars["String"]>;
  externalUrl_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  externalUrl_not_ends_with?: InputMaybe<Scalars["String"]>;
  externalUrl_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  externalUrl_not_in?: InputMaybe<Array<Scalars["String"]>>;
  externalUrl_not_starts_with?: InputMaybe<Scalars["String"]>;
  externalUrl_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  externalUrl_starts_with?: InputMaybe<Scalars["String"]>;
  externalUrl_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  images?: InputMaybe<Array<Scalars["String"]>>;
  images_contains?: InputMaybe<Array<Scalars["String"]>>;
  images_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  images_not?: InputMaybe<Array<Scalars["String"]>>;
  images_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  images_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  name?: InputMaybe<Scalars["String"]>;
  name_contains?: InputMaybe<Scalars["String"]>;
  name_contains_nocase?: InputMaybe<Scalars["String"]>;
  name_ends_with?: InputMaybe<Scalars["String"]>;
  name_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  name_gt?: InputMaybe<Scalars["String"]>;
  name_gte?: InputMaybe<Scalars["String"]>;
  name_in?: InputMaybe<Array<Scalars["String"]>>;
  name_lt?: InputMaybe<Scalars["String"]>;
  name_lte?: InputMaybe<Scalars["String"]>;
  name_not?: InputMaybe<Scalars["String"]>;
  name_not_contains?: InputMaybe<Scalars["String"]>;
  name_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  name_not_ends_with?: InputMaybe<Scalars["String"]>;
  name_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]>>;
  name_not_starts_with?: InputMaybe<Scalars["String"]>;
  name_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  name_starts_with?: InputMaybe<Scalars["String"]>;
  name_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  offer?: InputMaybe<Scalars["String"]>;
  offer_contains?: InputMaybe<Scalars["String"]>;
  offer_contains_nocase?: InputMaybe<Scalars["String"]>;
  offer_ends_with?: InputMaybe<Scalars["String"]>;
  offer_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  offer_gt?: InputMaybe<Scalars["String"]>;
  offer_gte?: InputMaybe<Scalars["String"]>;
  offer_in?: InputMaybe<Array<Scalars["String"]>>;
  offer_lt?: InputMaybe<Scalars["String"]>;
  offer_lte?: InputMaybe<Scalars["String"]>;
  offer_not?: InputMaybe<Scalars["String"]>;
  offer_not_contains?: InputMaybe<Scalars["String"]>;
  offer_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  offer_not_ends_with?: InputMaybe<Scalars["String"]>;
  offer_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  offer_not_in?: InputMaybe<Array<Scalars["String"]>>;
  offer_not_starts_with?: InputMaybe<Scalars["String"]>;
  offer_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  offer_starts_with?: InputMaybe<Scalars["String"]>;
  offer_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  schemaUrl?: InputMaybe<Scalars["String"]>;
  schemaUrl_contains?: InputMaybe<Scalars["String"]>;
  schemaUrl_contains_nocase?: InputMaybe<Scalars["String"]>;
  schemaUrl_ends_with?: InputMaybe<Scalars["String"]>;
  schemaUrl_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  schemaUrl_gt?: InputMaybe<Scalars["String"]>;
  schemaUrl_gte?: InputMaybe<Scalars["String"]>;
  schemaUrl_in?: InputMaybe<Array<Scalars["String"]>>;
  schemaUrl_lt?: InputMaybe<Scalars["String"]>;
  schemaUrl_lte?: InputMaybe<Scalars["String"]>;
  schemaUrl_not?: InputMaybe<Scalars["String"]>;
  schemaUrl_not_contains?: InputMaybe<Scalars["String"]>;
  schemaUrl_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  schemaUrl_not_ends_with?: InputMaybe<Scalars["String"]>;
  schemaUrl_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  schemaUrl_not_in?: InputMaybe<Array<Scalars["String"]>>;
  schemaUrl_not_starts_with?: InputMaybe<Scalars["String"]>;
  schemaUrl_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  schemaUrl_starts_with?: InputMaybe<Scalars["String"]>;
  schemaUrl_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  seller?: InputMaybe<Scalars["String"]>;
  seller_contains?: InputMaybe<Scalars["String"]>;
  seller_contains_nocase?: InputMaybe<Scalars["String"]>;
  seller_ends_with?: InputMaybe<Scalars["String"]>;
  seller_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  seller_gt?: InputMaybe<Scalars["String"]>;
  seller_gte?: InputMaybe<Scalars["String"]>;
  seller_in?: InputMaybe<Array<Scalars["String"]>>;
  seller_lt?: InputMaybe<Scalars["String"]>;
  seller_lte?: InputMaybe<Scalars["String"]>;
  seller_not?: InputMaybe<Scalars["String"]>;
  seller_not_contains?: InputMaybe<Scalars["String"]>;
  seller_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  seller_not_ends_with?: InputMaybe<Scalars["String"]>;
  seller_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  seller_not_in?: InputMaybe<Array<Scalars["String"]>>;
  seller_not_starts_with?: InputMaybe<Scalars["String"]>;
  seller_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  seller_starts_with?: InputMaybe<Scalars["String"]>;
  seller_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  tags?: InputMaybe<Array<Scalars["String"]>>;
  tags_contains?: InputMaybe<Array<Scalars["String"]>>;
  tags_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  tags_not?: InputMaybe<Array<Scalars["String"]>>;
  tags_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  tags_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  type?: InputMaybe<MetadataType>;
  type_in?: InputMaybe<Array<MetadataType>>;
  type_not?: InputMaybe<MetadataType>;
  type_not_in?: InputMaybe<Array<MetadataType>>;
  validFromDate?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_gt?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_gte?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  validFromDate_lt?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_lte?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_not?: InputMaybe<Scalars["BigInt"]>;
  validFromDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  validUntilDate?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_gt?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_gte?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  validUntilDate_lt?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_lte?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_not?: InputMaybe<Scalars["BigInt"]>;
  validUntilDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  voided?: InputMaybe<Scalars["Boolean"]>;
  voided_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  voided_not?: InputMaybe<Scalars["Boolean"]>;
  voided_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
};

export enum ProductV1MetadataEntity_OrderBy {
  Brand = "brand",
  BrandName = "brandName",
  CreatedAt = "createdAt",
  Description = "description",
  ExchangeToken = "exchangeToken",
  ExternalUrl = "externalUrl",
  Id = "id",
  Images = "images",
  Name = "name",
  Offer = "offer",
  SchemaUrl = "schemaUrl",
  Seller = "seller",
  Tags = "tags",
  Type = "type",
  ValidFromDate = "validFromDate",
  ValidUntilDate = "validUntilDate",
  Voided = "voided"
}

export type Query = {
  __typename?: "Query";
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  baseMetadataEntities: Array<BaseMetadataEntity>;
  baseMetadataEntity?: Maybe<BaseMetadataEntity>;
  buyer?: Maybe<Buyer>;
  buyers: Array<Buyer>;
  disputeResolver?: Maybe<DisputeResolver>;
  disputeResolvers: Array<DisputeResolver>;
  exchange?: Maybe<Exchange>;
  exchangeToken?: Maybe<ExchangeToken>;
  exchangeTokens: Array<ExchangeToken>;
  exchanges: Array<Exchange>;
  fundsEntities: Array<FundsEntity>;
  fundsEntity?: Maybe<FundsEntity>;
  metadataInterface?: Maybe<MetadataInterface>;
  metadataInterfaces: Array<MetadataInterface>;
  offer?: Maybe<Offer>;
  offers: Array<Offer>;
  productV1Brand?: Maybe<ProductV1Brand>;
  productV1Brands: Array<ProductV1Brand>;
  productV1MetadataEntities: Array<ProductV1MetadataEntity>;
  productV1MetadataEntity?: Maybe<ProductV1MetadataEntity>;
  seller?: Maybe<Seller>;
  sellers: Array<Seller>;
};

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type QueryAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Account_Filter>;
};

export type QueryBaseMetadataEntitiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<BaseMetadataEntity_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BaseMetadataEntity_Filter>;
};

export type QueryBaseMetadataEntityArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryBuyerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryBuyersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Buyer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Buyer_Filter>;
};

export type QueryDisputeResolverArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDisputeResolversArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<DisputeResolver_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DisputeResolver_Filter>;
};

export type QueryExchangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryExchangeTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryExchangeTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ExchangeToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ExchangeToken_Filter>;
};

export type QueryExchangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Exchange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Exchange_Filter>;
};

export type QueryFundsEntitiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<FundsEntity_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FundsEntity_Filter>;
};

export type QueryFundsEntityArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryMetadataInterfaceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryMetadataInterfacesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<MetadataInterface_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MetadataInterface_Filter>;
};

export type QueryOfferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryOffersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Offer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Offer_Filter>;
};

export type QueryProductV1BrandArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProductV1BrandsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Brand_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1Brand_Filter>;
};

export type QueryProductV1MetadataEntitiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1MetadataEntity_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1MetadataEntity_Filter>;
};

export type QueryProductV1MetadataEntityArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySellerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySellersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Seller_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Seller_Filter>;
};

export type Seller = Account & {
  __typename?: "Seller";
  active: Scalars["Boolean"];
  admin: Scalars["Bytes"];
  clerk: Scalars["Bytes"];
  exchanges: Array<Exchange>;
  funds: Array<FundsEntity>;
  id: Scalars["ID"];
  offers: Array<Offer>;
  operator: Scalars["Bytes"];
  sellerId: Scalars["BigInt"];
  treasury: Scalars["Bytes"];
};

export type SellerExchangesArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Exchange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<Exchange_Filter>;
};

export type SellerFundsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<FundsEntity_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<FundsEntity_Filter>;
};

export type SellerOffersArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Offer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<Offer_Filter>;
};

export type Seller_Filter = {
  active?: InputMaybe<Scalars["Boolean"]>;
  active_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  active_not?: InputMaybe<Scalars["Boolean"]>;
  active_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  admin?: InputMaybe<Scalars["Bytes"]>;
  admin_contains?: InputMaybe<Scalars["Bytes"]>;
  admin_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  admin_not?: InputMaybe<Scalars["Bytes"]>;
  admin_not_contains?: InputMaybe<Scalars["Bytes"]>;
  admin_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  clerk?: InputMaybe<Scalars["Bytes"]>;
  clerk_contains?: InputMaybe<Scalars["Bytes"]>;
  clerk_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  clerk_not?: InputMaybe<Scalars["Bytes"]>;
  clerk_not_contains?: InputMaybe<Scalars["Bytes"]>;
  clerk_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  operator?: InputMaybe<Scalars["Bytes"]>;
  operator_contains?: InputMaybe<Scalars["Bytes"]>;
  operator_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  operator_not?: InputMaybe<Scalars["Bytes"]>;
  operator_not_contains?: InputMaybe<Scalars["Bytes"]>;
  operator_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  sellerId?: InputMaybe<Scalars["BigInt"]>;
  sellerId_gt?: InputMaybe<Scalars["BigInt"]>;
  sellerId_gte?: InputMaybe<Scalars["BigInt"]>;
  sellerId_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  sellerId_lt?: InputMaybe<Scalars["BigInt"]>;
  sellerId_lte?: InputMaybe<Scalars["BigInt"]>;
  sellerId_not?: InputMaybe<Scalars["BigInt"]>;
  sellerId_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  treasury?: InputMaybe<Scalars["Bytes"]>;
  treasury_contains?: InputMaybe<Scalars["Bytes"]>;
  treasury_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  treasury_not?: InputMaybe<Scalars["Bytes"]>;
  treasury_not_contains?: InputMaybe<Scalars["Bytes"]>;
  treasury_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
};

export enum Seller_OrderBy {
  Active = "active",
  Admin = "admin",
  Clerk = "clerk",
  Exchanges = "exchanges",
  Funds = "funds",
  Id = "id",
  Offers = "offers",
  Operator = "operator",
  SellerId = "sellerId",
  Treasury = "treasury"
}

export type Subscription = {
  __typename?: "Subscription";
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  baseMetadataEntities: Array<BaseMetadataEntity>;
  baseMetadataEntity?: Maybe<BaseMetadataEntity>;
  buyer?: Maybe<Buyer>;
  buyers: Array<Buyer>;
  disputeResolver?: Maybe<DisputeResolver>;
  disputeResolvers: Array<DisputeResolver>;
  exchange?: Maybe<Exchange>;
  exchangeToken?: Maybe<ExchangeToken>;
  exchangeTokens: Array<ExchangeToken>;
  exchanges: Array<Exchange>;
  fundsEntities: Array<FundsEntity>;
  fundsEntity?: Maybe<FundsEntity>;
  metadataInterface?: Maybe<MetadataInterface>;
  metadataInterfaces: Array<MetadataInterface>;
  offer?: Maybe<Offer>;
  offers: Array<Offer>;
  productV1Brand?: Maybe<ProductV1Brand>;
  productV1Brands: Array<ProductV1Brand>;
  productV1MetadataEntities: Array<ProductV1MetadataEntity>;
  productV1MetadataEntity?: Maybe<ProductV1MetadataEntity>;
  seller?: Maybe<Seller>;
  sellers: Array<Seller>;
};

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type SubscriptionAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Account_Filter>;
};

export type SubscriptionBaseMetadataEntitiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<BaseMetadataEntity_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BaseMetadataEntity_Filter>;
};

export type SubscriptionBaseMetadataEntityArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionBuyerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionBuyersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Buyer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Buyer_Filter>;
};

export type SubscriptionDisputeResolverArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDisputeResolversArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<DisputeResolver_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DisputeResolver_Filter>;
};

export type SubscriptionExchangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionExchangeTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionExchangeTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ExchangeToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ExchangeToken_Filter>;
};

export type SubscriptionExchangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Exchange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Exchange_Filter>;
};

export type SubscriptionFundsEntitiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<FundsEntity_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FundsEntity_Filter>;
};

export type SubscriptionFundsEntityArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionMetadataInterfaceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionMetadataInterfacesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<MetadataInterface_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MetadataInterface_Filter>;
};

export type SubscriptionOfferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionOffersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Offer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Offer_Filter>;
};

export type SubscriptionProductV1BrandArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProductV1BrandsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Brand_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1Brand_Filter>;
};

export type SubscriptionProductV1MetadataEntitiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1MetadataEntity_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1MetadataEntity_Filter>;
};

export type SubscriptionProductV1MetadataEntityArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSellerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSellersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Seller_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Seller_Filter>;
};

export type _Block_ = {
  __typename?: "_Block_";
  /** The hash of the block */
  hash?: Maybe<Scalars["Bytes"]>;
  /** The block number */
  number: Scalars["Int"];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: "_Meta_";
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars["String"];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars["Boolean"];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = "allow",
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = "deny"
}

export type GetSellerByOperatorQueryQueryVariables = Exact<{
  operator: Scalars["Bytes"];
  fundsTokenAddress?: InputMaybe<Scalars["Bytes"]>;
}>;

export type GetSellerByOperatorQueryQuery = {
  __typename?: "Query";
  sellers: Array<{
    __typename?: "Seller";
    id: string;
    operator: string;
    admin: string;
    clerk: string;
    treasury: string;
    active: boolean;
    funds: Array<{
      __typename?: "FundsEntity";
      availableAmount: string;
      token: {
        __typename?: "ExchangeToken";
        address: string;
        decimals: string;
        name: string;
        symbol: string;
      };
    }>;
  }>;
};

export type GetSellerByAdminQueryQueryVariables = Exact<{
  admin: Scalars["Bytes"];
  fundsTokenAddress?: InputMaybe<Scalars["Bytes"]>;
}>;

export type GetSellerByAdminQueryQuery = {
  __typename?: "Query";
  sellers: Array<{
    __typename?: "Seller";
    id: string;
    operator: string;
    admin: string;
    clerk: string;
    treasury: string;
    active: boolean;
    funds: Array<{
      __typename?: "FundsEntity";
      availableAmount: string;
      token: {
        __typename?: "ExchangeToken";
        address: string;
        decimals: string;
        name: string;
        symbol: string;
      };
    }>;
  }>;
};

export type GetSellerByClerkQueryQueryVariables = Exact<{
  clerk: Scalars["Bytes"];
  fundsTokenAddress?: InputMaybe<Scalars["Bytes"]>;
}>;

export type GetSellerByClerkQueryQuery = {
  __typename?: "Query";
  sellers: Array<{
    __typename?: "Seller";
    id: string;
    operator: string;
    admin: string;
    clerk: string;
    treasury: string;
    active: boolean;
    funds: Array<{
      __typename?: "FundsEntity";
      availableAmount: string;
      token: {
        __typename?: "ExchangeToken";
        address: string;
        decimals: string;
        name: string;
        symbol: string;
      };
    }>;
  }>;
};

export type SellerFieldsFragment = {
  __typename?: "Seller";
  id: string;
  operator: string;
  admin: string;
  clerk: string;
  treasury: string;
  active: boolean;
  funds: Array<{
    __typename?: "FundsEntity";
    availableAmount: string;
    token: {
      __typename?: "ExchangeToken";
      address: string;
      decimals: string;
      name: string;
      symbol: string;
    };
  }>;
};

export type GetFundsByAccountIdQueryQueryVariables = Exact<{
  accountId: Scalars["BigInt"];
}>;

export type GetFundsByAccountIdQueryQuery = {
  __typename?: "Query";
  fundsEntities: Array<{
    __typename?: "FundsEntity";
    id: string;
    availableAmount: string;
    accountId: string;
    token: {
      __typename?: "ExchangeToken";
      address: string;
      name: string;
      symbol: string;
      decimals: string;
    };
  }>;
};

export type FundsEntityFieldsFragment = {
  __typename?: "FundsEntity";
  id: string;
  availableAmount: string;
  accountId: string;
  token: {
    __typename?: "ExchangeToken";
    address: string;
    name: string;
    symbol: string;
    decimals: string;
  };
};

export type GetOfferByIdQueryQueryVariables = Exact<{
  offerId: Scalars["ID"];
}>;

export type GetOfferByIdQueryQuery = {
  __typename?: "Query";
  offer?: {
    __typename?: "Offer";
    id: string;
    createdAt: string;
    price: string;
    sellerDeposit: string;
    protocolFee: string;
    buyerCancelPenalty: string;
    quantityAvailable: string;
    quantityInitial: string;
    validFromDate: string;
    validUntilDate: string;
    voucherRedeemableFromDate: string;
    voucherRedeemableUntilDate: string;
    fulfillmentPeriodDuration: string;
    voucherValidDuration: string;
    resolutionPeriodDuration: string;
    metadataUri: string;
    offerChecksum: string;
    voidedAt?: string | null;
    disputeResolverId: string;
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      active: boolean;
    };
    exchangeToken: {
      __typename?: "ExchangeToken";
      address: string;
      decimals: string;
      name: string;
      symbol: string;
    };
    metadata?:
      | {
          __typename?: "BaseMetadataEntity";
          name?: string | null;
          description?: string | null;
          externalUrl?: string | null;
          schemaUrl?: string | null;
          type: MetadataType;
        }
      | {
          __typename?: "ProductV1MetadataEntity";
          name?: string | null;
          description?: string | null;
          externalUrl?: string | null;
          schemaUrl?: string | null;
          type: MetadataType;
        }
      | null;
    exchanges: Array<{
      __typename?: "Exchange";
      id: string;
      committedDate: string;
      redeemedDate?: string | null;
      finalizedDate?: string | null;
      expired: boolean;
      disputed: boolean;
    }>;
  } | null;
};

export type GetAllOffersOfOperatorQueryQueryVariables = Exact<{
  operator: Scalars["Bytes"];
  first?: InputMaybe<Scalars["Int"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Offer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type GetAllOffersOfOperatorQueryQuery = {
  __typename?: "Query";
  sellers: Array<{
    __typename?: "Seller";
    offers: Array<{
      __typename?: "Offer";
      id: string;
      createdAt: string;
      price: string;
      sellerDeposit: string;
      protocolFee: string;
      buyerCancelPenalty: string;
      quantityAvailable: string;
      quantityInitial: string;
      validFromDate: string;
      validUntilDate: string;
      voucherRedeemableFromDate: string;
      voucherRedeemableUntilDate: string;
      fulfillmentPeriodDuration: string;
      voucherValidDuration: string;
      resolutionPeriodDuration: string;
      metadataUri: string;
      offerChecksum: string;
      voidedAt?: string | null;
      disputeResolverId: string;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        active: boolean;
      };
      exchangeToken: {
        __typename?: "ExchangeToken";
        address: string;
        decimals: string;
        name: string;
        symbol: string;
      };
      metadata?:
        | {
            __typename?: "BaseMetadataEntity";
            name?: string | null;
            description?: string | null;
            externalUrl?: string | null;
            schemaUrl?: string | null;
            type: MetadataType;
          }
        | {
            __typename?: "ProductV1MetadataEntity";
            name?: string | null;
            description?: string | null;
            externalUrl?: string | null;
            schemaUrl?: string | null;
            type: MetadataType;
          }
        | null;
      exchanges: Array<{
        __typename?: "Exchange";
        id: string;
        committedDate: string;
        redeemedDate?: string | null;
        finalizedDate?: string | null;
        expired: boolean;
        disputed: boolean;
      }>;
    }>;
  }>;
};

export type OfferFieldsFragment = {
  __typename?: "Offer";
  id: string;
  createdAt: string;
  price: string;
  sellerDeposit: string;
  protocolFee: string;
  buyerCancelPenalty: string;
  quantityAvailable: string;
  quantityInitial: string;
  validFromDate: string;
  validUntilDate: string;
  voucherRedeemableFromDate: string;
  voucherRedeemableUntilDate: string;
  fulfillmentPeriodDuration: string;
  voucherValidDuration: string;
  resolutionPeriodDuration: string;
  metadataUri: string;
  offerChecksum: string;
  voidedAt?: string | null;
  disputeResolverId: string;
  seller: {
    __typename?: "Seller";
    id: string;
    operator: string;
    admin: string;
    clerk: string;
    treasury: string;
    active: boolean;
  };
  exchangeToken: {
    __typename?: "ExchangeToken";
    address: string;
    decimals: string;
    name: string;
    symbol: string;
  };
  metadata?:
    | {
        __typename?: "BaseMetadataEntity";
        name?: string | null;
        description?: string | null;
        externalUrl?: string | null;
        schemaUrl?: string | null;
        type: MetadataType;
      }
    | {
        __typename?: "ProductV1MetadataEntity";
        name?: string | null;
        description?: string | null;
        externalUrl?: string | null;
        schemaUrl?: string | null;
        type: MetadataType;
      }
    | null;
  exchanges: Array<{
    __typename?: "Exchange";
    id: string;
    committedDate: string;
    redeemedDate?: string | null;
    finalizedDate?: string | null;
    expired: boolean;
    disputed: boolean;
  }>;
};

export const SellerFieldsFragmentDoc = gql`
  fragment SellerFields on Seller {
    id
    operator
    admin
    clerk
    treasury
    active
    funds(where: { tokenAddress: $fundsTokenAddress }) {
      availableAmount
      token {
        address
        decimals
        name
        symbol
      }
    }
  }
`;
export const FundsEntityFieldsFragmentDoc = gql`
  fragment FundsEntityFields on FundsEntity {
    id
    availableAmount
    token {
      address
      name
      symbol
      decimals
    }
    accountId
  }
`;
export const OfferFieldsFragmentDoc = gql`
  fragment OfferFields on Offer {
    id
    createdAt
    price
    sellerDeposit
    protocolFee
    buyerCancelPenalty
    quantityAvailable
    quantityInitial
    validFromDate
    validUntilDate
    voucherRedeemableFromDate
    voucherRedeemableUntilDate
    fulfillmentPeriodDuration
    voucherValidDuration
    resolutionPeriodDuration
    metadataUri
    offerChecksum
    voidedAt
    disputeResolverId
    seller {
      id
      operator
      admin
      clerk
      treasury
      active
    }
    exchangeToken {
      address
      decimals
      name
      symbol
    }
    metadata {
      name
      description
      externalUrl
      schemaUrl
      type
    }
    exchanges {
      id
      committedDate
      redeemedDate
      finalizedDate
      expired
      disputed
    }
  }
`;
export const GetSellerByOperatorQueryDocument = gql`
  query getSellerByOperatorQuery($operator: Bytes!, $fundsTokenAddress: Bytes) {
    sellers(where: { operator: $operator }) {
      ...SellerFields
    }
  }
  ${SellerFieldsFragmentDoc}
`;
export const GetSellerByAdminQueryDocument = gql`
  query getSellerByAdminQuery($admin: Bytes!, $fundsTokenAddress: Bytes) {
    sellers(where: { admin: $admin }) {
      ...SellerFields
    }
  }
  ${SellerFieldsFragmentDoc}
`;
export const GetSellerByClerkQueryDocument = gql`
  query getSellerByClerkQuery($clerk: Bytes!, $fundsTokenAddress: Bytes) {
    sellers(where: { clerk: $clerk }) {
      ...SellerFields
    }
  }
  ${SellerFieldsFragmentDoc}
`;
export const GetFundsByAccountIdQueryDocument = gql`
  query getFundsByAccountIdQuery($accountId: BigInt!) {
    fundsEntities(where: { accountId: $accountId }) {
      ...FundsEntityFields
    }
  }
  ${FundsEntityFieldsFragmentDoc}
`;
export const GetOfferByIdQueryDocument = gql`
  query getOfferByIdQuery($offerId: ID!) {
    offer(id: $offerId) {
      ...OfferFields
    }
  }
  ${OfferFieldsFragmentDoc}
`;
export const GetAllOffersOfOperatorQueryDocument = gql`
  query getAllOffersOfOperatorQuery(
    $operator: Bytes!
    $first: Int
    $skip: Int
    $orderBy: Offer_orderBy
    $orderDirection: OrderDirection
  ) {
    sellers(where: { operator: $operator }) {
      offers(
        first: $first
        skip: $skip
        orderBy: $orderBy
        orderDirection: $orderDirection
      ) {
        ...OfferFields
      }
    }
  }
  ${OfferFieldsFragmentDoc}
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper
) {
  return {
    getSellerByOperatorQuery(
      variables: GetSellerByOperatorQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetSellerByOperatorQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetSellerByOperatorQueryQuery>(
            GetSellerByOperatorQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getSellerByOperatorQuery",
        "query"
      );
    },
    getSellerByAdminQuery(
      variables: GetSellerByAdminQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetSellerByAdminQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetSellerByAdminQueryQuery>(
            GetSellerByAdminQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getSellerByAdminQuery",
        "query"
      );
    },
    getSellerByClerkQuery(
      variables: GetSellerByClerkQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetSellerByClerkQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetSellerByClerkQueryQuery>(
            GetSellerByClerkQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getSellerByClerkQuery",
        "query"
      );
    },
    getFundsByAccountIdQuery(
      variables: GetFundsByAccountIdQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetFundsByAccountIdQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetFundsByAccountIdQueryQuery>(
            GetFundsByAccountIdQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getFundsByAccountIdQuery",
        "query"
      );
    },
    getOfferByIdQuery(
      variables: GetOfferByIdQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetOfferByIdQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetOfferByIdQueryQuery>(
            GetOfferByIdQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getOfferByIdQuery",
        "query"
      );
    },
    getAllOffersOfOperatorQuery(
      variables: GetAllOffersOfOperatorQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetAllOffersOfOperatorQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetAllOffersOfOperatorQueryQuery>(
            GetAllOffersOfOperatorQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getAllOffersOfOperatorQuery",
        "query"
      );
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
