import { useState } from "react";
import { subgraph } from "@bosonprotocol/core-sdk";
import { useCoreSDK } from "../../lib/useCoreSDK";
import { useReloadToken } from "../../lib/useReloadToken";
import { useAsyncEffect } from "use-async-effect";

export function useManageOfferData(offerId: string) {
  const coreSDK = useCoreSDK();
  const { reload: reloadOffer, reloadToken } = useReloadToken();
  const [offer, setOffer] = useState<
    | {
        status: "loaded";
        offer: subgraph.OfferFieldsFragment;
      }
    | { status: "loading" }
    | { status: "error"; error: Error }
  >({ status: "loading" });

  useAsyncEffect(
    (isActive) => {
      coreSDK
        .getOfferById(offerId)
        .then((offer) => {
          if (!isActive()) return;
          setOffer({ status: "loaded", offer });
        })
        .catch((e) => {
          if (!isActive()) return;
          setOffer({ status: "error", error: e });
        });
    },
    [offerId, reloadToken]
  );

  return { offerData: offer, reloadOfferData: reloadOffer };
}
