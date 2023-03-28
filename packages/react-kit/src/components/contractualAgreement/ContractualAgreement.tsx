import React from "react";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useRenderTemplate } from "../../hooks/useRenderTemplate";
import { ProgressStatus } from "../../lib/progress/progressStatus";

import SimpleError from "../error/SimpleError";
import { useConfigContext } from "../config/ConfigContext";
import { subgraph } from "@bosonprotocol/core-sdk";
import Loading from "../ui/loading/Loading";

interface ContractualAgreementProps {
  offerId: string | undefined;
  offerData: subgraph.OfferFieldsFragment | undefined;
}

export default function ContractualAgreement({
  offerId,
  offerData
}: ContractualAgreementProps) {
  // TODO: get the template from the offer metadata (BP390 - https://app.asana.com/0/1200803815983047/1203080300620356)
  const { buyerSellerAgreementTemplate } = useConfigContext();
  const templateUrl = buyerSellerAgreementTemplate;
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
