import styled from "styled-components";
import { colors } from "../../colors";
import { metaMask } from "../../connectors/metamask";
import { ReactComponent as Close } from "./close.svg";
import { connectWallet } from "../../connectWallet";

const Root = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
`;

const ConnectButton = styled.button`
  all: unset;
  background-color: ${colors.cyberSpaceGray};
  border: solid 1px ${colors.neonGreen};
  text-align: center;
  color: white;
  padding: 0px 8px;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    filter: brightness(1.05);
  }
`;

const ConnectionSuccess = styled.button`
  all: unset;
  background-color: ${colors.cyberSpaceGray};
  border: solid 1px ${colors.neonGreen};
  color: white;
  padding: 0px 4px 0px 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;

  > svg {
    display: inline-block;
    margin-left: 4px;
  }
  cursor: pointer;
`;

interface Props {
  walletAddress?: string;
  isActive: boolean;
  chainId?: number;
}

export function WalletConnection(props: Props) {
  function truncateAddress(address: string) {
    const start = address.slice(0, 6);
    const end = address.slice(address.length - 6, address.length);

    return `${start}...${end}`;
  }

  return (
    <Root>
      {props.isActive && props.walletAddress ? (
        <ConnectionSuccess onClick={() => metaMask.deactivate()}>
          {truncateAddress(props.walletAddress as string)} <Close />
        </ConnectionSuccess>
      ) : (
        <ConnectButton onClick={() => connectWallet(props.chainId)}>
          Connect Wallet
        </ConnectButton>
      )}
    </Root>
  );
}
