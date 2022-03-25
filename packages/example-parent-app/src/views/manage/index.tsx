import { manageOffer } from "@bosonprotocol/widgets-sdk";
import { Layout } from "../../lib/components/Layout";
import { PageTitle } from "../../lib/components/PageTitle";
import { CONFIG } from "../../lib/config";
import { OfferSelect } from "./OfferSelect";

export function Manage() {
  return (
    <Layout>
      <PageTitle>Manage Offer</PageTitle>
      <OfferSelect onOfferSelect={(offer) => manageOffer(offer.id, CONFIG)} />
    </Layout>
  );
}
