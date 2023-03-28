import { Form, Formik, FormikProps } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import * as Yup from "yup";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";
import ConnectButton from "../../../wallet/ConnectButton";

import { ExchangePolicy } from "./ExchangePolicy/ExchangePolicy";
import { ExchangeView } from "./ExchangeView/ExchangeView";
import { MyItems } from "./MyItems/MyItems";
import RedeemForm from "./RedeemForm/RedeemForm";
import { FormModel } from "./RedeemModalFormModel";
import StepsOverview from "./StepsOverview/StepsOverview";
import { ReactComponent } from "../../../../assets/logo.svg";
import { useModal } from "../../useModal";
import { Exchange } from "../../../../types/exchange";
import { ContractualAgreementView } from "./ContractualAgreementView/ContractualAgreementView";
import { LicenseAgreementView } from "./LicenseAgreementView/LicenseAgreementView";

const validationSchemaPerStep = [
  Yup.object({}),
  Yup.object({
    [FormModel.formFields.name.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.name.requiredErrorMessage),
    [FormModel.formFields.streetNameAndNumber.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.streetNameAndNumber.requiredErrorMessage),
    [FormModel.formFields.city.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.city.requiredErrorMessage),
    [FormModel.formFields.state.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.state.requiredErrorMessage),
    [FormModel.formFields.zip.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.zip.requiredErrorMessage),
    [FormModel.formFields.country.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.country.requiredErrorMessage),
    [FormModel.formFields.email.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.email.requiredErrorMessage)
      .email(FormModel.formFields.email.mustBeEmail),
    [FormModel.formFields.phone.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.phone.requiredErrorMessage)
  }),
  Yup.object({}),
  Yup.object({})
];

enum ActiveStep {
  STEPS_OVERVIEW,
  MY_ITEMS,
  EXCHANGE_VIEW,
  REDEEM_FORM,
  REDEEM_FORM_CONFIRMATION,
  REDEEM_SUCESS,
  EXCHANGE_POLICY,
  CONTRACTUAL_AGREEMENT,
  LICENSE_AGREEMENT
}

export default function RedeemModal() {
  const { showModal } = useModal();
  useEffect(() => {
    showModal("REDEEM", {
      headerComponent: (
        <Grid>
          <Typography tag="h3">Redeem your item</Typography>
          <ConnectButton />
        </Grid>
      ),
      footerComponent: (
        <Grid justifyContent="center" padding="1.5rem 0">
          <ReactComponent height="24px" />
        </Grid>
      )
    });
  }, []);
  const [exchange, setExchange] = useState<Exchange | null>(null);
  const [{ previousStep, currentStep }, setStep] = useState<{
    previousStep: ActiveStep[];
    currentStep: ActiveStep;
  }>({ previousStep: [], currentStep: ActiveStep.STEPS_OVERVIEW });
  const setActiveStep = (newCurrentStep: ActiveStep) => {
    setStep((prev) => ({
      previousStep: [...prev.previousStep, prev.currentStep],
      currentStep: newCurrentStep
    }));
  };
  const goToPreviousStep = () => {
    setStep((prev) => {
      const { previousStep } = prev;
      const currentStep = previousStep.length
        ? (previousStep.pop() as ActiveStep)
        : prev.currentStep;
      const previousWithoutLast = previousStep;
      return {
        previousStep: previousWithoutLast,
        currentStep: currentStep
      };
    });
  };
  const validationSchema = validationSchemaPerStep[currentStep];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef = useRef<FormikProps<any> | null>(null);

  useEffect(() => {
    // TODO: this should not be necessary as validateOnMount should handle that
    if (formRef.current) {
      formRef.current.validateForm();
    }
  }, [currentStep]);
  const { address } = useAccount();
  if (!address) {
    return <p>Please connect your wallet</p>;
  }
  return (
    <>
      <Formik
        innerRef={formRef}
        validationSchema={validationSchema}
        onSubmit={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
        initialValues={{
          [FormModel.formFields.name.name]: "",
          [FormModel.formFields.streetNameAndNumber.name]: "",
          [FormModel.formFields.city.name]: "",
          [FormModel.formFields.state.name]: "",
          [FormModel.formFields.zip.name]: "",
          [FormModel.formFields.country.name]: "",
          [FormModel.formFields.email.name]: "",
          [FormModel.formFields.phone.name]: ""
        }}
        validateOnMount
      >
        {(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          props: FormikProps<any>
        ) => {
          const isRedeemFormOK =
            !props.errors[FormModel.formFields.name.name] &&
            !props.errors[FormModel.formFields.streetNameAndNumber.name] &&
            !props.errors[FormModel.formFields.city.name] &&
            !props.errors[FormModel.formFields.state.name] &&
            !props.errors[FormModel.formFields.zip.name] &&
            !props.errors[FormModel.formFields.country.name] &&
            !props.errors[FormModel.formFields.email.name] &&
            !props.errors[FormModel.formFields.phone.name];
          return (
            <Form>
              {currentStep === ActiveStep.STEPS_OVERVIEW ? (
                <StepsOverview
                  onNextClick={() => setActiveStep(ActiveStep.MY_ITEMS)}
                />
              ) : currentStep === ActiveStep.MY_ITEMS ? (
                <MyItems
                  onBackClick={() => setActiveStep(ActiveStep.STEPS_OVERVIEW)}
                  onExchangeCardClick={(exchange) => {
                    setActiveStep(ActiveStep.EXCHANGE_VIEW);
                    setExchange(exchange);
                  }}
                  isValid={isRedeemFormOK}
                />
              ) : currentStep === ActiveStep.EXCHANGE_VIEW ? (
                <ExchangeView
                  onBackClick={() => setActiveStep(ActiveStep.MY_ITEMS)}
                  onNextClick={() => setActiveStep(ActiveStep.REDEEM_FORM)}
                  onExchangePolicyClick={() =>
                    setActiveStep(ActiveStep.EXCHANGE_POLICY)
                  }
                  isValid={isRedeemFormOK}
                  exchangeId={exchange?.id || ""}
                />
              ) : currentStep === ActiveStep.REDEEM_FORM ? (
                <RedeemForm
                  onBackClick={() => setActiveStep(ActiveStep.STEPS_OVERVIEW)}
                  onNextClick={() => setActiveStep(ActiveStep.EXCHANGE_VIEW)}
                  isValid={isRedeemFormOK}
                />
              ) : currentStep === ActiveStep.EXCHANGE_POLICY ? (
                <ExchangePolicy
                  exchange={exchange}
                  onBackClick={goToPreviousStep}
                  onContractualAgreementClick={() =>
                    setActiveStep(ActiveStep.CONTRACTUAL_AGREEMENT)
                  }
                  onLicenseAgreementClick={() =>
                    setActiveStep(ActiveStep.LICENSE_AGREEMENT)
                  }
                />
              ) : currentStep === ActiveStep.CONTRACTUAL_AGREEMENT ? (
                <ContractualAgreementView
                  exchange={exchange}
                  onBackClick={goToPreviousStep}
                />
              ) : currentStep === ActiveStep.LICENSE_AGREEMENT ? (
                <LicenseAgreementView
                  exchange={exchange}
                  onBackClick={goToPreviousStep}
                />
              ) : currentStep === ActiveStep.REDEEM_FORM_CONFIRMATION ? (
                // <Confirmation
                //   exchangeId={exchangeId}
                //   offerName={offerName}
                //   offerId={offerId}
                //   buyerId={buyerId}
                //   sellerId={sellerId}
                //   sellerAddress={sellerAddress}
                //   onBackClick={() => setActiveStep(1)}
                //   reload={reload}
                //   setIsLoading={setIsLoading}
                // />
                <p>confirmation</p>
              ) : (
                <p>success</p>
              )}
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
