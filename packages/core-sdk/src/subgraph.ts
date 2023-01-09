import { GraphQLClient } from "graphql-request";
import * as Dom from "graphql-request/dist/types.dom";
import { gql } from "graphql-request";
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
  logs: Array<EventLog>;
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

/**
 * Accounts
 *
 */
export type AccountLogsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<EventLog_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<EventLog_Filter>;
};

export type AccountEventLog = EventLog & {
  __typename?: "AccountEventLog";
  account: Account;
  executedBy: Scalars["Bytes"];
  hash: Scalars["String"];
  id: Scalars["ID"];
  timestamp: Scalars["BigInt"];
  type: EventType;
};

export type AccountEventLog_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]>;
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
  executedBy?: InputMaybe<Scalars["Bytes"]>;
  executedBy_contains?: InputMaybe<Scalars["Bytes"]>;
  executedBy_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  executedBy_not?: InputMaybe<Scalars["Bytes"]>;
  executedBy_not_contains?: InputMaybe<Scalars["Bytes"]>;
  executedBy_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  hash?: InputMaybe<Scalars["String"]>;
  hash_contains?: InputMaybe<Scalars["String"]>;
  hash_contains_nocase?: InputMaybe<Scalars["String"]>;
  hash_ends_with?: InputMaybe<Scalars["String"]>;
  hash_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  hash_gt?: InputMaybe<Scalars["String"]>;
  hash_gte?: InputMaybe<Scalars["String"]>;
  hash_in?: InputMaybe<Array<Scalars["String"]>>;
  hash_lt?: InputMaybe<Scalars["String"]>;
  hash_lte?: InputMaybe<Scalars["String"]>;
  hash_not?: InputMaybe<Scalars["String"]>;
  hash_not_contains?: InputMaybe<Scalars["String"]>;
  hash_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  hash_not_ends_with?: InputMaybe<Scalars["String"]>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  hash_not_in?: InputMaybe<Array<Scalars["String"]>>;
  hash_not_starts_with?: InputMaybe<Scalars["String"]>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  hash_starts_with?: InputMaybe<Scalars["String"]>;
  hash_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  timestamp?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  type?: InputMaybe<EventType>;
  type_in?: InputMaybe<Array<EventType>>;
  type_not?: InputMaybe<EventType>;
  type_not_in?: InputMaybe<Array<EventType>>;
};

export enum AccountEventLog_OrderBy {
  Account = "account",
  ExecutedBy = "executedBy",
  Hash = "hash",
  Id = "id",
  Timestamp = "timestamp",
  Type = "type"
}

export type Account_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  funds_?: InputMaybe<FundsEntity_Filter>;
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
  Id = "id",
  Logs = "logs"
}

export type BaseMetadataEntity = MetadataInterface & {
  __typename?: "BaseMetadataEntity";
  animationUrl?: Maybe<Scalars["String"]>;
  attributes?: Maybe<Array<MetadataAttribute>>;
  condition?: Maybe<Scalars["String"]>;
  /**
   * Enriched fields from offer entity to allow nested query workaround
   *
   */
  createdAt: Scalars["BigInt"];
  description: Scalars["String"];
  exchangeToken: ExchangeToken;
  externalUrl: Scalars["String"];
  /**
   * Fields compliant to metadata standard
   *
   */
  id: Scalars["ID"];
  image: Scalars["String"];
  licenseUrl: Scalars["String"];
  name: Scalars["String"];
  numberOfCommits: Scalars["BigInt"];
  numberOfRedemptions: Scalars["BigInt"];
  /**
   * References to entities
   *
   */
  offer: Offer;
  quantityAvailable: Scalars["BigInt"];
  schemaUrl: Scalars["String"];
  seller: Seller;
  /** MetadataType.BASE */
  type: MetadataType;
  validFromDate: Scalars["BigInt"];
  validUntilDate: Scalars["BigInt"];
  voided: Scalars["Boolean"];
};

export type BaseMetadataEntityAttributesArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<MetadataAttribute_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<MetadataAttribute_Filter>;
};

export type BaseMetadataEntity_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  animationUrl?: InputMaybe<Scalars["String"]>;
  animationUrl_contains?: InputMaybe<Scalars["String"]>;
  animationUrl_contains_nocase?: InputMaybe<Scalars["String"]>;
  animationUrl_ends_with?: InputMaybe<Scalars["String"]>;
  animationUrl_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  animationUrl_gt?: InputMaybe<Scalars["String"]>;
  animationUrl_gte?: InputMaybe<Scalars["String"]>;
  animationUrl_in?: InputMaybe<Array<Scalars["String"]>>;
  animationUrl_lt?: InputMaybe<Scalars["String"]>;
  animationUrl_lte?: InputMaybe<Scalars["String"]>;
  animationUrl_not?: InputMaybe<Scalars["String"]>;
  animationUrl_not_contains?: InputMaybe<Scalars["String"]>;
  animationUrl_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  animationUrl_not_ends_with?: InputMaybe<Scalars["String"]>;
  animationUrl_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  animationUrl_not_in?: InputMaybe<Array<Scalars["String"]>>;
  animationUrl_not_starts_with?: InputMaybe<Scalars["String"]>;
  animationUrl_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  animationUrl_starts_with?: InputMaybe<Scalars["String"]>;
  animationUrl_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  attributes?: InputMaybe<Array<Scalars["String"]>>;
  attributes_?: InputMaybe<MetadataAttribute_Filter>;
  attributes_contains?: InputMaybe<Array<Scalars["String"]>>;
  attributes_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  attributes_not?: InputMaybe<Array<Scalars["String"]>>;
  attributes_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  attributes_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  condition?: InputMaybe<Scalars["String"]>;
  condition_contains?: InputMaybe<Scalars["String"]>;
  condition_contains_nocase?: InputMaybe<Scalars["String"]>;
  condition_ends_with?: InputMaybe<Scalars["String"]>;
  condition_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  condition_gt?: InputMaybe<Scalars["String"]>;
  condition_gte?: InputMaybe<Scalars["String"]>;
  condition_in?: InputMaybe<Array<Scalars["String"]>>;
  condition_lt?: InputMaybe<Scalars["String"]>;
  condition_lte?: InputMaybe<Scalars["String"]>;
  condition_not?: InputMaybe<Scalars["String"]>;
  condition_not_contains?: InputMaybe<Scalars["String"]>;
  condition_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  condition_not_ends_with?: InputMaybe<Scalars["String"]>;
  condition_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  condition_not_in?: InputMaybe<Array<Scalars["String"]>>;
  condition_not_starts_with?: InputMaybe<Scalars["String"]>;
  condition_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  condition_starts_with?: InputMaybe<Scalars["String"]>;
  condition_starts_with_nocase?: InputMaybe<Scalars["String"]>;
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
  exchangeToken_?: InputMaybe<ExchangeToken_Filter>;
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
  image?: InputMaybe<Scalars["String"]>;
  image_contains?: InputMaybe<Scalars["String"]>;
  image_contains_nocase?: InputMaybe<Scalars["String"]>;
  image_ends_with?: InputMaybe<Scalars["String"]>;
  image_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  image_gt?: InputMaybe<Scalars["String"]>;
  image_gte?: InputMaybe<Scalars["String"]>;
  image_in?: InputMaybe<Array<Scalars["String"]>>;
  image_lt?: InputMaybe<Scalars["String"]>;
  image_lte?: InputMaybe<Scalars["String"]>;
  image_not?: InputMaybe<Scalars["String"]>;
  image_not_contains?: InputMaybe<Scalars["String"]>;
  image_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  image_not_ends_with?: InputMaybe<Scalars["String"]>;
  image_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  image_not_in?: InputMaybe<Array<Scalars["String"]>>;
  image_not_starts_with?: InputMaybe<Scalars["String"]>;
  image_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  image_starts_with?: InputMaybe<Scalars["String"]>;
  image_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  licenseUrl?: InputMaybe<Scalars["String"]>;
  licenseUrl_contains?: InputMaybe<Scalars["String"]>;
  licenseUrl_contains_nocase?: InputMaybe<Scalars["String"]>;
  licenseUrl_ends_with?: InputMaybe<Scalars["String"]>;
  licenseUrl_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  licenseUrl_gt?: InputMaybe<Scalars["String"]>;
  licenseUrl_gte?: InputMaybe<Scalars["String"]>;
  licenseUrl_in?: InputMaybe<Array<Scalars["String"]>>;
  licenseUrl_lt?: InputMaybe<Scalars["String"]>;
  licenseUrl_lte?: InputMaybe<Scalars["String"]>;
  licenseUrl_not?: InputMaybe<Scalars["String"]>;
  licenseUrl_not_contains?: InputMaybe<Scalars["String"]>;
  licenseUrl_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  licenseUrl_not_ends_with?: InputMaybe<Scalars["String"]>;
  licenseUrl_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  licenseUrl_not_in?: InputMaybe<Array<Scalars["String"]>>;
  licenseUrl_not_starts_with?: InputMaybe<Scalars["String"]>;
  licenseUrl_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  licenseUrl_starts_with?: InputMaybe<Scalars["String"]>;
  licenseUrl_starts_with_nocase?: InputMaybe<Scalars["String"]>;
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
  numberOfCommits?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_gt?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_gte?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  numberOfCommits_lt?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_lte?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_not?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  numberOfRedemptions?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_gt?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_gte?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  numberOfRedemptions_lt?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_lte?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_not?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  offer?: InputMaybe<Scalars["String"]>;
  offer_?: InputMaybe<Offer_Filter>;
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
  quantityAvailable?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_gt?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_gte?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  quantityAvailable_lt?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_lte?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_not?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
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
  seller_?: InputMaybe<Seller_Filter>;
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
  AnimationUrl = "animationUrl",
  Attributes = "attributes",
  Condition = "condition",
  CreatedAt = "createdAt",
  Description = "description",
  ExchangeToken = "exchangeToken",
  ExternalUrl = "externalUrl",
  Id = "id",
  Image = "image",
  LicenseUrl = "licenseUrl",
  Name = "name",
  NumberOfCommits = "numberOfCommits",
  NumberOfRedemptions = "numberOfRedemptions",
  Offer = "offer",
  QuantityAvailable = "quantityAvailable",
  SchemaUrl = "schemaUrl",
  Seller = "seller",
  Type = "type",
  ValidFromDate = "validFromDate",
  ValidUntilDate = "validUntilDate",
  Voided = "voided"
}

export type BlockChangedFilter = {
  number_gte: Scalars["Int"];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars["Bytes"]>;
  number?: InputMaybe<Scalars["Int"]>;
  number_gte?: InputMaybe<Scalars["Int"]>;
};

export type Buyer = Account & {
  __typename?: "Buyer";
  active: Scalars["Boolean"];
  exchanges: Array<Exchange>;
  funds: Array<FundsEntity>;
  id: Scalars["ID"];
  logs: Array<EventLog>;
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

export type BuyerLogsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<EventLog_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<EventLog_Filter>;
};

export type Buyer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  active?: InputMaybe<Scalars["Boolean"]>;
  active_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  active_not?: InputMaybe<Scalars["Boolean"]>;
  active_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  exchanges_?: InputMaybe<Exchange_Filter>;
  funds_?: InputMaybe<FundsEntity_Filter>;
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
  Logs = "logs",
  Wallet = "wallet"
}

/**
 * Groups
 *
 */
export type ConditionEntity = {
  __typename?: "ConditionEntity";
  id: Scalars["ID"];
  maxCommits: Scalars["BigInt"];
  method: Scalars["Int"];
  threshold: Scalars["BigInt"];
  tokenAddress: Scalars["Bytes"];
  tokenId: Scalars["BigInt"];
  tokenType: Scalars["Int"];
};

export type ConditionEntity_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  maxCommits?: InputMaybe<Scalars["BigInt"]>;
  maxCommits_gt?: InputMaybe<Scalars["BigInt"]>;
  maxCommits_gte?: InputMaybe<Scalars["BigInt"]>;
  maxCommits_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  maxCommits_lt?: InputMaybe<Scalars["BigInt"]>;
  maxCommits_lte?: InputMaybe<Scalars["BigInt"]>;
  maxCommits_not?: InputMaybe<Scalars["BigInt"]>;
  maxCommits_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  method?: InputMaybe<Scalars["Int"]>;
  method_gt?: InputMaybe<Scalars["Int"]>;
  method_gte?: InputMaybe<Scalars["Int"]>;
  method_in?: InputMaybe<Array<Scalars["Int"]>>;
  method_lt?: InputMaybe<Scalars["Int"]>;
  method_lte?: InputMaybe<Scalars["Int"]>;
  method_not?: InputMaybe<Scalars["Int"]>;
  method_not_in?: InputMaybe<Array<Scalars["Int"]>>;
  threshold?: InputMaybe<Scalars["BigInt"]>;
  threshold_gt?: InputMaybe<Scalars["BigInt"]>;
  threshold_gte?: InputMaybe<Scalars["BigInt"]>;
  threshold_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  threshold_lt?: InputMaybe<Scalars["BigInt"]>;
  threshold_lte?: InputMaybe<Scalars["BigInt"]>;
  threshold_not?: InputMaybe<Scalars["BigInt"]>;
  threshold_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  tokenAddress?: InputMaybe<Scalars["Bytes"]>;
  tokenAddress_contains?: InputMaybe<Scalars["Bytes"]>;
  tokenAddress_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  tokenAddress_not?: InputMaybe<Scalars["Bytes"]>;
  tokenAddress_not_contains?: InputMaybe<Scalars["Bytes"]>;
  tokenAddress_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  tokenId?: InputMaybe<Scalars["BigInt"]>;
  tokenId_gt?: InputMaybe<Scalars["BigInt"]>;
  tokenId_gte?: InputMaybe<Scalars["BigInt"]>;
  tokenId_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  tokenId_lt?: InputMaybe<Scalars["BigInt"]>;
  tokenId_lte?: InputMaybe<Scalars["BigInt"]>;
  tokenId_not?: InputMaybe<Scalars["BigInt"]>;
  tokenId_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  tokenType?: InputMaybe<Scalars["Int"]>;
  tokenType_gt?: InputMaybe<Scalars["Int"]>;
  tokenType_gte?: InputMaybe<Scalars["Int"]>;
  tokenType_in?: InputMaybe<Array<Scalars["Int"]>>;
  tokenType_lt?: InputMaybe<Scalars["Int"]>;
  tokenType_lte?: InputMaybe<Scalars["Int"]>;
  tokenType_not?: InputMaybe<Scalars["Int"]>;
  tokenType_not_in?: InputMaybe<Array<Scalars["Int"]>>;
};

export enum ConditionEntity_OrderBy {
  Id = "id",
  MaxCommits = "maxCommits",
  Method = "method",
  Threshold = "threshold",
  TokenAddress = "tokenAddress",
  TokenId = "tokenId",
  TokenType = "tokenType"
}

export type Dispute = {
  __typename?: "Dispute";
  buyer: Buyer;
  buyerPercent: Scalars["BigInt"];
  decidedDate?: Maybe<Scalars["BigInt"]>;
  disputeResolver: DisputeResolver;
  disputedDate: Scalars["BigInt"];
  escalatedDate?: Maybe<Scalars["BigInt"]>;
  exchange: Exchange;
  exchangeId: Scalars["BigInt"];
  finalizedDate?: Maybe<Scalars["BigInt"]>;
  id: Scalars["ID"];
  refusedDate?: Maybe<Scalars["BigInt"]>;
  resolvedDate?: Maybe<Scalars["BigInt"]>;
  retractedDate?: Maybe<Scalars["BigInt"]>;
  seller: Seller;
  state: DisputeState;
  timeout: Scalars["BigInt"];
};

export type DisputeEventLog = EventLog & {
  __typename?: "DisputeEventLog";
  account: Account;
  dispute: Dispute;
  executedBy: Scalars["Bytes"];
  hash: Scalars["String"];
  id: Scalars["ID"];
  timestamp: Scalars["BigInt"];
  type: EventType;
};

export type DisputeEventLog_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]>;
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
  dispute?: InputMaybe<Scalars["String"]>;
  dispute_?: InputMaybe<Dispute_Filter>;
  dispute_contains?: InputMaybe<Scalars["String"]>;
  dispute_contains_nocase?: InputMaybe<Scalars["String"]>;
  dispute_ends_with?: InputMaybe<Scalars["String"]>;
  dispute_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  dispute_gt?: InputMaybe<Scalars["String"]>;
  dispute_gte?: InputMaybe<Scalars["String"]>;
  dispute_in?: InputMaybe<Array<Scalars["String"]>>;
  dispute_lt?: InputMaybe<Scalars["String"]>;
  dispute_lte?: InputMaybe<Scalars["String"]>;
  dispute_not?: InputMaybe<Scalars["String"]>;
  dispute_not_contains?: InputMaybe<Scalars["String"]>;
  dispute_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  dispute_not_ends_with?: InputMaybe<Scalars["String"]>;
  dispute_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  dispute_not_in?: InputMaybe<Array<Scalars["String"]>>;
  dispute_not_starts_with?: InputMaybe<Scalars["String"]>;
  dispute_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  dispute_starts_with?: InputMaybe<Scalars["String"]>;
  dispute_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  executedBy?: InputMaybe<Scalars["Bytes"]>;
  executedBy_contains?: InputMaybe<Scalars["Bytes"]>;
  executedBy_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  executedBy_not?: InputMaybe<Scalars["Bytes"]>;
  executedBy_not_contains?: InputMaybe<Scalars["Bytes"]>;
  executedBy_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  hash?: InputMaybe<Scalars["String"]>;
  hash_contains?: InputMaybe<Scalars["String"]>;
  hash_contains_nocase?: InputMaybe<Scalars["String"]>;
  hash_ends_with?: InputMaybe<Scalars["String"]>;
  hash_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  hash_gt?: InputMaybe<Scalars["String"]>;
  hash_gte?: InputMaybe<Scalars["String"]>;
  hash_in?: InputMaybe<Array<Scalars["String"]>>;
  hash_lt?: InputMaybe<Scalars["String"]>;
  hash_lte?: InputMaybe<Scalars["String"]>;
  hash_not?: InputMaybe<Scalars["String"]>;
  hash_not_contains?: InputMaybe<Scalars["String"]>;
  hash_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  hash_not_ends_with?: InputMaybe<Scalars["String"]>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  hash_not_in?: InputMaybe<Array<Scalars["String"]>>;
  hash_not_starts_with?: InputMaybe<Scalars["String"]>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  hash_starts_with?: InputMaybe<Scalars["String"]>;
  hash_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  timestamp?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  type?: InputMaybe<EventType>;
  type_in?: InputMaybe<Array<EventType>>;
  type_not?: InputMaybe<EventType>;
  type_not_in?: InputMaybe<Array<EventType>>;
};

export enum DisputeEventLog_OrderBy {
  Account = "account",
  Dispute = "dispute",
  ExecutedBy = "executedBy",
  Hash = "hash",
  Id = "id",
  Timestamp = "timestamp",
  Type = "type"
}

export type DisputeResolutionTermsEntity = {
  __typename?: "DisputeResolutionTermsEntity";
  buyerEscalationDeposit: Scalars["BigInt"];
  disputeResolver: DisputeResolver;
  disputeResolverId: Scalars["BigInt"];
  escalationResponsePeriod: Scalars["BigInt"];
  feeAmount: Scalars["BigInt"];
  /** <DISPUTE_RESOLVER_ID>-terms */
  id: Scalars["ID"];
  offer: Offer;
};

export type DisputeResolutionTermsEntity_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  buyerEscalationDeposit?: InputMaybe<Scalars["BigInt"]>;
  buyerEscalationDeposit_gt?: InputMaybe<Scalars["BigInt"]>;
  buyerEscalationDeposit_gte?: InputMaybe<Scalars["BigInt"]>;
  buyerEscalationDeposit_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  buyerEscalationDeposit_lt?: InputMaybe<Scalars["BigInt"]>;
  buyerEscalationDeposit_lte?: InputMaybe<Scalars["BigInt"]>;
  buyerEscalationDeposit_not?: InputMaybe<Scalars["BigInt"]>;
  buyerEscalationDeposit_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  disputeResolver?: InputMaybe<Scalars["String"]>;
  disputeResolverId?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_gt?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_gte?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  disputeResolverId_lt?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_lte?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_not?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  disputeResolver_?: InputMaybe<DisputeResolver_Filter>;
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
  escalationResponsePeriod?: InputMaybe<Scalars["BigInt"]>;
  escalationResponsePeriod_gt?: InputMaybe<Scalars["BigInt"]>;
  escalationResponsePeriod_gte?: InputMaybe<Scalars["BigInt"]>;
  escalationResponsePeriod_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  escalationResponsePeriod_lt?: InputMaybe<Scalars["BigInt"]>;
  escalationResponsePeriod_lte?: InputMaybe<Scalars["BigInt"]>;
  escalationResponsePeriod_not?: InputMaybe<Scalars["BigInt"]>;
  escalationResponsePeriod_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  feeAmount?: InputMaybe<Scalars["BigInt"]>;
  feeAmount_gt?: InputMaybe<Scalars["BigInt"]>;
  feeAmount_gte?: InputMaybe<Scalars["BigInt"]>;
  feeAmount_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  feeAmount_lt?: InputMaybe<Scalars["BigInt"]>;
  feeAmount_lte?: InputMaybe<Scalars["BigInt"]>;
  feeAmount_not?: InputMaybe<Scalars["BigInt"]>;
  feeAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  offer?: InputMaybe<Scalars["String"]>;
  offer_?: InputMaybe<Offer_Filter>;
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
};

export enum DisputeResolutionTermsEntity_OrderBy {
  BuyerEscalationDeposit = "buyerEscalationDeposit",
  DisputeResolver = "disputeResolver",
  DisputeResolverId = "disputeResolverId",
  EscalationResponsePeriod = "escalationResponsePeriod",
  FeeAmount = "feeAmount",
  Id = "id",
  Offer = "offer"
}

export type DisputeResolver = Account & {
  __typename?: "DisputeResolver";
  active: Scalars["Boolean"];
  admin: Scalars["Bytes"];
  clerk: Scalars["Bytes"];
  escalationResponsePeriod: Scalars["BigInt"];
  fees: Array<DisputeResolverFee>;
  funds: Array<FundsEntity>;
  id: Scalars["ID"];
  logs: Array<EventLog>;
  metadataUri: Scalars["String"];
  offers: Array<Offer>;
  operator: Scalars["Bytes"];
  pendingDisputeResolver?: Maybe<PendingDisputeResolver>;
  sellerAllowList: Array<Scalars["BigInt"]>;
  treasury: Scalars["Bytes"];
};

export type DisputeResolverFeesArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<DisputeResolverFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<DisputeResolverFee_Filter>;
};

export type DisputeResolverFundsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<FundsEntity_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<FundsEntity_Filter>;
};

export type DisputeResolverLogsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<EventLog_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<EventLog_Filter>;
};

export type DisputeResolverOffersArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Offer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<Offer_Filter>;
};

export type DisputeResolverFee = {
  __typename?: "DisputeResolverFee";
  feeAmount: Scalars["BigInt"];
  /** <DISPUTE_RESOLVER_ID>-<TOKEN_ADDRESS>-fee */
  id: Scalars["ID"];
  token: ExchangeToken;
  tokenAddress: Scalars["Bytes"];
  tokenName: Scalars["String"];
};

export type DisputeResolverFee_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  feeAmount?: InputMaybe<Scalars["BigInt"]>;
  feeAmount_gt?: InputMaybe<Scalars["BigInt"]>;
  feeAmount_gte?: InputMaybe<Scalars["BigInt"]>;
  feeAmount_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  feeAmount_lt?: InputMaybe<Scalars["BigInt"]>;
  feeAmount_lte?: InputMaybe<Scalars["BigInt"]>;
  feeAmount_not?: InputMaybe<Scalars["BigInt"]>;
  feeAmount_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
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
  tokenName?: InputMaybe<Scalars["String"]>;
  tokenName_contains?: InputMaybe<Scalars["String"]>;
  tokenName_contains_nocase?: InputMaybe<Scalars["String"]>;
  tokenName_ends_with?: InputMaybe<Scalars["String"]>;
  tokenName_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  tokenName_gt?: InputMaybe<Scalars["String"]>;
  tokenName_gte?: InputMaybe<Scalars["String"]>;
  tokenName_in?: InputMaybe<Array<Scalars["String"]>>;
  tokenName_lt?: InputMaybe<Scalars["String"]>;
  tokenName_lte?: InputMaybe<Scalars["String"]>;
  tokenName_not?: InputMaybe<Scalars["String"]>;
  tokenName_not_contains?: InputMaybe<Scalars["String"]>;
  tokenName_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  tokenName_not_ends_with?: InputMaybe<Scalars["String"]>;
  tokenName_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  tokenName_not_in?: InputMaybe<Array<Scalars["String"]>>;
  tokenName_not_starts_with?: InputMaybe<Scalars["String"]>;
  tokenName_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  tokenName_starts_with?: InputMaybe<Scalars["String"]>;
  tokenName_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  token_?: InputMaybe<ExchangeToken_Filter>;
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

export enum DisputeResolverFee_OrderBy {
  FeeAmount = "feeAmount",
  Id = "id",
  Token = "token",
  TokenAddress = "tokenAddress",
  TokenName = "tokenName"
}

export type DisputeResolver_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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
  escalationResponsePeriod?: InputMaybe<Scalars["BigInt"]>;
  escalationResponsePeriod_gt?: InputMaybe<Scalars["BigInt"]>;
  escalationResponsePeriod_gte?: InputMaybe<Scalars["BigInt"]>;
  escalationResponsePeriod_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  escalationResponsePeriod_lt?: InputMaybe<Scalars["BigInt"]>;
  escalationResponsePeriod_lte?: InputMaybe<Scalars["BigInt"]>;
  escalationResponsePeriod_not?: InputMaybe<Scalars["BigInt"]>;
  escalationResponsePeriod_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  fees?: InputMaybe<Array<Scalars["String"]>>;
  fees_?: InputMaybe<DisputeResolverFee_Filter>;
  fees_contains?: InputMaybe<Array<Scalars["String"]>>;
  fees_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  fees_not?: InputMaybe<Array<Scalars["String"]>>;
  fees_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  fees_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  funds_?: InputMaybe<FundsEntity_Filter>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
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
  offers_?: InputMaybe<Offer_Filter>;
  operator?: InputMaybe<Scalars["Bytes"]>;
  operator_contains?: InputMaybe<Scalars["Bytes"]>;
  operator_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  operator_not?: InputMaybe<Scalars["Bytes"]>;
  operator_not_contains?: InputMaybe<Scalars["Bytes"]>;
  operator_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  pendingDisputeResolver_?: InputMaybe<PendingDisputeResolver_Filter>;
  sellerAllowList?: InputMaybe<Array<Scalars["BigInt"]>>;
  sellerAllowList_contains?: InputMaybe<Array<Scalars["BigInt"]>>;
  sellerAllowList_contains_nocase?: InputMaybe<Array<Scalars["BigInt"]>>;
  sellerAllowList_not?: InputMaybe<Array<Scalars["BigInt"]>>;
  sellerAllowList_not_contains?: InputMaybe<Array<Scalars["BigInt"]>>;
  sellerAllowList_not_contains_nocase?: InputMaybe<Array<Scalars["BigInt"]>>;
  treasury?: InputMaybe<Scalars["Bytes"]>;
  treasury_contains?: InputMaybe<Scalars["Bytes"]>;
  treasury_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  treasury_not?: InputMaybe<Scalars["Bytes"]>;
  treasury_not_contains?: InputMaybe<Scalars["Bytes"]>;
  treasury_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
};

export enum DisputeResolver_OrderBy {
  Active = "active",
  Admin = "admin",
  Clerk = "clerk",
  EscalationResponsePeriod = "escalationResponsePeriod",
  Fees = "fees",
  Funds = "funds",
  Id = "id",
  Logs = "logs",
  MetadataUri = "metadataUri",
  Offers = "offers",
  Operator = "operator",
  PendingDisputeResolver = "pendingDisputeResolver",
  SellerAllowList = "sellerAllowList",
  Treasury = "treasury"
}

/**
 * Disputes
 *
 */
export enum DisputeState {
  Decided = "DECIDED",
  Escalated = "ESCALATED",
  Refused = "REFUSED",
  Resolved = "RESOLVED",
  Resolving = "RESOLVING",
  Retracted = "RETRACTED"
}

export type Dispute_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  buyer?: InputMaybe<Scalars["String"]>;
  buyerPercent?: InputMaybe<Scalars["BigInt"]>;
  buyerPercent_gt?: InputMaybe<Scalars["BigInt"]>;
  buyerPercent_gte?: InputMaybe<Scalars["BigInt"]>;
  buyerPercent_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  buyerPercent_lt?: InputMaybe<Scalars["BigInt"]>;
  buyerPercent_lte?: InputMaybe<Scalars["BigInt"]>;
  buyerPercent_not?: InputMaybe<Scalars["BigInt"]>;
  buyerPercent_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  buyer_?: InputMaybe<Buyer_Filter>;
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
  decidedDate?: InputMaybe<Scalars["BigInt"]>;
  decidedDate_gt?: InputMaybe<Scalars["BigInt"]>;
  decidedDate_gte?: InputMaybe<Scalars["BigInt"]>;
  decidedDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  decidedDate_lt?: InputMaybe<Scalars["BigInt"]>;
  decidedDate_lte?: InputMaybe<Scalars["BigInt"]>;
  decidedDate_not?: InputMaybe<Scalars["BigInt"]>;
  decidedDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  disputeResolver?: InputMaybe<Scalars["String"]>;
  disputeResolver_?: InputMaybe<DisputeResolver_Filter>;
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
  disputedDate?: InputMaybe<Scalars["BigInt"]>;
  disputedDate_gt?: InputMaybe<Scalars["BigInt"]>;
  disputedDate_gte?: InputMaybe<Scalars["BigInt"]>;
  disputedDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  disputedDate_lt?: InputMaybe<Scalars["BigInt"]>;
  disputedDate_lte?: InputMaybe<Scalars["BigInt"]>;
  disputedDate_not?: InputMaybe<Scalars["BigInt"]>;
  disputedDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  escalatedDate?: InputMaybe<Scalars["BigInt"]>;
  escalatedDate_gt?: InputMaybe<Scalars["BigInt"]>;
  escalatedDate_gte?: InputMaybe<Scalars["BigInt"]>;
  escalatedDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  escalatedDate_lt?: InputMaybe<Scalars["BigInt"]>;
  escalatedDate_lte?: InputMaybe<Scalars["BigInt"]>;
  escalatedDate_not?: InputMaybe<Scalars["BigInt"]>;
  escalatedDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  exchange?: InputMaybe<Scalars["String"]>;
  exchangeId?: InputMaybe<Scalars["BigInt"]>;
  exchangeId_gt?: InputMaybe<Scalars["BigInt"]>;
  exchangeId_gte?: InputMaybe<Scalars["BigInt"]>;
  exchangeId_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  exchangeId_lt?: InputMaybe<Scalars["BigInt"]>;
  exchangeId_lte?: InputMaybe<Scalars["BigInt"]>;
  exchangeId_not?: InputMaybe<Scalars["BigInt"]>;
  exchangeId_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  exchange_?: InputMaybe<Exchange_Filter>;
  exchange_contains?: InputMaybe<Scalars["String"]>;
  exchange_contains_nocase?: InputMaybe<Scalars["String"]>;
  exchange_ends_with?: InputMaybe<Scalars["String"]>;
  exchange_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  exchange_gt?: InputMaybe<Scalars["String"]>;
  exchange_gte?: InputMaybe<Scalars["String"]>;
  exchange_in?: InputMaybe<Array<Scalars["String"]>>;
  exchange_lt?: InputMaybe<Scalars["String"]>;
  exchange_lte?: InputMaybe<Scalars["String"]>;
  exchange_not?: InputMaybe<Scalars["String"]>;
  exchange_not_contains?: InputMaybe<Scalars["String"]>;
  exchange_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  exchange_not_ends_with?: InputMaybe<Scalars["String"]>;
  exchange_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  exchange_not_in?: InputMaybe<Array<Scalars["String"]>>;
  exchange_not_starts_with?: InputMaybe<Scalars["String"]>;
  exchange_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  exchange_starts_with?: InputMaybe<Scalars["String"]>;
  exchange_starts_with_nocase?: InputMaybe<Scalars["String"]>;
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
  refusedDate?: InputMaybe<Scalars["BigInt"]>;
  refusedDate_gt?: InputMaybe<Scalars["BigInt"]>;
  refusedDate_gte?: InputMaybe<Scalars["BigInt"]>;
  refusedDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  refusedDate_lt?: InputMaybe<Scalars["BigInt"]>;
  refusedDate_lte?: InputMaybe<Scalars["BigInt"]>;
  refusedDate_not?: InputMaybe<Scalars["BigInt"]>;
  refusedDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  resolvedDate?: InputMaybe<Scalars["BigInt"]>;
  resolvedDate_gt?: InputMaybe<Scalars["BigInt"]>;
  resolvedDate_gte?: InputMaybe<Scalars["BigInt"]>;
  resolvedDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  resolvedDate_lt?: InputMaybe<Scalars["BigInt"]>;
  resolvedDate_lte?: InputMaybe<Scalars["BigInt"]>;
  resolvedDate_not?: InputMaybe<Scalars["BigInt"]>;
  resolvedDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  retractedDate?: InputMaybe<Scalars["BigInt"]>;
  retractedDate_gt?: InputMaybe<Scalars["BigInt"]>;
  retractedDate_gte?: InputMaybe<Scalars["BigInt"]>;
  retractedDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  retractedDate_lt?: InputMaybe<Scalars["BigInt"]>;
  retractedDate_lte?: InputMaybe<Scalars["BigInt"]>;
  retractedDate_not?: InputMaybe<Scalars["BigInt"]>;
  retractedDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  seller?: InputMaybe<Scalars["String"]>;
  seller_?: InputMaybe<Seller_Filter>;
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
  state?: InputMaybe<DisputeState>;
  state_in?: InputMaybe<Array<DisputeState>>;
  state_not?: InputMaybe<DisputeState>;
  state_not_in?: InputMaybe<Array<DisputeState>>;
  timeout?: InputMaybe<Scalars["BigInt"]>;
  timeout_gt?: InputMaybe<Scalars["BigInt"]>;
  timeout_gte?: InputMaybe<Scalars["BigInt"]>;
  timeout_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  timeout_lt?: InputMaybe<Scalars["BigInt"]>;
  timeout_lte?: InputMaybe<Scalars["BigInt"]>;
  timeout_not?: InputMaybe<Scalars["BigInt"]>;
  timeout_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
};

export enum Dispute_OrderBy {
  Buyer = "buyer",
  BuyerPercent = "buyerPercent",
  DecidedDate = "decidedDate",
  DisputeResolver = "disputeResolver",
  DisputedDate = "disputedDate",
  EscalatedDate = "escalatedDate",
  Exchange = "exchange",
  ExchangeId = "exchangeId",
  FinalizedDate = "finalizedDate",
  Id = "id",
  RefusedDate = "refusedDate",
  ResolvedDate = "resolvedDate",
  RetractedDate = "retractedDate",
  Seller = "seller",
  State = "state",
  Timeout = "timeout"
}

export type EventLog = {
  account: Account;
  executedBy: Scalars["Bytes"];
  hash: Scalars["String"];
  id: Scalars["ID"];
  timestamp: Scalars["BigInt"];
  type: EventType;
};

export type EventLog_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]>;
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
  executedBy?: InputMaybe<Scalars["Bytes"]>;
  executedBy_contains?: InputMaybe<Scalars["Bytes"]>;
  executedBy_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  executedBy_not?: InputMaybe<Scalars["Bytes"]>;
  executedBy_not_contains?: InputMaybe<Scalars["Bytes"]>;
  executedBy_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  hash?: InputMaybe<Scalars["String"]>;
  hash_contains?: InputMaybe<Scalars["String"]>;
  hash_contains_nocase?: InputMaybe<Scalars["String"]>;
  hash_ends_with?: InputMaybe<Scalars["String"]>;
  hash_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  hash_gt?: InputMaybe<Scalars["String"]>;
  hash_gte?: InputMaybe<Scalars["String"]>;
  hash_in?: InputMaybe<Array<Scalars["String"]>>;
  hash_lt?: InputMaybe<Scalars["String"]>;
  hash_lte?: InputMaybe<Scalars["String"]>;
  hash_not?: InputMaybe<Scalars["String"]>;
  hash_not_contains?: InputMaybe<Scalars["String"]>;
  hash_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  hash_not_ends_with?: InputMaybe<Scalars["String"]>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  hash_not_in?: InputMaybe<Array<Scalars["String"]>>;
  hash_not_starts_with?: InputMaybe<Scalars["String"]>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  hash_starts_with?: InputMaybe<Scalars["String"]>;
  hash_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  timestamp?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  type?: InputMaybe<EventType>;
  type_in?: InputMaybe<Array<EventType>>;
  type_not?: InputMaybe<EventType>;
  type_not_in?: InputMaybe<Array<EventType>>;
};

export enum EventLog_OrderBy {
  Account = "account",
  ExecutedBy = "executedBy",
  Hash = "hash",
  Id = "id",
  Timestamp = "timestamp",
  Type = "type"
}

/**
 * Events
 *
 */
export enum EventType {
  AllowedSellersAdded = "ALLOWED_SELLERS_ADDED",
  AllowedSellersRemoved = "ALLOWED_SELLERS_REMOVED",
  /** ExchangeHandler events */
  BuyerCommitted = "BUYER_COMMITTED",
  BuyerCreated = "BUYER_CREATED",
  DisputeDecided = "DISPUTE_DECIDED",
  DisputeEscalated = "DISPUTE_ESCALATED",
  DisputeExpired = "DISPUTE_EXPIRED",
  /** DisputeHandler events */
  DisputeRaised = "DISPUTE_RAISED",
  DisputeResolved = "DISPUTE_RESOLVED",
  DisputeResolverActivated = "DISPUTE_RESOLVER_ACTIVATED",
  DisputeResolverCreated = "DISPUTE_RESOLVER_CREATED",
  DisputeResolverFeesAdded = "DISPUTE_RESOLVER_FEES_ADDED",
  DisputeResolverFeesRemoved = "DISPUTE_RESOLVER_FEES_REMOVED",
  DisputeResolverUpdated = "DISPUTE_RESOLVER_UPDATED",
  DisputeRetracted = "DISPUTE_RETRACTED",
  DisputeTimeoutExtended = "DISPUTE_TIMEOUT_EXTENDED",
  EscalatedDisputeExpired = "ESCALATED_DISPUTE_EXPIRED",
  EscalatedDisputeRefused = "ESCALATED_DISPUTE_REFUSED",
  ExchangeCompleted = "EXCHANGE_COMPLETED",
  /** FundsHandler events */
  FundsDeposited = "FUNDS_DEPOSITED",
  FundsEncumbered = "FUNDS_ENCUMBERED",
  FundsReleased = "FUNDS_RELEASED",
  FundsWithdrawn = "FUNDS_WITHDRAWN",
  /** OfferHandler events */
  OfferCreated = "OFFER_CREATED",
  OfferVoided = "OFFER_VOIDED",
  /** AccountHandler events */
  SellerCreated = "SELLER_CREATED",
  SellerUpdated = "SELLER_UPDATED",
  VoucherCanceled = "VOUCHER_CANCELED",
  VoucherExpired = "VOUCHER_EXPIRED",
  VoucherExtended = "VOUCHER_EXTENDED",
  VoucherRedeemed = "VOUCHER_REDEEMED",
  VoucherRevoked = "VOUCHER_REVOKED",
  VoucherTransferred = "VOUCHER_TRANSFERRED"
}

export type Exchange = {
  __typename?: "Exchange";
  buyer: Buyer;
  cancelledDate?: Maybe<Scalars["BigInt"]>;
  committedDate: Scalars["BigInt"];
  completedDate?: Maybe<Scalars["BigInt"]>;
  dispute?: Maybe<Dispute>;
  disputeResolver: DisputeResolver;
  disputed: Scalars["Boolean"];
  disputedDate?: Maybe<Scalars["BigInt"]>;
  expired: Scalars["Boolean"];
  finalizedDate?: Maybe<Scalars["BigInt"]>;
  id: Scalars["ID"];
  offer: Offer;
  redeemedDate?: Maybe<Scalars["BigInt"]>;
  revokedDate?: Maybe<Scalars["BigInt"]>;
  seller: Seller;
  state: ExchangeState;
  validUntilDate: Scalars["BigInt"];
};

export type ExchangeEventLog = EventLog & {
  __typename?: "ExchangeEventLog";
  account: Account;
  exchange: Exchange;
  executedBy: Scalars["Bytes"];
  hash: Scalars["String"];
  id: Scalars["ID"];
  timestamp: Scalars["BigInt"];
  type: EventType;
};

export type ExchangeEventLog_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]>;
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
  exchange?: InputMaybe<Scalars["String"]>;
  exchange_?: InputMaybe<Exchange_Filter>;
  exchange_contains?: InputMaybe<Scalars["String"]>;
  exchange_contains_nocase?: InputMaybe<Scalars["String"]>;
  exchange_ends_with?: InputMaybe<Scalars["String"]>;
  exchange_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  exchange_gt?: InputMaybe<Scalars["String"]>;
  exchange_gte?: InputMaybe<Scalars["String"]>;
  exchange_in?: InputMaybe<Array<Scalars["String"]>>;
  exchange_lt?: InputMaybe<Scalars["String"]>;
  exchange_lte?: InputMaybe<Scalars["String"]>;
  exchange_not?: InputMaybe<Scalars["String"]>;
  exchange_not_contains?: InputMaybe<Scalars["String"]>;
  exchange_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  exchange_not_ends_with?: InputMaybe<Scalars["String"]>;
  exchange_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  exchange_not_in?: InputMaybe<Array<Scalars["String"]>>;
  exchange_not_starts_with?: InputMaybe<Scalars["String"]>;
  exchange_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  exchange_starts_with?: InputMaybe<Scalars["String"]>;
  exchange_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  executedBy?: InputMaybe<Scalars["Bytes"]>;
  executedBy_contains?: InputMaybe<Scalars["Bytes"]>;
  executedBy_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  executedBy_not?: InputMaybe<Scalars["Bytes"]>;
  executedBy_not_contains?: InputMaybe<Scalars["Bytes"]>;
  executedBy_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  hash?: InputMaybe<Scalars["String"]>;
  hash_contains?: InputMaybe<Scalars["String"]>;
  hash_contains_nocase?: InputMaybe<Scalars["String"]>;
  hash_ends_with?: InputMaybe<Scalars["String"]>;
  hash_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  hash_gt?: InputMaybe<Scalars["String"]>;
  hash_gte?: InputMaybe<Scalars["String"]>;
  hash_in?: InputMaybe<Array<Scalars["String"]>>;
  hash_lt?: InputMaybe<Scalars["String"]>;
  hash_lte?: InputMaybe<Scalars["String"]>;
  hash_not?: InputMaybe<Scalars["String"]>;
  hash_not_contains?: InputMaybe<Scalars["String"]>;
  hash_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  hash_not_ends_with?: InputMaybe<Scalars["String"]>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  hash_not_in?: InputMaybe<Array<Scalars["String"]>>;
  hash_not_starts_with?: InputMaybe<Scalars["String"]>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  hash_starts_with?: InputMaybe<Scalars["String"]>;
  hash_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  timestamp?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  type?: InputMaybe<EventType>;
  type_in?: InputMaybe<Array<EventType>>;
  type_not?: InputMaybe<EventType>;
  type_not_in?: InputMaybe<Array<EventType>>;
};

export enum ExchangeEventLog_OrderBy {
  Account = "account",
  Exchange = "exchange",
  ExecutedBy = "executedBy",
  Hash = "hash",
  Id = "id",
  Timestamp = "timestamp",
  Type = "type"
}

/**
 * Exchange and Voucher
 *
 */
export enum ExchangeState {
  Cancelled = "CANCELLED",
  Committed = "COMMITTED",
  Completed = "COMPLETED",
  Disputed = "DISPUTED",
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
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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
  funds_?: InputMaybe<FundsEntity_Filter>;
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
  offers_?: InputMaybe<Offer_Filter>;
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
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  buyer?: InputMaybe<Scalars["String"]>;
  buyer_?: InputMaybe<Buyer_Filter>;
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
  cancelledDate?: InputMaybe<Scalars["BigInt"]>;
  cancelledDate_gt?: InputMaybe<Scalars["BigInt"]>;
  cancelledDate_gte?: InputMaybe<Scalars["BigInt"]>;
  cancelledDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  cancelledDate_lt?: InputMaybe<Scalars["BigInt"]>;
  cancelledDate_lte?: InputMaybe<Scalars["BigInt"]>;
  cancelledDate_not?: InputMaybe<Scalars["BigInt"]>;
  cancelledDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  committedDate?: InputMaybe<Scalars["BigInt"]>;
  committedDate_gt?: InputMaybe<Scalars["BigInt"]>;
  committedDate_gte?: InputMaybe<Scalars["BigInt"]>;
  committedDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  committedDate_lt?: InputMaybe<Scalars["BigInt"]>;
  committedDate_lte?: InputMaybe<Scalars["BigInt"]>;
  committedDate_not?: InputMaybe<Scalars["BigInt"]>;
  committedDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  completedDate?: InputMaybe<Scalars["BigInt"]>;
  completedDate_gt?: InputMaybe<Scalars["BigInt"]>;
  completedDate_gte?: InputMaybe<Scalars["BigInt"]>;
  completedDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  completedDate_lt?: InputMaybe<Scalars["BigInt"]>;
  completedDate_lte?: InputMaybe<Scalars["BigInt"]>;
  completedDate_not?: InputMaybe<Scalars["BigInt"]>;
  completedDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  dispute?: InputMaybe<Scalars["String"]>;
  disputeResolver?: InputMaybe<Scalars["String"]>;
  disputeResolver_?: InputMaybe<DisputeResolver_Filter>;
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
  dispute_?: InputMaybe<Dispute_Filter>;
  dispute_contains?: InputMaybe<Scalars["String"]>;
  dispute_contains_nocase?: InputMaybe<Scalars["String"]>;
  dispute_ends_with?: InputMaybe<Scalars["String"]>;
  dispute_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  dispute_gt?: InputMaybe<Scalars["String"]>;
  dispute_gte?: InputMaybe<Scalars["String"]>;
  dispute_in?: InputMaybe<Array<Scalars["String"]>>;
  dispute_lt?: InputMaybe<Scalars["String"]>;
  dispute_lte?: InputMaybe<Scalars["String"]>;
  dispute_not?: InputMaybe<Scalars["String"]>;
  dispute_not_contains?: InputMaybe<Scalars["String"]>;
  dispute_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  dispute_not_ends_with?: InputMaybe<Scalars["String"]>;
  dispute_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  dispute_not_in?: InputMaybe<Array<Scalars["String"]>>;
  dispute_not_starts_with?: InputMaybe<Scalars["String"]>;
  dispute_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  dispute_starts_with?: InputMaybe<Scalars["String"]>;
  dispute_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  disputed?: InputMaybe<Scalars["Boolean"]>;
  disputedDate?: InputMaybe<Scalars["BigInt"]>;
  disputedDate_gt?: InputMaybe<Scalars["BigInt"]>;
  disputedDate_gte?: InputMaybe<Scalars["BigInt"]>;
  disputedDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  disputedDate_lt?: InputMaybe<Scalars["BigInt"]>;
  disputedDate_lte?: InputMaybe<Scalars["BigInt"]>;
  disputedDate_not?: InputMaybe<Scalars["BigInt"]>;
  disputedDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
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
  offer_?: InputMaybe<Offer_Filter>;
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
  revokedDate?: InputMaybe<Scalars["BigInt"]>;
  revokedDate_gt?: InputMaybe<Scalars["BigInt"]>;
  revokedDate_gte?: InputMaybe<Scalars["BigInt"]>;
  revokedDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  revokedDate_lt?: InputMaybe<Scalars["BigInt"]>;
  revokedDate_lte?: InputMaybe<Scalars["BigInt"]>;
  revokedDate_not?: InputMaybe<Scalars["BigInt"]>;
  revokedDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  seller?: InputMaybe<Scalars["String"]>;
  seller_?: InputMaybe<Seller_Filter>;
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
  CancelledDate = "cancelledDate",
  CommittedDate = "committedDate",
  CompletedDate = "completedDate",
  Dispute = "dispute",
  DisputeResolver = "disputeResolver",
  Disputed = "disputed",
  DisputedDate = "disputedDate",
  Expired = "expired",
  FinalizedDate = "finalizedDate",
  Id = "id",
  Offer = "offer",
  RedeemedDate = "redeemedDate",
  RevokedDate = "revokedDate",
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
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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
  token_?: InputMaybe<ExchangeToken_Filter>;
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

export type FundsEventLog = EventLog & {
  __typename?: "FundsEventLog";
  account: Account;
  executedBy: Scalars["Bytes"];
  funds: FundsEntity;
  hash: Scalars["String"];
  id: Scalars["ID"];
  timestamp: Scalars["BigInt"];
  type: EventType;
};

export type FundsEventLog_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]>;
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
  executedBy?: InputMaybe<Scalars["Bytes"]>;
  executedBy_contains?: InputMaybe<Scalars["Bytes"]>;
  executedBy_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  executedBy_not?: InputMaybe<Scalars["Bytes"]>;
  executedBy_not_contains?: InputMaybe<Scalars["Bytes"]>;
  executedBy_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  funds?: InputMaybe<Scalars["String"]>;
  funds_?: InputMaybe<FundsEntity_Filter>;
  funds_contains?: InputMaybe<Scalars["String"]>;
  funds_contains_nocase?: InputMaybe<Scalars["String"]>;
  funds_ends_with?: InputMaybe<Scalars["String"]>;
  funds_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  funds_gt?: InputMaybe<Scalars["String"]>;
  funds_gte?: InputMaybe<Scalars["String"]>;
  funds_in?: InputMaybe<Array<Scalars["String"]>>;
  funds_lt?: InputMaybe<Scalars["String"]>;
  funds_lte?: InputMaybe<Scalars["String"]>;
  funds_not?: InputMaybe<Scalars["String"]>;
  funds_not_contains?: InputMaybe<Scalars["String"]>;
  funds_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  funds_not_ends_with?: InputMaybe<Scalars["String"]>;
  funds_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  funds_not_in?: InputMaybe<Array<Scalars["String"]>>;
  funds_not_starts_with?: InputMaybe<Scalars["String"]>;
  funds_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  funds_starts_with?: InputMaybe<Scalars["String"]>;
  funds_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  hash?: InputMaybe<Scalars["String"]>;
  hash_contains?: InputMaybe<Scalars["String"]>;
  hash_contains_nocase?: InputMaybe<Scalars["String"]>;
  hash_ends_with?: InputMaybe<Scalars["String"]>;
  hash_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  hash_gt?: InputMaybe<Scalars["String"]>;
  hash_gte?: InputMaybe<Scalars["String"]>;
  hash_in?: InputMaybe<Array<Scalars["String"]>>;
  hash_lt?: InputMaybe<Scalars["String"]>;
  hash_lte?: InputMaybe<Scalars["String"]>;
  hash_not?: InputMaybe<Scalars["String"]>;
  hash_not_contains?: InputMaybe<Scalars["String"]>;
  hash_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  hash_not_ends_with?: InputMaybe<Scalars["String"]>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  hash_not_in?: InputMaybe<Array<Scalars["String"]>>;
  hash_not_starts_with?: InputMaybe<Scalars["String"]>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  hash_starts_with?: InputMaybe<Scalars["String"]>;
  hash_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  timestamp?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  type?: InputMaybe<EventType>;
  type_in?: InputMaybe<Array<EventType>>;
  type_not?: InputMaybe<EventType>;
  type_not_in?: InputMaybe<Array<EventType>>;
};

export enum FundsEventLog_OrderBy {
  Account = "account",
  ExecutedBy = "executedBy",
  Funds = "funds",
  Hash = "hash",
  Id = "id",
  Timestamp = "timestamp",
  Type = "type"
}

export type MetadataAttribute = {
  __typename?: "MetadataAttribute";
  displayType: Scalars["String"];
  id: Scalars["ID"];
  traitType: Scalars["String"];
  value: Scalars["String"];
};

export type MetadataAttribute_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  displayType?: InputMaybe<Scalars["String"]>;
  displayType_contains?: InputMaybe<Scalars["String"]>;
  displayType_contains_nocase?: InputMaybe<Scalars["String"]>;
  displayType_ends_with?: InputMaybe<Scalars["String"]>;
  displayType_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  displayType_gt?: InputMaybe<Scalars["String"]>;
  displayType_gte?: InputMaybe<Scalars["String"]>;
  displayType_in?: InputMaybe<Array<Scalars["String"]>>;
  displayType_lt?: InputMaybe<Scalars["String"]>;
  displayType_lte?: InputMaybe<Scalars["String"]>;
  displayType_not?: InputMaybe<Scalars["String"]>;
  displayType_not_contains?: InputMaybe<Scalars["String"]>;
  displayType_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  displayType_not_ends_with?: InputMaybe<Scalars["String"]>;
  displayType_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  displayType_not_in?: InputMaybe<Array<Scalars["String"]>>;
  displayType_not_starts_with?: InputMaybe<Scalars["String"]>;
  displayType_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  displayType_starts_with?: InputMaybe<Scalars["String"]>;
  displayType_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  traitType?: InputMaybe<Scalars["String"]>;
  traitType_contains?: InputMaybe<Scalars["String"]>;
  traitType_contains_nocase?: InputMaybe<Scalars["String"]>;
  traitType_ends_with?: InputMaybe<Scalars["String"]>;
  traitType_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  traitType_gt?: InputMaybe<Scalars["String"]>;
  traitType_gte?: InputMaybe<Scalars["String"]>;
  traitType_in?: InputMaybe<Array<Scalars["String"]>>;
  traitType_lt?: InputMaybe<Scalars["String"]>;
  traitType_lte?: InputMaybe<Scalars["String"]>;
  traitType_not?: InputMaybe<Scalars["String"]>;
  traitType_not_contains?: InputMaybe<Scalars["String"]>;
  traitType_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  traitType_not_ends_with?: InputMaybe<Scalars["String"]>;
  traitType_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  traitType_not_in?: InputMaybe<Array<Scalars["String"]>>;
  traitType_not_starts_with?: InputMaybe<Scalars["String"]>;
  traitType_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  traitType_starts_with?: InputMaybe<Scalars["String"]>;
  traitType_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  value?: InputMaybe<Scalars["String"]>;
  value_contains?: InputMaybe<Scalars["String"]>;
  value_contains_nocase?: InputMaybe<Scalars["String"]>;
  value_ends_with?: InputMaybe<Scalars["String"]>;
  value_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  value_gt?: InputMaybe<Scalars["String"]>;
  value_gte?: InputMaybe<Scalars["String"]>;
  value_in?: InputMaybe<Array<Scalars["String"]>>;
  value_lt?: InputMaybe<Scalars["String"]>;
  value_lte?: InputMaybe<Scalars["String"]>;
  value_not?: InputMaybe<Scalars["String"]>;
  value_not_contains?: InputMaybe<Scalars["String"]>;
  value_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  value_not_ends_with?: InputMaybe<Scalars["String"]>;
  value_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  value_not_in?: InputMaybe<Array<Scalars["String"]>>;
  value_not_starts_with?: InputMaybe<Scalars["String"]>;
  value_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  value_starts_with?: InputMaybe<Scalars["String"]>;
  value_starts_with_nocase?: InputMaybe<Scalars["String"]>;
};

export enum MetadataAttribute_OrderBy {
  DisplayType = "displayType",
  Id = "id",
  TraitType = "traitType",
  Value = "value"
}

export type MetadataInterface = {
  animationUrl?: Maybe<Scalars["String"]>;
  attributes?: Maybe<Array<MetadataAttribute>>;
  condition?: Maybe<Scalars["String"]>;
  /**
   * Enriched fields from offer entity to allow nested query workaround
   *
   */
  createdAt: Scalars["BigInt"];
  description: Scalars["String"];
  exchangeToken: ExchangeToken;
  externalUrl: Scalars["String"];
  /**
   * Fields compliant to metadata standard
   *
   */
  id: Scalars["ID"];
  image: Scalars["String"];
  licenseUrl: Scalars["String"];
  name: Scalars["String"];
  numberOfCommits: Scalars["BigInt"];
  numberOfRedemptions: Scalars["BigInt"];
  /**
   * References to entities
   *
   */
  offer: Offer;
  quantityAvailable: Scalars["BigInt"];
  schemaUrl: Scalars["String"];
  seller: Seller;
  type: MetadataType;
  validFromDate: Scalars["BigInt"];
  validUntilDate: Scalars["BigInt"];
  voided: Scalars["Boolean"];
};

export type MetadataInterfaceAttributesArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<MetadataAttribute_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<MetadataAttribute_Filter>;
};

export type MetadataInterface_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  animationUrl?: InputMaybe<Scalars["String"]>;
  animationUrl_contains?: InputMaybe<Scalars["String"]>;
  animationUrl_contains_nocase?: InputMaybe<Scalars["String"]>;
  animationUrl_ends_with?: InputMaybe<Scalars["String"]>;
  animationUrl_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  animationUrl_gt?: InputMaybe<Scalars["String"]>;
  animationUrl_gte?: InputMaybe<Scalars["String"]>;
  animationUrl_in?: InputMaybe<Array<Scalars["String"]>>;
  animationUrl_lt?: InputMaybe<Scalars["String"]>;
  animationUrl_lte?: InputMaybe<Scalars["String"]>;
  animationUrl_not?: InputMaybe<Scalars["String"]>;
  animationUrl_not_contains?: InputMaybe<Scalars["String"]>;
  animationUrl_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  animationUrl_not_ends_with?: InputMaybe<Scalars["String"]>;
  animationUrl_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  animationUrl_not_in?: InputMaybe<Array<Scalars["String"]>>;
  animationUrl_not_starts_with?: InputMaybe<Scalars["String"]>;
  animationUrl_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  animationUrl_starts_with?: InputMaybe<Scalars["String"]>;
  animationUrl_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  attributes?: InputMaybe<Array<Scalars["String"]>>;
  attributes_?: InputMaybe<MetadataAttribute_Filter>;
  attributes_contains?: InputMaybe<Array<Scalars["String"]>>;
  attributes_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  attributes_not?: InputMaybe<Array<Scalars["String"]>>;
  attributes_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  attributes_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  condition?: InputMaybe<Scalars["String"]>;
  condition_contains?: InputMaybe<Scalars["String"]>;
  condition_contains_nocase?: InputMaybe<Scalars["String"]>;
  condition_ends_with?: InputMaybe<Scalars["String"]>;
  condition_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  condition_gt?: InputMaybe<Scalars["String"]>;
  condition_gte?: InputMaybe<Scalars["String"]>;
  condition_in?: InputMaybe<Array<Scalars["String"]>>;
  condition_lt?: InputMaybe<Scalars["String"]>;
  condition_lte?: InputMaybe<Scalars["String"]>;
  condition_not?: InputMaybe<Scalars["String"]>;
  condition_not_contains?: InputMaybe<Scalars["String"]>;
  condition_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  condition_not_ends_with?: InputMaybe<Scalars["String"]>;
  condition_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  condition_not_in?: InputMaybe<Array<Scalars["String"]>>;
  condition_not_starts_with?: InputMaybe<Scalars["String"]>;
  condition_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  condition_starts_with?: InputMaybe<Scalars["String"]>;
  condition_starts_with_nocase?: InputMaybe<Scalars["String"]>;
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
  exchangeToken_?: InputMaybe<ExchangeToken_Filter>;
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
  image?: InputMaybe<Scalars["String"]>;
  image_contains?: InputMaybe<Scalars["String"]>;
  image_contains_nocase?: InputMaybe<Scalars["String"]>;
  image_ends_with?: InputMaybe<Scalars["String"]>;
  image_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  image_gt?: InputMaybe<Scalars["String"]>;
  image_gte?: InputMaybe<Scalars["String"]>;
  image_in?: InputMaybe<Array<Scalars["String"]>>;
  image_lt?: InputMaybe<Scalars["String"]>;
  image_lte?: InputMaybe<Scalars["String"]>;
  image_not?: InputMaybe<Scalars["String"]>;
  image_not_contains?: InputMaybe<Scalars["String"]>;
  image_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  image_not_ends_with?: InputMaybe<Scalars["String"]>;
  image_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  image_not_in?: InputMaybe<Array<Scalars["String"]>>;
  image_not_starts_with?: InputMaybe<Scalars["String"]>;
  image_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  image_starts_with?: InputMaybe<Scalars["String"]>;
  image_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  licenseUrl?: InputMaybe<Scalars["String"]>;
  licenseUrl_contains?: InputMaybe<Scalars["String"]>;
  licenseUrl_contains_nocase?: InputMaybe<Scalars["String"]>;
  licenseUrl_ends_with?: InputMaybe<Scalars["String"]>;
  licenseUrl_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  licenseUrl_gt?: InputMaybe<Scalars["String"]>;
  licenseUrl_gte?: InputMaybe<Scalars["String"]>;
  licenseUrl_in?: InputMaybe<Array<Scalars["String"]>>;
  licenseUrl_lt?: InputMaybe<Scalars["String"]>;
  licenseUrl_lte?: InputMaybe<Scalars["String"]>;
  licenseUrl_not?: InputMaybe<Scalars["String"]>;
  licenseUrl_not_contains?: InputMaybe<Scalars["String"]>;
  licenseUrl_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  licenseUrl_not_ends_with?: InputMaybe<Scalars["String"]>;
  licenseUrl_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  licenseUrl_not_in?: InputMaybe<Array<Scalars["String"]>>;
  licenseUrl_not_starts_with?: InputMaybe<Scalars["String"]>;
  licenseUrl_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  licenseUrl_starts_with?: InputMaybe<Scalars["String"]>;
  licenseUrl_starts_with_nocase?: InputMaybe<Scalars["String"]>;
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
  numberOfCommits?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_gt?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_gte?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  numberOfCommits_lt?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_lte?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_not?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  numberOfRedemptions?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_gt?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_gte?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  numberOfRedemptions_lt?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_lte?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_not?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  offer?: InputMaybe<Scalars["String"]>;
  offer_?: InputMaybe<Offer_Filter>;
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
  quantityAvailable?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_gt?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_gte?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  quantityAvailable_lt?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_lte?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_not?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
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
  seller_?: InputMaybe<Seller_Filter>;
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
  AnimationUrl = "animationUrl",
  Attributes = "attributes",
  Condition = "condition",
  CreatedAt = "createdAt",
  Description = "description",
  ExchangeToken = "exchangeToken",
  ExternalUrl = "externalUrl",
  Id = "id",
  Image = "image",
  LicenseUrl = "licenseUrl",
  Name = "name",
  NumberOfCommits = "numberOfCommits",
  NumberOfRedemptions = "numberOfRedemptions",
  Offer = "offer",
  QuantityAvailable = "quantityAvailable",
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
  agentFee: Scalars["BigInt"];
  agentId: Scalars["BigInt"];
  buyerCancelPenalty: Scalars["BigInt"];
  condition?: Maybe<ConditionEntity>;
  createdAt: Scalars["BigInt"];
  /** Offer durations */
  disputePeriodDuration: Scalars["BigInt"];
  disputeResolutionTerms: DisputeResolutionTermsEntity;
  disputeResolver: DisputeResolver;
  disputeResolverId: Scalars["BigInt"];
  exchangeToken: ExchangeToken;
  exchanges: Array<Exchange>;
  id: Scalars["ID"];
  metadata?: Maybe<MetadataInterface>;
  metadataHash: Scalars["String"];
  metadataUri: Scalars["String"];
  /** Stats */
  numberOfCommits: Scalars["BigInt"];
  numberOfRedemptions: Scalars["BigInt"];
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

export type OfferEventLog = EventLog & {
  __typename?: "OfferEventLog";
  account: Account;
  executedBy: Scalars["Bytes"];
  hash: Scalars["String"];
  id: Scalars["ID"];
  offer: Offer;
  timestamp: Scalars["BigInt"];
  type: EventType;
};

export type OfferEventLog_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars["String"]>;
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
  executedBy?: InputMaybe<Scalars["Bytes"]>;
  executedBy_contains?: InputMaybe<Scalars["Bytes"]>;
  executedBy_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  executedBy_not?: InputMaybe<Scalars["Bytes"]>;
  executedBy_not_contains?: InputMaybe<Scalars["Bytes"]>;
  executedBy_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  hash?: InputMaybe<Scalars["String"]>;
  hash_contains?: InputMaybe<Scalars["String"]>;
  hash_contains_nocase?: InputMaybe<Scalars["String"]>;
  hash_ends_with?: InputMaybe<Scalars["String"]>;
  hash_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  hash_gt?: InputMaybe<Scalars["String"]>;
  hash_gte?: InputMaybe<Scalars["String"]>;
  hash_in?: InputMaybe<Array<Scalars["String"]>>;
  hash_lt?: InputMaybe<Scalars["String"]>;
  hash_lte?: InputMaybe<Scalars["String"]>;
  hash_not?: InputMaybe<Scalars["String"]>;
  hash_not_contains?: InputMaybe<Scalars["String"]>;
  hash_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  hash_not_ends_with?: InputMaybe<Scalars["String"]>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  hash_not_in?: InputMaybe<Array<Scalars["String"]>>;
  hash_not_starts_with?: InputMaybe<Scalars["String"]>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  hash_starts_with?: InputMaybe<Scalars["String"]>;
  hash_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  offer?: InputMaybe<Scalars["String"]>;
  offer_?: InputMaybe<Offer_Filter>;
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
  timestamp?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  type?: InputMaybe<EventType>;
  type_in?: InputMaybe<Array<EventType>>;
  type_not?: InputMaybe<EventType>;
  type_not_in?: InputMaybe<Array<EventType>>;
};

export enum OfferEventLog_OrderBy {
  Account = "account",
  ExecutedBy = "executedBy",
  Hash = "hash",
  Id = "id",
  Offer = "offer",
  Timestamp = "timestamp",
  Type = "type"
}

export type Offer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  agentFee?: InputMaybe<Scalars["BigInt"]>;
  agentFee_gt?: InputMaybe<Scalars["BigInt"]>;
  agentFee_gte?: InputMaybe<Scalars["BigInt"]>;
  agentFee_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  agentFee_lt?: InputMaybe<Scalars["BigInt"]>;
  agentFee_lte?: InputMaybe<Scalars["BigInt"]>;
  agentFee_not?: InputMaybe<Scalars["BigInt"]>;
  agentFee_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  agentId?: InputMaybe<Scalars["BigInt"]>;
  agentId_gt?: InputMaybe<Scalars["BigInt"]>;
  agentId_gte?: InputMaybe<Scalars["BigInt"]>;
  agentId_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  agentId_lt?: InputMaybe<Scalars["BigInt"]>;
  agentId_lte?: InputMaybe<Scalars["BigInt"]>;
  agentId_not?: InputMaybe<Scalars["BigInt"]>;
  agentId_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  buyerCancelPenalty?: InputMaybe<Scalars["BigInt"]>;
  buyerCancelPenalty_gt?: InputMaybe<Scalars["BigInt"]>;
  buyerCancelPenalty_gte?: InputMaybe<Scalars["BigInt"]>;
  buyerCancelPenalty_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  buyerCancelPenalty_lt?: InputMaybe<Scalars["BigInt"]>;
  buyerCancelPenalty_lte?: InputMaybe<Scalars["BigInt"]>;
  buyerCancelPenalty_not?: InputMaybe<Scalars["BigInt"]>;
  buyerCancelPenalty_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  condition?: InputMaybe<Scalars["String"]>;
  condition_?: InputMaybe<ConditionEntity_Filter>;
  condition_contains?: InputMaybe<Scalars["String"]>;
  condition_contains_nocase?: InputMaybe<Scalars["String"]>;
  condition_ends_with?: InputMaybe<Scalars["String"]>;
  condition_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  condition_gt?: InputMaybe<Scalars["String"]>;
  condition_gte?: InputMaybe<Scalars["String"]>;
  condition_in?: InputMaybe<Array<Scalars["String"]>>;
  condition_lt?: InputMaybe<Scalars["String"]>;
  condition_lte?: InputMaybe<Scalars["String"]>;
  condition_not?: InputMaybe<Scalars["String"]>;
  condition_not_contains?: InputMaybe<Scalars["String"]>;
  condition_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  condition_not_ends_with?: InputMaybe<Scalars["String"]>;
  condition_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  condition_not_in?: InputMaybe<Array<Scalars["String"]>>;
  condition_not_starts_with?: InputMaybe<Scalars["String"]>;
  condition_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  condition_starts_with?: InputMaybe<Scalars["String"]>;
  condition_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  createdAt?: InputMaybe<Scalars["BigInt"]>;
  createdAt_gt?: InputMaybe<Scalars["BigInt"]>;
  createdAt_gte?: InputMaybe<Scalars["BigInt"]>;
  createdAt_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  createdAt_lt?: InputMaybe<Scalars["BigInt"]>;
  createdAt_lte?: InputMaybe<Scalars["BigInt"]>;
  createdAt_not?: InputMaybe<Scalars["BigInt"]>;
  createdAt_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  disputePeriodDuration?: InputMaybe<Scalars["BigInt"]>;
  disputePeriodDuration_gt?: InputMaybe<Scalars["BigInt"]>;
  disputePeriodDuration_gte?: InputMaybe<Scalars["BigInt"]>;
  disputePeriodDuration_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  disputePeriodDuration_lt?: InputMaybe<Scalars["BigInt"]>;
  disputePeriodDuration_lte?: InputMaybe<Scalars["BigInt"]>;
  disputePeriodDuration_not?: InputMaybe<Scalars["BigInt"]>;
  disputePeriodDuration_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  disputeResolutionTerms?: InputMaybe<Scalars["String"]>;
  disputeResolutionTerms_?: InputMaybe<DisputeResolutionTermsEntity_Filter>;
  disputeResolutionTerms_contains?: InputMaybe<Scalars["String"]>;
  disputeResolutionTerms_contains_nocase?: InputMaybe<Scalars["String"]>;
  disputeResolutionTerms_ends_with?: InputMaybe<Scalars["String"]>;
  disputeResolutionTerms_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  disputeResolutionTerms_gt?: InputMaybe<Scalars["String"]>;
  disputeResolutionTerms_gte?: InputMaybe<Scalars["String"]>;
  disputeResolutionTerms_in?: InputMaybe<Array<Scalars["String"]>>;
  disputeResolutionTerms_lt?: InputMaybe<Scalars["String"]>;
  disputeResolutionTerms_lte?: InputMaybe<Scalars["String"]>;
  disputeResolutionTerms_not?: InputMaybe<Scalars["String"]>;
  disputeResolutionTerms_not_contains?: InputMaybe<Scalars["String"]>;
  disputeResolutionTerms_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  disputeResolutionTerms_not_ends_with?: InputMaybe<Scalars["String"]>;
  disputeResolutionTerms_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  disputeResolutionTerms_not_in?: InputMaybe<Array<Scalars["String"]>>;
  disputeResolutionTerms_not_starts_with?: InputMaybe<Scalars["String"]>;
  disputeResolutionTerms_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  disputeResolutionTerms_starts_with?: InputMaybe<Scalars["String"]>;
  disputeResolutionTerms_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  disputeResolver?: InputMaybe<Scalars["String"]>;
  disputeResolverId?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_gt?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_gte?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  disputeResolverId_lt?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_lte?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_not?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  disputeResolver_?: InputMaybe<DisputeResolver_Filter>;
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
  exchangeToken_?: InputMaybe<ExchangeToken_Filter>;
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
  exchanges_?: InputMaybe<Exchange_Filter>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  metadata?: InputMaybe<Scalars["String"]>;
  metadataHash?: InputMaybe<Scalars["String"]>;
  metadataHash_contains?: InputMaybe<Scalars["String"]>;
  metadataHash_contains_nocase?: InputMaybe<Scalars["String"]>;
  metadataHash_ends_with?: InputMaybe<Scalars["String"]>;
  metadataHash_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  metadataHash_gt?: InputMaybe<Scalars["String"]>;
  metadataHash_gte?: InputMaybe<Scalars["String"]>;
  metadataHash_in?: InputMaybe<Array<Scalars["String"]>>;
  metadataHash_lt?: InputMaybe<Scalars["String"]>;
  metadataHash_lte?: InputMaybe<Scalars["String"]>;
  metadataHash_not?: InputMaybe<Scalars["String"]>;
  metadataHash_not_contains?: InputMaybe<Scalars["String"]>;
  metadataHash_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  metadataHash_not_ends_with?: InputMaybe<Scalars["String"]>;
  metadataHash_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  metadataHash_not_in?: InputMaybe<Array<Scalars["String"]>>;
  metadataHash_not_starts_with?: InputMaybe<Scalars["String"]>;
  metadataHash_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  metadataHash_starts_with?: InputMaybe<Scalars["String"]>;
  metadataHash_starts_with_nocase?: InputMaybe<Scalars["String"]>;
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
  numberOfCommits?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_gt?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_gte?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  numberOfCommits_lt?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_lte?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_not?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  numberOfRedemptions?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_gt?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_gte?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  numberOfRedemptions_lt?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_lte?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_not?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
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
  seller_?: InputMaybe<Seller_Filter>;
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
  AgentFee = "agentFee",
  AgentId = "agentId",
  BuyerCancelPenalty = "buyerCancelPenalty",
  Condition = "condition",
  CreatedAt = "createdAt",
  DisputePeriodDuration = "disputePeriodDuration",
  DisputeResolutionTerms = "disputeResolutionTerms",
  DisputeResolver = "disputeResolver",
  DisputeResolverId = "disputeResolverId",
  ExchangeToken = "exchangeToken",
  Exchanges = "exchanges",
  Id = "id",
  Metadata = "metadata",
  MetadataHash = "metadataHash",
  MetadataUri = "metadataUri",
  NumberOfCommits = "numberOfCommits",
  NumberOfRedemptions = "numberOfRedemptions",
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

export type PendingDisputeResolver = {
  __typename?: "PendingDisputeResolver";
  admin?: Maybe<Scalars["Bytes"]>;
  clerk?: Maybe<Scalars["Bytes"]>;
  disputeResolver: DisputeResolver;
  id: Scalars["ID"];
  operator?: Maybe<Scalars["Bytes"]>;
};

export type PendingDisputeResolver_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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
  disputeResolver?: InputMaybe<Scalars["String"]>;
  disputeResolver_?: InputMaybe<DisputeResolver_Filter>;
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
};

export enum PendingDisputeResolver_OrderBy {
  Admin = "admin",
  Clerk = "clerk",
  DisputeResolver = "disputeResolver",
  Id = "id",
  Operator = "operator"
}

export type PendingSeller = {
  __typename?: "PendingSeller";
  admin?: Maybe<Scalars["Bytes"]>;
  authTokenId?: Maybe<Scalars["BigInt"]>;
  authTokenType?: Maybe<Scalars["Int"]>;
  clerk?: Maybe<Scalars["Bytes"]>;
  id: Scalars["ID"];
  operator?: Maybe<Scalars["Bytes"]>;
  seller: Seller;
};

export type PendingSeller_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  admin?: InputMaybe<Scalars["Bytes"]>;
  admin_contains?: InputMaybe<Scalars["Bytes"]>;
  admin_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  admin_not?: InputMaybe<Scalars["Bytes"]>;
  admin_not_contains?: InputMaybe<Scalars["Bytes"]>;
  admin_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  authTokenId?: InputMaybe<Scalars["BigInt"]>;
  authTokenId_gt?: InputMaybe<Scalars["BigInt"]>;
  authTokenId_gte?: InputMaybe<Scalars["BigInt"]>;
  authTokenId_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  authTokenId_lt?: InputMaybe<Scalars["BigInt"]>;
  authTokenId_lte?: InputMaybe<Scalars["BigInt"]>;
  authTokenId_not?: InputMaybe<Scalars["BigInt"]>;
  authTokenId_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  authTokenType?: InputMaybe<Scalars["Int"]>;
  authTokenType_gt?: InputMaybe<Scalars["Int"]>;
  authTokenType_gte?: InputMaybe<Scalars["Int"]>;
  authTokenType_in?: InputMaybe<Array<Scalars["Int"]>>;
  authTokenType_lt?: InputMaybe<Scalars["Int"]>;
  authTokenType_lte?: InputMaybe<Scalars["Int"]>;
  authTokenType_not?: InputMaybe<Scalars["Int"]>;
  authTokenType_not_in?: InputMaybe<Array<Scalars["Int"]>>;
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
  seller?: InputMaybe<Scalars["String"]>;
  seller_?: InputMaybe<Seller_Filter>;
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
};

export enum PendingSeller_OrderBy {
  Admin = "admin",
  AuthTokenId = "authTokenId",
  AuthTokenType = "authTokenType",
  Clerk = "clerk",
  Id = "id",
  Operator = "operator",
  Seller = "seller"
}

export type ProductV1Brand = {
  __typename?: "ProductV1Brand";
  id: Scalars["ID"];
  name: Scalars["String"];
  products: Array<ProductV1Product>;
};

export type ProductV1BrandProductsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Product_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ProductV1Product_Filter>;
};

export type ProductV1Brand_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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
  products_?: InputMaybe<ProductV1Product_Filter>;
};

export enum ProductV1Brand_OrderBy {
  Id = "id",
  Name = "name",
  Products = "products"
}

export type ProductV1Category = {
  __typename?: "ProductV1Category";
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type ProductV1Category_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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

export enum ProductV1Category_OrderBy {
  Id = "id",
  Name = "name"
}

export type ProductV1ExchangePolicy = {
  __typename?: "ProductV1ExchangePolicy";
  disputeResolverContactMethod: Scalars["String"];
  id: Scalars["ID"];
  label?: Maybe<Scalars["String"]>;
  sellerContactMethod: Scalars["String"];
  template: Scalars["String"];
  uuid: Scalars["String"];
  version: Scalars["Int"];
};

export type ProductV1ExchangePolicy_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  disputeResolverContactMethod?: InputMaybe<Scalars["String"]>;
  disputeResolverContactMethod_contains?: InputMaybe<Scalars["String"]>;
  disputeResolverContactMethod_contains_nocase?: InputMaybe<Scalars["String"]>;
  disputeResolverContactMethod_ends_with?: InputMaybe<Scalars["String"]>;
  disputeResolverContactMethod_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  disputeResolverContactMethod_gt?: InputMaybe<Scalars["String"]>;
  disputeResolverContactMethod_gte?: InputMaybe<Scalars["String"]>;
  disputeResolverContactMethod_in?: InputMaybe<Array<Scalars["String"]>>;
  disputeResolverContactMethod_lt?: InputMaybe<Scalars["String"]>;
  disputeResolverContactMethod_lte?: InputMaybe<Scalars["String"]>;
  disputeResolverContactMethod_not?: InputMaybe<Scalars["String"]>;
  disputeResolverContactMethod_not_contains?: InputMaybe<Scalars["String"]>;
  disputeResolverContactMethod_not_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  disputeResolverContactMethod_not_ends_with?: InputMaybe<Scalars["String"]>;
  disputeResolverContactMethod_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  disputeResolverContactMethod_not_in?: InputMaybe<Array<Scalars["String"]>>;
  disputeResolverContactMethod_not_starts_with?: InputMaybe<Scalars["String"]>;
  disputeResolverContactMethod_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  disputeResolverContactMethod_starts_with?: InputMaybe<Scalars["String"]>;
  disputeResolverContactMethod_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  label?: InputMaybe<Scalars["String"]>;
  label_contains?: InputMaybe<Scalars["String"]>;
  label_contains_nocase?: InputMaybe<Scalars["String"]>;
  label_ends_with?: InputMaybe<Scalars["String"]>;
  label_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  label_gt?: InputMaybe<Scalars["String"]>;
  label_gte?: InputMaybe<Scalars["String"]>;
  label_in?: InputMaybe<Array<Scalars["String"]>>;
  label_lt?: InputMaybe<Scalars["String"]>;
  label_lte?: InputMaybe<Scalars["String"]>;
  label_not?: InputMaybe<Scalars["String"]>;
  label_not_contains?: InputMaybe<Scalars["String"]>;
  label_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  label_not_ends_with?: InputMaybe<Scalars["String"]>;
  label_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  label_not_in?: InputMaybe<Array<Scalars["String"]>>;
  label_not_starts_with?: InputMaybe<Scalars["String"]>;
  label_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  label_starts_with?: InputMaybe<Scalars["String"]>;
  label_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  sellerContactMethod?: InputMaybe<Scalars["String"]>;
  sellerContactMethod_contains?: InputMaybe<Scalars["String"]>;
  sellerContactMethod_contains_nocase?: InputMaybe<Scalars["String"]>;
  sellerContactMethod_ends_with?: InputMaybe<Scalars["String"]>;
  sellerContactMethod_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  sellerContactMethod_gt?: InputMaybe<Scalars["String"]>;
  sellerContactMethod_gte?: InputMaybe<Scalars["String"]>;
  sellerContactMethod_in?: InputMaybe<Array<Scalars["String"]>>;
  sellerContactMethod_lt?: InputMaybe<Scalars["String"]>;
  sellerContactMethod_lte?: InputMaybe<Scalars["String"]>;
  sellerContactMethod_not?: InputMaybe<Scalars["String"]>;
  sellerContactMethod_not_contains?: InputMaybe<Scalars["String"]>;
  sellerContactMethod_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  sellerContactMethod_not_ends_with?: InputMaybe<Scalars["String"]>;
  sellerContactMethod_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  sellerContactMethod_not_in?: InputMaybe<Array<Scalars["String"]>>;
  sellerContactMethod_not_starts_with?: InputMaybe<Scalars["String"]>;
  sellerContactMethod_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  sellerContactMethod_starts_with?: InputMaybe<Scalars["String"]>;
  sellerContactMethod_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  template?: InputMaybe<Scalars["String"]>;
  template_contains?: InputMaybe<Scalars["String"]>;
  template_contains_nocase?: InputMaybe<Scalars["String"]>;
  template_ends_with?: InputMaybe<Scalars["String"]>;
  template_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  template_gt?: InputMaybe<Scalars["String"]>;
  template_gte?: InputMaybe<Scalars["String"]>;
  template_in?: InputMaybe<Array<Scalars["String"]>>;
  template_lt?: InputMaybe<Scalars["String"]>;
  template_lte?: InputMaybe<Scalars["String"]>;
  template_not?: InputMaybe<Scalars["String"]>;
  template_not_contains?: InputMaybe<Scalars["String"]>;
  template_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  template_not_ends_with?: InputMaybe<Scalars["String"]>;
  template_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  template_not_in?: InputMaybe<Array<Scalars["String"]>>;
  template_not_starts_with?: InputMaybe<Scalars["String"]>;
  template_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  template_starts_with?: InputMaybe<Scalars["String"]>;
  template_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  uuid?: InputMaybe<Scalars["String"]>;
  uuid_contains?: InputMaybe<Scalars["String"]>;
  uuid_contains_nocase?: InputMaybe<Scalars["String"]>;
  uuid_ends_with?: InputMaybe<Scalars["String"]>;
  uuid_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  uuid_gt?: InputMaybe<Scalars["String"]>;
  uuid_gte?: InputMaybe<Scalars["String"]>;
  uuid_in?: InputMaybe<Array<Scalars["String"]>>;
  uuid_lt?: InputMaybe<Scalars["String"]>;
  uuid_lte?: InputMaybe<Scalars["String"]>;
  uuid_not?: InputMaybe<Scalars["String"]>;
  uuid_not_contains?: InputMaybe<Scalars["String"]>;
  uuid_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  uuid_not_ends_with?: InputMaybe<Scalars["String"]>;
  uuid_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  uuid_not_in?: InputMaybe<Array<Scalars["String"]>>;
  uuid_not_starts_with?: InputMaybe<Scalars["String"]>;
  uuid_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  uuid_starts_with?: InputMaybe<Scalars["String"]>;
  uuid_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  version?: InputMaybe<Scalars["Int"]>;
  version_gt?: InputMaybe<Scalars["Int"]>;
  version_gte?: InputMaybe<Scalars["Int"]>;
  version_in?: InputMaybe<Array<Scalars["Int"]>>;
  version_lt?: InputMaybe<Scalars["Int"]>;
  version_lte?: InputMaybe<Scalars["Int"]>;
  version_not?: InputMaybe<Scalars["Int"]>;
  version_not_in?: InputMaybe<Array<Scalars["Int"]>>;
};

export enum ProductV1ExchangePolicy_OrderBy {
  DisputeResolverContactMethod = "disputeResolverContactMethod",
  Id = "id",
  Label = "label",
  SellerContactMethod = "sellerContactMethod",
  Template = "template",
  Uuid = "uuid",
  Version = "version"
}

export type ProductV1Media = {
  __typename?: "ProductV1Media";
  id: Scalars["ID"];
  tag?: Maybe<Scalars["String"]>;
  type: ProductV1MediaType;
  url: Scalars["String"];
};

export enum ProductV1MediaType {
  Image = "IMAGE",
  Video = "VIDEO"
}

export type ProductV1Media_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  tag?: InputMaybe<Scalars["String"]>;
  tag_contains?: InputMaybe<Scalars["String"]>;
  tag_contains_nocase?: InputMaybe<Scalars["String"]>;
  tag_ends_with?: InputMaybe<Scalars["String"]>;
  tag_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  tag_gt?: InputMaybe<Scalars["String"]>;
  tag_gte?: InputMaybe<Scalars["String"]>;
  tag_in?: InputMaybe<Array<Scalars["String"]>>;
  tag_lt?: InputMaybe<Scalars["String"]>;
  tag_lte?: InputMaybe<Scalars["String"]>;
  tag_not?: InputMaybe<Scalars["String"]>;
  tag_not_contains?: InputMaybe<Scalars["String"]>;
  tag_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  tag_not_ends_with?: InputMaybe<Scalars["String"]>;
  tag_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  tag_not_in?: InputMaybe<Array<Scalars["String"]>>;
  tag_not_starts_with?: InputMaybe<Scalars["String"]>;
  tag_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  tag_starts_with?: InputMaybe<Scalars["String"]>;
  tag_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<ProductV1MediaType>;
  type_in?: InputMaybe<Array<ProductV1MediaType>>;
  type_not?: InputMaybe<ProductV1MediaType>;
  type_not_in?: InputMaybe<Array<ProductV1MediaType>>;
  url?: InputMaybe<Scalars["String"]>;
  url_contains?: InputMaybe<Scalars["String"]>;
  url_contains_nocase?: InputMaybe<Scalars["String"]>;
  url_ends_with?: InputMaybe<Scalars["String"]>;
  url_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  url_gt?: InputMaybe<Scalars["String"]>;
  url_gte?: InputMaybe<Scalars["String"]>;
  url_in?: InputMaybe<Array<Scalars["String"]>>;
  url_lt?: InputMaybe<Scalars["String"]>;
  url_lte?: InputMaybe<Scalars["String"]>;
  url_not?: InputMaybe<Scalars["String"]>;
  url_not_contains?: InputMaybe<Scalars["String"]>;
  url_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  url_not_ends_with?: InputMaybe<Scalars["String"]>;
  url_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  url_not_in?: InputMaybe<Array<Scalars["String"]>>;
  url_not_starts_with?: InputMaybe<Scalars["String"]>;
  url_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  url_starts_with?: InputMaybe<Scalars["String"]>;
  url_starts_with_nocase?: InputMaybe<Scalars["String"]>;
};

export enum ProductV1Media_OrderBy {
  Id = "id",
  Tag = "tag",
  Type = "type",
  Url = "url"
}

export type ProductV1MetadataEntity = MetadataInterface & {
  __typename?: "ProductV1MetadataEntity";
  animationUrl?: Maybe<Scalars["String"]>;
  attributes?: Maybe<Array<MetadataAttribute>>;
  condition?: Maybe<Scalars["String"]>;
  /**
   * Enriched fields from offer entity to allow nested query workaround
   *
   */
  createdAt: Scalars["BigInt"];
  description: Scalars["String"];
  exchangePolicy: ProductV1ExchangePolicy;
  exchangeToken: ExchangeToken;
  externalUrl: Scalars["String"];
  /**
   * Fields compliant to metadata standard
   *
   */
  id: Scalars["ID"];
  image: Scalars["String"];
  licenseUrl: Scalars["String"];
  name: Scalars["String"];
  numberOfCommits: Scalars["BigInt"];
  numberOfRedemptions: Scalars["BigInt"];
  /**
   * References to entities
   *
   */
  offer: Offer;
  product: ProductV1Product;
  productOverrides?: Maybe<ProductV1ProductOverrides>;
  productUuid: Scalars["String"];
  productV1Seller: ProductV1Seller;
  productVersion: Scalars["Int"];
  quantityAvailable: Scalars["BigInt"];
  schemaUrl: Scalars["String"];
  seller: Seller;
  shipping?: Maybe<ProductV1ShippingOption>;
  /** MetadataType.PRODUCT_V1 */
  type: MetadataType;
  /**
   * PRODUCT_V1 specific fields
   *
   */
  uuid: Scalars["String"];
  validFromDate: Scalars["BigInt"];
  validUntilDate: Scalars["BigInt"];
  variations?: Maybe<Array<ProductV1Variation>>;
  voided: Scalars["Boolean"];
};

export type ProductV1MetadataEntityAttributesArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<MetadataAttribute_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<MetadataAttribute_Filter>;
};

export type ProductV1MetadataEntityVariationsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Variation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ProductV1Variation_Filter>;
};

export type ProductV1MetadataEntity_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  animationUrl?: InputMaybe<Scalars["String"]>;
  animationUrl_contains?: InputMaybe<Scalars["String"]>;
  animationUrl_contains_nocase?: InputMaybe<Scalars["String"]>;
  animationUrl_ends_with?: InputMaybe<Scalars["String"]>;
  animationUrl_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  animationUrl_gt?: InputMaybe<Scalars["String"]>;
  animationUrl_gte?: InputMaybe<Scalars["String"]>;
  animationUrl_in?: InputMaybe<Array<Scalars["String"]>>;
  animationUrl_lt?: InputMaybe<Scalars["String"]>;
  animationUrl_lte?: InputMaybe<Scalars["String"]>;
  animationUrl_not?: InputMaybe<Scalars["String"]>;
  animationUrl_not_contains?: InputMaybe<Scalars["String"]>;
  animationUrl_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  animationUrl_not_ends_with?: InputMaybe<Scalars["String"]>;
  animationUrl_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  animationUrl_not_in?: InputMaybe<Array<Scalars["String"]>>;
  animationUrl_not_starts_with?: InputMaybe<Scalars["String"]>;
  animationUrl_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  animationUrl_starts_with?: InputMaybe<Scalars["String"]>;
  animationUrl_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  attributes?: InputMaybe<Array<Scalars["String"]>>;
  attributes_?: InputMaybe<MetadataAttribute_Filter>;
  attributes_contains?: InputMaybe<Array<Scalars["String"]>>;
  attributes_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  attributes_not?: InputMaybe<Array<Scalars["String"]>>;
  attributes_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  attributes_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  condition?: InputMaybe<Scalars["String"]>;
  condition_contains?: InputMaybe<Scalars["String"]>;
  condition_contains_nocase?: InputMaybe<Scalars["String"]>;
  condition_ends_with?: InputMaybe<Scalars["String"]>;
  condition_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  condition_gt?: InputMaybe<Scalars["String"]>;
  condition_gte?: InputMaybe<Scalars["String"]>;
  condition_in?: InputMaybe<Array<Scalars["String"]>>;
  condition_lt?: InputMaybe<Scalars["String"]>;
  condition_lte?: InputMaybe<Scalars["String"]>;
  condition_not?: InputMaybe<Scalars["String"]>;
  condition_not_contains?: InputMaybe<Scalars["String"]>;
  condition_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  condition_not_ends_with?: InputMaybe<Scalars["String"]>;
  condition_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  condition_not_in?: InputMaybe<Array<Scalars["String"]>>;
  condition_not_starts_with?: InputMaybe<Scalars["String"]>;
  condition_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  condition_starts_with?: InputMaybe<Scalars["String"]>;
  condition_starts_with_nocase?: InputMaybe<Scalars["String"]>;
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
  exchangePolicy?: InputMaybe<Scalars["String"]>;
  exchangePolicy_?: InputMaybe<ProductV1ExchangePolicy_Filter>;
  exchangePolicy_contains?: InputMaybe<Scalars["String"]>;
  exchangePolicy_contains_nocase?: InputMaybe<Scalars["String"]>;
  exchangePolicy_ends_with?: InputMaybe<Scalars["String"]>;
  exchangePolicy_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  exchangePolicy_gt?: InputMaybe<Scalars["String"]>;
  exchangePolicy_gte?: InputMaybe<Scalars["String"]>;
  exchangePolicy_in?: InputMaybe<Array<Scalars["String"]>>;
  exchangePolicy_lt?: InputMaybe<Scalars["String"]>;
  exchangePolicy_lte?: InputMaybe<Scalars["String"]>;
  exchangePolicy_not?: InputMaybe<Scalars["String"]>;
  exchangePolicy_not_contains?: InputMaybe<Scalars["String"]>;
  exchangePolicy_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  exchangePolicy_not_ends_with?: InputMaybe<Scalars["String"]>;
  exchangePolicy_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  exchangePolicy_not_in?: InputMaybe<Array<Scalars["String"]>>;
  exchangePolicy_not_starts_with?: InputMaybe<Scalars["String"]>;
  exchangePolicy_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  exchangePolicy_starts_with?: InputMaybe<Scalars["String"]>;
  exchangePolicy_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  exchangeToken?: InputMaybe<Scalars["String"]>;
  exchangeToken_?: InputMaybe<ExchangeToken_Filter>;
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
  image?: InputMaybe<Scalars["String"]>;
  image_contains?: InputMaybe<Scalars["String"]>;
  image_contains_nocase?: InputMaybe<Scalars["String"]>;
  image_ends_with?: InputMaybe<Scalars["String"]>;
  image_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  image_gt?: InputMaybe<Scalars["String"]>;
  image_gte?: InputMaybe<Scalars["String"]>;
  image_in?: InputMaybe<Array<Scalars["String"]>>;
  image_lt?: InputMaybe<Scalars["String"]>;
  image_lte?: InputMaybe<Scalars["String"]>;
  image_not?: InputMaybe<Scalars["String"]>;
  image_not_contains?: InputMaybe<Scalars["String"]>;
  image_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  image_not_ends_with?: InputMaybe<Scalars["String"]>;
  image_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  image_not_in?: InputMaybe<Array<Scalars["String"]>>;
  image_not_starts_with?: InputMaybe<Scalars["String"]>;
  image_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  image_starts_with?: InputMaybe<Scalars["String"]>;
  image_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  licenseUrl?: InputMaybe<Scalars["String"]>;
  licenseUrl_contains?: InputMaybe<Scalars["String"]>;
  licenseUrl_contains_nocase?: InputMaybe<Scalars["String"]>;
  licenseUrl_ends_with?: InputMaybe<Scalars["String"]>;
  licenseUrl_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  licenseUrl_gt?: InputMaybe<Scalars["String"]>;
  licenseUrl_gte?: InputMaybe<Scalars["String"]>;
  licenseUrl_in?: InputMaybe<Array<Scalars["String"]>>;
  licenseUrl_lt?: InputMaybe<Scalars["String"]>;
  licenseUrl_lte?: InputMaybe<Scalars["String"]>;
  licenseUrl_not?: InputMaybe<Scalars["String"]>;
  licenseUrl_not_contains?: InputMaybe<Scalars["String"]>;
  licenseUrl_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  licenseUrl_not_ends_with?: InputMaybe<Scalars["String"]>;
  licenseUrl_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  licenseUrl_not_in?: InputMaybe<Array<Scalars["String"]>>;
  licenseUrl_not_starts_with?: InputMaybe<Scalars["String"]>;
  licenseUrl_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  licenseUrl_starts_with?: InputMaybe<Scalars["String"]>;
  licenseUrl_starts_with_nocase?: InputMaybe<Scalars["String"]>;
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
  numberOfCommits?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_gt?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_gte?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  numberOfCommits_lt?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_lte?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_not?: InputMaybe<Scalars["BigInt"]>;
  numberOfCommits_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  numberOfRedemptions?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_gt?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_gte?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  numberOfRedemptions_lt?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_lte?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_not?: InputMaybe<Scalars["BigInt"]>;
  numberOfRedemptions_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  offer?: InputMaybe<Scalars["String"]>;
  offer_?: InputMaybe<Offer_Filter>;
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
  product?: InputMaybe<Scalars["String"]>;
  productOverrides?: InputMaybe<Scalars["String"]>;
  productOverrides_?: InputMaybe<ProductV1ProductOverrides_Filter>;
  productOverrides_contains?: InputMaybe<Scalars["String"]>;
  productOverrides_contains_nocase?: InputMaybe<Scalars["String"]>;
  productOverrides_ends_with?: InputMaybe<Scalars["String"]>;
  productOverrides_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  productOverrides_gt?: InputMaybe<Scalars["String"]>;
  productOverrides_gte?: InputMaybe<Scalars["String"]>;
  productOverrides_in?: InputMaybe<Array<Scalars["String"]>>;
  productOverrides_lt?: InputMaybe<Scalars["String"]>;
  productOverrides_lte?: InputMaybe<Scalars["String"]>;
  productOverrides_not?: InputMaybe<Scalars["String"]>;
  productOverrides_not_contains?: InputMaybe<Scalars["String"]>;
  productOverrides_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  productOverrides_not_ends_with?: InputMaybe<Scalars["String"]>;
  productOverrides_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  productOverrides_not_in?: InputMaybe<Array<Scalars["String"]>>;
  productOverrides_not_starts_with?: InputMaybe<Scalars["String"]>;
  productOverrides_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  productOverrides_starts_with?: InputMaybe<Scalars["String"]>;
  productOverrides_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  productUuid?: InputMaybe<Scalars["String"]>;
  productUuid_contains?: InputMaybe<Scalars["String"]>;
  productUuid_contains_nocase?: InputMaybe<Scalars["String"]>;
  productUuid_ends_with?: InputMaybe<Scalars["String"]>;
  productUuid_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  productUuid_gt?: InputMaybe<Scalars["String"]>;
  productUuid_gte?: InputMaybe<Scalars["String"]>;
  productUuid_in?: InputMaybe<Array<Scalars["String"]>>;
  productUuid_lt?: InputMaybe<Scalars["String"]>;
  productUuid_lte?: InputMaybe<Scalars["String"]>;
  productUuid_not?: InputMaybe<Scalars["String"]>;
  productUuid_not_contains?: InputMaybe<Scalars["String"]>;
  productUuid_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  productUuid_not_ends_with?: InputMaybe<Scalars["String"]>;
  productUuid_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  productUuid_not_in?: InputMaybe<Array<Scalars["String"]>>;
  productUuid_not_starts_with?: InputMaybe<Scalars["String"]>;
  productUuid_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  productUuid_starts_with?: InputMaybe<Scalars["String"]>;
  productUuid_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  productV1Seller?: InputMaybe<Scalars["String"]>;
  productV1Seller_?: InputMaybe<ProductV1Seller_Filter>;
  productV1Seller_contains?: InputMaybe<Scalars["String"]>;
  productV1Seller_contains_nocase?: InputMaybe<Scalars["String"]>;
  productV1Seller_ends_with?: InputMaybe<Scalars["String"]>;
  productV1Seller_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  productV1Seller_gt?: InputMaybe<Scalars["String"]>;
  productV1Seller_gte?: InputMaybe<Scalars["String"]>;
  productV1Seller_in?: InputMaybe<Array<Scalars["String"]>>;
  productV1Seller_lt?: InputMaybe<Scalars["String"]>;
  productV1Seller_lte?: InputMaybe<Scalars["String"]>;
  productV1Seller_not?: InputMaybe<Scalars["String"]>;
  productV1Seller_not_contains?: InputMaybe<Scalars["String"]>;
  productV1Seller_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  productV1Seller_not_ends_with?: InputMaybe<Scalars["String"]>;
  productV1Seller_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  productV1Seller_not_in?: InputMaybe<Array<Scalars["String"]>>;
  productV1Seller_not_starts_with?: InputMaybe<Scalars["String"]>;
  productV1Seller_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  productV1Seller_starts_with?: InputMaybe<Scalars["String"]>;
  productV1Seller_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  productVersion?: InputMaybe<Scalars["Int"]>;
  productVersion_gt?: InputMaybe<Scalars["Int"]>;
  productVersion_gte?: InputMaybe<Scalars["Int"]>;
  productVersion_in?: InputMaybe<Array<Scalars["Int"]>>;
  productVersion_lt?: InputMaybe<Scalars["Int"]>;
  productVersion_lte?: InputMaybe<Scalars["Int"]>;
  productVersion_not?: InputMaybe<Scalars["Int"]>;
  productVersion_not_in?: InputMaybe<Array<Scalars["Int"]>>;
  product_?: InputMaybe<ProductV1Product_Filter>;
  product_contains?: InputMaybe<Scalars["String"]>;
  product_contains_nocase?: InputMaybe<Scalars["String"]>;
  product_ends_with?: InputMaybe<Scalars["String"]>;
  product_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  product_gt?: InputMaybe<Scalars["String"]>;
  product_gte?: InputMaybe<Scalars["String"]>;
  product_in?: InputMaybe<Array<Scalars["String"]>>;
  product_lt?: InputMaybe<Scalars["String"]>;
  product_lte?: InputMaybe<Scalars["String"]>;
  product_not?: InputMaybe<Scalars["String"]>;
  product_not_contains?: InputMaybe<Scalars["String"]>;
  product_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  product_not_ends_with?: InputMaybe<Scalars["String"]>;
  product_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  product_not_in?: InputMaybe<Array<Scalars["String"]>>;
  product_not_starts_with?: InputMaybe<Scalars["String"]>;
  product_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  product_starts_with?: InputMaybe<Scalars["String"]>;
  product_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  quantityAvailable?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_gt?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_gte?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  quantityAvailable_lt?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_lte?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_not?: InputMaybe<Scalars["BigInt"]>;
  quantityAvailable_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
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
  seller_?: InputMaybe<Seller_Filter>;
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
  shipping?: InputMaybe<Scalars["String"]>;
  shipping_?: InputMaybe<ProductV1ShippingOption_Filter>;
  shipping_contains?: InputMaybe<Scalars["String"]>;
  shipping_contains_nocase?: InputMaybe<Scalars["String"]>;
  shipping_ends_with?: InputMaybe<Scalars["String"]>;
  shipping_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  shipping_gt?: InputMaybe<Scalars["String"]>;
  shipping_gte?: InputMaybe<Scalars["String"]>;
  shipping_in?: InputMaybe<Array<Scalars["String"]>>;
  shipping_lt?: InputMaybe<Scalars["String"]>;
  shipping_lte?: InputMaybe<Scalars["String"]>;
  shipping_not?: InputMaybe<Scalars["String"]>;
  shipping_not_contains?: InputMaybe<Scalars["String"]>;
  shipping_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  shipping_not_ends_with?: InputMaybe<Scalars["String"]>;
  shipping_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  shipping_not_in?: InputMaybe<Array<Scalars["String"]>>;
  shipping_not_starts_with?: InputMaybe<Scalars["String"]>;
  shipping_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  shipping_starts_with?: InputMaybe<Scalars["String"]>;
  shipping_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<MetadataType>;
  type_in?: InputMaybe<Array<MetadataType>>;
  type_not?: InputMaybe<MetadataType>;
  type_not_in?: InputMaybe<Array<MetadataType>>;
  uuid?: InputMaybe<Scalars["String"]>;
  uuid_contains?: InputMaybe<Scalars["String"]>;
  uuid_contains_nocase?: InputMaybe<Scalars["String"]>;
  uuid_ends_with?: InputMaybe<Scalars["String"]>;
  uuid_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  uuid_gt?: InputMaybe<Scalars["String"]>;
  uuid_gte?: InputMaybe<Scalars["String"]>;
  uuid_in?: InputMaybe<Array<Scalars["String"]>>;
  uuid_lt?: InputMaybe<Scalars["String"]>;
  uuid_lte?: InputMaybe<Scalars["String"]>;
  uuid_not?: InputMaybe<Scalars["String"]>;
  uuid_not_contains?: InputMaybe<Scalars["String"]>;
  uuid_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  uuid_not_ends_with?: InputMaybe<Scalars["String"]>;
  uuid_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  uuid_not_in?: InputMaybe<Array<Scalars["String"]>>;
  uuid_not_starts_with?: InputMaybe<Scalars["String"]>;
  uuid_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  uuid_starts_with?: InputMaybe<Scalars["String"]>;
  uuid_starts_with_nocase?: InputMaybe<Scalars["String"]>;
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
  variations?: InputMaybe<Array<Scalars["String"]>>;
  variations_?: InputMaybe<ProductV1Variation_Filter>;
  variations_contains?: InputMaybe<Array<Scalars["String"]>>;
  variations_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  variations_not?: InputMaybe<Array<Scalars["String"]>>;
  variations_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  variations_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  voided?: InputMaybe<Scalars["Boolean"]>;
  voided_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  voided_not?: InputMaybe<Scalars["Boolean"]>;
  voided_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
};

export enum ProductV1MetadataEntity_OrderBy {
  AnimationUrl = "animationUrl",
  Attributes = "attributes",
  Condition = "condition",
  CreatedAt = "createdAt",
  Description = "description",
  ExchangePolicy = "exchangePolicy",
  ExchangeToken = "exchangeToken",
  ExternalUrl = "externalUrl",
  Id = "id",
  Image = "image",
  LicenseUrl = "licenseUrl",
  Name = "name",
  NumberOfCommits = "numberOfCommits",
  NumberOfRedemptions = "numberOfRedemptions",
  Offer = "offer",
  Product = "product",
  ProductOverrides = "productOverrides",
  ProductUuid = "productUuid",
  ProductV1Seller = "productV1Seller",
  ProductVersion = "productVersion",
  QuantityAvailable = "quantityAvailable",
  SchemaUrl = "schemaUrl",
  Seller = "seller",
  Shipping = "shipping",
  Type = "type",
  Uuid = "uuid",
  ValidFromDate = "validFromDate",
  ValidUntilDate = "validUntilDate",
  Variations = "variations",
  Voided = "voided"
}

export enum ProductV1OfferCategory {
  Digital = "DIGITAL",
  Phygital = "PHYGITAL",
  Physical = "PHYSICAL"
}

export type ProductV1Personalisation = {
  __typename?: "ProductV1Personalisation";
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type ProductV1Personalisation_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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

export enum ProductV1Personalisation_OrderBy {
  Id = "id",
  Name = "name"
}

export type ProductV1Product = {
  __typename?: "ProductV1Product";
  allVariantsVoided?: Maybe<Scalars["Boolean"]>;
  brand: ProductV1Brand;
  category?: Maybe<ProductV1Category>;
  description: Scalars["String"];
  /**
   * Details fields
   *
   */
  details_category?: Maybe<Scalars["String"]>;
  details_offerCategory: Scalars["String"];
  details_personalisation?: Maybe<Array<Scalars["String"]>>;
  details_sections?: Maybe<Array<Scalars["String"]>>;
  details_subCategory?: Maybe<Scalars["String"]>;
  details_subCategory2?: Maybe<Scalars["String"]>;
  details_tags?: Maybe<Array<Scalars["String"]>>;
  /**
   * Product information fields
   *
   */
  disputeResolverId: Scalars["BigInt"];
  id: Scalars["ID"];
  identification_productId?: Maybe<Scalars["String"]>;
  identification_productIdType?: Maybe<Scalars["String"]>;
  /**
   * Identification fields
   *
   */
  identification_sKU?: Maybe<Scalars["String"]>;
  maxValidFromDate: Scalars["BigInt"];
  maxValidUntilDate: Scalars["BigInt"];
  minValidFromDate: Scalars["BigInt"];
  minValidUntilDate: Scalars["BigInt"];
  notVoidedVariants?: Maybe<Array<ProductV1Variant>>;
  offerCategory: ProductV1OfferCategory;
  packaging_dimensions_height?: Maybe<Scalars["String"]>;
  packaging_dimensions_length?: Maybe<Scalars["String"]>;
  packaging_dimensions_unit?: Maybe<Scalars["String"]>;
  packaging_dimensions_width?: Maybe<Scalars["String"]>;
  /**
   * Packaging
   *
   */
  packaging_packageQuantity?: Maybe<Scalars["String"]>;
  packaging_weight_unit?: Maybe<Scalars["String"]>;
  packaging_weight_value?: Maybe<Scalars["String"]>;
  personalisation?: Maybe<Array<ProductV1Personalisation>>;
  /**
   * Seller
   *
   */
  productV1Seller?: Maybe<ProductV1Seller>;
  productionInformation_brandName: Scalars["String"];
  productionInformation_manufacturer?: Maybe<Scalars["String"]>;
  productionInformation_manufacturerPartNumber?: Maybe<Scalars["String"]>;
  productionInformation_materials?: Maybe<Array<Scalars["String"]>>;
  productionInformation_modelNumber?: Maybe<Scalars["String"]>;
  sections?: Maybe<Array<ProductV1Section>>;
  sellerId: Scalars["BigInt"];
  subCategory?: Maybe<ProductV1Category>;
  subCategory2?: Maybe<ProductV1Category>;
  tags?: Maybe<Array<ProductV1Tag>>;
  title: Scalars["String"];
  uuid: Scalars["String"];
  /**
   * PRODUCT_V1 specific fields
   *
   */
  variants?: Maybe<Array<ProductV1Variant>>;
  version: Scalars["Int"];
  /**
   * Visuals
   *
   */
  visuals_images: Array<ProductV1Media>;
  visuals_videos?: Maybe<Array<ProductV1Media>>;
};

export type ProductV1ProductNotVoidedVariantsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Variant_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ProductV1Variant_Filter>;
};

export type ProductV1ProductPersonalisationArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Personalisation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ProductV1Personalisation_Filter>;
};

export type ProductV1ProductSectionsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Section_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ProductV1Section_Filter>;
};

export type ProductV1ProductTagsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Tag_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ProductV1Tag_Filter>;
};

export type ProductV1ProductVariantsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Variant_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ProductV1Variant_Filter>;
};

export type ProductV1ProductVisuals_ImagesArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Media_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ProductV1Media_Filter>;
};

export type ProductV1ProductVisuals_VideosArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Media_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ProductV1Media_Filter>;
};

export type ProductV1ProductOverrides = {
  __typename?: "ProductV1ProductOverrides";
  brand: ProductV1Brand;
  description: Scalars["String"];
  id: Scalars["ID"];
  identification_productId?: Maybe<Scalars["String"]>;
  identification_productIdType?: Maybe<Scalars["String"]>;
  identification_sKU?: Maybe<Scalars["String"]>;
  packaging_dimensions_height?: Maybe<Scalars["String"]>;
  packaging_dimensions_length?: Maybe<Scalars["String"]>;
  packaging_dimensions_unit?: Maybe<Scalars["String"]>;
  packaging_dimensions_width?: Maybe<Scalars["String"]>;
  packaging_packageQuantity?: Maybe<Scalars["String"]>;
  packaging_weight_unit?: Maybe<Scalars["String"]>;
  packaging_weight_value?: Maybe<Scalars["String"]>;
  productionInformation_brandName: Scalars["String"];
  productionInformation_manufacturer?: Maybe<Scalars["String"]>;
  productionInformation_manufacturerPartNumber?: Maybe<Scalars["String"]>;
  productionInformation_materials?: Maybe<Array<Scalars["String"]>>;
  productionInformation_modelNumber?: Maybe<Scalars["String"]>;
  title: Scalars["String"];
  version: Scalars["Int"];
  visuals_images: Array<ProductV1Media>;
  visuals_videos?: Maybe<Array<ProductV1Media>>;
};

export type ProductV1ProductOverridesVisuals_ImagesArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Media_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ProductV1Media_Filter>;
};

export type ProductV1ProductOverridesVisuals_VideosArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Media_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ProductV1Media_Filter>;
};

export type ProductV1ProductOverrides_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  brand?: InputMaybe<Scalars["String"]>;
  brand_?: InputMaybe<ProductV1Brand_Filter>;
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
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  identification_productId?: InputMaybe<Scalars["String"]>;
  identification_productIdType?: InputMaybe<Scalars["String"]>;
  identification_productIdType_contains?: InputMaybe<Scalars["String"]>;
  identification_productIdType_contains_nocase?: InputMaybe<Scalars["String"]>;
  identification_productIdType_ends_with?: InputMaybe<Scalars["String"]>;
  identification_productIdType_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  identification_productIdType_gt?: InputMaybe<Scalars["String"]>;
  identification_productIdType_gte?: InputMaybe<Scalars["String"]>;
  identification_productIdType_in?: InputMaybe<Array<Scalars["String"]>>;
  identification_productIdType_lt?: InputMaybe<Scalars["String"]>;
  identification_productIdType_lte?: InputMaybe<Scalars["String"]>;
  identification_productIdType_not?: InputMaybe<Scalars["String"]>;
  identification_productIdType_not_contains?: InputMaybe<Scalars["String"]>;
  identification_productIdType_not_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  identification_productIdType_not_ends_with?: InputMaybe<Scalars["String"]>;
  identification_productIdType_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  identification_productIdType_not_in?: InputMaybe<Array<Scalars["String"]>>;
  identification_productIdType_not_starts_with?: InputMaybe<Scalars["String"]>;
  identification_productIdType_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  identification_productIdType_starts_with?: InputMaybe<Scalars["String"]>;
  identification_productIdType_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  identification_productId_contains?: InputMaybe<Scalars["String"]>;
  identification_productId_contains_nocase?: InputMaybe<Scalars["String"]>;
  identification_productId_ends_with?: InputMaybe<Scalars["String"]>;
  identification_productId_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  identification_productId_gt?: InputMaybe<Scalars["String"]>;
  identification_productId_gte?: InputMaybe<Scalars["String"]>;
  identification_productId_in?: InputMaybe<Array<Scalars["String"]>>;
  identification_productId_lt?: InputMaybe<Scalars["String"]>;
  identification_productId_lte?: InputMaybe<Scalars["String"]>;
  identification_productId_not?: InputMaybe<Scalars["String"]>;
  identification_productId_not_contains?: InputMaybe<Scalars["String"]>;
  identification_productId_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  identification_productId_not_ends_with?: InputMaybe<Scalars["String"]>;
  identification_productId_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  identification_productId_not_in?: InputMaybe<Array<Scalars["String"]>>;
  identification_productId_not_starts_with?: InputMaybe<Scalars["String"]>;
  identification_productId_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  identification_productId_starts_with?: InputMaybe<Scalars["String"]>;
  identification_productId_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  identification_sKU?: InputMaybe<Scalars["String"]>;
  identification_sKU_contains?: InputMaybe<Scalars["String"]>;
  identification_sKU_contains_nocase?: InputMaybe<Scalars["String"]>;
  identification_sKU_ends_with?: InputMaybe<Scalars["String"]>;
  identification_sKU_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  identification_sKU_gt?: InputMaybe<Scalars["String"]>;
  identification_sKU_gte?: InputMaybe<Scalars["String"]>;
  identification_sKU_in?: InputMaybe<Array<Scalars["String"]>>;
  identification_sKU_lt?: InputMaybe<Scalars["String"]>;
  identification_sKU_lte?: InputMaybe<Scalars["String"]>;
  identification_sKU_not?: InputMaybe<Scalars["String"]>;
  identification_sKU_not_contains?: InputMaybe<Scalars["String"]>;
  identification_sKU_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  identification_sKU_not_ends_with?: InputMaybe<Scalars["String"]>;
  identification_sKU_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  identification_sKU_not_in?: InputMaybe<Array<Scalars["String"]>>;
  identification_sKU_not_starts_with?: InputMaybe<Scalars["String"]>;
  identification_sKU_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  identification_sKU_starts_with?: InputMaybe<Scalars["String"]>;
  identification_sKU_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_contains?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_gt?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_gte?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_dimensions_height_lt?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_lte?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_not?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_not_contains?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_not_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_height_not_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_height_not_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_dimensions_height_not_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_height_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_length?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_contains?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_gt?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_gte?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_dimensions_length_lt?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_lte?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_not?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_not_contains?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_not_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_length_not_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_length_not_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_dimensions_length_not_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_length_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_unit?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_contains?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_gt?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_gte?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_dimensions_unit_lt?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_lte?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_not?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_not_contains?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_not_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_unit_not_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_dimensions_unit_not_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_unit_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_contains?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_gt?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_gte?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_dimensions_width_lt?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_lte?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_not?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_not_contains?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_not_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_width_not_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_width_not_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_dimensions_width_not_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_width_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_contains?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_gt?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_gte?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_packageQuantity_lt?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_lte?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_not?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_not_contains?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_not_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_packageQuantity_not_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_packageQuantity_not_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_packageQuantity_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_contains?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_gt?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_gte?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_weight_unit_lt?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_lte?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_not?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_not_contains?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_not_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_not_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_weight_unit_not_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_value?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_contains?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_gt?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_gte?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_weight_value_lt?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_lte?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_not?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_not_contains?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_not_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_not_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_weight_value_not_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_contains?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_brandName_ends_with?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_brandName_gt?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_gte?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_in?: InputMaybe<Array<Scalars["String"]>>;
  productionInformation_brandName_lt?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_lte?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_not?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_not_contains?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_not_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_brandName_not_ends_with?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_brandName_not_in?: InputMaybe<Array<Scalars["String"]>>;
  productionInformation_brandName_not_starts_with?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_brandName_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_brandName_starts_with?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer?: InputMaybe<Scalars["String"]>;
  productionInformation_manufacturerPartNumber?: InputMaybe<Scalars["String"]>;
  productionInformation_manufacturerPartNumber_contains?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_ends_with?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_gt?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_gte?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_in?: InputMaybe<
    Array<Scalars["String"]>
  >;
  productionInformation_manufacturerPartNumber_lt?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_lte?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_not?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_not_contains?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_not_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_not_ends_with?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_not_in?: InputMaybe<
    Array<Scalars["String"]>
  >;
  productionInformation_manufacturerPartNumber_not_starts_with?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_starts_with?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer_contains?: InputMaybe<Scalars["String"]>;
  productionInformation_manufacturer_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer_ends_with?: InputMaybe<Scalars["String"]>;
  productionInformation_manufacturer_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer_gt?: InputMaybe<Scalars["String"]>;
  productionInformation_manufacturer_gte?: InputMaybe<Scalars["String"]>;
  productionInformation_manufacturer_in?: InputMaybe<Array<Scalars["String"]>>;
  productionInformation_manufacturer_lt?: InputMaybe<Scalars["String"]>;
  productionInformation_manufacturer_lte?: InputMaybe<Scalars["String"]>;
  productionInformation_manufacturer_not?: InputMaybe<Scalars["String"]>;
  productionInformation_manufacturer_not_contains?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer_not_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer_not_ends_with?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer_not_in?: InputMaybe<
    Array<Scalars["String"]>
  >;
  productionInformation_manufacturer_not_starts_with?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer_starts_with?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_materials?: InputMaybe<Array<Scalars["String"]>>;
  productionInformation_materials_contains?: InputMaybe<
    Array<Scalars["String"]>
  >;
  productionInformation_materials_contains_nocase?: InputMaybe<
    Array<Scalars["String"]>
  >;
  productionInformation_materials_not?: InputMaybe<Array<Scalars["String"]>>;
  productionInformation_materials_not_contains?: InputMaybe<
    Array<Scalars["String"]>
  >;
  productionInformation_materials_not_contains_nocase?: InputMaybe<
    Array<Scalars["String"]>
  >;
  productionInformation_modelNumber?: InputMaybe<Scalars["String"]>;
  productionInformation_modelNumber_contains?: InputMaybe<Scalars["String"]>;
  productionInformation_modelNumber_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_modelNumber_ends_with?: InputMaybe<Scalars["String"]>;
  productionInformation_modelNumber_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_modelNumber_gt?: InputMaybe<Scalars["String"]>;
  productionInformation_modelNumber_gte?: InputMaybe<Scalars["String"]>;
  productionInformation_modelNumber_in?: InputMaybe<Array<Scalars["String"]>>;
  productionInformation_modelNumber_lt?: InputMaybe<Scalars["String"]>;
  productionInformation_modelNumber_lte?: InputMaybe<Scalars["String"]>;
  productionInformation_modelNumber_not?: InputMaybe<Scalars["String"]>;
  productionInformation_modelNumber_not_contains?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_modelNumber_not_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_modelNumber_not_ends_with?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_modelNumber_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_modelNumber_not_in?: InputMaybe<
    Array<Scalars["String"]>
  >;
  productionInformation_modelNumber_not_starts_with?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_modelNumber_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_modelNumber_starts_with?: InputMaybe<Scalars["String"]>;
  productionInformation_modelNumber_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  title?: InputMaybe<Scalars["String"]>;
  title_contains?: InputMaybe<Scalars["String"]>;
  title_contains_nocase?: InputMaybe<Scalars["String"]>;
  title_ends_with?: InputMaybe<Scalars["String"]>;
  title_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  title_gt?: InputMaybe<Scalars["String"]>;
  title_gte?: InputMaybe<Scalars["String"]>;
  title_in?: InputMaybe<Array<Scalars["String"]>>;
  title_lt?: InputMaybe<Scalars["String"]>;
  title_lte?: InputMaybe<Scalars["String"]>;
  title_not?: InputMaybe<Scalars["String"]>;
  title_not_contains?: InputMaybe<Scalars["String"]>;
  title_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  title_not_ends_with?: InputMaybe<Scalars["String"]>;
  title_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  title_not_in?: InputMaybe<Array<Scalars["String"]>>;
  title_not_starts_with?: InputMaybe<Scalars["String"]>;
  title_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  title_starts_with?: InputMaybe<Scalars["String"]>;
  title_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  version?: InputMaybe<Scalars["Int"]>;
  version_gt?: InputMaybe<Scalars["Int"]>;
  version_gte?: InputMaybe<Scalars["Int"]>;
  version_in?: InputMaybe<Array<Scalars["Int"]>>;
  version_lt?: InputMaybe<Scalars["Int"]>;
  version_lte?: InputMaybe<Scalars["Int"]>;
  version_not?: InputMaybe<Scalars["Int"]>;
  version_not_in?: InputMaybe<Array<Scalars["Int"]>>;
  visuals_images?: InputMaybe<Array<Scalars["String"]>>;
  visuals_images_?: InputMaybe<ProductV1Media_Filter>;
  visuals_images_contains?: InputMaybe<Array<Scalars["String"]>>;
  visuals_images_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  visuals_images_not?: InputMaybe<Array<Scalars["String"]>>;
  visuals_images_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  visuals_images_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  visuals_videos?: InputMaybe<Array<Scalars["String"]>>;
  visuals_videos_?: InputMaybe<ProductV1Media_Filter>;
  visuals_videos_contains?: InputMaybe<Array<Scalars["String"]>>;
  visuals_videos_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  visuals_videos_not?: InputMaybe<Array<Scalars["String"]>>;
  visuals_videos_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  visuals_videos_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
};

export enum ProductV1ProductOverrides_OrderBy {
  Brand = "brand",
  Description = "description",
  Id = "id",
  IdentificationProductId = "identification_productId",
  IdentificationProductIdType = "identification_productIdType",
  IdentificationSKu = "identification_sKU",
  PackagingDimensionsHeight = "packaging_dimensions_height",
  PackagingDimensionsLength = "packaging_dimensions_length",
  PackagingDimensionsUnit = "packaging_dimensions_unit",
  PackagingDimensionsWidth = "packaging_dimensions_width",
  PackagingPackageQuantity = "packaging_packageQuantity",
  PackagingWeightUnit = "packaging_weight_unit",
  PackagingWeightValue = "packaging_weight_value",
  ProductionInformationBrandName = "productionInformation_brandName",
  ProductionInformationManufacturer = "productionInformation_manufacturer",
  ProductionInformationManufacturerPartNumber = "productionInformation_manufacturerPartNumber",
  ProductionInformationMaterials = "productionInformation_materials",
  ProductionInformationModelNumber = "productionInformation_modelNumber",
  Title = "title",
  Version = "version",
  VisualsImages = "visuals_images",
  VisualsVideos = "visuals_videos"
}

export type ProductV1Product_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  allVariantsVoided?: InputMaybe<Scalars["Boolean"]>;
  allVariantsVoided_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  allVariantsVoided_not?: InputMaybe<Scalars["Boolean"]>;
  allVariantsVoided_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  brand?: InputMaybe<Scalars["String"]>;
  brand_?: InputMaybe<ProductV1Brand_Filter>;
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
  category?: InputMaybe<Scalars["String"]>;
  category_?: InputMaybe<ProductV1Category_Filter>;
  category_contains?: InputMaybe<Scalars["String"]>;
  category_contains_nocase?: InputMaybe<Scalars["String"]>;
  category_ends_with?: InputMaybe<Scalars["String"]>;
  category_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  category_gt?: InputMaybe<Scalars["String"]>;
  category_gte?: InputMaybe<Scalars["String"]>;
  category_in?: InputMaybe<Array<Scalars["String"]>>;
  category_lt?: InputMaybe<Scalars["String"]>;
  category_lte?: InputMaybe<Scalars["String"]>;
  category_not?: InputMaybe<Scalars["String"]>;
  category_not_contains?: InputMaybe<Scalars["String"]>;
  category_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  category_not_ends_with?: InputMaybe<Scalars["String"]>;
  category_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  category_not_in?: InputMaybe<Array<Scalars["String"]>>;
  category_not_starts_with?: InputMaybe<Scalars["String"]>;
  category_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  category_starts_with?: InputMaybe<Scalars["String"]>;
  category_starts_with_nocase?: InputMaybe<Scalars["String"]>;
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
  details_category?: InputMaybe<Scalars["String"]>;
  details_category_contains?: InputMaybe<Scalars["String"]>;
  details_category_contains_nocase?: InputMaybe<Scalars["String"]>;
  details_category_ends_with?: InputMaybe<Scalars["String"]>;
  details_category_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  details_category_gt?: InputMaybe<Scalars["String"]>;
  details_category_gte?: InputMaybe<Scalars["String"]>;
  details_category_in?: InputMaybe<Array<Scalars["String"]>>;
  details_category_lt?: InputMaybe<Scalars["String"]>;
  details_category_lte?: InputMaybe<Scalars["String"]>;
  details_category_not?: InputMaybe<Scalars["String"]>;
  details_category_not_contains?: InputMaybe<Scalars["String"]>;
  details_category_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  details_category_not_ends_with?: InputMaybe<Scalars["String"]>;
  details_category_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  details_category_not_in?: InputMaybe<Array<Scalars["String"]>>;
  details_category_not_starts_with?: InputMaybe<Scalars["String"]>;
  details_category_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  details_category_starts_with?: InputMaybe<Scalars["String"]>;
  details_category_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  details_offerCategory?: InputMaybe<Scalars["String"]>;
  details_offerCategory_contains?: InputMaybe<Scalars["String"]>;
  details_offerCategory_contains_nocase?: InputMaybe<Scalars["String"]>;
  details_offerCategory_ends_with?: InputMaybe<Scalars["String"]>;
  details_offerCategory_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  details_offerCategory_gt?: InputMaybe<Scalars["String"]>;
  details_offerCategory_gte?: InputMaybe<Scalars["String"]>;
  details_offerCategory_in?: InputMaybe<Array<Scalars["String"]>>;
  details_offerCategory_lt?: InputMaybe<Scalars["String"]>;
  details_offerCategory_lte?: InputMaybe<Scalars["String"]>;
  details_offerCategory_not?: InputMaybe<Scalars["String"]>;
  details_offerCategory_not_contains?: InputMaybe<Scalars["String"]>;
  details_offerCategory_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  details_offerCategory_not_ends_with?: InputMaybe<Scalars["String"]>;
  details_offerCategory_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  details_offerCategory_not_in?: InputMaybe<Array<Scalars["String"]>>;
  details_offerCategory_not_starts_with?: InputMaybe<Scalars["String"]>;
  details_offerCategory_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  details_offerCategory_starts_with?: InputMaybe<Scalars["String"]>;
  details_offerCategory_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  details_personalisation?: InputMaybe<Array<Scalars["String"]>>;
  details_personalisation_contains?: InputMaybe<Array<Scalars["String"]>>;
  details_personalisation_contains_nocase?: InputMaybe<
    Array<Scalars["String"]>
  >;
  details_personalisation_not?: InputMaybe<Array<Scalars["String"]>>;
  details_personalisation_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  details_personalisation_not_contains_nocase?: InputMaybe<
    Array<Scalars["String"]>
  >;
  details_sections?: InputMaybe<Array<Scalars["String"]>>;
  details_sections_contains?: InputMaybe<Array<Scalars["String"]>>;
  details_sections_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  details_sections_not?: InputMaybe<Array<Scalars["String"]>>;
  details_sections_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  details_sections_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  details_subCategory?: InputMaybe<Scalars["String"]>;
  details_subCategory2?: InputMaybe<Scalars["String"]>;
  details_subCategory2_contains?: InputMaybe<Scalars["String"]>;
  details_subCategory2_contains_nocase?: InputMaybe<Scalars["String"]>;
  details_subCategory2_ends_with?: InputMaybe<Scalars["String"]>;
  details_subCategory2_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  details_subCategory2_gt?: InputMaybe<Scalars["String"]>;
  details_subCategory2_gte?: InputMaybe<Scalars["String"]>;
  details_subCategory2_in?: InputMaybe<Array<Scalars["String"]>>;
  details_subCategory2_lt?: InputMaybe<Scalars["String"]>;
  details_subCategory2_lte?: InputMaybe<Scalars["String"]>;
  details_subCategory2_not?: InputMaybe<Scalars["String"]>;
  details_subCategory2_not_contains?: InputMaybe<Scalars["String"]>;
  details_subCategory2_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  details_subCategory2_not_ends_with?: InputMaybe<Scalars["String"]>;
  details_subCategory2_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  details_subCategory2_not_in?: InputMaybe<Array<Scalars["String"]>>;
  details_subCategory2_not_starts_with?: InputMaybe<Scalars["String"]>;
  details_subCategory2_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  details_subCategory2_starts_with?: InputMaybe<Scalars["String"]>;
  details_subCategory2_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  details_subCategory_contains?: InputMaybe<Scalars["String"]>;
  details_subCategory_contains_nocase?: InputMaybe<Scalars["String"]>;
  details_subCategory_ends_with?: InputMaybe<Scalars["String"]>;
  details_subCategory_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  details_subCategory_gt?: InputMaybe<Scalars["String"]>;
  details_subCategory_gte?: InputMaybe<Scalars["String"]>;
  details_subCategory_in?: InputMaybe<Array<Scalars["String"]>>;
  details_subCategory_lt?: InputMaybe<Scalars["String"]>;
  details_subCategory_lte?: InputMaybe<Scalars["String"]>;
  details_subCategory_not?: InputMaybe<Scalars["String"]>;
  details_subCategory_not_contains?: InputMaybe<Scalars["String"]>;
  details_subCategory_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  details_subCategory_not_ends_with?: InputMaybe<Scalars["String"]>;
  details_subCategory_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  details_subCategory_not_in?: InputMaybe<Array<Scalars["String"]>>;
  details_subCategory_not_starts_with?: InputMaybe<Scalars["String"]>;
  details_subCategory_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  details_subCategory_starts_with?: InputMaybe<Scalars["String"]>;
  details_subCategory_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  details_tags?: InputMaybe<Array<Scalars["String"]>>;
  details_tags_contains?: InputMaybe<Array<Scalars["String"]>>;
  details_tags_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  details_tags_not?: InputMaybe<Array<Scalars["String"]>>;
  details_tags_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  details_tags_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  disputeResolverId?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_gt?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_gte?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  disputeResolverId_lt?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_lte?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_not?: InputMaybe<Scalars["BigInt"]>;
  disputeResolverId_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  identification_productId?: InputMaybe<Scalars["String"]>;
  identification_productIdType?: InputMaybe<Scalars["String"]>;
  identification_productIdType_contains?: InputMaybe<Scalars["String"]>;
  identification_productIdType_contains_nocase?: InputMaybe<Scalars["String"]>;
  identification_productIdType_ends_with?: InputMaybe<Scalars["String"]>;
  identification_productIdType_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  identification_productIdType_gt?: InputMaybe<Scalars["String"]>;
  identification_productIdType_gte?: InputMaybe<Scalars["String"]>;
  identification_productIdType_in?: InputMaybe<Array<Scalars["String"]>>;
  identification_productIdType_lt?: InputMaybe<Scalars["String"]>;
  identification_productIdType_lte?: InputMaybe<Scalars["String"]>;
  identification_productIdType_not?: InputMaybe<Scalars["String"]>;
  identification_productIdType_not_contains?: InputMaybe<Scalars["String"]>;
  identification_productIdType_not_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  identification_productIdType_not_ends_with?: InputMaybe<Scalars["String"]>;
  identification_productIdType_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  identification_productIdType_not_in?: InputMaybe<Array<Scalars["String"]>>;
  identification_productIdType_not_starts_with?: InputMaybe<Scalars["String"]>;
  identification_productIdType_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  identification_productIdType_starts_with?: InputMaybe<Scalars["String"]>;
  identification_productIdType_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  identification_productId_contains?: InputMaybe<Scalars["String"]>;
  identification_productId_contains_nocase?: InputMaybe<Scalars["String"]>;
  identification_productId_ends_with?: InputMaybe<Scalars["String"]>;
  identification_productId_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  identification_productId_gt?: InputMaybe<Scalars["String"]>;
  identification_productId_gte?: InputMaybe<Scalars["String"]>;
  identification_productId_in?: InputMaybe<Array<Scalars["String"]>>;
  identification_productId_lt?: InputMaybe<Scalars["String"]>;
  identification_productId_lte?: InputMaybe<Scalars["String"]>;
  identification_productId_not?: InputMaybe<Scalars["String"]>;
  identification_productId_not_contains?: InputMaybe<Scalars["String"]>;
  identification_productId_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  identification_productId_not_ends_with?: InputMaybe<Scalars["String"]>;
  identification_productId_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  identification_productId_not_in?: InputMaybe<Array<Scalars["String"]>>;
  identification_productId_not_starts_with?: InputMaybe<Scalars["String"]>;
  identification_productId_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  identification_productId_starts_with?: InputMaybe<Scalars["String"]>;
  identification_productId_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  identification_sKU?: InputMaybe<Scalars["String"]>;
  identification_sKU_contains?: InputMaybe<Scalars["String"]>;
  identification_sKU_contains_nocase?: InputMaybe<Scalars["String"]>;
  identification_sKU_ends_with?: InputMaybe<Scalars["String"]>;
  identification_sKU_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  identification_sKU_gt?: InputMaybe<Scalars["String"]>;
  identification_sKU_gte?: InputMaybe<Scalars["String"]>;
  identification_sKU_in?: InputMaybe<Array<Scalars["String"]>>;
  identification_sKU_lt?: InputMaybe<Scalars["String"]>;
  identification_sKU_lte?: InputMaybe<Scalars["String"]>;
  identification_sKU_not?: InputMaybe<Scalars["String"]>;
  identification_sKU_not_contains?: InputMaybe<Scalars["String"]>;
  identification_sKU_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  identification_sKU_not_ends_with?: InputMaybe<Scalars["String"]>;
  identification_sKU_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  identification_sKU_not_in?: InputMaybe<Array<Scalars["String"]>>;
  identification_sKU_not_starts_with?: InputMaybe<Scalars["String"]>;
  identification_sKU_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  identification_sKU_starts_with?: InputMaybe<Scalars["String"]>;
  identification_sKU_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  maxValidFromDate?: InputMaybe<Scalars["BigInt"]>;
  maxValidFromDate_gt?: InputMaybe<Scalars["BigInt"]>;
  maxValidFromDate_gte?: InputMaybe<Scalars["BigInt"]>;
  maxValidFromDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  maxValidFromDate_lt?: InputMaybe<Scalars["BigInt"]>;
  maxValidFromDate_lte?: InputMaybe<Scalars["BigInt"]>;
  maxValidFromDate_not?: InputMaybe<Scalars["BigInt"]>;
  maxValidFromDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  maxValidUntilDate?: InputMaybe<Scalars["BigInt"]>;
  maxValidUntilDate_gt?: InputMaybe<Scalars["BigInt"]>;
  maxValidUntilDate_gte?: InputMaybe<Scalars["BigInt"]>;
  maxValidUntilDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  maxValidUntilDate_lt?: InputMaybe<Scalars["BigInt"]>;
  maxValidUntilDate_lte?: InputMaybe<Scalars["BigInt"]>;
  maxValidUntilDate_not?: InputMaybe<Scalars["BigInt"]>;
  maxValidUntilDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  minValidFromDate?: InputMaybe<Scalars["BigInt"]>;
  minValidFromDate_gt?: InputMaybe<Scalars["BigInt"]>;
  minValidFromDate_gte?: InputMaybe<Scalars["BigInt"]>;
  minValidFromDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  minValidFromDate_lt?: InputMaybe<Scalars["BigInt"]>;
  minValidFromDate_lte?: InputMaybe<Scalars["BigInt"]>;
  minValidFromDate_not?: InputMaybe<Scalars["BigInt"]>;
  minValidFromDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  minValidUntilDate?: InputMaybe<Scalars["BigInt"]>;
  minValidUntilDate_gt?: InputMaybe<Scalars["BigInt"]>;
  minValidUntilDate_gte?: InputMaybe<Scalars["BigInt"]>;
  minValidUntilDate_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  minValidUntilDate_lt?: InputMaybe<Scalars["BigInt"]>;
  minValidUntilDate_lte?: InputMaybe<Scalars["BigInt"]>;
  minValidUntilDate_not?: InputMaybe<Scalars["BigInt"]>;
  minValidUntilDate_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  notVoidedVariants?: InputMaybe<Array<Scalars["String"]>>;
  notVoidedVariants_?: InputMaybe<ProductV1Variant_Filter>;
  notVoidedVariants_contains?: InputMaybe<Array<Scalars["String"]>>;
  notVoidedVariants_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  notVoidedVariants_not?: InputMaybe<Array<Scalars["String"]>>;
  notVoidedVariants_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  notVoidedVariants_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  offerCategory?: InputMaybe<ProductV1OfferCategory>;
  offerCategory_in?: InputMaybe<Array<ProductV1OfferCategory>>;
  offerCategory_not?: InputMaybe<ProductV1OfferCategory>;
  offerCategory_not_in?: InputMaybe<Array<ProductV1OfferCategory>>;
  packaging_dimensions_height?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_contains?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_gt?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_gte?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_dimensions_height_lt?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_lte?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_not?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_not_contains?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_not_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_height_not_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_height_not_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_dimensions_height_not_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_height_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_height_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_length?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_contains?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_gt?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_gte?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_dimensions_length_lt?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_lte?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_not?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_not_contains?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_not_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_length_not_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_length_not_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_dimensions_length_not_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_length_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_length_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_unit?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_contains?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_gt?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_gte?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_dimensions_unit_lt?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_lte?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_not?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_not_contains?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_not_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_unit_not_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_dimensions_unit_not_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_unit_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_unit_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_contains?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_gt?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_gte?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_dimensions_width_lt?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_lte?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_not?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_not_contains?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_not_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_width_not_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_width_not_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_dimensions_width_not_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_dimensions_width_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_dimensions_width_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_contains?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_gt?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_gte?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_packageQuantity_lt?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_lte?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_not?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_not_contains?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_not_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_packageQuantity_not_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_packageQuantity_not_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  packaging_packageQuantity_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_packageQuantity_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_contains?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_gt?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_gte?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_weight_unit_lt?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_lte?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_not?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_not_contains?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_not_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_not_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_weight_unit_not_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_weight_unit_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_value?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_contains?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_gt?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_gte?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_weight_value_lt?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_lte?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_not?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_not_contains?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_not_ends_with?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_not_in?: InputMaybe<Array<Scalars["String"]>>;
  packaging_weight_value_not_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_starts_with?: InputMaybe<Scalars["String"]>;
  packaging_weight_value_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  personalisation?: InputMaybe<Array<Scalars["String"]>>;
  personalisation_?: InputMaybe<ProductV1Personalisation_Filter>;
  personalisation_contains?: InputMaybe<Array<Scalars["String"]>>;
  personalisation_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  personalisation_not?: InputMaybe<Array<Scalars["String"]>>;
  personalisation_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  personalisation_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  productV1Seller?: InputMaybe<Scalars["String"]>;
  productV1Seller_?: InputMaybe<ProductV1Seller_Filter>;
  productV1Seller_contains?: InputMaybe<Scalars["String"]>;
  productV1Seller_contains_nocase?: InputMaybe<Scalars["String"]>;
  productV1Seller_ends_with?: InputMaybe<Scalars["String"]>;
  productV1Seller_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  productV1Seller_gt?: InputMaybe<Scalars["String"]>;
  productV1Seller_gte?: InputMaybe<Scalars["String"]>;
  productV1Seller_in?: InputMaybe<Array<Scalars["String"]>>;
  productV1Seller_lt?: InputMaybe<Scalars["String"]>;
  productV1Seller_lte?: InputMaybe<Scalars["String"]>;
  productV1Seller_not?: InputMaybe<Scalars["String"]>;
  productV1Seller_not_contains?: InputMaybe<Scalars["String"]>;
  productV1Seller_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  productV1Seller_not_ends_with?: InputMaybe<Scalars["String"]>;
  productV1Seller_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  productV1Seller_not_in?: InputMaybe<Array<Scalars["String"]>>;
  productV1Seller_not_starts_with?: InputMaybe<Scalars["String"]>;
  productV1Seller_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  productV1Seller_starts_with?: InputMaybe<Scalars["String"]>;
  productV1Seller_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_contains?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_brandName_ends_with?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_brandName_gt?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_gte?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_in?: InputMaybe<Array<Scalars["String"]>>;
  productionInformation_brandName_lt?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_lte?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_not?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_not_contains?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_not_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_brandName_not_ends_with?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_brandName_not_in?: InputMaybe<Array<Scalars["String"]>>;
  productionInformation_brandName_not_starts_with?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_brandName_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_brandName_starts_with?: InputMaybe<Scalars["String"]>;
  productionInformation_brandName_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer?: InputMaybe<Scalars["String"]>;
  productionInformation_manufacturerPartNumber?: InputMaybe<Scalars["String"]>;
  productionInformation_manufacturerPartNumber_contains?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_ends_with?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_gt?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_gte?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_in?: InputMaybe<
    Array<Scalars["String"]>
  >;
  productionInformation_manufacturerPartNumber_lt?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_lte?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_not?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_not_contains?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_not_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_not_ends_with?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_not_in?: InputMaybe<
    Array<Scalars["String"]>
  >;
  productionInformation_manufacturerPartNumber_not_starts_with?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_starts_with?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturerPartNumber_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer_contains?: InputMaybe<Scalars["String"]>;
  productionInformation_manufacturer_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer_ends_with?: InputMaybe<Scalars["String"]>;
  productionInformation_manufacturer_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer_gt?: InputMaybe<Scalars["String"]>;
  productionInformation_manufacturer_gte?: InputMaybe<Scalars["String"]>;
  productionInformation_manufacturer_in?: InputMaybe<Array<Scalars["String"]>>;
  productionInformation_manufacturer_lt?: InputMaybe<Scalars["String"]>;
  productionInformation_manufacturer_lte?: InputMaybe<Scalars["String"]>;
  productionInformation_manufacturer_not?: InputMaybe<Scalars["String"]>;
  productionInformation_manufacturer_not_contains?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer_not_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer_not_ends_with?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer_not_in?: InputMaybe<
    Array<Scalars["String"]>
  >;
  productionInformation_manufacturer_not_starts_with?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer_starts_with?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_manufacturer_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_materials?: InputMaybe<Array<Scalars["String"]>>;
  productionInformation_materials_contains?: InputMaybe<
    Array<Scalars["String"]>
  >;
  productionInformation_materials_contains_nocase?: InputMaybe<
    Array<Scalars["String"]>
  >;
  productionInformation_materials_not?: InputMaybe<Array<Scalars["String"]>>;
  productionInformation_materials_not_contains?: InputMaybe<
    Array<Scalars["String"]>
  >;
  productionInformation_materials_not_contains_nocase?: InputMaybe<
    Array<Scalars["String"]>
  >;
  productionInformation_modelNumber?: InputMaybe<Scalars["String"]>;
  productionInformation_modelNumber_contains?: InputMaybe<Scalars["String"]>;
  productionInformation_modelNumber_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_modelNumber_ends_with?: InputMaybe<Scalars["String"]>;
  productionInformation_modelNumber_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_modelNumber_gt?: InputMaybe<Scalars["String"]>;
  productionInformation_modelNumber_gte?: InputMaybe<Scalars["String"]>;
  productionInformation_modelNumber_in?: InputMaybe<Array<Scalars["String"]>>;
  productionInformation_modelNumber_lt?: InputMaybe<Scalars["String"]>;
  productionInformation_modelNumber_lte?: InputMaybe<Scalars["String"]>;
  productionInformation_modelNumber_not?: InputMaybe<Scalars["String"]>;
  productionInformation_modelNumber_not_contains?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_modelNumber_not_contains_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_modelNumber_not_ends_with?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_modelNumber_not_ends_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_modelNumber_not_in?: InputMaybe<
    Array<Scalars["String"]>
  >;
  productionInformation_modelNumber_not_starts_with?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_modelNumber_not_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  productionInformation_modelNumber_starts_with?: InputMaybe<Scalars["String"]>;
  productionInformation_modelNumber_starts_with_nocase?: InputMaybe<
    Scalars["String"]
  >;
  sections?: InputMaybe<Array<Scalars["String"]>>;
  sections_?: InputMaybe<ProductV1Section_Filter>;
  sections_contains?: InputMaybe<Array<Scalars["String"]>>;
  sections_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  sections_not?: InputMaybe<Array<Scalars["String"]>>;
  sections_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  sections_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  sellerId?: InputMaybe<Scalars["BigInt"]>;
  sellerId_gt?: InputMaybe<Scalars["BigInt"]>;
  sellerId_gte?: InputMaybe<Scalars["BigInt"]>;
  sellerId_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  sellerId_lt?: InputMaybe<Scalars["BigInt"]>;
  sellerId_lte?: InputMaybe<Scalars["BigInt"]>;
  sellerId_not?: InputMaybe<Scalars["BigInt"]>;
  sellerId_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  subCategory?: InputMaybe<Scalars["String"]>;
  subCategory2?: InputMaybe<Scalars["String"]>;
  subCategory2_?: InputMaybe<ProductV1Category_Filter>;
  subCategory2_contains?: InputMaybe<Scalars["String"]>;
  subCategory2_contains_nocase?: InputMaybe<Scalars["String"]>;
  subCategory2_ends_with?: InputMaybe<Scalars["String"]>;
  subCategory2_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  subCategory2_gt?: InputMaybe<Scalars["String"]>;
  subCategory2_gte?: InputMaybe<Scalars["String"]>;
  subCategory2_in?: InputMaybe<Array<Scalars["String"]>>;
  subCategory2_lt?: InputMaybe<Scalars["String"]>;
  subCategory2_lte?: InputMaybe<Scalars["String"]>;
  subCategory2_not?: InputMaybe<Scalars["String"]>;
  subCategory2_not_contains?: InputMaybe<Scalars["String"]>;
  subCategory2_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  subCategory2_not_ends_with?: InputMaybe<Scalars["String"]>;
  subCategory2_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  subCategory2_not_in?: InputMaybe<Array<Scalars["String"]>>;
  subCategory2_not_starts_with?: InputMaybe<Scalars["String"]>;
  subCategory2_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  subCategory2_starts_with?: InputMaybe<Scalars["String"]>;
  subCategory2_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  subCategory_?: InputMaybe<ProductV1Category_Filter>;
  subCategory_contains?: InputMaybe<Scalars["String"]>;
  subCategory_contains_nocase?: InputMaybe<Scalars["String"]>;
  subCategory_ends_with?: InputMaybe<Scalars["String"]>;
  subCategory_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  subCategory_gt?: InputMaybe<Scalars["String"]>;
  subCategory_gte?: InputMaybe<Scalars["String"]>;
  subCategory_in?: InputMaybe<Array<Scalars["String"]>>;
  subCategory_lt?: InputMaybe<Scalars["String"]>;
  subCategory_lte?: InputMaybe<Scalars["String"]>;
  subCategory_not?: InputMaybe<Scalars["String"]>;
  subCategory_not_contains?: InputMaybe<Scalars["String"]>;
  subCategory_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  subCategory_not_ends_with?: InputMaybe<Scalars["String"]>;
  subCategory_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  subCategory_not_in?: InputMaybe<Array<Scalars["String"]>>;
  subCategory_not_starts_with?: InputMaybe<Scalars["String"]>;
  subCategory_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  subCategory_starts_with?: InputMaybe<Scalars["String"]>;
  subCategory_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  tags?: InputMaybe<Array<Scalars["String"]>>;
  tags_?: InputMaybe<ProductV1Tag_Filter>;
  tags_contains?: InputMaybe<Array<Scalars["String"]>>;
  tags_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  tags_not?: InputMaybe<Array<Scalars["String"]>>;
  tags_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  tags_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  title?: InputMaybe<Scalars["String"]>;
  title_contains?: InputMaybe<Scalars["String"]>;
  title_contains_nocase?: InputMaybe<Scalars["String"]>;
  title_ends_with?: InputMaybe<Scalars["String"]>;
  title_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  title_gt?: InputMaybe<Scalars["String"]>;
  title_gte?: InputMaybe<Scalars["String"]>;
  title_in?: InputMaybe<Array<Scalars["String"]>>;
  title_lt?: InputMaybe<Scalars["String"]>;
  title_lte?: InputMaybe<Scalars["String"]>;
  title_not?: InputMaybe<Scalars["String"]>;
  title_not_contains?: InputMaybe<Scalars["String"]>;
  title_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  title_not_ends_with?: InputMaybe<Scalars["String"]>;
  title_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  title_not_in?: InputMaybe<Array<Scalars["String"]>>;
  title_not_starts_with?: InputMaybe<Scalars["String"]>;
  title_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  title_starts_with?: InputMaybe<Scalars["String"]>;
  title_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  uuid?: InputMaybe<Scalars["String"]>;
  uuid_contains?: InputMaybe<Scalars["String"]>;
  uuid_contains_nocase?: InputMaybe<Scalars["String"]>;
  uuid_ends_with?: InputMaybe<Scalars["String"]>;
  uuid_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  uuid_gt?: InputMaybe<Scalars["String"]>;
  uuid_gte?: InputMaybe<Scalars["String"]>;
  uuid_in?: InputMaybe<Array<Scalars["String"]>>;
  uuid_lt?: InputMaybe<Scalars["String"]>;
  uuid_lte?: InputMaybe<Scalars["String"]>;
  uuid_not?: InputMaybe<Scalars["String"]>;
  uuid_not_contains?: InputMaybe<Scalars["String"]>;
  uuid_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  uuid_not_ends_with?: InputMaybe<Scalars["String"]>;
  uuid_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  uuid_not_in?: InputMaybe<Array<Scalars["String"]>>;
  uuid_not_starts_with?: InputMaybe<Scalars["String"]>;
  uuid_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  uuid_starts_with?: InputMaybe<Scalars["String"]>;
  uuid_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  variants?: InputMaybe<Array<Scalars["String"]>>;
  variants_?: InputMaybe<ProductV1Variant_Filter>;
  variants_contains?: InputMaybe<Array<Scalars["String"]>>;
  variants_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  variants_not?: InputMaybe<Array<Scalars["String"]>>;
  variants_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  variants_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  version?: InputMaybe<Scalars["Int"]>;
  version_gt?: InputMaybe<Scalars["Int"]>;
  version_gte?: InputMaybe<Scalars["Int"]>;
  version_in?: InputMaybe<Array<Scalars["Int"]>>;
  version_lt?: InputMaybe<Scalars["Int"]>;
  version_lte?: InputMaybe<Scalars["Int"]>;
  version_not?: InputMaybe<Scalars["Int"]>;
  version_not_in?: InputMaybe<Array<Scalars["Int"]>>;
  visuals_images?: InputMaybe<Array<Scalars["String"]>>;
  visuals_images_?: InputMaybe<ProductV1Media_Filter>;
  visuals_images_contains?: InputMaybe<Array<Scalars["String"]>>;
  visuals_images_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  visuals_images_not?: InputMaybe<Array<Scalars["String"]>>;
  visuals_images_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  visuals_images_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  visuals_videos?: InputMaybe<Array<Scalars["String"]>>;
  visuals_videos_?: InputMaybe<ProductV1Media_Filter>;
  visuals_videos_contains?: InputMaybe<Array<Scalars["String"]>>;
  visuals_videos_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  visuals_videos_not?: InputMaybe<Array<Scalars["String"]>>;
  visuals_videos_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  visuals_videos_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
};

export enum ProductV1Product_OrderBy {
  AllVariantsVoided = "allVariantsVoided",
  Brand = "brand",
  Category = "category",
  Description = "description",
  DetailsCategory = "details_category",
  DetailsOfferCategory = "details_offerCategory",
  DetailsPersonalisation = "details_personalisation",
  DetailsSections = "details_sections",
  DetailsSubCategory = "details_subCategory",
  DetailsSubCategory2 = "details_subCategory2",
  DetailsTags = "details_tags",
  DisputeResolverId = "disputeResolverId",
  Id = "id",
  IdentificationProductId = "identification_productId",
  IdentificationProductIdType = "identification_productIdType",
  IdentificationSKu = "identification_sKU",
  MaxValidFromDate = "maxValidFromDate",
  MaxValidUntilDate = "maxValidUntilDate",
  MinValidFromDate = "minValidFromDate",
  MinValidUntilDate = "minValidUntilDate",
  NotVoidedVariants = "notVoidedVariants",
  OfferCategory = "offerCategory",
  PackagingDimensionsHeight = "packaging_dimensions_height",
  PackagingDimensionsLength = "packaging_dimensions_length",
  PackagingDimensionsUnit = "packaging_dimensions_unit",
  PackagingDimensionsWidth = "packaging_dimensions_width",
  PackagingPackageQuantity = "packaging_packageQuantity",
  PackagingWeightUnit = "packaging_weight_unit",
  PackagingWeightValue = "packaging_weight_value",
  Personalisation = "personalisation",
  ProductV1Seller = "productV1Seller",
  ProductionInformationBrandName = "productionInformation_brandName",
  ProductionInformationManufacturer = "productionInformation_manufacturer",
  ProductionInformationManufacturerPartNumber = "productionInformation_manufacturerPartNumber",
  ProductionInformationMaterials = "productionInformation_materials",
  ProductionInformationModelNumber = "productionInformation_modelNumber",
  Sections = "sections",
  SellerId = "sellerId",
  SubCategory = "subCategory",
  SubCategory2 = "subCategory2",
  Tags = "tags",
  Title = "title",
  Uuid = "uuid",
  Variants = "variants",
  Version = "version",
  VisualsImages = "visuals_images",
  VisualsVideos = "visuals_videos"
}

export type ProductV1Section = {
  __typename?: "ProductV1Section";
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type ProductV1Section_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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

export enum ProductV1Section_OrderBy {
  Id = "id",
  Name = "name"
}

export type ProductV1Seller = {
  __typename?: "ProductV1Seller";
  contactLinks?: Maybe<Array<ProductV1SellerContactLink>>;
  defaultVersion: Scalars["Int"];
  description?: Maybe<Scalars["String"]>;
  externalUrl?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  images?: Maybe<Array<ProductV1Media>>;
  name?: Maybe<Scalars["String"]>;
  /**
   * Refs
   *
   */
  seller: Seller;
  sellerId?: Maybe<Scalars["String"]>;
  tokenId?: Maybe<Scalars["String"]>;
};

export type ProductV1SellerContactLinksArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1SellerContactLink_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ProductV1SellerContactLink_Filter>;
};

export type ProductV1SellerImagesArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Media_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ProductV1Media_Filter>;
};

export type ProductV1SellerContactLink = {
  __typename?: "ProductV1SellerContactLink";
  id: Scalars["ID"];
  tag: Scalars["String"];
  url: Scalars["String"];
};

export type ProductV1SellerContactLink_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  tag?: InputMaybe<Scalars["String"]>;
  tag_contains?: InputMaybe<Scalars["String"]>;
  tag_contains_nocase?: InputMaybe<Scalars["String"]>;
  tag_ends_with?: InputMaybe<Scalars["String"]>;
  tag_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  tag_gt?: InputMaybe<Scalars["String"]>;
  tag_gte?: InputMaybe<Scalars["String"]>;
  tag_in?: InputMaybe<Array<Scalars["String"]>>;
  tag_lt?: InputMaybe<Scalars["String"]>;
  tag_lte?: InputMaybe<Scalars["String"]>;
  tag_not?: InputMaybe<Scalars["String"]>;
  tag_not_contains?: InputMaybe<Scalars["String"]>;
  tag_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  tag_not_ends_with?: InputMaybe<Scalars["String"]>;
  tag_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  tag_not_in?: InputMaybe<Array<Scalars["String"]>>;
  tag_not_starts_with?: InputMaybe<Scalars["String"]>;
  tag_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  tag_starts_with?: InputMaybe<Scalars["String"]>;
  tag_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  url?: InputMaybe<Scalars["String"]>;
  url_contains?: InputMaybe<Scalars["String"]>;
  url_contains_nocase?: InputMaybe<Scalars["String"]>;
  url_ends_with?: InputMaybe<Scalars["String"]>;
  url_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  url_gt?: InputMaybe<Scalars["String"]>;
  url_gte?: InputMaybe<Scalars["String"]>;
  url_in?: InputMaybe<Array<Scalars["String"]>>;
  url_lt?: InputMaybe<Scalars["String"]>;
  url_lte?: InputMaybe<Scalars["String"]>;
  url_not?: InputMaybe<Scalars["String"]>;
  url_not_contains?: InputMaybe<Scalars["String"]>;
  url_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  url_not_ends_with?: InputMaybe<Scalars["String"]>;
  url_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  url_not_in?: InputMaybe<Array<Scalars["String"]>>;
  url_not_starts_with?: InputMaybe<Scalars["String"]>;
  url_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  url_starts_with?: InputMaybe<Scalars["String"]>;
  url_starts_with_nocase?: InputMaybe<Scalars["String"]>;
};

export enum ProductV1SellerContactLink_OrderBy {
  Id = "id",
  Tag = "tag",
  Url = "url"
}

export type ProductV1Seller_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  contactLinks?: InputMaybe<Array<Scalars["String"]>>;
  contactLinks_?: InputMaybe<ProductV1SellerContactLink_Filter>;
  contactLinks_contains?: InputMaybe<Array<Scalars["String"]>>;
  contactLinks_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  contactLinks_not?: InputMaybe<Array<Scalars["String"]>>;
  contactLinks_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  contactLinks_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  defaultVersion?: InputMaybe<Scalars["Int"]>;
  defaultVersion_gt?: InputMaybe<Scalars["Int"]>;
  defaultVersion_gte?: InputMaybe<Scalars["Int"]>;
  defaultVersion_in?: InputMaybe<Array<Scalars["Int"]>>;
  defaultVersion_lt?: InputMaybe<Scalars["Int"]>;
  defaultVersion_lte?: InputMaybe<Scalars["Int"]>;
  defaultVersion_not?: InputMaybe<Scalars["Int"]>;
  defaultVersion_not_in?: InputMaybe<Array<Scalars["Int"]>>;
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
  images_?: InputMaybe<ProductV1Media_Filter>;
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
  seller?: InputMaybe<Scalars["String"]>;
  sellerId?: InputMaybe<Scalars["String"]>;
  sellerId_contains?: InputMaybe<Scalars["String"]>;
  sellerId_contains_nocase?: InputMaybe<Scalars["String"]>;
  sellerId_ends_with?: InputMaybe<Scalars["String"]>;
  sellerId_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  sellerId_gt?: InputMaybe<Scalars["String"]>;
  sellerId_gte?: InputMaybe<Scalars["String"]>;
  sellerId_in?: InputMaybe<Array<Scalars["String"]>>;
  sellerId_lt?: InputMaybe<Scalars["String"]>;
  sellerId_lte?: InputMaybe<Scalars["String"]>;
  sellerId_not?: InputMaybe<Scalars["String"]>;
  sellerId_not_contains?: InputMaybe<Scalars["String"]>;
  sellerId_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  sellerId_not_ends_with?: InputMaybe<Scalars["String"]>;
  sellerId_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  sellerId_not_in?: InputMaybe<Array<Scalars["String"]>>;
  sellerId_not_starts_with?: InputMaybe<Scalars["String"]>;
  sellerId_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  sellerId_starts_with?: InputMaybe<Scalars["String"]>;
  sellerId_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  seller_?: InputMaybe<Seller_Filter>;
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
  tokenId?: InputMaybe<Scalars["String"]>;
  tokenId_contains?: InputMaybe<Scalars["String"]>;
  tokenId_contains_nocase?: InputMaybe<Scalars["String"]>;
  tokenId_ends_with?: InputMaybe<Scalars["String"]>;
  tokenId_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  tokenId_gt?: InputMaybe<Scalars["String"]>;
  tokenId_gte?: InputMaybe<Scalars["String"]>;
  tokenId_in?: InputMaybe<Array<Scalars["String"]>>;
  tokenId_lt?: InputMaybe<Scalars["String"]>;
  tokenId_lte?: InputMaybe<Scalars["String"]>;
  tokenId_not?: InputMaybe<Scalars["String"]>;
  tokenId_not_contains?: InputMaybe<Scalars["String"]>;
  tokenId_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  tokenId_not_ends_with?: InputMaybe<Scalars["String"]>;
  tokenId_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  tokenId_not_in?: InputMaybe<Array<Scalars["String"]>>;
  tokenId_not_starts_with?: InputMaybe<Scalars["String"]>;
  tokenId_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  tokenId_starts_with?: InputMaybe<Scalars["String"]>;
  tokenId_starts_with_nocase?: InputMaybe<Scalars["String"]>;
};

export enum ProductV1Seller_OrderBy {
  ContactLinks = "contactLinks",
  DefaultVersion = "defaultVersion",
  Description = "description",
  ExternalUrl = "externalUrl",
  Id = "id",
  Images = "images",
  Name = "name",
  Seller = "seller",
  SellerId = "sellerId",
  TokenId = "tokenId"
}

export type ProductV1ShippingJurisdiction = {
  __typename?: "ProductV1ShippingJurisdiction";
  deliveryTime: Scalars["String"];
  id: Scalars["ID"];
  label: Scalars["String"];
};

export type ProductV1ShippingJurisdiction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  deliveryTime?: InputMaybe<Scalars["String"]>;
  deliveryTime_contains?: InputMaybe<Scalars["String"]>;
  deliveryTime_contains_nocase?: InputMaybe<Scalars["String"]>;
  deliveryTime_ends_with?: InputMaybe<Scalars["String"]>;
  deliveryTime_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  deliveryTime_gt?: InputMaybe<Scalars["String"]>;
  deliveryTime_gte?: InputMaybe<Scalars["String"]>;
  deliveryTime_in?: InputMaybe<Array<Scalars["String"]>>;
  deliveryTime_lt?: InputMaybe<Scalars["String"]>;
  deliveryTime_lte?: InputMaybe<Scalars["String"]>;
  deliveryTime_not?: InputMaybe<Scalars["String"]>;
  deliveryTime_not_contains?: InputMaybe<Scalars["String"]>;
  deliveryTime_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  deliveryTime_not_ends_with?: InputMaybe<Scalars["String"]>;
  deliveryTime_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  deliveryTime_not_in?: InputMaybe<Array<Scalars["String"]>>;
  deliveryTime_not_starts_with?: InputMaybe<Scalars["String"]>;
  deliveryTime_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  deliveryTime_starts_with?: InputMaybe<Scalars["String"]>;
  deliveryTime_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  label?: InputMaybe<Scalars["String"]>;
  label_contains?: InputMaybe<Scalars["String"]>;
  label_contains_nocase?: InputMaybe<Scalars["String"]>;
  label_ends_with?: InputMaybe<Scalars["String"]>;
  label_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  label_gt?: InputMaybe<Scalars["String"]>;
  label_gte?: InputMaybe<Scalars["String"]>;
  label_in?: InputMaybe<Array<Scalars["String"]>>;
  label_lt?: InputMaybe<Scalars["String"]>;
  label_lte?: InputMaybe<Scalars["String"]>;
  label_not?: InputMaybe<Scalars["String"]>;
  label_not_contains?: InputMaybe<Scalars["String"]>;
  label_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  label_not_ends_with?: InputMaybe<Scalars["String"]>;
  label_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  label_not_in?: InputMaybe<Array<Scalars["String"]>>;
  label_not_starts_with?: InputMaybe<Scalars["String"]>;
  label_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  label_starts_with?: InputMaybe<Scalars["String"]>;
  label_starts_with_nocase?: InputMaybe<Scalars["String"]>;
};

export enum ProductV1ShippingJurisdiction_OrderBy {
  DeliveryTime = "deliveryTime",
  Id = "id",
  Label = "label"
}

export type ProductV1ShippingOption = {
  __typename?: "ProductV1ShippingOption";
  countryOfOrigin?: Maybe<Scalars["String"]>;
  defaultVersion?: Maybe<Scalars["Int"]>;
  id: Scalars["ID"];
  redemptionPoint?: Maybe<Scalars["String"]>;
  returnPeriodInDays: Scalars["Int"];
  supportedJurisdictions?: Maybe<Array<ProductV1ShippingJurisdiction>>;
};

export type ProductV1ShippingOptionSupportedJurisdictionsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1ShippingJurisdiction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ProductV1ShippingJurisdiction_Filter>;
};

export type ProductV1ShippingOption_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  countryOfOrigin?: InputMaybe<Scalars["String"]>;
  countryOfOrigin_contains?: InputMaybe<Scalars["String"]>;
  countryOfOrigin_contains_nocase?: InputMaybe<Scalars["String"]>;
  countryOfOrigin_ends_with?: InputMaybe<Scalars["String"]>;
  countryOfOrigin_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  countryOfOrigin_gt?: InputMaybe<Scalars["String"]>;
  countryOfOrigin_gte?: InputMaybe<Scalars["String"]>;
  countryOfOrigin_in?: InputMaybe<Array<Scalars["String"]>>;
  countryOfOrigin_lt?: InputMaybe<Scalars["String"]>;
  countryOfOrigin_lte?: InputMaybe<Scalars["String"]>;
  countryOfOrigin_not?: InputMaybe<Scalars["String"]>;
  countryOfOrigin_not_contains?: InputMaybe<Scalars["String"]>;
  countryOfOrigin_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  countryOfOrigin_not_ends_with?: InputMaybe<Scalars["String"]>;
  countryOfOrigin_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  countryOfOrigin_not_in?: InputMaybe<Array<Scalars["String"]>>;
  countryOfOrigin_not_starts_with?: InputMaybe<Scalars["String"]>;
  countryOfOrigin_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  countryOfOrigin_starts_with?: InputMaybe<Scalars["String"]>;
  countryOfOrigin_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  defaultVersion?: InputMaybe<Scalars["Int"]>;
  defaultVersion_gt?: InputMaybe<Scalars["Int"]>;
  defaultVersion_gte?: InputMaybe<Scalars["Int"]>;
  defaultVersion_in?: InputMaybe<Array<Scalars["Int"]>>;
  defaultVersion_lt?: InputMaybe<Scalars["Int"]>;
  defaultVersion_lte?: InputMaybe<Scalars["Int"]>;
  defaultVersion_not?: InputMaybe<Scalars["Int"]>;
  defaultVersion_not_in?: InputMaybe<Array<Scalars["Int"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  redemptionPoint?: InputMaybe<Scalars["String"]>;
  redemptionPoint_contains?: InputMaybe<Scalars["String"]>;
  redemptionPoint_contains_nocase?: InputMaybe<Scalars["String"]>;
  redemptionPoint_ends_with?: InputMaybe<Scalars["String"]>;
  redemptionPoint_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  redemptionPoint_gt?: InputMaybe<Scalars["String"]>;
  redemptionPoint_gte?: InputMaybe<Scalars["String"]>;
  redemptionPoint_in?: InputMaybe<Array<Scalars["String"]>>;
  redemptionPoint_lt?: InputMaybe<Scalars["String"]>;
  redemptionPoint_lte?: InputMaybe<Scalars["String"]>;
  redemptionPoint_not?: InputMaybe<Scalars["String"]>;
  redemptionPoint_not_contains?: InputMaybe<Scalars["String"]>;
  redemptionPoint_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  redemptionPoint_not_ends_with?: InputMaybe<Scalars["String"]>;
  redemptionPoint_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  redemptionPoint_not_in?: InputMaybe<Array<Scalars["String"]>>;
  redemptionPoint_not_starts_with?: InputMaybe<Scalars["String"]>;
  redemptionPoint_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  redemptionPoint_starts_with?: InputMaybe<Scalars["String"]>;
  redemptionPoint_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  returnPeriodInDays?: InputMaybe<Scalars["Int"]>;
  returnPeriodInDays_gt?: InputMaybe<Scalars["Int"]>;
  returnPeriodInDays_gte?: InputMaybe<Scalars["Int"]>;
  returnPeriodInDays_in?: InputMaybe<Array<Scalars["Int"]>>;
  returnPeriodInDays_lt?: InputMaybe<Scalars["Int"]>;
  returnPeriodInDays_lte?: InputMaybe<Scalars["Int"]>;
  returnPeriodInDays_not?: InputMaybe<Scalars["Int"]>;
  returnPeriodInDays_not_in?: InputMaybe<Array<Scalars["Int"]>>;
  supportedJurisdictions?: InputMaybe<Array<Scalars["String"]>>;
  supportedJurisdictions_?: InputMaybe<ProductV1ShippingJurisdiction_Filter>;
  supportedJurisdictions_contains?: InputMaybe<Array<Scalars["String"]>>;
  supportedJurisdictions_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  supportedJurisdictions_not?: InputMaybe<Array<Scalars["String"]>>;
  supportedJurisdictions_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  supportedJurisdictions_not_contains_nocase?: InputMaybe<
    Array<Scalars["String"]>
  >;
};

export enum ProductV1ShippingOption_OrderBy {
  CountryOfOrigin = "countryOfOrigin",
  DefaultVersion = "defaultVersion",
  Id = "id",
  RedemptionPoint = "redemptionPoint",
  ReturnPeriodInDays = "returnPeriodInDays",
  SupportedJurisdictions = "supportedJurisdictions"
}

export type ProductV1Tag = {
  __typename?: "ProductV1Tag";
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type ProductV1Tag_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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

export enum ProductV1Tag_OrderBy {
  Id = "id",
  Name = "name"
}

export type ProductV1Variant = {
  __typename?: "ProductV1Variant";
  id: Scalars["ID"];
  offer: Offer;
  variations?: Maybe<Array<ProductV1Variation>>;
};

export type ProductV1VariantVariationsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Variation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<ProductV1Variation_Filter>;
};

export type ProductV1Variant_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  offer?: InputMaybe<Scalars["String"]>;
  offer_?: InputMaybe<Offer_Filter>;
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
  variations?: InputMaybe<Array<Scalars["String"]>>;
  variations_?: InputMaybe<ProductV1Variation_Filter>;
  variations_contains?: InputMaybe<Array<Scalars["String"]>>;
  variations_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  variations_not?: InputMaybe<Array<Scalars["String"]>>;
  variations_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  variations_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
};

export enum ProductV1Variant_OrderBy {
  Id = "id",
  Offer = "offer",
  Variations = "variations"
}

export type ProductV1Variation = {
  __typename?: "ProductV1Variation";
  id: Scalars["ID"];
  option: Scalars["String"];
  type: Scalars["String"];
};

export type ProductV1Variation_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  option?: InputMaybe<Scalars["String"]>;
  option_contains?: InputMaybe<Scalars["String"]>;
  option_contains_nocase?: InputMaybe<Scalars["String"]>;
  option_ends_with?: InputMaybe<Scalars["String"]>;
  option_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  option_gt?: InputMaybe<Scalars["String"]>;
  option_gte?: InputMaybe<Scalars["String"]>;
  option_in?: InputMaybe<Array<Scalars["String"]>>;
  option_lt?: InputMaybe<Scalars["String"]>;
  option_lte?: InputMaybe<Scalars["String"]>;
  option_not?: InputMaybe<Scalars["String"]>;
  option_not_contains?: InputMaybe<Scalars["String"]>;
  option_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  option_not_ends_with?: InputMaybe<Scalars["String"]>;
  option_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  option_not_in?: InputMaybe<Array<Scalars["String"]>>;
  option_not_starts_with?: InputMaybe<Scalars["String"]>;
  option_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  option_starts_with?: InputMaybe<Scalars["String"]>;
  option_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<Scalars["String"]>;
  type_contains?: InputMaybe<Scalars["String"]>;
  type_contains_nocase?: InputMaybe<Scalars["String"]>;
  type_ends_with?: InputMaybe<Scalars["String"]>;
  type_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  type_gt?: InputMaybe<Scalars["String"]>;
  type_gte?: InputMaybe<Scalars["String"]>;
  type_in?: InputMaybe<Array<Scalars["String"]>>;
  type_lt?: InputMaybe<Scalars["String"]>;
  type_lte?: InputMaybe<Scalars["String"]>;
  type_not?: InputMaybe<Scalars["String"]>;
  type_not_contains?: InputMaybe<Scalars["String"]>;
  type_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  type_not_ends_with?: InputMaybe<Scalars["String"]>;
  type_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  type_not_in?: InputMaybe<Array<Scalars["String"]>>;
  type_not_starts_with?: InputMaybe<Scalars["String"]>;
  type_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  type_starts_with?: InputMaybe<Scalars["String"]>;
  type_starts_with_nocase?: InputMaybe<Scalars["String"]>;
};

export enum ProductV1Variation_OrderBy {
  Id = "id",
  Option = "option",
  Type = "type"
}

export type Query = {
  __typename?: "Query";
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  account?: Maybe<Account>;
  accountEventLog?: Maybe<AccountEventLog>;
  accountEventLogs: Array<AccountEventLog>;
  accounts: Array<Account>;
  baseMetadataEntities: Array<BaseMetadataEntity>;
  baseMetadataEntity?: Maybe<BaseMetadataEntity>;
  buyer?: Maybe<Buyer>;
  buyers: Array<Buyer>;
  conditionEntities: Array<ConditionEntity>;
  conditionEntity?: Maybe<ConditionEntity>;
  dispute?: Maybe<Dispute>;
  disputeEventLog?: Maybe<DisputeEventLog>;
  disputeEventLogs: Array<DisputeEventLog>;
  disputeResolutionTermsEntities: Array<DisputeResolutionTermsEntity>;
  disputeResolutionTermsEntity?: Maybe<DisputeResolutionTermsEntity>;
  disputeResolver?: Maybe<DisputeResolver>;
  disputeResolverFee?: Maybe<DisputeResolverFee>;
  disputeResolverFees: Array<DisputeResolverFee>;
  disputeResolvers: Array<DisputeResolver>;
  disputes: Array<Dispute>;
  eventLog?: Maybe<EventLog>;
  eventLogs: Array<EventLog>;
  exchange?: Maybe<Exchange>;
  exchangeEventLog?: Maybe<ExchangeEventLog>;
  exchangeEventLogs: Array<ExchangeEventLog>;
  exchangeToken?: Maybe<ExchangeToken>;
  exchangeTokens: Array<ExchangeToken>;
  exchanges: Array<Exchange>;
  fundsEntities: Array<FundsEntity>;
  fundsEntity?: Maybe<FundsEntity>;
  fundsEventLog?: Maybe<FundsEventLog>;
  fundsEventLogs: Array<FundsEventLog>;
  metadataAttribute?: Maybe<MetadataAttribute>;
  metadataAttributes: Array<MetadataAttribute>;
  metadataInterface?: Maybe<MetadataInterface>;
  metadataInterfaces: Array<MetadataInterface>;
  offer?: Maybe<Offer>;
  offerEventLog?: Maybe<OfferEventLog>;
  offerEventLogs: Array<OfferEventLog>;
  offers: Array<Offer>;
  pendingDisputeResolver?: Maybe<PendingDisputeResolver>;
  pendingDisputeResolvers: Array<PendingDisputeResolver>;
  pendingSeller?: Maybe<PendingSeller>;
  pendingSellers: Array<PendingSeller>;
  productV1Brand?: Maybe<ProductV1Brand>;
  productV1Brands: Array<ProductV1Brand>;
  productV1Categories: Array<ProductV1Category>;
  productV1Category?: Maybe<ProductV1Category>;
  productV1ExchangePolicies: Array<ProductV1ExchangePolicy>;
  productV1ExchangePolicy?: Maybe<ProductV1ExchangePolicy>;
  productV1Media?: Maybe<ProductV1Media>;
  productV1Medias: Array<ProductV1Media>;
  productV1MetadataEntities: Array<ProductV1MetadataEntity>;
  productV1MetadataEntity?: Maybe<ProductV1MetadataEntity>;
  productV1Personalisation?: Maybe<ProductV1Personalisation>;
  productV1Personalisations: Array<ProductV1Personalisation>;
  productV1Product?: Maybe<ProductV1Product>;
  productV1ProductOverrides: Array<ProductV1ProductOverrides>;
  productV1Products: Array<ProductV1Product>;
  productV1Section?: Maybe<ProductV1Section>;
  productV1Sections: Array<ProductV1Section>;
  productV1Seller?: Maybe<ProductV1Seller>;
  productV1SellerContactLink?: Maybe<ProductV1SellerContactLink>;
  productV1SellerContactLinks: Array<ProductV1SellerContactLink>;
  productV1Sellers: Array<ProductV1Seller>;
  productV1ShippingJurisdiction?: Maybe<ProductV1ShippingJurisdiction>;
  productV1ShippingJurisdictions: Array<ProductV1ShippingJurisdiction>;
  productV1ShippingOption?: Maybe<ProductV1ShippingOption>;
  productV1ShippingOptions: Array<ProductV1ShippingOption>;
  productV1Tag?: Maybe<ProductV1Tag>;
  productV1Tags: Array<ProductV1Tag>;
  productV1Variant?: Maybe<ProductV1Variant>;
  productV1Variants: Array<ProductV1Variant>;
  productV1Variation?: Maybe<ProductV1Variation>;
  productV1Variations: Array<ProductV1Variation>;
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

export type QueryAccountEventLogArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAccountEventLogsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<AccountEventLog_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountEventLog_Filter>;
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

export type QueryConditionEntitiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ConditionEntity_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ConditionEntity_Filter>;
};

export type QueryConditionEntityArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDisputeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDisputeEventLogArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDisputeEventLogsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<DisputeEventLog_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DisputeEventLog_Filter>;
};

export type QueryDisputeResolutionTermsEntitiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<DisputeResolutionTermsEntity_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DisputeResolutionTermsEntity_Filter>;
};

export type QueryDisputeResolutionTermsEntityArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDisputeResolverArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDisputeResolverFeeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDisputeResolverFeesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<DisputeResolverFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DisputeResolverFee_Filter>;
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

export type QueryDisputesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Dispute_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Dispute_Filter>;
};

export type QueryEventLogArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryEventLogsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<EventLog_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<EventLog_Filter>;
};

export type QueryExchangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryExchangeEventLogArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryExchangeEventLogsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ExchangeEventLog_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ExchangeEventLog_Filter>;
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

export type QueryFundsEventLogArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryFundsEventLogsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<FundsEventLog_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FundsEventLog_Filter>;
};

export type QueryMetadataAttributeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryMetadataAttributesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<MetadataAttribute_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MetadataAttribute_Filter>;
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

export type QueryOfferEventLogArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryOfferEventLogsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<OfferEventLog_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OfferEventLog_Filter>;
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

export type QueryPendingDisputeResolverArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPendingDisputeResolversArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PendingDisputeResolver_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PendingDisputeResolver_Filter>;
};

export type QueryPendingSellerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPendingSellersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PendingSeller_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PendingSeller_Filter>;
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

export type QueryProductV1CategoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Category_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1Category_Filter>;
};

export type QueryProductV1CategoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProductV1ExchangePoliciesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1ExchangePolicy_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1ExchangePolicy_Filter>;
};

export type QueryProductV1ExchangePolicyArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProductV1MediaArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProductV1MediasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Media_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1Media_Filter>;
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

export type QueryProductV1PersonalisationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProductV1PersonalisationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Personalisation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1Personalisation_Filter>;
};

export type QueryProductV1ProductArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProductV1ProductOverridesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1ProductOverrides_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1ProductOverrides_Filter>;
};

export type QueryProductV1ProductsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Product_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1Product_Filter>;
};

export type QueryProductV1SectionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProductV1SectionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Section_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1Section_Filter>;
};

export type QueryProductV1SellerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProductV1SellerContactLinkArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProductV1SellerContactLinksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1SellerContactLink_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1SellerContactLink_Filter>;
};

export type QueryProductV1SellersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Seller_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1Seller_Filter>;
};

export type QueryProductV1ShippingJurisdictionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProductV1ShippingJurisdictionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1ShippingJurisdiction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1ShippingJurisdiction_Filter>;
};

export type QueryProductV1ShippingOptionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProductV1ShippingOptionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1ShippingOption_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1ShippingOption_Filter>;
};

export type QueryProductV1TagArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProductV1TagsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Tag_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1Tag_Filter>;
};

export type QueryProductV1VariantArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProductV1VariantsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Variant_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1Variant_Filter>;
};

export type QueryProductV1VariationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProductV1VariationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Variation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1Variation_Filter>;
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
  authTokenId: Scalars["BigInt"];
  authTokenType: Scalars["Int"];
  clerk: Scalars["Bytes"];
  contractURI: Scalars["String"];
  exchanges: Array<Exchange>;
  funds: Array<FundsEntity>;
  id: Scalars["ID"];
  logs: Array<EventLog>;
  offers: Array<Offer>;
  operator: Scalars["Bytes"];
  pendingSeller?: Maybe<PendingSeller>;
  /** Percentage as integer, to get decimals divide by 10000. E.g. 1 = 0.01%, 10000 = 100% */
  royaltyPercentage: Scalars["BigInt"];
  sellerId: Scalars["BigInt"];
  treasury: Scalars["Bytes"];
  voucherCloneAddress: Scalars["Bytes"];
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

export type SellerLogsArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<EventLog_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<EventLog_Filter>;
};

export type SellerOffersArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Offer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<Offer_Filter>;
};

export type Seller_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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
  authTokenId?: InputMaybe<Scalars["BigInt"]>;
  authTokenId_gt?: InputMaybe<Scalars["BigInt"]>;
  authTokenId_gte?: InputMaybe<Scalars["BigInt"]>;
  authTokenId_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  authTokenId_lt?: InputMaybe<Scalars["BigInt"]>;
  authTokenId_lte?: InputMaybe<Scalars["BigInt"]>;
  authTokenId_not?: InputMaybe<Scalars["BigInt"]>;
  authTokenId_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  authTokenType?: InputMaybe<Scalars["Int"]>;
  authTokenType_gt?: InputMaybe<Scalars["Int"]>;
  authTokenType_gte?: InputMaybe<Scalars["Int"]>;
  authTokenType_in?: InputMaybe<Array<Scalars["Int"]>>;
  authTokenType_lt?: InputMaybe<Scalars["Int"]>;
  authTokenType_lte?: InputMaybe<Scalars["Int"]>;
  authTokenType_not?: InputMaybe<Scalars["Int"]>;
  authTokenType_not_in?: InputMaybe<Array<Scalars["Int"]>>;
  clerk?: InputMaybe<Scalars["Bytes"]>;
  clerk_contains?: InputMaybe<Scalars["Bytes"]>;
  clerk_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  clerk_not?: InputMaybe<Scalars["Bytes"]>;
  clerk_not_contains?: InputMaybe<Scalars["Bytes"]>;
  clerk_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  contractURI?: InputMaybe<Scalars["String"]>;
  contractURI_contains?: InputMaybe<Scalars["String"]>;
  contractURI_contains_nocase?: InputMaybe<Scalars["String"]>;
  contractURI_ends_with?: InputMaybe<Scalars["String"]>;
  contractURI_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  contractURI_gt?: InputMaybe<Scalars["String"]>;
  contractURI_gte?: InputMaybe<Scalars["String"]>;
  contractURI_in?: InputMaybe<Array<Scalars["String"]>>;
  contractURI_lt?: InputMaybe<Scalars["String"]>;
  contractURI_lte?: InputMaybe<Scalars["String"]>;
  contractURI_not?: InputMaybe<Scalars["String"]>;
  contractURI_not_contains?: InputMaybe<Scalars["String"]>;
  contractURI_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  contractURI_not_ends_with?: InputMaybe<Scalars["String"]>;
  contractURI_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  contractURI_not_in?: InputMaybe<Array<Scalars["String"]>>;
  contractURI_not_starts_with?: InputMaybe<Scalars["String"]>;
  contractURI_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  contractURI_starts_with?: InputMaybe<Scalars["String"]>;
  contractURI_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  exchanges_?: InputMaybe<Exchange_Filter>;
  funds_?: InputMaybe<FundsEntity_Filter>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  offers_?: InputMaybe<Offer_Filter>;
  operator?: InputMaybe<Scalars["Bytes"]>;
  operator_contains?: InputMaybe<Scalars["Bytes"]>;
  operator_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  operator_not?: InputMaybe<Scalars["Bytes"]>;
  operator_not_contains?: InputMaybe<Scalars["Bytes"]>;
  operator_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  pendingSeller_?: InputMaybe<PendingSeller_Filter>;
  royaltyPercentage?: InputMaybe<Scalars["BigInt"]>;
  royaltyPercentage_gt?: InputMaybe<Scalars["BigInt"]>;
  royaltyPercentage_gte?: InputMaybe<Scalars["BigInt"]>;
  royaltyPercentage_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  royaltyPercentage_lt?: InputMaybe<Scalars["BigInt"]>;
  royaltyPercentage_lte?: InputMaybe<Scalars["BigInt"]>;
  royaltyPercentage_not?: InputMaybe<Scalars["BigInt"]>;
  royaltyPercentage_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
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
  voucherCloneAddress?: InputMaybe<Scalars["Bytes"]>;
  voucherCloneAddress_contains?: InputMaybe<Scalars["Bytes"]>;
  voucherCloneAddress_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  voucherCloneAddress_not?: InputMaybe<Scalars["Bytes"]>;
  voucherCloneAddress_not_contains?: InputMaybe<Scalars["Bytes"]>;
  voucherCloneAddress_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
};

export enum Seller_OrderBy {
  Active = "active",
  Admin = "admin",
  AuthTokenId = "authTokenId",
  AuthTokenType = "authTokenType",
  Clerk = "clerk",
  ContractUri = "contractURI",
  Exchanges = "exchanges",
  Funds = "funds",
  Id = "id",
  Logs = "logs",
  Offers = "offers",
  Operator = "operator",
  PendingSeller = "pendingSeller",
  RoyaltyPercentage = "royaltyPercentage",
  SellerId = "sellerId",
  Treasury = "treasury",
  VoucherCloneAddress = "voucherCloneAddress"
}

export type Subscription = {
  __typename?: "Subscription";
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  account?: Maybe<Account>;
  accountEventLog?: Maybe<AccountEventLog>;
  accountEventLogs: Array<AccountEventLog>;
  accounts: Array<Account>;
  baseMetadataEntities: Array<BaseMetadataEntity>;
  baseMetadataEntity?: Maybe<BaseMetadataEntity>;
  buyer?: Maybe<Buyer>;
  buyers: Array<Buyer>;
  conditionEntities: Array<ConditionEntity>;
  conditionEntity?: Maybe<ConditionEntity>;
  dispute?: Maybe<Dispute>;
  disputeEventLog?: Maybe<DisputeEventLog>;
  disputeEventLogs: Array<DisputeEventLog>;
  disputeResolutionTermsEntities: Array<DisputeResolutionTermsEntity>;
  disputeResolutionTermsEntity?: Maybe<DisputeResolutionTermsEntity>;
  disputeResolver?: Maybe<DisputeResolver>;
  disputeResolverFee?: Maybe<DisputeResolverFee>;
  disputeResolverFees: Array<DisputeResolverFee>;
  disputeResolvers: Array<DisputeResolver>;
  disputes: Array<Dispute>;
  eventLog?: Maybe<EventLog>;
  eventLogs: Array<EventLog>;
  exchange?: Maybe<Exchange>;
  exchangeEventLog?: Maybe<ExchangeEventLog>;
  exchangeEventLogs: Array<ExchangeEventLog>;
  exchangeToken?: Maybe<ExchangeToken>;
  exchangeTokens: Array<ExchangeToken>;
  exchanges: Array<Exchange>;
  fundsEntities: Array<FundsEntity>;
  fundsEntity?: Maybe<FundsEntity>;
  fundsEventLog?: Maybe<FundsEventLog>;
  fundsEventLogs: Array<FundsEventLog>;
  metadataAttribute?: Maybe<MetadataAttribute>;
  metadataAttributes: Array<MetadataAttribute>;
  metadataInterface?: Maybe<MetadataInterface>;
  metadataInterfaces: Array<MetadataInterface>;
  offer?: Maybe<Offer>;
  offerEventLog?: Maybe<OfferEventLog>;
  offerEventLogs: Array<OfferEventLog>;
  offers: Array<Offer>;
  pendingDisputeResolver?: Maybe<PendingDisputeResolver>;
  pendingDisputeResolvers: Array<PendingDisputeResolver>;
  pendingSeller?: Maybe<PendingSeller>;
  pendingSellers: Array<PendingSeller>;
  productV1Brand?: Maybe<ProductV1Brand>;
  productV1Brands: Array<ProductV1Brand>;
  productV1Categories: Array<ProductV1Category>;
  productV1Category?: Maybe<ProductV1Category>;
  productV1ExchangePolicies: Array<ProductV1ExchangePolicy>;
  productV1ExchangePolicy?: Maybe<ProductV1ExchangePolicy>;
  productV1Media?: Maybe<ProductV1Media>;
  productV1Medias: Array<ProductV1Media>;
  productV1MetadataEntities: Array<ProductV1MetadataEntity>;
  productV1MetadataEntity?: Maybe<ProductV1MetadataEntity>;
  productV1Personalisation?: Maybe<ProductV1Personalisation>;
  productV1Personalisations: Array<ProductV1Personalisation>;
  productV1Product?: Maybe<ProductV1Product>;
  productV1ProductOverrides: Array<ProductV1ProductOverrides>;
  productV1Products: Array<ProductV1Product>;
  productV1Section?: Maybe<ProductV1Section>;
  productV1Sections: Array<ProductV1Section>;
  productV1Seller?: Maybe<ProductV1Seller>;
  productV1SellerContactLink?: Maybe<ProductV1SellerContactLink>;
  productV1SellerContactLinks: Array<ProductV1SellerContactLink>;
  productV1Sellers: Array<ProductV1Seller>;
  productV1ShippingJurisdiction?: Maybe<ProductV1ShippingJurisdiction>;
  productV1ShippingJurisdictions: Array<ProductV1ShippingJurisdiction>;
  productV1ShippingOption?: Maybe<ProductV1ShippingOption>;
  productV1ShippingOptions: Array<ProductV1ShippingOption>;
  productV1Tag?: Maybe<ProductV1Tag>;
  productV1Tags: Array<ProductV1Tag>;
  productV1Variant?: Maybe<ProductV1Variant>;
  productV1Variants: Array<ProductV1Variant>;
  productV1Variation?: Maybe<ProductV1Variation>;
  productV1Variations: Array<ProductV1Variation>;
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

export type SubscriptionAccountEventLogArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionAccountEventLogsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<AccountEventLog_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountEventLog_Filter>;
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

export type SubscriptionConditionEntitiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ConditionEntity_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ConditionEntity_Filter>;
};

export type SubscriptionConditionEntityArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDisputeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDisputeEventLogArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDisputeEventLogsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<DisputeEventLog_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DisputeEventLog_Filter>;
};

export type SubscriptionDisputeResolutionTermsEntitiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<DisputeResolutionTermsEntity_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DisputeResolutionTermsEntity_Filter>;
};

export type SubscriptionDisputeResolutionTermsEntityArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDisputeResolverArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDisputeResolverFeeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDisputeResolverFeesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<DisputeResolverFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DisputeResolverFee_Filter>;
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

export type SubscriptionDisputesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Dispute_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Dispute_Filter>;
};

export type SubscriptionEventLogArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionEventLogsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<EventLog_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<EventLog_Filter>;
};

export type SubscriptionExchangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionExchangeEventLogArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionExchangeEventLogsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ExchangeEventLog_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ExchangeEventLog_Filter>;
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

export type SubscriptionFundsEventLogArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionFundsEventLogsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<FundsEventLog_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FundsEventLog_Filter>;
};

export type SubscriptionMetadataAttributeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionMetadataAttributesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<MetadataAttribute_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MetadataAttribute_Filter>;
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

export type SubscriptionOfferEventLogArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionOfferEventLogsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<OfferEventLog_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OfferEventLog_Filter>;
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

export type SubscriptionPendingDisputeResolverArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPendingDisputeResolversArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PendingDisputeResolver_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PendingDisputeResolver_Filter>;
};

export type SubscriptionPendingSellerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPendingSellersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<PendingSeller_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PendingSeller_Filter>;
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

export type SubscriptionProductV1CategoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Category_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1Category_Filter>;
};

export type SubscriptionProductV1CategoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProductV1ExchangePoliciesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1ExchangePolicy_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1ExchangePolicy_Filter>;
};

export type SubscriptionProductV1ExchangePolicyArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProductV1MediaArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProductV1MediasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Media_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1Media_Filter>;
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

export type SubscriptionProductV1PersonalisationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProductV1PersonalisationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Personalisation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1Personalisation_Filter>;
};

export type SubscriptionProductV1ProductArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProductV1ProductOverridesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1ProductOverrides_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1ProductOverrides_Filter>;
};

export type SubscriptionProductV1ProductsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Product_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1Product_Filter>;
};

export type SubscriptionProductV1SectionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProductV1SectionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Section_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1Section_Filter>;
};

export type SubscriptionProductV1SellerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProductV1SellerContactLinkArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProductV1SellerContactLinksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1SellerContactLink_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1SellerContactLink_Filter>;
};

export type SubscriptionProductV1SellersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Seller_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1Seller_Filter>;
};

export type SubscriptionProductV1ShippingJurisdictionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProductV1ShippingJurisdictionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1ShippingJurisdiction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1ShippingJurisdiction_Filter>;
};

export type SubscriptionProductV1ShippingOptionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProductV1ShippingOptionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1ShippingOption_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1ShippingOption_Filter>;
};

export type SubscriptionProductV1TagArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProductV1TagsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Tag_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1Tag_Filter>;
};

export type SubscriptionProductV1VariantArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProductV1VariantsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Variant_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1Variant_Filter>;
};

export type SubscriptionProductV1VariationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProductV1VariationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ProductV1Variation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProductV1Variation_Filter>;
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

export type GetSellerByIdQueryQueryVariables = Exact<{
  sellerId: Scalars["ID"];
  fundsSkip?: InputMaybe<Scalars["Int"]>;
  fundsFirst?: InputMaybe<Scalars["Int"]>;
  fundsOrderBy?: InputMaybe<FundsEntity_OrderBy>;
  fundsOrderDirection?: InputMaybe<OrderDirection>;
  fundsFilter?: InputMaybe<FundsEntity_Filter>;
  offersSkip?: InputMaybe<Scalars["Int"]>;
  offersFirst?: InputMaybe<Scalars["Int"]>;
  offersOrderBy?: InputMaybe<Offer_OrderBy>;
  offersOrderDirection?: InputMaybe<OrderDirection>;
  offersFilter?: InputMaybe<Offer_Filter>;
  exchangesSkip?: InputMaybe<Scalars["Int"]>;
  exchangesFirst?: InputMaybe<Scalars["Int"]>;
  exchangesOrderBy?: InputMaybe<Exchange_OrderBy>;
  exchangesOrderDirection?: InputMaybe<OrderDirection>;
  exchangesFilter?: InputMaybe<Exchange_Filter>;
  logsSkip?: InputMaybe<Scalars["Int"]>;
  logsFirst?: InputMaybe<Scalars["Int"]>;
  logsOrderBy?: InputMaybe<EventLog_OrderBy>;
  logsOrderDirection?: InputMaybe<OrderDirection>;
  logsFilter?: InputMaybe<EventLog_Filter>;
  includeExchanges?: InputMaybe<Scalars["Boolean"]>;
  includeOffers?: InputMaybe<Scalars["Boolean"]>;
  includeFunds?: InputMaybe<Scalars["Boolean"]>;
  includeLogs?: InputMaybe<Scalars["Boolean"]>;
}>;

export type GetSellerByIdQueryQuery = {
  __typename?: "Query";
  seller?: {
    __typename?: "Seller";
    id: string;
    operator: string;
    admin: string;
    clerk: string;
    treasury: string;
    authTokenId: string;
    authTokenType: number;
    voucherCloneAddress: string;
    active: boolean;
    contractURI: string;
    royaltyPercentage: string;
    pendingSeller?: {
      __typename?: "PendingSeller";
      operator?: string | null;
      admin?: string | null;
      clerk?: string | null;
      authTokenId?: string | null;
      authTokenType?: number | null;
    } | null;
    funds?: Array<{
      __typename?: "FundsEntity";
      id: string;
      availableAmount: string;
      accountId: string;
      token: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
    }>;
    offers?: Array<{
      __typename?: "Offer";
      id: string;
      createdAt: string;
      price: string;
      sellerDeposit: string;
      protocolFee: string;
      agentFee: string;
      agentId: string;
      buyerCancelPenalty: string;
      quantityAvailable: string;
      quantityInitial: string;
      validFromDate: string;
      validUntilDate: string;
      voucherRedeemableFromDate: string;
      voucherRedeemableUntilDate: string;
      disputePeriodDuration: string;
      voucherValidDuration: string;
      resolutionPeriodDuration: string;
      metadataUri: string;
      metadataHash: string;
      voided: boolean;
      voidedAt?: string | null;
      disputeResolverId: string;
      numberOfCommits: string;
      numberOfRedemptions: string;
      condition?: {
        __typename?: "ConditionEntity";
        id: string;
        method: number;
        tokenType: number;
        tokenAddress: string;
        tokenId: string;
        threshold: string;
        maxCommits: string;
      } | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
      exchangeToken: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
      disputeResolver: {
        __typename?: "DisputeResolver";
        id: string;
        escalationResponsePeriod: string;
        admin: string;
        clerk: string;
        treasury: string;
        operator: string;
        metadataUri: string;
        active: boolean;
        sellerAllowList: Array<string>;
        fees: Array<{
          __typename?: "DisputeResolverFee";
          id: string;
          tokenAddress: string;
          tokenName: string;
          feeAmount: string;
          token: {
            __typename?: "ExchangeToken";
            id: string;
            address: string;
            decimals: string;
            symbol: string;
            name: string;
          };
        }>;
      };
      disputeResolutionTerms: {
        __typename?: "DisputeResolutionTermsEntity";
        id: string;
        disputeResolverId: string;
        escalationResponsePeriod: string;
        feeAmount: string;
        buyerEscalationDeposit: string;
      };
      metadata?:
        | {
            __typename?: "BaseMetadataEntity";
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
          }
        | {
            __typename?: "ProductV1MetadataEntity";
            createdAt: string;
            voided: boolean;
            validFromDate: string;
            validUntilDate: string;
            quantityAvailable: string;
            uuid: string;
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
            attributes?: Array<{
              __typename?: "MetadataAttribute";
              traitType: string;
              value: string;
              displayType: string;
            }> | null;
            product: {
              __typename?: "ProductV1Product";
              id: string;
              uuid: string;
              version: number;
              title: string;
              description: string;
              identification_sKU?: string | null;
              identification_productId?: string | null;
              identification_productIdType?: string | null;
              productionInformation_brandName: string;
              productionInformation_manufacturer?: string | null;
              productionInformation_manufacturerPartNumber?: string | null;
              productionInformation_modelNumber?: string | null;
              productionInformation_materials?: Array<string> | null;
              details_category?: string | null;
              details_subCategory?: string | null;
              details_subCategory2?: string | null;
              details_offerCategory: string;
              offerCategory: ProductV1OfferCategory;
              details_tags?: Array<string> | null;
              details_sections?: Array<string> | null;
              details_personalisation?: Array<string> | null;
              packaging_packageQuantity?: string | null;
              packaging_dimensions_length?: string | null;
              packaging_dimensions_width?: string | null;
              packaging_dimensions_height?: string | null;
              packaging_dimensions_unit?: string | null;
              packaging_weight_value?: string | null;
              packaging_weight_unit?: string | null;
              brand: {
                __typename?: "ProductV1Brand";
                id: string;
                name: string;
              };
              category?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory2?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              tags?: Array<{
                __typename?: "ProductV1Tag";
                id: string;
                name: string;
              }> | null;
              sections?: Array<{
                __typename?: "ProductV1Section";
                id: string;
                name: string;
              }> | null;
              personalisation?: Array<{
                __typename?: "ProductV1Personalisation";
                id: string;
                name: string;
              }> | null;
              visuals_images: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }>;
              visuals_videos?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              productV1Seller?: {
                __typename?: "ProductV1Seller";
                id: string;
                defaultVersion: number;
                name?: string | null;
                description?: string | null;
                externalUrl?: string | null;
                tokenId?: string | null;
                sellerId?: string | null;
                images?: Array<{
                  __typename?: "ProductV1Media";
                  id: string;
                  url: string;
                  tag?: string | null;
                  type: ProductV1MediaType;
                }> | null;
                contactLinks?: Array<{
                  __typename?: "ProductV1SellerContactLink";
                  id: string;
                  url: string;
                  tag: string;
                }> | null;
                seller: {
                  __typename?: "Seller";
                  id: string;
                  operator: string;
                  admin: string;
                  clerk: string;
                  treasury: string;
                  authTokenId: string;
                  authTokenType: number;
                  voucherCloneAddress: string;
                  active: boolean;
                  contractURI: string;
                  royaltyPercentage: string;
                };
              } | null;
            };
            variations?: Array<{
              __typename?: "ProductV1Variation";
              id: string;
              type: string;
              option: string;
            }> | null;
            productV1Seller: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            };
            exchangePolicy: {
              __typename?: "ProductV1ExchangePolicy";
              id: string;
              uuid: string;
              version: number;
              label?: string | null;
              template: string;
              sellerContactMethod: string;
              disputeResolverContactMethod: string;
            };
            shipping?: {
              __typename?: "ProductV1ShippingOption";
              id: string;
              defaultVersion?: number | null;
              countryOfOrigin?: string | null;
              redemptionPoint?: string | null;
              returnPeriodInDays: number;
              supportedJurisdictions?: Array<{
                __typename?: "ProductV1ShippingJurisdiction";
                id: string;
                label: string;
                deliveryTime: string;
              }> | null;
            } | null;
          }
        | null;
    }>;
    exchanges?: Array<{
      __typename?: "Exchange";
      id: string;
      disputed: boolean;
      state: ExchangeState;
      committedDate: string;
      finalizedDate?: string | null;
      validUntilDate: string;
      redeemedDate?: string | null;
      revokedDate?: string | null;
      cancelledDate?: string | null;
      completedDate?: string | null;
      disputedDate?: string | null;
      expired: boolean;
      dispute?: {
        __typename?: "Dispute";
        id: string;
        exchangeId: string;
        state: DisputeState;
        buyerPercent: string;
        disputedDate: string;
        escalatedDate?: string | null;
        finalizedDate?: string | null;
        retractedDate?: string | null;
        resolvedDate?: string | null;
        decidedDate?: string | null;
        refusedDate?: string | null;
        timeout: string;
      } | null;
      buyer: {
        __typename?: "Buyer";
        id: string;
        wallet: string;
        active: boolean;
      };
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
    }>;
    logs?: Array<
      | {
          __typename?: "AccountEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "DisputeEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          dispute: { __typename?: "Dispute"; id: string };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "ExchangeEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          exchange: {
            __typename?: "Exchange";
            id: string;
            offer: { __typename?: "Offer"; id: string };
          };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "FundsEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          funds: { __typename?: "FundsEntity"; id: string };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "OfferEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          offer: { __typename?: "Offer"; id: string };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
    >;
  } | null;
};

export type GetSellersQueryQueryVariables = Exact<{
  sellersSkip?: InputMaybe<Scalars["Int"]>;
  sellersFirst?: InputMaybe<Scalars["Int"]>;
  sellersOrderBy?: InputMaybe<Seller_OrderBy>;
  sellersOrderDirection?: InputMaybe<OrderDirection>;
  sellersFilter?: InputMaybe<Seller_Filter>;
  fundsSkip?: InputMaybe<Scalars["Int"]>;
  fundsFirst?: InputMaybe<Scalars["Int"]>;
  fundsOrderBy?: InputMaybe<FundsEntity_OrderBy>;
  fundsOrderDirection?: InputMaybe<OrderDirection>;
  fundsFilter?: InputMaybe<FundsEntity_Filter>;
  offersSkip?: InputMaybe<Scalars["Int"]>;
  offersFirst?: InputMaybe<Scalars["Int"]>;
  offersOrderBy?: InputMaybe<Offer_OrderBy>;
  offersOrderDirection?: InputMaybe<OrderDirection>;
  offersFilter?: InputMaybe<Offer_Filter>;
  exchangesSkip?: InputMaybe<Scalars["Int"]>;
  exchangesFirst?: InputMaybe<Scalars["Int"]>;
  exchangesOrderBy?: InputMaybe<Exchange_OrderBy>;
  exchangesOrderDirection?: InputMaybe<OrderDirection>;
  exchangesFilter?: InputMaybe<Exchange_Filter>;
  logsSkip?: InputMaybe<Scalars["Int"]>;
  logsFirst?: InputMaybe<Scalars["Int"]>;
  logsOrderBy?: InputMaybe<EventLog_OrderBy>;
  logsOrderDirection?: InputMaybe<OrderDirection>;
  logsFilter?: InputMaybe<EventLog_Filter>;
  includeExchanges?: InputMaybe<Scalars["Boolean"]>;
  includeOffers?: InputMaybe<Scalars["Boolean"]>;
  includeFunds?: InputMaybe<Scalars["Boolean"]>;
  includeLogs?: InputMaybe<Scalars["Boolean"]>;
}>;

export type GetSellersQueryQuery = {
  __typename?: "Query";
  sellers: Array<{
    __typename?: "Seller";
    id: string;
    operator: string;
    admin: string;
    clerk: string;
    treasury: string;
    authTokenId: string;
    authTokenType: number;
    voucherCloneAddress: string;
    active: boolean;
    contractURI: string;
    royaltyPercentage: string;
    pendingSeller?: {
      __typename?: "PendingSeller";
      operator?: string | null;
      admin?: string | null;
      clerk?: string | null;
      authTokenId?: string | null;
      authTokenType?: number | null;
    } | null;
    funds?: Array<{
      __typename?: "FundsEntity";
      id: string;
      availableAmount: string;
      accountId: string;
      token: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
    }>;
    offers?: Array<{
      __typename?: "Offer";
      id: string;
      createdAt: string;
      price: string;
      sellerDeposit: string;
      protocolFee: string;
      agentFee: string;
      agentId: string;
      buyerCancelPenalty: string;
      quantityAvailable: string;
      quantityInitial: string;
      validFromDate: string;
      validUntilDate: string;
      voucherRedeemableFromDate: string;
      voucherRedeemableUntilDate: string;
      disputePeriodDuration: string;
      voucherValidDuration: string;
      resolutionPeriodDuration: string;
      metadataUri: string;
      metadataHash: string;
      voided: boolean;
      voidedAt?: string | null;
      disputeResolverId: string;
      numberOfCommits: string;
      numberOfRedemptions: string;
      condition?: {
        __typename?: "ConditionEntity";
        id: string;
        method: number;
        tokenType: number;
        tokenAddress: string;
        tokenId: string;
        threshold: string;
        maxCommits: string;
      } | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
      exchangeToken: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
      disputeResolver: {
        __typename?: "DisputeResolver";
        id: string;
        escalationResponsePeriod: string;
        admin: string;
        clerk: string;
        treasury: string;
        operator: string;
        metadataUri: string;
        active: boolean;
        sellerAllowList: Array<string>;
        fees: Array<{
          __typename?: "DisputeResolverFee";
          id: string;
          tokenAddress: string;
          tokenName: string;
          feeAmount: string;
          token: {
            __typename?: "ExchangeToken";
            id: string;
            address: string;
            decimals: string;
            symbol: string;
            name: string;
          };
        }>;
      };
      disputeResolutionTerms: {
        __typename?: "DisputeResolutionTermsEntity";
        id: string;
        disputeResolverId: string;
        escalationResponsePeriod: string;
        feeAmount: string;
        buyerEscalationDeposit: string;
      };
      metadata?:
        | {
            __typename?: "BaseMetadataEntity";
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
          }
        | {
            __typename?: "ProductV1MetadataEntity";
            createdAt: string;
            voided: boolean;
            validFromDate: string;
            validUntilDate: string;
            quantityAvailable: string;
            uuid: string;
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
            attributes?: Array<{
              __typename?: "MetadataAttribute";
              traitType: string;
              value: string;
              displayType: string;
            }> | null;
            product: {
              __typename?: "ProductV1Product";
              id: string;
              uuid: string;
              version: number;
              title: string;
              description: string;
              identification_sKU?: string | null;
              identification_productId?: string | null;
              identification_productIdType?: string | null;
              productionInformation_brandName: string;
              productionInformation_manufacturer?: string | null;
              productionInformation_manufacturerPartNumber?: string | null;
              productionInformation_modelNumber?: string | null;
              productionInformation_materials?: Array<string> | null;
              details_category?: string | null;
              details_subCategory?: string | null;
              details_subCategory2?: string | null;
              details_offerCategory: string;
              offerCategory: ProductV1OfferCategory;
              details_tags?: Array<string> | null;
              details_sections?: Array<string> | null;
              details_personalisation?: Array<string> | null;
              packaging_packageQuantity?: string | null;
              packaging_dimensions_length?: string | null;
              packaging_dimensions_width?: string | null;
              packaging_dimensions_height?: string | null;
              packaging_dimensions_unit?: string | null;
              packaging_weight_value?: string | null;
              packaging_weight_unit?: string | null;
              brand: {
                __typename?: "ProductV1Brand";
                id: string;
                name: string;
              };
              category?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory2?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              tags?: Array<{
                __typename?: "ProductV1Tag";
                id: string;
                name: string;
              }> | null;
              sections?: Array<{
                __typename?: "ProductV1Section";
                id: string;
                name: string;
              }> | null;
              personalisation?: Array<{
                __typename?: "ProductV1Personalisation";
                id: string;
                name: string;
              }> | null;
              visuals_images: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }>;
              visuals_videos?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              productV1Seller?: {
                __typename?: "ProductV1Seller";
                id: string;
                defaultVersion: number;
                name?: string | null;
                description?: string | null;
                externalUrl?: string | null;
                tokenId?: string | null;
                sellerId?: string | null;
                images?: Array<{
                  __typename?: "ProductV1Media";
                  id: string;
                  url: string;
                  tag?: string | null;
                  type: ProductV1MediaType;
                }> | null;
                contactLinks?: Array<{
                  __typename?: "ProductV1SellerContactLink";
                  id: string;
                  url: string;
                  tag: string;
                }> | null;
                seller: {
                  __typename?: "Seller";
                  id: string;
                  operator: string;
                  admin: string;
                  clerk: string;
                  treasury: string;
                  authTokenId: string;
                  authTokenType: number;
                  voucherCloneAddress: string;
                  active: boolean;
                  contractURI: string;
                  royaltyPercentage: string;
                };
              } | null;
            };
            variations?: Array<{
              __typename?: "ProductV1Variation";
              id: string;
              type: string;
              option: string;
            }> | null;
            productV1Seller: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            };
            exchangePolicy: {
              __typename?: "ProductV1ExchangePolicy";
              id: string;
              uuid: string;
              version: number;
              label?: string | null;
              template: string;
              sellerContactMethod: string;
              disputeResolverContactMethod: string;
            };
            shipping?: {
              __typename?: "ProductV1ShippingOption";
              id: string;
              defaultVersion?: number | null;
              countryOfOrigin?: string | null;
              redemptionPoint?: string | null;
              returnPeriodInDays: number;
              supportedJurisdictions?: Array<{
                __typename?: "ProductV1ShippingJurisdiction";
                id: string;
                label: string;
                deliveryTime: string;
              }> | null;
            } | null;
          }
        | null;
    }>;
    exchanges?: Array<{
      __typename?: "Exchange";
      id: string;
      disputed: boolean;
      state: ExchangeState;
      committedDate: string;
      finalizedDate?: string | null;
      validUntilDate: string;
      redeemedDate?: string | null;
      revokedDate?: string | null;
      cancelledDate?: string | null;
      completedDate?: string | null;
      disputedDate?: string | null;
      expired: boolean;
      dispute?: {
        __typename?: "Dispute";
        id: string;
        exchangeId: string;
        state: DisputeState;
        buyerPercent: string;
        disputedDate: string;
        escalatedDate?: string | null;
        finalizedDate?: string | null;
        retractedDate?: string | null;
        resolvedDate?: string | null;
        decidedDate?: string | null;
        refusedDate?: string | null;
        timeout: string;
      } | null;
      buyer: {
        __typename?: "Buyer";
        id: string;
        wallet: string;
        active: boolean;
      };
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
    }>;
    logs?: Array<
      | {
          __typename?: "AccountEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "DisputeEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          dispute: { __typename?: "Dispute"; id: string };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "ExchangeEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          exchange: {
            __typename?: "Exchange";
            id: string;
            offer: { __typename?: "Offer"; id: string };
          };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "FundsEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          funds: { __typename?: "FundsEntity"; id: string };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "OfferEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          offer: { __typename?: "Offer"; id: string };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
    >;
  }>;
};

export type GetBuyerByIdQueryQueryVariables = Exact<{
  buyerId: Scalars["ID"];
  fundsSkip?: InputMaybe<Scalars["Int"]>;
  fundsFirst?: InputMaybe<Scalars["Int"]>;
  fundsOrderBy?: InputMaybe<FundsEntity_OrderBy>;
  fundsOrderDirection?: InputMaybe<OrderDirection>;
  fundsFilter?: InputMaybe<FundsEntity_Filter>;
  exchangesSkip?: InputMaybe<Scalars["Int"]>;
  exchangesFirst?: InputMaybe<Scalars["Int"]>;
  exchangesOrderBy?: InputMaybe<Exchange_OrderBy>;
  exchangesOrderDirection?: InputMaybe<OrderDirection>;
  exchangesFilter?: InputMaybe<Exchange_Filter>;
  logsSkip?: InputMaybe<Scalars["Int"]>;
  logsFirst?: InputMaybe<Scalars["Int"]>;
  logsOrderBy?: InputMaybe<EventLog_OrderBy>;
  logsOrderDirection?: InputMaybe<OrderDirection>;
  logsFilter?: InputMaybe<EventLog_Filter>;
  includeExchanges?: InputMaybe<Scalars["Boolean"]>;
  includeFunds?: InputMaybe<Scalars["Boolean"]>;
  includeLogs?: InputMaybe<Scalars["Boolean"]>;
}>;

export type GetBuyerByIdQueryQuery = {
  __typename?: "Query";
  buyer?: {
    __typename?: "Buyer";
    id: string;
    wallet: string;
    active: boolean;
    funds?: Array<{
      __typename?: "FundsEntity";
      id: string;
      availableAmount: string;
      accountId: string;
      token: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
    }>;
    exchanges?: Array<{
      __typename?: "Exchange";
      id: string;
      disputed: boolean;
      state: ExchangeState;
      committedDate: string;
      finalizedDate?: string | null;
      validUntilDate: string;
      redeemedDate?: string | null;
      revokedDate?: string | null;
      cancelledDate?: string | null;
      completedDate?: string | null;
      disputedDate?: string | null;
      expired: boolean;
      dispute?: {
        __typename?: "Dispute";
        id: string;
        exchangeId: string;
        state: DisputeState;
        buyerPercent: string;
        disputedDate: string;
        escalatedDate?: string | null;
        finalizedDate?: string | null;
        retractedDate?: string | null;
        resolvedDate?: string | null;
        decidedDate?: string | null;
        refusedDate?: string | null;
        timeout: string;
      } | null;
      buyer: {
        __typename?: "Buyer";
        id: string;
        wallet: string;
        active: boolean;
      };
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
    }>;
    logs?: Array<
      | {
          __typename?: "AccountEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "DisputeEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          dispute: { __typename?: "Dispute"; id: string };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "ExchangeEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          exchange: {
            __typename?: "Exchange";
            id: string;
            offer: { __typename?: "Offer"; id: string };
          };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "FundsEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          funds: { __typename?: "FundsEntity"; id: string };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "OfferEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          offer: { __typename?: "Offer"; id: string };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
    >;
  } | null;
};

export type GetBuyersQueryQueryVariables = Exact<{
  buyersSkip?: InputMaybe<Scalars["Int"]>;
  buyersFirst?: InputMaybe<Scalars["Int"]>;
  buyersOrderBy?: InputMaybe<Buyer_OrderBy>;
  buyersOrderDirection?: InputMaybe<OrderDirection>;
  buyersFilter?: InputMaybe<Buyer_Filter>;
  fundsSkip?: InputMaybe<Scalars["Int"]>;
  fundsFirst?: InputMaybe<Scalars["Int"]>;
  fundsOrderBy?: InputMaybe<FundsEntity_OrderBy>;
  fundsOrderDirection?: InputMaybe<OrderDirection>;
  fundsFilter?: InputMaybe<FundsEntity_Filter>;
  offersSkip?: InputMaybe<Scalars["Int"]>;
  offersFirst?: InputMaybe<Scalars["Int"]>;
  offersOrderBy?: InputMaybe<Offer_OrderBy>;
  offersOrderDirection?: InputMaybe<OrderDirection>;
  offersFilter?: InputMaybe<Offer_Filter>;
  exchangesSkip?: InputMaybe<Scalars["Int"]>;
  exchangesFirst?: InputMaybe<Scalars["Int"]>;
  exchangesOrderBy?: InputMaybe<Exchange_OrderBy>;
  exchangesOrderDirection?: InputMaybe<OrderDirection>;
  exchangesFilter?: InputMaybe<Exchange_Filter>;
  logsSkip?: InputMaybe<Scalars["Int"]>;
  logsFirst?: InputMaybe<Scalars["Int"]>;
  logsOrderBy?: InputMaybe<EventLog_OrderBy>;
  logsOrderDirection?: InputMaybe<OrderDirection>;
  logsFilter?: InputMaybe<EventLog_Filter>;
  includeExchanges?: InputMaybe<Scalars["Boolean"]>;
  includeOffers?: InputMaybe<Scalars["Boolean"]>;
  includeFunds?: InputMaybe<Scalars["Boolean"]>;
  includeLogs?: InputMaybe<Scalars["Boolean"]>;
}>;

export type GetBuyersQueryQuery = {
  __typename?: "Query";
  buyers: Array<{
    __typename?: "Buyer";
    id: string;
    wallet: string;
    active: boolean;
    funds?: Array<{
      __typename?: "FundsEntity";
      id: string;
      availableAmount: string;
      accountId: string;
      token: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
    }>;
    exchanges?: Array<{
      __typename?: "Exchange";
      id: string;
      disputed: boolean;
      state: ExchangeState;
      committedDate: string;
      finalizedDate?: string | null;
      validUntilDate: string;
      redeemedDate?: string | null;
      revokedDate?: string | null;
      cancelledDate?: string | null;
      completedDate?: string | null;
      disputedDate?: string | null;
      expired: boolean;
      dispute?: {
        __typename?: "Dispute";
        id: string;
        exchangeId: string;
        state: DisputeState;
        buyerPercent: string;
        disputedDate: string;
        escalatedDate?: string | null;
        finalizedDate?: string | null;
        retractedDate?: string | null;
        resolvedDate?: string | null;
        decidedDate?: string | null;
        refusedDate?: string | null;
        timeout: string;
      } | null;
      buyer: {
        __typename?: "Buyer";
        id: string;
        wallet: string;
        active: boolean;
      };
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
    }>;
    logs?: Array<
      | {
          __typename?: "AccountEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "DisputeEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          dispute: { __typename?: "Dispute"; id: string };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "ExchangeEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          exchange: {
            __typename?: "Exchange";
            id: string;
            offer: { __typename?: "Offer"; id: string };
          };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "FundsEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          funds: { __typename?: "FundsEntity"; id: string };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "OfferEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          offer: { __typename?: "Offer"; id: string };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
    >;
  }>;
};

export type GetDisputeResolverByIdQueryQueryVariables = Exact<{
  disputeResolverId: Scalars["ID"];
  offersSkip?: InputMaybe<Scalars["Int"]>;
  offersFirst?: InputMaybe<Scalars["Int"]>;
  offersOrderBy?: InputMaybe<Offer_OrderBy>;
  offersOrderDirection?: InputMaybe<OrderDirection>;
  offersFilter?: InputMaybe<Offer_Filter>;
  logsSkip?: InputMaybe<Scalars["Int"]>;
  logsFirst?: InputMaybe<Scalars["Int"]>;
  logsOrderBy?: InputMaybe<EventLog_OrderBy>;
  logsOrderDirection?: InputMaybe<OrderDirection>;
  logsFilter?: InputMaybe<EventLog_Filter>;
  includeOffers?: InputMaybe<Scalars["Boolean"]>;
  includeLogs?: InputMaybe<Scalars["Boolean"]>;
}>;

export type GetDisputeResolverByIdQueryQuery = {
  __typename?: "Query";
  disputeResolver?: {
    __typename?: "DisputeResolver";
    id: string;
    escalationResponsePeriod: string;
    admin: string;
    clerk: string;
    treasury: string;
    operator: string;
    metadataUri: string;
    active: boolean;
    sellerAllowList: Array<string>;
    pendingDisputeResolver?: {
      __typename?: "PendingDisputeResolver";
      operator?: string | null;
      admin?: string | null;
      clerk?: string | null;
    } | null;
    offers?: Array<{
      __typename?: "Offer";
      id: string;
      createdAt: string;
      price: string;
      sellerDeposit: string;
      protocolFee: string;
      agentFee: string;
      agentId: string;
      buyerCancelPenalty: string;
      quantityAvailable: string;
      quantityInitial: string;
      validFromDate: string;
      validUntilDate: string;
      voucherRedeemableFromDate: string;
      voucherRedeemableUntilDate: string;
      disputePeriodDuration: string;
      voucherValidDuration: string;
      resolutionPeriodDuration: string;
      metadataUri: string;
      metadataHash: string;
      voided: boolean;
      voidedAt?: string | null;
      disputeResolverId: string;
      numberOfCommits: string;
      numberOfRedemptions: string;
      condition?: {
        __typename?: "ConditionEntity";
        id: string;
        method: number;
        tokenType: number;
        tokenAddress: string;
        tokenId: string;
        threshold: string;
        maxCommits: string;
      } | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
      exchangeToken: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
      disputeResolver: {
        __typename?: "DisputeResolver";
        id: string;
        escalationResponsePeriod: string;
        admin: string;
        clerk: string;
        treasury: string;
        operator: string;
        metadataUri: string;
        active: boolean;
        sellerAllowList: Array<string>;
        fees: Array<{
          __typename?: "DisputeResolverFee";
          id: string;
          tokenAddress: string;
          tokenName: string;
          feeAmount: string;
          token: {
            __typename?: "ExchangeToken";
            id: string;
            address: string;
            decimals: string;
            symbol: string;
            name: string;
          };
        }>;
      };
      disputeResolutionTerms: {
        __typename?: "DisputeResolutionTermsEntity";
        id: string;
        disputeResolverId: string;
        escalationResponsePeriod: string;
        feeAmount: string;
        buyerEscalationDeposit: string;
      };
      metadata?:
        | {
            __typename?: "BaseMetadataEntity";
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
          }
        | {
            __typename?: "ProductV1MetadataEntity";
            createdAt: string;
            voided: boolean;
            validFromDate: string;
            validUntilDate: string;
            quantityAvailable: string;
            uuid: string;
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
            attributes?: Array<{
              __typename?: "MetadataAttribute";
              traitType: string;
              value: string;
              displayType: string;
            }> | null;
            product: {
              __typename?: "ProductV1Product";
              id: string;
              uuid: string;
              version: number;
              title: string;
              description: string;
              identification_sKU?: string | null;
              identification_productId?: string | null;
              identification_productIdType?: string | null;
              productionInformation_brandName: string;
              productionInformation_manufacturer?: string | null;
              productionInformation_manufacturerPartNumber?: string | null;
              productionInformation_modelNumber?: string | null;
              productionInformation_materials?: Array<string> | null;
              details_category?: string | null;
              details_subCategory?: string | null;
              details_subCategory2?: string | null;
              details_offerCategory: string;
              offerCategory: ProductV1OfferCategory;
              details_tags?: Array<string> | null;
              details_sections?: Array<string> | null;
              details_personalisation?: Array<string> | null;
              packaging_packageQuantity?: string | null;
              packaging_dimensions_length?: string | null;
              packaging_dimensions_width?: string | null;
              packaging_dimensions_height?: string | null;
              packaging_dimensions_unit?: string | null;
              packaging_weight_value?: string | null;
              packaging_weight_unit?: string | null;
              brand: {
                __typename?: "ProductV1Brand";
                id: string;
                name: string;
              };
              category?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory2?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              tags?: Array<{
                __typename?: "ProductV1Tag";
                id: string;
                name: string;
              }> | null;
              sections?: Array<{
                __typename?: "ProductV1Section";
                id: string;
                name: string;
              }> | null;
              personalisation?: Array<{
                __typename?: "ProductV1Personalisation";
                id: string;
                name: string;
              }> | null;
              visuals_images: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }>;
              visuals_videos?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              productV1Seller?: {
                __typename?: "ProductV1Seller";
                id: string;
                defaultVersion: number;
                name?: string | null;
                description?: string | null;
                externalUrl?: string | null;
                tokenId?: string | null;
                sellerId?: string | null;
                images?: Array<{
                  __typename?: "ProductV1Media";
                  id: string;
                  url: string;
                  tag?: string | null;
                  type: ProductV1MediaType;
                }> | null;
                contactLinks?: Array<{
                  __typename?: "ProductV1SellerContactLink";
                  id: string;
                  url: string;
                  tag: string;
                }> | null;
                seller: {
                  __typename?: "Seller";
                  id: string;
                  operator: string;
                  admin: string;
                  clerk: string;
                  treasury: string;
                  authTokenId: string;
                  authTokenType: number;
                  voucherCloneAddress: string;
                  active: boolean;
                  contractURI: string;
                  royaltyPercentage: string;
                };
              } | null;
            };
            variations?: Array<{
              __typename?: "ProductV1Variation";
              id: string;
              type: string;
              option: string;
            }> | null;
            productV1Seller: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            };
            exchangePolicy: {
              __typename?: "ProductV1ExchangePolicy";
              id: string;
              uuid: string;
              version: number;
              label?: string | null;
              template: string;
              sellerContactMethod: string;
              disputeResolverContactMethod: string;
            };
            shipping?: {
              __typename?: "ProductV1ShippingOption";
              id: string;
              defaultVersion?: number | null;
              countryOfOrigin?: string | null;
              redemptionPoint?: string | null;
              returnPeriodInDays: number;
              supportedJurisdictions?: Array<{
                __typename?: "ProductV1ShippingJurisdiction";
                id: string;
                label: string;
                deliveryTime: string;
              }> | null;
            } | null;
          }
        | null;
    }>;
    logs?: Array<
      | {
          __typename?: "AccountEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "DisputeEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          dispute: { __typename?: "Dispute"; id: string };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "ExchangeEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          exchange: {
            __typename?: "Exchange";
            id: string;
            offer: { __typename?: "Offer"; id: string };
          };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "FundsEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          funds: { __typename?: "FundsEntity"; id: string };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "OfferEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          offer: { __typename?: "Offer"; id: string };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
    >;
    fees: Array<{
      __typename?: "DisputeResolverFee";
      id: string;
      tokenAddress: string;
      tokenName: string;
      feeAmount: string;
      token: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
    }>;
  } | null;
};

export type GetDisputeResolversQueryQueryVariables = Exact<{
  disputeResolversSkip?: InputMaybe<Scalars["Int"]>;
  disputeResolversFirst?: InputMaybe<Scalars["Int"]>;
  disputeResolversOrderBy?: InputMaybe<DisputeResolver_OrderBy>;
  disputeResolversOrderDirection?: InputMaybe<OrderDirection>;
  disputeResolversFilter?: InputMaybe<DisputeResolver_Filter>;
  offersSkip?: InputMaybe<Scalars["Int"]>;
  offersFirst?: InputMaybe<Scalars["Int"]>;
  offersOrderBy?: InputMaybe<Offer_OrderBy>;
  offersOrderDirection?: InputMaybe<OrderDirection>;
  offersFilter?: InputMaybe<Offer_Filter>;
  logsSkip?: InputMaybe<Scalars["Int"]>;
  logsFirst?: InputMaybe<Scalars["Int"]>;
  logsOrderBy?: InputMaybe<EventLog_OrderBy>;
  logsOrderDirection?: InputMaybe<OrderDirection>;
  logsFilter?: InputMaybe<EventLog_Filter>;
  includeOffers?: InputMaybe<Scalars["Boolean"]>;
  includeLogs?: InputMaybe<Scalars["Boolean"]>;
}>;

export type GetDisputeResolversQueryQuery = {
  __typename?: "Query";
  disputeResolvers: Array<{
    __typename?: "DisputeResolver";
    id: string;
    escalationResponsePeriod: string;
    admin: string;
    clerk: string;
    treasury: string;
    operator: string;
    metadataUri: string;
    active: boolean;
    sellerAllowList: Array<string>;
    pendingDisputeResolver?: {
      __typename?: "PendingDisputeResolver";
      operator?: string | null;
      admin?: string | null;
      clerk?: string | null;
    } | null;
    offers?: Array<{
      __typename?: "Offer";
      id: string;
      createdAt: string;
      price: string;
      sellerDeposit: string;
      protocolFee: string;
      agentFee: string;
      agentId: string;
      buyerCancelPenalty: string;
      quantityAvailable: string;
      quantityInitial: string;
      validFromDate: string;
      validUntilDate: string;
      voucherRedeemableFromDate: string;
      voucherRedeemableUntilDate: string;
      disputePeriodDuration: string;
      voucherValidDuration: string;
      resolutionPeriodDuration: string;
      metadataUri: string;
      metadataHash: string;
      voided: boolean;
      voidedAt?: string | null;
      disputeResolverId: string;
      numberOfCommits: string;
      numberOfRedemptions: string;
      condition?: {
        __typename?: "ConditionEntity";
        id: string;
        method: number;
        tokenType: number;
        tokenAddress: string;
        tokenId: string;
        threshold: string;
        maxCommits: string;
      } | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
      exchangeToken: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
      disputeResolver: {
        __typename?: "DisputeResolver";
        id: string;
        escalationResponsePeriod: string;
        admin: string;
        clerk: string;
        treasury: string;
        operator: string;
        metadataUri: string;
        active: boolean;
        sellerAllowList: Array<string>;
        fees: Array<{
          __typename?: "DisputeResolverFee";
          id: string;
          tokenAddress: string;
          tokenName: string;
          feeAmount: string;
          token: {
            __typename?: "ExchangeToken";
            id: string;
            address: string;
            decimals: string;
            symbol: string;
            name: string;
          };
        }>;
      };
      disputeResolutionTerms: {
        __typename?: "DisputeResolutionTermsEntity";
        id: string;
        disputeResolverId: string;
        escalationResponsePeriod: string;
        feeAmount: string;
        buyerEscalationDeposit: string;
      };
      metadata?:
        | {
            __typename?: "BaseMetadataEntity";
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
          }
        | {
            __typename?: "ProductV1MetadataEntity";
            createdAt: string;
            voided: boolean;
            validFromDate: string;
            validUntilDate: string;
            quantityAvailable: string;
            uuid: string;
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
            attributes?: Array<{
              __typename?: "MetadataAttribute";
              traitType: string;
              value: string;
              displayType: string;
            }> | null;
            product: {
              __typename?: "ProductV1Product";
              id: string;
              uuid: string;
              version: number;
              title: string;
              description: string;
              identification_sKU?: string | null;
              identification_productId?: string | null;
              identification_productIdType?: string | null;
              productionInformation_brandName: string;
              productionInformation_manufacturer?: string | null;
              productionInformation_manufacturerPartNumber?: string | null;
              productionInformation_modelNumber?: string | null;
              productionInformation_materials?: Array<string> | null;
              details_category?: string | null;
              details_subCategory?: string | null;
              details_subCategory2?: string | null;
              details_offerCategory: string;
              offerCategory: ProductV1OfferCategory;
              details_tags?: Array<string> | null;
              details_sections?: Array<string> | null;
              details_personalisation?: Array<string> | null;
              packaging_packageQuantity?: string | null;
              packaging_dimensions_length?: string | null;
              packaging_dimensions_width?: string | null;
              packaging_dimensions_height?: string | null;
              packaging_dimensions_unit?: string | null;
              packaging_weight_value?: string | null;
              packaging_weight_unit?: string | null;
              brand: {
                __typename?: "ProductV1Brand";
                id: string;
                name: string;
              };
              category?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory2?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              tags?: Array<{
                __typename?: "ProductV1Tag";
                id: string;
                name: string;
              }> | null;
              sections?: Array<{
                __typename?: "ProductV1Section";
                id: string;
                name: string;
              }> | null;
              personalisation?: Array<{
                __typename?: "ProductV1Personalisation";
                id: string;
                name: string;
              }> | null;
              visuals_images: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }>;
              visuals_videos?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              productV1Seller?: {
                __typename?: "ProductV1Seller";
                id: string;
                defaultVersion: number;
                name?: string | null;
                description?: string | null;
                externalUrl?: string | null;
                tokenId?: string | null;
                sellerId?: string | null;
                images?: Array<{
                  __typename?: "ProductV1Media";
                  id: string;
                  url: string;
                  tag?: string | null;
                  type: ProductV1MediaType;
                }> | null;
                contactLinks?: Array<{
                  __typename?: "ProductV1SellerContactLink";
                  id: string;
                  url: string;
                  tag: string;
                }> | null;
                seller: {
                  __typename?: "Seller";
                  id: string;
                  operator: string;
                  admin: string;
                  clerk: string;
                  treasury: string;
                  authTokenId: string;
                  authTokenType: number;
                  voucherCloneAddress: string;
                  active: boolean;
                  contractURI: string;
                  royaltyPercentage: string;
                };
              } | null;
            };
            variations?: Array<{
              __typename?: "ProductV1Variation";
              id: string;
              type: string;
              option: string;
            }> | null;
            productV1Seller: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            };
            exchangePolicy: {
              __typename?: "ProductV1ExchangePolicy";
              id: string;
              uuid: string;
              version: number;
              label?: string | null;
              template: string;
              sellerContactMethod: string;
              disputeResolverContactMethod: string;
            };
            shipping?: {
              __typename?: "ProductV1ShippingOption";
              id: string;
              defaultVersion?: number | null;
              countryOfOrigin?: string | null;
              redemptionPoint?: string | null;
              returnPeriodInDays: number;
              supportedJurisdictions?: Array<{
                __typename?: "ProductV1ShippingJurisdiction";
                id: string;
                label: string;
                deliveryTime: string;
              }> | null;
            } | null;
          }
        | null;
    }>;
    logs?: Array<
      | {
          __typename?: "AccountEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "DisputeEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          dispute: { __typename?: "Dispute"; id: string };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "ExchangeEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          exchange: {
            __typename?: "Exchange";
            id: string;
            offer: { __typename?: "Offer"; id: string };
          };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "FundsEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          funds: { __typename?: "FundsEntity"; id: string };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
      | {
          __typename?: "OfferEventLog";
          id: string;
          hash: string;
          type: EventType;
          timestamp: string;
          executedBy: string;
          offer: { __typename?: "Offer"; id: string };
          account:
            | { __typename?: "Buyer"; id: string }
            | { __typename?: "DisputeResolver"; id: string }
            | { __typename?: "Seller"; id: string };
        }
    >;
    fees: Array<{
      __typename?: "DisputeResolverFee";
      id: string;
      tokenAddress: string;
      tokenName: string;
      feeAmount: string;
      token: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
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
  authTokenId: string;
  authTokenType: number;
  voucherCloneAddress: string;
  active: boolean;
  contractURI: string;
  royaltyPercentage: string;
  pendingSeller?: {
    __typename?: "PendingSeller";
    operator?: string | null;
    admin?: string | null;
    clerk?: string | null;
    authTokenId?: string | null;
    authTokenType?: number | null;
  } | null;
  funds?: Array<{
    __typename?: "FundsEntity";
    id: string;
    availableAmount: string;
    accountId: string;
    token: {
      __typename?: "ExchangeToken";
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
  }>;
  offers?: Array<{
    __typename?: "Offer";
    id: string;
    createdAt: string;
    price: string;
    sellerDeposit: string;
    protocolFee: string;
    agentFee: string;
    agentId: string;
    buyerCancelPenalty: string;
    quantityAvailable: string;
    quantityInitial: string;
    validFromDate: string;
    validUntilDate: string;
    voucherRedeemableFromDate: string;
    voucherRedeemableUntilDate: string;
    disputePeriodDuration: string;
    voucherValidDuration: string;
    resolutionPeriodDuration: string;
    metadataUri: string;
    metadataHash: string;
    voided: boolean;
    voidedAt?: string | null;
    disputeResolverId: string;
    numberOfCommits: string;
    numberOfRedemptions: string;
    condition?: {
      __typename?: "ConditionEntity";
      id: string;
      method: number;
      tokenType: number;
      tokenAddress: string;
      tokenId: string;
      threshold: string;
      maxCommits: string;
    } | null;
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
    exchangeToken: {
      __typename?: "ExchangeToken";
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
    disputeResolver: {
      __typename?: "DisputeResolver";
      id: string;
      escalationResponsePeriod: string;
      admin: string;
      clerk: string;
      treasury: string;
      operator: string;
      metadataUri: string;
      active: boolean;
      sellerAllowList: Array<string>;
      fees: Array<{
        __typename?: "DisputeResolverFee";
        id: string;
        tokenAddress: string;
        tokenName: string;
        feeAmount: string;
        token: {
          __typename?: "ExchangeToken";
          id: string;
          address: string;
          decimals: string;
          symbol: string;
          name: string;
        };
      }>;
    };
    disputeResolutionTerms: {
      __typename?: "DisputeResolutionTermsEntity";
      id: string;
      disputeResolverId: string;
      escalationResponsePeriod: string;
      feeAmount: string;
      buyerEscalationDeposit: string;
    };
    metadata?:
      | {
          __typename?: "BaseMetadataEntity";
          name: string;
          description: string;
          externalUrl: string;
          animationUrl?: string | null;
          licenseUrl: string;
          condition?: string | null;
          schemaUrl: string;
          type: MetadataType;
          image: string;
        }
      | {
          __typename?: "ProductV1MetadataEntity";
          createdAt: string;
          voided: boolean;
          validFromDate: string;
          validUntilDate: string;
          quantityAvailable: string;
          uuid: string;
          name: string;
          description: string;
          externalUrl: string;
          animationUrl?: string | null;
          licenseUrl: string;
          condition?: string | null;
          schemaUrl: string;
          type: MetadataType;
          image: string;
          attributes?: Array<{
            __typename?: "MetadataAttribute";
            traitType: string;
            value: string;
            displayType: string;
          }> | null;
          product: {
            __typename?: "ProductV1Product";
            id: string;
            uuid: string;
            version: number;
            title: string;
            description: string;
            identification_sKU?: string | null;
            identification_productId?: string | null;
            identification_productIdType?: string | null;
            productionInformation_brandName: string;
            productionInformation_manufacturer?: string | null;
            productionInformation_manufacturerPartNumber?: string | null;
            productionInformation_modelNumber?: string | null;
            productionInformation_materials?: Array<string> | null;
            details_category?: string | null;
            details_subCategory?: string | null;
            details_subCategory2?: string | null;
            details_offerCategory: string;
            offerCategory: ProductV1OfferCategory;
            details_tags?: Array<string> | null;
            details_sections?: Array<string> | null;
            details_personalisation?: Array<string> | null;
            packaging_packageQuantity?: string | null;
            packaging_dimensions_length?: string | null;
            packaging_dimensions_width?: string | null;
            packaging_dimensions_height?: string | null;
            packaging_dimensions_unit?: string | null;
            packaging_weight_value?: string | null;
            packaging_weight_unit?: string | null;
            brand: { __typename?: "ProductV1Brand"; id: string; name: string };
            category?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            subCategory?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            subCategory2?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            tags?: Array<{
              __typename?: "ProductV1Tag";
              id: string;
              name: string;
            }> | null;
            sections?: Array<{
              __typename?: "ProductV1Section";
              id: string;
              name: string;
            }> | null;
            personalisation?: Array<{
              __typename?: "ProductV1Personalisation";
              id: string;
              name: string;
            }> | null;
            visuals_images: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }>;
            visuals_videos?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            productV1Seller?: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            } | null;
          };
          variations?: Array<{
            __typename?: "ProductV1Variation";
            id: string;
            type: string;
            option: string;
          }> | null;
          productV1Seller: {
            __typename?: "ProductV1Seller";
            id: string;
            defaultVersion: number;
            name?: string | null;
            description?: string | null;
            externalUrl?: string | null;
            tokenId?: string | null;
            sellerId?: string | null;
            images?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            contactLinks?: Array<{
              __typename?: "ProductV1SellerContactLink";
              id: string;
              url: string;
              tag: string;
            }> | null;
            seller: {
              __typename?: "Seller";
              id: string;
              operator: string;
              admin: string;
              clerk: string;
              treasury: string;
              authTokenId: string;
              authTokenType: number;
              voucherCloneAddress: string;
              active: boolean;
              contractURI: string;
              royaltyPercentage: string;
            };
          };
          exchangePolicy: {
            __typename?: "ProductV1ExchangePolicy";
            id: string;
            uuid: string;
            version: number;
            label?: string | null;
            template: string;
            sellerContactMethod: string;
            disputeResolverContactMethod: string;
          };
          shipping?: {
            __typename?: "ProductV1ShippingOption";
            id: string;
            defaultVersion?: number | null;
            countryOfOrigin?: string | null;
            redemptionPoint?: string | null;
            returnPeriodInDays: number;
            supportedJurisdictions?: Array<{
              __typename?: "ProductV1ShippingJurisdiction";
              id: string;
              label: string;
              deliveryTime: string;
            }> | null;
          } | null;
        }
      | null;
  }>;
  exchanges?: Array<{
    __typename?: "Exchange";
    id: string;
    disputed: boolean;
    state: ExchangeState;
    committedDate: string;
    finalizedDate?: string | null;
    validUntilDate: string;
    redeemedDate?: string | null;
    revokedDate?: string | null;
    cancelledDate?: string | null;
    completedDate?: string | null;
    disputedDate?: string | null;
    expired: boolean;
    dispute?: {
      __typename?: "Dispute";
      id: string;
      exchangeId: string;
      state: DisputeState;
      buyerPercent: string;
      disputedDate: string;
      escalatedDate?: string | null;
      finalizedDate?: string | null;
      retractedDate?: string | null;
      resolvedDate?: string | null;
      decidedDate?: string | null;
      refusedDate?: string | null;
      timeout: string;
    } | null;
    buyer: {
      __typename?: "Buyer";
      id: string;
      wallet: string;
      active: boolean;
    };
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
  }>;
  logs?: Array<
    | {
        __typename?: "AccountEventLog";
        id: string;
        hash: string;
        type: EventType;
        timestamp: string;
        executedBy: string;
        account:
          | { __typename?: "Buyer"; id: string }
          | { __typename?: "DisputeResolver"; id: string }
          | { __typename?: "Seller"; id: string };
      }
    | {
        __typename?: "DisputeEventLog";
        id: string;
        hash: string;
        type: EventType;
        timestamp: string;
        executedBy: string;
        dispute: { __typename?: "Dispute"; id: string };
        account:
          | { __typename?: "Buyer"; id: string }
          | { __typename?: "DisputeResolver"; id: string }
          | { __typename?: "Seller"; id: string };
      }
    | {
        __typename?: "ExchangeEventLog";
        id: string;
        hash: string;
        type: EventType;
        timestamp: string;
        executedBy: string;
        exchange: {
          __typename?: "Exchange";
          id: string;
          offer: { __typename?: "Offer"; id: string };
        };
        account:
          | { __typename?: "Buyer"; id: string }
          | { __typename?: "DisputeResolver"; id: string }
          | { __typename?: "Seller"; id: string };
      }
    | {
        __typename?: "FundsEventLog";
        id: string;
        hash: string;
        type: EventType;
        timestamp: string;
        executedBy: string;
        funds: { __typename?: "FundsEntity"; id: string };
        account:
          | { __typename?: "Buyer"; id: string }
          | { __typename?: "DisputeResolver"; id: string }
          | { __typename?: "Seller"; id: string };
      }
    | {
        __typename?: "OfferEventLog";
        id: string;
        hash: string;
        type: EventType;
        timestamp: string;
        executedBy: string;
        offer: { __typename?: "Offer"; id: string };
        account:
          | { __typename?: "Buyer"; id: string }
          | { __typename?: "DisputeResolver"; id: string }
          | { __typename?: "Seller"; id: string };
      }
  >;
};

export type BaseSellerFieldsFragment = {
  __typename?: "Seller";
  id: string;
  operator: string;
  admin: string;
  clerk: string;
  treasury: string;
  authTokenId: string;
  authTokenType: number;
  voucherCloneAddress: string;
  active: boolean;
  contractURI: string;
  royaltyPercentage: string;
};

export type PendingSellerFieldsFragment = {
  __typename?: "PendingSeller";
  operator?: string | null;
  admin?: string | null;
  clerk?: string | null;
  authTokenId?: string | null;
  authTokenType?: number | null;
};

export type BuyerFieldsFragment = {
  __typename?: "Buyer";
  id: string;
  wallet: string;
  active: boolean;
  funds?: Array<{
    __typename?: "FundsEntity";
    id: string;
    availableAmount: string;
    accountId: string;
    token: {
      __typename?: "ExchangeToken";
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
  }>;
  exchanges?: Array<{
    __typename?: "Exchange";
    id: string;
    disputed: boolean;
    state: ExchangeState;
    committedDate: string;
    finalizedDate?: string | null;
    validUntilDate: string;
    redeemedDate?: string | null;
    revokedDate?: string | null;
    cancelledDate?: string | null;
    completedDate?: string | null;
    disputedDate?: string | null;
    expired: boolean;
    dispute?: {
      __typename?: "Dispute";
      id: string;
      exchangeId: string;
      state: DisputeState;
      buyerPercent: string;
      disputedDate: string;
      escalatedDate?: string | null;
      finalizedDate?: string | null;
      retractedDate?: string | null;
      resolvedDate?: string | null;
      decidedDate?: string | null;
      refusedDate?: string | null;
      timeout: string;
    } | null;
    buyer: {
      __typename?: "Buyer";
      id: string;
      wallet: string;
      active: boolean;
    };
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
  }>;
  logs?: Array<
    | {
        __typename?: "AccountEventLog";
        id: string;
        hash: string;
        type: EventType;
        timestamp: string;
        executedBy: string;
        account:
          | { __typename?: "Buyer"; id: string }
          | { __typename?: "DisputeResolver"; id: string }
          | { __typename?: "Seller"; id: string };
      }
    | {
        __typename?: "DisputeEventLog";
        id: string;
        hash: string;
        type: EventType;
        timestamp: string;
        executedBy: string;
        dispute: { __typename?: "Dispute"; id: string };
        account:
          | { __typename?: "Buyer"; id: string }
          | { __typename?: "DisputeResolver"; id: string }
          | { __typename?: "Seller"; id: string };
      }
    | {
        __typename?: "ExchangeEventLog";
        id: string;
        hash: string;
        type: EventType;
        timestamp: string;
        executedBy: string;
        exchange: {
          __typename?: "Exchange";
          id: string;
          offer: { __typename?: "Offer"; id: string };
        };
        account:
          | { __typename?: "Buyer"; id: string }
          | { __typename?: "DisputeResolver"; id: string }
          | { __typename?: "Seller"; id: string };
      }
    | {
        __typename?: "FundsEventLog";
        id: string;
        hash: string;
        type: EventType;
        timestamp: string;
        executedBy: string;
        funds: { __typename?: "FundsEntity"; id: string };
        account:
          | { __typename?: "Buyer"; id: string }
          | { __typename?: "DisputeResolver"; id: string }
          | { __typename?: "Seller"; id: string };
      }
    | {
        __typename?: "OfferEventLog";
        id: string;
        hash: string;
        type: EventType;
        timestamp: string;
        executedBy: string;
        offer: { __typename?: "Offer"; id: string };
        account:
          | { __typename?: "Buyer"; id: string }
          | { __typename?: "DisputeResolver"; id: string }
          | { __typename?: "Seller"; id: string };
      }
  >;
};

export type BaseBuyerFieldsFragment = {
  __typename?: "Buyer";
  id: string;
  wallet: string;
  active: boolean;
};

export type DisputeResolverFieldsFragment = {
  __typename?: "DisputeResolver";
  id: string;
  escalationResponsePeriod: string;
  admin: string;
  clerk: string;
  treasury: string;
  operator: string;
  metadataUri: string;
  active: boolean;
  sellerAllowList: Array<string>;
  pendingDisputeResolver?: {
    __typename?: "PendingDisputeResolver";
    operator?: string | null;
    admin?: string | null;
    clerk?: string | null;
  } | null;
  offers?: Array<{
    __typename?: "Offer";
    id: string;
    createdAt: string;
    price: string;
    sellerDeposit: string;
    protocolFee: string;
    agentFee: string;
    agentId: string;
    buyerCancelPenalty: string;
    quantityAvailable: string;
    quantityInitial: string;
    validFromDate: string;
    validUntilDate: string;
    voucherRedeemableFromDate: string;
    voucherRedeemableUntilDate: string;
    disputePeriodDuration: string;
    voucherValidDuration: string;
    resolutionPeriodDuration: string;
    metadataUri: string;
    metadataHash: string;
    voided: boolean;
    voidedAt?: string | null;
    disputeResolverId: string;
    numberOfCommits: string;
    numberOfRedemptions: string;
    condition?: {
      __typename?: "ConditionEntity";
      id: string;
      method: number;
      tokenType: number;
      tokenAddress: string;
      tokenId: string;
      threshold: string;
      maxCommits: string;
    } | null;
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
    exchangeToken: {
      __typename?: "ExchangeToken";
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
    disputeResolver: {
      __typename?: "DisputeResolver";
      id: string;
      escalationResponsePeriod: string;
      admin: string;
      clerk: string;
      treasury: string;
      operator: string;
      metadataUri: string;
      active: boolean;
      sellerAllowList: Array<string>;
      fees: Array<{
        __typename?: "DisputeResolverFee";
        id: string;
        tokenAddress: string;
        tokenName: string;
        feeAmount: string;
        token: {
          __typename?: "ExchangeToken";
          id: string;
          address: string;
          decimals: string;
          symbol: string;
          name: string;
        };
      }>;
    };
    disputeResolutionTerms: {
      __typename?: "DisputeResolutionTermsEntity";
      id: string;
      disputeResolverId: string;
      escalationResponsePeriod: string;
      feeAmount: string;
      buyerEscalationDeposit: string;
    };
    metadata?:
      | {
          __typename?: "BaseMetadataEntity";
          name: string;
          description: string;
          externalUrl: string;
          animationUrl?: string | null;
          licenseUrl: string;
          condition?: string | null;
          schemaUrl: string;
          type: MetadataType;
          image: string;
        }
      | {
          __typename?: "ProductV1MetadataEntity";
          createdAt: string;
          voided: boolean;
          validFromDate: string;
          validUntilDate: string;
          quantityAvailable: string;
          uuid: string;
          name: string;
          description: string;
          externalUrl: string;
          animationUrl?: string | null;
          licenseUrl: string;
          condition?: string | null;
          schemaUrl: string;
          type: MetadataType;
          image: string;
          attributes?: Array<{
            __typename?: "MetadataAttribute";
            traitType: string;
            value: string;
            displayType: string;
          }> | null;
          product: {
            __typename?: "ProductV1Product";
            id: string;
            uuid: string;
            version: number;
            title: string;
            description: string;
            identification_sKU?: string | null;
            identification_productId?: string | null;
            identification_productIdType?: string | null;
            productionInformation_brandName: string;
            productionInformation_manufacturer?: string | null;
            productionInformation_manufacturerPartNumber?: string | null;
            productionInformation_modelNumber?: string | null;
            productionInformation_materials?: Array<string> | null;
            details_category?: string | null;
            details_subCategory?: string | null;
            details_subCategory2?: string | null;
            details_offerCategory: string;
            offerCategory: ProductV1OfferCategory;
            details_tags?: Array<string> | null;
            details_sections?: Array<string> | null;
            details_personalisation?: Array<string> | null;
            packaging_packageQuantity?: string | null;
            packaging_dimensions_length?: string | null;
            packaging_dimensions_width?: string | null;
            packaging_dimensions_height?: string | null;
            packaging_dimensions_unit?: string | null;
            packaging_weight_value?: string | null;
            packaging_weight_unit?: string | null;
            brand: { __typename?: "ProductV1Brand"; id: string; name: string };
            category?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            subCategory?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            subCategory2?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            tags?: Array<{
              __typename?: "ProductV1Tag";
              id: string;
              name: string;
            }> | null;
            sections?: Array<{
              __typename?: "ProductV1Section";
              id: string;
              name: string;
            }> | null;
            personalisation?: Array<{
              __typename?: "ProductV1Personalisation";
              id: string;
              name: string;
            }> | null;
            visuals_images: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }>;
            visuals_videos?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            productV1Seller?: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            } | null;
          };
          variations?: Array<{
            __typename?: "ProductV1Variation";
            id: string;
            type: string;
            option: string;
          }> | null;
          productV1Seller: {
            __typename?: "ProductV1Seller";
            id: string;
            defaultVersion: number;
            name?: string | null;
            description?: string | null;
            externalUrl?: string | null;
            tokenId?: string | null;
            sellerId?: string | null;
            images?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            contactLinks?: Array<{
              __typename?: "ProductV1SellerContactLink";
              id: string;
              url: string;
              tag: string;
            }> | null;
            seller: {
              __typename?: "Seller";
              id: string;
              operator: string;
              admin: string;
              clerk: string;
              treasury: string;
              authTokenId: string;
              authTokenType: number;
              voucherCloneAddress: string;
              active: boolean;
              contractURI: string;
              royaltyPercentage: string;
            };
          };
          exchangePolicy: {
            __typename?: "ProductV1ExchangePolicy";
            id: string;
            uuid: string;
            version: number;
            label?: string | null;
            template: string;
            sellerContactMethod: string;
            disputeResolverContactMethod: string;
          };
          shipping?: {
            __typename?: "ProductV1ShippingOption";
            id: string;
            defaultVersion?: number | null;
            countryOfOrigin?: string | null;
            redemptionPoint?: string | null;
            returnPeriodInDays: number;
            supportedJurisdictions?: Array<{
              __typename?: "ProductV1ShippingJurisdiction";
              id: string;
              label: string;
              deliveryTime: string;
            }> | null;
          } | null;
        }
      | null;
  }>;
  logs?: Array<
    | {
        __typename?: "AccountEventLog";
        id: string;
        hash: string;
        type: EventType;
        timestamp: string;
        executedBy: string;
        account:
          | { __typename?: "Buyer"; id: string }
          | { __typename?: "DisputeResolver"; id: string }
          | { __typename?: "Seller"; id: string };
      }
    | {
        __typename?: "DisputeEventLog";
        id: string;
        hash: string;
        type: EventType;
        timestamp: string;
        executedBy: string;
        dispute: { __typename?: "Dispute"; id: string };
        account:
          | { __typename?: "Buyer"; id: string }
          | { __typename?: "DisputeResolver"; id: string }
          | { __typename?: "Seller"; id: string };
      }
    | {
        __typename?: "ExchangeEventLog";
        id: string;
        hash: string;
        type: EventType;
        timestamp: string;
        executedBy: string;
        exchange: {
          __typename?: "Exchange";
          id: string;
          offer: { __typename?: "Offer"; id: string };
        };
        account:
          | { __typename?: "Buyer"; id: string }
          | { __typename?: "DisputeResolver"; id: string }
          | { __typename?: "Seller"; id: string };
      }
    | {
        __typename?: "FundsEventLog";
        id: string;
        hash: string;
        type: EventType;
        timestamp: string;
        executedBy: string;
        funds: { __typename?: "FundsEntity"; id: string };
        account:
          | { __typename?: "Buyer"; id: string }
          | { __typename?: "DisputeResolver"; id: string }
          | { __typename?: "Seller"; id: string };
      }
    | {
        __typename?: "OfferEventLog";
        id: string;
        hash: string;
        type: EventType;
        timestamp: string;
        executedBy: string;
        offer: { __typename?: "Offer"; id: string };
        account:
          | { __typename?: "Buyer"; id: string }
          | { __typename?: "DisputeResolver"; id: string }
          | { __typename?: "Seller"; id: string };
      }
  >;
  fees: Array<{
    __typename?: "DisputeResolverFee";
    id: string;
    tokenAddress: string;
    tokenName: string;
    feeAmount: string;
    token: {
      __typename?: "ExchangeToken";
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
  }>;
};

export type BaseDisputeResolverFieldsFragment = {
  __typename?: "DisputeResolver";
  id: string;
  escalationResponsePeriod: string;
  admin: string;
  clerk: string;
  treasury: string;
  operator: string;
  metadataUri: string;
  active: boolean;
  sellerAllowList: Array<string>;
  fees: Array<{
    __typename?: "DisputeResolverFee";
    id: string;
    tokenAddress: string;
    tokenName: string;
    feeAmount: string;
    token: {
      __typename?: "ExchangeToken";
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
  }>;
};

export type PendingDisputeResolverFieldsFragment = {
  __typename?: "PendingDisputeResolver";
  operator?: string | null;
  admin?: string | null;
  clerk?: string | null;
};

export type BaseDisputeResolverFeeFieldsFragment = {
  __typename?: "DisputeResolverFee";
  id: string;
  tokenAddress: string;
  tokenName: string;
  feeAmount: string;
  token: {
    __typename?: "ExchangeToken";
    id: string;
    address: string;
    decimals: string;
    symbol: string;
    name: string;
  };
};

export type BaseDisputeResolutionTermsEntityFieldsFragment = {
  __typename?: "DisputeResolutionTermsEntity";
  id: string;
  disputeResolverId: string;
  escalationResponsePeriod: string;
  feeAmount: string;
  buyerEscalationDeposit: string;
};

export type GetDisputeByIdQueryQueryVariables = Exact<{
  disputeId: Scalars["ID"];
  offersSkip?: InputMaybe<Scalars["Int"]>;
  offersFirst?: InputMaybe<Scalars["Int"]>;
  offersOrderBy?: InputMaybe<Offer_OrderBy>;
  offersOrderDirection?: InputMaybe<OrderDirection>;
  offersFilter?: InputMaybe<Offer_Filter>;
  includeOffers?: InputMaybe<Scalars["Boolean"]>;
}>;

export type GetDisputeByIdQueryQuery = {
  __typename?: "Query";
  dispute?: {
    __typename?: "Dispute";
    id: string;
    exchangeId: string;
    state: DisputeState;
    buyerPercent: string;
    disputedDate: string;
    escalatedDate?: string | null;
    finalizedDate?: string | null;
    retractedDate?: string | null;
    resolvedDate?: string | null;
    decidedDate?: string | null;
    refusedDate?: string | null;
    timeout: string;
    exchange: {
      __typename?: "Exchange";
      id: string;
      disputed: boolean;
      state: ExchangeState;
      committedDate: string;
      finalizedDate?: string | null;
      validUntilDate: string;
      redeemedDate?: string | null;
      revokedDate?: string | null;
      cancelledDate?: string | null;
      completedDate?: string | null;
      disputedDate?: string | null;
      expired: boolean;
      dispute?: {
        __typename?: "Dispute";
        id: string;
        exchangeId: string;
        state: DisputeState;
        buyerPercent: string;
        disputedDate: string;
        escalatedDate?: string | null;
        finalizedDate?: string | null;
        retractedDate?: string | null;
        resolvedDate?: string | null;
        decidedDate?: string | null;
        refusedDate?: string | null;
        timeout: string;
      } | null;
      buyer: {
        __typename?: "Buyer";
        id: string;
        wallet: string;
        active: boolean;
      };
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
    };
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
    buyer: {
      __typename?: "Buyer";
      id: string;
      wallet: string;
      active: boolean;
    };
  } | null;
};

export type GetDisputesQueryQueryVariables = Exact<{
  disputesSkip?: InputMaybe<Scalars["Int"]>;
  disputesFirst?: InputMaybe<Scalars["Int"]>;
  disputesOrderBy?: InputMaybe<Dispute_OrderBy>;
  disputesOrderDirection?: InputMaybe<OrderDirection>;
  disputesFilter?: InputMaybe<Dispute_Filter>;
}>;

export type GetDisputesQueryQuery = {
  __typename?: "Query";
  disputes: Array<{
    __typename?: "Dispute";
    id: string;
    exchangeId: string;
    state: DisputeState;
    buyerPercent: string;
    disputedDate: string;
    escalatedDate?: string | null;
    finalizedDate?: string | null;
    retractedDate?: string | null;
    resolvedDate?: string | null;
    decidedDate?: string | null;
    refusedDate?: string | null;
    timeout: string;
    exchange: {
      __typename?: "Exchange";
      id: string;
      disputed: boolean;
      state: ExchangeState;
      committedDate: string;
      finalizedDate?: string | null;
      validUntilDate: string;
      redeemedDate?: string | null;
      revokedDate?: string | null;
      cancelledDate?: string | null;
      completedDate?: string | null;
      disputedDate?: string | null;
      expired: boolean;
      dispute?: {
        __typename?: "Dispute";
        id: string;
        exchangeId: string;
        state: DisputeState;
        buyerPercent: string;
        disputedDate: string;
        escalatedDate?: string | null;
        finalizedDate?: string | null;
        retractedDate?: string | null;
        resolvedDate?: string | null;
        decidedDate?: string | null;
        refusedDate?: string | null;
        timeout: string;
      } | null;
      buyer: {
        __typename?: "Buyer";
        id: string;
        wallet: string;
        active: boolean;
      };
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
    };
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
    buyer: {
      __typename?: "Buyer";
      id: string;
      wallet: string;
      active: boolean;
    };
  }>;
};

export type DisputeFieldsFragment = {
  __typename?: "Dispute";
  id: string;
  exchangeId: string;
  state: DisputeState;
  buyerPercent: string;
  disputedDate: string;
  escalatedDate?: string | null;
  finalizedDate?: string | null;
  retractedDate?: string | null;
  resolvedDate?: string | null;
  decidedDate?: string | null;
  refusedDate?: string | null;
  timeout: string;
  exchange: {
    __typename?: "Exchange";
    id: string;
    disputed: boolean;
    state: ExchangeState;
    committedDate: string;
    finalizedDate?: string | null;
    validUntilDate: string;
    redeemedDate?: string | null;
    revokedDate?: string | null;
    cancelledDate?: string | null;
    completedDate?: string | null;
    disputedDate?: string | null;
    expired: boolean;
    dispute?: {
      __typename?: "Dispute";
      id: string;
      exchangeId: string;
      state: DisputeState;
      buyerPercent: string;
      disputedDate: string;
      escalatedDate?: string | null;
      finalizedDate?: string | null;
      retractedDate?: string | null;
      resolvedDate?: string | null;
      decidedDate?: string | null;
      refusedDate?: string | null;
      timeout: string;
    } | null;
    buyer: {
      __typename?: "Buyer";
      id: string;
      wallet: string;
      active: boolean;
    };
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
  };
  seller: {
    __typename?: "Seller";
    id: string;
    operator: string;
    admin: string;
    clerk: string;
    treasury: string;
    authTokenId: string;
    authTokenType: number;
    voucherCloneAddress: string;
    active: boolean;
    contractURI: string;
    royaltyPercentage: string;
  };
  buyer: { __typename?: "Buyer"; id: string; wallet: string; active: boolean };
};

export type BaseDisputeFieldsFragment = {
  __typename?: "Dispute";
  id: string;
  exchangeId: string;
  state: DisputeState;
  buyerPercent: string;
  disputedDate: string;
  escalatedDate?: string | null;
  finalizedDate?: string | null;
  retractedDate?: string | null;
  resolvedDate?: string | null;
  decidedDate?: string | null;
  refusedDate?: string | null;
  timeout: string;
};

export type GetExchangeTokenByIdQueryQueryVariables = Exact<{
  exchangeTokenId: Scalars["ID"];
  exchangeTokensSkip?: InputMaybe<Scalars["Int"]>;
  exchangeTokensFirst?: InputMaybe<Scalars["Int"]>;
  exchangeTokensOrderBy?: InputMaybe<ExchangeToken_OrderBy>;
  exchangeTokensOrderDirection?: InputMaybe<OrderDirection>;
  exchangeTokensFilter?: InputMaybe<ExchangeToken_Filter>;
  offersSkip?: InputMaybe<Scalars["Int"]>;
  offersFirst?: InputMaybe<Scalars["Int"]>;
  offersOrderBy?: InputMaybe<Offer_OrderBy>;
  offersOrderDirection?: InputMaybe<OrderDirection>;
  offersFilter?: InputMaybe<Offer_Filter>;
  fundsSkip?: InputMaybe<Scalars["Int"]>;
  fundsFirst?: InputMaybe<Scalars["Int"]>;
  fundsOrderBy?: InputMaybe<FundsEntity_OrderBy>;
  fundsOrderDirection?: InputMaybe<OrderDirection>;
  fundsFilter?: InputMaybe<FundsEntity_Filter>;
  includeOffers?: InputMaybe<Scalars["Boolean"]>;
  includeFunds?: InputMaybe<Scalars["Boolean"]>;
}>;

export type GetExchangeTokenByIdQueryQuery = {
  __typename?: "Query";
  exchangeToken?: {
    __typename?: "ExchangeToken";
    id: string;
    address: string;
    decimals: string;
    symbol: string;
    name: string;
    offers?: Array<{
      __typename?: "Offer";
      id: string;
      createdAt: string;
      price: string;
      sellerDeposit: string;
      protocolFee: string;
      agentFee: string;
      agentId: string;
      buyerCancelPenalty: string;
      quantityAvailable: string;
      quantityInitial: string;
      validFromDate: string;
      validUntilDate: string;
      voucherRedeemableFromDate: string;
      voucherRedeemableUntilDate: string;
      disputePeriodDuration: string;
      voucherValidDuration: string;
      resolutionPeriodDuration: string;
      metadataUri: string;
      metadataHash: string;
      voided: boolean;
      voidedAt?: string | null;
      disputeResolverId: string;
      numberOfCommits: string;
      numberOfRedemptions: string;
      condition?: {
        __typename?: "ConditionEntity";
        id: string;
        method: number;
        tokenType: number;
        tokenAddress: string;
        tokenId: string;
        threshold: string;
        maxCommits: string;
      } | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
      exchangeToken: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
      disputeResolver: {
        __typename?: "DisputeResolver";
        id: string;
        escalationResponsePeriod: string;
        admin: string;
        clerk: string;
        treasury: string;
        operator: string;
        metadataUri: string;
        active: boolean;
        sellerAllowList: Array<string>;
        fees: Array<{
          __typename?: "DisputeResolverFee";
          id: string;
          tokenAddress: string;
          tokenName: string;
          feeAmount: string;
          token: {
            __typename?: "ExchangeToken";
            id: string;
            address: string;
            decimals: string;
            symbol: string;
            name: string;
          };
        }>;
      };
      disputeResolutionTerms: {
        __typename?: "DisputeResolutionTermsEntity";
        id: string;
        disputeResolverId: string;
        escalationResponsePeriod: string;
        feeAmount: string;
        buyerEscalationDeposit: string;
      };
      metadata?:
        | {
            __typename?: "BaseMetadataEntity";
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
          }
        | {
            __typename?: "ProductV1MetadataEntity";
            createdAt: string;
            voided: boolean;
            validFromDate: string;
            validUntilDate: string;
            quantityAvailable: string;
            uuid: string;
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
            attributes?: Array<{
              __typename?: "MetadataAttribute";
              traitType: string;
              value: string;
              displayType: string;
            }> | null;
            product: {
              __typename?: "ProductV1Product";
              id: string;
              uuid: string;
              version: number;
              title: string;
              description: string;
              identification_sKU?: string | null;
              identification_productId?: string | null;
              identification_productIdType?: string | null;
              productionInformation_brandName: string;
              productionInformation_manufacturer?: string | null;
              productionInformation_manufacturerPartNumber?: string | null;
              productionInformation_modelNumber?: string | null;
              productionInformation_materials?: Array<string> | null;
              details_category?: string | null;
              details_subCategory?: string | null;
              details_subCategory2?: string | null;
              details_offerCategory: string;
              offerCategory: ProductV1OfferCategory;
              details_tags?: Array<string> | null;
              details_sections?: Array<string> | null;
              details_personalisation?: Array<string> | null;
              packaging_packageQuantity?: string | null;
              packaging_dimensions_length?: string | null;
              packaging_dimensions_width?: string | null;
              packaging_dimensions_height?: string | null;
              packaging_dimensions_unit?: string | null;
              packaging_weight_value?: string | null;
              packaging_weight_unit?: string | null;
              brand: {
                __typename?: "ProductV1Brand";
                id: string;
                name: string;
              };
              category?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory2?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              tags?: Array<{
                __typename?: "ProductV1Tag";
                id: string;
                name: string;
              }> | null;
              sections?: Array<{
                __typename?: "ProductV1Section";
                id: string;
                name: string;
              }> | null;
              personalisation?: Array<{
                __typename?: "ProductV1Personalisation";
                id: string;
                name: string;
              }> | null;
              visuals_images: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }>;
              visuals_videos?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              productV1Seller?: {
                __typename?: "ProductV1Seller";
                id: string;
                defaultVersion: number;
                name?: string | null;
                description?: string | null;
                externalUrl?: string | null;
                tokenId?: string | null;
                sellerId?: string | null;
                images?: Array<{
                  __typename?: "ProductV1Media";
                  id: string;
                  url: string;
                  tag?: string | null;
                  type: ProductV1MediaType;
                }> | null;
                contactLinks?: Array<{
                  __typename?: "ProductV1SellerContactLink";
                  id: string;
                  url: string;
                  tag: string;
                }> | null;
                seller: {
                  __typename?: "Seller";
                  id: string;
                  operator: string;
                  admin: string;
                  clerk: string;
                  treasury: string;
                  authTokenId: string;
                  authTokenType: number;
                  voucherCloneAddress: string;
                  active: boolean;
                  contractURI: string;
                  royaltyPercentage: string;
                };
              } | null;
            };
            variations?: Array<{
              __typename?: "ProductV1Variation";
              id: string;
              type: string;
              option: string;
            }> | null;
            productV1Seller: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            };
            exchangePolicy: {
              __typename?: "ProductV1ExchangePolicy";
              id: string;
              uuid: string;
              version: number;
              label?: string | null;
              template: string;
              sellerContactMethod: string;
              disputeResolverContactMethod: string;
            };
            shipping?: {
              __typename?: "ProductV1ShippingOption";
              id: string;
              defaultVersion?: number | null;
              countryOfOrigin?: string | null;
              redemptionPoint?: string | null;
              returnPeriodInDays: number;
              supportedJurisdictions?: Array<{
                __typename?: "ProductV1ShippingJurisdiction";
                id: string;
                label: string;
                deliveryTime: string;
              }> | null;
            } | null;
          }
        | null;
    }>;
    funds?: Array<{
      __typename?: "FundsEntity";
      id: string;
      availableAmount: string;
      accountId: string;
    }>;
  } | null;
};

export type GetExchangeTokensQueryQueryVariables = Exact<{
  exchangeTokensSkip?: InputMaybe<Scalars["Int"]>;
  exchangeTokensFirst?: InputMaybe<Scalars["Int"]>;
  exchangeTokensOrderBy?: InputMaybe<ExchangeToken_OrderBy>;
  exchangeTokensOrderDirection?: InputMaybe<OrderDirection>;
  exchangeTokensFilter?: InputMaybe<ExchangeToken_Filter>;
  offersSkip?: InputMaybe<Scalars["Int"]>;
  offersFirst?: InputMaybe<Scalars["Int"]>;
  offersOrderBy?: InputMaybe<Offer_OrderBy>;
  offersOrderDirection?: InputMaybe<OrderDirection>;
  offersFilter?: InputMaybe<Offer_Filter>;
  includeOffers?: InputMaybe<Scalars["Boolean"]>;
  fundsSkip?: InputMaybe<Scalars["Int"]>;
  fundsFirst?: InputMaybe<Scalars["Int"]>;
  fundsOrderBy?: InputMaybe<FundsEntity_OrderBy>;
  fundsOrderDirection?: InputMaybe<OrderDirection>;
  fundsFilter?: InputMaybe<FundsEntity_Filter>;
  includeFunds?: InputMaybe<Scalars["Boolean"]>;
}>;

export type GetExchangeTokensQueryQuery = {
  __typename?: "Query";
  exchangeTokens: Array<{
    __typename?: "ExchangeToken";
    id: string;
    address: string;
    decimals: string;
    symbol: string;
    name: string;
    offers?: Array<{
      __typename?: "Offer";
      id: string;
      createdAt: string;
      price: string;
      sellerDeposit: string;
      protocolFee: string;
      agentFee: string;
      agentId: string;
      buyerCancelPenalty: string;
      quantityAvailable: string;
      quantityInitial: string;
      validFromDate: string;
      validUntilDate: string;
      voucherRedeemableFromDate: string;
      voucherRedeemableUntilDate: string;
      disputePeriodDuration: string;
      voucherValidDuration: string;
      resolutionPeriodDuration: string;
      metadataUri: string;
      metadataHash: string;
      voided: boolean;
      voidedAt?: string | null;
      disputeResolverId: string;
      numberOfCommits: string;
      numberOfRedemptions: string;
      condition?: {
        __typename?: "ConditionEntity";
        id: string;
        method: number;
        tokenType: number;
        tokenAddress: string;
        tokenId: string;
        threshold: string;
        maxCommits: string;
      } | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
      exchangeToken: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
      disputeResolver: {
        __typename?: "DisputeResolver";
        id: string;
        escalationResponsePeriod: string;
        admin: string;
        clerk: string;
        treasury: string;
        operator: string;
        metadataUri: string;
        active: boolean;
        sellerAllowList: Array<string>;
        fees: Array<{
          __typename?: "DisputeResolverFee";
          id: string;
          tokenAddress: string;
          tokenName: string;
          feeAmount: string;
          token: {
            __typename?: "ExchangeToken";
            id: string;
            address: string;
            decimals: string;
            symbol: string;
            name: string;
          };
        }>;
      };
      disputeResolutionTerms: {
        __typename?: "DisputeResolutionTermsEntity";
        id: string;
        disputeResolverId: string;
        escalationResponsePeriod: string;
        feeAmount: string;
        buyerEscalationDeposit: string;
      };
      metadata?:
        | {
            __typename?: "BaseMetadataEntity";
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
          }
        | {
            __typename?: "ProductV1MetadataEntity";
            createdAt: string;
            voided: boolean;
            validFromDate: string;
            validUntilDate: string;
            quantityAvailable: string;
            uuid: string;
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
            attributes?: Array<{
              __typename?: "MetadataAttribute";
              traitType: string;
              value: string;
              displayType: string;
            }> | null;
            product: {
              __typename?: "ProductV1Product";
              id: string;
              uuid: string;
              version: number;
              title: string;
              description: string;
              identification_sKU?: string | null;
              identification_productId?: string | null;
              identification_productIdType?: string | null;
              productionInformation_brandName: string;
              productionInformation_manufacturer?: string | null;
              productionInformation_manufacturerPartNumber?: string | null;
              productionInformation_modelNumber?: string | null;
              productionInformation_materials?: Array<string> | null;
              details_category?: string | null;
              details_subCategory?: string | null;
              details_subCategory2?: string | null;
              details_offerCategory: string;
              offerCategory: ProductV1OfferCategory;
              details_tags?: Array<string> | null;
              details_sections?: Array<string> | null;
              details_personalisation?: Array<string> | null;
              packaging_packageQuantity?: string | null;
              packaging_dimensions_length?: string | null;
              packaging_dimensions_width?: string | null;
              packaging_dimensions_height?: string | null;
              packaging_dimensions_unit?: string | null;
              packaging_weight_value?: string | null;
              packaging_weight_unit?: string | null;
              brand: {
                __typename?: "ProductV1Brand";
                id: string;
                name: string;
              };
              category?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory2?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              tags?: Array<{
                __typename?: "ProductV1Tag";
                id: string;
                name: string;
              }> | null;
              sections?: Array<{
                __typename?: "ProductV1Section";
                id: string;
                name: string;
              }> | null;
              personalisation?: Array<{
                __typename?: "ProductV1Personalisation";
                id: string;
                name: string;
              }> | null;
              visuals_images: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }>;
              visuals_videos?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              productV1Seller?: {
                __typename?: "ProductV1Seller";
                id: string;
                defaultVersion: number;
                name?: string | null;
                description?: string | null;
                externalUrl?: string | null;
                tokenId?: string | null;
                sellerId?: string | null;
                images?: Array<{
                  __typename?: "ProductV1Media";
                  id: string;
                  url: string;
                  tag?: string | null;
                  type: ProductV1MediaType;
                }> | null;
                contactLinks?: Array<{
                  __typename?: "ProductV1SellerContactLink";
                  id: string;
                  url: string;
                  tag: string;
                }> | null;
                seller: {
                  __typename?: "Seller";
                  id: string;
                  operator: string;
                  admin: string;
                  clerk: string;
                  treasury: string;
                  authTokenId: string;
                  authTokenType: number;
                  voucherCloneAddress: string;
                  active: boolean;
                  contractURI: string;
                  royaltyPercentage: string;
                };
              } | null;
            };
            variations?: Array<{
              __typename?: "ProductV1Variation";
              id: string;
              type: string;
              option: string;
            }> | null;
            productV1Seller: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            };
            exchangePolicy: {
              __typename?: "ProductV1ExchangePolicy";
              id: string;
              uuid: string;
              version: number;
              label?: string | null;
              template: string;
              sellerContactMethod: string;
              disputeResolverContactMethod: string;
            };
            shipping?: {
              __typename?: "ProductV1ShippingOption";
              id: string;
              defaultVersion?: number | null;
              countryOfOrigin?: string | null;
              redemptionPoint?: string | null;
              returnPeriodInDays: number;
              supportedJurisdictions?: Array<{
                __typename?: "ProductV1ShippingJurisdiction";
                id: string;
                label: string;
                deliveryTime: string;
              }> | null;
            } | null;
          }
        | null;
    }>;
    funds?: Array<{
      __typename?: "FundsEntity";
      id: string;
      availableAmount: string;
      accountId: string;
    }>;
  }>;
};

export type ExchangeTokenFieldsFragment = {
  __typename?: "ExchangeToken";
  id: string;
  address: string;
  decimals: string;
  symbol: string;
  name: string;
  offers?: Array<{
    __typename?: "Offer";
    id: string;
    createdAt: string;
    price: string;
    sellerDeposit: string;
    protocolFee: string;
    agentFee: string;
    agentId: string;
    buyerCancelPenalty: string;
    quantityAvailable: string;
    quantityInitial: string;
    validFromDate: string;
    validUntilDate: string;
    voucherRedeemableFromDate: string;
    voucherRedeemableUntilDate: string;
    disputePeriodDuration: string;
    voucherValidDuration: string;
    resolutionPeriodDuration: string;
    metadataUri: string;
    metadataHash: string;
    voided: boolean;
    voidedAt?: string | null;
    disputeResolverId: string;
    numberOfCommits: string;
    numberOfRedemptions: string;
    condition?: {
      __typename?: "ConditionEntity";
      id: string;
      method: number;
      tokenType: number;
      tokenAddress: string;
      tokenId: string;
      threshold: string;
      maxCommits: string;
    } | null;
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
    exchangeToken: {
      __typename?: "ExchangeToken";
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
    disputeResolver: {
      __typename?: "DisputeResolver";
      id: string;
      escalationResponsePeriod: string;
      admin: string;
      clerk: string;
      treasury: string;
      operator: string;
      metadataUri: string;
      active: boolean;
      sellerAllowList: Array<string>;
      fees: Array<{
        __typename?: "DisputeResolverFee";
        id: string;
        tokenAddress: string;
        tokenName: string;
        feeAmount: string;
        token: {
          __typename?: "ExchangeToken";
          id: string;
          address: string;
          decimals: string;
          symbol: string;
          name: string;
        };
      }>;
    };
    disputeResolutionTerms: {
      __typename?: "DisputeResolutionTermsEntity";
      id: string;
      disputeResolverId: string;
      escalationResponsePeriod: string;
      feeAmount: string;
      buyerEscalationDeposit: string;
    };
    metadata?:
      | {
          __typename?: "BaseMetadataEntity";
          name: string;
          description: string;
          externalUrl: string;
          animationUrl?: string | null;
          licenseUrl: string;
          condition?: string | null;
          schemaUrl: string;
          type: MetadataType;
          image: string;
        }
      | {
          __typename?: "ProductV1MetadataEntity";
          createdAt: string;
          voided: boolean;
          validFromDate: string;
          validUntilDate: string;
          quantityAvailable: string;
          uuid: string;
          name: string;
          description: string;
          externalUrl: string;
          animationUrl?: string | null;
          licenseUrl: string;
          condition?: string | null;
          schemaUrl: string;
          type: MetadataType;
          image: string;
          attributes?: Array<{
            __typename?: "MetadataAttribute";
            traitType: string;
            value: string;
            displayType: string;
          }> | null;
          product: {
            __typename?: "ProductV1Product";
            id: string;
            uuid: string;
            version: number;
            title: string;
            description: string;
            identification_sKU?: string | null;
            identification_productId?: string | null;
            identification_productIdType?: string | null;
            productionInformation_brandName: string;
            productionInformation_manufacturer?: string | null;
            productionInformation_manufacturerPartNumber?: string | null;
            productionInformation_modelNumber?: string | null;
            productionInformation_materials?: Array<string> | null;
            details_category?: string | null;
            details_subCategory?: string | null;
            details_subCategory2?: string | null;
            details_offerCategory: string;
            offerCategory: ProductV1OfferCategory;
            details_tags?: Array<string> | null;
            details_sections?: Array<string> | null;
            details_personalisation?: Array<string> | null;
            packaging_packageQuantity?: string | null;
            packaging_dimensions_length?: string | null;
            packaging_dimensions_width?: string | null;
            packaging_dimensions_height?: string | null;
            packaging_dimensions_unit?: string | null;
            packaging_weight_value?: string | null;
            packaging_weight_unit?: string | null;
            brand: { __typename?: "ProductV1Brand"; id: string; name: string };
            category?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            subCategory?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            subCategory2?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            tags?: Array<{
              __typename?: "ProductV1Tag";
              id: string;
              name: string;
            }> | null;
            sections?: Array<{
              __typename?: "ProductV1Section";
              id: string;
              name: string;
            }> | null;
            personalisation?: Array<{
              __typename?: "ProductV1Personalisation";
              id: string;
              name: string;
            }> | null;
            visuals_images: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }>;
            visuals_videos?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            productV1Seller?: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            } | null;
          };
          variations?: Array<{
            __typename?: "ProductV1Variation";
            id: string;
            type: string;
            option: string;
          }> | null;
          productV1Seller: {
            __typename?: "ProductV1Seller";
            id: string;
            defaultVersion: number;
            name?: string | null;
            description?: string | null;
            externalUrl?: string | null;
            tokenId?: string | null;
            sellerId?: string | null;
            images?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            contactLinks?: Array<{
              __typename?: "ProductV1SellerContactLink";
              id: string;
              url: string;
              tag: string;
            }> | null;
            seller: {
              __typename?: "Seller";
              id: string;
              operator: string;
              admin: string;
              clerk: string;
              treasury: string;
              authTokenId: string;
              authTokenType: number;
              voucherCloneAddress: string;
              active: boolean;
              contractURI: string;
              royaltyPercentage: string;
            };
          };
          exchangePolicy: {
            __typename?: "ProductV1ExchangePolicy";
            id: string;
            uuid: string;
            version: number;
            label?: string | null;
            template: string;
            sellerContactMethod: string;
            disputeResolverContactMethod: string;
          };
          shipping?: {
            __typename?: "ProductV1ShippingOption";
            id: string;
            defaultVersion?: number | null;
            countryOfOrigin?: string | null;
            redemptionPoint?: string | null;
            returnPeriodInDays: number;
            supportedJurisdictions?: Array<{
              __typename?: "ProductV1ShippingJurisdiction";
              id: string;
              label: string;
              deliveryTime: string;
            }> | null;
          } | null;
        }
      | null;
  }>;
  funds?: Array<{
    __typename?: "FundsEntity";
    id: string;
    availableAmount: string;
    accountId: string;
  }>;
};

export type BaseExchangeTokenFieldsFragment = {
  __typename?: "ExchangeToken";
  id: string;
  address: string;
  decimals: string;
  symbol: string;
  name: string;
};

export type GetEventLogsQueryQueryVariables = Exact<{
  logsSkip?: InputMaybe<Scalars["Int"]>;
  logsFirst?: InputMaybe<Scalars["Int"]>;
  logsOrderBy?: InputMaybe<EventLog_OrderBy>;
  logsOrderDirection?: InputMaybe<OrderDirection>;
  logsFilter?: InputMaybe<EventLog_Filter>;
}>;

export type GetEventLogsQueryQuery = {
  __typename?: "Query";
  eventLogs: Array<
    | {
        __typename?: "AccountEventLog";
        id: string;
        hash: string;
        type: EventType;
        timestamp: string;
        executedBy: string;
        account:
          | { __typename?: "Buyer"; id: string }
          | { __typename?: "DisputeResolver"; id: string }
          | { __typename?: "Seller"; id: string };
      }
    | {
        __typename?: "DisputeEventLog";
        id: string;
        hash: string;
        type: EventType;
        timestamp: string;
        executedBy: string;
        dispute: { __typename?: "Dispute"; id: string };
        account:
          | { __typename?: "Buyer"; id: string }
          | { __typename?: "DisputeResolver"; id: string }
          | { __typename?: "Seller"; id: string };
      }
    | {
        __typename?: "ExchangeEventLog";
        id: string;
        hash: string;
        type: EventType;
        timestamp: string;
        executedBy: string;
        exchange: {
          __typename?: "Exchange";
          id: string;
          offer: { __typename?: "Offer"; id: string };
        };
        account:
          | { __typename?: "Buyer"; id: string }
          | { __typename?: "DisputeResolver"; id: string }
          | { __typename?: "Seller"; id: string };
      }
    | {
        __typename?: "FundsEventLog";
        id: string;
        hash: string;
        type: EventType;
        timestamp: string;
        executedBy: string;
        funds: { __typename?: "FundsEntity"; id: string };
        account:
          | { __typename?: "Buyer"; id: string }
          | { __typename?: "DisputeResolver"; id: string }
          | { __typename?: "Seller"; id: string };
      }
    | {
        __typename?: "OfferEventLog";
        id: string;
        hash: string;
        type: EventType;
        timestamp: string;
        executedBy: string;
        offer: { __typename?: "Offer"; id: string };
        account:
          | { __typename?: "Buyer"; id: string }
          | { __typename?: "DisputeResolver"; id: string }
          | { __typename?: "Seller"; id: string };
      }
  >;
};

type BaseEventLogFields_AccountEventLog_Fragment = {
  __typename?: "AccountEventLog";
  id: string;
  hash: string;
  type: EventType;
  timestamp: string;
  executedBy: string;
  account:
    | { __typename?: "Buyer"; id: string }
    | { __typename?: "DisputeResolver"; id: string }
    | { __typename?: "Seller"; id: string };
};

type BaseEventLogFields_DisputeEventLog_Fragment = {
  __typename?: "DisputeEventLog";
  id: string;
  hash: string;
  type: EventType;
  timestamp: string;
  executedBy: string;
  dispute: { __typename?: "Dispute"; id: string };
  account:
    | { __typename?: "Buyer"; id: string }
    | { __typename?: "DisputeResolver"; id: string }
    | { __typename?: "Seller"; id: string };
};

type BaseEventLogFields_ExchangeEventLog_Fragment = {
  __typename?: "ExchangeEventLog";
  id: string;
  hash: string;
  type: EventType;
  timestamp: string;
  executedBy: string;
  exchange: {
    __typename?: "Exchange";
    id: string;
    offer: { __typename?: "Offer"; id: string };
  };
  account:
    | { __typename?: "Buyer"; id: string }
    | { __typename?: "DisputeResolver"; id: string }
    | { __typename?: "Seller"; id: string };
};

type BaseEventLogFields_FundsEventLog_Fragment = {
  __typename?: "FundsEventLog";
  id: string;
  hash: string;
  type: EventType;
  timestamp: string;
  executedBy: string;
  funds: { __typename?: "FundsEntity"; id: string };
  account:
    | { __typename?: "Buyer"; id: string }
    | { __typename?: "DisputeResolver"; id: string }
    | { __typename?: "Seller"; id: string };
};

type BaseEventLogFields_OfferEventLog_Fragment = {
  __typename?: "OfferEventLog";
  id: string;
  hash: string;
  type: EventType;
  timestamp: string;
  executedBy: string;
  offer: { __typename?: "Offer"; id: string };
  account:
    | { __typename?: "Buyer"; id: string }
    | { __typename?: "DisputeResolver"; id: string }
    | { __typename?: "Seller"; id: string };
};

export type BaseEventLogFieldsFragment =
  | BaseEventLogFields_AccountEventLog_Fragment
  | BaseEventLogFields_DisputeEventLog_Fragment
  | BaseEventLogFields_ExchangeEventLog_Fragment
  | BaseEventLogFields_FundsEventLog_Fragment
  | BaseEventLogFields_OfferEventLog_Fragment;

export type GetExchangeByIdQueryQueryVariables = Exact<{
  exchangeId: Scalars["ID"];
}>;

export type GetExchangeByIdQueryQuery = {
  __typename?: "Query";
  exchange?: {
    __typename?: "Exchange";
    id: string;
    disputed: boolean;
    state: ExchangeState;
    committedDate: string;
    finalizedDate?: string | null;
    validUntilDate: string;
    redeemedDate?: string | null;
    revokedDate?: string | null;
    cancelledDate?: string | null;
    completedDate?: string | null;
    disputedDate?: string | null;
    expired: boolean;
    offer: {
      __typename?: "Offer";
      id: string;
      createdAt: string;
      price: string;
      sellerDeposit: string;
      protocolFee: string;
      agentFee: string;
      agentId: string;
      buyerCancelPenalty: string;
      quantityAvailable: string;
      quantityInitial: string;
      validFromDate: string;
      validUntilDate: string;
      voucherRedeemableFromDate: string;
      voucherRedeemableUntilDate: string;
      disputePeriodDuration: string;
      voucherValidDuration: string;
      resolutionPeriodDuration: string;
      metadataUri: string;
      metadataHash: string;
      voided: boolean;
      voidedAt?: string | null;
      disputeResolverId: string;
      numberOfCommits: string;
      numberOfRedemptions: string;
      condition?: {
        __typename?: "ConditionEntity";
        id: string;
        method: number;
        tokenType: number;
        tokenAddress: string;
        tokenId: string;
        threshold: string;
        maxCommits: string;
      } | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
      exchangeToken: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
      disputeResolver: {
        __typename?: "DisputeResolver";
        id: string;
        escalationResponsePeriod: string;
        admin: string;
        clerk: string;
        treasury: string;
        operator: string;
        metadataUri: string;
        active: boolean;
        sellerAllowList: Array<string>;
        fees: Array<{
          __typename?: "DisputeResolverFee";
          id: string;
          tokenAddress: string;
          tokenName: string;
          feeAmount: string;
          token: {
            __typename?: "ExchangeToken";
            id: string;
            address: string;
            decimals: string;
            symbol: string;
            name: string;
          };
        }>;
      };
      disputeResolutionTerms: {
        __typename?: "DisputeResolutionTermsEntity";
        id: string;
        disputeResolverId: string;
        escalationResponsePeriod: string;
        feeAmount: string;
        buyerEscalationDeposit: string;
      };
      metadata?:
        | {
            __typename?: "BaseMetadataEntity";
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
          }
        | {
            __typename?: "ProductV1MetadataEntity";
            createdAt: string;
            voided: boolean;
            validFromDate: string;
            validUntilDate: string;
            quantityAvailable: string;
            uuid: string;
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
            attributes?: Array<{
              __typename?: "MetadataAttribute";
              traitType: string;
              value: string;
              displayType: string;
            }> | null;
            product: {
              __typename?: "ProductV1Product";
              id: string;
              uuid: string;
              version: number;
              title: string;
              description: string;
              identification_sKU?: string | null;
              identification_productId?: string | null;
              identification_productIdType?: string | null;
              productionInformation_brandName: string;
              productionInformation_manufacturer?: string | null;
              productionInformation_manufacturerPartNumber?: string | null;
              productionInformation_modelNumber?: string | null;
              productionInformation_materials?: Array<string> | null;
              details_category?: string | null;
              details_subCategory?: string | null;
              details_subCategory2?: string | null;
              details_offerCategory: string;
              offerCategory: ProductV1OfferCategory;
              details_tags?: Array<string> | null;
              details_sections?: Array<string> | null;
              details_personalisation?: Array<string> | null;
              packaging_packageQuantity?: string | null;
              packaging_dimensions_length?: string | null;
              packaging_dimensions_width?: string | null;
              packaging_dimensions_height?: string | null;
              packaging_dimensions_unit?: string | null;
              packaging_weight_value?: string | null;
              packaging_weight_unit?: string | null;
              brand: {
                __typename?: "ProductV1Brand";
                id: string;
                name: string;
              };
              category?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory2?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              tags?: Array<{
                __typename?: "ProductV1Tag";
                id: string;
                name: string;
              }> | null;
              sections?: Array<{
                __typename?: "ProductV1Section";
                id: string;
                name: string;
              }> | null;
              personalisation?: Array<{
                __typename?: "ProductV1Personalisation";
                id: string;
                name: string;
              }> | null;
              visuals_images: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }>;
              visuals_videos?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              productV1Seller?: {
                __typename?: "ProductV1Seller";
                id: string;
                defaultVersion: number;
                name?: string | null;
                description?: string | null;
                externalUrl?: string | null;
                tokenId?: string | null;
                sellerId?: string | null;
                images?: Array<{
                  __typename?: "ProductV1Media";
                  id: string;
                  url: string;
                  tag?: string | null;
                  type: ProductV1MediaType;
                }> | null;
                contactLinks?: Array<{
                  __typename?: "ProductV1SellerContactLink";
                  id: string;
                  url: string;
                  tag: string;
                }> | null;
                seller: {
                  __typename?: "Seller";
                  id: string;
                  operator: string;
                  admin: string;
                  clerk: string;
                  treasury: string;
                  authTokenId: string;
                  authTokenType: number;
                  voucherCloneAddress: string;
                  active: boolean;
                  contractURI: string;
                  royaltyPercentage: string;
                };
              } | null;
            };
            variations?: Array<{
              __typename?: "ProductV1Variation";
              id: string;
              type: string;
              option: string;
            }> | null;
            productV1Seller: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            };
            exchangePolicy: {
              __typename?: "ProductV1ExchangePolicy";
              id: string;
              uuid: string;
              version: number;
              label?: string | null;
              template: string;
              sellerContactMethod: string;
              disputeResolverContactMethod: string;
            };
            shipping?: {
              __typename?: "ProductV1ShippingOption";
              id: string;
              defaultVersion?: number | null;
              countryOfOrigin?: string | null;
              redemptionPoint?: string | null;
              returnPeriodInDays: number;
              supportedJurisdictions?: Array<{
                __typename?: "ProductV1ShippingJurisdiction";
                id: string;
                label: string;
                deliveryTime: string;
              }> | null;
            } | null;
          }
        | null;
    };
    dispute?: {
      __typename?: "Dispute";
      id: string;
      exchangeId: string;
      state: DisputeState;
      buyerPercent: string;
      disputedDate: string;
      escalatedDate?: string | null;
      finalizedDate?: string | null;
      retractedDate?: string | null;
      resolvedDate?: string | null;
      decidedDate?: string | null;
      refusedDate?: string | null;
      timeout: string;
    } | null;
    buyer: {
      __typename?: "Buyer";
      id: string;
      wallet: string;
      active: boolean;
    };
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
  } | null;
};

export type GetExchangesQueryQueryVariables = Exact<{
  exchangesSkip?: InputMaybe<Scalars["Int"]>;
  exchangesFirst?: InputMaybe<Scalars["Int"]>;
  exchangesOrderBy?: InputMaybe<Exchange_OrderBy>;
  exchangesOrderDirection?: InputMaybe<OrderDirection>;
  exchangesFilter?: InputMaybe<Exchange_Filter>;
}>;

export type GetExchangesQueryQuery = {
  __typename?: "Query";
  exchanges: Array<{
    __typename?: "Exchange";
    id: string;
    disputed: boolean;
    state: ExchangeState;
    committedDate: string;
    finalizedDate?: string | null;
    validUntilDate: string;
    redeemedDate?: string | null;
    revokedDate?: string | null;
    cancelledDate?: string | null;
    completedDate?: string | null;
    disputedDate?: string | null;
    expired: boolean;
    offer: {
      __typename?: "Offer";
      id: string;
      createdAt: string;
      price: string;
      sellerDeposit: string;
      protocolFee: string;
      agentFee: string;
      agentId: string;
      buyerCancelPenalty: string;
      quantityAvailable: string;
      quantityInitial: string;
      validFromDate: string;
      validUntilDate: string;
      voucherRedeemableFromDate: string;
      voucherRedeemableUntilDate: string;
      disputePeriodDuration: string;
      voucherValidDuration: string;
      resolutionPeriodDuration: string;
      metadataUri: string;
      metadataHash: string;
      voided: boolean;
      voidedAt?: string | null;
      disputeResolverId: string;
      numberOfCommits: string;
      numberOfRedemptions: string;
      condition?: {
        __typename?: "ConditionEntity";
        id: string;
        method: number;
        tokenType: number;
        tokenAddress: string;
        tokenId: string;
        threshold: string;
        maxCommits: string;
      } | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
      exchangeToken: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
      disputeResolver: {
        __typename?: "DisputeResolver";
        id: string;
        escalationResponsePeriod: string;
        admin: string;
        clerk: string;
        treasury: string;
        operator: string;
        metadataUri: string;
        active: boolean;
        sellerAllowList: Array<string>;
        fees: Array<{
          __typename?: "DisputeResolverFee";
          id: string;
          tokenAddress: string;
          tokenName: string;
          feeAmount: string;
          token: {
            __typename?: "ExchangeToken";
            id: string;
            address: string;
            decimals: string;
            symbol: string;
            name: string;
          };
        }>;
      };
      disputeResolutionTerms: {
        __typename?: "DisputeResolutionTermsEntity";
        id: string;
        disputeResolverId: string;
        escalationResponsePeriod: string;
        feeAmount: string;
        buyerEscalationDeposit: string;
      };
      metadata?:
        | {
            __typename?: "BaseMetadataEntity";
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
          }
        | {
            __typename?: "ProductV1MetadataEntity";
            createdAt: string;
            voided: boolean;
            validFromDate: string;
            validUntilDate: string;
            quantityAvailable: string;
            uuid: string;
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
            attributes?: Array<{
              __typename?: "MetadataAttribute";
              traitType: string;
              value: string;
              displayType: string;
            }> | null;
            product: {
              __typename?: "ProductV1Product";
              id: string;
              uuid: string;
              version: number;
              title: string;
              description: string;
              identification_sKU?: string | null;
              identification_productId?: string | null;
              identification_productIdType?: string | null;
              productionInformation_brandName: string;
              productionInformation_manufacturer?: string | null;
              productionInformation_manufacturerPartNumber?: string | null;
              productionInformation_modelNumber?: string | null;
              productionInformation_materials?: Array<string> | null;
              details_category?: string | null;
              details_subCategory?: string | null;
              details_subCategory2?: string | null;
              details_offerCategory: string;
              offerCategory: ProductV1OfferCategory;
              details_tags?: Array<string> | null;
              details_sections?: Array<string> | null;
              details_personalisation?: Array<string> | null;
              packaging_packageQuantity?: string | null;
              packaging_dimensions_length?: string | null;
              packaging_dimensions_width?: string | null;
              packaging_dimensions_height?: string | null;
              packaging_dimensions_unit?: string | null;
              packaging_weight_value?: string | null;
              packaging_weight_unit?: string | null;
              brand: {
                __typename?: "ProductV1Brand";
                id: string;
                name: string;
              };
              category?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory2?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              tags?: Array<{
                __typename?: "ProductV1Tag";
                id: string;
                name: string;
              }> | null;
              sections?: Array<{
                __typename?: "ProductV1Section";
                id: string;
                name: string;
              }> | null;
              personalisation?: Array<{
                __typename?: "ProductV1Personalisation";
                id: string;
                name: string;
              }> | null;
              visuals_images: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }>;
              visuals_videos?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              productV1Seller?: {
                __typename?: "ProductV1Seller";
                id: string;
                defaultVersion: number;
                name?: string | null;
                description?: string | null;
                externalUrl?: string | null;
                tokenId?: string | null;
                sellerId?: string | null;
                images?: Array<{
                  __typename?: "ProductV1Media";
                  id: string;
                  url: string;
                  tag?: string | null;
                  type: ProductV1MediaType;
                }> | null;
                contactLinks?: Array<{
                  __typename?: "ProductV1SellerContactLink";
                  id: string;
                  url: string;
                  tag: string;
                }> | null;
                seller: {
                  __typename?: "Seller";
                  id: string;
                  operator: string;
                  admin: string;
                  clerk: string;
                  treasury: string;
                  authTokenId: string;
                  authTokenType: number;
                  voucherCloneAddress: string;
                  active: boolean;
                  contractURI: string;
                  royaltyPercentage: string;
                };
              } | null;
            };
            variations?: Array<{
              __typename?: "ProductV1Variation";
              id: string;
              type: string;
              option: string;
            }> | null;
            productV1Seller: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            };
            exchangePolicy: {
              __typename?: "ProductV1ExchangePolicy";
              id: string;
              uuid: string;
              version: number;
              label?: string | null;
              template: string;
              sellerContactMethod: string;
              disputeResolverContactMethod: string;
            };
            shipping?: {
              __typename?: "ProductV1ShippingOption";
              id: string;
              defaultVersion?: number | null;
              countryOfOrigin?: string | null;
              redemptionPoint?: string | null;
              returnPeriodInDays: number;
              supportedJurisdictions?: Array<{
                __typename?: "ProductV1ShippingJurisdiction";
                id: string;
                label: string;
                deliveryTime: string;
              }> | null;
            } | null;
          }
        | null;
    };
    dispute?: {
      __typename?: "Dispute";
      id: string;
      exchangeId: string;
      state: DisputeState;
      buyerPercent: string;
      disputedDate: string;
      escalatedDate?: string | null;
      finalizedDate?: string | null;
      retractedDate?: string | null;
      resolvedDate?: string | null;
      decidedDate?: string | null;
      refusedDate?: string | null;
      timeout: string;
    } | null;
    buyer: {
      __typename?: "Buyer";
      id: string;
      wallet: string;
      active: boolean;
    };
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
  }>;
};

export type ExchangeFieldsFragment = {
  __typename?: "Exchange";
  id: string;
  disputed: boolean;
  state: ExchangeState;
  committedDate: string;
  finalizedDate?: string | null;
  validUntilDate: string;
  redeemedDate?: string | null;
  revokedDate?: string | null;
  cancelledDate?: string | null;
  completedDate?: string | null;
  disputedDate?: string | null;
  expired: boolean;
  offer: {
    __typename?: "Offer";
    id: string;
    createdAt: string;
    price: string;
    sellerDeposit: string;
    protocolFee: string;
    agentFee: string;
    agentId: string;
    buyerCancelPenalty: string;
    quantityAvailable: string;
    quantityInitial: string;
    validFromDate: string;
    validUntilDate: string;
    voucherRedeemableFromDate: string;
    voucherRedeemableUntilDate: string;
    disputePeriodDuration: string;
    voucherValidDuration: string;
    resolutionPeriodDuration: string;
    metadataUri: string;
    metadataHash: string;
    voided: boolean;
    voidedAt?: string | null;
    disputeResolverId: string;
    numberOfCommits: string;
    numberOfRedemptions: string;
    condition?: {
      __typename?: "ConditionEntity";
      id: string;
      method: number;
      tokenType: number;
      tokenAddress: string;
      tokenId: string;
      threshold: string;
      maxCommits: string;
    } | null;
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
    exchangeToken: {
      __typename?: "ExchangeToken";
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
    disputeResolver: {
      __typename?: "DisputeResolver";
      id: string;
      escalationResponsePeriod: string;
      admin: string;
      clerk: string;
      treasury: string;
      operator: string;
      metadataUri: string;
      active: boolean;
      sellerAllowList: Array<string>;
      fees: Array<{
        __typename?: "DisputeResolverFee";
        id: string;
        tokenAddress: string;
        tokenName: string;
        feeAmount: string;
        token: {
          __typename?: "ExchangeToken";
          id: string;
          address: string;
          decimals: string;
          symbol: string;
          name: string;
        };
      }>;
    };
    disputeResolutionTerms: {
      __typename?: "DisputeResolutionTermsEntity";
      id: string;
      disputeResolverId: string;
      escalationResponsePeriod: string;
      feeAmount: string;
      buyerEscalationDeposit: string;
    };
    metadata?:
      | {
          __typename?: "BaseMetadataEntity";
          name: string;
          description: string;
          externalUrl: string;
          animationUrl?: string | null;
          licenseUrl: string;
          condition?: string | null;
          schemaUrl: string;
          type: MetadataType;
          image: string;
        }
      | {
          __typename?: "ProductV1MetadataEntity";
          createdAt: string;
          voided: boolean;
          validFromDate: string;
          validUntilDate: string;
          quantityAvailable: string;
          uuid: string;
          name: string;
          description: string;
          externalUrl: string;
          animationUrl?: string | null;
          licenseUrl: string;
          condition?: string | null;
          schemaUrl: string;
          type: MetadataType;
          image: string;
          attributes?: Array<{
            __typename?: "MetadataAttribute";
            traitType: string;
            value: string;
            displayType: string;
          }> | null;
          product: {
            __typename?: "ProductV1Product";
            id: string;
            uuid: string;
            version: number;
            title: string;
            description: string;
            identification_sKU?: string | null;
            identification_productId?: string | null;
            identification_productIdType?: string | null;
            productionInformation_brandName: string;
            productionInformation_manufacturer?: string | null;
            productionInformation_manufacturerPartNumber?: string | null;
            productionInformation_modelNumber?: string | null;
            productionInformation_materials?: Array<string> | null;
            details_category?: string | null;
            details_subCategory?: string | null;
            details_subCategory2?: string | null;
            details_offerCategory: string;
            offerCategory: ProductV1OfferCategory;
            details_tags?: Array<string> | null;
            details_sections?: Array<string> | null;
            details_personalisation?: Array<string> | null;
            packaging_packageQuantity?: string | null;
            packaging_dimensions_length?: string | null;
            packaging_dimensions_width?: string | null;
            packaging_dimensions_height?: string | null;
            packaging_dimensions_unit?: string | null;
            packaging_weight_value?: string | null;
            packaging_weight_unit?: string | null;
            brand: { __typename?: "ProductV1Brand"; id: string; name: string };
            category?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            subCategory?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            subCategory2?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            tags?: Array<{
              __typename?: "ProductV1Tag";
              id: string;
              name: string;
            }> | null;
            sections?: Array<{
              __typename?: "ProductV1Section";
              id: string;
              name: string;
            }> | null;
            personalisation?: Array<{
              __typename?: "ProductV1Personalisation";
              id: string;
              name: string;
            }> | null;
            visuals_images: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }>;
            visuals_videos?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            productV1Seller?: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            } | null;
          };
          variations?: Array<{
            __typename?: "ProductV1Variation";
            id: string;
            type: string;
            option: string;
          }> | null;
          productV1Seller: {
            __typename?: "ProductV1Seller";
            id: string;
            defaultVersion: number;
            name?: string | null;
            description?: string | null;
            externalUrl?: string | null;
            tokenId?: string | null;
            sellerId?: string | null;
            images?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            contactLinks?: Array<{
              __typename?: "ProductV1SellerContactLink";
              id: string;
              url: string;
              tag: string;
            }> | null;
            seller: {
              __typename?: "Seller";
              id: string;
              operator: string;
              admin: string;
              clerk: string;
              treasury: string;
              authTokenId: string;
              authTokenType: number;
              voucherCloneAddress: string;
              active: boolean;
              contractURI: string;
              royaltyPercentage: string;
            };
          };
          exchangePolicy: {
            __typename?: "ProductV1ExchangePolicy";
            id: string;
            uuid: string;
            version: number;
            label?: string | null;
            template: string;
            sellerContactMethod: string;
            disputeResolverContactMethod: string;
          };
          shipping?: {
            __typename?: "ProductV1ShippingOption";
            id: string;
            defaultVersion?: number | null;
            countryOfOrigin?: string | null;
            redemptionPoint?: string | null;
            returnPeriodInDays: number;
            supportedJurisdictions?: Array<{
              __typename?: "ProductV1ShippingJurisdiction";
              id: string;
              label: string;
              deliveryTime: string;
            }> | null;
          } | null;
        }
      | null;
  };
  dispute?: {
    __typename?: "Dispute";
    id: string;
    exchangeId: string;
    state: DisputeState;
    buyerPercent: string;
    disputedDate: string;
    escalatedDate?: string | null;
    finalizedDate?: string | null;
    retractedDate?: string | null;
    resolvedDate?: string | null;
    decidedDate?: string | null;
    refusedDate?: string | null;
    timeout: string;
  } | null;
  buyer: { __typename?: "Buyer"; id: string; wallet: string; active: boolean };
  seller: {
    __typename?: "Seller";
    id: string;
    operator: string;
    admin: string;
    clerk: string;
    treasury: string;
    authTokenId: string;
    authTokenType: number;
    voucherCloneAddress: string;
    active: boolean;
    contractURI: string;
    royaltyPercentage: string;
  };
};

export type BaseExchangeFieldsFragment = {
  __typename?: "Exchange";
  id: string;
  disputed: boolean;
  state: ExchangeState;
  committedDate: string;
  finalizedDate?: string | null;
  validUntilDate: string;
  redeemedDate?: string | null;
  revokedDate?: string | null;
  cancelledDate?: string | null;
  completedDate?: string | null;
  disputedDate?: string | null;
  expired: boolean;
  dispute?: {
    __typename?: "Dispute";
    id: string;
    exchangeId: string;
    state: DisputeState;
    buyerPercent: string;
    disputedDate: string;
    escalatedDate?: string | null;
    finalizedDate?: string | null;
    retractedDate?: string | null;
    resolvedDate?: string | null;
    decidedDate?: string | null;
    refusedDate?: string | null;
    timeout: string;
  } | null;
  buyer: { __typename?: "Buyer"; id: string; wallet: string; active: boolean };
  seller: {
    __typename?: "Seller";
    id: string;
    operator: string;
    admin: string;
    clerk: string;
    treasury: string;
    authTokenId: string;
    authTokenType: number;
    voucherCloneAddress: string;
    active: boolean;
    contractURI: string;
    royaltyPercentage: string;
  };
};

export type GetFundsByIdQueryVariables = Exact<{
  fundsId: Scalars["ID"];
}>;

export type GetFundsByIdQuery = {
  __typename?: "Query";
  fundsEntity?: {
    __typename?: "FundsEntity";
    id: string;
    availableAmount: string;
    accountId: string;
    token: {
      __typename?: "ExchangeToken";
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
  } | null;
};

export type GetFundsQueryVariables = Exact<{
  fundsSkip?: InputMaybe<Scalars["Int"]>;
  fundsFirst?: InputMaybe<Scalars["Int"]>;
  fundsOrderBy?: InputMaybe<FundsEntity_OrderBy>;
  fundsOrderDirection?: InputMaybe<OrderDirection>;
  fundsFilter?: InputMaybe<FundsEntity_Filter>;
}>;

export type GetFundsQuery = {
  __typename?: "Query";
  fundsEntities: Array<{
    __typename?: "FundsEntity";
    id: string;
    availableAmount: string;
    accountId: string;
    token: {
      __typename?: "ExchangeToken";
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
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
    id: string;
    address: string;
    decimals: string;
    symbol: string;
    name: string;
  };
};

export type BaseFundsEntityFieldsFragment = {
  __typename?: "FundsEntity";
  id: string;
  availableAmount: string;
  accountId: string;
};

export type BaseConditionFieldsFragment = {
  __typename?: "ConditionEntity";
  id: string;
  method: number;
  tokenType: number;
  tokenAddress: string;
  tokenId: string;
  threshold: string;
  maxCommits: string;
};

export type GetBaseMetadataEntityByIdQueryQueryVariables = Exact<{
  metadataId: Scalars["ID"];
  metadataSkip?: InputMaybe<Scalars["Int"]>;
  metadataFirst?: InputMaybe<Scalars["Int"]>;
  metadataOrderBy?: InputMaybe<BaseMetadataEntity_OrderBy>;
  metadataOrderDirection?: InputMaybe<OrderDirection>;
  metadataFilter?: InputMaybe<BaseMetadataEntity_Filter>;
}>;

export type GetBaseMetadataEntityByIdQueryQuery = {
  __typename?: "Query";
  baseMetadataEntity?: {
    __typename?: "BaseMetadataEntity";
    id: string;
    name: string;
    description: string;
    externalUrl: string;
    animationUrl?: string | null;
    licenseUrl: string;
    condition?: string | null;
    schemaUrl: string;
    type: MetadataType;
    image: string;
    createdAt: string;
    voided: boolean;
    validFromDate: string;
    validUntilDate: string;
    quantityAvailable: string;
    numberOfCommits: string;
    numberOfRedemptions: string;
    attributes?: Array<{
      __typename?: "MetadataAttribute";
      traitType: string;
      value: string;
      displayType: string;
    }> | null;
    offer: {
      __typename?: "Offer";
      id: string;
      createdAt: string;
      price: string;
      sellerDeposit: string;
      protocolFee: string;
      agentFee: string;
      agentId: string;
      buyerCancelPenalty: string;
      quantityAvailable: string;
      quantityInitial: string;
      validFromDate: string;
      validUntilDate: string;
      voucherRedeemableFromDate: string;
      voucherRedeemableUntilDate: string;
      disputePeriodDuration: string;
      voucherValidDuration: string;
      resolutionPeriodDuration: string;
      metadataUri: string;
      metadataHash: string;
      voided: boolean;
      voidedAt?: string | null;
      disputeResolverId: string;
      numberOfCommits: string;
      numberOfRedemptions: string;
      condition?: {
        __typename?: "ConditionEntity";
        id: string;
        method: number;
        tokenType: number;
        tokenAddress: string;
        tokenId: string;
        threshold: string;
        maxCommits: string;
      } | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
      exchangeToken: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
      disputeResolver: {
        __typename?: "DisputeResolver";
        id: string;
        escalationResponsePeriod: string;
        admin: string;
        clerk: string;
        treasury: string;
        operator: string;
        metadataUri: string;
        active: boolean;
        sellerAllowList: Array<string>;
        fees: Array<{
          __typename?: "DisputeResolverFee";
          id: string;
          tokenAddress: string;
          tokenName: string;
          feeAmount: string;
          token: {
            __typename?: "ExchangeToken";
            id: string;
            address: string;
            decimals: string;
            symbol: string;
            name: string;
          };
        }>;
      };
      disputeResolutionTerms: {
        __typename?: "DisputeResolutionTermsEntity";
        id: string;
        disputeResolverId: string;
        escalationResponsePeriod: string;
        feeAmount: string;
        buyerEscalationDeposit: string;
      };
      metadata?:
        | {
            __typename?: "BaseMetadataEntity";
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
          }
        | {
            __typename?: "ProductV1MetadataEntity";
            createdAt: string;
            voided: boolean;
            validFromDate: string;
            validUntilDate: string;
            quantityAvailable: string;
            uuid: string;
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
            attributes?: Array<{
              __typename?: "MetadataAttribute";
              traitType: string;
              value: string;
              displayType: string;
            }> | null;
            product: {
              __typename?: "ProductV1Product";
              id: string;
              uuid: string;
              version: number;
              title: string;
              description: string;
              identification_sKU?: string | null;
              identification_productId?: string | null;
              identification_productIdType?: string | null;
              productionInformation_brandName: string;
              productionInformation_manufacturer?: string | null;
              productionInformation_manufacturerPartNumber?: string | null;
              productionInformation_modelNumber?: string | null;
              productionInformation_materials?: Array<string> | null;
              details_category?: string | null;
              details_subCategory?: string | null;
              details_subCategory2?: string | null;
              details_offerCategory: string;
              offerCategory: ProductV1OfferCategory;
              details_tags?: Array<string> | null;
              details_sections?: Array<string> | null;
              details_personalisation?: Array<string> | null;
              packaging_packageQuantity?: string | null;
              packaging_dimensions_length?: string | null;
              packaging_dimensions_width?: string | null;
              packaging_dimensions_height?: string | null;
              packaging_dimensions_unit?: string | null;
              packaging_weight_value?: string | null;
              packaging_weight_unit?: string | null;
              brand: {
                __typename?: "ProductV1Brand";
                id: string;
                name: string;
              };
              category?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory2?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              tags?: Array<{
                __typename?: "ProductV1Tag";
                id: string;
                name: string;
              }> | null;
              sections?: Array<{
                __typename?: "ProductV1Section";
                id: string;
                name: string;
              }> | null;
              personalisation?: Array<{
                __typename?: "ProductV1Personalisation";
                id: string;
                name: string;
              }> | null;
              visuals_images: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }>;
              visuals_videos?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              productV1Seller?: {
                __typename?: "ProductV1Seller";
                id: string;
                defaultVersion: number;
                name?: string | null;
                description?: string | null;
                externalUrl?: string | null;
                tokenId?: string | null;
                sellerId?: string | null;
                images?: Array<{
                  __typename?: "ProductV1Media";
                  id: string;
                  url: string;
                  tag?: string | null;
                  type: ProductV1MediaType;
                }> | null;
                contactLinks?: Array<{
                  __typename?: "ProductV1SellerContactLink";
                  id: string;
                  url: string;
                  tag: string;
                }> | null;
                seller: {
                  __typename?: "Seller";
                  id: string;
                  operator: string;
                  admin: string;
                  clerk: string;
                  treasury: string;
                  authTokenId: string;
                  authTokenType: number;
                  voucherCloneAddress: string;
                  active: boolean;
                  contractURI: string;
                  royaltyPercentage: string;
                };
              } | null;
            };
            variations?: Array<{
              __typename?: "ProductV1Variation";
              id: string;
              type: string;
              option: string;
            }> | null;
            productV1Seller: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            };
            exchangePolicy: {
              __typename?: "ProductV1ExchangePolicy";
              id: string;
              uuid: string;
              version: number;
              label?: string | null;
              template: string;
              sellerContactMethod: string;
              disputeResolverContactMethod: string;
            };
            shipping?: {
              __typename?: "ProductV1ShippingOption";
              id: string;
              defaultVersion?: number | null;
              countryOfOrigin?: string | null;
              redemptionPoint?: string | null;
              returnPeriodInDays: number;
              supportedJurisdictions?: Array<{
                __typename?: "ProductV1ShippingJurisdiction";
                id: string;
                label: string;
                deliveryTime: string;
              }> | null;
            } | null;
          }
        | null;
    };
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
    exchangeToken: {
      __typename?: "ExchangeToken";
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
  } | null;
};

export type GetBaseMetadataEntitiesQueryQueryVariables = Exact<{
  metadataSkip?: InputMaybe<Scalars["Int"]>;
  metadataFirst?: InputMaybe<Scalars["Int"]>;
  metadataOrderBy?: InputMaybe<BaseMetadataEntity_OrderBy>;
  metadataOrderDirection?: InputMaybe<OrderDirection>;
  metadataFilter?: InputMaybe<BaseMetadataEntity_Filter>;
}>;

export type GetBaseMetadataEntitiesQueryQuery = {
  __typename?: "Query";
  baseMetadataEntities: Array<{
    __typename?: "BaseMetadataEntity";
    id: string;
    name: string;
    description: string;
    externalUrl: string;
    animationUrl?: string | null;
    licenseUrl: string;
    condition?: string | null;
    schemaUrl: string;
    type: MetadataType;
    image: string;
    createdAt: string;
    voided: boolean;
    validFromDate: string;
    validUntilDate: string;
    quantityAvailable: string;
    numberOfCommits: string;
    numberOfRedemptions: string;
    attributes?: Array<{
      __typename?: "MetadataAttribute";
      traitType: string;
      value: string;
      displayType: string;
    }> | null;
    offer: {
      __typename?: "Offer";
      id: string;
      createdAt: string;
      price: string;
      sellerDeposit: string;
      protocolFee: string;
      agentFee: string;
      agentId: string;
      buyerCancelPenalty: string;
      quantityAvailable: string;
      quantityInitial: string;
      validFromDate: string;
      validUntilDate: string;
      voucherRedeemableFromDate: string;
      voucherRedeemableUntilDate: string;
      disputePeriodDuration: string;
      voucherValidDuration: string;
      resolutionPeriodDuration: string;
      metadataUri: string;
      metadataHash: string;
      voided: boolean;
      voidedAt?: string | null;
      disputeResolverId: string;
      numberOfCommits: string;
      numberOfRedemptions: string;
      condition?: {
        __typename?: "ConditionEntity";
        id: string;
        method: number;
        tokenType: number;
        tokenAddress: string;
        tokenId: string;
        threshold: string;
        maxCommits: string;
      } | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
      exchangeToken: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
      disputeResolver: {
        __typename?: "DisputeResolver";
        id: string;
        escalationResponsePeriod: string;
        admin: string;
        clerk: string;
        treasury: string;
        operator: string;
        metadataUri: string;
        active: boolean;
        sellerAllowList: Array<string>;
        fees: Array<{
          __typename?: "DisputeResolverFee";
          id: string;
          tokenAddress: string;
          tokenName: string;
          feeAmount: string;
          token: {
            __typename?: "ExchangeToken";
            id: string;
            address: string;
            decimals: string;
            symbol: string;
            name: string;
          };
        }>;
      };
      disputeResolutionTerms: {
        __typename?: "DisputeResolutionTermsEntity";
        id: string;
        disputeResolverId: string;
        escalationResponsePeriod: string;
        feeAmount: string;
        buyerEscalationDeposit: string;
      };
      metadata?:
        | {
            __typename?: "BaseMetadataEntity";
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
          }
        | {
            __typename?: "ProductV1MetadataEntity";
            createdAt: string;
            voided: boolean;
            validFromDate: string;
            validUntilDate: string;
            quantityAvailable: string;
            uuid: string;
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
            attributes?: Array<{
              __typename?: "MetadataAttribute";
              traitType: string;
              value: string;
              displayType: string;
            }> | null;
            product: {
              __typename?: "ProductV1Product";
              id: string;
              uuid: string;
              version: number;
              title: string;
              description: string;
              identification_sKU?: string | null;
              identification_productId?: string | null;
              identification_productIdType?: string | null;
              productionInformation_brandName: string;
              productionInformation_manufacturer?: string | null;
              productionInformation_manufacturerPartNumber?: string | null;
              productionInformation_modelNumber?: string | null;
              productionInformation_materials?: Array<string> | null;
              details_category?: string | null;
              details_subCategory?: string | null;
              details_subCategory2?: string | null;
              details_offerCategory: string;
              offerCategory: ProductV1OfferCategory;
              details_tags?: Array<string> | null;
              details_sections?: Array<string> | null;
              details_personalisation?: Array<string> | null;
              packaging_packageQuantity?: string | null;
              packaging_dimensions_length?: string | null;
              packaging_dimensions_width?: string | null;
              packaging_dimensions_height?: string | null;
              packaging_dimensions_unit?: string | null;
              packaging_weight_value?: string | null;
              packaging_weight_unit?: string | null;
              brand: {
                __typename?: "ProductV1Brand";
                id: string;
                name: string;
              };
              category?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory2?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              tags?: Array<{
                __typename?: "ProductV1Tag";
                id: string;
                name: string;
              }> | null;
              sections?: Array<{
                __typename?: "ProductV1Section";
                id: string;
                name: string;
              }> | null;
              personalisation?: Array<{
                __typename?: "ProductV1Personalisation";
                id: string;
                name: string;
              }> | null;
              visuals_images: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }>;
              visuals_videos?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              productV1Seller?: {
                __typename?: "ProductV1Seller";
                id: string;
                defaultVersion: number;
                name?: string | null;
                description?: string | null;
                externalUrl?: string | null;
                tokenId?: string | null;
                sellerId?: string | null;
                images?: Array<{
                  __typename?: "ProductV1Media";
                  id: string;
                  url: string;
                  tag?: string | null;
                  type: ProductV1MediaType;
                }> | null;
                contactLinks?: Array<{
                  __typename?: "ProductV1SellerContactLink";
                  id: string;
                  url: string;
                  tag: string;
                }> | null;
                seller: {
                  __typename?: "Seller";
                  id: string;
                  operator: string;
                  admin: string;
                  clerk: string;
                  treasury: string;
                  authTokenId: string;
                  authTokenType: number;
                  voucherCloneAddress: string;
                  active: boolean;
                  contractURI: string;
                  royaltyPercentage: string;
                };
              } | null;
            };
            variations?: Array<{
              __typename?: "ProductV1Variation";
              id: string;
              type: string;
              option: string;
            }> | null;
            productV1Seller: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            };
            exchangePolicy: {
              __typename?: "ProductV1ExchangePolicy";
              id: string;
              uuid: string;
              version: number;
              label?: string | null;
              template: string;
              sellerContactMethod: string;
              disputeResolverContactMethod: string;
            };
            shipping?: {
              __typename?: "ProductV1ShippingOption";
              id: string;
              defaultVersion?: number | null;
              countryOfOrigin?: string | null;
              redemptionPoint?: string | null;
              returnPeriodInDays: number;
              supportedJurisdictions?: Array<{
                __typename?: "ProductV1ShippingJurisdiction";
                id: string;
                label: string;
                deliveryTime: string;
              }> | null;
            } | null;
          }
        | null;
    };
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
    exchangeToken: {
      __typename?: "ExchangeToken";
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
  }>;
};

export type BaseMetadataEntityFieldsFragment = {
  __typename?: "BaseMetadataEntity";
  id: string;
  name: string;
  description: string;
  externalUrl: string;
  animationUrl?: string | null;
  licenseUrl: string;
  condition?: string | null;
  schemaUrl: string;
  type: MetadataType;
  image: string;
  createdAt: string;
  voided: boolean;
  validFromDate: string;
  validUntilDate: string;
  quantityAvailable: string;
  numberOfCommits: string;
  numberOfRedemptions: string;
  attributes?: Array<{
    __typename?: "MetadataAttribute";
    traitType: string;
    value: string;
    displayType: string;
  }> | null;
  offer: {
    __typename?: "Offer";
    id: string;
    createdAt: string;
    price: string;
    sellerDeposit: string;
    protocolFee: string;
    agentFee: string;
    agentId: string;
    buyerCancelPenalty: string;
    quantityAvailable: string;
    quantityInitial: string;
    validFromDate: string;
    validUntilDate: string;
    voucherRedeemableFromDate: string;
    voucherRedeemableUntilDate: string;
    disputePeriodDuration: string;
    voucherValidDuration: string;
    resolutionPeriodDuration: string;
    metadataUri: string;
    metadataHash: string;
    voided: boolean;
    voidedAt?: string | null;
    disputeResolverId: string;
    numberOfCommits: string;
    numberOfRedemptions: string;
    condition?: {
      __typename?: "ConditionEntity";
      id: string;
      method: number;
      tokenType: number;
      tokenAddress: string;
      tokenId: string;
      threshold: string;
      maxCommits: string;
    } | null;
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
    exchangeToken: {
      __typename?: "ExchangeToken";
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
    disputeResolver: {
      __typename?: "DisputeResolver";
      id: string;
      escalationResponsePeriod: string;
      admin: string;
      clerk: string;
      treasury: string;
      operator: string;
      metadataUri: string;
      active: boolean;
      sellerAllowList: Array<string>;
      fees: Array<{
        __typename?: "DisputeResolverFee";
        id: string;
        tokenAddress: string;
        tokenName: string;
        feeAmount: string;
        token: {
          __typename?: "ExchangeToken";
          id: string;
          address: string;
          decimals: string;
          symbol: string;
          name: string;
        };
      }>;
    };
    disputeResolutionTerms: {
      __typename?: "DisputeResolutionTermsEntity";
      id: string;
      disputeResolverId: string;
      escalationResponsePeriod: string;
      feeAmount: string;
      buyerEscalationDeposit: string;
    };
    metadata?:
      | {
          __typename?: "BaseMetadataEntity";
          name: string;
          description: string;
          externalUrl: string;
          animationUrl?: string | null;
          licenseUrl: string;
          condition?: string | null;
          schemaUrl: string;
          type: MetadataType;
          image: string;
        }
      | {
          __typename?: "ProductV1MetadataEntity";
          createdAt: string;
          voided: boolean;
          validFromDate: string;
          validUntilDate: string;
          quantityAvailable: string;
          uuid: string;
          name: string;
          description: string;
          externalUrl: string;
          animationUrl?: string | null;
          licenseUrl: string;
          condition?: string | null;
          schemaUrl: string;
          type: MetadataType;
          image: string;
          attributes?: Array<{
            __typename?: "MetadataAttribute";
            traitType: string;
            value: string;
            displayType: string;
          }> | null;
          product: {
            __typename?: "ProductV1Product";
            id: string;
            uuid: string;
            version: number;
            title: string;
            description: string;
            identification_sKU?: string | null;
            identification_productId?: string | null;
            identification_productIdType?: string | null;
            productionInformation_brandName: string;
            productionInformation_manufacturer?: string | null;
            productionInformation_manufacturerPartNumber?: string | null;
            productionInformation_modelNumber?: string | null;
            productionInformation_materials?: Array<string> | null;
            details_category?: string | null;
            details_subCategory?: string | null;
            details_subCategory2?: string | null;
            details_offerCategory: string;
            offerCategory: ProductV1OfferCategory;
            details_tags?: Array<string> | null;
            details_sections?: Array<string> | null;
            details_personalisation?: Array<string> | null;
            packaging_packageQuantity?: string | null;
            packaging_dimensions_length?: string | null;
            packaging_dimensions_width?: string | null;
            packaging_dimensions_height?: string | null;
            packaging_dimensions_unit?: string | null;
            packaging_weight_value?: string | null;
            packaging_weight_unit?: string | null;
            brand: { __typename?: "ProductV1Brand"; id: string; name: string };
            category?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            subCategory?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            subCategory2?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            tags?: Array<{
              __typename?: "ProductV1Tag";
              id: string;
              name: string;
            }> | null;
            sections?: Array<{
              __typename?: "ProductV1Section";
              id: string;
              name: string;
            }> | null;
            personalisation?: Array<{
              __typename?: "ProductV1Personalisation";
              id: string;
              name: string;
            }> | null;
            visuals_images: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }>;
            visuals_videos?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            productV1Seller?: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            } | null;
          };
          variations?: Array<{
            __typename?: "ProductV1Variation";
            id: string;
            type: string;
            option: string;
          }> | null;
          productV1Seller: {
            __typename?: "ProductV1Seller";
            id: string;
            defaultVersion: number;
            name?: string | null;
            description?: string | null;
            externalUrl?: string | null;
            tokenId?: string | null;
            sellerId?: string | null;
            images?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            contactLinks?: Array<{
              __typename?: "ProductV1SellerContactLink";
              id: string;
              url: string;
              tag: string;
            }> | null;
            seller: {
              __typename?: "Seller";
              id: string;
              operator: string;
              admin: string;
              clerk: string;
              treasury: string;
              authTokenId: string;
              authTokenType: number;
              voucherCloneAddress: string;
              active: boolean;
              contractURI: string;
              royaltyPercentage: string;
            };
          };
          exchangePolicy: {
            __typename?: "ProductV1ExchangePolicy";
            id: string;
            uuid: string;
            version: number;
            label?: string | null;
            template: string;
            sellerContactMethod: string;
            disputeResolverContactMethod: string;
          };
          shipping?: {
            __typename?: "ProductV1ShippingOption";
            id: string;
            defaultVersion?: number | null;
            countryOfOrigin?: string | null;
            redemptionPoint?: string | null;
            returnPeriodInDays: number;
            supportedJurisdictions?: Array<{
              __typename?: "ProductV1ShippingJurisdiction";
              id: string;
              label: string;
              deliveryTime: string;
            }> | null;
          } | null;
        }
      | null;
  };
  seller: {
    __typename?: "Seller";
    id: string;
    operator: string;
    admin: string;
    clerk: string;
    treasury: string;
    authTokenId: string;
    authTokenType: number;
    voucherCloneAddress: string;
    active: boolean;
    contractURI: string;
    royaltyPercentage: string;
  };
  exchangeToken: {
    __typename?: "ExchangeToken";
    id: string;
    address: string;
    decimals: string;
    symbol: string;
    name: string;
  };
};

export type BaseBaseMetadataEntityFieldsFragment = {
  __typename?: "BaseMetadataEntity";
  id: string;
  name: string;
  description: string;
  externalUrl: string;
  animationUrl?: string | null;
  licenseUrl: string;
  condition?: string | null;
  schemaUrl: string;
  type: MetadataType;
  image: string;
  createdAt: string;
  voided: boolean;
  validFromDate: string;
  validUntilDate: string;
  quantityAvailable: string;
  numberOfCommits: string;
  numberOfRedemptions: string;
  attributes?: Array<{
    __typename?: "MetadataAttribute";
    traitType: string;
    value: string;
    displayType: string;
  }> | null;
  offer: {
    __typename?: "Offer";
    id: string;
    createdAt: string;
    price: string;
    sellerDeposit: string;
    protocolFee: string;
    agentFee: string;
    agentId: string;
    buyerCancelPenalty: string;
    quantityAvailable: string;
    quantityInitial: string;
    validFromDate: string;
    validUntilDate: string;
    voucherRedeemableFromDate: string;
    voucherRedeemableUntilDate: string;
    disputePeriodDuration: string;
    voucherValidDuration: string;
    resolutionPeriodDuration: string;
    metadataUri: string;
    metadataHash: string;
    voided: boolean;
    voidedAt?: string | null;
    disputeResolverId: string;
    numberOfCommits: string;
    numberOfRedemptions: string;
    condition?: {
      __typename?: "ConditionEntity";
      id: string;
      method: number;
      tokenType: number;
      tokenAddress: string;
      tokenId: string;
      threshold: string;
      maxCommits: string;
    } | null;
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
    exchangeToken: {
      __typename?: "ExchangeToken";
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
    disputeResolver: {
      __typename?: "DisputeResolver";
      id: string;
      escalationResponsePeriod: string;
      admin: string;
      clerk: string;
      treasury: string;
      operator: string;
      metadataUri: string;
      active: boolean;
      sellerAllowList: Array<string>;
      fees: Array<{
        __typename?: "DisputeResolverFee";
        id: string;
        tokenAddress: string;
        tokenName: string;
        feeAmount: string;
        token: {
          __typename?: "ExchangeToken";
          id: string;
          address: string;
          decimals: string;
          symbol: string;
          name: string;
        };
      }>;
    };
    disputeResolutionTerms: {
      __typename?: "DisputeResolutionTermsEntity";
      id: string;
      disputeResolverId: string;
      escalationResponsePeriod: string;
      feeAmount: string;
      buyerEscalationDeposit: string;
    };
    metadata?:
      | {
          __typename?: "BaseMetadataEntity";
          name: string;
          description: string;
          externalUrl: string;
          animationUrl?: string | null;
          licenseUrl: string;
          condition?: string | null;
          schemaUrl: string;
          type: MetadataType;
          image: string;
        }
      | {
          __typename?: "ProductV1MetadataEntity";
          createdAt: string;
          voided: boolean;
          validFromDate: string;
          validUntilDate: string;
          quantityAvailable: string;
          uuid: string;
          name: string;
          description: string;
          externalUrl: string;
          animationUrl?: string | null;
          licenseUrl: string;
          condition?: string | null;
          schemaUrl: string;
          type: MetadataType;
          image: string;
          attributes?: Array<{
            __typename?: "MetadataAttribute";
            traitType: string;
            value: string;
            displayType: string;
          }> | null;
          product: {
            __typename?: "ProductV1Product";
            id: string;
            uuid: string;
            version: number;
            title: string;
            description: string;
            identification_sKU?: string | null;
            identification_productId?: string | null;
            identification_productIdType?: string | null;
            productionInformation_brandName: string;
            productionInformation_manufacturer?: string | null;
            productionInformation_manufacturerPartNumber?: string | null;
            productionInformation_modelNumber?: string | null;
            productionInformation_materials?: Array<string> | null;
            details_category?: string | null;
            details_subCategory?: string | null;
            details_subCategory2?: string | null;
            details_offerCategory: string;
            offerCategory: ProductV1OfferCategory;
            details_tags?: Array<string> | null;
            details_sections?: Array<string> | null;
            details_personalisation?: Array<string> | null;
            packaging_packageQuantity?: string | null;
            packaging_dimensions_length?: string | null;
            packaging_dimensions_width?: string | null;
            packaging_dimensions_height?: string | null;
            packaging_dimensions_unit?: string | null;
            packaging_weight_value?: string | null;
            packaging_weight_unit?: string | null;
            brand: { __typename?: "ProductV1Brand"; id: string; name: string };
            category?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            subCategory?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            subCategory2?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            tags?: Array<{
              __typename?: "ProductV1Tag";
              id: string;
              name: string;
            }> | null;
            sections?: Array<{
              __typename?: "ProductV1Section";
              id: string;
              name: string;
            }> | null;
            personalisation?: Array<{
              __typename?: "ProductV1Personalisation";
              id: string;
              name: string;
            }> | null;
            visuals_images: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }>;
            visuals_videos?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            productV1Seller?: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            } | null;
          };
          variations?: Array<{
            __typename?: "ProductV1Variation";
            id: string;
            type: string;
            option: string;
          }> | null;
          productV1Seller: {
            __typename?: "ProductV1Seller";
            id: string;
            defaultVersion: number;
            name?: string | null;
            description?: string | null;
            externalUrl?: string | null;
            tokenId?: string | null;
            sellerId?: string | null;
            images?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            contactLinks?: Array<{
              __typename?: "ProductV1SellerContactLink";
              id: string;
              url: string;
              tag: string;
            }> | null;
            seller: {
              __typename?: "Seller";
              id: string;
              operator: string;
              admin: string;
              clerk: string;
              treasury: string;
              authTokenId: string;
              authTokenType: number;
              voucherCloneAddress: string;
              active: boolean;
              contractURI: string;
              royaltyPercentage: string;
            };
          };
          exchangePolicy: {
            __typename?: "ProductV1ExchangePolicy";
            id: string;
            uuid: string;
            version: number;
            label?: string | null;
            template: string;
            sellerContactMethod: string;
            disputeResolverContactMethod: string;
          };
          shipping?: {
            __typename?: "ProductV1ShippingOption";
            id: string;
            defaultVersion?: number | null;
            countryOfOrigin?: string | null;
            redemptionPoint?: string | null;
            returnPeriodInDays: number;
            supportedJurisdictions?: Array<{
              __typename?: "ProductV1ShippingJurisdiction";
              id: string;
              label: string;
              deliveryTime: string;
            }> | null;
          } | null;
        }
      | null;
  };
  seller: {
    __typename?: "Seller";
    id: string;
    operator: string;
    admin: string;
    clerk: string;
    treasury: string;
    authTokenId: string;
    authTokenType: number;
    voucherCloneAddress: string;
    active: boolean;
    contractURI: string;
    royaltyPercentage: string;
  };
  exchangeToken: {
    __typename?: "ExchangeToken";
    id: string;
    address: string;
    decimals: string;
    symbol: string;
    name: string;
  };
};

export type GetProductV1BrandsQueryQueryVariables = Exact<{
  brandsSkip?: InputMaybe<Scalars["Int"]>;
  brandsFirst?: InputMaybe<Scalars["Int"]>;
  brandsOrderBy?: InputMaybe<ProductV1Brand_OrderBy>;
  brandsOrderDirection?: InputMaybe<OrderDirection>;
  brandsFilter?: InputMaybe<ProductV1Brand_Filter>;
}>;

export type GetProductV1BrandsQueryQuery = {
  __typename?: "Query";
  productV1Brands: Array<{
    __typename?: "ProductV1Brand";
    id: string;
    name: string;
  }>;
};

export type GetProductV1ProductsQueryQueryVariables = Exact<{
  productsSkip?: InputMaybe<Scalars["Int"]>;
  productsFirst?: InputMaybe<Scalars["Int"]>;
  productsOrderBy?: InputMaybe<ProductV1Product_OrderBy>;
  productsOrderDirection?: InputMaybe<OrderDirection>;
  productsFilter?: InputMaybe<ProductV1Product_Filter>;
}>;

export type GetProductV1ProductsQueryQuery = {
  __typename?: "Query";
  productV1Products: Array<{
    __typename?: "ProductV1Product";
    id: string;
    uuid: string;
    version: number;
    title: string;
    description: string;
    identification_sKU?: string | null;
    identification_productId?: string | null;
    identification_productIdType?: string | null;
    productionInformation_brandName: string;
    productionInformation_manufacturer?: string | null;
    productionInformation_manufacturerPartNumber?: string | null;
    productionInformation_modelNumber?: string | null;
    productionInformation_materials?: Array<string> | null;
    details_category?: string | null;
    details_subCategory?: string | null;
    details_subCategory2?: string | null;
    details_offerCategory: string;
    offerCategory: ProductV1OfferCategory;
    details_tags?: Array<string> | null;
    details_sections?: Array<string> | null;
    details_personalisation?: Array<string> | null;
    packaging_packageQuantity?: string | null;
    packaging_dimensions_length?: string | null;
    packaging_dimensions_width?: string | null;
    packaging_dimensions_height?: string | null;
    packaging_dimensions_unit?: string | null;
    packaging_weight_value?: string | null;
    packaging_weight_unit?: string | null;
    brand: { __typename?: "ProductV1Brand"; id: string; name: string };
    category?: {
      __typename?: "ProductV1Category";
      id: string;
      name: string;
    } | null;
    subCategory?: {
      __typename?: "ProductV1Category";
      id: string;
      name: string;
    } | null;
    subCategory2?: {
      __typename?: "ProductV1Category";
      id: string;
      name: string;
    } | null;
    tags?: Array<{
      __typename?: "ProductV1Tag";
      id: string;
      name: string;
    }> | null;
    sections?: Array<{
      __typename?: "ProductV1Section";
      id: string;
      name: string;
    }> | null;
    personalisation?: Array<{
      __typename?: "ProductV1Personalisation";
      id: string;
      name: string;
    }> | null;
    visuals_images: Array<{
      __typename?: "ProductV1Media";
      id: string;
      url: string;
      tag?: string | null;
      type: ProductV1MediaType;
    }>;
    visuals_videos?: Array<{
      __typename?: "ProductV1Media";
      id: string;
      url: string;
      tag?: string | null;
      type: ProductV1MediaType;
    }> | null;
    productV1Seller?: {
      __typename?: "ProductV1Seller";
      id: string;
      defaultVersion: number;
      name?: string | null;
      description?: string | null;
      externalUrl?: string | null;
      tokenId?: string | null;
      sellerId?: string | null;
      images?: Array<{
        __typename?: "ProductV1Media";
        id: string;
        url: string;
        tag?: string | null;
        type: ProductV1MediaType;
      }> | null;
      contactLinks?: Array<{
        __typename?: "ProductV1SellerContactLink";
        id: string;
        url: string;
        tag: string;
      }> | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
    } | null;
  }>;
};

export type GetProductV1ProductsWithVariantsQueryQueryVariables = Exact<{
  productsSkip?: InputMaybe<Scalars["Int"]>;
  productsFirst?: InputMaybe<Scalars["Int"]>;
  productsOrderBy?: InputMaybe<ProductV1Product_OrderBy>;
  productsOrderDirection?: InputMaybe<OrderDirection>;
  productsFilter?: InputMaybe<ProductV1Product_Filter>;
}>;

export type GetProductV1ProductsWithVariantsQueryQuery = {
  __typename?: "Query";
  productV1Products: Array<{
    __typename?: "ProductV1Product";
    allVariantsVoided?: boolean | null;
    minValidFromDate: string;
    maxValidFromDate: string;
    minValidUntilDate: string;
    maxValidUntilDate: string;
    id: string;
    uuid: string;
    version: number;
    title: string;
    description: string;
    identification_sKU?: string | null;
    identification_productId?: string | null;
    identification_productIdType?: string | null;
    productionInformation_brandName: string;
    productionInformation_manufacturer?: string | null;
    productionInformation_manufacturerPartNumber?: string | null;
    productionInformation_modelNumber?: string | null;
    productionInformation_materials?: Array<string> | null;
    details_category?: string | null;
    details_subCategory?: string | null;
    details_subCategory2?: string | null;
    details_offerCategory: string;
    offerCategory: ProductV1OfferCategory;
    details_tags?: Array<string> | null;
    details_sections?: Array<string> | null;
    details_personalisation?: Array<string> | null;
    packaging_packageQuantity?: string | null;
    packaging_dimensions_length?: string | null;
    packaging_dimensions_width?: string | null;
    packaging_dimensions_height?: string | null;
    packaging_dimensions_unit?: string | null;
    packaging_weight_value?: string | null;
    packaging_weight_unit?: string | null;
    variants?: Array<{
      __typename?: "ProductV1Variant";
      offer: {
        __typename?: "Offer";
        id: string;
        createdAt: string;
        price: string;
        sellerDeposit: string;
        protocolFee: string;
        agentFee: string;
        agentId: string;
        buyerCancelPenalty: string;
        quantityAvailable: string;
        quantityInitial: string;
        validFromDate: string;
        validUntilDate: string;
        voucherRedeemableFromDate: string;
        voucherRedeemableUntilDate: string;
        disputePeriodDuration: string;
        voucherValidDuration: string;
        resolutionPeriodDuration: string;
        metadataUri: string;
        metadataHash: string;
        voided: boolean;
        voidedAt?: string | null;
        disputeResolverId: string;
        numberOfCommits: string;
        numberOfRedemptions: string;
        exchanges: Array<{
          __typename?: "Exchange";
          id: string;
          disputed: boolean;
          state: ExchangeState;
          committedDate: string;
          finalizedDate?: string | null;
          validUntilDate: string;
          redeemedDate?: string | null;
          revokedDate?: string | null;
          cancelledDate?: string | null;
          completedDate?: string | null;
          disputedDate?: string | null;
          expired: boolean;
          dispute?: {
            __typename?: "Dispute";
            id: string;
            exchangeId: string;
            state: DisputeState;
            buyerPercent: string;
            disputedDate: string;
            escalatedDate?: string | null;
            finalizedDate?: string | null;
            retractedDate?: string | null;
            resolvedDate?: string | null;
            decidedDate?: string | null;
            refusedDate?: string | null;
            timeout: string;
          } | null;
          buyer: {
            __typename?: "Buyer";
            id: string;
            wallet: string;
            active: boolean;
          };
          seller: {
            __typename?: "Seller";
            id: string;
            operator: string;
            admin: string;
            clerk: string;
            treasury: string;
            authTokenId: string;
            authTokenType: number;
            voucherCloneAddress: string;
            active: boolean;
            contractURI: string;
            royaltyPercentage: string;
          };
        }>;
        condition?: {
          __typename?: "ConditionEntity";
          id: string;
          method: number;
          tokenType: number;
          tokenAddress: string;
          tokenId: string;
          threshold: string;
          maxCommits: string;
        } | null;
        seller: {
          __typename?: "Seller";
          id: string;
          operator: string;
          admin: string;
          clerk: string;
          treasury: string;
          authTokenId: string;
          authTokenType: number;
          voucherCloneAddress: string;
          active: boolean;
          contractURI: string;
          royaltyPercentage: string;
        };
        exchangeToken: {
          __typename?: "ExchangeToken";
          id: string;
          address: string;
          decimals: string;
          symbol: string;
          name: string;
        };
        disputeResolver: {
          __typename?: "DisputeResolver";
          id: string;
          escalationResponsePeriod: string;
          admin: string;
          clerk: string;
          treasury: string;
          operator: string;
          metadataUri: string;
          active: boolean;
          sellerAllowList: Array<string>;
          fees: Array<{
            __typename?: "DisputeResolverFee";
            id: string;
            tokenAddress: string;
            tokenName: string;
            feeAmount: string;
            token: {
              __typename?: "ExchangeToken";
              id: string;
              address: string;
              decimals: string;
              symbol: string;
              name: string;
            };
          }>;
        };
        disputeResolutionTerms: {
          __typename?: "DisputeResolutionTermsEntity";
          id: string;
          disputeResolverId: string;
          escalationResponsePeriod: string;
          feeAmount: string;
          buyerEscalationDeposit: string;
        };
        metadata?:
          | {
              __typename?: "BaseMetadataEntity";
              name: string;
              description: string;
              externalUrl: string;
              animationUrl?: string | null;
              licenseUrl: string;
              condition?: string | null;
              schemaUrl: string;
              type: MetadataType;
              image: string;
            }
          | {
              __typename?: "ProductV1MetadataEntity";
              createdAt: string;
              voided: boolean;
              validFromDate: string;
              validUntilDate: string;
              quantityAvailable: string;
              uuid: string;
              name: string;
              description: string;
              externalUrl: string;
              animationUrl?: string | null;
              licenseUrl: string;
              condition?: string | null;
              schemaUrl: string;
              type: MetadataType;
              image: string;
              attributes?: Array<{
                __typename?: "MetadataAttribute";
                traitType: string;
                value: string;
                displayType: string;
              }> | null;
              product: {
                __typename?: "ProductV1Product";
                id: string;
                uuid: string;
                version: number;
                title: string;
                description: string;
                identification_sKU?: string | null;
                identification_productId?: string | null;
                identification_productIdType?: string | null;
                productionInformation_brandName: string;
                productionInformation_manufacturer?: string | null;
                productionInformation_manufacturerPartNumber?: string | null;
                productionInformation_modelNumber?: string | null;
                productionInformation_materials?: Array<string> | null;
                details_category?: string | null;
                details_subCategory?: string | null;
                details_subCategory2?: string | null;
                details_offerCategory: string;
                offerCategory: ProductV1OfferCategory;
                details_tags?: Array<string> | null;
                details_sections?: Array<string> | null;
                details_personalisation?: Array<string> | null;
                packaging_packageQuantity?: string | null;
                packaging_dimensions_length?: string | null;
                packaging_dimensions_width?: string | null;
                packaging_dimensions_height?: string | null;
                packaging_dimensions_unit?: string | null;
                packaging_weight_value?: string | null;
                packaging_weight_unit?: string | null;
                brand: {
                  __typename?: "ProductV1Brand";
                  id: string;
                  name: string;
                };
                category?: {
                  __typename?: "ProductV1Category";
                  id: string;
                  name: string;
                } | null;
                subCategory?: {
                  __typename?: "ProductV1Category";
                  id: string;
                  name: string;
                } | null;
                subCategory2?: {
                  __typename?: "ProductV1Category";
                  id: string;
                  name: string;
                } | null;
                tags?: Array<{
                  __typename?: "ProductV1Tag";
                  id: string;
                  name: string;
                }> | null;
                sections?: Array<{
                  __typename?: "ProductV1Section";
                  id: string;
                  name: string;
                }> | null;
                personalisation?: Array<{
                  __typename?: "ProductV1Personalisation";
                  id: string;
                  name: string;
                }> | null;
                visuals_images: Array<{
                  __typename?: "ProductV1Media";
                  id: string;
                  url: string;
                  tag?: string | null;
                  type: ProductV1MediaType;
                }>;
                visuals_videos?: Array<{
                  __typename?: "ProductV1Media";
                  id: string;
                  url: string;
                  tag?: string | null;
                  type: ProductV1MediaType;
                }> | null;
                productV1Seller?: {
                  __typename?: "ProductV1Seller";
                  id: string;
                  defaultVersion: number;
                  name?: string | null;
                  description?: string | null;
                  externalUrl?: string | null;
                  tokenId?: string | null;
                  sellerId?: string | null;
                  images?: Array<{
                    __typename?: "ProductV1Media";
                    id: string;
                    url: string;
                    tag?: string | null;
                    type: ProductV1MediaType;
                  }> | null;
                  contactLinks?: Array<{
                    __typename?: "ProductV1SellerContactLink";
                    id: string;
                    url: string;
                    tag: string;
                  }> | null;
                  seller: {
                    __typename?: "Seller";
                    id: string;
                    operator: string;
                    admin: string;
                    clerk: string;
                    treasury: string;
                    authTokenId: string;
                    authTokenType: number;
                    voucherCloneAddress: string;
                    active: boolean;
                    contractURI: string;
                    royaltyPercentage: string;
                  };
                } | null;
              };
              variations?: Array<{
                __typename?: "ProductV1Variation";
                id: string;
                type: string;
                option: string;
              }> | null;
              productV1Seller: {
                __typename?: "ProductV1Seller";
                id: string;
                defaultVersion: number;
                name?: string | null;
                description?: string | null;
                externalUrl?: string | null;
                tokenId?: string | null;
                sellerId?: string | null;
                images?: Array<{
                  __typename?: "ProductV1Media";
                  id: string;
                  url: string;
                  tag?: string | null;
                  type: ProductV1MediaType;
                }> | null;
                contactLinks?: Array<{
                  __typename?: "ProductV1SellerContactLink";
                  id: string;
                  url: string;
                  tag: string;
                }> | null;
                seller: {
                  __typename?: "Seller";
                  id: string;
                  operator: string;
                  admin: string;
                  clerk: string;
                  treasury: string;
                  authTokenId: string;
                  authTokenType: number;
                  voucherCloneAddress: string;
                  active: boolean;
                  contractURI: string;
                  royaltyPercentage: string;
                };
              };
              exchangePolicy: {
                __typename?: "ProductV1ExchangePolicy";
                id: string;
                uuid: string;
                version: number;
                label?: string | null;
                template: string;
                sellerContactMethod: string;
                disputeResolverContactMethod: string;
              };
              shipping?: {
                __typename?: "ProductV1ShippingOption";
                id: string;
                defaultVersion?: number | null;
                countryOfOrigin?: string | null;
                redemptionPoint?: string | null;
                returnPeriodInDays: number;
                supportedJurisdictions?: Array<{
                  __typename?: "ProductV1ShippingJurisdiction";
                  id: string;
                  label: string;
                  deliveryTime: string;
                }> | null;
              } | null;
            }
          | null;
      };
      variations?: Array<{
        __typename?: "ProductV1Variation";
        id: string;
        type: string;
        option: string;
      }> | null;
    }> | null;
    brand: { __typename?: "ProductV1Brand"; id: string; name: string };
    category?: {
      __typename?: "ProductV1Category";
      id: string;
      name: string;
    } | null;
    subCategory?: {
      __typename?: "ProductV1Category";
      id: string;
      name: string;
    } | null;
    subCategory2?: {
      __typename?: "ProductV1Category";
      id: string;
      name: string;
    } | null;
    tags?: Array<{
      __typename?: "ProductV1Tag";
      id: string;
      name: string;
    }> | null;
    sections?: Array<{
      __typename?: "ProductV1Section";
      id: string;
      name: string;
    }> | null;
    personalisation?: Array<{
      __typename?: "ProductV1Personalisation";
      id: string;
      name: string;
    }> | null;
    visuals_images: Array<{
      __typename?: "ProductV1Media";
      id: string;
      url: string;
      tag?: string | null;
      type: ProductV1MediaType;
    }>;
    visuals_videos?: Array<{
      __typename?: "ProductV1Media";
      id: string;
      url: string;
      tag?: string | null;
      type: ProductV1MediaType;
    }> | null;
    productV1Seller?: {
      __typename?: "ProductV1Seller";
      id: string;
      defaultVersion: number;
      name?: string | null;
      description?: string | null;
      externalUrl?: string | null;
      tokenId?: string | null;
      sellerId?: string | null;
      images?: Array<{
        __typename?: "ProductV1Media";
        id: string;
        url: string;
        tag?: string | null;
        type: ProductV1MediaType;
      }> | null;
      contactLinks?: Array<{
        __typename?: "ProductV1SellerContactLink";
        id: string;
        url: string;
        tag: string;
      }> | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
    } | null;
  }>;
};

export type GetAllProductsWithNotVoidedVariantsQueryQueryVariables = Exact<{
  productsSkip?: InputMaybe<Scalars["Int"]>;
  productsFirst?: InputMaybe<Scalars["Int"]>;
  productsOrderBy?: InputMaybe<ProductV1Product_OrderBy>;
  productsOrderDirection?: InputMaybe<OrderDirection>;
  productsFilter?: InputMaybe<ProductV1Product_Filter>;
}>;

export type GetAllProductsWithNotVoidedVariantsQueryQuery = {
  __typename?: "Query";
  productV1Products: Array<{
    __typename?: "ProductV1Product";
    allVariantsVoided?: boolean | null;
    minValidFromDate: string;
    maxValidFromDate: string;
    minValidUntilDate: string;
    maxValidUntilDate: string;
    id: string;
    uuid: string;
    version: number;
    title: string;
    description: string;
    identification_sKU?: string | null;
    identification_productId?: string | null;
    identification_productIdType?: string | null;
    productionInformation_brandName: string;
    productionInformation_manufacturer?: string | null;
    productionInformation_manufacturerPartNumber?: string | null;
    productionInformation_modelNumber?: string | null;
    productionInformation_materials?: Array<string> | null;
    details_category?: string | null;
    details_subCategory?: string | null;
    details_subCategory2?: string | null;
    details_offerCategory: string;
    offerCategory: ProductV1OfferCategory;
    details_tags?: Array<string> | null;
    details_sections?: Array<string> | null;
    details_personalisation?: Array<string> | null;
    packaging_packageQuantity?: string | null;
    packaging_dimensions_length?: string | null;
    packaging_dimensions_width?: string | null;
    packaging_dimensions_height?: string | null;
    packaging_dimensions_unit?: string | null;
    packaging_weight_value?: string | null;
    packaging_weight_unit?: string | null;
    notVoidedVariants?: Array<{
      __typename?: "ProductV1Variant";
      offer: {
        __typename?: "Offer";
        id: string;
        createdAt: string;
        price: string;
        sellerDeposit: string;
        protocolFee: string;
        agentFee: string;
        agentId: string;
        buyerCancelPenalty: string;
        quantityAvailable: string;
        quantityInitial: string;
        validFromDate: string;
        validUntilDate: string;
        voucherRedeemableFromDate: string;
        voucherRedeemableUntilDate: string;
        disputePeriodDuration: string;
        voucherValidDuration: string;
        resolutionPeriodDuration: string;
        metadataUri: string;
        metadataHash: string;
        voided: boolean;
        voidedAt?: string | null;
        disputeResolverId: string;
        numberOfCommits: string;
        numberOfRedemptions: string;
        exchanges: Array<{
          __typename?: "Exchange";
          id: string;
          disputed: boolean;
          state: ExchangeState;
          committedDate: string;
          finalizedDate?: string | null;
          validUntilDate: string;
          redeemedDate?: string | null;
          revokedDate?: string | null;
          cancelledDate?: string | null;
          completedDate?: string | null;
          disputedDate?: string | null;
          expired: boolean;
          dispute?: {
            __typename?: "Dispute";
            id: string;
            exchangeId: string;
            state: DisputeState;
            buyerPercent: string;
            disputedDate: string;
            escalatedDate?: string | null;
            finalizedDate?: string | null;
            retractedDate?: string | null;
            resolvedDate?: string | null;
            decidedDate?: string | null;
            refusedDate?: string | null;
            timeout: string;
          } | null;
          buyer: {
            __typename?: "Buyer";
            id: string;
            wallet: string;
            active: boolean;
          };
          seller: {
            __typename?: "Seller";
            id: string;
            operator: string;
            admin: string;
            clerk: string;
            treasury: string;
            authTokenId: string;
            authTokenType: number;
            voucherCloneAddress: string;
            active: boolean;
            contractURI: string;
            royaltyPercentage: string;
          };
        }>;
        condition?: {
          __typename?: "ConditionEntity";
          id: string;
          method: number;
          tokenType: number;
          tokenAddress: string;
          tokenId: string;
          threshold: string;
          maxCommits: string;
        } | null;
        seller: {
          __typename?: "Seller";
          id: string;
          operator: string;
          admin: string;
          clerk: string;
          treasury: string;
          authTokenId: string;
          authTokenType: number;
          voucherCloneAddress: string;
          active: boolean;
          contractURI: string;
          royaltyPercentage: string;
        };
        exchangeToken: {
          __typename?: "ExchangeToken";
          id: string;
          address: string;
          decimals: string;
          symbol: string;
          name: string;
        };
        disputeResolver: {
          __typename?: "DisputeResolver";
          id: string;
          escalationResponsePeriod: string;
          admin: string;
          clerk: string;
          treasury: string;
          operator: string;
          metadataUri: string;
          active: boolean;
          sellerAllowList: Array<string>;
          fees: Array<{
            __typename?: "DisputeResolverFee";
            id: string;
            tokenAddress: string;
            tokenName: string;
            feeAmount: string;
            token: {
              __typename?: "ExchangeToken";
              id: string;
              address: string;
              decimals: string;
              symbol: string;
              name: string;
            };
          }>;
        };
        disputeResolutionTerms: {
          __typename?: "DisputeResolutionTermsEntity";
          id: string;
          disputeResolverId: string;
          escalationResponsePeriod: string;
          feeAmount: string;
          buyerEscalationDeposit: string;
        };
        metadata?:
          | {
              __typename?: "BaseMetadataEntity";
              name: string;
              description: string;
              externalUrl: string;
              animationUrl?: string | null;
              licenseUrl: string;
              condition?: string | null;
              schemaUrl: string;
              type: MetadataType;
              image: string;
            }
          | {
              __typename?: "ProductV1MetadataEntity";
              createdAt: string;
              voided: boolean;
              validFromDate: string;
              validUntilDate: string;
              quantityAvailable: string;
              uuid: string;
              name: string;
              description: string;
              externalUrl: string;
              animationUrl?: string | null;
              licenseUrl: string;
              condition?: string | null;
              schemaUrl: string;
              type: MetadataType;
              image: string;
              attributes?: Array<{
                __typename?: "MetadataAttribute";
                traitType: string;
                value: string;
                displayType: string;
              }> | null;
              product: {
                __typename?: "ProductV1Product";
                id: string;
                uuid: string;
                version: number;
                title: string;
                description: string;
                identification_sKU?: string | null;
                identification_productId?: string | null;
                identification_productIdType?: string | null;
                productionInformation_brandName: string;
                productionInformation_manufacturer?: string | null;
                productionInformation_manufacturerPartNumber?: string | null;
                productionInformation_modelNumber?: string | null;
                productionInformation_materials?: Array<string> | null;
                details_category?: string | null;
                details_subCategory?: string | null;
                details_subCategory2?: string | null;
                details_offerCategory: string;
                offerCategory: ProductV1OfferCategory;
                details_tags?: Array<string> | null;
                details_sections?: Array<string> | null;
                details_personalisation?: Array<string> | null;
                packaging_packageQuantity?: string | null;
                packaging_dimensions_length?: string | null;
                packaging_dimensions_width?: string | null;
                packaging_dimensions_height?: string | null;
                packaging_dimensions_unit?: string | null;
                packaging_weight_value?: string | null;
                packaging_weight_unit?: string | null;
                brand: {
                  __typename?: "ProductV1Brand";
                  id: string;
                  name: string;
                };
                category?: {
                  __typename?: "ProductV1Category";
                  id: string;
                  name: string;
                } | null;
                subCategory?: {
                  __typename?: "ProductV1Category";
                  id: string;
                  name: string;
                } | null;
                subCategory2?: {
                  __typename?: "ProductV1Category";
                  id: string;
                  name: string;
                } | null;
                tags?: Array<{
                  __typename?: "ProductV1Tag";
                  id: string;
                  name: string;
                }> | null;
                sections?: Array<{
                  __typename?: "ProductV1Section";
                  id: string;
                  name: string;
                }> | null;
                personalisation?: Array<{
                  __typename?: "ProductV1Personalisation";
                  id: string;
                  name: string;
                }> | null;
                visuals_images: Array<{
                  __typename?: "ProductV1Media";
                  id: string;
                  url: string;
                  tag?: string | null;
                  type: ProductV1MediaType;
                }>;
                visuals_videos?: Array<{
                  __typename?: "ProductV1Media";
                  id: string;
                  url: string;
                  tag?: string | null;
                  type: ProductV1MediaType;
                }> | null;
                productV1Seller?: {
                  __typename?: "ProductV1Seller";
                  id: string;
                  defaultVersion: number;
                  name?: string | null;
                  description?: string | null;
                  externalUrl?: string | null;
                  tokenId?: string | null;
                  sellerId?: string | null;
                  images?: Array<{
                    __typename?: "ProductV1Media";
                    id: string;
                    url: string;
                    tag?: string | null;
                    type: ProductV1MediaType;
                  }> | null;
                  contactLinks?: Array<{
                    __typename?: "ProductV1SellerContactLink";
                    id: string;
                    url: string;
                    tag: string;
                  }> | null;
                  seller: {
                    __typename?: "Seller";
                    id: string;
                    operator: string;
                    admin: string;
                    clerk: string;
                    treasury: string;
                    authTokenId: string;
                    authTokenType: number;
                    voucherCloneAddress: string;
                    active: boolean;
                    contractURI: string;
                    royaltyPercentage: string;
                  };
                } | null;
              };
              variations?: Array<{
                __typename?: "ProductV1Variation";
                id: string;
                type: string;
                option: string;
              }> | null;
              productV1Seller: {
                __typename?: "ProductV1Seller";
                id: string;
                defaultVersion: number;
                name?: string | null;
                description?: string | null;
                externalUrl?: string | null;
                tokenId?: string | null;
                sellerId?: string | null;
                images?: Array<{
                  __typename?: "ProductV1Media";
                  id: string;
                  url: string;
                  tag?: string | null;
                  type: ProductV1MediaType;
                }> | null;
                contactLinks?: Array<{
                  __typename?: "ProductV1SellerContactLink";
                  id: string;
                  url: string;
                  tag: string;
                }> | null;
                seller: {
                  __typename?: "Seller";
                  id: string;
                  operator: string;
                  admin: string;
                  clerk: string;
                  treasury: string;
                  authTokenId: string;
                  authTokenType: number;
                  voucherCloneAddress: string;
                  active: boolean;
                  contractURI: string;
                  royaltyPercentage: string;
                };
              };
              exchangePolicy: {
                __typename?: "ProductV1ExchangePolicy";
                id: string;
                uuid: string;
                version: number;
                label?: string | null;
                template: string;
                sellerContactMethod: string;
                disputeResolverContactMethod: string;
              };
              shipping?: {
                __typename?: "ProductV1ShippingOption";
                id: string;
                defaultVersion?: number | null;
                countryOfOrigin?: string | null;
                redemptionPoint?: string | null;
                returnPeriodInDays: number;
                supportedJurisdictions?: Array<{
                  __typename?: "ProductV1ShippingJurisdiction";
                  id: string;
                  label: string;
                  deliveryTime: string;
                }> | null;
              } | null;
            }
          | null;
      };
      variations?: Array<{
        __typename?: "ProductV1Variation";
        id: string;
        type: string;
        option: string;
      }> | null;
    }> | null;
    brand: { __typename?: "ProductV1Brand"; id: string; name: string };
    category?: {
      __typename?: "ProductV1Category";
      id: string;
      name: string;
    } | null;
    subCategory?: {
      __typename?: "ProductV1Category";
      id: string;
      name: string;
    } | null;
    subCategory2?: {
      __typename?: "ProductV1Category";
      id: string;
      name: string;
    } | null;
    tags?: Array<{
      __typename?: "ProductV1Tag";
      id: string;
      name: string;
    }> | null;
    sections?: Array<{
      __typename?: "ProductV1Section";
      id: string;
      name: string;
    }> | null;
    personalisation?: Array<{
      __typename?: "ProductV1Personalisation";
      id: string;
      name: string;
    }> | null;
    visuals_images: Array<{
      __typename?: "ProductV1Media";
      id: string;
      url: string;
      tag?: string | null;
      type: ProductV1MediaType;
    }>;
    visuals_videos?: Array<{
      __typename?: "ProductV1Media";
      id: string;
      url: string;
      tag?: string | null;
      type: ProductV1MediaType;
    }> | null;
    productV1Seller?: {
      __typename?: "ProductV1Seller";
      id: string;
      defaultVersion: number;
      name?: string | null;
      description?: string | null;
      externalUrl?: string | null;
      tokenId?: string | null;
      sellerId?: string | null;
      images?: Array<{
        __typename?: "ProductV1Media";
        id: string;
        url: string;
        tag?: string | null;
        type: ProductV1MediaType;
      }> | null;
      contactLinks?: Array<{
        __typename?: "ProductV1SellerContactLink";
        id: string;
        url: string;
        tag: string;
      }> | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
    } | null;
  }>;
};

export type GetProductV1CategoriesQueryQueryVariables = Exact<{
  categoriesSkip?: InputMaybe<Scalars["Int"]>;
  categoriesFirst?: InputMaybe<Scalars["Int"]>;
  categoriesOrderBy?: InputMaybe<ProductV1Category_OrderBy>;
  categoriesOrderDirection?: InputMaybe<OrderDirection>;
  categoriesFilter?: InputMaybe<ProductV1Category_Filter>;
}>;

export type GetProductV1CategoriesQueryQuery = {
  __typename?: "Query";
  productV1Categories: Array<{
    __typename?: "ProductV1Category";
    id: string;
    name: string;
  }>;
};

export type GetProductV1MetadataEntityByIdQueryQueryVariables = Exact<{
  metadataId: Scalars["ID"];
  metadataSkip?: InputMaybe<Scalars["Int"]>;
  metadataFirst?: InputMaybe<Scalars["Int"]>;
  metadataOrderBy?: InputMaybe<ProductV1MetadataEntity_OrderBy>;
  metadataOrderDirection?: InputMaybe<OrderDirection>;
  metadataFilter?: InputMaybe<ProductV1MetadataEntity_Filter>;
}>;

export type GetProductV1MetadataEntityByIdQueryQuery = {
  __typename?: "Query";
  productV1MetadataEntity?: {
    __typename?: "ProductV1MetadataEntity";
    id: string;
    name: string;
    description: string;
    externalUrl: string;
    animationUrl?: string | null;
    licenseUrl: string;
    condition?: string | null;
    schemaUrl: string;
    type: MetadataType;
    image: string;
    createdAt: string;
    voided: boolean;
    validFromDate: string;
    validUntilDate: string;
    quantityAvailable: string;
    numberOfCommits: string;
    numberOfRedemptions: string;
    uuid: string;
    attributes?: Array<{
      __typename?: "MetadataAttribute";
      traitType: string;
      value: string;
      displayType: string;
    }> | null;
    offer: {
      __typename?: "Offer";
      id: string;
      createdAt: string;
      price: string;
      sellerDeposit: string;
      protocolFee: string;
      agentFee: string;
      agentId: string;
      buyerCancelPenalty: string;
      quantityAvailable: string;
      quantityInitial: string;
      validFromDate: string;
      validUntilDate: string;
      voucherRedeemableFromDate: string;
      voucherRedeemableUntilDate: string;
      disputePeriodDuration: string;
      voucherValidDuration: string;
      resolutionPeriodDuration: string;
      metadataUri: string;
      metadataHash: string;
      voided: boolean;
      voidedAt?: string | null;
      disputeResolverId: string;
      numberOfCommits: string;
      numberOfRedemptions: string;
      exchanges: Array<{
        __typename?: "Exchange";
        id: string;
        disputed: boolean;
        state: ExchangeState;
        committedDate: string;
        finalizedDate?: string | null;
        validUntilDate: string;
        redeemedDate?: string | null;
        revokedDate?: string | null;
        cancelledDate?: string | null;
        completedDate?: string | null;
        disputedDate?: string | null;
        expired: boolean;
        dispute?: {
          __typename?: "Dispute";
          id: string;
          exchangeId: string;
          state: DisputeState;
          buyerPercent: string;
          disputedDate: string;
          escalatedDate?: string | null;
          finalizedDate?: string | null;
          retractedDate?: string | null;
          resolvedDate?: string | null;
          decidedDate?: string | null;
          refusedDate?: string | null;
          timeout: string;
        } | null;
        buyer: {
          __typename?: "Buyer";
          id: string;
          wallet: string;
          active: boolean;
        };
        seller: {
          __typename?: "Seller";
          id: string;
          operator: string;
          admin: string;
          clerk: string;
          treasury: string;
          authTokenId: string;
          authTokenType: number;
          voucherCloneAddress: string;
          active: boolean;
          contractURI: string;
          royaltyPercentage: string;
        };
      }>;
      condition?: {
        __typename?: "ConditionEntity";
        id: string;
        method: number;
        tokenType: number;
        tokenAddress: string;
        tokenId: string;
        threshold: string;
        maxCommits: string;
      } | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
      exchangeToken: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
      disputeResolver: {
        __typename?: "DisputeResolver";
        id: string;
        escalationResponsePeriod: string;
        admin: string;
        clerk: string;
        treasury: string;
        operator: string;
        metadataUri: string;
        active: boolean;
        sellerAllowList: Array<string>;
        fees: Array<{
          __typename?: "DisputeResolverFee";
          id: string;
          tokenAddress: string;
          tokenName: string;
          feeAmount: string;
          token: {
            __typename?: "ExchangeToken";
            id: string;
            address: string;
            decimals: string;
            symbol: string;
            name: string;
          };
        }>;
      };
      disputeResolutionTerms: {
        __typename?: "DisputeResolutionTermsEntity";
        id: string;
        disputeResolverId: string;
        escalationResponsePeriod: string;
        feeAmount: string;
        buyerEscalationDeposit: string;
      };
      metadata?:
        | {
            __typename?: "BaseMetadataEntity";
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
          }
        | {
            __typename?: "ProductV1MetadataEntity";
            createdAt: string;
            voided: boolean;
            validFromDate: string;
            validUntilDate: string;
            quantityAvailable: string;
            uuid: string;
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
            attributes?: Array<{
              __typename?: "MetadataAttribute";
              traitType: string;
              value: string;
              displayType: string;
            }> | null;
            product: {
              __typename?: "ProductV1Product";
              id: string;
              uuid: string;
              version: number;
              title: string;
              description: string;
              identification_sKU?: string | null;
              identification_productId?: string | null;
              identification_productIdType?: string | null;
              productionInformation_brandName: string;
              productionInformation_manufacturer?: string | null;
              productionInformation_manufacturerPartNumber?: string | null;
              productionInformation_modelNumber?: string | null;
              productionInformation_materials?: Array<string> | null;
              details_category?: string | null;
              details_subCategory?: string | null;
              details_subCategory2?: string | null;
              details_offerCategory: string;
              offerCategory: ProductV1OfferCategory;
              details_tags?: Array<string> | null;
              details_sections?: Array<string> | null;
              details_personalisation?: Array<string> | null;
              packaging_packageQuantity?: string | null;
              packaging_dimensions_length?: string | null;
              packaging_dimensions_width?: string | null;
              packaging_dimensions_height?: string | null;
              packaging_dimensions_unit?: string | null;
              packaging_weight_value?: string | null;
              packaging_weight_unit?: string | null;
              brand: {
                __typename?: "ProductV1Brand";
                id: string;
                name: string;
              };
              category?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory2?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              tags?: Array<{
                __typename?: "ProductV1Tag";
                id: string;
                name: string;
              }> | null;
              sections?: Array<{
                __typename?: "ProductV1Section";
                id: string;
                name: string;
              }> | null;
              personalisation?: Array<{
                __typename?: "ProductV1Personalisation";
                id: string;
                name: string;
              }> | null;
              visuals_images: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }>;
              visuals_videos?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              productV1Seller?: {
                __typename?: "ProductV1Seller";
                id: string;
                defaultVersion: number;
                name?: string | null;
                description?: string | null;
                externalUrl?: string | null;
                tokenId?: string | null;
                sellerId?: string | null;
                images?: Array<{
                  __typename?: "ProductV1Media";
                  id: string;
                  url: string;
                  tag?: string | null;
                  type: ProductV1MediaType;
                }> | null;
                contactLinks?: Array<{
                  __typename?: "ProductV1SellerContactLink";
                  id: string;
                  url: string;
                  tag: string;
                }> | null;
                seller: {
                  __typename?: "Seller";
                  id: string;
                  operator: string;
                  admin: string;
                  clerk: string;
                  treasury: string;
                  authTokenId: string;
                  authTokenType: number;
                  voucherCloneAddress: string;
                  active: boolean;
                  contractURI: string;
                  royaltyPercentage: string;
                };
              } | null;
            };
            variations?: Array<{
              __typename?: "ProductV1Variation";
              id: string;
              type: string;
              option: string;
            }> | null;
            productV1Seller: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            };
            exchangePolicy: {
              __typename?: "ProductV1ExchangePolicy";
              id: string;
              uuid: string;
              version: number;
              label?: string | null;
              template: string;
              sellerContactMethod: string;
              disputeResolverContactMethod: string;
            };
            shipping?: {
              __typename?: "ProductV1ShippingOption";
              id: string;
              defaultVersion?: number | null;
              countryOfOrigin?: string | null;
              redemptionPoint?: string | null;
              returnPeriodInDays: number;
              supportedJurisdictions?: Array<{
                __typename?: "ProductV1ShippingJurisdiction";
                id: string;
                label: string;
                deliveryTime: string;
              }> | null;
            } | null;
          }
        | null;
    };
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
    exchangeToken: {
      __typename?: "ExchangeToken";
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
    product: {
      __typename?: "ProductV1Product";
      id: string;
      uuid: string;
      version: number;
      title: string;
      description: string;
      identification_sKU?: string | null;
      identification_productId?: string | null;
      identification_productIdType?: string | null;
      productionInformation_brandName: string;
      productionInformation_manufacturer?: string | null;
      productionInformation_manufacturerPartNumber?: string | null;
      productionInformation_modelNumber?: string | null;
      productionInformation_materials?: Array<string> | null;
      details_category?: string | null;
      details_subCategory?: string | null;
      details_subCategory2?: string | null;
      details_offerCategory: string;
      offerCategory: ProductV1OfferCategory;
      details_tags?: Array<string> | null;
      details_sections?: Array<string> | null;
      details_personalisation?: Array<string> | null;
      packaging_packageQuantity?: string | null;
      packaging_dimensions_length?: string | null;
      packaging_dimensions_width?: string | null;
      packaging_dimensions_height?: string | null;
      packaging_dimensions_unit?: string | null;
      packaging_weight_value?: string | null;
      packaging_weight_unit?: string | null;
      brand: { __typename?: "ProductV1Brand"; id: string; name: string };
      category?: {
        __typename?: "ProductV1Category";
        id: string;
        name: string;
      } | null;
      subCategory?: {
        __typename?: "ProductV1Category";
        id: string;
        name: string;
      } | null;
      subCategory2?: {
        __typename?: "ProductV1Category";
        id: string;
        name: string;
      } | null;
      tags?: Array<{
        __typename?: "ProductV1Tag";
        id: string;
        name: string;
      }> | null;
      sections?: Array<{
        __typename?: "ProductV1Section";
        id: string;
        name: string;
      }> | null;
      personalisation?: Array<{
        __typename?: "ProductV1Personalisation";
        id: string;
        name: string;
      }> | null;
      visuals_images: Array<{
        __typename?: "ProductV1Media";
        id: string;
        url: string;
        tag?: string | null;
        type: ProductV1MediaType;
      }>;
      visuals_videos?: Array<{
        __typename?: "ProductV1Media";
        id: string;
        url: string;
        tag?: string | null;
        type: ProductV1MediaType;
      }> | null;
      productV1Seller?: {
        __typename?: "ProductV1Seller";
        id: string;
        defaultVersion: number;
        name?: string | null;
        description?: string | null;
        externalUrl?: string | null;
        tokenId?: string | null;
        sellerId?: string | null;
        images?: Array<{
          __typename?: "ProductV1Media";
          id: string;
          url: string;
          tag?: string | null;
          type: ProductV1MediaType;
        }> | null;
        contactLinks?: Array<{
          __typename?: "ProductV1SellerContactLink";
          id: string;
          url: string;
          tag: string;
        }> | null;
        seller: {
          __typename?: "Seller";
          id: string;
          operator: string;
          admin: string;
          clerk: string;
          treasury: string;
          authTokenId: string;
          authTokenType: number;
          voucherCloneAddress: string;
          active: boolean;
          contractURI: string;
          royaltyPercentage: string;
        };
      } | null;
    };
    variations?: Array<{
      __typename?: "ProductV1Variation";
      id: string;
      type: string;
      option: string;
    }> | null;
    productV1Seller: {
      __typename?: "ProductV1Seller";
      id: string;
      defaultVersion: number;
      name?: string | null;
      description?: string | null;
      externalUrl?: string | null;
      tokenId?: string | null;
      sellerId?: string | null;
      images?: Array<{
        __typename?: "ProductV1Media";
        id: string;
        url: string;
        tag?: string | null;
        type: ProductV1MediaType;
      }> | null;
      contactLinks?: Array<{
        __typename?: "ProductV1SellerContactLink";
        id: string;
        url: string;
        tag: string;
      }> | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
    };
    exchangePolicy: {
      __typename?: "ProductV1ExchangePolicy";
      id: string;
      uuid: string;
      version: number;
      label?: string | null;
      template: string;
      sellerContactMethod: string;
      disputeResolverContactMethod: string;
    };
  } | null;
};

export type GetProductV1MetadataEntitiesQueryQueryVariables = Exact<{
  metadataSkip?: InputMaybe<Scalars["Int"]>;
  metadataFirst?: InputMaybe<Scalars["Int"]>;
  metadataOrderBy?: InputMaybe<ProductV1MetadataEntity_OrderBy>;
  metadataOrderDirection?: InputMaybe<OrderDirection>;
  metadataFilter?: InputMaybe<ProductV1MetadataEntity_Filter>;
}>;

export type GetProductV1MetadataEntitiesQueryQuery = {
  __typename?: "Query";
  productV1MetadataEntities: Array<{
    __typename?: "ProductV1MetadataEntity";
    id: string;
    name: string;
    description: string;
    externalUrl: string;
    animationUrl?: string | null;
    licenseUrl: string;
    condition?: string | null;
    schemaUrl: string;
    type: MetadataType;
    image: string;
    createdAt: string;
    voided: boolean;
    validFromDate: string;
    validUntilDate: string;
    quantityAvailable: string;
    numberOfCommits: string;
    numberOfRedemptions: string;
    uuid: string;
    attributes?: Array<{
      __typename?: "MetadataAttribute";
      traitType: string;
      value: string;
      displayType: string;
    }> | null;
    offer: {
      __typename?: "Offer";
      id: string;
      createdAt: string;
      price: string;
      sellerDeposit: string;
      protocolFee: string;
      agentFee: string;
      agentId: string;
      buyerCancelPenalty: string;
      quantityAvailable: string;
      quantityInitial: string;
      validFromDate: string;
      validUntilDate: string;
      voucherRedeemableFromDate: string;
      voucherRedeemableUntilDate: string;
      disputePeriodDuration: string;
      voucherValidDuration: string;
      resolutionPeriodDuration: string;
      metadataUri: string;
      metadataHash: string;
      voided: boolean;
      voidedAt?: string | null;
      disputeResolverId: string;
      numberOfCommits: string;
      numberOfRedemptions: string;
      exchanges: Array<{
        __typename?: "Exchange";
        id: string;
        disputed: boolean;
        state: ExchangeState;
        committedDate: string;
        finalizedDate?: string | null;
        validUntilDate: string;
        redeemedDate?: string | null;
        revokedDate?: string | null;
        cancelledDate?: string | null;
        completedDate?: string | null;
        disputedDate?: string | null;
        expired: boolean;
        dispute?: {
          __typename?: "Dispute";
          id: string;
          exchangeId: string;
          state: DisputeState;
          buyerPercent: string;
          disputedDate: string;
          escalatedDate?: string | null;
          finalizedDate?: string | null;
          retractedDate?: string | null;
          resolvedDate?: string | null;
          decidedDate?: string | null;
          refusedDate?: string | null;
          timeout: string;
        } | null;
        buyer: {
          __typename?: "Buyer";
          id: string;
          wallet: string;
          active: boolean;
        };
        seller: {
          __typename?: "Seller";
          id: string;
          operator: string;
          admin: string;
          clerk: string;
          treasury: string;
          authTokenId: string;
          authTokenType: number;
          voucherCloneAddress: string;
          active: boolean;
          contractURI: string;
          royaltyPercentage: string;
        };
      }>;
      condition?: {
        __typename?: "ConditionEntity";
        id: string;
        method: number;
        tokenType: number;
        tokenAddress: string;
        tokenId: string;
        threshold: string;
        maxCommits: string;
      } | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
      exchangeToken: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
      disputeResolver: {
        __typename?: "DisputeResolver";
        id: string;
        escalationResponsePeriod: string;
        admin: string;
        clerk: string;
        treasury: string;
        operator: string;
        metadataUri: string;
        active: boolean;
        sellerAllowList: Array<string>;
        fees: Array<{
          __typename?: "DisputeResolverFee";
          id: string;
          tokenAddress: string;
          tokenName: string;
          feeAmount: string;
          token: {
            __typename?: "ExchangeToken";
            id: string;
            address: string;
            decimals: string;
            symbol: string;
            name: string;
          };
        }>;
      };
      disputeResolutionTerms: {
        __typename?: "DisputeResolutionTermsEntity";
        id: string;
        disputeResolverId: string;
        escalationResponsePeriod: string;
        feeAmount: string;
        buyerEscalationDeposit: string;
      };
      metadata?:
        | {
            __typename?: "BaseMetadataEntity";
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
          }
        | {
            __typename?: "ProductV1MetadataEntity";
            createdAt: string;
            voided: boolean;
            validFromDate: string;
            validUntilDate: string;
            quantityAvailable: string;
            uuid: string;
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
            attributes?: Array<{
              __typename?: "MetadataAttribute";
              traitType: string;
              value: string;
              displayType: string;
            }> | null;
            product: {
              __typename?: "ProductV1Product";
              id: string;
              uuid: string;
              version: number;
              title: string;
              description: string;
              identification_sKU?: string | null;
              identification_productId?: string | null;
              identification_productIdType?: string | null;
              productionInformation_brandName: string;
              productionInformation_manufacturer?: string | null;
              productionInformation_manufacturerPartNumber?: string | null;
              productionInformation_modelNumber?: string | null;
              productionInformation_materials?: Array<string> | null;
              details_category?: string | null;
              details_subCategory?: string | null;
              details_subCategory2?: string | null;
              details_offerCategory: string;
              offerCategory: ProductV1OfferCategory;
              details_tags?: Array<string> | null;
              details_sections?: Array<string> | null;
              details_personalisation?: Array<string> | null;
              packaging_packageQuantity?: string | null;
              packaging_dimensions_length?: string | null;
              packaging_dimensions_width?: string | null;
              packaging_dimensions_height?: string | null;
              packaging_dimensions_unit?: string | null;
              packaging_weight_value?: string | null;
              packaging_weight_unit?: string | null;
              brand: {
                __typename?: "ProductV1Brand";
                id: string;
                name: string;
              };
              category?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory2?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              tags?: Array<{
                __typename?: "ProductV1Tag";
                id: string;
                name: string;
              }> | null;
              sections?: Array<{
                __typename?: "ProductV1Section";
                id: string;
                name: string;
              }> | null;
              personalisation?: Array<{
                __typename?: "ProductV1Personalisation";
                id: string;
                name: string;
              }> | null;
              visuals_images: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }>;
              visuals_videos?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              productV1Seller?: {
                __typename?: "ProductV1Seller";
                id: string;
                defaultVersion: number;
                name?: string | null;
                description?: string | null;
                externalUrl?: string | null;
                tokenId?: string | null;
                sellerId?: string | null;
                images?: Array<{
                  __typename?: "ProductV1Media";
                  id: string;
                  url: string;
                  tag?: string | null;
                  type: ProductV1MediaType;
                }> | null;
                contactLinks?: Array<{
                  __typename?: "ProductV1SellerContactLink";
                  id: string;
                  url: string;
                  tag: string;
                }> | null;
                seller: {
                  __typename?: "Seller";
                  id: string;
                  operator: string;
                  admin: string;
                  clerk: string;
                  treasury: string;
                  authTokenId: string;
                  authTokenType: number;
                  voucherCloneAddress: string;
                  active: boolean;
                  contractURI: string;
                  royaltyPercentage: string;
                };
              } | null;
            };
            variations?: Array<{
              __typename?: "ProductV1Variation";
              id: string;
              type: string;
              option: string;
            }> | null;
            productV1Seller: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            };
            exchangePolicy: {
              __typename?: "ProductV1ExchangePolicy";
              id: string;
              uuid: string;
              version: number;
              label?: string | null;
              template: string;
              sellerContactMethod: string;
              disputeResolverContactMethod: string;
            };
            shipping?: {
              __typename?: "ProductV1ShippingOption";
              id: string;
              defaultVersion?: number | null;
              countryOfOrigin?: string | null;
              redemptionPoint?: string | null;
              returnPeriodInDays: number;
              supportedJurisdictions?: Array<{
                __typename?: "ProductV1ShippingJurisdiction";
                id: string;
                label: string;
                deliveryTime: string;
              }> | null;
            } | null;
          }
        | null;
    };
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
    exchangeToken: {
      __typename?: "ExchangeToken";
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
    product: {
      __typename?: "ProductV1Product";
      id: string;
      uuid: string;
      version: number;
      title: string;
      description: string;
      identification_sKU?: string | null;
      identification_productId?: string | null;
      identification_productIdType?: string | null;
      productionInformation_brandName: string;
      productionInformation_manufacturer?: string | null;
      productionInformation_manufacturerPartNumber?: string | null;
      productionInformation_modelNumber?: string | null;
      productionInformation_materials?: Array<string> | null;
      details_category?: string | null;
      details_subCategory?: string | null;
      details_subCategory2?: string | null;
      details_offerCategory: string;
      offerCategory: ProductV1OfferCategory;
      details_tags?: Array<string> | null;
      details_sections?: Array<string> | null;
      details_personalisation?: Array<string> | null;
      packaging_packageQuantity?: string | null;
      packaging_dimensions_length?: string | null;
      packaging_dimensions_width?: string | null;
      packaging_dimensions_height?: string | null;
      packaging_dimensions_unit?: string | null;
      packaging_weight_value?: string | null;
      packaging_weight_unit?: string | null;
      brand: { __typename?: "ProductV1Brand"; id: string; name: string };
      category?: {
        __typename?: "ProductV1Category";
        id: string;
        name: string;
      } | null;
      subCategory?: {
        __typename?: "ProductV1Category";
        id: string;
        name: string;
      } | null;
      subCategory2?: {
        __typename?: "ProductV1Category";
        id: string;
        name: string;
      } | null;
      tags?: Array<{
        __typename?: "ProductV1Tag";
        id: string;
        name: string;
      }> | null;
      sections?: Array<{
        __typename?: "ProductV1Section";
        id: string;
        name: string;
      }> | null;
      personalisation?: Array<{
        __typename?: "ProductV1Personalisation";
        id: string;
        name: string;
      }> | null;
      visuals_images: Array<{
        __typename?: "ProductV1Media";
        id: string;
        url: string;
        tag?: string | null;
        type: ProductV1MediaType;
      }>;
      visuals_videos?: Array<{
        __typename?: "ProductV1Media";
        id: string;
        url: string;
        tag?: string | null;
        type: ProductV1MediaType;
      }> | null;
      productV1Seller?: {
        __typename?: "ProductV1Seller";
        id: string;
        defaultVersion: number;
        name?: string | null;
        description?: string | null;
        externalUrl?: string | null;
        tokenId?: string | null;
        sellerId?: string | null;
        images?: Array<{
          __typename?: "ProductV1Media";
          id: string;
          url: string;
          tag?: string | null;
          type: ProductV1MediaType;
        }> | null;
        contactLinks?: Array<{
          __typename?: "ProductV1SellerContactLink";
          id: string;
          url: string;
          tag: string;
        }> | null;
        seller: {
          __typename?: "Seller";
          id: string;
          operator: string;
          admin: string;
          clerk: string;
          treasury: string;
          authTokenId: string;
          authTokenType: number;
          voucherCloneAddress: string;
          active: boolean;
          contractURI: string;
          royaltyPercentage: string;
        };
      } | null;
    };
    variations?: Array<{
      __typename?: "ProductV1Variation";
      id: string;
      type: string;
      option: string;
    }> | null;
    productV1Seller: {
      __typename?: "ProductV1Seller";
      id: string;
      defaultVersion: number;
      name?: string | null;
      description?: string | null;
      externalUrl?: string | null;
      tokenId?: string | null;
      sellerId?: string | null;
      images?: Array<{
        __typename?: "ProductV1Media";
        id: string;
        url: string;
        tag?: string | null;
        type: ProductV1MediaType;
      }> | null;
      contactLinks?: Array<{
        __typename?: "ProductV1SellerContactLink";
        id: string;
        url: string;
        tag: string;
      }> | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
    };
    exchangePolicy: {
      __typename?: "ProductV1ExchangePolicy";
      id: string;
      uuid: string;
      version: number;
      label?: string | null;
      template: string;
      sellerContactMethod: string;
      disputeResolverContactMethod: string;
    };
  }>;
};

export type ProductV1MetadataEntityFieldsFragment = {
  __typename?: "ProductV1MetadataEntity";
  id: string;
  name: string;
  description: string;
  externalUrl: string;
  animationUrl?: string | null;
  licenseUrl: string;
  condition?: string | null;
  schemaUrl: string;
  type: MetadataType;
  image: string;
  createdAt: string;
  voided: boolean;
  validFromDate: string;
  validUntilDate: string;
  quantityAvailable: string;
  numberOfCommits: string;
  numberOfRedemptions: string;
  uuid: string;
  attributes?: Array<{
    __typename?: "MetadataAttribute";
    traitType: string;
    value: string;
    displayType: string;
  }> | null;
  offer: {
    __typename?: "Offer";
    id: string;
    createdAt: string;
    price: string;
    sellerDeposit: string;
    protocolFee: string;
    agentFee: string;
    agentId: string;
    buyerCancelPenalty: string;
    quantityAvailable: string;
    quantityInitial: string;
    validFromDate: string;
    validUntilDate: string;
    voucherRedeemableFromDate: string;
    voucherRedeemableUntilDate: string;
    disputePeriodDuration: string;
    voucherValidDuration: string;
    resolutionPeriodDuration: string;
    metadataUri: string;
    metadataHash: string;
    voided: boolean;
    voidedAt?: string | null;
    disputeResolverId: string;
    numberOfCommits: string;
    numberOfRedemptions: string;
    exchanges: Array<{
      __typename?: "Exchange";
      id: string;
      disputed: boolean;
      state: ExchangeState;
      committedDate: string;
      finalizedDate?: string | null;
      validUntilDate: string;
      redeemedDate?: string | null;
      revokedDate?: string | null;
      cancelledDate?: string | null;
      completedDate?: string | null;
      disputedDate?: string | null;
      expired: boolean;
      dispute?: {
        __typename?: "Dispute";
        id: string;
        exchangeId: string;
        state: DisputeState;
        buyerPercent: string;
        disputedDate: string;
        escalatedDate?: string | null;
        finalizedDate?: string | null;
        retractedDate?: string | null;
        resolvedDate?: string | null;
        decidedDate?: string | null;
        refusedDate?: string | null;
        timeout: string;
      } | null;
      buyer: {
        __typename?: "Buyer";
        id: string;
        wallet: string;
        active: boolean;
      };
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
    }>;
    condition?: {
      __typename?: "ConditionEntity";
      id: string;
      method: number;
      tokenType: number;
      tokenAddress: string;
      tokenId: string;
      threshold: string;
      maxCommits: string;
    } | null;
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
    exchangeToken: {
      __typename?: "ExchangeToken";
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
    disputeResolver: {
      __typename?: "DisputeResolver";
      id: string;
      escalationResponsePeriod: string;
      admin: string;
      clerk: string;
      treasury: string;
      operator: string;
      metadataUri: string;
      active: boolean;
      sellerAllowList: Array<string>;
      fees: Array<{
        __typename?: "DisputeResolverFee";
        id: string;
        tokenAddress: string;
        tokenName: string;
        feeAmount: string;
        token: {
          __typename?: "ExchangeToken";
          id: string;
          address: string;
          decimals: string;
          symbol: string;
          name: string;
        };
      }>;
    };
    disputeResolutionTerms: {
      __typename?: "DisputeResolutionTermsEntity";
      id: string;
      disputeResolverId: string;
      escalationResponsePeriod: string;
      feeAmount: string;
      buyerEscalationDeposit: string;
    };
    metadata?:
      | {
          __typename?: "BaseMetadataEntity";
          name: string;
          description: string;
          externalUrl: string;
          animationUrl?: string | null;
          licenseUrl: string;
          condition?: string | null;
          schemaUrl: string;
          type: MetadataType;
          image: string;
        }
      | {
          __typename?: "ProductV1MetadataEntity";
          createdAt: string;
          voided: boolean;
          validFromDate: string;
          validUntilDate: string;
          quantityAvailable: string;
          uuid: string;
          name: string;
          description: string;
          externalUrl: string;
          animationUrl?: string | null;
          licenseUrl: string;
          condition?: string | null;
          schemaUrl: string;
          type: MetadataType;
          image: string;
          attributes?: Array<{
            __typename?: "MetadataAttribute";
            traitType: string;
            value: string;
            displayType: string;
          }> | null;
          product: {
            __typename?: "ProductV1Product";
            id: string;
            uuid: string;
            version: number;
            title: string;
            description: string;
            identification_sKU?: string | null;
            identification_productId?: string | null;
            identification_productIdType?: string | null;
            productionInformation_brandName: string;
            productionInformation_manufacturer?: string | null;
            productionInformation_manufacturerPartNumber?: string | null;
            productionInformation_modelNumber?: string | null;
            productionInformation_materials?: Array<string> | null;
            details_category?: string | null;
            details_subCategory?: string | null;
            details_subCategory2?: string | null;
            details_offerCategory: string;
            offerCategory: ProductV1OfferCategory;
            details_tags?: Array<string> | null;
            details_sections?: Array<string> | null;
            details_personalisation?: Array<string> | null;
            packaging_packageQuantity?: string | null;
            packaging_dimensions_length?: string | null;
            packaging_dimensions_width?: string | null;
            packaging_dimensions_height?: string | null;
            packaging_dimensions_unit?: string | null;
            packaging_weight_value?: string | null;
            packaging_weight_unit?: string | null;
            brand: { __typename?: "ProductV1Brand"; id: string; name: string };
            category?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            subCategory?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            subCategory2?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            tags?: Array<{
              __typename?: "ProductV1Tag";
              id: string;
              name: string;
            }> | null;
            sections?: Array<{
              __typename?: "ProductV1Section";
              id: string;
              name: string;
            }> | null;
            personalisation?: Array<{
              __typename?: "ProductV1Personalisation";
              id: string;
              name: string;
            }> | null;
            visuals_images: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }>;
            visuals_videos?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            productV1Seller?: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            } | null;
          };
          variations?: Array<{
            __typename?: "ProductV1Variation";
            id: string;
            type: string;
            option: string;
          }> | null;
          productV1Seller: {
            __typename?: "ProductV1Seller";
            id: string;
            defaultVersion: number;
            name?: string | null;
            description?: string | null;
            externalUrl?: string | null;
            tokenId?: string | null;
            sellerId?: string | null;
            images?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            contactLinks?: Array<{
              __typename?: "ProductV1SellerContactLink";
              id: string;
              url: string;
              tag: string;
            }> | null;
            seller: {
              __typename?: "Seller";
              id: string;
              operator: string;
              admin: string;
              clerk: string;
              treasury: string;
              authTokenId: string;
              authTokenType: number;
              voucherCloneAddress: string;
              active: boolean;
              contractURI: string;
              royaltyPercentage: string;
            };
          };
          exchangePolicy: {
            __typename?: "ProductV1ExchangePolicy";
            id: string;
            uuid: string;
            version: number;
            label?: string | null;
            template: string;
            sellerContactMethod: string;
            disputeResolverContactMethod: string;
          };
          shipping?: {
            __typename?: "ProductV1ShippingOption";
            id: string;
            defaultVersion?: number | null;
            countryOfOrigin?: string | null;
            redemptionPoint?: string | null;
            returnPeriodInDays: number;
            supportedJurisdictions?: Array<{
              __typename?: "ProductV1ShippingJurisdiction";
              id: string;
              label: string;
              deliveryTime: string;
            }> | null;
          } | null;
        }
      | null;
  };
  seller: {
    __typename?: "Seller";
    id: string;
    operator: string;
    admin: string;
    clerk: string;
    treasury: string;
    authTokenId: string;
    authTokenType: number;
    voucherCloneAddress: string;
    active: boolean;
    contractURI: string;
    royaltyPercentage: string;
  };
  exchangeToken: {
    __typename?: "ExchangeToken";
    id: string;
    address: string;
    decimals: string;
    symbol: string;
    name: string;
  };
  product: {
    __typename?: "ProductV1Product";
    id: string;
    uuid: string;
    version: number;
    title: string;
    description: string;
    identification_sKU?: string | null;
    identification_productId?: string | null;
    identification_productIdType?: string | null;
    productionInformation_brandName: string;
    productionInformation_manufacturer?: string | null;
    productionInformation_manufacturerPartNumber?: string | null;
    productionInformation_modelNumber?: string | null;
    productionInformation_materials?: Array<string> | null;
    details_category?: string | null;
    details_subCategory?: string | null;
    details_subCategory2?: string | null;
    details_offerCategory: string;
    offerCategory: ProductV1OfferCategory;
    details_tags?: Array<string> | null;
    details_sections?: Array<string> | null;
    details_personalisation?: Array<string> | null;
    packaging_packageQuantity?: string | null;
    packaging_dimensions_length?: string | null;
    packaging_dimensions_width?: string | null;
    packaging_dimensions_height?: string | null;
    packaging_dimensions_unit?: string | null;
    packaging_weight_value?: string | null;
    packaging_weight_unit?: string | null;
    brand: { __typename?: "ProductV1Brand"; id: string; name: string };
    category?: {
      __typename?: "ProductV1Category";
      id: string;
      name: string;
    } | null;
    subCategory?: {
      __typename?: "ProductV1Category";
      id: string;
      name: string;
    } | null;
    subCategory2?: {
      __typename?: "ProductV1Category";
      id: string;
      name: string;
    } | null;
    tags?: Array<{
      __typename?: "ProductV1Tag";
      id: string;
      name: string;
    }> | null;
    sections?: Array<{
      __typename?: "ProductV1Section";
      id: string;
      name: string;
    }> | null;
    personalisation?: Array<{
      __typename?: "ProductV1Personalisation";
      id: string;
      name: string;
    }> | null;
    visuals_images: Array<{
      __typename?: "ProductV1Media";
      id: string;
      url: string;
      tag?: string | null;
      type: ProductV1MediaType;
    }>;
    visuals_videos?: Array<{
      __typename?: "ProductV1Media";
      id: string;
      url: string;
      tag?: string | null;
      type: ProductV1MediaType;
    }> | null;
    productV1Seller?: {
      __typename?: "ProductV1Seller";
      id: string;
      defaultVersion: number;
      name?: string | null;
      description?: string | null;
      externalUrl?: string | null;
      tokenId?: string | null;
      sellerId?: string | null;
      images?: Array<{
        __typename?: "ProductV1Media";
        id: string;
        url: string;
        tag?: string | null;
        type: ProductV1MediaType;
      }> | null;
      contactLinks?: Array<{
        __typename?: "ProductV1SellerContactLink";
        id: string;
        url: string;
        tag: string;
      }> | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
    } | null;
  };
  variations?: Array<{
    __typename?: "ProductV1Variation";
    id: string;
    type: string;
    option: string;
  }> | null;
  productV1Seller: {
    __typename?: "ProductV1Seller";
    id: string;
    defaultVersion: number;
    name?: string | null;
    description?: string | null;
    externalUrl?: string | null;
    tokenId?: string | null;
    sellerId?: string | null;
    images?: Array<{
      __typename?: "ProductV1Media";
      id: string;
      url: string;
      tag?: string | null;
      type: ProductV1MediaType;
    }> | null;
    contactLinks?: Array<{
      __typename?: "ProductV1SellerContactLink";
      id: string;
      url: string;
      tag: string;
    }> | null;
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
  };
  exchangePolicy: {
    __typename?: "ProductV1ExchangePolicy";
    id: string;
    uuid: string;
    version: number;
    label?: string | null;
    template: string;
    sellerContactMethod: string;
    disputeResolverContactMethod: string;
  };
};

export type BaseProductV1MetadataEntityFieldsFragment = {
  __typename?: "ProductV1MetadataEntity";
  id: string;
  name: string;
  description: string;
  externalUrl: string;
  animationUrl?: string | null;
  licenseUrl: string;
  condition?: string | null;
  schemaUrl: string;
  type: MetadataType;
  image: string;
  createdAt: string;
  voided: boolean;
  validFromDate: string;
  validUntilDate: string;
  quantityAvailable: string;
  numberOfCommits: string;
  numberOfRedemptions: string;
  uuid: string;
  attributes?: Array<{
    __typename?: "MetadataAttribute";
    traitType: string;
    value: string;
    displayType: string;
  }> | null;
  offer: {
    __typename?: "Offer";
    id: string;
    createdAt: string;
    price: string;
    sellerDeposit: string;
    protocolFee: string;
    agentFee: string;
    agentId: string;
    buyerCancelPenalty: string;
    quantityAvailable: string;
    quantityInitial: string;
    validFromDate: string;
    validUntilDate: string;
    voucherRedeemableFromDate: string;
    voucherRedeemableUntilDate: string;
    disputePeriodDuration: string;
    voucherValidDuration: string;
    resolutionPeriodDuration: string;
    metadataUri: string;
    metadataHash: string;
    voided: boolean;
    voidedAt?: string | null;
    disputeResolverId: string;
    numberOfCommits: string;
    numberOfRedemptions: string;
    exchanges: Array<{
      __typename?: "Exchange";
      id: string;
      disputed: boolean;
      state: ExchangeState;
      committedDate: string;
      finalizedDate?: string | null;
      validUntilDate: string;
      redeemedDate?: string | null;
      revokedDate?: string | null;
      cancelledDate?: string | null;
      completedDate?: string | null;
      disputedDate?: string | null;
      expired: boolean;
      dispute?: {
        __typename?: "Dispute";
        id: string;
        exchangeId: string;
        state: DisputeState;
        buyerPercent: string;
        disputedDate: string;
        escalatedDate?: string | null;
        finalizedDate?: string | null;
        retractedDate?: string | null;
        resolvedDate?: string | null;
        decidedDate?: string | null;
        refusedDate?: string | null;
        timeout: string;
      } | null;
      buyer: {
        __typename?: "Buyer";
        id: string;
        wallet: string;
        active: boolean;
      };
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
    }>;
    condition?: {
      __typename?: "ConditionEntity";
      id: string;
      method: number;
      tokenType: number;
      tokenAddress: string;
      tokenId: string;
      threshold: string;
      maxCommits: string;
    } | null;
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
    exchangeToken: {
      __typename?: "ExchangeToken";
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
    disputeResolver: {
      __typename?: "DisputeResolver";
      id: string;
      escalationResponsePeriod: string;
      admin: string;
      clerk: string;
      treasury: string;
      operator: string;
      metadataUri: string;
      active: boolean;
      sellerAllowList: Array<string>;
      fees: Array<{
        __typename?: "DisputeResolverFee";
        id: string;
        tokenAddress: string;
        tokenName: string;
        feeAmount: string;
        token: {
          __typename?: "ExchangeToken";
          id: string;
          address: string;
          decimals: string;
          symbol: string;
          name: string;
        };
      }>;
    };
    disputeResolutionTerms: {
      __typename?: "DisputeResolutionTermsEntity";
      id: string;
      disputeResolverId: string;
      escalationResponsePeriod: string;
      feeAmount: string;
      buyerEscalationDeposit: string;
    };
    metadata?:
      | {
          __typename?: "BaseMetadataEntity";
          name: string;
          description: string;
          externalUrl: string;
          animationUrl?: string | null;
          licenseUrl: string;
          condition?: string | null;
          schemaUrl: string;
          type: MetadataType;
          image: string;
        }
      | {
          __typename?: "ProductV1MetadataEntity";
          createdAt: string;
          voided: boolean;
          validFromDate: string;
          validUntilDate: string;
          quantityAvailable: string;
          uuid: string;
          name: string;
          description: string;
          externalUrl: string;
          animationUrl?: string | null;
          licenseUrl: string;
          condition?: string | null;
          schemaUrl: string;
          type: MetadataType;
          image: string;
          attributes?: Array<{
            __typename?: "MetadataAttribute";
            traitType: string;
            value: string;
            displayType: string;
          }> | null;
          product: {
            __typename?: "ProductV1Product";
            id: string;
            uuid: string;
            version: number;
            title: string;
            description: string;
            identification_sKU?: string | null;
            identification_productId?: string | null;
            identification_productIdType?: string | null;
            productionInformation_brandName: string;
            productionInformation_manufacturer?: string | null;
            productionInformation_manufacturerPartNumber?: string | null;
            productionInformation_modelNumber?: string | null;
            productionInformation_materials?: Array<string> | null;
            details_category?: string | null;
            details_subCategory?: string | null;
            details_subCategory2?: string | null;
            details_offerCategory: string;
            offerCategory: ProductV1OfferCategory;
            details_tags?: Array<string> | null;
            details_sections?: Array<string> | null;
            details_personalisation?: Array<string> | null;
            packaging_packageQuantity?: string | null;
            packaging_dimensions_length?: string | null;
            packaging_dimensions_width?: string | null;
            packaging_dimensions_height?: string | null;
            packaging_dimensions_unit?: string | null;
            packaging_weight_value?: string | null;
            packaging_weight_unit?: string | null;
            brand: { __typename?: "ProductV1Brand"; id: string; name: string };
            category?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            subCategory?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            subCategory2?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            tags?: Array<{
              __typename?: "ProductV1Tag";
              id: string;
              name: string;
            }> | null;
            sections?: Array<{
              __typename?: "ProductV1Section";
              id: string;
              name: string;
            }> | null;
            personalisation?: Array<{
              __typename?: "ProductV1Personalisation";
              id: string;
              name: string;
            }> | null;
            visuals_images: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }>;
            visuals_videos?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            productV1Seller?: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            } | null;
          };
          variations?: Array<{
            __typename?: "ProductV1Variation";
            id: string;
            type: string;
            option: string;
          }> | null;
          productV1Seller: {
            __typename?: "ProductV1Seller";
            id: string;
            defaultVersion: number;
            name?: string | null;
            description?: string | null;
            externalUrl?: string | null;
            tokenId?: string | null;
            sellerId?: string | null;
            images?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            contactLinks?: Array<{
              __typename?: "ProductV1SellerContactLink";
              id: string;
              url: string;
              tag: string;
            }> | null;
            seller: {
              __typename?: "Seller";
              id: string;
              operator: string;
              admin: string;
              clerk: string;
              treasury: string;
              authTokenId: string;
              authTokenType: number;
              voucherCloneAddress: string;
              active: boolean;
              contractURI: string;
              royaltyPercentage: string;
            };
          };
          exchangePolicy: {
            __typename?: "ProductV1ExchangePolicy";
            id: string;
            uuid: string;
            version: number;
            label?: string | null;
            template: string;
            sellerContactMethod: string;
            disputeResolverContactMethod: string;
          };
          shipping?: {
            __typename?: "ProductV1ShippingOption";
            id: string;
            defaultVersion?: number | null;
            countryOfOrigin?: string | null;
            redemptionPoint?: string | null;
            returnPeriodInDays: number;
            supportedJurisdictions?: Array<{
              __typename?: "ProductV1ShippingJurisdiction";
              id: string;
              label: string;
              deliveryTime: string;
            }> | null;
          } | null;
        }
      | null;
  };
  seller: {
    __typename?: "Seller";
    id: string;
    operator: string;
    admin: string;
    clerk: string;
    treasury: string;
    authTokenId: string;
    authTokenType: number;
    voucherCloneAddress: string;
    active: boolean;
    contractURI: string;
    royaltyPercentage: string;
  };
  exchangeToken: {
    __typename?: "ExchangeToken";
    id: string;
    address: string;
    decimals: string;
    symbol: string;
    name: string;
  };
  product: {
    __typename?: "ProductV1Product";
    id: string;
    uuid: string;
    version: number;
    title: string;
    description: string;
    identification_sKU?: string | null;
    identification_productId?: string | null;
    identification_productIdType?: string | null;
    productionInformation_brandName: string;
    productionInformation_manufacturer?: string | null;
    productionInformation_manufacturerPartNumber?: string | null;
    productionInformation_modelNumber?: string | null;
    productionInformation_materials?: Array<string> | null;
    details_category?: string | null;
    details_subCategory?: string | null;
    details_subCategory2?: string | null;
    details_offerCategory: string;
    offerCategory: ProductV1OfferCategory;
    details_tags?: Array<string> | null;
    details_sections?: Array<string> | null;
    details_personalisation?: Array<string> | null;
    packaging_packageQuantity?: string | null;
    packaging_dimensions_length?: string | null;
    packaging_dimensions_width?: string | null;
    packaging_dimensions_height?: string | null;
    packaging_dimensions_unit?: string | null;
    packaging_weight_value?: string | null;
    packaging_weight_unit?: string | null;
    brand: { __typename?: "ProductV1Brand"; id: string; name: string };
    category?: {
      __typename?: "ProductV1Category";
      id: string;
      name: string;
    } | null;
    subCategory?: {
      __typename?: "ProductV1Category";
      id: string;
      name: string;
    } | null;
    subCategory2?: {
      __typename?: "ProductV1Category";
      id: string;
      name: string;
    } | null;
    tags?: Array<{
      __typename?: "ProductV1Tag";
      id: string;
      name: string;
    }> | null;
    sections?: Array<{
      __typename?: "ProductV1Section";
      id: string;
      name: string;
    }> | null;
    personalisation?: Array<{
      __typename?: "ProductV1Personalisation";
      id: string;
      name: string;
    }> | null;
    visuals_images: Array<{
      __typename?: "ProductV1Media";
      id: string;
      url: string;
      tag?: string | null;
      type: ProductV1MediaType;
    }>;
    visuals_videos?: Array<{
      __typename?: "ProductV1Media";
      id: string;
      url: string;
      tag?: string | null;
      type: ProductV1MediaType;
    }> | null;
    productV1Seller?: {
      __typename?: "ProductV1Seller";
      id: string;
      defaultVersion: number;
      name?: string | null;
      description?: string | null;
      externalUrl?: string | null;
      tokenId?: string | null;
      sellerId?: string | null;
      images?: Array<{
        __typename?: "ProductV1Media";
        id: string;
        url: string;
        tag?: string | null;
        type: ProductV1MediaType;
      }> | null;
      contactLinks?: Array<{
        __typename?: "ProductV1SellerContactLink";
        id: string;
        url: string;
        tag: string;
      }> | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
    } | null;
  };
  variations?: Array<{
    __typename?: "ProductV1Variation";
    id: string;
    type: string;
    option: string;
  }> | null;
  productV1Seller: {
    __typename?: "ProductV1Seller";
    id: string;
    defaultVersion: number;
    name?: string | null;
    description?: string | null;
    externalUrl?: string | null;
    tokenId?: string | null;
    sellerId?: string | null;
    images?: Array<{
      __typename?: "ProductV1Media";
      id: string;
      url: string;
      tag?: string | null;
      type: ProductV1MediaType;
    }> | null;
    contactLinks?: Array<{
      __typename?: "ProductV1SellerContactLink";
      id: string;
      url: string;
      tag: string;
    }> | null;
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
  };
  exchangePolicy: {
    __typename?: "ProductV1ExchangePolicy";
    id: string;
    uuid: string;
    version: number;
    label?: string | null;
    template: string;
    sellerContactMethod: string;
    disputeResolverContactMethod: string;
  };
};

export type BaseProductV1ProductFieldsFragment = {
  __typename?: "ProductV1Product";
  id: string;
  uuid: string;
  version: number;
  title: string;
  description: string;
  identification_sKU?: string | null;
  identification_productId?: string | null;
  identification_productIdType?: string | null;
  productionInformation_brandName: string;
  productionInformation_manufacturer?: string | null;
  productionInformation_manufacturerPartNumber?: string | null;
  productionInformation_modelNumber?: string | null;
  productionInformation_materials?: Array<string> | null;
  details_category?: string | null;
  details_subCategory?: string | null;
  details_subCategory2?: string | null;
  details_offerCategory: string;
  offerCategory: ProductV1OfferCategory;
  details_tags?: Array<string> | null;
  details_sections?: Array<string> | null;
  details_personalisation?: Array<string> | null;
  packaging_packageQuantity?: string | null;
  packaging_dimensions_length?: string | null;
  packaging_dimensions_width?: string | null;
  packaging_dimensions_height?: string | null;
  packaging_dimensions_unit?: string | null;
  packaging_weight_value?: string | null;
  packaging_weight_unit?: string | null;
  brand: { __typename?: "ProductV1Brand"; id: string; name: string };
  category?: {
    __typename?: "ProductV1Category";
    id: string;
    name: string;
  } | null;
  subCategory?: {
    __typename?: "ProductV1Category";
    id: string;
    name: string;
  } | null;
  subCategory2?: {
    __typename?: "ProductV1Category";
    id: string;
    name: string;
  } | null;
  tags?: Array<{
    __typename?: "ProductV1Tag";
    id: string;
    name: string;
  }> | null;
  sections?: Array<{
    __typename?: "ProductV1Section";
    id: string;
    name: string;
  }> | null;
  personalisation?: Array<{
    __typename?: "ProductV1Personalisation";
    id: string;
    name: string;
  }> | null;
  visuals_images: Array<{
    __typename?: "ProductV1Media";
    id: string;
    url: string;
    tag?: string | null;
    type: ProductV1MediaType;
  }>;
  visuals_videos?: Array<{
    __typename?: "ProductV1Media";
    id: string;
    url: string;
    tag?: string | null;
    type: ProductV1MediaType;
  }> | null;
  productV1Seller?: {
    __typename?: "ProductV1Seller";
    id: string;
    defaultVersion: number;
    name?: string | null;
    description?: string | null;
    externalUrl?: string | null;
    tokenId?: string | null;
    sellerId?: string | null;
    images?: Array<{
      __typename?: "ProductV1Media";
      id: string;
      url: string;
      tag?: string | null;
      type: ProductV1MediaType;
    }> | null;
    contactLinks?: Array<{
      __typename?: "ProductV1SellerContactLink";
      id: string;
      url: string;
      tag: string;
    }> | null;
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
  } | null;
};

export type BaseProductV1ProductWithVariantsFieldsFragment = {
  __typename?: "ProductV1Product";
  allVariantsVoided?: boolean | null;
  minValidFromDate: string;
  maxValidFromDate: string;
  minValidUntilDate: string;
  maxValidUntilDate: string;
  id: string;
  uuid: string;
  version: number;
  title: string;
  description: string;
  identification_sKU?: string | null;
  identification_productId?: string | null;
  identification_productIdType?: string | null;
  productionInformation_brandName: string;
  productionInformation_manufacturer?: string | null;
  productionInformation_manufacturerPartNumber?: string | null;
  productionInformation_modelNumber?: string | null;
  productionInformation_materials?: Array<string> | null;
  details_category?: string | null;
  details_subCategory?: string | null;
  details_subCategory2?: string | null;
  details_offerCategory: string;
  offerCategory: ProductV1OfferCategory;
  details_tags?: Array<string> | null;
  details_sections?: Array<string> | null;
  details_personalisation?: Array<string> | null;
  packaging_packageQuantity?: string | null;
  packaging_dimensions_length?: string | null;
  packaging_dimensions_width?: string | null;
  packaging_dimensions_height?: string | null;
  packaging_dimensions_unit?: string | null;
  packaging_weight_value?: string | null;
  packaging_weight_unit?: string | null;
  variants?: Array<{
    __typename?: "ProductV1Variant";
    offer: {
      __typename?: "Offer";
      id: string;
      createdAt: string;
      price: string;
      sellerDeposit: string;
      protocolFee: string;
      agentFee: string;
      agentId: string;
      buyerCancelPenalty: string;
      quantityAvailable: string;
      quantityInitial: string;
      validFromDate: string;
      validUntilDate: string;
      voucherRedeemableFromDate: string;
      voucherRedeemableUntilDate: string;
      disputePeriodDuration: string;
      voucherValidDuration: string;
      resolutionPeriodDuration: string;
      metadataUri: string;
      metadataHash: string;
      voided: boolean;
      voidedAt?: string | null;
      disputeResolverId: string;
      numberOfCommits: string;
      numberOfRedemptions: string;
      exchanges: Array<{
        __typename?: "Exchange";
        id: string;
        disputed: boolean;
        state: ExchangeState;
        committedDate: string;
        finalizedDate?: string | null;
        validUntilDate: string;
        redeemedDate?: string | null;
        revokedDate?: string | null;
        cancelledDate?: string | null;
        completedDate?: string | null;
        disputedDate?: string | null;
        expired: boolean;
        dispute?: {
          __typename?: "Dispute";
          id: string;
          exchangeId: string;
          state: DisputeState;
          buyerPercent: string;
          disputedDate: string;
          escalatedDate?: string | null;
          finalizedDate?: string | null;
          retractedDate?: string | null;
          resolvedDate?: string | null;
          decidedDate?: string | null;
          refusedDate?: string | null;
          timeout: string;
        } | null;
        buyer: {
          __typename?: "Buyer";
          id: string;
          wallet: string;
          active: boolean;
        };
        seller: {
          __typename?: "Seller";
          id: string;
          operator: string;
          admin: string;
          clerk: string;
          treasury: string;
          authTokenId: string;
          authTokenType: number;
          voucherCloneAddress: string;
          active: boolean;
          contractURI: string;
          royaltyPercentage: string;
        };
      }>;
      condition?: {
        __typename?: "ConditionEntity";
        id: string;
        method: number;
        tokenType: number;
        tokenAddress: string;
        tokenId: string;
        threshold: string;
        maxCommits: string;
      } | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
      exchangeToken: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
      disputeResolver: {
        __typename?: "DisputeResolver";
        id: string;
        escalationResponsePeriod: string;
        admin: string;
        clerk: string;
        treasury: string;
        operator: string;
        metadataUri: string;
        active: boolean;
        sellerAllowList: Array<string>;
        fees: Array<{
          __typename?: "DisputeResolverFee";
          id: string;
          tokenAddress: string;
          tokenName: string;
          feeAmount: string;
          token: {
            __typename?: "ExchangeToken";
            id: string;
            address: string;
            decimals: string;
            symbol: string;
            name: string;
          };
        }>;
      };
      disputeResolutionTerms: {
        __typename?: "DisputeResolutionTermsEntity";
        id: string;
        disputeResolverId: string;
        escalationResponsePeriod: string;
        feeAmount: string;
        buyerEscalationDeposit: string;
      };
      metadata?:
        | {
            __typename?: "BaseMetadataEntity";
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
          }
        | {
            __typename?: "ProductV1MetadataEntity";
            createdAt: string;
            voided: boolean;
            validFromDate: string;
            validUntilDate: string;
            quantityAvailable: string;
            uuid: string;
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
            attributes?: Array<{
              __typename?: "MetadataAttribute";
              traitType: string;
              value: string;
              displayType: string;
            }> | null;
            product: {
              __typename?: "ProductV1Product";
              id: string;
              uuid: string;
              version: number;
              title: string;
              description: string;
              identification_sKU?: string | null;
              identification_productId?: string | null;
              identification_productIdType?: string | null;
              productionInformation_brandName: string;
              productionInformation_manufacturer?: string | null;
              productionInformation_manufacturerPartNumber?: string | null;
              productionInformation_modelNumber?: string | null;
              productionInformation_materials?: Array<string> | null;
              details_category?: string | null;
              details_subCategory?: string | null;
              details_subCategory2?: string | null;
              details_offerCategory: string;
              offerCategory: ProductV1OfferCategory;
              details_tags?: Array<string> | null;
              details_sections?: Array<string> | null;
              details_personalisation?: Array<string> | null;
              packaging_packageQuantity?: string | null;
              packaging_dimensions_length?: string | null;
              packaging_dimensions_width?: string | null;
              packaging_dimensions_height?: string | null;
              packaging_dimensions_unit?: string | null;
              packaging_weight_value?: string | null;
              packaging_weight_unit?: string | null;
              brand: {
                __typename?: "ProductV1Brand";
                id: string;
                name: string;
              };
              category?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory2?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              tags?: Array<{
                __typename?: "ProductV1Tag";
                id: string;
                name: string;
              }> | null;
              sections?: Array<{
                __typename?: "ProductV1Section";
                id: string;
                name: string;
              }> | null;
              personalisation?: Array<{
                __typename?: "ProductV1Personalisation";
                id: string;
                name: string;
              }> | null;
              visuals_images: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }>;
              visuals_videos?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              productV1Seller?: {
                __typename?: "ProductV1Seller";
                id: string;
                defaultVersion: number;
                name?: string | null;
                description?: string | null;
                externalUrl?: string | null;
                tokenId?: string | null;
                sellerId?: string | null;
                images?: Array<{
                  __typename?: "ProductV1Media";
                  id: string;
                  url: string;
                  tag?: string | null;
                  type: ProductV1MediaType;
                }> | null;
                contactLinks?: Array<{
                  __typename?: "ProductV1SellerContactLink";
                  id: string;
                  url: string;
                  tag: string;
                }> | null;
                seller: {
                  __typename?: "Seller";
                  id: string;
                  operator: string;
                  admin: string;
                  clerk: string;
                  treasury: string;
                  authTokenId: string;
                  authTokenType: number;
                  voucherCloneAddress: string;
                  active: boolean;
                  contractURI: string;
                  royaltyPercentage: string;
                };
              } | null;
            };
            variations?: Array<{
              __typename?: "ProductV1Variation";
              id: string;
              type: string;
              option: string;
            }> | null;
            productV1Seller: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            };
            exchangePolicy: {
              __typename?: "ProductV1ExchangePolicy";
              id: string;
              uuid: string;
              version: number;
              label?: string | null;
              template: string;
              sellerContactMethod: string;
              disputeResolverContactMethod: string;
            };
            shipping?: {
              __typename?: "ProductV1ShippingOption";
              id: string;
              defaultVersion?: number | null;
              countryOfOrigin?: string | null;
              redemptionPoint?: string | null;
              returnPeriodInDays: number;
              supportedJurisdictions?: Array<{
                __typename?: "ProductV1ShippingJurisdiction";
                id: string;
                label: string;
                deliveryTime: string;
              }> | null;
            } | null;
          }
        | null;
    };
    variations?: Array<{
      __typename?: "ProductV1Variation";
      id: string;
      type: string;
      option: string;
    }> | null;
  }> | null;
  brand: { __typename?: "ProductV1Brand"; id: string; name: string };
  category?: {
    __typename?: "ProductV1Category";
    id: string;
    name: string;
  } | null;
  subCategory?: {
    __typename?: "ProductV1Category";
    id: string;
    name: string;
  } | null;
  subCategory2?: {
    __typename?: "ProductV1Category";
    id: string;
    name: string;
  } | null;
  tags?: Array<{
    __typename?: "ProductV1Tag";
    id: string;
    name: string;
  }> | null;
  sections?: Array<{
    __typename?: "ProductV1Section";
    id: string;
    name: string;
  }> | null;
  personalisation?: Array<{
    __typename?: "ProductV1Personalisation";
    id: string;
    name: string;
  }> | null;
  visuals_images: Array<{
    __typename?: "ProductV1Media";
    id: string;
    url: string;
    tag?: string | null;
    type: ProductV1MediaType;
  }>;
  visuals_videos?: Array<{
    __typename?: "ProductV1Media";
    id: string;
    url: string;
    tag?: string | null;
    type: ProductV1MediaType;
  }> | null;
  productV1Seller?: {
    __typename?: "ProductV1Seller";
    id: string;
    defaultVersion: number;
    name?: string | null;
    description?: string | null;
    externalUrl?: string | null;
    tokenId?: string | null;
    sellerId?: string | null;
    images?: Array<{
      __typename?: "ProductV1Media";
      id: string;
      url: string;
      tag?: string | null;
      type: ProductV1MediaType;
    }> | null;
    contactLinks?: Array<{
      __typename?: "ProductV1SellerContactLink";
      id: string;
      url: string;
      tag: string;
    }> | null;
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
  } | null;
};

export type BaseProductV1ProductWithNotVoidedVariantsFieldsFragment = {
  __typename?: "ProductV1Product";
  allVariantsVoided?: boolean | null;
  minValidFromDate: string;
  maxValidFromDate: string;
  minValidUntilDate: string;
  maxValidUntilDate: string;
  id: string;
  uuid: string;
  version: number;
  title: string;
  description: string;
  identification_sKU?: string | null;
  identification_productId?: string | null;
  identification_productIdType?: string | null;
  productionInformation_brandName: string;
  productionInformation_manufacturer?: string | null;
  productionInformation_manufacturerPartNumber?: string | null;
  productionInformation_modelNumber?: string | null;
  productionInformation_materials?: Array<string> | null;
  details_category?: string | null;
  details_subCategory?: string | null;
  details_subCategory2?: string | null;
  details_offerCategory: string;
  offerCategory: ProductV1OfferCategory;
  details_tags?: Array<string> | null;
  details_sections?: Array<string> | null;
  details_personalisation?: Array<string> | null;
  packaging_packageQuantity?: string | null;
  packaging_dimensions_length?: string | null;
  packaging_dimensions_width?: string | null;
  packaging_dimensions_height?: string | null;
  packaging_dimensions_unit?: string | null;
  packaging_weight_value?: string | null;
  packaging_weight_unit?: string | null;
  notVoidedVariants?: Array<{
    __typename?: "ProductV1Variant";
    offer: {
      __typename?: "Offer";
      id: string;
      createdAt: string;
      price: string;
      sellerDeposit: string;
      protocolFee: string;
      agentFee: string;
      agentId: string;
      buyerCancelPenalty: string;
      quantityAvailable: string;
      quantityInitial: string;
      validFromDate: string;
      validUntilDate: string;
      voucherRedeemableFromDate: string;
      voucherRedeemableUntilDate: string;
      disputePeriodDuration: string;
      voucherValidDuration: string;
      resolutionPeriodDuration: string;
      metadataUri: string;
      metadataHash: string;
      voided: boolean;
      voidedAt?: string | null;
      disputeResolverId: string;
      numberOfCommits: string;
      numberOfRedemptions: string;
      exchanges: Array<{
        __typename?: "Exchange";
        id: string;
        disputed: boolean;
        state: ExchangeState;
        committedDate: string;
        finalizedDate?: string | null;
        validUntilDate: string;
        redeemedDate?: string | null;
        revokedDate?: string | null;
        cancelledDate?: string | null;
        completedDate?: string | null;
        disputedDate?: string | null;
        expired: boolean;
        dispute?: {
          __typename?: "Dispute";
          id: string;
          exchangeId: string;
          state: DisputeState;
          buyerPercent: string;
          disputedDate: string;
          escalatedDate?: string | null;
          finalizedDate?: string | null;
          retractedDate?: string | null;
          resolvedDate?: string | null;
          decidedDate?: string | null;
          refusedDate?: string | null;
          timeout: string;
        } | null;
        buyer: {
          __typename?: "Buyer";
          id: string;
          wallet: string;
          active: boolean;
        };
        seller: {
          __typename?: "Seller";
          id: string;
          operator: string;
          admin: string;
          clerk: string;
          treasury: string;
          authTokenId: string;
          authTokenType: number;
          voucherCloneAddress: string;
          active: boolean;
          contractURI: string;
          royaltyPercentage: string;
        };
      }>;
      condition?: {
        __typename?: "ConditionEntity";
        id: string;
        method: number;
        tokenType: number;
        tokenAddress: string;
        tokenId: string;
        threshold: string;
        maxCommits: string;
      } | null;
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
      exchangeToken: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
      disputeResolver: {
        __typename?: "DisputeResolver";
        id: string;
        escalationResponsePeriod: string;
        admin: string;
        clerk: string;
        treasury: string;
        operator: string;
        metadataUri: string;
        active: boolean;
        sellerAllowList: Array<string>;
        fees: Array<{
          __typename?: "DisputeResolverFee";
          id: string;
          tokenAddress: string;
          tokenName: string;
          feeAmount: string;
          token: {
            __typename?: "ExchangeToken";
            id: string;
            address: string;
            decimals: string;
            symbol: string;
            name: string;
          };
        }>;
      };
      disputeResolutionTerms: {
        __typename?: "DisputeResolutionTermsEntity";
        id: string;
        disputeResolverId: string;
        escalationResponsePeriod: string;
        feeAmount: string;
        buyerEscalationDeposit: string;
      };
      metadata?:
        | {
            __typename?: "BaseMetadataEntity";
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
          }
        | {
            __typename?: "ProductV1MetadataEntity";
            createdAt: string;
            voided: boolean;
            validFromDate: string;
            validUntilDate: string;
            quantityAvailable: string;
            uuid: string;
            name: string;
            description: string;
            externalUrl: string;
            animationUrl?: string | null;
            licenseUrl: string;
            condition?: string | null;
            schemaUrl: string;
            type: MetadataType;
            image: string;
            attributes?: Array<{
              __typename?: "MetadataAttribute";
              traitType: string;
              value: string;
              displayType: string;
            }> | null;
            product: {
              __typename?: "ProductV1Product";
              id: string;
              uuid: string;
              version: number;
              title: string;
              description: string;
              identification_sKU?: string | null;
              identification_productId?: string | null;
              identification_productIdType?: string | null;
              productionInformation_brandName: string;
              productionInformation_manufacturer?: string | null;
              productionInformation_manufacturerPartNumber?: string | null;
              productionInformation_modelNumber?: string | null;
              productionInformation_materials?: Array<string> | null;
              details_category?: string | null;
              details_subCategory?: string | null;
              details_subCategory2?: string | null;
              details_offerCategory: string;
              offerCategory: ProductV1OfferCategory;
              details_tags?: Array<string> | null;
              details_sections?: Array<string> | null;
              details_personalisation?: Array<string> | null;
              packaging_packageQuantity?: string | null;
              packaging_dimensions_length?: string | null;
              packaging_dimensions_width?: string | null;
              packaging_dimensions_height?: string | null;
              packaging_dimensions_unit?: string | null;
              packaging_weight_value?: string | null;
              packaging_weight_unit?: string | null;
              brand: {
                __typename?: "ProductV1Brand";
                id: string;
                name: string;
              };
              category?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              subCategory2?: {
                __typename?: "ProductV1Category";
                id: string;
                name: string;
              } | null;
              tags?: Array<{
                __typename?: "ProductV1Tag";
                id: string;
                name: string;
              }> | null;
              sections?: Array<{
                __typename?: "ProductV1Section";
                id: string;
                name: string;
              }> | null;
              personalisation?: Array<{
                __typename?: "ProductV1Personalisation";
                id: string;
                name: string;
              }> | null;
              visuals_images: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }>;
              visuals_videos?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              productV1Seller?: {
                __typename?: "ProductV1Seller";
                id: string;
                defaultVersion: number;
                name?: string | null;
                description?: string | null;
                externalUrl?: string | null;
                tokenId?: string | null;
                sellerId?: string | null;
                images?: Array<{
                  __typename?: "ProductV1Media";
                  id: string;
                  url: string;
                  tag?: string | null;
                  type: ProductV1MediaType;
                }> | null;
                contactLinks?: Array<{
                  __typename?: "ProductV1SellerContactLink";
                  id: string;
                  url: string;
                  tag: string;
                }> | null;
                seller: {
                  __typename?: "Seller";
                  id: string;
                  operator: string;
                  admin: string;
                  clerk: string;
                  treasury: string;
                  authTokenId: string;
                  authTokenType: number;
                  voucherCloneAddress: string;
                  active: boolean;
                  contractURI: string;
                  royaltyPercentage: string;
                };
              } | null;
            };
            variations?: Array<{
              __typename?: "ProductV1Variation";
              id: string;
              type: string;
              option: string;
            }> | null;
            productV1Seller: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            };
            exchangePolicy: {
              __typename?: "ProductV1ExchangePolicy";
              id: string;
              uuid: string;
              version: number;
              label?: string | null;
              template: string;
              sellerContactMethod: string;
              disputeResolverContactMethod: string;
            };
            shipping?: {
              __typename?: "ProductV1ShippingOption";
              id: string;
              defaultVersion?: number | null;
              countryOfOrigin?: string | null;
              redemptionPoint?: string | null;
              returnPeriodInDays: number;
              supportedJurisdictions?: Array<{
                __typename?: "ProductV1ShippingJurisdiction";
                id: string;
                label: string;
                deliveryTime: string;
              }> | null;
            } | null;
          }
        | null;
    };
    variations?: Array<{
      __typename?: "ProductV1Variation";
      id: string;
      type: string;
      option: string;
    }> | null;
  }> | null;
  brand: { __typename?: "ProductV1Brand"; id: string; name: string };
  category?: {
    __typename?: "ProductV1Category";
    id: string;
    name: string;
  } | null;
  subCategory?: {
    __typename?: "ProductV1Category";
    id: string;
    name: string;
  } | null;
  subCategory2?: {
    __typename?: "ProductV1Category";
    id: string;
    name: string;
  } | null;
  tags?: Array<{
    __typename?: "ProductV1Tag";
    id: string;
    name: string;
  }> | null;
  sections?: Array<{
    __typename?: "ProductV1Section";
    id: string;
    name: string;
  }> | null;
  personalisation?: Array<{
    __typename?: "ProductV1Personalisation";
    id: string;
    name: string;
  }> | null;
  visuals_images: Array<{
    __typename?: "ProductV1Media";
    id: string;
    url: string;
    tag?: string | null;
    type: ProductV1MediaType;
  }>;
  visuals_videos?: Array<{
    __typename?: "ProductV1Media";
    id: string;
    url: string;
    tag?: string | null;
    type: ProductV1MediaType;
  }> | null;
  productV1Seller?: {
    __typename?: "ProductV1Seller";
    id: string;
    defaultVersion: number;
    name?: string | null;
    description?: string | null;
    externalUrl?: string | null;
    tokenId?: string | null;
    sellerId?: string | null;
    images?: Array<{
      __typename?: "ProductV1Media";
      id: string;
      url: string;
      tag?: string | null;
      type: ProductV1MediaType;
    }> | null;
    contactLinks?: Array<{
      __typename?: "ProductV1SellerContactLink";
      id: string;
      url: string;
      tag: string;
    }> | null;
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
  } | null;
};

export type BaseProductV1BrandFieldsFragment = {
  __typename?: "ProductV1Brand";
  id: string;
  name: string;
};

export type BaseProductV1CategoryFieldsFragment = {
  __typename?: "ProductV1Category";
  id: string;
  name: string;
};

export type BaseProductV1TagFieldsFragment = {
  __typename?: "ProductV1Tag";
  id: string;
  name: string;
};

export type BaseProductV1SectionFieldsFragment = {
  __typename?: "ProductV1Section";
  id: string;
  name: string;
};

export type BaseProductV1MediaFieldsFragment = {
  __typename?: "ProductV1Media";
  id: string;
  url: string;
  tag?: string | null;
  type: ProductV1MediaType;
};

export type BaseProductV1PersonalisationFieldsFragment = {
  __typename?: "ProductV1Personalisation";
  id: string;
  name: string;
};

export type BaseProductV1VariationFieldsFragment = {
  __typename?: "ProductV1Variation";
  id: string;
  type: string;
  option: string;
};

export type BaseProductV1SellerFieldsFragment = {
  __typename?: "ProductV1Seller";
  id: string;
  defaultVersion: number;
  name?: string | null;
  description?: string | null;
  externalUrl?: string | null;
  tokenId?: string | null;
  sellerId?: string | null;
  images?: Array<{
    __typename?: "ProductV1Media";
    id: string;
    url: string;
    tag?: string | null;
    type: ProductV1MediaType;
  }> | null;
  contactLinks?: Array<{
    __typename?: "ProductV1SellerContactLink";
    id: string;
    url: string;
    tag: string;
  }> | null;
  seller: {
    __typename?: "Seller";
    id: string;
    operator: string;
    admin: string;
    clerk: string;
    treasury: string;
    authTokenId: string;
    authTokenType: number;
    voucherCloneAddress: string;
    active: boolean;
    contractURI: string;
    royaltyPercentage: string;
  };
};

export type BaseProductV1SellerContactLinkFieldsFragment = {
  __typename?: "ProductV1SellerContactLink";
  id: string;
  url: string;
  tag: string;
};

export type BaseProductV1ShippingOptionFieldsFragment = {
  __typename?: "ProductV1ShippingOption";
  id: string;
  defaultVersion?: number | null;
  countryOfOrigin?: string | null;
  redemptionPoint?: string | null;
  returnPeriodInDays: number;
  supportedJurisdictions?: Array<{
    __typename?: "ProductV1ShippingJurisdiction";
    id: string;
    label: string;
    deliveryTime: string;
  }> | null;
};

export type BaseProductV1ShippingJurisdictionFieldsFragment = {
  __typename?: "ProductV1ShippingJurisdiction";
  id: string;
  label: string;
  deliveryTime: string;
};

export type BaseProductV1ExchangePolicyFieldsFragment = {
  __typename?: "ProductV1ExchangePolicy";
  id: string;
  uuid: string;
  version: number;
  label?: string | null;
  template: string;
  sellerContactMethod: string;
  disputeResolverContactMethod: string;
};

export type BaseProductV1ProductOverridesFieldsFragment = {
  __typename?: "ProductV1ProductOverrides";
  id: string;
  version: number;
  title: string;
  description: string;
  identification_sKU?: string | null;
  identification_productId?: string | null;
  identification_productIdType?: string | null;
  productionInformation_brandName: string;
  productionInformation_manufacturer?: string | null;
  productionInformation_manufacturerPartNumber?: string | null;
  productionInformation_modelNumber?: string | null;
  productionInformation_materials?: Array<string> | null;
  packaging_packageQuantity?: string | null;
  packaging_dimensions_length?: string | null;
  packaging_dimensions_width?: string | null;
  packaging_dimensions_height?: string | null;
  packaging_dimensions_unit?: string | null;
  packaging_weight_value?: string | null;
  packaging_weight_unit?: string | null;
  brand: { __typename?: "ProductV1Brand"; id: string; name: string };
  visuals_images: Array<{
    __typename?: "ProductV1Media";
    id: string;
    url: string;
    tag?: string | null;
    type: ProductV1MediaType;
  }>;
  visuals_videos?: Array<{
    __typename?: "ProductV1Media";
    id: string;
    url: string;
    tag?: string | null;
    type: ProductV1MediaType;
  }> | null;
};

export type GetOfferByIdQueryQueryVariables = Exact<{
  offerId: Scalars["ID"];
  exchangesSkip?: InputMaybe<Scalars["Int"]>;
  exchangesFirst?: InputMaybe<Scalars["Int"]>;
  exchangesOrderBy?: InputMaybe<Exchange_OrderBy>;
  exchangesOrderDirection?: InputMaybe<OrderDirection>;
  exchangesFilter?: InputMaybe<Exchange_Filter>;
  includeExchanges?: InputMaybe<Scalars["Boolean"]>;
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
    agentFee: string;
    agentId: string;
    buyerCancelPenalty: string;
    quantityAvailable: string;
    quantityInitial: string;
    validFromDate: string;
    validUntilDate: string;
    voucherRedeemableFromDate: string;
    voucherRedeemableUntilDate: string;
    disputePeriodDuration: string;
    voucherValidDuration: string;
    resolutionPeriodDuration: string;
    metadataUri: string;
    metadataHash: string;
    voided: boolean;
    voidedAt?: string | null;
    disputeResolverId: string;
    numberOfCommits: string;
    numberOfRedemptions: string;
    exchanges?: Array<{
      __typename?: "Exchange";
      id: string;
      disputed: boolean;
      state: ExchangeState;
      committedDate: string;
      finalizedDate?: string | null;
      validUntilDate: string;
      redeemedDate?: string | null;
      revokedDate?: string | null;
      cancelledDate?: string | null;
      completedDate?: string | null;
      disputedDate?: string | null;
      expired: boolean;
      dispute?: {
        __typename?: "Dispute";
        id: string;
        exchangeId: string;
        state: DisputeState;
        buyerPercent: string;
        disputedDate: string;
        escalatedDate?: string | null;
        finalizedDate?: string | null;
        retractedDate?: string | null;
        resolvedDate?: string | null;
        decidedDate?: string | null;
        refusedDate?: string | null;
        timeout: string;
      } | null;
      buyer: {
        __typename?: "Buyer";
        id: string;
        wallet: string;
        active: boolean;
      };
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
    }>;
    condition?: {
      __typename?: "ConditionEntity";
      id: string;
      method: number;
      tokenType: number;
      tokenAddress: string;
      tokenId: string;
      threshold: string;
      maxCommits: string;
    } | null;
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
    exchangeToken: {
      __typename?: "ExchangeToken";
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
    disputeResolver: {
      __typename?: "DisputeResolver";
      id: string;
      escalationResponsePeriod: string;
      admin: string;
      clerk: string;
      treasury: string;
      operator: string;
      metadataUri: string;
      active: boolean;
      sellerAllowList: Array<string>;
      fees: Array<{
        __typename?: "DisputeResolverFee";
        id: string;
        tokenAddress: string;
        tokenName: string;
        feeAmount: string;
        token: {
          __typename?: "ExchangeToken";
          id: string;
          address: string;
          decimals: string;
          symbol: string;
          name: string;
        };
      }>;
    };
    disputeResolutionTerms: {
      __typename?: "DisputeResolutionTermsEntity";
      id: string;
      disputeResolverId: string;
      escalationResponsePeriod: string;
      feeAmount: string;
      buyerEscalationDeposit: string;
    };
    metadata?:
      | {
          __typename?: "BaseMetadataEntity";
          name: string;
          description: string;
          externalUrl: string;
          animationUrl?: string | null;
          licenseUrl: string;
          condition?: string | null;
          schemaUrl: string;
          type: MetadataType;
          image: string;
        }
      | {
          __typename?: "ProductV1MetadataEntity";
          createdAt: string;
          voided: boolean;
          validFromDate: string;
          validUntilDate: string;
          quantityAvailable: string;
          uuid: string;
          name: string;
          description: string;
          externalUrl: string;
          animationUrl?: string | null;
          licenseUrl: string;
          condition?: string | null;
          schemaUrl: string;
          type: MetadataType;
          image: string;
          attributes?: Array<{
            __typename?: "MetadataAttribute";
            traitType: string;
            value: string;
            displayType: string;
          }> | null;
          product: {
            __typename?: "ProductV1Product";
            id: string;
            uuid: string;
            version: number;
            title: string;
            description: string;
            identification_sKU?: string | null;
            identification_productId?: string | null;
            identification_productIdType?: string | null;
            productionInformation_brandName: string;
            productionInformation_manufacturer?: string | null;
            productionInformation_manufacturerPartNumber?: string | null;
            productionInformation_modelNumber?: string | null;
            productionInformation_materials?: Array<string> | null;
            details_category?: string | null;
            details_subCategory?: string | null;
            details_subCategory2?: string | null;
            details_offerCategory: string;
            offerCategory: ProductV1OfferCategory;
            details_tags?: Array<string> | null;
            details_sections?: Array<string> | null;
            details_personalisation?: Array<string> | null;
            packaging_packageQuantity?: string | null;
            packaging_dimensions_length?: string | null;
            packaging_dimensions_width?: string | null;
            packaging_dimensions_height?: string | null;
            packaging_dimensions_unit?: string | null;
            packaging_weight_value?: string | null;
            packaging_weight_unit?: string | null;
            brand: { __typename?: "ProductV1Brand"; id: string; name: string };
            category?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            subCategory?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            subCategory2?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            tags?: Array<{
              __typename?: "ProductV1Tag";
              id: string;
              name: string;
            }> | null;
            sections?: Array<{
              __typename?: "ProductV1Section";
              id: string;
              name: string;
            }> | null;
            personalisation?: Array<{
              __typename?: "ProductV1Personalisation";
              id: string;
              name: string;
            }> | null;
            visuals_images: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }>;
            visuals_videos?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            productV1Seller?: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            } | null;
          };
          variations?: Array<{
            __typename?: "ProductV1Variation";
            id: string;
            type: string;
            option: string;
          }> | null;
          productV1Seller: {
            __typename?: "ProductV1Seller";
            id: string;
            defaultVersion: number;
            name?: string | null;
            description?: string | null;
            externalUrl?: string | null;
            tokenId?: string | null;
            sellerId?: string | null;
            images?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            contactLinks?: Array<{
              __typename?: "ProductV1SellerContactLink";
              id: string;
              url: string;
              tag: string;
            }> | null;
            seller: {
              __typename?: "Seller";
              id: string;
              operator: string;
              admin: string;
              clerk: string;
              treasury: string;
              authTokenId: string;
              authTokenType: number;
              voucherCloneAddress: string;
              active: boolean;
              contractURI: string;
              royaltyPercentage: string;
            };
          };
          exchangePolicy: {
            __typename?: "ProductV1ExchangePolicy";
            id: string;
            uuid: string;
            version: number;
            label?: string | null;
            template: string;
            sellerContactMethod: string;
            disputeResolverContactMethod: string;
          };
          shipping?: {
            __typename?: "ProductV1ShippingOption";
            id: string;
            defaultVersion?: number | null;
            countryOfOrigin?: string | null;
            redemptionPoint?: string | null;
            returnPeriodInDays: number;
            supportedJurisdictions?: Array<{
              __typename?: "ProductV1ShippingJurisdiction";
              id: string;
              label: string;
              deliveryTime: string;
            }> | null;
          } | null;
        }
      | null;
  } | null;
};

export type GetOffersQueryQueryVariables = Exact<{
  offersSkip?: InputMaybe<Scalars["Int"]>;
  offersFirst?: InputMaybe<Scalars["Int"]>;
  offersOrderBy?: InputMaybe<Offer_OrderBy>;
  offersOrderDirection?: InputMaybe<OrderDirection>;
  offersFilter?: InputMaybe<Offer_Filter>;
  exchangesSkip?: InputMaybe<Scalars["Int"]>;
  exchangesFirst?: InputMaybe<Scalars["Int"]>;
  exchangesOrderBy?: InputMaybe<Exchange_OrderBy>;
  exchangesOrderDirection?: InputMaybe<OrderDirection>;
  exchangesFilter?: InputMaybe<Exchange_Filter>;
  includeExchanges?: InputMaybe<Scalars["Boolean"]>;
}>;

export type GetOffersQueryQuery = {
  __typename?: "Query";
  offers: Array<{
    __typename?: "Offer";
    id: string;
    createdAt: string;
    price: string;
    sellerDeposit: string;
    protocolFee: string;
    agentFee: string;
    agentId: string;
    buyerCancelPenalty: string;
    quantityAvailable: string;
    quantityInitial: string;
    validFromDate: string;
    validUntilDate: string;
    voucherRedeemableFromDate: string;
    voucherRedeemableUntilDate: string;
    disputePeriodDuration: string;
    voucherValidDuration: string;
    resolutionPeriodDuration: string;
    metadataUri: string;
    metadataHash: string;
    voided: boolean;
    voidedAt?: string | null;
    disputeResolverId: string;
    numberOfCommits: string;
    numberOfRedemptions: string;
    exchanges?: Array<{
      __typename?: "Exchange";
      id: string;
      disputed: boolean;
      state: ExchangeState;
      committedDate: string;
      finalizedDate?: string | null;
      validUntilDate: string;
      redeemedDate?: string | null;
      revokedDate?: string | null;
      cancelledDate?: string | null;
      completedDate?: string | null;
      disputedDate?: string | null;
      expired: boolean;
      dispute?: {
        __typename?: "Dispute";
        id: string;
        exchangeId: string;
        state: DisputeState;
        buyerPercent: string;
        disputedDate: string;
        escalatedDate?: string | null;
        finalizedDate?: string | null;
        retractedDate?: string | null;
        resolvedDate?: string | null;
        decidedDate?: string | null;
        refusedDate?: string | null;
        timeout: string;
      } | null;
      buyer: {
        __typename?: "Buyer";
        id: string;
        wallet: string;
        active: boolean;
      };
      seller: {
        __typename?: "Seller";
        id: string;
        operator: string;
        admin: string;
        clerk: string;
        treasury: string;
        authTokenId: string;
        authTokenType: number;
        voucherCloneAddress: string;
        active: boolean;
        contractURI: string;
        royaltyPercentage: string;
      };
    }>;
    condition?: {
      __typename?: "ConditionEntity";
      id: string;
      method: number;
      tokenType: number;
      tokenAddress: string;
      tokenId: string;
      threshold: string;
      maxCommits: string;
    } | null;
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
    exchangeToken: {
      __typename?: "ExchangeToken";
      id: string;
      address: string;
      decimals: string;
      symbol: string;
      name: string;
    };
    disputeResolver: {
      __typename?: "DisputeResolver";
      id: string;
      escalationResponsePeriod: string;
      admin: string;
      clerk: string;
      treasury: string;
      operator: string;
      metadataUri: string;
      active: boolean;
      sellerAllowList: Array<string>;
      fees: Array<{
        __typename?: "DisputeResolverFee";
        id: string;
        tokenAddress: string;
        tokenName: string;
        feeAmount: string;
        token: {
          __typename?: "ExchangeToken";
          id: string;
          address: string;
          decimals: string;
          symbol: string;
          name: string;
        };
      }>;
    };
    disputeResolutionTerms: {
      __typename?: "DisputeResolutionTermsEntity";
      id: string;
      disputeResolverId: string;
      escalationResponsePeriod: string;
      feeAmount: string;
      buyerEscalationDeposit: string;
    };
    metadata?:
      | {
          __typename?: "BaseMetadataEntity";
          name: string;
          description: string;
          externalUrl: string;
          animationUrl?: string | null;
          licenseUrl: string;
          condition?: string | null;
          schemaUrl: string;
          type: MetadataType;
          image: string;
        }
      | {
          __typename?: "ProductV1MetadataEntity";
          createdAt: string;
          voided: boolean;
          validFromDate: string;
          validUntilDate: string;
          quantityAvailable: string;
          uuid: string;
          name: string;
          description: string;
          externalUrl: string;
          animationUrl?: string | null;
          licenseUrl: string;
          condition?: string | null;
          schemaUrl: string;
          type: MetadataType;
          image: string;
          attributes?: Array<{
            __typename?: "MetadataAttribute";
            traitType: string;
            value: string;
            displayType: string;
          }> | null;
          product: {
            __typename?: "ProductV1Product";
            id: string;
            uuid: string;
            version: number;
            title: string;
            description: string;
            identification_sKU?: string | null;
            identification_productId?: string | null;
            identification_productIdType?: string | null;
            productionInformation_brandName: string;
            productionInformation_manufacturer?: string | null;
            productionInformation_manufacturerPartNumber?: string | null;
            productionInformation_modelNumber?: string | null;
            productionInformation_materials?: Array<string> | null;
            details_category?: string | null;
            details_subCategory?: string | null;
            details_subCategory2?: string | null;
            details_offerCategory: string;
            offerCategory: ProductV1OfferCategory;
            details_tags?: Array<string> | null;
            details_sections?: Array<string> | null;
            details_personalisation?: Array<string> | null;
            packaging_packageQuantity?: string | null;
            packaging_dimensions_length?: string | null;
            packaging_dimensions_width?: string | null;
            packaging_dimensions_height?: string | null;
            packaging_dimensions_unit?: string | null;
            packaging_weight_value?: string | null;
            packaging_weight_unit?: string | null;
            brand: { __typename?: "ProductV1Brand"; id: string; name: string };
            category?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            subCategory?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            subCategory2?: {
              __typename?: "ProductV1Category";
              id: string;
              name: string;
            } | null;
            tags?: Array<{
              __typename?: "ProductV1Tag";
              id: string;
              name: string;
            }> | null;
            sections?: Array<{
              __typename?: "ProductV1Section";
              id: string;
              name: string;
            }> | null;
            personalisation?: Array<{
              __typename?: "ProductV1Personalisation";
              id: string;
              name: string;
            }> | null;
            visuals_images: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }>;
            visuals_videos?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            productV1Seller?: {
              __typename?: "ProductV1Seller";
              id: string;
              defaultVersion: number;
              name?: string | null;
              description?: string | null;
              externalUrl?: string | null;
              tokenId?: string | null;
              sellerId?: string | null;
              images?: Array<{
                __typename?: "ProductV1Media";
                id: string;
                url: string;
                tag?: string | null;
                type: ProductV1MediaType;
              }> | null;
              contactLinks?: Array<{
                __typename?: "ProductV1SellerContactLink";
                id: string;
                url: string;
                tag: string;
              }> | null;
              seller: {
                __typename?: "Seller";
                id: string;
                operator: string;
                admin: string;
                clerk: string;
                treasury: string;
                authTokenId: string;
                authTokenType: number;
                voucherCloneAddress: string;
                active: boolean;
                contractURI: string;
                royaltyPercentage: string;
              };
            } | null;
          };
          variations?: Array<{
            __typename?: "ProductV1Variation";
            id: string;
            type: string;
            option: string;
          }> | null;
          productV1Seller: {
            __typename?: "ProductV1Seller";
            id: string;
            defaultVersion: number;
            name?: string | null;
            description?: string | null;
            externalUrl?: string | null;
            tokenId?: string | null;
            sellerId?: string | null;
            images?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            contactLinks?: Array<{
              __typename?: "ProductV1SellerContactLink";
              id: string;
              url: string;
              tag: string;
            }> | null;
            seller: {
              __typename?: "Seller";
              id: string;
              operator: string;
              admin: string;
              clerk: string;
              treasury: string;
              authTokenId: string;
              authTokenType: number;
              voucherCloneAddress: string;
              active: boolean;
              contractURI: string;
              royaltyPercentage: string;
            };
          };
          exchangePolicy: {
            __typename?: "ProductV1ExchangePolicy";
            id: string;
            uuid: string;
            version: number;
            label?: string | null;
            template: string;
            sellerContactMethod: string;
            disputeResolverContactMethod: string;
          };
          shipping?: {
            __typename?: "ProductV1ShippingOption";
            id: string;
            defaultVersion?: number | null;
            countryOfOrigin?: string | null;
            redemptionPoint?: string | null;
            returnPeriodInDays: number;
            supportedJurisdictions?: Array<{
              __typename?: "ProductV1ShippingJurisdiction";
              id: string;
              label: string;
              deliveryTime: string;
            }> | null;
          } | null;
        }
      | null;
  }>;
};

export type OfferFieldsFragment = {
  __typename?: "Offer";
  id: string;
  createdAt: string;
  price: string;
  sellerDeposit: string;
  protocolFee: string;
  agentFee: string;
  agentId: string;
  buyerCancelPenalty: string;
  quantityAvailable: string;
  quantityInitial: string;
  validFromDate: string;
  validUntilDate: string;
  voucherRedeemableFromDate: string;
  voucherRedeemableUntilDate: string;
  disputePeriodDuration: string;
  voucherValidDuration: string;
  resolutionPeriodDuration: string;
  metadataUri: string;
  metadataHash: string;
  voided: boolean;
  voidedAt?: string | null;
  disputeResolverId: string;
  numberOfCommits: string;
  numberOfRedemptions: string;
  exchanges?: Array<{
    __typename?: "Exchange";
    id: string;
    disputed: boolean;
    state: ExchangeState;
    committedDate: string;
    finalizedDate?: string | null;
    validUntilDate: string;
    redeemedDate?: string | null;
    revokedDate?: string | null;
    cancelledDate?: string | null;
    completedDate?: string | null;
    disputedDate?: string | null;
    expired: boolean;
    dispute?: {
      __typename?: "Dispute";
      id: string;
      exchangeId: string;
      state: DisputeState;
      buyerPercent: string;
      disputedDate: string;
      escalatedDate?: string | null;
      finalizedDate?: string | null;
      retractedDate?: string | null;
      resolvedDate?: string | null;
      decidedDate?: string | null;
      refusedDate?: string | null;
      timeout: string;
    } | null;
    buyer: {
      __typename?: "Buyer";
      id: string;
      wallet: string;
      active: boolean;
    };
    seller: {
      __typename?: "Seller";
      id: string;
      operator: string;
      admin: string;
      clerk: string;
      treasury: string;
      authTokenId: string;
      authTokenType: number;
      voucherCloneAddress: string;
      active: boolean;
      contractURI: string;
      royaltyPercentage: string;
    };
  }>;
  condition?: {
    __typename?: "ConditionEntity";
    id: string;
    method: number;
    tokenType: number;
    tokenAddress: string;
    tokenId: string;
    threshold: string;
    maxCommits: string;
  } | null;
  seller: {
    __typename?: "Seller";
    id: string;
    operator: string;
    admin: string;
    clerk: string;
    treasury: string;
    authTokenId: string;
    authTokenType: number;
    voucherCloneAddress: string;
    active: boolean;
    contractURI: string;
    royaltyPercentage: string;
  };
  exchangeToken: {
    __typename?: "ExchangeToken";
    id: string;
    address: string;
    decimals: string;
    symbol: string;
    name: string;
  };
  disputeResolver: {
    __typename?: "DisputeResolver";
    id: string;
    escalationResponsePeriod: string;
    admin: string;
    clerk: string;
    treasury: string;
    operator: string;
    metadataUri: string;
    active: boolean;
    sellerAllowList: Array<string>;
    fees: Array<{
      __typename?: "DisputeResolverFee";
      id: string;
      tokenAddress: string;
      tokenName: string;
      feeAmount: string;
      token: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
    }>;
  };
  disputeResolutionTerms: {
    __typename?: "DisputeResolutionTermsEntity";
    id: string;
    disputeResolverId: string;
    escalationResponsePeriod: string;
    feeAmount: string;
    buyerEscalationDeposit: string;
  };
  metadata?:
    | {
        __typename?: "BaseMetadataEntity";
        name: string;
        description: string;
        externalUrl: string;
        animationUrl?: string | null;
        licenseUrl: string;
        condition?: string | null;
        schemaUrl: string;
        type: MetadataType;
        image: string;
      }
    | {
        __typename?: "ProductV1MetadataEntity";
        createdAt: string;
        voided: boolean;
        validFromDate: string;
        validUntilDate: string;
        quantityAvailable: string;
        uuid: string;
        name: string;
        description: string;
        externalUrl: string;
        animationUrl?: string | null;
        licenseUrl: string;
        condition?: string | null;
        schemaUrl: string;
        type: MetadataType;
        image: string;
        attributes?: Array<{
          __typename?: "MetadataAttribute";
          traitType: string;
          value: string;
          displayType: string;
        }> | null;
        product: {
          __typename?: "ProductV1Product";
          id: string;
          uuid: string;
          version: number;
          title: string;
          description: string;
          identification_sKU?: string | null;
          identification_productId?: string | null;
          identification_productIdType?: string | null;
          productionInformation_brandName: string;
          productionInformation_manufacturer?: string | null;
          productionInformation_manufacturerPartNumber?: string | null;
          productionInformation_modelNumber?: string | null;
          productionInformation_materials?: Array<string> | null;
          details_category?: string | null;
          details_subCategory?: string | null;
          details_subCategory2?: string | null;
          details_offerCategory: string;
          offerCategory: ProductV1OfferCategory;
          details_tags?: Array<string> | null;
          details_sections?: Array<string> | null;
          details_personalisation?: Array<string> | null;
          packaging_packageQuantity?: string | null;
          packaging_dimensions_length?: string | null;
          packaging_dimensions_width?: string | null;
          packaging_dimensions_height?: string | null;
          packaging_dimensions_unit?: string | null;
          packaging_weight_value?: string | null;
          packaging_weight_unit?: string | null;
          brand: { __typename?: "ProductV1Brand"; id: string; name: string };
          category?: {
            __typename?: "ProductV1Category";
            id: string;
            name: string;
          } | null;
          subCategory?: {
            __typename?: "ProductV1Category";
            id: string;
            name: string;
          } | null;
          subCategory2?: {
            __typename?: "ProductV1Category";
            id: string;
            name: string;
          } | null;
          tags?: Array<{
            __typename?: "ProductV1Tag";
            id: string;
            name: string;
          }> | null;
          sections?: Array<{
            __typename?: "ProductV1Section";
            id: string;
            name: string;
          }> | null;
          personalisation?: Array<{
            __typename?: "ProductV1Personalisation";
            id: string;
            name: string;
          }> | null;
          visuals_images: Array<{
            __typename?: "ProductV1Media";
            id: string;
            url: string;
            tag?: string | null;
            type: ProductV1MediaType;
          }>;
          visuals_videos?: Array<{
            __typename?: "ProductV1Media";
            id: string;
            url: string;
            tag?: string | null;
            type: ProductV1MediaType;
          }> | null;
          productV1Seller?: {
            __typename?: "ProductV1Seller";
            id: string;
            defaultVersion: number;
            name?: string | null;
            description?: string | null;
            externalUrl?: string | null;
            tokenId?: string | null;
            sellerId?: string | null;
            images?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            contactLinks?: Array<{
              __typename?: "ProductV1SellerContactLink";
              id: string;
              url: string;
              tag: string;
            }> | null;
            seller: {
              __typename?: "Seller";
              id: string;
              operator: string;
              admin: string;
              clerk: string;
              treasury: string;
              authTokenId: string;
              authTokenType: number;
              voucherCloneAddress: string;
              active: boolean;
              contractURI: string;
              royaltyPercentage: string;
            };
          } | null;
        };
        variations?: Array<{
          __typename?: "ProductV1Variation";
          id: string;
          type: string;
          option: string;
        }> | null;
        productV1Seller: {
          __typename?: "ProductV1Seller";
          id: string;
          defaultVersion: number;
          name?: string | null;
          description?: string | null;
          externalUrl?: string | null;
          tokenId?: string | null;
          sellerId?: string | null;
          images?: Array<{
            __typename?: "ProductV1Media";
            id: string;
            url: string;
            tag?: string | null;
            type: ProductV1MediaType;
          }> | null;
          contactLinks?: Array<{
            __typename?: "ProductV1SellerContactLink";
            id: string;
            url: string;
            tag: string;
          }> | null;
          seller: {
            __typename?: "Seller";
            id: string;
            operator: string;
            admin: string;
            clerk: string;
            treasury: string;
            authTokenId: string;
            authTokenType: number;
            voucherCloneAddress: string;
            active: boolean;
            contractURI: string;
            royaltyPercentage: string;
          };
        };
        exchangePolicy: {
          __typename?: "ProductV1ExchangePolicy";
          id: string;
          uuid: string;
          version: number;
          label?: string | null;
          template: string;
          sellerContactMethod: string;
          disputeResolverContactMethod: string;
        };
        shipping?: {
          __typename?: "ProductV1ShippingOption";
          id: string;
          defaultVersion?: number | null;
          countryOfOrigin?: string | null;
          redemptionPoint?: string | null;
          returnPeriodInDays: number;
          supportedJurisdictions?: Array<{
            __typename?: "ProductV1ShippingJurisdiction";
            id: string;
            label: string;
            deliveryTime: string;
          }> | null;
        } | null;
      }
    | null;
};

export type BaseOfferFieldsFragment = {
  __typename?: "Offer";
  id: string;
  createdAt: string;
  price: string;
  sellerDeposit: string;
  protocolFee: string;
  agentFee: string;
  agentId: string;
  buyerCancelPenalty: string;
  quantityAvailable: string;
  quantityInitial: string;
  validFromDate: string;
  validUntilDate: string;
  voucherRedeemableFromDate: string;
  voucherRedeemableUntilDate: string;
  disputePeriodDuration: string;
  voucherValidDuration: string;
  resolutionPeriodDuration: string;
  metadataUri: string;
  metadataHash: string;
  voided: boolean;
  voidedAt?: string | null;
  disputeResolverId: string;
  numberOfCommits: string;
  numberOfRedemptions: string;
  condition?: {
    __typename?: "ConditionEntity";
    id: string;
    method: number;
    tokenType: number;
    tokenAddress: string;
    tokenId: string;
    threshold: string;
    maxCommits: string;
  } | null;
  seller: {
    __typename?: "Seller";
    id: string;
    operator: string;
    admin: string;
    clerk: string;
    treasury: string;
    authTokenId: string;
    authTokenType: number;
    voucherCloneAddress: string;
    active: boolean;
    contractURI: string;
    royaltyPercentage: string;
  };
  exchangeToken: {
    __typename?: "ExchangeToken";
    id: string;
    address: string;
    decimals: string;
    symbol: string;
    name: string;
  };
  disputeResolver: {
    __typename?: "DisputeResolver";
    id: string;
    escalationResponsePeriod: string;
    admin: string;
    clerk: string;
    treasury: string;
    operator: string;
    metadataUri: string;
    active: boolean;
    sellerAllowList: Array<string>;
    fees: Array<{
      __typename?: "DisputeResolverFee";
      id: string;
      tokenAddress: string;
      tokenName: string;
      feeAmount: string;
      token: {
        __typename?: "ExchangeToken";
        id: string;
        address: string;
        decimals: string;
        symbol: string;
        name: string;
      };
    }>;
  };
  disputeResolutionTerms: {
    __typename?: "DisputeResolutionTermsEntity";
    id: string;
    disputeResolverId: string;
    escalationResponsePeriod: string;
    feeAmount: string;
    buyerEscalationDeposit: string;
  };
  metadata?:
    | {
        __typename?: "BaseMetadataEntity";
        name: string;
        description: string;
        externalUrl: string;
        animationUrl?: string | null;
        licenseUrl: string;
        condition?: string | null;
        schemaUrl: string;
        type: MetadataType;
        image: string;
      }
    | {
        __typename?: "ProductV1MetadataEntity";
        createdAt: string;
        voided: boolean;
        validFromDate: string;
        validUntilDate: string;
        quantityAvailable: string;
        uuid: string;
        name: string;
        description: string;
        externalUrl: string;
        animationUrl?: string | null;
        licenseUrl: string;
        condition?: string | null;
        schemaUrl: string;
        type: MetadataType;
        image: string;
        attributes?: Array<{
          __typename?: "MetadataAttribute";
          traitType: string;
          value: string;
          displayType: string;
        }> | null;
        product: {
          __typename?: "ProductV1Product";
          id: string;
          uuid: string;
          version: number;
          title: string;
          description: string;
          identification_sKU?: string | null;
          identification_productId?: string | null;
          identification_productIdType?: string | null;
          productionInformation_brandName: string;
          productionInformation_manufacturer?: string | null;
          productionInformation_manufacturerPartNumber?: string | null;
          productionInformation_modelNumber?: string | null;
          productionInformation_materials?: Array<string> | null;
          details_category?: string | null;
          details_subCategory?: string | null;
          details_subCategory2?: string | null;
          details_offerCategory: string;
          offerCategory: ProductV1OfferCategory;
          details_tags?: Array<string> | null;
          details_sections?: Array<string> | null;
          details_personalisation?: Array<string> | null;
          packaging_packageQuantity?: string | null;
          packaging_dimensions_length?: string | null;
          packaging_dimensions_width?: string | null;
          packaging_dimensions_height?: string | null;
          packaging_dimensions_unit?: string | null;
          packaging_weight_value?: string | null;
          packaging_weight_unit?: string | null;
          brand: { __typename?: "ProductV1Brand"; id: string; name: string };
          category?: {
            __typename?: "ProductV1Category";
            id: string;
            name: string;
          } | null;
          subCategory?: {
            __typename?: "ProductV1Category";
            id: string;
            name: string;
          } | null;
          subCategory2?: {
            __typename?: "ProductV1Category";
            id: string;
            name: string;
          } | null;
          tags?: Array<{
            __typename?: "ProductV1Tag";
            id: string;
            name: string;
          }> | null;
          sections?: Array<{
            __typename?: "ProductV1Section";
            id: string;
            name: string;
          }> | null;
          personalisation?: Array<{
            __typename?: "ProductV1Personalisation";
            id: string;
            name: string;
          }> | null;
          visuals_images: Array<{
            __typename?: "ProductV1Media";
            id: string;
            url: string;
            tag?: string | null;
            type: ProductV1MediaType;
          }>;
          visuals_videos?: Array<{
            __typename?: "ProductV1Media";
            id: string;
            url: string;
            tag?: string | null;
            type: ProductV1MediaType;
          }> | null;
          productV1Seller?: {
            __typename?: "ProductV1Seller";
            id: string;
            defaultVersion: number;
            name?: string | null;
            description?: string | null;
            externalUrl?: string | null;
            tokenId?: string | null;
            sellerId?: string | null;
            images?: Array<{
              __typename?: "ProductV1Media";
              id: string;
              url: string;
              tag?: string | null;
              type: ProductV1MediaType;
            }> | null;
            contactLinks?: Array<{
              __typename?: "ProductV1SellerContactLink";
              id: string;
              url: string;
              tag: string;
            }> | null;
            seller: {
              __typename?: "Seller";
              id: string;
              operator: string;
              admin: string;
              clerk: string;
              treasury: string;
              authTokenId: string;
              authTokenType: number;
              voucherCloneAddress: string;
              active: boolean;
              contractURI: string;
              royaltyPercentage: string;
            };
          } | null;
        };
        variations?: Array<{
          __typename?: "ProductV1Variation";
          id: string;
          type: string;
          option: string;
        }> | null;
        productV1Seller: {
          __typename?: "ProductV1Seller";
          id: string;
          defaultVersion: number;
          name?: string | null;
          description?: string | null;
          externalUrl?: string | null;
          tokenId?: string | null;
          sellerId?: string | null;
          images?: Array<{
            __typename?: "ProductV1Media";
            id: string;
            url: string;
            tag?: string | null;
            type: ProductV1MediaType;
          }> | null;
          contactLinks?: Array<{
            __typename?: "ProductV1SellerContactLink";
            id: string;
            url: string;
            tag: string;
          }> | null;
          seller: {
            __typename?: "Seller";
            id: string;
            operator: string;
            admin: string;
            clerk: string;
            treasury: string;
            authTokenId: string;
            authTokenType: number;
            voucherCloneAddress: string;
            active: boolean;
            contractURI: string;
            royaltyPercentage: string;
          };
        };
        exchangePolicy: {
          __typename?: "ProductV1ExchangePolicy";
          id: string;
          uuid: string;
          version: number;
          label?: string | null;
          template: string;
          sellerContactMethod: string;
          disputeResolverContactMethod: string;
        };
        shipping?: {
          __typename?: "ProductV1ShippingOption";
          id: string;
          defaultVersion?: number | null;
          countryOfOrigin?: string | null;
          redemptionPoint?: string | null;
          returnPeriodInDays: number;
          supportedJurisdictions?: Array<{
            __typename?: "ProductV1ShippingJurisdiction";
            id: string;
            label: string;
            deliveryTime: string;
          }> | null;
        } | null;
      }
    | null;
};

export const BaseSellerFieldsFragmentDoc = gql`
  fragment BaseSellerFields on Seller {
    id
    operator
    admin
    clerk
    treasury
    authTokenId
    authTokenType
    voucherCloneAddress
    active
    contractURI
    royaltyPercentage
  }
`;
export const PendingSellerFieldsFragmentDoc = gql`
  fragment PendingSellerFields on PendingSeller {
    operator
    admin
    clerk
    authTokenId
    authTokenType
  }
`;
export const BaseFundsEntityFieldsFragmentDoc = gql`
  fragment BaseFundsEntityFields on FundsEntity {
    id
    availableAmount
    accountId
  }
`;
export const BaseExchangeTokenFieldsFragmentDoc = gql`
  fragment BaseExchangeTokenFields on ExchangeToken {
    id
    address
    decimals
    symbol
    name
  }
`;
export const FundsEntityFieldsFragmentDoc = gql`
  fragment FundsEntityFields on FundsEntity {
    ...BaseFundsEntityFields
    token {
      ...BaseExchangeTokenFields
    }
  }
  ${BaseFundsEntityFieldsFragmentDoc}
  ${BaseExchangeTokenFieldsFragmentDoc}
`;
export const BaseConditionFieldsFragmentDoc = gql`
  fragment BaseConditionFields on ConditionEntity {
    id
    method
    tokenType
    tokenAddress
    tokenId
    threshold
    maxCommits
  }
`;
export const BaseDisputeResolverFeeFieldsFragmentDoc = gql`
  fragment BaseDisputeResolverFeeFields on DisputeResolverFee {
    id
    tokenAddress
    tokenName
    token {
      ...BaseExchangeTokenFields
    }
    feeAmount
  }
  ${BaseExchangeTokenFieldsFragmentDoc}
`;
export const BaseDisputeResolverFieldsFragmentDoc = gql`
  fragment BaseDisputeResolverFields on DisputeResolver {
    id
    escalationResponsePeriod
    admin
    clerk
    treasury
    operator
    metadataUri
    active
    sellerAllowList
    fees {
      ...BaseDisputeResolverFeeFields
    }
  }
  ${BaseDisputeResolverFeeFieldsFragmentDoc}
`;
export const BaseDisputeResolutionTermsEntityFieldsFragmentDoc = gql`
  fragment BaseDisputeResolutionTermsEntityFields on DisputeResolutionTermsEntity {
    id
    disputeResolverId
    escalationResponsePeriod
    feeAmount
    buyerEscalationDeposit
  }
`;
export const BaseProductV1BrandFieldsFragmentDoc = gql`
  fragment BaseProductV1BrandFields on ProductV1Brand {
    id
    name
  }
`;
export const BaseProductV1CategoryFieldsFragmentDoc = gql`
  fragment BaseProductV1CategoryFields on ProductV1Category {
    id
    name
  }
`;
export const BaseProductV1TagFieldsFragmentDoc = gql`
  fragment BaseProductV1TagFields on ProductV1Tag {
    id
    name
  }
`;
export const BaseProductV1SectionFieldsFragmentDoc = gql`
  fragment BaseProductV1SectionFields on ProductV1Section {
    id
    name
  }
`;
export const BaseProductV1PersonalisationFieldsFragmentDoc = gql`
  fragment BaseProductV1PersonalisationFields on ProductV1Personalisation {
    id
    name
  }
`;
export const BaseProductV1MediaFieldsFragmentDoc = gql`
  fragment BaseProductV1MediaFields on ProductV1Media {
    id
    url
    tag
    type
  }
`;
export const BaseProductV1SellerContactLinkFieldsFragmentDoc = gql`
  fragment BaseProductV1SellerContactLinkFields on ProductV1SellerContactLink {
    id
    url
    tag
  }
`;
export const BaseProductV1SellerFieldsFragmentDoc = gql`
  fragment BaseProductV1SellerFields on ProductV1Seller {
    id
    defaultVersion
    name
    description
    externalUrl
    tokenId
    sellerId
    images {
      ...BaseProductV1MediaFields
    }
    contactLinks {
      ...BaseProductV1SellerContactLinkFields
    }
    seller {
      ...BaseSellerFields
    }
  }
  ${BaseProductV1MediaFieldsFragmentDoc}
  ${BaseProductV1SellerContactLinkFieldsFragmentDoc}
  ${BaseSellerFieldsFragmentDoc}
`;
export const BaseProductV1ProductFieldsFragmentDoc = gql`
  fragment BaseProductV1ProductFields on ProductV1Product {
    id
    uuid
    version
    title
    description
    identification_sKU
    identification_productId
    identification_productIdType
    productionInformation_brandName
    brand {
      ...BaseProductV1BrandFields
    }
    productionInformation_manufacturer
    productionInformation_manufacturerPartNumber
    productionInformation_modelNumber
    productionInformation_materials
    details_category
    category {
      ...BaseProductV1CategoryFields
    }
    details_subCategory
    subCategory {
      ...BaseProductV1CategoryFields
    }
    details_subCategory2
    subCategory2 {
      ...BaseProductV1CategoryFields
    }
    details_offerCategory
    offerCategory
    details_tags
    tags {
      ...BaseProductV1TagFields
    }
    details_sections
    sections {
      ...BaseProductV1SectionFields
    }
    details_personalisation
    personalisation {
      ...BaseProductV1PersonalisationFields
    }
    visuals_images {
      ...BaseProductV1MediaFields
    }
    visuals_videos {
      ...BaseProductV1MediaFields
    }
    packaging_packageQuantity
    packaging_dimensions_length
    packaging_dimensions_width
    packaging_dimensions_height
    packaging_dimensions_unit
    packaging_weight_value
    packaging_weight_unit
    productV1Seller {
      ...BaseProductV1SellerFields
    }
  }
  ${BaseProductV1BrandFieldsFragmentDoc}
  ${BaseProductV1CategoryFieldsFragmentDoc}
  ${BaseProductV1TagFieldsFragmentDoc}
  ${BaseProductV1SectionFieldsFragmentDoc}
  ${BaseProductV1PersonalisationFieldsFragmentDoc}
  ${BaseProductV1MediaFieldsFragmentDoc}
  ${BaseProductV1SellerFieldsFragmentDoc}
`;
export const BaseProductV1VariationFieldsFragmentDoc = gql`
  fragment BaseProductV1VariationFields on ProductV1Variation {
    id
    type
    option
  }
`;
export const BaseProductV1ExchangePolicyFieldsFragmentDoc = gql`
  fragment BaseProductV1ExchangePolicyFields on ProductV1ExchangePolicy {
    id
    uuid
    version
    label
    template
    sellerContactMethod
    disputeResolverContactMethod
  }
`;
export const BaseProductV1ShippingJurisdictionFieldsFragmentDoc = gql`
  fragment BaseProductV1ShippingJurisdictionFields on ProductV1ShippingJurisdiction {
    id
    label
    deliveryTime
  }
`;
export const BaseProductV1ShippingOptionFieldsFragmentDoc = gql`
  fragment BaseProductV1ShippingOptionFields on ProductV1ShippingOption {
    id
    defaultVersion
    countryOfOrigin
    supportedJurisdictions {
      ...BaseProductV1ShippingJurisdictionFields
    }
    redemptionPoint
    returnPeriodInDays
  }
  ${BaseProductV1ShippingJurisdictionFieldsFragmentDoc}
`;
export const BaseOfferFieldsFragmentDoc = gql`
  fragment BaseOfferFields on Offer {
    id
    createdAt
    price
    sellerDeposit
    protocolFee
    agentFee
    agentId
    buyerCancelPenalty
    quantityAvailable
    quantityInitial
    validFromDate
    validUntilDate
    voucherRedeemableFromDate
    voucherRedeemableUntilDate
    disputePeriodDuration
    voucherValidDuration
    resolutionPeriodDuration
    metadataUri
    metadataHash
    voided
    voidedAt
    disputeResolverId
    numberOfCommits
    numberOfRedemptions
    condition {
      ...BaseConditionFields
    }
    seller {
      ...BaseSellerFields
    }
    exchangeToken {
      ...BaseExchangeTokenFields
    }
    disputeResolver {
      ...BaseDisputeResolverFields
    }
    disputeResolutionTerms {
      ...BaseDisputeResolutionTermsEntityFields
    }
    metadata {
      name
      description
      externalUrl
      animationUrl
      licenseUrl
      condition
      schemaUrl
      type
      image
      ... on ProductV1MetadataEntity {
        attributes {
          traitType
          value
          displayType
        }
        createdAt
        voided
        validFromDate
        validUntilDate
        quantityAvailable
        uuid
        product {
          ...BaseProductV1ProductFields
        }
        variations {
          ...BaseProductV1VariationFields
        }
        productV1Seller {
          ...BaseProductV1SellerFields
        }
        exchangePolicy {
          ...BaseProductV1ExchangePolicyFields
        }
        shipping {
          ...BaseProductV1ShippingOptionFields
        }
      }
    }
  }
  ${BaseConditionFieldsFragmentDoc}
  ${BaseSellerFieldsFragmentDoc}
  ${BaseExchangeTokenFieldsFragmentDoc}
  ${BaseDisputeResolverFieldsFragmentDoc}
  ${BaseDisputeResolutionTermsEntityFieldsFragmentDoc}
  ${BaseProductV1ProductFieldsFragmentDoc}
  ${BaseProductV1VariationFieldsFragmentDoc}
  ${BaseProductV1SellerFieldsFragmentDoc}
  ${BaseProductV1ExchangePolicyFieldsFragmentDoc}
  ${BaseProductV1ShippingOptionFieldsFragmentDoc}
`;
export const BaseDisputeFieldsFragmentDoc = gql`
  fragment BaseDisputeFields on Dispute {
    id
    exchangeId
    state
    buyerPercent
    disputedDate
    escalatedDate
    finalizedDate
    retractedDate
    resolvedDate
    decidedDate
    refusedDate
    timeout
  }
`;
export const BaseBuyerFieldsFragmentDoc = gql`
  fragment BaseBuyerFields on Buyer {
    id
    wallet
    active
  }
`;
export const BaseExchangeFieldsFragmentDoc = gql`
  fragment BaseExchangeFields on Exchange {
    id
    disputed
    state
    committedDate
    finalizedDate
    validUntilDate
    redeemedDate
    revokedDate
    cancelledDate
    completedDate
    disputedDate
    expired
    dispute {
      ...BaseDisputeFields
    }
    buyer {
      ...BaseBuyerFields
    }
    seller {
      ...BaseSellerFields
    }
  }
  ${BaseDisputeFieldsFragmentDoc}
  ${BaseBuyerFieldsFragmentDoc}
  ${BaseSellerFieldsFragmentDoc}
`;
export const BaseEventLogFieldsFragmentDoc = gql`
  fragment BaseEventLogFields on EventLog {
    id
    hash
    type
    timestamp
    executedBy
    account {
      id
    }
    ... on OfferEventLog {
      offer {
        id
      }
    }
    ... on ExchangeEventLog {
      exchange {
        id
        offer {
          id
        }
      }
    }
    ... on FundsEventLog {
      funds {
        id
      }
    }
    ... on DisputeEventLog {
      dispute {
        id
      }
    }
  }
`;
export const SellerFieldsFragmentDoc = gql`
  fragment SellerFields on Seller {
    ...BaseSellerFields
    pendingSeller {
      ...PendingSellerFields
    }
    funds(
      skip: $fundsSkip
      first: $fundsFirst
      orderBy: $fundsOrderBy
      orderDirection: $fundsOrderDirection
      where: $fundsFilter
    ) @include(if: $includeFunds) {
      ...FundsEntityFields
    }
    offers(
      skip: $offersSkip
      first: $offersFirst
      orderBy: $offersOrderBy
      orderDirection: $offersOrderDirection
      where: $offersFilter
    ) @include(if: $includeOffers) {
      ...BaseOfferFields
    }
    exchanges(
      skip: $exchangesSkip
      first: $exchangesFirst
      orderBy: $exchangesOrderBy
      orderDirection: $exchangesOrderDirection
      where: $exchangesFilter
    ) @include(if: $includeExchanges) {
      ...BaseExchangeFields
    }
    logs(
      skip: $logsSkip
      first: $logsFirst
      orderBy: $logsOrderBy
      orderDirection: $logsOrderDirection
      where: $logsFilter
    ) @include(if: $includeLogs) {
      ...BaseEventLogFields
    }
  }
  ${BaseSellerFieldsFragmentDoc}
  ${PendingSellerFieldsFragmentDoc}
  ${FundsEntityFieldsFragmentDoc}
  ${BaseOfferFieldsFragmentDoc}
  ${BaseExchangeFieldsFragmentDoc}
  ${BaseEventLogFieldsFragmentDoc}
`;
export const BuyerFieldsFragmentDoc = gql`
  fragment BuyerFields on Buyer {
    ...BaseBuyerFields
    funds(
      skip: $fundsSkip
      first: $fundsFirst
      orderBy: $fundsOrderBy
      orderDirection: $fundsOrderDirection
      where: $fundsFilter
    ) @include(if: $includeFunds) {
      ...FundsEntityFields
    }
    exchanges(
      skip: $exchangesSkip
      first: $exchangesFirst
      orderBy: $exchangesOrderBy
      orderDirection: $exchangesOrderDirection
      where: $exchangesFilter
    ) @include(if: $includeExchanges) {
      ...BaseExchangeFields
    }
    logs(
      skip: $logsSkip
      first: $logsFirst
      orderBy: $logsOrderBy
      orderDirection: $logsOrderDirection
      where: $logsFilter
    ) @include(if: $includeLogs) {
      ...BaseEventLogFields
    }
  }
  ${BaseBuyerFieldsFragmentDoc}
  ${FundsEntityFieldsFragmentDoc}
  ${BaseExchangeFieldsFragmentDoc}
  ${BaseEventLogFieldsFragmentDoc}
`;
export const PendingDisputeResolverFieldsFragmentDoc = gql`
  fragment PendingDisputeResolverFields on PendingDisputeResolver {
    operator
    admin
    clerk
  }
`;
export const DisputeResolverFieldsFragmentDoc = gql`
  fragment DisputeResolverFields on DisputeResolver {
    ...BaseDisputeResolverFields
    pendingDisputeResolver {
      ...PendingDisputeResolverFields
    }
    offers(
      skip: $offersSkip
      first: $offersFirst
      orderBy: $offersOrderBy
      orderDirection: $offersOrderDirection
      where: $offersFilter
    ) @include(if: $includeOffers) {
      ...BaseOfferFields
    }
    logs(
      skip: $logsSkip
      first: $logsFirst
      orderBy: $logsOrderBy
      orderDirection: $logsOrderDirection
      where: $logsFilter
    ) @include(if: $includeLogs) {
      ...BaseEventLogFields
    }
  }
  ${BaseDisputeResolverFieldsFragmentDoc}
  ${PendingDisputeResolverFieldsFragmentDoc}
  ${BaseOfferFieldsFragmentDoc}
  ${BaseEventLogFieldsFragmentDoc}
`;
export const DisputeFieldsFragmentDoc = gql`
  fragment DisputeFields on Dispute {
    ...BaseDisputeFields
    exchange {
      ...BaseExchangeFields
    }
    seller {
      ...BaseSellerFields
    }
    buyer {
      ...BaseBuyerFields
    }
  }
  ${BaseDisputeFieldsFragmentDoc}
  ${BaseExchangeFieldsFragmentDoc}
  ${BaseSellerFieldsFragmentDoc}
  ${BaseBuyerFieldsFragmentDoc}
`;
export const ExchangeTokenFieldsFragmentDoc = gql`
  fragment ExchangeTokenFields on ExchangeToken {
    ...BaseExchangeTokenFields
    offers(
      skip: $offersSkip
      first: $offersFirst
      orderBy: $offersOrderBy
      orderDirection: $offersOrderDirection
      where: $offersFilter
    ) @include(if: $includeOffers) {
      ...BaseOfferFields
    }
    funds(
      skip: $fundsSkip
      first: $fundsFirst
      orderBy: $fundsOrderBy
      orderDirection: $fundsOrderDirection
      where: $fundsFilter
    ) @include(if: $includeFunds) {
      ...BaseFundsEntityFields
    }
  }
  ${BaseExchangeTokenFieldsFragmentDoc}
  ${BaseOfferFieldsFragmentDoc}
  ${BaseFundsEntityFieldsFragmentDoc}
`;
export const ExchangeFieldsFragmentDoc = gql`
  fragment ExchangeFields on Exchange {
    ...BaseExchangeFields
    offer {
      ...BaseOfferFields
    }
  }
  ${BaseExchangeFieldsFragmentDoc}
  ${BaseOfferFieldsFragmentDoc}
`;
export const BaseBaseMetadataEntityFieldsFragmentDoc = gql`
  fragment BaseBaseMetadataEntityFields on BaseMetadataEntity {
    id
    name
    description
    externalUrl
    animationUrl
    licenseUrl
    condition
    schemaUrl
    type
    image
    attributes {
      traitType
      value
      displayType
    }
    offer {
      ...BaseOfferFields
    }
    seller {
      ...BaseSellerFields
    }
    exchangeToken {
      ...BaseExchangeTokenFields
    }
    createdAt
    voided
    validFromDate
    validUntilDate
    quantityAvailable
    numberOfCommits
    numberOfRedemptions
  }
  ${BaseOfferFieldsFragmentDoc}
  ${BaseSellerFieldsFragmentDoc}
  ${BaseExchangeTokenFieldsFragmentDoc}
`;
export const BaseMetadataEntityFieldsFragmentDoc = gql`
  fragment BaseMetadataEntityFields on BaseMetadataEntity {
    ...BaseBaseMetadataEntityFields
  }
  ${BaseBaseMetadataEntityFieldsFragmentDoc}
`;
export const BaseProductV1MetadataEntityFieldsFragmentDoc = gql`
  fragment BaseProductV1MetadataEntityFields on ProductV1MetadataEntity {
    id
    name
    description
    externalUrl
    animationUrl
    licenseUrl
    condition
    schemaUrl
    type
    image
    attributes {
      traitType
      value
      displayType
    }
    offer {
      ...BaseOfferFields
      exchanges {
        ...BaseExchangeFields
      }
    }
    seller {
      ...BaseSellerFields
    }
    exchangeToken {
      ...BaseExchangeTokenFields
    }
    createdAt
    voided
    validFromDate
    validUntilDate
    quantityAvailable
    numberOfCommits
    numberOfRedemptions
    uuid
    product {
      ...BaseProductV1ProductFields
    }
    variations {
      ...BaseProductV1VariationFields
    }
    productV1Seller {
      ...BaseProductV1SellerFields
    }
    exchangePolicy {
      ...BaseProductV1ExchangePolicyFields
    }
  }
  ${BaseOfferFieldsFragmentDoc}
  ${BaseExchangeFieldsFragmentDoc}
  ${BaseSellerFieldsFragmentDoc}
  ${BaseExchangeTokenFieldsFragmentDoc}
  ${BaseProductV1ProductFieldsFragmentDoc}
  ${BaseProductV1VariationFieldsFragmentDoc}
  ${BaseProductV1SellerFieldsFragmentDoc}
  ${BaseProductV1ExchangePolicyFieldsFragmentDoc}
`;
export const ProductV1MetadataEntityFieldsFragmentDoc = gql`
  fragment ProductV1MetadataEntityFields on ProductV1MetadataEntity {
    ...BaseProductV1MetadataEntityFields
  }
  ${BaseProductV1MetadataEntityFieldsFragmentDoc}
`;
export const BaseProductV1ProductWithVariantsFieldsFragmentDoc = gql`
  fragment BaseProductV1ProductWithVariantsFields on ProductV1Product {
    ...BaseProductV1ProductFields
    variants {
      offer {
        ...BaseOfferFields
        exchanges {
          ...BaseExchangeFields
        }
      }
      variations {
        ...BaseProductV1VariationFields
      }
    }
    allVariantsVoided
    minValidFromDate
    maxValidFromDate
    minValidUntilDate
    maxValidUntilDate
  }
  ${BaseProductV1ProductFieldsFragmentDoc}
  ${BaseOfferFieldsFragmentDoc}
  ${BaseExchangeFieldsFragmentDoc}
  ${BaseProductV1VariationFieldsFragmentDoc}
`;
export const BaseProductV1ProductWithNotVoidedVariantsFieldsFragmentDoc = gql`
  fragment BaseProductV1ProductWithNotVoidedVariantsFields on ProductV1Product {
    ...BaseProductV1ProductFields
    notVoidedVariants {
      offer {
        ...BaseOfferFields
        exchanges {
          ...BaseExchangeFields
        }
      }
      variations {
        ...BaseProductV1VariationFields
      }
    }
    allVariantsVoided
    minValidFromDate
    maxValidFromDate
    minValidUntilDate
    maxValidUntilDate
  }
  ${BaseProductV1ProductFieldsFragmentDoc}
  ${BaseOfferFieldsFragmentDoc}
  ${BaseExchangeFieldsFragmentDoc}
  ${BaseProductV1VariationFieldsFragmentDoc}
`;
export const BaseProductV1ProductOverridesFieldsFragmentDoc = gql`
  fragment BaseProductV1ProductOverridesFields on ProductV1ProductOverrides {
    id
    version
    title
    description
    identification_sKU
    identification_productId
    identification_productIdType
    productionInformation_brandName
    brand {
      ...BaseProductV1BrandFields
    }
    productionInformation_manufacturer
    productionInformation_manufacturerPartNumber
    productionInformation_modelNumber
    productionInformation_materials
    visuals_images {
      ...BaseProductV1MediaFields
    }
    visuals_videos {
      ...BaseProductV1MediaFields
    }
    packaging_packageQuantity
    packaging_dimensions_length
    packaging_dimensions_width
    packaging_dimensions_height
    packaging_dimensions_unit
    packaging_weight_value
    packaging_weight_unit
  }
  ${BaseProductV1BrandFieldsFragmentDoc}
  ${BaseProductV1MediaFieldsFragmentDoc}
`;
export const OfferFieldsFragmentDoc = gql`
  fragment OfferFields on Offer {
    ...BaseOfferFields
    exchanges(
      skip: $exchangesSkip
      first: $exchangesFirst
      orderBy: $exchangesOrderBy
      orderDirection: $exchangesOrderDirection
      where: $exchangesFilter
    ) @include(if: $includeExchanges) {
      ...BaseExchangeFields
    }
  }
  ${BaseOfferFieldsFragmentDoc}
  ${BaseExchangeFieldsFragmentDoc}
`;
export const GetSellerByIdQueryDocument = gql`
  query getSellerByIdQuery(
    $sellerId: ID!
    $fundsSkip: Int
    $fundsFirst: Int
    $fundsOrderBy: FundsEntity_orderBy
    $fundsOrderDirection: OrderDirection
    $fundsFilter: FundsEntity_filter
    $offersSkip: Int
    $offersFirst: Int
    $offersOrderBy: Offer_orderBy
    $offersOrderDirection: OrderDirection
    $offersFilter: Offer_filter
    $exchangesSkip: Int
    $exchangesFirst: Int
    $exchangesOrderBy: Exchange_orderBy
    $exchangesOrderDirection: OrderDirection
    $exchangesFilter: Exchange_filter
    $logsSkip: Int
    $logsFirst: Int
    $logsOrderBy: EventLog_orderBy
    $logsOrderDirection: OrderDirection
    $logsFilter: EventLog_filter
    $includeExchanges: Boolean = false
    $includeOffers: Boolean = false
    $includeFunds: Boolean = false
    $includeLogs: Boolean = false
  ) {
    seller(id: $sellerId) {
      ...SellerFields
    }
  }
  ${SellerFieldsFragmentDoc}
`;
export const GetSellersQueryDocument = gql`
  query getSellersQuery(
    $sellersSkip: Int
    $sellersFirst: Int
    $sellersOrderBy: Seller_orderBy
    $sellersOrderDirection: OrderDirection
    $sellersFilter: Seller_filter
    $fundsSkip: Int
    $fundsFirst: Int
    $fundsOrderBy: FundsEntity_orderBy
    $fundsOrderDirection: OrderDirection
    $fundsFilter: FundsEntity_filter
    $offersSkip: Int
    $offersFirst: Int
    $offersOrderBy: Offer_orderBy
    $offersOrderDirection: OrderDirection
    $offersFilter: Offer_filter
    $exchangesSkip: Int
    $exchangesFirst: Int
    $exchangesOrderBy: Exchange_orderBy
    $exchangesOrderDirection: OrderDirection
    $exchangesFilter: Exchange_filter
    $logsSkip: Int
    $logsFirst: Int
    $logsOrderBy: EventLog_orderBy
    $logsOrderDirection: OrderDirection
    $logsFilter: EventLog_filter
    $includeExchanges: Boolean = false
    $includeOffers: Boolean = false
    $includeFunds: Boolean = false
    $includeLogs: Boolean = false
  ) {
    sellers(
      skip: $sellersSkip
      first: $sellersFirst
      orderBy: $sellersOrderBy
      orderDirection: $sellersOrderDirection
      where: $sellersFilter
    ) {
      ...SellerFields
    }
  }
  ${SellerFieldsFragmentDoc}
`;
export const GetBuyerByIdQueryDocument = gql`
  query getBuyerByIdQuery(
    $buyerId: ID!
    $fundsSkip: Int
    $fundsFirst: Int
    $fundsOrderBy: FundsEntity_orderBy
    $fundsOrderDirection: OrderDirection
    $fundsFilter: FundsEntity_filter
    $exchangesSkip: Int
    $exchangesFirst: Int
    $exchangesOrderBy: Exchange_orderBy
    $exchangesOrderDirection: OrderDirection
    $exchangesFilter: Exchange_filter
    $logsSkip: Int
    $logsFirst: Int
    $logsOrderBy: EventLog_orderBy
    $logsOrderDirection: OrderDirection
    $logsFilter: EventLog_filter
    $includeExchanges: Boolean = false
    $includeFunds: Boolean = false
    $includeLogs: Boolean = false
  ) {
    buyer(id: $buyerId) {
      ...BuyerFields
    }
  }
  ${BuyerFieldsFragmentDoc}
`;
export const GetBuyersQueryDocument = gql`
  query getBuyersQuery(
    $buyersSkip: Int
    $buyersFirst: Int
    $buyersOrderBy: Buyer_orderBy
    $buyersOrderDirection: OrderDirection
    $buyersFilter: Buyer_filter
    $fundsSkip: Int
    $fundsFirst: Int
    $fundsOrderBy: FundsEntity_orderBy
    $fundsOrderDirection: OrderDirection
    $fundsFilter: FundsEntity_filter
    $offersSkip: Int
    $offersFirst: Int
    $offersOrderBy: Offer_orderBy
    $offersOrderDirection: OrderDirection
    $offersFilter: Offer_filter
    $exchangesSkip: Int
    $exchangesFirst: Int
    $exchangesOrderBy: Exchange_orderBy
    $exchangesOrderDirection: OrderDirection
    $exchangesFilter: Exchange_filter
    $logsSkip: Int
    $logsFirst: Int
    $logsOrderBy: EventLog_orderBy
    $logsOrderDirection: OrderDirection
    $logsFilter: EventLog_filter
    $includeExchanges: Boolean = false
    $includeOffers: Boolean = false
    $includeFunds: Boolean = false
    $includeLogs: Boolean = false
  ) {
    buyers(
      skip: $buyersSkip
      first: $buyersFirst
      orderBy: $buyersOrderBy
      orderDirection: $buyersOrderDirection
      where: $buyersFilter
    ) {
      ...BuyerFields
    }
  }
  ${BuyerFieldsFragmentDoc}
`;
export const GetDisputeResolverByIdQueryDocument = gql`
  query getDisputeResolverByIdQuery(
    $disputeResolverId: ID!
    $offersSkip: Int
    $offersFirst: Int
    $offersOrderBy: Offer_orderBy
    $offersOrderDirection: OrderDirection
    $offersFilter: Offer_filter
    $logsSkip: Int
    $logsFirst: Int
    $logsOrderBy: EventLog_orderBy
    $logsOrderDirection: OrderDirection
    $logsFilter: EventLog_filter
    $includeOffers: Boolean = false
    $includeLogs: Boolean = false
  ) {
    disputeResolver(id: $disputeResolverId) {
      ...DisputeResolverFields
    }
  }
  ${DisputeResolverFieldsFragmentDoc}
`;
export const GetDisputeResolversQueryDocument = gql`
  query getDisputeResolversQuery(
    $disputeResolversSkip: Int
    $disputeResolversFirst: Int
    $disputeResolversOrderBy: DisputeResolver_orderBy
    $disputeResolversOrderDirection: OrderDirection
    $disputeResolversFilter: DisputeResolver_filter
    $offersSkip: Int
    $offersFirst: Int
    $offersOrderBy: Offer_orderBy
    $offersOrderDirection: OrderDirection
    $offersFilter: Offer_filter
    $logsSkip: Int
    $logsFirst: Int
    $logsOrderBy: EventLog_orderBy
    $logsOrderDirection: OrderDirection
    $logsFilter: EventLog_filter
    $includeOffers: Boolean = false
    $includeLogs: Boolean = false
  ) {
    disputeResolvers(
      skip: $disputeResolversSkip
      first: $disputeResolversFirst
      orderBy: $disputeResolversOrderBy
      orderDirection: $disputeResolversOrderDirection
      where: $disputeResolversFilter
    ) {
      ...DisputeResolverFields
    }
  }
  ${DisputeResolverFieldsFragmentDoc}
`;
export const GetDisputeByIdQueryDocument = gql`
  query getDisputeByIdQuery(
    $disputeId: ID!
    $offersSkip: Int
    $offersFirst: Int
    $offersOrderBy: Offer_orderBy
    $offersOrderDirection: OrderDirection
    $offersFilter: Offer_filter
    $includeOffers: Boolean = false
  ) {
    dispute(id: $disputeId) {
      ...DisputeFields
    }
  }
  ${DisputeFieldsFragmentDoc}
`;
export const GetDisputesQueryDocument = gql`
  query getDisputesQuery(
    $disputesSkip: Int
    $disputesFirst: Int
    $disputesOrderBy: Dispute_orderBy
    $disputesOrderDirection: OrderDirection
    $disputesFilter: Dispute_filter
  ) {
    disputes(
      skip: $disputesSkip
      first: $disputesFirst
      orderBy: $disputesOrderBy
      orderDirection: $disputesOrderDirection
      where: $disputesFilter
    ) {
      ...DisputeFields
    }
  }
  ${DisputeFieldsFragmentDoc}
`;
export const GetExchangeTokenByIdQueryDocument = gql`
  query getExchangeTokenByIdQuery(
    $exchangeTokenId: ID!
    $exchangeTokensSkip: Int
    $exchangeTokensFirst: Int
    $exchangeTokensOrderBy: ExchangeToken_orderBy
    $exchangeTokensOrderDirection: OrderDirection
    $exchangeTokensFilter: ExchangeToken_filter
    $offersSkip: Int
    $offersFirst: Int
    $offersOrderBy: Offer_orderBy
    $offersOrderDirection: OrderDirection
    $offersFilter: Offer_filter
    $fundsSkip: Int
    $fundsFirst: Int
    $fundsOrderBy: FundsEntity_orderBy
    $fundsOrderDirection: OrderDirection
    $fundsFilter: FundsEntity_filter
    $includeOffers: Boolean = false
    $includeFunds: Boolean = false
  ) {
    exchangeToken(id: $exchangeTokenId) {
      ...ExchangeTokenFields
    }
  }
  ${ExchangeTokenFieldsFragmentDoc}
`;
export const GetExchangeTokensQueryDocument = gql`
  query getExchangeTokensQuery(
    $exchangeTokensSkip: Int
    $exchangeTokensFirst: Int
    $exchangeTokensOrderBy: ExchangeToken_orderBy
    $exchangeTokensOrderDirection: OrderDirection
    $exchangeTokensFilter: ExchangeToken_filter
    $offersSkip: Int
    $offersFirst: Int
    $offersOrderBy: Offer_orderBy
    $offersOrderDirection: OrderDirection
    $offersFilter: Offer_filter
    $includeOffers: Boolean = false
    $fundsSkip: Int
    $fundsFirst: Int
    $fundsOrderBy: FundsEntity_orderBy
    $fundsOrderDirection: OrderDirection
    $fundsFilter: FundsEntity_filter
    $includeFunds: Boolean = false
  ) {
    exchangeTokens(
      skip: $exchangeTokensSkip
      first: $exchangeTokensFirst
      orderBy: $exchangeTokensOrderBy
      orderDirection: $exchangeTokensOrderDirection
      where: $exchangeTokensFilter
    ) {
      ...ExchangeTokenFields
    }
  }
  ${ExchangeTokenFieldsFragmentDoc}
`;
export const GetEventLogsQueryDocument = gql`
  query getEventLogsQuery(
    $logsSkip: Int
    $logsFirst: Int
    $logsOrderBy: EventLog_orderBy
    $logsOrderDirection: OrderDirection
    $logsFilter: EventLog_filter
  ) {
    eventLogs(
      skip: $logsSkip
      first: $logsFirst
      orderBy: $logsOrderBy
      orderDirection: $logsOrderDirection
      where: $logsFilter
    ) {
      ...BaseEventLogFields
    }
  }
  ${BaseEventLogFieldsFragmentDoc}
`;
export const GetExchangeByIdQueryDocument = gql`
  query getExchangeByIdQuery($exchangeId: ID!) {
    exchange(id: $exchangeId) {
      ...ExchangeFields
    }
  }
  ${ExchangeFieldsFragmentDoc}
`;
export const GetExchangesQueryDocument = gql`
  query getExchangesQuery(
    $exchangesSkip: Int
    $exchangesFirst: Int
    $exchangesOrderBy: Exchange_orderBy
    $exchangesOrderDirection: OrderDirection
    $exchangesFilter: Exchange_filter
  ) {
    exchanges(
      skip: $exchangesSkip
      first: $exchangesFirst
      orderBy: $exchangesOrderBy
      orderDirection: $exchangesOrderDirection
      where: $exchangesFilter
    ) {
      ...ExchangeFields
    }
  }
  ${ExchangeFieldsFragmentDoc}
`;
export const GetFundsByIdDocument = gql`
  query getFundsById($fundsId: ID!) {
    fundsEntity(id: $fundsId) {
      ...FundsEntityFields
    }
  }
  ${FundsEntityFieldsFragmentDoc}
`;
export const GetFundsDocument = gql`
  query getFunds(
    $fundsSkip: Int
    $fundsFirst: Int
    $fundsOrderBy: FundsEntity_orderBy
    $fundsOrderDirection: OrderDirection
    $fundsFilter: FundsEntity_filter
  ) {
    fundsEntities(
      skip: $fundsSkip
      first: $fundsFirst
      orderBy: $fundsOrderBy
      orderDirection: $fundsOrderDirection
      where: $fundsFilter
    ) {
      ...FundsEntityFields
    }
  }
  ${FundsEntityFieldsFragmentDoc}
`;
export const GetBaseMetadataEntityByIdQueryDocument = gql`
  query getBaseMetadataEntityByIdQuery(
    $metadataId: ID!
    $metadataSkip: Int
    $metadataFirst: Int
    $metadataOrderBy: BaseMetadataEntity_orderBy
    $metadataOrderDirection: OrderDirection
    $metadataFilter: BaseMetadataEntity_filter
  ) {
    baseMetadataEntity(id: $metadataId) {
      ...BaseMetadataEntityFields
    }
  }
  ${BaseMetadataEntityFieldsFragmentDoc}
`;
export const GetBaseMetadataEntitiesQueryDocument = gql`
  query getBaseMetadataEntitiesQuery(
    $metadataSkip: Int
    $metadataFirst: Int
    $metadataOrderBy: BaseMetadataEntity_orderBy
    $metadataOrderDirection: OrderDirection
    $metadataFilter: BaseMetadataEntity_filter
  ) {
    baseMetadataEntities(
      skip: $metadataSkip
      first: $metadataFirst
      orderBy: $metadataOrderBy
      orderDirection: $metadataOrderDirection
      where: $metadataFilter
    ) {
      ...BaseMetadataEntityFields
    }
  }
  ${BaseMetadataEntityFieldsFragmentDoc}
`;
export const GetProductV1BrandsQueryDocument = gql`
  query getProductV1BrandsQuery(
    $brandsSkip: Int
    $brandsFirst: Int
    $brandsOrderBy: ProductV1Brand_orderBy
    $brandsOrderDirection: OrderDirection
    $brandsFilter: ProductV1Brand_filter
  ) {
    productV1Brands(
      skip: $brandsSkip
      first: $brandsFirst
      orderBy: $brandsOrderBy
      orderDirection: $brandsOrderDirection
      where: $brandsFilter
    ) {
      ...BaseProductV1BrandFields
    }
  }
  ${BaseProductV1BrandFieldsFragmentDoc}
`;
export const GetProductV1ProductsQueryDocument = gql`
  query getProductV1ProductsQuery(
    $productsSkip: Int
    $productsFirst: Int
    $productsOrderBy: ProductV1Product_orderBy
    $productsOrderDirection: OrderDirection
    $productsFilter: ProductV1Product_filter
  ) {
    productV1Products(
      skip: $productsSkip
      first: $productsFirst
      orderBy: $productsOrderBy
      orderDirection: $productsOrderDirection
      where: $productsFilter
    ) {
      ...BaseProductV1ProductFields
    }
  }
  ${BaseProductV1ProductFieldsFragmentDoc}
`;
export const GetProductV1ProductsWithVariantsQueryDocument = gql`
  query getProductV1ProductsWithVariantsQuery(
    $productsSkip: Int
    $productsFirst: Int
    $productsOrderBy: ProductV1Product_orderBy
    $productsOrderDirection: OrderDirection
    $productsFilter: ProductV1Product_filter
  ) {
    productV1Products(
      skip: $productsSkip
      first: $productsFirst
      orderBy: $productsOrderBy
      orderDirection: $productsOrderDirection
      where: $productsFilter
    ) {
      ...BaseProductV1ProductWithVariantsFields
    }
  }
  ${BaseProductV1ProductWithVariantsFieldsFragmentDoc}
`;
export const GetAllProductsWithNotVoidedVariantsQueryDocument = gql`
  query getAllProductsWithNotVoidedVariantsQuery(
    $productsSkip: Int
    $productsFirst: Int
    $productsOrderBy: ProductV1Product_orderBy
    $productsOrderDirection: OrderDirection
    $productsFilter: ProductV1Product_filter
  ) {
    productV1Products(
      skip: $productsSkip
      first: $productsFirst
      orderBy: $productsOrderBy
      orderDirection: $productsOrderDirection
      where: $productsFilter
    ) {
      ...BaseProductV1ProductWithNotVoidedVariantsFields
    }
  }
  ${BaseProductV1ProductWithNotVoidedVariantsFieldsFragmentDoc}
`;
export const GetProductV1CategoriesQueryDocument = gql`
  query getProductV1CategoriesQuery(
    $categoriesSkip: Int
    $categoriesFirst: Int
    $categoriesOrderBy: ProductV1Category_orderBy
    $categoriesOrderDirection: OrderDirection
    $categoriesFilter: ProductV1Category_filter
  ) {
    productV1Categories(
      skip: $categoriesSkip
      first: $categoriesFirst
      orderBy: $categoriesOrderBy
      orderDirection: $categoriesOrderDirection
      where: $categoriesFilter
    ) {
      ...BaseProductV1CategoryFields
    }
  }
  ${BaseProductV1CategoryFieldsFragmentDoc}
`;
export const GetProductV1MetadataEntityByIdQueryDocument = gql`
  query getProductV1MetadataEntityByIdQuery(
    $metadataId: ID!
    $metadataSkip: Int
    $metadataFirst: Int
    $metadataOrderBy: ProductV1MetadataEntity_orderBy
    $metadataOrderDirection: OrderDirection
    $metadataFilter: ProductV1MetadataEntity_filter
  ) {
    productV1MetadataEntity(id: $metadataId) {
      ...ProductV1MetadataEntityFields
    }
  }
  ${ProductV1MetadataEntityFieldsFragmentDoc}
`;
export const GetProductV1MetadataEntitiesQueryDocument = gql`
  query getProductV1MetadataEntitiesQuery(
    $metadataSkip: Int
    $metadataFirst: Int
    $metadataOrderBy: ProductV1MetadataEntity_orderBy
    $metadataOrderDirection: OrderDirection
    $metadataFilter: ProductV1MetadataEntity_filter
  ) {
    productV1MetadataEntities(
      skip: $metadataSkip
      first: $metadataFirst
      orderBy: $metadataOrderBy
      orderDirection: $metadataOrderDirection
      where: $metadataFilter
    ) {
      ...ProductV1MetadataEntityFields
    }
  }
  ${ProductV1MetadataEntityFieldsFragmentDoc}
`;
export const GetOfferByIdQueryDocument = gql`
  query getOfferByIdQuery(
    $offerId: ID!
    $exchangesSkip: Int
    $exchangesFirst: Int
    $exchangesOrderBy: Exchange_orderBy
    $exchangesOrderDirection: OrderDirection
    $exchangesFilter: Exchange_filter
    $includeExchanges: Boolean = false
  ) {
    offer(id: $offerId) {
      ...OfferFields
    }
  }
  ${OfferFieldsFragmentDoc}
`;
export const GetOffersQueryDocument = gql`
  query getOffersQuery(
    $offersSkip: Int
    $offersFirst: Int
    $offersOrderBy: Offer_orderBy
    $offersOrderDirection: OrderDirection
    $offersFilter: Offer_filter
    $exchangesSkip: Int
    $exchangesFirst: Int
    $exchangesOrderBy: Exchange_orderBy
    $exchangesOrderDirection: OrderDirection
    $exchangesFilter: Exchange_filter
    $includeExchanges: Boolean = false
  ) {
    offers(
      skip: $offersSkip
      first: $offersFirst
      orderBy: $offersOrderBy
      orderDirection: $offersOrderDirection
      where: $offersFilter
    ) {
      ...OfferFields
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
    getSellerByIdQuery(
      variables: GetSellerByIdQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetSellerByIdQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetSellerByIdQueryQuery>(
            GetSellerByIdQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getSellerByIdQuery",
        "query"
      );
    },
    getSellersQuery(
      variables?: GetSellersQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetSellersQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetSellersQueryQuery>(
            GetSellersQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getSellersQuery",
        "query"
      );
    },
    getBuyerByIdQuery(
      variables: GetBuyerByIdQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetBuyerByIdQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetBuyerByIdQueryQuery>(
            GetBuyerByIdQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getBuyerByIdQuery",
        "query"
      );
    },
    getBuyersQuery(
      variables?: GetBuyersQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetBuyersQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetBuyersQueryQuery>(
            GetBuyersQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getBuyersQuery",
        "query"
      );
    },
    getDisputeResolverByIdQuery(
      variables: GetDisputeResolverByIdQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetDisputeResolverByIdQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetDisputeResolverByIdQueryQuery>(
            GetDisputeResolverByIdQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getDisputeResolverByIdQuery",
        "query"
      );
    },
    getDisputeResolversQuery(
      variables?: GetDisputeResolversQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetDisputeResolversQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetDisputeResolversQueryQuery>(
            GetDisputeResolversQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getDisputeResolversQuery",
        "query"
      );
    },
    getDisputeByIdQuery(
      variables: GetDisputeByIdQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetDisputeByIdQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetDisputeByIdQueryQuery>(
            GetDisputeByIdQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getDisputeByIdQuery",
        "query"
      );
    },
    getDisputesQuery(
      variables?: GetDisputesQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetDisputesQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetDisputesQueryQuery>(
            GetDisputesQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getDisputesQuery",
        "query"
      );
    },
    getExchangeTokenByIdQuery(
      variables: GetExchangeTokenByIdQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetExchangeTokenByIdQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetExchangeTokenByIdQueryQuery>(
            GetExchangeTokenByIdQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getExchangeTokenByIdQuery",
        "query"
      );
    },
    getExchangeTokensQuery(
      variables?: GetExchangeTokensQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetExchangeTokensQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetExchangeTokensQueryQuery>(
            GetExchangeTokensQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getExchangeTokensQuery",
        "query"
      );
    },
    getEventLogsQuery(
      variables?: GetEventLogsQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetEventLogsQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetEventLogsQueryQuery>(
            GetEventLogsQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getEventLogsQuery",
        "query"
      );
    },
    getExchangeByIdQuery(
      variables: GetExchangeByIdQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetExchangeByIdQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetExchangeByIdQueryQuery>(
            GetExchangeByIdQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getExchangeByIdQuery",
        "query"
      );
    },
    getExchangesQuery(
      variables?: GetExchangesQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetExchangesQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetExchangesQueryQuery>(
            GetExchangesQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getExchangesQuery",
        "query"
      );
    },
    getFundsById(
      variables: GetFundsByIdQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetFundsByIdQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetFundsByIdQuery>(GetFundsByIdDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders
          }),
        "getFundsById",
        "query"
      );
    },
    getFunds(
      variables?: GetFundsQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetFundsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetFundsQuery>(GetFundsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders
          }),
        "getFunds",
        "query"
      );
    },
    getBaseMetadataEntityByIdQuery(
      variables: GetBaseMetadataEntityByIdQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetBaseMetadataEntityByIdQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetBaseMetadataEntityByIdQueryQuery>(
            GetBaseMetadataEntityByIdQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getBaseMetadataEntityByIdQuery",
        "query"
      );
    },
    getBaseMetadataEntitiesQuery(
      variables?: GetBaseMetadataEntitiesQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetBaseMetadataEntitiesQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetBaseMetadataEntitiesQueryQuery>(
            GetBaseMetadataEntitiesQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getBaseMetadataEntitiesQuery",
        "query"
      );
    },
    getProductV1BrandsQuery(
      variables?: GetProductV1BrandsQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetProductV1BrandsQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetProductV1BrandsQueryQuery>(
            GetProductV1BrandsQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getProductV1BrandsQuery",
        "query"
      );
    },
    getProductV1ProductsQuery(
      variables?: GetProductV1ProductsQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetProductV1ProductsQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetProductV1ProductsQueryQuery>(
            GetProductV1ProductsQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getProductV1ProductsQuery",
        "query"
      );
    },
    getProductV1ProductsWithVariantsQuery(
      variables?: GetProductV1ProductsWithVariantsQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetProductV1ProductsWithVariantsQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetProductV1ProductsWithVariantsQueryQuery>(
            GetProductV1ProductsWithVariantsQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getProductV1ProductsWithVariantsQuery",
        "query"
      );
    },
    getAllProductsWithNotVoidedVariantsQuery(
      variables?: GetAllProductsWithNotVoidedVariantsQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetAllProductsWithNotVoidedVariantsQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetAllProductsWithNotVoidedVariantsQueryQuery>(
            GetAllProductsWithNotVoidedVariantsQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getAllProductsWithNotVoidedVariantsQuery",
        "query"
      );
    },
    getProductV1CategoriesQuery(
      variables?: GetProductV1CategoriesQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetProductV1CategoriesQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetProductV1CategoriesQueryQuery>(
            GetProductV1CategoriesQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getProductV1CategoriesQuery",
        "query"
      );
    },
    getProductV1MetadataEntityByIdQuery(
      variables: GetProductV1MetadataEntityByIdQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetProductV1MetadataEntityByIdQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetProductV1MetadataEntityByIdQueryQuery>(
            GetProductV1MetadataEntityByIdQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getProductV1MetadataEntityByIdQuery",
        "query"
      );
    },
    getProductV1MetadataEntitiesQuery(
      variables?: GetProductV1MetadataEntitiesQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetProductV1MetadataEntitiesQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetProductV1MetadataEntitiesQueryQuery>(
            GetProductV1MetadataEntitiesQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getProductV1MetadataEntitiesQuery",
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
    getOffersQuery(
      variables?: GetOffersQueryQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetOffersQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetOffersQueryQuery>(
            GetOffersQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getOffersQuery",
        "query"
      );
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
