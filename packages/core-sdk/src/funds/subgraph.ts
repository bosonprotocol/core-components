import { BigNumberish } from "@ethersproject/bignumber";
import { getSubgraphSdk } from "../utils/graphql";
import { FundsEntityFieldsFragment } from "../subgraph";

export async function getFundsByAccountId(
  subgraphUrl: string,
  accountId: BigNumberish
): Promise<FundsEntityFieldsFragment[]> {
  const subgraphSdk = getSubgraphSdk(subgraphUrl);

  const { fundsEntities = [] } = await subgraphSdk.getFundsByAccountIdQuery({
    accountId: accountId.toString()
  });

  return fundsEntities;
}
