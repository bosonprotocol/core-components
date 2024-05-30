import sockImg from "../../../assets/svg/socks.svg";
import styled from "styled-components";

import { flexColumnNoWrap } from "../styles";
import Identicon from ".";
import React from "react";
import { breakpoint } from "../../../lib/ui/breakpoint";
import { Connection, ConnectionType } from "../../connection/types";
import useENSAvatar from "../../../hooks/ens/useENSAvatar";
import { theme } from "../../../theme";
import { Unicon } from "../unicon";
import { useHasSocks } from "../../../hooks/uniswap/useSocksBalance";
const colors = theme.colors.light;
const IconWrapper = styled.div<{ size?: number }>`
  position: relative;
  ${flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + "px" : "32px")};
    width: ${({ size }) => (size ? size + "px" : "32px")};
  }
  ${breakpoint.m} {
    align-items: flex-end;
  }
`;

const MiniIconContainer = styled.div<{ side: "left" | "right" }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  bottom: -4px;
  ${({ side }) => `${side === "left" ? "left" : "right"}: -4px;`}
  border-radius: 50%;
  outline: 2px solid ${colors.white};
  outline-offset: -0.1px;
  background-color: ${colors.white};
  overflow: hidden;
  @supports (overflow: clip) {
    overflow: clip;
  }
`;

const MiniImg = styled.img`
  width: 16px;
  height: 16px;
`;

const Socks = () => {
  return (
    <MiniIconContainer side="left">
      <MiniImg src={sockImg} />
    </MiniIconContainer>
  );
};

const MiniWalletIcon = ({
  connection,
  side
}: {
  connection: Connection;
  side: "left" | "right";
}) => {
  const icon = connection.getIcon?.(false);
  if (!icon) {
    return null;
  }
  return (
    <MiniIconContainer side={side}>
      <MiniImg src={icon} alt={`${connection.getName()} icon`} />
    </MiniIconContainer>
  );
};

const MainWalletIcon = ({
  account,
  connection,
  size
}: {
  account: string;
  connection: Connection;
  size: number;
}) => {
  const { avatar } = useENSAvatar(account ?? undefined);

  if (!account) {
    return null;
  } else if (
    avatar ||
    (connection.type === ConnectionType.INJECTED &&
      connection.getName() === "MetaMask")
  ) {
    return <Identicon account={account} size={size} />;
  } else {
    return <Unicon address={account} size={size} />;
  }
};

export default function StatusIcon({
  account,
  connection,
  size = 16,
  showMiniIcons = true
}: {
  account: string;
  connection: Connection;
  size?: number;
  showMiniIcons?: boolean;
}) {
  const hasSocks = useHasSocks();

  return (
    <IconWrapper size={size} data-testid="StatusIconRoot">
      <MainWalletIcon account={account} connection={connection} size={size} />
      {showMiniIcons && <MiniWalletIcon connection={connection} side="right" />}
      {hasSocks && showMiniIcons && <Socks />}
    </IconWrapper>
  );
}
