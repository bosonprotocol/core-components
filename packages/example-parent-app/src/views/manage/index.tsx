import { manageOffer } from "@bosonprotocol/widgets-sdk";
import { useRef, useState } from "react";
import { Layout } from "../../lib/components/Layout";
import { PageTitle } from "../../lib/components/PageTitle";
import { CONFIG } from "../../lib/config";
import { OfferSelect } from "./OfferSelect";
import { offers } from "@bosonprotocol/core-sdk";
import { Col, Form, Row } from "react-bootstrap";
import styled from "styled-components";
import { useEffect } from "react";
import { assert } from "../../lib/assert";

const Root = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  min-width: 624px;
  border-top: 1px solid white;
`;

const WidgetContainer = styled.div`
  margin-top: 16px;
  margin-bottom: 64px;
`;

export function Manage() {
  const [offer, setOffer] = useState<offers.RawOfferFromSubgraph>();
  const widgetRef = useRef<HTMLDivElement>(null);
  const [selectedExchangeId, setSelectedExchangeId] = useState<string>();

  useEffect(() => {
    assert(widgetRef.current);

    if (offer) {
      const el = document.createElement("div");
      widgetRef.current.appendChild(el);
      manageOffer(
        offer.id,
        {
          ...CONFIG,
          widgetsUrl: "http://localhost:3000"
        },
        el,
        {
          forceBuyerView: false,
          exchangeId: selectedExchangeId
        }
      );

      return () => el.remove();
    }

    return;
  }, [offer, selectedExchangeId]);
  return (
    <Layout>
      <PageTitle>Manage Offer</PageTitle>
      <OfferSelect
        onReset={() => setOffer(undefined)}
        onOfferSelect={(offer) => setOffer(offer)}
      />
      {offer && (
        <Root>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Offer ID</Form.Label>
              <Form.Control value={offer.id} disabled placeholder="..." />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={offer.metadata?.name}
                disabled
                placeholder="..."
              />
            </Form.Group>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={offer.metadata?.description}
              disabled
              placeholder="..."
            />
          </Form.Group>
          <div>
            <Form.Label>Exchange ID</Form.Label>
            <Form.Select
              value=""
              onChange={(e) => setSelectedExchangeId(e.target.value)}
              disabled={offer.exchanges.length === 0}
            >
              {offer.exchanges.length === 0 ? (
                <option value="">No exchanges found for this offer</option>
              ) : (
                <>
                  <option value="">
                    {offer.exchanges.length === 1
                      ? `--- 1 Exchange found ---`
                      : `--- ${offer.exchanges.length} Exchanges found ---`}
                  </option>
                  {offer.exchanges.map((exchange) => (
                    <option key={exchange.id} value={exchange.id}>
                      {exchange.id}
                    </option>
                  ))}
                </>
              )}
            </Form.Select>
          </div>
        </Root>
      )}
      <WidgetContainer ref={widgetRef} />
    </Layout>
  );
}
