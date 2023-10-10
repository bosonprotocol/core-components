import React from "react";
import { subgraph } from "@bosonprotocol/core-sdk";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import SimpleError from "../error/SimpleError";
import Loading from "../ui/loading/Loading";
import { useRenderTemplate } from "../../hooks/useRenderTemplate";
import { ProgressStatus } from "../../lib/progress/progressStatus";
import { useConfigContext } from "../config/ConfigContext";

interface Props {
  offerId: string | undefined;
  offerData: subgraph.OfferFieldsFragment | undefined;
}

export default function License({ offerId, offerData }: Props) {
  const { licenseTemplate } = useConfigContext();
  const templateUrl = licenseTemplate; // TODO: get the template from the offer metadata
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
