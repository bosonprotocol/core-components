import React, { useEffect, useMemo, useRef, useState } from "react";
import { styled } from "styled-components";
import OfferPolicyDetails from "../../../offerPolicy/OfferPolicyDetails";
import ContractualAgreement from "../../../contractualAgreement/ContractualAgreement";
import License from "../../../license/License";
import * as Yup from "yup";
import { Confirmation } from "../Redeem/Confirmation/Confirmation";
import { useModal } from "../../useModal";
import RedeemForm from "../Redeem/RedeemForm/RedeemForm";
import { ExchangePolicyOverview } from "./exchangePolicyOverview/ExchangePolicyOverview";
import { GenericModalProps } from "../../ModalContext";
import { useAccount } from "../../../../hooks";
import {
  ContactPreference,
  getRedeemFormValidationSchema
} from "../Redeem/const";
import { getHasBuyerTransferInfos } from "../../../../lib/offer/filter";
import { BuyerTransferInfo } from "../../../../lib/bundle/const";
import { Form, Formik, FormikProps } from "formik";
import { FormModel } from "../Redeem/RedeemFormModel";
import { useRedemptionContext } from "../../../widgets/redemption/provider/RedemptionContext";
import { mockedDeliveryAddress } from "../../../widgets/redemption/const";
import { checkSignatures } from "../Redeem/checkSignatures";
import Loading from "../../../ui/loading/LoadingWrapper";
import { useCurrentSellers } from "../../../../hooks/useCurrentSellers";
import { RequestShipmentSuccess } from "./exchangePolicyOverview/RequestShipmentSuccess";
import { subgraph } from "@bosonprotocol/core-sdk";

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
  exchange: subgraph.ExchangeFieldsFragment;
  forcedAccount?: string;
  parentOrigin?: string | null;
  signatures?: string[] | null;
};
const initialStep = ActiveStep.EXCHANGE_POLICY_OVERVIEW;
export const RequestShipmentModal = ({
  exchange,
  parentOrigin,
  signatures,
  forcedAccount
}: RequestShipmentModalProps) => {
  const { offer } = exchange;
  const offerId = offer.id;
  const offerName = exchange?.offer?.metadata?.name || "";
  const buyerId = exchange?.buyer.id || "";
  const sellerId = exchange?.seller.id || "";
  const sellerAddress = exchange?.seller?.assistant;
  const emailPreference =
    exchange?.seller.metadata?.contactPreference ===
    ContactPreference.XMTP_AND_EMAIL;
  const requestBuyerAddress = exchange?.offer
    ? getHasBuyerTransferInfos(exchange.offer, [
        BuyerTransferInfo.walletAddress
      ])
    : false;
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
  const [step, setStep] = useState<ActiveStep>(initialStep);
  const { address } = useAccount();
  useEffect(() => {
    // if the user disconnects their wallet amid redeem, reset current flow
    if (!address && step !== initialStep) {
      setStep(initialStep);
    }
  }, [address, step]);
  const validationSchema = useMemo(() => {
    return getRedeemFormValidationSchema({
      emailPreference,
      requestBuyerAddress
    });
  }, [emailPreference, requestBuyerAddress]);
  type FormType = Yup.InferType<typeof validationSchema>;
  const formRef = useRef<FormikProps<FormType> | null>(null);

  useEffect(() => {
    // TODO: this should not be necessary as validateOnMount should handle that
    if (formRef.current) {
      formRef.current.validateForm();
    }
  }, [step]);
  const {
    deliveryInfo: initialDeliveryInfo,
    postDeliveryInfoUrl,
    deliveryInfoHandler,
    redemptionConfirmedHandler,
    redemptionSubmittedHandler
  } = useRedemptionContext();
  const doFetchSellersFromSellerIds = !!sellerId;
  const sellerIds = useMemo(() => [sellerId], [sellerId]);
  const {
    sellers: sellersFromSellerIds,
    isLoading: areSellersFromSellerIdsLoading
  } = useCurrentSellers({
    sellerIds,
    enabled: doFetchSellersFromSellerIds
  });
  if (!address) {
    return (
      <>
        <p>Please connect your account</p>
        {forcedAccount && <p>(expected account: {forcedAccount})</p>}
      </>
    );
  }

  if (areSellersFromSellerIdsLoading) {
    return <Loading />;
  }
  const areSignaturesMandatory = !!(
    postDeliveryInfoUrl ||
    deliveryInfoHandler ||
    redemptionSubmittedHandler ||
    redemptionConfirmedHandler
  );
  const jsx = checkSignatures({
    doFetchSellersFromSellerIds,
    sellersFromSellerIds,
    parentOrigin,
    sellerIds,
    signatures,
    areSignaturesMandatory
  });
  if (jsx) {
    return jsx;
  }
  return (
    <Wrapper>
      <Formik<FormType>
        innerRef={formRef}
        validationSchema={validationSchema}
        onSubmit={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
        initialValues={
          initialDeliveryInfo ||
          mockedDeliveryAddress || {
            [FormModel.formFields.name.name]: "",
            [FormModel.formFields.streetNameAndNumber.name]: "",
            [FormModel.formFields.city.name]: "",
            [FormModel.formFields.state.name]: "",
            [FormModel.formFields.zip.name]: "",
            [FormModel.formFields.country.name]: "",
            [FormModel.formFields.email.name]: "",
            [FormModel.formFields.walletAddress.name]: "",
            [FormModel.formFields.phone.name]: ""
          }
        }
        validateOnMount
      >
        {({ errors, setFieldValue }) => {
          const isRedeemFormOK =
            !errors[FormModel.formFields.name.name] &&
            !errors[FormModel.formFields.streetNameAndNumber.name] &&
            !errors[FormModel.formFields.city.name] &&
            !errors[FormModel.formFields.state.name] &&
            !errors[FormModel.formFields.zip.name] &&
            !errors[FormModel.formFields.country.name] &&
            !errors[FormModel.formFields.email.name] &&
            !errors[FormModel.formFields.walletAddress.name] &&
            !errors[FormModel.formFields.phone.name];

          return (
            <Form>
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
                  onLicenseAgreementClick={() =>
                    setStep(ActiveStep.LICENSE_AGREEMENT)
                  }
                />
              ) : step === ActiveStep.CONTRACTUAL_AGREEMENT ? (
                <ContractualAgreement offerId={offerId} offerData={offer} />
              ) : step === ActiveStep.LICENSE_AGREEMENT ? (
                <License offerId={offer.id} offerData={offer} />
              ) : step === ActiveStep.REDEEM_FORM ? (
                <RedeemForm
                  offer={offer}
                  isValid={isRedeemFormOK}
                  onNextClick={() =>
                    setStep(ActiveStep.REDEEM_FORM_CONFIRMATION)
                  }
                  onBackClick={() =>
                    setStep(ActiveStep.EXCHANGE_POLICY_OVERVIEW)
                  }
                  setConnectedWalletAddress={() => {
                    if (address) {
                      setFieldValue(
                        FormModel.formFields.walletAddress.name,
                        address
                      );
                    }
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
                  redemptionInfoAcceptedInitial={true}
                  resumeRedemptionInitial={true}
                  onBackClick={() => setStep(ActiveStep.REDEEM_FORM)}
                  onSuccess={() => setStep(ActiveStep.REDEEM_SUCESS)}
                  hideModal={hideModal}
                />
              ) : step === ActiveStep.REDEEM_SUCESS ? (
                <RequestShipmentSuccess onSureClick={hideModal} />
              ) : (
                <p>Wrong step...something went wrong</p>
              )}
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};
