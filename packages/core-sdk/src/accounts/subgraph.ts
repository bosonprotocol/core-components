import { getSubgraphSdk } from "../utils/graphql";
import { SellerFieldsFragment } from "../subgraph";

export async function getSellerByOperator(
  subgraphUrl: string,
  operatorAddress: string,
  fundsTokenAddress?: string
): Promise<SellerFieldsFragment> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { sellers = [] } = await sdk.getSellerByOperatorQuery({
    operator: operatorAddress,
    fundsTokenAddress
  });

  return sellers[0];
}

export async function getSellerByAdmin(
  subgraphUrl: string,
  adminAddress: string,
  fundsTokenAddress?: string
): Promise<SellerFieldsFragment> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { sellers = [] } = await sdk.getSellerByAdminQuery({
    admin: adminAddress,
    fundsTokenAddress
  });

  return sellers[0];
}

export async function getSellerByClerk(
  subgraphUrl: string,
  clerkAddress: string,
  fundsTokenAddress?: string
): Promise<SellerFieldsFragment> {
  const sdk = getSubgraphSdk(subgraphUrl);
  const { sellers = [] } = await sdk.getSellerByClerkQuery({
    clerk: clerkAddress,
    fundsTokenAddress
  });

  return sellers[0];
}

export async function getSellerByAddress(
  subgraphUrl: string,
  address: string,
  fundsTokenAddress?: string
): Promise<SellerFieldsFragment> {
  const [operator, admin, clerk] = await Promise.all([
    getSellerByOperator(subgraphUrl, address, fundsTokenAddress),
    getSellerByAdmin(subgraphUrl, address, fundsTokenAddress),
    getSellerByClerk(subgraphUrl, address, fundsTokenAddress)
  ]);

  return operator || admin || clerk;
}
