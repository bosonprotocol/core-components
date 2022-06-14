import { fetchSubgraph } from "../utils/subgraph";
import { RawSellerFromSubgraph } from "./types";

export const sellerFieldsFragment = `
fragment sellerFields on Seller {
  id
  operator
  admin
  clerk
  treasury
  active
  funds(where: {
    tokenAddress: $fundsTokenAddress
  }) {
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

export const getSellerByOperatorQuery = `
query GetSellersByOperator($operator: String!, $fundsTokenAddress: String) {
  sellers(where: {
    operator: $operator
  }) {
    ...sellerFields
  }
}
${sellerFieldsFragment}
`;

export async function getSellerByOperator(
  subgraphUrl: string,
  operatorAddress: string,
  fundsTokenAddress?: string
): Promise<RawSellerFromSubgraph> {
  const { sellers = [] } = await fetchSubgraph<{
    sellers: RawSellerFromSubgraph[];
  }>(subgraphUrl, getSellerByOperatorQuery, {
    operator: operatorAddress,
    fundsTokenAddress
  });

  return sellers[0];
}

export const getSellerByAdminQuery = `
query GetSellersByAdmin($admin: String!, $fundsToken: String) {
  sellers(where: {
    admin: $admin
  }) {
    ...sellerFields
  }
}
${sellerFieldsFragment}
`;

export async function getSellerByAdmin(
  subgraphUrl: string,
  adminAddress: string,
  fundsTokenAddress?: string
): Promise<RawSellerFromSubgraph> {
  const { sellers = [] } = await fetchSubgraph<{
    sellers: RawSellerFromSubgraph[];
  }>(subgraphUrl, getSellerByAdminQuery, {
    admin: adminAddress,
    fundsTokenAddress
  });

  return sellers[0];
}

export const getSellerByClerkQuery = `
query GetSellersByOperator($clerk: String!, $fundsToken: String) {
  sellers(where: {
    clerk: $clerk
  }) {
    ...sellerFields
  }
}
${sellerFieldsFragment}
`;

export async function getSellerByClerk(
  subgraphUrl: string,
  clerkAddress: string,
  fundsTokenAddress?: string
): Promise<RawSellerFromSubgraph> {
  const { sellers = [] } = await fetchSubgraph<{
    sellers: RawSellerFromSubgraph[];
  }>(subgraphUrl, getSellerByClerkQuery, {
    clerk: clerkAddress,
    fundsTokenAddress
  });

  return sellers[0];
}

export async function getSellerByAddress(
  subgraphUrl: string,
  address: string,
  fundsTokenAddress?: string
): Promise<RawSellerFromSubgraph> {
  const [operator, admin, clerk] = await Promise.all([
    getSellerByOperator(subgraphUrl, address, fundsTokenAddress),
    getSellerByAdmin(subgraphUrl, address, fundsTokenAddress),
    getSellerByClerk(subgraphUrl, address, fundsTokenAddress)
  ]);

  return operator || admin || clerk;
}
