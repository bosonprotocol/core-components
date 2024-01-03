import { EvaluationMethod, TokenType } from "@bosonprotocol/common";
import { CoreSDK } from "@bosonprotocol/core-sdk";
import { Check, X } from "phosphor-react";
import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { IPrice } from "../../../../../lib/price/convertPrice";
import { theme } from "../../../../../theme";
import { useConvertedPrice } from "../../../../price/useConvertedPrice";
import Grid from "../../../../ui/Grid";
import { Offer } from "../../../../../types/offer";
import { Image } from "../../../../image/Image";
const colors = theme.colors.light;

interface Props {
  offer: Offer;
  commitProxyAddress?: string;
  openseaLinkToOriginalMainnetCollection?: string;
  isConditionMet?: boolean;
  style?: CSSProperties;
  coreSDK: CoreSDK;
}

interface Condition {
  __typename?: "ConditionEntity" | undefined;
  id: string;
  method: number;
  tokenType: number;
  tokenAddress: string;
  gatingType: number;
  minTokenId: string;
  maxTokenId: string;
  threshold?: string;
  maxCommits: string;
  minBalance?: string;
}

/**
 * tokenType 0 - 20
 * tokenType 1 - 721
 * tokenType 2 - 1155
 * method 1 - Threshold
 * method 2 - specific token
 */

interface TokenInfo {
  convertedValue: IPrice;
  symbol: string;
}

const tokenTypeToErcNumber = {
  0: 20,
  1: 721,
  2: 1155
} as const;

export const TokenGatedList = ({
  offer,
  commitProxyAddress,
  openseaLinkToOriginalMainnetCollection,
  isConditionMet,
  style,
  coreSDK
}: Props) => {
  const { condition } = offer;
  const [tokenInfo, setTokenInfo] = useState({
    name: "",
    decimals: "18",
    symbol: ""
  });

  const sellerAvatar: string | undefined = useMemo(
    () =>
      (offer?.metadata?.productV1Seller?.images || []).find(
        (img) => img.tag === "profile"
      )?.url,
    [offer?.metadata?.productV1Seller?.images]
  );

  useEffect(() => {
    (async () => {
      if (condition?.tokenAddress && condition?.tokenType === 0) {
        try {
          const result = await coreSDK.getExchangeTokenInfo(
            condition.tokenAddress
          );
          const { name = "", decimals, symbol = "" } = result ?? {};
          setTokenInfo({ name, decimals: decimals?.toString() ?? "", symbol });
        } catch (error) {
          setTokenInfo({ name: "", decimals: "", symbol: "" });
        }
      }
    })();
  }, [condition, coreSDK]);

  if (!condition) {
    return null;
  }
  console.log("condition", condition);
  const { tokenAddress } = condition;
  const TokenLink = (
    <a
      href={coreSDK.getTxExplorerUrl?.(tokenAddress, true)}
      target="_blank"
      rel="noreferrer"
    >
      {tokenAddress.slice(0, 7)}...{tokenAddress.slice(tokenAddress.length - 5)}
    </a>
  );
  const rangeText =
    condition.minTokenId === condition.maxTokenId
      ? `with ID ${condition.minTokenId}`
      : `in the range ${condition.minTokenId}-
  ${condition.maxTokenId}`;
  return (
    <Grid
      padding="0 0"
      style={style}
      justifyContent="flex-start"
      alignItems="center"
      gap="1rem"
    >
      {sellerAvatar && (
        <TokenIcon>
          <Image src={sellerAvatar} />
        </TokenIcon>
      )}
      <span>
        {condition.tokenType === TokenType.FungibleToken ? (
          <>
            {condition.threshold}x {tokenInfo.symbol} Tokens
            {isConditionMet ? (
              <Check color={colors.green} />
            ) : (
              <X color={colors.red} />
            )}
          </>
        ) : condition.tokenType === TokenType.NonFungibleToken ? (
          <>
            {condition.method === EvaluationMethod.Threshold ? (
              <>
                {condition.threshold}x NFTs {TokenLink}
              </>
            ) : condition.method === EvaluationMethod.TokenRange ? (
              <>
                1x NFT {rangeText} {TokenLink}
              </>
            ) : (
              <></>
            )}
          </>
        ) : condition.tokenType === TokenType.MultiToken ? (
          <>
            {condition.threshold}x NFT {rangeText} {TokenLink}
          </>
        ) : (
          <></>
        )}
      </span>
    </Grid>
  );
};

const TokenIcon = styled.div`
  > * {
    padding-top: 0;
  }
  img {
    width: 2rem;
    padding: 0;
    border-radius: 9999px;
  }
`;
