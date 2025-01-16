import { CoreSDK, subgraph } from "@bosonprotocol/core-sdk";
import { gql } from "graphql-request";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { AuthTokenType } from "..";
import { getLensTokenIdDecimal } from "../lib/lens/profile";
import { fetchSubgraph } from "../lib/subgraph/subgraph";
import { useCoreSDKWithContext } from "./core-sdk/useCoreSdkWithContext";
import { SellerFieldsFragment } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { useAccount } from "./connection/connection";
import { useErc721OwnerOf } from "./contracts/erc721/useErc721OwnerOf";
import { useConfigContext } from "../components/config/ConfigContext";
import { isTruthy } from "../types/helpers";

interface Props {
  address?: string;
  sellerIds?: string[];
  lensTokenId?: string;
  enabled?: boolean;
}

const getSellersByIds =
  (coreSDK: CoreSDK) =>
  (
    sellerIds: string[],
    isSellerId: boolean,
    { enabled }: Pick<Props, "enabled">
  ) => {
    const resultSellerByIds = useQuery(
      ["seller-by-ids", { sellerIds }],
      async () => {
        const result = await fetchSubgraph<{
          sellers: {
            authTokenId: string;
            authTokenType: number;
            admin: string;
            clerk: string;
            treasury: string;
            assistant: string;
            id: string;
            voucherCloneAddress: string;
            active: boolean;
            sellerId: string;
            metadata: SellerFieldsFragment["metadata"];
          }[];
        }>(
          coreSDK.subgraphUrl,
          gql`
            query GetSellerBySellerId($sellerIds: [String]) {
              sellers(where: { sellerId_in: $sellerIds }) {
                authTokenId
                authTokenType
                admin
                clerk
                treasury
                assistant
                id
                voucherCloneAddress
                active
                sellerId
                metadata {
                  id
                  type
                  createdAt
                  name
                  description
                  legalTradingName
                  kind
                  website
                  images {
                    id
                    url
                    tag
                    type
                    width
                    height
                  }
                  contactLinks {
                    id
                    url
                    tag
                  }
                  contactPreference
                  socialLinks {
                    id
                    url
                    tag
                  }
                }
              }
            }
          `,
          { sellerIds }
        );
        return result.sellers;
      },
      {
        enabled: isSellerId && enabled
      }
    );
    return resultSellerByIds;
  };

/**
 * This hook returns the current seller or sellers in a list. It will return more than one
 * seller if you have more than one Lens profile and you had sent your Lens NFT that
 * identifies your profile to another user.
 * @param arg0 -
 * @returns
 */
export function useCurrentSellers(
  { address, sellerIds, lensTokenId, enabled }: Props = { enabled: true }
) {
  const coreSDK = useCoreSDKWithContext();
  const fetchSellers = getSellersByIds(coreSDK);
  const { address: loggedInUserAddress } = useAccount();
  const sellerAddress: string | string[] | null | undefined =
    address || sellerIds || lensTokenId || loggedInUserAddress || null;
  const sellerAddressType = useMemo(() => {
    if (sellerAddress) {
      if (address) {
        return "ADDRESS";
      }
      if (sellerIds) {
        return "SELLER_IDS";
      }
      if (lensTokenId) {
        return "LENS_TOKEN_ID";
      }
      return "ADDRESS";
    }
    return null;
  }, [address, sellerAddress, sellerIds, lensTokenId]);

  const enableResultByAddress =
    !!sellerAddress && sellerAddressType === "ADDRESS";
  const resultByAddress = useQuery(
    ["current-seller-data-by-address", { address: sellerAddress }],
    async () => {
      if (!sellerAddress || typeof sellerAddress !== "string") {
        return null;
      }
      const sellers = await coreSDK.getSellersByAddress(sellerAddress);

      const rolesWithSameAddress = sellers
        .flatMap((seller) => [
          { admin: seller.admin },
          { clerk: seller.clerk },
          { treasury: seller.treasury },
          { assistant: seller.assistant }
        ])
        .filter((role) => {
          return (
            ((Object.values(role)[0] as string) || "").toLowerCase() ===
            sellerAddress.toLowerCase()
          );
        })
        .map(
          (role) =>
            Object.keys(role)[0] as "admin" | "clerk" | "treasury" | "assistant"
        );
      const isLensSeller = sellers.find(
        (seller) => seller.authTokenType === AuthTokenType.LENS
      );
      return {
        sellers,
        sellerType: isLensSeller
          ? Array.from(new Set(["admin", ...rolesWithSameAddress]).values())
          : rolesWithSameAddress
      };
    },
    {
      enabled: enableResultByAddress && enabled
    }
  );
  const enableResultById =
    !!sellerAddress && sellerAddressType === "SELLER_IDS";
  const { data: sellers } = fetchSellers(
    Array.isArray(sellerAddress) ? sellerAddress : [],
    enableResultById,
    { enabled }
  );

  const resultById = useQuery(
    ["current-seller-data-by-id", { sellerId: sellerAddress }],
    async () => {
      return sellers?.map((seller) => {
        const allProps = {
          admin: seller?.admin || null,
          clerk: seller?.clerk || null,
          assistant: seller?.assistant || null,
          treasury: seller?.treasury || null
        };
        return Object.fromEntries(
          Object.entries(allProps).filter(([, value]) => value !== null)
        );
      });
    },
    {
      enabled: enableResultById && enabled
    }
  );

  const decimalLensTokenId = lensTokenId
    ? getLensTokenIdDecimal(lensTokenId)?.toString()
    : null;
  const enableResultLensId =
    !!decimalLensTokenId && sellerAddressType === "LENS_TOKEN_ID";
  const resultByLensId = useQuery(
    [
      "current-seller-data-by-lens-id",
      { authTokenId: decimalLensTokenId, authTokenType: AuthTokenType.LENS }
    ],
    async () => {
      const result = await fetchSubgraph<{
        sellers: {
          sellerId: string;
          admin: string;
          clerk: string;
          assistant: string;
          treasury: string;
        }[];
      }>(
        coreSDK.subgraphUrl,
        gql`
          query GetSellerByLensId($authTokenId: String, $authTokenType: Int) {
            sellers(
              where: {
                authTokenId: $authTokenId
                authTokenType: $authTokenType
              }
            ) {
              sellerId
              admin
              clerk
              assistant
              treasury
            }
          }
        `,
        { authTokenId: decimalLensTokenId, authTokenType: AuthTokenType.LENS }
      );
      const allProps = {
        sellerId: result?.sellers[0]?.sellerId || null,
        admin: result?.sellers[0]?.admin || null,
        clerk: result?.sellers[0]?.clerk || null,
        assistant: result?.sellers[0]?.assistant || null,
        treasury: result?.sellers[0]?.treasury || null
      };
      return Object.fromEntries(
        Object.entries(allProps).filter(([, value]) => value !== null)
      );
    },
    {
      enabled: enableResultLensId && enabled
    }
  );

  const sellerType: string[] | string[][] = resultById?.data
    ? resultById.data.map((d) => Object.keys(d))
    : resultByLensId?.data
      ? Object.keys(resultByLensId.data)
      : resultByAddress?.data?.sellerType || [];

  const sellerIdsToQuery: string[] =
    sellerAddressType === "SELLER_IDS"
      ? (sellerAddress as string[])
      : sellerAddressType === "LENS_TOKEN_ID" && resultByLensId?.data?.sellerId
        ? [resultByLensId?.data.sellerId]
        : [];
  const enableSellerById = !!sellerIdsToQuery?.length;
  const { data: sellers2, refetch: refetchFetchSellers } = fetchSellers(
    sellerIdsToQuery,
    enableSellerById,
    { enabled }
  );
  const sellersById = useQuery(
    ["current-seller-by-id", { sellerIds: sellerIdsToQuery, sellers2 }],
    async () => {
      return sellers2?.map((currentSeller) => {
        const currentSellerRoles = {
          admin: currentSeller?.admin || null,
          clerk: currentSeller?.clerk || null,
          assistant: currentSeller?.assistant || null,
          treasury: currentSeller?.treasury || null
        };
        const currentSellerRolesWithoutNull = Object.fromEntries(
          Object.entries(currentSellerRoles).filter(
            ([, value]) => value !== null
          )
        );

        return {
          ...currentSeller,
          sellerAddress:
            (currentSellerRolesWithoutNull &&
              Object.values(currentSellerRolesWithoutNull)[0]) ??
            null
        };
      });
    },
    {
      enabled: enableSellerById && enabled
    }
  );
  const sellerValues: (subgraph.SellerFieldsFragment & {
    lensOwner?: undefined | string | null;
  })[] = useMemo(
    () =>
      (sellerAddressType === "ADDRESS"
        ? resultByAddress.data?.sellers || []
        : (sellersById?.data as unknown as subgraph.SellerFieldsFragment[]) ||
          []
      ).filter((value) => !!value),

    [resultByAddress.data?.sellers, sellerAddressType, sellersById?.data]
  );
  const profileIds = useMemo(
    () =>
      sellerValues
        .map((seller) => {
          if (Number(seller?.authTokenId)) {
            return seller?.authTokenId;
          }
          return null;
        })
        .filter(isTruthy),
    [sellerValues]
  );
  const enableResultLens =
    !!sellerAddress &&
    !!sellerValues &&
    !!sellerAddressType &&
    !!profileIds.length;

  const { config } = useConfigContext();
  const resultLens = useErc721OwnerOf(
    {
      contractAddress: config.lens?.LENS_HUB_CONTRACT,
      tokenIds: profileIds
    },
    {
      enabled: enableResultLens && enabled,
      coreSDK
    }
  );
  const lensOwners: (string | null)[] = useMemo(() => {
    return resultLens?.data ?? [];
  }, [resultLens?.data]);
  sellerValues.forEach((seller, index) => {
    const owner = resultLens.data?.[index];
    if (owner) {
      seller.lensOwner = owner;
    } else {
      seller.lensOwner = null;
    }
  });
  const sellerIdsToReturn = useMemo(() => {
    return (
      resultByAddress.data
        ? resultByAddress.data.sellers.map((seller) => seller.id)
        : sellerAddressType === "SELLER_IDS"
          ? Array.isArray(sellerAddress)
            ? sellerAddress
            : [sellerAddress]
          : []
    ).filter((sellerId) => !!sellerId) as string[];
  }, [resultByAddress.data, sellerAddress, sellerAddressType]);
  return {
    isSuccess:
      resultById?.isSuccess ||
      resultByAddress?.isSuccess ||
      resultByLensId?.isSuccess ||
      sellersById?.isSuccess ||
      resultLens?.isSuccess,
    isLoading:
      resultById?.isLoading ||
      resultByAddress?.isLoading ||
      resultByLensId?.isLoading ||
      sellersById?.isLoading ||
      resultLens?.isLoading,
    isRefetching:
      resultById?.isRefetching ||
      resultByAddress?.isRefetching ||
      resultByLensId?.isRefetching ||
      sellersById?.isRefetching ||
      resultLens?.isRefetching,
    isFetched:
      resultById?.isFetched ||
      resultByAddress?.isFetched ||
      resultByLensId?.isFetched ||
      sellersById?.isFetched ||
      resultLens?.isFetched,
    isFetching:
      resultById?.isFetching ||
      resultByAddress?.isFetching ||
      resultByLensId?.isFetching ||
      sellersById?.isFetching ||
      resultLens?.isFetching,
    isError:
      resultById?.isError ||
      resultByAddress?.isError ||
      resultByLensId?.isError ||
      sellersById?.isError ||
      resultLens?.isError,
    sellerIds: sellerIdsToReturn,
    sellerType,
    sellers: sellerValues,
    lensOwners,
    refetch: async () => {
      enableResultByAddress && resultByAddress.refetch();
      enableResultById && resultById.refetch();
      enableResultLensId && resultByLensId.refetch();
      enableSellerById && refetchFetchSellers();
      enableSellerById && sellersById.refetch();
      enableResultLens && resultLens.refetch();
    }
  };
}
