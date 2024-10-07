import React from "react";
import { Token as TokenType } from "@bosonprotocol/common";
import { Token } from "@uniswap/sdk-core";
import { ethers } from "ethers";
import styled from "styled-components";

// TODO: remove? import { PortfolioLogo } from ../PortfolioLogo;
import PortfolioRow, {
  PortfolioSkeleton,
  PortfolioTabWrapper
} from "../PortfolioRow";
import { EmptyWalletModule } from "./EmptyWalletContent";
import { Typography } from "../../../../ui/Typography";
import { useChainId } from "../../../../../hooks/connection/connection";
import { useTokenBalances } from "../../../../../hooks/contracts/useTokenBalances";
import { EllipsisStyle } from "../../../styles";
import {
  NumberType,
  formatNumber
} from "../../../../../lib/uniswap/formatNumbers";
import { nativeOnChain } from "../../../../../lib/const/tokens";
import { PortfolioLogo } from "../../../../logo/PortfolioLogo";

export type TokensProps = {
  account: string;
  defaultTokens?: TokenType[];
};
export default function Tokens({ account, defaultTokens }: TokensProps) {
  const chainId = useChainId();
  const { data: tokenBalances, isLoading } = useTokenBalances({
    address: account,
    chainId,
    tokens: defaultTokens
  });

  if (!chainId || isLoading) {
    return <PortfolioSkeleton />;
  }

  if (!tokenBalances || tokenBalances?.length === 0) {
    // TODO: consider launching moonpay here instead of just closing the drawer
    return <EmptyWalletModule type="token" />;
  }

  return (
    <PortfolioTabWrapper>
      {tokenBalances.map(
        (tokenBalance) =>
          tokenBalance.address && (
            <TokenRow
              key={tokenBalance.address}
              {...tokenBalance}
              chainId={chainId}
            />
          )
      )}
    </PortfolioTabWrapper>
  );
}

const TokenBalanceText = styled(Typography)`
  ${EllipsisStyle}
`;
const TokenNameText = styled(Typography)`
  ${EllipsisStyle}
`;

function TokenRow({
  formattedBalance,
  symbol,
  name,
  address,
  decimals,
  chainId
}: {
  formattedBalance: string;
  symbol: string;
  name: string;
  address: string;
  decimals: string;
  chainId: number;
}) {
  const currency =
    address === ethers.constants.AddressZero
      ? nativeOnChain(chainId)
      : new Token(chainId, address, Number(decimals), symbol, name);
  return (
    <PortfolioRow
      left={
        <PortfolioLogo chainId={chainId} size="40px" currencies={[currency]} />
      }
      title={<TokenNameText>{name}</TokenNameText>}
      descriptor={
        <TokenBalanceText>
          {formatNumber(Number(formattedBalance), NumberType.TokenNonTx)}{" "}
          {symbol}
        </TokenBalanceText>
      }
    />
  );
}
