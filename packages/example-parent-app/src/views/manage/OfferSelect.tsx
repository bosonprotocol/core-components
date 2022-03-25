import { useState } from "react";
import { Form } from "react-bootstrap";
import { offers as offersApi, getDefaultConfig } from "@bosonprotocol/core-sdk";
import { CONFIG } from "../../lib/config";
import styled from "styled-components";
import { isAddress } from "@ethersproject/address";

const OfferSelection = styled.div`
  display: flex;
`;

const InputContainer = styled.div`
  width: 300px;
  & + & {
    margin-left: 1.5rem;
  }
`;

interface Props {
  onOfferSelect(offer: offersApi.RawOfferFromSubgraph): void;
  onReset(): void;
}

export function OfferSelect({ onOfferSelect, onReset }: Props) {
  const [offers, setOffers] = useState<offersApi.RawOfferFromSubgraph[]>([]);
  const [sellerAddress, setSellerAddress] = useState("");

  function retrieveOffers(sellerAddress: string) {
    if (!sellerAddress) return;

    const { subgraphUrl } = getDefaultConfig({
      chainId: CONFIG.chainId
    });

    offersApi.subgraph
      .getAllOffersOfSeller(subgraphUrl, sellerAddress)
      .then(setOffers)
      .catch(console.log);
  }

  function onSellerAddressChange(address: string) {
    onReset();
    setSellerAddress(address);

    if (isAddress(address)) {
      retrieveOffers(address);
    } else {
      setOffers([]);
    }
  }

  function onOfferIdSelect(offerId: string) {
    if (!offerId) return;
    const offer = offers.find((ofr) => ofr.id === offerId);

    if (!offer) return;
    onOfferSelect(offer);
  }

  return (
    <OfferSelection>
      <InputContainer>
        <Form.Label>Seller Address</Form.Label>
        <Form.Control
          value={sellerAddress}
          onChange={(e) => onSellerAddressChange(e.target.value)}
          name="title"
          type="text"
          placeholder="..."
        />
      </InputContainer>
      <InputContainer>
        <Form.Label>Offer ID</Form.Label>
        <Form.Select
          value=""
          onChange={(e) => onOfferIdSelect(e.target.value)}
          disabled={offers.length === 0}
        >
          {offers.length === 0 ? (
            <option value="">No offers found for given seller</option>
          ) : (
            <>
              <option value="">
                {offers.length === 1
                  ? `--- 1 Offer found ---`
                  : `--- ${offers.length} Offers found ---`}
              </option>
              {offers.map((offer) => (
                <option key={offer.id} value={offer.id}>
                  {offer.id} - {offer.metadata?.title}
                </option>
              ))}
            </>
          )}
        </Form.Select>
      </InputContainer>
    </OfferSelection>
  );
}
