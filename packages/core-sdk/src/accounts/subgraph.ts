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
