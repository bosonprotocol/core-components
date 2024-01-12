import React from "react";
import {
  InnerDetailViewWithPortal,
  InnerDetailViewWithPortalProps
} from "./InnerDetailViewWithPortal";
import InnerExchangeDetailView, {
  InnerExchangeDetailViewProps
} from "./InnerExchangeDetailView";

export type InnerDetailWithProviderExchangeProps =
  | Omit<InnerExchangeDetailViewProps, "priceSibling">
  | Omit<InnerDetailViewWithPortalProps, "priceSibling">;

export const InnerDetailWithProviderExchange: React.FC<
  InnerDetailWithProviderExchangeProps
> = (props) => {
  const withCTAs = !("children" in props);
  return (
    <>
      {withCTAs ? (
        <InnerExchangeDetailView {...props} />
      ) : (
        <InnerDetailViewWithPortal {...props} />
      )}
    </>
  );
};
