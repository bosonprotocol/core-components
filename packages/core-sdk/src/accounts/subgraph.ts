import { getSubgraphSdk } from "../utils/graphql";
import {
  BuyerFieldsFragment,
  GetBuyerByIdQueryQueryVariables,
  GetBuyersQueryQueryVariables,
  SellerFieldsFragment,
  GetSellersQueryQueryVariables,
  GetSellerByIdQueryQueryVariables,
  GetDisputeResolverByIdQueryQueryVariables,
  GetDisputeResolversQueryQueryVariables,
  DisputeResolverFieldsFragment,
  GetOfferCollectionsQueryQueryVariables,
  OfferCollectionFieldsFragment
} from "../subgraph";
import { BigNumberish } from "@ethersproject/bignumber";

export type SingleSellerQueryVariables = Omit<
  GetSellerByIdQueryQueryVariables,
  "sellerId"
>;

export type SingleBuyerQueryVariables = Omit<
  GetBuyerByIdQueryQueryVariables,
  "buyerId"
>;

export type SingleDisputeResolverQueryVariables = Omit<
  GetDisputeResolverByIdQueryQueryVariables,
  "disputeResolverId"
>;

export async function getBuyerById(
  subgraphUrl: string,
  buyerId: BigNumberish,
  queryVars: SingleBuyerQueryVariables = {}
): Promise<BuyerFieldsFragment> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { buyer } = await sdk.getBuyerByIdQuery({
    buyerId: buyerId.toString(),
    ...queryVars
  });
  return buyer;
}

export async function getBuyers(
  subgraphUrl: string,
  queryVars: GetBuyersQueryQueryVariables = {}
): Promise<BuyerFieldsFragment[]> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { buyers = [] } = await sdk.getBuyersQuery(queryVars);
  return buyers;
}

export async function getSellerById(
  subgraphUrl: string,
  sellerId: BigNumberish,
  queryVars: SingleSellerQueryVariables = {}
): Promise<SellerFieldsFragment> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { seller } = await sdk.getSellerByIdQuery({
    sellerId: sellerId.toString(),
    ...queryVars
  });
  return seller;
}

export async function getSellers(
  subgraphUrl: string,
  queryVars: GetSellersQueryQueryVariables = {}
): Promise<SellerFieldsFragment[]> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { sellers = [] } = await sdk.getSellersQuery(queryVars);
  return sellers;
}

export async function getSellerByAssistant(
  subgraphUrl: string,
  assistantAddress: string,
  queryVars: GetSellersQueryQueryVariables = {}
): Promise<SellerFieldsFragment | undefined> {
  const sellers = await getSellers(subgraphUrl, {
    sellersFilter: {
      ...queryVars.sellersFilter,
      assistant: assistantAddress.toLowerCase()
    },
    ...queryVars
  });
  return sellers[0];
}

export async function getSellerByAdmin(
  subgraphUrl: string,
  adminAddress: string,
  queryVars: GetSellersQueryQueryVariables = {}
): Promise<SellerFieldsFragment> {
  const sellers = await getSellers(subgraphUrl, {
    sellersFilter: {
      ...queryVars.sellersFilter,
      admin: adminAddress.toLowerCase()
    },
    ...queryVars
  });
  return sellers[0];
}

export async function getSellerByTreasury(
  subgraphUrl: string,
  treasuryAddress: string,
  queryVars: GetSellersQueryQueryVariables = {}
): Promise<SellerFieldsFragment> {
  const sellers = await getSellers(subgraphUrl, {
    sellersFilter: {
      ...queryVars.sellersFilter,
      treasury: treasuryAddress.toLowerCase()
    },
    ...queryVars
  });
  return sellers[0];
}

export async function getSellerByAuthToken(
  subgraphUrl: string,
  tokenId: string,
  tokenType: number,
  queryVars: GetSellersQueryQueryVariables = {}
): Promise<SellerFieldsFragment> {
  const sellers = await getSellers(subgraphUrl, {
    sellersFilter: {
      ...queryVars.sellersFilter,
      authTokenId: tokenId,
      authTokenType: tokenType
    },
    ...queryVars
  });
  return sellers[0];
}

export async function getSellerByAddress(
  subgraphUrl: string,
  address: string,
  queryVars: GetSellersQueryQueryVariables = {}
): Promise<SellerFieldsFragment> {
  const [assistant, admin] = await Promise.all([
    getSellerByAssistant(subgraphUrl, address, queryVars),
    getSellerByAdmin(subgraphUrl, address, queryVars)
  ]);

  return assistant || admin;
}

export async function getDisputeResolverById(
  subgraphUrl: string,
  disputeResolverId: BigNumberish,
  queryVars: SingleDisputeResolverQueryVariables = {}
): Promise<DisputeResolverFieldsFragment> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { disputeResolver } = await sdk.getDisputeResolverByIdQuery({
    disputeResolverId: disputeResolverId.toString(),
    ...queryVars
  });
  return disputeResolver;
}

export async function getDisputeResolvers(
  subgraphUrl: string,
  queryVars: GetDisputeResolversQueryQueryVariables = {}
): Promise<DisputeResolverFieldsFragment[]> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { disputeResolvers = [] } = await sdk.getDisputeResolversQuery(
    queryVars
  );
  return disputeResolvers;
}

export async function getOfferCollections(
  subgraphUrl: string,
  queryVars: GetOfferCollectionsQueryQueryVariables = {}
): Promise<OfferCollectionFieldsFragment[]> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { offerCollections = [] } = await sdk.getOfferCollectionsQuery(
    queryVars
  );
  return offerCollections;
}
