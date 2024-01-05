import React, { useCallback, useEffect, useState } from "react";
import { theme } from "../../../../theme";
import { useAccount } from "../../../../hooks/connection/connection";
import { useDisconnect } from "../../../../hooks/connection/useDisconnect";
import { OfferFullDescriptionView } from "./OfferFullDescriptionView/OfferFullDescriptionView";
import { ReturnUseProductByUuid } from "../../../../hooks/products/useProductByUuid";
import { VariantV1 } from "../../../../types/variants";
import { OfferVariantView, OfferVariantViewProps } from "./OfferVariantView";
import NonModal, { NonModalProps } from "../../nonModal/NonModal";
import { BosonFooter } from "../common/BosonFooter";
import { useConfigContext } from "../../../config/ConfigContext";
import { PurchaseOverviewView } from "../common/StepsOverview/PurchaseOverviewView";
import { CommitOfferPolicyView } from "./OfferPolicyView/CommitOfferPolicyView";
import useCheckExchangePolicy from "../../../../hooks/useCheckExchangePolicy";
import { useConvertionRate } from "../../../widgets/finance/convertion-rate/useConvertionRate";
import { ContractualAgreementView } from "./ContractualAgreementView/ContractualAgreementView";
import { LicenseAgreementView } from "./LicenseAgreementView/LicenseAgreementView";
import { CommitSuccess } from "./CommitSuccess/CommitSuccess";
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
  showBosonLogo?: boolean;
  defaultSelectedOfferId?: string;
  disableVariationsSelects?: boolean;
  isLoading: boolean;
  fairExchangePolicyRules: string;
  hideModal?: NonModalProps["hideModal"];
  offerViewOnExchangePolicyClick?: OfferVariantViewProps["onExchangePolicyClick"];
  offerViewOnPurchaseOverview?: OfferVariantViewProps["onPurchaseOverview"];
  offerViewOnViewFullDescription?: OfferVariantViewProps["onViewFullDescription"];
  forcedAccount?: string;
  withExternalSigner: boolean | undefined | null;
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
      lookAndFeel="regular"
      showConnectButton={!props.withExternalSigner}
    >
      <CommitNonModal hideModal={hideModal} {...props} />
    </NonModal>
  );
}

function CommitNonModal({
  product: productResult,
  showBosonLogo,
  defaultSelectedOfferId,
  disableVariationsSelects,
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
  const {
    store: { tokens: defaultTokens }
  } = useConvertionRate();
  const { config: coreConfig } = useConfigContext();

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
      {currentStep === ActiveStep.OFFER_VIEW ? (
        <OfferVariantView
          showBosonLogo={showBosonLogo}
          allVariants={variantsWithV1 ?? [selectedVariant]}
          selectedVariant={selectedVariant}
          disableVariationsSelects={disableVariationsSelects}
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
          onCommit={(exchangeId, txHash) => {
            setActiveStep(ActiveStep.COMMIT_SUCESS);
            setExchangeInfo({ exchangeId, txHash });
          }}
          fairExchangePolicyRules={fairExchangePolicyRules}
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
          onExchangePolicyClick={() =>
            setActiveStep(ActiveStep.EXCHANGE_POLICY)
          }
          exchangeId={exchangeInfo?.exchangeId ?? ""}
          commitHash={exchangeInfo?.txHash}
        />
      ) : (
        <p>Wrong step...something went wrong</p>
      )}
    </>
  );
}
