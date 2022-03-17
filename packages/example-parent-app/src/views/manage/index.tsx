import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useCoreSDK } from "../../lib/useCoreSDK";
import { offers } from "@bosonprotocol/core-sdk";
import { manageOffer } from "@bosonprotocol/widgets-sdk";

export function Manage() {
  const [offers, setOffers] = useState<
    offers.RawOfferFromSubgraph[] | "uninitialized"
  >("uninitialized");

  const [sellerAddress, setSellerAddress] = useState("");

  const coreSDK = useCoreSDK();

  function retreiveOffers() {
    if (!sellerAddress) return;
    coreSDK?.getAllOffersOfSeller(sellerAddress).then(setOffers);
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
      <Button onClick={retreiveOffers}>Receive offers</Button>
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
                onClick={() => manageOffer(offer.id)}
              >
                Manage offer {offer.id}
              </Button>
            ))}
        </>
      )}
    </div>
  );
}
