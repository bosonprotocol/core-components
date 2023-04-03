import { Form, Formik, FormikProps } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import * as Yup from "yup";
import { ExchangePolicy } from "./ExchangePolicy/ExchangePolicy";
import { ExchangeView, ExchangeViewProps } from "./exchangeView/ExchangeView";
import { MyItems, MyItemsProps } from "./MyItems/MyItems";
import { FormModel, FormType } from "./RedeemModalFormModel";
import StepsOverview from "./StepsOverview/StepsOverview";
import { Exchange } from "../../../../types/exchange";
import { ContractualAgreementView } from "./ContractualAgreementView/ContractualAgreementView";
import { LicenseAgreementView } from "./LicenseAgreementView/LicenseAgreementView";
import {
  ConfirmationView,
  ConfirmationViewProps
} from "./Confirmation/ConfirmationView";
import { RedeemSuccess } from "./exchangeView/RedeemSuccess";
import RedeemFormView from "./RedeemForm/RedeemFormView";
import { PurchaseOverviewView } from "./StepsOverview/PurchaseOverviewView";
import { ExchangeFullDescriptionView } from "./exchangeView/ExchangeFullDescriptionView/ExchangeFullDescriptionView";
import {
  CancellationView,
  CancellationViewProps
} from "./exchangeView/cancellation/CancellationView";
import {
  ExpireVoucherView,
  ExpireVoucherViewProps
} from "./exchangeView/expireVoucher/ExpireVoucherView";

const validationSchema = Yup.object({
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
});

enum ActiveStep {
  STEPS_OVERVIEW,
  MY_ITEMS,
  EXCHANGE_VIEW,
  PURCHASE_OVERVIEW,
  REDEEM_FORM,
  REDEEM_FORM_CONFIRMATION,
  REDEEM_SUCESS,
  EXCHANGE_POLICY,
  CONTRACTUAL_AGREEMENT,
  LICENSE_AGREEMENT,
  EXCHANGE_FULL_DESCRIPTION,
  CANCELLATION_VIEW,
  EXPIRE_VOUCHER_VIEW
}

type RedeemModalProps = {
  myItemsOnExchangeCardClick?: MyItemsProps["onExchangeCardClick"];
  myItemsOnRedeemClick?: MyItemsProps["onRedeemClick"];
  myItemsOnCancelExchange?: MyItemsProps["onCancelExchange"];
  myItemsOnRaiseDisputeClick?: MyItemsProps["onRaiseDisputeClick"];
  myItemsOnAvatarClick?: MyItemsProps["onAvatarClick"];
  exchangeViewOnExchangePolicyClick?: ExchangeViewProps["onExchangePolicyClick"];
  exchangeViewOnPurchaseOverview?: ExchangeViewProps["onPurchaseOverview"];
  exchangeViewOnViewFullDescription?: ExchangeViewProps["onViewFullDescription"];
  exchangeViewOnCancelExchange?: ExchangeViewProps["onCancelExchange"];
  exchangeViewOnExpireVoucherClick?: ExchangeViewProps["onExpireVoucherClick"];
  exchangeViewOnRaiseDisputeClick?: ExchangeViewProps["onRaiseDisputeClick"];
  expireVoucherViewOnSuccess?: ExpireVoucherViewProps["onSuccess"];
  cancellationViewOnSuccess?: CancellationViewProps["onSuccess"];
  confirmationViewOnSuccess?: ConfirmationViewProps["onSuccess"];
};
export default function RedeemModal({
  myItemsOnExchangeCardClick,
  myItemsOnRedeemClick,
  myItemsOnCancelExchange,
  myItemsOnRaiseDisputeClick,
  myItemsOnAvatarClick,
  exchangeViewOnExchangePolicyClick,
  exchangeViewOnPurchaseOverview,
  exchangeViewOnViewFullDescription,
  exchangeViewOnCancelExchange,
  exchangeViewOnExpireVoucherClick,
  exchangeViewOnRaiseDisputeClick,
  expireVoucherViewOnSuccess,
  cancellationViewOnSuccess,
  confirmationViewOnSuccess
}: RedeemModalProps) {
  const [{ currentStep }, setStep] = useState<{
    previousStep: ActiveStep[];
    currentStep: ActiveStep;
  }>({ previousStep: [], currentStep: ActiveStep.STEPS_OVERVIEW });
  const [exchange, setExchange] = useState<Exchange | null>(null);

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
  const formRef = useRef<FormikProps<FormType> | null>(null);

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
      <Formik<FormType>
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
        {({ errors }) => {
          const isRedeemFormOK =
            !errors[FormModel.formFields.name.name] &&
            !errors[FormModel.formFields.streetNameAndNumber.name] &&
            !errors[FormModel.formFields.city.name] &&
            !errors[FormModel.formFields.state.name] &&
            !errors[FormModel.formFields.zip.name] &&
            !errors[FormModel.formFields.country.name] &&
            !errors[FormModel.formFields.email.name] &&
            !errors[FormModel.formFields.phone.name];

          return (
            <Form>
              {currentStep === ActiveStep.STEPS_OVERVIEW ? (
                <StepsOverview
                  onNextClick={() => setActiveStep(ActiveStep.MY_ITEMS)}
                />
              ) : currentStep === ActiveStep.MY_ITEMS ? (
                <MyItems
                  onExchangeCardClick={(exchange) => {
                    setActiveStep(ActiveStep.EXCHANGE_VIEW);
                    setExchange(exchange);
                    myItemsOnExchangeCardClick?.(exchange);
                  }}
                  onRedeemClick={(exchange) => {
                    setActiveStep(ActiveStep.EXCHANGE_VIEW);
                    setExchange(exchange);
                    myItemsOnRedeemClick?.(exchange);
                  }}
                  onCancelExchange={(exchange) => {
                    setActiveStep(ActiveStep.CANCELLATION_VIEW);
                    setExchange(exchange);
                    myItemsOnCancelExchange?.(exchange);
                  }}
                  isValid={isRedeemFormOK}
                  onRaiseDisputeClick={(exchange) => {
                    setExchange(exchange);
                    myItemsOnRaiseDisputeClick?.(exchange);
                  }}
                  onAvatarClick={(exchange) => {
                    setExchange(exchange);
                    myItemsOnAvatarClick?.(exchange);
                  }}
                />
              ) : currentStep === ActiveStep.EXCHANGE_VIEW ? (
                <ExchangeView
                  onHouseClick={() => setActiveStep(ActiveStep.MY_ITEMS)}
                  onNextClick={() => setActiveStep(ActiveStep.REDEEM_FORM)}
                  onExchangePolicyClick={() => {
                    setActiveStep(ActiveStep.EXCHANGE_POLICY);
                    exchangeViewOnExchangePolicyClick?.();
                  }}
                  onPurchaseOverview={() => {
                    setActiveStep(ActiveStep.PURCHASE_OVERVIEW);
                    exchangeViewOnPurchaseOverview?.();
                  }}
                  onViewFullDescription={() => {
                    setActiveStep(ActiveStep.EXCHANGE_FULL_DESCRIPTION);
                    exchangeViewOnViewFullDescription?.();
                  }}
                  onCancelExchange={() => {
                    setActiveStep(ActiveStep.CANCELLATION_VIEW);
                    exchangeViewOnCancelExchange?.();
                  }}
                  onExpireVoucherClick={() => {
                    setActiveStep(ActiveStep.EXPIRE_VOUCHER_VIEW);
                    exchangeViewOnExpireVoucherClick?.();
                  }}
                  isValid={isRedeemFormOK}
                  exchangeId={exchange?.id || ""}
                  onRaiseDisputeClick={() => {
                    exchangeViewOnRaiseDisputeClick?.();
                  }}
                />
              ) : currentStep === ActiveStep.EXCHANGE_FULL_DESCRIPTION ? (
                <ExchangeFullDescriptionView
                  onBackClick={goToPreviousStep}
                  exchange={exchange}
                />
              ) : currentStep === ActiveStep.EXPIRE_VOUCHER_VIEW ? (
                <ExpireVoucherView
                  onBackClick={goToPreviousStep}
                  exchange={exchange}
                  onSuccess={(...args) => {
                    goToPreviousStep();
                    expireVoucherViewOnSuccess?.(...args);
                  }}
                />
              ) : currentStep === ActiveStep.CANCELLATION_VIEW ? (
                <CancellationView
                  onBackClick={goToPreviousStep}
                  exchange={exchange}
                  onSuccess={(...args) => {
                    goToPreviousStep();
                    cancellationViewOnSuccess?.(...args);
                  }}
                />
              ) : currentStep === ActiveStep.PURCHASE_OVERVIEW ? (
                <PurchaseOverviewView onBackClick={goToPreviousStep} />
              ) : currentStep === ActiveStep.REDEEM_FORM ? (
                <RedeemFormView
                  onBackClick={goToPreviousStep}
                  onNextClick={() =>
                    setActiveStep(ActiveStep.REDEEM_FORM_CONFIRMATION)
                  }
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
                <ConfirmationView
                  onBackClick={goToPreviousStep}
                  onSuccess={(...args) => {
                    setActiveStep(ActiveStep.REDEEM_SUCESS);
                    confirmationViewOnSuccess?.(...args);
                  }}
                  exchange={exchange}
                />
              ) : currentStep === ActiveStep.REDEEM_SUCESS ? (
                <RedeemSuccess
                  onHouseClick={() => setActiveStep(ActiveStep.MY_ITEMS)}
                  onClickDone={() => setActiveStep(ActiveStep.MY_ITEMS)}
                  onExchangePolicyClick={() =>
                    setActiveStep(ActiveStep.EXCHANGE_POLICY)
                  }
                  exchangeId={exchange?.id || ""}
                />
              ) : (
                <p>Wrong step...something went wrong</p>
              )}
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
