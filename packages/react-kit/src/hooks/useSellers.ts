import { accounts, subgraph } from "@bosonprotocol/core-sdk";
import { useCallback } from "react";
import { useQuery } from "react-query";
import { useCoreSDKWithContext } from "./core-sdk/useCoreSdkWithContext";

import { useCurationLists } from "./useCurationLists";

interface Props {
  admin?: string;
  admin_in?: string[];
  assistant?: string;
  clerk?: string;
  treasury?: string;
  id?: string;
  id_in?: string[];
  includeFunds?: boolean;
  enableCurationList?: boolean;
}

export const useIsSellerInCuractionList = (sellerID: string) => {
  return useSellerCurationListFn()(sellerID);
};

export const useSellerCurationListFn = () => {
  const curationLists = useCurationLists();

  const isSellerInCurationList = useCallback(
    (sellerID: string) => {
      if (curationLists?.enableCurationLists && sellerID !== "") {
        if (
          (curationLists?.sellerCurationList || [])?.length > 0 &&
          (curationLists?.sellerCurationList || [])?.indexOf(
            sellerID as string
          ) > -1
        ) {
          return true;
        }
      } else if (!curationLists?.enableCurationLists) {
        return true;
      }

      return false;
    },
    [curationLists]
  );

  return isSellerInCurationList;
};

export function useSellers(
  props: Props = {},
  options: {
    enabled: boolean;
  }
) {
  const enableCurationList =
    props.enableCurationList === undefined ? true : props.enableCurationList;
  const curationLists = useCurationLists();
  const coreSDK = useCoreSDKWithContext();
  const filter = {
    ...(props.admin && { admin: props.admin }),
    ...(props.admin_in && { admin_in: props.admin_in }),
    ...(props.assistant && { assistant: props.assistant }),
    ...(props.clerk && { clerk: props.clerk }),
    ...(props.treasury && { treasury: props.treasury }),
    ...(props.id && { id: props.id }),
    ...(props.id_in && { id_in: props.id_in })
  };
  return useQuery(
    [
      "sellers",
      filter,
      coreSDK.subgraphUrl,
      props.includeFunds,
      curationLists.sellerCurationList
    ],
    async () => {
      return !curationLists.sellerCurationList ||
        curationLists.sellerCurationList?.length > 0
        ? accounts.subgraph.getSellers(coreSDK.subgraphUrl, {
            sellersFilter: {
              ...filter,
              id_in:
                enableCurationList && curationLists.enableCurationLists
                  ? [
                      ...(curationLists.sellerCurationList ?? []),
                      ...(props.id_in ?? [])
                    ]
                  : props.id_in
            },
            sellersOrderBy: subgraph.Seller_OrderBy.SellerId,
            sellersOrderDirection: subgraph.OrderDirection.Asc,
            includeFunds: props.includeFunds
          })
        : [];
    },
    {
      ...options
    }
  );
}
