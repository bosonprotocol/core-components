import { BigNumberish } from "@ethersproject/bignumber";

/**
 * CreateSellerArgs
 *
 * ## Boson Seller roles
 *
 * In Boson Protocol, a Seller account is created for a set of wallet addresses mapped to roles:
 * - `admin`: the wallet with the `admin` role controls the seller account security, in particular setting up the wallet addresses of the other roles
 * - `assistant`: the wallet with the `assistant` role controls most of the usual Seller's activities in Boson Protocol: managing offers, managing exchanges, managing disputes,
 * - `treasury`: the wallet with the `treasury` role receives the money, when withdrawn from the protocol
 * Note: it is possible to associate the same wallet to the 3 roles. By the way, that is the easiest way to set up a Boson Seller account!
 * At any time, it is possible to change the wallets mapped to the different roles, no matter what your initial choice was.
 *
 * ## Authentication Token feature
 *
 * Optionally, the `admin` role can be associated to the wallet owning and **Authentication Token**.
 * Supported authentication Tokens are:
 * - ENS on Ethereum
 * - LENS on Mumbai
 * Using the Authentication Token feature allows to associate the seller account with a specific Token, instead of a specific account.
 * If the Auth Token is transferred to another wallet, then the Boson Seller account control is transferred to this new wallet as well, without any other action.
 *
 * To use the Auth Token feature, set:
 * - `admin` address to 0x0000000000000000000000000000000000000000,
 * - `authTokenType` to AuthTokenType.ENS (on Ethereum) or AuthTokenType.LENS (on Mumbai) {@link AuthTokenType}
 * - `authTokenId` to the ENS or LENS tokenId owned by the wallet you want to associate to the `admin` role
 *
 * To NOT use the Auth Token feature, set:
 * - `admin` address to the address of the wallet you want to associate to the `admin` role,
 * - `authTokenType` to AuthTokenType.NONE {@link AuthTokenType}
 *
 * ## Boson Seller Metadata
 *
 * Optionally the seller account can define some metadata about the seller.
 * Seller Metadata Schema: https://github.com/bosonprotocol/core-components/blob/main/packages/metadata/src/seller/schema.json
 * This metadata can be updated at any time using {@link updateSeller}
 *
 * ## Voucher Collection
 *
 * When the Seller creates some Offers, they will be part of a Collection
 * Each collection is an NFT contract, whose tokens, the redeemable NFTs, will represent the vouchers (or `exchanges`) for the offers created in that collection.
 * To improve the render of the NFT collection in an NFT marketplace (eg Opensea), the NFT contract can provide some metadata (see schema at https://docs.opensea.io/docs/contract-level-metadata).
 * When creating a Seller, a first Collection is created and will receive, by default, all offers created by the Seller until they decide to create other collections.
 *
 */
export type CreateSellerArgs = {
  /** wallet address of the seller's 'assistant' role */
  assistant: string;
  /** wallet address of the seller's 'admin' role OR 0x0000000000000000000000000000000000000000 if authTokenType is used */
  admin: string;
  /** wallet address of the seller's 'treasury' role */
  treasury: string;
  /** Uri of the metadata of the 1st collection voucher contract */
  contractUri: string;
  /** Royalty percentage for voucher secondary sales */
  royaltyPercentage: BigNumberish;
  /** Id of the token owned by the 'admin' wallet, in case authTokenType is used */
  authTokenId: BigNumberish;
  /** Type of AuthToken {@link AuthTokenType} */
  authTokenType: number;
  /** Uri of the seller metadata */
  metadataUri: string;
};

export type UpdateSellerArgs = { id: BigNumberish } & Omit<
  CreateSellerArgs,
  "contractUri" | "royaltyPercentage"
>;

export const SellerUpdateFields = {
  admin: 0,
  assistant: 1,
  clerk: 2,
  authToken: 3
};

export type OptInToSellerUpdateArgs = {
  id: BigNumberish;
  fieldsToUpdate: {
    admin?: boolean;
    assistant?: boolean;
    authToken?: boolean;
  };
};

export const DisputeResolverUpdateFields = {
  admin: 0,
  assistant: 1,
  clerk: 2
};

export type OptInToDisputeResolverUpdateArgs = {
  id: BigNumberish;
  fieldsToUpdate: {
    admin?: boolean;
    assistant?: boolean;
  };
};

export const AuthTokenType = {
  NONE: 0,
  CUSTOM: 1,
  LENS: 2,
  ENS: 3
};

export type SellerStruct = {
  id: BigNumberish;
  assistant: string;
  admin: string;
  clerk: string;
  treasury: string;
  voucherCloneAddress: string;
  authTokenId: BigNumberish;
  authTokenType: number;
  active: boolean;
};

export type AuthTokenStruct = {
  tokenId: BigNumberish;
  tokenType: number;
};

export type VoucherInitValuesStruct = {
  contractURI: string;
  royaltyPercentage: BigNumberish;
  collectionSalt: string;
};

export type DisputeResolverStruct = {
  id: BigNumberish;
  escalationResponsePeriod: BigNumberish;
  assistant: string;
  admin: string;
  clerk: string;
  treasury: string;
  metadataUri: string;
  active: boolean;
};

export type CreateCollectionArgs = {
  /** A tag to identify the seller's collection */
  collectionId: string;
  /** Uri of the metadata of the collection voucher contract */
  contractUri: string;
  /** Royalty percentage for voucher secondary sales */
  royaltyPercentage: BigNumberish;
  /** collectionSalt is added to the seller admin address to give the sellerSalt
      that is used to compute the voucher contract address. By default, deduced from collectionId */
  collectionSalt?: string;
  /** optional field to specify the sellerId (will be retrived from caller wallet is not specified) */
  sellerId?: BigNumberish;
};
