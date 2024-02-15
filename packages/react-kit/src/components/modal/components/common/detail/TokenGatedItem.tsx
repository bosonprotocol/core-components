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
import { PortfolioLogo } from "../../../../logo/PortfolioLogo";
import { nativeOnChain } from "../../../../../lib/const/tokens";
import { Token } from "@uniswap/sdk-core";
import { useChainId } from "../../../../../hooks/connection/connection";
import { useErc20ExchangeTokenInfo } from "../../../../../hooks/contracts/erc20/useErc20ExchangeTokenInfo";
const colors = theme.colors.light;

type Props = OnClickBuyOrSwapHandler & {
  offer: Offer;
  isConditionMet: boolean;
};

const Wrapper = styled(Grid)`
  && {
    > * {
      flex: 1 0;
    }
  }
`;

const ActionText = ({ children }: { children: ReactNode }) => {
  return <span style={{ fontSize: "0.75rem" }}>{children}</span>;
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

  const [erc20Info, setErc20Info] = useState({
    name: "",
    decimals: "18",
    symbol: ""
  });
  const [erc721Info, setErc721Info] = useState("NFT");
  const [erc1155Info, setErc1155Info] = useState("NFT");

  const sellerAvatar: string | undefined = useMemo(
    () =>
      (offer?.metadata?.productV1Seller?.images || []).find(
        (img) => img.tag === "profile"
      )?.url,
    [offer?.metadata?.productV1Seller?.images]
  );

  useEffect(() => {
    (async () => {
      if (
        condition?.tokenAddress &&
        condition?.tokenType === TokenType.FungibleToken
      ) {
        try {
          const result = await coreSDK.getExchangeTokenInfo(
            condition.tokenAddress
          );
          const { name = "", decimals, symbol = "" } = result ?? {};
          setErc20Info({ name, decimals: decimals?.toString() ?? "", symbol });
        } catch (error) {
          setErc20Info({ name: "", decimals: "", symbol: "" });
        }
      } else if (
        condition?.tokenAddress &&
        (condition?.tokenType === TokenType.MultiToken ||
          condition?.tokenType === TokenType.NonFungibleToken)
      ) {
        if (condition?.tokenType === TokenType.NonFungibleToken) {
          try {
            const name = await coreSDK.erc721Name({
              contractAddress: condition.tokenAddress
            });

            setErc721Info(name);
          } catch (error) {
            setErc721Info("NFT");
          }
        } else if (condition?.tokenType === TokenType.MultiToken) {
          try {
            const name = await coreSDK.erc1155Name({
              contractAddress: condition.tokenAddress
            });
            setErc1155Info(name);
          } catch (error) {
            setErc1155Info("NFT");
          }
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
        <ActionText>Contract</ActionText> <ArrowSquareUpRight size="16" />
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
        <ActionText>Buy</ActionText> <ArrowSquareUpRight size="16" />
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
        <ActionText>Buy</ActionText> <ArrowSquareUpRight size="16" />
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
  const chainId = useChainId();
  if (condition)
    condition.tokenAddress = "0x9b3b0703d392321ad24338ff1f846650437a43c9";

  const { data: tokenInfo } = useErc20ExchangeTokenInfo(
    { contractAddress: condition?.tokenAddress },
    { enabled: !!condition?.tokenAddress }
  );
  const currency = useMemo(
    () =>
      !chainId || !condition || !tokenInfo
        ? null
        : condition.tokenAddress === ethers.constants.AddressZero
        ? nativeOnChain(chainId)
        : new Token(
            chainId,
            condition.tokenAddress,
            Number(tokenInfo.decimals),
            tokenInfo.symbol,
            tokenInfo.name
          ),
    [chainId, condition, tokenInfo]
  );
  console.log({ chainId, condition, tokenInfo, currency });
  const Icon = useMemo(
    () => (
      <>
        {chainId && currency && (
          <PortfolioLogo
            chainId={chainId}
            size="40px"
            currencies={[currency]}
          />
        )}
      </>
    ),
    [chainId, currency]
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

  const rangeText = (
    <span
      style={{
        color: colors.darkGrey,
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: "18px",
        wordBreak: "break-all"
      }}
    >
      {condition.minTokenId === condition.maxTokenId
        ? `ID: ${condition.minTokenId}`
        : `IDs: ${condition.minTokenId}-${condition.maxTokenId}`}
    </span>
  );

  return (
    <Wrapper
      padding="0 0"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      gap="1rem"
    >
      {condition.tokenType === TokenType.FungibleToken ? (
        <Condition>
          {condition.threshold && erc20Info?.decimals && (
            <div>
              {ethers.utils.formatUnits(
                condition.threshold,
                erc20Info.decimals
              )}
              x
            </div>
          )}
          <Grid
            flexGrow={0}
            flexShrink={0}
            gap="1rem"
            justifyContent="flex-start"
            flex={0}
            width="auto"
          >
            <div>{erc20Info.symbol}</div>
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
                <div>{erc721Info}</div>
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
                <Grid flexDirection="column" alignItems="flex-start">
                  {erc721Info} {rangeText}
                </Grid>
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
              <Grid flexDirection="column" alignItems="flex-start">
                {erc1155Info} {rangeText}
              </Grid>
            </Grid>
          </Grid>
          {ActionButton}
        </>
      ) : (
        <></>
      )}
    </Wrapper>
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
