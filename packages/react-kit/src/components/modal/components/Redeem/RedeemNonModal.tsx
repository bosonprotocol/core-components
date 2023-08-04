import { Form, Formik, FormikProps } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAccount } from "wagmi";
import * as Yup from "yup";
import { ExchangePolicy } from "./ExchangePolicy/ExchangePolicy";
import { MyItems, MyItemsProps } from "./MyItems/MyItems";
import { FormModel } from "./RedeemFormModel";
import StepsOverview from "./StepsOverview/StepsOverview";
import { Exchange } from "../../../../types/exchange";
import { ContractualAgreementView } from "./ContractualAgreementView/ContractualAgreementView";
import { LicenseAgreementView } from "./LicenseAgreementView/LicenseAgreementView";
import {
  ConfirmationView,
  ConfirmationViewProps
} from "./Confirmation/ConfirmationView";
import RedeemFormView from "./RedeemForm/RedeemFormView";
import { PurchaseOverviewView } from "./StepsOverview/PurchaseOverviewView";

import { RedeemSuccess } from "./ExchangeView/RedeemSuccess";
import {
  ExpireVoucherView,
  ExpireVoucherViewProps
} from "./ExchangeView/expireVoucher/ExpireVoucherView";
import { ExchangeView, ExchangeViewProps } from "./ExchangeView/ExchangeView";
import {
  CancellationView,
  CancellationViewProps
} from "./ExchangeView/cancellation/CancellationView";
import { ExchangeFullDescriptionView } from "./ExchangeView/ExchangeFullDescriptionView/ExchangeFullDescriptionView";
import { useCurrentSellers } from "../../../../hooks/useCurrentSellers";
import { Loading } from "../../../Loading";
import { ContactPreference } from "./const";
import useCheckExchangePolicy from "../../../../hooks/useCheckExchangePolicy";
import { useConvertionRate } from "../../../widgets/finance/convertion-rate/useConvertionRate";
import NonModal from "../../NonModal";
import Grid from "../../../ui/Grid";
import Typography from "../../../ui/Typography";
import ConnectButton from "../../../wallet/ConnectButton";
import { BosonFooter } from "./BosonFooter";

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

export type RedeemNonModalProps = {
  exchange?: Exchange;
  fairExchangePolicyRules: string;
  defaultDisputeResolverId: string;
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
export default function RedeemNonModal({
  exchange: selectedExchange,
  fairExchangePolicyRules,
  defaultDisputeResolverId,
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
}: RedeemNonModalProps) {
  const [exchange, setExchange] = useState<Exchange | null>(null);
  const { sellers, isLoading } = useCurrentSellers();
  const seller = sellers?.[0];
  const emailPreference =
    seller?.metadata?.contactPreference === ContactPreference.XMTP_AND_EMAIL ||
    exchange?.offer?.metadata?.productV1Seller?.contactPreference ===
      ContactPreference.XMTP_AND_EMAIL;
  const validationSchema = useMemo(() => {
    return Yup.object({
      [FormModel.formFields.name.name]: Yup.string()
        .trim()
        .required(FormModel.formFields.name.requiredErrorMessage),
      [FormModel.formFields.streetNameAndNumber.name]: Yup.string()
        .trim()
        .required(
          FormModel.formFields.streetNameAndNumber.requiredErrorMessage
        ),
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
      [FormModel.formFields.email.name]: emailPreference
        ? Yup.string()
            .trim()
            .required(FormModel.formFields.email.requiredErrorMessage)
            .email(FormModel.formFields.email.mustBeEmail)
        : Yup.string().trim().email(FormModel.formFields.email.mustBeEmail),
      [FormModel.formFields.phone.name]: Yup.string()
        .trim()
        .required(FormModel.formFields.phone.requiredErrorMessage)
    });
  }, [emailPreference]);
  type FormType = Yup.InferType<typeof validationSchema>;
  const [{ currentStep }, setStep] = useState<{
    previousStep: ActiveStep[];
    currentStep: ActiveStep;
  }>({ previousStep: [], currentStep: ActiveStep.STEPS_OVERVIEW });
  const {
    store: { tokens: defaultTokens }
  } = useConvertionRate();

  const exchangePolicyCheckResult = useCheckExchangePolicy({
    offerId: exchange?.offer?.id,
    fairExchangePolicyRules,
    defaultDisputeResolverId,
    defaultTokens: defaultTokens || []
  });

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
    if (currentStep !== ActiveStep.STEPS_OVERVIEW) {
      // reinitialize the wizard step
      setStep({ previousStep: [], currentStep: ActiveStep.STEPS_OVERVIEW });
    }
    return (
      <NonModal
        props={{
          headerComponent: (
            <Grid>
              <Typography tag="h3">Redeem your item</Typography>
              <ConnectButton showChangeWallet />
            </Grid>
          ),
          footerComponent: <BosonFooter />
        }}
      >
        <p>Please connect your wallet</p>
      </NonModal>
    );
  }
  if (isLoading) {
    return (
      <NonModal
        props={{
          headerComponent: (
            <Grid>
              <Typography tag="h3">Redeem your item</Typography>
              <ConnectButton showChangeWallet />
            </Grid>
          ),
          footerComponent: <BosonFooter />
        }}
      >
        <Loading />
      </NonModal>
    );
  }
  const mockedDeliveryAddress = process.env.REACT_APP_DELIVERY_ADDRESS_MOCK
    ? JSON.parse(process.env.REACT_APP_DELIVERY_ADDRESS_MOCK)
    : undefined;
  return (
    <>
      <Formik<FormType>
        innerRef={formRef}
        validationSchema={validationSchema}
        onSubmit={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
        initialValues={
          mockedDeliveryAddress || {
            [FormModel.formFields.name.name]: "",
            [FormModel.formFields.streetNameAndNumber.name]: "",
            [FormModel.formFields.city.name]: "",
            [FormModel.formFields.state.name]: "",
            [FormModel.formFields.zip.name]: "",
            [FormModel.formFields.country.name]: "",
            [FormModel.formFields.email.name]: "",
            [FormModel.formFields.phone.name]: ""
          }
        }
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
                  onNextClick={() => {
                    if (selectedExchange) {
                      setExchange(selectedExchange);
                      setActiveStep(ActiveStep.EXCHANGE_VIEW);
                    } else {
                      setActiveStep(ActiveStep.MY_ITEMS);
                    }
                  }}
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
                  fairExchangePolicyRules={fairExchangePolicyRules}
                  defaultDisputeResolverId={defaultDisputeResolverId}
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
                  exchangePolicyCheckResult={exchangePolicyCheckResult}
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
