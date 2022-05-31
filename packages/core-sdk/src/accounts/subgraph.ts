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
}
`;

export const getSellerByOperatorQuery = `
query GetSellersByOperator($operator: String!) {
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
  operatorAddress: string
): Promise<RawSellerFromSubgraph> {
  const { sellers } = await fetchSubgraph<{ sellers: RawSellerFromSubgraph }>(
    subgraphUrl,
    getSellerByOperatorQuery,
    { operator: operatorAddress }
  );

  return sellers[0];
}

export const getSellerByAdminQuery = `
query GetSellersByAdmin($admin: String!) {
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
  adminAddress: string
): Promise<RawSellerFromSubgraph> {
  const { sellers } = await fetchSubgraph<{ sellers: RawSellerFromSubgraph }>(
    subgraphUrl,
    getSellerByOperatorQuery,
    { admin: adminAddress }
  );

  return sellers[0];
}

export const getSellerByClerkQuery = `
query GetSellersByOperator($clerk: String!) {
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
  clerkAddress: string
): Promise<RawSellerFromSubgraph> {
  const { sellers } = await fetchSubgraph<{ sellers: RawSellerFromSubgraph }>(
    subgraphUrl,
    getSellerByOperatorQuery,
    { clerk: clerkAddress }
  );

  return sellers[0];
}

export async function getSellerByAddress(
  subgraphUrl: string,
  address: string
): Promise<RawSellerFromSubgraph> {
  const [operator, admin, clerk] = await Promise.all([
    getSellerByOperator(subgraphUrl, address),
    getSellerByAdmin(subgraphUrl, address),
    getSellerByClerk(subgraphUrl, address)
  ]);

  return operator || admin || clerk;
}
