/* eslint-disable @typescript-eslint/no-explicit-any */
import { manageExchange } from "@bosonprotocol/widgets-sdk";
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

export const useManageExchange = ({
  ref,
  offer,
  selectedExchangeId,
  forceBuyerView
}: Props) => {
  useEffect(() => {
    assert(ref.current);

    if (selectedExchangeId) {
      const el = document.createElement("div");
      ref.current.appendChild(el);
      manageExchange(
        selectedExchangeId,
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
  }, [selectedExchangeId, offer, forceBuyerView, ref]);
};
