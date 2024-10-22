import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import OfferPolicyDetails from "../../../offerPolicy/OfferPolicyDetails";
import { subgraph } from "@bosonprotocol/core-sdk";
import ContractualAgreement from "../../../contractualAgreement/ContractualAgreement";
import License from "../../../license/License";
import Confirmation from "../Redeem/Confirmation/Confirmation";
import { useModal } from "../../useModal";
import RedeemForm from "../Redeem/RedeemForm/RedeemForm";
import { ExchangePolicyOverview } from "./exchangePolicyOverview/ExchangePolicyOverview";
import { GenericModalProps } from "../../ModalContext";
const Wrapper = styled.div``;

enum ActiveStep {
  EXCHANGE_POLICY_OVERVIEW,
  EXCHANGE_POLICY,
  CONTRACTUAL_AGREEMENT,
  LICENSE_AGREEMENT,
  REDEEM_FORM,
  REDEEM_FORM_CONFIRMATION,
  REDEEM_SUCESS
}
export type RequestShipmentModalProps = {
  offer: subgraph.OfferFieldsFragment;
  exchange: subgraph.ExchangeFieldsFragment;
};
export const RequestShipmentModal = ({
  offer,
  exchange
}: RequestShipmentModalProps) => {
  const { hideModal, updateProps, store } = useModal();
  useEffect(() => {
    updateProps<"REQUEST_SHIPMENT">({
      ...store,
      modalProps: {
        ...store.modalProps,
        title: "Request shipment"
      } as GenericModalProps<"REQUEST_SHIPMENT">,
      modalSize: "auto",
      modalMaxWidth: {
        xs: "550px"
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [step, setStep] = useState<ActiveStep>(
    ActiveStep.EXCHANGE_POLICY_OVERVIEW
  );
  const offerId = offer.id;
  const offerName = exchange?.offer?.metadata?.name || "";
  const buyerId = exchange?.buyer.id || "";
  const sellerId = exchange?.seller.id || "";
  const sellerAddress = exchange?.seller?.assistant;
  const isValid = true; // TODO: change
  return (
    <Wrapper>
      {step === ActiveStep.EXCHANGE_POLICY_OVERVIEW ? (
        <ExchangePolicyOverview
          onPolicyClick={() => setStep(ActiveStep.EXCHANGE_POLICY)}
          onNextClick={() => setStep(ActiveStep.REDEEM_FORM)}
        />
      ) : step === ActiveStep.EXCHANGE_POLICY ? (
        <OfferPolicyDetails
          offer={offer}
          onContractualAgreementClick={() =>
            setStep(ActiveStep.CONTRACTUAL_AGREEMENT)
          }
          onLicenseAgreementClick={() => setStep(ActiveStep.LICENSE_AGREEMENT)}
        />
      ) : step === ActiveStep.CONTRACTUAL_AGREEMENT ? (
        <ContractualAgreement offerId={offerId} offerData={offer} />
      ) : step === ActiveStep.LICENSE_AGREEMENT ? (
        <License offerId={offer.id} offerData={offer} />
      ) : step === ActiveStep.REDEEM_FORM ? (
        <RedeemForm
          offer={offer}
          isValid={isValid}
          onNextClick={() => setStep(ActiveStep.REDEEM_FORM_CONFIRMATION)}
          onBackClick={() => setStep(ActiveStep.EXCHANGE_POLICY_OVERVIEW)}
          setConnectedWalletAddress={() => {
            // TODO:
          }}
        />
      ) : step === ActiveStep.REDEEM_FORM_CONFIRMATION ? (
        <Confirmation
          exchangeId={exchange.id}
          offerId={offerId}
          offerName={offerName}
          buyerId={buyerId}
          sellerId={sellerId}
          sellerAddress={sellerAddress}
          onBackClick={() => setStep(ActiveStep.REDEEM_FORM)}
          onSuccess={() => setStep(ActiveStep.REDEEM_SUCESS)}
          hideModal={hideModal}
        />
      ) : step === ActiveStep.REDEEM_SUCESS ? (
        <p>REDEEM_SUCESS</p>
      ) : (
        <p>Wrong step...something went wrong</p>
      )}
    </Wrapper>
  );
};
