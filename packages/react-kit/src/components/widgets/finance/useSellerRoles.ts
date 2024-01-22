import { gql } from "graphql-request";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useCoreSDKWithContext } from "../../../hooks/core-sdk/useCoreSdkWithContext";
import { fetchSubgraph } from "../../../lib/subgraph/subgraph";
import { useAccount } from "../../../hooks/connection/connection";

function lowerCase(str: string | undefined) {
  return str?.toLowerCase() || "";
}
export interface SellerRolesProps {
  isSeller: boolean;
  isActive: boolean;
  isAdmin: boolean;
  isClerk: boolean;
  isAssistant: boolean;
  isTreasury: boolean;
}
export function useSellerRoles(id: string) {
  const { address } = useAccount();
  const coreSDK = useCoreSDKWithContext();

  const { data } = useQuery(
    ["seller-roles", { id }],
    async () => {
      const result = await fetchSubgraph<{
        sellers: {
          id: string;
          admin: string;
          clerk: string;
          assistant: string;
          treasury: string;
          active: boolean;
        }[];
      }>(
        coreSDK.subgraphUrl,
        gql`
          query GetSellerByID(
            $id: String
          ) {
            sellers(
              where: {
                ${id ? `id: "${id}"` : ""}
              }
            ) {
              id
              admin
              active
              clerk
              assistant
              treasury
            }
          }
        `,
        {
          id
        }
      );
      return result?.sellers[0] ?? null;
    },
    {
      enabled: !!id
    }
  );

  const sellerProps = useMemo(
    (): SellerRolesProps => ({
      isSeller: data !== null,
      isActive: data ? data?.active : false,
      isAdmin: data ? lowerCase(data?.admin) === lowerCase(address) : false,
      isClerk: data ? lowerCase(data?.clerk) === lowerCase(address) : false,
      isAssistant: data
        ? lowerCase(data?.assistant) === lowerCase(address)
        : false,
      isTreasury: data
        ? lowerCase(data?.treasury) === lowerCase(address)
        : false
    }),
    [data, address]
  );

  return { sellerRoles: sellerProps, seller: data };
}
