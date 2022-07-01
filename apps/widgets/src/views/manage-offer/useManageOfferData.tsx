import { useState } from "react";
import { subgraph } from "@bosonprotocol/core-sdk";
import { useCoreSDK } from "../../lib/useCoreSDK";
import { useReloadCounter } from "../../lib/useReloadCounter";
import { useAsyncEffect } from "use-async-effect";

export function useManageOfferData(offerId: string) {
  const coreSDK = useCoreSDK();
  const { reload, reloadCounter } = useReloadCounter();
  const [offer, setOffer] = useState<
    | {
        status: "success";
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
          setOffer({ status: "success", offer });
        })
        .catch((e) => {
          if (!isActive()) return;
          setOffer({ status: "error", error: e });
        });
    },
    [offerId, reloadCounter]
  );

  return { offerData: offer, reloadOfferData: reload };
}
