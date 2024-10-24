import { Form, Formik, FormikProps } from "formik";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import * as Yup from "yup";
import { Exchange } from "../../../../types/exchange";
import {
  ConfirmationView,
  ConfirmationViewProps
} from "./Confirmation/ConfirmationView";
import { ContractualAgreementView } from "./ContractualAgreementView/ContractualAgreementView";
import { LicenseAgreementView } from "./LicenseAgreementView/LicenseAgreementView";
import { MyItems, MyItemsProps } from "./MyItems/MyItems";
import { RedeemOfferPolicyView } from "./OfferPolicyView/RedeemOfferPolicyView";
import RedeemFormView from "./RedeemForm/RedeemFormView";
import { FormModel } from "./RedeemFormModel";

import { useAccount } from "../../../../hooks/connection/connection";
import { useCurrentSellers } from "../../../../hooks/useCurrentSellers";
import { theme } from "../../../../theme";
import { Loading } from "../../../ui/loading/Loading";
import { useConfigContext } from "../../../config/ConfigContext";
import { Typography } from "../../../ui/Typography";
import {
  RedemptionContextProps,
  useRedemptionContext
} from "../../../widgets/redemption/provider/RedemptionContext";
import {
  useRedemptionWidgetContext,
  RedemptionWidgetAction
} from "../../../widgets/redemption/provider/RedemptionWidgetContext";
import NonModal, { NonModalProps } from "../../nonModal/NonModal";
import { BosonLogo } from "../common/BosonLogo";
import { PurchaseOverviewView } from "../common/StepsOverview/PurchaseOverviewView";
import StepsOverview from "../common/StepsOverview/StepsOverview";
import { ExchangeFullDescriptionView } from "./ExchangeView/ExchangeFullDescriptionView/ExchangeFullDescriptionView";
import { ExchangeView, ExchangeViewProps } from "./ExchangeView/ExchangeView";
import { RedeemSuccess } from "./ExchangeView/RedeemSuccess";
import {
  CancellationView,
  CancellationViewProps
} from "./ExchangeView/cancellation/CancellationView";
import {
  ExpireVoucherView,
  ExpireVoucherViewProps
} from "./ExchangeView/expireVoucher/ExpireVoucherView";
import { ContactPreference, getRedeemFormValidationSchema } from "./const";
import {
  DetailContextProps,
  DetailViewProvider
} from "../common/detail/DetailViewProvider";
import { getHasBuyerTransferInfos } from "../../../../lib/offer/filter";
import { BuyerTransferInfo } from "../../../../lib/bundle/const";
import { useDisconnect } from "../../../../hooks/connection/useDisconnect";
import { mockedDeliveryAddress } from "../../../widgets/redemption/const";
import { checkSignatures } from "./checkSignatures";

const colors = theme.colors.light;

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
> &
  Pick<ExchangeViewProps, "onClickBuyOrSwap"> & {
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
    onExchangePolicyClick?: ExchangeViewProps["onExchangePolicyClick"];
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

export function PublicRedeemNonModal({
  hideModal,
  ...props
}: RedeemNonModalProps) {
  return (
    <NonModal
      lookAndFeel="modal"
      hideModal={hideModal}
      headerComponent={
        <Typography tag="h3" width="100%">
          Redeem your item
        </Typography>
      }
      footerComponent={<BosonLogo />}
      showConnectButton={!props.withExternalSigner}
      contentStyle={{
        background: colors.white
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
const getPreviousSteps = (widgetAction: RedemptionWidgetAction) => {
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
  onExchangePolicyClick,
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
  onClickBuyOrSwap,
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
  const { deliveryInfo: initialDeliveryInfo } = useRedemptionContext();
  const { showRedemptionOverview, widgetAction, exchangeState } =
    useRedemptionWidgetContext();

  const emailPreference =
    exchange?.seller.metadata?.contactPreference ===
    ContactPreference.XMTP_AND_EMAIL;
  const requestBuyerAddress = exchange?.offer
    ? getHasBuyerTransferInfos(exchange.offer, [
        BuyerTransferInfo.walletAddress
      ])
    : false;
  const validationSchema = useMemo(() => {
    return getRedeemFormValidationSchema({
      emailPreference,
      requestBuyerAddress
    });
  }, [emailPreference, requestBuyerAddress]);
  type FormType = Yup.InferType<typeof validationSchema>;
  const [{ currentStep }, setStep] = useState<{
    previousStep: ActiveStep[];
    currentStep: ActiveStep;
  }>({
    previousStep: getPreviousSteps(widgetAction),
    currentStep: getInitialStep(widgetAction, showRedemptionOverview)
  });

  const { config: coreConfig } = useConfigContext();
  const defaultDisputeResolverId = coreConfig?.defaultDisputeResolverId;

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
  const disconnect = useDisconnect();

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
  const providerPropsRef = useRef<DetailContextProps>();
  const [loadingViewFullDescription, setLoadingViewFullDescription] = useState(
    !providerPropsRef.current
  );
  const onGetDetailViewProviderProps = useCallback(
    (providerProps: DetailContextProps) => {
      if (!providerPropsRef.current && providerProps) {
        setLoadingViewFullDescription(false);
      }
      providerPropsRef.current = providerProps;
    },
    []
  );
  if (
    forcedAccount &&
    address &&
    forcedAccount.toLowerCase() !== address.toLowerCase()
  ) {
    // force disconnection as the current connected wallet is not the forced one
    disconnect({ isUserDisconnecting: false });
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

  const handleRaiseDispute = (exchangeId: string | undefined) => {
    const raiseDisputeForExchangeUrlWithId =
      raiseDisputeForExchangeUrl?.replace("{id}", exchangeId || "");
    if (raiseDisputeForExchangeUrlWithId) {
      window.open(raiseDisputeForExchangeUrlWithId, "_blank");
    }
  };
  const onContractualAgreementClick = () => {
    setActiveStep(ActiveStep.CONTRACTUAL_AGREEMENT);
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
                  onExchangePolicyClick={(...args) => {
                    setActiveStep(ActiveStep.EXCHANGE_POLICY);
                    onExchangePolicyClick?.(...args);
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
                  loadingViewFullDescription={loadingViewFullDescription}
                  onGetDetailViewProviderProps={onGetDetailViewProviderProps}
                  onContractualAgreementClick={onContractualAgreementClick}
                  onClickBuyOrSwap={onClickBuyOrSwap}
                />
              ) : currentStep === ActiveStep.EXCHANGE_FULL_DESCRIPTION &&
                providerPropsRef.current ? (
                <DetailViewProvider {...providerPropsRef.current}>
                  <ExchangeFullDescriptionView
                    onBackClick={goToPreviousStep}
                    exchange={exchange || selectedExchange || null}
                    onExchangePolicyClick={(...args) => {
                      setActiveStep(ActiveStep.EXCHANGE_POLICY);
                      onExchangePolicyClick?.(...args);
                    }}
                  />
                </DetailViewProvider>
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
                  setConnectedWalletAddress={() => {
                    if (address) {
                      setFieldValue(
                        FormModel.formFields.walletAddress.name,
                        address
                      );
                    }
                  }}
                />
              ) : currentStep === ActiveStep.EXCHANGE_POLICY ? (
                <RedeemOfferPolicyView
                  offer={exchange?.offer}
                  onBackClick={goToPreviousStep}
                  onContractualAgreementClick={onContractualAgreementClick}
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
                  offer={exchange?.offer}
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
