import { Form, Formik, FormikProps } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";

import { ModalProps } from "../../ModalContext";
import Confirmation from "./Confirmation/Confirmation";
import { ExchangeView } from "./ExchangeView/ExchangeView";
import { MyItems } from "./MyItems/MyItems";
import RedeemForm from "./RedeemForm/RedeemForm";
import { FormModel } from "./RedeemModalFormModel";
import StepsOverview from "./StepsOverview/StepsOverview";

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
  REDEEM_SUCESS
}

export default function RedeemModal() {
  const [activeStep, setActiveStep] = useState<ActiveStep>(
    ActiveStep.STEPS_OVERVIEW
  );
  const validationSchema = validationSchemaPerStep[activeStep];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef = useRef<FormikProps<any> | null>(null);

  useEffect(() => {
    // TODO: this should not be necessary as validateOnMount should handle that
    if (formRef.current) {
      formRef.current.validateForm();
    }
  }, [activeStep]);
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
              {activeStep === ActiveStep.STEPS_OVERVIEW ? (
                <StepsOverview
                  onNextClick={() => setActiveStep(ActiveStep.MY_ITEMS)}
                />
              ) : activeStep === ActiveStep.MY_ITEMS ? (
                <MyItems
                  onBackClick={() => setActiveStep(ActiveStep.STEPS_OVERVIEW)}
                  onNextClick={() => setActiveStep(ActiveStep.EXCHANGE_VIEW)}
                  isValid={isRedeemFormOK}
                />
              ) : activeStep === ActiveStep.EXCHANGE_VIEW ? (
                <ExchangeView
                  onBackClick={() => setActiveStep(ActiveStep.MY_ITEMS)}
                  onNextClick={() => setActiveStep(ActiveStep.REDEEM_FORM)}
                  isValid={isRedeemFormOK}
                />
              ) : activeStep === ActiveStep.REDEEM_FORM ? (
                <RedeemForm
                  onBackClick={() => setActiveStep(0)}
                  onNextClick={() => setActiveStep(2)}
                  isValid={isRedeemFormOK}
                />
              ) : activeStep === ActiveStep.REDEEM_FORM_CONFIRMATION ? (
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
