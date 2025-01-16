import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAccount } from "../../../../hooks/connection/connection";
import { useDisconnect } from "../../../../hooks/connection/useDisconnect";
import { getCssVar } from "../../../../theme";
import { VariantV1 } from "../../../../types/variants";
import Loading from "../../../ui/loading/LoadingWrapper";
import NonModal, { NonModalProps } from "../../nonModal/NonModal";
import { BosonLogo } from "../common/BosonLogo";
import {
  DetailContextProps,
  DetailViewProvider
} from "../common/detail/DetailViewProvider";
import { ContractualAgreementView } from "./ContractualAgreementView/ContractualAgreementView";
import { LicenseAgreementView } from "./LicenseAgreementView/LicenseAgreementView";
import { OfferFullDescriptionView } from "./OfferFullDescriptionView/OfferFullDescriptionView";
import { CommitOfferPolicyView } from "./OfferPolicyView/CommitOfferPolicyView";
import { OfferVariantView, OfferVariantViewProps } from "./OfferVariantView";

enum CommitStep {
  OFFER_VIEW,
  PURCHASE_OVERVIEW,
  EXCHANGE_POLICY,
  CONTRACTUAL_AGREEMENT,
  LICENSE_AGREEMENT,
  OFFER_FULL_DESCRIPTION
}

export type CommitNonModalProps = Pick<
  OfferVariantViewProps,
  | "onClickBuyOrSwap"
  | "onAlreadyOwnOfferClick"
  | "exchange"
  | "requestShipmentProps"
> & {
  variants?: VariantV1[];
  showBosonLogo?: boolean;
  showBosonLogoInHeader?: boolean;
  defaultSelectedOfferId?: string;
  disableVariationsSelects?: boolean;
  isLoading: boolean;
  hideModal?: NonModalProps["hideModal"];
  onExchangePolicyClick?: OfferVariantViewProps["onExchangePolicyClick"];
  offerViewOnViewFullDescription?: OfferVariantViewProps["onViewFullDescription"];
  forcedAccount?: string;
  withExternalSigner?: boolean | null;
  showConnectButton?: boolean;
  lookAndFeel: "regular" | "modal";
  withLeftArrowButton?: boolean;
};

export function CommitWrapper({
  hideModal,
  showBosonLogoInHeader = true,
  ...props
}: CommitNonModalProps) {
  return (
    <NonModal
      hideModal={hideModal}
      contentStyle={{
        background: getCssVar("--background-accent-color")
      }}
      withLeftArrowButton={props.withLeftArrowButton}
      lookAndFeel={props.lookAndFeel}
      showConnectButton={
        props.withExternalSigner === undefined ||
        props.withExternalSigner === null
          ? props.showConnectButton === undefined
            ? false
            : props.showConnectButton
          : !props.withExternalSigner
      }
    >
      <CommitNonModal
        {...props}
        showBosonLogoInHeader={showBosonLogoInHeader}
      />
    </NonModal>
  );
}

function CommitNonModal({
  variants,
  showBosonLogo = false,
  showBosonLogoInHeader = true,
  defaultSelectedOfferId,
  disableVariationsSelects,
  isLoading,
  exchange,
  requestShipmentProps,
  onExchangePolicyClick,
  onAlreadyOwnOfferClick,
  offerViewOnViewFullDescription,
  onClickBuyOrSwap,
  forcedAccount
}: CommitNonModalProps) {
  const firstVariant = variants?.[0];
  const firstNotVoidedVariant = variants?.find(
    (variant) => !variant.offer.voided
  );
  const defaultVariant = defaultSelectedOfferId
    ? variants?.find(
        (variant) => variant.offer.id === defaultSelectedOfferId
      ) ??
      firstNotVoidedVariant ??
      firstVariant
    : firstNotVoidedVariant ?? firstVariant;

  const [selectedVariant, setSelectedVariant] = useState<VariantV1 | undefined>(
    defaultVariant
  );

  if (defaultVariant && defaultVariant !== selectedVariant) {
    setSelectedVariant(defaultVariant);
  }

  const [{ currentStep }, setStep] = useState<{
    previousStep: CommitStep[];
    currentStep: CommitStep;
  }>({
    previousStep: [],
    currentStep: CommitStep.OFFER_VIEW
  });

  const setActiveStep = (newCurrentStep: CommitStep) => {
    setStep((prev) => ({
      previousStep: [...prev.previousStep, prev.currentStep],
      currentStep: newCurrentStep
    }));
  };
  const goToPreviousStep = useCallback(() => {
    setStep((prev) => {
      const { previousStep } = prev;
      const currentStep = previousStep.length
        ? (previousStep[previousStep.length - 1] as CommitStep)
        : prev.currentStep;
      const previousWithoutLast = previousStep.slice(0, -1);
      return {
        previousStep: previousWithoutLast,
        currentStep: currentStep
      };
    });
  }, []);
  const { address } = useAccount();
  const disconnect = useDisconnect();
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

  if (!address && forcedAccount) {
    return (
      <>
        <p>Please connect your account</p>
        {forcedAccount && <p>(expected account: {forcedAccount})</p>}
      </>
    );
  }
  if (isLoading) {
    return <Loading />;
  }

  if (!selectedVariant) {
    return <p>This product could not be loaded</p>;
  }

  return (
    <>
      {currentStep === CommitStep.OFFER_VIEW ? (
        <OfferVariantView
          requestShipmentProps={requestShipmentProps}
          exchange={exchange}
          showBosonLogoInHeader={showBosonLogoInHeader}
          showBosonLogo={showBosonLogo}
          allVariants={variants ?? [selectedVariant]}
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
          disableVariationsSelects={disableVariationsSelects}
          loadingViewFullDescription={loadingViewFullDescription}
          onExchangePolicyClick={(...args) => {
            setActiveStep(CommitStep.EXCHANGE_POLICY);
            onExchangePolicyClick?.(...args);
          }}
          onViewFullDescription={() => {
            setActiveStep(CommitStep.OFFER_FULL_DESCRIPTION);
            offerViewOnViewFullDescription?.();
          }}
          onLicenseAgreementClick={() =>
            setActiveStep(CommitStep.LICENSE_AGREEMENT)
          }
          onGetDetailViewProviderProps={onGetDetailViewProviderProps}
          onClickBuyOrSwap={onClickBuyOrSwap}
          onAlreadyOwnOfferClick={onAlreadyOwnOfferClick}
        />
      ) : currentStep === CommitStep.OFFER_FULL_DESCRIPTION &&
        providerPropsRef.current ? (
        <DetailViewProvider {...providerPropsRef.current}>
          <OfferFullDescriptionView
            showBosonLogoInHeader={showBosonLogoInHeader}
            onBackClick={goToPreviousStep}
            onExchangePolicyClick={(...args) => {
              setActiveStep(CommitStep.EXCHANGE_POLICY);
              onExchangePolicyClick?.(...args);
            }}
            offer={selectedVariant.offer}
            onClickBuyOrSwap={onClickBuyOrSwap}
          />
        </DetailViewProvider>
      ) : currentStep === CommitStep.EXCHANGE_POLICY ? (
        <CommitOfferPolicyView
          showBosonLogoInHeader={showBosonLogoInHeader}
          offer={selectedVariant.offer}
          onBackClick={goToPreviousStep}
          onContractualAgreementClick={() =>
            setActiveStep(CommitStep.CONTRACTUAL_AGREEMENT)
          }
          onLicenseAgreementClick={() =>
            setActiveStep(CommitStep.LICENSE_AGREEMENT)
          }
        />
      ) : currentStep === CommitStep.CONTRACTUAL_AGREEMENT ? (
        <ContractualAgreementView
          showBosonLogoInHeader={showBosonLogoInHeader}
          offer={selectedVariant.offer}
          onBackClick={goToPreviousStep}
        />
      ) : currentStep === CommitStep.LICENSE_AGREEMENT ? (
        <LicenseAgreementView
          showBosonLogoInHeader={showBosonLogoInHeader}
          offer={selectedVariant.offer}
          onBackClick={goToPreviousStep}
        />
      ) : (
        <p>Something went wrong...please try again</p>
      )}
    </>
  );
}
