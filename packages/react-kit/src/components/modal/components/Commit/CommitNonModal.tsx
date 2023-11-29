import React, { useCallback, useEffect, useState } from "react";
import { theme } from "../../../../theme";
import { useAccount } from "../../../../hooks/connection/connection";
import { useDisconnect } from "../../../../hooks/connection/useDisconnect";
import { OfferFullDescriptionView } from "./OfferFullDescriptionView/OfferFullDescriptionView";
import { ReturnUseProductByUuid } from "../../../../hooks/products/useProductByUuid";
import { Offer } from "../../../../types/offer";
import { VariantV1 } from "../../../../types/variants";
import { OfferVariantView, OfferVariantViewProps } from "./OfferVariantView";
import NonModal, { NonModalProps } from "../../nonModal/NonModal";
import Typography from "../../../ui/Typography";
import { BosonFooter } from "../common/BosonFooter";
import { useConfigContext } from "../../../config/ConfigContext";
import { PurchaseOverviewView } from "../common/StepsOverview/PurchaseOverviewView";
import { CommitOfferPolicyView } from "./OfferPolicyView/CommitOfferPolicyView";
import useCheckExchangePolicy from "../../../../hooks/useCheckExchangePolicy";
import { useConvertionRate } from "../../../widgets/finance/convertion-rate/useConvertionRate";
import { ContractualAgreementView } from "./ContractualAgreementView/ContractualAgreementView";
import { LicenseAgreementView } from "./LicenseAgreementView/LicenseAgreementView";
import { CommitSuccess } from "./CommitSuccess";
import { Exchange } from "../../../../types/exchange";
import Loading from "../../../ui/loading/Loading";

const colors = theme.colors.light;
enum ActiveStep {
  OFFER_VIEW,
  PURCHASE_OVERVIEW,
  COMMIT_SUCESS,
  EXCHANGE_POLICY,
  CONTRACTUAL_AGREEMENT,
  LICENSE_AGREEMENT,
  OFFER_FULL_DESCRIPTION
}

export type CommitNonModalProps = {
  product?: ReturnUseProductByUuid;
  singleOffer?: Offer;
  isLoading: boolean;
  fairExchangePolicyRules: string;
  hideModal?: NonModalProps["hideModal"];
  offerViewOnExchangePolicyClick?: OfferVariantViewProps["onExchangePolicyClick"];
  offerViewOnPurchaseOverview?: OfferVariantViewProps["onPurchaseOverview"];
  offerViewOnViewFullDescription?: OfferVariantViewProps["onViewFullDescription"];
  forcedAccount?: string;
};

export default function CommitWrapper({
  hideModal,
  ...props
}: CommitNonModalProps) {
  return (
    <NonModal
      hideModal={hideModal}
      headerComponent={<></>}
      footerComponent={<BosonFooter />}
      contentStyle={{
        background: colors.white
      }}
      lookAndFeel="regular"
    >
      <CommitNonModal hideModal={hideModal} {...props} />
    </NonModal>
  );
}

function CommitNonModal({
  singleOffer,
  product: productResult,
  isLoading,
  fairExchangePolicyRules,
  offerViewOnExchangePolicyClick,
  offerViewOnPurchaseOverview,
  offerViewOnViewFullDescription,
  forcedAccount,
  hideModal
}: CommitNonModalProps) {
  const variants = productResult?.variants;
  const variantsWithV1 = variants?.filter(
    ({ offer: { metadata } }) => metadata?.type === "PRODUCT_V1"
  ) as VariantV1[] | undefined;
  const singleOfferVariant = singleOffer
    ? { offer: singleOffer, variations: [] }
    : undefined;
  const defaultVariant =
    variantsWithV1?.find((variant) => !variant.offer.voided) ??
    variantsWithV1?.[0] ??
    singleOfferVariant;

  const [exchangeId, setExchangeId] = useState<Exchange["id"] | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<VariantV1 | undefined>(
    defaultVariant
  );
  useEffect(() => {
    if (defaultVariant) {
      setSelectedVariant(defaultVariant);
    }
  }, [defaultVariant]);
  const {
    store: { tokens: defaultTokens }
  } = useConvertionRate();
  const { config: coreConfig } = useConfigContext();
  const defaultDisputeResolverId = coreConfig?.defaultDisputeResolverId;

  const [{ currentStep }, setStep] = useState<{
    previousStep: ActiveStep[];
    currentStep: ActiveStep;
  }>({
    previousStep: [],
    currentStep: ActiveStep.OFFER_VIEW
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
  const { address } = useAccount();
  const disconnect = useDisconnect();
  const exchangePolicyCheckResult = useCheckExchangePolicy({
    offerId: selectedVariant?.offer?.id,
    fairExchangePolicyRules,
    defaultDisputeResolverId: defaultDisputeResolverId || "unknown",
    defaultTokens: defaultTokens || []
  });
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
    return <p>No variant has been selected</p>;
  }

  return (
    <>
      {currentStep === ActiveStep.OFFER_VIEW ? (
        <OfferVariantView
          allVariants={variantsWithV1 ?? [selectedVariant]}
          selectedVariant={selectedVariant}
          onExchangePolicyClick={() => {
            setActiveStep(ActiveStep.EXCHANGE_POLICY);
            offerViewOnExchangePolicyClick?.();
          }}
          onPurchaseOverview={() => {
            setActiveStep(ActiveStep.PURCHASE_OVERVIEW);
            offerViewOnPurchaseOverview?.();
          }}
          onViewFullDescription={() => {
            setActiveStep(ActiveStep.OFFER_FULL_DESCRIPTION);
            offerViewOnViewFullDescription?.();
          }}
          onLicenseAgreementClick={() =>
            setActiveStep(ActiveStep.LICENSE_AGREEMENT)
          }
          onCommit={(exchangeId) => {
            setActiveStep(ActiveStep.COMMIT_SUCESS);
            setExchangeId(exchangeId);
          }}
          fairExchangePolicyRules={fairExchangePolicyRules}
          defaultDisputeResolverId={defaultDisputeResolverId}
        />
      ) : currentStep === ActiveStep.OFFER_FULL_DESCRIPTION ? (
        <OfferFullDescriptionView
          onBackClick={goToPreviousStep}
          offer={selectedVariant.offer}
        />
      ) : currentStep === ActiveStep.PURCHASE_OVERVIEW ? (
        <PurchaseOverviewView onBackClick={goToPreviousStep} />
      ) : currentStep === ActiveStep.EXCHANGE_POLICY ? (
        <CommitOfferPolicyView
          offer={selectedVariant.offer}
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
          offer={selectedVariant.offer}
          onBackClick={goToPreviousStep}
        />
      ) : currentStep === ActiveStep.LICENSE_AGREEMENT ? (
        <LicenseAgreementView
          offer={selectedVariant.offer}
          onBackClick={goToPreviousStep}
        />
      ) : currentStep === ActiveStep.COMMIT_SUCESS ? (
        <CommitSuccess
          onHouseClick={() => setActiveStep(ActiveStep.OFFER_VIEW)}
          onClickDone={() => hideModal?.()}
          onExchangePolicyClick={() =>
            setActiveStep(ActiveStep.EXCHANGE_POLICY)
          }
          exchangeId={exchangeId ?? ""}
        />
      ) : (
        <p>Wrong step...something went wrong</p>
      )}
    </>
  );
}
