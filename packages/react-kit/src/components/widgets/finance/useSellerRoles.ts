import { useMemo } from "react";
import { useQuery } from "react-query";
import { useCoreSDKWithContext } from "../../../hooks/core-sdk/useCoreSdkWithContext";
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
    ["seller-roles", id, coreSDK.uuid],
    async () => {
      const seller = await coreSDK.getSellerById(id);

      return seller ?? null;
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
  console.log({ sellerProps, data });
  return { sellerRoles: sellerProps, seller: data };
}
