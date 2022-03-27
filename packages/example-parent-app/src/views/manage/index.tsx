import { manageOffer } from "@bosonprotocol/widgets-sdk";
import { useState } from "react";
import { Layout } from "../../lib/components/Layout";
import { PageTitle } from "../../lib/components/PageTitle";
import { CONFIG } from "../../lib/config";
import { OfferSelect } from "./OfferSelect";
import { offers } from "@bosonprotocol/core-sdk";
import { Form } from "react-bootstrap";
import styled from "styled-components";

const Root = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  min-width: 624px;
  border-top: 1px solid white;
`;

export function Manage() {
  const [offer, setOffer] = useState<offers.RawOfferFromSubgraph>();

  return (
    <Layout>
      <PageTitle>Manage Offer</PageTitle>
      <OfferSelect
        onReset={() => setOffer(undefined)}
        onOfferSelect={(offer) => {
          setOffer(offer);
          manageOffer(offer.id, CONFIG);
        }}
      />
      {offer && (
        <Root>
          <Form.Group className="mb-3">
            <Form.Label>Offer ID</Form.Label>
            <Form.Control value={offer.id} disabled placeholder="Enter email" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={offer.metadata?.title}
              disabled
              placeholder="Password"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={offer.metadata?.description}
              disabled
              placeholder="Password"
            />
          </Form.Group>
        </Root>
      )}
    </Layout>
  );
}
