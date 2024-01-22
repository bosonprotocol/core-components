import { EvaluationMethod, TokenType } from "@bosonprotocol/common";
import { ArrowSquareUpRight, Check, X } from "phosphor-react";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import styled from "styled-components";
import { useCoreSDKWithContext } from "../../../../../hooks/core-sdk/useCoreSdkWithContext";
import { theme } from "../../../../../theme";
import { Offer } from "../../../../../types/offer";
import { Image } from "../../../../image/Image";
import { Grid } from "../../../../ui/Grid";
import ThemedButton from "../../../../ui/ThemedButton";
import { BuyOrSwapContainer } from "./BuyOrSwapContainer";
import { useDetailViewContext } from "./DetailViewProvider";
import { OnClickBuyOrSwapHandler } from "./types";
import { ethers } from "ethers";
const colors = theme.colors.light;

type Props = OnClickBuyOrSwapHandler & {
  offer: Offer;
  isConditionMet: boolean;
};

/**
 * tokenType 0 - 20
 * tokenType 1 - 721
 * tokenType 2 - 1155
 * method 1 - Threshold
 * method 2 - specific token
 */

export const TokenGatedItem = ({
  offer,
  isConditionMet,
  onClickBuyOrSwap
}: Props) => {
  const { condition } = offer;
  const coreSDK = useCoreSDKWithContext();
  const { swapParams } = useDetailViewContext();

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
  const { tokenAddress } = condition ?? {};
  const ContractButton = (
    <a
      href={coreSDK.getTxExplorerUrl?.(tokenAddress, true)}
      target="_blank"
      rel="noreferrer"
      style={{ flex: 0 }}
    >
      <ThemedButton size="regular" themeVal="blankSecondary">
        Contract <ArrowSquareUpRight size="16" />
      </ThemedButton>
    </a>
  );
  const BuyButton = !condition ? null : condition.tokenType ===
    TokenType.FungibleToken ? (
    <BuyOrSwapContainer swapParams={swapParams} style={{ flex: 0 }}>
      <ThemedButton
        size="regular"
        themeVal="blankSecondary"
        onClick={() =>
          onClickBuyOrSwap?.({
            swapParams
          })
        }
      >
        Buy <ArrowSquareUpRight size="16" />
      </ThemedButton>
    </BuyOrSwapContainer>
  ) : (
    <a
      href={coreSDK.getTxExplorerUrl?.(tokenAddress, true)}
      target="_blank"
      rel="noreferrer"
      style={{ flex: 0 }}
    >
      <ThemedButton size="regular" themeVal="blankSecondary">
        Buy <ArrowSquareUpRight size="16" />
      </ThemedButton>
    </a>
  );
  const ConditionUI = useMemo(
    () => (
      <>
        {isConditionMet ? (
          <Check color={colors.green} size={24} style={{ minWidth: "24px" }} />
        ) : (
          <X color={colors.red} size={24} style={{ minWidth: "24px" }} />
        )}
      </>
    ),
    [isConditionMet]
  );
  const ActionButton = isConditionMet ? ContractButton : BuyButton;
  const Icon = useMemo(
    () => (
      <>
        {sellerAvatar && (
          <TokenIcon>
            <Image src={sellerAvatar} />
          </TokenIcon>
        )}
      </>
    ),
    [sellerAvatar]
  );
  const Condition = useCallback(
    ({ children }: { children: ReactNode }) => {
      return (
        <>
          <Grid
            gap="1rem"
            justifyContent="flex-start"
            flexWrap="wrap"
            style={{ flex: "1 0" }}
          >
            {Icon}
            {children}
            {ConditionUI}
          </Grid>
          {ActionButton}
        </>
      );
    },
    [ActionButton, ConditionUI, Icon]
  );
  if (!condition) {
    return null;
  }

  const rangeText =
    condition.minTokenId === condition.maxTokenId
      ? `ID: ${condition.minTokenId}`
      : `IDs: ${condition.minTokenId}-${condition.maxTokenId}`;

  return (
    <Grid
      padding="0 0"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      gap="1rem"
      flex="1 0"
    >
      {condition.tokenType === TokenType.FungibleToken ? (
        <Condition>
          <div>
            {ethers.utils.formatUnits(condition.threshold, tokenInfo.decimals)}x
          </div>
          <Grid
            flexGrow={0}
            flexShrink={0}
            gap="1rem"
            justifyContent="flex-start"
            flex={0}
            width="auto"
          >
            <div>{tokenInfo.symbol} Tokens</div>
          </Grid>
        </Condition>
      ) : condition.tokenType === TokenType.NonFungibleToken ? (
        <>
          {condition.method === EvaluationMethod.Threshold ? (
            <Condition>
              <div>{condition.threshold}x</div>
              <Grid
                flexGrow={0}
                flexShrink={0}
                gap="1rem"
                justifyContent="flex-start"
                flex={0}
                width="auto"
              >
                <div>NFTs</div>
              </Grid>
            </Condition>
          ) : condition.method === EvaluationMethod.TokenRange ? (
            <Condition>
              <div>1x</div>
              <Grid
                flexGrow={0}
                flexShrink={0}
                gap="1rem"
                justifyContent="flex-start"
                flex={0}
                width="auto"
              >
                <Grid flexDirection="column">NFT {rangeText}</Grid>
              </Grid>
            </Condition>
          ) : (
            <></>
          )}
        </>
      ) : condition.tokenType === TokenType.MultiToken ? (
        <>
          <Grid gap="1rem" justifyContent="flex-start" flexWrap="wrap">
            {Icon}
            <div>{condition.threshold}x</div>
            <Grid
              flexGrow={0}
              flexShrink={0}
              gap="1rem"
              justifyContent="flex-start"
              flex={0}
              width="auto"
            >
              <Grid flexDirection="column">NFT {rangeText}</Grid>
            </Grid>
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
