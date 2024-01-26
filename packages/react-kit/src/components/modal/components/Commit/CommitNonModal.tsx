import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAccount } from "../../../../hooks/connection/connection";
import { useDisconnect } from "../../../../hooks/connection/useDisconnect";
import { ReturnUseProductByUuid } from "../../../../hooks/products/useProductByUuid";
import { theme } from "../../../../theme";
import { Exchange } from "../../../../types/exchange";
import { VariantV1 } from "../../../../types/variants";
import Loading from "../../../ui/loading/Loading";
import NonModal, { NonModalProps } from "../../nonModal/NonModal";
import { BosonFooter } from "../common/BosonFooter";
import { PurchaseOverviewView } from "../common/StepsOverview/PurchaseOverviewView";
import { CommitSuccess } from "./CommitSuccess/CommitSuccess";
import { ContractualAgreementView } from "./ContractualAgreementView/ContractualAgreementView";
import { LicenseAgreementView } from "./LicenseAgreementView/LicenseAgreementView";
import { OfferFullDescriptionView } from "./OfferFullDescriptionView/OfferFullDescriptionView";
import { CommitOfferPolicyView } from "./OfferPolicyView/CommitOfferPolicyView";
import { OfferVariantView, OfferVariantViewProps } from "./OfferVariantView";
import {
  DetailContextProps,
  DetailViewProvider
} from "../common/detail/DetailViewProvider";

const colors = theme.colors.light;
enum CommitStep {
  OFFER_VIEW,
  PURCHASE_OVERVIEW,
  COMMIT_SUCESS,
  EXCHANGE_POLICY,
  CONTRACTUAL_AGREEMENT,
  LICENSE_AGREEMENT,
  OFFER_FULL_DESCRIPTION
}

export type CommitNonModalProps = Pick<
  OfferVariantViewProps,
  "onClickBuyOrSwap" | "onAlreadyOwnOfferClick"
> & {
  product?: ReturnUseProductByUuid;
  showBosonLogo?: boolean;
  defaultSelectedOfferId?: string;
  disableVariationsSelects?: boolean;
  isLoading: boolean;
  hideModal?: NonModalProps["hideModal"];
  onExchangePolicyClick?: OfferVariantViewProps["onExchangePolicyClick"];
  offerViewOnPurchaseOverview?: OfferVariantViewProps["onPurchaseOverview"];
  offerViewOnViewFullDescription?: OfferVariantViewProps["onViewFullDescription"];
  forcedAccount?: string;
  withExternalSigner: boolean | undefined | null;
  lookAndFeel: "regular" | "modal";
};

export default function CommitWrapper({
  hideModal,
  ...props
}: CommitNonModalProps) {
  return (
    <NonModal
      hideModal={hideModal}
      footerComponent={<BosonFooter />}
      contentStyle={{
        background: colors.white
      }}
      lookAndFeel={props.lookAndFeel}
      showConnectButton={!props.withExternalSigner}
    >
      <CommitNonModal {...props} />
    </NonModal>
  );
}

function CommitNonModal({
  product: productResult,
  showBosonLogo,
  defaultSelectedOfferId,
  disableVariationsSelects,
  isLoading,
  onExchangePolicyClick,
  onAlreadyOwnOfferClick,
  offerViewOnPurchaseOverview,
  offerViewOnViewFullDescription,
  onClickBuyOrSwap,
  forcedAccount
}: CommitNonModalProps) {
  const variants = productResult?.variants;
  const variantsWithV1 = variants?.filter(
    ({ offer: { metadata } }) => metadata?.type === "PRODUCT_V1"
  ) as VariantV1[] | undefined;
  const firstVariant = variantsWithV1?.[0];
  const firstNotVoidedVariant = variantsWithV1?.find(
    (variant) => !variant.offer.voided
  );
  const defaultVariant = defaultSelectedOfferId
    ? variantsWithV1?.find(
        (variant) => variant.offer.id === defaultSelectedOfferId
      ) ??
      firstNotVoidedVariant ??
      firstVariant
    : firstNotVoidedVariant ?? firstVariant;

  const [exchangeInfo, setExchangeInfo] = useState<{
    exchangeId: Exchange["id"];
    txHash: string;
  } | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<VariantV1 | undefined>(
    defaultVariant
  );
  useEffect(() => {
    if (defaultVariant) {
      setSelectedVariant(defaultVariant);
    }
  }, [defaultVariant]);

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
        ? (previousStep.pop() as CommitStep)
        : prev.currentStep;
      const previousWithoutLast = previousStep;
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
    disconnect();
  }

  if (!address && forcedAccount) {
    return (
      <>
        <p>Please connect your wallet</p>
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
          showBosonLogo={showBosonLogo}
          allVariants={variantsWithV1 ?? [selectedVariant]}
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
          disableVariationsSelects={disableVariationsSelects}
          loadingViewFullDescription={loadingViewFullDescription}
          onExchangePolicyClick={(...args) => {
            setActiveStep(CommitStep.EXCHANGE_POLICY);
            onExchangePolicyClick?.(...args);
          }}
          onPurchaseOverview={() => {
            setActiveStep(CommitStep.PURCHASE_OVERVIEW);
            offerViewOnPurchaseOverview?.();
          }}
          onViewFullDescription={() => {
            setActiveStep(CommitStep.OFFER_FULL_DESCRIPTION);
            offerViewOnViewFullDescription?.();
          }}
          onLicenseAgreementClick={() =>
            setActiveStep(CommitStep.LICENSE_AGREEMENT)
          }
          onCommit={(exchangeId, txHash) => {
            setActiveStep(CommitStep.COMMIT_SUCESS);
            setExchangeInfo({ exchangeId, txHash });
          }}
          onGetDetailViewProviderProps={onGetDetailViewProviderProps}
          onClickBuyOrSwap={onClickBuyOrSwap}
          onAlreadyOwnOfferClick={onAlreadyOwnOfferClick}
        />
      ) : currentStep === CommitStep.OFFER_FULL_DESCRIPTION &&
        providerPropsRef.current ? (
        <DetailViewProvider {...providerPropsRef.current}>
          <OfferFullDescriptionView
            onBackClick={goToPreviousStep}
            onExchangePolicyClick={(...args) => {
              setActiveStep(CommitStep.EXCHANGE_POLICY);
              onExchangePolicyClick?.(...args);
            }}
            offer={selectedVariant.offer}
            onClickBuyOrSwap={onClickBuyOrSwap}
          />
        </DetailViewProvider>
      ) : currentStep === CommitStep.PURCHASE_OVERVIEW ? (
        <PurchaseOverviewView onBackClick={goToPreviousStep} />
      ) : currentStep === CommitStep.EXCHANGE_POLICY ? (
        <CommitOfferPolicyView
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
          offer={selectedVariant.offer}
          onBackClick={goToPreviousStep}
        />
      ) : currentStep === CommitStep.LICENSE_AGREEMENT ? (
        <LicenseAgreementView
          offer={selectedVariant.offer}
          onBackClick={goToPreviousStep}
        />
      ) : currentStep === CommitStep.COMMIT_SUCESS ? (
        <CommitSuccess
          onHouseClick={() => setActiveStep(CommitStep.OFFER_VIEW)}
          exchangeId={exchangeInfo?.exchangeId ?? ""}
          commitHash={exchangeInfo?.txHash}
        />
      ) : (
        <p>Something went wrong...please try again</p>
      )}
    </>
  );
}
