import { useEffect, useState } from "react";

import { offers } from "@bosonprotocol/core-sdk";
import { useCoreSDKWithContext } from "./core-sdk/useCoreSdkWithContext";
import { fetchTextFile, getIpfsGatewayUrl } from "@bosonprotocol/utils";
import { useIpfsContext } from "../components/ipfs/IpfsContext";
import { Token } from "../components/widgets/finance/convertion-rate/ConvertionRateContext";
import { useQuery } from "react-query";

interface Props {
  offerId: string | undefined;
  fairExchangePolicyRules: string;
  defaultDisputeResolverId: string;
  defaultTokens: Token[];
}

const getRulesTemplate = async (
  fairExchangePolicyRules: string | undefined,
  ipfsGateway: string,
  defaultDisputeResolverId: string,
  defaultTokens: Token[]
) => {
  if (!fairExchangePolicyRules) {
    return undefined;
  }
  const rulesTemplateUri = getIpfsGatewayUrl(
    fairExchangePolicyRules as string,
    { gateway: ipfsGateway }
  );
  const rulesTemplateText = await fetchTextFile(rulesTemplateUri);
  const rulesTemplate = JSON.parse(
    rulesTemplateText
  ) as offers.CheckExchangePolicyRules;
  // replace DEFAULT_DISPUTE_RESOLVER_ID (environment dependent)
  const disputeResolverId_matches =
    rulesTemplate?.yupSchema?.properties?.disputeResolverId?.matches?.replace(
      "<DEFAULT_DISPUTE_RESOLVER_ID>",
      defaultDisputeResolverId
    );
  if (disputeResolverId_matches) {
    rulesTemplate.yupSchema.properties.disputeResolverId.matches =
      disputeResolverId_matches;
  }
  // replace TOKENS_LIST (environment dependent)
  const tokensList = defaultTokens.map((token) => token.address);
  const tokensList_pattern =
    rulesTemplate?.yupSchema?.properties?.exchangeToken?.properties?.address?.pattern?.replace(
      "<TOKENS_LIST>",
      tokensList.join("|")
    );
  if (
    rulesTemplate.yupSchema.properties.exchangeToken.properties &&
    tokensList_pattern
  ) {
    rulesTemplate.yupSchema.properties.exchangeToken.properties.address.pattern =
      tokensList_pattern;
  }
  return rulesTemplate;
};

export default function useCheckExchangePolicy({
  offerId,
  fairExchangePolicyRules,
  defaultDisputeResolverId,
  defaultTokens
}: Props) {
  const [result, setResult] = useState<
    offers.CheckExchangePolicyResult | undefined
  >(undefined);
  const core = useCoreSDKWithContext();
  const { ipfsGateway } = useIpfsContext();
  const { data: rulesTemplate } = useQuery(
    [
      "getRulesTemplate",
      fairExchangePolicyRules,
      ipfsGateway,
      defaultDisputeResolverId,
      defaultTokens
    ],
    () => {
      return getRulesTemplate(
        fairExchangePolicyRules,
        ipfsGateway,
        defaultDisputeResolverId,
        defaultTokens
      );
    }
  );
  useEffect(() => {
    if (!core || !offerId || !fairExchangePolicyRules || !rulesTemplate) {
      return undefined;
    }
    (async () => {
      try {
        const _result = await core.checkExchangePolicy(offerId, rulesTemplate);
        setResult(_result);
      } catch (e) {
        console.error(e);
        setResult(undefined);
      }
    })();
  }, [core, fairExchangePolicyRules, offerId, rulesTemplate]);
  return result;
}
