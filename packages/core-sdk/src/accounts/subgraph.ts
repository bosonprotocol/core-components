import { getSubgraphSdk } from "../utils/graphql";
import {
  BuyerFieldsFragment,
  GetBuyerByIdQueryQueryVariables,
  SellerFieldsFragment,
  GetSellersQueryQueryVariables,
  GetBuyersQueryQueryVariables,
  GetSellerByIdQueryQueryVariables
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

export async function getSellerByOperator(
  subgraphUrl: string,
  operatorAddress: string,
  queryVars: GetSellersQueryQueryVariables = {}
): Promise<SellerFieldsFragment | undefined> {
  const sellers = await getSellers(subgraphUrl, {
    sellersFilter: {
      ...queryVars.sellersFilter,
      operator: operatorAddress.toLowerCase()
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

export async function getSellerByClerk(
  subgraphUrl: string,
  clerkAddress: string,
  queryVars: GetSellersQueryQueryVariables = {}
): Promise<SellerFieldsFragment> {
  const sellers = await getSellers(subgraphUrl, {
    sellersFilter: {
      ...queryVars.sellersFilter,
      clerk: clerkAddress.toLowerCase()
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

export async function getSellerByAddress(
  subgraphUrl: string,
  address: string,
  queryVars: GetSellersQueryQueryVariables = {}
): Promise<SellerFieldsFragment> {
  const [operator, admin, clerk, treasury] = await Promise.all([
    getSellerByOperator(subgraphUrl, address, queryVars),
    getSellerByAdmin(subgraphUrl, address, queryVars),
    getSellerByClerk(subgraphUrl, address, queryVars),
    getSellerByTreasury(subgraphUrl, address, queryVars)
  ]);

  return operator || admin || clerk || treasury;
}
