import { BigNumberish } from "@ethersproject/bignumber";
import { fetchSubgraph } from "../utils/subgraph";
import { RawFundsEntityFromSubgraph } from "./types";

export const fundsEntityFieldsFragment = `
fragment fundsEntityFields on FundsEntity {
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

export const getFundsByAccountIdQuery = `
query GetFundsByAccountIdQuery($accountId: String!) {
  fundsEntities(where: {
    accountId: $accountId
  }) {
    ...fundsEntityFields
  }
}
${fundsEntityFieldsFragment}
`;

export async function getFundsByAccountId(
  subgraphUrl: string,
  accountId: BigNumberish
): Promise<RawFundsEntityFromSubgraph[]> {
  const { fundsEntities = [] } = await fetchSubgraph<{
    fundsEntities: RawFundsEntityFromSubgraph[];
  }>(subgraphUrl, getFundsByAccountIdQuery, { accountId });

  return fundsEntities;
}
