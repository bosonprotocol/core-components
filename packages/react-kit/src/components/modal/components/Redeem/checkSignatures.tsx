import * as Sentry from "@sentry/browser";
import React from "react";
import { subgraph } from "@bosonprotocol/core-sdk";
import { ethers } from "ethers";
import styled from "styled-components";
import { isTruthy } from "@bosonprotocol/utils";
const UlWithWordBreak = styled.ul`
  * > {
    word-break: break-word;
  }
`;
export const checkSignatures = ({
  doFetchSellersFromSellerIds,
  parentOrigin,
  sellerIds,
  signatures,
  sellersFromSellerIds,
  areSignaturesMandatory
}: {
  parentOrigin?: string | null;
  sellerIds?: string[];
  signatures?: string[] | undefined | null;
  doFetchSellersFromSellerIds: boolean;
  sellersFromSellerIds:
    | (subgraph.SellerFieldsFragment & {
        lensOwner?: string | null | undefined;
      })[]
    | undefined;
  areSignaturesMandatory: boolean;
}) => {
  try {
    if (areSignaturesMandatory && !sellerIds) {
      return (
        <p>
          SellerIds must be defined as these are defined postDeliveryInfoUrl,
          deliveryInfoHandler, redemptionSubmittedHandler,
          redemptionConfirmedHandler{" "}
        </p>
      );
    }
    if (
      sellerIds?.length &&
      areSignaturesMandatory &&
      (!signatures || signatures?.filter(isTruthy).length !== sellerIds.length)
    ) {
      return (
        <p>
          Please provide a list of signatures of the message{" "}
          {JSON.stringify({ origin: "<parentWindowOrigin>" })} for each seller
          in sellerIds list
        </p>
      );
    }
    if (
      doFetchSellersFromSellerIds &&
      (!sellersFromSellerIds ||
        sellersFromSellerIds.length !== sellerIds?.length)
    ) {
      return (
        <p>
          Could not retrieve sellers from the specified sellerIds{" "}
          {sellerIds?.join(",")}
        </p>
      );
    }
    const originMessage = JSON.stringify({ origin: parentOrigin });
    const firstIndexSignatureThatDoesntMatch = sellersFromSellerIds?.findIndex(
      ({ assistant }, index) => {
        if (!signatures?.[index]) {
          return true;
        }
        const signerAddr = ethers.utils
          .verifyMessage(originMessage, signatures[index])
          .toLowerCase();

        if (signerAddr.toLowerCase() !== assistant.toLowerCase()) {
          return true;
        }
        return false;
      }
    );
    if (
      firstIndexSignatureThatDoesntMatch !== undefined &&
      firstIndexSignatureThatDoesntMatch !== -1 &&
      sellersFromSellerIds &&
      signatures
    ) {
      return (
        <div>
          <p>Signature does not match.</p>
          <UlWithWordBreak>
            <li>Signatures: {signatures}</li>
            <li>
              Seller assistant address is{" "}
              {sellersFromSellerIds[
                firstIndexSignatureThatDoesntMatch
              ]?.assistant?.toLowerCase()}
            </li>
            <li>
              Address that signed the message:{" "}
              {signatures
                ? ethers.utils
                    .verifyMessage(
                      originMessage,
                      signatures[firstIndexSignatureThatDoesntMatch]
                    )
                    .toLowerCase()
                : "(no signatures)"}
            </li>
            <li>
              Received signature for this seller:{" "}
              {signatures?.[firstIndexSignatureThatDoesntMatch]}
            </li>
            <li>Message used to verify signature: {originMessage}</li>
          </UlWithWordBreak>
        </div>
      );
    }
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
    return (
      <p>
        Something went wrong: {error instanceof Error && <b>{error.message}</b>}
      </p>
    );
  }
};
