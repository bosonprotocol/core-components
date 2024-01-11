import * as Sentry from "@sentry/browser";
import { Form, Formik, FormikProps } from "formik";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useDisconnect } from "wagmi";
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
import NonModal, { NonModalProps } from "../../nonModal/NonModal";
import { useConfigContext } from "../../../config/ConfigContext";
import {
  RedemptionContextProps,
  RedemptionWidgetAction,
  useRedemptionContext
} from "../../../widgets/redemption/provider/RedemptionContext";
import { BosonFooter } from "./BosonFooter";
import { theme } from "../../../../theme";
import { useAccount } from "../../../../hooks/connection/connection";
import { RedeemHeader } from "./RedeemHeader";
import { isTruthy } from "../../../../types/helpers";
import { ethers } from "ethers";
import { subgraph } from "@bosonprotocol/core-sdk";
import styled from "styled-components";

const colors = theme.colors.light;
const UlWithWordBreak = styled.ul`
  * > {
    word-break: break-word;
  }
`;
const checkSignatures = ({
  doFetchSellersFromSellerIds,
  parentOrigin,
  sellerIds,
  signatures,
  sellersFromSellerIds,
  areSignaturesMandatory
}: Pick<RedeemNonModalProps, "parentOrigin" | "sellerIds" | "signatures"> & {
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
        Something went wrong:{" "}
        <b>{error instanceof Error ? error.message : error}</b>
      </p>
    );
  }
};

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

export type RedeemNonModalProps = Pick<
  RedemptionContextProps,
  | "postDeliveryInfoUrl"
  | "deliveryInfoHandler"
  | "redemptionSubmittedHandler"
  | "redemptionConfirmedHandler"
> & {
  sellerIds?: string[];
  exchange?: Exchange;
  fairExchangePolicyRules: string;
  raiseDisputeForExchangeUrl: string;
  hideModal?: NonModalProps["hideModal"];
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
  forcedAccount?: string;
  parentOrigin?: string | null;
  signatures?: string[] | undefined | null;
  withExternalSigner: boolean | undefined | null;
};

export default function RedeemWrapper({
  hideModal,
  ...props
}: RedeemNonModalProps) {
  return (
    <NonModal
      props={{
        hideModal,
        headerComponent: RedeemHeader,
        footerComponent: <BosonFooter />,
        contentStyle: {
          background: colors.white
        },
        showConnectButton: !props.withExternalSigner
      }}
    >
      <RedeemNonModal hideModal={hideModal} {...props} />
    </NonModal>
  );
}
const getInitialStep = (
  widgetAction: RedemptionWidgetAction,
  showRedemptionOverview: boolean
) => {
  return showRedemptionOverview
    ? ActiveStep.STEPS_OVERVIEW
    : widgetAction === RedemptionWidgetAction.SELECT_EXCHANGE
    ? ActiveStep.MY_ITEMS
    : widgetAction === RedemptionWidgetAction.REDEEM_FORM
    ? ActiveStep.REDEEM_FORM
    : widgetAction === RedemptionWidgetAction.CANCEL_FORM
    ? ActiveStep.CANCELLATION_VIEW
    : widgetAction === RedemptionWidgetAction.EXCHANGE_DETAILS
    ? ActiveStep.EXCHANGE_VIEW
    : ActiveStep.REDEEM_FORM_CONFIRMATION;
};
const getPreviousSteps = (
  widgetAction: RedemptionWidgetAction,
  showRedemptionOverview: boolean
) => {
  return widgetAction === RedemptionWidgetAction.CONFIRM_REDEEM
    ? [ActiveStep.REDEEM_FORM]
    : [];
};
function RedeemNonModal({
  sellerIds,
  exchange: selectedExchange,
  fairExchangePolicyRules,
  raiseDisputeForExchangeUrl,
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
  confirmationViewOnSuccess,
  forcedAccount,
  hideModal,
  postDeliveryInfoUrl,
  deliveryInfoHandler,
  redemptionSubmittedHandler,
  redemptionConfirmedHandler,
  signatures,
  parentOrigin
}: RedeemNonModalProps) {
  const areSignaturesMandatory = !!(
    postDeliveryInfoUrl ||
    deliveryInfoHandler ||
    redemptionSubmittedHandler ||
    redemptionConfirmedHandler
  );
  const [exchange, setExchange] = useState<Exchange | null>(null);
  const doFetchSellersFromSellerIds = !!sellerIds?.length;
  const {
    sellers: sellersFromSellerIds,
    isLoading: areSellersFromSellerIdsLoading
  } = useCurrentSellers({
    sellerIds: sellerIds,
    enabled: doFetchSellersFromSellerIds
  });
  const {
    showRedemptionOverview,
    widgetAction,
    exchangeState,
    deliveryInfo: initialDeliveryInfo
  } = useRedemptionContext();
  const emailPreference =
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
  }>({
    previousStep: getPreviousSteps(widgetAction, showRedemptionOverview),
    currentStep: getInitialStep(widgetAction, showRedemptionOverview)
  });
  const {
    store: { tokens: defaultTokens }
  } = useConvertionRate();
  const { config: coreConfig } = useConfigContext();
  const defaultDisputeResolverId = coreConfig?.defaultDisputeResolverId;

  const exchangePolicyCheckResult = useCheckExchangePolicy({
    offerId: exchange?.offer?.id,
    fairExchangePolicyRules,
    defaultDisputeResolverId: defaultDisputeResolverId || "unknown",
    defaultTokens: defaultTokens || []
  });

  const setActiveStep = (newCurrentStep: ActiveStep) => {
    setStep((prev) => ({
      previousStep: [...prev.previousStep, prev.currentStep],
      currentStep: newCurrentStep
    }));
  };
  const goToPreviousStep = useCallback(() => {
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
  }, []);
  const formRef = useRef<FormikProps<FormType> | null>(null);

  useEffect(() => {
    // TODO: this should not be necessary as validateOnMount should handle that
    if (formRef.current) {
      formRef.current.validateForm();
    }
  }, [currentStep]);
  const { address } = useAccount();
  const { disconnectAsync, status } = useDisconnect();
  const disconnect = useCallback(() => {
    if (disconnectAsync && status !== "loading") {
      disconnectAsync();
    }
  }, [disconnectAsync, status]);

  useEffect(() => {
    // if the user disconnects their wallet amid redeem, cancellation, etc process, reset current flow
    if (
      !address &&
      currentStep !== getInitialStep(widgetAction, showRedemptionOverview)
    ) {
      setStep({
        previousStep: [],
        currentStep: getInitialStep(widgetAction, showRedemptionOverview)
      });
    }
  }, [address, currentStep, widgetAction, showRedemptionOverview]);

  if (
    forcedAccount &&
    address &&
    forcedAccount.toLowerCase() !== address.toLowerCase()
  ) {
    // force disconnection as the current connected wallet is not the forced one
    disconnect();
  }

  if (!address) {
    return (
      <>
        <p>Please connect your wallet</p>
        {forcedAccount && <p>(expected account: {forcedAccount})</p>}
      </>
    );
  }

  if (areSellersFromSellerIdsLoading) {
    return <Loading />;
  }
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
  const mockedDeliveryAddress = process.env.REACT_APP_DELIVERY_ADDRESS_MOCK
    ? JSON.parse(process.env.REACT_APP_DELIVERY_ADDRESS_MOCK)
    : undefined;

  const handleRaiseDispute = (exchangeId: string | undefined) => {
    const raiseDisputeForExchangeUrlWithId =
      raiseDisputeForExchangeUrl?.replace("{id}", exchangeId || "");
    if (raiseDisputeForExchangeUrlWithId) {
      window.open(raiseDisputeForExchangeUrlWithId, "_blank");
    }
  };

  return (
    <>
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
                      if (widgetAction === RedemptionWidgetAction.REDEEM_FORM) {
                        setActiveStep(ActiveStep.REDEEM_FORM);
                      } else if (
                        widgetAction === RedemptionWidgetAction.CANCEL_FORM
                      ) {
                        setActiveStep(ActiveStep.CANCELLATION_VIEW);
                      } else if (
                        widgetAction === RedemptionWidgetAction.CONFIRM_REDEEM
                      ) {
                        setActiveStep(ActiveStep.REDEEM_FORM_CONFIRMATION);
                      } else {
                        setActiveStep(ActiveStep.EXCHANGE_VIEW);
                      }
                    } else {
                      setActiveStep(ActiveStep.MY_ITEMS);
                    }
                  }}
                />
              ) : currentStep === ActiveStep.MY_ITEMS ? (
                <MyItems
                  sellerIds={sellerIds}
                  exchangeState={exchangeState}
                  onExchangeCardClick={(exchange) => {
                    setActiveStep(ActiveStep.EXCHANGE_VIEW);
                    setExchange(exchange);
                    myItemsOnExchangeCardClick?.(exchange);
                  }}
                  onRedeemClick={(exchange) => {
                    setActiveStep(ActiveStep.REDEEM_FORM);
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
                    handleRaiseDispute(exchange?.id);
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
                  exchangeId={exchange?.id || selectedExchange?.id || ""}
                  onRaiseDisputeClick={() => {
                    handleRaiseDispute(exchange?.id);
                    exchangeViewOnRaiseDisputeClick?.();
                  }}
                  fairExchangePolicyRules={fairExchangePolicyRules}
                  defaultDisputeResolverId={defaultDisputeResolverId}
                />
              ) : currentStep === ActiveStep.EXCHANGE_FULL_DESCRIPTION ? (
                <ExchangeFullDescriptionView
                  onBackClick={goToPreviousStep}
                  exchange={exchange || selectedExchange || null}
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
                  exchange={exchange || selectedExchange || null}
                  onSuccess={(...args) => {
                    if (widgetAction !== RedemptionWidgetAction.CANCEL_FORM) {
                      goToPreviousStep();
                    }

                    cancellationViewOnSuccess?.(...args);
                  }}
                />
              ) : currentStep === ActiveStep.PURCHASE_OVERVIEW ? (
                <PurchaseOverviewView onBackClick={goToPreviousStep} />
              ) : currentStep === ActiveStep.REDEEM_FORM ? (
                <RedeemFormView
                  onBackClick={goToPreviousStep}
                  exchange={exchange || selectedExchange || null}
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
                  exchange={exchange || selectedExchange || null}
                  hideModal={hideModal}
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
