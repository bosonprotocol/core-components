import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { offers as offersApi, getDefaultConfig } from "@bosonprotocol/core-sdk";
import { manageOffer } from "@bosonprotocol/widgets-sdk";
import { CONFIG } from "../../lib/config";

export function Manage() {
  const [offers, setOffers] = useState<
    offersApi.RawOfferFromSubgraph[] | "uninitialized"
  >("uninitialized");

  const [sellerAddress, setSellerAddress] = useState("");

  function retrieveOffers() {
    if (!sellerAddress) return;

    const { subgraphUrl } = getDefaultConfig({
      chainId: CONFIG.chainId
    });

    offersApi.subgraph
      .getAllOffersOfSeller(subgraphUrl, sellerAddress)
      .then(setOffers)
      .catch(console.log);
  }

  return (
    <div
      style={{
        maxWidth: 600
      }}
    >
      <Form.Group className="mb-3">
        <Form.Label>Seller Address</Form.Label>
        <Form.Control
          value={sellerAddress}
          onChange={(e) => setSellerAddress(e.target.value)}
          name="title"
          type="text"
          placeholder="..."
        />
      </Form.Group>
      <Button onClick={retrieveOffers}>Receive offers</Button>
      {offers !== "uninitialized" && (
        <>
          <hr />
          {offers.length === 0 && (
            <h3>seller does not have any created offers</h3>
          )}
          {offers.length > 0 &&
            offers.map((offer) => (
              <Button
                key={offer.id}
                style={{
                  width: 200,
                  display: "block",
                  margin: 4
                }}
                onClick={() => manageOffer(offer.id, CONFIG)}
              >
                Manage offer {offer.id}
              </Button>
            ))}
        </>
      )}
    </div>
  );
}
