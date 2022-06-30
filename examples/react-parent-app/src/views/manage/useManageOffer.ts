/* eslint-disable @typescript-eslint/no-explicit-any */
import { manageOffer } from "@bosonprotocol/widgets-sdk";
import { CONFIG } from "../../lib/config";
import { useEffect } from "react";
import { subgraph } from "@bosonprotocol/core-sdk";

import { assert } from "../../lib/assert";

interface Props {
  ref: React.MutableRefObject<any>;
  offer: subgraph.OfferFieldsFragment | undefined;
  selectedExchangeId: string;
  forceBuyerView: boolean;
}

export const useManageOffer = ({
  ref,
  offer,
  selectedExchangeId,
  forceBuyerView
}: Props) => {
  useEffect(() => {
    assert(ref.current);

    if (offer && !selectedExchangeId) {
      const el = document.createElement("div");
      ref.current.appendChild(el);
      manageOffer(
        offer.id,
        {
          ...CONFIG,
          widgetsUrl: "http://localhost:3000"
        },
        el,
        {
          forceBuyerView
        }
      );

      return () => el.remove();
    }

    return;
  }, [ref, offer, selectedExchangeId, forceBuyerView]);
};
