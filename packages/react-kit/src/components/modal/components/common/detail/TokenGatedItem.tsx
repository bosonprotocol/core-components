import { EvaluationMethod, TokenType } from "@bosonprotocol/common";
import { ArrowSquareUpRight, Check, X } from "phosphor-react";
import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useCoreSDKWithContext } from "../../../../../hooks/core-sdk/useCoreSdkWithContext";
import { theme } from "../../../../../theme";
import { Offer } from "../../../../../types/offer";
import { Image } from "../../../../image/Image";
import Grid from "../../../../ui/Grid";
import ThemedButton from "../../../../ui/ThemedButton";
const colors = theme.colors.light;

interface Props {
  offer: Offer;
  isConditionMet: boolean;
  style?: CSSProperties;
}

/**
 * tokenType 0 - 20
 * tokenType 1 - 721
 * tokenType 2 - 1155
 * method 1 - Threshold
 * method 2 - specific token
 */

export const TokenGatedItem = ({ offer, isConditionMet, style }: Props) => {
  const { condition } = offer;
  const coreSDK = useCoreSDKWithContext();

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
  const { tokenAddress } = condition;

  const rangeText =
    condition.minTokenId === condition.maxTokenId
      ? `ID: ${condition.minTokenId}`
      : `IDs: ${condition.minTokenId}-
  ${condition.maxTokenId}`;
  const ContractButton = (
    <a
      href={coreSDK.getTxExplorerUrl?.(tokenAddress, true)}
      target="_blank"
      rel="noreferrer"
    >
      <ThemedButton size="regular" themeVal="blankSecondary">
        Contract <ArrowSquareUpRight />
      </ThemedButton>
    </a>
  );
  const BuyButton = (
    <a
      href={coreSDK.getTxExplorerUrl?.(tokenAddress, true)}
      target="_blank"
      rel="noreferrer"
    >
      <ThemedButton size="regular" themeVal="blankSecondary">
        Buy <ArrowSquareUpRight />
      </ThemedButton>
    </a>
  );
  const ConditionUI = (
    <>
      {isConditionMet ? (
        <Check color={colors.green} size={24} />
      ) : (
        <X color={colors.red} size={24} />
      )}
    </>
  );
  const ActionButton = isConditionMet ? ContractButton : BuyButton;
  const Icon = (
    <>
      {sellerAvatar && (
        <TokenIcon>
          <Image src={sellerAvatar} />
        </TokenIcon>
      )}
    </>
  );
  return (
    <Grid
      padding="0 0"
      style={style}
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      gap="1rem"
      flex="0"
    >
      {condition.tokenType === TokenType.FungibleToken ? (
        <>
          <Grid gap="1rem" justifyContent="flex-start">
            {Icon}
            <div>{condition.threshold}x</div>
            <Grid
              flexGrow={0}
              flexShrink={0}
              gap="1rem"
              justifyContent="flex-start"
              flex={0}
              $width="auto"
            >
              <div>{tokenInfo.symbol} Tokens</div>
              {ConditionUI}
            </Grid>{" "}
          </Grid>
          {ActionButton}
        </>
      ) : condition.tokenType === TokenType.NonFungibleToken ? (
        <>
          {condition.method === EvaluationMethod.Threshold ? (
            <>
              <Grid gap="1rem" justifyContent="flex-start">
                {Icon}
                <div>{condition.threshold}x</div>{" "}
                <Grid
                  flexGrow={0}
                  flexShrink={0}
                  gap="1rem"
                  justifyContent="flex-start"
                  flex={0}
                  $width="auto"
                >
                  <div>NFTs</div> {ConditionUI}
                </Grid>{" "}
              </Grid>
              {ActionButton}
            </>
          ) : condition.method === EvaluationMethod.TokenRange ? (
            <>
              <Grid gap="1rem" justifyContent="flex-start">
                {Icon}
                <div>1x</div>{" "}
                <Grid
                  flexGrow={0}
                  flexShrink={0}
                  gap="1rem"
                  justifyContent="flex-start"
                  flex={0}
                  $width="auto"
                >
                  <Grid flexDirection="column">NFT {rangeText}</Grid>{" "}
                  {ConditionUI}{" "}
                </Grid>
              </Grid>
              {ActionButton}
            </>
          ) : (
            <></>
          )}
        </>
      ) : condition.tokenType === TokenType.MultiToken ? (
        <>
          <Grid gap="1rem" justifyContent="flex-start">
            {Icon}
            <div>{condition.threshold}x</div>{" "}
            <Grid
              flexGrow={0}
              flexShrink={0}
              gap="1rem"
              justifyContent="flex-start"
              flex={0}
              $width="auto"
            >
              <Grid flexDirection="column">NFT {rangeText}</Grid> {ConditionUI}
            </Grid>{" "}
          </Grid>
          {ActionButton}
        </>
      ) : (
        <></>
      )}
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
