import React from "react";
import { getURLParams } from "./lib/parseUrlParams";

const CreateOffer = React.lazy(() => import("./views/create-offer"));
const ManageOffer = React.lazy(() => import("./views/manage-offer"));
const ManageExchange = React.lazy(() => import("./views/manage-exchange"));

export function App() {
  const urlParams = getURLParams();

  if (urlParams.offerId) return <ManageOffer />;
  if (urlParams.exchangeId) return <ManageExchange />;
  if (urlParams.disputeId) return <div>dispute widget</div>;

  return <CreateOffer />;
}
