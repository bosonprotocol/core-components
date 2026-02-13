import React from "react";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useRenderTemplate } from "../../hooks/useRenderTemplate";
import { ProgressStatus } from "../../lib/progress/progressStatus";

import { subgraph } from "@bosonprotocol/core-sdk";
import { useBosonContext } from "../boson/BosonProvider";
import { SimpleError } from "../error/SimpleError";
import Loading from "../ui/loading/LoadingWrapper";
import { isBundle } from "../..";

interface ContractualAgreementProps {
  offerId: string | undefined;
  offerData: subgraph.OfferFieldsFragment | undefined;
}

const getTemplate = (
  offer: subgraph.OfferFieldsFragment | undefined
): string | undefined => {
  const productItemMetadata =
    offer && isBundle(offer)
      ? offer.metadata.items?.find(
          (item): item is subgraph.ProductV1ItemMetadataEntity =>
            item.type === subgraph.ItemMetadataType.ITEM_PRODUCT_V1
        )
      : undefined;

  return (
    productItemMetadata?.exchangePolicy?.template ||
    (offer?.metadata as subgraph.ProductV1MetadataEntity)?.exchangePolicy
      ?.template
  );
};

export default function ContractualAgreement({
  offerId,
  offerData
}: ContractualAgreementProps) {
  const { buyerSellerAgreementTemplate } = useBosonContext();
  const template = getTemplate(offerData);
  const templateUrl =
    !template || template === "fairExchangePolicy"
      ? (buyerSellerAgreementTemplate as string)
      : template;
  const { renderStatus, renderResult } = useRenderTemplate(
    offerId,
    offerData,
    templateUrl
  );

  const isLoading =
    renderStatus === ProgressStatus.LOADING ||
    renderStatus === ProgressStatus.IDLE;
  const isError = renderStatus === ProgressStatus.ERROR;

  if (isError) {
    return <SimpleError />;
  }
  if (isLoading) {
    return <Loading />;
  }
  return (
    <ReactMarkdown
      children={renderResult}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
    ></ReactMarkdown>
  );
}
